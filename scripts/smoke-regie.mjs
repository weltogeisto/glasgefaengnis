import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const out = ".artifacts/regie-smoke";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    const overflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: horizontal overflow`);
    const click = async (selector) => { await page.locator(selector).click(); await overflow(); };
    await page.goto(`${base}/regie`, { waitUntil: "networkidle" });
    await page.locator("[data-regie]").waitFor();
    await overflow();
    await page.screenshot({ path: `${out}/${width}-entry.png`, fullPage: true });
    await click("[data-enter]");
    await click('[data-ask="command"]');
    await click('[data-pressure]');
    assert.equal(await page.locator("[data-presence-cue]").getAttribute("data-presence-cue"), "moriondo.rage_performed");
    assert.equal(await page.locator("[data-regie]").getAttribute("data-phase"), "interrogation");
    await click('[data-tab="evidence"]');
    await click('[data-observe="strand"]');
    await click('[data-observe="witness"]');
    await click('[data-dispute]');
    await page.locator('[data-evidence="strand"] input').check();
    await page.locator('[data-evidence="copy"] input').check();
    await click('[data-confront]');
    assert.equal(await page.locator('[data-claim]').getAttribute("data-claim"), "disputed", "a copy is not corroboration");
    await page.screenshot({ path: `${out}/${width}-evidence.png`, fullPage: true });
    await page.locator('[data-evidence="copy"] input').uncheck();
    await page.locator('[data-evidence="witness"] input').check();
    await click('[data-confront]');
    assert.equal(await page.locator('[data-regie]').getAttribute("data-phase"), "rage");
    await click('[data-after-rage]');
    assert.equal(await page.locator('[data-presence-cue]').getAttribute("data-presence-cue"), "moriondo.rage_aftermath");
    await click('[data-tab="council"]');
    assert(await page.locator('[data-council-evidence="strand"]').innerText().then((s) => s.includes("Unter deinem Siegel")), "proof must not auto-share");
    await click('[data-council-evidence="strand"] button');
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('[data-regie]').getAttribute("data-phase"), "aftermath", "reload remembers consequence");
    await click('[data-tab="council"]');
    assert(await page.locator('[data-council-evidence="strand"]').innerText().then((s) => s.includes("nicht automatisch bestätigt")));
    await page.screenshot({ path: `${out}/${width}-aftermath.png`, fullPage: true });
    await click('[data-reset]');
    await click('[data-confirm-reset]');
    assert.equal(await page.locator('[data-regie]').getAttribute("data-phase"), "threshold");
    assert.deepEqual(errors, [], `${width}: browser errors`);
    report.push({ width, reducedMotion: true, flow: "pass", errors });
    await context.close();
  }
  // Actual mobile video decode and inline playback, not only a poster screenshot.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(`${base}/regie`, { waitUntil: "domcontentloaded" });
  await page.locator("video").waitFor();
  await page.waitForFunction(() => { const v = document.querySelector("video"); return v && v.readyState >= 2 && v.currentTime > 0; }, null, { timeout: 30000 });
  assert(await page.locator("video").evaluate((v) => v.muted && v.playsInline));
  await page.screenshot({ path: `${out}/390-video.png`, fullPage: true });
  report.push({ width: 390, actualVideoDecoded: true, mutedInline: true });
  await ctx.close();
  // Storage denial is a memory-only review, not a blank screen.
  const denied = await browser.newContext({ reducedMotion: "reduce" });
  await denied.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Denied", "SecurityError"); } }));
  const fallback = await denied.newPage();
  await fallback.goto(`${base}/regie`, { waitUntil: "networkidle" });
  await fallback.locator("[data-enter]").click();
  assert.equal(await fallback.locator('[data-regie]').getAttribute("data-phase"), "interrogation");
  assert(await fallback.getByText("Speichern ist hier gesperrt.", { exact: false }).isVisible());
  report.push({ storageDenied: "graceful-memory-only" });
  await denied.close();
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
