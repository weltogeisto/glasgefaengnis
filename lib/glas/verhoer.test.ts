import { describe, expect, it } from "vitest";
import { DOSSIERS, befragbareDossiers } from "./dossier";
import { waehleFragen } from "./stimme";
import type { Zug } from "./verhoer";
import { istAbgeschlossen, spieleNach, starteSitzung, wendeZugAn } from "./verhoer";
import { GRUPPENSAAT_VORGABE, hatRiss, risstraeger } from "./riss";

function volleZuege(slug: string): Zug[] {
  const dossier = DOSSIERS.find((eintrag) => eintrag.slug === slug)!;
  return [
    { art: "frage", frageId: waehleFragen(dossier)[0].id },
    { art: "preis", text: "Etwas Wahres, das ich sonst niemandem sage." },
    { art: "letzte-antwort", text: "Ja. Und wir passen auf, dass es so bleibt." },
    { art: "gehen" },
  ];
}

describe("Die Sitzung", () => {
  it("führt jede Reiterin bis zum Ende", () => {
    for (const dossier of befragbareDossiers()) {
      const ende = spieleNach(dossier.slug, volleZuege(dossier.slug));
      expect(ende, dossier.slug).not.toBeNull();
      expect(ende!.phase, dossier.slug).toBe("ende");
      expect(ende!.beats.some((beat) => beat.art === "bruchstueck"), dossier.slug).toBe(true);
    }
  });

  it("lässt Jan und Moriondo nicht vor das Glas", () => {
    expect(starteSitzung("jan")).toBeNull();
    expect(starteSitzung("moriondo")).toBeNull();
    expect(starteSitzung("gibtesnicht")).toBeNull();
  });

  it("rechnet den Zustand aus dem Zugprotokoll nach, statt ihn zu glauben", () => {
    const zuege = volleZuege("frithjof");
    const live = zuege.reduce((zustand, zug) => wendeZugAn(zustand, zug), starteSitzung("frithjof")!);
    const nachgespielt = spieleNach("frithjof", live.zuege)!;
    expect(nachgespielt.beats).toEqual(live.beats);
    expect(nachgespielt.phase).toBe(live.phase);
    expect(nachgespielt.preis).toBe(live.preis);
  });

  it("verwirft ungültige Züge, ohne die Sitzung zu zerstören", () => {
    const start = starteSitzung("leon")!;
    expect(wendeZugAn(start, { art: "gehen" })).toEqual(start);
    expect(wendeZugAn(start, { art: "preis", text: "zu früh" })).toEqual(start);
    expect(wendeZugAn(start, { art: "frage", frageId: "gibtesnicht" })).toEqual(start);
  });

  it("nimmt eine leere Antwort nicht als Bezahlung an", () => {
    const dossier = DOSSIERS.find((eintrag) => eintrag.slug === "steven")!;
    const gewaehlt = wendeZugAn(starteSitzung("steven")!, {
      art: "frage",
      frageId: waehleFragen(dossier)[0].id,
    });
    expect(wendeZugAn(gewaehlt, { art: "preis", text: "  " })).toEqual(gewaehlt);
    expect(wendeZugAn(gewaehlt, { art: "preis", text: "ja" })).toEqual(gewaehlt);
    expect(wendeZugAn(gewaehlt, { art: "preis", text: "Nie." }).phase).toBe("letzte-frage");
  });

  it("ist deterministisch — dieselbe Person, dieselbe Sitzung", () => {
    const a = spieleNach("finno", volleZuege("finno"))!;
    const b = spieleNach("finno", volleZuege("finno"))!;
    expect(a.beats).toEqual(b.beats);
  });

  it("gilt als abgeschlossen, sobald der Abschied läuft", () => {
    const dossier = DOSSIERS.find((eintrag) => eintrag.slug === "domi")!;
    const bisAbschied = volleZuege("domi").slice(0, 3);
    const sitzung = spieleNach("domi", bisAbschied)!;
    expect(sitzung.phase).toBe("abschied");
    expect(istAbgeschlossen(sitzung)).toBe(true);
  });
});

describe("Der Riss", () => {
  it("trifft genau eine von siebzehn", () => {
    const treffer = befragbareDossiers().filter((dossier) => hatRiss(dossier.slug));
    expect(treffer).toHaveLength(1);
  });

  it("liegt fest, bevor die erste Sitzung beginnt", () => {
    expect(risstraeger()).toBe(risstraeger());
    expect(risstraeger(GRUPPENSAAT_VORGABE)).toBe(risstraeger(GRUPPENSAAT_VORGABE));
  });

  it("verschiebt sich mit der Gruppensaat und trifft nie den Versiegelten", () => {
    const traeger = new Set(
      Array.from({ length: 40 }, (_, index) => risstraeger(`runde-${index}`)),
    );
    expect(traeger.size).toBeGreaterThan(1);
    expect(traeger.has("peter")).toBe(false);
  });

  it("zeigt seine Repliken nur in der einen Sitzung", () => {
    const slug = risstraeger();
    const mit = spieleNach(slug, volleZuege(slug))!;
    const ohne = befragbareDossiers().find((dossier) => dossier.slug !== slug)!;
    const andere = spieleNach(ohne.slug, volleZuege(ohne.slug))!;
    const zeilen = (sitzung: typeof mit) =>
      sitzung.beats.filter((beat) => beat.art === "replik").map((beat) => beat.text);
    expect(zeilen(mit)).toContain("Bevor ich hier war, war ich ein Ton.");
    expect(zeilen(andere)).not.toContain("Bevor ich hier war, war ich ein Ton.");
  });
});
