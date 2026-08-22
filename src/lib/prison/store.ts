"use client";

import { create } from "zustand";
import { AFTER_MOOD, AMBIENT_CYCLE, type Mood } from "./presence";
import { chipsFor, matchReply, objectiveFor, REPLIES, type Reply } from "./script";
import { envelopeDurationMs } from "./lipsync";
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
  speaking: boolean;
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

function clearHold() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}

function silentReadingDuration(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(9000, Math.max(2400, Math.round((words / 150) * 60_000)));
}

function playCanonSafeReply(reply: Reply, finish: () => void) {
  if (reply.audio) {
    playVoice(reply.audio, finish);
    holdTimer = setTimeout(finish, envelopeDurationMs(reply.audio) + 400);
    return;
  }

  // The existing speech files contain superseded song-prototype copy. New canon remains
  // text-only until matching voice lines are deliberately produced and owner-approved.
  holdTimer = setTimeout(finish, silentReadingDuration(reply.text));
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
  speaking: false,
  sound: true,
  chips: chipsFor(false, false, 0, 6),
  objective: objectiveFor(false, false, 0, 6),

  enter: () => {
    unlockAudio();
    clearHold();
    const reply = REPLIES.open;
    set({
      entered: true,
      mood: reply.mood,
      speaking: true,
      busy: true,
      line: reply.text,
      panel: "verhoer",
    });
    const finish = () => {
      if (!get().entered) return;
      set({ mood: "idle", busy: false, speaking: false });
    };
    playCanonSafeReply(reply, finish);
    if (ambientTimer) clearInterval(ambientTimer);
    ambientTimer = setInterval(() => get().cycleAmbient(), 11000);
  },

  leave: () => {
    stopVoice();
    clearHold();
    set({ entered: false, mood: "corridor", busy: false, speaking: false });
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
    clearHold();
    const nextQuestions = s.questions + 1;
    const nextRiddle = s.riddle || !!reply.progress?.riddle;
    const nextLetters = s.letters || !!reply.progress?.letters;
    set({
      busy: true,
      speaking: true,
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
    const finish = () => {
      const now = get();
      if (!now.entered || !now.busy) return;
      set({ busy: false, speaking: false, mood: AFTER_MOOD[reply.mood] ?? "pace" });
    };
    playCanonSafeReply(reply, finish);
  },

  cycleAmbient: () => {
    const s = get();
    if (!s.entered || s.busy || s.speaking) return;
    if (
      s.mood === "talk" ||
      s.mood === "laugh" ||
      s.mood === "song" ||
      s.mood === "storm" ||
      s.mood === "rage"
    ) {
      return;
    }
    ambientIndex = (ambientIndex + 1) % AMBIENT_CYCLE.length;
    set({ mood: AMBIENT_CYCLE[ambientIndex] ?? "idle" });
  },
}));
