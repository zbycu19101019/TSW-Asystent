/* Języki lektora TSW. Pakiety komunikatów: /i18n/pl.js (domyślny), /i18n/de.js, /i18n/en.js — każdy woła TSW_I18N.add(kod, pakiet).
   Pakiet: { msgs: {klucz: [warianty…]}, units?: {kmh, d, g, min, dur}, voices: [męski, żeński], voiceNames: [..], levels: [..], stationRx }
   Wybór języka: …/tsw-route.html?lang=de (zapamiętywany; ?lang=pl wraca do polskiego) albo localStorage.tswLang.
   Angielski z głosami amerykańskimi: ?lang=en&accent=us (domyślnie brytyjskie).
   Polski ma pełny tor wymowy (słownik tsw-phon.js, liczby słownie); niemiecki i angielski czytają nazwy natywnie głosem Edge-TTS. */
(function () {
  let lang = 'pl', accent = 'gb';
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('lang')) localStorage.setItem('tswLang', q.get('lang'));
    if (q.get('accent')) localStorage.setItem('tswAccent', q.get('accent'));
    lang = (localStorage.getItem('tswLang') || 'pl').toLowerCase(); accent = (localStorage.getItem('tswAccent') || 'gb').toLowerCase();
  } catch (_) {}
  const I = window.TSW_I18N = {
    packs: {},
    get lang() { return I.packs[lang] ? lang : 'pl'; },
    accent,
    add(code, pack) { I.packs[code] = pack; },
    pack() { return I.packs[I.lang] || I.packs.pl; },
  };
})();
