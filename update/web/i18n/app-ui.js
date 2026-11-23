/* Język interfejsu TSW Asystenta (okno programu, ustawienia lektora, dziennik, sterowanie w telefonie) — pl / de / en.
   Polski = oryginał w HTML/JS. Tłumaczenie napisów przy pojawieniu się i przy każdej zmianie (MutationObserver), także atrybutów
   placeholder / title / alt / aria-label; logika stron bez zmian. Język interfejsu jest niezależny od języka lektora.
   Wybór: ?ui=xx → ustawienie programu (uiLang) → język systemu/przeglądarki (pl / de, inne → en). */
(function () {
  const ws = (s) => String(s).replace(/\s+/g, ' ').trim();
  const D = {};

  /* ======================================================================= DEUTSCH */
  D.de = {
    ui: {
      // --- okno programu ---
      'lektor i ekrany do Train Sim World 7': 'Sprecher und Bildschirme für Train Sim World 7',
      'Stan': 'Status', 'sprawdzam…': 'prüfe…', 'Gra musi działać z telemetrią (parametr': 'Das Spiel muss mit Telemetrie laufen (Parameter',
      ') — przycisk „Uruchom grę” robi to sam.': ') — die Schaltfläche „Spiel starten“ erledigt das automatisch.',
      'Jazda': 'Fahrt', 'Uruchom grę + rozkład': 'Spiel + Fahrplan starten', 'Otwórz rozkład': 'Fahrplan öffnen', 'Zamknij rozkład': 'Fahrplan schließen',
      'Rozkład (mapa, lektor) otwiera się na drugim monitorze, gdy jest podłączony.': 'Der Fahrplan (Karte, Sprecher) öffnet sich auf dem zweiten Monitor, wenn einer angeschlossen ist.',
      'Rozkład w oknie': 'Fahrplan im Fenster', 'Pulpit': 'Führerstand', 'Ustawienia lektora': 'Sprecher-Einstellungen', 'Dziennik lektora': 'Sprecher-Protokoll',
      'Pokaz bez gry': 'Demo ohne Spiel',
      'Telefon / tablet (ta sama sieć Wi-Fi)': 'Handy / Tablet (gleiches WLAN)', 'kod QR': 'QR-Code', 'Zeskanuj aparatem —': 'Mit der Kamera scannen —',
      'pobierz aplikację': 'App herunterladen', 'Udostępnij w sieci lokalnej (telefon / tablet)': 'Im lokalen Netzwerk freigeben (Handy / Tablet)',
      'Aplikacja': 'App', 'na Androida: zeskanuj kod QR aparatem telefonu, pobierz i zainstaluj (telefon zapyta o zgodę na instalację z tego źródła). Potem otwórz ją — sama znajdzie ten komputer.':
        'für Android: QR-Code mit der Handykamera scannen, herunterladen und installieren (das Handy fragt nach der Erlaubnis für diese Quelle). Danach öffnen — sie findet diesen PC selbst.',
      'Zapora Windows blokuje telefon.': 'Die Windows-Firewall blockiert das Handy.', 'Program działa, ale połączenia z sieci są zatrzymywane.': 'Das Programm läuft, aber Verbindungen aus dem Netzwerk werden blockiert.',
      'Zezwól w zaporze Windows': 'In der Windows-Firewall erlauben',
      'Windows zapyta o zgodę administratora. Reguła dotyczy tylko tego programu i tylko sieci prywatnych (domowych).': 'Windows fragt nach Administratorrechten. Die Regel gilt nur für dieses Programm und nur für private Netzwerke (Heimnetz).',
      'Aplikacja Android „TSW Ekran” znajduje ten komputer sama (przycisk „Szukaj”) i łączy się z ostatnio używanym. W przeglądarce telefonu wpisz adres powyżej. Przy pierwszym starcie Windows zapyta o zgodę zapory — zaznacz „Sieci prywatne”.':
        'Die Android-App „TSW Ekran“ findet diesen PC selbst („Suchen“) und verbindet sich mit dem zuletzt genutzten. Im Handy-Browser die Adresse oben eingeben. Beim ersten Start fragt die Windows-Firewall — „Private Netzwerke“ ankreuzen.',
      'Prywatność:': 'Datenschutz:',
      'po włączeniu LAN połączenie Android–PC używa HTTP/UDP bez szyfrowania; korzystaj tylko z zaufanej sieci. Podgląd udostępnia bieżące dane jazdy. Funkcje online wysyłają tekst komunikatu do Microsoft Edge TTS, a współrzędne pociągu do Overpass/OpenStreetMap; kafelki mapy są pobierane z OpenStreetMap.':
        'Bei aktiviertem LAN nutzt die Verbindung Android–PC unverschlüsseltes HTTP/UDP; nur in vertrauenswürdigen Netzwerken verwenden. Die Vorschau zeigt aktuelle Fahrdaten. Online-Funktionen senden den Meldungstext an Microsoft Edge TTS und die Zugposition an Overpass/OpenStreetMap; Kartenkacheln kommen von OpenStreetMap.',
      'Głosy offline (przygotowanie z góry)': 'Offline-Stimmen (vorab erstellen)', 'Przygotuj': 'Erstellen', 'Anuluj': 'Abbrechen',
      'Stałe komunikaty z jazdy (ok. 2700 na głos; 20–40 minut, raz, w tle — można jeździć). Nagrania trafiają do osobnej paczki, której nie czyści pamięć podręczna; przerwane przygotowanie wznawia się od miejsca, w którym stanęło. Nietypowe liczby lektor dociąga w trakcie jazdy.':
        'Feste Fahrtmeldungen (ca. 2700 pro Stimme; 20–40 Minuten, einmalig, im Hintergrund — Fahren möglich). Die Aufnahmen landen in einem eigenen Paket, das der Cache nicht löscht; ein Abbruch wird an derselben Stelle fortgesetzt. Ungewöhnliche Zahlen lädt der Sprecher während der Fahrt nach.',
      'Tylko lokalnie — nie wysyłaj tekstu do usługi online (gotowe nagrania i głos Windows)': 'Nur lokal — keinen Text an den Online-Dienst senden (fertige Aufnahmen und Windows-Stimme)',
      'przygotowanie głosów': 'Stimmen erstellen',
      'Sterowanie z telefonu': 'Steuerung per Handy', 'Pozwól sterować pociągiem z telefonu': 'Zugsteuerung per Handy erlauben', 'Kod parowania:': 'Kopplungscode:',
      'Na telefonie: aplikacja TSW Ekran → przesuń palcem w bok → „Sterowanie” → wpisz kod. Kod działa raz.': 'Am Handy: App TSW Ekran → zur Seite wischen → „Steuerung“ → Code eingeben. Der Code gilt einmal.',
      'Dźwignie (nastawnik, hamulce, nawrotnik) program ustawia bezpośrednio przez API gry. Przyciski funkcji wciskają klawisze gry (domyślne skróty TSW: Q czuwak, spacja syrena, H reflektory…) tylko wtedy, gdy na pierwszym planie jest okno Train Sim World.':
        'Hebel (Fahrschalter, Bremsen, Wendeschalter) stellt das Programm direkt über die Spiel-API. Funktionstasten drücken Spieltasten (TSW-Standard: Q Sifa, Leertaste Horn, H Scheinwerfer…) nur, wenn das Fenster von Train Sim World im Vordergrund ist.',
      'Klawisze sterowania z telefonu': 'Tasten der Handy-Steuerung', 'Pokaż i zmień klawisze (gdy w Twojej grze skrót jest inny)': 'Tasten anzeigen und ändern (wenn dein Spiel andere Kürzel nutzt)',
      'Zapis: litera, cyfra, znak (; \' , . [ ] / -) albo SPACE, BACKSPACE, ESC, TAB, ENTER, F1…F12, NUM0…NUM9, strzałki UP/DOWN/LEFT/RIGHT; z modyfikatorem: SHIFT+H, CTRL+M, ALT+1. Puste pole = domyślny skrót TSW.':
        'Schreibweise: Buchstabe, Ziffer, Zeichen (; \' , . [ ] / -) oder SPACE, BACKSPACE, ESC, TAB, ENTER, F1…F12, NUM0…NUM9, Pfeile UP/DOWN/LEFT/RIGHT; mit Modifikator: SHIFT+H, CTRL+M, ALT+1. Leer = TSW-Standard.',
      'Własne przyciski na telefonie': 'Eigene Tasten am Handy', '+ Dodaj przycisk': '+ Taste hinzufügen', 'Zapisz klawisze': 'Tasten speichern',
      'napis na przycisku': 'Beschriftung', 'klawisz, np. SHIFT+H': 'Taste, z. B. SHIFT+H', 'przytrzymywany': 'gehalten', 'Usuń': 'Entfernen',
      'Panel LED (Bluetooth, BK-Light ACT1025 64×16)': 'LED-Panel (Bluetooth, BK-Light ACT1025 64×16)', 'podgląd panelu': 'Panel-Vorschau',
      'Szukaj paneli': 'Panels suchen', 'Zapomnij panel': 'Panel vergessen', 'Jasność': 'Helligkeit', 'Szukam…': 'Suche…', 'Sparowany': 'Gekoppelt', 'Paruj': 'Koppeln',
      'Włącz panel blisko komputera. Panel przyjmuje jedno połączenie — zamknij aplikację panelu w telefonie. Po sparowaniu program łączy się z nim sam przy każdym starcie. Podgląd obok pokazuje, co wyświetla panel.':
        'Panel in PC-Nähe einschalten. Das Panel nimmt nur eine Verbindung an — die Panel-App am Handy schließen. Nach dem Koppeln verbindet sich das Programm bei jedem Start selbst. Die Vorschau zeigt, was das Panel anzeigt.',
      'brak sparowanego panelu': 'kein Panel gekoppelt',
      'Aktualizacje': 'Updates', 'Sprawdź': 'Prüfen', 'Zainstaluj': 'Installieren',
      'Aktualizacja podmienia tylko pliki programu (exe i katalog web). Ustawienia, dziennik, nagrania głosów i jazdy zostają nietknięte.':
        'Ein Update ersetzt nur Programmdateien (exe und Ordner web). Einstellungen, Protokoll, Sprachaufnahmen und Fahrten bleiben unverändert.',
      'Nie sprawdzano.': 'Noch nicht geprüft.', 'Pobieram i sprawdzam pliki…': 'Lade und prüfe Dateien…', 'Masz najnowszą wersję.': 'Du hast die neueste Version.',
      'Program': 'Programm', 'Uruchamiaj razem z Windows (w tle)': 'Mit Windows starten (im Hintergrund)', 'Dane i ustawienia:': 'Daten und Einstellungen:',
      'Folder danych': 'Datenordner', 'Logi': 'Logs', 'Zakończ program': 'Programm beenden',
      'Język programu': 'Programmsprache', 'Język lektora': 'Sprecher-Sprache', 'głos i ile mówi: „Ustawienia lektora”': 'Stimme und Umfang: „Sprecher-Einstellungen“',
      'czekam na grę': 'warte auf das Spiel', 'program nie odpowiada': 'Programm antwortet nicht', 'wykonuję…': 'führe aus…', 'nie udało się': 'fehlgeschlagen',
      'lektor: głos online (Edge TTS) + pamięć nagrań': 'Sprecher: Online-Stimme (Edge TTS) + Aufnahmespeicher', 'lektor: tylko głos Windows (brak syntezy online)': 'Sprecher: nur Windows-Stimme (keine Online-Synthese)',
      'podgląd w sieci wyłączony — zaznacz pole powyżej, żeby połączyć telefon': 'Netzwerkvorschau aus — Feld oben ankreuzen, um ein Handy zu verbinden',
      'brak połączenia z siecią lokalną': 'keine Verbindung zum lokalen Netzwerk', 'Odłącz': 'Trennen', 'Brak sparowanych telefonów.': 'Keine gekoppelten Handys.',
      'układam listę komunikatów…': 'erstelle Meldungsliste…', 'Będzie startować z Windows': 'Startet mit Windows', 'Autostart wyłączony': 'Autostart aus',
      'Aktualizuję — program uruchomi się ponownie dopiero po potwierdzeniu': 'Aktualisiere — das Programm startet nach der Bestätigung neu',
      'Lektor pracuje lokalnie — tekst nie wychodzi z komputera': 'Sprecher arbeitet lokal — kein Text verlässt den PC', 'Głosy online włączone': 'Online-Stimmen an',
      'Zapisano — zamknij i uruchom ponownie TSW Asystenta, żeby zmiana zadziałała': 'Gespeichert — TSW Asystent schließen und neu starten, damit es wirkt',
      'Udostępnianie w sieci włączone': 'Netzwerkfreigabe an', 'Udostępnianie w sieci wyłączone': 'Netzwerkfreigabe aus',
      'Sterowanie z telefonu włączone': 'Handy-Steuerung an', 'Sterowanie z telefonu wyłączone': 'Handy-Steuerung aus',
      'Potwierdź w oknie Windows (zgoda administratora)': 'Im Windows-Fenster bestätigen (Administratorrechte)',
      'Zapisano — telefon pobierze nowe przyciski po odświeżeniu karty.': 'Gespeichert — das Handy lädt die neuen Tasten nach dem Aktualisieren.', 'błąd zapisu': 'Speicherfehler',
      'Zainstalować aktualizację? TSW Asystent zostanie zamknięty i uruchomiony ponownie.': 'Update installieren? TSW Asystent wird geschlossen und neu gestartet.',
      'Zakończyć TSW Asystenta? Lektor i ekrany przestaną działać.': 'TSW Asystent beenden? Sprecher und Bildschirme stoppen.',
      'Zapomnieć panel LED? Program przestanie się z nim łączyć.': 'LED-Panel vergessen? Das Programm verbindet sich nicht mehr damit.',
      'TSW Asystent zakończony': 'TSW Asystent beendet', 'Uruchom TSW-Asystent.exe, żeby wrócić.': 'TSW-Asystent.exe starten, um zurückzukehren.',
      // --- nazwy poleceń sterowania (z programu) ---
      'Nagłe hamowanie': 'Schnellbremsung', 'Nastawnik +': 'Fahrschalter +', 'Nastawnik −': 'Fahrschalter −', 'Nastawnik na 0': 'Fahrschalter auf 0',
      'Hamulec −': 'Bremse −', 'Hamulec +': 'Bremse +', 'Odhamuj': 'Bremse lösen', 'Ham. dynamiczny −': 'E-Bremse −', 'Ham. dynamiczny +': 'E-Bremse +',
      'Ham. lok. −': 'Zusatzbremse −', 'Ham. lok. +': 'Zusatzbremse +', 'Tempomat +': 'AFB +', 'Tempomat −': 'AFB −', 'Nawrotnik ▲': 'Wendeschalter ▲', 'Nawrotnik ▼': 'Wendeschalter ▼',
      'Czuwak': 'Sifa', 'Syrena': 'Horn', 'Syrena 2': 'Horn 2', 'Dzwon': 'Glocke', 'Piasecznica': 'Sanden', 'Pantograf': 'Stromabnehmer', 'Silnik': 'Motor',
      'Ham. postojowy': 'Feststellbremse', 'Wycieraczki': 'Scheibenwischer', 'Wycieraczki szybko': 'Wischer schnell', 'Reflektory': 'Scheinwerfer', 'Przyciemnij': 'Abblenden',
      'Kabina': 'Führerstand', 'Przyrządy': 'Instrumente', 'Koniec pociągu': 'Zugschluss', 'Ostrzegawcze': 'Warnlicht', 'Drzwi lewe': 'Türen links', 'Drzwi prawe': 'Türen rechts',
      'Zamknij drzwi': 'Türen schließen', 'Blokada drzwi': 'Türverriegelung', 'Zewnętrzna': 'Außen', 'Wychylenie': 'Hinauslehnen', 'Pasażer': 'Fahrgast', 'Swobodna': 'Frei',
      'Następna': 'Nächste', 'Mapa': 'Karte', 'Zrzut ekranu': 'Screenshot', 'Pauza': 'Pause',
      // --- telefon (live.html) ---
      'Sterowanie': 'Steuerung', 'Obróć telefon poziomo — pulpit będzie większy. Przesuń palcem w bok — sterowanie.': 'Handy quer halten — größere Anzeige. Zur Seite wischen — Steuerung.',
      'następne ograniczenie: –': 'nächste Begrenzung: –', 'CZUWAK': 'SIFA', 'POŚLIZG': 'SCHLEUDERN', 'TEMPOMAT': 'AFB', 'ZA SZYBKO': 'ZU SCHNELL', 'Nagłe': 'Schnell',
      'Nawrotnik': 'Wendeschalter', 'TYŁ': 'RÜCK', 'PRZÓD': 'VOR', 'Sparuj sterowanie': 'Steuerung koppeln',
      'Wpisz 6-cyfrowy kod z okna TSW Asystenta na PC (karta „Sterowanie z telefonu”). Kod działa raz.': '6-stelligen Code aus dem TSW-Asystent-Fenster am PC eingeben (Karte „Steuerung per Handy“). Der Code gilt einmal.',
      'Sparuj': 'Koppeln', 'pulpit maszynisty': 'Führerstand', 'pokaż pasek': 'Leiste zeigen', 'błąd': 'Fehler', 'brak połączenia z PC': 'keine Verbindung zum PC',
      'Sparowano — możesz sterować': 'Gekoppelt — Steuerung bereit', 'NAGŁE HAMOWANIE': 'SCHNELLBREMSUNG', 'Przytrzymaj nagłe hamowanie pół sekundy': 'Schnellbremsung eine halbe Sekunde halten',
      'Światła': 'Licht', 'Gra': 'Spiel', 'Własne': 'Eigene', 'Hamulec': 'Bremse', 'Ham. dyn.': 'E-Bremse', 'Nastawnik': 'Fahrschalter',
      'Sterowanie z telefonu jest wyłączone w programie na PC': 'Handy-Steuerung ist im Programm am PC ausgeschaltet', 'czekam na jazdę': 'warte auf Fahrt',
      'Drzwi': 'Türen', 'Kamera': 'Kamera', 'Kierunek': 'Richtung', 'Alarm': 'Alarm',
      // --- ustawienia lektora ---
      'Lektor TSW — ustawienia': 'TSW-Sprecher — Einstellungen', 'sprawdzam stan…': 'prüfe Status…', 'Język lektora i ekranów': 'Sprache von Sprecher und Bildschirmen',
      'Polski: pełny słownik wymowy. Niemiecki i angielski: nazwy stacji czytane natywnym głosem.': 'Polnisch: volles Aussprachewörterbuch. Deutsch und Englisch: Bahnhofsnamen mit muttersprachlicher Stimme.',
      'Głos': 'Stimme', 'wyłączony': 'aus', 'Ile mówi lektor': 'Wie viel der Sprecher sagt', 'tylko alarmy': 'nur Alarme', 'ważne': 'wichtig', 'normalnie': 'normal', 'wszystko': 'alles',
      'Efekty radia': 'Funkeffekte', 'na serwerze': 'auf dem Server', 'w przeglądarce': 'im Browser', '2. monitor': '2. Monitor',
      'sam się przeładowuje po wdrożeniu nowej wersji (na postoju)': 'lädt sich nach einer neuen Version selbst neu (im Stillstand)', 'Przeładuj teraz': 'Jetzt neu laden',
      'Test blokady dźwięku': 'Test Ton-Sperre', 'Zapisano': 'Gespeichert', 'Nie udało się zapisać': 'Speichern fehlgeschlagen', 'Brak połączenia z portalem': 'Keine Verbindung zum Programm',
      'Ekranik': 'Führerstand',
      // --- dziennik ---
      'pominięte': 'übersprungen', 'odrzucone': 'verworfen', 'testy / demo': 'Tests / Demo', 'wszystkie języki': 'alle Sprachen', 'Odśwież': 'Aktualisieren',
      'szukaj w tekście…': 'im Text suchen…', 'Nie powiedziane': 'Nicht gesprochen', 'Czekanie na głos': 'Wartezeit auf Stimme', 'Czas': 'Zeit', 'Zdarzenie': 'Ereignis',
      'Komunikat': 'Meldung', 'Prędkość / limit': 'Tempo / Limit', 'Semafor': 'Signal', 'Następne ogr.': 'Nächste Begr.', 'Powód / źródło': 'Grund / Quelle', 'Czekał': 'Wartete',
      '(bez nazwy pociągu)': '(ohne Zugname)', 'powiedziany': 'gesprochen', 'pominięty': 'übersprungen', 'przerwany': 'unterbrochen', 'przeterminowany': 'abgelaufen',
      'zastąpiony': 'ersetzt', 'nieaktualny': 'veraltet', 'błąd mowy': 'Sprachfehler', 'zawieszony': 'hängt', 'dźwięk wstrzymany': 'Ton blockiert',
      'Brak wpisów dla wybranego dnia i filtrów. Dziennik zapisuje 2. monitor podczas jazdy z włączonym głosem.': 'Keine Einträge für Tag und Filter. Das Protokoll schreibt der 2. Monitor während der Fahrt mit Stimme.',
      // --- komunikaty programu (serwer) ---
      'gra nie działa': 'Spiel läuft nicht', 'telemetria gry działa — wsiądź do kabiny pociągu': 'Spiel-Telemetrie läuft — steig in den Führerstand',
      'gra się wczytuje — telemetria ruszy, gdy gra będzie gotowa': 'Spiel lädt — Telemetrie startet, sobald es bereit ist',
      'gra odrzuca klucz API — odczytuję go ponownie': 'Spiel lehnt den API-Schlüssel ab — lese ihn neu',
      'brak klucza API gry (CommAPIKey.txt) — gra tworzy go przy pierwszym starcie z telemetrią': 'kein API-Schlüssel (CommAPIKey.txt) — das Spiel legt ihn beim ersten Start mit Telemetrie an',
      'gra działa bez telemetrii — zamknij ją i uruchom przyciskiem „Uruchom grę” w panelu (parametr -HTTPAPI)': 'Spiel läuft ohne Telemetrie — schließen und mit „Spiel starten“ neu starten (Parameter -HTTPAPI)',
      'masz najnowszą wersję': 'du hast die neueste Version', 'Masz najnowszą wersję': 'Du hast die neueste Version', 'masz nowszą wersję niż na serwerze': 'deine Version ist neuer als auf dem Server',
      'pobieram…': 'lade…', 'naprawa plików programu': 'Programmdateien reparieren', 'panel zapomniany': 'Panel vergessen', 'brak potwierdzenia z panelu': 'keine Bestätigung vom Panel',
      'Aktualizacje wyłączone — brak adresu (config.json → "updateUrl").': 'Updates aus — keine Adresse (config.json → "updateUrl").',
    },
    rx: [
      [/^wersja (.+) · ekrany (.+)$/, 'Version $1 · Bildschirme $2'], [/^jazda: (.*) · (\d+) km\/h$/, 'Fahrt: $1 · $2 km/h'], [/^jazda: pociąg/, 'Fahrt: Zug'],
      [/ · główna karta$/, ' · Hauptadapter'], [/^inne karty sieciowe \(wirtualne: (\d+)\)$/, 'weitere Netzwerkadapter (virtuell: $1)'],
      [/^Ostatnie polecenie: (.*)\.$/, 'Letzter Befehl: $1.'], [/^sparowany /, 'gekoppelt '], [/^(\d+) \/ (\d+) gotowych na dysku/, '$1 / $2 auf der Festplatte'],
      [/ · nieudane: (\d+)/, ' · fehlgeschlagen: $1'], [/^Gotowe: (\d+) z (\d+) nagrań/, 'Fertig: $1 von $2 Aufnahmen'], [/\(nieudane: (\d+) — „Przygotuj” dokończy brakujące\)/, '(fehlgeschlagen: $1 — „Erstellen“ ergänzt den Rest)'],
      [/^Anulowano: (\d+) z (\d+) gotowych — „Przygotuj” wznowi od tego miejsca\./, 'Abgebrochen: $1 von $2 fertig — „Erstellen“ setzt hier fort.'], [/^Błąd: /, 'Fehler: '],
      [/^Paruję z /, 'Kopple mit '], [/ · sygnał (\S+) dBm$/, ' · Signal $1 dBm'], [/\((\d+) kl\/s\)/, '($1 B/s)'], [/^połączono: /, 'verbunden: '], [/^Bluetooth niedostępny: /, 'Bluetooth nicht verfügbar: '],
      [/ — ponawiam za 5 s$/, ' — neuer Versuch in 5 s'], [/^nie znaleziono — .*$/, 'nicht gefunden — Panel eingeschaltet, in PC-Nähe und nicht mit einem anderen Gerät verbunden?'],
      [/^Dostępna wersja (\S+) \((\d+) plików\)\./, 'Version $1 verfügbar ($2 Dateien).'], [/\((\d+) plików\)/, '($1 Dateien)'], [/^dostępna wersja /i, 'verfügbar: Version '],
      [/^zaktualizowano do /, 'aktualisiert auf '], [/^zaktualizowano — uruchamiam ponownie$/, 'aktualisiert — starte neu'], [/^nie udało się sprawdzić: /, 'Prüfung fehlgeschlagen: '],
      [/^aktualizacja przerwana \(nic nie zmieniono w danych\): /, 'Update abgebrochen (keine Daten geändert): '],
      [/rozkład już otwarty/g, 'Fahrplan bereits offen'], [/otwarto rozkład w przeglądarce \(nie znalazłem Edge — okno ustaw ręcznie\)/g, 'Fahrplan im Browser geöffnet (Edge nicht gefunden — Fenster selbst platzieren)'],
      [/otwarto rozkład na (\d+)\. monitorze/g, 'Fahrplan auf Monitor $1 geöffnet'], [/otwarto rozkład \(jeden monitor — okno\)/g, 'Fahrplan geöffnet (ein Monitor — Fenster)'], [/zamknięto rozkład/g, 'Fahrplan geschlossen'],
      [/gra już działa/g, 'Spiel läuft bereits'], [/gra działa BEZ telemetrii — zamknij ją i kliknij jeszcze raz \(wystartuje z -HTTPAPI\)/g, 'Spiel läuft OHNE Telemetrie — schließen und erneut klicken (startet mit -HTTPAPI)'],
      [/gra na pierwszym planie/g, 'Spiel im Vordergrund'], [/nie udało się przełączyć na grę/g, 'Wechsel zum Spiel fehlgeschlagen'], [/uruchamiam Train Sim World 7 \(z telemetrią\)/g, 'starte Train Sim World 7 (mit Telemetrie)'],
      [/nie znalazłem gry — wpisz ścieżkę TrainSimWorld\.exe w ustawieniach \(gameExe\)/g, 'Spiel nicht gefunden — Pfad zu TrainSimWorld.exe in den Einstellungen eintragen (gameExe)'],
      [/^gra zamknięta — /, 'Spiel beendet — '], [/ na 0$/, ' auf 0'], [/^Jazda: /, 'Fahrt: '], [/^Gra nie jedzie/, 'Spiel fährt nicht'], [/ · ostatnio /, ' · zuletzt '], [/ · limit /, ' · Limit '],
      [/^Język: /, 'Sprache: '], [/^Głos: /, 'Stimme: '], [/^Lektor: /, 'Sprecher: '], [/^Efekty: /, 'Effekte: '],
      [/^2\. monitor przeładuje się, gdy lektor skończy mówić$/, '2. Monitor lädt neu, sobald der Sprecher fertig ist'], [/^Test wysłany — 2\. monitor sprawdza go co 30 s$/, 'Test gesendet — der 2. Monitor prüft alle 30 s'],
      [/^Wspólne dla 2\. monitora i Ekranika\..*$/, 'Gilt für den 2. Monitor und den Führerstand. Änderungen wirken sofort: der 2. Monitor lädt neu, sobald der Sprecher fertig ist.'],
      [/^Na serwerze \(domyślnie\).*$/, 'Auf dem Server (Standard): fertige Funkaufnahmen. Im Browser: klare Stimme, Funk und Lautsprecher werden lokal hinzugefügt.'],
      [/^Test blokady: .*$/, 'Sperrtest: der 2. Monitor simuliert blockierten Ton — die nächste Meldung spricht die Systemstimme, ein roter Balken erscheint, ein Klick stellt den Funk wieder her.'],
      [/^z serwera \((?:VPS|online)\) (\d+) · lokalnie (\d+)/, 'online $1 · lokal $2'], [/^mediana/, 'Median'], [/najdłużej/g, 'längste'],
      [/ · powiedziane (\d+)/g, ' · gesprochen $1'], [/ · nie powiedziane (\d+)/g, ' · nicht gesprochen $1'], [/lokalnie (\d+)/g, 'lokal $1'],
      [/^następne: /, 'nächste: '], [/ km\/h za /, ' km/h in '], [/^— trzymam klawisz, aż gra pokaże zero$/, '— halte die Taste, bis das Spiel null zeigt'],
      [/sterowanie działa tylko w trakcie jazdy \(w kabinie pociągu\)/, 'Steuerung nur während der Fahrt (im Führerstand)'],
      [/gra nie jest na pierwszym planie na PC — kliknij w okno Train Sim World/, 'Spiel ist am PC nicht im Vordergrund — ins Fenster von Train Sim World klicken'],
      [/ten pociąg nie podaje położenia tej dźwigni — użyj przycisków \+\/−/, 'dieser Zug meldet die Hebelstellung nicht — +/− benutzen'],
      [/telefon nie jest sparowany/, 'Handy ist nicht gekoppelt'], [/sterowanie wyłączone na PC/, 'Steuerung am PC ausgeschaltet'], [/nieprawidłowy kod/, 'falscher Code'],
    ],
  };

  /* ======================================================================= ENGLISH */
  D.en = {
    ui: {
      'lektor i ekrany do Train Sim World 7': 'announcer and screens for Train Sim World 7',
      'Stan': 'Status', 'sprawdzam…': 'checking…', 'Gra musi działać z telemetrią (parametr': 'The game must run with telemetry (parameter',
      ') — przycisk „Uruchom grę” robi to sam.': ') — the “Start game” button does it for you.',
      'Jazda': 'Driving', 'Uruchom grę + rozkład': 'Start game + timetable', 'Otwórz rozkład': 'Open timetable', 'Zamknij rozkład': 'Close timetable',
      'Rozkład (mapa, lektor) otwiera się na drugim monitorze, gdy jest podłączony.': 'The timetable (map, announcer) opens on the second monitor when one is connected.',
      'Rozkład w oknie': 'Timetable in a window', 'Pulpit': 'Cab display', 'Ustawienia lektora': 'Announcer settings', 'Dziennik lektora': 'Announcer log',
      'Pokaz bez gry': 'Demo without game',
      'Telefon / tablet (ta sama sieć Wi-Fi)': 'Phone / tablet (same Wi-Fi)', 'kod QR': 'QR code', 'Zeskanuj aparatem —': 'Scan with the camera —',
      'pobierz aplikację': 'get the app', 'Udostępnij w sieci lokalnej (telefon / tablet)': 'Share on the local network (phone / tablet)',
      'Aplikacja': 'The', 'na Androida: zeskanuj kod QR aparatem telefonu, pobierz i zainstaluj (telefon zapyta o zgodę na instalację z tego źródła). Potem otwórz ją — sama znajdzie ten komputer.':
        'Android app: scan the QR code with your phone camera, download and install it (the phone asks to allow this source). Then open it — it finds this PC by itself.',
      'Zapora Windows blokuje telefon.': 'Windows Firewall is blocking the phone.', 'Program działa, ale połączenia z sieci są zatrzymywane.': 'The program is running, but network connections are blocked.',
      'Zezwól w zaporze Windows': 'Allow in Windows Firewall',
      'Windows zapyta o zgodę administratora. Reguła dotyczy tylko tego programu i tylko sieci prywatnych (domowych).': 'Windows asks for administrator approval. The rule covers only this program and only private (home) networks.',
      'Aplikacja Android „TSW Ekran” znajduje ten komputer sama (przycisk „Szukaj”) i łączy się z ostatnio używanym. W przeglądarce telefonu wpisz adres powyżej. Przy pierwszym starcie Windows zapyta o zgodę zapory — zaznacz „Sieci prywatne”.':
        'The Android app “TSW Ekran” finds this PC by itself (“Search”) and reconnects to the last one used. In a phone browser, enter the address above. On first start Windows asks about the firewall — tick “Private networks”.',
      'Prywatność:': 'Privacy:',
      'po włączeniu LAN połączenie Android–PC używa HTTP/UDP bez szyfrowania; korzystaj tylko z zaufanej sieci. Podgląd udostępnia bieżące dane jazdy. Funkcje online wysyłają tekst komunikatu do Microsoft Edge TTS, a współrzędne pociągu do Overpass/OpenStreetMap; kafelki mapy są pobierane z OpenStreetMap.':
        'with LAN enabled the Android–PC link uses unencrypted HTTP/UDP; use it only on a trusted network. The preview shares live driving data. Online features send announcement text to Microsoft Edge TTS and the train position to Overpass/OpenStreetMap; map tiles come from OpenStreetMap.',
      'Głosy offline (przygotowanie z góry)': 'Offline voices (prepare in advance)', 'Przygotuj': 'Prepare', 'Anuluj': 'Cancel',
      'Stałe komunikaty z jazdy (ok. 2700 na głos; 20–40 minut, raz, w tle — można jeździć). Nagrania trafiają do osobnej paczki, której nie czyści pamięć podręczna; przerwane przygotowanie wznawia się od miejsca, w którym stanęło. Nietypowe liczby lektor dociąga w trakcie jazdy.':
        'Fixed driving announcements (about 2700 per voice; 20–40 minutes, once, in the background — you can keep driving). Recordings go to a separate pack the cache never clears; an interrupted run resumes where it stopped. Unusual numbers are fetched while driving.',
      'Tylko lokalnie — nie wysyłaj tekstu do usługi online (gotowe nagrania i głos Windows)': 'Local only — do not send text to the online service (prepared recordings and Windows voice)',
      'przygotowanie głosów': 'preparing voices',
      'Sterowanie z telefonu': 'Phone control', 'Pozwól sterować pociągiem z telefonu': 'Allow driving the train from a phone', 'Kod parowania:': 'Pairing code:',
      'Na telefonie: aplikacja TSW Ekran → przesuń palcem w bok → „Sterowanie” → wpisz kod. Kod działa raz.': 'On the phone: TSW Ekran app → swipe sideways → “Control” → enter the code. The code works once.',
      'Dźwignie (nastawnik, hamulce, nawrotnik) program ustawia bezpośrednio przez API gry. Przyciski funkcji wciskają klawisze gry (domyślne skróty TSW: Q czuwak, spacja syrena, H reflektory…) tylko wtedy, gdy na pierwszym planie jest okno Train Sim World.':
        'Levers (throttle, brakes, reverser) are set directly through the game API. Function buttons press game keys (TSW defaults: Q alerter, Space horn, H headlights…) only while the Train Sim World window is in front.',
      'Klawisze sterowania z telefonu': 'Phone control keys', 'Pokaż i zmień klawisze (gdy w Twojej grze skrót jest inny)': 'Show and change keys (if your game uses different shortcuts)',
      'Zapis: litera, cyfra, znak (; \' , . [ ] / -) albo SPACE, BACKSPACE, ESC, TAB, ENTER, F1…F12, NUM0…NUM9, strzałki UP/DOWN/LEFT/RIGHT; z modyfikatorem: SHIFT+H, CTRL+M, ALT+1. Puste pole = domyślny skrót TSW.':
        'Format: letter, digit, symbol (; \' , . [ ] / -) or SPACE, BACKSPACE, ESC, TAB, ENTER, F1…F12, NUM0…NUM9, arrows UP/DOWN/LEFT/RIGHT; with a modifier: SHIFT+H, CTRL+M, ALT+1. Empty = TSW default.',
      'Własne przyciski na telefonie': 'Custom phone buttons', '+ Dodaj przycisk': '+ Add button', 'Zapisz klawisze': 'Save keys',
      'napis na przycisku': 'button label', 'klawisz, np. SHIFT+H': 'key, e.g. SHIFT+H', 'przytrzymywany': 'held', 'Usuń': 'Remove',
      'Panel LED (Bluetooth, BK-Light ACT1025 64×16)': 'LED panel (Bluetooth, BK-Light ACT1025 64×16)', 'podgląd panelu': 'panel preview',
      'Szukaj paneli': 'Search panels', 'Zapomnij panel': 'Forget panel', 'Jasność': 'Brightness', 'Szukam…': 'Searching…', 'Sparowany': 'Paired', 'Paruj': 'Pair',
      'Włącz panel blisko komputera. Panel przyjmuje jedno połączenie — zamknij aplikację panelu w telefonie. Po sparowaniu program łączy się z nim sam przy każdym starcie. Podgląd obok pokazuje, co wyświetla panel.':
        'Switch the panel on near the PC. It accepts one connection only — close the panel app on your phone. Once paired, the program reconnects on every start. The preview shows what the panel displays.',
      'brak sparowanego panelu': 'no panel paired',
      'Aktualizacje': 'Updates', 'Sprawdź': 'Check', 'Zainstaluj': 'Install',
      'Aktualizacja podmienia tylko pliki programu (exe i katalog web). Ustawienia, dziennik, nagrania głosów i jazdy zostają nietknięte.':
        'An update replaces program files only (exe and the web folder). Settings, log, voice recordings and runs stay untouched.',
      'Nie sprawdzano.': 'Not checked yet.', 'Pobieram i sprawdzam pliki…': 'Downloading and verifying files…', 'Masz najnowszą wersję.': 'You have the latest version.',
      'Program': 'Program', 'Uruchamiaj razem z Windows (w tle)': 'Start with Windows (in the background)', 'Dane i ustawienia:': 'Data and settings:',
      'Folder danych': 'Data folder', 'Logi': 'Logs', 'Zakończ program': 'Quit program',
      'Język programu': 'Program language', 'Język lektora': 'Announcer language', 'głos i ile mówi: „Ustawienia lektora”': 'voice and how much it speaks: “Announcer settings”',
      'czekam na grę': 'waiting for the game', 'program nie odpowiada': 'program not responding', 'wykonuję…': 'working…', 'nie udało się': 'failed',
      'lektor: głos online (Edge TTS) + pamięć nagrań': 'announcer: online voice (Edge TTS) + recording cache', 'lektor: tylko głos Windows (brak syntezy online)': 'announcer: Windows voice only (no online synthesis)',
      'podgląd w sieci wyłączony — zaznacz pole powyżej, żeby połączyć telefon': 'network preview off — tick the box above to connect a phone',
      'brak połączenia z siecią lokalną': 'no local network connection', 'Odłącz': 'Unpair', 'Brak sparowanych telefonów.': 'No paired phones.',
      'układam listę komunikatów…': 'building the announcement list…', 'Będzie startować z Windows': 'Will start with Windows', 'Autostart wyłączony': 'Autostart off',
      'Aktualizuję — program uruchomi się ponownie dopiero po potwierdzeniu': 'Updating — the program restarts after confirmation',
      'Lektor pracuje lokalnie — tekst nie wychodzi z komputera': 'Announcer works locally — no text leaves the PC', 'Głosy online włączone': 'Online voices on',
      'Zapisano — zamknij i uruchom ponownie TSW Asystenta, żeby zmiana zadziałała': 'Saved — close and restart TSW Asystent for this to take effect',
      'Udostępnianie w sieci włączone': 'Network sharing on', 'Udostępnianie w sieci wyłączone': 'Network sharing off',
      'Sterowanie z telefonu włączone': 'Phone control on', 'Sterowanie z telefonu wyłączone': 'Phone control off',
      'Potwierdź w oknie Windows (zgoda administratora)': 'Confirm in the Windows dialog (administrator approval)',
      'Zapisano — telefon pobierze nowe przyciski po odświeżeniu karty.': 'Saved — the phone loads the new buttons after a refresh.', 'błąd zapisu': 'save error',
      'Zainstalować aktualizację? TSW Asystent zostanie zamknięty i uruchomiony ponownie.': 'Install the update? TSW Asystent will close and restart.',
      'Zakończyć TSW Asystenta? Lektor i ekrany przestaną działać.': 'Quit TSW Asystent? The announcer and screens will stop.',
      'Zapomnieć panel LED? Program przestanie się z nim łączyć.': 'Forget the LED panel? The program will stop connecting to it.',
      'TSW Asystent zakończony': 'TSW Asystent closed', 'Uruchom TSW-Asystent.exe, żeby wrócić.': 'Run TSW-Asystent.exe to come back.',
      'Nagłe hamowanie': 'Emergency brake', 'Nastawnik +': 'Throttle +', 'Nastawnik −': 'Throttle −', 'Nastawnik na 0': 'Throttle to 0',
      'Hamulec −': 'Brake −', 'Hamulec +': 'Brake +', 'Odhamuj': 'Release brake', 'Ham. dynamiczny −': 'Dyn. brake −', 'Ham. dynamiczny +': 'Dyn. brake +',
      'Ham. lok. −': 'Loco brake −', 'Ham. lok. +': 'Loco brake +', 'Tempomat +': 'Cruise +', 'Tempomat −': 'Cruise −', 'Nawrotnik ▲': 'Reverser ▲', 'Nawrotnik ▼': 'Reverser ▼',
      'Czuwak': 'Alerter', 'Syrena': 'Horn', 'Syrena 2': 'Horn 2', 'Dzwon': 'Bell', 'Piasecznica': 'Sander', 'Pantograf': 'Pantograph', 'Silnik': 'Engine',
      'Ham. postojowy': 'Handbrake', 'Wycieraczki': 'Wipers', 'Wycieraczki szybko': 'Wipers fast', 'Reflektory': 'Headlights', 'Przyciemnij': 'Dim',
      'Kabina': 'Cab', 'Przyrządy': 'Instruments', 'Koniec pociągu': 'Tail lights', 'Ostrzegawcze': 'Beacon', 'Drzwi lewe': 'Doors left', 'Drzwi prawe': 'Doors right',
      'Zamknij drzwi': 'Close doors', 'Blokada drzwi': 'Door lock', 'Zewnętrzna': 'External', 'Wychylenie': 'Head out', 'Pasażer': 'Passenger', 'Swobodna': 'Free',
      'Następna': 'Next', 'Mapa': 'Map', 'Zrzut ekranu': 'Screenshot', 'Pauza': 'Pause',
      'Sterowanie': 'Control', 'Obróć telefon poziomo — pulpit będzie większy. Przesuń palcem w bok — sterowanie.': 'Turn the phone sideways for a bigger display. Swipe sideways for controls.',
      'następne ograniczenie: –': 'next limit: –', 'CZUWAK': 'ALERTER', 'POŚLIZG': 'WHEELSLIP', 'TEMPOMAT': 'CRUISE', 'ZA SZYBKO': 'TOO FAST', 'Nagłe': 'Emergency',
      'Nawrotnik': 'Reverser', 'TYŁ': 'REV', 'PRZÓD': 'FWD', 'Sparuj sterowanie': 'Pair controls',
      'Wpisz 6-cyfrowy kod z okna TSW Asystenta na PC (karta „Sterowanie z telefonu”). Kod działa raz.': 'Enter the 6-digit code from the TSW Asystent window on the PC (“Phone control” card). The code works once.',
      'Sparuj': 'Pair', 'pulpit maszynisty': 'cab display', 'pokaż pasek': 'show bar', 'błąd': 'error', 'brak połączenia z PC': 'no connection to the PC',
      'Sparowano — możesz sterować': 'Paired — you can drive', 'NAGŁE HAMOWANIE': 'EMERGENCY BRAKE', 'Przytrzymaj nagłe hamowanie pół sekundy': 'Hold emergency brake for half a second',
      'Światła': 'Lights', 'Gra': 'Game', 'Własne': 'Custom', 'Hamulec': 'Brake', 'Ham. dyn.': 'Dyn. brake', 'Nastawnik': 'Throttle',
      'Sterowanie z telefonu jest wyłączone w programie na PC': 'Phone control is turned off in the program on the PC', 'czekam na jazdę': 'waiting for a run',
      'Drzwi': 'Doors', 'Kamera': 'Camera', 'Kierunek': 'Direction', 'Alarm': 'Alarm',
      'Lektor TSW — ustawienia': 'TSW announcer — settings', 'sprawdzam stan…': 'checking status…', 'Język lektora i ekranów': 'Announcer and screen language',
      'Polski: pełny słownik wymowy. Niemiecki i angielski: nazwy stacji czytane natywnym głosem.': 'Polish: full pronunciation dictionary. German and English: station names read by a native voice.',
      'Głos': 'Voice', 'wyłączony': 'off', 'Ile mówi lektor': 'How much the announcer says', 'tylko alarmy': 'alarms only', 'ważne': 'important', 'normalnie': 'normal', 'wszystko': 'everything',
      'Efekty radia': 'Radio effects', 'na serwerze': 'on the server', 'w przeglądarce': 'in the browser', '2. monitor': '2nd monitor',
      'sam się przeładowuje po wdrożeniu nowej wersji (na postoju)': 'reloads itself after a new version (while stopped)', 'Przeładuj teraz': 'Reload now',
      'Test blokady dźwięku': 'Sound block test', 'Zapisano': 'Saved', 'Nie udało się zapisać': 'Could not save', 'Brak połączenia z portalem': 'No connection to the program',
      'Ekranik': 'Cab display',
      'pominięte': 'skipped', 'odrzucone': 'dropped', 'testy / demo': 'tests / demo', 'wszystkie języki': 'all languages', 'Odśwież': 'Refresh',
      'szukaj w tekście…': 'search text…', 'Nie powiedziane': 'Not spoken', 'Czekanie na głos': 'Wait for voice', 'Czas': 'Time', 'Zdarzenie': 'Event',
      'Komunikat': 'Announcement', 'Prędkość / limit': 'Speed / limit', 'Semafor': 'Signal', 'Następne ogr.': 'Next limit', 'Powód / źródło': 'Reason / source', 'Czekał': 'Waited',
      '(bez nazwy pociągu)': '(no train name)', 'powiedziany': 'spoken', 'pominięty': 'skipped', 'przerwany': 'interrupted', 'przeterminowany': 'expired',
      'zastąpiony': 'replaced', 'nieaktualny': 'outdated', 'błąd mowy': 'speech error', 'zawieszony': 'stuck', 'dźwięk wstrzymany': 'sound blocked',
      'Brak wpisów dla wybranego dnia i filtrów. Dziennik zapisuje 2. monitor podczas jazdy z włączonym głosem.': 'No entries for this day and filters. The log is written by the 2nd monitor while driving with voice on.',
      'gra nie działa': 'game not running', 'telemetria gry działa — wsiądź do kabiny pociągu': 'game telemetry works — get into the cab',
      'gra się wczytuje — telemetria ruszy, gdy gra będzie gotowa': 'game is loading — telemetry starts when it is ready',
      'gra odrzuca klucz API — odczytuję go ponownie': 'game rejects the API key — reading it again',
      'brak klucza API gry (CommAPIKey.txt) — gra tworzy go przy pierwszym starcie z telemetrią': 'no game API key (CommAPIKey.txt) — the game creates it on its first start with telemetry',
      'gra działa bez telemetrii — zamknij ją i uruchom przyciskiem „Uruchom grę” w panelu (parametr -HTTPAPI)': 'game runs without telemetry — close it and start it with “Start game” (parameter -HTTPAPI)',
      'masz najnowszą wersję': 'you have the latest version', 'Masz najnowszą wersję': 'You have the latest version', 'masz nowszą wersję niż na serwerze': 'your version is newer than the server’s',
      'pobieram…': 'downloading…', 'naprawa plików programu': 'repairing program files', 'panel zapomniany': 'panel forgotten', 'brak potwierdzenia z panelu': 'no acknowledgement from the panel',
      'Aktualizacje wyłączone — brak adresu (config.json → "updateUrl").': 'Updates off — no address (config.json → "updateUrl").',
    },
    rx: [
      [/^wersja (.+) · ekrany (.+)$/, 'version $1 · screens $2'], [/^jazda: (.*) · (\d+) km\/h$/, 'driving: $1 · $2 km/h'], [/^jazda: pociąg/, 'driving: train'],
      [/ · główna karta$/, ' · main adapter'], [/^inne karty sieciowe \(wirtualne: (\d+)\)$/, 'other network adapters (virtual: $1)'],
      [/^Ostatnie polecenie: (.*)\.$/, 'Last command: $1.'], [/^sparowany /, 'paired '], [/^(\d+) \/ (\d+) gotowych na dysku/, '$1 / $2 ready on disk'],
      [/ · nieudane: (\d+)/, ' · failed: $1'], [/^Gotowe: (\d+) z (\d+) nagrań/, 'Done: $1 of $2 recordings'], [/\(nieudane: (\d+) — „Przygotuj” dokończy brakujące\)/, '(failed: $1 — “Prepare” completes the rest)'],
      [/^Anulowano: (\d+) z (\d+) gotowych — „Przygotuj” wznowi od tego miejsca\./, 'Cancelled: $1 of $2 ready — “Prepare” resumes from here.'], [/^Błąd: /, 'Error: '],
      [/^Paruję z /, 'Pairing with '], [/ · sygnał (\S+) dBm$/, ' · signal $1 dBm'], [/\((\d+) kl\/s\)/, '($1 fps)'], [/^połączono: /, 'connected: '], [/^Bluetooth niedostępny: /, 'Bluetooth unavailable: '],
      [/ — ponawiam za 5 s$/, ' — retrying in 5 s'], [/^nie znaleziono — .*$/, 'not found — is the panel on, near the PC and not connected to another device (e.g. a phone app)?'],
      [/^Dostępna wersja (\S+) \((\d+) plików\)\./, 'Version $1 available ($2 files).'], [/\((\d+) plików\)/, '($1 files)'], [/^dostępna wersja /i, 'available: version '],
      [/^zaktualizowano do /, 'updated to '], [/^zaktualizowano — uruchamiam ponownie$/, 'updated — restarting'], [/^nie udało się sprawdzić: /, 'check failed: '],
      [/^aktualizacja przerwana \(nic nie zmieniono w danych\): /, 'update aborted (no data changed): '],
      [/rozkład już otwarty/g, 'timetable already open'], [/otwarto rozkład w przeglądarce \(nie znalazłem Edge — okno ustaw ręcznie\)/g, 'timetable opened in the browser (Edge not found — place the window yourself)'],
      [/otwarto rozkład na (\d+)\. monitorze/g, 'timetable opened on monitor $1'], [/otwarto rozkład \(jeden monitor — okno\)/g, 'timetable opened (one monitor — window)'], [/zamknięto rozkład/g, 'timetable closed'],
      [/gra już działa/g, 'game already running'], [/gra działa BEZ telemetrii — zamknij ją i kliknij jeszcze raz \(wystartuje z -HTTPAPI\)/g, 'game runs WITHOUT telemetry — close it and click again (starts with -HTTPAPI)'],
      [/gra na pierwszym planie/g, 'game in front'], [/nie udało się przełączyć na grę/g, 'could not switch to the game'], [/uruchamiam Train Sim World 7 \(z telemetrią\)/g, 'starting Train Sim World 7 (with telemetry)'],
      [/nie znalazłem gry — wpisz ścieżkę TrainSimWorld\.exe w ustawieniach \(gameExe\)/g, 'game not found — set the path to TrainSimWorld.exe in settings (gameExe)'],
      [/^gra zamknięta — /, 'game closed — '], [/ na 0$/, ' to 0'], [/^Jazda: /, 'Driving: '], [/^Gra nie jedzie/, 'Game not driving'], [/ · ostatnio /, ' · last '], [/ · limit /, ' · limit '],
      [/^Język: /, 'Language: '], [/^Głos: /, 'Voice: '], [/^Lektor: /, 'Announcer: '], [/^Efekty: /, 'Effects: '],
      [/^2\. monitor przeładuje się, gdy lektor skończy mówić$/, 'The 2nd monitor reloads when the announcer finishes'], [/^Test wysłany — 2\. monitor sprawdza go co 30 s$/, 'Test sent — the 2nd monitor checks every 30 s'],
      [/^Wspólne dla 2\. monitora i Ekranika\..*$/, 'Shared by the 2nd monitor and the cab display. Changes apply at once: the 2nd monitor reloads when the announcer finishes.'],
      [/^Na serwerze \(domyślnie\).*$/, 'On the server (default): ready radio recordings. In the browser: clean voice, radio and PA added locally.'],
      [/^Test blokady: .*$/, 'Block test: the 2nd monitor simulates blocked sound — the next announcement uses the system voice, a red bar appears, a click restores the radio.'],
      [/^z serwera \((?:VPS|online)\) (\d+) · lokalnie (\d+)/, 'online $1 · local $2'], [/^mediana/, 'median'], [/najdłużej/g, 'longest'],
      [/ · powiedziane (\d+)/g, ' · spoken $1'], [/ · nie powiedziane (\d+)/g, ' · not spoken $1'], [/lokalnie (\d+)/g, 'local $1'],
      [/^następne: /, 'next: '], [/ km\/h za /, ' km/h in '], [/^— trzymam klawisz, aż gra pokaże zero$/, '— holding the key until the game shows zero'],
      [/sterowanie działa tylko w trakcie jazdy \(w kabinie pociągu\)/, 'control works only while driving (in the cab)'],
      [/gra nie jest na pierwszym planie na PC — kliknij w okno Train Sim World/, 'the game is not in front on the PC — click the Train Sim World window'],
      [/ten pociąg nie podaje położenia tej dźwigni — użyj przycisków \+\/−/, 'this train does not report this lever — use +/−'],
      [/telefon nie jest sparowany/, 'phone is not paired'], [/sterowanie wyłączone na PC/, 'control is off on the PC'], [/nieprawidłowy kod/, 'wrong code'],
    ],
  };

  const LANGS = ['pl', 'de', 'en'];
  const norm = (l) => { const s = String(l || '').slice(0, 2).toLowerCase(); return LANGS.includes(s) ? s : ''; };
  const fromNavigator = () => { const n = norm((navigator.languages && navigator.languages[0]) || navigator.language); return n || 'en'; };   // inny język systemu → angielski
  const fromQuery = () => norm(new URLSearchParams(location.search).get('ui'));
  let lang = 'pl', started = false;

  function T(s) {
    const P = D[lang]; if (!P || s == null) return s;
    const k = ws(s); if (!k) return s;
    if (P.ui[k] != null) { const lead = String(s).match(/^\s*/)[0], trail = String(s).match(/\s*$/)[0]; return lead + P.ui[k] + trail; }
    let out = String(s); for (const [re, to] of P.rx) out = out.replace(re, to); return out;
  }
  const ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  function start(l) {
    lang = norm(l) || 'pl';
    document.documentElement.lang = lang;
    if (lang === 'pl' || started) return;
    if (!document.body) { document.addEventListener('DOMContentLoaded', () => start(lang)); return; }   // wywołane w <head>
    started = true;
    const done = new WeakMap();
    const fixText = (n) => { if (!n.nodeValue || !/[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(n.nodeValue)) return; if (done.get(n) === n.nodeValue) return;
      const t = T(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; done.set(n, n.nodeValue); };
    const fixEl = (el) => { for (const a of ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v) { const t = T(v); if (t !== v) el.setAttribute(a, t); } } };
    const walk = (root) => {
      if (root.nodeType === 1) fixEl(root);
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let n; while ((n = w.nextNode())) { if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode && n.parentNode.nodeName)) fixText(n); } else fixEl(n); }
    };
    document.title = T(document.title);
    walk(document.body);
    new MutationObserver((ms) => ms.forEach((m) => {
      if (m.type === 'characterData') fixText(m.target);
      else if (m.type === 'attributes') fixEl(m.target);
      else m.addedNodes.forEach((n) => (n.nodeType === 3 ? fixText(n) : n.nodeType === 1 && walk(n)));
    })).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  /* język z ustawień programu (uiLang); bez ustawienia — język systemu */
  async function auto() {
    let l = fromQuery();
    if (!l) { try { const s = await fetch('/api/ekranik/tsw/settings', { cache: 'no-store' }).then((r) => r.json()); l = norm(s.uiLang); } catch (_) {} }
    const go = () => start(l || fromNavigator());
    if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
    return l || fromNavigator();
  }
  window.TswAppUi = { T: (s) => T(s), start, auto, fromNavigator, get lang() { return lang; }, dict: D, LANGS };
})();
