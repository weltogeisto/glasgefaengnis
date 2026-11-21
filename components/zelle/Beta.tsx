"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { LETZTE_FRAGE, befragbareDossiers } from "@/lib/glas/dossier";
import { risstraeger } from "@/lib/glas/riss";
import { waehleFragen } from "@/lib/glas/stimme";
import type { Sitzungsakte } from "@/lib/glas/protokoll";
import {
  abonniereSpeicher,
  aktenAufDemServer,
  aktenSchnappschuss,
  leereAlles,
  legeAktenAb,
} from "@/lib/glas/speicher";

/**
 * Ein Raum, der nicht im Gebäude steht.
 *
 * Von nirgends verlinkt. Man kommt her, indem man die Adresse tippt — auf dem
 * JGA findet das niemand versehentlich, und es stört den echten Abend nie.
 *
 * Zweck: das Ding lässt sich sonst nicht ehrlich durchspielen. Die Schwelle
 * bleibt offen, sobald einmal gesungen wurde; eine geführte Sitzung ist
 * geführt; und das Protokoll zeigt seinen Sinn erst bei siebzehn Antworten.
 */

/** Erkennbar unecht — eine gefüllte Vorschau darf nie für das Heft gehalten werden. */
function beispielakte(slug: string, name: string): Sitzungsakte {
  const dossier = befragbareDossiers().find((eintrag) => eintrag.slug === slug)!;
  return {
    slug,
    frage: waehleFragen(dossier)[0].frage,
    gegenfrage: dossier.gegenfrage,
    preis: `Beispielantwort für die Vorschau — hier stünde, was ${name} bezahlt hat.`,
    letzteAntwort: `Beispielantwort für die Vorschau — hier stünde ${name}s Antwort auf „${LETZTE_FRAGE}"`,
    riss: risstraeger() === slug,
    wann: null,
  };
}

export function Beta() {
  const akten = useSyncExternalStore(abonniereSpeicher, aktenSchnappschuss, aktenAufDemServer);
  const [spoiler, setSpoiler] = useState(false);
  const dossiers = befragbareDossiers();

  return (
    <main className="zelle px-5 pb-24 pt-14 sm:px-8" data-beta data-glas-stufe="1">
      <div className="mx-auto w-full max-w-2xl">
        <header>
          <p className="font-display text-[0.68rem] uppercase tracking-[0.34em] text-glut">
            Beta · nicht Teil des Abends
          </p>
          <h1 className="font-display mt-3 text-2xl">Der Werkraum</h1>
          <p className="regie mt-3">
            Von nirgends verlinkt. Alles hier greift nur in den Speicher dieses Geräts.
          </p>
        </header>

        <section className="mt-10 space-y-3" data-beta-werkzeuge>
          <p className="zeichnung">
            {akten.length} von {dossiers.length} Sitzungen liegen auf diesem Gerät.
          </p>

          <button
            type="button"
            className="taste taste--rune"
            data-beta-fuellen
            onClick={() => legeAktenAb(dossiers.map((d) => beispielakte(d.slug, d.name)))}
          >
            Protokoll mit Beispielen füllen
          </button>

          <button
            type="button"
            className="taste taste--rune"
            data-beta-zuruecksetzen
            onClick={() => leereAlles()}
          >
            Alles zurücksetzen
          </button>

          <Link href="/protokoll" className="taste" data-beta-protokoll>
            Zum Protokoll
          </Link>
          <Link href="/" className="taste" data-beta-gang>
            Zum Gang
          </Link>
        </section>

        <section className="mt-12" data-beta-tueren>
          <h2 className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-rune">
            Direkt in eine Zelle
          </h2>
          <p className="regie mt-3">Ohne Bannlied. Nur hier.</p>
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {dossiers.map((dossier) => (
              <li key={dossier.slug}>
                <Link
                  href={`/zelle/${dossier.slug}`}
                  className="taste text-center"
                  data-beta-tuer={dossier.slug}
                >
                  <span className="font-display tracking-[0.06em]">{dossier.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" data-beta-riss>
          <h2 className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-rune">
            Der Riss
          </h2>
          {spoiler ? (
            <p className="echo mt-3" data-riss-traeger={risstraeger()}>
              Diesmal bei <strong className="text-rune">{risstraeger()}</strong>.
            </p>
          ) : (
            <button type="button" className="taste mt-3" onClick={() => setSpoiler(true)}>
              Aufdecken — verdirbt genau die eine Überraschung
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
