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
  | "nest.great_cocoon_teaser"
  | "nest.cocoon_inner_pulse"
  | "phial.three_smiths_strike"
  | "phial.ruben_assemble"
  | "phial.forge_night_watch"
  | "phial.forge_completion"
  | "phial.ignition_against_silk"
  | "jan.reveal_in_cocoon"
  | "nest.silk_break_release"
  | "jan.emergence"
  | "moriondo.open_door_seated"
  | "moriondo.threshold_study"
  | "moriondo.remembered_grudge";

export type ReviewSection =
  | "reusable"
  | "moriondo-cycle-01"
  | "stall-spider"
  | "mount-rescue"
  | "jan-mystery"
  | "phial-forge"
  | "cycle-02";

export type ClipStatus = "reusable" | "approved" | "batch-1-preview" | "batch-2-production" | "owner-approved-existing" | "awaiting-production" | "storyboard";

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
  /** Owner-approved Batch 1 assets must never be regenerated or silently replaced. */
  locked?: boolean;
  /** Narrative beat where this clip is used in Cycle I. */
  usedIn?: string;
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
    status: "owner-approved-existing",
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
    batch: 1,
    sha256: "ce0068cda5cad3046cac2c17c267df2e7d3adb6921a5fb4f1eef68cc00872520",
    locked: true,
    usedIn: "Immediately after Dol Guldur capture. Proves the defeat is real. Opens Cycle I.",
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
    status: "owner-approved-existing",
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
    batch: 1,
    sha256: "c3a19e85bc30eeacd40cf6b1a6dbd99840227fd394ade723a8fdc4b77bf8b4e3",
    locked: true,
    usedIn: "Interrogation climax when the Fellowship proves Steven's spider broke Moriondo's command.",
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
    status: "owner-approved-existing",
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
    locked: true,
    usedIn: "First post-abduction stall/profile takeover. 4:3 is canonical for profile UI.",
  },
  {
    id: "spider.steven_command",
    label: "Steven’s Command",
    purpose: "Dominant spider remains composed. Lower brood obeys.",
    section: "stall-spider",
    status: "owner-approved-existing",
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
    locked: true,
    usedIn: "Discovery of Steven's authority. May open the later counter-command before a new continuation.",
  },
  {
    id: "spider.lower_brood_answers",
    label: "Lower Brood Answers",
    purpose: "Partial command: one group turns, another stays still.",
    section: "stall-spider",
    status: "owner-approved-existing",
    video: "/duesterwald/cycle-01/lower-brood-answers.mp4",
    poster: "/duesterwald/cycle-01/lower-brood-answers.jpg",
    loop: false,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "brood-bowed",
    exitPose: "split-response",
    playback: "one-shot",
    filename: "lower-brood-answers.mp4",
    batch: 3,
    sha256: "c7d0a63628fbcc66e53f0158f562b850a32137d27076f5c0dcd834c318b91845",
    usedIn: "Phase 1 connective. Steven identity locked to stall/mount view. Lower brood partial response.",
    locked: true,
  },
  {
    id: "mounts.abduction_flashback",
    label: "Abduction Flashback",
    purpose: "Mounts physically taken alive. Moriondo is not present. Horse-sized Fellbeast + Oliphaunt.",
    section: "mount-rescue",
    status: "owner-approved-existing",
    video: "/duesterwald/cycle-01/mounts-abduction-flashback.mp4",
    poster: "/duesterwald/cycle-01/mounts-abduction-flashback.jpg",
    loop: false,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 52%",
    entryPose: "alive-resisting",
    exitPose: "deeper-forest",
    playback: "one-shot",
    filename: "mounts-abduction-flashback.mp4",
    batch: 3,
    sha256: "2745ebcf061a2e94e80f436e7dda77fc02cfc40d05cd26501f6c29a43f4a3723",
    usedIn: "Phase 1 connective. Alive capture of the stall roster. Fellbeast is a stall mount, smaller than the Mûmak. No spiders as captives. Gore where silk bites.",
    locked: true,
  },
  {
    id: "mounts.hidden_nest",
    label: "Hidden Nest",
    purpose: "Living stall-roster nest. Full species identity. Breathing. No gore. No spiders as captives.",
    section: "mount-rescue",
    status: "owner-approved-existing",
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
    sha256: "ecce02f0b3109bc26f288ff54818b723758b4979d7a48bc4b51e1f354868db16",
    locked: true,
    usedIn: "First collective proof the stall-roster mounts live in the Düsterwald. Rev. 4 owner-approved 2026-08-22. Full live stall roster. Mount nest only — not the Jan great cocoon.",
  },
  {
    id: "nest.great_cocoon_teaser",
    label: "Great Cocoon Teaser",
    purpose: "A further nest belongs to none of the mounts. Older, larger, one vessel. No readable human.",
    section: "jan-mystery",
    status: "owner-approved-existing",
    video: "/duesterwald/cycle-01/nest-great-cocoon-teaser.mp4",
    poster: "/duesterwald/cycle-01/nest-great-cocoon-teaser.jpg",
    loop: true,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "50% 50%",
    entryPose: "unassigned-monument",
    exitPose: "unassigned-monument",
    playback: "loop",
    filename: "nest-great-cocoon-teaser.mp4",
    batch: 4,
    sha256: "c143105522904b2eb1c457413466208af70b5dcdebf1f6bc37a1e7a26594db16",
    locked: true,
    usedIn: "Phase 2. Owner-approved 2026-08-22. Monument vessel, no face. Distinct from Hidden Nest.",
  },
  {
    id: "nest.cocoon_inner_pulse",
    label: "Cocoon Inner Pulse",
    purpose: "Sealed vessel. Occupant trapped inside. Hand presses under the Urseide — skin through mesh, no free hand, no face.",
    section: "jan-mystery",
    status: "owner-approved-existing",
    video: "/duesterwald/cycle-01/nest-cocoon-inner-pulse.mp4",
    poster: "/duesterwald/cycle-01/nest-cocoon-inner-pulse.jpg",
    loop: false,
    durationMs: 10040,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 50%",
    entryPose: "silk-sealed",
    exitPose: "imprint-strain",
    playback: "one-shot",
    filename: "nest-cocoon-inner-pulse.mp4",
    batch: 4,
    sha256: "a46761b740749fde8332d0d12d750cb861e7ba1450d16aa27770a78c4d72659e",
    locked: true,
    usedIn: "Phase 2. Owner-approved 2026-08-22. Hand under Urseide, skin through mesh, no free hand, no face.",
  },
  {
    id: "spider.counter_command",
    label: "Counter Command",
    purpose: "Steven’s pulse reverses the brood. A strand toward Moriondo goes slack. Successful defense readable.",
    section: "mount-rescue",
    status: "owner-approved-existing",
    video: "/duesterwald/cycle-01/spider-counter-command.mp4",
    poster: "/duesterwald/cycle-01/spider-counter-command.jpg",
    loop: false,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "sovereign-still",
    exitPose: "strand-slack",
    playback: "one-shot",
    filename: "spider-counter-command.mp4",
    batch: 3,
    sha256: "f4ccdf19eae4038722f3e819ccf388825dd727517891cbe10e8f2813d352ef7a",
    usedIn: "Phase 1 connective. Steven successfully counters. Slack strand and brood reversal must stay readable.",
    locked: true,
  },
  {
    id: "mounts.release",
    label: "Mounts Release",
    purpose: "Restraints loosen. Spiders withdraw. Tense relief, no triumph.",
    section: "mount-rescue",
    status: "batch-2-production",
    video: "/duesterwald/cycle-01/mounts-release.mp4",
    poster: "/duesterwald/cycle-01/mounts-release.jpg",
    loop: false,
    durationMs: 10790,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 52%",
    entryPose: "restrained-alive",
    exitPose: "footing-regained",
    playback: "one-shot",
    filename: "mounts-release.mp4",
    batch: 4,
    sha256: "1f77e0cf91c9e30dbc3f9dd59b692863021ce96a03327bbe89606c8d6595e79e",
    usedIn: "Phase B review master. Payoff after the counter-command. Species and scale locked to Hidden Nest rev. 4. Not locked — awaiting Freigabe.",
  },
  {
    id: "mounts.return",
    label: "Mounts Return",
    purpose: "Recovery toward the stable. Exhausted, alive.",
    section: "mount-rescue",
    status: "batch-2-production",
    video: "/duesterwald/cycle-01/mounts-return.mp4",
    poster: "/duesterwald/cycle-01/mounts-return.jpg",
    loop: false,
    durationMs: 10790,
    camera: "wide",
    desktopObjectPosition: "50% 50%",
    mobileObjectPosition: "50% 55%",
    entryPose: "forest-edge",
    exitPose: "mount-card",
    playback: "one-shot",
    filename: "mounts-return.mp4",
    batch: 4,
    sha256: "f4c9b7117d9d1d548fdae4edbc2ccd5ec30dab4d2b1296ac1e7da4028b96df1e",
    usedIn: "Phase B review master. Exhausted stall-roster return toward the empty webbed stall. Not locked — awaiting Freigabe.",
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
  {
    id: "phial.three_smiths_strike",
    label: "Three Smiths Strike",
    purpose: "Top three Waffenschmiede. Max strikes. Ostmark Blaue-Glut rune forged into the Phial.",
    section: "phial-forge",
    status: "owner-approved-existing",
    video: "/phial/cycle-01/phial-three-smiths-strike.mp4",
    poster: "/phial/cycle-01/phial-three-smiths-strike.jpg",
    loop: false,
    durationMs: 10040,
    camera: "wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "50% 50%",
    entryPose: "hammers-high",
    exitPose: "impact",
    playback: "one-shot",
    filename: "phial-three-smiths-strike.mp4",
    batch: 5,
    sha256: "caa1d2a634ded41209f15294d01ec6bf166e730b3025e5bce80484dce54e3506",
    locked: true,
    usedIn: "Phase 3/4. Owner-approved 2026-08-22. Ruben, Max, Hendrik (weiße Kriegsfürsten-Rüstung). Blaue-Glut Amboss-Rune. Max hits.",
  },
  {
    id: "phial.ruben_assemble",
    label: "Ruben Assembles the Phial",
    purpose: "Fine work on the Phial. Small hammer. Ostmark Blaue-Glut rune seated into the vessel.",
    section: "phial-forge",
    status: "owner-approved-existing",
    video: "/phial/cycle-01/phial-ruben-assemble.mp4",
    poster: "/phial/cycle-01/phial-ruben-assemble.jpg",
    loop: false,
    durationMs: 10040,
    camera: "medium",
    desktopObjectPosition: "50% 40%",
    mobileObjectPosition: "52% 38%",
    entryPose: "fine-work",
    exitPose: "rune-seated",
    playback: "one-shot",
    filename: "phial-ruben-assemble.mp4",
    batch: 5,
    sha256: "119c08a7933b72b3da98f52b12211d95a9746d2aece227a5b308a5577b8d8410",
    locked: true,
    usedIn: "Phase 3/4. Owner-approved 2026-08-22. Ruben on the Phial, small chasing hammer, Blaue-Glut rune seated.",
  },
  {
    id: "phial.forge_night_watch",
    label: "Forge Night Watch",
    purpose: "Between the collective strike and the fine assembly. The vessel remains incomplete.",
    section: "phial-forge",
    status: "batch-2-production",
    video: "/phial/cycle-01/phial-forge-night-watch.mp4",
    poster: "/phial/cycle-01/phial-forge-night-watch.jpg",
    loop: false,
    durationMs: 10790,
    camera: "wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "50% 50%",
    entryPose: "incomplete-vessel",
    exitPose: "held-heat",
    playback: "one-shot",
    filename: "phial-forge-night-watch.mp4",
    batch: 5,
    sha256: "07ceb67fe89e12901e88b9c0fee09ddb793fe4759f088f70746d326438588f77",
    usedIn: "Phase C connective. Teardrop still unchanged. I2V review master, not locked.",
  },
  {
    id: "phial.forge_completion",
    label: "Forge Completion",
    purpose: "The finished Phial. Inherited light rehoused. Grave, not a brighter lamp.",
    section: "phial-forge",
    status: "batch-2-production",
    video: "/phial/cycle-01/phial-forge-completion.mp4",
    poster: "/phial/cycle-01/phial-forge-completion.jpg",
    loop: false,
    durationMs: 10790,
    camera: "medium",
    desktopObjectPosition: "50% 40%",
    mobileObjectPosition: "52% 38%",
    entryPose: "rune-seated",
    exitPose: "vessel-complete",
    playback: "one-shot",
    filename: "phial-forge-completion.mp4",
    batch: 5,
    sha256: "294466b642ac72dc46aee2dffb8655f4d5e31288bce07c00b134fa34ddfe4ded",
    usedIn: "Phase C. Knotwork starlight vessel, no ᛒ, blank anvil. I2V from still 4gRk2. Not locked.",
  },
  {
    id: "phial.ignition_against_silk",
    label: "Ignition Against Silk",
    purpose: "The completed Phial meets the Urseide. No readable occupant.",
    section: "phial-forge",
    status: "storyboard",
    video: null,
    poster: "/duesterwald/cycle-01/nest-great-cocoon-teaser.jpg",
    loop: false,
    durationMs: 10000,
    camera: "wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "50% 50%",
    entryPose: "phial-raised",
    exitPose: "silk-strain",
    playback: "one-shot",
    filename: "phial-ignition-against-silk.mp4",
    batch: 5,
    usedIn: "Phase C/E. Uses the locked great-cocoon architecture. No Jan face. Storyboard until identity gate.",
  },
  {
    id: "jan.reveal_in_cocoon",
    label: "Jan Reveal in Cocoon",
    purpose: "First readable identity. Blocked until canonical JGA lock and owner Freigabe.",
    section: "jan-mystery",
    status: "storyboard",
    video: null,
    poster: "/duesterwald/cycle-01/nest-great-cocoon-teaser.jpg",
    loop: false,
    durationMs: 10000,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 50%",
    entryPose: "silk-parted",
    exitPose: "identity-readable",
    playback: "one-shot",
    filename: "jan-reveal-in-cocoon.mp4",
    batch: 5,
    usedIn: "Phase D/E. Do not generate a readable face until Jan's canonical JGA identity is locked.",
  },
  {
    id: "nest.silk_break_release",
    label: "Silk Break Release",
    purpose: "Urseide yields to the Phial. Occupant still not fully readable.",
    section: "jan-mystery",
    status: "storyboard",
    video: null,
    poster: "/duesterwald/cycle-01/nest-cocoon-inner-pulse.jpg",
    loop: false,
    durationMs: 10000,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 50%",
    entryPose: "ignition",
    exitPose: "binding-broken",
    playback: "one-shot",
    filename: "nest-silk-break-release.mp4",
    batch: 5,
    usedIn: "Phase E. Follows ignition. No early Jan identification.",
  },
  {
    id: "jan.emergence",
    label: "Jan Emergence",
    purpose: "Jan is freed. Begins his app arc; does not complete his story.",
    section: "jan-mystery",
    status: "storyboard",
    video: null,
    poster: "/duesterwald/cycle-01/nest-great-cocoon-teaser.jpg",
    loop: false,
    durationMs: 10000,
    camera: "medium-wide",
    desktopObjectPosition: "50% 48%",
    mobileObjectPosition: "52% 50%",
    entryPose: "binding-broken",
    exitPose: "freed",
    playback: "one-shot",
    filename: "jan-emergence.mp4",
    batch: 5,
    usedIn: "Phase E. Blocked on the identity gate. Cycle I victory, not Jan's full resolution.",
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

/** Owner-approved locked assets. Do not regenerate. */
export const APPROVED_EXISTING_IDS: StoryCueId[] = [
  "moriondo.capture_rage",
  "moriondo.rage_true_break",
  "stall.web_takeover",
  "spider.steven_command",
  "mounts.hidden_nest",
  "spider.lower_brood_answers",
  "mounts.abduction_flashback",
  "spider.counter_command",
  "nest.great_cocoon_teaser",
  "nest.cocoon_inner_pulse",
  "phial.three_smiths_strike",
  "phial.ruben_assemble",
];

export const PHASE_2_IDS: StoryCueId[] = [
  "nest.great_cocoon_teaser",
  "nest.cocoon_inner_pulse",
];

export const PHASE_3_IDS: StoryCueId[] = [
  "phial.three_smiths_strike",
  "phial.ruben_assemble",
];

export const PHASE_B_IDS: StoryCueId[] = [
  "mounts.release",
  "mounts.return",
];

export const FORGE_CONTINUATION_IDS: StoryCueId[] = [
  "phial.three_smiths_strike",
  "phial.forge_night_watch",
  "phial.ruben_assemble",
  "phial.forge_completion",
  "phial.ignition_against_silk",
];

/** Play Schmiede — two-day forge without ignition (still storyboard). */
export const SCHMIEDE_PLAYLIST: StoryCueId[] = [
  "phial.three_smiths_strike",
  "phial.forge_night_watch",
  "phial.ruben_assemble",
  "phial.forge_completion",
];

/**
 * Cycle I spine — review-only linear sequence of locked capture, abduction,
 * nest, Steven, true break and counter. Jan teasers stay on their own filter.
 * Mount release/return are a separate Phase B review sequence until Freigabe.
 * Played by the "Play Cycle I spine" button on /review/presence.
 */
export const CYCLE_I_SPINE: StoryCueId[] = [
  "moriondo.corridor",
  "moriondo.capture_rage",
  "moriondo.mask_reassembles",
  "stall.web_takeover",
  "mounts.abduction_flashback",
  "mounts.hidden_nest",
  "spider.steven_command",
  "spider.lower_brood_answers",
  "moriondo.pace",
  "moriondo.approach",
  "moriondo.glass",
  "moriondo.whisper",
  "moriondo.bow",
  "moriondo.delight",
  "moriondo.turn",
  "moriondo.sit",
  "moriondo.rage_true_break",
  "spider.counter_command",
  "moriondo.rage_aftermath",
];

/** Phase B review sequence — counter payoff. Not locked. */
export const CYCLE_I_RESOLUTION: StoryCueId[] = [
  "spider.counter_command",
  "mounts.release",
  "mounts.return",
];

export const REVIEW_SECTIONS: { id: ReviewSection; title: string; kicker: string }[] = [
  { id: "reusable", title: "Wiederverwendbare Clips", kicker: "Bereits im Kanon" },
  { id: "moriondo-cycle-01", title: "Moriondo · Zyklus I", kicker: "M01–M05" },
  { id: "stall-spider", title: "Stall und Spinne", kicker: "S01–S03" },
  { id: "mount-rescue", title: "Rettung der Reittiere", kicker: "A01–A05" },
  { id: "jan-mystery", title: "Jan · Das große Nest", kicker: "Teaser · Identitätssperre" },
  { id: "phial-forge", title: "Phial · Schmiede", kicker: "Blaue Glut · Zwei Tage" },
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
