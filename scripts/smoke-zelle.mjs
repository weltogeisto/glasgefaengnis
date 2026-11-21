/**
 * Rauchprobe für das Glasgefängnis.
 *
 * Hausform aus dem Fellowship OS: ein eigenständiges ESM-Programm mit
 * handgeschriebenem `assert`, keine Test-Runner-Abhängigkeit, `data-*`-Haken
 * statt CSS-Klassen als Selektoren, vier Breiten, null Konsolenfehler.
 *
 *   node scripts/smoke-zelle.mjs
 *   ZELLE_BASE_URL=https://… node scripts/smoke-zelle.mjs
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = (process.env.ZELLE_BASE_URL ?? "http://127.0.0.1:3010").replace(/\/$/, "");
const outDir = path.resolve(process.cwd(), ".artifacts/zelle-smoke");
const breiten = [320, 390, 768, 1440];
const hoehe = (breite) => (breite === 390 ? 844 : breite === 768 ? 1024 : 1000);

function assert(bedingung, nachricht, details) {
  if (!bedingung) {
    throw new Error(`${nachricht}${details ? `: ${JSON.stringify(details)}` : ""}`);
  }
}

/** Bewegung aus: die Beats stehen sofort, und die Probe wird reproduzierbar. */
const KONTEXT = { reducedMotion: "reduce", locale: "de-DE" };

async function messe(page, breite) {
  return page.evaluate((viewport) => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, breite: r.width, hoehe: r.height };
    };
    const alle = (sel) => [...document.querySelectorAll(sel)];
    return {
      viewport,
      dokumentBreite: document.documentElement.scrollWidth,
      titel: document.title,
      h1: document.querySelector("h1")?.textContent ?? null,
      tasten: alle("button, a.taste").map((el) => ({
        ...rect(el),
        text: (el.textContent ?? "").trim().slice(0, 40),
        ariaPressed: el.getAttribute("aria-pressed"),
        deaktiviert: el.hasAttribute("disabled"),
      })),
      beats: alle("[data-beat]").map((el) => ({ art: el.dataset.beat, ...rect(el) })),
      scheibe: rect(document.querySelector("[data-scheibe]")),
      stufe: document.querySelector("[data-glas-stufe]")?.dataset.glasStufe ?? null,
      fragen: alle("[data-frage]").map((el) => el.dataset.frage),
      tueren: alle("[data-tuer]").length,
      hatSchwelle: Boolean(document.querySelector("[data-schwelle]")),
      hatAbschied: Boolean(document.querySelector("[data-abschied]")),
      hatBruchstueck: Boolean(document.querySelector('[data-beat="bruchstueck"]')),
      fuerJan: alle("[data-fuer-jan] li").length,
    };
  }, breite);
}

