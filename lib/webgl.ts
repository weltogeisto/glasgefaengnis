/**
 * WebGL-Sondierung und Kontextverlust.
 *
 * Übernommen aus `lib/webgl.ts` im Fellowship OS, weil es dort schon richtig
 * gelöst ist: Der Probe-Kontext wird über `WEBGL_lose_context` wieder
 * freigegeben — sonst leckt allein das Nachsehen einen Kontext, und auf einem
 * Telefon sind das genau die, die man später braucht.
 */

export function browserCanUseWebGL(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const kontext = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!kontext) return false;
    kontext.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Grobe Leistungsklasse. Entscheidet Auflösung und Abtastung der Scheibe —
 * Transmission ist der teuerste Effekt im ganzen Raum.
 */
export function glasGuete(): "hoch" | "mittel" | "niedrig" {
  if (typeof window === "undefined") return "niedrig";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "niedrig";
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "niedrig";
  const speicher = nav.deviceMemory ?? 4;
  const kerne = nav.hardwareConcurrency ?? 4;
  if (speicher <= 4 || kerne <= 4 || window.innerWidth < 600) return "mittel";
  return "hoch";
}
