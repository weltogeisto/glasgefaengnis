import type { Cue } from "./ermittlung";
/** Original binaries copied by Git object ID, never regenerated or re-encoded.
 * Source commit: 0931a60a5f48608ab2c3294410b4ae0d77df25cd.
 * Full source manifest: public/presence-manifest.json. Batch-2 clips remain
 * labelled as such there; use in this rehearsal is not a new owner approval.
 */
export type Shot = { video: string; poster: string; loop: boolean; description: string; rest: Cue; position: string };
const shot = (path: string, loop: boolean, description: string, rest: Cue = "idle", position = "50% 48%"): Shot =>
  ({ video: `${path}.mp4`, poster: `${path}.jpg`, loop, description, rest, position });
export const SHOTS: Record<Cue, Shot> = {
  idle: shot("/prison/idle", true, "Moriondo wartet hinter dem Urteilsglas."),
  pace: shot("/prison/pace", true, "Er geht in der Zelle auf und ab."),
  glass: shot("/prison/glass", true, "Er steht unmittelbar hinter der Scheibe."),
  whisper: shot("/prison/whisper", false, "Er kommt näher. Seine Antwort ist für dich bestimmt."),
  capture: shot("/prison/cycle-01/moriondo-capture-rage", false, "Moriondo tobt nach seiner Gefangennahme. Diese Niederlage ist echt."),
  performed: shot("/prison/cycle-01/moriondo-rage-performed", false, "Er zeigt Zorn. Sein Blick bleibt auf deine Reaktion gerichtet.", "glass"),
  rupture: shot("/prison/cycle-01/moriondo-rage-true-break", false, "Der belegte Widerspruch trifft. Er verliert die Kontrolle; die Rune wird lesbar.", "aftermath"),
  aftermath: shot("/prison/cycle-01/moriondo-rage-aftermath", true, "Der Ausbruch endet. Seine Aufmerksamkeit kehrt zurück."),
  nest: shot("/duesterwald/cycle-01/mounts-hidden-nest", true, "Die Reittiere leben, gefangen hinter Seide im Wurzelraum.", "idle", "50% 52%"),
  command: shot("/duesterwald/cycle-01/steven-spider-command-16x9", false, "Stevens Spinne zwingt die niedere Brut unter ihren Willen.", "nest", "50% 52%"),
};
