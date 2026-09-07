"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { baueProtokoll } from "@/lib/glas/protokoll";
import type { Protokoll } from "@/lib/glas/protokoll";
import { abonniereSpeicher, aktenAufDemServer, aktenSchnappschuss } from "@/lib/glas/speicher";

/**
 * Das Verhörprotokoll.
 *
 * Sie sind gekommen, um einem Ungeheuer die Wahrheit abzunehmen. Was sie
 * dagelassen haben, ist ein Bild von Jan — geschrieben von siebzehn Freunden,
 * von denen keiner gemerkt hat, dass er gerade schreibt.
 *
 * Was jemand auf *seine* Gegenfrage geantwortet hat, steht nicht im Heft. Das
 * war der Preis, und der gehört ihm. Gedruckt wird nur, was über Jan gesagt
 * wurde, und das Lagebild.
 */
export function Protokollbogen() {
  const akten = useSyncExternalStore(abonniereSpeicher, aktenSchnappschuss, aktenAufDemServer);
  const protokoll: Protokoll = useMemo(() => baueProtokoll(akten), [akten]);

  const { eintraege, anzahl, erwartet, lage, fuerJan, letzteFrage } = protokoll;

  return (
    <main className="zelle px-5 pb-24 pt-14 sm:px-8" data-protokoll data-glas-stufe="3">
      <div className="druckbogen mx-auto w-full max-w-2xl">
        <header className="druck-zusammen text-center">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.34em] text-tinte-leise">
            Das Glasgefängnis
          </p>
          <h1 className="font-display mt-3 text-3xl sm:text-4xl">Verhörprotokoll</h1>
          <p className="regie mt-4">
            {anzahl} von {erwartet} Sitzungen geführt.
          </p>
        </header>

        {anzahl === 0 ? (
          <p className="regie mt-16 text-center" data-leer>
            Noch war niemand am Glas.
          </p>
        ) : null}

        {/* ── Was er herausgegeben hat ─────────────────────────────────── */}
        {anzahl > 0 ? (
          <section className="mt-16" data-lagebild>
            <h2 className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-rune">
              Die Bruchstücke
            </h2>
            <ul className="mt-6 space-y-5">
              {lage.bruchstuecke.map((stueck) => (
                <li key={stueck.slug} className="druck-zusammen">
                  <p className="bruchstueck">{stueck.text}</p>
                  <p className="zeichnung mt-2 pl-4">abgenommen von {stueck.name}</p>
                </li>
              ))}
            </ul>

            {lage.vollstaendig ? (
              <div className="mt-10 druck-zusammen" data-schluss>
                <h3 className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-rune">
                  Was sich daraus lesen lässt
                </h3>
                <ul className="mt-4 space-y-2">
                  {lage.schluss.map((zeile) => (
                    <li key={zeile} className="echo">
                      {zeile}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="regie mt-8" data-noch-nicht>
                Einzeln ergibt keines davon ein Bild. Noch {lage.benoetigt - lage.anzahl} Sitzungen.
              </p>
            )}
          </section>
        ) : null}

        {/* ── Der Preis. Bleibt auf diesem Gerät und nicht im Heft. ─────── */}
        {anzahl > 0 ? (
          <section className="nicht-drucken mt-16" data-preise>
            <h2 className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-rune">
              Was bezahlt wurde
            </h2>
            <p className="regie mt-3">
              Das hat er bekommen, und es wird nicht gedruckt. Es gehört dem, der es gesagt hat.
            </p>
            <ul className="mt-6 space-y-6">
              {eintraege.map((eintrag) => (
                <li key={eintrag.slug}>
                  <p className="font-display text-sm tracking-[0.08em] text-tinte">
                    {eintrag.name}
                    {eintrag.riss ? <span className="ml-2 text-rune">◆</span> : null}
                  </p>
                  <p className="regie mt-1">„{eintrag.gegenfrage}“</p>
                  <p className="echo mt-1">— {eintrag.preis}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ── Das eigentliche Dokument ─────────────────────────────────── */}
        {fuerJan.length > 0 ? (
          <section className="druck-umbruch mt-20" data-fuer-jan>
            <h2 className="font-display text-center text-2xl">Für Jan</h2>
            <p className="regie mt-4 text-center">
              Er hat am Ende jeder Sitzung dieselbe Frage gestellt. Sie hat nichts gekostet.
            </p>
            <p className="replik mt-8 text-center">„{letzteFrage}“</p>

            <ul className="mt-12 space-y-8">
              {fuerJan.map((antwort) => (
                <li key={antwort.name} className="druck-zusammen">
                  <p className="echo">{antwort.antwort}</p>
                  <p className="zeichnung mt-1">— {antwort.name}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="nicht-drucken mt-20 space-y-3">
          <button type="button" className="taste taste--rune" onClick={() => window.print()}>
            Als Heft drucken
          </button>
          <Link href="/" className="regie block text-center underline-offset-4 hover:underline">
            Zurück in den Gang
          </Link>
        </div>
      </div>
    </main>
  );
}
