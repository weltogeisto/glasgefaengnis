import type { Metadata } from "next";
import { Protokollbogen } from "@/components/zelle/Protokollbogen";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Verhörprotokoll" };

export default function ProtokollSeite() {
  return <Protokollbogen />;
}
