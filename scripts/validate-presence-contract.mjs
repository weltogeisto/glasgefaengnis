import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, normalize } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "public", "presence-manifest.json");
const approvalsPath = join(root, "config", "presence-approvals.json");

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot parse ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function publicPath(webPath) {
  if (typeof webPath !== "string" || !webPath.startsWith("/")) return null;
  const relative = normalize(webPath.slice(1));
  if (relative.startsWith("..")) return null;
  return join(root, "public", relative);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, "utf8");
  return createHash("sha1").update(header).update(buffer).digest("hex");
}

const errors = [];
const warnings = [];
const manifest = readJson(manifestPath);
const registry = readJson(approvalsPath);
const cues = manifest?.cues;
const approvals = registry?.approvals;

if (!cues || typeof cues !== "object" || Array.isArray(cues)) {
  errors.push("public/presence-manifest.json must contain a cues object.");
}
if (!approvals || typeof approvals !== "object" || Array.isArray(approvals)) {
  errors.push("config/presence-approvals.json must contain an approvals object.");
}

const cueEntries = Object.entries(cues ?? {});
const approvalEntries = Object.entries(approvals ?? {});

for (const [cueId, cue] of cueEntries) {
  if (!cue || typeof cue !== "object" || Array.isArray(cue)) {
    errors.push(`${cueId}: cue must be an object.`);
    continue;
  }

  if (typeof cue.durationMs !== "number" || cue.durationMs <= 0) {
    errors.push(`${cueId}: durationMs must be a positive number.`);
  }
  if (typeof cue.loop !== "boolean") {
    errors.push(`${cueId}: loop must be boolean.`);
  }

  const referenced = [cue.video, cue.poster, cue.altVideo, cue.altPoster].filter(Boolean);
  for (const webPath of referenced) {
    const filePath = publicPath(webPath);
    if (!filePath) {
      errors.push(`${cueId}: invalid public path ${String(webPath)}.`);
      continue;
    }
    if (!existsSync(filePath)) errors.push(`${cueId}: referenced file is missing: ${webPath}`);
  }

  if (cue.video === null && !["awaiting-production", "storyboard"].includes(cue.status)) {
    errors.push(`${cueId}: video=null is allowed only for awaiting-production or storyboard cues.`);
  }

  if (cue.video && cue.sha256) {
    const filePath = publicPath(cue.video);
    if (filePath && existsSync(filePath)) {
      const actual = sha256(readFileSync(filePath));
      if (actual !== cue.sha256) {
        errors.push(`${cueId}: manifest SHA-256 mismatch for ${cue.video}. Expected ${cue.sha256}, got ${actual}.`);
      }
    }
  }

  if (cue.locked === true) {
    if (cue.status !== "owner-approved-existing") {
      errors.push(`${cueId}: locked cues must use status owner-approved-existing.`);
    }
    if (!approvals?.[cueId]) {
      errors.push(`${cueId}: locked cue has no immutable owner approval record.`);
    }
  } else if (cue.status === "owner-approved-existing") {
    errors.push(`${cueId}: owner-approved-existing cues must be locked.`);
  }
}

for (const [cueId, approval] of approvalEntries) {
  const cue = cues?.[cueId];
  if (!cue) {
    errors.push(`${cueId}: approval record has no manifest cue.`);
    continue;
  }
  if (cue.locked !== true || cue.status !== "owner-approved-existing") {
    errors.push(`${cueId}: approval record requires locked=true and status=owner-approved-existing.`);
  }
  if (!approval || typeof approval !== "object" || !approval.files || typeof approval.files !== "object") {
    errors.push(`${cueId}: approval must contain a files object.`);
    continue;
  }

  const manifestFiles = new Set(
    [cue.video, cue.poster, cue.altVideo, cue.altPoster]
      .filter(Boolean)
      .map((path) => `public/${String(path).replace(/^\//, "")}`),
  );

  for (const [relativePath, expected] of Object.entries(approval.files)) {
    if (!manifestFiles.has(relativePath)) {
      errors.push(`${cueId}: approved file ${relativePath} is not referenced by the cue.`);
    }
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) {
      errors.push(`${cueId}: approved file is missing: ${relativePath}`);
      continue;
    }
    const buffer = readFileSync(filePath);
    const actualBlob = gitBlobSha(buffer);
    if (expected.gitBlobSha && actualBlob !== expected.gitBlobSha) {
      errors.push(
        `${cueId}: immutable Git blob mismatch for ${relativePath}. Expected ${expected.gitBlobSha}, got ${actualBlob}.`,
      );
    }
    if (expected.sha256) {
      const actual256 = sha256(buffer);
      if (actual256 !== expected.sha256) {
        errors.push(
          `${cueId}: immutable SHA-256 mismatch for ${relativePath}. Expected ${expected.sha256}, got ${actual256}.`,
        );
      }
    }
  }
}

for (const [cueId, cue] of cueEntries) {
  if (cue.video && !cue.sha256) warnings.push(`${cueId}: produced video has no SHA-256 in the manifest.`);
}

if (warnings.length > 0) {
  console.warn(`Presence contract warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`Presence contract failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Presence contract valid: ${cueEntries.length} cues, ${approvalEntries.length} immutable owner approvals.`,
);
