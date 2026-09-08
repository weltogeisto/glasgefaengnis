import type { Metadata } from "next";
import manifest from "@/public/presence-manifest.json";
import { CUE_IDS, type MediaLibrary } from "@/lib/glas/regie";
import { Encounter } from "@/components/regie/Encounter";

export const metadata: Metadata = {
  title: "Vor dem Glas · Regieprobe",
  description: "Interaktive Moriondo-Regieprobe mit bestehenden Filmsequenzen und fiktiven Belegen. Kein Live-Ereignis.",
  robots: { index: false, follow: false },
};

export default function DirectorReview() {
  // Only this server component reads the complete media manifest. Do not ship
  // future reveal descriptions, unrelated assets or provenance notes to the UI.
  const media = Object.fromEntries(CUE_IDS.map((id) => {
    const cue = manifest.cues[id];
    return [id, {
      video: cue.video, poster: cue.poster, loop: cue.loop, durationMs: cue.durationMs,
      desktopObjectPosition: cue.desktopObjectPosition, mobileObjectPosition: cue.mobileObjectPosition,
    }];
  })) as MediaLibrary;
  return <Encounter media={media} />;
}
