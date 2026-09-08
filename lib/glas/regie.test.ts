import { describe, expect, it } from "vitest";
import { applyReview, hasCounterproof, isReviewCommand, MAX_REVIEW_MOVES, parseReviewStorage,
  replayReview, REVIEW_VERSION, startReview, type ReviewAction, type ReviewState } from "./regie";

const move = (s: ReviewState, action: ReviewAction) => applyReview(s, {
  id: `test-${s.revision}-${action.kind}`, expectedRevision: s.revision, action,
});
function prepared() {
  let s = move(startReview(), { kind: "enter" });
  s = move(s, { kind: "ask", topic: "command" });
  s = move(s, { kind: "observe", target: "strand" });
  s = move(s, { kind: "observe", target: "witness" });
  return move(s, { kind: "dispute" });
}
const proof: ReviewAction = { kind: "confront", evidence: ["strand", "witness"], relation: "contradicts" };

describe("public director's review, not authoritative multiplayer", () => {
  it("starts outside the glass and requires entry", () => {
    const s = startReview();
    expect(move(s, { kind: "pressure" })).toBe(s);
    expect(move(s, { kind: "enter" }).phase).toBe("interrogation");
  });
  it("preserves a genuine capture rather than retroactively making it his plan", () => {
    const s = move(move(startReview(), { kind: "enter" }), { kind: "ask", topic: "capture" });
    expect(s.line).toMatch(/^Nein\./);
  });
  it("recognises a repeated question", () => {
    let s = move(startReview(), { kind: "enter" });
    s = move(s, { kind: "ask", topic: "command" });
    s = move(s, { kind: "ask", topic: "command" });
    expect(s.asked).toEqual(["command"]);
    expect(s.line).toContain("inzwischen gesehen");
  });
  it("does not treat a claim as truth", () => {
    const s = move(move(startReview(), { kind: "enter" }), { kind: "ask", topic: "command" });
    expect(s.claim).toBe("open");
    expect(s.rageCount).toBe(0);
  });
  it("does not permit a confrontation before explicitly disputing the claim", () => {
    const s = move(startReview(), { kind: "enter" });
    expect(move(s, proof)).toBe(s);
  });
  it("rejects a duplicate source even when presented on two different cards", () => {
    const s = prepared();
    expect(hasCounterproof(s, ["strand", "copy"], "contradicts")).toBe(false);
    const next = move(s, { kind: "confront", evidence: ["strand", "copy"], relation: "contradicts" });
    expect(next.direction).toContain("derselben Quelle");
    expect(next.phase).toBe("interrogation");
  });
  it("accepts the copy plus a genuinely independent source", () => {
    expect(hasCounterproof(prepared(), ["copy", "witness"], "contradicts")).toBe(true);
  });
  it("rejects undiscovered evidence", () => {
    let s = move(startReview(), { kind: "enter" });
    s = move(move(s, { kind: "ask", topic: "command" }), { kind: "dispute" });
    expect(move(s, proof).phase).toBe("interrogation");
  });
  it("requires the logical relation, not merely collecting the cards", () => {
    const next = move(prepared(), { kind: "confront", evidence: ["strand", "witness"], relation: "supports" });
    expect(next.claim).toBe("disputed");
    expect(next.rageCount).toBe(0);
  });
  it("does not turn his bargain into independent corroboration", () => {
    let s = move(prepared(), { kind: "ask", topic: "mounts" });
    s = move(s, { kind: "bargain", accept: true });
    expect(s.known).toContain("offer");
    expect(s.released).not.toContain("offer");
    expect(move(s, { kind: "confront", evidence: ["offer", "witness"], relation: "contradicts" }).claim).toBe("disputed");
  });
  it("allows refusal of the bargain without a soft lock", () => {
    let s = move(prepared(), { kind: "ask", topic: "mounts" });
    s = move(s, { kind: "bargain", accept: false });
    expect(move(s, proof).phase).toBe("rage");
  });
  it("separates disclosure from verification", () => {
    const s = prepared();
    const shared = move(s, { kind: "release", evidence: "strand" });
    expect(shared.released).toEqual(["strand"]);
    expect(shared.claim).toBe(s.claim);
    expect(shared.rageCount).toBe(0);
    expect(move(shared, { kind: "seal", evidence: "strand" }).released).toEqual([]);
  });
  it("does not share private observations as a side effect of confrontation", () => {
    expect(move(prepared(), proof).released).toEqual([]);
  });
  it("does not allow sharing an unknown clue", () => {
    const s = move(startReview(), { kind: "enter" });
    expect(move(s, { kind: "release", evidence: "witness" })).toBe(s);
  });
  it("does not let anger be farmed through insults or pressure", () => {
    let s = move(startReview(), { kind: "enter" });
    s = move(s, { kind: "pressure" });
    expect(s.cue).toBe("moriondo.rage_performed");
    for (let i = 0; i < 10; i++) s = move(s, { kind: "pressure" });
    expect(s.rageCount).toBe(0);
    expect(s.claim).toBe("unknown");
  });
  it("earns the true break through counterproof, once", () => {
    let s = move(prepared(), proof);
    expect(s.phase).toBe("rage");
    expect(s.cue).toBe("moriondo.rage_true_break");
    expect(s.claim).toBe("refuted");
    expect(move(s, { kind: "pressure" })).toBe(s);
    s = move(s, { kind: "after-rage" });
    s = move(s, { kind: "pressure" });
    s = move(s, proof);
    expect(s.rageCount).toBe(1);
    expect(s.claim).toBe("refuted");
    expect(s.cue).toBe("moriondo.rage_aftermath");
  });
  it("permits the same aftermath without playing the video", () => {
    expect(move(move(prepared(), proof), { kind: "after-rage" }).phase).toBe("aftermath");
  });
  it("rejects stale asynchronous media callbacks", () => {
    const before = move(prepared(), proof);
    const after = move(before, { kind: "after-rage" });
    expect(applyReview(after, { id: "late", expectedRevision: before.revision, action: { kind: "after-rage" } })).toBe(after);
  });
  it("rejects duplicate commands", () => {
    const first = { id: "one", expectedRevision: 0, action: { kind: "enter" } } as const;
    const s = applyReview(startReview(), first);
    expect(applyReview(s, { ...first, expectedRevision: s.revision })).toBe(s);
  });
  it("deterministically replays the full review and preserves the aftermath", () => {
    const s = move(move(prepared(), proof), { kind: "after-rage" });
    expect(replayReview(s.commands)).toEqual(s);
    expect(parseReviewStorage(JSON.stringify({ version: REVIEW_VERSION, commands: s.commands }))).toEqual(s);
  });
  it.each([null, "broken", "{}", '{"version":99,"commands":[]}', '{"version":1,"commands":{}}'])("handles corrupt storage: %s", (raw) => {
    expect(parseReviewStorage(raw)).toEqual(startReview());
  });
  it.each([null, [], {}, { id: "x", expectedRevision: -1, action: { kind: "enter" } },
    { id: "x", expectedRevision: 0, action: { kind: "ask", topic: "secret" } },
    { id: "x", expectedRevision: 0, action: { kind: "release", evidence: "__proto__" } },
    { id: "x", expectedRevision: 0, action: { kind: "confront", evidence: ["master-solution"], relation: "contradicts" } },
  ])("rejects malformed commands: %j", (input) => expect(isReviewCommand(input)).toBe(false));
  it("bounds local history without trapping a just-earned rage beat", () => {
    let s = prepared();
    while (s.commands.length < MAX_REVIEW_MOVES - 1) s = move(s, { kind: "silence" });
    s = move(s, proof);
    expect(s.phase).toBe("rage");
    s = move(s, { kind: "after-rage" });
    expect(s.phase).toBe("aftermath");
    expect(replayReview(s.commands)).toEqual(s);
    expect(move(s, { kind: "pressure" })).toBe(s);
  });
});
