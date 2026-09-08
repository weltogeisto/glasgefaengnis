import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
const manifest = JSON.parse(await readFile("public/presence-manifest.json", "utf8"));
const cues = ["idle", "pace", "approach", "glass", "whisper", "turn", "delight", "rage_performed", "rage_true_break", "rage_aftermath"];
for (const suffix of cues) {
  const id = `moriondo.${suffix}`;
  const cue = manifest.cues[id];
  assert(cue, `Missing cue: ${id}`);
  for (const asset of [cue.video, cue.poster]) {
    assert(typeof asset === "string" && asset.startsWith("/prison/") && !asset.includes(".."), `Invalid asset path: ${id}`);
    assert((await stat(`public${asset}`)).size > 0, `Empty asset: ${id}`);
  }
  assert.equal(createHash("sha256").update(await readFile(`public${cue.video}`)).digest("hex"), cue.sha256, `Changed approved-source binary: ${id}`);
}
assert.equal(manifest.cues["moriondo.rage_true_break"].locked, true);
assert.equal(manifest.cues["moriondo.rage_true_break"].status, "owner-approved-existing");
console.log(`${cues.length} existing media cues present and byte-identical to the source manifest; no new asset approvals inferred.`);
