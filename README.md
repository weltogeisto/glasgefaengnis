# Das Glasgefängnis — Regieprobe

**Er ist gefangen. Nicht harmlos.**

Die Startseite und `/regie` zeigen einen spielbaren, lokalen Regieschnitt mit
bestehendem Moriondo-Filmmaterial: Fragen, Beobachten, ein optionaler Handel,
Quellenprüfung, Bestreiten und ein durch Gegenbeweis ausgelöster echter Wutausbruch.
Der Nachhall bleibt nach dem Neuladen bestehen.

**Dies ist nicht das fertige Weltereignis.** Die Belege sind ausdrücklich erfundene
Prüfbeispiele. Die zweite Person ist simuliert; es besteht keine Multiplayer-Verbindung.
Keine Eingabe verändert XP, Reittiere, Jan oder den Live-Zustand des Fellowship OS.
Es gibt keine freie KI-Unterhaltung, keine Mikrofonaufnahme und keine neue Sprachsynthese.

## Zwei klar getrennte Dinge

- **Aktuell:** `/regie` — filmische Präsenz und überprüfbare Interaktion. Gültiger
  Kanon: `docs/STORY_CONTRACT.md` aus `moriondo-cycle-01-approved-assets-v1`.
- **Archiv:** `/archiv`, die alten `/zelle/*`- und `/protokoll`-Studien, erreichbar
  im Werkraum `/beta`. Die dortigen Souvenir-Texte sind kein aktueller Ereigniskanon.
  Ihre früheren Regeln stehen unter `docs/archive/` und gelten nicht für neue Dialoge.

## Entwicklung

```sh
npm ci
npm run dev -- -H 0.0.0.0
npm run lint
npm run test
npx tsc --noEmit
node scripts/check-review-assets.mjs
SESSION_SECRET=ci-dummy npm run build
# Gegen einen laufenden Server:
node scripts/smoke-regie.mjs
```

Keine Umgebungsvariablen nötig. Bewegung und Raumton sind getrennt schaltbar.
Standbild, fehlgeschlagenes Video und gesperrter Browserspeicher verhindern das
Verhör nicht. Die Probe lässt sich bewusst zurücksetzen; sie behauptet keine
serverseitige Manipulationssicherheit.

## Medien und Veröffentlichung

Vorhandene Dateien werden aus dem freigegebenen Medienzweig unverändert übernommen.
Der echte Wutausbruch ist im Manifest gesperrt und als `owner-approved-existing`
verzeichnet. Andere Clips behalten ihren jeweiligen bestehenden Status; diese
Änderung erteilt **keine** neue künstlerische Freigabe. Der Asset-Test prüft für
alle zehn benutzten Cues Existenz und SHA-256 gegen das übernommene Manifest.

Kein Merge nach `main` oder `cowork/presence`; keine Produktionsveröffentlichung.

## Grenze zum eigentlichen Spiel

Das private `jga-fellowship-os` besitzt Identitäten, Teilnehmerzuweisungen,
private Hinweise, Wahrheits-/Abhängigkeitsgraph, geteilte Fortschritte,
Reittier-Rettung, Jan-Freigabe und Spielmeister-Kontrollen. Der öffentliche
Medienzweig darf diese Antworten nicht enthalten. Die vier Felder **Brut, Pfad,
Hort, Schnitt** sind hier Ziele, keine öffentlich eingebetteten Lösungen.

`docs/REGIE_REVIEW.md` beschreibt den Befund am Claude-Zweig, die tatsächlich
umgesetzte Abgrenzung und die Anforderungen für den vollständigen Ereignisbogen.
