import { createFileRoute } from "@tanstack/react-router";
import { PrisonApp } from "@/components/prison/PrisonApp";

export const Route = createFileRoute("/glas")({ component: Glas });

function Glas() {
  return <PrisonApp />;
}
