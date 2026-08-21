import type { Mood } from "./presence";
import { PRESENCE } from "./presence";

export type StoryCueId =
  | "moriondo.idle"
  | "moriondo.pace"
  | "moriondo.stride"
  | "moriondo.hands"
  | "moriondo.over"
  | "moriondo.depth"
  | "moriondo.sit"
  | "moriondo.trace"
  | "moriondo.approach"
  | "moriondo.glass"
  | "moriondo.turn"
  | "moriondo.closer"
  | "moriondo.whisper"
  | "moriondo.bow"
  | "moriondo.delight"
  | "moriondo.laugh"
  | "moriondo.sniff"
  | "moriondo.corridor"
  | "moriondo.rage"
  | "moriondo.capture_rage"
  | "moriondo.mask_reassembles"
  | "moriondo.rage_performed"
  | "moriondo.rage_true_break"
  | "moriondo.rage_aftermath"
  | "stall.web_takeover"
  | "spider.steven_command"
  | "spider.lower_brood_answers"
  | "mounts.abduction_flashback"
  | "mounts.hidden_nest"
  | "spider.counter_command"
  | "mounts.release"
  | "mounts.return"
  | "moriondo.open_door_seated"
  | "moriondo.threshold_study"
  | "moriondo.remembered_grudge";

export type ReviewSection =
  | "reusable"
  | "moriondo-cycle-01"
  | "stall-spider"
  | "mount-rescue"
  | "cycle-02";

export type ClipStatus = "reusable" | "approved" | "batch-1-preview" | "batch-2-production" | "awaiting-production" | "storyboard";

export type StoryClip = {
  id: StoryCueId;
  label: string;
  purpose: string;
  section: ReviewSection;
  status: ClipStatus;
  video: string | null;
  poster: string;
  altVideo?: string | null;
  altPoster?: string | null;
  loop: boolean;
  durationMs: number;
  camera: "wide" | "medium-wide" | "medium" | "close";
  desktopObjectPosition: string;
  mobileObjectPosition: string;
  entryPose: string;
  exitPose: string;
  playback: "one-shot" | "loop";
  sha256?: string;
  filename: string;
  batch: 0 | 1 | 2 | 3 | 4 | 5;
};

const REUSABLE: StoryClip[] = (
  [
    ["idle", "Idle", "Default body in the cell", "idle", "idle", true, 10000, "wide"],
    ["pace", "Pace", "Walk along the glass", "pace-start", "pace-end", true, 10000, "wide"],
    ["stride", "Stride", "Full-width crossing", "stride-start", "pace", true, 10000, "wide"],
    ["hands", "Hands", "Hands behind the back", "hands", "over", true, 10000, "medium-wide"],
    ["over", "Over", "Look over the shoulder", "over", "idle", true, 10000, "medium-wide"],
    ["depth", "Depth", "Toward camera and back", "depth", "idle", true, 10000, "medium-wide"],
    ["sit", "Sit", "Seated composure", "sit", "sit", true, 8000, "medium-wide"],
    ["trace", "Trace", "Fingers on the pane", "trace", "glass", true, 8000, "medium"],
    ["approach", "Approach", "Steps toward the glass", "approach", "glass", false, 7000, "medium-wide"],
    ["glass", "Glass", "Palm / body at the pane", "glass", "glass", true, 8000, "medium"],
    ["turn", "Turn", "Turns away, still occupying the cell", "turn", "idle", false, 6000, "wide"],
    ["closer", "Closer", "Rare punctuation, proximity", "closer", "idle", false, 6500, "medium"],
    ["whisper", "Whisper", "Leans in without lip-sync close-up", "whisper", "idle", false, 6500, "medium"],
    ["bow", "Bow", "Courtesy as weapon", "bow", "idle", false, 5000, "medium-wide"],
    ["delight", "Delight", "Private satisfaction", "delight", "idle", false, 6000, "medium"],
    ["laugh", "Laugh", "Hysteria that still watches", "laugh", "glass", false, 7000, "medium"],
    ["sniff", "Sniff", "Reads the interrogator", "sniff", "stride", false, 6000, "medium"],
    ["corridor", "Corridor", "Approach to the chamber", "corridor", "idle", true, 8000, "wide"],
    ["rage", "Rage (placeholder)", "Generic escalation — not Cycle I story rage", "rage", "glass", false, 6500, "medium"],
  ] as const
).map(([mood, label, purpose, entry, exit, loop, durationMs, camera]) => {
  const clip = PRESENCE[mood as Mood];
  return {
    id: `moriondo.${mood}` as StoryCueId,
    label,
    purpose,
    section: "reusable" as const,
    status: "reusable" as const,
    video: clip.video,
    poster: clip.poster,
    loop,
    durationMs,
    camera: camera as StoryClip["camera"],
    desktopObjectPosition: "48% 42%",
    mobileObjectPosition: "50% 42%",
    entryPose: entry,
    exitPose: exit,
    playback: loop ? ("loop" as const) : ("one-shot" as const),
    filename: clip.video.split("/").pop() ?? `${mood}.mp4`,
    batch: 0 as const,
  };
});

