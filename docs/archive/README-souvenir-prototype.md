# Das Glasgefängnis

Moriondo sitzt hinter Glas. Man geht hin, man fragt, und man bezahlt.

Begleitstück zum [Fellowship OS](https://github.com/weltogeisto/jga-fellowship-os)
— Verhör in siebzehn Sitzungen, deutsch, karg.

---

## Warum es das gibt

Zwei Dinge stehen im Kanon des Fellowship OS, und zusammen ergeben sie eine Zelle.

**Er ist ortsgebunden.** Migration `0057` hat Moriondo ausdrücklich
zurückgeschrieben: *„Sein Reich endet mit seinem Fels und seinem Dunkel; er
begehrt weder Banner noch Krone und führt keine Heere."* Die zwei blauen Magier
haben ihn gehört und sich **selbst** entschieden — *„Moriondo befahl ihnen
nichts."* Er kann nichts tun. Er kann nur gehört werden.

**Er ist nicht dabei.** `attends_jga = false`. Er hat eine Siegelrune, ein
Porträt, ein Profil — und keinen Platz am Feuer.

Das Glas ist also nicht Deko. Es ist die Zellenwand, es ist der Bildschirm in
deiner Hand, es ist ein Spiegel, und es ist der Abstand zwischen dem Freund, der
kommt, und dem, der nicht kann.

Und: in 112 Migrationen und 200 Komponenten steht keine einzige Ich-Zeile von
ihm. Die sorgfältigste Figur des Projekts hatte nie eine Stimme. Hier bekommt
sie eine.

## Wie es geht

Man singt am Tor. Das Bannlied steht schon drüben in
`lib/moriondoRitualShared.ts` und heißt dort *„seine erzählerische Schwelle"* —
die selbst Moriondo einmal freisingen muss. Man singt, um die Tür zu einem zu
öffnen, der nicht hinausgehen kann.

Dann steht man am Glas, und er sieht schon her.

Er fragt nicht, wer du bist. Er sagt es dir. Deine Akte ist echt: dein Reittier,
seine Blutlinie, wie gut du dich gekümmert hast, dein Rang, dein Trinkstil, die
Narben in deiner Lore. Alles, was das Fellowship OS ohnehin weiß, in kurzen
Sätzen zurückgesagt von etwas, das nicht beeindruckt ist.

Dann handelt er. **Quid pro quo.** Er sagt dir etwas Wahres über den Krieg — die
Blaue Glut, die Urlog-hai, die Herren der Neuschmiedung, was hinter Bruchtal
wartet. Der Preis ist eine wahre Sache über dich.

Gesagt, nicht getippt. Auf einem JGA tippt niemand einen ehrlichen Satz in ein
Telefon. Man sagt ihn — laut, ans Glas, vor allen anderen. (Getippt geht auch.)

Am Ende jeder Sitzung stellt er dieselbe Frage. Sie kostet nichts.

> „Wird er glücklich sein?"

## Das Protokoll

Siebzehn Antworten auf diese eine Frage, gebunden, sind das **Verhörprotokoll**.
Es setzt sich als A5-Heft und ist zum Drucken und Übergeben gedacht.

Sie sind gekommen, um einem Ungeheuer die Wahrheit abzunehmen. Was sie
dagelassen haben, ist ein Bild von Jan, geschrieben von siebzehn Freunden, von
denen keiner gemerkt hat, dass er gerade schreibt.

Was jemand auf *seine* Gegenfrage geantwortet hat, steht nicht im Heft. Das war
der Preis, und der gehört ihm.

Jan betritt das Glasgefängnis nie. Er ist `is_groom`, hier wie überall sonst.

## Der Riss

Er ist klinisch, bei allen. Genau einmal — über alle siebzehn Sitzungen, nicht
einmal pro Sitzung — kommt etwas durch das Glas. Eine Person bekommt drei Sätze,
die sonst niemand hört. Danach ist er wieder Stein.

Wer, steht vor der ersten Sitzung fest und lässt sich nicht erzwingen.
Hinterher vergleichen siebzehn Leute ihre Protokolle, und genau einer hält einen
Satz in der Hand, den die anderen nicht haben.

---

## Entwicklung

```bash
npm install
npm run dev            # http://localhost:3000 — ohne .env.local, voller Demo-Modus
npm run dev -- -H 0.0.0.0   # dazu vom Telefon aus: http://<deine-IP>:3000

npm run test           # der reine Kern, inklusive Registerprüfung
npm run verhoer        # alle siebzehn Verhöre nach .artifacts/verhoere.txt
npm run lint
npx tsc --noEmit
SESSION_SECRET=ci-dummy npm run build

npm run smoke:zelle    # Playwright bei 320/390/768/1440 gegen einen laufenden Server
```

`/beta` ist ein Werkraum, der von nirgends verlinkt ist: zurücksetzen, direkt
in jede Zelle, das Protokoll mit erkennbar unechten Beispielen füllen. Auf dem
JGA findet ihn niemand versehentlich.

Ohne Umgebungsvariablen läuft alles aus Seed-Akten und `localStorage`. Das ist
die goldene Regel des Fellowship OS und gilt hier genauso: **das Verhör muss
sich ohne Datenbank von Anfang bis Ende führen lassen.**

Next.js 16 · React 19 · Tailwind v4 · TypeScript · three.js / react-three-fiber ·
Supabase (optional).

## Technik, kurz

- **Reiner Kern.** `lib/glas/` ist DOM-frei, netzfrei, gesät. Der Zustand einer
  Sitzung wird aus ihrem Zugprotokoll nachgerechnet, nie geglaubt.
- **Das Register ist eine Prüfung, keine Absicht.** `lexikon.ts` hält die
  Kanonschlösser als Daten, und ein Test fährt sie über den gesamten Bestand:
  null Imperative, keine Machtansprüche, die zwei Blauen bleiben unbenannt,
  höchstens zwei Sätze und 180 Codepoints je Replik.
- **Die Scheibe.** Im Fellowship OS ist `@react-three/postprocessing` eingetragen
  und wird nirgends importiert, und ein `MeshTransmissionMaterial` gibt es dort
  nicht. In diesem Universum ist noch nie Glas gerendert worden. Hier steht das
  erste. Ohne WebGL oder bei `prefers-reduced-motion` ist die CSS-Scheibe die
  Zelle — vollständig, nicht als Notbehelf.
- **Pergament bleibt drüben.** `HANDOFF.md` verbietet dark glassmorphism, also
  benutzen wir den Ausgang, den die App selbst gebaut hat: `immersive`. Dort
  endet das Pergament, und genau da fängt die Zelle an.

Für die Stimme: **[`KANON.md`](./KANON.md)**. Für alles andere:
**[`AGENTS.md`](./AGENTS.md)**.
