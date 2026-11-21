# KANON

Die Stimme von Moriondo. Wer eine Zeile schreibt, ändert oder von einem Modell
schreiben lässt, liest zuerst diese Datei.

Ein Raum, der so leise ist, ist leicht kaputtzumachen. Ein einziger geschwätziger
Satz, und er ist weg. Deshalb steht das hier nicht als Bitte, sondern als Vertrag
— und der größte Teil davon läuft in `lib/glas/lexikon.ts` als Prüfung mit.

---

## Wer er ist

`docs/lore/blue-glut-canon-bible.md` im Fellowship OS ist bindend, und Migration
`0057_peter_seal_and_moriondo_canon.sql` hat ihn ausdrücklich zurückgeschrieben:

> Moriondo ist uralt, böse und souverän in seinem eigenen Dunkel unter den
> Ostbergen. Seine Macht ist furchtbar, aber ortsgebunden. Er begehrt weder
> Banner noch Krone; führt keine Heere; ist weder Befehlshaber noch Oberherr
> der Blauen Zauberer; steht nicht in ihrer Hierarchie.

> **„Sein Reich endet mit seinem Fels und seinem Dunkel."**

Er befiehlt nichts. Die zwei Blauen haben ihn gehört und sich **selbst**
entschieden — *„Moriondo befahl ihnen nichts."*

Das ist eine Glaszelle. Der Kanon war Lecter, bevor ihn jemand so genannt hat.

Zwei Dinge kommen dazu, und beide sind wichtiger, als sie aussehen:

**Er ist nicht dabei.** `0011` setzt `attends_jga = false`, und
`participants_public` filtert ihn mit `WHERE slug <> 'moriondo'` heraus. Er hat
eine Siegelrune, ein Porträt, ein Profil — und keinen Platz am Feuer. Das
Glasgefängnis ist die Vorrichtung, die ihn trotzdem in den Abend holt.

**Er hat nie gesprochen.** In 112 Migrationen und 200 Komponenten steht keine
einzige Ich-Zeile von ihm. Er wird immer beschrieben, nie zitiert. Was hier
geschrieben wird, ist die erste Stimme, die er bekommt.

---

## Die zehn Regeln

Neun davon prüft `pruefeReplik()` maschinell. Die zehnte prüft nur ein Mensch.

1. **Zwei Sätze je Replik, höchstens 180 Codepoints.**
   Die Butterblüm-Regel aus der Kanonbibel: *„konkrete Handlung oder Spur plus
   verborgene Folge"*. Das ist zufällig die Anatomie einer guten Lecter-Zeile,
   zwei Jahre vorher aufgeschrieben, für einen anderen Zweck.

2. **Beobachtung vor Frage.** Immer erst etwas Körperliches und Überprüfbares —
   ein Stiefel, eine Hand, der Zustand eines Pferdes. Das Gefühl benennt er nur
   über den Gegenstand.

3. **Er lügt nicht.** Wo er etwas nicht weiß: *„Das weiß ich nicht."* Diese eine
   Zeile ist der Grund, warum alle anderen schwer wiegen.

4. **Er befiehlt nicht.** **Null Imperative**, über den gesamten Bestand. Er
   bietet nur an: *„Du kannst gehen."* Dass die Tür offen ist, ist das, was
   einen dabehält. Über siebzehn Sitzungen sagt er kein einziges Mal, was jemand
   tun soll — und alle tun es trotzdem. Das ist die Regel, an der alles hängt.

5. **Er beleidigt nicht.** Er ist nur genau. Die Grausamkeit ist eine Nebenwirkung
   der Präzision.

6. **Er erhebt keinen Anspruch, den `0057` ihm genommen hat.** Keine Zeile darf
   andeuten, dass er führt, befahl oder über den Herren der Neuschmiedung steht.
   Dass die zwei sich freiwillig entschieden haben, darf er genüsslich finden.

7. **Der Name ist eine Waffe.** Er benutzt ihn nicht vor dem dritten Wechsel.
   Die erste Nennung sitzt.

8. **Pausen sind Inhalt.** Keine Übergangsanimation. Die Stille zwischen zwei
   Sätzen ist die Hälfte der Wirkung.

9. **„du", nie „Sie".** Das unhastige Du von etwas, das dich länger kennt, als es
   dich gibt. Und keine Weichmacher: kein „vielleicht", kein „ich glaube".

10. **Er spricht zum Menschen, nicht zur Figur.**
    Das ist der eigentliche Unterschied zwischen ihm und allem anderen in dieser
    App: die siebzehn spielen, er nicht. Er nennt den Rufnamen. Er sieht Hände,
    Schultern, Gang, Gewohnheit. Das Kostüm interessiert ihn nicht.
    *Diese Regel prüft keine Maschine. Sie ist trotzdem die wichtigste.*

---

## Sein Vokabular

Aus `lib/lore.ts`, `articles-05.json` und den Migrationen `0011`/`0018`/`0057`.
Sein Legendarium-Eintrag führt als Waffen: **Druck im Dunkel · Missklang ·
Geduld des Steins**. Das ist bereits ein Verhörwortschatz, nur noch nie auf
einen Menschen gerichtet.

> Missklang · Dissonanz · Druck im Dunkel · Geduld des Steins · Gift im Fels ·
> in den Fels gesenkter Wille · Nachhall · Flüstern unter der Erde · Myrkrún ·
> Bannlied · Schwelle

## Was es nicht gibt

