import type { Mood } from "./presence";

/**
 * MEDIA_PROTOTYPE_ONLY
 *
 * This is a canon-safe media and performance demonstration. It is deliberately not the
 * authoritative multiplayer interrogation, clue graph, participant memory or final solution.
 * JGA Fellowship OS owns those systems. Do not expand this matcher into the production game.
 */
export const MEDIA_PROTOTYPE_ONLY = true as const;

export const RIDDLE =
  "Ein Faden blieb zurück, als alle anderen dem Düsterwald folgten. Er war nicht schwächer. Er gehorchte einem stärkeren Willen. Welcher Faden war es?";

export type Reply = {
  text: string;
  mood: Mood;
  /** Existing speech files belong to the deprecated prototype. New canon stays silent until re-recorded. */
  audio?: string;
  progress?: { riddle?: boolean; letters?: boolean };
};

export const REPLIES: Record<string, Reply> = {
  open: {
    text: "Die Ställe sind leer. Die Tiere leben. Zwischen diesen beiden Sätzen liegt der Fehler, den ihr finden müsst. Setz dich nicht. Wer bequem wird, glaubt mir zu früh.",
    mood: "idle",
  },
  bruchstelle: {
    text: "Stevens Spinne. Nicht verschont. Nicht übersehen. Sie brach meinen Befehl und zwang die niedere Brut unter ihren eigenen Willen. Jetzt wisst ihr, wo mein Netz zum ersten Mal versagte.",
    mood: "whisper",
    progress: { riddle: true },
  },
  pferd: {
    text: `Sie wurden physisch fortgeschafft. Düsterwald-Spinnen trugen, zogen und führten sie durch das Netz. Sie sind lebendig. Das beantwortet nur die Hand — noch nicht den Zweck.\n\n${RIDDLE}`,
    mood: "sniff",
  },
  wer: {
    text: "Moriondo. Besiegt genug, um hinter Glas zu stehen. Gefährlich genug, um euch von hier aus bei der Arbeit zuzusehen.",
    mood: "closer",
  },
  lied: {
    text: `Kein Lied. Ein Befehl, verteilt über Zug, Knoten und Gehorsam. Nennt es Magie, wenn euch das Wort beruhigt.\n\n${RIDDLE}`,
    mood: "turn",
  },
  droh: {
    text: "Das Glas hielt, als mein Zorn größer war als mein Verstand. Es wird auch deine Drohung halten. Die Frage ist nicht, wer das Gefängnis bricht. Die Frage ist, wer draußen wem gehorcht.",
    mood: "rage",
  },
  wege: {
    text: "Vier Beweise, ehe Stevens Spinne den Gegenbefehl tragen kann: Brut. Pfad. Hort. Schnitt. Fehlt einer, antwortet nur ein Teil des Netzes — und ich lerne aus eurem Irrtum.",
    mood: "delight",
    progress: { letters: true },
  },
  elbereth: {
    text: "Licht verletzt die Urseide nicht allein. Erst wenn ihr etwas freiwillig darin bindet, das ich nicht befehlen kann, verliert der alte Zauber seinen Halt.",
    mood: "rage",
  },
  warte: {
    text: "Warten ist keine Untätigkeit. Während ihr schweigt, entscheidet ihr, welche Spur ihr freigebt — und welche Macht ihr ihr damit gebt.",
    mood: "sit",
  },
  hoeflich: {
    text: `Eine bessere Frage. Oder wenigstens eine ehrlichere.\n\n${RIDDLE}\n\nFreigeben ist noch kein Beweisen. Versucht, diesen Unterschied zu behalten.`,
    mood: "bow",
  },
  storm: {
    text: "Zorn kann gespielt werden. Echter Kontrollverlust schaut niemandem beim Wirken zu. Merkt euch den Unterschied, bevor ihr glaubt, mich provoziert zu haben.",
    mood: "storm",
  },
  sniff: {
    text: "Nasses Leder. Waldharz. Angst. Der Stall haftet euch noch an. Das Netz weiß längst, welche Spur ihr zuerst schützen wollt.",
    mood: "sniff",
  },
  closer: {
    text: "Näher. Nicht weil ich dich brauche. Weil Menschen im Spiegel lieber mein Gesicht prüfen als ihre eigene Entscheidung.",
    mood: "closer",
  },
  hysteria: {
    text: "Lachen ist nützlich. Es macht eine Drohung kleiner und den Lachenden unvorsichtiger. Beides genügt mir.",
    mood: "laugh",
  },
  stride: {
    text: "Ich messe nicht die Zelle. Ich messe, wie lange ihr braucht, bis eine geteilte Beobachtung für euch zur Wahrheit wird.",
    mood: "stride",
  },
  cocoon: {
    text: "Ein Nest gehört zu keinem Reittier. Zu groß. Zu alt. Zu sorgfältig gebunden. Ihr habt noch nicht entschieden, ob das eine Rettung oder eine zweite Gefangenschaft bedeutet.",
    mood: "glass",
  },
};

export type CodexSection = {
  kicker: string;
  title: string;
  paragraphs: string[];
  green?: string;
  citeKey?: "bruchstelle" | "wege";
};

