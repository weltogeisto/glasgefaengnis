/*
 * DEPRECATED HISTORICAL PROTOTYPE — DO NOT IMPORT INTO ACTIVE UI.
 *
 * This file preserves the first six-question song/empty-stall concept for history only.
 * It conflicts with docs/STORY_CONTRACT.md: Moriondo did not imprison himself, the mounts
 * were physically abducted by Düsterwald spiders, and no participant name belongs in
 * universal dialogue. The active media prototype lives in ../script.ts.
 */

import type { Mood } from "../presence";

export const LEGACY_RIDDLE =
  "Wo andere die Hoffnung suchen, suche ich etwas Schärferes. Sternennarbe, blaue Augen, leere Ostkarte. Was suche ich zuerst?";

export type LegacyReply = {
  text: string;
  mood: Mood;
  audio: string;
  progress?: { riddle?: boolean; letters?: boolean };
};

export const LEGACY_REPLIES: Record<string, LegacyReply> = {
  open: {
    text: "Hendrik. Du riechst nach nassem Leder und ungeduldiger Hoffnung. Setz dich. Ich schreie nie. Sechs Gänge. Dann bin ich satt.",
    mood: "idle",
    audio: "open",
  },
  bruchstelle: {
    text: "Ah. Die Bruchstelle. Du hast Ohren. Selten, bei Männern deiner Art.\n\nLies jetzt den Codex. In Grün steht, was ich mit Namen tue. Sag es mir. Wortnah.",
    mood: "whisper",
    audio: "bruchstelle",
    progress: { riddle: true },
  },
  pferd: {
    text: `Du schreist nach dem Stall, wie ein Kind nach der Speise, die man ihm nahm, ehe es kauen lernte.\n\nDas Tier ist nicht fort. Die Bindung ist umgesungen. Wer nach Fleisch sucht, sucht den Teller, nicht den Koch.\n\n${LEGACY_RIDDLE}`,
    mood: "sniff",
    audio: "pferd",
  },
  wer: {
    text: "Ich bin, was übrig blieb, als das Lied falsch gesungen wurde. Höflich. Nicht gütig. Und du stehst draußen.",
    mood: "closer",
    audio: "wer",
  },
  lied: {
    text: `Old Tom sings of sun and stream. I sing the stall that lost its dream.\n\nSchön, dass du Ohren hast. Jetzt den Verstand.\n\n${LEGACY_RIDDLE}`,
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
    text: `Höflichkeit zuerst, Hendrik. ${LEGACY_RIDDLE}\n\nWähle. Ich habe Zeit. Du nicht.`,
    mood: "bow",
    audio: "hoeflich",
  },
};

export const LEGACY_NOTICE =
  "Archived only. This concept is not canonical and must never be surfaced to players.";
