"use client";

import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  APPROVED_EXISTING_IDS,
  BATCH_1_IDS,
  BATCH_2_IDS,
  CYCLE_I_SPINE,
  PHASE_2_IDS,
  REVIEW_SECTIONS,
  STORY_BY_ID,
  STORY_CLIPS,
  nextClip,
  prevClip,
  type ReviewSection,
  type StoryClip,
  type StoryCueId,
} from "@/lib/prison/storyPresence";
import { cn } from "@/lib/utils";

type Filter = "approved-existing" | "spine" | "batch-2" | "batch-1" | "phase-2" | ReviewSection | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "approved-existing", label: "Approved existing" },
  { id: "spine", label: "Cycle I Spine" },
  { id: "phase-2", label: "Jan" },
  { id: "batch-2", label: "Batch 2" },
  { id: "batch-1", label: "Batch 1" },
  { id: "all", label: "Alle" },
  { id: "reusable", label: "Kanon" },
  { id: "moriondo-cycle-01", label: "Moriondo" },
  { id: "stall-spider", label: "Wald" },
  { id: "mount-rescue", label: "Reittiere" },
  { id: "jan-mystery", label: "Großes Nest" },
  { id: "cycle-02", label: "Zyklus II" },
];

const STATUS: Record<StoryClip["status"], { label: string; tone: string }> = {
  reusable: { label: "Kanon", tone: "text-muted" },
  approved: { label: "Freigegeben", tone: "text-accent" },
  "batch-1-preview": { label: "Freigabe", tone: "text-accent" },
  "batch-2-production": { label: "Produktion", tone: "text-accent" },
  "owner-approved-existing": { label: "Locked · Owner", tone: "text-accent" },
  "awaiting-production": { label: "Wartet", tone: "text-muted" },
  storyboard: { label: "Konzept", tone: "text-muted" },
};

