"use client";

import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { usePrison } from "@/lib/prison/store";
import { Dock } from "./Dock";
import { Gate } from "./Gate";
import { Speech } from "./Speech";
import { Stage } from "./Stage";

export function PrisonApp() {

  const entered = usePrison((s) => s.entered);
  const mood = usePrison((s) => s.mood);
  const line = usePrison((s) => s.line);
  const questions = usePrison((s) => s.questions);
  const maxQ = usePrison((s) => s.maxQ);
  const sound = usePrison((s) => s.sound);
  const speaking = usePrison((s) => s.speaking);
  const toggleSound = usePrison((s) => s.toggleSound);
  const leave = usePrison((s) => s.leave);
  const panel = usePrison((s) => s.panel);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      <Stage
        mood={entered ? mood : "corridor"}
        kenBurns={entered ? "breathe" : "dolly"}
        speaking={speaking}
      />
      {entered ? (
        <>
          <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4">
            <button
              type="button"
              onClick={leave}
              className="pointer-events-auto inline-flex min-h-11 items-center gap-1 font-display text-[0.7rem] uppercase tracking-[0.14em] text-muted"
            >
              <ArrowLeft className="size-3.5" />
              Reiter
            </button>
            <div className="pointer-events-auto flex items-start gap-2">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={sound ? "Ton aus" : "Ton an"}
                className="flex size-11 items-center justify-center rounded-xl bg-raised text-accent"
              >
                {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
              <div className="text-right">
                <div className="font-display text-[0.85rem] tracking-wide">Aikanor von Imladris</div>
                <div className="mt-0.5 text-[0.72rem] text-accent">
                  Erste Wache · noch {Math.max(0, maxQ - questions)} Fragen
                </div>
              </div>
            </div>
          </header>
          {panel === "verhoer" ? <Speech text={line} /> : null}
          <Dock />
        </>
      ) : (
        <Gate />
      )}
    </main>
  );
}
