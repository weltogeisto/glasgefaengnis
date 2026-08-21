"use client";

import { create } from "zustand";
import { AFTER_MOOD, AMBIENT_CYCLE, HOLD_MS, type Mood } from "./presence";
import {
  chipsFor,
  matchReply,
  objectiveFor,
  REPLIES,
} from "./script";
import { glassTick, playVoice, setMuted, stopVoice, unlockAudio } from "./audio";

export type Panel = "verhoer" | "codex" | "akte";

type PrisonState = {
  entered: boolean;
  panel: Panel;
  mood: Mood;
  line: string;
  questions: number;
  maxQ: number;
  riddle: boolean;
  letters: boolean;
  busy: boolean;
  sound: boolean;
  chips: string[];
  objective: string;
  enter: () => void;
  leave: () => void;
  setPanel: (panel: Panel) => void;
  toggleSound: () => void;
  send: (text: string) => void;
  cycleAmbient: () => void;
};

let holdTimer: ReturnType<typeof setTimeout> | null = null;
let ambientTimer: ReturnType<typeof setInterval> | null = null;
let ambientIndex = 0;

function refreshMeta(s: PrisonState) {
  return {
    chips: chipsFor(s.riddle, s.letters, s.questions, s.maxQ),
    objective: objectiveFor(s.riddle, s.letters, s.questions, s.maxQ),
  };
}

export const usePrison = create<PrisonState>((set, get) => ({
  entered: false,
  panel: "verhoer",
  mood: "corridor",
  line: "",
  questions: 0,
  maxQ: 6,
  riddle: false,
  letters: false,
  busy: false,
  sound: true,
  chips: chipsFor(false, false, 0, 6),
  objective: objectiveFor(false, false, 0, 6),

  enter: () => {
    unlockAudio();
    playVoice("open");
    set({
      entered: true,
      mood: "talk",
      line: REPLIES.open.text,
      panel: "verhoer",
    });
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      set({ mood: "idle", busy: false });
    }, 7000);
    if (ambientTimer) clearInterval(ambientTimer);
    ambientTimer = setInterval(() => get().cycleAmbient(), 11000);
  },

  leave: () => {
    stopVoice();
    if (holdTimer) clearTimeout(holdTimer);
    set({ entered: false, mood: "corridor", busy: false });
  },

  setPanel: (panel) => {
    const patch: Partial<PrisonState> = { panel };
    if (panel === "codex") patch.mood = "approach";
    set(patch);
  },

  toggleSound: () => {
    const next = !get().sound;
    setMuted(!next);
    set({ sound: next });
    if (next) unlockAudio();
    else stopVoice();
  },

  send: (text) => {
    const q = text.trim();
    const s = get();
    if (!q || s.busy || s.questions >= s.maxQ) return;
    unlockAudio();
    glassTick();
    const reply = matchReply(q);
    if (holdTimer) clearTimeout(holdTimer);
    playVoice(reply.audio);
    const nextQuestions = s.questions + 1;
    const nextRiddle = s.riddle || !!reply.progress?.riddle;
    const nextLetters = s.letters || !!reply.progress?.letters;
    set({
      busy: true,
      mood: reply.mood,
      line: reply.text,
      questions: nextQuestions,
      riddle: nextRiddle,
      letters: nextLetters,
      panel: "verhoer",
      ...refreshMeta({
        ...s,
        questions: nextQuestions,
        riddle: nextRiddle,
        letters: nextLetters,
      } as PrisonState),
    });
    const hold = HOLD_MS[reply.mood] ?? 6200;
    holdTimer = setTimeout(() => {
      set({ busy: false, mood: AFTER_MOOD[reply.mood] ?? "pace" });
    }, hold);
  },

  cycleAmbient: () => {
    const s = get();
    if (!s.entered || s.busy) return;
    if (s.mood === "talk" || s.mood === "laugh" || s.mood === "song" || s.mood === "storm" || s.mood === "rage") {
      return;
    }
    ambientIndex = (ambientIndex + 1) % AMBIENT_CYCLE.length;
    set({ mood: AMBIENT_CYCLE[ambientIndex] ?? "idle" });
  },
}));
