"use client";

import { useEffect, useRef, useState } from "react";
import { PRESENCE, type Mood } from "@/lib/prison/presence";
import { GlassPane } from "./GlassPane";
import { cn } from "@/lib/utils";


export function Stage({ mood, kenBurns }: { mood: Mood; kenBurns?: "breathe" | "dolly" }) {
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
    <div className="absolute inset-0 overflow-hidden bg-bg" aria-hidden>
      <img
        src={clip.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%] md:object-[48%_42%]"
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
            "absolute inset-0 h-full w-full object-cover object-[50%_18%] md:object-[48%_42%] transition-opacity duration-700",
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
            "absolute inset-0 h-full w-full object-cover object-[50%_18%] md:object-[48%_42%] transition-opacity duration-700",
            front === 1 ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <GlassPane />
    </div>
  );
}
