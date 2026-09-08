"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";
import { browserCanUseWebGL } from "@/lib/webgl";
import { Scheibe } from "./Scheibe";

/**
 * Die Scheibe, mit Auffanglinie.
 *
 * Muster aus `components/armory/Armory3DViewer.tsx` im Fellowship OS:
 * dynamischer Import ohne SSR, eine echte Fehlergrenze als Klassenkomponente,
 * und eine WebGL-Sondierung *vor* dem Laden. Wer das überspringt, schickt
 * einem Telefon 300 kB Three.js, damit es danach einen leeren Kasten zeigt.
 *
 * Die CSS-Fassung ist hier nicht der Fehlerfall, sondern die Grundstellung.
 * Alles unten drunter ist Zugabe.
 */

const GlasCanvas = dynamic(() => import("./GlasCanvas"), {
  ssr: false,
  loading: () => null,
});

class Auffanglinie extends Component<
  { children: ReactNode; ersatz: ReactNode },
  { gefallen: boolean }
> {
  state = { gefallen: false };

  static getDerivedStateFromError() {
    return { gefallen: true };
  }

  render() {
    return this.state.gefallen ? this.props.ersatz : this.props.children;
  }
}

function abonniereNichts(): () => void {
  return () => {};
}

export function Glas({
  siegel,
  stufe,
  ruhig,
}: {
  siegel: string;
  stufe: 1 | 2 | 3;
  ruhig: boolean;
}) {
  // Serverseitig immer `false`: gerendert wird zuerst die CSS-Scheibe, und
  // das Glas legt sich danach darüber. Nie andersherum.
  const webgl = useSyncExternalStore(abonniereNichts, browserCanUseWebGL, () => false);

  // Ohne WebGL, und ebenso bei `prefers-reduced-motion`: die CSS-Scheibe. Ein
  // Bild, das genau einmal gerendert wird, sieht schlechter aus als eine
  // Fläche, die für Stillstand gebaut ist.
  if (!webgl || ruhig) return <Scheibe siegel={siegel} />;

  return (
    <div
      className="scheibe relative mx-auto aspect-square w-full max-w-[19rem] overflow-hidden sm:aspect-[4/5] sm:max-w-md"
      data-scheibe
      data-glas="webgl"
      aria-hidden="true"
    >
      <Auffanglinie
        ersatz={
          <>
            <div className="gestalt" />
            <div className="spiegel">{siegel}</div>
          </>
        }
      >
<>
          <GlasCanvas stufe={stufe} ruhig={ruhig} />
          {/* Dein Spiegelbild liegt auf der Scheibe, nicht dahinter. Es wird
              mit jeder Stufe schärfer: man kommt her, um ihn anzusehen. */}
          <div className="spiegel">{siegel}</div>
        </>
      </Auffanglinie>
    </div>
  );
}
