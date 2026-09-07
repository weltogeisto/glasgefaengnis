/**
 * Das Verhörprotokoll.
 *
 * Sie sind gekommen, um einem Ungeheuer die Wahrheit abzunehmen. Was sie
 * dagelassen haben, ist ein Bild von Jan, geschrieben von siebzehn Freunden,
 * von denen keiner gemerkt hat, dass er gerade schreibt.
 *
 * Die letzte Frage ist bei allen dieselbe und kostet nichts: „Wird er glücklich
 * sein?" Siebzehn Antworten darauf, gebunden, sind das Geschenk. Jan selbst
 * betritt das Glasgefängnis nie — er ist `is_groom`, und das gilt hier wie
 * überall sonst in dieser App.
 */

import { DOSSIERS, LETZTE_FRAGE } from "./dossier";
import { lagebild } from "./bruchstuecke";
import type { Lagebild } from "./bruchstuecke";

export type Sitzungsakte = {
  readonly slug: string;
  /** Die gewählte Frage, im Wortlaut. */
  readonly frage: string;
  /** Seine Gegenfrage. */
  readonly gegenfrage: string;
  /** Was bezahlt wurde. */
  readonly preis: string;
  /** Die Antwort auf die letzte Frage. */
  readonly letzteAntwort: string;
  readonly riss: boolean;
  /** ISO-Zeitpunkt oder null im Demo-Modus. */
  readonly wann?: string | null;
};

export type Protokolleintrag = Sitzungsakte & {
  readonly name: string;
  readonly figur: string;
  readonly titel: string;
  readonly siegel: string;
  readonly bruchstueck: string;
};

export type Protokoll = {
  readonly eintraege: readonly Protokolleintrag[];
  readonly anzahl: number;
  readonly erwartet: number;
  readonly vollstaendig: boolean;
  readonly lage: Lagebild;
  /** Die siebzehn Antworten auf die letzte Frage. Das eigentliche Dokument. */
  readonly fuerJan: readonly { readonly name: string; readonly antwort: string }[];
  readonly letzteFrage: string;
};

export function baueProtokoll(akten: readonly Sitzungsakte[]): Protokoll {
  const reihenfolge = new Map(DOSSIERS.map((dossier, index) => [dossier.slug, index]));
  const eintraege = akten
    .map((akte) => {
      const dossier = DOSSIERS.find((eintrag) => eintrag.slug === akte.slug);
      if (!dossier) return null;
      return {
        ...akte,
        name: dossier.name,
        figur: dossier.figur,
        titel: dossier.titel,
        siegel: dossier.siegel,
        bruchstueck: dossier.bruchstueck,
      } satisfies Protokolleintrag;
    })
    .filter((eintrag): eintrag is Protokolleintrag => eintrag !== null)
    .sort((a, b) => (reihenfolge.get(a.slug) ?? 0) - (reihenfolge.get(b.slug) ?? 0));

  const erwartet = DOSSIERS.filter((dossier) => dossier.anwesend).length;

  return {
    eintraege,
    anzahl: eintraege.length,
    erwartet,
    vollstaendig: eintraege.length >= erwartet,
    lage: lagebild(eintraege.map((eintrag) => eintrag.slug)),
    fuerJan: eintraege
      .filter((eintrag) => eintrag.letzteAntwort.trim().length > 0)
      .map((eintrag) => ({ name: eintrag.name, antwort: eintrag.letzteAntwort })),
    letzteFrage: LETZTE_FRAGE,
  };
}
