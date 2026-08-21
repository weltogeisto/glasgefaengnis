"use client";

import { Link } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import { startAmbience, unlockAudio } from "@/lib/prison/audio";
import { usePrison } from "@/lib/prison/store";
import { Stage } from "./Stage";

export function Gate() {
  const enter = usePrison((s) => s.enter);
  const sound = usePrison((s) => s.sound);
  const toggleSound = usePrison((s) => s.toggleSound);

  function onEnter() {
    unlockAudio();
    startAmbience();
    enter();
  }

  return (
    <section className="fixed inset-0 z-50 flex flex-col justify-end bg-bg px-5 pb-12 pt-6 md:px-12 md:pb-16">
      <Stage mood="corridor" kenBurns="dolly" />
      <div className="relative z-20 max-w-md stagger-in">
        <p className="font-display text-[0.68rem] uppercase tracking-[0.16em] text-accent">
          Belagerung von Dol Guldur · Nachspiel
        </p>
        <h1 className="mt-3 font-display text-[2.1rem] leading-tight tracking-wide">
          Das Glasgefängnis
        </h1>
        <p className="lead mt-3 text-[0.95rem] leading-relaxed text-muted">
          Ein hoher Gefangener. Höflich. Nicht gütig. Der Stall der Mark ist leer — nicht weil
          Hände stahlen, sondern weil ein Lied die Bindung umschrieb.
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-accent font-display text-[0.8rem] uppercase tracking-[0.12em] text-bg transition-transform duration-[var(--motion-fast,250ms)] ease-out active:scale-[0.96]"
        >
          Vor das Glas treten
        </button>
        <Link
          to="/"
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-raised font-display text-[0.8rem] uppercase tracking-[0.12em] text-accent shadow-[0_0_0_1px_var(--color-border)]"
        >
          Batch 2 prüfen
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              toggleSound();
            }}
            className="inline-flex min-h-11 items-center gap-2 text-muted"
            aria-label={sound ? "Ton an" : "Ton aus"}
          >
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            <span className="font-display text-[0.68rem] uppercase tracking-[0.14em]">
              {sound ? "Ton bereit" : "Stumm"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
