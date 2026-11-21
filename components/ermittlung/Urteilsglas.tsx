"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  actNumber, CLAIMS, commandReady, EVIDENCE, MAX_MOVES, METHODS, PROPOSITIONS,
  replay, ROLE_NAMES, ROLES, TOPICS,
  type Actor, type Claim, type Method, type Move, type Topic,
} from "@/lib/glas/ermittlung";
import { append, isMemoryOnly, resetRehearsal, serverSnapshot, snapshot, subscribe } from "@/lib/glas/ermittlung-speicher";
import { useRuhigeBewegung } from "@/components/zelle/bewegung";
import { Presence } from "./Presence";
import styles from "./Urteilsglas.module.css";

type Action = { [T in Move["type"]]: Omit<Extract<Move, { type: T }>, "actor"> }[Move["type"]];
const ACTS = ["Die leeren Ställe", "Die widersprechenden Fäden", "Der Gegenbefehl"];
const ROLE_BRIEF: Record<Actor["role"], string> = {
  netzleser: "Du liest Zugrichtung und Knoten. Ein Faden verrät, was eine Stimme verschweigt.",
  waldkundiger: "Du kennst Harz und Boden. Moriondos Wegbeschreibung muss sich an den Spuren messen lassen.",
  sprachhueter: "Du trennst seine Worte von deinen Schlussfolgerungen. Eine wahre Einzelheit kann eine falsche Richtung nahelegen.",
  chronist: "Du prüfst die Reihenfolge: Regen, Gefangennahme, Entführung. Später zählt die Rücklaufzeit des Echos.",
  gegenzeuge: "Du vergleichst Beobachtungen. Nicht jede echte Spur gehört zu dem Ereignis, das ihr untersucht.",
  schweiger: "Du beobachtest das Glas, während niemand spricht. Gespielter Zorn und echter Kontrollverlust hinterlassen verschiedene Spuren.",
  bindungshueter: "Du lauschst der Bindung zu den lebenden Reittieren. Richtung, Anzahl und Atem können den Hort eingrenzen.",
  netzfuehrer: "Stevens Spinne blieb zurück. Ihre Leitnarbe und die Reaktion der niederen Brut sind dein Anfang, nicht schon die Lösung.",
};

