import { test } from "vitest";
import assert from "node:assert/strict";
import { assignRoles, CLAIMS, commandReady, EVIDENCE, initialWorld, isMove, MAX_MOVES, PROPOSITIONS, readyClues, reduceMove, replay, ROLES, type Actor, type Move, type World } from "./ermittlung";

const ACTORS: Actor[] = ROLES.map((role, i) => ({ slug: role === "netzfuehrer" ? "steven" : `person-${i}`, name: `Person ${i}`, role }));
const who = (role: Actor["role"]) => ACTORS.find(a => a.role === role)!.slug;
function driver() {
  let world = initialWorld();
  const moves: Move[] = [];
  return { get world() { return world; }, moves,
    move(move: Move) { moves.push(move); world = reduceMove(world, move, ACTORS); return world; },
    enterAll() { for (const a of ACTORS) this.move({ type: "enter", actor: a.slug }); },
  };
}
/** Exercise reachable actions; never inject evidence into a success-path state. */
function solve(rage = true) {
  const d = driver(); d.enterAll();
  for (let pass = 0; pass < 12; pass++) {
    for (const a of ACTORS) {
      for (const clue of readyClues(d.world, a)) {
        if (!rage && clue.rage) continue;
        d.move({ type: "inspect", actor: a.slug, method: clue.method });
      }
      for (const id of d.world.known[a.slug] ?? []) {
        if (!Object.hasOwn(d.world.shared, id)) d.move({ type: "share", actor: a.slug, evidenceId: id });
      }
    }
    for (const [topic, evidence] of [
      ["capture", ["chronicle.dry-tack-window"]],
      ["north", ["forest.black-yew-resin", "language.not-stolen"]],
      ...(rage ? [["mercy", ["failure.command-not-mercy", "failure.stevens-spider-broke-command"]]] : []),
    ] as ["capture" | "north" | "mercy", string[]][]) {
      if (!d.world.exposed.includes(topic) && evidence.every(id => Object.hasOwn(d.world.shared, id)))
        d.move({ type: "confront", topic, evidence, actor: who("sprachhueter") });
    }
    if (rage && !d.world.theatre) d.move({ type: "ask", topic: "control", actor: who("schweiger") });
  }
  for (const claim of CLAIMS) {
    const candidates = EVIDENCE.filter(e => e.supports.includes(claim) && Object.hasOwn(d.world.shared, e.id));
    const first = candidates[0];
    const second = candidates.find(e => e.role !== first.role)!;
    d.move({ type: "prove", actor: who("sprachhueter"), claim, answer: PROPOSITIONS[claim].answer, evidence: [first.id, second.id] });
  }
  return d;
}

