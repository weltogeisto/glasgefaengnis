"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { ERMITTLUNG_VERSION, MAX_ZUEGE, ermittle, spieleErmittlungNach, type Fall, type Ermittlungszug } from "@/lib/glas/ermittlung";

const ereignis = "glas:ermittlung:geaendert";
const fluechtig = new Map<string, string>();
const server = () => "";

function lies(schluessel: string): string {
  if (fluechtig.has(schluessel)) return fluechtig.get(schluessel)!;
  try { return window.localStorage.getItem(schluessel) ?? ""; }
  catch { fluechtig.set(schluessel, ""); return ""; }
}
function zuegeAus(raw: string, slug: string): unknown[] {
  if (!raw || raw.length > 200_000) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return [];
    const p = data as Record<string, unknown>;
    return p.version === ERMITTLUNG_VERSION && p.slug === slug && Array.isArray(p.zuege)
      ? p.zuege.slice(0, MAX_ZUEGE) : [];
  } catch { return []; }
}

/** Only the turn log is stored. No answer, phase, personal confession or live reward is trusted. */
export function useErmittlung(fall: Fall) {
  const schluessel = `fellowship:glas:ermittlung:v${ERMITTLUNG_VERSION}:${fall.slug}`;
  const subscribe = useCallback((notify: () => void) => {
    const storage = (event: StorageEvent) => { if (event.key === schluessel || event.key === null) notify(); };
    const local = (event: Event) => { if ((event as CustomEvent<string>).detail === schluessel) notify(); };
    window.addEventListener("storage", storage);
    window.addEventListener(ereignis, local);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener(ereignis, local); };
  }, [schluessel]);
  const snapshot = useCallback(() => lies(schluessel), [schluessel]);
  const raw = useSyncExternalStore(subscribe, snapshot, server);
  const sitzung = useMemo(() => spieleErmittlungNach(fall, zuegeAus(raw, fall.slug)), [raw, fall]);
  const schreibe = useCallback((zuege: readonly Ermittlungszug[]) => {
    const value = JSON.stringify({ version: ERMITTLUNG_VERSION, slug: fall.slug, zuege });
    try { window.localStorage.setItem(schluessel, value); fluechtig.delete(schluessel); }
    catch { fluechtig.set(schluessel, value); }
    window.dispatchEvent(new CustomEvent(ereignis, { detail: schluessel }));
  }, [schluessel, fall.slug]);
  const sende = useCallback((zug: Ermittlungszug): boolean => {
    const vorher = spieleErmittlungNach(fall, zuegeAus(lies(schluessel), fall.slug));
    const nachher = ermittle(vorher, zug, fall);
    if (nachher === vorher) return false;
    schreibe(nachher.zuege);
    return true;
  }, [fall, schluessel, schreibe]);
  return { sitzung, sende, neu: () => schreibe([]), fluechtig: raw !== "" && fluechtig.has(schluessel) };
}
