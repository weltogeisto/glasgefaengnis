"use client";

import { useEffect, useRef, useState } from "react";
import { PRESENCE, type Mood } from "@/lib/prison/presence";
import { GlassPane } from "./GlassPane";
import { cn } from "@/lib/utils";

const FRAME = "object-cover object-[50%_42%] md:object-[48%_42%]";

export function Stage({
  mood,
  kenBurns,
  docked,
}: {
  mood: Mood;
  kenBurns?: "breathe" | "dolly";
  docked?: boolean;
}) {
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const v0 = useRef<HTMLVideoElement>(null);
  const v1 = useRef<HTMLVideoElement>(null);
  const lastSrc = useRef<string>("");

  useEffect(() => {
    const clip = PRESENCE[mood] ?? PRESENCE.idle;
    if (lastSrc.current === clip.video) return;
    lastSrc.current = clip.video;
    const incoming = 1 - frontRef.current;
    const vid = incoming === 0 ? v0.current : v1.current;
    if (!vid) return;
    vid.src = clip.video;
    vid.poster = clip.poster;
    vid.load();
    const go = () => {
      vid.play().catch(() => {});
      frontRef.current = incoming;
      setFront(incoming);
    };
    if (vid.readyState >= 2) go();
    else vid.addEventListener("canplay", go, { once: true });
  }, [mood]);

  const clip = PRESENCE[mood] ?? PRESENCE.idle;

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 overflow-hidden bg-bg",
        docked ? "bottom-[44dvh] md:inset-0" : "bottom-0",
      )}
      aria-hidden
    >
      <img src={clip.poster} alt="" className={cn("absolute inset-0 h-full w-full", FRAME)} />
      <div
        className={cn(
          "absolute inset-0 origin-center will-change-transform",
          kenBurns === "breathe" && "prison-breathe",
          kenBurns === "dolly" && "prison-dolly",
        )}
      >
        <video
          ref={v0}
          muted
          loop
          playsInline
          preload="auto"
          poster={PRESENCE.idle.poster}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700",
            FRAME,
            front === 0 ? "opacity-100" : "opacity-0",
          )}
        />
        <video
          ref={v1}
          muted
          loop
          playsInline
          preload="auto"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700",
            FRAME,
            front === 1 ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <GlassPane />
    </div>
  );
}
