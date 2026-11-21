"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Sprechen statt tippen.
 *
 * Das Fellowship OS hat das für genau diese Figur schon gebaut:
 * `components/MoriondoRitualGate.tsx` fährt die Web Speech API auf `de-DE`,
 * mit `continuous` und `interimResults`. Wir übernehmen das Muster.
 *
 * Der Grund ist kein technischer. Auf einem JGA tippt niemand einen ehrlichen
 * Satz in ein Telefon. Man sagt ihn — laut, ans Glas, vor allen anderen. Genau
 * das ist der Preis, und genau deshalb zählt er.
 *
 * Getippt geht auch. Das Protokoll sieht hinterher gleich aus.
 */

type Erkennung = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((ereignis: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type ErkennungKonstruktor = new () => Erkennung;

function konstruktor(): ErkennungKonstruktor | null {
  if (typeof window === "undefined") return null;
  const fenster = window as unknown as {
    SpeechRecognition?: ErkennungKonstruktor;
    webkitSpeechRecognition?: ErkennungKonstruktor;
  };
  return fenster.SpeechRecognition ?? fenster.webkitSpeechRecognition ?? null;
}

export type Stimmeingabe = {
  /** Ob dieses Gerät überhaupt zuhören kann. `false` heißt: getippt wird. */
  readonly moeglich: boolean;
  readonly laeuft: boolean;
  readonly gehoert: string;
  starten: () => void;
  beenden: () => void;
  leeren: () => void;
};

/** Ob dieses Gerät zuhören kann, ist eine Eigenschaft der Umgebung, kein
 *  Zustand — also ein externer Speicher, der sich nie ändert. */
function abonniereNichts(): () => void {
  return () => {};
}

export function useStimmeingabe(): Stimmeingabe {
  const unterstuetzt = useSyncExternalStore(
    abonniereNichts,
    () => konstruktor() !== null,
    () => false,
  );
  // Ein abgelehntes Mikrofon ist kein fehlendes Mikrofon. Beides führt zur
  // Tastatur, aber nur eines davon ist eine Entscheidung.
  const [abgelehnt, setAbgelehnt] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [gehoert, setGehoert] = useState("");
  const erkennungRef = useRef<Erkennung | null>(null);

  useEffect(() => {
    return () => {
      try {
        erkennungRef.current?.stop();
      } catch {
        /* Schon aus. */
      }
      erkennungRef.current = null;
    };
  }, []);

  const starten = useCallback(() => {
    const Ctor = konstruktor();
    if (!Ctor || erkennungRef.current) return;
    let erkennung: Erkennung;
    try {
      erkennung = new Ctor();
    } catch {
      setAbgelehnt(true);
      return;
    }
    erkennung.lang = "de-DE";
    erkennung.continuous = true;
    erkennung.interimResults = true;
    erkennung.onresult = (ereignis) => {
      let text = "";
      for (let index = ereignis.resultIndex; index < ereignis.results.length; index += 1) {
        text += ereignis.results[index][0]?.transcript ?? "";
      }
      setGehoert((bisher) => (bisher + " " + text).replace(/\s+/gu, " ").trim());
    };
    // Ein abgelehntes Mikrofon ist kein Fehler, sondern eine Entscheidung.
    // Die Zelle fällt still auf die Tastatur zurück.
    erkennung.onerror = () => {
      setLaeuft(false);
      erkennungRef.current = null;
    };
    erkennung.onend = () => {
      setLaeuft(false);
      erkennungRef.current = null;
    };
    try {
      erkennung.start();
      erkennungRef.current = erkennung;
      setLaeuft(true);
    } catch {
      setLaeuft(false);
      erkennungRef.current = null;
    }
  }, []);

  const beenden = useCallback(() => {
    try {
      erkennungRef.current?.stop();
    } catch {
      /* Egal. */
    }
    erkennungRef.current = null;
    setLaeuft(false);
  }, []);

  const leeren = useCallback(() => setGehoert(""), []);

  return { moeglich: unterstuetzt && !abgelehnt, laeuft, gehoert, starten, beenden, leeren };
}
