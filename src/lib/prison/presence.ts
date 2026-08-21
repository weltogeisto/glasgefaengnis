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
  | "corridor";

export type PresenceClip = {
  video: string;
  poster: string;
};

export const PRESENCE: Record<Mood, PresenceClip> = {
  idle: { video: "/prison/idle.mp4", poster: "/prison/idle.jpg" },
  pace: { video: "/prison/pace.mp4", poster: "/prison/pace.jpg" },
  approach: { video: "/prison/approach.mp4", poster: "/prison/approach.jpg" },
  talk: { video: "/prison/talk.mp4", poster: "/prison/talk.jpg" },
  laugh: { video: "/prison/laugh.mp4", poster: "/prison/laugh.jpg" },
  song: { video: "/prison/song.mp4", poster: "/prison/song.jpg" },
  menace: { video: "/prison/menace.mp4", poster: "/prison/menace.jpg" },
  sit: { video: "/prison/sit.mp4", poster: "/prison/sit.jpg" },
  turn: { video: "/prison/turn.mp4", poster: "/prison/turn.jpg" },
  glass: { video: "/prison/glass.mp4", poster: "/prison/glass.jpg" },
  corridor: { video: "/prison/corridor.mp4", poster: "/prison/corridor.jpg" },
};

export const AMBIENT_CYCLE: Mood[] = ["idle", "pace", "turn", "sit", "idle", "glass"];
