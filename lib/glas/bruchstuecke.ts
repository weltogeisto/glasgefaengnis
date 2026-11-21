/**
 * Die Bruchstücke.
 *
 * Jede Sitzung bringt ein Stück Wahrheit über den Krieg heraus. Einzeln ist
 * jedes davon nutzlos — eine Beobachtung ohne Zusammenhang. Erst wenn genug
 * Reiter bezahlt haben, ergibt sich ein Lagebild, und das ist der Punkt: dieses
 * Verhör lässt sich nicht allein führen.
 *
 * Reine Funktionen, kein Zustand. Was gesammelt wurde, kommt von außen herein.
 */

import { DOSSIERS, befragbareDossiers } from "./dossier";

/** Ab hier fügt sich das Bild. Mehr als die Hälfte, weniger als alle. */
export const BRUCHSTUECKE_FUER_LAGEBILD = 9;

export type Bruchstueck = {
  readonly slug: string;
  readonly name: string;
  readonly text: string;
};

export type Lagebild = {
  readonly bruchstuecke: readonly Bruchstueck[];
  readonly anzahl: number;
  readonly benoetigt: number;
  readonly vollstaendig: boolean;
  /** Was sich aus dem Gesammelten lesen lässt. Leer, solange es zu wenig ist. */
  readonly schluss: readonly string[];
};

/**
 * Der Schluss. Bewusst nicht generiert: er fasst zusammen, was in den siebzehn
 * Bruchstücken ohnehin steht, und erzeugt keinen neuen Kanon.
 */
const SCHLUSS = [
  "Die Esse hat einen Takt, ein Maß und eine Reinheit. Alle drei sind angreifbar.",
  "Ihre Ordnung kommt aus Zwang. Ordnung aus Zwang hält lange und bricht dann auf einmal.",
  "Sie sichern, was sie beleuchten. Zwischen ihren Feuern liegt alles offen.",
  "Ihr Tor ist bewacht. Ihre vier Lüftungen sind es nicht.",
  "Sie marschieren im Gleichschritt. Ein Takt, der nicht aufgeht, kostet sie eine Reihe.",
] as const;

export function sammle(slugs: readonly string[]): readonly Bruchstueck[] {
  const gesehen = new Set<string>();
  const out: Bruchstueck[] = [];
  for (const slug of slugs) {
    if (gesehen.has(slug)) continue;
    const dossier = DOSSIERS.find((eintrag) => eintrag.slug === slug);
    if (!dossier) continue;
    gesehen.add(slug);
    out.push({ slug, name: dossier.name, text: dossier.bruchstueck });
  }
  return out;
}

export function lagebild(slugs: readonly string[]): Lagebild {
  const bruchstuecke = sammle(slugs);
  const vollstaendig = bruchstuecke.length >= BRUCHSTUECKE_FUER_LAGEBILD;
  return {
    bruchstuecke,
    anzahl: bruchstuecke.length,
    benoetigt: BRUCHSTUECKE_FUER_LAGEBILD,
    vollstaendig,
    schluss: vollstaendig ? SCHLUSS : [],
  };
}

/** Wer noch nicht vor dem Glas stand. */
export function ausstehend(slugs: readonly string[]): readonly string[] {
  const fertig = new Set(slugs);
  return befragbareDossiers()
    .filter((dossier) => !fertig.has(dossier.slug))
    .map((dossier) => dossier.slug);
}
