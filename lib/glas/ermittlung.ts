/**
 * Playable, deterministic interrogation rehearsal. No XP, mount mutation,
 * authentication or shared-world authority lives in this client-side module.
 * New scene facts are authored rehearsal content, not additions to JGA canon.
 */
import { pickMany } from "./rng";

export const ERMITTLUNG_VERSION = 1;
export const MAX_ZUEGE = 240;
export const RUNEN = ["Asche", "Dorn", "Quelle", "Stein", "Nacht"] as const;
export type Rune = (typeof RUNEN)[number];
export type BeweisId = "riegel" | "spur" | "glas" | "takt" | "schrift";
export type Haltung = "ferne" | "seite" | "nah" | "hand" | "still";
export type Ermittlungsphase = "spuren" | "schluss" | "ordnung" | "rueckruf" | "gesichert";
export type Ermittlungszug =
  | { art: "untersuchen"; id: BeweisId }
  | { art: "fragen"; text: string }
  | { art: "vorhalten"; beweise: readonly BeweisId[] }
  | { art: "deuten"; text: string }
  | { art: "ordnen" | "rueckruf"; runen: readonly Rune[] }
  | { art: "schweigen" | "hilfe" };
export type Wechsel = { sprecher: "du" | "moriondo" | "regie"; text: string };
export type Beweis = { id: BeweisId; titel: string; fund: string };
export type Fall = { slug: string; name: string; folge: readonly Rune[]; beweise: readonly Beweis[] };
export type Ermittlung = {
  phase: Ermittlungsphase;
  entdeckt: readonly BeweisId[];
  zuege: readonly Ermittlungszug[];
  wechsel: readonly Wechsel[];
  haltung: Haltung;
  fehler: number;
  hilfen: number;
  gesehen: readonly string[];
  themen: readonly string[];
};

export function fallFuer(slug: string, name: string): Fall {
  const folge = pickMany(RUNEN, RUNEN.length, `glas:ermittlung:v1:${slug}`);
  const [a, b, c, d, e] = folge;
  return {
    slug, name, folge,
    beweise: [
      { id: "riegel", titel: "Der unversehrte Riegel", fund: "Das Tor ist von innen verriegelt. Kein Holz ist gesplittert. Neben dem Tor blieb eine schmale Öffnung frei." },
      { id: "spur", titel: "Die abgebrochene Spur", fund: "Die Spuren führen vom Futter weg zur schmalen Öffnung. Kein Schleifstrich, keine zweite Fährte. Die Tiere gingen selbst." },
      { id: "glas", titel: "Atem auf der Scheibe", fund: `Von seiner Seite erscheinen zwei Zeichen: ${a} unmittelbar vor ${b}. Die Schrift wirkt von hier aus gespiegelt.` },
      { id: "takt", titel: "Der fehlende Schlag", fund: `Er klopft zwei Namen gegen das Glas: ${b}, unmittelbar danach ${c}. Dann legt er die Hand flach auf die Scheibe.` },
      { id: "schrift", titel: "Die eingeritzten Namen", fund: `${c} steht unmittelbar vor ${d}; ${d} unmittelbar vor ${e}. Alle fünf Namen kommen genau einmal vor. Eine Reihe, kein Kreis.` },
    ],
  };
}

export function beginneErmittlung(): Ermittlung {
  return {
    phase: "spuren", entdeckt: [], zuege: [], haltung: "ferne", fehler: 0, hilfen: 0, gesehen: [], themen: [],
    wechsel: [
      { sprecher: "regie", text: "Die äußere Tür fällt zu. Hinter der Scheibe dreht er sich nicht um." },
      { sprecher: "moriondo", text: "Das Tor blieb zu. Du hast daraus eine Sicherheit gemacht." },
      { sprecher: "regie", text: "Dein Auftrag: den Weg der verschwundenen Tiere rekonstruieren. Der Riegel und die Spur liegen in deiner Ermittlungsakte." },
    ],
  };
}

export function normalisiereDeutung(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase("de-DE").replace(/[.!?,;:]/gu, " ").replace(/\s+/gu, " ").trim();
}
const IDS: readonly BeweisId[] = ["riegel", "spur", "glas", "takt", "schrift"];
const DEUTUNGEN = ["ruf", "lockruf", "stimme", "klang", "gesang", "ein ruf", "ein lockruf", "seine stimme", "moriondos stimme"];
function istRune(value: unknown): value is Rune { return typeof value === "string" && RUNEN.some((r) => r === value); }
function istBeweis(value: unknown): value is BeweisId { return typeof value === "string" && IDS.some((id) => id === value); }

