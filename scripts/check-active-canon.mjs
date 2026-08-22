import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const activeFiles = [
  "src/components/prison/Gate.tsx",
  "src/components/prison/Dock.tsx",
  "src/lib/prison/script.ts",
  "src/lib/prison/store.ts",
  "src/routes/glas.tsx",
];

const forbidden = [
  { label: "place-bound Moriondo", pattern: /ortsgebunden(?:e|en|er|es)?\s+(?:Macht|Dunkel|Wille)/i },
  { label: "evil Tom Bombadil mirror", pattern: /(?:böse[rnms]?\s+)?Spiegel[^\n]{0,80}Tom\s+Bombadil/i },
  { label: "self-imprisonment", pattern: /selbst\s+(?:in|hinein)[^\n]{0,80}(?:Glas|Gefängnis|gesungen)/i },
  { label: "song emptied the stall", pattern: /(?:Lied|sang|gesungen)[^\n]{0,100}(?:Stall|Bindung|Tier)/i },
  { label: "denial of physical abduction", pattern: /(?:nicht\s+fortgeschafft|nicht\s+physisch|kein(?:e|er)?\s+Entführung)/i },
  { label: "hard-coded participant name", pattern: /\bHendrik\b/ },
  { label: "placeholder cowork contract", pattern: /PLACEHOLDER_WILL_REPLACE/ },
];

const errors = [];

for (const relativePath of activeFiles) {
  const path = join(root, relativePath);
  if (!existsSync(path)) {
    errors.push(`${relativePath}: active canon file is missing.`);
    continue;
  }
  const content = readFileSync(path, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(content)) errors.push(`${relativePath}: contains superseded ${rule.label}.`);
  }
}

for (const required of ["COWORK.md", "docs/STORY_CONTRACT.md", "config/presence-approvals.json"]) {
  const path = join(root, required);
  if (!existsSync(path)) errors.push(`${required}: required governance file is missing.`);
}

const scriptPath = join(root, "src/lib/prison/script.ts");
if (existsSync(scriptPath)) {
  const script = readFileSync(scriptPath, "utf8");
  if (!script.includes("MEDIA_PROTOTYPE_ONLY")) {
    errors.push("src/lib/prison/script.ts must explicitly identify itself as a non-authoritative media prototype.");
  }
  for (const requiredPhrase of ["physisch", "Düsterwald", "Steven", "lebendig"]) {
    if (!script.includes(requiredPhrase)) {
      errors.push(`src/lib/prison/script.ts must contain the active-canon marker “${requiredPhrase}”.`);
    }
  }
}

const gatePath = join(root, "src/components/prison/Gate.tsx");
if (existsSync(gatePath)) {
  const gate = readFileSync(gatePath, "utf8");
  if (!gate.includes("Düsterwald") || !gate.includes("Spinnen")) {
    errors.push("Gate copy must identify the physical Düsterwald-spider abduction premise.");
  }
}

if (errors.length > 0) {
  console.error(`Active canon check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Active canon valid across ${activeFiles.length} runtime files.`);
