"use client";

/**
 * Web-Audio-Anschluss für `stimmklang.ts`.
 *
 * Die Beschreibung der Töne steht dort und ist prüfbar; hier stehen nur die
 * Knoten. Trennung wie bei `lib/caressVoices.ts` / `lib/caressAudio.ts` im
 * Fellowship OS.
 *
 * Aus, bis jemand es anschaltet. Ein Verhör, das ungefragt Ton macht, ist auf
 * einem Telefon in fremder Hand keine Atmosphäre, sondern ein Übergriff — und
 * die Zelle funktioniert stumm vollständig.
 */

import { KLANGPLAENE, impulsantwort, type Klangart } from "./stimmklang";

const SCHALTER = "glasgefaengnis:klang:v1";
const AUSKLANG = 0.14; // Sekunden. Hartes Abschneiden klickt.

let kontext: AudioContext | null = null;
let hall: ConvolverNode | null = null;
let raumton: { quelle: AudioBufferSourceNode; huelle: GainNode } | null = null;
let anCache: boolean | null = null;
const hoerer = new Set<() => void>();

function lager(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function abonniereKlang(neuzeichnen: () => void): () => void {
  hoerer.add(neuzeichnen);
  return () => hoerer.delete(neuzeichnen);
}

export function klangAn(): boolean {
  if (anCache !== null) return anCache;
  try {
    anCache = lager()?.getItem(SCHALTER) === "1";
  } catch {
    anCache = false;
  }
  return anCache;
}

export function klangAufDemServer(): boolean {
  return false;
}

/** Muss aus einer Geste heraus laufen — sonst bleibt der Kontext gesperrt. */
export function schalteKlang(an: boolean): void {
  anCache = an;
  try {
    lager()?.setItem(SCHALTER, an ? "1" : "0");
  } catch {
    /* Ohne Gedächtnis gilt es nur für diese Sitzung. */
  }
  if (!an) stoppeRaumton();
  else void hole();
  for (const rufen of hoerer) rufen();
}

async function hole(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;
  try {
    if (!kontext) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      kontext = new Ctor();
      // Der Nachhall der Zelle, aus gesätem Rauschen — sie klingt überall
      // gleich groß.
      const antwort = impulsantwort(kontext.sampleRate);
      const puffer = kontext.createBuffer(1, antwort.length, kontext.sampleRate);
      // `set` statt `copyToChannel`: die Typen von Float32Array sind seit
      // TS 5.7 über den Puffertyp parametrisiert, und der Umweg spart eine
      // Behauptung, die niemand später nachprüft.
      puffer.getChannelData(0).set(antwort);
      hall = kontext.createConvolver();
      hall.buffer = puffer;
      const summe = kontext.createGain();
      summe.gain.value = 0.5;
      hall.connect(summe);
      summe.connect(kontext.destination);
    }
    if (kontext.state === "suspended") await kontext.resume();
    return kontext;
  } catch {
    return null;
  }
}

function rauschpuffer(ctx: AudioContext, sekunden: number): AudioBuffer {
  const puffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * sekunden)), ctx.sampleRate);
  const kanal = puffer.getChannelData(0);
  for (let i = 0; i < kanal.length; i += 1) kanal[i] = Math.random() * 2 - 1;
  return puffer;
}

export async function spiele(art: Klangart): Promise<void> {
  if (!klangAn()) return;
  const ctx = await hole();
  if (!ctx || !hall) return;
  const plan = KLANGPLAENE[art];
  const jetzt = ctx.currentTime;

  const huelle = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = plan.filter;
  filter.Q.value = plan.guete;
  filter.connect(huelle);
  huelle.connect(hall);
  huelle.connect(ctx.destination);

  huelle.gain.setValueAtTime(0.0001, jetzt);
  huelle.gain.exponentialRampToValueAtTime(plan.spitze, jetzt + Math.max(0.001, plan.anschlag));
  huelle.gain.exponentialRampToValueAtTime(0.0001, jetzt + plan.dauer);

  if (plan.grundton !== null && plan.rauschen < 1) {
    const ton = ctx.createOscillator();
    ton.type = plan.kurve;
    ton.frequency.setValueAtTime(plan.grundton, jetzt);
    if (art === "knoechel") ton.frequency.exponentialRampToValueAtTime(plan.grundton * 0.6, jetzt + plan.dauer);
    const tonGain = ctx.createGain();
    tonGain.gain.value = 1 - plan.rauschen;
    ton.connect(tonGain);
    tonGain.connect(filter);
    ton.start(jetzt);
    ton.stop(jetzt + plan.dauer);
  }

  if (plan.rauschen > 0) {
    const quelle = ctx.createBufferSource();
    quelle.buffer = rauschpuffer(ctx, plan.dauer);
    quelle.loop = plan.schleife;
    const rauschGain = ctx.createGain();
    rauschGain.gain.value = plan.rauschen;
    quelle.connect(rauschGain);
    rauschGain.connect(filter);
    quelle.start(jetzt);
    if (plan.schleife) {
      raumton = { quelle, huelle };
    } else {
      quelle.stop(jetzt + plan.dauer);
    }
  }
}

export async function starteRaumton(): Promise<void> {
  if (raumton || !klangAn()) return;
  await spiele("raum");
}

export function stoppeRaumton(): void {
  if (!raumton || !kontext) return;
  const { quelle, huelle } = raumton;
  raumton = null;
  try {
    huelle.gain.exponentialRampToValueAtTime(0.0001, kontext.currentTime + AUSKLANG);
    quelle.stop(kontext.currentTime + AUSKLANG + 0.02);
  } catch {
    /* Schon aus. */
  }
}
