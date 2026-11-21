/**
 * Owner rehearsal of Cycle I, not a multiplayer authority.
 * Source: JGA content/moriondo/cycles/netz-der-leeren-staelle.ts,
 * blob ab6f4b9cba4aa717edf5ad79e291ef2292febdaf.
 * Existing clue IDs, dependencies and four proof dimensions are retained.
 * Do NOT ship this browser-owned truth table as the live event: use the JGA
 * server projections, authenticated assignments and transactional commands.
 */
export const ROLES = ["netzleser", "waldkundiger", "sprachhueter", "chronist", "gegenzeuge", "schweiger", "bindungshueter", "netzfuehrer"] as const;
export type Role = typeof ROLES[number];
export const ROLE_NAMES: Record<Role, string> = {
  netzleser: "Netzleser", waldkundiger: "Waldkundiger", sprachhueter: "Sprachhüter",
  chronist: "Chronist", gegenzeuge: "Gegenzeuge", schweiger: "Schweiger",
  bindungshueter: "Bindungshüter", netzfuehrer: "Netzführer",
};
export type Actor = { slug: string; name: string; role: Role };
export function assignRoles(people: readonly { slug: string; name: string }[]): Actor[] {
  let n = 0;
  return [...people].filter(p => p.slug !== "jan" && p.slug !== "moriondo")
    .sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
    .map(p => ({ ...p, role: p.slug === "steven" ? "netzfuehrer" : ROLES[n++ % 7] }));
}
export const CLAIMS = ["brood", "path", "lair", "severance"] as const;
export type Claim = typeof CLAIMS[number];
export type Method = "spuren" | "faden" | "glas" | "schweigen" | "bindung";
export const METHODS: Record<Method, string> = {
  spuren: "Spuren prüfen", faden: "Leitfaden untersuchen", glas: "Glasnaht lesen",
  schweigen: "Schweigen & beobachten", bindung: "Der Bindung lauschen",
};
export type Topic = "mounts" | "capture" | "north" | "mercy" | "control";
export const TOPICS: Record<Topic, string> = {
  mounts: "Wo sind die Reittiere?", capture: "Du warst bereits gefangen.",
  north: "Du lenkst uns nach Norden.", mercy: "Stevens Spinne hast du nicht verschont.",
  control: "Du hast die Kontrolle verloren.",
};
export type Cue = "idle" | "pace" | "glass" | "whisper" | "capture" | "performed" | "rupture" | "aftermath" | "nest" | "command";
export type Evidence = {
  id: string; title: string; text: string; role: Role; method: Method;
  needs: readonly string[]; supports: readonly Claim[]; any?: readonly string[];
  exposed?: Topic; rage?: boolean; theatre?: boolean;
};
const e = (id: string, title: string, text: string, role: Role, method: Method,
  needs: string[], supports: Claim[], extra: Partial<Evidence> = {}): Evidence =>
  ({ id, title, text, role, method, needs, supports, ...extra });
