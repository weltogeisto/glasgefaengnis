"use client";

import { useSyncExternalStore } from "react";
import { abonniereKlang, klangAn, klangAufDemServer, schalteKlang, starteRaumton, stoppeRaumton } from "@/lib/glas/klang";

/**
 * Der Ton ist aus, bis jemand ihn anschaltet.
 *
 * Wie der `horn-quiet`-Schalter drüben: eine Entscheidung pro Gerät, in
 * `localStorage`, ohne Umgebungsvariable. Ein Verhör, das ungefragt Ton macht,
 * ist auf einem fremden Telefon kein Effekt, sondern ein Übergriff.
 */
export function Klangschalter() {
  const an = useSyncExternalStore(abonniereKlang, klangAn, klangAufDemServer);

  return (
    <button
      type="button"
      className="leiser-schalter"
      data-klang={an ? "an" : "aus"}
      aria-pressed={an}
      onClick={() => {
        // Der AudioContext lässt sich nur aus einer Geste heraus entsperren.
        schalteKlang(!an);
        if (an) stoppeRaumton();
        else void starteRaumton();
      }}
    >
      {an ? "Ton an" : "Ton aus"}
    </button>
  );
}
