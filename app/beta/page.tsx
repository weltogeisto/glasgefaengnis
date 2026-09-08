import type { Metadata } from "next";
import { Beta } from "@/components/zelle/Beta";

// Absichtlich nicht verlinkt und nicht indexiert. Wer hier landet, hat die
// Adresse getippt.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Werkraum", robots: { index: false, follow: false } };

export default function BetaSeite() {
  return <Beta />;
}
