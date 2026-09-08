"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SHOTS } from "@/lib/glas/praesenz";
import type { Cue } from "@/lib/glas/ermittlung";
import styles from "./Urteilsglas.module.css";

const noSubscription = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function Presence({ cue, still, eventId }: { cue: Cue; still: boolean; eventId: number }) {
  // Never emit an autoplay video in SSR before the motion preference is known.
  const hydrated = useSyncExternalStore(noSubscription, clientReady, serverReady);
  return <Sequence key={`${cue}-${eventId}`} cue={cue} still={still || !hydrated} />;
}
function Sequence({ cue, still }: { cue: Cue; still: boolean }) {
  const [ended, setEnded] = useState(false);
  const active = ended ? SHOTS[cue].rest : cue;
  return <Shot key={active} cue={active} still={still} onEnd={() => setEnded(true)} />;
}
function Shot({ cue, still, onEnd }: { cue: Cue; still: boolean; onEnd: () => void }) {
  const shot = SHOTS[cue];
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  // One decoder, only the active clip. Hidden tabs pause; no background torrent.
  useEffect(() => {
    const element = video.current;
    if (!element || still) return;
    const visibility = () => {
      if (document.hidden) element.pause();
      else void element.play().catch(() => { /* Poster and controls remain. */ });
    };
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => { document.removeEventListener("visibilitychange", visibility); element.pause(); };
  }, [still]);
  return <div className={styles.presence} data-presence={cue}>
    {!posterFailed && <Image src={shot.poster} alt="" fill unoptimized priority
      className={styles.media} style={{ objectPosition: shot.position }} onError={() => setPosterFailed(true)} />}
    {!still && !failed && <video ref={video} className={`${styles.media} ${playing ? styles.videoVisible : styles.videoWaiting}`}
      src={shot.video} poster={shot.poster} muted playsInline autoPlay loop={shot.loop} preload="metadata"
      style={{ objectPosition: shot.position }} aria-hidden="true"
      onPlaying={() => setPlaying(true)} onError={() => setFailed(true)} onEnded={onEnd} />}
    <div className={styles.shade} />
    <p className={styles.sceneCaption} data-scene-caption>{shot.description}</p>
    {posterFailed && <p className={styles.mediaNotice} role="status">Das Originalbild ist nicht erreichbar. Das Verhör bleibt über Text und Bedienelemente vollständig spielbar.</p>}
    {!still && !playing && !failed && <button className={styles.play} type="button" onClick={() => { void video.current?.play().catch(() => setFailed(true)); }}>Szene abspielen</button>}
    {!shot.loop && !still && <button className={styles.skip} type="button" onClick={onEnd}>Szene überspringen</button>}
    {failed && <p className={styles.mediaNotice}>Video nicht erreichbar · Standbild aktiv</p>}
  </div>;
}
