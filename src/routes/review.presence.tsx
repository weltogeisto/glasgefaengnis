import { createFileRoute } from "@tanstack/react-router";
import { PresenceReview } from "@/components/review/PresenceReview";

export const Route = createFileRoute("/review/presence")({
  component: PresenceReview,
});
