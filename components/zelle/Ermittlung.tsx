"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RUNEN, MAX_ZUEGE, fallFuer, zielDerErmittlung, type Rune, type BeweisId, type Ermittlungszug } from "@/lib/glas/ermittlung";
import { useErmittlung } from "./useErmittlung";
import { Klangschalter } from "./Klangschalter";
import { spiele } from "@/lib/glas/klang";
import styles from "./Ermittlung.module.css";

/** A reviewable, client-only vertical slice; never an authoritative world-event client. */
export function Ermittlung({ slug, name, portrait }: { slug: string; name: string; portrait: string }) {
  const fall = useMemo(() => fallFuer(slug, name), [slug, name]);
  const { sitzung, sende, neu, fluechtig } = useErmittlung(fall);
  const [frage, setFrage] = useState("");
  const [deutung, setDeutung] = useState("");
  const [auswahl, setAuswahl] = useState<BeweisId[]>([]);
  const [runen, setRunen] = useState<Rune[]>([]);
  const [meldung, setMeldung] = useState("");
  const [bildFehlt, setBildFehlt] = useState(false);
  const [ruecksetzen, setRuecksetzen] = useState(false);
  const abgeschlossen = sitzung.phase === "gesichert";
  const letzte = sitzung.wechsel[sitzung.wechsel.length - 1];
  const regie = [...sitzung.wechsel].reverse().find((w) => w.sprecher === "regie");
  const abschnitte = ["spuren", "schluss", "ordnung", "rueckruf", "gesichert"];
  const schritt = abschnitte.indexOf(sitzung.phase);

  function zug(z: Ermittlungszug): boolean {
    const ok = sende(z);
    if (ok) {
      setMeldung("");
      void spiele(z.art === "untersuchen" && z.id === "takt" ? "knoechel" : "sprechanlage");
    } else {
      setMeldung("Diesen Ansatz hast du in diesem Abschnitt bereits geprüft, oder es fehlen Belege. Dein Fortschritt bleibt erhalten.");
    }
    return ok;
  }
  function untersuche(id: BeweisId) {
    if (!sitzung.entdeckt.includes(id)) zug({ art: "untersuchen", id });
    else setMeldung(fall.beweise.find((b) => b.id === id)!.fund);
  }

  return (
    <main className={styles.raum} data-ermittlung={slug} data-phase={sitzung.phase}>
      <header className={styles.kopf}>
        <Link href="/verhoer">← Vorraum</Link>
        <span>Das Glasgefängnis</span>
        <Klangschalter />
      </header>
      <div className={styles.probe}>SPIELBARE PROBE · nur auf diesem Gerät · keine Live-Belohnungen</div>
      {fluechtig && <p role="alert" className={styles.warnung}>Der Browser erlaubt kein Speichern. Die Probe funktioniert, geht beim Neuladen aber verloren.</p>}
      <div className={styles.raster}>
        <section className={styles.buehne} aria-label="Moriondo hinter der Glasscheibe" data-haltung={sitzung.haltung}>
          <div className={styles.stein} aria-hidden="true" />
          <div className={styles.person} data-haltung={sitzung.haltung}>
            {!bildFehlt && (
              // Existing Moriondo asset, not a generated substitute or an actor likeness.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={portrait} alt="Moriondo, hinter der versiegelten Scheibe" onError={() => setBildFehlt(true)} referrerPolicy="no-referrer" />
            )}
          </div>
          <div className={styles.scheibe} aria-hidden="true" />
          <div className={styles.siegel} aria-hidden="true">ᚱ · ᚢ · ᚾ · ᚨ · ᛋ</div>
          <div className={styles.szenentitel}><span>Verhörkammer</span><h1>Er wartet nicht.<br />Er lässt dich warten.</h1></div>
          {bildFehlt && <p className={styles.bildwarnung}>Das vorhandene Moriondo-Porträt ist hier nicht erreichbar. Die Beweise und das Verhör bleiben vollständig spielbar.</p>}
          <div className={styles.hotspots} aria-label="Beweise an der Scheibe">
            {([['glas', 'Atemspur'], ['takt', 'Klopfen'], ['schrift', 'Inschrift']] as const).map(([id, titel]) => (
              <button key={id} type="button" onClick={() => untersuche(id)} disabled={abgeschlossen} aria-label={`${titel} untersuchen`} data-hotspot={id}>
                <span aria-hidden="true">{sitzung.entdeckt.includes(id) ? '◈' : '◇'}</span>{titel}
              </button>
            ))}
          </div>
          <p className={styles.buehnenregie}>{regie?.text}</p>
        </section>

        <section className={styles.verhoer} aria-label="Dein Verhör">
          <div className={styles.fortschritt} aria-label={`Abschnitt ${Math.min(schritt + 1, 4)} von 4${abgeschlossen ? ', abgeschlossen' : ''}`}>
            {['Beweise', 'Schluss', 'Namen', 'Rückruf'].map((titel, index) => <span key={titel} data-aktiv={schritt === index} data-fertig={schritt > index}>{String(index + 1).padStart(2, '0')} {titel}</span>)}
          </div>
          <div className={styles.replik} aria-live="polite" aria-atomic="true">
            <span>Moriondo</span>
            <p>„{letzte?.sprecher === 'moriondo' ? letzte.text : 'Das Tor blieb zu. Du hast daraus eine Sicherheit gemacht.'}“</p>
          </div>
          <h2 className={styles.auftrag}>{zielDerErmittlung(sitzung)}</h2>

          <details className={styles.akte} open={sitzung.phase === 'spuren'}>
            <summary>Ermittlungsakte <span>{sitzung.entdeckt.length}/5 Belege</span></summary>
            <p>Belege öffnen, miteinander vergleichen und ihm vorhalten. Jede Spur ist auch hier bedienbar, nicht nur im Bild.</p>
            {fall.beweise.map((beweis) => (
              <div key={beweis.id} className={styles.beleg}>
                <button type="button" onClick={() => untersuche(beweis.id)} disabled={abgeschlossen} data-beweis={beweis.id}>
                  {sitzung.entdeckt.includes(beweis.id) ? '◈' : '◇'} {beweis.titel}
                </button>
                {sitzung.entdeckt.includes(beweis.id) && <>
                  <p>{beweis.fund}</p>
                  {sitzung.phase === 'spuren' && <label>
                    <input type="checkbox" checked={auswahl.includes(beweis.id)} disabled={!auswahl.includes(beweis.id) && auswahl.length >= 2}
                      onChange={() => setAuswahl((alt) => alt.includes(beweis.id) ? alt.filter((id) => id !== beweis.id) : [...alt, beweis.id])} /> Als Beleg vorhalten
                  </label>}
                </>}
              </div>
            ))}
          </details>

          {sitzung.phase === 'spuren' && <button className={styles.haupttaste} type="button" disabled={auswahl.length !== 2} onClick={() => { if (zug({ art: 'vorhalten', beweise: auswahl })) setAuswahl([]); }}>Die beiden Belege vorhalten</button>}
          {sitzung.phase === 'schluss' && <form onSubmit={(event) => { event.preventDefault(); if (zug({ art: 'deuten', text: deutung })) setDeutung(''); }}>
            <label htmlFor="deutung">Deine Schlussfolgerung — ein Wort oder kurzer Begriff</label>
            <input id="deutung" maxLength={280} autoComplete="off" value={deutung} onChange={(event) => setDeutung(event.target.value)} />
            <button type="submit" className={styles.haupttaste} disabled={!deutung.trim()}>Die Lücke in seiner Aussage benennen</button>
          </form>}

          {(sitzung.phase === 'ordnung' || sitzung.phase === 'rueckruf') && <div className={styles.runenbrett}>
            {sitzung.phase === 'ordnung' && !['glas', 'takt', 'schrift'].every((id) => sitzung.entdeckt.includes(id as BeweisId)) && <p>Die Folge braucht alle drei Spuren: Atem, Klopfen und Inschrift.</p>}
            <p>{sitzung.phase === 'ordnung' ? 'Deine Rekonstruktion seiner Reihe' : 'Dein Rückruf von außerhalb der Scheibe'}</p>
            <div className={styles.plaetze} aria-live="polite" aria-label="Gewählte Reihenfolge">
              {Array.from({ length: 5 }, (_, index) => <span key={index}>{runen[index] ?? `${index + 1} ·`}</span>)}
            </div>
            <div className={styles.runentasten}>
              {RUNEN.map((rune) => <button key={rune} type="button" disabled={runen.includes(rune)} onClick={() => setRunen((alt) => [...alt, rune])}>{rune}</button>)}
              <button type="button" disabled={!runen.length} onClick={() => setRunen((alt) => alt.slice(0, -1))}>Letzte zurück</button>
            </div>
            <button type="button" className={styles.haupttaste} disabled={runen.length !== 5 || (sitzung.phase === 'ordnung' && !['glas', 'takt', 'schrift'].every((id) => sitzung.entdeckt.includes(id as BeweisId)))}
              onClick={() => { if (zug({ art: sitzung.phase === 'ordnung' ? 'ordnen' : 'rueckruf', runen })) setRunen([]); }}>
              {sitzung.phase === 'ordnung' ? 'Die Reihe ans Glas legen' : 'Den Rückruf versuchen'}
            </button>
          </div>}

          {!abgeschlossen && <>
            <form className={styles.frage} onSubmit={(event) => { event.preventDefault(); if (zug({ art: 'fragen', text: frage })) setFrage(''); }}>
              <label htmlFor="moriondo-frage">Du führst das Verhör.</label>
              <textarea id="moriondo-frage" rows={2} maxLength={280} value={frage} onChange={(event) => setFrage(event.target.value)} placeholder="Was verschweigst du über die Tiere?" aria-describedby="fragen-hinweis" />
              <p id="fragen-hinweis">Geschriebene Reaktionen zu Tor, Tieren, Namen und seiner Macht — kein offener KI-Chat. Keine privaten Geständnisse nötig.</p>
              <button type="submit" disabled={!frage.trim()}>Frage stellen</button>
            </form>
            <div className={styles.taktiken}>
              <button type="button" onClick={() => zug({ art: 'schweigen' })}>Die Stille aushalten</button>
              <button type="button" disabled={sitzung.hilfen >= 3} onClick={() => zug({ art: 'hilfe' })}>Einen Ansatz verlangen · {3 - sitzung.hilfen}</button>
            </div>
          </>}
          {abgeschlossen && <div className={styles.erfolg}>
            <h2>Du hast ihm eine Wahrheit abgenommen.</h2>
            <p>Beweise verbunden. Ruf erkannt. Namen geordnet. Die andere Seite verstanden.</p>
            <p>Diese Probe gibt nur deine Rückrufspur frei. Weltfortschritt, Stall und XP bleiben unverändert.</p>
            <Link href={`/zelle/${slug}`} className={styles.haupttaste}>Zum bisherigen persönlichen Ausklang</Link>
            <p>Optional. Der Ausklang gehört nicht zur Rätsellösung.</p>
          </div>}
          {meldung && <p className={styles.meldung} role="status">{meldung}</p>}
          {sitzung.zuege.length >= MAX_ZUEGE && <p role="alert">Das lokale Protokoll ist voll. Unten kannst du ausschließlich diese Probe neu beginnen.</p>}
          <details className={styles.protokoll}>
            <summary>Dein Verhörprotokoll · {sitzung.zuege.length} Züge</summary>
            {sitzung.wechsel.map((wechsel, index) => <p key={index} data-sprecher={wechsel.sprecher}><strong>{wechsel.sprecher === 'du' ? 'Du' : wechsel.sprecher === 'moriondo' ? 'Moriondo' : 'Im Raum'}:</strong> {wechsel.text}</p>)}
          </details>
          <footer className={styles.fuss}>
            <p>Dein Zugprotokoll wird lokal gespeichert. Er erinnert sich beim Wiederkommen auf diesem Gerät.</p>
            {!ruecksetzen ? <button type="button" onClick={() => setRuecksetzen(true)}>Nur diese Probe zurücksetzen</button> : <div className={styles.taktiken}>
              <button type="button" onClick={() => { neu(); setRuecksetzen(false); setAuswahl([]); setRunen([]); setFrage(''); setDeutung(''); setMeldung('Die Probe beginnt neu.'); }}>Ja, Probe neu beginnen</button>
              <button type="button" onClick={() => setRuecksetzen(false)}>Behalten</button>
            </div>}
          </footer>
        </section>
      </div>
    </main>
  );
}
