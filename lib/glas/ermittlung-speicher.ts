"use client";

import { isMove, MAX_MOVES, type Move } from "./ermittlung";
const KEY = "moriondo:regieprobe:v1";
const EVENT = "moriondo:regieprobe:changed";
const EMPTY: readonly Move[] = Object.freeze([]);
let lastRaw: string | null = null;
let cached: readonly Move[] = EMPTY;
let memoryRaw: string | null = null;
let storageFailed = false;
export function serverSnapshot(): readonly Move[] { return EMPTY; }
export function snapshot(): readonly Move[] {
  let raw = memoryRaw;
  if (!storageFailed) {
    try { raw = localStorage.getItem(KEY); } catch { storageFailed = true; }
  }
  if (raw === lastRaw) return cached;
  lastRaw = raw;
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    const data = value && typeof value === "object" ? value as Record<string, unknown> : null;
    cached = data?.version === 1 && Array.isArray(data.moves) && data.moves.length <= MAX_MOVES
      ? data.moves.filter(isMove) : EMPTY;
  } catch { cached = EMPTY; }
  return cached;
}
export function subscribe(callback: () => void): () => void {
  const changed = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) callback();
  };
  window.addEventListener("storage", changed);
  window.addEventListener(EVENT, callback);
  return () => { window.removeEventListener("storage", changed); window.removeEventListener(EVENT, callback); };
}
function write(moves: readonly Move[]): void {
  memoryRaw = JSON.stringify({ version: 1, moves });
  try { localStorage.setItem(KEY, memoryRaw); } catch { storageFailed = true; }
  window.dispatchEvent(new Event(EVENT));
}
export function append(move: Move): void {
  if (!isMove(move)) return;
  const before = snapshot();
  if (before.length < MAX_MOVES) write([...before, move]);
}
export function resetRehearsal(): void { write([]); }
export function isMemoryOnly(): boolean { return storageFailed; }
