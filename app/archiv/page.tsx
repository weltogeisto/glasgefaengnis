import Link from "next/link";
import { befragbareDossiers } from "@/lib/glas/dossier";
import { Gang } from "@/components/zelle/Gang";
export const dynamic = "force-dynamic";
export default function ArchivSeite() {
  return <>
    <aside className="p-5 text-center">
      <p>Archivierte Souvenir-Studie. Kein aktueller Ereigniskanon.</p>
      <Link className="taste mt-3 inline-flex" href="/regie">Zur aktuellen Regieprobe</Link>
    </aside>
    <Gang dossiers={befragbareDossiers()} />
  </>;
}
