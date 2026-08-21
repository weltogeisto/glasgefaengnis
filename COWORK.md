# Cowork: Das Glasgefängnis

Public repo: https://github.com/weltogeisto/glasgefaengnis  
Branch for agents: **`cowork/presence`**

This is the Grok App Builder interrogation: you stand before Moriondo in a circular glass cell. Tone is Hannibal-Lecter-sparse (Silence of the Lambs glass-cell blocking — standing still, approaching the pane, palm on glass, turning away). Writing is German, precise, not theatrical.

## Canon look

`public/prison/canon.jpg` / `canon.png` — dark-haired pale man, long tattered black coat, circular glass cylinder, green torchlight, visitor silhouettes in the foreground. **Do not revert to the bald white-linen version.**

Reference still: the uploaded cell shot (black coat, green torches). Presence clips were generated from that frame.

## Architecture

| Path | Owns |
|------|------|
| `src/lib/prison/script.ts` | Riddle, replies, Codex, matcher |
| `src/lib/prison/presence.ts` | Mood → video/poster map |
| `src/lib/prison/audio.ts` | Howler voices, dungeon drone, glass tick, iOS unlock |
| `src/lib/prison/store.ts` | Zustand: enter / send / ambient cycle |
| `src/components/prison/Stage.tsx` | Dual-video crossfade + Ken Burns |
| `src/components/prison/GlassPane.tsx` | Scratches, specular, grain, dust |
| `src/components/prison/Gate.tsx` | Corridor walk-in, tap-to-start (unlocks audio) |
| `src/components/prison/Dock.tsx` | Verhör / Codex / Akte |

No auth, no database. Progress is in-memory (localStorage later).

## Presence moods

`idle` stand-still · `pace` circle · `approach` / `talk` walk to glass · `glass` / `menace` palm on pane · `laugh` smile · `turn` back · `sit` rest · `song` hush · `corridor` gate dolly.

Ambient cycle (when not speaking): idle → pace → turn → sit → idle → glass.

## Audio

Prebaked MP3s in `public/prison/*.mp3` (xAI TTS, voice `rigel`, German). Unlock **synchronously** on "Vor das Glas treten". Never call TTS at runtime (quota).

## Rules for other agents

1. Keep the menu **dark**. White screens are a regression.
2. Presence, not lip-sync. He is a body in a cell.
3. Copy stays Lecter-sparse. No rules-speak.
4. Mobile-first: dock is a bottom sheet; ≥44px targets.
5. Do not strip `PreviewHostBridge`, grok PWA branding, or `startup.sh`.
6. Bind preview via `npm run dev` on `0.0.0.0:8080`.

## Open work

- Rites 3–4 (Chiffre, Stall)
- Unique `song` / `sit` clips from canon (currently aliased to idle)
- Persist watch progress in localStorage
- More palm-on-glass / circle-pace variants
