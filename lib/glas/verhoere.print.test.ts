/**
 * Das eigentliche Prüfgerät.
 *
 * Die anderen Tests halten das Register. Ob sich ein Verhör *gut liest*, sieht
 * man nur, indem man es am Stück liest — und das ist die letzte Instanz, die
 * dieses Projekt hat. Läuft nur auf Zuruf, damit `npm run test` still bleibt:
 *
 * Schreibt nach `.artifacts/verhoere.txt`.
 *
 *   npm run verhoer              alle siebzehn
 *   npm run verhoer -- frithjof  eine
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { describe, it } from "vitest";
import { befragbareDossiers } from "./dossier";
import { waehleFragen } from "./stimme";
import { spieleNach } from "./verhoer";
import { risstraeger } from "./riss";

const AN = process.env.DRUCKEN === "1";
const NUR = (process.env.VERHOER_SLUGS ?? "").split(/[,\s]+/u).filter(Boolean);

describe.skipIf(!AN)("Verhörprotokolle", () => {
  it("liest sich am Stück", () => {
    const auswahl = befragbareDossiers().filter((d) => NUR.length === 0 || NUR.includes(d.slug));
    const zeilen: string[] = [];

    for (const dossier of auswahl) {
      const frage = waehleFragen(dossier)[0];
      const sitzung = spieleNach(dossier.slug, [
        { art: "frage", frageId: frage.id },
        { art: "preis", text: "‹ihre Antwort›" },
        { art: "letzte-antwort", text: "‹ihre Antwort›" },
        { art: "gehen" },
      ]);
      if (!sitzung) continue;

      zeilen.push("", "", "═".repeat(72));
      zeilen.push(`  ${dossier.name.toUpperCase()}  —  ${dossier.figur}`);
      zeilen.push(`  ${dossier.titel}${dossier.slug === risstraeger() ? "        ◆ DER RISS" : ""}`);
      zeilen.push("═".repeat(72), "");

      for (const beat of sitzung.beats) {
        if (beat.art === "regie") zeilen.push(`      (${beat.text})`, "");
        if (beat.art === "replik") zeilen.push(`  „${beat.text}"`);
        if (beat.art === "pause" && beat.ms >= 2400) zeilen.push("");
        if (beat.art === "echo") zeilen.push("", `  —  ${beat.text}`, "");
        if (beat.art === "eingabe") zeilen.push("", `  „${beat.frage}"`, "");
        if (beat.art === "bruchstueck") zeilen.push("", `  ◆  „${beat.text}"`, "");
      }
    }
    zeilen.push("", "", `${auswahl.length} ${auswahl.length === 1 ? "Sitzung" : "Sitzungen"}. Der Riss liegt bei: ${risstraeger()}.`, "");
    mkdirSync(".artifacts", { recursive: true });
    writeFileSync(".artifacts/verhoere.txt", zeilen.join("\n"), "utf8");
    console.log(`→ .artifacts/verhoere.txt (${zeilen.length} Zeilen)`);
  });
});
