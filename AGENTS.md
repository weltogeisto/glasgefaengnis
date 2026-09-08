# AGENTS — Glasgefängnis

## Zuerst lesen

1. `docs/STORY_CONTRACT.md`: aktiver, übernommener Ereigniskanon.
2. `KANON.md`: seine Anwendung auf den Regieschnitt.
3. `docs/REGIE_REVIEW.md`: Befund, Umsetzungsumfang und offene Integration.

Dieses öffentliche Repository ist der Medien- und Regiewerkraum. Das private
Fellowship OS bleibt Eigentümer der echten Identitäten, privaten Belege,
Wahrheitsprüfung, Multiplayer-Fortschritte, Reittiere und Jan-Freigaben.
Keine echten Lösungen oder privaten Teilnehmerdaten in einen neuen Client-Bundle
oder eine öffentliche Regiedatei aufnehmen.

## Technischer Vertrag

- Ohne Umgebungsvariablen bauen und eine vollständige lokale Probe ermöglichen.
- Reine Domänenlogik nach `lib/glas/`, mit Tests daneben. Die Oberfläche zeigt
  abgeleiteten Zustand; sie entscheidet keine Beweisregeln selbst.
- Kein Zufall im Kern. Zustand aus akzeptierten Zügen nachspielen. Das schützt
  gegen UI-Fehler und verspätete Callbacks, ist lokal aber **kein** Anti-Cheat.
- Keine synchronen setState-Aufrufe in Effekten. Externe Speicherung verwendet
  `useSyncExternalStore` mit stabilem Server-Snapshot.
- Standbild und Reduced Motion müssen denselben vollständigen Spielpfad erlauben.
  Animationen und Übergänge nur unter `prefers-reduced-motion: no-preference`.
- 320/390 px zuerst prüfen; keine horizontalen Überläufe, mindestens 44px-Bedienung,
  sichtbarer Tastaturfokus. Bildausschnitt darf die Ganzkörperpräsenz nicht entfernen.
- Bestehende Medien niemals still überschreiben. Herkunft und bestehender
  Freigabestatus bleiben erhalten; kein Test ersetzt menschliche Bildfreigabe.
- Diese Datei bei strukturellen Änderungen fortschreiben.

## Prüfung

`npm run lint`, `npm run test`, `npx tsc --noEmit`,
`node scripts/check-review-assets.mjs`, `SESSION_SECRET=ci-dummy npm run build`.

`node scripts/smoke-regie.mjs` läuft gegen den gebauten Server: Beweisführung,
Quellenunabhängigkeit, Teilen ohne Bestätigung, persistenter Nachhall, Standbild,
gesperrter Speicher und echtes stummes Inline-Video. Screenshots und Bericht
liegen in `.artifacts/regie-smoke/` und werden durch CI als `regie-proof` geliefert.
Die Bilder müssen angesehen werden; ein grüner Build ist keine Bildfreigabe.

## Aufbau / Stand

- `lib/glas/regie.ts`: ausschließlich fiktive lokale Prüfbelege und Replay-Kern.
- `components/regie/`: Ganzer-Raum-Präsenz, Untertitel, Belegtisch, Ratssimulation.
- `/` und `/regie`: neuer kanonisch ausgerichteter Regieschnitt.
- `/archiv`, `/zelle/*`, `/protokoll`, `/beta`: ältere Souvenir-Studie / Vergleich.
- `lib/glas/lexikon.ts` und die alten Sitzungsprüfungen bleiben Archiv-Tests.
  Ihr Lügen-/Imperativverbot darf nicht auf neue Ereignisdialoge übertragen werden.

Noch nicht implementiert: authentifiziertes Multiplayer-Ereignis, private Hinweise,
serverseitige Rollen-/Abhängigkeitsprüfung, freie semantische Gesprächsführung,
Rettungsfortschritt, Phial-/Jan-Finale. Keine Produktionsänderung vor Abnahme.
