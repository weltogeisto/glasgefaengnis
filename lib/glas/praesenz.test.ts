import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { SHOTS } from "./praesenz";

test("every rehearsal shot uses a present, unchanged source-manifest binary", () => {
  const manifest = JSON.parse(readFileSync("public/presence-manifest.json", "utf8")) as {
    cues: Record<string, { video: string; poster: string; sha256: string }>;
  };
  for (const shot of Object.values(SHOTS)) {
    const source = Object.values(manifest.cues).find(c => c.video === shot.video);
    assert.ok(source, `unregistered shot: ${shot.video}`);
    assert.equal(source.poster, shot.poster);
    assert.ok(existsSync(`public${shot.poster}`));
    assert.equal(createHash("sha256").update(readFileSync(`public${shot.video}`)).digest("hex"), source.sha256);
  }
});
test("every one-shot ends on a valid rest cue and all shots have a textual equivalent", () => {
  for (const shot of Object.values(SHOTS)) {
    assert.ok(SHOTS[shot.rest]); assert.ok(shot.description.length > 15);
  }
  assert.equal(SHOTS.rupture.rest, "aftermath");
  assert.equal(SHOTS.command.rest, "nest");
});
