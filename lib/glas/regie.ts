/**
 * PUBLIC REVIEW FIXTURE, NOT THE JGA GAME ENGINE.
 * These invented observations demonstrate evidence handling. They are not
 * participant assignments, a rescue solution, or an authoritative world state.
 * Production must supply recipient-scoped frames from the private JGA server.
 */
export const REVIEW_VERSION = 1;
export const MAX_REVIEW_MOVES = 160;
export const CUE_IDS = [
  "moriondo.idle", "moriondo.pace", "moriondo.approach", "moriondo.glass",
  "moriondo.whisper", "moriondo.turn", "moriondo.delight",
  "moriondo.rage_performed", "moriondo.rage_true_break", "moriondo.rage_aftermath",
] as const;
export type CueId = (typeof CUE_IDS)[number];
export type MediaAsset = {
  video: string; poster: string; loop: boolean; durationMs: number;
  desktopObjectPosition: string; mobileObjectPosition: string;
};
export type MediaLibrary = Record<CueId, MediaAsset>;
export type EvidenceId = "strand" | "copy" | "witness" | "offer";
export type Topic = "mounts" | "command" | "capture";
export type Relation = "supports" | "contradicts";
export type ReviewAction =
  | { kind: "enter" }
  | { kind: "ask"; topic: Topic }
  | { kind: "observe"; target: "glass" | "strand" | "witness" }
  | { kind: "pressure" }
  | { kind: "silence" }
  | { kind: "bargain"; accept: boolean }
  | { kind: "release"; evidence: EvidenceId }
  | { kind: "seal"; evidence: EvidenceId }
  | { kind: "dispute" }
  | { kind: "confront"; evidence: readonly EvidenceId[]; relation: Relation }
  | { kind: "after-rage" };
