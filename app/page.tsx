import Link from "next/link";
import { befragbareDossiers } from "@/lib/glas/dossier";
import { Gang } from "@/components/zelle/Gang";

export const dynamic = "force-dynamic";

export default function GangSeite() {
  return <>
    <aside className="mx-auto max-w-2xl px-5 pt-5" aria-label="Neue Verhörprobe">
      <Link href="/verhoer" className="taste block">Neue Ermittlungsprobe: ihm Antworten abnehmen →</Link>
    </aside>
    <Gang dossiers={befragbareDossiers()} />
  </>;
}
