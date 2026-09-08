"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CONTROL_CLAIM, EVIDENCE, MAX_REVIEW_MOVES,
  type EvidenceId, type MediaLibrary, type Relation, type ReviewAction,
} from "@/lib/glas/regie";
import { useRuhigeBewegung } from "../zelle/bewegung";
import { Klangschalter } from "../zelle/Klangschalter";
import { starteRaumton, stoppeRaumton, spiele } from "@/lib/glas/klang";
import { dispatch, getServerSnapshot, getSnapshot, resetReview, subscribe } from "./store";
import { Presence } from "./Presence";
import styles from "./regie.module.css";

type Tab = "speak" | "evidence" | "council";
const STATUS = { unknown: "Noch keine prüfbare Aussage", open: "Ungeprüft", disputed: "Bestritten", refuted: "Widerlegt" };

export function Encounter({ media }: { media: MediaLibrary }) {
  const { session: s, persistent } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduced = useRuhigeBewegung();
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState<Tab>("speak");
  const [selection, setSelection] = useState<EvidenceId[]>([]);
  const [relation, setRelation] = useState<Relation>("contradicts");
  const [resetArmed, setResetArmed] = useState(false);
  const blocked = s.phase === "rage" || s.commands.length >= MAX_REVIEW_MOVES;
  const send = (action: ReviewAction) => dispatch({
    id: `review-${s.revision}-${action.kind}`, expectedRevision: s.revision, action,
  });
  useEffect(() => {
    if (s.phase === "threshold") return;
    void starteRaumton();
    return () => stoppeRaumton();
  }, [s.phase]);

  return (
    <main className={styles.room} data-regie data-phase={s.phase}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>Das Glasgefängnis</Link>
        <div className={styles.headerActions}>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
            {paused || reduced ? "Standbild" : "Bewegung"}
          </button>
          <Klangschalter />
        </div>
      </header>
      <div className={styles.notice}>REGIEPROBE · fiktive Belege · nur auf diesem Gerät · kein Live-Ereignis</div>
      {!persistent ? <p className={styles.storageWarning} role="status">Speichern ist hier gesperrt. Die Probe bleibt nur bis zum Neuladen erhalten.</p> : null}
      <div className={styles.layout}>
        <section className={styles.stage} aria-label="Vor Moriondos Glaszelle">
          <Presence key={`${s.revision}-${s.cue}`} cue={s.cue} media={media} still={paused || reduced}
            onRageEnd={() => send({ kind: "after-rage" })} />
          <div className={styles.stageTop}>
            <span>Dol Guldur · nach der Gefangennahme</span>
            <span className={styles.seal}>Bann geschlossen</span>
          </div>
          <div className={styles.caption} aria-live="polite" aria-atomic="true">
            <p className={styles.eyebrow}>{s.phase === "threshold" ? "Die leeren Ställe" : s.phase === "aftermath" ? "Die Maske bleibt beschädigt" : "Moriondo"}</p>
            <p className={styles.line}>{s.phase === "threshold" ? s.line : `„${s.line}“`}</p>
            <p className={styles.direction}>{s.direction}</p>
          </div>
        </section>

        <section className={styles.console} aria-label="Verhör führen">
          {s.phase === "threshold" ? (
            <div className={styles.entry}>
              <p className={styles.eyebrow}>Eine Wand zwischen euch. Kein Schutz vor seinen Worten.</p>
              <h1>Er ist gefangen.<br /><em>Nicht harmlos.</em></h1>
              <p>Fragen reichen nicht. Beobachte, halte seine Aussagen fest und zeige ihm, was sie widerlegt.</p>
              <button type="button" className={styles.primary} data-enter onClick={() => send({ kind: "enter" })}>Vor das Glas treten <span aria-hidden="true">↗</span></button>
              <p className={styles.small}>Diese Probe zeigt Haltung, Belege und Reaktionen. Keine echten Spielerhinweise, keine Mikrofonaufnahme, keine freie KI-Auswertung.</p>
            </div>
          ) : (
            <>
              <div className={styles.objective}>
                <p className={styles.eyebrow}>{s.claim === "refuted" ? "Ein wirklicher Fehler in seinem Plan" : "Dein Ziel"}</p>
                <h1>{s.claim === "refuted" ? "Sein Anspruch ist widerlegt." : "Beweise, dass sein Befehl gebrochen wurde."}</h1>
                <p>{s.claim === "refuted" ? "Ein Gegenbeweis, noch keine Rettung. Der Rat muss den nächsten Schritt gemeinsam belegen." : "Nicht seine Stimmung gewinnen. Seine Behauptung prüfen."}</p>
              </div>
              {s.phase === "rage" ? (
                <div className={styles.rupture} role="status">
                  <p>Er hat keinen Einwand mehr.</p>
                  <p>Der Ausbruch folgt dem Gegenbeweis. Nicht deinem Tonfall.</p>
                  <button type="button" className={styles.primary} data-after-rage onClick={() => send({ kind: "after-rage" })}>
                    {reduced || paused ? "Nach dem Ausbruch" : "Ausbruch überspringen"}
                  </button>
                </div>
              ) : null}
              <div className={styles.tabs} role="group" aria-label="Arbeitsbereich">
                {([
                  ["speak", "Am Glas"], ["evidence", `Belege · ${s.known.length}`], ["council", `Rat · ${s.released.length}`],
                ] as const).map(([key, label]) => (
                  <button type="button" key={key} aria-pressed={tab === key} data-tab={key} onClick={() => setTab(key)}>{label}</button>
                ))}
              </div>
              <div className={styles.panel}>
                {tab === "speak" ? (
                  <div className={styles.actions}>
                    <p className={styles.small}>Fragen und Haltungen, keine versteckte Auswahl einer „richtigen“ Formulierung.</p>
                    <button type="button" disabled={blocked} data-ask="mounts" onClick={() => send({ kind: "ask", topic: "mounts" })}>Wo sind unsere Tiere?<span>Den Handel eröffnen</span></button>
                    <button type="button" disabled={blocked} data-ask="command" onClick={() => send({ kind: "ask", topic: "command" })}>Hat eine Spinne dir widerstanden?<span>Eine prüfbare Behauptung verlangen</span></button>
                    <button type="button" disabled={blocked} onClick={() => send({ kind: "ask", topic: "capture" })}>War deine Gefangennahme geplant?<span>Die Niederlage benennen</span></button>
                    {s.bargain === "offered" ? <div className={styles.bargain}>
                      <p>Anhören ist kein Versprechen.</p>
                      <button type="button" disabled={blocked} onClick={() => send({ kind: "bargain", accept: true })}>Angebot unter Siegel anhören</button>
                      <button type="button" disabled={blocked} onClick={() => send({ kind: "bargain", accept: false })}>Ohne Handel weiterermitteln</button>
                    </div> : null}
                    <div className={styles.pair}>
                      <button type="button" disabled={blocked} data-pressure onClick={() => send({ kind: "pressure" })}>Druck ausüben</button>
                      <button type="button" disabled={blocked} onClick={() => send({ kind: "silence" })}>Schweigen</button>
                    </div>
                    <button type="button" disabled={blocked} data-touch-glass onClick={() => {
                      void spiele("knoechel"); send({ kind: "observe", target: "glass" });
                    }}>Die Scheibe berühren<span>Seine Hand folgt deiner</span></button>
                  </div>
                ) : null}
                {tab === "evidence" ? (
                  <div className={styles.evidence}>
                    <div className={styles.pair}>
                      <button type="button" disabled={blocked || s.known.includes("strand")} data-observe="strand" onClick={() => send({ kind: "observe", target: "strand" })}>Fadenprobe untersuchen</button>
                      <button type="button" disabled={blocked || s.known.includes("witness")} data-observe="witness" onClick={() => send({ kind: "observe", target: "witness" })}>Zweite Quelle simulieren</button>
                    </div>
                    <p className={styles.small}>Im echten Ereignis liegt die zweite Quelle bei einem anderen Gefährten. Hier ist sie ausdrücklich simuliert.</p>
                    <fieldset className={styles.cards} disabled={blocked}>
                      <legend>Zwei Belege für deinen Gegenbeweis auswählen</legend>
                      {s.known.map((id) => (
                        <label key={id} className={styles.card} data-evidence={id}>
                          <input type="checkbox" checked={selection.includes(id)} onChange={() => setSelection((previous) =>
                            previous.includes(id) ? previous.filter((v) => v !== id) : [...previous, id])} />
                          <span><strong>{EVIDENCE[id].title}</strong><small>{EVIDENCE[id].source}</small><span>{EVIDENCE[id].text}</span></span>
                        </label>
                      ))}
                    </fieldset>
                    {s.claim !== "unknown" ? <div className={styles.claim} data-claim={s.claim}>
                      <p className={styles.eyebrow}>Seine Aussage · {STATUS[s.claim]}</p><blockquote>„{CONTROL_CLAIM}“</blockquote>
                      {s.claim === "open" ? <button type="button" disabled={blocked} data-dispute onClick={() => send({ kind: "dispute" })}>Diese Aussage bestreiten</button> : null}
                      {s.claim === "disputed" ? <>
                        <label className={styles.relation}>Die ausgewählten Belege
                          <select value={relation} onChange={(e) => setRelation(e.target.value as Relation)}>
                            <option value="contradicts">widersprechen seiner Aussage</option><option value="supports">stützen seine Aussage</option>
                          </select>
                        </label>
                        <button type="button" className={styles.primary} disabled={blocked || selection.length !== 2} data-confront onClick={() =>
                          send({ kind: "confront", evidence: selection, relation })}>Mit diesen Belegen konfrontieren</button>
                        <p className={styles.small}>Vorlegen gibt private Belege nicht automatisch an den Rat frei.</p>
                      </> : null}
                    </div> : <p className={styles.empty}>Befrage ihn zuerst zu seinem Befehl. Ohne Aussage gibt es nichts zu widerlegen.</p>}
                  </div>
                ) : null}
                {tab === "council" ? (
                  <div className={styles.council}>
                    <p className={styles.eyebrow}>Lokale Ratssimulation · keine anderen Spieler verbunden</p>
                    <h2>Teilen ist nicht Glauben.</h2>
                    <p>Freigeben macht eine Beobachtung sichtbar. Es erklärt weder seine Behauptung noch deine Deutung für wahr.</p>
                    {s.known.length === 0 ? <p className={styles.empty}>Noch keine Beobachtungen. Untersuche die Fadenprobe am Belegtisch.</p> : null}
                    {s.known.map((id) => <article key={id} className={styles.councilCard} data-council-evidence={id}>
                      <strong>{EVIDENCE[id].title}</strong><small>{s.released.includes(id) ? "Freigegeben · nicht automatisch bestätigt" : "Unter deinem Siegel"}</small>
                      <button type="button" disabled={blocked} onClick={() => send({ kind: s.released.includes(id) ? "seal" : "release", evidence: id })}>
                        {s.released.includes(id) ? "In der Probe wieder versiegeln" : "In der Probe freigeben"}
                      </button>
                    </article>)}
                    {s.claim === "refuted" ? <div className={styles.next}>
                      <p className={styles.eyebrow}>Für das eigentliche Weltereignis</p>
                      <p>Brut · Pfad · Hort · Schnitt</p>
                      <small>Diese vier Lösungen und die privaten Abhängigkeiten bleiben auf dem JGA-Server. Diese Probe verrät oder löst sie nicht.</small>
                    </div> : null}
                  </div>
                ) : null}
                {s.commands.length >= MAX_REVIEW_MOVES ? <p role="status">Die Regieprobe ist voll. Du kannst sie unten neu beginnen.</p> : null}
                <details className={styles.transcript}>
                  <summary>Gespräch nachlesen · {s.transcript.length / 2} Wechsel</summary>
                  {s.transcript.map((line, i) => <p key={i}><b>{line.speaker}</b> {line.text}</p>)}
                  <small>Die letzten 40 Wechsel dieser lokalen Probe.</small>
                </details>
              </div>
            </>
          )}
          <footer className={styles.footer}>
            <Link href="/beta">Werkraum</Link>
            {resetArmed ? <div className={styles.pair}>
              <button type="button" data-confirm-reset onClick={() => {
                resetReview(); setResetArmed(false); setSelection([]); setTab("speak");
              }}>Ja, Probe neu beginnen</button>
              <button type="button" onClick={() => setResetArmed(false)}>Abbrechen</button>
            </div> : <button type="button" data-reset onClick={() => setResetArmed(true)}>Probe zurücksetzen</button>}
          </footer>
        </section>
      </div>
    </main>
  );
}
