"use client";

import { useEffect, useRef, useState } from "react";
import { CLOSE_MOODS, LIP_MOODS, PRESENCE, type Mood } from "@/lib/prison/presence";
import { speakingEnergy } from "@/lib/prison/audio";
import { GlassPane } from "./GlassPane";
import { cn } from "@/lib/utils";

export function Stage({
  mood,
  kenBurns,
  speaking,
}: {
  mood: Mood;
  kenBurns?: "breathe" | "dolly";
  speaking?: boolean;
}) {
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const v0 = useRef<HTMLVideoElement>(null);
  const v1 = useRef<HTMLVideoElement>(null);
  const lastSrc = useRef<string>("");
  const stageRef = useRef<HTMLDivElement>(null);
  const talkRef = useRef<HTMLVideoElement>(null);
  const lips = speaking && LIP_MOODS.includes(mood);
  const close = CLOSE_MOODS.includes(mood);
  const frame = close
    ? "object-[50%_42%] md:object-[50%_45%]"
    : "object-[50%_18%] md:object-[48%_42%]";

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

  useEffect(() => {
    const talk = talkRef.current;
    if (!talk) return;
    if (lips) talk.play().catch(() => {});
    else talk.pause();
  }, [lips]);

  useEffect(() => {
    let id = 0;
    const loop = () => {
      const el = stageRef.current;
      if (el) {
        const energy = speaking ? speakingEnergy() : 0;
        el.style.setProperty("--lip", energy.toFixed(3));
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [speaking]);

  const clip = PRESENCE[mood] ?? PRESENCE.idle;

  return (
    <div ref={stageRef} className="absolute inset-0 overflow-hidden bg-bg" aria-hidden>
      <img
        src={clip.poster}
        alt=""
        className={cn("absolute inset-0 h-full w-full object-cover", frame)}
      />
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
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            frame,
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
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            frame,
            front === 1 ? "opacity-100" : "opacity-0",
          )}
        />
        {lips ? (
          <>
            <video
              ref={talkRef}
              muted
              loop
              playsInline
              preload="auto"
              src="/prison/talk.mp4"
              poster="/prison/talk.jpg"
              className={cn("absolute inset-0 h-full w-full object-cover", frame)}
              style={{ opacity: "calc(var(--lip) * 0.55)" }}
            />
            <img
              src="/prison/lips-open.jpg"
              alt=""
              className={cn("absolute inset-0 h-full w-full object-cover", frame)}
              style={{ opacity: "var(--lip)" }}
            />
          </>
        ) : null}
      </div>
      <GlassPane close={close} />
    </div>
  );
}
