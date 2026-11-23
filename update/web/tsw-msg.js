/* Komunikaty dla maszynisty — wspólne dla 2. monitora (tsw-route.html) i Ekranika (tsw.html).
   Z telemetrii gry (D) wylicza listę komunikatów od najważniejszego: bezpieczeństwo → hamowanie → sygnały → stacja → trasa.
   Zdarzenia chwilowe (zmiana sygnału, odjazd, koniec ograniczenia) trzymają się kilka sekund.
   window.TswMsg() → { update(D, { station }) → { main, queue, log } } */
(function () {
  const DECEL = 0.5;            // m/s² — zwykłe hamowanie służbowe
  const fmt = (m) => (m == null ? '—' : m >= 1000 ? (m / 1000).toFixed(1).replace('.', ',') + ' km' : Math.round(m / 10) * 10 + ' m');
  const cls = (a) => { const s = String(a || '').toLowerCase();
    return /stop|danger|red|halt/.test(s) ? 0 : /caution|approach|warn|yellow|restrict|expect/.test(s) ? 1 : 2; };
  const LIM = { TemporarySpeedLimit: 'tymczasowe – roboty', SignalSpeedLimit: 'z semafora', SetAgainstJunction: 'zwrotnica ułożona przeciwnie',
    EndOfTrack: 'koniec toru', Axle: 'nacisk osi', TrackPropertySpeedLimit: 'szlakowe', TrackRuleSpeedLimit: 'szlakowe' };
  const PRI = { crit: 0, warn: 1, info: 2, ok: 3 };
  // P0 (crit) ucina bieżący komunikat od razu; niższe priorytety pozwalają dograć krótką końcówkę
  const queuePreempts = (currentLevel, nextLevel, remainingMs, local) =>
    currentLevel !== 'crit' && PRI[nextLevel] < PRI[currentLevel] &&
    (nextLevel === 'crit' || remainingMs == null || remainingMs > (local ? 4000 : 2500));

  /* ---- lektor: słownik kwestii — kilka wariantów każdej, bez powtarzania tego samego pod rząd ---- */
  const lastVar = {};
  const pick = (key, arr) => { let i = Math.floor(Math.random() * arr.length); if (arr.length > 1 && i === lastVar[key]) i = (i + 1) % arr.length; lastVar[key] = i; return arr[i]; };
  /* Wymowa nazw stacji spoza słownika (tsw-phon.js): reguły wg kraju trasy (z położenia GPS w grze).
     Słownik ma zawsze pierwszeństwo; reguły to przybliżenie dla polskiego syntezatora, nie zapis fonetyczny IPA. */
  // język komunikatów (tsw-i18n.js + i18n/*.js); bez pakietów — polski jak dotąd
  const LANG = (window.TSW_I18N && window.TSW_I18N.lang) || 'pl', I18P = (window.TSW_I18N && window.TSW_I18N.pack()) || {};
  let COUNTRY = '';
  const countryOf = (lat, lon) => (lat > 49.8 && lat < 61 && lon > -8.8 && lon < 1.9 ? 'uk'
    : lat > 45.7 && lat < 55.2 && lon > 5.8 && lon < 17.3 ? 'de' : lon < -50 && lat > 20 ? 'us' : '');
  // człony słownika dla kraju trasy: wspólne + angielskie (UK/USA) albo niemieckie (DE/AT/CH)
  const langWords = () => { const P = window.TSW_PHON || {};
    return Object.assign({}, P.words || {}, COUNTRY === 'de' ? P.wordsDe || {} : COUNTRY === 'uk' || COUNTRY === 'us' ? P.wordsEn || {} : {}); };
  const inDict = (n) => { const P = window.TSW_PHON; if (!P) return false; if (P.names && P.names[n]) return true;
    return Object.values(P.routes || {}).some((r) => r[n]); };
  const deWord = (w) => w
    // najpierw „z”/„tz” → „c” (żeby nie psuć „sz” powstałego z „sch”), potem dwuznaki
    .replace(/tz/g, 'c').replace(/z/g, 'c').replace(/^Z/, 'C').replace(/dt/g, 't')
    .replace(/^St(?=[a-zäöü])/, 'Szt').replace(/^Sp(?=[a-zäöü])/, 'Szp').replace(/sch/g, 'sz').replace(/^Sch/, 'Sz')
    .replace(/ck/g, 'k').replace(/ie/g, 'i').replace(/ei|ai|ey|ay/g, 'aj').replace(/^(?:Ei|Ai)/, 'Aj').replace(/eu|äu/g, 'oj').replace(/^Eu/, 'Oj')
    .replace(/ä|ae/g, 'e').replace(/Ä|^Ae/g, 'E').replace(/ö/g, 'e').replace(/Ö/g, 'E').replace(/ß/g, 'ss')
    .replace(/qu/g, 'kw').replace(/th/g, 't').replace(/v/g, 'f').replace(/^V/, 'F').replace(/y/g, 'i')
    .replace(/([aeiouAEIOU])h(?=[bcdfgklmnprstwz]|$)/g, '$1')               // nieme „h” po samogłosce (Bahn → Ban, Ahrensburg → Arensburg)
    .replace(/([aeiou])s(?=[aeiouü])/g, '$1z')                             // „s” między samogłoskami (Hausen → Hauzen)
    .replace(/ü/g, 'y').replace(/Ü/g, 'Y');                               // na końcu: „y” z „ü” nie przechodzi w „i” (Dyren, nie Diren)
  // końcówki (-ham, -ley, -bury …) tylko w dłuższych słowach: samo „Ham” zostaje „Ham”, nie „em”
  const enSuffix = (w) => (w.length < 6 ? w : w
    .replace(/field$/i, 'fild').replace(/cester$/i, 'ster').replace(/borough$|brough$/i, 'bra').replace(/bury$/i, 'bery').replace(/shire$/i, 'szer').replace(/mouth$/i, 'mut')
    .replace(/wich$/i, 'icz').replace(/ham$/i, 'em').replace(/ley$/i, 'li').replace(/ey$/i, 'i').replace(/by$/i, 'bi').replace(/y$/i, 'i')
  );
  const enWord = (w) => enSuffix(w)
    .replace(/^Wh/, 'Ł').replace(/^W/, 'Ł').replace(/^J/, 'Dż').replace(/^Qu/, 'Kł').replace(/^Th/, 'T').replace(/^Ch/, 'Cz').replace(/^Sh/, 'Sz')
    .replace(/dge/g, 'dż').replace(/sh/g, 'sz').replace(/tch/g, 'cz').replace(/ch/g, 'cz').replace(/th/g, 't').replace(/ph/g, 'f').replace(/ck/g, 'k')
    .replace(/ee|ea/g, 'i').replace(/oo/g, 'u').replace(/ay|ai/g, 'ej').replace(/igh/g, 'aj').replace(/ou/g, 'au').replace(/ow$/, 'ou')
    .replace(/c(?=[eiy])/g, 's').replace(/^C(?=[eiy])/, 'S').replace(/c(?![zh])/g, 'k').replace(/^C(?!z)/, 'K').replace(/x/g, 'ks').replace(/w(?=[aeiou])/g, 'ł');
  const autoName = (n) => {
    if (!n || LANG !== 'pl' || inDict(n)) return n;                         // słownik → zamieni speechText; de/en: nazwa oryginalna
    const f = COUNTRY === 'de' ? deWord : COUNTRY === 'uk' || COUNTRY === 'us' ? enWord : null;
    if (!f) return n;
    const W = langWords();   // człon ze słownika (np. „Köln”, „Junction”) zostaje dla słownika — reguła go nie przekręca
    if (COUNTRY === 'uk' || COUNTRY === 'us') n = n.replace(/\bSt\.?(?= [A-Z])/g, 'Sent').replace(/\bJct\b\.?/g, 'Dżankszyn').replace(/\bRd\b\.?/g, 'Roud').replace(/\bPkwy\b\.?/g, 'Parkłej');
    const out = n.split(/(\s+|-)/).map((w) => (/^[A-ZÄÖÜ][a-zäöüß]{2,}$/.test(w) && !W[w] ? f(w) : w)).join('');
    return COUNTRY === 'de' ? out.replace(/\s*-\s*/g, ', ').replace(/ in (?=[A-ZÄÖÜ])/g, ', ') : out;
  };
  // {s} = nazwa stacji: w tekstach lektora zawsze przez autoName (ta sama forma we wszystkich komunikatach i w przygotowaniu na serwerze)
  const fill = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => (k === 'S' ? (o.S || ((window.TSW_I18N && window.TSW_I18N.pack().stationWords) || ['Stacja'])[0])
    : o[k] != null ? (k === 's' ? voiceName4(String(o[k])) : o[k]) : ''))
    .replace(/\bdo (\d+) kilometry\b/g, 'do $1 kilometrów'); // pl: po „do” dopełniacz (do 72 kilometrów, nie „do 72 kilometry”)
  // nazwa stacji dla głosu: polski — słownik/reguły (autoName); angielski/niemiecki — oryginał z poprawkami dla głosu (TSW_PHON.voice)
  function voiceName4(n) {
    if (LANG === 'pl') return autoName(n).replace(/\s*\(([^)]+)\)\s*$/, ', $1');
    const V = ((window.TSW_PHON || {}).voice || {})[LANG] || {}; let base = n.replace(/\s*\(([^)]+)\)\s*$/, '').replace(/\s*\([^)]*\)/g, '');
    if (V[base]) return V[base];
    if (/\bHbf\b/.test(base)) return voiceName4(base.replace(/\s*\bHbf\b/, '')) + (LANG === 'de' ? ' Hauptbahnhof' : ' Central');   // „Hbf” czytane jako litery
    const EN_CITY = { 'Köln': 'Cologne', 'München': 'Munich', 'Nürnberg': 'Nuremberg', 'Wien': 'Vienna', 'Braunschweig': 'Brunswick' };   // angielskie nazwy miast
    if (LANG === 'en') { for (const [k, v] of Object.entries(EN_CITY)) base = base.replace(new RegExp('^' + k + '(?=$|[ -])'), v); base = base.replace(/\bSt\.? (?=[A-Z])/g, 'Saint ').replace(/\bJct\b\.?/g, 'Junction').replace(/\bRd\b\.?/g, 'Road').replace(/\bPkwy\b\.?/g, 'Parkway'); }
    return LANG === 'en' ? base.replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/Ü/g, 'Ue').replace(/Ö/g, 'Oe').replace(/Ä/g, 'Ae').replace(/ß/g, 'ss').replace(/-/g, ', ') : base;
  }   // „Hazelstauden (Dornbirn)” → „Hazelstauden, Dornbirn”
  const say1 = (key, arr, o) => (arr && arr.length ? fill(pick(key, arr), o || {}) : '');
  const plural = (n, one, few, many) => (n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many);
  const dW_pl = (m) => { if (m == null) return '';
    if (m >= 950) { const k = Math.round(m / 100) / 10; if (k === 1) return 'kilometr'; if (k === 1.5) return 'półtora kilometra';
      if (Number.isInteger(k)) return k + ' ' + plural(k, 'kilometr', 'kilometry', 'kilometrów'); return String(k).replace('.', ',') + ' kilometra'; }
    const r = m < 10 ? Math.max(1, Math.round(m)) : m >= 200 ? Math.round(m / 50) * 50 : Math.round(m / 10) * 10;
    return r + ' ' + plural(r, 'metr', 'metry', 'metrów'); };
  const gW_pl = (g) => g + ' ' + plural(g, 'promil', 'promile', 'promili');
  const kW_pl = (v) => Math.round(v) + ' ' + plural(Math.round(v), 'kilometr', 'kilometry', 'kilometrów') + ' na godzinę';
  const minW_pl = (n) => (n === 1 ? 'minutę' : n + ' ' + plural(n, 'minuta', 'minuty', 'minut'));
  const durW_pl = (sec) => (sec < 60 ? sec + ' ' + plural(sec, 'sekundę', 'sekundy', 'sekund') : minW(Math.round(sec / 60)));
  const U = LANG !== 'pl' && I18P.units ? I18P.units : null;
  const dW = U ? U.d : dW_pl, gW = U ? U.g : gW_pl, kW = U ? U.kmh : kW_pl, minW = U ? U.min : minW_pl, durW = U ? U.dur : durW_pl;
  const SW = (kind) => { const w = I18P.stationWords || ['Stacja', 'Przystanek']; return kind === 'halt' ? w[1] : w[0]; };   // {S} w zapowiedziach
  const brakeStep = (m) => Math.min(800, Math.max(100, Math.round(m / 100) * 100));   // punkt hamowania w głosie: co 100 m (gotowe nagrania)
  const kmW = (n) => (U ? U.km(n) : n + ' kilometrów');
  const tW = (iso) => (iso ? iso.slice(11, 16).replace(/^0/, '') : '');
  const svcW = (s) => String(s || '').split(/\s+[·:-]\s+/)[0].replace(/_[a-z]{1,2}$/, '').replace(/_/g, ' ').replace(/^([A-Za-z]{2,4})(\d)/, '$1 $2');   // ICE10_p → ICE 10
  // „prędkość” po przecinku, nie po kropce: po pauzie tor radiowy (filtr 330 Hz) zjada wybuch „P” — Whisper słyszał „Rędkość” (19.11.2026)
  // komunikaty z pakietu językowego (i18n/pl.js domyślny; de/en: ?lang=de|en) — brakujący klucz bierze polski
  // ściśle język komunikatów: bez dokładania polskich tekstów pod brakujące klucze DE/EN (brak = komunikat pominięty)
  const K = Object.assign({}, I18P.msgs || {});
  /* poziom ważności kwestii: 1 = tylko alarmy, 2 = ważne, 3 = normalnie, 4 = wszystko */
  const TIER = { hello: 4, sigStopFar: 3, sigStopMid: 2, sigStopNear: 2, sigAppr: 3, sigClear: 4, limFar: 3, limNearFast: 2, limNearOk: 3, limUpSoon: 3,
    limUpNow: 3, limUpHead: 4, limDnNow: 3, limDnOver: 1, sigGoStopped: 2, sigGoCaution: 2, sigGoMoving: 3, sigToStop: 1, sigToAppr: 2, depart: 3, departLine: 4, alerter: 1, stFar: 3, haltFar: 3,
    stNear: 3, arrive: 3, arriveLine: 3, tunnel: 4, tunnelOut: 4, gUp: 4, gDown: 4, overFirst: 1, overSmall: 1, brakeEarly: 1, brakeEarlyHard: 1, over: 1, brakeNow: 1, brakeHard: 1, brakeSoon: 2,
    brakeAppr: 2, brakeStation: 3, perm: 2, wait: 3, sigToStopStill: 3, sigToApprStill: 3, creepStop: 2, dirFwd: 3, dirBack: 2, cruiseOn: 3, cruiseOff: 3, slip: 2, speedOk: 3, atLimit: 4,
    wx_rain: 4, wx_snow: 3, wx_fog: 3, sunset: 4, sunrise: 4, km: 4, passSt: 4 };

  const TOPIC = { over: 'over', overFirst: 'over', overSmall: 'over', speedOk: 'overok', sigStopFar: 'sig', sigStopMid: 'brake', sigStopNear: 'brake', sigAppr: 'sig', sigClear: 'sig',
    sigGoStopped: 'sig', sigGoCaution: 'sig', sigGoMoving: 'sig', sigToStop: 'sig', sigToAppr: 'sig', wait: 'sig', perm: 'sig', sigToStopStill: 'sig', sigToApprStill: 'sig', creepStop: 'brake', limFar: 'limdn', limNearFast: 'brake', limNearOk: 'limdn',
    limDnNow: 'limdn', limDnOver: 'over', limUpSoon: 'limup', limUpNow: 'limup:now', limUpHead: 'limup:head', stFar: 'station', haltFar: 'station', stNear: 'station', brakeStation: 'station',
    passSt: 'station', arrive: 'stop', arriveLine: 'stop', depart: 'stop', departLine: 'stop', alerter: 'alerter', slip: 'slip', brakeNow: 'brake', brakeHard: 'brake', brakeEarly: 'brake', brakeEarlyHard: 'brake',
    brakeSoon: 'brake', brakeAppr: 'brake', atLimit: 'atlimit', tunnel: 'tunnel', tunnelOut: 'tunnel', gUp: 'grad', gDown: 'grad', status: 'status', km: 'km' };
  const GREET_KEY = 'tswGreeted';
  const greeted = (svc) => { try { const g = JSON.parse(localStorage.getItem(GREET_KEY) || '{}'); return g[svc] && Date.now() - g[svc] < 3 * 3600e3; } catch (_) { return false; } };
  const markGreeted = (svc) => { try { const g = JSON.parse(localStorage.getItem(GREET_KEY) || '{}'); g[svc] = Date.now();
    for (const k of Object.keys(g)) if (Date.now() - g[k] > 24 * 3600e3) delete g[k]; localStorage.setItem(GREET_KEY, JSON.stringify(g)); } catch (_) {} };

  window.TswMsg = function () {
    let prev = null, events = [], log = [], stopAt = 0, stopName = null, co = {}, saidAt = 0, statusAt = Date.now(), overAt = 0, stopsLen = -1, svcSeen = null;
    let svcCand = null, svcSince = 0, odo = 0, lastT = 0, tail = null, stn = null, passChk = null, last = null;
    let stopGame = null, lastGameS = null, lastGameWall = 0, lastGeo = null, lastGeoAt = 0;
    // stan dla walidatora głosu (co jest prawdą „teraz”)
    let S = { over: false, a0: 2, brakeNeed: false, dnAhead: null, limDownAt: 0 };
    const pend = [];
    /* logika kabinowa (tsw-cab.js): debouncer semafora 350 ms, histereza przekroczenia (+3 / −2 km/h), koniec pociągu + 10 m,
       poślizg ≥ 400 ms / koniec ≥ 1500 ms; teksty nowych zdarzeń ze słownika kabinowego, bez zastępstwa innym językiem */
    const CAB = window.TswCab;
    if (!CAB) throw new Error('tsw-cab.js nie został wczytany przed tsw-msg.js');
    let deb = new CAB.SignalDebouncer(350), spdG = new CAB.SpeedHysteresisGuard({ enter: 3, exit: 2, critical: 5 }),
      tailT = new CAB.TrainTailTracker(10), slipG = new CAB.SlipGuard(400, 1500);
    const cabT = (id, first) => { const t = CAB.text(id, LANG); return t ? (first ? t.split(/(?<=[!.?])\s+/)[0] : t) : null; };
    const geoDist = (a, b) => { const r = Math.PI / 180, x = Math.sin((b[0] - a[0]) * r / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin((b[1] - a[1]) * r / 2) ** 2; return 12742000 * Math.asin(Math.sqrt(x)); };
    const gameSec = (iso) => { const t = iso ? Date.parse(iso) : NaN; return isNaN(t) ? null : t / 1000; };
    // różnica czasu gry z przejściem przez północ (gdy gra zmienia tylko godzinę, a data stoi: 23:58 → 00:03 = 5 min, nie −23 h 55 min)
    const gameDiff = (a, b) => { let d = a - b; if (d < -43200) d += 86400; return d; };
    /* Pełny reset przejazdu: nic ze starej jazdy (progi odległości, stacja, oczekiwanie na koniec pociągu,
       postój, przekroczenie) nie przechodzi do nowej. Powitanie pamiętane osobno (raz na pociąg). */
    let resetFlag = false;
    function resetRide(why) {
      resetFlag = true;
      prev = null; events = []; pend.length = 0; stopAt = 0; stopName = null; stopGame = null; co = {}; overAt = 0; stopsLen = -1;
      odo = 0; lastT = 0; tail = null; tailT.cancel(); deb = new CAB.SignalDebouncer(350); spdG.reset(); slipG = new CAB.SlipGuard(400, 1500); stn = null; passChk = null; statusAt = Date.now(); saidAt = 0; lastGeo = null; lastGameS = null;
      S = { over: false, a0: 2, brakeNeed: false, dnAhead: null, limDownAt: 0 };
      log.unshift({ t: 'Nowy przejazd — ' + why, lvl: 'info', at: '' }); log = log.slice(0, 8);
    }
    const push = (m, ttl = 8000) => { events.push({ ...m, until: Date.now() + ttl }); if (m.speak) pend.push({ lvl: m.lvl, tier: m.tier || (m.lvl === 'crit' ? 1 : m.lvl === 'warn' ? 2 : 3), text: m.voice || m.title, topic: m.topic || null, ttl: m.ttlMs || null }); log.unshift({ t: m.title, lvl: m.lvl, at: m.clock || '' }); log = log.slice(0, 8); };

    function update(D, opt = {}) {
      const out = [], v = Math.abs(D.speed || 0), ms = v / 3.6, lim = D.limit, sig = (D.signalsAll || D.signals || []), s0 = sig[0] || D.signal || {};
      const a0 = cls(s0.aspect), clock = D.gameTime ? D.gameTime.slice(11, 16) : '';
      const lims = (D.nextLimitsAll || D.nextLimits || []).filter((l) => l.kmh != null);
      const st = opt.station || null;

      const topicOf = (key) => { const t = TOPIC[key] || key; return t === 'sig' ? 'sig:' + a0 : t; };
      const say = [], sayP = (lvl, key, o, extra = '') => say.push({ lvl, tier: TIER[key] || 3, text: say1(key, K[key], o) + extra, topic: topicOf(key) });
      const now = Date.now();
      /* ---- reset przejazdu: przerwa w danych > 60 s, skok czasu gry (> 5 min do przodu albo do tyłu),
              skok pozycji > 2 km w ciągu kilku sekund (wczytanie innej jazdy) ---- */
      const gS = gameSec(D.gameTime);
      const geo = D.geo && D.geo.latitude ? [D.geo.latitude, D.geo.longitude] : null;
      const moved = geo && lastGeo ? geoDist(lastGeo, geo) : null;
      // przerwa w danych > 60 s: reset tylko, gdy pociąg jest gdzie indziej (> 500 m) — pauza w menu gry zostawia stan (postój, stacja)
      if (lastT && now - lastT > 60000 && (moved == null || moved > 500)) resetRide('przerwa w danych');
      else if (gS != null && lastGameS != null) { const dg = gS - lastGameS, dr = (now - lastGameWall) / 1000;
        // cofnięcie > 1 min (bez przejścia przez północ) albo przeskok > 5 min do przodu; przeskok na postoju w tym samym miejscu
        // (czekanie na odjazd w rozkładzie) zostawia stan — postój liczy się dalej czasem gry
        const back = dg < -60 && dg > -23 * 3600, fwd = dg - dr > 300 && !(v < 1 && (moved == null || moved < 200));
        if (back || fwd) resetRide('skok czasu gry'); }
      if (geo) COUNTRY = countryOf(geo[0], geo[1]);
      if (geo && lastGeo && now - lastGeoAt < 10000 && geoDist(lastGeo, geo) > 2000) resetRide('zmiana miejsca');
      if (geo) { lastGeo = geo; lastGeoAt = now; }
      if (gS != null) { lastGameS = gS; lastGameWall = now; }
      const dt = lastT ? Math.min(1, (now - lastT) / 1000) : 0; lastT = now; odo += ms * dt; last = D;
      /* ---- przywitanie: raz na pociąg (pamiętane 3 h, także po odświeżeniu strony); nazwa musi być stabilna 4 s,
              chwilowy brak nazwy z gry nie resetuje stanu; nowy pociąg = reset przejazdu ---- */
      const svcNow = /^(none|null|undefined)$/i.test(String(D.service || '').trim()) ? '' : String(D.service || '').trim();
      if (svcNow && svcNow !== svcSeen) {
        if (svcNow !== svcCand) { svcCand = svcNow; svcSince = now; }
        else if (now - svcSince > 4000) {
          if (svcSeen) resetRide('zmiana pociągu');
          svcSeen = svcNow; if (!greeted(svcNow)) { markGreeted(svcNow); sayP('info', 'hello', { svc: svcW(svcNow) }); } }
      }
      /* ---- długość pociągu do logiki „koniec pociągu minął znak” (wagony × ~25 m) ---- */
      const trainLen = Math.max(40, Math.min(750, (D.formation || 0) > 0 ? D.formation * 25 : 150));

      /* ---- zdarzenia (porównanie z poprzednim odczytem) ---- */
      if (prev) {
        const sameSig = Math.abs((prev.sig0 || {}).dist - s0.dist) < 300;
        const chg = deb.update(a0, now, !sameSig);   // wskazanie stabilne ≥ 350 ms (migotanie nie trafia do kolejki)
        const pa = chg ? chg.from : a0;
        /* minięcie semafora „stój” (SPAD): poprzedni semafor stój ≤ 25 m, nie permisywny, pociąg jedzie, lista przeskoczyła na następny */
        if (!sameSig && cls((prev.sig0 || {}).aspect) === 0 && prev.sig0.dist != null && prev.sig0.dist <= 25 && !prev.perm && v >= 5 && s0.dist > prev.sig0.dist + 100) {
          const t = cabT('CRIT_SPAD_VIOLATION', true);
          if (t) push({ lvl: 'crit', icon: 'stop', title: 'Minięty semafor „STÓJ”!', sub: 'zatrzymaj pociąg', clock, speak: true, topic: 'spad', voice: t, ttlMs: 2500 }, 8000);
        }
        if (chg) {
          if (a0 === 2) push({ lvl: 'ok', icon: 'go', title: v < 1 ? 'Sygnał zezwalający — możesz ruszać' : 'Semafor zmienił się na „wolna droga”', sub: `semafor za ${fmt(s0.dist)}`, clock,
            speak: true, topic: 'sig:2', tier: v < 1 ? 2 : 3, voice: say1(v < 1 ? 'sigGoStopped' : 'sigGoMoving', K[v < 1 ? 'sigGoStopped' : 'sigGoMoving']) });
          else if (a0 === 0 && v < 3) push({ lvl: 'info', icon: 'stop', title: 'Semafor wskazuje „STÓJ”', sub: `za ${fmt(s0.dist)} — czekaj na zmianę`, clock, speak: true, topic: 'sig:0', voice: say1('sigToStopStill', K.sigToStopStill) });
          else if (a0 === 0) push({ lvl: 'crit', icon: 'stop', title: 'Semafor zmienił się na „STÓJ”', sub: `za ${fmt(s0.dist)} — hamuj`, clock, speak: true, topic: 'sig:0', voice: say1('sigToStop', K.sigToStop) });
          // na postoju „stój” → ostrzegawczy = zezwolenie na jazdę (z ograniczoną prędkością), nie osobny komunikat „sygnał ostrzegawczy”
          else if (v < 3 && pa === 0) push({ lvl: 'ok', icon: 'go', title: 'Sygnał zezwalający (ostrzegawczy) — możesz ruszać', sub: `semafor za ${fmt(s0.dist)} — następny może wskazywać „stój”`, clock, speak: true, topic: 'sig:2', tier: 2, voice: say1('sigGoCaution', K.sigGoCaution) });
          else if (v < 3) push({ lvl: 'info', icon: 'warn', title: 'Semafor: sygnał ostrzegawczy', sub: `za ${fmt(s0.dist)}`, clock, speak: true, topic: 'sig:1', voice: say1('sigToApprStill', K.sigToApprStill) });
          else push({ lvl: 'warn', icon: 'warn', title: 'Semafor zmienił się na ostrzegawczy', sub: `za ${fmt(s0.dist)} — następny może wskazywać „stój”`, clock, speak: true, topic: 'sig:1', voice: say1('sigToAppr', K.sigToAppr) });
        }
        if (prev.lim != null && lim != null && Math.round(lim) !== Math.round(prev.lim)) {
          overAt = 0; co.overSince = null; co.overEp = false;   // nowe ograniczenie = nowa ocena przekroczenia
          co.limChangeAt = now;
          if (lim > prev.lim) {
            // czoło minęło znak; przyspieszać wolno dopiero, gdy minie go koniec pociągu
            if (v < 3) tailT.cancel();   // limit podniesiony na postoju (jazda P649: 5× „czoło minęło…” przy 0 km/h) — obowiązuje od razu, bez komunikatu
            else if (tailT.start(prev.lim, lim, odo, trainLen)) sayP('info', 'limUpHead');
          } else {
            tailT.cancel(); S.limDownAt = now;   // nowe, niższe ograniczenie anuluje oczekiwanie
            co.graceUntil = now + 8000;         // 8 s na zejście do nowego limitu, zanim padnie „przekroczenie” (chyba że > +10 km/h)
            if (v > lim + 2) {   // wjazd na ograniczenie za szybko: jeden komunikat („obowiązuje … prędkość … hamować”) zamiast dwóch
              push({ lvl: 'crit', icon: 'limit', title: `Obowiązuje ${Math.round(lim)} km/h`, sub: `jedziesz ${Math.round(v)} km/h — hamuj`, clock, speak: true, topic: 'over',
                voice: say1('limDnOver', K.limDnOver, { v: kW(lim), cur: kW(v) }) }, 5000);
              co.overEp = true; overAt = co.lastOverMsg = co.speedMsgAt = now;
            } else push({ lvl: 'info', icon: 'limit', title: `Obowiązuje ${Math.round(lim)} km/h`, sub: 'wjazd na ograniczenie', clock, speak: true, topic: 'limdn', voice: say1('limDnNow', K.limDnNow, { v: kW(lim) }) }, 5000);
          }
        }
        if (prev.v < 1 && v >= 3 && stopAt) {
          const dur = Math.max(0, Math.round(stopGame != null && gS != null ? gameDiff(gS, stopGame) : (now - stopAt) / 1000));
          push({ lvl: 'info', icon: 'station', title: `Odjazd${stopName ? ' z ' + stopName : ''}${clock ? ' o ' + clock : ''}`, sub: `postój ${dur} s`, clock, speak: dur > 15, topic: 'stop',
            voice: stopName ? say1('depart', K.depart, { s: stopName, t: tW(D.gameTime), dur: durW(dur) }) : say1('departLine', K.departLine) }, 6000);
          stopAt = 0; stopGame = null;
        }
        /* staczanie: nastawnik do przodu, a pociąg jedzie wstecz (albo odwrotnie) > 0,5 km/h przez ≥ 1 s */
        const sv = D.speed || 0, back = D.direction > 0 ? sv < -0.5 : D.direction < 0 ? sv > 0.5 : false;
        co.rollSince = back ? co.rollSince || now : 0;
        if (back && now - co.rollSince >= 1000 && now - (co.rollAt || 0) > 8000) { const t = cabT('CRIT_ROLLBACK_DETECTED');
          if (t) { co.rollAt = now; push({ lvl: 'crit', icon: 'warn', title: 'Pociąg się stacza!', sub: 'zaciągnij hamulec', clock, speak: true, topic: 'roll', voice: t, ttlMs: 2500 }, 6000); } }
        /* kozioł oporowy (koniec toru) ≤ 200 m przy > 15 km/h — raz na obiekt */
        const eot = lims.find((l) => l.type === 'EndOfTrack' && l.dist != null && l.dist <= 200);
        if (eot && v > 15 && co.eotSaid !== Math.round(odo + eot.dist)) { const t = cabT('CRIT_BUFFER_END_AHEAD');
          if (t) { co.eotSaid = Math.round(odo + eot.dist); push({ lvl: 'crit', icon: 'stop', title: 'Kozioł oporowy!', sub: `za ${fmt(eot.dist)} — hamuj`, clock, speak: true, topic: 'brake', voice: t, ttlMs: 2500 }, 6000); } }
        if (D.alerter > 0 && !(prev.alerter > 0)) push({ lvl: 'crit', icon: 'alert', title: 'CZUWAK — potwierdź!', sub: 'naciśnij przycisk czuwaka', clock, speak: true, topic: 'alerter', voice: say1('alerter', K.alerter) }, 2500);
      }
      const upTo = tailT.update(odo);   // ogon minął znak + 10 m
      if (upTo != null) {
        push({ lvl: 'ok', icon: 'up', title: `Można przyspieszyć do ${Math.round(upTo)} km/h`, sub: 'koniec pociągu minął koniec ograniczenia', clock, speak: true, topic: 'limup:now',
          voice: say1('limUpNow', K.limUpNow, { v: kW(upTo) }) }, 6000);
      }
      tail = tailT.pending;
      // limit obowiązujący cały pociąg (do przekroczeń, „maksimum”, meldunków)
      const limE = tailT.effective(lim);
      // nadwyżka = różnica wartości pokazanych na ekranie (zaokrąglona prędkość − zaokrąglony limit): karta i lektor mówią to samo
      const overBy = limE != null ? Math.round(v) - Math.round(limE) : 0;
      const overBand = (x) => Math.min(50, Math.max(10, Math.floor((x - 1) / 10) * 10));   // „o ponad 30” przy +37 (nie sprzeczne z ekranem)
      if (v < 1 && !stopAt) { stopAt = now; stopGame = gS; const ss = (D.stops || []).slice(-1)[0]; stopName = ss && !ss.dep ? ss.station : null; }
      if (v >= 1 && v < 3 && stopAt && (D.stops || []).length) { const ss = D.stops.slice(-1)[0]; if (ss && ss.station) stopName = ss.station; }

      /* ---- zapowiedzi w stałych odległościach (raz na obiekt) ---- */
      const cross = (key, d, ths) => { const k = co[key]; let hit = null;
        if (k != null && d != null) for (const th of ths) if (k > th && d <= th) hit = th;
        co[key] = d; return hit; };
      if (v > 5) {
        const th = cross('sig', s0.dist, a0 === 2 ? [400] : [1500, 800, 400, 150]);
        if (co.sigObj == null || s0.dist > (co.sigObjD || 0) + 300) { co.lastSigAspect = co.sigObjAsp; co.sigObj = true; co.sigSeq = (co.sigSeq || 0) + 1; }   // nowy semafor: zapamiętaj wskazanie poprzedniego
        co.sigObjD = s0.dist; co.sigObjAsp = a0;
        if (th) { const o = { d: dW(th) };
          if (a0 === 2) { if (co.lastSigAspect !== 2 || now - (co.sigClearAt || 0) > 300000) { sayP('info', 'sigClear', o); co.sigClearAt = now; } }
          else if (a0 === 1) { if (co.apprSig !== co.sigSeq) { co.apprSig = co.sigSeq; sayP('info', 'sigAppr', o); } }
          // hamuje wystarczająco, żeby stanąć przed semaforem → bez „rozpocząć hamowanie / zatrzymać pociąg” (zostaje pierwsza zapowiedź z daleka)
          else { const needS = ms * ms / (2 * Math.max(20, th - 20)), okBrake = D.accel != null && D.accel < -Math.max(0.15, needS * 0.8);
            const fastT = th <= 150 && CAB.fastMode(v, s0.dist) ? cabT('FAST_STOP') : null;
            if (fastT && !okBrake) say.push({ lvl: 'crit', tier: 1, text: fastT, topic: 'brake', ttl: 1000 });
            else if (!(v < 20 && D.accel != null && D.accel < -0.1) && !(okBrake && th < 1500)) sayP(th >= 800 ? 'info' : 'warn', th >= 800 ? 'sigStopFar' : th >= 400 ? 'sigStopMid' : 'sigStopNear', o); } }
        const dn = (() => { let p2 = lim; for (const l of lims) { if (p2 != null && l.kmh < p2 - 0.5) return l; p2 = l.kmh; } return null; })();
        S.dnAhead = dn ? dn.kmh : null;
        const tl = dn ? cross('limdn', dn.dist, [1500, 700, 300]) : (co.limdn = null);
        if (tl) { const o = { d: dW(tl), v: kW(dn.kmh), cur: kW(v) };
          const extra = tl === 1500 || (tl === 700 && (co.limdnFirst !== dn.kmh)) ? (dn.type === 'TemporarySpeedLimit' ? pick('limTemp', K.limTemp) : dn.type === 'SignalSpeedLimit' ? K.limSig[0]
            : dn.type === 'SetAgainstJunction' ? K.limJunction[0] : dn.type === 'EndOfTrack' ? K.limEnd[0] : '') : '';
          co.limdnFirst = dn.kmh;
          const needDec = (ms * ms - (dn.kmh / 3.6) ** 2) / (2 * Math.max(1, tl)), braking = D.accel != null && D.accel < -Math.max(0.2, needDec * 0.8);
          const fastId = tl <= 300 && v > dn.kmh + 10 && !braking && CAB.fastMode(v, dn.dist) ? CAB.fastLimitId(dn.kmh) : null, fastL = fastId ? cabT(fastId) : null;
          if (fastL) say.push({ lvl: 'crit', tier: 1, text: fastL, topic: 'brake', ttl: 1200 });
          else if (tl <= 300) sayP(v > dn.kmh + 10 && !braking ? 'warn' : 'info', v > dn.kmh + 10 && !braking ? 'limNearFast' : 'limNearOk', o);
          else if (!(v >= 120 && co.earlyVt === dn.kmh)) sayP('info', 'limFar', o, extra); }   // po wczesnym „hamować” bez powtórnej zapowiedzi
        const upL = lims.find((l) => lim != null && l.kmh > lim + 0.5);
        const tu = upL ? cross('limup', upL.dist, [500]) : (co.limup = null);
        if (tu) sayP('info', 'limUpSoon', { d: dW(tu), v: kW(upL.kmh) });
        if (st) { const ts = cross('st:' + st.name, st.d, [3000, 1500, 700, 300]);
          // „przy postoju hamować” nie wchodzi, gdy i tak trzeba już hamować przed semaforem/ograniczeniem (jedno polecenie naraz)
          const brakingFirst = co.b0In != null && co.b0In < 400;
          // za szybko, żeby stanąć (droga hamowania przy 0,9 m/s² dłuższa niż do peronu) → to przejazd: jedna zapowiedź stacji, bez „przy postoju hamować”
          const canStop = ms * ms / 1.8 < st.d + 100, saidKey = 'stSaid:' + st.name;
          if (ts && !(stn && stn.name === st.name && stn.done) && !(ts <= 300 && brakingFirst) && (canStop || !co[saidKey])) {
            const key = ts <= 300 && canStop ? 'stNear' : st.kind === 'halt' ? 'haltFar' : 'stFar';
            const braking = D.accel != null && D.accel < -0.15;
            // „przy postoju hamować” ma sens tylko, gdy jeszcze nie hamuje; po „hamowanie za …” dla tej stacji dalsze zapowiedzi odległości są zbędne
            if (!(key === 'stNear' && (braking || v < 40)) && co.bsSaid !== st.name) { co[saidKey] = 1; sayP('info', key, { s: st.name, d: dW(ts), S: SW(st.kind) }); } } }
        const trk = D.track || [], tn = trk.find((q, i) => i && q.tunnel && !trk[i - 1].tunnel && q.d > 0);
        const tt = tn ? cross('tun', tn.d, [400]) : (co.tun = null);
        if (tt && !(co.tunOdo != null && odo - co.tunOdo < 1000)) { co.tunOdo = odo; sayP('info', 'tunnel', { d: dW(tt) }); }
        // pochylenie > 10 ‰: raz na odcinek, ok. 600 m wcześniej
        for (let i = 2; i < trk.length; i++) { const g = (trk[i].h - trk[i - 1].h) / Math.max(1, trk[i].d - trk[i - 1].d) * 1000;
          if (trk[i - 1].d > 900) break;
          if (Math.abs(g) > 10) { const sg = Math.sign(g), tg = cross('grad' + sg, trk[i - 1].d, [600]);
            if (tg && co.gradSaid !== sg) { co.gradSaid = sg; sayP('info', sg > 0 ? 'gUp' : 'gDown', { d: dW(tg), g: gW(Math.round(Math.abs(g))) }); }
            break; } }
        if (!trk.slice(0, 6).some((q, i) => i && Math.abs((q.h - trk[i - 1].h) / Math.max(1, q.d - trk[i - 1].d) * 1000) > 10)) co.gradSaid = 0;
      }
      /* ---- dodatkowe kwestie ---- */
      // przekroczenie z histerezą: wejście > limit + 2, wyjście < limit + 0,5 (bez trzepotania na granicy)
      spdG.update(limE ? v : null, limE || null);   // 79/80/79 km/h nie powtarza alarmu; koniec dopiero ≤ limit − 2
      const over = spdG.latched, cr = !!(D.cruise && D.cruise.active), inTun = !!((D.track || [])[0] && D.track[0].tunnel);
      if (prev) {
        if (D.direction && prev.dir && D.direction !== prev.dir) sayP('info', D.direction > 0 ? 'dirFwd' : 'dirBack');
        if (cr && !prev.cruise) sayP('info', 'cruiseOn', { v: kW(D.cruise.kmh || v) });
        if (!cr && prev.cruise) sayP('info', 'cruiseOff');
        if (slipG.update(!!D.slipping, now) === 'start' && now - (co.slipAt || 0) > 45000) { co.slipAt = now; sayP('warn', 'slip'); }
        if (over && !prev.over) co.overSince = now;
        if (prev.over && !over) {
          // tylko gdy w tym epizodzie padł komunikat o przekroczeniu, trwał ≥ 4 s i nie mówiliśmy tego przed chwilą
          if (co.overEp && now - (co.overSince || now) > 6000 && now - (co.okAt || 0) > 30000 && now - (co.speedMsgAt || 0) > 20000) { sayP('info', 'speedOk'); co.okAt = co.speedMsgAt = now; }
          overAt = 0; co.overSince = null; co.overEp = false; co.overRem = 0;
        }
        if (prev.tun && !inTun && v > 5 && !(co.tunOutOdo != null && odo - co.tunOutOdo < 1000)) { co.tunOutOdo = odo; sayP('info', 'tunnelOut'); }
        if (limE && v < limE - 6) co.belowAt = now;   // „osiągnięta” ma sens tylko przy rozpędzaniu od dołu, nie po zahamowaniu do limitu
        const nearLim = limE && v >= limE - 3 && v <= limE + 1 && !over;
        co.nearLimSince = nearLim ? co.nearLimSince || now : 0;
        if (nearLim && now - co.nearLimSince > 3000 && (D.accel == null || D.accel > -0.05) && !tail && co.atLimFor !== Math.round(limE)
          && now - (co.lastOverMsg || 0) > 45000 && now - (co.limChangeAt || 0) > 10000 && now - (co.belowAt || 0) < 40000
          && now - (co.speedMsgAt || 0) > 20000) { co.speedMsgAt = now; co.atLimFor = Math.round(limE); sayP('info', 'atLimit', { v: kW(limE) }); }
        if (limE && v < limE - 15) co.atLimFor = null;
      }
      // pogoda: przy starcie i przy zmianie na gorszą
      const w = D.weather || {}, wk = w.snow > 0.05 ? 'snow' : w.rain > 0.1 ? 'rain' : w.fog > 0.15 ? 'fog' : 'dry';
      if (wk !== co.wx) { if (wk !== 'dry' && D.weather) sayP('info', 'wx_' + wk); co.wx = wk; }
      // wschód / zachód słońca (czas gry)
      const hm = (x) => { const m = String(x || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
      const nowM = hm(D.gameTime && D.gameTime.slice(11, 16)), ssM = hm(D.sunset), srM = hm(D.sunrise);
      if (nowM != null && co.tM != null) { if (ssM != null && co.tM < ssM && nowM >= ssM) sayP('info', 'sunset'); if (srM != null && co.tM < srM && nowM >= srM) sayP('info', 'sunrise'); }
      if (nowM != null) co.tM = nowM;
      // co 10 km jazdy
      const tr0 = D.trip || {}; if (tr0.km != null) { const k10 = Math.floor(tr0.km / 10);
        if (co.km10 != null && k10 > co.km10) { if (tr0.driveS > 60) sayP('info', 'km', { k: kmW(k10 * 10), avg: kW(tr0.km / (tr0.driveS / 3600)) });
          else say.push({ lvl: 'info', tier: TIER.km, text: `Przejechano ${k10 * 10} kilometrów.`, topic: 'km' }); }
        co.km10 = k10; }
      /* ---- stacja: śledzimy jedną naraz. Zniknięcie z listy „przed nami” (bliżej niż 150 m albo z boku) NIE znaczy przejazdu.
              Przejazd ogłaszamy dopiero, gdy od zniknięcia przejechaliśmy 600 m bez zatrzymania i jedziemy > 25 km/h;
              postój w tym czasie (albo zapis postoju z tą nazwą) = zatrzymanie, bez komunikatu o przejeździe. ---- */
      if (st && (!stn || stn.name !== st.name)) { if (stn && !stn.done && stn.minD < 400) passChk = { name: stn.name, odo0: odo, stopped: stn.stopped }; stn = { name: st.name, minD: st.d, stopped: false, done: false }; }
      if (st && stn && stn.name === st.name) stn.minD = Math.min(stn.minD, st.d);
      if (!st && stn && !stn.done) { if (stn.minD < 400) passChk = { name: stn.name, odo0: odo, stopped: stn.stopped }; stn.done = true; }
      if (v < 1) { if (stn && stn.minD < 600) stn.stopped = true; if (passChk) passChk.stopped = true; }
      if (passChk) {
        const stoppedHere = passChk.stopped || (D.stops || []).slice(-2).some((x) => x.station && x.station === passChk.name);
        if (stoppedHere) passChk = null;
        else if (odo - passChk.odo0 > 600 && v > 25) { sayP('info', 'passSt', { s: passChk.name }); passChk = null; }
        else if (odo - passChk.odo0 > 3000) passChk = null;
      }
      // przyjazd: nowy postój z nazwą stacji
      const stopsN = (D.stops || []).length;
      if (stopsLen >= 0 && stopsN > stopsLen) { const ss = D.stops[stopsN - 1];
        // postój na stacji początkowej (zanim pociąg ruszył) to nie „przyjazd” (jazda 9Z24 St Pancras)
        const started = D.trip && (D.trip.driveS > 20 || D.trip.km > 0.05);
        if (!started) { /* stacja początkowa */ } else if (ss.station) sayP('info', 'arrive', { s: ss.station, t: tW(ss.arr) }); else sayP('info', 'arriveLine'); }
      stopsLen = stopsN;
      // przekroczenie: pierwsze z wartością, potem przypomnienie co 12 s
      // przekroczenie: pierwsze zawsze; przypomnienie co 12 s tylko, gdy maszynista nie zwalnia (trend z telemetrii)
      const slowing = (D.accel != null && D.accel < -0.15) || (prev && v < prev.v - 0.3);
      if (over) {
        const big = v > limE + 10, grace = now < (co.graceUntil || 0) && !big;
        const sustained = v > limE + 5 || now - (co.overSince || now) >= 4000;   // chwilowe +2…+5 km/h przy falowaniu — bez alarmu
        if (!grace && !co.overEp && sustained && (big || now - (co.lastOverMsg || 0) > 20000 && now - (co.speedMsgAt || 0) > 20000)) {
          // jazda ATSF 823: „o 2 kilometry…” to za każdym razem nowy tekst → nagranie nie zdążało (głos przeglądarki); do +10 km/h bez liczby
          const fastO = v >= 200 ? cabT('FAST_OVERSPEED') : null;   // KDP: krótka komenda (< 1,2 s)
          if (fastO) say.push({ lvl: 'crit', tier: 1, text: fastO, topic: 'over', ttl: 1000 });
          else sayP('crit', overBy > 10 ? 'overFirst' : 'overSmall', { v: kW(limE), x: kW(overBand(overBy)) }); co.overEp = true; co.overRem = 0; overAt = co.lastOverMsg = co.speedMsgAt = now;
        } else if (!grace && co.overEp && now - overAt > ([20000, 45000, 90000][co.overRem || 0] || 180000)) {   // 15 → 30 → 60 → co 120 s
          if (!slowing && v > limE + 5) { sayP('warn', 'over', { v: kW(limE) }); co.overRem = (co.overRem || 0) + 1; overAt = co.lastOverMsg = co.speedMsgAt = now; }
        }   // krótkie ponowne wejście < 20 s po poprzednim komunikacie: cisza (pełny komunikat dopiero po 20 s albo przy > +10 km/h)
      }
      // meldunek co ~2,5 min jazdy, gdy lektor dłużej milczał
      if (say.length) saidAt = Date.now();
      if (v > 20 && !over && Date.now() - statusAt > (opt.level >= 4 ? 90000 : 150000) && Date.now() - saidAt > (opt.level >= 4 ? 25000 : 40000)) {
        statusAt = saidAt = Date.now();
        const eta = st && v > 5 ? st.d / ms : null;
        let txt = limE ? say1('status', K.status, { cur: kW(v), limN: Math.round(limE) }) : say1('statusNoLim', K.statusNoLim, { cur: kW(v) });
        if (st) txt += say1('statusSt', K.statusSt, { s: st.name, d: dW(st.d), m: eta && eta < 3600 ? minW(Math.max(1, Math.round(eta / 60))) : K.fewMin[0] });
        if (D.gameTime) txt += fill(K.clock[0], { t: tW(D.gameTime) });
        say.push({ lvl: 'info', tier: 4, text: txt, topic: 'status' });
      }
      if (pend.length) { say.unshift(...pend.splice(0)); saidAt = Date.now(); }
      S.over = over; S.a0 = a0;
      prev = { sig0: { ...s0 }, perm: !!(D.signal && D.signal.permissive), lim, v, alerter: D.alerter, dir: D.direction, cruise: cr, slip: !!D.slipping, over, tun: inTun };
      events = events.filter((e) => e.until > Date.now());

      /* ---- stan stały ---- */
      if (D.alerter > 0) out.push({ lvl: 'crit', icon: 'alert', title: 'CZUWAK — potwierdź!', sub: 'naciśnij przycisk czuwaka, inaczej nagłe hamowanie' });
      if (over) out.push({ lvl: 'crit', icon: 'stop', title: `Za szybko o ${Math.max(1, overBy)} km/h`, sub: tail ? `koniec pociągu jeszcze na ograniczeniu ${Math.round(limE)} km/h` : `zwolnij do ${Math.round(limE)} km/h` });
      if (tail && !over) out.push({ lvl: 'info', icon: 'up', title: `Wkrótce ${Math.round(tail.kmh)} km/h`, sub: `koniec pociągu minie znak za ${fmt(Math.max(0, tail.need - (odo - tail.odo0)))}`,
        prog: Math.min(100, (odo - tail.odo0) / tail.need * 100) });
      if (D.slipping) out.push({ lvl: 'warn', icon: 'warn', title: 'Poślizg kół', sub: 'zmniejsz nastawnik, użyj piasecznicy' });

      // hamowanie: semafory „stój”/ostrzegawcze, ograniczenia w dół, stacja
      const cands = [];
      let clearSeen = false;
      sig.forEach((x, i) => { const c = cls(x.aspect); if (c === 2) clearSeen = true; if (c < 2 && !clearSeen) cands.push({ d: x.dist, vt: c === 0 ? 0 : 40, what: c === 0 ? 'semafor „STÓJ”' : 'semafor ostrzegawczy',
        perm: i === 0 && D.signal && D.signal.permissive && c === 0 }); });
      let pl = lim; lims.forEach((l) => { if (pl != null && l.kmh < pl - 0.5) cands.push({ d: l.dist, vt: l.kmh, what: `ograniczenie ${Math.round(l.kmh)} km/h`, type: l.type }); pl = l.kmh; });
      if (st && st.d < 3000 && v > 5) cands.push({ d: st.d, vt: 0, what: `stacja ${st.name}`, station: true, approx: true });
      const brake = cands.map((c) => { const vt = c.vt / 3.6, sb = Math.max(0, (ms * ms - vt * vt) / (2 * DECEL)); return { ...c, brakeIn: c.d - sb, need: c.d > 1 ? (ms * ms - vt * vt) / (2 * c.d) : 9 }; })
        .filter((c) => c.need > 0.05).sort((a, b) => a.brakeIn - b.brakeIn);
      const b0 = brake.find((c) => !c.station) || null, bs = brake.find((c) => c.station) || null;
      S.brakeNeed = !!b0 && v > 3; co.b0In = b0 ? b0.brakeIn : null;
      if (b0) {
        const late = b0.brakeIn <= 0, soon = b0.brakeIn < 400, prog = Math.max(2, Math.min(100, 100 - b0.brakeIn / Math.max(1, b0.d) * 100));
        const tgt = b0.vt === 0 ? 'do zatrzymania' : `do ${Math.round(b0.vt)} km/h`;
        const typ = b0.type && LIM[b0.type] ? ` (${LIM[b0.type]})` : '';
        const whatV = b0.vt === 0 ? K.wSigStop[0] : b0.what === 'semafor ostrzegawczy' ? K.wSigAppr[0] : fill(K.wLim[0], { v: kW(b0.vt) });
        const whatV2 = b0.vt === 0 ? 'semafora stój' : `ograniczenia do ${kW(b0.vt)}`;
        if (late && b0.what === 'semafor ostrzegawczy' && b0.d < 50) { /* mijamy semafor ostrzegawczy — bez komunikatu „0 metrów” (jazda ATSF 998) */ }
        else if (late && b0.what === 'semafor ostrzegawczy') out.push({ lvl: 'warn', icon: 'warn', title: 'Zwolnij — sygnał ostrzegawczy', sub: `semafor za ${fmt(b0.d)} — następny może wskazywać „stój”, zredukuj prędkość`, prog,
          speak: false,   // głos daje zapowiedź semafora (raz na semafor); karta zostaje na ekranie
          voice: say1('brakeAppr', K.brakeAppr, { d: dW(b0.d) }) });
        // dosuwanie (< 15 km/h) z rozsądnym opóźnieniem to nie alarm: spokojne „zatrzymać pociąg”, raz na semafor
        else if (late && v < 15 && b0.need < 0.8) { const once = co.creepFor !== Math.round(b0.d / 50) && b0.vt === 0 && v > 3;
          if (once) co.creepFor = Math.round(b0.d / 50);
          const brakingNow = D.accel != null && D.accel < -0.15;   // już hamuje → bez przypominania
          out.push({ lvl: 'warn', icon: 'stop', title: b0.vt === 0 ? 'Zatrzymaj przed semaforem' : `Zwolnij do ${Math.round(b0.vt)} km/h`, sub: `${b0.what} za ${fmt(b0.d)}`, prog,
            speak: once && !brakingNow, topic: 'brake', voice: say1('creepStop', K.creepStop, { d: dW(b0.d) }) }); }
        else if (late) out.push({ lvl: 'crit', icon: 'stop', title: b0.need > 0.9 ? 'HAMUJ MOCNO!' : 'HAMUJ TERAZ', sub: `${b0.what}${typ} za ${fmt(b0.d)} — ${tgt}, potrzeba ${b0.need.toFixed(2).replace('.', ',')} m/s²`, prog,
          // jeden cel = jedno polecenie: po wczesnym „hamować” (≥ 120 km/h) i w trakcie hamowania karta milczy (jazda S1: 5 komunikatów w 25 s o jednym semaforze)
          speak: co.earlyKey !== b0.what + '|' + b0.vt && !(D.accel != null && D.accel < -0.2),
          voice: say1(b0.need > 0.9 ? 'brakeEarlyHard' : 'brakeEarly', K[b0.need > 0.9 ? 'brakeEarlyHard' : 'brakeEarly'], { what: b0.vt === 0 ? K.wSigStopL[0] : fill(K.wLimL[0], { v: kW(b0.vt) }) }) });
        else out.push({ lvl: soon ? 'warn' : 'info', icon: soon ? 'warn' : 'brake', title: `Hamowanie za ${fmt(b0.brakeIn)}`, sub: `${b0.what}${typ} za ${fmt(b0.d)} — ${tgt}`, prog,
          // bez „hamowanie za 0 metrów”, bez głosu w trakcie hamowania i po wczesnym „hamować” dla tego samego celu
          speak: soon && b0.brakeIn >= 50 && !(D.accel != null && D.accel < -0.2) && co.earlyKey !== b0.what + '|' + b0.vt,
          voice: say1('brakeSoon', K.brakeSoon, { b: dW(brakeStep(b0.brakeIn)), what: whatV }) });
      }
      // wczesne „hamować” przy dużych prędkościach (jazda AMTK 2172: 267 km/h przed 201 — karta hamowania nie doszła do głosu, bo główną był alarm przekroczenia).
      // Raz na cel, ok. 8 s przed punktem hamowania; tylko ≥ 120 km/h i spadek ≥ 20 km/h (albo „stój”) — na wolnych odcinkach bez zmian.
      if (b0 && v >= 120 && (b0.vt === 0 || v - b0.vt >= 20) && !(b0.what === 'semafor ostrzegawczy')) {
        const key = b0.what + '|' + b0.vt, wV = b0.vt === 0 ? K.wSigStop[0] : fill(K.wLim[0], { v: kW(b0.vt) }), wE = b0.vt === 0 ? K.wSigStopL[0] : fill(K.wLimL[0], { v: kW(b0.vt) });
        const late = b0.brakeIn <= 0, notBraking = !(D.accel != null && D.accel < -0.2);
        if (co.earlyKey !== key && b0.brakeIn <= ms * 8) { co.earlyKey = key; co.earlyVt = b0.vt; co.earlyLate = late;
          if (late) sayP('crit', b0.need > 0.9 ? 'brakeEarlyHard' : 'brakeEarly', { what: wE });
          else sayP('warn', 'brakeSoon', { b: dW(brakeStep(b0.brakeIn)), what: wV }); }
        // drugi stopień: minięty punkt hamowania, a pociąg nie hamuje → jedno „Hamować” (dalej już tylko 300 m i wjazd w ograniczenie)
        else if (co.earlyKey === key && !co.earlyLate && late && notBraking) { co.earlyLate = true; sayP('crit', b0.need > 0.9 ? 'brakeEarlyHard' : 'brakeEarly', { what: wE }); }
      } else if (!b0) { co.earlyKey = null; co.earlyVt = null; }
      if (b0 && b0.perm && v < 45) out.push({ lvl: 'warn', icon: 'perm', title: 'Semafor permisywny „STÓJ”', sub: 'zatrzymaj się, potem możesz jechać na widoczność (≤ 40 km/h)', speak: true, voice: K.perm[0] });
      if (v < 1 && a0 === 0 && s0.dist != null && s0.dist < 400)
        out.push({ lvl: 'warn', icon: 'stop', title: 'Czekaj na sygnał', speak: now - (co.waitAt || 0) > 120000 && !!(co.waitAt = now), topic: 'sig:0', voice: say1('wait', K.wait), sub: `semafor „STÓJ” za ${fmt(s0.dist)}${D.signal && D.signal.permissive ? ' · permisywny: po zatrzymaniu wolno jechać na widoczność' : ''}` });

      // postój na stacji
      const lastStop = (D.stops || []).slice(-1)[0];
      if (v < 1 && lastStop && !lastStop.dep) {
        const arrS = gameSec(lastStop.arr), sec = Math.max(0, Math.round(arrS != null && gS != null ? gameDiff(gS, arrS) : (now - (lastStop.at || now)) / 1000));
        out.push({ lvl: 'info', icon: 'station', title: lastStop.station ? `Postój: ${lastStop.station}` : 'Postój na szlaku', sub: `od ${lastStop.arr ? lastStop.arr.slice(11, 16) : '—'} · ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} min` });
      }
      // dojazd do stacji
      // przelot (za szybko, żeby stanąć przed peronem) → bez karty „Hamuj na stację”
      if (bs && st && ms * ms / 1.8 < st.d + 100) {
        const prog = Math.max(2, Math.min(100, 100 - bs.brakeIn / Math.max(1, bs.d) * 100));
        out.push({ lvl: bs.brakeIn < 150 ? 'warn' : 'info', icon: 'station', title: bs.brakeIn <= 0 ? `Hamuj na stację ${st.name}` : `Stacja ${st.name} ≈ ${fmt(st.d)}`,
          // głos tylko, gdy przed stacją nie ma wcześniejszego hamowania (semafor/ograniczenie) — inaczej dwa sprzeczne polecenia
          sub: bs.brakeIn <= 0 ? 'jeśli się zatrzymujesz — zacznij hamować' : `zatrzymanie? zacznij hamować za ≈ ${fmt(bs.brakeIn)}`, prog,
          speak: false });
        // głos raz na stację (osobny komunikat, nie zależy od tego, która karta jest główna); nie przy dosuwaniu i nie, gdy już hamuje
        if (bs.brakeIn < 150 && bs.brakeIn > 0 && !(b0 && b0.brakeIn < bs.brakeIn + 300) && co.bsSaid !== st.name && v >= 30 && !(D.accel != null && D.accel < -0.2)) {
          co.bsSaid = st.name; sayP('warn', 'brakeStation', { b: dW(Math.max(50, Math.round(bs.brakeIn / 50) * 50)), s: st.name, S: SW(st.kind) }); }
      } else if (st && st.d < 1500) out.push({ lvl: 'info', icon: 'station', title: `Stacja ${st.name} ≈ ${fmt(st.d)}`, sub: st.kind === 'halt' ? 'przystanek' : 'stacja' });

      // sygnał ostrzegawczy przed nami (bez potrzeby hamowania teraz)
      if (a0 === 1 && !b0) out.push({ lvl: 'warn', icon: 'warn', title: 'Semafor ostrzegawczy', sub: `za ${fmt(s0.dist)} — następny może wskazywać „stój”, bądź gotów hamować` });
      // ograniczenie w górę przed nami
      const up = lims.find((l) => lim != null && l.kmh > lim + 0.5);
      if (up && up.dist < 1200) out.push({ lvl: 'info', icon: 'up', title: `Za ${fmt(up.dist)} można ${Math.round(up.kmh)} km/h`, sub: 'przyspiesz dopiero, gdy koniec składu minie znak' });
      // tunel i pochylenie
      const tr = D.track || [];
      const tun = tr.find((q, i) => i && q.tunnel && !tr[i - 1].tunnel && q.d > 0 && q.d < 800);
      if (tun) out.push({ lvl: 'info', icon: 'tunnel', title: `Tunel za ${fmt(tun.d)}`, sub: 'włącz światła, uważaj na zmianę przyczepności' });
      for (let i = 2; i < tr.length; i++) { const g = (tr[i].h - tr[i - 1].h) / Math.max(1, tr[i].d - tr[i - 1].d) * 1000;
        if (tr[i - 1].d > 1500) break;
        if (Math.abs(g) > 10) { out.push(g > 0 ? { lvl: 'info', icon: 'gup', title: `Wzniesienie ${Math.round(g)}‰ za ${fmt(tr[i - 1].d)}`, sub: 'dodaj nastawnik, żeby nie stracić prędkości' }
          : { lvl: 'info', icon: 'gdown', title: `Spadek ${Math.round(-g)}‰ za ${fmt(tr[i - 1].d)}`, sub: 'pociąg sam przyspieszy — kontroluj prędkość' }); break; } }
      // tempomat / spokojna jazda
      if (!out.length || out.every((m) => PRI[m.lvl] >= 2)) {
        const nl = lims[0];
        out.push({ lvl: 'ok', icon: 'ok', title: v < 1 ? (a0 === 2 ? 'Droga wolna — możesz ruszać' : 'Postój') : `Droga wolna${lim ? ' — jedź do ' + Math.round(lim) + ' km/h' : ''}`,
          sub: nl ? `następne ograniczenie: ${Math.round(nl.kmh)} km/h za ${fmt(nl.dist)}` : 'nic nie wymaga teraz reakcji' });
      }
      const all = events.concat(out).sort((a, b) => PRI[a.lvl] - PRI[b.lvl] || (b.until ? 1 : 0) - (a.until ? 1 : 0));
      /* ---- przewidywanie: najbliższe progi (semafor, ograniczenie, stacja, tunel) → teksty do przygotowania na serwerze ---- */
      const upcoming = [];
      if (v > 5) {
        const horizon = Math.max(600, ms * 60);          // ok. minuta jazdy przed progiem
        const nextTh = (d, ths) => ths.find((th) => d != null && d > th && d - th < horizon);
        const allV = (key, o, lvl) => K[key].forEach((t) => upcoming.push({ text: fill(t, o), lvl: lvl || 'info' }));
        const tS = nextTh(s0.dist, a0 === 2 ? [400] : [1500, 800, 400, 150]);
        if (tS) allV(a0 === 2 ? 'sigClear' : a0 === 1 ? 'sigAppr' : tS >= 800 ? 'sigStopFar' : tS >= 400 ? 'sigStopMid' : 'sigStopNear', { d: dW(tS) }, tS >= 800 || a0 > 0 ? 'info' : 'warn');
        if (S.dnAhead != null) { const dn = lims.find((l) => l.kmh === S.dnAhead), tL = dn && nextTh(dn.dist, [1500, 700, 300]);
          if (tL) allV(tL <= 300 ? 'limNearOk' : 'limFar', { d: dW(tL), v: kW(dn.kmh) }); }
        if (st) { const tSt = nextTh(st.d, [3000, 1500, 700, 300]);
          if (tSt) allV(tSt <= 300 ? 'stNear' : st.kind === 'halt' ? 'haltFar' : 'stFar', { s: st.name, d: dW(tSt), S: SW(st.kind) });
          if (st.d < 1500) allV('passSt', { s: st.name }); }
        if (limE != null && overBy > 6) [overBand(overBy), overBand(overBy + 10)].forEach((x) => allV('overFirst', { v: kW(limE), x: kW(x) }, 'crit'));
        if (st && st.d < 2000 && D.gameTime && ms > 1) { const base = Date.parse(D.gameTime.slice(0, 19) + 'Z'), eta = st.d / Math.max(3, ms) + 40;
          for (const dm of [-1, 0, 1]) allV('arrive', { s: st.name, t: tW(new Date(base + (eta + dm * 60) * 1000).toISOString()) });
          for (const b of [100, 150]) allV('brakeStation', { b: dW(b), s: st.name, S: SW(st.kind) }, 'warn'); }
        const tn = (D.track || []).find((q, i) => i && q.tunnel && !D.track[i - 1].tunnel && q.d > 0);
        if (tn && nextTh(tn.d, [400])) allV('tunnel', { d: dW(400) });
      }
      const m0 = all[0]; m0.topic = m0.topic || ({ alert: 'alerter', stop: 'brake', brake: 'brake', warn: 'brake', station: 'station', perm: 'sig:0', go: 'sig:2', up: 'limup', limit: 'limdn' })[m0.icon] || null; m0.tier = m0.lvl === 'crit' ? 1 : m0.lvl === 'warn' ? 2 : 3; m0.key = m0.until ? 'ev:' + m0.title : (m0.title + '|' + (m0.sub || '')).replace(/[\d,.]+/g, '#');
      const wasReset = resetFlag; resetFlag = false;
      return { main: m0, queue: all.slice(1, 3), log, say, upcoming, reset: wasReset };
    }
    /* Czy temat komunikatu jest nadal aktualny (dla kolejki głosu): nieaktualne ostrzeżenia wypadają przed odczytem. */
    function valid(topic) {
      if (!last || !topic) return true;
      const [fam, arg] = String(topic).split(':');
      const v = Math.abs(last.speed || 0), lim = tail ? Math.min(tail.from, last.limit || tail.from) : last.limit;
      switch (fam) {
        case 'over': return S.over;                                  // ten sam stan z histerezą co na ekranie
        case 'overok': return !S.over;
        case 'alerter': return last.alerter > 0;
        case 'slip': return !!last.slipping;
        case 'brake': return S.brakeNeed;                             // nadal jest przed czym hamować i pociąg jedzie
        case 'limdn': return v > 3 && (S.dnAhead != null ? v > S.dnAhead - 3 : Date.now() - S.limDownAt < 8000);
        case 'sig': return arg == null || +arg === S.a0;              // semafor nadal pokazuje to, o czym mówi komunikat
        case 'limup': return arg === 'head' ? !!tail : arg === 'now' ? !tail : true;
        case 'atlimit': return !!(lim && v >= lim - 4 && v <= lim + 2);
        case 'station': return v > 3;
        case 'tunnel': case 'grad': return v > 3;
        case 'status': return v > 20;
        case 'cruiseOn': return !!(last.cruise && last.cruise.active);
        case 'cruiseOff': return !(last.cruise && last.cruise.active);
        case 'dirFwd': return last.direction > 0;
        case 'dirBack': return last.direction < 0;
        default: return true;
      }
    }
    return { update, valid, reset: resetRide };
  };

  /* ikony komunikatów (SVG, kolor = currentColor) */
  window.TSW_MSG_ICONS = {
    ok: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity=".18"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
    go: '<circle cx="12" cy="12" r="10" fill="currentColor" opacity=".18"/><path d="M9 7l7 5-7 5z" fill="currentColor"/>',
    warn: '<path d="M12 3 22 20H2Z" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9v5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/>',
    stop: '<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8Z" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="2.2"/><path d="M8 12h8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    brake: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 12 16 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
    alert: '<path d="M12 2a7 7 0 0 0-7 7v5l-2 3h18l-2-3V9a7 7 0 0 0-7-7z" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="2"/><path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="2" fill="none"/>',
    station: '<rect x="4" y="3" width="16" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="7" y="6" width="10" height="5" rx="1" fill="currentColor"/><path d="M7 21l2-4M17 21l-2-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    up: '<path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    limit: '<circle cx="12" cy="12" r="9" fill="#fff" stroke="#D81E2C" stroke-width="3.5"/>',
    perm: '<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
    tunnel: '<path d="M3 20V11a9 9 0 0 1 18 0v9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 20v-7a4 4 0 0 1 8 0v7" fill="currentColor" opacity=".35"/>',
    gup: '<path d="M3 19 21 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M14 6h7v7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    gdown: '<path d="M3 7l18 12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M14 20h7v-7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  window.TSW_MSG_COL = { crit: '#FF3B4E', warn: '#FFC83D', info: '#38D6FF', ok: '#3DDC97' };

  /* Głos: w Edge naturalne (neuronowe) głosy Microsoftu „Marek” i „Zofia” — te same co Edge-TTS w Fabryce Lektora.
     Gdy ich brak (inna przeglądarka), zwykły polski głos Windows. Przycisk przełącza: Marek → Zofia → wyłączony.
     Przed komunikatami ważnymi gong jak na kolei (dwa tony), przed krytycznymi — trzy szybkie. */
  /* Tekst dla syntezatora: skróty → słowa, odmiana po przyimkach, nazwy stacji. */
  const unitKm = (n) => (n === '1' ? 'kilometr' : /[234]$/.test(n) && !/1[234]$/.test(n) ? 'kilometry' : 'kilometrów');
  const unitM = (n) => (n === '1' ? 'metr' : /[234]$/.test(n) && !/1[234]$/.test(n) ? 'metry' : 'metrów');
  const unitP = (n) => (n === '1' ? 'promil' : /[234]$/.test(n) && !/1[234]$/.test(n) ? 'promile' : 'promili');
  const LETTER = { A: 'A', B: 'Be', C: 'Ce', D: 'De', E: 'E', F: 'Ef', G: 'Gie', H: 'Ha', I: 'I', J: 'Jot', K: 'Ka', L: 'El', Ł: 'Eł', M: 'Em', N: 'En', O: 'O',
    P: 'Pe', R: 'Er', S: 'Es', Ś: 'Eś', T: 'Te', U: 'U', V: 'Fał', W: 'Wu', X: 'Iks', Y: 'Igrek', Z: 'Zet' };
  const spell = (w) => [...w].map((ch) => LETTER[ch] || ch).join(' ');
  // kategorie pociągów (jak czyta je kolej): IC → intersiti, TLK → te-el-ka, REG → regio …
  const CAT = { EIP: 'Ekspres Intersiti Premium', EIC: 'Ekspres Intersiti', IC: 'Intersiti', ICE: 'I Ce E', EC: 'Eurositi', EN: 'Euronajt', TLK: 'Te El Ka',
    REG: 'Regio', IR: 'Interregio', RE: 'Er E', RB: 'Er Be', KM: 'Ka Em', SKM: 'Es Ka Em', ŁKA: 'Eł Ka A', KD: 'Ka De', KŚ: 'Ka Eś', RJ: 'Er Jot', NJ: 'En Jot' };
  // cyfry oznaczenia pojazdu: „07” → „zero siedem”, „57” → „57”, „250” → „250”
  const ZERO = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
  const digitsW = (d) => (d[0] === '0' ? d.split('').map((x) => ZERO[+x]).join(' ') : d);
  // granice „słowa” z Unicode: \b w JavaScripcie nie zna polskich liter (np. w „STÓJ” czy „5 mł” dałby złe dopasowanie)
  const NB = '(?![\\p{L}\\p{N}])', NA = '(?<![\\p{L}\\p{N}])';
  const R = (src, fl = 'g') => new RegExp(src.replace(/\\b</g, NA).replace(/\\b>/g, NB), fl + 'u');
  const RX = {
    trainNo: R('([Pp]ociąg(?:u|iem)?)(?: nr\\.?| numer)? (\\d{2})(\\d{3})\\b>'),
    headcode: R('\\b<(\\d)([A-Z])(\\d{2})\\b>'),
    km1: R('(\\d+),(\\d) km\\b>'), kmh: R('(\\d+) km\\/h'), km: R('(\\d+) km\\b>'), m: R('(\\d+) m\\b>'),
    kV: R('(\\d+) kV\\b>'), kN: R('(\\d+) kN\\b>'), kW: R('(\\d+) kW\\b>'), degC: R('(\\d+)\\s*°C\\b>'), tos: R('(\\d+) t\\/oś\\b>'),
    hbf: R('\\b<Hbf\\b>'), pbf: R('\\s+(?:Pbf|Gbf|Bf)\\b>'), st: R('\\b<St\\. '), stoj: R('\\b<STÓJ\\b>'),
  };
  const designations = (t) => t
    // numer pociągu z 5 cyfr: „13104” → „13, 104” (czytane „trzynaście, sto cztery”)
    .replace(RX.trainNo, '$1 numer $2, $3')
    // brytyjski kod pociągu: „1T42” → „1 te 42”
    .replace(RX.headcode, (_, a, b, c) => `${a} ${LETTER[b] || b} ${c}`)
    // pojazdy i sygnały: EU07, EN57, ET22, ED250, S1, Sz → litery po polsku + cyfry
    .replace(/(^|[\s(,])([A-ZĄĆĘŁŃÓŚŹŻ]{1,3})(\d{1,4})(?=[\s,.;:!?)]|$)/g, (_, pre, L, d) => `${pre}${spell(L)} ${digitsW(d)}`)
    // kategorie pociągów jako osobne słowa
    .replace(/(^|[\s(,])([A-ZĄĆĘŁŃÓŚŹŻ]{2,3})(?=[\s,.;:!?)]|$)/g, (m, pre, w) => (CAT[w] ? pre + CAT[w] : m))
    .replace(/(^|[\s(,])Sz(?=[\s,.;:!?)]|$)/g, '$1Es Zet');
  // nazwy stacji: zapis fonetyczny z /tsw-phon.js (pełne nazwy, potem pojedyncze słowa angielskie/niemieckie)
  const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let phonKey = '', phonRe = null, wordRe = null, NAMES = {}, WORDS = {};
  const phonetic = (t) => {
    const P = window.TSW_PHON; if (!P) return t;
    const key = (P.version || 0) + '|' + Object.keys(P.routes || {}).length + '|' + COUNTRY;   // inne człony dla innego kraju
    if (phonKey !== key) { phonKey = key;
      // pełne nazwy: wszystkie trasy + ewentualne „names”; dłuższe pierwsze („Reading West” przed „Reading”)
      NAMES = Object.assign({}, ...Object.values(P.routes || {}), P.names || {});
      // pojedyncze słowa: tylko od wielkiej litery i min. 4 znaki — nie ruszą polskich słów ani krótkich fragmentów
      WORDS = {}; for (const [w, r] of Object.entries(langWords())) if (w.length >= 3 && /^\p{Lu}/u.test(w)) WORDS[w] = r;
      const names = Object.keys(NAMES).sort((a, b) => b.length - a.length), words = Object.keys(WORDS);
      phonRe = names.length ? new RegExp(NA + '(' + names.map(reEsc).join('|') + ')' + NB, 'gu') : null;
      wordRe = words.length ? new RegExp(NA + '(' + words.map(reEsc).join('|') + ')' + NB, 'gu') : null; }
    if (phonRe) t = t.replace(phonRe, (n) => NAMES[n]);
    if (wordRe) t = t.replace(wordRe, (w) => WORDS[w]);
    return t.replace(/(\p{Lu}\p{Ll}+) & (\p{Lu})/gu, '$1 end $2');   // „Hayes & Harlington” → „… end …” (tylko między nazwami)
  };
  const HOURS = ['zero', 'pierwsza', 'druga', 'trzecia', 'czwarta', 'piąta', 'szósta', 'siódma', 'ósma', 'dziewiąta', 'dziesiąta', 'jedenasta',
    'dwunasta', 'trzynasta', 'czternasta', 'piętnasta', 'szesnasta', 'siedemnasta', 'osiemnasta', 'dziewiętnasta', 'dwudziesta', 'dwudziesta pierwsza',
    'dwudziesta druga', 'dwudziesta trzecia'];
  // „8:05” → „ósma zero pięć”, „17:40” → „siedemnasta 40”, „9:00” → „dziewiąta zero zero” (jak w zapowiedziach kolejowych)
  const clockW = (t) => t.replace(/(?<![\d:])([01]?\d|2[0-3]):([0-5]\d)(?![\d:])/g, (_, h, m) => `${HOURS[+h]} ${m === '00' ? 'zero zero' : m[0] === '0' ? 'zero ' + m[1] : m}`);
  // radio: jednostka prędkości tylko przy pierwszej liczbie w meldunku („Przekroczenie o 4 kilometry na godzinę. Dozwolone 100.”)
  const unitOnce = (t) => { let n = 0; return t.replace(/(\d+) kilometr(?:y|ów)? na godzinę/g, (m0, num) => (n++ ? num : m0)); };
  /* Liczby słownie (0–9999). Syntezator nie zgaduje wtedy formy: „100.” na końcu zdania czytał jako liczebnik porządkowy („setne”),
     „8:05.” jako „ósma zero piąte”. Rodzaj żeński przed minutą/sekundą/godziną: „dwie minuty”, „dwadzieścia dwie sekundy”. */
  const N1 = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
  const N10 = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
  const NT = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
  const NH = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
  const numW = (n) => {
    if (n < 10) return N1[n];
    if (n < 20) return N10[n - 10];
    if (n < 100) return NT[Math.floor(n / 10)] + (n % 10 ? ' ' + N1[n % 10] : '');
    if (n < 1000) return NH[Math.floor(n / 100)] + (n % 100 ? ' ' + numW(n % 100) : '');
    const k = Math.floor(n / 1000), r = n % 1000;
    const kw = k === 1 ? 'tysiąc' : numW(k) + ' ' + (k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14) ? 'tysiące' : 'tysięcy');
    return kw + (r ? ' ' + numW(r) : '');
  };
  // dopełniacz po przyimkach: „do osiemdziesięciu kilometrów”, „około trzech kilometrów”, „ponad stu”
  const G1 = ['zera', 'jednego', 'dwóch', 'trzech', 'czterech', 'pięciu', 'sześciu', 'siedmiu', 'ośmiu', 'dziewięciu'];
  const G10 = ['dziesięciu', 'jedenastu', 'dwunastu', 'trzynastu', 'czternastu', 'piętnastu', 'szesnastu', 'siedemnastu', 'osiemnastu', 'dziewiętnastu'];
  const GT = ['', '', 'dwudziestu', 'trzydziestu', 'czterdziestu', 'pięćdziesięciu', 'sześćdziesięciu', 'siedemdziesięciu', 'osiemdziesięciu', 'dziewięćdziesięciu'];
  const GH = ['', 'stu', 'dwustu', 'trzystu', 'czterystu', 'pięciuset', 'sześciuset', 'siedmiuset', 'ośmiuset', 'dziewięciuset'];
  const numG = (n) => {
    if (n < 10) return G1[n];
    if (n < 20) return G10[n - 10];
    if (n < 100) return GT[Math.floor(n / 10)] + (n % 10 ? ' ' + G1[n % 10] : '');
    if (n < 1000) return GH[Math.floor(n / 100)] + (n % 100 ? ' ' + numG(n % 100) : '');
    const k = Math.floor(n / 1000), r = n % 1000;
    return (k === 1 ? 'tysiąca' : numG(k) + ' tysięcy') + (r ? ' ' + numG(r) : '');
  };
  const numbersW = (t) => t
    .replace(/(^|[\s(])(do|około|ponad|od|powyżej|poniżej) (\d{1,4})(?![\d,])/giu, (_, a, p, n) => `${a}${p} ${numG(+n)}`)
    .replace(/(?<![\d,])(\d{1,4}),(\d{1,3})(?![\d,])/g, (_, a, b) => numW(+a) + ' przecinek ' + numW(+b))
    .replace(/(?<![\d])(\d{1,4})(?![\d])(\s+(?:minut|sekund|godzin)\p{L}*)?/gu, (_, n, fem) => {
      let w = numW(+n);
      if (fem && /2$/.test(n) && !/12$/.test(n)) w = w.replace(/dwa$/, 'dwie');
      return w + (fem || ''); });
  const speechBase = (t) => unitOnce(clockW(designations(phonetic(String(t || '')))))
    .replace(/[„”"]/g, '').replace(/\s*—\s*/g, ', ').replace(/\s*·\s*/g, ', ').replace(/≈\s*/g, 'około ').replace(/≤\s*/g, 'do ')
    .replace(/(\d+)\s*‰/g, (_, n) => n + ' ' + unitP(n))
    .replace(RX.km1, '$1 przecinek $2 kilometra')
    .replace(RX.kmh, (_, n) => n + ' ' + unitKm(n) + ' na godzinę')
    .replace(RX.km, (_, n) => n + ' ' + unitKm(n))
    .replace(/(\d+),(\d+) m\/s²/g, '$1 przecinek $2 metra na sekundę kwadrat').replace(/m\/s²/g, 'metra na sekundę kwadrat')
    .replace(RX.m, (_, n) => n + ' ' + unitM(n))
    .replace(RX.kV, (_, n) => n + (n === '1' ? ' kilowolt' : /[234]$/.test(n) && !/1[234]$/.test(n) ? ' kilowolty' : ' kilowoltów'))
    .replace(RX.kN, (_, n) => n + (n === '1' ? ' kiloniuton' : /[234]$/.test(n) && !/1[234]$/.test(n) ? ' kiloniutony' : ' kiloniutonów'))
    .replace(RX.tos, '$1 ton na oś').replace(RX.kW, '$1 kilowatów').replace(RX.degC, (_, n) => n + ' stopni Celsjusza')
    // przyimki z dopełniaczem: „do 42 kilometrów”, „około 3 kilometrów”, „około kilometra”
    .replace(/(^|[\s(])(do|około|ponad|powyżej|poniżej|od) (\d+) (kilometry|metry|kilometr|metr)(?=[\s,.;!?)]|$)/gi,
      (_, a, p, n, w) => `${a}${p} ${n} ${/^kilo/.test(w) ? (n === '1' ? 'kilometra' : 'kilometrów') : (n === '1' ? 'metra' : 'metrów')}`)
    .replace(/(^|\s)(około|do) (kilometr)(?=[\s,.;!?]|$)/gi, '$1$2 kilometra')
    // „zostało 3 kilometry” → „zostały 3 kilometry”
    .replace(/(^|\s)([Zz])ostało (\d+ (?:kilometry|metry))/g, '$1$2ostały $3')
    // nazwy stacji (OSM, Niemcy): skróty dworców
    .replace(RX.hbf, ', dworzec główny').replace(RX.pbf, '').replace(RX.st, 'Sankt ')
    // numery pociągów: „ICE-17” → „ICE 17”
    .replace(/([A-Za-z])-(\d)/g, '$1 $2')
    .replace(RX.stoj, 'stój').replace(/!/g, '.').replace(/\s{2,}/g, ' ').replace(/\s+([,.])/g, '$1').replace(/,\s*,/g, ',').replace(/\.\s*\./g, '.').trim();
  const speechText = (t) => (LANG === 'pl' ? numbersW(speechBase(t)) : String(t || '').replace(/\s+/g, ' ').trim());   // de/en: syntezator czyta liczby sam
  window.TswSpeechText = speechText;
  window.TswMsgDebug = { K, dW, kW, minW, durW, gW, fill, autoName, speech: (t) => speechText(t), queuePreempts,
    setCountry: (c) => { COUNTRY = c; } };
  /* Meldunki o stałej treści (progi odległości są stałe: 1500/800/400/150 m, ograniczenia co 10 km/h) —
     lektor radiowy przygotowuje je z góry na serwerze, żeby na trasie grały od razu, bez czekania na syntezę. */
  const CRIT_KEYS = new Set(['overFirst', 'overSmall', 'limDnOver', 'sigToStop', 'alerter', 'brakeNow', 'brakeHard', 'brakeEarly', 'brakeEarlyHard']);
  window.TswMsgPrewarm = function () {
    const out = [], add = (key, o, lvl) => K[key].forEach((t) => out.push({ text: fill(t, o || {}), lvl: lvl || (CRIT_KEYS.has(key) ? 'crit' : 'info') }));
    ['sigGoStopped', 'sigGoCaution', 'sigGoMoving', 'sigToStop', 'sigToAppr', 'alerter', 'wait', 'perm', 'slip', 'speedOk', 'cruiseOff', 'tunnelOut', 'dirFwd', 'dirBack',
      'limUpHead', 'departLine', 'arriveLine', 'wx_rain', 'wx_snow', 'wx_fog', 'sunset', 'sunrise'].forEach((k) => add(k));
    add('brakeEarly', { what: K.wSigStopL[0] }); add('brakeEarlyHard', { what: K.wSigStopL[0] });
    /* słownik kabinowy: tylko komunikaty, które wyzwala telemetria TSW (stałe teksty P0) — reszta słownika nie jest pobierana z góry */
    const CABP = window.TswCab;
    if (CABP) [['FAST_STOP'], ['FAST_OVERSPEED'], ['FAST_LIMIT_40'], ['FAST_LIMIT_80'], ['FAST_LIMIT_160'], ['CRIT_SPAD_VIOLATION', true],
      ['CRIT_ROLLBACK_DETECTED'], ['CRIT_BUFFER_END_AHEAD']].forEach(([id, first]) => { const t = CABP.text(id, LANG);
      if (t) out.push({ text: first ? t.split(/(?<=[!.?])\s+/)[0] : t, lvl: 'crit' }); });
    // tunel (zapowiedź zawsze na 400 m), nachylenie 10–35 ‰ na 600 m — stałe progi, więc gotowe nagrania
    add('tunnel', { d: dW(400) });
    for (let g = 10; g <= 35; g++) { add('gUp', { g: gW(g), d: dW(600) }); add('gDown', { g: gW(g), d: dW(600) }); }
    for (let b = 100; b <= 800; b += 100) { add('brakeSoon', { b: dW(b), what: K.wSigStop[0] }, 'warn'); add('brakeSoon', { b: dW(b), what: K.wSigAppr[0] }, 'warn'); }
    [1500, 800, 400, 150].forEach((m) => { const o = { d: dW(m) };
      add('sigClear', o); add('sigAppr', o); add(m >= 800 ? 'sigStopFar' : m >= 400 ? 'sigStopMid' : 'sigStopNear', o, m >= 800 ? 'info' : 'warn'); });
    // km/h 20–300 (ICE/TGV) i mph 15–150 (Acela 150 mph = 241 km/h)
    const LIMS = [...Array.from({ length: 29 }, (_, i) => 20 + i * 10), ...Array.from({ length: 28 }, (_, i) => (15 + i * 5) * 1.609344).flatMap((k) => [Math.floor(k), Math.ceil(k)])]; // gra podaje mph zaokrąglone różnie (50 mph = 80 lub 81)
    for (const v of [...new Set(LIMS)]) { const o = { v: kW(v) }; add('overSmall', o); add('over', o); [10, 20, 30, 40, 50].forEach((x) => add('overFirst', { ...o, x: kW(x) })); add('atLimit', o); add('cruiseOn', o); add('brakeEarly', { what: fill(K.wLimL[0], o) }); add('brakeEarlyHard', { what: fill(K.wLimL[0], o) });
      if (v <= 200) for (let b = 200; b <= 600; b += 100) add('brakeSoon', { b: dW(b), what: fill(K.wLim[0], o) }, 'warn');
      add('limDnNow', o); add('limDnOver', o); add('limNearFast', { ...o, d: dW(300) }, 'warn'); add('limUpNow', o); add('limFar', { ...o, d: dW(1500) }); add('limFar', { ...o, d: dW(700) }); add('limUpSoon', { ...o, d: dW(500) }); add('limNearOk', { ...o, d: dW(300) }); }
    return out;
  };

  window.TswVoice = function () {
    let mode = 'off', last = '', lastAt = 0, ac = null, level = 3;
    // silnik: 'radio' = nagrania z serwera (prawdziwy tor radiowy), 'local' = speechSynthesis przeglądarki (zapas)
    let engine = 'radio', radioFailAt = 0, radioErr = 0, curSrc = null;
    try { engine = localStorage.getItem('tswVoiceEngine') || 'radio'; } catch (_) {}
    try { level = +localStorage.getItem('tswVoiceLevel') || 3; } catch (_) {}
    const LEVELS = I18P.levels || ['', 'tylko alarmy', 'ważne', 'normalnie', 'wszystko'];
    try { mode = localStorage.getItem('tswVoiceMode') || (localStorage.getItem('tswVoice') === '1' ? 'marek' : 'off'); } catch (_) {}
    // głos przeglądarki (zapas) zgodny z językiem komunikatów — nigdy polski głos dla tekstu niemieckiego/angielskiego
    const BCP = () => (LANG === 'de' ? 'de-DE' : LANG === 'en' ? (window.TSW_I18N && window.TSW_I18N.accent === 'us' ? 'en-US' : 'en-GB') : 'pl-PL');
    const pl = () => { const all = window.speechSynthesis ? speechSynthesis.getVoices() : [], tag = BCP(), base = tag.slice(0, 2);
      const exact = all.filter((v) => v.lang.replace('_', '-').toLowerCase() === tag.toLowerCase());
      return exact.length ? exact : all.filter((v) => v.lang.toLowerCase().startsWith(base)); };
    const pick = () => { const vs = pl(), nat = vs.filter((v) => /natural|online|neural/i.test(v.name)), who = voiceWho();
      const want = new RegExp(who, 'i'), local = LANG === 'pl' ? (mode === 'zofia' ? /paulina/i : /adam/i) : /./;   // zapas: głosy Windows na tym PC
      // tylko głosy języka komunikatów (lepiej cisza niż polski głos czytający niemiecki);
      // z internetem najpierw głosy Natural/online, bez sieci najpierw zainstalowane lokalnie (SAPI/Windows)
      const inst = vs.filter((v) => v.localService === true);
      const online = !(typeof navigator !== 'undefined' && navigator.onLine === false) && Date.now() - radioFailAt > 60000;
      const byLocal = inst.find((v) => want.test(v.name)) || inst.find((v) => local.test(v.name)) || inst[0];
      const byNat = nat.find((v) => want.test(v.name)) || nat[0];
      return (online ? byNat || byLocal : byLocal || byNat) || vs.find((v) => local.test(v.name)) || vs[0] || null; };
    if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
    /* ---- tor audio efektów (Web Audio) ----
       radioBus: pasmo radiotelefonu 300–3400 Hz + lekkie podbicie 1,8 kHz + kompresor — sygnały ostrzegawcze, klik PTT, nośna;
       hallBus:  „megafon na peronie”: obcięcie góry + krótkie echo — gong zapowiedzi stacyjnej.
       Głosu z speechSynthesis przeglądarka nie oddaje do Web Audio, więc filtr na sam głos robi Equalizer APO (instrukcja w carlink/pc). */
    let radioBus = null, hallBus = null, hiss = null, keyed = false;
    let blockedAt = 0, testBlocked = false, speechBlockedAt = 0;
    // zmiana języka / widoku = przeładowanie strony: głos przeglądarki z poprzedniej strony nie może mówić dalej w tle (Edge potrafi dokończyć kolejkę)
    try { speechSynthesis.cancel(); } catch (_) {}
    addEventListener('pagehide', () => { try { speechSynthesis.cancel(); if (curSrc) curSrc.stop(); if (ac) ac.close(); } catch (_) {} });   // testBlocked: symulacja blokady autoodtwarzania (do kliknięcia ekranu)
    const AC = () => { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended' && !testBlocked) ac.resume(); return ac; };
    // każde kliknięcie / klawisz na tym ekranie odblokowuje dźwięk (zasada autoodtwarzania przeglądarki)
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { testBlocked = false; speechBlockedAt = 0; try { if (ac && ac.state !== 'running') ac.resume(); } catch (_) {} }, { capture: true, passive: true }));
    let master = null, analyser = null;
    function outBus() {   // wspólne wyjście lektora: głośność + analizator poziomu dla wskaźnika „na antenie”
      if (master) return master;
      const c = AC(); master = c.createGain(); master.gain.value = 1; analyser = c.createAnalyser(); analyser.fftSize = 256;
      master.connect(analyser); master.connect(c.destination); return master;
    }
    function buses() {
      if (radioBus) return;
      const c = AC(); outBus();
      const hp = c.createBiquadFilter(), hp2 = c.createBiquadFilter(), lp = c.createBiquadFilter(), lp2 = c.createBiquadFilter(), pk = c.createBiquadFilter(), cmp = c.createDynamicsCompressor(), out = c.createGain();
      hp.type = hp2.type = 'highpass'; hp.frequency.value = hp2.frequency.value = 300; lp.type = lp2.type = 'lowpass'; lp.frequency.value = lp2.frequency.value = 3400;
      pk.type = 'peaking'; pk.frequency.value = 1800; pk.Q.value = 1; pk.gain.value = 3;
      cmp.threshold.value = -24; cmp.ratio.value = 4; cmp.attack.value = 0.005; cmp.release.value = 0.12; out.gain.value = 0.9;
      hp.connect(hp2).connect(lp).connect(lp2).connect(pk).connect(cmp).connect(out).connect(master);
      radioBus = hp;
      const lpH = c.createBiquadFilter(), dry = c.createGain(), dl = c.createDelay(0.5), fb = c.createGain(), wet = c.createGain(), dlLp = c.createBiquadFilter();
      lpH.type = 'lowpass'; lpH.frequency.value = 5000; dry.gain.value = 1; dl.delayTime.value = 0.11; fb.gain.value = 0.22; wet.gain.value = 0.3; dlLp.type = 'lowpass'; dlLp.frequency.value = 2500;
      lpH.connect(dry).connect(master); lpH.connect(dl); dl.connect(dlLp).connect(fb).connect(dl); dlLp.connect(wet).connect(master);
      hallBus = lpH;
    }
    // ton z miękkim narastaniem i wygaszaniem (bez trzasków na początku i końcu)
    function tone(bus, f, t, len, peak) {
      const c = AC(), o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.015);
      g.gain.setTargetAtTime(0, t + len * 0.35, len / 4); o.connect(g).connect(bus); o.start(t); o.stop(t + len + 0.3);
    }
    function chime(kind) {
      try { buses(); const c = AC(), t0 = c.currentTime + 0.02;
        if (kind === 'crit') [0, 0.16, 0.32].forEach((d) => tone(radioBus, 880, t0 + d, 0.14, 0.45));
        else [[659, 0], [523, 0.42]].forEach(([f, d]) => tone(radioBus, f, t0 + d, 0.8, 0.35));
        return kind === 'crit' ? 560 : 1050;
      } catch (_) { return 0; }
    }
    // gong dworcowy przed zapowiedzią stacyjną (trzy opadające tony, „hala”)
    function gong() {
      try { buses(); const c = AC(), t0 = c.currentTime + 0.02;
        [[784, 0], [659, 0.38], [523, 0.76]].forEach(([f, d]) => tone(hallBus, f, t0 + d, 1.1, 0.28));
        return 1400;
      } catch (_) { return 0; }
    }
    function noiseBuf(sec) { const c = AC(), n = Math.floor(c.sampleRate * sec), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
    // klik PTT: krótki impuls + 40 ms szumu, potem czysta pauza; zamknięcie: „ogon” szumu i klik
    function ptt(open) {
      try { buses(); const c = AC(), t = c.currentTime + 0.01, src = c.createBufferSource(), g = c.createGain();
        src.buffer = noiseBuf(open ? 0.05 : 0.14);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(open ? 0.35 : 0.22, t + 0.002);
        g.gain.setTargetAtTime(open ? 0.05 : 0.08, t + 0.004, 0.006); g.gain.setTargetAtTime(0, t + (open ? 0.03 : 0.1), 0.015);
        src.connect(g).connect(radioBus); src.start(t); src.stop(t + (open ? 0.08 : 0.2));
      } catch (_) {}
    }
    // nośna radia: cichy szum pod głosem, póki kanał otwarty (seria meldunków = jedno otwarcie, bez trzasków między nimi)
    function carrier(on) {
      try { buses(); const c = AC();
        if (on && !hiss) { const src = c.createBufferSource(), g = c.createGain(); src.buffer = noiseBuf(1.5); src.loop = true;
          g.gain.setValueAtTime(0, c.currentTime); g.gain.setTargetAtTime(0.012, c.currentTime, 0.05); src.connect(g).connect(radioBus); src.start(); hiss = { src, g }; }
        if (!on && hiss) { const h = hiss; hiss = null; h.g.gain.setTargetAtTime(0, c.currentTime, 0.04); h.src.stop(c.currentTime + 0.3); }
      } catch (_) {}
    }
    function roger() {   // sygnał końca nadawania jak w CB: 1000 Hz → 1300 Hz, 2 × 70 ms, cicho
      try { buses(); const c = AC(), t = c.currentTime + 0.02; tone(radioBus, 1000, t, 0.07, 0.16); tone(radioBus, 1300, t + 0.08, 0.07, 0.16); } catch (_) {}
    }
    function keyUp() { if (!keyed) { ptt(true); carrier(true); keyed = true; return 280; } return 120; }   // po kliknięciu 280 ms ciszy przed mową
    function keyDown() { if (keyed) { carrier(false); ptt(false); keyed = false; } }
    // tempo i wysokość wg rodzaju komunikatu
    const VOICE_STYLE = { station: { rate: 0.9, pitch: 1.0 }, info: { rate: 0.97, pitch: 0.96 }, ok: { rate: 0.97, pitch: 0.96 }, warn: { rate: 1.0, pitch: 0.97 }, crit: { rate: 1.05, pitch: 1.0 } };
    const STATION = new RegExp('^(' + (I18P.stationWords || ['Stacja', 'Przystanek']).join('|') + ')(?![\\p{L}])', 'u');
    // drobne, stałe dla danego tekstu różnice tempa i wysokości (nie „zapętlona taśma”, a powtórka trafia w pamięć podręczną)
    const hash = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619); return h >>> 0; };
    const prosody = (txt, kind) => { const h = hash(txt);
      if (kind === 'station') return { rate: '-10%', pitch: '+0Hz' };
      if (kind === 'crit') return { rate: '+5%', pitch: ['+0Hz', '+2Hz'][h % 2] };
      return { rate: ['-4%', '-2%', '+0%', '+2%'][h % 4], pitch: ['-3Hz', '-1Hz', '+0Hz'][(h >> 3) % 3] }; };
    const kindOf = (q) => (STATION.test(q.text) && q.lvl !== 'crit' ? 'station' : q.lvl === 'crit' ? 'crit' : 'radio');
    const spoken = (q) => { const t = clean(q.text); return kindOf(q) === 'station' ? t.replace(/^Stacja (?=\S)/, 'Stacja, ') : t; };
    // nagranie z serwera: zaczyna się pobierać od razu przy wejściu do kolejki
    function fetchRadio(q) {
      if (engine !== 'radio' || Date.now() - radioFailAt < 60000 || !window.fetch) return Promise.resolve(null);
      const kind = kindOf(q), txt = spoken(q), pr = prosody(txt, kind), cfx = clientFx();
      const request = (refresh) => fetch('/api/ekranik/tsw/say', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: txt, voice: voiceName(), style: cfx ? 'dry' : kind, rate: pr.rate, pitch: pr.pitch, refresh }) })
        .then((r) => { if (r.status === 429 || r.status === 503) { const e = new Error('busy'); e.soft = true; throw e; } if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      const decode = (b) => AC().decodeAudioData(b.slice(0));
      return request(false)
        .then((b) => decode(b).catch((e) => {
          // Uszkodzona kopia z cache: raz poproś serwer o jej skasowanie i świeżą syntezę.
          if (q.cacheRetried) throw e;
          q.cacheRetried = true;
          return request(true).then(decode);
        }))
        .then((buf) => { radioErr = 0; return buf; })
        .then((buf) => (cfx ? window.TswFx.render(buf, kind) : buf))
        .catch((e) => { if (!e || !e.soft) { if (++radioErr >= 3) { radioFailAt = Date.now(); radioErr = 0; } } return null; });
    }
    // efekty radia: serwer (domyślnie) albo przeglądarka (tsw-fx.js, ?fx=client); głos wg języka komunikatów (tsw-i18n.js)
    const clientFx = () => !!(window.TswFx && window.TswFx.mode === 'client');
    const us = () => !!(window.TSW_I18N && window.TSW_I18N.accent === 'us' && I18P.voicesUS);
    const voiceName = () => { const pair = (us() ? I18P.voicesUS : I18P.voices) || ['pl-PL-MarekNeural', 'pl-PL-ZofiaNeural']; return mode === 'zofia' ? pair[1] : pair[0]; };
    const voiceWho = () => { const n = (us() ? I18P.voiceNamesUS : I18P.voiceNames) || ['Marek', 'Zofia']; return mode === 'zofia' ? n[1] : n[0]; };
    const WAIT = { crit: 1800, warn: 2500, info: 5000, ok: 5000 };   // dla crit/warn sygnał gra od razu, więc to nie jest cisza
    let onAirCb = null;
    const air = (on, q, src) => { try { onAirCb && onAirCb({ on, text: q ? spoken(q) : '', lvl: q ? q.lvl : null, kind: q ? kindOf(q) : null, src: src || null }); } catch (_) {} };
    // przygotowanie z wyprzedzeniem (przewidziane meldunki): po jednym naraz, każdy tekst raz
    const prefetched = new Set(); let pfBusy = false; const pfQueue = [];
    function pfPump() {
      if (pfBusy || !pfQueue.length || engine !== 'radio' || mode === 'off') return;
      pfBusy = true; const q = pfQueue.shift();
      fetchRadio(q).then(() => { pfBusy = false; setTimeout(pfPump, 300); });
    }   // ile czekać na nagranie, zanim powie głos przeglądarki
    let queue = [], busy = false, current = null, infoLog = [], speedAt = 0;
    const countInfo = (q) => { const f = q.topic ? String(q.topic).split(':')[0] : '';
      if ((q.lvl === 'info' || q.lvl === 'ok') && !q.force && !['station', 'stop', 'alerter'].includes(f)) infoLog.push(Date.now()); };
    /* Dziennik: każda decyzja lektora z kontekstem z gry (prędkość, limit, semafor, stacja, czas gry).
       Wysyłany co 10 s na serwer ekranów (zapis JSONL na dzień) — kolejne poprawki opieramy na faktach z jazdy. */
    let ctxFn = null, jbuf = [];
    function jlog(ev, q, extra) {
      if (window.TSW_DEMO) return;   // jazda pokazowa (?demo=1) nie trafia do dziennika
      try {
        const c = ctxFn ? ctxFn() : {};
        jbuf.push(Object.assign({ t: new Date().toISOString(), ev, lang: LANG, lvl: q && q.lvl, topic: q && q.topic, text: q && q.text,
          wait: q && q.at ? Date.now() - q.at : undefined }, c, extra || {}));
        if (jbuf.length > 400) jbuf.splice(0, jbuf.length - 400);
        // wypowiedziany komunikat od razu dla podglądu na żywo (telefon / tablet, panel LED) — dziennik idzie dalej co 10 s
        if (ev === 'powiedziany' && q && window.fetch) fetch('/api/ekranik/tsw/said', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lvl: q.lvl, text: q.text, lang: LANG }), keepalive: true }).catch(() => {});
      } catch (_) {}
    }
    setInterval(() => {
      if (!jbuf.length || !window.fetch) return;
      const batch = jbuf.splice(0, 200);
      fetch('/api/ekranik/tsw/lektor-log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(batch) }).catch(() => {});
    }, 10000);
    const PRIO = { crit: 0, warn: 1, info: 2, ok: 3 }, MAX_AGE = { crit: 7000, warn: 9000, info: 11000, ok: 11000 };
    // TTL: własny komunikatu (słownik kabinowy, FAST_*) albo poziomu P0–P3 (tsw-cab.js); bez tsw-cab.js — dotychczasowe limity
    const ttlOf = (q) => q.ttl || (window.TswCab ? window.TswCab.meta(q.lvl).ttl : MAX_AGE[q.lvl] || 9000);
    const expired = (q) => Date.now() - q.at > ttlOf(q);
    const spokenAt = {};
    let validator = null;
    function next() {
      // najważniejsze najpierw; przeterminowane i nieaktualne wypadają
      queue.sort((a, b) => PRIO[a.lvl] - PRIO[b.lvl] || a.at - b.at);
      let q = null;
      while (queue.length) { const c = queue.shift();
        if (expired(c)) { jlog('przeterminowany', c, { ttl: ttlOf(c) }); continue; }
        if (c.topic && validator && !c.force && !validator(c.topic)) { jlog('nieaktualny', c); continue; }
        q = c; break; }
      if (!q) { busy = false; current = null; keyDown(); return; }
      busy = true; current = q; if (q.topic) spokenAt[q.topic] = Date.now();
      if (q.audio) {
        // alarm/ostrzeżenie: sygnał dźwiękowy od razu (maszynista wie, że coś idzie), a nagranie z serwera ma wtedy więcej czasu
        const kq = kindOf(q), alarm = kq !== 'station' && (q.lvl === 'crit' || q.lvl === 'warn');
        if (alarm) { keyUp(); q.chimeAt = Date.now() + chime(q.lvl); }
        const wait = kq === 'station' ? 4000 : WAIT[q.lvl] || 4000;
        Promise.race([Promise.resolve(q.audio).catch(() => null), new Promise((r) => setTimeout(() => r(null), wait))]).then((buf) => {
          if (current !== q) return;
          if (expired(q)) { jlog('przeterminowany', q, { ttl: ttlOf(q), po: 'sieci' }); busy = false; current = null; air(false, q); next(); return; }   // drugie sprawdzenie TTL
          // dźwięk strony wstrzymany przez przeglądarkę (okno bez zgody na autoodtwarzanie) → nagranie byłoby niesłyszalne; mowa systemowa działa
          if (buf && ac && ac.state !== 'running') { blockedAt = Date.now(); jlog('dźwięk wstrzymany', q, { audio: ac.state, test: testBlocked || undefined }); if (!testBlocked) ac.resume().catch(() => {}); speakLocal(q); return; }
          if (buf) playRadio(q, buf); else speakLocal(q);
        });
        return;
      }
      speakLocal(q);
    }
    // odtworzenie nagrania z serwera (ma już w sobie klik, szum i ogon PTT); przed nim sygnał ostrzegawczy albo gong
    function playRadio(q, buf) {
      keyDown();
      const kind = kindOf(q), delay = kind === 'station' ? gong() : q.chimeAt ? Math.max(0, q.chimeAt - Date.now()) : q.lvl === 'crit' || q.lvl === 'warn' ? chime(q.lvl) : 0;
      setTimeout(() => {
        if (current !== q) return;
        try {
          const c = AC(), src = c.createBufferSource();
          const gn = c.createGain(); src.__g = gn; src.buffer = buf; src.connect(gn).connect(outBus()); curSrc = src; q.endAt = Date.now() + buf.duration * 1000;
          air(true, q, 'radio'); jlog('powiedziany', q, { src: 'VPS' }); countInfo(q);
          src.onended = () => { if (curSrc === src) curSrc = null; if (current !== q) return;
            if (!queue.length && kind === 'radio') roger();     // koniec serii: „roger beep”
            air(false, q); setTimeout(() => { if (current === q) next(); }, queue.length ? 260 : 200); };
          src.start();
          // strażnik: nagranie nie skończyło się w czasie (zawieszony dźwięk w przeglądarce) → kolejka idzie dalej, nie milknie na minuty
          setTimeout(() => { if (current !== q || curSrc !== src) return; jlog('zawieszony', q, { audio: c.state });
            src.onended = null; try { src.stop(); } catch (_) {} curSrc = null; air(false, q); next(); }, buf.duration * 1000 + 3000);
        } catch (_) { speakLocal(q); }
      }, delay);
    }
    function speakLocal(q) {
      const station = STATION.test(q.text) && q.lvl !== 'crit';
      // zapowiedź stacyjna: pauza po „Stacja”, wolniejsze tempo jak megafon
      const txt = station ? clean(q.text).replace(/^Stacja (?=\S)/, 'Stacja, ').replace(/^(Następn[ay] (?:stacja|przystanek)):?\s*/, '$1... ') : clean(q.text);
      const v = pick();
      if (!v && (q.voiceWaits || 0) < 4) {
        q.voiceWaits = (q.voiceWaits || 0) + 1;
        setTimeout(() => { if (current === q) speakLocal(q); }, 250);
        return;
      }
      if (!v) {
        jlog('pominięty', q, { why: 'brak lokalnego głosu Windows' });
        setTimeout(() => { if (current === q) next(); }, 50);
        return;
      }
      let u;
      try { u = new SpeechSynthesisUtterance(txt); }
      catch (_) {
        jlog('błąd mowy', q, { why: 'SpeechSynthesisUtterance niedostępny' });
        setTimeout(() => { if (current === q) next(); }, 50);
        return;
      }
      u.voice = v;
      const st = VOICE_STYLE[station ? 'station' : q.lvl] || VOICE_STYLE.info;
      u.lang = v.lang || BCP(); u.rate = st.rate; u.pitch = st.pitch; u.volume = 1;
      // zapowiedź stacyjna = megafon (gong, bez radia); reszta = radio: otwarcie kanału raz na serię
      let delay;
      if (station) { keyDown(); delay = gong(); }
      else if (q.chimeAt) delay = Math.max(0, q.chimeAt - Date.now());   // sygnał już zagrał przy czekaniu na serwer
      else if (q.lvl === 'crit' || q.lvl === 'warn') { delay = chime(q.lvl); delay += keyUp(); }
      else delay = keyUp();
      // przerwany komunikat (alarm wszedł w trakcie) nie wywołuje już kolejnego; koniec serii = zamknięcie kanału
      // następny rusza tylko, jeśli w przerwie nic nie przejęło kolejki (np. alarm) — inaczej zaplanowane „next” zagłuszyłoby alarm
      u.onstart = () => { q.started = true; q.local = true; q.endAt = Date.now() + txt.length * 80; air(true, q, 'local'); jlog('powiedziany', q, { src: 'lokalnie' }); countInfo(q); };
      u.onend = () => { if (current !== q) return; air(false, q); if (!queue.length) keyDown(); setTimeout(() => { if (current === q) next(); }, queue.length ? 380 : 300); };
      // Edge/Chrome odrzuca mowę tuż po speechSynthesis.cancel() (alarm przerwał poprzedni komunikat) → alarm/ostrzeżenie ponawiamy raz, nie ginie bez śladu
      u.onerror = (e) => { if (current !== q) return;
        if (!q.started && !q.retried && (q.lvl === 'crit' || q.lvl === 'warn')) { q.retried = true; setTimeout(() => { if (current === q) { try { speechSynthesis.cancel(); } catch (_) {} speechSynthesis.speak(u); } }, 300); return; }
        if (!q.started) jlog('błąd mowy', q, { why: e && e.error });
        if (e && e.error === 'not-allowed') speechBlockedAt = Date.now();
        u.onend(); };
      setTimeout(() => {
        if (current !== q) return;
        try { speechSynthesis.speak(u); }
        catch (_) { jlog('błąd mowy', q, { why: 'systemowy syntezator niedostępny' }); if (current === q) next(); }
      }, delay);   // odwołany w czasie gongu → nie mówimy
      setTimeout(() => { if (current !== q) return; jlog('zawieszony', q, { src: 'lokalnie' });
        u.onend = u.onerror = null; try { speechSynthesis.cancel(); } catch (_) {} air(false, q); next(); }, delay + 6000 + txt.length * 150);
      setTimeout(() => { if (current === q && !speechSynthesis.speaking) next(); }, 15000);  // zabezpieczenie, gdy onend nie przyjdzie
    }
    const clean = speechText;
    return {
      get on() { return mode !== 'off'; },
      get level() { return level; },
      get levelLabel() { return (I18P.levelPrefix || 'mówi: ') + LEVELS[level]; },
      cycleLevel() { level = level >= 4 ? 1 : level + 1; try { localStorage.setItem('tswVoiceLevel', String(level)); } catch (_) {}
        if (mode !== 'off') this.say(fill(K.levelSet[0], { l: LEVELS[level] }), 'info', true, 3, 'cfg'); return level; },
      get label() { const v = this.on ? pick() : null;
        if (mode === 'off') return 'głos: wył.';
        const who = mode === 'zofia' ? 'Zofia' : 'Marek';
        return engine === 'radio' && Date.now() - radioFailAt > 60000 ? `głos: ${who} · radio` : `głos: ${who}${v && !/natural|online|neural/i.test(v.name) ? ' (prosty)' : ''}`; },
      get engine() { return engine; },
      get mode() { return mode; },
      // test ścieżki „dźwięk wstrzymany”: VOICE.testBlock() w konsoli albo ?testblock=1 — wstrzymuje dźwięk strony jak blokada autoodtwarzania
      testBlock() { try { testBlocked = true; AC().suspend(); } catch (_) {} return 'dźwięk wstrzymany — następny komunikat powie głos systemowy, kliknięcie ekranu przywraca radio'; },
      // true = przeglądarka wstrzymała dźwięk strony (trzeba kliknąć ekran); lektor mówi wtedy głosem systemowym
      get audioBlocked() { return (!!ac && ac.state !== 'running' && Date.now() - blockedAt < 120000) || Date.now() - speechBlockedAt < 120000; },
      set onAir(fn) { onAirCb = fn; },
      set context(fn) { ctxFn = fn; },
      // nowy przejazd: kolejka ze starej jazdy wypada (bieżący alarm może dokończyć)
      flush(why) { queue.forEach((q) => jlog('wyczyszczony', q, { why })); queue = [];
        if (current && current.lvl !== 'crit') { speechSynthesis.cancel(); if (curSrc) { try { curSrc.stop(); } catch (_) {} curSrc = null; } busy = false; current = null; keyDown(); } },
      // poziom sygnału 0..1 (wskaźnik na ekranie); dla głosu przeglądarki brak pomiaru → null
      level01() { if (!analyser || !curSrc) return null; const a = new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(a);
        let m = 0; for (const x of a) m = Math.max(m, Math.abs(x - 128)); return Math.min(1, m / 90); },
      prefetch(list) {
        if (engine !== 'radio' || mode === 'off') return;
        for (const it of list || []) { const k = it.lvl + '|' + it.text; if (prefetched.has(k)) continue; prefetched.add(k); pfQueue.push({ text: it.text, lvl: it.lvl || 'info' }); }
        if (pfQueue.length > 20) pfQueue.splice(0, pfQueue.length - 20);
        if (prefetched.size > 3000) prefetched.clear();
        pfPump();
      },
      setEngine(e) { engine = e === 'local' ? 'local' : 'radio'; try { localStorage.setItem('tswVoiceEngine', engine); } catch (_) {} },
      // stałe meldunki: przygotowanie na serwerze w tle (po jednym, żeby nie obciążać łącza ani VPS)
      async prewarm(list) {
        if (engine !== 'radio' || mode === 'off' || !window.fetch) return 0;
        // kolejność: alarmy → ostrzeżenia → reszta (jazda ATSF 998: stałe ostrzeżenia nie były gotowe na początku jazdy)
        const P = { crit: 0, warn: 1, info: 2, ok: 3 }, items = (list || []).slice().sort((a, b) => (P[a.lvl] ?? 2) - (P[b.lvl] ?? 2));
        let n = 0, i = 0, netErr = 0;
        const one = async (it, tries = 0) => {
          const q = { text: it.text, lvl: it.lvl || 'info' }, kind = kindOf(q), txt = spoken(q), pr = prosody(txt, kind);
          const r = await fetch('/api/ekranik/tsw/say', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: txt, voice: voiceName(), style: clientFx() ? 'dry' : kind, rate: pr.rate, pitch: pr.pitch }) });
          if (r.ok) { n++; netErr = 0; return; }
          // serwer zajęty / limit / przekroczony czas: odczekaj i ponów (2×), nie przerywaj całości i nie zabieraj miejsca meldunkom z jazdy
          if ([429, 503, 504].includes(r.status) && tries < 2) { await new Promise((x) => setTimeout(x, r.status === 429 ? 20000 : 8000)); return one(it, tries + 1); }
        };
        // 2 naraz (meldunki z jazdy mają zawsze wolne miejsce na serwerze); gotowe kopie wracają w ~10 ms
        await Promise.all([0, 1].map(async () => { while (netErr < 3 && i < items.length) { try { await one(items[i++]); } catch (_) { netErr++; } await new Promise((x) => setTimeout(x, 250)); } }));
        return n;
      },
      toggle() { const wasOn = mode !== 'off'; mode = mode === 'off' ? 'marek' : mode === 'marek' ? 'zofia' : 'off'; try { localStorage.setItem('tswVoiceMode', mode); } catch (_) {}
        if (mode !== 'off') this.say(fill((wasOn ? K.voiceWho : K.voiceOn)[0], { who: voiceWho() }), 'info', true, 3, 'cfg'); return mode; },   // przełączenie głosu: tylko „Mówi …”
      set validator(fn) { validator = fn; },
      /* dokładnie to, co wysłałby fetchRadio (ten sam klucz nagrania na serwerze) — dla generatora „Głosy offline” */
      payload(text, lvl = 'info') { const q = { text, lvl }, kind = kindOf(q), txt = spoken(q), pr = prosody(txt, kind);
        return { text: txt, voice: voiceName(), rate: pr.rate, pitch: pr.pitch }; },
      say(text, lvl = 'info', force, tier = 3, topic = null, opt = null) {
        if ((mode === 'off' && !force) || !window.speechSynthesis) return;
        if (!text || !String(text).trim()) return;   // brak tekstu w języku komunikatów — cisza zamiast innego języka
        if (!force && tier > level) return;
        if (text === last && Date.now() - lastAt < (lvl === 'crit' ? 6000 : 20000)) return jlog('pominięty', { text, lvl, topic }, { why: lvl === 'crit' ? 'alarm powtórzony < 6 s' : 'powtórka < 20 s' });   // alarm może wrócić szybciej, ale nie co sekundę
        // ten sam temat przed chwilą powiedziany → pomiń (alarmy zawsze przechodzą)
        if (topic && lvl !== 'crit' && !force && spokenAt[topic] && Date.now() - spokenAt[topic] < 6000) return jlog('pominięty', { text, lvl, topic }, { why: 'temat < 6 s' });
        const fam0 = topic ? String(topic).split(':')[0] : '';
        const SPEED = ['over', 'overok', 'atlimit', 'limdn', 'limup'];
        if (SPEED.includes(fam0) && !force) {
          const big = lvl === 'crit' && fam0 === 'over';
          if (!big && Date.now() - (speedAt || 0) < 8000) return jlog('pominięty', { text, lvl, topic }, { why: 'prędkość < 8 s' });
          speedAt = Date.now();
        }
        if ((lvl === 'info' || lvl === 'ok') && !force && !['station', 'stop', 'alerter'].includes(fam0)) {
          infoLog = infoLog.filter((x) => Date.now() - x < 15000);
          if (infoLog.length >= 3) return jlog('pominięty', { text, lvl, topic }, { why: 'gęstość 3/15 s' });
        }
        last = text; lastAt = Date.now();
        // nowszy komunikat o tym samym temacie zastępuje starszy w kolejce
        const fam = topic ? String(topic).split(':')[0] : null;
        if (fam) queue = queue.filter((q) => { const keep = !q.topic || String(q.topic).split(':')[0] !== fam; if (!keep) jlog('zastąpiony', q, { by: text }); return keep; });
        if (queue.some((q) => q.text === text)) return;
        const item = { text, lvl, topic, force: !!force, at: Date.now(), ttl: opt && opt.ttl > 0 ? +opt.ttl : null };
        item.audio = fetchRadio(item);   // pobieranie nagrania rusza od razu (zwykle gotowe, zanim przyjdzie kolej)
        queue.push(item);
        // przeciążenie: zostają najważniejsze 3
        if (queue.length > 3) { queue.sort((a, b) => PRIO[a.lvl] - PRIO[b.lvl] || b.at - a.at); queue.length = 3; }
        // Wyższy priorytet przerywa niekrytyczny komunikat; krytyczny może dokończyć krótką końcówkę.
        // Dłuższe audio wyciszamy płynnie; oczekujące nagranie ustępuje od razu.
        if (current) {
          const cur = current, left = cur.endAt ? cur.endAt - Date.now() : null;
          if (queuePreempts(cur.lvl, lvl, left, !!cur.local)) {
            jlog('przerwany', cur, { by: text, left: Math.round(left) });
            if (cur.local) speechSynthesis.cancel();
            if (curSrc) { const src = curSrc, gn = src.__g; curSrc = null; src.onended = null;
              const fade = lvl === 'crit' ? 0.04 : 0.2;   // P0: ucięcie natychmiast (bez trzasku), reszta: płynne wyciszenie
              try { if (gn) { const t = gn.context.currentTime; gn.gain.setValueAtTime(gn.gain.value, t); gn.gain.linearRampToValueAtTime(0, t + fade); src.stop(t + fade + 0.02); } else src.stop(); } catch (_) {} }
            busy = false; current = null; air(false, cur);
          }
        }
        if (!busy) next();
      },
    };
  };
})();