export const EVIDENCE: readonly Evidence[] = [
  e("web.counterclockwise-knot", "Der linksläufige Knoten", "Der Hauptfaden schließt gegen die natürliche Zugrichtung. Das Muster gehört zu einer befehligten Brut, nicht zu einer einzelnen Jagdspinne.", "netzleser", "faden", [], ["brood"]),
  e("forest.black-yew-resin", "Harz der schwarzen Eibe", "Bitteres, fast schwarzes Harz sitzt in der Seide. Es stammt nicht von den nördlichen Fichtenwegen.", "waldkundiger", "spuren", [], ["path"]),
  e("language.not-stolen", "Das vermiedene Wort", "Moriondo sagt: Der Wald habe sie verlangt. Er spricht nicht vom Stehlen. Die Formulierung verschiebt Täter, Auftrag und Zweck.", "sprachhueter", "spuren", [], []),
  e("chronicle.dry-tack-window", "Das trockene Zaumzeug", "Vor Dol Guldurs Fall regnete es. Das unbenetzte Leder zeigt: Die Entführung begann erst nach Moriondos Gefangennahme.", "chronist", "spuren", [], []),
  e("witness.northern-pollen", "Der helle Blütenstaub", "Heller Pollen scheint nach Norden zu weisen. Er liegt aber über der Entführungsseide, nicht darunter. Er belegt den Transportweg nicht.", "gegenzeuge", "spuren", [], []),
  e("silence.thread-answers-glass", "Die Antwort ohne Stimme", "Niemand spricht. Drei Impulse laufen durch die innere Glasnaht; draußen antwortet ein Seidenfaden mit Verzögerung.", "schweiger", "schweigen", [], []),
  e("bond.southeast-pulse", "Die südöstliche Bindung", "Die Bindung ist nicht abgerissen. Aus Südost antworten mehrere schwache, lebende Echos.", "bindungshueter", "bindung", [], ["lair"]),
  e("spider.command-scar", "Die gebrochene Befehlsnarbe", "Stevens Spinne trägt eine dunkle Narbe am Leitfaden. Niedere Spinnen richten sich nach ihr aus, nicht nach dem fernen Echo im Glas.", "netzfuehrer", "faden", [], []),
  e("forest.resin-southern-eaves", "Der südliche Harzsaum", "Der schwarze Eibenharz gehört an die feuchten südlichen Säume. Die Entführer nahmen den alten Harzpfad.", "waldkundiger", "spuren", ["forest.black-yew-resin"], ["path"]),
  e("language.northern-water-lie", "Die wahre Lüge vom Nordwasser", "Wasser berührte die Seide. Moriondo verschwieg: Es war Kondenswasser der südlichen Eibensenke, nicht Wasser eines nördlichen Bachs.", "sprachhueter", "spuren", ["forest.black-yew-resin", "language.not-stolen"], ["path"], { exposed: "north" }),
  e("web.brood-signature", "Die Signatur der Hohleibenbrut", "Linkslauf, Dreifachzug und gebrochene Leitlinie kennzeichnen die niedere Hohleibenbrut. Sie empfängt Befehle, formt aber keinen eigenen Fernbefehl.", "netzleser", "faden", ["web.counterclockwise-knot", "spider.command-scar"], ["brood"]),
  e("chronicle.preissued-command", "Der Nachbefehl", "Die Entführung folgte der Gefangennahme. Seitdem sprach Moriondo nicht unbeobachtet. Der Befehl war vorher gesetzt und an seinen Fall gebunden.", "chronist", "spuren", ["chronicle.dry-tack-window"], [], { exposed: "capture" }),
  e("witness.brood-obedience-count", "Sieben Züge, ein Wille", "Sieben Zugspuren beginnen gleichzeitig. Eine einzelne Spinne hätte sie nacheinander gelegt. Eine befehligte Brut handelte im selben Augenblick.", "gegenzeuge", "spuren", ["chronicle.dry-tack-window", "spider.command-scar"], ["brood"]),
  e("bond.three-living-echoes", "Drei lebende Echos", "Die Bindungen antworten aus drei Höhen derselben Senke. Die Tiere sind getrennt festgesetzt, aber in einem gemeinsamen Wurzelraum.", "bindungshueter", "bindung", ["bond.southeast-pulse"], ["lair"]),
  e("silence.third-echo-under-roots", "Das dritte Echo unter den Wurzeln", "Nach dem dritten Glasimpuls kehrt ein dumpfer Widerhall von unten zurück. Der Hort liegt unter einem hohlen Wurzelstock, nicht im Kronennetz.", "schweiger", "schweigen", ["silence.thread-answers-glass", "chronicle.preissued-command"], ["lair"]),
  e("rage.performed-eye-track", "Der Blick im gespielten Zorn", "Während seines Ausbruchs verfolgt sein Blick jede Reaktion vor dem Glas. Er beobachtet die Wirkung. Dieser Zorn war gespielt.", "schweiger", "glas", ["language.not-stolen"], [], { theatre: true }),
  e("failure.command-not-mercy", "Keine gewährte Ausnahme", "Der Nachbefehl enthält keine Ausnahme für eine zurückbleibende Spinne. Seine Behauptung, Stevens Tier verschont zu haben, passt nicht zum Muster.", "gegenzeuge", "spuren", ["witness.brood-obedience-count", "language.not-stolen"], ["brood"]),
  e("failure.stevens-spider-broke-command", "Der Wille, an dem der Befehl brach", "Stevens Spinne zwang die nächste niedere Brut unter ihren eigenen Willen. Sie kappte eine Leitlinie. Sie blieb nicht zurück, weil Moriondo es gestattete.", "netzfuehrer", "faden", ["spider.command-scar", "failure.command-not-mercy", "web.brood-signature"], ["brood"]),
  e("failure.true-rage-rune", "Die Rune im echten Bruch", "Im belegten Kontrollverlust verdeckt er die innere Rune nicht mehr. Der dritte Knoten ist der Rückweg des Befehls.", "netzleser", "glas", ["failure.stevens-spider-broke-command", "rage.performed-eye-track"], ["severance"], { rage: true }),
  e("glass.condensation-cut-rune", "Die Kondensrune", "Lange Stille legt Feuchtigkeit auf dieselbe Rune. Der dritte Knoten trägt das Echo zum Glas zurück. Auch ohne Zorn ist die Spur lesbar.", "schweiger", "glas", ["silence.thread-answers-glass", "chronicle.preissued-command"], ["severance"]),
  e("chronicle.echo-return-delay", "Elf Atemzüge", "Zwischen äußerem Netzimpuls und Antwort im Glas liegen elf Atemzüge. Der Gegenbefehl muss vor der Rückkehr getrennt werden.", "chronist", "schweigen", ["chronicle.preissued-command"], ["severance"]),
  e("forest.root-cavity-map", "Die Karte der hohlen Wurzeln", "Harzsaum, drei Bindungsechos und Unterwurzelhall schneiden sich in der Eibensenke am Witwenstamm.", "waldkundiger", "spuren", ["forest.resin-southern-eaves", "bond.three-living-echoes", "silence.third-echo-under-roots"], ["lair", "path"]),
  e("bond.mount-breath-response", "Atem hinter der Seide", "Mehrere gebundene Atemrhythmen antworten auf die Namen ihrer Reiter. Die Reittiere leben in der Wurzelkammer.", "bindungshueter", "bindung", ["bond.three-living-echoes", "forest.root-cavity-map"], ["lair"]),
  e("web.third-knot-severance", "Der Schnitt am dritten Knoten", "Knotenfolge und Rücklaufzeit zeigen denselben Schnittpunkt. Der dritte Leitknoten muss getrennt werden, bevor das Echo das Glas erreicht.", "netzleser", "faden", ["chronicle.echo-return-delay"], ["severance"], { any: ["failure.true-rage-rune", "glass.condensation-cut-rune"] }),
  e("spider.retrace-southern-eaves", "Die rücklaufende Südspur", "Stevens Spinne zwingt eine niedere Spinne zurück auf ihren Weg. Sie nimmt den Harzpfad am südlichen Saum.", "netzfuehrer", "faden", ["web.brood-signature", "forest.resin-southern-eaves", "language.northern-water-lie", "failure.stevens-spider-broke-command"], ["path", "brood"]),
];
export const PROPOSITIONS: Record<Claim, { title: string; question: string; options: readonly string[]; answer: number }> = {
  brood: { title: "Brut", question: "Wer führte den Nachbefehl aus?", options: ["Eine einzelne Jagdspinne", "Die niedere Hohleibenbrut", "Stevens Spinne als gehorsame Dienerin"], answer: 1 },
  path: { title: "Pfad", question: "Welchen Weg nahm die Entführung?", options: ["Den nördlichen Bach", "Das Kronennetz", "Den Harzpfad am südlichen Saum"], answer: 2 },
  lair: { title: "Hort", question: "Wo leben die Reittiere noch?", options: ["In der Eibensenke am Witwenstamm", "In getrennten Wäldern", "Im nördlichen Kronennetz"], answer: 0 },
  severance: { title: "Schnitt", question: "Wo und wann endet der Rückweg?", options: ["Am ersten Knoten", "Am dritten Knoten, nach der Rückkehr", "Am dritten Knoten, bevor das Echo zum Glas zurückkehrt"], answer: 2 },
};
export type Move = { actor: string } & (
  | { type: "enter" }
  | { type: "inspect"; method: Method }
  | { type: "ask"; topic: Topic }
  | { type: "confront"; topic: Topic; evidence: string[] }
  | { type: "share"; evidenceId: string }
  | { type: "prove"; claim: Claim; answer: number; evidence: string[] }
  | { type: "command" }
);
export type Line = { speaker: "moriondo" | "regie"; text: string; cue: Cue; actor: string };
export type World = {
  known: Record<string, string[]>; shared: Record<string, { actor: string; role: Role }>;
  proven: Partial<Record<Claim, { actor: string; evidence: string[] }>>;
  asked: Record<string, Topic[]>; entered: string[]; exposed: Topic[];
  theatre: boolean; rage: boolean; finished: boolean; lines: Line[];
};
export function initialWorld(): World {
  return { known: {}, shared: {}, proven: {}, asked: {}, entered: [], exposed: [], theatre: false, rage: false, finished: false, lines: [] };
}
export function readyClues(world: World, actor: Actor): Evidence[] {
  return EVIDENCE.filter(c => c.role === actor.role && !(world.known[actor.slug] ?? []).includes(c.id)
    && c.needs.every(id => Object.hasOwn(world.shared, id))
    && (!c.any || c.any.some(id => Object.hasOwn(world.shared, id)))
    && (!c.exposed || world.exposed.includes(c.exposed)) && (!c.rage || world.rage)
    && (!c.theatre || world.theatre));
}
const FINAL_EVIDENCE = ["spider.retrace-southern-eaves", "forest.root-cavity-map", "bond.mount-breath-response", "web.third-knot-severance"];
export function commandReady(world: World): boolean {
  return CLAIMS.every(c => Object.hasOwn(world.proven, c)) && FINAL_EVIDENCE.every(id => Object.hasOwn(world.shared, id));
}
export function actNumber(world: World): 1 | 2 | 3 {
  return commandReady(world) || Object.keys(world.proven).length >= 3 ? 3 : Object.keys(world.shared).length >= 8 ? 2 : 1;
}
export function reduceMove(world: World, move: Move, actors: readonly Actor[]): World {
  const actor = actors.find(a => a.slug === move.actor);
  if (!actor || world.finished) return world;
  if (move.type !== "enter" && !world.entered.includes(actor.slug)) return world;
  const say = (text: string, cue: Cue = "glass", speaker: Line["speaker"] = "moriondo", patch: Partial<World> = {}): World => ({
    ...world, ...patch, lines: [...world.lines, { text, cue, speaker, actor: actor.slug }].slice(-120),
  });
  const available = (id: string) => Object.hasOwn(world.shared, id) || (world.known[actor.slug] ?? []).includes(id);
  switch (move.type) {
    case "enter":
      if (world.entered.includes(actor.slug)) return say("Du bist zurück. Diesmal mit etwas, das nicht von mir stammt?", world.rage ? "aftermath" : "idle");
      return say("Die Ställe sind leer. Und du schaust noch immer auf die Tür meiner Zelle.", world.entered.length ? "idle" : "capture", "moriondo", { entered: [...world.entered, actor.slug] });
    case "inspect": {
      const clue = readyClues(world, actor).find(c => c.method === move.method);
      if (!clue) return say("Hier fehlt noch ein Zusammenhang. Andere Gefährten sehen andere Spuren; freigegebene Befunde öffnen neue Ansätze.", move.method === "schweigen" ? "idle" : "pace", "regie");
      return say(clue.text, clue.id === "bond.mount-breath-response" ? "nest" : move.method === "glas" ? "glass" : "whisper", "regie", { known: { ...world.known, [actor.slug]: [...(world.known[actor.slug] ?? []), clue.id] } });
    }
    case "share": {
      const clue = EVIDENCE.find(c => c.id === move.evidenceId);
      if (!clue || !(world.known[actor.slug] ?? []).includes(clue.id) || Object.hasOwn(world.shared, clue.id)) return world;
      return say(`${actor.name} hat „${clue.title}“ freigegeben. Ein Befund ist noch kein bewiesener Schluss.`, "idle", "regie", { shared: { ...world.shared, [clue.id]: { actor: actor.slug, role: actor.role } } });
    }
    case "ask": {
      const previous = world.asked[actor.slug] ?? [];
      if (previous.includes(move.topic)) return say("Die Frage ist dieselbe. Welche deiner Spuren hat sich verändert?", "pace");
      const lines: Record<Topic, string> = {
        mounts: "Der Wald hat sie verlangt. Du nennst es Diebstahl, weil du die leeren Halfter kennst.",
        capture: "Meine Hände waren hinter Glas. Das ist der Teil, den du gesehen hast.",
        north: "Wasser hat die Seide berührt. Den Norden hast du selbst hinzugefügt.",
        mercy: "Eine Spinne ist geblieben. Du hältst eine Ausnahme für einen Fehler.",
        control: "Deine Hand liegt schon wieder am Glas. Du wartest darauf, dass ich die meine hebe.",
      };
      return say(lines[move.topic], move.topic === "control" ? "performed" : "whisper", "moriondo", { asked: { ...world.asked, [actor.slug]: [...previous, move.topic] }, theatre: world.theatre || move.topic === "control" });
    }
    case "confront": {
      const required: Partial<Record<Topic, string[]>> = {
        capture: ["chronicle.dry-tack-window"],
        north: ["forest.black-yew-resin", "language.not-stolen"],
        mercy: ["failure.command-not-mercy", "failure.stevens-spider-broke-command"],
      };
      const needs = required[move.topic];
      if (!needs || !needs.every(id => move.evidence.includes(id) && available(id)) || move.evidence.some(id => !available(id) || !EVIDENCE.some(c => c.id === id)))
        return say("Du hast die Stimme gehoben. Nicht den Beweis.", "pace");
      if (world.exposed.includes(move.topic)) return say("Diesen Widerspruch kennt die Kammer bereits. Er wird durch Wiederholung nicht größer.", world.rage ? "aftermath" : "idle", "regie");
      const text = move.topic === "mercy" ? "Zum ersten Mal sucht sein Blick keinen Zuschauer. Die innere Rune bleibt unbedeckt."
        : move.topic === "north" ? "Harz haftet länger als Wasser. Du hast endlich aufgehört, nur mir zuzuhören."
          : "Ein Befehl braucht keine freie Hand. Nur einen früheren Augenblick.";
      return say(text, move.topic === "mercy" ? "rupture" : "glass", move.topic === "mercy" ? "regie" : "moriondo", {
        exposed: [...world.exposed, move.topic], rage: world.rage || move.topic === "mercy",
      });
    }
    case "prove": {
      if (Object.hasOwn(world.proven, move.claim)) return world;
      const ids = [...new Set(move.evidence)];
      const sources = ids.map(id => world.shared[id]);
      const supported = ids.length >= 2 && ids.every(id => Object.hasOwn(world.shared, id) && EVIDENCE.some(c => c.id === id && c.supports.includes(move.claim)));
      if (move.answer !== PROPOSITIONS[move.claim].answer || !supported || new Set(sources.filter(Boolean).map(s => s.role)).size < 2 || new Set(sources.filter(Boolean).map(s => s.actor)).size < 2)
        return say("Der Schluss hält noch nicht. Er braucht passende freigegebene Belege aus zwei verschiedenen Rollen und von zwei Gefährten.", "pace", "regie");
      return say(`${PROPOSITIONS[move.claim].title} ist belegt. Zwei unabhängige Perspektiven tragen denselben Schluss.`, move.claim === "lair" ? "nest" : "glass", "regie", { proven: { ...world.proven, [move.claim]: { actor: actor.slug, evidence: ids } } });
    }
    case "command":
      if (actor.slug !== "steven" || actor.role !== "netzfuehrer" || !commandReady(world))
        return say("Der Gegenbefehl ist noch nicht tragfähig, oder sein Träger fehlt. Brut, Pfad, Hort und Schnitt müssen unabhängig belegt sein.", "idle", "regie");
      return say("Stevens Spinne wendet den Befehl gegen die Leitlinie. Der Rückweg zum Glas reißt ab. Die Bergung kann beginnen.", "command", "regie", { finished: true });
  }
}
/** Runtime boundary for local saves and exported rehearsal logs. No assertions of trust. */
export function isMove(value: unknown): value is Move {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.actor !== "string" || !/^[a-z0-9-]{1,64}$/.test(v.actor)) return false;
  const evidence = Array.isArray(v.evidence) && v.evidence.length <= 8 && v.evidence.every(id => typeof id === "string" && EVIDENCE.some(c => c.id === id));
  switch (v.type) {
    case "enter": case "command": return true;
    case "inspect": return typeof v.method === "string" && Object.hasOwn(METHODS, v.method);
    case "ask": return typeof v.topic === "string" && Object.hasOwn(TOPICS, v.topic);
    case "confront": return typeof v.topic === "string" && Object.hasOwn(TOPICS, v.topic) && evidence;
    case "share": return typeof v.evidenceId === "string" && EVIDENCE.some(c => c.id === v.evidenceId);
    case "prove": return typeof v.claim === "string" && CLAIMS.some(c => c === v.claim) && typeof v.answer === "number" && Number.isInteger(v.answer) && v.answer >= 0 && v.answer <= 2 && evidence;
    default: return false;
  }
}
export const MAX_MOVES = 600;
export function replay(moves: readonly unknown[], actors: readonly Actor[]): World {
  return moves.slice(0, MAX_MOVES).reduce<World>((world, move) => isMove(move) ? reduceMove(world, move, actors) : world, initialWorld());
}
