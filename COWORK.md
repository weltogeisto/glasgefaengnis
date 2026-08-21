# Cowork: Das Glasgefängnis

Public repo: https://github.com/weltogeisto/glasgefaengnis  
Branch for agents: **`cowork/presence`**

## Current work order — read first

The five existing Cycle I Batch 1 assets are **owner-approved, locked, and must all be integrated before further generation**. Do not regenerate or replace them.

Read in this order:

1. `docs/MORIONDO_CYCLE_01_ANIMATION_LOG.md` — exact existing assets and checksums.
2. `docs/JAN_ARC_EXTENSION.md` — current production order, Jan reveal, ancient cocoon, two-day Phial forge, and the rule that approved Batch 1 is integrated first.
3. `docs/MORIONDO_CYCLE_01_ANIMATION_BRIEF.md` — underlying visual, performance, and export contract.

Where the extension conflicts with the older brief, **`JAN_ARC_EXTENSION.md` wins**.

This is the Grok App Builder interrogation: you stand before Moriondo in a circular glass cell. Tone is Hannibal-Lecter-sparse (Silence of the Lambs glass-cell blocking — standing still, approaching the pane, palm on glass, turning away). Writing is German, precise, not theatrical.

## Canon look

`public/prison/canon.jpg` / `canon.png` — dark-haired pale man, long tattered black coat, circular glass cylinder, green torchlight, visitor silhouettes in the foreground. **Do not revert to the bald white-linen version.**

Reference still: the uploaded cell shot (black coat, green torches). Presence clips were generated from that frame.

## Architecture

| Path | Owns |
|------|------|
| `src/lib/prison/script.ts` | Prototype riddle, replies, Codex, matcher — not the future authoritative JGA puzzle engine |
| `src/lib/prison/presence.ts` | Mood → video/poster map |
| `src/lib/prison/storyPresence.ts` | Semantic story cues, approved Batch 1, future animation slots |
| `public/presence-manifest.json` | Asset delivery contract for JGA integration |
| `src/lib/prison/audio.ts` | Howler voices, dungeon drone, glass tick, iOS unlock |
| `src/lib/prison/store.ts` | Zustand prototype: enter / send / ambient cycle |
| `src/components/prison/Stage.tsx` | Dual-video crossfade + Ken Burns |
| `src/components/prison/GlassPane.tsx` | Scratches, specular, grain, dust |
| `src/components/prison/Gate.tsx` | Corridor walk-in, tap-to-start (unlocks audio) |
| `src/components/prison/Dock.tsx` | Verhör / Codex / Akte |

No authoritative participant state, clue graph, or multiplayer persistence belongs here. JGA Fellowship OS owns those systems. This repo owns cinematic presence, approved media, posters, semantic cues, and review tooling.

## Presence moods

Wide cell: `idle` `pace` (along the glass L→R) `stride` (full width and back) `hands` (hands behind back) `over` (look over shoulder) `depth` (toward camera and back) `trace` (fingers on pane) `approach` `talk` `glass` `sit` `song` `bow` `sniff` `turn` `corridor`.

Close face: `storm` / `face` emotion cycle · `laugh` hysterical · `rage` · `delight` · `closer` · `whisper`.

Ambient: idle → pace → stride → hands → over → depth → sit → trace → sniff → glass.

## Lip sync

Do **not** cut to extreme close-up on speech. He stays a body in the cell. Close-up files (`lips-*.jpg/mp4`, `face.mp4`) stay in `public/prison` for optional rites, not the greeting.

Audio still holds until the MP3 ends (`envelopes.json`). Never call TTS at runtime.

## Audio

Prebaked MP3s in `public/prison/*.mp3` (xAI TTS, voice **`lux`**, German, speed `0.72`). Unlock **synchronously** on "Vor das Glas treten". Never call TTS at runtime (quota).

## Rules for other agents

1. Keep the menu **dark**. White screens are a regression.
2. Presence, not lip-sync. He is a body in a cell.
3. Copy stays Lecter-sparse. No rules-speak.
4. Mobile-first: dock is a bottom sheet; ≥44px targets.
5. Do not strip `PreviewHostBridge`, grok PWA branding, or `startup.sh`.
6. Bind preview via `npm run dev` on `0.0.0.0:8080`.
7. Preserve all five owner-approved Batch 1 files and their checksums.
8. Use every approved Batch 1 cue in the Cycle I spine preview before generating the Jan extension.
9. Do not invent Jan's or the Runenschmied der Mark's face; fetch and lock their canonical JGA identities before reveal/forge production.

## Immediate open work

- Lock Batch 1 statuses as approved existing assets.
- Build the integrated Cycle I spine preview using all five assets.
- Add `docs/ASSET_USAGE_MAP.md`.
- Then produce the missing connective clips and two obscured Jan-cocoon teasers according to `JAN_ARC_EXTENSION.md`.
