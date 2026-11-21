"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dossier } from "@/lib/glas/dossier";
import { BANNLIED, pruefeBann } from "@/lib/glas/schwelle";
import {
  abonniereSpeicher,
  aktenAufDemServer,
  aktenSchnappschuss,
  oeffneSchwelle,
  schwelleAufDemServer,
  schwelleSchnappschuss,
} from "@/lib/glas/speicher";
import { useStimmeingabe } from "./useStimmeingabe";

/**
 * Der Gang.
 *
 * Man singt, um die Tür zu einem zu öffnen, der nicht hinausgehen kann. Das
 * Bannlied ist nicht neu erfunden — es steht seit `0019` im Fellowship OS und
 * heißt dort ausdrücklich „seine erzählerische Schwelle", die selbst Moriondo
 * einmal freisingen muss.
 */
export function Gang({ dossiers }: { dossiers: readonly Dossier[] }) {
  const stimme = useStimmeingabe();
  const [getippt, setGetippt] = useState("");

  const offen = useSyncExternalStore(abonniereSpeicher, schwelleSchnappschuss, schwelleAufDemServer);
  const akten = useSyncExternalStore(abonniereSpeicher, aktenSchnappschuss, aktenAufDemServer);
  const erledigt = akten.map((akte) => akte.slug);

  const gesungen = pruefeBann(`${stimme.gehoert} ${getippt}`);

  // Die Tür ist ein externes System: hier wird sie aufgeschlossen, und der
  // Speicher meldet die Änderung von selbst zurück.
  useEffect(() => {
    if (!offen && gesungen.offen) {
      stimme.beenden();
      oeffneSchwelle();
    }
  }, [gesungen.offen, offen, stimme]);

  return (
    <main className="zelle px-5 pb-24 pt-14 sm:px-8" data-gang data-glas-stufe={offen ? "2" : "1"}>
      <div className="mx-auto w-full max-w-2xl">
        <header className="text-center">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.34em] text-tinte-leise">
            Unter den Ostbergen
          </p>
          <h1 className="font-display mt-3 text-3xl sm:text-4xl">Das Glasgefängnis</h1>
          <p className="regie mx-auto mt-4 max-w-md">
            Sein Reich endet mit seinem Fels und seinem Dunkel. Er führt keine Heere und befiehlt
            niemandem. Er kann nur gehört werden.
          </p>
        </header>

        {!offen ? (
          <section className="mt-12" data-schwelle>
            <h2 className="font-display text-center text-[0.7rem] uppercase tracking-[0.28em] text-rune">
              Die Schwelle
            </h2>
            <p className="regie mt-4 text-center">
              Die Tür geht auf einen Bann auf. Auch er selbst musste ihn einmal singen.
            </p>

            <blockquote className="mx-auto mt-8 max-w-xs text-center leading-relaxed text-tinte">
              {BANNLIED.map((zeile) => (
                <span key={zeile} className="block">
                  {zeile}
                </span>
              ))}
            </blockquote>

            <div className="mt-10 space-y-3">
              {stimme.moeglich ? (
                <button
                  type="button"
                  className="taste taste--rune"
                  data-singen
                  aria-pressed={stimme.laeuft}
                  onClick={() => (stimme.laeuft ? stimme.beenden() : stimme.starten())}
                >
                  {stimme.laeuft ? "Es hört zu" : "Singen"}
                </button>
              ) : null}

              <label className="regie block" htmlFor="bann-feld">
                Oder tippe den Bann.
              </label>
              <textarea
                id="bann-feld"
                className="feld"
                rows={3}
                value={getippt}
                onChange={(ereignis) => setGetippt(ereignis.target.value)}
                placeholder="Elbereth, Sternenlicht…"
                spellCheck={false}
              />
              <p className="regie" aria-live="polite">
                {gesungen.treffer.length > 0
                  ? `${gesungen.treffer.length} von vier Bannwörtern.`
                  : "Vier Wörter reichen. Der Rest ist Höflichkeit."}
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-12" data-tueren>
            <h2 className="font-display text-center text-[0.7rem] uppercase tracking-[0.28em] text-rune">
              Der Gang
            </h2>
            <p className="regie mt-4 text-center">
              Siebzehn Türen. Eine Sitzung pro Person, und er weiß bereits, wer als Nächstes kommt.
            </p>

            <ul className="mt-8 space-y-2">
              {dossiers.map((dossier) => {
                const fertig = erledigt.includes(dossier.slug);
                return (
                  <li key={dossier.slug}>
                    <Link
                      href={`/zelle/${dossier.slug}`}
                      className="taste flex items-baseline justify-between gap-4"
                      data-tuer={dossier.slug}
                      data-fertig={fertig ? "true" : "false"}
                    >
                      <span>
                        <span className="font-display tracking-[0.08em]">{dossier.name}</span>
                        <span className="zeichnung ml-2 block sm:inline">{dossier.titel}</span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-rune">
                        {fertig ? "◆" : "·"}
                      </span>
                      {fertig ? <span className="sr-only">bereits verhört</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link href="/protokoll" className="taste taste--rune mt-8 block" data-zum-protokoll>
              Das Protokoll
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
