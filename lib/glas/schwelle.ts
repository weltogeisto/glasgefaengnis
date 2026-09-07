/**
 * Die Schwelle.
 *
 * Der Gang zur Zelle ist keine neue Erfindung. Das Fellowship OS hat die Tür
 * längst gebaut: `lib/moriondoRitualShared.ts` hält ein gesungenes Bannlied
 * mit Bannwörtern und Grenzen, `app/api/moriondo/ritual/route.ts` prüft es,
 * und die Oberfläche nennt es „seine erzählerische Schwelle" — die selbst
 * Moriondo einmal freisingen muss.
 *
 * Wir übernehmen den Vertrag, statt einen zweiten zu erfinden. Das hält uns
 * innerhalb von „Runtime-Code darf keinen neuen Kanon erzeugen", und es ergibt
 * genau das richtige Bild: man singt, um die Tür zu einem zu öffnen, der nicht
 * hinausgehen kann.
 */

export const BANNLIED = [
  "Elbereth, Sternenlicht,",
  "wach an diesem Tor.",
  "Schatten, weich vor ihrem Glanz,",
  "kehr nie mehr hervor.",
  "Bei Stern und Stein,",
  "bei Feuer und Lied:",
  "Moriondo öffnet,",
  "wo Dunkelheit flieht.",
] as const;

/** Die Bannwörter. Übernommen, nicht neu gewählt. */
export const BANNWOERTER = [
  "elbereth",
  "sternenlicht",
  "schatten",
  "stein",
  "feuer",
  "moriondo",
  "dunkelheit",
] as const;

/** Vier Treffer öffnen. Wer nuschelt, kommt trotzdem durch — wer schweigt, nicht. */
export const BANN_TREFFER_NOETIG = 4;

export type Bannpruefung = {
  readonly offen: boolean;
  readonly treffer: readonly string[];
  readonly fehlend: number;
};

function normalisiere(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("ß", "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/gu, "")
    .replace(/[^a-z\s]/gu, " ");
}

function entumlaute(wort: string): string {
  return wort
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    .replaceAll("ß", "ss");
}

/**
 * Prüft gesprochenen oder getippten Text gegen die Bannwörter.
 * Absichtlich großzügig: Spracherkennung auf einem Telefon in einem lauten
 * Raum ist keine Diktatprüfung, und niemand soll dreimal singen müssen.
 */
export function pruefeBann(text: string): Bannpruefung {
  const gesagt = normalisiere(text);
  const treffer = BANNWOERTER.filter((wort) => gesagt.includes(entumlaute(wort)));
  return {
    offen: treffer.length >= BANN_TREFFER_NOETIG,
    treffer,
    fehlend: Math.max(0, BANN_TREFFER_NOETIG - treffer.length),
  };
}
