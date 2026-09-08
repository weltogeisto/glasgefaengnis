import type { Metadata } from "next";
import Link from "next/link";
import { Beta } from "@/components/zelle/Beta";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Werkraum", robots: { index: false, follow: false } };
export default function BetaSeite() {
  return <>
    <nav className="p-5 text-center" aria-label="Regie und Archiv">
      <Link className="taste mb-3 inline-flex" href="/regie">Neue Regieprobe: vor das Glas</Link>
      <p>Darunter: archivierte Souvenir-Studie, nicht der aktuelle Ereigniskanon.</p>
      <Link className="taste mt-3 inline-flex" href="/archiv">Archivierter Gang</Link>
    </nav>
    <Beta />
  </>;
}
