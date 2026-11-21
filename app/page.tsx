import Link from "next/link";
import { befragbareDossiers } from "@/lib/glas/dossier";
import { Gang } from "@/components/zelle/Gang";

export const dynamic = "force-dynamic";

export default function GangSeite() {
  return <>
    <aside className="border-b border-rune/40 bg-grund px-5 py-5 text-center">
      <p className="font-display text-sm text-rune">Das Netz der leeren Ställe</p>
      <p className="mx-auto my-2 max-w-xl text-sm text-tinte-leise">Moriondos Originalaufnahmen, Beweisführung und Gegenbefehl. Lokale Regieprobe, kein Live-Spielstand.</p>
      <Link href="/ermittlung" className="taste taste--rune mx-auto mt-3 block max-w-sm">Die Ermittlung betreten</Link>
    </aside>
    <Gang dossiers={befragbareDossiers()} />
  </>;
}
