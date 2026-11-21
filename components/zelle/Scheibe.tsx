"use client";

/**
 * Die Scheibe, in reinem CSS.
 *
 * Das ist kein Notbehelf und kein Platzhalter. Ohne WebGL, bei
 * `prefers-reduced-motion` oder auf einem müden Telefon ist *das* die Zelle,
 * und sie muss für sich stehen. Die WebGL-Fassung legt sich später darüber;
 * sie ist Zugabe, nie Voraussetzung.
 *
 * Drei Schichten: er dahinter, die Scheibe selbst, dein Spiegelbild darauf.
 * Das Spiegelbild wird mit jeder Stufe schärfer statt schwächer — man kommt
 * her, um ihn anzusehen, und sieht am Ende sich.
 */
export function Scheibe({ siegel }: { siegel: string }) {
  return (
    <div
      className="scheibe relative mx-auto aspect-square w-full max-w-[19rem] sm:aspect-[4/5] sm:max-w-md"
      data-scheibe
      aria-hidden="true"
    >
      <div className="gestalt" />
      <div className="spiegel">{siegel}</div>
    </div>
  );
}
