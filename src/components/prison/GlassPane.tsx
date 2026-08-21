export function GlassPane({ close }: { close?: boolean }) {
  const motes = [
    { left: "12%", delay: "0s", dur: "18s" },
    { left: "28%", delay: "3s", dur: "22s" },
    { left: "41%", delay: "7s", dur: "16s" },
    { left: "55%", delay: "1s", dur: "24s" },
    { left: "67%", delay: "5s", dur: "19s" },
    { left: "81%", delay: "9s", dur: "21s" },
    { left: "18%", delay: "11s", dur: "17s" },
    { left: "73%", delay: "4s", dur: "20s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: close
            ? "linear-gradient(to top, rgb(5 7 10 / 0.35) 0%, transparent 18%, rgb(5 7 10 / 0.2) 100%)"
            : "linear-gradient(to top, rgb(5 7 10 / 0.92) 0%, transparent 38%, rgb(5 7 10 / 0.28) 100%)",
        }}
      />
      <div
        className={close ? "absolute inset-0 hidden" : "absolute inset-0 hidden md:block"}
        style={{
          background: "linear-gradient(to right, transparent 42%, rgb(5 7 10 / 0.72) 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
        <defs>
          <filter id="scratch">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
          </filter>
        </defs>
        <g stroke="rgba(210,235,225,0.35)" strokeWidth="0.6" fill="none" filter="url(#scratch)">
          <path d="M12 18 L18 80" />
          <path d="M70 8 L73 42" />
          <path d="M140 30 L146 110" />
          <path d="M220 4 L226 55" />
          <path d="M8 140 L90 148" />
        </g>
      </svg>
      <div className="specular" />
      <div className="film-grain" />
      {motes.map((m, i) => (
        <span
          key={i}
          className="dust-mote"
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.dur }}
        />
      ))}
    </div>
  );
}