export const CODEX: CodexSection[] = [
  {
    kicker: "Nachspiel von Dol Guldur",
    title: "Eine wirkliche Niederlage",
    paragraphs: [
      "Moriondo wurde im Glassaal bezwungen und körperlich in den Zylinder gebannt. Seine erste Reaktion war kein kalkuliertes Schauspiel, sondern ein unkontrollierter Angriff auf das Glas.",
      "Er bleibt gefährlich, weil sein Einfluss nicht nur durch unmittelbare Gewalt wirkt. Er beobachtet, welche Aussagen geteilt, geglaubt und gemeinsam bestätigt werden.",
    ],
  },
  {
    kicker: "Spuren in den Stallungen",
    title: "Die körperliche Entführung",
    paragraphs: [
      "Die Reittiere wurden von niederen Düsterwald-Spinnen verschleppt. Zurück blieben Zaumzeug, Schleifspuren, Harz und verschieden gebundene Fäden.",
      "Die Tiere leben. Die Mount-Nester sind Haftorte und zugleich Knoten eines größeren Befehlsnetzes.",
    ],
  },
  {
    kicker: "Der erste Fehler im Netz",
    title: "Stevens Spinne",
    paragraphs: [
      "Eine Spinne blieb zurück. Sie war nicht frei von Moriondos Befehl; sie war stärker als er an diesem Knoten und zwang die niedere Brut, ihr zu gehorchen.",
      "Sie kann einen Gegenbefehl tragen. Sie kann ihn nicht selbst zusammensetzen.",
    ],
    green: "Ein Faden blieb, weil ein stärkerer Wille ihn hielt.",
    citeKey: "bruchstelle",
  },
  {
    kicker: "Der Rat der Reiter",
    title: "Freigeben ist nicht bestätigen",
    paragraphs: [
      "Eine freigegebene Spur wird sichtbar und kann neue Fragen für andere Reiter öffnen. Sie gilt dadurch noch nicht als wahr.",
      "Erst unabhängige Belege machen aus einer Beobachtung einen tragfähigen Teil des Gegenbefehls.",
    ],
    green: "Brut · Pfad · Hort · Schnitt",
    citeKey: "wege",
  },
  {
    kicker: "Nicht im Stallregister",
    title: "Das unzugeordnete Nest",
    paragraphs: [
      "Jenseits der Mount-Nester liegt ein Gefäß aus älterer Urseide. Es ist größer, tiefer gebunden und keinem Reittier zugeordnet.",
      "Die frühen Aufzeichnungen zeigen weder Gesicht noch sichere Gestalt. Seine Bedeutung bleibt bis zur gemeinsamen Entschlüsselung versiegelt.",
    ],
  },
];

export function matchReply(raw: string): Reply {
  const q = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/(steven|bruchstelle|starkerer wille|spinne blieb)/.test(q)) return REPLIES.bruchstelle;
  if (/(pferd|reittier|mount|stall|entfuhr|verschlepp|wo sind)/.test(q)) return REPLIES.pferd;
  if (/(wer bist|wer seid|moriondo)/.test(q)) return REPLIES.wer;
  if (/(lied|sing|musik|befehl)/.test(q)) return REPLIES.lied;
  if (/(droh|tot|schlag|brechen|zerstor|glas)/.test(q)) return REPLIES.droh;
  if (/(brut|pfad|hort|schnitt|vier beweise|gegenbefehl)/.test(q)) return REPLIES.wege;
  if (/(elbereth|phiole|phial|licht|urseide)/.test(q)) return REPLIES.elbereth;
  if (/(warte|schweig|freigeb|bestatig)/.test(q)) return REPLIES.warte;
  if (/(lach|witz|appetitlich)/.test(q)) return REPLIES.hysteria;
  if (/(naher|komm nah|closer|spiegel)/.test(q)) return REPLIES.closer;
  if (/(riech|geruch|duft|leder|harz)/.test(q)) return REPLIES.sniff;
  if (/(zorn|wut|kontrollverlust|emotion)/.test(q)) return REPLIES.storm;
  if (/(lauf|schritt|auf und ab|pace|geh auf)/.test(q)) return REPLIES.stride;
  if (/(kokon|cocoon|nest|nicht zugeordnet|zu gross)/.test(q)) return REPLIES.cocoon;
  return REPLIES.hoeflich;
}

export function chipsFor(riddle: boolean, letters: boolean, questions: number, maxQ: number): string[] {
  if (questions >= maxQ) return ["Wann öffnet die nächste Wache?", "Ich prüfe die Akte"];
  if (!riddle) return ["Die leeren Ställe", "Stevens Spinne", "Wer bist du?", "Was hielt das Glas?"];
  if (!letters) return ["Brut · Pfad · Hort · Schnitt", "Das unzugeordnete Nest", "Was willst du?", "Licht gegen Urseide"];
  return ["Freigeben ist nicht bestätigen", "Was misst das Glas?", "Ich schweige", "Warum lächelst du?"];
}

export function objectiveFor(riddle: boolean, letters: boolean, questions: number, maxQ: number): string {
  if (questions >= maxQ) return "Diese Medienwache endet hier. Die eigentliche Ermittlung läuft später gemeinsam in JGA OS weiter.";
  if (!riddle) return "Finde den ersten Knoten, an dem Moriondos Befehl versagte.";
  if (!letters) return "Ordne die vier Bestandteile, die Stevens Spinne für einen Gegenbefehl braucht.";
  return "Trenne Beobachtung, Freigabe und Beweis. Moriondo versucht, sie gleichzusetzen.";
}
