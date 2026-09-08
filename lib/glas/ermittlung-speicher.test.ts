import { beforeEach, afterEach, test, vi } from "vitest";
import assert from "node:assert/strict";
const KEY = "moriondo:regieprobe:v1";
let memory: Map<string, string>;
beforeEach(() => {
  vi.resetModules(); memory = new Map();
  vi.stubGlobal("window", new EventTarget());
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  });
});
afterEach(() => vi.unstubAllGlobals());
test("snapshots are stable; writes notify and reset touches only the rehearsal", async () => {
  const store = await import("./ermittlung-speicher"); let calls = 0;
  const unsubscribe = store.subscribe(() => { calls++; });
  memory.set("unrelated-booklet", "keep");
  assert.equal(store.snapshot(), store.snapshot());
  store.append({ type: "enter", actor: "steven" });
  assert.equal(store.snapshot().length, 1); assert.equal(calls, 1);
  assert.equal(store.snapshot(), store.snapshot());
  store.resetRehearsal(); assert.equal(store.snapshot().length, 0);
  assert.equal(memory.get("unrelated-booklet"), "keep"); unsubscribe();
});
test("corrupt and foreign-version local saves safely become an empty rehearsal", async () => {
  const store = await import("./ermittlung-speicher");
  for (const raw of ["{", "null", JSON.stringify({ version: 2, moves: [] }), JSON.stringify({ version: 1, moves: [{ nonsense: true }] })]) {
    memory.set(KEY, raw); assert.equal(store.snapshot().length, 0);
  }
});
test("blocked storage still supports the current session", async () => {
  vi.stubGlobal("localStorage", { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } });
  const store = await import("./ermittlung-speicher");
  store.append({ type: "enter", actor: "steven" });
  assert.equal(store.isMemoryOnly(), true); assert.equal(store.snapshot().length, 1);
  store.resetRehearsal(); assert.equal(store.snapshot().length, 0);
});
test("unknown event payloads cannot enter the stored move log", async () => {
  const store = await import("./ermittlung-speicher");
  memory.set(KEY, JSON.stringify({ version: 1, moves: [{ type: "enter", actor: "steven" }, { type: "prove", actor: "steven", claim: "__proto__", evidence: [] }] }));
  assert.equal(store.snapshot().length, 1);
});
