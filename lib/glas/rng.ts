/**
 * Gesäter Zufall für das Glasgefängnis.
 *
 * Dieselbe Reiterin, dieselbe Sitzung — auf jedem Gerät, in jedem Modus, heute
 * und in einem Jahr. Kein `Math.random()` im Kern. Das ist keine Kosmetik:
 * siebzehn Menschen vergleichen hinterher ihre Protokolle, und ein Verhör, das
 * sich beim zweiten Öffnen anders erinnert, ist kein Verhör, sondern ein Effekt.
 *
 * Gleiches Verfahren wie im Fellowship OS (`lib/hornOmens.ts`,
 * `lib/palantirPruefung.ts`): FNV-1a auf den Schlüssel, dann mulberry32.
 */

/** FNV-1a (32 bit). Stabil über Laufzeiten und Plattformen hinweg. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 — kleiner, schneller, ausreichend gleichverteilter PRNG. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ein Generator aus einem lesbaren Schlüssel, z. B. `"frithjof:beobachtung"`. */
export function rngFor(key: string): () => number {
  return mulberry32(hashString(key));
}

/** Ein Element, deterministisch gewählt. Leere Listen sind ein Programmfehler. */
export function pick<T>(items: readonly T[], key: string): T {
  if (items.length === 0) throw new Error(`pick: leere Liste für "${key}"`);
  return items[Math.floor(rngFor(key)() * items.length) % items.length];
}

/**
 * `count` verschiedene Elemente, deterministisch gewählt, in stabiler Reihenfolge.
 * Zieht ohne Zurücklegen; fragt jemand mehr an, als vorhanden ist, kommt die
 * ganze Liste zurück statt einer Ausnahme — Aufrufer sollen sich nicht sorgen.
 */
export function pickMany<T>(items: readonly T[], count: number, key: string): T[] {
  const pool = [...items];
  const random = rngFor(key);
  const out: T[] = [];
  const wanted = Math.min(Math.max(0, Math.trunc(count)), pool.length);
  for (let index = 0; index < wanted; index += 1) {
    out.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return out;
}
