import type { Mood } from "./presence";

export const RIDDLE =
  "Wo andere die Hoffnung suchen, suche ich etwas Schärferes. Sternennarbe, blaue Augen, leere Ostkarte. Was suche ich zuerst?";

export type Reply = {
  text: string;
  mood: Mood;
  audio: string;
  progress?: { riddle?: boolean; letters?: boolean };
};

export const REPLIES: Record<string, Reply> = {
  open: {
    text: `Hendrik. Du riechst nach nassem Leder und ungeduldiger Hoffnung. Setz dich. Ich schreie nie.\n\n${RIDDLE}\n\nSechs Gänge. Dann bin ich satt.`,
    mood: "talk",
    audio: "open",
  },
  bruchstelle: {
    text: "Ah. Die Bruchstelle. Du hast Ohren. Selten, bei Männern deiner Art.\n\nLies jetzt den Codex. In Grün steht, was ich mit Namen tue. Sag es mir. Wortnah.",
    mood: "whisper",
    audio: "bruchstelle",
    progress: { riddle: true },
  },
  pferd: {
    text: `Du schreist nach dem Stall, wie ein Kind nach der Speise, die man ihm nahm, ehe es kauen lernte.\n\nDas Tier ist nicht fort. Die Bindung ist umgesungen. Wer nach Fleisch sucht, sucht den Teller, nicht den Koch.\n\n${RIDDLE}`,
    mood: "sniff",
    audio: "pferd",
  },
  wer: {
    text: "Ich bin, was übrig blieb, als das Lied falsch gesungen wurde. Höflich. Nicht gütig. Und du stehst draußen.",
    mood: "closer",
    audio: "wer",
  },
  lied: {
    text: `Old Tom sings of sun and stream. I sing the stall that lost its dream.\n\nSchön, dass du Ohren hast. Jetzt den Verstand.\n\n${RIDDLE}`,
    mood: "song",
    audio: "lied",
  },
  droh: {
    text: "Du willst das Glas brechen. Wie rührend. Wie appetitlich ungebildet.\n\nIch habe mich selbst hineingesungen. Nicht aus Reue. Aus Geschmack.",
    mood: "laugh",
    audio: "laugh",
  },
  wege: {
    text: "Du hast gelesen. Selten. Also ein Geschenk, das keines ist.\n\nDrei glühende Wege. Nur einer führt zum Stall. Die anderen führen dich in den Irrtum.",
    mood: "delight",
    audio: "wege",
    progress: { letters: true },
  },
  elbereth: {
    text: "Diesen Namen nimmst du in den Mund, als wäre er ein Schlüssel. Er ist keiner. Er ist Licht. Und Licht stört mich. Weiter.",
    mood: "rage",
    audio: "elbereth",
  },
  warte: {
    text: "Ich habe Jahrhunderte geübt. Du hast sechs Fragen. Wähle sie weise.",
    mood: "sit",
    audio: "warte",
  },
  hoeflich: {
    text: `Höflichkeit zuerst, Hendrik. ${RIDDLE}\n\nWähle. Ich habe Zeit. Du nicht.`,
    mood: "bow",
    audio: "hoeflich",
  },
  storm: {
    text: "Siehst du? Alles in einem Gesicht. Zorn. Hunger. Höflichkeit. Wähle, welches du füttern willst.",
    mood: "storm",
    audio: "storm",
  },
  sniff: {
    text: "Nasses Leder. Angst. Und etwas Süßes darunter. Du bringst den Stall mit dir, Hendrik.",
    mood: "sniff",
    audio: "sniff",
  },
  closer: {
    text: "Näher. Noch näher. Ich schreie nie. Du musst das Glas nicht brechen, um mich zu riechen.",
    mood: "closer",
    audio: "wer",
  },
  hysteria: {
    text: "Ha. Wie rührend. Wie appetitlich.\n\nEin Lachen ist nur Zorn, der die Zähne gefunden hat.",
    mood: "laugh",
    audio: "laugh",
  },
  stride: {
    text: "Sechs Schritte. Zurück. Ich messe mein Haus. Ich habe Zeit. Du nicht.",
    mood: "stride",
    audio: "warte",
  },
};

export type CodexSection = {
  kicker: string;
  title: string;
  paragraphs: string[];
  green?: string;
  citeKey?: string;
};

