"use client";

import { useState } from "react";
import { MINDESTANTWORT, normalisiereAntwort } from "@/lib/glas/verhoer";
import { useStimmeingabe } from "./useStimmeingabe";

/**
 * Der Preis.
 *
 * Sprechen ist der Normalfall, Tippen der Rückfall — nicht umgekehrt. Wer das
 * Mikrofon ablehnt oder in einem Browser ohne Web Speech sitzt, bekommt
 * kommentarlos ein Textfeld und dasselbe Verhör.
 */
export function Antwort({
  frage,
  aufSenden,
}: {
  frage: string;
  aufSenden: (text: string) => void;
}) {
  const stimme = useStimmeingabe();
  // Getipptes gewinnt, sobald es getippt wurde. Solange niemand tippt, steht
  // im Feld, was gehört wurde — abgeleitet, nicht in einen Effekt kopiert.
  const [entwurf, setEntwurf] = useState<string | null>(null);
  const text = entwurf ?? stimme.gehoert;

  const fertig = [...normalisiereAntwort(text)].length >= MINDESTANTWORT;

  return (
    <form
      className="space-y-3"
      data-antwort
      onSubmit={(ereignis) => {
        ereignis.preventDefault();
        if (!fertig) return;
        stimme.beenden();
        aufSenden(normalisiereAntwort(text));
      }}
    >
      <label className="regie block" htmlFor="antwort-feld">
        {stimme.moeglich
          ? "Sprich es ans Glas. Oder tippe es, wenn dir das lieber ist."
          : "Tippe es."}
      </label>

      <textarea
        id="antwort-feld"
        className="feld"
        value={text}
        onChange={(ereignis) => setEntwurf(ereignis.target.value)}
        placeholder="…"
        rows={3}
        autoComplete="off"
        spellCheck={false}
      />

      <div className="flex flex-wrap gap-3">
        {stimme.moeglich ? (
          <button
            type="button"
            className="taste taste--rune flex-1"
            data-mikrofon
            aria-pressed={stimme.laeuft}
            onClick={() => {
              if (stimme.laeuft) {
                stimme.beenden();
                return;
              }
              // Was schon getippt wurde, bleibt stehen; das Gehörte setzt darauf auf.
              stimme.leeren();
              setEntwurf(null);
              stimme.starten();
            }}
          >
            {stimme.laeuft ? "Er hört zu" : "Sprechen"}
          </button>
        ) : null}
        <button type="submit" className="taste taste--rune flex-1" disabled={!fertig} data-senden>
          Antworten
        </button>
      </div>

      <p className="regie" aria-live="polite">
        {stimme.laeuft ? "Das Mikrofon läuft. Er wartet, so lange es dauert." : " "}
      </p>

      <p className="sr-only">{frage}</p>
    </form>
  );
}
