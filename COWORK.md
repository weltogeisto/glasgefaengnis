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

Wide cell: `idle` `pace` (along the glass L→R) `stride` (full width and back) `hands` (hands behind back) `over` (look over shoulder) `depth` (toward camera and back) `trace` (fingers on pane) `approach` `talk` `glass` `sit` `song` `bow` `sniff` `turn` `corridor`.

Close face: `storm` / `face` emotion cycle · `laugh` hysterical · `rage` · `delight` · `closer` · `whisper`.

Ambient: idle → pace → stride → hands → over → depth → sit → trace → sniff → glass.

## Lip sync

While a line is spoken, camera cuts to the close-up (`talk` / `whisper`). Jaw is driven by prebaked RMS envelopes in `src/lib/prison/envelopes.json` (50 Hz, from the MP3s) mixed onto `lips-open.jpg` over `lips-closed.mp4`. Hold the shot until the audio **ends** — do not cut on a fixed timer. Laugh / storm / rage / song keep their performance clips.

Never call TTS at runtime. If you replace an MP3, regenerate that key in `envelopes.json` (`ffmpeg` → RMS → normalize).

## Audio

Prebaked MP3s in `public/prison/*.mp3` (xAI TTS, voice **`lux`**, German, speed `0.72`). Unlock **synchronously** on "Vor das Glas treten". Never call TTS at runtime (quota).

## Rules for other agents

1. Keep the menu **dark**. White screens are a regression.
2. Presence, not lip-sync. He is a body in a cell.
3. Copy stays Lecter-sparse. No rules-speak.
4. Mobile-first: dock is a bottom sheet; ≥44px targets.
5. Do not strip `PreviewHostBridge`, grok PWA branding, or `startup.sh`.
6. Bind preview via `npm run dev` on `0.0.0.0:8080`.

## Open work

- Rites 3–4 (Chiffre, Stall)
- Persist watch progress in localStorage
- More unique close-up laugh / sit variants
