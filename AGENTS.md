# AGENTS

Der technische Vertrag für dieses Repo. Für die Stimme gilt **[`KANON.md`](./KANON.md)**,
und die kommt zuerst.

## Zuerst lesen

1. `KANON.md` — wer Moriondo ist und wie er spricht.
2. Diese Datei.
3. `README.md` — was das Ding überhaupt ist.

Dieses Projekt ist ein Begleitstück zu [`weltogeisto/jga-fellowship-os`](https://github.com/weltogeisto/jga-fellowship-os)
und folgt dessen Regeln absichtlich genau — nicht aus Ehrfurcht, sondern damit
sich das Glasgefängnis später als Route `/glasgefaengnis` dort hineinheben lässt,
ohne dass jemand etwas umschreiben muss.

## Goldene Regeln

Aus `AGENTS.md` des Fellowship OS übernommen, wörtlich gemeint:

- **Der Demo-Modus ist kein Extra.** Ohne gesetzte Umgebungsvariablen muss die
  App bauen, laufen und ein vollständiges Verhör von der Schwelle bis zum
  gedruckten Protokoll zulassen. Wer das bricht, bricht das Produkt.
- **Das ganze Tor bleibt grün:** `npm run lint`, `npm run test`,
  `npx tsc --noEmit`, `SESSION_SECRET=ci-dummy npm run build`.
- **Reine Domänenlogik plus Tests.** Alles Regelhafte gehört nach `lib/glas/`
  mit einer `*.test.ts` daneben. Die Oberfläche konsumiert ein abgeleitetes
  Modell und baut die Regeln nicht nach. `vitest` sieht nur `lib/**/*.test.ts`
  — diese Einschränkung erledigt die Architekturarbeit.
- **Determinismus.** Kein `Math.random()` im Kern. Alles wird über
  `lib/glas/rng.ts` gesät. Dieselbe Person trifft dasselbe Verhör, auf jedem
  Gerät, in jedem Modus, heute und in einem Jahr. Siebzehn Leute vergleichen
  hinterher ihre Protokolle.
- **Der Zustand wird nachgerechnet, nicht geglaubt.** Vertraut wird dem
  Zugprotokoll; `spieleNach()` erzeugt daraus jedes Mal neu den Zustand. Ein
  Klient, der einen fertigen Zustand schickt, wird nicht geglaubt.
- **Bewegung ist optional, Inhalt nicht.** Jede Animation steht in
  `@media (prefers-reduced-motion: no-preference)`, samt Keyframes. Ohne
  Bewegung ist das Verhör kürzer und vollständig dasselbe — kein zweiter,
  ärmerer Modus.
- **Kein setState im Effekt.** Die strengere React-19-Regel gilt hier auch.
  `localStorage` ist ein externer Speicher mit `useSyncExternalStore`
  (`lib/glas/speicher.ts`), Umgebungseigenschaften sind Schnappschüsse, und
  abgeleiteter Zustand wird abgeleitet.
- **Das Telefon ist das Zielgerät.** Erst 390px prüfen, dann alles andere. Kein
  waagerechter Überlauf, 44px-Ziele, `focus-visible` erhalten.
- **Diese Datei nach jeder Änderung fortschreiben.**

## Aufbau

```
lib/glas/       reiner Kern, jede Datei mit *.test.ts daneben
  rng            FNV-1a + mulberry32, gesät aus lesbaren Schlüsseln
  lexikon        die Kanonschlösser als Daten + pruefeReplik()
  dossier        siebzehn Akten, Fragen, Bruchstücke, der Riss
  stimme         Beats, Pausen, Namenszurückhaltung
  verhoer        Sitzung als reiner Reduzierer, nachspielbar
  schwelle       das Bannlied, aus dem Fellowship OS übernommen
  bruchstuecke   was er herausgibt, und wann es ein Bild ergibt
  protokoll      das Heft
  speicher       localStorage als externer Speicher
components/zelle/  Oberfläche, alles "use client"
app/               drei Routen: Gang, Zelle, Protokoll
scripts/           die Rauchprobe
```

## Was wo geprüft wird

- **`npm run test`** — 46 Tests. Darunter die Registerprüfung über den
  *gesamten* Bestand: null Imperative, keine Machtansprüche, die zwei Blauen
  bleiben unbenannt, Satzlänge, Determinismus, genau ein Riss.
- **`npm run verhoer`** — schreibt alle siebzehn Verhöre am Stück nach
  `.artifacts/verhoere.txt`. **Das ist das eigentliche Prüfgerät.** Die Tests
  halten das Register; ob es sich gut liest, sieht nur ein Mensch. Wer eine
  Zeile ändert, liest die Sitzung danach ganz.
- **`npm run smoke:zelle`** — Playwright, Hausform: eigenständiges ESM-Programm,
  handgeschriebenes `assert`, `data-*`-Haken statt CSS-Klassen als Selektoren.
  Treibt bei 320/390/768/1440 eine volle Sitzung von der Schwelle bis ins
  Protokoll. Null Konsolenfehler, kein Überlauf, 44px-Ziele, Tastaturbedienung.
  Screenshots nach `.artifacts/zelle-smoke/` — die sind zum Ansehen da.

## Wenn ein Modell mitschreibt

Der Hausbrauch für KI-Inhalte (`lib/tripleSmithing/introManifest.ts` drüben):
offline erzeugen, vom Menschen abnehmen lassen, mit SHA-256 und Herkunftszeile
festnageln, per Test absichern. Moriondos Zeilen sind *geschrieben*, nicht am
Glas erzeugt — auch deshalb trägt das Register über siebzehn Sitzungen.

`app/api/stimme/route.ts` ist aus, solange `XAI_API_KEY` fehlt, und darf auch
mit Schlüssel nur umsprechen, was der Kern schon entschieden hat. Details in
`KANON.md`.

## Stand

Kern, Raum und Scheibe stehen. Alle siebzehn Sitzungen sind geschrieben und
lesen sich am Stück. Demo-Modus vollständig; Supabase optional und ungenutzt,
solange keine Umgebung gesetzt ist.

Klang steht: `lib/glas/stimmklang.ts` beschreibt drei Geräusche und den
Nachhall der Zelle als reine, prüfbare Daten (Muster `lib/caressVoices.ts` —
synthetisch, nichts zu lizenzieren), `lib/glas/klang.ts` hängt sie an Web Audio.
Aus, bis jemand ihn anschaltet.

Offen: das Hineinheben in das Fellowship OS als `/glasgefaengnis`.
