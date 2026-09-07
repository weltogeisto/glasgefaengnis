/**
 * Die Kanonschlösser als Daten.
 *
 * `docs/lore/blue-glut-canon-bible.md` im Fellowship OS ist eindeutig:
 * „Runtime-Code darf keinen neuen Kanon erzeugen." Wir schreiben eine Stimme,
 * keine Lore. Was Moriondo sein darf, steht hier — und `stimme.test.ts` prüft
 * jede Zeile dagegen, damit ihn niemand aus Versehen umschreibt.
 */

/** Sein eigenes Vokabular. Aus `lib/lore.ts`, `articles-05.json`, `0018`, `0057`. */
export const MORIONDO_LEXIKON = [
  "Missklang",
  "Dissonanz",
  "Druck im Dunkel",
  "Geduld des Steins",
  "Gift im Fels",
  "Nachhall",
  "Flüstern unter der Erde",
  "Myrkrún",
  "Bannlied",
  "Schwelle",
] as const;

/**
 * Namen, die es in diesem Werk nicht gibt. Die Kanonbibel verbietet neue
 * Clans, Verträge, Blutlinien und exakte Datierungen — und die zwei Blauen
 * bleiben unbenannt.
 */
export const VERBOTENE_NAMEN = ["Alatar", "Pallando", "Morinehtar", "Rómestámo"] as const;

/**
 * Machtansprüche, die er nicht erheben darf. `0057` hat ihn ausdrücklich vom
 * Heerführer zur ortsgebundenen Macht zurückgeschrieben: er begehrt weder
 * Banner noch Krone, führt keine Heere, steht nicht in ihrer Hierarchie.
 */
export const VERBOTENE_ANSPRUECHE: readonly RegExp[] = [
  /\bmein(?:e|em|en|er)?\s+Heer\b/i,
  /\bmein(?:e|em|en|er)?\s+Banner\b/i,
  /\bmein(?:e|em|en|er)?\s+Krone\b/i,
  /\bmein(?:e|em|en|er)?\s+Diener\b/i,
  /\bich\s+(?:befehle|gebiete|herrsche|gebot|befahl)\b/i,
  /\bgehorch(?:t|en|e)\s+mir\b/i,
  /\bmeine\s+(?:Zauberer|Blauen|Schmiede)\b/i,
  /\bunter\s+meinem\s+Befehl\b/i,
];

/**
 * Imperative. Er befiehlt niemandem etwas — das ist der ganze Trick: über
 * siebzehn Sitzungen sagt er kein einziges Mal, was jemand tun soll, und alle
 * tun es trotzdem. Geprüft wird gegen die Imperativstämme, die in dieser Art
 * Text überhaupt vorkommen können.
 */
export const IMPERATIVSTAEMME = [
  "Sag", "Sage", "Sprich", "Erzähl", "Erzähle", "Antworte", "Nenne", "Nenn",
  "Erklär", "Erkläre", "Beweis", "Beweise", "Zeig", "Zeige", "Gib", "Nimm",
  "Geh", "Komm", "Bleib", "Warte", "Hör", "Höre", "Sieh", "Schau", "Denk",
  "Denke", "Frag", "Frage", "Öffne", "Schließ", "Schweig", "Schweige", "Tu",
  "Tue", "Mach", "Mache", "Lass", "Bring", "Beeil", "Vergiss", "Entscheide",
  "Wähle", "Wähl", "Setz", "Setze", "Steh", "Knie", "Trink", "Iss",
] as const;

const IMPERATIV_MUSTER = new RegExp(
  `(?:^|[.!?…«»„“"']\\s+|—\\s+)(?:${IMPERATIVSTAEMME.join("|")})\\b(?![a-zäöüß])`,
);

/** Weichmacher. Er relativiert nicht. Er weiß es, oder er sagt, dass er es nicht weiß. */
export const VERBOTENE_WEICHMACHER: readonly RegExp[] = [
  /\bvielleicht\b/i,
  /\bwomöglich\b/i,
  /\bich\s+glaube\b/i,
  /\bich\s+denke\b/i,
  /\birgendwie\b/i,
  /\bein\s+bisschen\b/i,
  /\bmöglicherweise\b/i,
];

/** Höchstlänge einer Replik in Unicode-Codepoints — die Butterblüm-Regel. */
export const MAX_REPLIK_CODEPOINTS = 180;

/** Höchstzahl Sätze je Replik. */
export const MAX_REPLIK_SAETZE = 2;

export type Regelbruch = {
  readonly regel: string;
  readonly zeile: string;
  readonly detail?: string;
};

function codepoints(value: string): number {
  return [...value].length;
}

function saetze(value: string): number {
  return value
    .split(/(?<=[.!?…])\s+/u)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

/**
 * Prüft eine einzelne Moriondo-Replik gegen alle Register- und Kanonregeln.
 * Gibt jeden Bruch zurück statt beim ersten abzubrechen — wer eine Zeile
 * repariert, will alle Gründe auf einmal sehen.
 */
export function pruefeReplik(zeile: string): Regelbruch[] {
  const brueche: Regelbruch[] = [];
  const push = (regel: string, detail?: string) => brueche.push({ regel, zeile, detail });

  if (codepoints(zeile) > MAX_REPLIK_CODEPOINTS) {
    push("laenge", `${codepoints(zeile)} > ${MAX_REPLIK_CODEPOINTS} Codepoints`);
  }
  if (saetze(zeile) > MAX_REPLIK_SAETZE) {
    push("satzzahl", `${saetze(zeile)} > ${MAX_REPLIK_SAETZE} Sätze`);
  }
  if (zeile.includes("!")) {
    push("lautstaerke", "Er hebt die Stimme nicht.");
  }
  if (IMPERATIV_MUSTER.test(zeile)) {
    push("imperativ", zeile.match(IMPERATIV_MUSTER)?.[0]?.trim());
  }
  for (const name of VERBOTENE_NAMEN) {
    if (new RegExp(`\\b${name}\\b`, "i").test(zeile)) push("verbotener_name", name);
  }
  for (const muster of VERBOTENE_ANSPRUECHE) {
    if (muster.test(zeile)) push("machtanspruch", muster.source);
  }
  for (const muster of VERBOTENE_WEICHMACHER) {
    if (muster.test(zeile)) push("weichmacher", muster.source);
  }
  return brueche;
}
