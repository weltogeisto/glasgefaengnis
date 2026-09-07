/**
 * Der Demo-Modus.
 *
 * Ohne gesetzte Umgebungsvariablen läuft das Glasgefängnis vollständig aus
 * `localStorage` und den Seed-Akten. Das ist im Fellowship OS keine
 * Bequemlichkeit, sondern die goldene Regel („Never break the no-env build"),
 * und sie gilt hier genauso: ein Verhör muss sich von Anfang bis Ende führen
 * lassen, ohne dass irgendwo eine Datenbank steht.
 *
 * Nach außen ist das ein externer Speicher im Sinne von `useSyncExternalStore`
 * — abonnieren, Schnappschuss, fertig. Das ist nicht nur Formsache: die
 * strengere React-19-Regel dieses Projekts verbietet setState im Effekt, und
 * ein Speicher, der sich selbst meldet, braucht keins.
 *
 * Jeder Zugriff ist gekapselt. Ein privates Fenster, gesperrte Site-Daten oder
 * ein Vorschaubild-Renderer dürfen die Zelle nicht kaputtmachen.
 */

import type { Sitzungsakte } from "./protokoll";

const RAUM = "glasgefaengnis:";
const AKTEN = `${RAUM}akten:v1`;
const SCHWELLE = `${RAUM}schwelle:v1`;

const LEERE_AKTEN: readonly Sitzungsakte[] = Object.freeze([]);

const hoerer = new Set<() => void>();
let aktenCache: readonly Sitzungsakte[] | null = null;
let schwelleCache: boolean | null = null;

function lager(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const probe = `${RAUM}probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function melden(): void {
  aktenCache = null;
  schwelleCache = null;
  for (const rufen of hoerer) rufen();
}

/** Abonnement für `useSyncExternalStore`. Auch andere Tabs melden sich. */
export function abonniereSpeicher(neuzeichnen: () => void): () => void {
  hoerer.add(neuzeichnen);
  const ausAnderemTab = (ereignis: StorageEvent) => {
    if (ereignis.key === null || ereignis.key.startsWith(RAUM)) melden();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", ausAnderemTab);
  return () => {
    hoerer.delete(neuzeichnen);
    if (typeof window !== "undefined") window.removeEventListener("storage", ausAnderemTab);
  };
}

/**
 * Schnappschuss der Akten. Muss dieselbe Referenz liefern, solange sich nichts
 * geändert hat — sonst rendert React endlos.
 */
export function aktenSchnappschuss(): readonly Sitzungsakte[] {
  if (aktenCache) return aktenCache;
  const speicher = lager();
  if (!speicher) {
    aktenCache = LEERE_AKTEN;
    return aktenCache;
  }
  try {
    const roh = speicher.getItem(AKTEN);
    const geparst: unknown = roh ? JSON.parse(roh) : [];
    aktenCache = Array.isArray(geparst) ? (geparst as Sitzungsakte[]) : LEERE_AKTEN;
  } catch {
    aktenCache = LEERE_AKTEN;
  }
  return aktenCache;
}

/** Auf dem Server gibt es keine Akten. Der Gang rendert leer und füllt sich. */
export function aktenAufDemServer(): readonly Sitzungsakte[] {
  return LEERE_AKTEN;
}

/** Eine Akte ablegen. Dieselbe Person überschreibt ihre eigene, niemand sonst. */
export function legeAkteAb(akte: Sitzungsakte): void {
  const alle = [...aktenSchnappschuss().filter((vorhanden) => vorhanden.slug !== akte.slug), akte];
  try {
    lager()?.setItem(AKTEN, JSON.stringify(alle));
  } catch {
    /* Voll oder gesperrt. Die Sitzung läuft trotzdem zu Ende. */
  }
  melden();
}

/** Das Bannlied wurde auf diesem Gerät gesungen. */
export function schwelleSchnappschuss(): boolean {
  if (schwelleCache !== null) return schwelleCache;
  try {
    schwelleCache = lager()?.getItem(SCHWELLE) === "1";
  } catch {
    schwelleCache = false;
  }
  return schwelleCache;
}

export function schwelleAufDemServer(): boolean {
  return false;
}

export function oeffneSchwelle(): void {
  try {
    lager()?.setItem(SCHWELLE, "1");
  } catch {
    /* Auch ohne Gedächtnis geht die Tür auf — sie merkt es sich nur nicht. */
  }
  melden();
}