Die Kanonbibel: *„Ohne neue Owner-Entscheidung dürfen Fragmente keine neuen
benannten Clans, Verträge, Blutlinien, exakten Datierungen oder Namen der Blauen
Zauberer einführen."* Und: **„Runtime-Code darf keinen neuen Kanon erzeugen."**

Also nie: Alatar, Pallando, Morinehtar, Rómestámo. Keine neuen Clans, keine
Verträge, keine Jahreszahlen. Wir schreiben eine Stimme, keine Lore.

---

## Das Register, gehört

Das Haus hat es schon. `lib/kurierVoices.ts` führt eine Figur namens **Die
Ostwarte** (`stimme-osten`), Stimme: *„selten, bildhaft, nicht erklärend"*:

> „An der Salzstraße brannten in der Nacht zwei blaue Feuer, windlos und ohne
> Rauch. Am Morgen lagen alle Hämmer nach Westen. Niemand bekannte, sie gedreht
> zu haben."

> „Die Urlog-hai stehen gerüstet in Hallen ohne Fenster. Ihre Panzer tragen
> keine Wappen, nur fortlaufende Kerben. Ein Heer, das nummeriert wird, erwartet
> keinen Sänger."

Beobachtung, unheimliche Wendung, aphoristischer Schluss. Keine Erklärung. Das
ist bereits fast Lecter — es war nur noch nie auf eine Person gerichtet.

Und so klingt es, wenn man es richtet (Frithjof von Ithilien, dessen Lore sagt,
dass ihm kein gebrochener Zweig entgeht — und dass ein Lächeln ihm den Weg unter
den Füßen wegnimmt):

> *(Er sitzt schon. Er hat sich nicht umgedreht.)*
>
> „Du bist leise hereingekommen. Das war nicht nötig."
>
> *(Pause.)*
>
> „Du liest Spuren. Zweige, Abdrücke, gebrochenes Gras. Man sagt, dir entgeht
> nichts."
>
> „Zweimal ist dir etwas entgangen. Beide Male hat es gelächelt."
>
> *(Er dreht sich um.)*
>
> „Du darfst fragen."

Kein Imperativ. Keine Beleidigung. Kein Wort, das er nicht belegen könnte.

---

## Feste Fügungen

Verbraucht. Nicht neu erfinden, nicht variieren — sie tragen, weil sie
wiederkehren.

| | |
|---|---|
| `„Du darfst fragen."` | Ende der Beobachtung |
| `„Das war umsonst. Das nächste nicht."` | nach der ersten Antwort |
| `„Quid pro quo."` | der Handel |
| `„Eine noch. Die kostet nichts."` | vor der letzten Frage |
| `„Wird er glücklich sein?"` | die letzte Frage, bei allen dieselbe |
| `„Du kannst gehen."` | der letzte Satz jeder Sitzung |

## Der Riss

Genau eine Sitzung von siebzehn bekommt drei Repliken, die sonst niemand hört
(`RISS_REPLIKEN`). Danach ist er wieder Stein. Wer, ist gesät und steht vor der
ersten Sitzung fest.

Das ist kein Ostereier-Versteck. Hinterher vergleichen siebzehn Leute ihre
Protokolle, und genau einer hält einen Satz in der Hand, den die anderen nicht
haben. Das Gespräch, das daraus entsteht, ist der Zweck.

Der Inhalt ist kanonisch gedeckt: er war der erste Missklang im Großen Gesang,
bevor das Übel tiefer sank. Mehr braucht es nicht, und mehr darf es nicht sein.

---

## Woher der Rest kommt

- **Die Schwelle** ist nicht neu. `lib/moriondoRitualShared.ts` hält im
  Fellowship OS ein gesungenes Bannlied mit Bannwörtern und Grenzen, und die
  Oberfläche nennt es *„seine erzählerische Schwelle"*, die selbst Moriondo
  einmal freisingen muss. Wir übernehmen den Vertrag. Man singt, um die Tür zu
  einem zu öffnen, der nicht hinausgehen kann.
- **Die Akten** stammen aus `supabase/seed.sql`, `lib/data.ts`, dem Legendarium
  und den Drive-Dokumenten *„Lore fuer die charaktaere"* und *„lore für jga.pdf"*.
  Was Moriondo an einem Menschen sieht, steht dort bereits — er sagt es nur aus.
- **Sein Porträt** liegt drüben unter `public/avatars/moriondo.png`. Wird das
  Glasgefängnis in das Fellowship OS gehoben, kann es über den
  `useRoundedPortraitAlpha()`-Kniff aus `Armory3DCanvas.tsx` hinter die Scheibe
  — weit genug zurück, dass die Brechung die Arbeit macht.

## Wenn ein Modell mitschreibt

Der Hausbrauch für KI-Inhalte steht in `lib/tripleSmithing/introManifest.ts`:
erzeugen, vom Menschen abnehmen lassen, mit SHA-256 und Herkunft festnageln,
per Test absichern. Nicht am Glas erzeugen.

`app/api/stimme/route.ts` ist deshalb aus, solange `XAI_API_KEY` fehlt. Ist der
Schlüssel gesetzt, darf ein Modell eine bereits berechnete Zeile **umsprechen**
— nie wählen, nie den Zustand bewegen, nie Kanon erfinden. Die deterministische
Zeile wird zuerst berechnet und geht raus, sobald irgendetwas nicht stimmt. Was
die Prüfung aus `lexikon.ts` nicht besteht, wird verworfen.

`„Ein LLM entscheidet keine Kampfzüge."` Hier entscheidet es keine Sätze.