export const STORY_CLIPS: StoryClip[] = [
  ...REUSABLE,
  {
    id: "moriondo.capture_rage",
    label: "Capture Rage",
    purpose: "Opening proof that the capture is genuine — humiliation and animal rage.",
    section: "moriondo-cycle-01",
    status: "batch-2-production",
    video: "/prison/cycle-01/moriondo-capture-rage.mp4",
    poster: "/prison/cycle-01/moriondo-capture-rage.jpg",
    loop: false,
    durationMs: 10790,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "52% 48%",
    entryPose: "capture",
    exitPose: "staggered-still",
    playback: "one-shot",
    filename: "moriondo-capture-rage.mp4",
    batch: 2,
    sha256: "ce0068cda5cad3046cac2c17c267df2e7d3adb6921a5fb4f1eef68cc00872520",
  },
  {
    id: "moriondo.mask_reassembles",
    label: "Mask Reassembles",
    purpose: "Breathing controlled, coat straightened, observers noticed again.",
    section: "moriondo-cycle-01",
    status: "batch-2-production",
    video: "/prison/cycle-01/moriondo-mask-reassembles.mp4",
    poster: "/prison/cycle-01/moriondo-mask-reassembles.jpg",
    loop: false,
    durationMs: 10790,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "52% 50%",
    entryPose: "staggered-still",
    exitPose: "idle",
    playback: "one-shot",
    filename: "moriondo-mask-reassembles.mp4",
    batch: 2,
    sha256: "0af7c164b63a52b3df4106a1ca9e353defcd4e9386d20614acff5aeef1dd2188",
  },
  {
    id: "moriondo.rage_performed",
    label: "Rage Performed",
    purpose: "Staged intimidation. He watches the reaction and stops on his own terms.",
    section: "moriondo-cycle-01",
    status: "batch-2-production",
    video: "/prison/cycle-01/moriondo-rage-performed.mp4",
    poster: "/prison/cycle-01/moriondo-rage-performed.jpg",
    loop: false,
    durationMs: 8000,
    camera: "medium-wide",
    desktopObjectPosition: "50% 46%",
    mobileObjectPosition: "52% 44%",
    entryPose: "idle",
    exitPose: "glass",
    playback: "one-shot",
    filename: "moriondo-rage-performed.mp4",
    batch: 2,
    sha256: "0c767e82e892fa3f3290d2f669499b7b48d96500fec3046a1852eea44317c000",
  },
  {
    id: "moriondo.rage_true_break",
    label: "Rage True Break",
    purpose: "Steven’s spider broke his command. Narcissistic injury, loss of tracking.",
    section: "moriondo-cycle-01",
    status: "batch-2-production",
    video: "/prison/cycle-01/moriondo-rage-true-break.mp4",
    poster: "/prison/cycle-01/moriondo-rage-true-break.jpg",
    loop: false,
    durationMs: 15790,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 46%",
    entryPose: "accusation",
    exitPose: "exhaustion-freeze",
    playback: "one-shot",
    filename: "moriondo-rage-true-break.mp4",
    batch: 2,
    sha256: "c3a19e85bc30eeacd40cf6b1a6dbd99840227fd394ade723a8fdc4b77bf8b4e3",
  },
  {
    id: "moriondo.rage_aftermath",
    label: "Rage Aftermath",
    purpose: "Restore menace after the true break without erasing the defeat.",
    section: "moriondo-cycle-01",
    status: "batch-2-production",
    video: "/prison/cycle-01/moriondo-rage-aftermath.mp4",
    poster: "/prison/cycle-01/moriondo-rage-aftermath.jpg",
    loop: true,
    durationMs: 10790,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 46%",
    entryPose: "exhaustion-freeze",
    exitPose: "study",
    playback: "loop",
    filename: "moriondo-rage-aftermath.mp4",
    batch: 2,
    sha256: "deba88ccadfdfe26c06ec0cc5b7c216b31bfbe602ee8f076dce331e0d2553e91",
  },
  {
    id: "stall.web_takeover",
    label: "Stall Web Takeover",
    purpose: "Empty stall. Webbing is the first clue toward the Düsterwald.",
    section: "stall-spider",
    status: "approved",
    video: "/duesterwald/cycle-01/stall-web-takeover-16x9.mp4",
    poster: "/duesterwald/cycle-01/stall-web-takeover-16x9.jpg",
    altVideo: "/duesterwald/cycle-01/stall-web-takeover-4x3.mp4",
    altPoster: "/duesterwald/cycle-01/stall-web-takeover-4x3.jpg",
    loop: false,
    durationMs: 6040,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "still-empty",
    exitPose: "web-toward-forest",
    playback: "one-shot",
    filename: "stall-web-takeover-16x9.mp4",
    batch: 1,
    sha256: "dfb9c3348e7397093a35d7d7b0daa88b60d0f63ff0e92401f5868e8d573d0e35",
  },
  {
    id: "spider.steven_command",
    label: "Steven’s Command",
    purpose: "Dominant spider remains composed. Lower brood obeys.",
    section: "stall-spider",
    status: "approved",
    video: "/duesterwald/cycle-01/steven-spider-command-16x9.mp4",
    poster: "/duesterwald/cycle-01/steven-spider-command-16x9.jpg",
    altVideo: "/duesterwald/cycle-01/steven-spider-command-4x3.mp4",
    altPoster: "/duesterwald/cycle-01/steven-spider-command-4x3.jpg",
    loop: false,
    durationMs: 6040,
    camera: "wide",
    desktopObjectPosition: "48% 52%",
    mobileObjectPosition: "50% 55%",
    entryPose: "sovereign-still",
    exitPose: "brood-bowed",
    playback: "one-shot",
    filename: "steven-spider-command-16x9.mp4",
    batch: 1,
    sha256: "119b5df7f26b149422b248c81c9041f1464b5421e847684f8f826c0b0085f17e",
  },
  {
    id: "spider.lower_brood_answers",
    label: "Lower Brood Answers",
    purpose: "Partial command: one group turns, another stays still.",
    section: "stall-spider",
    status: "awaiting-production",
    video: null,
    poster: "/duesterwald/cycle-01/steven-spider-command-16x9.jpg",
    loop: false,
    durationMs: 8500,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "brood-bowed",
    exitPose: "split-response",
    playback: "one-shot",
    filename: "lower-brood-answers.mp4",
    batch: 3,
  },
  {
    id: "mounts.abduction_flashback",
    label: "Abduction Flashback",
    purpose: "Mounts physically taken alive. Moriondo is not present.",
    section: "mount-rescue",
    status: "awaiting-production",
    video: null,
    poster: "/duesterwald/cycle-01/mounts-hidden-nest.jpg",
    loop: false,
    durationMs: 10000,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 52%",
    entryPose: "alive-resisting",
    exitPose: "deeper-forest",
    playback: "one-shot",
    filename: "mounts-abduction-flashback.mp4",
    batch: 3,
  },
  {
    id: "mounts.hidden_nest",
    label: "Hidden Nest",
    purpose: "Mounts alive in silk. Breathing. No gore.",
    section: "mount-rescue",
    status: "approved",
    video: "/duesterwald/cycle-01/mounts-hidden-nest.mp4",
    poster: "/duesterwald/cycle-01/mounts-hidden-nest.jpg",
    loop: true,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 52%",
    entryPose: "restrained-alive",
    exitPose: "restrained-alive",
    playback: "loop",
    filename: "mounts-hidden-nest.mp4",
    batch: 1,
    sha256: "f3fcf22b8fa2ebbb6849130910b869c747cf7ca44b4eff189f13bff6fc8d6412",
  },
  {
    id: "spider.counter_command",
    label: "Counter Command",
    purpose: "Steven’s pulse reverses the brood. A strand toward Moriondo goes slack.",
    section: "mount-rescue",
    status: "awaiting-production",
    video: null,
    poster: "/duesterwald/cycle-01/steven-spider-command-16x9.jpg",
    loop: false,
    durationMs: 12000,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "sovereign-still",
    exitPose: "strand-slack",
    playback: "one-shot",
    filename: "spider-counter-command.mp4",
    batch: 3,
  },
  {
    id: "mounts.release",
    label: "Mounts Release",
    purpose: "Restraints loosen. Spiders withdraw. Tense relief, no triumph.",
    section: "mount-rescue",
    status: "awaiting-production",
    video: null,
    poster: "/duesterwald/cycle-01/mounts-hidden-nest.jpg",
    loop: false,
    durationMs: 12000,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 52%",
    entryPose: "restrained-alive",
    exitPose: "footing-regained",
    playback: "one-shot",
    filename: "mounts-release.mp4",
    batch: 4,
  },
  {
    id: "mounts.return",
    label: "Mounts Return",
    purpose: "Recovery toward the stable. Exhausted, alive.",
    section: "mount-rescue",
    status: "awaiting-production",
    video: null,
    poster: "/duesterwald/cycle-01/stall-web-takeover-16x9.jpg",
    loop: false,
    durationMs: 13000,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "forest-edge",
    exitPose: "mount-card",
    playback: "one-shot",
    filename: "mounts-return.mp4",
    batch: 4,
  },
  {
    id: "moriondo.open_door_seated",
    label: "Open Door, Seated",
    purpose: "Cycle II. The glass door is open. He does not cross.",
    section: "cycle-02",
    status: "storyboard",
    video: null,
    poster: "/prison/sit.jpg",
    loop: false,
    durationMs: 10000,
    camera: "wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 46%",
    entryPose: "sit",
    exitPose: "sit",
    playback: "one-shot",
    filename: "moriondo-open-door-seated.mp4",
    batch: 5,
  },
  {
    id: "moriondo.threshold_study",
    label: "Threshold Study",
    purpose: "Cycle II. He studies the open door, then retreats.",
    section: "cycle-02",
    status: "storyboard",
    video: null,
    poster: "/prison/approach.jpg",
    loop: false,
    durationMs: 10000,
    camera: "medium-wide",
    desktopObjectPosition: "50% 46%",
    mobileObjectPosition: "52% 44%",
    entryPose: "approach",
    exitPose: "retreat",
    playback: "one-shot",
    filename: "moriondo-threshold-study.mp4",
    batch: 5,
  },
  {
    id: "moriondo.remembered_grudge",
    label: "Remembered Grudge",
    purpose: "Cycle II. Directed at the rider who triggered the true break.",
    section: "cycle-02",
    status: "storyboard",
    video: null,
    poster: "/prison/over.jpg",
    loop: false,
    durationMs: 8000,
    camera: "medium",
    desktopObjectPosition: "50% 42%",
    mobileObjectPosition: "52% 40%",
    entryPose: "study",
    exitPose: "study",
    playback: "one-shot",
    filename: "moriondo-remembered-grudge.mp4",
    batch: 5,
  },
];

