import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dossierFuer } from "@/lib/glas/dossier";
import { Ermittlung } from "@/components/zelle/Ermittlung";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Moriondo · Verhörprobe", robots: { index: false, follow: false } };

export default async function Verhoerprobe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossier = dossierFuer(slug);
  // Unlike the old rehearsal route, this also respects the dossier's sealed flag.
  // This is NOT authentication: live deployment must resolve the signed-in identity.
  if (!dossier || !dossier.anwesend || dossier.versiegelt) notFound();
  const portrait = process.env.NEXT_PUBLIC_MORIONDO_PORTRAIT_URL
    ?? "https://jga-fellowship-os.vercel.app/avatars/moriondo.png";
  return <Ermittlung slug={dossier.slug} name={dossier.name} portrait={portrait} />;
}
