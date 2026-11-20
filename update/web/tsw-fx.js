/* Efekty lektora TSW po stronie przeglądarki (Web Audio) — opcja „fx=client”.
   Domyślnie efekty radia/megafonu robi serwer lektora (VPS, ffmpeg). W trybie client serwer zwraca czysty głos (style „dry”),
   a ten moduł nakłada ten sam charakter lokalnie i oddaje gotowy AudioBuffer (OfflineAudioContext), więc kolejka, strażnik
   i odtwarzanie działają bez zmian. Korzyść: krótsza ścieżka na serwerze, jedno nagranie dry dla obu stylów, strojenie bez
   ponownej syntezy. Parametry odpowiadają TUNE_DEFAULT z lektor-factory/server.py.

   Włączenie: adres …/tsw-route.html?fx=client (zapamiętywane) albo localStorage.tswFx = 'client'; powrót: ?fx=server. */
(function () {
  const TUNE = { lo: 200, hi: 3000, presence: 4, ratio: 5, grit: 0.06, noise: 0.028, pre: 0.2, post: 0.3,   // radio / alarm
    stLo: 220, stHi: 5000, echoMs: 80, echoGain: 0.10 };                                                       // megafon (stacja)

  function pinkNoise(ctx, seconds) {
    const n = Math.ceil(seconds * ctx.sampleRate), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
    return b;
  }
  function softClip(amount) {   // miękkie przesterowanie („ziarno” krótkofalówki)
    const k = amount * 100, c = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
    return c;
  }
  function click(ctx, t, dest, gain) {   // klik PTT: krótki impuls szumu
    const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.012), ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length / 5));
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = gain; s.connect(g).connect(dest); s.start(t);
  }

  async function render(buf, kind) {
    const T = TUNE, station = kind === 'station', pre = station ? 0.05 : T.pre, post = station ? 0.45 : T.post;
    const total = pre + buf.duration + post, sr = 24000;
    const ctx = new OfflineAudioContext(1, Math.ceil(total * sr), sr);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const out = ctx.createGain(); out.connect(ctx.destination);
    const bq = (type, f, q, g) => { const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q != null) n.Q.value = q; if (g != null) n.gain.value = g; return n; };
    if (station) {
      // megafon: pasmo 220–5000 Hz, kompresja, jedno krótkie odbicie (bez zamazywania sylab)
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -22; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.2;
      const chain = [bq('highpass', T.stLo, 0.7), bq('lowpass', T.stHi, 0.7), comp];
      src.connect(chain[0]); chain.reduce((a, b) => (a.connect(b), b));
      const dry = ctx.createGain(); dry.gain.value = 0.9; comp.connect(dry).connect(out);
      const dl = ctx.createDelay(1); dl.delayTime.value = T.echoMs / 1000; const wet = ctx.createGain(); wet.gain.value = T.echoGain; comp.connect(dl).connect(wet).connect(out);
    } else {
      // radio: pasmo krótkofalówki (strome), „nosowe” podbicie 1,7 kHz, przesterowanie, mocna kompresja
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -26; comp.ratio.value = T.ratio; comp.attack.value = 0.003; comp.release.value = 0.12;
      const ws = ctx.createWaveShaper(); ws.curve = softClip(kind === 'crit' ? T.grit * 0.7 : T.grit); ws.oversample = '2x';
      const make = ctx.createGain(); make.gain.value = 1.6;
      const chain = [bq('highpass', T.lo, 0.7), bq('highpass', T.lo, 0.7), bq('lowpass', T.hi, 0.7), bq('lowpass', T.hi, 0.7), bq('peaking', 1700, 1, T.presence), ws, comp, make];
      src.connect(chain[0]); chain.reduce((a, b) => (a.connect(b), b)); make.connect(out);
      // szum nośnej pod mową: łagodne narastanie przed i wygaszenie po (jak otwarcie/zamknięcie kanału), lekkie falowanie
      const nz = ctx.createBufferSource(); nz.buffer = pinkNoise(ctx, total);
      const nf = bq('bandpass', 1200, 0.6), ng = ctx.createGain(), lvl = T.noise * (kind === 'crit' ? 0.75 : 1);
      ng.gain.setValueAtTime(0, 0); ng.gain.linearRampToValueAtTime(lvl, 0.06); ng.gain.setValueAtTime(lvl, total - 0.12); ng.gain.linearRampToValueAtTime(0, total);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.7; lg.gain.value = lvl * 0.3; lfo.connect(lg).connect(ng.gain); lfo.start(0);
      nz.connect(nf).connect(ng).connect(out); nz.start(0);
      click(ctx, 0.01, out, 0.5); click(ctx, total - 0.06, out, 0.35);
    }
    src.start(pre);
    return ctx.startRendering();
  }

  let mode = 'server';
  try { const u = new URLSearchParams(location.search).get('fx'); if (u === 'client' || u === 'server') localStorage.setItem('tswFx', u); mode = localStorage.getItem('tswFx') || 'server'; } catch (_) {}
  window.TswFx = { get mode() { return mode; }, set mode(m) { mode = m === 'client' ? 'client' : 'server'; try { localStorage.setItem('tswFx', mode); } catch (_) {} }, render, TUNE };
})();
