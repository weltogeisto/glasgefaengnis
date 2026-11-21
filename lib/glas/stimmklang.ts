/**
 * Der Klang der Zelle — als reine Beschreibung.
 *
 * Muster aus `lib/caressVoices.ts` im Fellowship OS, dessen Kopfkommentar den
 * Grund gleich mitliefert: „No audio assets, no licensing question, no
 * download." Jeder Ton hier wird aus Oszillatoren und gefiltertem Rauschen
 * gebaut. Es gibt nichts herunterzuladen und nichts zu lizenzieren.
 *
 * Diese Datei erzeugt keinen Ton. Sie beschreibt ihn, damit man ihn prüfen
 * kann — die Web-Audio-Knoten stehen in `klang.ts` und sonst nirgends.
 *
 * Drei Geräusche, mehr nicht: der Raum, die Sprechanlage, ein Knöchel am Glas.
 * Stille ist die Grundstellung und der lauteste Zustand, den dieser Raum hat.
 */

import { mulberry32, hashString } from "./rng";

export type Klangart = "raum" | "sprechanlage" | "knoechel";

export type Klangplan = {
  readonly art: Klangart;
  /** Sekunden. Der Raumton läuft in Schleife, die anderen beiden nicht. */
  readonly dauer: number;
  readonly schleife: boolean;
  /** Grundfrequenz in Hertz, oder null bei reinem Rauschen. */
  readonly grundton: number | null;
  readonly kurve: OscillatorType;
  /** Anteil Rauschen, 0 bis 1. */
  readonly rauschen: number;
  /** Mittenfrequenz des Bandfilters. */
  readonly filter: number;
  readonly guete: number;
  /** Spitzenlautstärke, 0 bis 1. Alles hier ist absichtlich leise. */
  readonly spitze: number;
  /** Anschlag und Ausklang in Sekunden. */
  readonly anschlag: number;
  readonly ausklang: number;
};

export const KLANGPLAENE: Readonly<Record<Klangart, Klangplan>> = {
  // Der Raum. Nicht Musik, nicht Atmosphäre — nur die Tatsache, dass hier
  // Luft steht und niemand das Fenster aufmacht.
  raum: {
    art: "raum",
    dauer: 8,
    schleife: true,
    grundton: 41,
    kurve: "sine",
    rauschen: 0.72,
    filter: 190,
    guete: 0.7,
    spitze: 0.055,
    anschlag: 2.4,
    ausklang: 2.4,
  },
  // Die Sprechanlage. Ein Klick, bevor etwas gesagt wird — man hört, dass
  // zwischen ihm und dir Technik steht.
  sprechanlage: {
    art: "sprechanlage",
    dauer: 0.11,
    schleife: false,
    grundton: 2100,
    kurve: "square",
    rauschen: 0.4,
    filter: 2600,
    guete: 5.5,
    spitze: 0.13,
    anschlag: 0.002,
    ausklang: 0.085,
  },
  // Ein Knöchel am Glas. Der einzige Ton in diesem Raum, der eine Dicke hat.
  knoechel: {
    art: "knoechel",
    dauer: 1.1,
    schleife: false,
    grundton: 720,
    kurve: "triangle",
    rauschen: 0.22,
    filter: 1450,
    guete: 12,
    spitze: 0.2,
    anschlag: 0.001,
    ausklang: 0.95,
  },
} as const;

/** Der Nachhall der Zelle. Ein kleiner, harter Raum aus Stein. */
export const HALLRAUM = {
  /** Sekunden. Länger, und es wäre eine Kirche. */
  dauer: 1.35,
  /** Je höher, desto trockener der Abfall. */
  abfall: 3.6,
  /** Erste Reflexionen — daraus hört man die Größe. */
  reflexionenMs: [17, 29, 43, 61] as const,
  saat: "glasgefaengnis:zelle",
} as const;

/**
 * Die Impulsantwort des Raums, aus gesätem Rauschen.
 *
 * Gesät, damit die Zelle auf jedem Gerät gleich groß klingt — und damit man
 * sie testen kann, ohne Web Audio zu starten.
 */
export function impulsantwort(abtastrate: number, saat: string = HALLRAUM.saat): Float32Array {
  const laenge = Math.max(1, Math.floor(abtastrate * HALLRAUM.dauer));
  const puffer = new Float32Array(laenge);
  const zufall = mulberry32(hashString(saat));

  for (let i = 0; i < laenge; i += 1) {
    const t = i / laenge;
    puffer[i] = (zufall() * 2 - 1) * Math.pow(1 - t, HALLRAUM.abfall);
  }
  // Frühe Reflexionen obendrauf: die harten Wände einer kleinen Kammer.
  for (const ms of HALLRAUM.reflexionenMs) {
    const stelle = Math.floor((ms / 1000) * abtastrate);
    if (stelle < laenge) puffer[stelle] += 0.55 * Math.pow(1 - stelle / laenge, 1.6);
  }
  return puffer;
}

/** Die Lautstärke eines Plans zum Zeitpunkt t. Nur zum Prüfen der Hüllkurve. */
export function huellkurve(plan: Klangplan, t: number): number {
  if (t <= 0 || t >= plan.dauer) return 0;
  if (t < plan.anschlag) return (t / plan.anschlag) * plan.spitze;
  const seit = t - plan.anschlag;
  return plan.spitze * Math.exp(-seit / Math.max(0.001, plan.ausklang / 3));
}
