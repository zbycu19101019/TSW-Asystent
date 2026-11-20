/* Tłumaczenie interfejsu 2. monitora (tsw-route.html) razem z ?lang=. Polski = oryginał w HTML/JS (bez zmian).
   ui: dokładne napisy; rx: zamiany fraz w napisach składanych w locie (kolejność: dłuższe frazy najpierw). */
(function () {
  const I = window.TSW_I18N; if (!I) return;
  const de = {
    ui: {
      'Rozkład maszynisty': 'Fahrplan Triebfahrzeugführer', 'Telemetria pociągu': 'Zugtelemetrie', 'Komunikat dla maszynisty': 'Meldung an den Tf',
      'Twój rozkład · postoje': 'Dein Fahrplan · Halte', 'Profil trasy · najbliższe': 'Streckenprofil · nächste', 'Prędkość · ostatnie 3 min': 'Geschwindigkeit · letzte 3 min',
      'Nastawnik jazdy': 'Fahrschalter', 'Hamulec': 'Bremse', 'Przejechane': 'Gefahren', 'Średnia': 'Schnitt', 'V max': 'V max', 'Przekroczenia': 'Überschreitungen',
      'NASTĘPNA STACJA': 'NÄCHSTER HALT', 'następna stacja': 'nächster Halt', 'Stacja': 'Bahnhof', 'Przyjazd': 'An', 'Odjazd': 'Ab', 'Postój': 'Halt',
      'siła': 'Zugkraft', 'przyspieszenie': 'Beschleunigung', 'pochylenie': 'Neigung', 'manometr': 'Manometer', 'semafor': 'Signal', 'teraz · potem': 'jetzt · dann',
      'w grze': 'im Spiel', 'RADIO': 'FUNK', 'NA ANTENIE': 'AUF SENDUNG', 'MEGAFON': 'LAUTSPRECHER', 'LOKALNIE': 'LOKAL', 'kanał wolny': 'Kanal frei',
      '— limit': '— Limit', '▬ wysokość': '▬ Höhe', '┅ dozwolona prędkość': '┅ zulässige Geschwindigkeit', '▮ semafory': '▮ Signale', '░ tunel': '░ Tunnel',
      'Czekam na Train Sim World': 'Warte auf Train Sim World', 'szukam stacji…': 'suche Bahnhof…', 'stoi': 'steht', 'postój na szlaku': 'Halt auf freier Strecke',
      'postoje zapiszą się same, gdy pociąg stanie na stacji': 'Halte werden automatisch erfasst, sobald der Zug im Bahnhof hält',
      'Pociąg': 'Zug', 'wag.': 'Wagen', 'poza skalą': 'über Skala', 'Wolna droga': 'Fahrt', 'Ostrzeżenie': 'Halt erwarten', 'Stój': 'Halt',
      'Permisywny': 'Permissiv', 'Ograniczenie': 'Beschränkung', 'Wjazd do tunelu': 'Tunneleinfahrt', 'Wyjazd z tunelu': 'Tunnelausfahrt',
      'Clear · jedź': 'Clear · fahren', 'Approach · szykuj hamowanie': 'Approach · Bremsung vorbereiten', 'Stop · zatrzymaj się': 'Stop · anhalten',
      'CZUWAK — POTWIERDŹ!': 'SIFA — BESTÄTIGEN!', 'POŚLIZG KÓŁ': 'SCHLEUDERN', 'WOLNA DROGA': 'FAHRT', 'OSTRZEŻENIE': 'HALT ERWARTEN', 'STÓJ': 'HALT',
      'Następny semafor': 'Nächstes Signal', 'Następne ograniczenie': 'Nächste Beschränkung', 'Komunikat': 'Meldung', 'Nastawnik': 'Fahrschalter', 'Pochylenie': 'Neigung',
      'przed pociągiem': 'vor dem Zug', 'jazda': 'Fahrt', 'czas': 'Zeit', 'gra': 'Spiel', 'przekroczenia': 'Überschreitungen', 'przysp.': 'Beschl.', 'hamulec': 'Bremse',
      'napęd': 'Zugkraft', 'szlak': 'Strecke', 'naprzód': 'vorwärts', 'wstecz': 'rückwärts', 'neutral': 'neutral', '🚉 postój': '🚉 Halt',
      'LIMIT': 'LIMIT', 'POTEM': 'DANN', 'SIŁA  hamowanie ◂ ▸ napęd': 'ZUGKRAFT  Bremse ◂ ▸ Antrieb', 'PRZYSPIESZENIE': 'BESCHLEUNIGUNG',
      'jazda z napędem': 'Fahrt mit Zugkraft', 'hamowanie': 'Bremsen', 'wybieg': 'Auslauf', 'postój': 'Halt',
      'zatrzymaj się przed semaforem': 'vor dem Signal anhalten', 'przygotuj się: następny „stój” albo zwolnij': 'vorbereiten: nächstes „Halt” oder verzögern',
      'jedź z dozwoloną prędkością': 'mit zulässiger Geschwindigkeit fahren',
      '▲ NAPRZÓD': '▲ VORWÄRTS', '▼ WSTECZ': '▼ RÜCKWÄRTS', 'potem': 'dann', 'za': 'in', 'głos: wył.': 'Stimme: aus',
    },
    rx: [
      [/Przeglądarka wstrzymała dźwięk lektora — kliknij ten ekran, żeby włączyć radio \(do tego czasu mówi głos systemowy\)/, 'Der Browser hat den Ton angehalten — Bildschirm anklicken, um den Funk einzuschalten (bis dahin spricht die Systemstimme)'],
      [/Droga wolna — jedź do (\d+) km\/h/, 'Fahrt frei — bis $1 km/h'], [/następne ograniczenie: (\d+) km\/h za /, 'nächste Beschränkung: $1 km/h in '],
      [/Można przyspieszyć do/g, 'Beschleunigen auf'], [/Zwolnij do/g, 'Verzögern auf'], [/Za szybko o (\d+) km\/h/, 'Zu schnell um $1 km/h'],
      [/Obowiązuje (\d+) km\/h/, '$1 km/h gilt'], [/Hamowanie za/g, 'Bremspunkt in'], [/HAMUJ MOCNO!/, 'STARK BREMSEN!'], [/HAMUJ TERAZ/, 'JETZT BREMSEN'],
      [/Hamuj na stację/g, 'Bremsen für Bahnhof'], [/Semafor wskazuje „STÓJ”/, 'Signal zeigt „HALT”'], [/Semafor zmienił się na „STÓJ”/, 'Signal wechselt auf „HALT”'],
      [/Semafor zmienił się na ostrzegawczy/, 'Signal wechselt auf Halt erwarten'], [/Semafor: sygnał ostrzegawczy/, 'Signal: Halt erwarten'],
      [/Semafor permisywny „STÓJ”/, 'Permissives Signal „HALT”'], [/Semafor ostrzegawczy/g, 'Vorsignal'], [/semafor ostrzegawczy/g, 'Vorsignal'],
      [/semafor „STÓJ”/g, 'Signal „HALT”'], [/Semafor/g, 'Signal'], [/semafor/g, 'Signal'], [/Czekaj na sygnał/, 'Auf Signal warten'], [/CZUWAK — potwierdź!/, 'SIFA — bestätigen!'],
      [/naciśnij przycisk czuwaka, inaczej nagłe hamowanie/, 'Sifa drücken, sonst Zwangsbremsung'], [/naciśnij przycisk czuwaka/, 'Sifa drücken'], [/Poślizg kół/, 'Schleudern'],
      [/zmniejsz nastawnik, użyj piasecznicy/, 'Fahrschalter zurück, sanden'], [/Zwolnij — sygnał ostrzegawczy/, 'Verzögern — Halt erwarten'],
      [/Wzniesienie/g, 'Steigung'], [/Spadek/g, 'Gefälle'], [/Tunel za/g, 'Tunnel in'], [/Wjazd do tunelu/g, 'Tunneleinfahrt'], [/Stacja/g, 'Bahnhof'], [/\(przystanek\)/g, '(Haltepunkt)'],
      [/przystanek/g, 'Haltepunkt'], [/Odjazd/g, 'Abfahrt'], [/postój/g, 'Halt'], [/ograniczenie tymczasowe – roboty/g, 'Langsamfahrstelle – Bauarbeiten'],
      [/ograniczenie z semafora/g, 'Beschränkung durch Signal'], [/ograniczenie szlakowe/g, 'Streckenhöchstgeschwindigkeit'], [/ograniczenie/g, 'Beschränkung'], [/Ograniczenie/g, 'Beschränkung'],
      [/koniec pociągu minął koniec ograniczenia/, 'Zugschluss hat die Beschränkung verlassen'], [/przyspiesz dopiero, gdy koniec składu minie znak/, 'erst beschleunigen, wenn der Zugschluss das Signal passiert hat'],
      [/koniec pociągu minie znak za/, 'Zugschluss passiert das Signal in'], [/Wkrótce/g, 'Bald'], [/można/g, 'erlaubt'], [/jedziesz (\d+) km\/h — hamuj/, 'du fährst $1 km/h — bremsen'],
      [/wjazd na ograniczenie/, 'Einfahrt in Beschränkung'], [/do zatrzymania/g, 'bis zum Halt'], [/potrzeba/g, 'nötig'], [/hamuj/g, 'bremsen'], [/czekaj na zmianę/g, 'auf Wechsel warten'],
      [/następny może wskazywać „stój”/g, 'nächstes kann „Halt” zeigen'], [/bądź gotów hamować/g, 'bremsbereit sein'], [/zredukuj prędkość/g, 'Geschwindigkeit reduzieren'],
      [/można minąć po zatrzymaniu, dalej jazda na widoczność/, 'nach dem Halt vorbeifahren, dann Fahrt auf Sicht'], [/zatrzymaj się/g, 'anhalten'], [/jedź/g, 'fahren'],
      [/szykuj hamowanie/g, 'Bremsung vorbereiten'], [/permisywny/g, 'permissiv'], [/ręcznie/g, 'manuell'], [/wróć/g, 'zurück'], [/widok/g, 'Sicht'], [/za (?=\d)/g, 'in '],
      [/tymczasowe \(roboty\)/g, 'vorübergehend (Bauarbeiten)'], [/szlakowe/g, 'Strecke'], [/z semafora/g, 'durch Signal'], [/zwrotnica ułożona przeciwnie/g, 'Weiche falsch gestellt'],
      [/koniec toru/g, 'Gleisende'], [/nacisk osi/g, 'Achslast'], [/tempomat/g, 'Tempomat'], [/Wolna droga/g, 'Fahrt'], [/Ostrzeżenie/g, 'Halt erwarten'], [/Stój/g, 'Halt'],
      [/Gra podaje 3 klasy sygnału.*$/, 'Das Spiel liefert 3 Signalklassen (Clear / Approach / Stop), kein genaues Signalbild. Bahnhöfe aus OpenStreetMap (≈ Luftlinie), Zeiten in Spielzeit, Bremsung mit 0,5 m/s².'],
      [/Uruchom grę przyciskiem.*$/, 'Starte das Spiel im Portal (Karte Ekranik, „Alles starten”) und steig in den Führerstand.'],
      [/^Trasa · /, 'Strecke · '], [/przed pociągiem/g, 'vor dem Zug'], [/stoi za/g, 'Halt in'], [/wolna droga za/g, 'Fahrt in'], [/(\d) wag\./g, '$1 Wagen'],
      [/ZA SZYBKO — LIMIT/g, 'ZU SCHNELL — LIMIT'], [/Ostatnia jazda:/g, 'Letzte Fahrt:'], [/przekroczenia/g, 'Überschreitungen'], [/można przyspieszyć ↑/g, 'beschleunigen ↑'], [/zwolnij ↓/g, 'verzögern ↓'],
      [/pulpit włączy się sam/g, 'der Führerstand startet automatisch'],
      [/następna:/g, 'nächster:'], [/tymczasowe/g, 'vorübergehend'], [/zwrotnica/g, 'Weiche'],
      [/stój/g, 'Halt'], [/wolna droga/g, 'Fahrt'],
      [/^Stan: /, 'Status: '], [/gra nie działa/, 'Spiel läuft nicht'], [/gra się wczytuje/, 'Spiel lädt'], [/mówi: /, 'spricht: '], [/głos: /, 'Stimme: '],
    ],
  };
  const en = {
    ui: {
      'Rozkład maszynisty': "Driver's timetable", 'Telemetria pociągu': 'Train telemetry', 'Komunikat dla maszynisty': 'Message to driver',
      'Twój rozkład · postoje': 'Your timetable · stops', 'Profil trasy · najbliższe': 'Route profile · next', 'Prędkość · ostatnie 3 min': 'Speed · last 3 min',
      'Nastawnik jazdy': 'Power handle', 'Hamulec': 'Brake', 'Przejechane': 'Distance', 'Średnia': 'Average', 'V max': 'V max', 'Przekroczenia': 'Overspeeds',
      'NASTĘPNA STACJA': 'NEXT STATION', 'następna stacja': 'next station', 'Stacja': 'Station', 'Przyjazd': 'Arr', 'Odjazd': 'Dep', 'Postój': 'Dwell',
      'siła': 'tractive effort', 'przyspieszenie': 'acceleration', 'pochylenie': 'gradient', 'manometr': 'brake gauge', 'semafor': 'signal', 'teraz · potem': 'now · next',
      'w grze': 'game time', 'RADIO': 'RADIO', 'NA ANTENIE': 'ON AIR', 'MEGAFON': 'PA', 'LOKALNIE': 'LOCAL', 'kanał wolny': 'channel clear',
      '— limit': '— limit', '▬ wysokość': '▬ elevation', '┅ dozwolona prędkość': '┅ permitted speed', '▮ semafory': '▮ signals', '░ tunel': '░ tunnel',
      'Czekam na Train Sim World': 'Waiting for Train Sim World', 'szukam stacji…': 'looking for station…', 'stoi': 'stopped', 'postój na szlaku': 'stopped on the line',
      'postoje zapiszą się same, gdy pociąg stanie na stacji': 'stops are recorded automatically when the train stops at a station',
      'Pociąg': 'Train', 'wag.': 'cars', 'poza skalą': 'off scale', 'Wolna droga': 'Clear', 'Ostrzeżenie': 'Caution', 'Stój': 'Danger',
      'Permisywny': 'Permissive', 'Ograniczenie': 'Restriction', 'Wjazd do tunelu': 'Tunnel entry', 'Wyjazd z tunelu': 'Tunnel exit',
      'Clear · jedź': 'Clear · proceed', 'Approach · szykuj hamowanie': 'Approach · prepare to brake', 'Stop · zatrzymaj się': 'Stop · stop the train',
      'CZUWAK — POTWIERDŹ!': 'VIGILANCE — ACKNOWLEDGE!', 'POŚLIZG KÓŁ': 'WHEEL SLIP', 'WOLNA DROGA': 'CLEAR', 'OSTRZEŻENIE': 'CAUTION', 'STÓJ': 'DANGER',
      'Następny semafor': 'Next signal', 'Następne ograniczenie': 'Next restriction', 'Komunikat': 'Message', 'Nastawnik': 'Power handle', 'Pochylenie': 'Gradient',
      'przed pociągiem': 'ahead', 'jazda': 'distance', 'czas': 'time', 'gra': 'game', 'przekroczenia': 'overspeeds', 'przysp.': 'accel.', 'hamulec': 'brake',
      'napęd': 'power', 'szlak': 'line', 'naprzód': 'forward', 'wstecz': 'reverse', 'neutral': 'neutral', '🚉 postój': '🚉 stopped',
      'LIMIT': 'LIMIT', 'POTEM': 'NEXT', 'SIŁA  hamowanie ◂ ▸ napęd': 'EFFORT  braking ◂ ▸ power', 'PRZYSPIESZENIE': 'ACCELERATION',
      'jazda z napędem': 'powering', 'hamowanie': 'braking', 'wybieg': 'coasting', 'postój': 'stopped',
      'zatrzymaj się przed semaforem': 'stop before the signal', 'przygotuj się: następny „stój” albo zwolnij': 'be prepared: next at danger or slow down',
      'jedź z dozwoloną prędkością': 'proceed at permitted speed',
      '▲ NAPRZÓD': '▲ FORWARD', '▼ WSTECZ': '▼ REVERSE', 'potem': 'next', 'za': 'in', 'głos: wył.': 'voice: off',
    },
    rx: [
      [/Przeglądarka wstrzymała dźwięk lektora — kliknij ten ekran, żeby włączyć radio \(do tego czasu mówi głos systemowy\)/, 'The browser paused the announcer audio — click this screen to enable the radio (the system voice speaks until then)'],
      [/Droga wolna — jedź do (\d+) km\/h/, 'Clear — proceed up to $1 km/h'], [/następne ograniczenie: (\d+) km\/h za /, 'next restriction: $1 km/h in '],
      [/Można przyspieszyć do/g, 'Accelerate to'], [/Zwolnij do/g, 'Slow to'], [/Za szybko o (\d+) km\/h/, 'Overspeed by $1 km/h'],
      [/Obowiązuje (\d+) km\/h/, '$1 km/h applies'], [/Hamowanie za/g, 'Brake in'], [/HAMUJ MOCNO!/, 'BRAKE HARD!'], [/HAMUJ TERAZ/, 'BRAKE NOW'],
      [/Hamuj na stację/g, 'Brake for station'], [/Semafor wskazuje „STÓJ”/, 'Signal at DANGER'], [/Semafor zmienił się na „STÓJ”/, 'Signal changed to DANGER'],
      [/Semafor zmienił się na ostrzegawczy/, 'Signal changed to caution'], [/Semafor: sygnał ostrzegawczy/, 'Signal: caution'],
      [/Semafor permisywny „STÓJ”/, 'Permissive signal at DANGER'], [/Semafor ostrzegawczy/g, 'Caution signal'], [/semafor ostrzegawczy/g, 'caution signal'],
      [/semafor „STÓJ”/g, 'signal at danger'], [/Semafor/g, 'Signal'], [/semafor/g, 'signal'], [/Czekaj na sygnał/, 'Wait for the signal'], [/CZUWAK — potwierdź!/, 'VIGILANCE — acknowledge!'],
      [/naciśnij przycisk czuwaka, inaczej nagłe hamowanie/, 'press the vigilance button or the brakes will apply'], [/naciśnij przycisk czuwaka/, 'press the vigilance button'], [/Poślizg kół/, 'Wheel slip'],
      [/zmniejsz nastawnik, użyj piasecznicy/, 'reduce power, apply sand'], [/Zwolnij — sygnał ostrzegawczy/, 'Slow down — caution signal'],
      [/Wzniesienie/g, 'Rising gradient'], [/Spadek/g, 'Falling gradient'], [/Tunel za/g, 'Tunnel in'], [/Wjazd do tunelu/g, 'Tunnel entry'], [/Stacja/g, 'Station'], [/\(przystanek\)/g, '(halt)'],
      [/przystanek/g, 'halt'], [/Odjazd/g, 'Departure'], [/postój/g, 'dwell'], [/ograniczenie tymczasowe – roboty/g, 'temporary restriction – engineering works'],
      [/ograniczenie z semafora/g, 'restriction from signal'], [/ograniczenie szlakowe/g, 'line speed restriction'], [/ograniczenie/g, 'restriction'], [/Ograniczenie/g, 'Restriction'],
      [/koniec pociągu minął koniec ograniczenia/, 'rear of train has cleared the restriction'], [/przyspiesz dopiero, gdy koniec składu minie znak/, 'accelerate only when the rear has passed the sign'],
      [/koniec pociągu minie znak za/, 'rear passes the sign in'], [/Wkrótce/g, 'Soon'], [/można/g, 'allowed'], [/jedziesz (\d+) km\/h — hamuj/, 'you are at $1 km/h — brake'],
      [/wjazd na ograniczenie/, 'entering restriction'], [/do zatrzymania/g, 'to a stand'], [/potrzeba/g, 'needed'], [/hamuj/g, 'brake'], [/czekaj na zmianę/g, 'wait for it to change'],
      [/następny może wskazywać „stój”/g, 'next may be at danger'], [/bądź gotów hamować/g, 'be ready to brake'], [/zredukuj prędkość/g, 'reduce speed'],
      [/można minąć po zatrzymaniu, dalej jazda na widoczność/, 'may pass after stopping, then proceed at caution'], [/zatrzymaj się/g, 'stop'], [/jedź/g, 'proceed'],
      [/szykuj hamowanie/g, 'prepare to brake'], [/permisywny/g, 'permissive'], [/ręcznie/g, 'manual'], [/wróć/g, 'back'], [/widok/g, 'view'], [/za (?=\d)/g, 'in '],
      [/tymczasowe \(roboty\)/g, 'temporary (engineering works)'], [/szlakowe/g, 'line speed'], [/z semafora/g, 'from signal'], [/zwrotnica ułożona przeciwnie/g, 'points set against'],
      [/koniec toru/g, 'end of line'], [/nacisk osi/g, 'axle load'], [/tempomat/g, 'cruise'], [/Wolna droga/g, 'Clear'], [/Ostrzeżenie/g, 'Caution'], [/Stój/g, 'Danger'],
      [/Gra podaje 3 klasy sygnału.*$/, 'The game reports 3 signal classes (Clear / Approach / Stop), not the exact aspect. Stations from OpenStreetMap (≈ straight line), times in game time, braking at 0.5 m/s².'],
      [/Uruchom grę przyciskiem.*$/, 'Start the game from the portal (Ekranik card, “Start everything”) and get into the cab.'],
      [/^Trasa · /, 'Route · '], [/przed pociągiem/g, 'ahead'], [/stoi za/g, 'danger in'], [/wolna droga za/g, 'clear in'], [/(\d) wag\./g, '$1 cars'],
      [/ZA SZYBKO — LIMIT/g, 'TOO FAST — LIMIT'], [/Ostatnia jazda:/g, 'Last run:'], [/przekroczenia/g, 'overspeeds'], [/można przyspieszyć ↑/g, 'accelerate ↑'], [/zwolnij ↓/g, 'slow down ↓'],
      [/pulpit włączy się sam/g, 'the cab display starts by itself'],
      [/następna:/g, 'next:'], [/tymczasowe/g, 'temporary'], [/zwrotnica/g, 'points'],
      [/stój/g, 'danger'], [/wolna droga/g, 'clear'],
      [/^Stan: /, 'Status: '], [/gra nie działa/, 'game not running'], [/gra się wczytuje/, 'game is loading'], [/mówi: /, 'speaks: '], [/głos: /, 'voice: '],
    ],
  };
  I.ui = { de, en };
  // T(napis): tłumaczenie dla aktywnego języka (polski bez zmian)
  window.T = function (s) {
    const P = I.ui[I.lang]; if (!P || s == null) return s; const k = String(s);
    if (P.ui[k.trim()] != null) return k.replace(k.trim(), P.ui[k.trim()]);
    let out = k; for (const [re, to] of P.rx) out = out.replace(re, to); return out;
  };
  // napisy na stronie: tłumaczone przy pojawieniu się i każdej zmianie (bez dotykania logiki ekranów)
  window.TswUiTranslate = function (root) {
    if (!I.ui[I.lang]) return;
    document.documentElement.lang = I.lang;
    const done = new WeakMap();
    const fix = (n) => { if (n.nodeType !== 3 || !n.nodeValue || !/[a-ząćęłńóśźż]/i.test(n.nodeValue)) return; if (done.get(n) === n.nodeValue) return;
      const t = window.T(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; done.set(n, n.nodeValue); };
    const walk = (el) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) fix(n); };
    walk(root || document.body);
    new MutationObserver((ms) => ms.forEach((m) => { if (m.type === 'characterData') fix(m.target); else m.addedNodes.forEach((n) => (n.nodeType === 3 ? fix(n) : n.nodeType === 1 && walk(n))); }))
      .observe(root || document.body, { childList: true, subtree: true, characterData: true });
  };
})();