function pruefeRahmen(mess, breite, wo) {
  assert(mess.dokumentBreite <= breite + 1, `${wo}: waagerechter Überlauf bei ${breite}px`, {
    dokumentBreite: mess.dokumentBreite,
  });
  for (const taste of mess.tasten) {
    assert(taste.hoehe >= 44, `${wo}: Bedienelement unter 44px bei ${breite}px`, taste);
    assert(taste.left >= -1 && taste.right <= breite + 1, `${wo}: Element ragt heraus`, taste);
  }
  if (mess.scheibe) {
    assert(
      mess.scheibe.left >= -1 && mess.scheibe.right <= breite + 1,
      `${wo}: Scheibe ragt heraus bei ${breite}px`,
      mess.scheibe,
    );
  }
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    args: ["--no-sandbox"],
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });
  const ergebnisse = [];

  try {
    for (const breite of breiten) {
      const context = await browser.newContext({
        ...KONTEXT,
        viewport: { width: breite, height: hoehe(breite) },
      });
      const page = await context.newPage();
      const fehler = [];
      page.on("pageerror", (e) => fehler.push(`pageerror:${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") fehler.push(`console:${m.text()}`);
      });
      // Die nackte Konsolenmeldung nennt die Adresse nicht. Ohne sie sucht man lange.
      page.on("response", (r) => {
        if (r.status() >= 400) fehler.push(`http:${r.status()} ${r.url()}`);
      });

      // ── Der Gang, vor der Schwelle ──────────────────────────────────────
      let antwort = await page.goto(`${baseUrl}/?t=${Date.now()}`, { waitUntil: "networkidle" });
      assert(antwort?.status() === 200, "Gang liefert kein 200", { status: antwort?.status() });
      await page.waitForSelector("[data-gang]");
      let mess = await messe(page, breite);
      assert(mess.hatSchwelle, "Die Schwelle fehlt — die Tür wäre offen");
      assert(mess.tueren === 0, "Türen vor dem Bann sichtbar", { tueren: mess.tueren });
      pruefeRahmen(mess, breite, "gang/schwelle");
      await page.screenshot({ path: path.join(outDir, `${breite}-schwelle.png`), fullPage: true });

      // ── Den Bann tippen. Vier Wörter reichen. ───────────────────────────
      await page.fill("#bann-feld", "Elbereth Sternenlicht Schatten Stein Feuer");
      await page.waitForSelector("[data-tueren]");
      mess = await messe(page, breite);
      assert(mess.tueren === 17, "Es sind nicht siebzehn Türen", { tueren: mess.tueren });
      pruefeRahmen(mess, breite, "gang/offen");
      await page.screenshot({ path: path.join(outDir, `${breite}-gang.png`), fullPage: true });

      // ── Eine Sitzung, von der Ankunft bis zum Abschied ──────────────────
      await page.click('[data-tuer="frithjof"]');
      await page.waitForSelector("[data-zelle]");
      await page.waitForSelector("[data-frage]");
      mess = await messe(page, breite);
      assert(mess.stufe === "1", "Sitzung startet nicht auf Stufe 1", { stufe: mess.stufe });
      assert(mess.fragen.length === 3, "Es stehen nicht drei Fragen offen", { fragen: mess.fragen });
      assert(mess.beats.length > 4, "Die Eröffnung ist zu kurz", { beats: mess.beats.length });
      assert(
        mess.beats.some((b) => b.art === "regie"),
        "Die Regieanweisung fehlt",
      );
      pruefeRahmen(mess, breite, "zelle/wahl");
      await page.screenshot({ path: path.join(outDir, `${breite}-zelle.png`), fullPage: true });

      await page.click(`[data-frage="${mess.fragen[0]}"]`);
      await page.waitForSelector("[data-antwort]");
      mess = await messe(page, breite);
      assert(mess.stufe === "2", "Der Handel steht nicht auf Stufe 2", { stufe: mess.stufe });
      pruefeRahmen(mess, breite, "zelle/forderung");

      await page.fill("#antwort-feld", "Letzten Sommer, und ich habe es niemandem erzählt.");
      await page.click("[data-senden]");
      await page.waitForSelector('[data-beat="bruchstueck"]');
      mess = await messe(page, breite);
      assert(mess.hatBruchstueck, "Er gibt nichts heraus, obwohl bezahlt wurde");
      pruefeRahmen(mess, breite, "zelle/bruchstueck");

      await page.fill("#antwort-feld", "Ja. Dafür sind wir schließlich alle hier.");
      await page.click("[data-senden]");
      await page.waitForSelector("[data-abschied]");
      mess = await messe(page, breite);
      assert(mess.hatAbschied, "Der Abschied fehlt");
      assert(mess.stufe === "3", "Der Abschied steht nicht auf Stufe 3", { stufe: mess.stufe });
      pruefeRahmen(mess, breite, "zelle/abschied");
      await page.screenshot({ path: path.join(outDir, `${breite}-abschied.png`), fullPage: true });

      // ── Das Protokoll ───────────────────────────────────────────────────
      await page.click("[data-zum-protokoll]");
      await page.waitForSelector("[data-protokoll]");
      await page.waitForSelector("[data-fuer-jan]");
      mess = await messe(page, breite);
      assert(mess.fuerJan === 1, "Die Antwort steht nicht in Jans Bild", { fuerJan: mess.fuerJan });
      pruefeRahmen(mess, breite, "protokoll");
      await page.screenshot({ path: path.join(outDir, `${breite}-protokoll.png`), fullPage: true });

      // ── Die Schwelle merkt sich, dass gesungen wurde ────────────────────
      await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-tueren]");
      mess = await messe(page, breite);
      assert(!mess.hatSchwelle, "Der Bann muss zweimal gesungen werden");
      assert(
        (await page.getAttribute('[data-tuer="frithjof"]', "data-fertig")) === "true",
        "Die geführte Sitzung ist im Gang nicht markiert",
      );

      // ── Tastatur: die Türen sind erreichbar, ohne zu zeigen ─────────────
      const fokussiert = await page.evaluate(() => {
        const erste = document.querySelector("[data-tuer]");
        erste?.focus();
        return document.activeElement?.getAttribute("data-tuer") ?? null;
      });
      assert(fokussiert !== null, "Eine Tür lässt sich nicht fokussieren");

      // ── Der Werkraum: füllen, prüfen, zurücksetzen ──────────────────────
      await page.goto(`${baseUrl}/beta`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-beta]");
      mess = await messe(page, breite);
      pruefeRahmen(mess, breite, "beta");
      await page.click("[data-beta-fuellen]");
      await page.click("[data-beta-protokoll]");
      await page.waitForSelector("[data-fuer-jan]");
      mess = await messe(page, breite);
      assert(mess.fuerJan === 17, "Die Vorschau füllt nicht alle siebzehn", { fuerJan: mess.fuerJan });
      pruefeRahmen(mess, breite, "protokoll/voll");
      await page.screenshot({ path: path.join(outDir, `${breite}-protokoll-voll.png`), fullPage: true });

      await page.goto(`${baseUrl}/beta`, { waitUntil: "networkidle" });
      await page.click("[data-beta-zuruecksetzen]");
      await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-schwelle]");
      assert(
        (await page.locator("[data-tuer]").count()) === 0,
        "Zurücksetzen hat die Schwelle nicht wieder geschlossen",
      );

      assert(fehler.length === 0, `Der Browser hat Fehler gemeldet (${breite}px)`, fehler);
      ergebnisse.push({ breite, beats: mess.beats.length, ok: true });
      await context.close();
    }
    // ── Tempo: vorlehnen ja, spulen nein ─────────────────────────────────
    // Eigener Kontext mit Bewegung — sonst stehen alle Beats sofort da.
    {
      const context = await browser.newContext({ locale: "de-DE", viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      const fehler = [];
      page.on("pageerror", (e) => fehler.push(`pageerror:${e.message}`));
      page.on("console", (m) => {
        if (m.type() === "error") fehler.push(`console:${m.text()}`);
      });

      await page.goto(`${baseUrl}/zelle/frithjof`, { waitUntil: "networkidle" });
      await page.waitForSelector("[data-weiter]");
      const zaehle = () => page.locator("[data-beat]").count();
      const vorher = await zaehle();
      const tippen = () => page.$eval("[data-weiter]", (el) => el.click());
      await tippen();
      const nachher = await zaehle();
      assert(nachher > vorher, "Antippen bringt keine Zeile weiter", { vorher, nachher });

      // Tippen im Antwortfeld darf niemals weiterschalten.
      for (let i = 0; i < 40 && (await page.locator("[data-frage]").count()) === 0; i += 1) {
        await tippen();
      }
      await page.click("[data-frage] >> nth=0");
      await page.waitForSelector("#antwort-feld");
      const vorEingabe = await zaehle();
      await page.fill("#antwort-feld", "Letzten Sommer.");
      assert(
        (await zaehle()) === vorEingabe,
        "Tippen im Antwortfeld hat die Sitzung weitergeschaltet",
      );

      assert(fehler.length === 0, "Der Browser hat beim Tempo-Test Fehler gemeldet", fehler);
      ergebnisse.push({ breite: 390, tempo: "geprüft", ok: true });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ ok: true, baseUrl, outDir, ergebnisse }, null, 2));
}

main().catch((fehler) => {
  console.error(fehler.message);
  process.exit(1);
});
