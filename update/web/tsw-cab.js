/* TSW — logika kabinowa lektora (bez zależności, działa w przeglądarce i w Node do testów):
   SpeedHysteresisGuard — przekroczenie prędkości bez trzepotania (79/80/79 km/h nie powtarza alarmu),
   SignalDebouncer      — wskazanie semafora musi być stabilne ≥ 350 ms, zanim trafi do kolejki,
   TrainTailTracker     — wyższy limit obowiązuje dopiero, gdy koniec pociągu minie znak (+10 m zapasu),
   fastMode / fastText  — tryb ultraszybki (FAST_*, < 1,2 s) przy ETA < 2 s albo KDP,
   text(id, lang)       — tekst ze słownika kabinowego (i18n/cab-dict.js) BEZ zastępstwa innym językiem,
   meta(lvl)            — priorytet P0–P3, TTL i cooldown dla poziomu komunikatu. */
(function (root) {
  'use strict';

  /* Przekroczenie: alarm przy V ≥ Vmax + enter (3 km/h); koniec alarmu dopiero przy V ≤ Vmax − exit (2 km/h).
     critical: V ≥ Vmax + 5 km/h (osobny stan, ta sama histereza wyjścia). */
  class SpeedHysteresisGuard {
    constructor(o = {}) { this.enter = o.enter ?? 3; this.exit = o.exit ?? 2; this.critical = o.critical ?? 5; this.latched = false; this.crit = false; this.lim = null; }
    reset() { this.latched = false; this.crit = false; }
    /* zwraca: 'enter' | 'critical' | 'exit' | null */
    update(v, lim) {
      if (lim == null || !isFinite(lim) || v == null) { const was = this.latched; this.reset(); return was ? 'exit' : null; }
      if (this.lim != null && Math.round(lim) !== Math.round(this.lim)) { /* nowy limit = nowa ocena */ }
      this.lim = lim;
      if (!this.latched) {
        if (v >= lim + this.enter) { this.latched = true; if (v >= lim + this.critical) { this.crit = true; return 'critical'; } return 'enter'; }
        return null;
      }
      if (v <= lim - this.exit) { this.reset(); return 'exit'; }
      if (!this.crit && v >= lim + this.critical) { this.crit = true; return 'critical'; }
      return null;
    }
  }

  /* Wskazanie musi trwać ≥ stableMs, zanim zostanie potwierdzone. Nowy obiekt (semafor) = przyjęcie od razu, bez zdarzenia.
     update(aspekt, teraz, nowyObiekt) → { from, to } przy potwierdzonej zmianie albo null. */
  class SignalDebouncer {
    constructor(stableMs = 350) { this.stableMs = stableMs; this.confirmed = null; this.cand = null; this.since = 0; }
    update(aspect, now, newObject) {
      if (newObject || this.confirmed == null) { this.confirmed = aspect; this.cand = null; return null; }
      if (aspect === this.confirmed) { this.cand = null; return null; }
      if (aspect !== this.cand) { this.cand = aspect; this.since = now; return null; }
      if (now - this.since >= this.stableMs) { const ev = { from: this.confirmed, to: aspect }; this.confirmed = aspect; this.cand = null; return ev; }
      return null;
    }
    /* wymuszone potwierdzenie (np. hamowanie nagłe z magistrali bezpieczeństwa — bez opóźnienia) */
    force(aspect) { this.confirmed = aspect; this.cand = null; }
  }

  /* Koniec ograniczenia: czoło minęło znak przy przebiegu odo0; wyższy limit obowiązuje po przejechaniu długości pociągu + marginesu. */
  class TrainTailTracker {
    constructor(margin = 10) { this.margin = margin; this.pending = null; }
    start(fromKmh, toKmh, odo, trainLen) {
      if (this.pending) { this.pending.to = toKmh; return false; }   // kolejny wyższy limit przed końcem pociągu — cel się aktualizuje
      this.pending = { from: fromKmh, to: toKmh, odo0: odo, need: Math.max(0, trainLen) + this.margin }; return true;
    }
    cancel() { this.pending = null; }
    /* limit obowiązujący cały pociąg (niższy, dopóki ogon nie minie znaku) */
    effective(lim) { return this.pending ? Math.min(this.pending.from, lim == null ? this.pending.from : lim) : lim; }
    /* zwraca nowy limit (km/h), gdy ogon minął znak + margines; inaczej null */
    update(odo) {
      if (!this.pending || odo - this.pending.odo0 < this.pending.need) return null;
      const to = this.pending.to; this.pending = null; return to;
    }
  }

  /* Tryb ultraszybki: czas dojazdu do punktu < 2,0 s albo jazda KDP (≥ 200 km/h) z dojazdem < 4 s —
     zwykły komunikat nie zdążyłby się skończyć przed punktem. */
  const etaS = (vKmh, distM) => (vKmh > 0.5 && distM != null ? distM / (vKmh / 3.6) : Infinity);
  const fastMode = (vKmh, distM) => { const eta = etaS(vKmh, distM); return eta < 2.0 || (vKmh >= 200 && eta < 4.0); };

  const LANGS = ['pl', 'de', 'en'];
  let index = null;
  const dict = () => {
    if (index) return index;
    const d = (root && root.TSW_CAB_DICT) || null;
    index = {};
    if (d && Array.isArray(d.entries)) for (const e of d.entries) index[e.id] = e;
    return index;
  };
  /* Tekst komunikatu w danym języku albo null — nigdy tekst z innego języka. */
  const text = (id, lang) => { if (!LANGS.includes(lang)) return null; const e = dict()[id]; const t = e && e[lang]; return t && String(t).trim() ? t : null; };
  const entry = (id) => dict()[id] || null;
  /* FAST_* dla limitu: tylko wartości, które słownik ma gotowe (40 / 80 / 160) */
  const fastLimitId = (kmh) => { const id = 'FAST_LIMIT_' + Math.round(kmh); return dict()[id] ? id : null; };

  /* Metadane poziomów (macierz P0–P3): TTL i cooldown w ms — górne granice zakresów ze specyfikacji. */
  const LEVEL = { crit: { prio: 0, ttl: 2500, cooldown: 5000, interrupt: true }, warn: { prio: 1, ttl: 4500, cooldown: 10000, interrupt: false },
    info: { prio: 2, ttl: 7000, cooldown: 15000, interrupt: false }, ok: { prio: 3, ttl: 12000, cooldown: 30000, interrupt: false } };
  const meta = (lvl) => LEVEL[lvl] || LEVEL.info;
  const lvlOfPrio = (p) => ['crit', 'warn', 'info', 'ok'][p] || 'info';

  /* Poślizg kół: aktywacja po ≥ 400 ms, koniec po ≥ 1500 ms pełnej przyczepności. update(slip, now) → 'start' | 'end' | null */
  class SlipGuard {
    constructor(onMs = 400, offMs = 1500) { this.onMs = onMs; this.offMs = offMs; this.active = false; this.since = null; }
    update(slip, now) {
      if (slip === !this.active) { if (this.since == null) this.since = now; } else this.since = null;
      if (this.since != null && now - this.since >= (this.active ? this.offMs : this.onMs)) { this.active = !this.active; this.since = null; return this.active ? 'start' : 'end'; }
      return null;
    }
  }

  const api = { SpeedHysteresisGuard, SignalDebouncer, TrainTailTracker, SlipGuard, fastMode, etaS, text, entry, fastLimitId, meta, lvlOfPrio, LEVEL,
    _reset: () => { index = null; } };
  if (root) root.TswCab = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