export const STORY_BY_ID: Record<StoryCueId, StoryClip> = Object.fromEntries(
  STORY_CLIPS.map((c) => [c.id, c]),
) as Record<StoryCueId, StoryClip>;

export const BATCH_1_IDS: StoryCueId[] = [
  "moriondo.capture_rage",
  "moriondo.rage_true_break",
  "stall.web_takeover",
  "spider.steven_command",
  "mounts.hidden_nest",
];

export const BATCH_2_IDS: StoryCueId[] = [
  "moriondo.capture_rage",
  "moriondo.mask_reassembles",
  "moriondo.rage_performed",
  "moriondo.rage_true_break",
  "moriondo.rage_aftermath",
];

export const REVIEW_SECTIONS: { id: ReviewSection; title: string; kicker: string }[] = [
  { id: "reusable", title: "Wiederverwendbare Clips", kicker: "Bereits im Kanon" },
  { id: "moriondo-cycle-01", title: "Moriondo · Zyklus I", kicker: "M01–M05" },
  { id: "stall-spider", title: "Stall und Spinne", kicker: "S01–S03" },
  { id: "mount-rescue", title: "Rettung der Reittiere", kicker: "A01–A05" },
  { id: "cycle-02", title: "Zyklus II · Konzepte", kicker: "Die offene Tür" },
];