test("role assignment is order-independent and Steven alone gets the command role", () => {
  const people = [...ACTORS, { slug: "jan", name: "Jan" }, { slug: "moriondo", name: "Moriondo" }];
  assert.deepEqual(assignRoles(people), assignRoles([...people].reverse()));
  assert.equal(assignRoles(people).find(p => p.slug === "steven")?.role, "netzfuehrer");
  assert.equal(assignRoles(people).filter(p => p.role === "netzfuehrer").length, 1);
  assert.equal(assignRoles(people).length, 8);
});
test("all clue dependencies resolve, IDs are unique and no clue depends on itself", () => {
  assert.equal(new Set(EVIDENCE.map(c => c.id)).size, EVIDENCE.length);
  for (const c of EVIDENCE) for (const id of [...c.needs, ...(c.any ?? [])]) {
    assert.ok(EVIDENCE.some(e => e.id === id)); assert.notEqual(id, c.id);
  }
});
test("unentered and unknown actors cannot change the world", () => {
  const s = initialWorld();
  assert.equal(reduceMove(s, { type: "command", actor: "unknown" }, ACTORS), s);
  assert.equal(reduceMove(s, { type: "inspect", method: "faden", actor: who("netzleser") }, ACTORS), s);
});
test("observations are personal until voluntarily shared", () => {
  const d = driver(); d.enterAll();
  d.move({ type: "inspect", method: "faden", actor: who("netzleser") });
  assert.deepEqual(d.world.known[who("netzleser")], ["web.counterclockwise-knot"]);
  assert.equal(Object.keys(d.world.shared).length, 0);
  const before = d.world;
  d.move({ type: "share", actor: who("chronist"), evidenceId: "web.counterclockwise-knot" });
  assert.equal(d.world, before);
  d.move({ type: "share", actor: who("netzleser"), evidenceId: "web.counterclockwise-knot" });
  assert.equal(d.world.shared["web.counterclockwise-knot"].role, "netzleser");
});
test("duplicate release is idempotent", () => {
  const d = driver(); d.enterAll(); const actor = who("netzleser");
  d.move({ type: "inspect", method: "faden", actor });
  const move: Move = { type: "share", actor, evidenceId: "web.counterclockwise-knot" };
  const before = d.move(move); assert.equal(d.move(move), before);
});
test("repeated questions do not unlock evidence or produce genuine rage", () => {
  const d = driver(); d.enterAll();
  for (let n = 0; n < 12; n++) d.move({ type: "ask", actor: who("sprachhueter"), topic: "control" });
  assert.equal(d.world.theatre, true); assert.equal(d.world.rage, false);
  assert.equal(Object.keys(d.world.shared).length, 0);
  assert.equal(d.world.asked[who("sprachhueter")].length, 1);
});
test("faked and undiscovered evidence cannot trigger a rupture", () => {
  const d = driver(); d.enterAll();
  d.move({ type: "confront", actor: who("sprachhueter"), topic: "mercy", evidence: ["failure.command-not-mercy", "failure.stevens-spider-broke-command"] });
  assert.equal(d.world.rage, false); assert.deepEqual(d.world.exposed, []);
});
test("the capture alibi requires a discovered counter-observation", () => {
  const d = driver(); d.enterAll(); const actor = who("chronist");
  const move: Move = { type: "confront", actor, topic: "capture", evidence: ["chronicle.dry-tack-window"] };
  d.move(move); assert.equal(d.world.exposed.includes("capture"), false);
  d.move({ type: "inspect", actor, method: "spuren" }); d.move(move);
  assert.equal(d.world.exposed.includes("capture"), true);
});
test("the real rupture is earned and recorded once", () => {
  const d = solve(); assert.equal(d.world.rage, true);
  assert.equal(d.world.lines.filter(l => l.cue === "rupture").length, 1);
  d.move({ type: "confront", actor: who("sprachhueter"), topic: "mercy", evidence: ["failure.command-not-mercy", "failure.stevens-spider-broke-command"] });
  assert.equal(d.world.exposed.filter(t => t === "mercy").length, 1);
});
test("all four proofs and the counter-command are reachable through legal actions", () => {
  const d = solve(); assert.equal(commandReady(d.world), true);
  assert.equal(d.world.finished, false);
  d.move({ type: "command", actor: "steven" }); assert.equal(d.world.finished, true);
  assert.equal(d.world.lines.at(-1)?.cue, "command");
  assert.deepEqual(replay(d.moves, ACTORS), d.world);
  assert.ok(d.moves.length < MAX_MOVES);
});
test("the complete silent route never requires genuine rage", () => {
  const d = solve(false); assert.equal(d.world.rage, false);
  assert.equal(Object.hasOwn(d.world.shared, "glass.condensation-cut-rune"), true);
  assert.equal(commandReady(d.world), true);
  d.move({ type: "command", actor: "steven" }); assert.equal(d.world.finished, true);
});
test("a correct guess without shared proof is rejected", () => {
  const d = driver(); d.enterAll();
  d.move({ type: "prove", actor: who("netzleser"), claim: "brood", answer: 1, evidence: ["web.counterclockwise-knot", "witness.brood-obedience-count"] });
  assert.deepEqual(d.world.proven, {});
});
test("matching evidence still needs two roles and two different people", () => {
  const d = solve(false); const base: World = { ...d.world, proven: {} };
  const move: Move = { type: "prove", actor: who("sprachhueter"), claim: "brood", answer: 1, evidence: ["web.counterclockwise-knot", "web.brood-signature"] };
  assert.equal(reduceMove(base, move, ACTORS).proven.brood, undefined);
  const ids = ["web.counterclockwise-knot", "witness.brood-obedience-count"];
  const forged: World = { ...base, shared: { ...base.shared, [ids[1]]: { actor: base.shared[ids[0]].actor, role: "gegenzeuge" } } };
  assert.equal(reduceMove(forged, { ...move, evidence: ids }, ACTORS).proven.brood, undefined);
});
test("wrong conclusions and duplicate evidence never count as proof", () => {
  const d = solve(false); const base = { ...d.world, proven: {} };
  const move: Move = { type: "prove", actor: who("netzleser"), claim: "brood", answer: 0, evidence: ["web.counterclockwise-knot", "witness.brood-obedience-count"] };
  assert.equal(reduceMove(base, move, ACTORS).proven.brood, undefined);
  assert.equal(reduceMove(base, { ...move, answer: 1, evidence: ["web.counterclockwise-knot", "web.counterclockwise-knot"] }, ACTORS).proven.brood, undefined);
});
test("the pollen decoy does not corroborate the northern route", () => {
  const d = solve(false); const base = { ...d.world, proven: {} };
  assert.equal(reduceMove(base, { type: "prove", actor: who("gegenzeuge"), claim: "path", answer: 0, evidence: ["witness.northern-pollen", "forest.black-yew-resin"] }, ACTORS).proven.path, undefined);
});
test("only Steven can transmit; completion is terminal and replay-idempotent", () => {
  const d = solve(false);
  d.move({ type: "command", actor: who("chronist") }); assert.equal(d.world.finished, false);
  const done = d.move({ type: "command", actor: "steven" });
  assert.equal(d.move({ type: "command", actor: "steven" }), done);
  assert.equal(d.move({ type: "inspect", actor: "steven", method: "faden" }), done);
});
test("proofs alone do not bypass the actual recovery chain", () => {
  const d = solve(false);
  const shared = { ...d.world.shared }; delete shared["bond.mount-breath-response"];
  assert.equal(commandReady({ ...d.world, shared }), false);
});
test("save boundary discards malformed actions and prototype keys", () => {
  for (const value of [null, true, 3, {}, { actor: "steven", type: "inspect", method: "__proto__" },
    { actor: "steven", type: "ask", topic: "constructor" },
    { actor: "steven", type: "prove", claim: "brood", answer: NaN, evidence: [] },
    { actor: "steven", type: "share", evidenceId: "invented" },
    { actor: "steven", type: "confront", topic: "mercy", evidence: Array(9).fill("failure.command-not-mercy") },
  ]) assert.equal(isMove(value), false);
  assert.deepEqual(replay([null, { forgedWorld: true }], ACTORS), initialWorld());
});
test("replay is bounded and identical across serialisation", () => {
  const d = solve(false);
  assert.deepEqual(replay(JSON.parse(JSON.stringify(d.moves)), ACTORS), d.world);
  assert.deepEqual(replay([...Array(MAX_MOVES).fill(null), { type: "enter", actor: "steven" }], ACTORS), initialWorld());
});
