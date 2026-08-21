export type Mood =
  | "idle"
  | "pace"
  | "approach"
  | "talk"
  | "laugh"
  | "song"
  | "menace"
  | "sit"
  | "turn"
  | "glass"
  | "corridor"
  | "storm"
  | "closer"
  | "whisper"
  | "sniff"
  | "bow"
  | "rage"
  | "delight"
  | "stride"
  | "hands"
  | "over"
  | "trace"
  | "depth";

export type PresenceClip = {
  video: string;
  poster: string;
};

export const PRESENCE: Record<Mood, PresenceClip> = {
  idle: { video: "/prison/idle.mp4", poster: "/prison/idle.jpg" },
  pace: { video: "/prison/pace.mp4", poster: "/prison/pace.jpg" },
  approach: { video: "/prison/approach.mp4", poster: "/prison/approach.jpg" },
  talk: { video: "/prison/idle.mp4", poster: "/prison/idle.jpg" },
  laugh: { video: "/prison/laugh.mp4", poster: "/prison/laugh.jpg" },
  song: { video: "/prison/song.mp4", poster: "/prison/song.jpg" },
  menace: { video: "/prison/glass.mp4", poster: "/prison/glass.jpg" },
  sit: { video: "/prison/sit.mp4", poster: "/prison/sit.jpg" },
  turn: { video: "/prison/turn.mp4", poster: "/prison/turn.jpg" },
  glass: { video: "/prison/glass.mp4", poster: "/prison/glass.jpg" },
  corridor: { video: "/prison/corridor.mp4", poster: "/prison/corridor.jpg" },
  storm: { video: "/prison/face.mp4", poster: "/prison/face.jpg" },
  closer: { video: "/prison/closer.mp4", poster: "/prison/closer.jpg" },
  whisper: { video: "/prison/whisper.mp4", poster: "/prison/whisper.jpg" },
  sniff: { video: "/prison/sniff.mp4", poster: "/prison/sniff.jpg" },
  bow: { video: "/prison/bow.mp4", poster: "/prison/bow.jpg" },
  rage: { video: "/prison/rage.mp4", poster: "/prison/rage.jpg" },
  delight: { video: "/prison/delight.mp4", poster: "/prison/delight.jpg" },
  stride: { video: "/prison/stride.mp4", poster: "/prison/stride.jpg" },
  hands: { video: "/prison/hands.mp4", poster: "/prison/hands.jpg" },
  over: { video: "/prison/over.mp4", poster: "/prison/over.jpg" },
  trace: { video: "/prison/trace.mp4", poster: "/prison/trace.jpg" },
  depth: { video: "/prison/depth.mp4", poster: "/prison/depth.jpg" },
};

export const AMBIENT_CYCLE: Mood[] = [
  "idle",
  "pace",
  "stride",
  "hands",
  "over",
  "depth",
  "sit",
  "trace",
  "sniff",
  "glass",
];

export const HOLD_MS: Partial<Record<Mood, number>> = {
  storm: 10000,
  laugh: 7000,
  song: 8000,
  rage: 6500,
  closer: 6500,
  whisper: 6500,
  delight: 6000,
  pace: 10000,
  stride: 10000,
  hands: 10000,
  over: 10000,
  depth: 10000,
};

export const AFTER_MOOD: Partial<Record<Mood, Mood>> = {
  laugh: "glass",
  storm: "idle",
  rage: "glass",
  song: "turn",
  sniff: "stride",
  whisper: "idle",
  closer: "idle",
  bow: "idle",
  delight: "idle",
  menace: "glass",
  stride: "pace",
  hands: "over",
  talk: "idle",
};

