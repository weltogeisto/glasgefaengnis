"use client";

import { applyReview, parseReviewStorage, REVIEW_VERSION, startReview, type ReviewCommand } from "@/lib/glas/regie";

const KEY = "moriondo:regie:v1";
const listeners = new Set<() => void>();
const SERVER = { session: startReview(), persistent: true };
let cache = SERVER;
let lastRaw: string | null | undefined;
let memoryOnly = false;
function emit() { for (const listener of listeners) listener(); }
export function getServerSnapshot() { return SERVER; }
export function getSnapshot() {
  if (typeof window === "undefined") return SERVER;
  if (memoryOnly) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw !== lastRaw) {
      lastRaw = raw;
      cache = { session: parseReviewStorage(raw), persistent: true };
    }
  } catch {
    memoryOnly = true;
    cache = { ...cache, persistent: false };
  }
  return cache;
}
function save() {
  if (!memoryOnly) {
    try {
      const raw = JSON.stringify({ version: REVIEW_VERSION, commands: cache.session.commands });
      window.localStorage.setItem(KEY, raw);
      lastRaw = raw;
    } catch {
      memoryOnly = true;
      cache = { ...cache, persistent: false };
    }
  }
  emit();
}
export function dispatch(command: ReviewCommand) {
  const previous = getSnapshot();
  const session = applyReview(previous.session, command);
  if (session === previous.session) return;
  cache = { ...previous, session };
  save();
}
export function resetReview() {
  cache = { session: startReview(), persistent: !memoryOnly };
  save();
}
export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (!memoryOnly && (event.key === KEY || event.key === null)) {
      lastRaw = undefined;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
