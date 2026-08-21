"use client";

import { useEffect, useState } from "react";


export function Speech({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!text) {
      setShown("");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const step = text.length > 160 ? 3 : 2;
    const id = window.setInterval(() => {
      i += step;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [text]);

  if (!text) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 z-30 max-h-24 overflow-y-auto bottom-[calc(44dvh+0.6rem)] md:inset-x-auto md:left-8 md:right-[min(28rem,40vw)] md:bottom-10 md:max-h-36">
      <div className="max-w-xl rounded-r-xl border-l-2 border-accent/60 bg-bg/75 px-4 py-3 backdrop-blur-md">
        <p className="mb-1 font-display text-[0.65rem] uppercase tracking-[0.18em] text-accent">
          Moriondo
        </p>
        <p className="whitespace-pre-wrap text-[0.95rem] leading-snug">
          {shown}
          <span className="ml-0.5 inline-block h-[0.95em] w-0.5 translate-y-0.5 bg-accent align-text-bottom [animation:blink_1s_step-end_infinite]" />
        </p>
      </div>
    </div>
  );
}