/** Rehearsal-only shell. The shared notebook is local, deliberately not live. */
export function Urteilsglas({ actors }: { actors: readonly Actor[] }) {
  const moves = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const world = useMemo(() => replay(moves, actors), [moves, actors]);
  const [slug, setSlug] = useState(actors[0]?.slug ?? "");
  const [paused, setPaused] = useState(false);
  const reduced = useRuhigeBewegung();
  const [selected, setSelected] = useState<string[]>([]);
  const [topic, setTopic] = useState<Topic>("capture");
  const [claim, setClaim] = useState<Claim>("brood");
  const [answer, setAnswer] = useState<number | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const actor = actors.find(a => a.slug === slug) ?? actors[0];
  const entered = actor && world.entered.includes(actor.slug);
  const own = EVIDENCE.filter(e => (world.known[actor?.slug ?? ""] ?? []).includes(e.id));
  const available = EVIDENCE.filter(e => Object.hasOwn(world.shared, e.id) || own.some(c => c.id === e.id));
  const shared = EVIDENCE.filter(e => Object.hasOwn(world.shared, e.id));
  const latest = world.lines.at(-1);
  const act = actNumber(world);
  const missing = ROLES.filter(r => !actors.some(a => a.role === r));
  const disabled = !entered || world.finished || moves.length >= MAX_MOVES;
  const cue = latest?.cue ?? "idle";

  function send(action: Action) {
    if (!actor || moves.length >= MAX_MOVES) return;
    append({ ...action, actor: actor.slug } as Move);
  }
  function toggle(id: string) {
    setSelected(previous => previous.includes(id) ? previous.filter(item => item !== id)
      : previous.length < 8 ? [...previous, id] : previous);
  }
  function exportLog() {
    const data = JSON.stringify({ mode: "local-rehearsal-not-live", version: 1, moves }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = "moriondo-regieprobe.json";
    document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!actor) return <main className={styles.shell}><h1>Keine Akten verfügbar</h1><Link href="/">Zurück in den Gang</Link></main>;

  return <main className={styles.shell} data-ermittlung data-act={act}>
    <div className={styles.rehearsal} role="note">
      <strong>Regieprobe</strong><span>Nur dieses Gerät. Kein Live-Weltstand. Keine echten Reittiere werden verändert.</span>
    </div>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>Nach dem Fall Dol Guldurs</p><h1>Das Urteilsglas</h1></div>
      <Link href="/" className={styles.back}>Zum ursprünglichen Prototyp</Link>
    </header>
    <nav aria-label="Ermittlungsfortschritt" className={styles.acts}>
      {ACTS.map((name, i) => <div key={name} className={i + 1 === act ? styles.actCurrent : styles.act}
        aria-current={i + 1 === act ? "step" : undefined}><span>0{i + 1}</span>{name}</div>)}
    </nav>
    {missing.length > 0 && <p className={styles.notice} role="alert">Dieser Besetzung fehlen Rollen: {missing.map(r => ROLE_NAMES[r]).join(", ")}. Der gemeinsame Abschluss ist damit nicht vollständig spielbar.</p>}
    {isMemoryOnly() && <p className={styles.notice} role="status">Speichern ist gesperrt. Der Spielstand bleibt nur in dieser geöffneten Sitzung erhalten.</p>}
    {moves.length >= MAX_MOVES && <p className={styles.notice} role="alert">Das Zuglimit dieser Probe ist erreicht. Das Protokoll kann exportiert und die Probe zurückgesetzt werden.</p>}

    <div className={styles.layout}>
      <section className={styles.stage} aria-label="Moriondos Zelle">
        <div className={styles.scene}>
          <Presence cue={cue} still={reduced || paused} eventId={moves.length} />
          <div className={styles.sceneTop}><span>Urteilsglas · {world.finished ? "Rückweg getrennt" : "Bann geschlossen"}</span>
            <button type="button" onClick={() => setPaused(p => !p)} aria-pressed={paused}
              disabled={reduced}>{reduced ? "Ruhige Darstellung" : paused ? "Bewegung zulassen" : "Standbild"}</button>
          </div>
        </div>
        <div className={styles.instruments} aria-label="Die Zelle untersuchen">
          {(Object.entries(METHODS) as [Method, string][]).map(([method, label]) =>
            <button type="button" key={method} data-inspect={method} disabled={disabled}
              onClick={() => send({ type: "inspect", method })}><span aria-hidden="true">{method === "schweigen" ? "···" : method === "faden" ? "⌁" : "◇"}</span>{label}</button>)}
        </div>
        <div className={styles.dialogue} aria-live="polite" aria-atomic="true" data-latest>
          <p className={styles.eyebrow}>{latest?.speaker === "moriondo" ? "Moriondo" : "Beobachtung"}</p>
          <p className={latest?.speaker === "regie" ? styles.direction : styles.line}>
            {latest ? latest.speaker === "moriondo" ? `„${latest.text}“` : latest.text
              : "Die Ställe sind leer. Hinter dem Glas sitzt der Einzige, der mehr weiß. Er hat nicht vor, es euch leicht zu machen."}
          </p>
        </div>
        <details className={styles.transcript}><summary>Verlauf der Regieprobe · {world.lines.length} Einträge</summary>
          <p className={styles.help}>Diese lokale Regieansicht zeigt die bisherigen Begegnungen. Sie ist kein privater Mehrspielerkanal.</p>
          <ol>{world.lines.map((line, i) => <li key={i}><small>{actors.find(a => a.slug === line.actor)?.name} · {line.speaker === "moriondo" ? "Moriondo" : "Befund"}</small><p>{line.text}</p></li>)}</ol>
        </details>
      </section>

      <section className={styles.console} aria-label="Ermittlung">
        <div className={styles.assignment}>
          <label htmlFor="rehearsal-actor" className={styles.eyebrow}>Regie · Perspektive wechseln</label>
          <select id="rehearsal-actor" data-actor value={actor.slug} onChange={event => {
            setSlug(event.target.value); setSelected([]);
          }}>{actors.map(a => <option key={a.slug} value={a.slug}>{a.name} · {ROLE_NAMES[a.role]}</option>)}</select>
          <h2>{ROLE_NAMES[actor.role]}</h2><p>{ROLE_BRIEF[actor.role]}</p>
          <p className={styles.help}>In der Probe spielst du die Rollen nacheinander. Erst „Freigeben“ macht einen Befund für die anderen Perspektiven nutzbar.</p>
          {!world.finished && <button type="button" className={styles.primary} data-enter disabled={moves.length >= MAX_MOVES}
            onClick={() => send({ type: "enter" })}>{entered ? "Wieder vor das Glas treten" : "Vor das Glas treten"}</button>}
        </div>

        {!world.finished && <section className={styles.panel} aria-labelledby="questions-title">
          <p className={styles.eyebrow}>I · Das Verhör</p><h2 id="questions-title">Eine Frage ist noch kein Druckmittel.</h2>
          <div className={styles.questions}>{(Object.entries(TOPICS) as [Topic, string][]).map(([id, label]) =>
            <button key={id} type="button" data-ask={id} disabled={disabled} onClick={() => send({ type: "ask", topic: id })}>{label}</button>)}</div>
        </section>}

        <section className={styles.panel} aria-labelledby="evidence-title">
          <p className={styles.eyebrow}>II · Die Akte</p><h2 id="evidence-title">Spuren, die nicht von ihm stammen.</h2>
          <p className={styles.help}>Eigene Befunde: {own.length} · Freigegeben: {shared.length}. Wähle bis zu acht Belege für eine Konfrontation oder einen Schluss.</p>
          {available.length === 0 && <p className={styles.empty}>Noch kein Befund. Deine Rolle beschreibt, worauf du in der Zelle achten solltest.</p>}
          <div className={styles.evidence}>
            {available.map(clue => <article key={clue.id} className={styles.evidenceCard} data-evidence={clue.id}>
              <label><input type="checkbox" checked={selected.includes(clue.id)} data-select-evidence={clue.id}
                disabled={world.finished || (!selected.includes(clue.id) && selected.length >= 8)} onChange={() => toggle(clue.id)} />
                <strong>{clue.title}</strong></label><p>{clue.text}</p>
              {Object.hasOwn(world.shared, clue.id) ? <small>Freigegeben · {actors.find(a => a.slug === world.shared[clue.id].actor)?.name} · {ROLE_NAMES[world.shared[clue.id].role]}</small>
                : <button type="button" data-share={clue.id} disabled={disabled} onClick={() => send({ type: "share", evidenceId: clue.id })}>Freigeben</button>}
            </article>)}
          </div>
        </section>

        {!world.finished && <section className={styles.panel} aria-labelledby="confront-title">
          <p className={styles.eyebrow}>III · Der Widerspruch</p><h2 id="confront-title">Nicht lauter. Genauer.</h2>
          <label htmlFor="confront-topic">Welche Aussage greifst du an?</label>
          <select id="confront-topic" data-confront-topic value={topic} onChange={e => setTopic(e.target.value as Topic)}>
            <option value="capture">Seine Gefangenschaft als Alibi</option><option value="north">Die Spur nach Norden</option><option value="mercy">Seine angebliche Gnade gegenüber Stevens Spinne</option>
          </select>
          <p className={styles.help}>{selected.length} Belege gewählt. Ein unbelegter Angriff schafft keinen Fortschritt. Sein Zorn allein beweist nichts.</p>
          <button type="button" className={styles.primary} data-confront disabled={disabled || !selected.length}
            onClick={() => { send({ type: "confront", topic, evidence: selected }); setSelected([]); }}>Mit den Belegen konfrontieren</button>
        </section>}

        <section className={styles.panel} aria-labelledby="proof-title">
          <p className={styles.eyebrow}>IV · Der gemeinsame Schluss</p><h2 id="proof-title">Vier Dinge müssen feststehen.</h2>
          <div className={styles.claims}>{CLAIMS.map(c => <span key={c} data-claim={c} data-proven={Object.hasOwn(world.proven, c)}>
            {Object.hasOwn(world.proven, c) ? "◆" : "◇"} {PROPOSITIONS[c].title}</span>)}</div>
          {!world.finished && <form onSubmit={event => { event.preventDefault(); if (answer !== null) { send({ type: "prove", claim, answer, evidence: selected }); setSelected([]); } }}>
            <label htmlFor="proof-claim">Welchen Schluss begründest du?</label>
            <select id="proof-claim" data-proof-claim value={claim} onChange={e => { setClaim(e.target.value as Claim); setAnswer(null); }}>
              {CLAIMS.map(c => <option value={c} key={c}>{PROPOSITIONS[c].title}{world.proven[c] ? " · belegt" : ""}</option>)}</select>
            <fieldset className={styles.options}><legend>{PROPOSITIONS[claim].question}</legend>
              {PROPOSITIONS[claim].options.map((option, index) => <label key={`${claim}-${index}`}><input type="radio" name="proof-answer" value={index}
                data-answer={index} checked={answer === index} onChange={() => setAnswer(index)} />{option}</label>)}
            </fieldset>
            <p className={styles.help}>Nur freigegebene, passende Belege zählen. Zwei verschiedene Rollen und zwei Gefährten müssen den Schluss unabhängig stützen.</p>
            <button type="submit" className={styles.primary} data-prove disabled={disabled || answer === null || selected.length < 2 || !!world.proven[claim]}>Schluss mit Belegen prüfen</button>
          </form>}
        </section>

        <section className={styles.finale} aria-labelledby="command-title">
          <p className={styles.eyebrow}>Das Ende dieser Wache</p><h2 id="command-title">Der Gegenbefehl</h2>
          {world.finished ? <div data-rehearsal-complete><p>Die Beweiskette trägt. Stevens Spinne hat den Rückweg zum Glas getrennt. Die Bergung kann beginnen.</p>
            <p className={styles.help}>Die Regieprobe ist abgeschlossen. Live-Stallungen, XP und Spielstände wurden nicht verändert.</p></div>
            : <><p>{commandReady(world) ? "Der Befehl ist tragfähig. Steven muss ihn durch seine Spinne übertragen."
              : "Eine richtige Vermutung reicht nicht. Erst die bewiesenen vier Schlüsse, der erkundete Rückweg, der lebende Hort und der belegte Schnitt tragen den Befehl."}</p>
            <button type="button" className={styles.primary} data-command disabled={disabled || !commandReady(world) || actor.slug !== "steven"}
              onClick={() => send({ type: "command" })}>Durch Stevens Spinne übertragen</button></>}
        </section>
      </section>
    </div>
    <footer className={styles.footer}>
      <p>Geschriebene Reaktionen. Zustandsabhängige Originalaufnahmen. Kein freier KI-Chat und kein Live-Multiplayer.</p>
      <div><button type="button" onClick={exportLog}>Zugprotokoll exportieren</button><button type="button" onClick={() => setResetOpen(p => !p)}>Probe zurücksetzen</button></div>
      {resetOpen && <div className={styles.notice}><p>Nur diese lokale Regieprobe löschen? Das ursprüngliche Verhörprotokoll bleibt erhalten.</p>
        <button type="button" onClick={() => { resetRehearsal(); setSelected([]); setAnswer(null); setResetOpen(false); }}>Ja, lokale Probe löschen</button>
        <button type="button" onClick={() => setResetOpen(false)}>Behalten</button></div>}
    </footer>
  </main>;
}
