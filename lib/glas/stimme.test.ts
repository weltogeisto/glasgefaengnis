import { describe, expect, it } from "vitest";
import { DOSSIERS, FRAGEN_KANON, LETZTE_FRAGE, RISS_REPLIKEN, befragbareDossiers } from "./dossier";
import { pruefeReplik } from "./lexikon";
import { FUEGUNGEN, abschied, alleRepliken, eroeffnung, waehleFragen } from "./stimme";

/** Jede Zeile, die Moriondo in diesem Werk je sagen kann. */
function gesamterBestand(): { zeile: string; quelle: string }[] {
  const out: { zeile: string; quelle: string }[] = [];
  for (const dossier of DOSSIERS) {
    for (const zeile of alleRepliken(dossier)) out.push({ zeile, quelle: dossier.slug });
  }
  for (const frage of FRAGEN_KANON) {
    for (const zeile of frage.antwort) out.push({ zeile, quelle: `kanon:${frage.id}` });
  }
  for (const zeile of RISS_REPLIKEN) out.push({ zeile, quelle: "riss" });
  for (const zeile of Object.values(FUEGUNGEN)) out.push({ zeile, quelle: "fuegung" });
  out.push({ zeile: LETZTE_FRAGE, quelle: "letzte-frage" });
  return out;
}

describe("Register und Kanon", () => {
  it("hält jede einzelne Replik im Register", () => {
    const brueche = gesamterBestand().flatMap(({ zeile, quelle }) =>
      pruefeReplik(zeile).map((bruch) => `${quelle}: [${bruch.regel}] ${bruch.detail ?? ""} — „${zeile}"`),
    );
    expect(brueche).toEqual([]);
  });

  it("kennt über den gesamten Bestand keinen einzigen Imperativ", () => {
    // Die vierte Regel, und die einzige, die ihn wirklich ausmacht: Er sagt
    // niemandem, was zu tun ist — und alle tun es trotzdem.
    const imperative = gesamterBestand()
      .filter(({ zeile }) => pruefeReplik(zeile).some((bruch) => bruch.regel === "imperativ"))
      .map(({ zeile }) => zeile);
    expect(imperative).toEqual([]);
  });

  it("erhebt nirgends einen Machtanspruch, den 0057 ihm genommen hat", () => {
    const ansprueche = gesamterBestand()
      .filter(({ zeile }) => pruefeReplik(zeile).some((bruch) => bruch.regel === "machtanspruch"))
      .map(({ zeile }) => zeile);
    expect(ansprueche).toEqual([]);
  });

  it("nennt die zwei Blauen nicht beim Namen", () => {
    const namen = gesamterBestand()
      .filter(({ zeile }) => pruefeReplik(zeile).some((bruch) => bruch.regel === "verbotener_name"))
      .map(({ zeile }) => zeile);
    expect(namen).toEqual([]);
  });

  it("weiß es oder weiß es nicht, aber relativiert nie", () => {
    const weich = gesamterBestand()
      .filter(({ zeile }) => pruefeReplik(zeile).some((bruch) => bruch.regel === "weichmacher"))
      .map(({ zeile }) => zeile);
    expect(weich).toEqual([]);
  });

  it("sagt ausdrücklich, wenn er etwas nicht weiß", () => {
    const bestand = gesamterBestand().map(({ zeile }) => zeile);
    expect(bestand.some((zeile) => /Das weiß ich nicht/.test(zeile))).toBe(true);
  });
});

describe("Der Name als Waffe", () => {
  it("fällt nicht in der Eröffnung — er spricht niemanden an, den er noch prüft", () => {
    for (const dossier of befragbareDossiers()) {
      const eroeffnet = eroeffnung(dossier)
        .filter((beat) => beat.art === "replik")
        .map((beat) => ("text" in beat ? beat.text : ""))
        .join(" ");
      expect(eroeffnet, `${dossier.slug} verrät den Namen zu früh`).not.toMatch(
        new RegExp(`\\b${dossier.name}\\b`),
      );
    }
  });

  it("steht am Anfang der Namenszeile", () => {
    for (const dossier of befragbareDossiers()) {
      if (dossier.versiegelt) continue;
      expect(dossier.namenszeile.startsWith(`${dossier.name}.`), dossier.slug).toBe(true);
    }
  });
});

describe("Gesäte Auswahl", () => {
  it("gibt derselben Person immer dieselben drei Fragen", () => {
    for (const dossier of DOSSIERS) {
      const a = waehleFragen(dossier).map((frage) => frage.id);
      const b = waehleFragen(dossier).map((frage) => frage.id);
      expect(a).toEqual(b);
      expect(new Set(a).size).toBe(3);
      expect(a).toContain(dossier.eigeneFrage.id);
    }
  });

  it("stellt nicht allen dieselben Fragen", () => {
    const kombinationen = new Set(
      DOSSIERS.map((dossier) => waehleFragen(dossier).map((frage) => frage.id).sort().join("|")),
    );
    expect(kombinationen.size).toBeGreaterThan(DOSSIERS.length / 2);
  });
});

describe("Pausen sind Inhalt", () => {
  it("schweigt zwischen den Befunden", () => {
    for (const dossier of DOSSIERS) {
      const pausen = eroeffnung(dossier).filter((beat) => beat.art === "pause");
      expect(pausen.length, dossier.slug).toBeGreaterThanOrEqual(dossier.befunde.length);
      expect(pausen.every((beat) => beat.art === "pause" && beat.ms > 0)).toBe(true);
    }
  });

  it("lässt vor dem Riss die längste Pause", () => {
    const mit = abschied(DOSSIERS[0], true).filter((beat) => beat.art === "pause");
    const ohne = abschied(DOSSIERS[0], false).filter((beat) => beat.art === "pause");
    expect(mit.length).toBeGreaterThan(ohne.length);
  });
});
