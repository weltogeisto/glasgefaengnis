"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { CueId, MediaLibrary } from "@/lib/glas/regie";
import styles from "./regie.module.css";

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
function visible() { return document.visibilityState === "visible"; }
function serverVisible() { return true; }
const REST: Partial<Record<CueId, CueId>> = {
  "moriondo.approach": "moriondo.glass",
  "moriondo.whisper": "moriondo.idle",
  "moriondo.turn": "moriondo.idle",
  "moriondo.delight": "moriondo.idle",
  "moriondo.rage_performed": "moriondo.glass",
};

/** Remounted per accepted beat: stale onEnded callbacks cannot advance a new frame. */
export function Presence({ cue, media, still, onRageEnd }: {
  cue: CueId; media: MediaLibrary; still: boolean; onRageEnd: () => void;
}) {
  const [resting, setResting] = useState(false);
  const id = resting ? (REST[cue] ?? cue) : cue;
  const asset = media[id];
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useSyncExternalStore(subscribeVisibility, visible, serverVisible);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (inView && !still && !failed) void node.play().catch(() => undefined);
    else node.pause();
    return () => node.pause();
  }, [inView, still, failed, id]);

  return (
    <div className={styles.presence} data-presence-cue={id}
      style={{ "--regie-desktop-focal": asset.desktopObjectPosition, "--regie-mobile-focal": asset.mobileObjectPosition } as CSSProperties}>
      <div className={styles.mediaShade} />
      {still || failed ? (
        <div className={styles.poster} role="img"
          aria-label="Moriondo im schwarzen Mantel hinter der kreisrunden Glaswand. Seine Handlung wird im Untertitel beschrieben."
          style={{ backgroundImage: `url("${asset.poster}")`, backgroundSize: "cover", backgroundPosition: "var(--regie-focal)" }} />
      ) : (
        <video key={id} ref={video} className={styles.video} src={asset.video} poster={asset.poster}
          autoPlay muted playsInline loop={asset.loop} preload="metadata" aria-hidden="true"
          style={{ objectFit: "cover", objectPosition: "var(--regie-focal)" }}
          onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          onEnded={() => {
            if (cue === "moriondo.rage_true_break") onRageEnd();
            else setResting(true);
          }} />
      )}
      {!still && (!playing || failed) ? (
        <button type="button" className={styles.play} onClick={() => {
          if (failed) setFailed(false);
          else void video.current?.play().catch(() => undefined);
        }}>{failed ? "Bildmodus · Video erneut versuchen" : "Bewegung starten"}</button>
      ) : null}
    </div>
  );
}
