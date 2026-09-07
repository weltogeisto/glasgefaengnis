import { describe, expect, it } from "vitest";
import { BANNLIED, BANN_TREFFER_NOETIG, pruefeBann } from "./schwelle";

describe("Die Schwelle", () => {
  it("öffnet sich dem vollständigen Bannlied", () => {
    const geprueft = pruefeBann(BANNLIED.join(" "));
    expect(geprueft.offen).toBe(true);
    expect(geprueft.fehlend).toBe(0);
  });

  it("verzeiht Spracherkennung in einem lauten Raum", () => {
    expect(pruefeBann("elbereth sternenlicht schatten stein").offen).toBe(true);
    expect(pruefeBann("ELBERETH, Sternenlicht! Schatten... Feuer.").offen).toBe(true);
    expect(pruefeBann("elbereth sternenlicht schatten steine und mehr").offen).toBe(true);
  });

  it("bleibt zu, wenn niemand singt", () => {
    expect(pruefeBann("").offen).toBe(false);
    expect(pruefeBann("hallo ist da wer").offen).toBe(false);
    const knapp = pruefeBann("elbereth schatten stein");
    expect(knapp.offen).toBe(false);
    expect(knapp.fehlend).toBe(BANN_TREFFER_NOETIG - 3);
  });

  it("zählt jedes Bannwort nur einmal", () => {
    const wiederholt = pruefeBann("schatten schatten schatten schatten schatten");
    expect(wiederholt.treffer).toEqual(["schatten"]);
    expect(wiederholt.offen).toBe(false);
  });
});
