/**
 * Die Stimme.
 *
 * Hier wird nichts erfunden. Die Repliken stehen geschrieben in `dossier.ts`;
 * diese Datei entscheidet nur, welche wann kommen, wie lange dazwischen
 * geschwiegen wird, und wann zum ersten Mal ein Name fällt.
 *
 * Zehn Regeln, und die harte davon ist die vierte: Er befiehlt nichts. Über
 * siebzehn Sitzungen sagt er kein einziges Mal, was jemand tun soll — und alle
 * tun es trotzdem. `stimme.test.ts` prüft das über den gesamten Bestand.
 */

import type { Dossier, Frage } from "./dossier";
import { FRAGEN_KANON, LETZTE_FRAGE, RISS_REPLIKEN } from "./dossier";
import { pickMany, rngFor } from "./rng";

export type Beat =
  /** Regieanweisung. Wird kursiv gesetzt und nie gesprochen. */
  | { readonly art: "regie"; readonly text: string }
  /** Er spricht. */
  | { readonly art: "replik"; readonly text: string }
  /** Schweigen mit Dauer. Pausen sind Inhalt, keine Übergangsanimation. */
  | { readonly art: "pause"; readonly ms: number }
  /** Die Reiterin wählt. */
  | { readonly art: "wahl"; readonly fragen: readonly Frage[] }
  /** Ihre eigenen Worte, zurückgespiegelt ins Protokoll. */
  | { readonly art: "echo"; readonly text: string }
  /** Der Preis. Er wartet. */
  | { readonly art: "eingabe"; readonly frage: string }
  /** Was er herausgibt. */
  | { readonly art: "bruchstueck"; readonly text: string };

/** Feste Fügungen. Keine davon ist ein Imperativ. */
export const FUEGUNGEN = {
  einladung: "Du darfst fragen.",
  umsonst: "Das war umsonst. Das nächste nicht.",
  handel: "Quid pro quo.",
  kostenlos: "Eine noch. Die kostet nichts.",
  tuer: "Du kannst gehen.",
} as const;

const PAUSE = { kurz: 900, mittel: 1600, lang: 2400 } as const;

/**
 * Zwei Kanonfragen plus die eigene, in gesäter Reihenfolge. Dieselbe Person
 * bekommt immer dieselben drei — sonst wäre das Protokoll hinterher wertlos.
 */
export function waehleFragen(dossier: Dossier): readonly Frage[] {
  const kanon = pickMany(FRAGEN_KANON, 2, `${dossier.slug}:fragen`);
  const alle = [...kanon, dossier.eigeneFrage];
  const random = rngFor(`${dossier.slug}:reihenfolge`);
  for (let i = alle.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [alle[i], alle[j]] = [alle[j], alle[i]];
  }
  return alle;
}

/** Ankunft und Beobachtung: was er sieht, bevor jemand spricht. */
export function eroeffnung(dossier: Dossier): readonly Beat[] {
  const beats: Beat[] = [
    { art: "regie", text: dossier.ankunft },
    { art: "pause", ms: PAUSE.mittel },
  ];
  dossier.befunde.forEach((befund, index) => {
    beats.push({ art: "replik", text: befund });
    beats.push({ art: "pause", ms: index === 0 ? PAUSE.mittel : PAUSE.kurz });
  });
  beats.push({ art: "replik", text: dossier.schnitt });
  beats.push({ art: "pause", ms: PAUSE.lang });
  beats.push({ art: "replik", text: FUEGUNGEN.einladung });
  return beats;
}

/**
 * Seine Antwort auf die gewählte Frage — und erst hier, im dritten Wechsel,
 * fällt zum ersten Mal der Name. Vorher wäre er nur höflich gewesen.
 */
export function antwort(dossier: Dossier, frage: Frage): readonly Beat[] {
  const beats: Beat[] = [{ art: "echo", text: frage.frage }, { art: "pause", ms: PAUSE.kurz }];
  frage.antwort.forEach((replik) => {
    beats.push({ art: "replik", text: replik });
    beats.push({ art: "pause", ms: PAUSE.kurz });
  });
  beats.push({ art: "pause", ms: PAUSE.mittel });
  beats.push({ art: "replik", text: dossier.namenszeile });
  beats.push({ art: "pause", ms: PAUSE.lang });
  beats.push({ art: "replik", text: FUEGUNGEN.umsonst });
  return beats;
}

/** Der Handel. Er nennt den Preis und wartet, so lange es dauert. */
export function forderung(dossier: Dossier): readonly Beat[] {
  return [
    { art: "pause", ms: PAUSE.mittel },
    { art: "replik", text: FUEGUNGEN.handel },
    { art: "pause", ms: PAUSE.kurz },
    { art: "eingabe", frage: dossier.gegenfrage },
  ];
}

/** Bezahlt. Er gibt heraus, was er versprochen hat, und nicht mehr. */
export function bezahlt(dossier: Dossier, antwortDerReiterin: string): readonly Beat[] {
  return [
    { art: "echo", text: antwortDerReiterin },
    { art: "pause", ms: PAUSE.lang },
    { art: "bruchstueck", text: dossier.bruchstueck },
    { art: "pause", ms: PAUSE.mittel },
  ];
}

/** Die letzte Frage. Bei allen dieselbe, und sie kostet nichts. */
export function letzteFrage(): readonly Beat[] {
  return [
    { art: "replik", text: FUEGUNGEN.kostenlos },
    { art: "pause", ms: PAUSE.mittel },
    { art: "eingabe", frage: LETZTE_FRAGE },
  ];
}

/**
 * Der Abschied. Genau eine Sitzung von siebzehn bekommt vorher den Riss —
 * wer, entscheidet `riss.ts`, und niemand kann es erzwingen.
 */
export function abschied(dossier: Dossier, mitRiss: boolean): readonly Beat[] {
  const beats: Beat[] = [{ art: "pause", ms: PAUSE.lang }];
  if (mitRiss) {
    RISS_REPLIKEN.forEach((replik, index) => {
      beats.push({ art: "replik", text: replik });
      beats.push({ art: "pause", ms: index === 1 ? PAUSE.lang : PAUSE.kurz });
    });
  }
  beats.push({ art: "replik", text: dossier.abschied });
  beats.push({ art: "pause", ms: PAUSE.kurz });
  beats.push({ art: "replik", text: FUEGUNGEN.tuer });
  return beats;
}

/**
 * Jede Replik, die dieses Dossier hervorbringen kann — für die Registerprüfung.
 * Regieanweisungen sind keine Repliken: er spricht sie nicht.
 */
export function alleRepliken(dossier: Dossier): readonly string[] {
  const aus = (beats: readonly Beat[]) =>
    beats.filter((beat): beat is Extract<Beat, { art: "replik" }> => beat.art === "replik").map((beat) => beat.text);

  const repliken = [
    ...aus(eroeffnung(dossier)),
    ...waehleFragen(dossier).flatMap((frage) => aus(antwort(dossier, frage))),
    ...aus(forderung(dossier)),
    ...aus(bezahlt(dossier, "—")),
    ...aus(letzteFrage()),
    ...aus(abschied(dossier, true)),
    dossier.bruchstueck,
    dossier.gegenfrage,
  ];
  return [...new Set(repliken)];
}
