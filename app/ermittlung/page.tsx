import type { Metadata } from "next";
import { befragbareDossiers } from "@/lib/glas/dossier";
import { assignRoles } from "@/lib/glas/ermittlung";
import { Urteilsglas } from "@/components/ermittlung/Urteilsglas";

export const metadata: Metadata = {
  title: "Das Urteilsglas · Moriondo",
  description: "Das Netz der leeren Ställe. Eine spielbare Regieprobe des gemeinsamen Verhörs.",
  robots: { index: false, follow: false },
};
export default function ErmittlungsSeite() {
  const actors = assignRoles(befragbareDossiers().map(({ slug, name }) => ({ slug, name })));
  return <Urteilsglas actors={actors} />;
}
