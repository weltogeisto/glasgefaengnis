"use client";

import { Howl, Howler } from "howler";


const VOICE_SRC: Record<string, string> = {
  open: "/prison/open.mp3",
  bruchstelle: "/prison/bruchstelle.mp3",
  pferd: "/prison/pferd.mp3",
  wer: "/prison/wer.mp3",
  lied: "/prison/lied.mp3",
  droh: "/prison/droh.mp3",
  wege: "/prison/wege.mp3",
  elbereth: "/prison/elbereth.mp3",
  warte: "/prison/warte.mp3",
  hoeflich: "/prison/hoeflich.mp3",
};

let voices: Record<string, Howl> | null = null;
let current: Howl | null = null;
let unlocked = false;
let muted = false;
let droneNodes: { stop: () => void } | null = null;

function ensureVoices() {
  if (voices) return voices;
  voices = {};
  for (const [key, src] of Object.entries(VOICE_SRC)) {
    voices[key] = new Howl({
      src: [src],
      preload: true,
      volume: 1,
      html5: false,
    });
  }
  return voices;
}

function ctx(): AudioContext | undefined {
  return Howler.ctx as AudioContext | undefined;
}

export function unlockAudio() {
  ensureVoices();
  const ac = ctx();
  if (ac && ac.state === "suspended") {
    void ac.resume();
  }
  Howler.mute(muted);
  unlocked = true;
}

export function isUnlocked() {
  return unlocked;
}

export function setMuted(next: boolean) {
  muted = next;
  Howler.mute(next);
  if (next) stopVoice();
}

export function playVoice(key: string) {
  if (muted) return;
  unlockAudio();
  stopVoice();
  const pack = ensureVoices();
  const howl = pack[key] ?? pack.hoeflich;
  current = howl;
  howl.stop();
  howl.play();
}

export function stopVoice() {
  if (current) {
    current.stop();
    current = null;
  }
}

export function glassTick() {
  if (muted) return;
  const ac = ctx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(1480, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

export function startAmbience() {
  if (droneNodes) return;
  unlockAudio();
  const ac = ctx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  const master = ac.createGain();
  master.gain.value = muted ? 0 : 0.045;
  master.connect(ac.destination);

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 43;
  const oscGain = ac.createGain();
  oscGain.gain.value = 0.55;
  osc.connect(oscGain);
  oscGain.connect(master);

  const osc2 = ac.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 86.4;
  const osc2Gain = ac.createGain();
  osc2Gain.gain.value = 0.12;
  osc2.connect(osc2Gain);
  osc2Gain.connect(master);

  const bufferSize = 2 * ac.sampleRate;
  const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = ac.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 280;
  const noiseGain = ac.createGain();
  noiseGain.gain.value = 0.35;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);

  osc.start();
  osc2.start();
  noise.start();

  droneNodes = {
    stop: () => {
      try {
        osc.stop();
        osc2.stop();
        noise.stop();
      } catch {
        /* already stopped */
      }
      droneNodes = null;
    },
  };
}

export function stopAmbience() {
  droneNodes?.stop();
}
