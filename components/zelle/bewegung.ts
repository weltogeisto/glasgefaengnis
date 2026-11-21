"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion`, nach dem Hausmuster aus dem Fellowship OS
 * (`components/rangliste/useAnimatedNumber.ts`): `useSyncExternalStore`, und
 * der SSR-Schnappschuss ist `false`.
 *
 * Hier hängt mehr daran als eine Animation. Ohne Bewegung fallen die Pausen
 * weg, und der Text steht sofort vollständig da. Das Verhör ist dann kürzer,
 * aber es ist dasselbe Verhör — kein zweiter, ärmerer Modus.
 */
function abonniere(neuzeichnen: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const medium = window.matchMedia("(prefers-reduced-motion: reduce)");
  medium.addEventListener("change", neuzeichnen);
  return () => medium.removeEventListener("change", neuzeichnen);
}

function schnappschuss(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useRuhigeBewegung(): boolean {
  return useSyncExternalStore(abonniere, schnappschuss, () => false);
}
