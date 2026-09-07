/**
 * Die Sitzung als reiner Reduzierer.
 *
 * Vertraut wird ausschließlich dem Zugprotokoll. Der Zustand wird jedes Mal
 * neu daraus gespielt — dieselbe Lehre wie bei `war_days` und `battle_moves`
 * im Fellowship OS: ein Klient, der einen fertigen Zustand schickt, wird nicht
 * geglaubt, sondern nachgerechnet.
 *
 * Ungültige Züge werden verworfen, nicht bestraft. Wer zweimal auf dieselbe
 * Schaltfläche tippt, weil das Netz hakt, soll nicht aus dem Raum fliegen.
 */

import type { Beat } from "./stimme";
import { abschied, antwort, bezahlt, eroeffnung, forderung, letzteFrage, waehleFragen } from "./stimme";
import type { Dossier } from "./dossier";
import { dossierFuer } from "./dossier";
import { GRUPPENSAAT_VORGABE, hatRiss } from "./riss";

export type Phase =
  | "eroeffnung"
  | "wahl"
  | "antwort"
  | "forderung"
  | "bruchstueck"
  | "letzte-frage"
  | "abschied"
  | "ende";

export type Zug =
  | { readonly art: "frage"; readonly frageId: string }
  | { readonly art: "preis"; readonly text: string }
  | { readonly art: "letzte-antwort"; readonly text: string }
  | { readonly art: "gehen" };

export type Sitzung = {
  readonly slug: string;
  readonly phase: Phase;
  readonly frageId: string | null;
  readonly preis: string | null;
  readonly letzteAntwort: string | null;
  readonly riss: boolean;
  /** Alles, was bisher im Raum passiert ist, in Reihenfolge. */
  readonly beats: readonly Beat[];
  /** Die einzige Wahrheit. Alles andere ist daraus gerechnet. */
  readonly zuege: readonly Zug[];
};

/** Antworten unter drei Zeichen zählen nicht als bezahlt. */
export const MINDESTANTWORT = 3;
/** Mehr als das nimmt er nicht entgegen — er will einen Satz, keinen Bericht. */
export const MAXANTWORT = 400;

export function normalisiereAntwort(text: string): string {
  return text.replace(/\s+/gu, " ").trim().slice(0, MAXANTWORT);
}

function istBezahlt(text: string): boolean {
  return [...normalisiereAntwort(text)].length >= MINDESTANTWORT;
}

export function starteSitzung(slug: string, gruppensaat: string = GRUPPENSAAT_VORGABE): Sitzung | null {
  const dossier = dossierFuer(slug);
  if (!dossier || !dossier.anwesend) return null;
  return {
    slug,
    phase: "wahl",
    frageId: null,
    preis: null,
    letzteAntwort: null,
    riss: hatRiss(slug, gruppensaat),
    beats: eroeffnung(dossier),
    zuege: [],
  };
}

function mit(sitzung: Sitzung, zug: Zug, teil: Partial<Sitzung>): Sitzung {
  return { ...sitzung, ...teil, zuege: [...sitzung.zuege, zug] };
}

export function wendeZugAn(sitzung: Sitzung, zug: Zug): Sitzung {
  const dossier = dossierFuer(sitzung.slug);
  if (!dossier) return sitzung;

  switch (zug.art) {
    case "frage": {
      if (sitzung.phase !== "wahl") return sitzung;
      const frage = waehleFragen(dossier).find((eintrag) => eintrag.id === zug.frageId);
      if (!frage) return sitzung;
      return mit(sitzung, zug, {
        phase: "forderung",
        frageId: frage.id,
        beats: [...sitzung.beats, ...antwort(dossier, frage), ...forderung(dossier)],
      });
    }
    case "preis": {
      if (sitzung.phase !== "forderung" || !istBezahlt(zug.text)) return sitzung;
      const text = normalisiereAntwort(zug.text);
      return mit(sitzung, { art: "preis", text }, {
        phase: "letzte-frage",
        preis: text,
        beats: [...sitzung.beats, ...bezahlt(dossier, text), ...letzteFrage()],
      });
    }
    case "letzte-antwort": {
      if (sitzung.phase !== "letzte-frage" || !istBezahlt(zug.text)) return sitzung;
      const text = normalisiereAntwort(zug.text);
      return mit(sitzung, { art: "letzte-antwort", text }, {
        phase: "abschied",
        letzteAntwort: text,
        beats: [
          ...sitzung.beats,
          { art: "echo", text } as Beat,
          ...abschied(dossier, sitzung.riss),
        ],
      });
    }
    case "gehen": {
      if (sitzung.phase !== "abschied") return sitzung;
      return mit(sitzung, zug, { phase: "ende" });
    }
    default:
      return sitzung;
  }
}

/** Eine Sitzung aus ihrem Zugprotokoll nachspielen. Serverseitig die einzige Quelle. */
export function spieleNach(
  slug: string,
  zuege: readonly Zug[],
  gruppensaat: string = GRUPPENSAAT_VORGABE,
): Sitzung | null {
  const start = starteSitzung(slug, gruppensaat);
  if (!start) return null;
  return zuege.reduce<Sitzung>((zustand, zug) => wendeZugAn(zustand, zug), start);
}

export function istAbgeschlossen(sitzung: Sitzung): boolean {
  return sitzung.phase === "abschied" || sitzung.phase === "ende";
}

/** Die Fragen, die dieser Person offenstehen. */
export function offeneFragen(dossier: Dossier) {
  return waehleFragen(dossier);
}