/** Runtime validation is also used for localStorage replays: TS alone is not a boundary. */
export function leseErmittlungszug(raw: unknown): Ermittlungszug | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const z = raw as Record<string, unknown>;
  if (z.art === "untersuchen" && istBeweis(z.id)) return { art: z.art, id: z.id };
  if ((z.art === "fragen" || z.art === "deuten") && typeof z.text === "string") {
    const text = z.text.replace(/\s+/gu, " ").trim().slice(0, 280);
    return text ? { art: z.art, text } : null;
  }
  if (z.art === "vorhalten" && Array.isArray(z.beweise) && z.beweise.length === 2 && z.beweise.every(istBeweis) && new Set(z.beweise).size === 2) {
    return { art: z.art, beweise: [...z.beweise].sort() };
  }
  if ((z.art === "ordnen" || z.art === "rueckruf") && Array.isArray(z.runen) && z.runen.length === 5 && z.runen.every(istRune) && new Set(z.runen).size === 5) {
    return { art: z.art, runen: [...z.runen] };
  }
  if (z.art === "schweigen" || z.art === "hilfe") return { art: z.art };
  return null;
}

function frageThema(text: string): "tor" | "tiere" | "namen" | "macht" | "unbekannt" {
  const t = normalisiereDeutung(text);
  if (/\b(tor|riegel|tuer|tür|eingesperrt)\b/u.test(t)) return "tor";
  if (/\b(tiere|reittiere|pferde|reittier|pferd|stall|spur|verschwunden|ruf|lockruf|stimme|gesang)\b/u.test(t)) return "tiere";
  if (/\b(runen|rune|namen|name|glas|schrift|spiegel|reihenfolge|rueckruf|rückruf)\b/u.test(t)) return "namen";
  if (/\b(sauron|herr|macht|krieg|blauen|glut|wille)\b/u.test(t)) return "macht";
  return "unbekannt";
}
function gleich(a: readonly string[], b: readonly string[]): boolean { return a.length === b.length && a.every((x, i) => x === b[i]); }
function hat(s: Ermittlung, ...ids: BeweisId[]): boolean { return ids.every((id) => s.entdeckt.includes(id)); }

function antworte(s: Ermittlung, z: Ermittlungszug, du: string, text: string, regie: string, haltung: Haltung, patch: Partial<Ermittlung> = {}): Ermittlung {
  return {
    ...s, ...patch, haltung, zuege: [...s.zuege, z],
    gesehen: [...s.gesehen, `${s.phase}:${JSON.stringify(z)}`],
    wechsel: [...s.wechsel,
      { sprecher: "du", text: du },
      { sprecher: "regie", text: regie },
      { sprecher: "moriondo", text },
    ],
  };
}