export function PresenceReview() {
  const [filter, setFilter] = useState<Filter>("approved-existing");
  const [active, setActive] = useState<StoryCueId>("moriondo.capture_rage");
  const [spineMode, setSpineMode] = useState(false);
  const [spineIndex, setSpineIndex] = useState(0);

  const clips = useMemo(() => {
    if (filter === "approved-existing") {
      return STORY_CLIPS.filter((c) => APPROVED_EXISTING_IDS.includes(c.id));
    }
    if (filter === "spine") {
      return CYCLE_I_SPINE.map((id) => STORY_BY_ID[id]).filter(Boolean);
    }
    if (filter === "batch-2") return STORY_CLIPS.filter((c) => BATCH_2_IDS.includes(c.id));
    if (filter === "batch-1") return STORY_CLIPS.filter((c) => BATCH_1_IDS.includes(c.id));
    if (filter === "phase-2") return STORY_CLIPS.filter((c) => PHASE_2_IDS.includes(c.id));
    if (filter === "all") return STORY_CLIPS;
    return STORY_CLIPS.filter((c) => c.section === filter);
  }, [filter]);

  const current = STORY_BY_ID[active] ?? clips[0];

  function playSpine() {
    setFilter("spine");
    setSpineMode(true);
    setSpineIndex(0);
    setActive(CYCLE_I_SPINE[0]);
  }

  function onSpineEnded() {
    if (!spineMode) return;
    const next = spineIndex + 1;
    if (next < CYCLE_I_SPINE.length) {
      setSpineIndex(next);
      setActive(CYCLE_I_SPINE[next]);
    } else {
      setSpineMode(false);
      setSpineIndex(0);
    }
  }

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-[0.62rem] uppercase tracking-[0.18em] text-accent">
              Cowork · Presence
            </p>
            <h1 className="font-display text-xl tracking-wide md:text-2xl">Zyklus I · Review</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={playSpine}
              className="inline-flex min-h-11 items-center rounded-xl bg-accent px-4 font-display text-[0.68rem] uppercase tracking-[0.14em] text-bg"
            >
              Play Cycle I spine
            </button>
            <Link
              to="/glas"
              className="inline-flex min-h-11 items-center font-display text-[0.68rem] uppercase tracking-[0.14em] text-muted"
            >
              Zurück vors Glas
            </Link>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-6xl gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                setSpineMode(false);
                if (f.id === "approved-existing") setActive("moriondo.capture_rage");
                if (f.id === "spine") setActive(CYCLE_I_SPINE[0]);
                if (f.id === "batch-2") setActive("moriondo.capture_rage");
                if (f.id === "batch-1") setActive("moriondo.capture_rage");
                if (f.id === "phase-2") setActive("nest.great_cocoon_teaser");
                if (f.id === "stall-spider") setActive("spider.lower_brood_answers");
                if (f.id === "mount-rescue") setActive("mounts.hidden_nest");
                if (f.id === "jan-mystery") setActive("nest.great_cocoon_teaser");
              }}
              className={cn(
                "min-h-11 shrink-0 rounded-lg px-3 font-display text-[0.68rem] uppercase tracking-[0.12em] text-muted transition-colors duration-150",
                filter === f.id && "bg-accent text-bg",
              )}
            >
              {f.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        {filter === "approved-existing" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Owner-approved und <strong>locked</strong>: Batch 1 plus Phase-1-Connectives. Nicht
            regenerieren. Alle erscheinen in der Cycle-I-Spine.
          </p>
        ) : null}
        {filter === "spine" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Capture → Abduction → Nest → Steven → True Break → Counter. Locked Assets plus Phase-1-Connectives.
            Jan-Teaser sind noch nicht in der Spine. {spineMode ? `Abspielen: ${spineIndex + 1}/${CYCLE_I_SPINE.length}` : "Play-Button starten."}
          </p>
        ) : null}
        {filter === "phase-2" || filter === "jan-mystery" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Phase 2 · Jan-Mysterium zur Freigabe. Ein weiteres Nest, das zu keinem Reittier gehört.
            Älter, größer, ein Gefäß. Kein Gesicht. Nicht das Hidden Nest.
          </p>
        ) : null}
        {filter === "batch-2" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Moriondo-Produktion M01–M05. Capture Rage und True Break sind die längeren Master der
            freigegebenen Stills. Maske, gespielte Wut und Nachbeben sind neu. 720p, 24 fps, ohne Ton.
          </p>
        ) : null}
        {filter === "mount-rescue" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Hidden Nest Rev. 4 ist locked. Abduction und Counter Command sind locked Phase-1-Connectives.
            Release und Return warten auf Produktion.
          </p>
        ) : null}
        {filter === "stall-spider" ? (
          <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Steven-Identität auf dem locked Batch-1-Command. Lower Brood Answers ist locked.
          </p>
        ) : null}

        {current ? (
          <Hero
            clip={current}
            onSelect={setActive}
            spineMode={spineMode}
            onSpineEnded={onSpineEnded}
            spineIndex={spineIndex}
            spineTotal={CYCLE_I_SPINE.length}
          />
        ) : null}

        {filter === "all"
          ? REVIEW_SECTIONS.map((section) => (
              <Section
                key={section.id}
                title={section.title}
                kicker={section.kicker}
                clips={STORY_CLIPS.filter((c) => c.section === section.id)}
                active={active}
                onSelect={setActive}
              />
            ))
          : (
              <Section
                title={
                  filter === "approved-existing"
                    ? "Owner-approved existing · locked"
                    : filter === "spine"
                      ? "Cycle I Spine"
                      : filter === "batch-2"
                        ? "Batch 2 · Moriondo"
                        : filter === "batch-1"
                          ? "Batch 1 · Freigabe"
                          : filter === "phase-2"
                            ? "Phase 2 · Jan-Mysterium"
                            : (FILTERS.find((f) => f.id === filter)?.label ?? "")
                }
                kicker="Cue · Poster · Playback"
                clips={clips}
                active={active}
                onSelect={(id) => {
                  setSpineMode(false);
                  setActive(id);
                }}
              />
            )}
      </main>
    </div>
  );
}

