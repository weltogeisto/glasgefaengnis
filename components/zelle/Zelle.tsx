"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dossier, Frage } from "@/lib/glas/dossier";
import { LETZTE_FRAGE } from "@/lib/glas/dossier";
import type { Beat } from "@/lib/glas/stimme";
import type { Sitzung } from "@/lib/glas/verhoer";
import { starteSitzung, wendeZugAn } from "@/lib/glas/verhoer";
import { legeAkteAb } from "@/lib/glas/speicher";
import { Antwort } from "./Antwort";
import { Glas } from "./Glas";
import { Klangschalter } from "./Klangschalter";
import { spiele, starteRaumton, stoppeRaumton } from "@/lib/glas/klang";
import { useRuhigeBewegung } from "./bewegung";

/**
 * Die Sitzung.
 *
 * Die Komponente entscheidet nichts. Sie zeigt an, was `lib/glas/verhoer.ts`
 * ausgerechnet hat, und schickt Züge zurück — Hausregel aus dem Fellowship OS:
 * die Oberfläche konsumiert ein abgeleitetes Modell, sie baut die Regeln nicht
 * nach.
 *
 * Das Einzige, was hier wirklich entschieden wird, ist das Tempo. Pausen sind
 * Inhalt, nicht Übergang: die Stille zwischen zwei Sätzen ist die Hälfte der
 * Wirkung. Unter `prefers-reduced-motion` steht der Text sofort vollständig da
 * — kürzer, aber dasselbe Verhör.
 */

/** Lesezeit einer Replik. Die Pausen dazwischen liefert der Kern. */
function dauer(beat: Beat): number {
  switch (beat.art) {
    case "pause":
      return beat.ms;
    case "replik":
      return Math.min(4000, 420 + beat.text.length * 30);
    case "regie":
      return 1500;
    case "echo":
      return 700;
    case "bruchstueck":
      return 2000;
    default:
      return 0;
  }
}

/**
 * Wie weit ein Antippen springt: über die laufende Pause hinweg und eine
 * Replik weiter. Nicht ans Ende — man darf sich vorlehnen, aber nicht spulen.
 */
function naechsterHalt(beats: readonly Beat[], von: number): number {
  let i = von;
  while (i < beats.length && beats[i].art === "pause") i += 1;
  return Math.min(beats.length, i + 1);
}

/** Tippen auf einer Schaltfläche ist Bedienung, nicht Ungeduld. */
function istBedienung(ziel: EventTarget | null): boolean {
  return ziel instanceof Element && ziel.closest("button, a, textarea, input, label, form") !== null;
}

function stufeAus(sitzung: Sitzung): 1 | 2 | 3 {
  if (sitzung.phase === "abschied" || sitzung.phase === "ende") return 3;
  if (sitzung.phase === "forderung" || sitzung.phase === "letzte-frage") return 2;
  return 1;
}

