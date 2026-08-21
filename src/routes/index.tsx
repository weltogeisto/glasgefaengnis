import { createFileRoute } from "@tanstack/react-router";
import { PrisonApp } from "@/components/prison/PrisonApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PrisonApp />;
}