function Hero({
  clip,
  onSelect,
  spineMode,
  onSpineEnded,
  spineIndex,
  spineTotal,
}: {
  clip: StoryClip;
  onSelect: (id: StoryCueId) => void;
  spineMode?: boolean;
  onSpineEnded?: () => void;
  spineIndex?: number;
  spineTotal?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [crop, setCrop] = useState<"desktop" | "mobile" | "4x3">("desktop");
  const prev = prevClip(clip.id);
  const next = nextClip(clip.id);
  const src = crop === "4x3" && clip.altVideo ? clip.altVideo : clip.video;
  const poster = crop === "4x3" && clip.altPoster ? clip.altPoster : clip.poster;
  const objectPos = crop === "mobile" ? clip.mobileObjectPosition : clip.desktopObjectPosition;

  function replay() {
    const v = videoRef.current;
    if (!v || !src) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
  }

  function toggle() {
    const v = videoRef.current;
    if (!v || !src) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <article className="mb-10 overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="relative aspect-video bg-raised">
          {src ? (
            <video
              key={src + (spineMode ? String(spineIndex) : "")}
              ref={videoRef}
              src={src}
              poster={poster}
              muted
              playsInline
              autoPlay
              loop={clip.loop && !spineMode}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: objectPos }}
              onPlay={() => setPlaying(true)}
              onEnded={() => {
                setPlaying(false);
                if (spineMode && onSpineEnded) onSpineEnded();
              }}
            />
          ) : (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: objectPos }}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-bg to-transparent p-3">
            <button
              type="button"
              onClick={toggle}
              disabled={!src}
              className="flex size-11 items-center justify-center rounded-xl bg-accent text-bg"
              aria-label={playing ? "Pause" : "Abspielen"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
            <button
              type="button"
              onClick={replay}
              disabled={!src}
              className="flex size-11 items-center justify-center rounded-xl bg-raised text-fg"
              aria-label="Erneut"
            >
              <RotateCcw className="size-4" />
            </button>
            <span className="ml-auto font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">
              {spineMode ? `${(spineIndex ?? 0) + 1}/${spineTotal}` : `${clip.playback} · ${(clip.durationMs / 1000).toFixed(1)}s`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <p className="font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">
              {STATUS[clip.status].label} · {clip.camera}
              {clip.locked ? " · 🔒 LOCKED" : ""}
            </p>
            <h2 className="mt-1 font-display text-2xl leading-tight">{clip.label}</h2>
            <p className="mt-1 font-mono text-[0.72rem] text-muted">{clip.id}</p>
          </div>
          <p className="text-[0.92rem] leading-relaxed text-muted">{clip.purpose}</p>
          {clip.usedIn ? (
            <p className="rounded-lg bg-raised px-3 py-2 text-[0.82rem] leading-relaxed text-accent">
              <span className="font-display text-[0.58rem] uppercase tracking-[0.14em]">usedIn · </span>
              {clip.usedIn}
            </p>
          ) : null}
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[0.78rem]">
            <div>
              <dt className="text-muted">Datei</dt>
              <dd className="font-mono text-[0.7rem]">{clip.filename}</dd>
            </div>
            <div>
              <dt className="text-muted">Einstieg → Ausgang</dt>
              <dd>
                {clip.entryPose} → {clip.exitPose}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">SHA-256</dt>
              <dd className="break-all font-mono text-[0.65rem] text-muted">
                {clip.sha256 ?? "— (noch kein Master)"}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-1">
            {(["desktop", "mobile", ...(clip.altVideo ? (["4x3"] as const) : [])] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrop(c)}
                className={cn(
                  "min-h-10 rounded-lg px-3 font-display text-[0.62rem] uppercase tracking-[0.12em] text-muted",
                  crop === c && "bg-accent text-bg",
                )}
              >
                {c === "desktop" ? "Desktop 16:9" : c === "mobile" ? "Mobile Crop" : "4:3 Profil"}
              </button>
            ))}
          </div>
          <div className="mt-auto flex gap-2">
            <button
              type="button"
              disabled={!prev || spineMode}
              onClick={() => prev && onSelect(prev.id)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-raised font-display text-[0.68rem] uppercase tracking-[0.12em] text-fg disabled:opacity-40"
            >
              <ChevronLeft className="size-4 shrink-0" />
              Vorher
            </button>
            <button
              type="button"
              disabled={!next || spineMode}
              onClick={() => next && onSelect(next.id)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-raised font-display text-[0.68rem] uppercase tracking-[0.12em] text-fg disabled:opacity-40"
            >
              Weiter
              <ChevronRight className="size-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      <TransitionStrip clip={clip} />
    </article>
  );
}

function TransitionStrip({ clip }: { clip: StoryClip }) {
  const prev = prevClip(clip.id);
  const next = nextClip(clip.id);
  return (
    <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
      <Thumb label="Vorher" clip={prev} />
      <Thumb label="Aktuell" clip={clip} current />
      <Thumb label="Danach" clip={next} />
    </div>
  );
}

function Thumb({
  label,
  clip,
  current,
}: {
  label: string;
  clip: StoryClip | null;
  current?: boolean;
}) {
  return (
    <div className={cn("relative aspect-[16/7] bg-raised", current && "ring-1 ring-inset ring-accent/40")}>
      {clip ? (
        <img
          src={clip.poster}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: clip.desktopObjectPosition }}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted">—</div>
      )}
      <span className="absolute left-2 top-2 font-display text-[0.58rem] uppercase tracking-[0.14em] text-fg">
        {label}
      </span>
    </div>
  );
}

