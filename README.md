# TSW Asystent — lektor i ekrany do Train Sim World 7 (wersja testowa)

Lektor jak radiotelefon (ograniczenia prędkości, semafory, stacje, przekroczenia), rozkład z mapą na drugim monitorze,
pulpit maszynisty i podgląd jazdy na telefonie / tablecie w tej samej sieci Wi-Fi. Języki lektora: polski, niemiecki, angielski (GB / US).

## Pobranie

**[Najnowsze wydanie → Releases](../../releases/latest)** — plik `TSW-Asystent-<wersja>.zip`.

1. Rozpakuj cały folder i uruchom `TSW-Asystent.exe` (SmartScreen: „Więcej informacji” → „Uruchom mimo to”).
2. Otworzy się okno programu — kliknij **„Uruchom grę + rozkład”** (gra startuje z telemetrią `-HTTPAPI`).
3. Telefon / tablet: zainstaluj `TSW-Ekran.apk` z folderu programu → „Szukaj w sieci”.
4. Panel LED BK-Light ACT1025 (opcjonalnie): w oknie programu „Panel LED” → „Szukaj paneli” → „Paruj”.

Szczegóły: `CZYTAJ-MNIE.txt` w paczce.

## Aktualizacje

Program sprawdza nowe wersje sam (panel → „Aktualizacje”). Pliki aktualizacji leżą w katalogu [`update/`](update/)
(`latest.json` z sumami SHA-256). Aktualizacja podmienia tylko pliki programu — ustawienia, jazdy, dziennik i nagrania głosów
w `%APPDATA%\TSW-Asystent` zostają nietknięte.

## Prywatność

Program działa lokalnie. Do internetu trafiają tylko: teksty komunikatów do syntezy mowy (Microsoft Edge TTS),
położenie pociągu w grze do nazw stacji (OpenStreetMap / Overpass) i kafelki mapy. Klucz API gry nie opuszcza komputera.
Telefon w sieci lokalnej może jazdę tylko podglądać.
