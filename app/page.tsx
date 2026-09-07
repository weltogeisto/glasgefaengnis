import { befragbareDossiers } from "@/lib/glas/dossier";
import { Gang } from "@/components/zelle/Gang";

// Serverkomponente, wie jede Seite im Fellowship OS. Sie holt die Daten und
// reicht sie als einfache Props weiter; alles Interaktive steckt darunter.
export const dynamic = "force-dynamic";

export default function GangSeite() {
  return <Gang dossiers={befragbareDossiers()} />;
}