const CUE_TO_MOOD: Partial<Record<StoryCueId, Mood>> = {
  "moriondo.idle": "idle",
  "moriondo.pace": "pace",
  "moriondo.stride": "stride",
  "moriondo.hands": "hands",
  "moriondo.over": "over",
  "moriondo.depth": "depth",
  "moriondo.sit": "sit",
  "moriondo.trace": "trace",
  "moriondo.approach": "approach",
  "moriondo.glass": "glass",
  "moriondo.turn": "turn",
  "moriondo.closer": "closer",
  "moriondo.whisper": "whisper",
  "moriondo.bow": "bow",
  "moriondo.delight": "delight",
  "moriondo.laugh": "laugh",
  "moriondo.sniff": "sniff",
  "moriondo.corridor": "corridor",
  "moriondo.rage": "rage",
};

/** Semantic story cues stay separate from Mood. Existing interrogation is unchanged. */
export function cueToMood(id: StoryCueId): Mood | null {
  return CUE_TO_MOOD[id] ?? null;
}

export function clipsForSection(section: ReviewSection): StoryClip[] {
  return STORY_CLIPS.filter((c) => c.section === section);
}

export function nextClip(id: StoryCueId): StoryClip | null {
  const i = STORY_CLIPS.findIndex((c) => c.id === id);
  if (i < 0) return null;
  return STORY_CLIPS[i + 1] ?? null;
}

export function prevClip(id: StoryCueId): StoryClip | null {
  const i = STORY_CLIPS.findIndex((c) => c.id === id);
  if (i <= 0) return null;
  return STORY_CLIPS[i - 1] ?? null;
}
