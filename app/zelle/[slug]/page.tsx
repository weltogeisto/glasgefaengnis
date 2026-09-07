import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dossierFuer } from "@/lib/glas/dossier";
import { waehleFragen } from "@/lib/glas/stimme";
import { GRUPPENSAAT_VORGABE } from "@/lib/glas/riss";
import { Zelle } from "@/components/zelle/Zelle";

export const dynamic = "force-dynamic";

type Eigenschaften = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Eigenschaften): Promise<Metadata> {
  const { slug } = await params;
  const dossier = dossierFuer(slug);
  return { title: dossier ? `Verhör · ${dossier.name}` : "Verhör" };
}

export default async function ZellenSeite({ params }: Eigenschaften) {
  const { slug } = await params;
  const dossier = dossierFuer(slug);
  // Jan ist `is_groom` und betritt das Glasgefängnis nie. Moriondo sitzt darin.
  if (!dossier || !dossier.anwesend) notFound();

  return (
    <Zelle dossier={dossier} fragen={waehleFragen(dossier)} gruppensaat={GRUPPENSAAT_VORGABE} />
  );
}
