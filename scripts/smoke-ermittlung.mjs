/** Run against `npm run dev`: node scripts/smoke-ermittlung.mjs [baseURL]. */
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";
import ts from "typescript";
const source = await readFile(new URL("../lib/glas/ermittlung.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const core = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const base = process.argv[2] || "http://127.0.0.1:3000";
const out = ".artifacts/ermittlung-smoke";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage(); const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`${base}/ermittlung`);
    await page.locator("[data-ermittlung]").waitFor();
    assert.equal(await page.locator("video").count(), 0, "reduced-motion must not download/play video");
    const fits = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}px`);
    await fits();
    const undersized = await page.locator("button, select").evaluateAll(nodes => nodes.filter(n => n.getBoundingClientRect().height > 0 && n.getBoundingClientRect().height < 43).map(n => n.textContent));
    assert.deepEqual(undersized, [], `undersized controls at ${width}`);
    await page.screenshot({ path: `${out}/${width}-entry.png`, fullPage: true });
    if (width === 390) {
      const people = await page.locator("[data-actor] option").evaluateAll(nodes => nodes.map(n => ({ slug: n.value, name: n.textContent.split(" · ")[0] })));
      const actors = core.assignRoles(people); let world = core.initialWorld(); let count = 0;
      const who = role => actors.find(a => a.role === role).slug;
      async function perform(move) {
        await page.locator("[data-actor]").selectOption(move.actor);
        if (move.type === "enter") await page.locator("[data-enter]").click();
        if (move.type === "inspect") await page.locator(`[data-inspect="${move.method}"]`).click();
        if (move.type === "share") await page.locator(`[data-share="${move.evidenceId}"]`).click();
        if (move.type === "ask") await page.locator(`[data-ask="${move.topic}"]`).click();
        if (move.type === "confront" || move.type === "prove") {
          for (const id of move.evidence) await page.locator(`[data-select-evidence="${id}"]`).check();
          if (move.type === "confront") {
            await page.locator("[data-confront-topic]").selectOption(move.topic);
            await page.locator("[data-confront]").click();
          } else {
            await page.locator("[data-proof-claim]").selectOption(move.claim);
            await page.locator(`[data-answer="${move.answer}"]`).check();
            await page.locator("[data-prove]").click();
          }
        }
        if (move.type === "command") await page.locator("[data-command]").click();
        count++;
        await page.waitForFunction(n => JSON.parse(localStorage.getItem("moriondo:regieprobe:v1") || "null")?.moves.length === n, count);
        world = core.reduceMove(world, move, actors);
      }
      for (const actor of actors) await perform({ type: "enter", actor: actor.slug });
      await perform({ type: "ask", actor: who("chronist"), topic: "mounts" });
      for (const selector of ["[data-presence]", "[data-latest]"]) {
        const bounds = await page.locator(selector).boundingBox();
        assert.ok(bounds && bounds.y >= -1 && bounds.y + bounds.height <= 901, `${selector} must stay visible during a mobile question`);
      }
      await page.screenshot({ path: `${out}/390-interaction.png` });
      // Silent route: gather all reachable observations and explicitly release them.
      for (let pass = 0; pass < 12; pass++) {
        for (const actor of actors) {
          for (const clue of core.readyClues(world, actor)) await perform({ type: "inspect", method: clue.method, actor: actor.slug });
          for (const id of world.known[actor.slug] || []) if (!Object.hasOwn(world.shared, id)) await perform({ type: "share", evidenceId: id, actor: actor.slug });
        }
        for (const [topic, evidence] of [["capture", ["chronicle.dry-tack-window"]], ["north", ["forest.black-yew-resin", "language.not-stolen"]]]) {
          if (!world.exposed.includes(topic) && evidence.every(id => Object.hasOwn(world.shared, id))) await perform({ type: "confront", topic, evidence, actor: who("sprachhueter") });
        }
      }
      for (const claim of core.CLAIMS) {
        const candidates = core.EVIDENCE.filter(e => e.supports.includes(claim) && Object.hasOwn(world.shared, e.id));
        const first = candidates[0], second = candidates.find(e => e.role !== first.role);
        await perform({ type: "prove", claim, answer: core.PROPOSITIONS[claim].answer, evidence: [first.id, second.id], actor: who("sprachhueter") });
      }
      assert.equal(core.commandReady(world), true); assert.equal(world.rage, false);
      await perform({ type: "command", actor: "steven" });
      await page.locator("[data-rehearsal-complete]").waitFor(); await fits();
      await page.screenshot({ path: `${out}/390-complete.png`, fullPage: true });
      await page.reload(); await page.locator("[data-rehearsal-complete]").waitFor();
      assert.equal(await page.locator("[data-claim][data-proven=true]").count(), 4);
      await page.route("**/prison/**", route => route.abort());
      // Existing complete path uses the nest; fail it too and verify the text remains.
      await page.route("**/duesterwald/**", route => route.abort());
      await page.reload(); await page.locator("[data-rehearsal-complete]").waitFor();
      await page.getByText("Das Originalbild ist nicht erreichbar.", { exact: false }).waitFor();
    }
    assert.deepEqual(errors, [], `browser errors at ${width}`);
    await context.close();
  }
  const blocked = await browser.newContext({ reducedMotion: "reduce" });
  await blocked.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked by smoke test"); } }); });
  const page = await blocked.newPage(); await page.goto(`${base}/ermittlung`);
  await page.locator("[data-enter]").click();
  await page.getByText("Speichern ist gesperrt.", { exact: false }).waitFor();
  await blocked.close();
  console.log("PASS: responsive layout, controls, DOM-driven silent route, reload, blocked storage, media fallback");
} finally { await browser.close(); }