export const CODEX: CodexSection[] = [
  {
    kicker: "Das Tiefe Herz des Schattens",
    title: "Ursprung und Wesen",
    paragraphs: [
      "Moriondo ist eine uralte, böse und ortsgebundene Macht unter den Bergen des Ostens. Sein Reich endet mit seinem Fels. Er begehrt weder Banner noch Krone.",
      "Lange existierte er nicht als Geist mit Leib, sondern als Druck im Dunkel: ein in den Fels gesenkter Wille.",
    ],
  },
  {
    kicker: "In Geist, nicht in Antlitz",
    title: "Der böse Spiegel",
    paragraphs: [
      "Die Weisen kennen Tom Bombadil — Meister seines Lieds, unberührbar vom Ring. Moriondo ist dasselbe Gesetz, umgedreht.",
      "Auch er singt, und das, was er singt, gehorcht. Ortsgebunden aus Macht, nicht aus Schwäche.",
    ],
  },
  {
    kicker: "Diebstahl ohne Hände",
    title: "Das Lied vom leeren Stall",
    paragraphs: [
      "Kein Schloss war gebrochen. Die Tiere waren nicht fortgeschafft. Ihre Bindung war unternommen.",
      "Er nennt den leeren Stall, nicht das Tier. Wer nach dem Körper sucht, sucht falsch.",
    ],
    green: "Er unternimmt den Namen. Er sang den Stall leer.",
  },
  {
    kicker: "Belagerung und Beute",
    title: "Die Nacht der Feste",
    paragraphs: [
      "Als der Turm barst, fand man ihn in einem Zylinder aus Glas. Er hatte sich selbst hineingesungen. Nicht aus Reue. Aus Souveränität.",
    ],
    green: "Drei glühende Wege lagen auf Aikanors Karte — Rhûn, seine Hallen, Harad.",
    citeKey: "wege",
  },
];

export function matchReply(raw: string): Reply {
  const q = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/(bruchstelle|bruch)/.test(q)) return REPLIES.bruchstelle;
  if (/(pferd|reittier|stall|wo ist)/.test(q)) return REPLIES.pferd;
  if (/(wer bist|wer seid)/.test(q)) return REPLIES.wer;
  if (/(lied|sing|musik)/.test(q)) return REPLIES.lied;
  if (/(droh|toet|tot|schlag|brechen|zerstor)/.test(q)) return REPLIES.droh;
  if (/(drei gluhende|gluhende wege|wege)/.test(q)) return REPLIES.wege;
  if (/elbereth/.test(q)) return REPLIES.elbereth;
  if (/warte|codex gelesen/.test(q)) return REPLIES.warte;
  if (/(lach|lachst|witz|appetitlich)/.test(q)) return REPLIES.hysteria;
  if (/(naher|komm nah|closer)/.test(q)) return REPLIES.closer;
  if (/(riech|geruch|duft|leder)/.test(q)) return REPLIES.sniff;
  if (/(zorn|wut|gesicht|emotion)/.test(q)) return REPLIES.storm;
  if (/(lauf|schritt|auf und ab|pace|geh auf)/.test(q)) return REPLIES.stride;
  return REPLIES.hoeflich;
}

export function chipsFor(riddle: boolean, letters: boolean, questions: number, maxQ: number): string[] {
  if (questions >= maxQ) return ["Wann öffnet die nächste Wache?", "Ich lese den Codex"];
  if (!riddle)
    return [
      "Bruchstelle",
      "Das Pferd",
      "Wer bist du?",
      "Warum lachst du?",
      "Komm näher",
      "Geh auf und ab",
    ];
  if (!letters) return ["Drei glühende Wege", "Ich habe den Codex gelesen", "Sing vom leeren Stall", "Elbereth"];
  return ["Ich warte", "Riech mich", "Elbereth", "Was ist deine Musik?"];
}

export function objectiveFor(riddle: boolean, letters: boolean, questions: number, maxQ: number): string {
  if (questions >= maxQ) return "Diese Wache ist zu Ende. Lies den Codex. Komm wieder.";
  if (!riddle) return "Schritt 1: sein Rätsel. Wähle die Antwort, die nur dich kennt — nicht das Pferd.";
  if (!letters) return "Schritt 2: Codex, grüne Zeile. „Zum Glas sagen“ — oder tippe das Zitat.";
  return "Die ersten zwei Türen stehen offen. Die Chiffre braucht Zeit.";
}