export function Zelle({
  dossier,
  fragen,
  gruppensaat,
}: {
  dossier: Dossier;
  fragen: readonly Frage[];
  gruppensaat: string;
}) {
  const ruhig = useRuhigeBewegung();
  const [sitzung, setSitzung] = useState<Sitzung>(() => starteSitzung(dossier.slug, gruppensaat)!);
  const [getaktet, setGetaktet] = useState(0);
  const endeRef = useRef<HTMLDivElement | null>(null);

  // Ohne Bewegung steht der Text sofort vollständig da — abgeleitet, nicht in
  // einen Effekt geschrieben. Das Verhör ist dann kürzer, aber dasselbe.
  const sichtbar = ruhig ? sitzung.beats.length : getaktet;
  const fertigGespielt = sichtbar >= sitzung.beats.length;

  // Beats laufen einzeln ein. Die Pausen dazwischen liefert der Kern.
  useEffect(() => {
    if (ruhig || getaktet >= sitzung.beats.length) return;
    const zeiger = window.setTimeout(
      () => setGetaktet((bisher) => bisher + 1),
      dauer(sitzung.beats[getaktet]),
    );
    return () => window.clearTimeout(zeiger);
  }, [ruhig, getaktet, sitzung.beats]);

  useEffect(() => {
    void starteRaumton();
    return () => stoppeRaumton();
  }, []);

  useEffect(() => {
    const frisch = sitzung.beats[sichtbar - 1];
    if (!frisch) return;
    if (frisch.art === "regie") void spiele("sprechanlage");
    if (frisch.art === "bruchstueck") void spiele("knoechel");
  }, [sichtbar, sitzung.beats]);

  useEffect(() => {
    if (ruhig || !endeRef.current) return;
    endeRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [sichtbar, ruhig]);

  // Die Akte fällt an, sobald der Abschied läuft — nicht erst beim Hinausgehen.
  useEffect(() => {
    if (sitzung.phase !== "abschied") return;
    legeAkteAb({
      slug: sitzung.slug,
      frage: fragen.find((eintrag) => eintrag.id === sitzung.frageId)?.frage ?? "",
      gegenfrage: dossier.gegenfrage,
      preis: sitzung.preis ?? "",
      letzteAntwort: sitzung.letzteAntwort ?? "",
      riss: sitzung.riss,
      wann: new Date().toISOString(),
    });
  }, [sitzung.phase, sitzung.slug, sitzung.frageId, sitzung.preis, sitzung.letzteAntwort, sitzung.riss, dossier.gegenfrage, fragen]);

  const gezeigt = useMemo(() => sitzung.beats.slice(0, sichtbar), [sitzung.beats, sichtbar]);
  const stufe = stufeAus(sitzung);

  // Die Pausen sind Inhalt und bleiben die Vorgabe. Aber ein Telefon, das eine
  // Zeile drei Sekunden zurückhält, liest sich für manche als kaputt — also
  // darf man nachhelfen. Vorlehnen ja, spulen nein.
  const weiter = () => setGetaktet((bisher) => naechsterHalt(sitzung.beats, bisher));


  return (
    <main
      className="zelle px-5 pb-24 pt-10 sm:px-8"
      data-zelle={dossier.slug}
      data-glas-stufe={stufe}
      onClick={(ereignis) => {
        if (fertigGespielt || istBedienung(ereignis.target)) return;
        weiter();
      }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <header className="nicht-drucken mb-8 flex items-baseline justify-between gap-4">
          <p className="font-display text-[0.68rem] uppercase tracking-[0.34em] text-tinte-leise">
            Das Glasgefängnis
          </p>
          <Klangschalter />
          <h1 className="sr-only">
            Verhör: {dossier.name} — {dossier.figur}
          </h1>
        </header>

        <Glas siegel={dossier.siegel} stufe={stufe} ruhig={ruhig} />

        <div className="mt-10 space-y-5" aria-live="polite" aria-atomic="false">
          {gezeigt.map((beat, index) => (
            <BeatZeile key={`${beat.art}-${index}`} beat={beat} />
          ))}
        </div>

        {!fertigGespielt ? (
          <>
            {/* Für die Tastatur: dieselbe Geste, ohne dass sie den Raum stört. */}
            <button type="button" className="sr-only" data-weiter onClick={weiter}>
              Weiter
            </button>
            {sichtbar <= 2 && !ruhig ? (
              <p className="regie mt-6 text-center" data-hinweis>
                Tippen geht schneller.
              </p>
            ) : null}
          </>
        ) : null}

        <div className="mt-10" data-bedienung>
          {fertigGespielt && sitzung.phase === "wahl" ? (
            <div className="space-y-3" data-fragen>
              {fragen.map((frage) => (
                <button
                  key={frage.id}
                  type="button"
                  className="taste"
                  data-frage={frage.id}
                  onClick={() => {
                    setSitzung((bisher) => wendeZugAn(bisher, { art: "frage", frageId: frage.id }));
                  }}
                >
                  {frage.frage}
                </button>
              ))}
            </div>
          ) : null}

          {fertigGespielt && sitzung.phase === "forderung" ? (
            <Antwort
              frage={dossier.gegenfrage}
              aufSenden={(text) =>
                setSitzung((bisher) => wendeZugAn(bisher, { art: "preis", text }))
              }
            />
          ) : null}

          {fertigGespielt && sitzung.phase === "letzte-frage" ? (
            <Antwort
              frage={LETZTE_FRAGE}
              aufSenden={(text) =>
                setSitzung((bisher) => wendeZugAn(bisher, { art: "letzte-antwort", text }))
              }
            />
          ) : null}

          {fertigGespielt && (sitzung.phase === "abschied" || sitzung.phase === "ende") ? (
            <div className="space-y-4" data-abschied>
              <Link href="/protokoll" className="taste taste--rune block" data-zum-protokoll>
                Zum Protokoll
              </Link>
              <Link href="/" className="regie block text-center underline-offset-4 hover:underline">
                Zurück in den Gang
              </Link>
            </div>
          ) : null}
        </div>

        <div ref={endeRef} />
      </div>
    </main>
  );
}

function BeatZeile({ beat }: { beat: Beat }) {
  if (beat.art === "pause") return null;

  if (beat.art === "regie") {
    return (
      <p className="beat regie" data-beat="regie">
        ({beat.text})
      </p>
    );
  }
  if (beat.art === "replik") {
    return (
      <p className="beat replik" data-beat="replik">
        „{beat.text}“
      </p>
    );
  }
  if (beat.art === "echo") {
    return (
      <p className="beat echo pl-5" data-beat="echo">
        — {beat.text}
      </p>
    );
  }
  if (beat.art === "bruchstueck") {
    return (
      <p className="beat bruchstueck" data-beat="bruchstueck">
        {beat.text}
      </p>
    );
  }
  if (beat.art === "eingabe") {
    return (
      <p className="beat replik" data-beat="eingabe">
        „{beat.frage}“
      </p>
    );
  }
  return null;
}