/** Every valid turn has an observable response. Repeated submissions are idempotent. */
export function ermittle(s: Ermittlung, raw: unknown, fall: Fall): Ermittlung {
  const z = leseErmittlungszug(raw);
  if (!z || s.phase === "gesichert" || s.zuege.length >= MAX_ZUEGE) return s;
  // Do not fill the log by double-tapping, repeating a wrong code or farming inspection.
  if (z.art !== "hilfe" && s.gesehen.includes(`${s.phase}:${JSON.stringify(z)}`)) return s;
  switch (z.art) {
    case "untersuchen": {
      if (s.entdeckt.includes(z.id)) return s;
      const beweis = fall.beweise.find((b) => b.id === z.id)!;
      const texte: Record<BeweisId, string> = {
        riegel: "Ein unversehrter Riegel. Du siehst gern etwas, das hält.",
        spur: "Kein Schleifstrich. Gewalt hinterlässt bequemere Antworten.",
        glas: "Du liest von deiner Seite. Das ist nicht meine.",
        takt: "Eine Folge ist noch kein Ruf. Du hast erst seinen Takt.",
        schrift: "Fünf Namen. Keiner verträgt den falschen Nachbarn.",
      };
      return antworte(s, z, beweis.titel, texte[z.id], beweis.fund,
        z.id === "takt" ? "hand" : z.id === "glas" ? "nah" : "seite",
        { entdeckt: [...s.entdeckt, z.id] });
    }
    case "fragen": {
      const thema = frageThema(z.text);
      const themaId = `${s.phase}:${thema}`;
      const wieder = s.themen.includes(themaId);
      if (wieder) return s;
      const text = {
        tor: "Das Tor blieb zu. Ich habe nichts über die Öffnung daneben gesagt.",
        tiere: "Keiner musste sie tragen. Ein Ruf passt durch eine Öffnung, durch die keine Hand passt.",
        namen: s.phase === "rueckruf" ? "Deine Reihe stimmt auf meiner Seite. Du stehst auf der anderen." : "Die Namen liegen zwischen uns. Ihre Nachbarn stehen im Glas, im Takt und in der Schrift.",
        macht: "Mein Reich endet mit meinem Fels. Ein anderer Wille ist deshalb noch nicht meiner.",
        unbekannt: "Das weiß ich nicht. Deine Belege sind genauer als eine weitere Vermutung.",
      }[thema];
      // A later phase may make the same subject productive again.
      return antworte(s, z, z.text, text, "Er wendet dir den Kopf zu, nicht den Körper.", "seite", { themen: [...s.themen, themaId] });
    }
    case "vorhalten": {
      if (s.phase !== "spuren" || !z.beweise.every((id) => s.entdeckt.includes(id))) return s;
      const richtig = z.beweise.includes("riegel") && z.beweise.includes("spur");
      return antworte(s, z, z.beweise.map((id) => fall.beweise.find((b) => b.id === id)!.titel).join(" + "),
        richtig ? "Beides ist wahr. Du hast nur den falschen Schluss dazwischengelegt." : "Zwei Beobachtungen. Noch keine Erklärung für ein leeres Gehege.",
        richtig ? "Zum ersten Mal kommt er bis an die Scheibe." : "Er sieht auf deine Belege, dann wieder durch dich hindurch.",
        richtig ? "nah" : "ferne", { phase: richtig ? "schluss" : "spuren", fehler: s.fehler + Number(!richtig) });
    }
    case "deuten": {
      if (s.phase !== "schluss") return s;
      const richtig = DEUTUNGEN.includes(normalisiereDeutung(z.text));
      return antworte(s, z, z.text,
        richtig ? "Ein Ruf, kein Einbruch. Die Namen dafür liegen noch zwischen uns." : "Die Tiere gingen selbst. Es fehlt noch, worauf sie hörten.",
        richtig ? `${fall.name}. Er sagt deinen Namen erst jetzt, nachdem du ihm etwas abgenommen hast.` : "Er bleibt stehen. Du bekommst die Spur zurück, nicht die Lösung.",
        richtig ? "hand" : "still", { phase: richtig ? "ordnung" : "schluss", fehler: s.fehler + Number(!richtig) });
    }
    case "ordnen": {
      if (s.phase !== "ordnung" || !hat(s, "glas", "takt", "schrift")) return s;
      const richtig = gleich(z.runen, fall.folge);
      return antworte(s, z, z.runen.join(" · "),
        richtig ? "Die Nachbarn stimmen. Jetzt fehlt nur noch die Seite, von der du rufst." : "Mindestens ein Nachbar widerspricht deiner Akte. Die Schrift ist geduldiger als du.",
        richtig ? "Er legt die Hand von innen gegen deine Reihe. Die Zeichen stehen dir spiegelverkehrt gegenüber." : "Er zieht die Hand von der Scheibe zurück.",
        richtig ? "hand" : "ferne", { phase: richtig ? "rueckruf" : "ordnung", fehler: s.fehler + Number(!richtig) });
    }
    case "rueckruf": {
      if (s.phase !== "rueckruf") return s;
      const richtig = gleich(z.runen, [...fall.folge].reverse());
      return antworte(s, z, z.runen.join(" · "),
        richtig ? "Jetzt kommt dein Ruf von der richtigen Seite. Du kannst gehen." : "Das war meine Reihenfolge. Du stehst noch immer draußen.",
        richtig ? "Die Scheibe wird still. Deine Rückrufspur ist vollständig; im Proberaum wird kein Reittier verändert." : "Sein Finger liegt am anderen Ende der Reihe.",
        richtig ? "still" : "nah", { phase: richtig ? "gesichert" : "rueckruf", fehler: s.fehler + Number(!richtig) });
    }
    case "schweigen":
      return antworte(s, z, "Ich lasse die Frage stehen.", "Du hältst die Stille aus. Die Schrift auf meiner Seite zeigt von deiner Seite rückwärts.",
        "Er wartet auf deine nächste Frage. Als sie ausbleibt, dreht er die Hand langsam um.", "hand");
    case "hilfe": {
      if (s.hilfen >= 3) return s;
      const hinweise = {
        spuren: "Der Riegel und die Spur beantworten verschiedene Fragen. Zusammen widerlegen sie einen Einbruch.",
        schluss: "Keiner trug die Tiere. Sie hörten einen Ruf.",
        ordnung: `Die erste Rune ist ${fall.folge[0]}. Jeder weitere Nachbar steht in deiner Akte.`,
        rueckruf: "Die Schrift steht auf meiner Seite. Von deiner beginnt die Reihe mit ihrem Ende.",
        gesichert: "Die Spur ist vollständig. Du kannst gehen.",
      };
      return antworte(s, z, "Ich brauche einen Ansatz.", hinweise[s.phase], "Er gibt dir einen Ansatz, nicht deinen Fortschritt zurück.", "still", { hilfen: s.hilfen + 1 });
    }
  }
}

export function spieleErmittlungNach(fall: Fall, raw: unknown): Ermittlung {
  const liste = Array.isArray(raw) ? raw.slice(0, MAX_ZUEGE) : [];
  return liste.reduce<Ermittlung>((s, z) => ermittle(s, z, fall), beginneErmittlung());
}
export function zielDerErmittlung(s: Ermittlung): string {
  return {
    spuren: "Welche zwei Belege stellen seine Aussage in ein anderes Licht?",
    schluss: "Was hat die Tiere aus dem Stall geführt? Ein Wort genügt.",
    ordnung: "Wie lautet die vollständige Folge auf seiner Seite der Scheibe?",
    rueckruf: "Wie musst du dieselben Namen von deiner Seite aus rufen?",
    gesichert: "Rückrufspur gesichert. Noch keine Freigabe im Live-Stall.",
  }[s.phase];
}
