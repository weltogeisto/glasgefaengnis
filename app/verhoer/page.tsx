import type { Metadata } from "next";
import Link from "next/link";
import { befragbareDossiers } from "@/lib/glas/dossier";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Moriondo · Ermittlungsprobe", robots: { index: false, follow: false } };

export default function ErmittlungsVorraum() {
  const dossiers = befragbareDossiers().filter((dossier) => !dossier.versiegelt);
  return <main className="mx-auto max-w-2xl px-5 py-12">
    <p className="regie">Werkraum · neue spielbare Verhörprobe</p>
    <h1 className="font-display my-6 text-3xl">Nicht seine Fragen beantworten.<br />Ihm Antworten abnehmen.</h1>
    <p className="my-4 leading-7">Die Stallungen sind leer. Der Gefangene sagt die Wahrheit — aber nicht die ganze. Du untersuchst Spuren, hältst ihm Belege vor und rekonstruierst deinen Rückruf.</p>
    <p className="regie my-6 leading-6">Lokale Probe mit geschriebenen Reaktionen. Kein freier KI-Chat, kein echtes Welt-Ereignis und keine Änderung an Reittieren oder XP. Die Aktenauswahl ist ein Testwerkzeug, keine Anmeldung.</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{dossiers.map((dossier) => <Link key={dossier.slug} className="taste block" href={`/verhoer/${dossier.slug}`}>{dossier.name} · {dossier.figur}</Link>)}</div>
    <Link className="taste mt-8 block" href="/">Zur bisherigen Fassung</Link>
  </main>;
}
