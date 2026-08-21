"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { CODEX, RIDDLE } from "@/lib/prison/script";
import { usePrison, type Panel } from "@/lib/prison/store";
import { cn } from "@/lib/utils";


const TABS: { id: Panel; label: string }[] = [
  { id: "verhoer", label: "Verhör" },
  { id: "codex", label: "Codex" },
  { id: "akte", label: "Akte" },
];

export function Dock() {
  const panel = usePrison((s) => s.panel);
  const setPanel = usePrison((s) => s.setPanel);
  const wide = panel !== "verhoer";

  return (
    <aside
      className={cn(
        "fixed inset-x-0 bottom-0 z-[35] flex flex-col rounded-t-2xl bg-bg/80 shadow-[0_0_0_1px_var(--color-border)] backdrop-blur-xl",
        "h-[44dvh] max-h-[44dvh] pb-[env(safe-area-inset-bottom)]",
        wide && "h-[70dvh] max-h-[70dvh]",
        "md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:max-h-none md:w-[min(26rem,38vw)] md:rounded-l-2xl md:rounded-tr-none",
      )}
    >
      <div className="flex shrink-0 gap-1 px-3 pt-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPanel(tab.id)}
            className={cn(
              "min-h-11 flex-1 rounded-lg bg-raised/80 font-display text-[0.68rem] uppercase tracking-[0.12em] text-muted transition-transform duration-150 ease-out active:scale-[0.96]",
              panel === tab.id && "bg-accent text-bg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Rites />
      {panel === "verhoer" ? <Verhoer /> : panel === "codex" ? <Codex /> : <Akte />}
    </aside>
  );
}

function Rites() {
  const riddle = usePrison((s) => s.riddle);
  const letters = usePrison((s) => s.letters);
  const items = [
    { id: "riddle", n: "1", label: "Rätsel", done: riddle },
    { id: "letters", n: "2", label: "Lettern", done: letters },
    { id: "cipher", n: "3", label: "Chiffre", done: false },
    { id: "stall", n: "4", label: "Stall", done: false },
  ];
  return (
    <ol className="grid shrink-0 grid-cols-4 gap-1 px-3 pt-2">
      {items.map((it) => (
        <li
          key={it.id}
          className={cn(
            "rounded-md bg-raised px-1 py-1.5 text-center text-[0.65rem] text-muted",
            it.done && "bg-accent/20 text-accent",
          )}
        >
          <span className="block font-display tracking-wide">{it.n}</span>
          {it.label}
        </li>
      ))}
    </ol>
  );
}

function Verhoer() {
  const chips = usePrison((s) => s.chips);
  const objective = usePrison((s) => s.objective);
  const questions = usePrison((s) => s.questions);
  const maxQ = usePrison((s) => s.maxQ);
  const busy = usePrison((s) => s.busy);
  const send = usePrison((s) => s.send);
  const [draft, setDraft] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
    setDraft("");
  }

  return (
    <>
      <p className="shrink-0 px-4 pt-2 text-[0.82rem] leading-snug text-muted">{objective}</p>
      <div className="flex shrink-0 flex-wrap gap-2 px-4 py-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            disabled={busy || questions >= maxQ}
            onClick={() => send(c)}
            className="min-h-11 rounded-full bg-accent/15 px-3.5 py-2 text-[0.78rem] text-fg shadow-[0_0_0_1px_var(--color-border)] transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <div className="rounded-xl bg-raised/80 px-3 py-2">
          <p className="mb-1 font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">
            Sein Rätsel
          </p>
          <p className="text-[0.82rem] leading-snug">{RIDDLE}</p>
        </div>
        <div className="mt-2 flex gap-1 pb-1">
          {Array.from({ length: maxQ }, (_, i) => (
            <span
              key={i}
              className={cn("h-1 flex-1 rounded-full bg-raised", i < questions && "bg-accent")}
            />
          ))}
        </div>
      </div>
      <form className="flex shrink-0 gap-2 px-3 pb-3 pt-1" onSubmit={onSubmit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={400}
          placeholder="Oder selbst antworten…"
          autoComplete="off"
          className="min-h-11 flex-1 rounded-xl bg-surface px-3 text-base text-fg outline-none shadow-[0_0_0_1px_var(--color-border)] placeholder:text-muted"
        />
        <button
          type="submit"
          aria-label="Senden"
          className="flex size-11 items-center justify-center rounded-xl bg-accent text-bg transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          <Send className="size-4" strokeWidth={2} />
        </button>
      </form>
    </>
  );
}

function Codex() {
  const send = usePrison((s) => s.send);
  const setPanel = usePrison((s) => s.setPanel);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      {CODEX.map((s) => (
        <section key={s.title} className="mb-5">
          <p className="font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">
            {s.kicker}
          </p>
          <h3 className="mt-1 font-display text-[0.95rem]">{s.title}</h3>
          {s.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="mt-2 text-[0.88rem] leading-relaxed">
              {p}
            </p>
          ))}
          {s.green ? (
            <div className="mt-3 rounded-xl bg-accent/12 px-3 py-2.5">
              <p className="mb-1 font-display text-[0.62rem] uppercase tracking-[0.14em] text-accent">
                Grüne Lettern
              </p>
              <p className="font-display text-accent">{s.green}</p>
              <button
                type="button"
                className="mt-2 min-h-10 rounded-lg bg-accent px-3 font-display text-[0.68rem] uppercase tracking-[0.1em] text-bg transition-transform duration-150 ease-out active:scale-[0.96]"
                onClick={() => {
                  setPanel("verhoer");
                  send(s.citeKey === "wege" ? "Drei glühende Wege" : "Bruchstelle");
                }}
              >
                Zum Glas sagen
              </button>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function Akte() {
  const riddle = usePrison((s) => s.riddle);
  const letters = usePrison((s) => s.letters);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      <p className="font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">Akte</p>
      <h2 className="mt-1 font-display text-xl">Akte des Verhörs</h2>
      <p className="mt-2 text-[0.88rem] leading-relaxed">
        Vier Türen. Die ersten zwei gehen heute. Die letzten brauchen Zeit.
      </p>
      <p className="mt-4">
        <strong className={riddle ? "text-accent" : ""}>{riddle ? "Geöffnet" : "Offen"} · Rätsel</strong>
        <br />
        <span className="text-muted">Wähle die Antwort unter den Karten.</span>
      </p>
      <p className="mt-2">
        <strong className={letters ? "text-accent" : ""}>
          {letters ? "Geöffnet" : riddle ? "Offen" : "Verriegelt"} · Lettern
        </strong>
        <br />
        <span className="text-muted">Codex, grüne Zeile.</span>
      </p>
      <blockquote className="mt-4 border-l-2 border-accent/50 pl-3 text-[0.88rem] italic leading-relaxed">
        {RIDDLE}
      </blockquote>
    </div>
  );
}
