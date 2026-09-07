import { describe, expect, it } from "vitest";
import { hashString, mulberry32, pick, pickMany, rngFor } from "./rng";

describe("Gesäter Zufall", () => {
  it("hasht stabil und ohne Vorzeichen", () => {
    expect(hashString("frithjof")).toBe(hashString("frithjof"));
    expect(hashString("frithjof")).not.toBe(hashString("finsch"));
    expect(hashString("")).toBeGreaterThanOrEqual(0);
  });

  it("liefert aus derselben Saat dieselbe Folge", () => {
    const a = Array.from({ length: 8 }, mulberry32(1234));
    const b = Array.from({ length: 8 }, mulberry32(1234));
    expect(a).toEqual(b);
    expect(a.every((wert) => wert >= 0 && wert < 1)).toBe(true);
  });

  it("wählt deterministisch aus einer Liste", () => {
    const liste = ["a", "b", "c", "d", "e"] as const;
    expect(pick(liste, "schluessel")).toBe(pick(liste, "schluessel"));
    expect(() => pick([], "leer")).toThrow();
  });

  it("zieht ohne Zurücklegen und übertreibt nicht", () => {
    const liste = [1, 2, 3, 4, 5];
    const drei = pickMany(liste, 3, "x");
    expect(drei).toHaveLength(3);
    expect(new Set(drei).size).toBe(3);
    expect(pickMany(liste, 99, "x")).toHaveLength(5);
    expect(pickMany(liste, -1, "x")).toHaveLength(0);
  });

  it("streut über verschiedene Schlüssel", () => {
    const gezogen = new Set(
      Array.from({ length: 60 }, (_, index) => pick(["a", "b", "c", "d"], `k${index}`)),
    );
    expect(gezogen.size).toBeGreaterThan(2);
    expect(rngFor("gleich")()).toBe(rngFor("gleich")());
  });
});