export type ReviewCommand = { id: string; expectedRevision: number; action: ReviewAction };
export type Utterance = { speaker: "Moriondo" | "Du" | "Beobachtung"; text: string };
export type ReviewState = {
  revision: number;
  phase: "threshold" | "interrogation" | "rage" | "aftermath";
  cue: CueId;
  line: string;
  direction: string;
  known: readonly EvidenceId[];
  released: readonly EvidenceId[];
  asked: readonly Topic[];
  claim: "unknown" | "open" | "disputed" | "refuted";
  bargain: "none" | "offered" | "accepted" | "refused";
  pressure: number;
  rageCount: number;
  transcript: readonly Utterance[];
  commands: readonly ReviewCommand[];
};
export const EVIDENCE: Readonly<Record<EvidenceId, {
  title: string; source: string; origin: string; text: string; kind: "observation" | "claim";
}>> = {
  strand: {
    title: "Die Fadenprobe", source: "Probe A · eigene Beobachtung", origin: "sample-a", kind: "observation",
    text: "Derselbe Befehlsimpuls bleibt im Faden messbar. Die niedere Brut wendet sich trotzdem der zurückgebliebenen Spinne zu.",
  },
  copy: {
    title: "Abschrift der Fadenprobe", source: "Abschrift von Probe A · keine neue Quelle", origin: "sample-a", kind: "observation",
    text: "Die Abschrift beschreibt denselben Impuls und dieselbe Wendung. Zwei Aufzeichnungen sind hier nur eine Beobachtung.",
  },
  witness: {
    title: "Das zweite Zeugnis", source: "Probe B · unabhängige Beobachtung (simuliert)", origin: "witness-b", kind: "observation",
    text: "Eine getrennte Gegenprobe bestätigt: Die niedere Brut folgt der zurückgebliebenen Spinne, während Moriondos ursprünglicher Befehl weiterläuft.",
  },
  offer: {
    title: "Sein Angebot", source: "Moriondo · ungeprüfte Behauptung", origin: "prisoner", kind: "claim",
    text: "Er behauptet, die Tiere lebten, und verlangt, dass der Rat seinem Weg folgt. Einen unabhängigen Nachweis legt er nicht vor.",
  },
};
export const CONTROL_CLAIM = "Keine Spinne hat sich meinem Befehl widersetzt.";
const START: ReviewState = {
  revision: 0, phase: "threshold", cue: "moriondo.idle",
  line: "Die Ställe sind leer. Hinter dem Glas wartet der Einzige, der mehr weiß.",
  direction: "Lokale Regieprobe. Keine echten Hinweise, keine Änderungen am Fellowship OS.",
  known: [], released: [], asked: [], claim: "unknown", bargain: "none", pressure: 0, rageCount: 0,
  transcript: [], commands: [],
};
export function startReview(): ReviewState { return START; }
function isEvidence(value: unknown): value is EvidenceId {
  return typeof value === "string" && Object.hasOwn(EVIDENCE, value);
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Treat browser storage as untrusted. This is validation, not anti-cheat. */
export function isReviewCommand(value: unknown): value is ReviewCommand {
  if (!isRecord(value) || typeof value.id !== "string" || value.id.length < 1 || value.id.length > 100 ||
      !Number.isSafeInteger(value.expectedRevision) || (value.expectedRevision as number) < 0 || !isRecord(value.action)) return false;
  const a = value.action;
  switch (a.kind) {
    case "enter": case "pressure": case "silence": case "dispute": case "after-rage": return true;
    case "ask": return ["mounts", "command", "capture"].includes(a.topic as string);
    case "observe": return ["glass", "strand", "witness"].includes(a.target as string);
    case "bargain": return typeof a.accept === "boolean";
    case "release": case "seal": return isEvidence(a.evidence);
    case "confront": return Array.isArray(a.evidence) && a.evidence.length <= 4 && a.evidence.every(isEvidence) &&
      (a.relation === "supports" || a.relation === "contradicts");
    default: return false;
  }
}
function add<T>(items: readonly T[], item: T): readonly T[] {
  return items.includes(item) ? items : [...items, item];
}
function respond(s: ReviewState, command: ReviewCommand, player: string, line: string,
  cue: CueId, direction: string, patch: Partial<ReviewState> = {}): ReviewState {
  return { ...s, ...patch, revision: s.revision + 1, cue, line, direction,
    commands: [...s.commands, command],
    transcript: [...s.transcript, { speaker: "Du" as const, text: player },
      { speaker: "Moriondo" as const, text: line }].slice(-80),
  };
}
/** Exactly two independent, observed sources; a copy or his claim is not corroboration. */
export function hasCounterproof(s: ReviewState, evidence: readonly EvidenceId[], relation: Relation): boolean {
  const ids = [...new Set(evidence)];
  return relation === "contradicts" && s.claim === "disputed" && ids.length === 2 &&
    ids.every((id) => s.known.includes(id) && EVIDENCE[id].kind === "observation") &&
    new Set(ids.map((id) => EVIDENCE[id].origin)).size === 2 &&
    ids.some((id) => id === "strand" || id === "copy") && ids.includes("witness");
}
export function applyReview(s: ReviewState, command: ReviewCommand): ReviewState {
  if (!isReviewCommand(command) || command.expectedRevision !== s.revision ||
      (s.commands.length >= MAX_REVIEW_MOVES && command.action.kind !== "after-rage") || s.commands.some((c) => c.id === command.id)) return s;
  const a = command.action;
  if (s.phase === "threshold") {
    if (a.kind !== "enter") return s;
    return respond(s, command, "Ich trete vor das Glas.",
      "Ihr habt mich gefangen. Und nun fehlt euch etwas, das ihr nicht hinter Glas schließen könnt.",
      "moriondo.approach", "Er kommt langsam näher. Die Hände sind leer.", { phase: "interrogation" });
  }
  if (s.phase === "rage") {
    if (a.kind !== "after-rage") return s;
    return respond(s, command, "Ich bleibe stehen.",
      "Die Tiere leben. Dass ihr sie zurückholt, habt ihr damit noch nicht bewiesen.",
      "moriondo.rage_aftermath", "Seine Hand bleibt an der Scheibe. Die Ruhe kehrt zurück, die Unversehrtheit nicht.",
      { phase: "aftermath" });
  }
  // A proved defeat stays proved. There is no return to an unscarred idle state.
  if (s.phase === "aftermath" && !["release", "seal"].includes(a.kind)) {
    if (a.kind === "after-rage" || a.kind === "enter") return s;
    return respond(s, command, "Ich hake nach.",
      "Eine Stimme hat sich mir entzogen. Einen Weg habt ihr noch nicht.", "moriondo.rage_aftermath",
      "Der Gegenbeweis bleibt bestehen. Brut, Pfad, Hort und Schnitt gehören in die gemeinsame Ermittlung.");
  }
  switch (a.kind) {
    case "ask": {
      const asked = add(s.asked, a.topic);
      if (s.asked.includes(a.topic)) return respond(s, command, "Ich wiederhole meine Frage.",
        "Die Frage ist dieselbe. Was hast du inzwischen gesehen?", "moriondo.turn", "Er wartet auf etwas, das nicht nur eine Wiederholung ist.");
      if (a.topic === "command") return respond(s, command, "Hat sich eine Spinne deinem Befehl widersetzt?",
        CONTROL_CLAIM, "moriondo.glass", "Er legt die Fingerspitzen an die Scheibe. Das ist eine Behauptung, kein Beweis.", { asked, claim: "open" });
      if (a.topic === "capture") return respond(s, command, "War deine Gefangennahme geplant?",
        "Nein. Verwechsle meine Niederlage nicht mit deiner Sicherheit.", "moriondo.turn",
        "Er blickt auf eine beschädigte Stelle seines Mantels. Dann wieder zu dir.", { asked });
      return respond(s, command, "Wo sind unsere Tiere?",
        "Lebendig ist nicht dasselbe wie erreichbar. Für einen Weg könnte ich verlangen, dass ihr mir glaubt.",
        "moriondo.whisper", "Er bietet eine Abkürzung an. Vertrauen ist keine Voraussetzung für den Gegenbeweis.",
        { asked, bargain: s.bargain === "none" ? "offered" : s.bargain });
    }
    case "observe": {
      if (a.target === "glass") return respond(s, command, "Ich berühre die Scheibe.",
        "Du prüfst das Glas. Gut; es ist das Einzige hier, das dir nichts verschweigt.",
        "moriondo.glass", "Seine Hand folgt deiner auf der anderen Seite. Die Bannlinien bleiben geschlossen.");
      if (a.target === "strand") return respond(s, command, "Ich untersuche die Fadenprobe und ihre Abschrift.",
        "Zwei Blätter. Eine Beobachtung. Du wirst doch nicht schon eine Mehrheit daraus machen.",
        "moriondo.pace", "Der Impuls bleibt. Die Brut gehorcht trotzdem einer anderen Spinne.",
        { known: add(add(s.known, "strand"), "copy") });
      return respond(s, command, "Ich ziehe eine unabhängige Gegenprobe hinzu.",
        "Ein zweiter Blick. Hat er selbst gesehen, oder hat er nur deine Worte gelernt?",
        "moriondo.turn", "Regieprobe: Das unabhängige Zeugnis wird simuliert. Im Spiel kommt es von einem anderen Gefährten.",
        { known: add(s.known, "witness") });
    }
    case "bargain": {
      if (s.bargain !== "offered") return s;
      return a.accept ? respond(s, command, "Ich höre dein Angebot an, ohne es für wahr zu erklären.",
        "Die Tiere leben. Den Rest erzähle ich, sobald eure Zweifel still sind.", "moriondo.delight",
        "Das Angebot liegt unter deinem Siegel. Weder freigegeben noch bestätigt.",
        { bargain: "accepted", known: add(s.known, "offer") }) :
        respond(s, command, "Kein Handel. Ich prüfe selbst.", "Dann wirst du genauer hinsehen müssen.",
        "moriondo.pace", "Du kannst den Gegenbeweis ohne Handel führen.", { bargain: "refused" });
    }
    case "pressure": return respond(s, command, "Ich setze ihn unter Druck.",
      s.pressure ? "Lauter ist nicht genauer." : "Du möchtest, dass ich die Beherrschung verliere. Wie beruhigend das für dich wäre.",
      s.pressure ? "moriondo.delight" : "moriondo.rage_performed",
      s.pressure ? "Er kennt diesen Versuch bereits." : "Die Bewegung ist heftig. Sein Blick bleibt vollkommen kontrolliert.",
      { pressure: s.pressure + 1 });
    case "silence": return respond(s, command, "Ich schweige und beobachte.",
      "Diesmal füllst du die Stille nicht. Das macht sie nicht zu deiner.", "moriondo.pace",
      "Er geht weiter. Du bestimmst, wann du wieder sprichst; Warten ist keine versteckte Prüfung.");
    case "release": case "seal": {
      if (!s.known.includes(a.evidence)) return s;
      const released = a.kind === "release" ? add(s.released, a.evidence) : s.released.filter((id) => id !== a.evidence);
      if (released === s.released || (a.kind === "seal" && !s.released.includes(a.evidence))) return s;
      const intact = s.phase !== "aftermath";
      return respond(s, command, `${a.kind === "release" ? "Freigeben" : "Unter Siegel"}: ${EVIDENCE[a.evidence].title}.`,
        a.kind === "release" ? "Jetzt können sie es lesen. Ob sie es prüfen, ist eine andere Frage." : "Du behältst es. Das ist noch kein Urteil.",
        intact ? "moriondo.whisper" : "moriondo.rage_aftermath",
        "Nur die lokale Ratssimulation ändert sich. Teilen ist nicht Bestätigen.", { released });
    }
    case "dispute": {
      if (s.claim !== "open") return s;
      return respond(s, command, "Ich bestreite deinen Anspruch auf ungebrochenen Gehorsam.",
        "Ein Widerspruch. Noch kein Gegenbeweis.", "moriondo.glass",
        "Seine Behauptung ist jetzt bestritten. Belege und ihre Beziehung dazu fehlen noch.", { claim: "disputed" });
    }
    case "confront": {
      if (s.claim !== "disputed") return s;
      if (!hasCounterproof(s, a.evidence, a.relation)) {
        const ids = [...new Set(a.evidence)];
        const detail = ids.length !== 2 ? "Wähle genau zwei Belege; eine Sammlung ist noch kein Argument." :
          ids.some((id) => !s.known.includes(id)) ? "Ein nicht untersuchter Beleg kann deine These nicht tragen." :
          ids.some((id) => EVIDENCE[id].kind === "claim") ? "Seine eigene Aussage ist kein unabhängiger Nachweis." :
          new Set(ids.map((id) => EVIDENCE[id].origin)).size < 2 ? "Die Abschrift stammt aus derselben Quelle. Es fehlt die unabhängige Gegenprobe." :
          "Der ursprüngliche Befehl bleibt bestehen, die Brut gehorcht trotzdem anders. Prüfe die Beziehung zu seiner Behauptung.";
        return respond(s, command, "Ich lege meine Belege vor.",
          "Du hältst etwas in der Hand. Noch nicht meinen Fehler.", "moriondo.delight", detail);
      }
      return respond(s, command, "Der Befehl lief weiter. Die Brut folgte trotzdem einer anderen Spinne. Zwei unabhängige Proben widerlegen dich.",
        "Sie hat nicht— … Nein.", "moriondo.rage_true_break",
        "Zum ersten Mal verliert er deinen Blick. Er schlägt gegen Glas, von dem er weiß, dass es nicht nachgibt.",
        { phase: "rage", claim: "refuted", rageCount: 1 });
    }
    default: return s;
  }
}
export function replayReview(value: unknown): ReviewState {
  if (!Array.isArray(value)) return startReview();
  return value.slice(0, MAX_REVIEW_MOVES + 1).reduce<ReviewState>((s, command: unknown) =>
    isReviewCommand(command) ? applyReview(s, command) : s, startReview());
}
export function parseReviewStorage(raw: string | null): ReviewState {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    return isRecord(value) && value.version === REVIEW_VERSION ? replayReview(value.commands) : startReview();
  } catch { return startReview(); }
}
