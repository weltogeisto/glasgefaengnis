import { describe, expect, it } from "vitest";
import { LETZTE_FRAGE, befragbareDossiers } from "./dossier";
import { BRUCHSTUECKE_FUER_LAGEBILD, ausstehend, lagebild } from "./bruchstuecke";
import { baueProtokoll } from "./protokoll";
import type { Sitzungsakte } from "./protokoll";
import { risstraeger } from "./riss";

function akte(slug: string, antwort: string): Sitzungsakte {
  return {
    slug,
    frage: "Was ist die Blaue Glut?",
    gegenfrage: "Und?",
    preis: "Etwas Wahres.",
    letzteAntwort: antwort,
    riss: risstraeger() === slug,
  };
}

const alle = befragbareDossiers().map((dossier) => dossier.slug);

describe("Bruchstücke", () => {
  it("ergeben allein noch kein Lagebild", () => {
    const wenige = lagebild(alle.slice(0, BRUCHSTUECKE_FUER_LAGEBILD - 1));
    expect(wenige.vollstaendig).toBe(false);
    expect(wenige.schluss).toEqual([]);
  });

  it("fügen sich, sobald genug bezahlt wurde", () => {
    const genug = lagebild(alle.slice(0, BRUCHSTUECKE_FUER_LAGEBILD));
    expect(genug.vollstaendig).toBe(true);
    expect(genug.schluss.length).toBeGreaterThan(0);
  });

  it("zählen niemanden doppelt und kennen keine Fremden", () => {
    const doppelt = lagebild(["leon", "leon", "leon", "gibtesnicht"]);
    expect(doppelt.anzahl).toBe(1);
  });

  it("wissen, wer noch nicht vor dem Glas stand", () => {
    expect(ausstehend(alle)).toEqual([]);
    expect(ausstehend([])).toHaveLength(alle.length);
  });
});

describe("Das Protokoll", () => {
  it("hält die Reihenfolge der Gefährtenschaft, nicht die des Eintreffens", () => {
    const gemischt = baueProtokoll([akte("finno", "Ja."), akte("max", "Ja."), akte("leon", "Ja.")]);
    expect(gemischt.eintraege.map((eintrag) => eintrag.slug)).toEqual(["max", "leon", "finno"]);
  });

  it("sammelt die Antworten auf die eine Frage, die nichts kostet", () => {
    const voll = baueProtokoll(alle.map((slug, index) => akte(slug, `Antwort ${index}`)));
    expect(voll.letzteFrage).toBe(LETZTE_FRAGE);
    expect(voll.fuerJan).toHaveLength(alle.length);
    expect(voll.vollstaendig).toBe(true);
    expect(voll.lage.vollstaendig).toBe(true);
  });

  it("bleibt unvollständig, solange jemand fehlt", () => {
    const teil = baueProtokoll(alle.slice(0, 3).map((slug) => akte(slug, "Ja.")));
    expect(teil.vollstaendig).toBe(false);
    expect(teil.erwartet).toBe(alle.length);
  });

  it("nimmt leere letzte Antworten nicht in Jans Bild auf", () => {
    const leer = baueProtokoll([akte("leon", "   "), akte("max", "Ja, ganz sicher.")]);
    expect(leer.fuerJan).toEqual([{ name: "Max", antwort: "Ja, ganz sicher." }]);
  });
});
