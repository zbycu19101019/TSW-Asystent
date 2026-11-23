# TSW Asystent — lektor i ekrany do Train Sim World 7 (wersja testowa)

Lektor jak radiotelefon (ograniczenia prędkości, semafory, stacje, przekroczenia), rozkład z mapą na drugim monitorze,
pulpit maszynisty, podgląd i sterowanie z telefonu / tabletu w tej samej sieci Wi-Fi. Języki lektora: polski, niemiecki, angielski (GB / US).

## Pobranie

**[Najnowsze wydanie → Releases](../../releases/latest)** — instalator `TSW-Asystent-Setup-<wersja>.exe` (zalecany) albo paczka `TSW-Asystent-<wersja>.zip` bez instalacji.

1. Uruchom instalator `TSW-Asystent-Setup-<wersja>.exe` (SmartScreen: „Więcej informacji” → „Uruchom mimo to”) — bez uprawnień administratora, skróty w menu Start i na pulpicie, deinstalacja w Ustawienia → Aplikacje.
2. Otworzy się okno programu — kliknij **„Uruchom grę + rozkład”** (gra startuje z telemetrią `-HTTPAPI`).
3. Języki: na górze okna programu **„Język programu”** (Polski / Deutsch / English) i **„Język lektora”** (PL / DE / EN GB / EN US); głos — **„Ustawienia lektora”**.
4. Telefon / tablet: zaznacz **„Udostępnij w sieci lokalnej”**, uruchom program ponownie i zeskanuj kod QR aparatem telefonu — pobierze się aplikacja `TSW-Ekran.apk`.
   Sterowanie pociągiem z telefonu włączasz osobno i parujesz telefon kodem z okna programu.
5. Panel LED BK-Light ACT1025 (opcjonalnie): w oknie programu „Panel LED” → „Szukaj paneli” → „Paruj”.

Szczegóły: `CZYTAJ-MNIE.txt` w paczce.

## Aktualizacje

Program sprawdza nowe wersje sam (okno programu → „Aktualizacje”). Pliki aktualizacji leżą w katalogu [`update/`](update/):
`latest.json` z sumami SHA-256 jest podpisany kluczem Ed25519 (`latest.json.sig`) — program odrzuca niepodpisany albo zmieniony manifest.
Aktualizacja podmienia tylko pliki programu — ustawienia, jazdy, dziennik i nagrania głosów w `%APPDATA%\TSW-Asystent` zostają nietknięte.

## Prywatność

Program działa lokalnie. Do internetu trafiają tylko: teksty komunikatów do syntezy mowy (Microsoft Edge TTS — można to wyłączyć:
„Tylko lokalnie” w oknie programu, wtedy mówią gotowe nagrania i głos Windows), położenie pociągu w grze do nazw stacji
(OpenStreetMap / Overpass) i kafelki mapy. Klucz API gry nie opuszcza komputera.
Sieć lokalna i sterowanie z telefonu są domyślnie wyłączone; połączenie telefon–PC nie jest szyfrowane — włączaj je tylko w zaufanej sieci domowej.

---

**EN:** TSW Asystent is a radio-style announcer (PL / DE / EN), timetable with map, driver's dashboard and phone remote for Train Sim World 7.
Download the installer from [Releases](../../releases/latest), run it (SmartScreen: *More info → Run anyway*), click **„Uruchom grę + rozkład”**
(starts the game with `-HTTPAPI`). Set **Program language** and **Announcer language** at the top of the window — the interface, installer and phone app are available in English and German.

**DE:** Zugfunk-Sprecher (PL / DE / EN), Fahrplan mit Karte, Führerstand und Handy-Steuerung für Train Sim World 7. Installationsprogramm unter [Releases](../../releases/latest);
oben im Fenster „Programmsprache“ und „Sprecher-Sprache“ auf Deutsch stellen, dann „Spiel + Fahrplan starten“ (startet das Spiel mit `-HTTPAPI`).