function Section({
  title,
  kicker,
  clips,
  active,
  onSelect,
}: {
  title: string;
  kicker: string;
  clips: StoryClip[];
  active: StoryCueId;
  onSelect: (id: StoryCueId) => void;
}) {
  if (clips.length === 0) return null;
  return (
    <section className="mb-10">
      <p className="font-display text-[0.62rem] uppercase tracking-[0.16em] text-accent">{kicker}</p>
      <h3 className="mb-4 mt-1 font-display text-lg">{title}</h3>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => (
          <li key={clip.id}>
            <button
              type="button"
              onClick={() => onSelect(clip.id)}
              className={cn(
                "w-full overflow-hidden rounded-xl bg-surface text-left shadow-[0_0_0_1px_var(--color-border)] transition-transform duration-150 ease-out active:scale-[0.99]",
                active === clip.id && "shadow-[0_0_0_1px_var(--color-accent)]",
              )}
            >
              <div className="relative aspect-video bg-raised">
                <img
                  src={clip.poster}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: clip.desktopObjectPosition }}
                />
                {clip.video ? (
                  <span className="absolute right-2 top-2 rounded-md bg-bg/80 px-2 py-1 font-display text-[0.58rem] uppercase tracking-[0.12em] text-accent">
                    {clip.playback}
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 rounded-md bg-bg/80 px-2 py-1 font-display text-[0.58rem] uppercase tracking-[0.12em] text-muted">
                    Poster
                  </span>
                )}
                {clip.locked ? (
                  <span className="absolute left-2 top-2 rounded-md bg-bg/80 px-2 py-1 font-display text-[0.58rem] uppercase tracking-[0.12em] text-accent">
                    🔒
                  </span>
                ) : null}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[0.95rem]">{clip.label}</p>
                  {clip.status === "batch-2-production" ||
                  clip.status === "approved" ||
                  clip.status === "batch-1-preview" ||
                  clip.status === "owner-approved-existing" ? (
                    <Check className="size-3.5 text-accent" />
                  ) : null}
                </div>
                <p className="mt-0.5 font-mono text-[0.65rem] text-muted">{clip.id}</p>
                <p className={cn("mt-2 font-display text-[0.62rem] uppercase tracking-[0.12em]", STATUS[clip.status].tone)}>
                  {STATUS[clip.status].label} · {(clip.durationMs / 1000).toFixed(0)}s
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
