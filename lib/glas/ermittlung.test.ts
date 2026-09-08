import { describe, expect, it } from "vitest";
import {
  RUNEN, beginneErmittlung, ermittle, fallFuer, leseErmittlungszug,
  spieleErmittlungNach, type Ermittlung, type Fall, type Rune,
} from "./ermittlung";

const fall = fallFuer("hendrik", "Hendrik");
function beweise(f: Fall = fall): Ermittlung {
  let s = beginneErmittlung();
  for (const id of ["riegel", "spur", "glas", "takt", "schrift"]) s = ermittle(s, { art: "untersuchen", id }, f);
  return s;
}
function ordnung(f: Fall = fall): Ermittlung {
  let s = ermittle(beweise(f), { art: "vorhalten", beweise: ["riegel", "spur"] }, f);
  s = ermittle(s, { art: "deuten", text: "Ruf" }, f);
  return s;
}
function permutations(items: readonly Rune[]): Rune[][] {
  if (!items.length) return [[]];
  return items.flatMap((x, i) => permutations(items.filter((_, n) => i !== n)).map((rest) => [x, ...rest]));
}

describe("interrogation rehearsal", () => {
  it("is deterministic, immutable, and creates a five-rune permutation", () => {
    expect(fallFuer("hendrik", "Hendrik")).toEqual(fall);
    expect(new Set(fall.folge).size).toBe(5);
    const initial = beginneErmittlung();
    ermittle(initial, { art: "untersuchen", id: "glas" }, fall);
    expect(initial.entdeckt).toEqual([]);
    expect(initial.zuege).toEqual([]);
  });
  it("requires discovered evidence; the client cannot jump to completion", () => {
    const s = beginneErmittlung();
    for (const z of [
      { art: "vorhalten", beweise: ["riegel", "spur"] },
      { art: "deuten", text: "Ruf" },
      { art: "ordnen", runen: fall.folge },
      { art: "rueckruf", runen: [...fall.folge].reverse() },
    ]) expect(ermittle(s, z, fall)).toBe(s);
  });
  it("only advances on the meaningful evidence pair", () => {
    const s = beweise();
    expect(ermittle(s, { art: "vorhalten", beweise: ["glas", "schrift"] }, fall).phase).toBe("spuren");
    expect(ermittle(s, { art: "vorhalten", beweise: ["spur", "riegel"] }, fall).phase).toBe("schluss");
  });
  it("rejects three-character nonsense and negated keyword guesses", () => {
    const s = ermittle(beweise(), { art: "vorhalten", beweise: ["spur", "riegel"] }, fall);
    for (const text of ["abc", "Kein Ruf", "kein ruf sondern gewalt", "Ruf Gewalt"]) {
      expect(ermittle(s, { art: "deuten", text }, fall).phase).toBe("schluss");
    }
    expect(ermittle(s, { art: "deuten", text: "  EIN LOCKRUF!  " }, fall).phase).toBe("ordnung");
  });
  it("has exactly one valid rune order and one valid return call", () => {
    const s = ordnung();
    const possible = permutations(RUNEN);
    expect(possible.filter((runen) => ermittle(s, { art: "ordnen", runen }, fall).phase === "rueckruf")).toEqual([[...fall.folge]]);
    const next = ermittle(s, { art: "ordnen", runen: fall.folge }, fall);
    expect(possible.filter((runen) => ermittle(next, { art: "rueckruf", runen }, fall).phase === "gesichert")).toEqual([[...fall.folge].reverse()]);
  });
  it("requires the three physical clues even with the right sequence", () => {
    let s = beginneErmittlung();
    for (const id of ["riegel", "spur"]) s = ermittle(s, { art: "untersuchen", id }, fall);
    s = ermittle(s, { art: "vorhalten", beweise: ["riegel", "spur"] }, fall);
    s = ermittle(s, { art: "deuten", text: "Ruf" }, fall);
    expect(ermittle(s, { art: "ordnen", runen: fall.folge }, fall)).toBe(s);
  });
  it("remembers mistakes without destroying earned evidence", () => {
    const s = ordnung();
    const wrong = ermittle(s, { art: "ordnen", runen: [...fall.folge].reverse() }, fall);
    expect(wrong.fehler).toBe(1);
    expect(wrong.entdeckt).toEqual(s.entdeckt);
    expect(ermittle(wrong, { art: "ordnen", runen: fall.folge }, fall).phase).toBe("rueckruf");
  });
  it("deduplicates inspection, evidence pairs and repeated topics", () => {
    const one = ermittle(beginneErmittlung(), { art: "untersuchen", id: "glas" }, fall);
    expect(ermittle(one, { art: "untersuchen", id: "glas" }, fall)).toBe(one);
    const q = ermittle(one, { art: "fragen", text: "Was weißt du vom Tor?" }, fall);
    expect(ermittle(q, { art: "fragen", text: "Und der Riegel?" }, fall)).toBe(q);
    const s = beweise();
    const wrong = ermittle(s, { art: "vorhalten", beweise: ["glas", "schrift"] }, fall);
    expect(ermittle(wrong, { art: "vorhalten", beweise: ["schrift", "glas"] }, fall)).toBe(wrong);
  });
  it("allows a subject to be revisited in a later phase", () => {
    let s = ermittle(ordnung(), { art: "fragen", text: "Was ist mit den Namen?" }, fall);
    s = ermittle(s, { art: "ordnen", runen: fall.folge }, fall);
    const next = ermittle(s, { art: "fragen", text: "Was ist mit den Namen?" }, fall);
    expect(next.zuege.length).toBe(s.zuege.length + 1);
    expect(next.wechsel.at(-1)?.text).toContain("anderen");
  });
  it("treats intentional silence as an explicit move, not a timed trap", () => {
    const s = beginneErmittlung();
    const quiet = ermittle(s, { art: "schweigen" }, fall);
    expect(quiet.haltung).toBe("hand");
    expect(quiet.wechsel.at(-1)?.text).toContain("rückwärts");
    expect(quiet.fehler).toBe(0);
  });
  it("caps optional hints without blocking a solution", () => {
    let s = ordnung();
    for (let i = 0; i < 10; i++) s = ermittle(s, { art: "hilfe" }, fall);
    expect(s.hilfen).toBe(3);
    s = ermittle(s, { art: "ordnen", runen: fall.folge }, fall);
    expect(ermittle(s, { art: "rueckruf", runen: [...fall.folge].reverse() }, fall).phase).toBe("gesichert");
  });
  it("validates hostile and corrupt persisted input without throwing", () => {
    for (const input of [null, true, 8, "x", [], {}, { art: "deuten", text: {} }, { art: "vorhalten", beweise: ["spur", "spur"] }, { art: "ordnen", runen: Array(5).fill("Nacht") }, { art: "untersuchen", id: "secret" }]) {
      expect(leseErmittlungszug(input)).toBeNull();
      expect(() => ermittle(beginneErmittlung(), input, fall)).not.toThrow();
    }
    expect(spieleErmittlungNach(fall, { phase: "gesichert" })).toEqual(beginneErmittlung());
  });
  it("replays each completed session exactly and makes completion terminal", () => {
    for (let index = 0; index < 200; index++) {
      const f = fallFuer(`reiter-${index}`, "Gefährte");
      let s = ordnung(f);
      s = ermittle(s, { art: "ordnen", runen: f.folge }, f);
      s = ermittle(s, { art: "rueckruf", runen: [...f.folge].reverse() }, f);
      expect(s.phase).toBe("gesichert");
      expect(spieleErmittlungNach(f, s.zuege)).toEqual(s);
      expect(ermittle(s, { art: "hilfe" }, f)).toBe(s);
      for (const w of s.wechsel.filter((w) => w.sprecher === "moriondo")) expect([...w.text].length).toBeLessThanOrEqual(180);
    }
  });
});
