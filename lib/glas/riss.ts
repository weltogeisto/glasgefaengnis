/**
 * Der Riss.
 *
 * Moriondo ist klinisch. Genau einmal — über alle siebzehn Sitzungen hinweg,
 * nicht einmal pro Sitzung — kommt etwas durch das Glas. Eine Person bekommt
 * drei Repliken, die sonst niemand hört, und danach ist er wieder Stein.
 *
 * Wer, ist gesät und liegt vor der ersten Sitzung fest. Niemand kann darauf
 * hinspielen, niemand kann sich hineinladen, und ein zweiter Durchlauf ändert
 * nichts. Hinterher vergleichen siebzehn Leute ihre Protokolle und genau einer
 * hält einen Satz in der Hand, den die anderen nicht haben. Das Gespräch, das
 * daraus entsteht, ist der eigentliche Zweck.
 */

import { befragbareDossiers } from "./dossier";
import { pick } from "./rng";

/**
 * Die Gruppensaat. Ein fester Wert je Runde — im Live-Betrieb die Sitzungs-ID,
 * im Demo-Modus diese Vorgabe. Sie zu ändern, verschiebt den Riss.
 */
export const GRUPPENSAAT_VORGABE = "glasgefaengnis:2026";

/** Der Slug, bei dem das Glas reißt. Immer genau einer. */
export function risstraeger(gruppensaat: string = GRUPPENSAAT_VORGABE): string {
  const offen = befragbareDossiers().filter((dossier) => !dossier.versiegelt);
  return pick(offen, `riss:${gruppensaat}`).slug;
}

export function hatRiss(slug: string, gruppensaat: string = GRUPPENSAAT_VORGABE): boolean {
  return risstraeger(gruppensaat) === slug;
}
