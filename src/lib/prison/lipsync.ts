import envelopes from "./envelopes.json";

type Envelope = { rate: number; samples: number[] };

const ENVELOPES = envelopes as Record<string, Envelope>;

let smoothed = 0;

export function envelopeDurationMs(key: string): number {
  const env = ENVELOPES[key];
  if (!env) return 7000;
  return (env.samples.length / env.rate) * 1000;
}

export function envelopeAt(key: string, timeSec: number): number {
  const env = ENVELOPES[key];
  if (!env || env.samples.length === 0) return 0;
  const idx = timeSec * env.rate;
  const i = Math.floor(idx);
  const frac = idx - i;
  const a = env.samples[i] ?? 0;
  const b = env.samples[i + 1] ?? a;
  return a + (b - a) * frac;
}

export function smoothLip(raw: number): number {
  const rise = 0.58;
  const fall = 0.2;
  if (raw > smoothed) smoothed += (raw - smoothed) * rise;
  else smoothed += (raw - smoothed) * fall;
  if (smoothed < 0.02) smoothed = 0;
  return smoothed;
}

export function resetLip() {
  smoothed = 0;
}
