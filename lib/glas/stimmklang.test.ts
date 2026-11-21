import { describe, expect, it } from "vitest";
import { HALLRAUM, KLANGPLAENE, huellkurve, impulsantwort } from "./stimmklang";

describe("Der Klang der Zelle", () => {
  it("kennt genau drei Geräusche, und alle sind leise", () => {
    const plaene = Object.values(KLANGPLAENE);
    expect(plaene).toHaveLength(3);
    for (const plan of plaene) {
      expect(plan.spitze, plan.art).toBeGreaterThan(0);
      // Nichts hier darf jemanden erschrecken. Stille ist die Grundstellung.
      expect(plan.spitze, plan.art).toBeLessThanOrEqual(0.25);
      expect(plan.dauer, plan.art).toBeGreaterThan(0);
    }
  });

  it("lässt nur den Raumton in Schleife laufen", () => {
    expect(KLANGPLAENE.raum.schleife).toBe(true);
    expect(KLANGPLAENE.sprechanlage.schleife).toBe(false);
    expect(KLANGPLAENE.knoechel.schleife).toBe(false);
  });

  it("baut denselben Raum auf jedem Gerät", () => {
    const a = impulsantwort(48000);
    const b = impulsantwort(48000);
    expect(Array.from(a.slice(0, 64))).toEqual(Array.from(b.slice(0, 64)));
    expect(a.length).toBe(Math.floor(48000 * HALLRAUM.dauer));
  });

  it("lässt den Hall abklingen statt stehen zu bleiben", () => {
    const antwort = impulsantwort(44100);
    const spitze = (von: number, bis: number) =>
      Math.max(...Array.from(antwort.slice(von, bis), Math.abs));
    expect(spitze(0, 4410)).toBeGreaterThan(spitze(antwort.length - 4410, antwort.length));
    expect(Math.abs(antwort[antwort.length - 1])).toBeLessThan(0.02);
  });

  it("hört an einer anderen Saat einen anderen Raum", () => {
    const zelle = impulsantwort(8000);
    const anders = impulsantwort(8000, "irgendwo-sonst");
    expect(Array.from(zelle.slice(0, 32))).not.toEqual(Array.from(anders.slice(0, 32)));
  });

  it("steigt an und fällt wieder, ohne zu klicken", () => {
    const plan = KLANGPLAENE.knoechel;
    expect(huellkurve(plan, 0)).toBe(0);
    expect(huellkurve(plan, plan.dauer)).toBe(0);
    expect(huellkurve(plan, plan.anschlag)).toBeCloseTo(plan.spitze, 5);
    expect(huellkurve(plan, plan.anschlag + 0.4)).toBeLessThan(plan.spitze);
  });
});
