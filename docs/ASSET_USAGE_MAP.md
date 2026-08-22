# Asset usage map — Cycle I Phase 0

**Branch:** `cowork/presence`  
**Rule:** The five Batch 1 assets below are **owner-approved-existing**, **locked**, and must appear in the story sequence. Do not regenerate or silently replace them. 1080p may only be a non-destructive derivative; if identity or motion weakens, keep the strong 720p source.

Read order for agents: `MORIONDO_CYCLE_01_ANIMATION_LOG.md` → `JAN_ARC_EXTENSION.md` → this map → technical brief.

---

## Locked Batch 1 assets

| Cue | Files | SHA-256 | usedIn |
|---|---|---|---|
| `moriondo.capture_rage` | `/prison/cycle-01/moriondo-capture-rage.mp4` · `.jpg` | `ce0068cda5cad3046cac2c17c267df2e7d3adb6921a5fb4f1eef68cc00872520` | Immediately after Dol Guldur capture. Proves the defeat is real. Opens Cycle I. |
| `moriondo.rage_true_break` | `/prison/cycle-01/moriondo-rage-true-break.mp4` · `.jpg` | `c3a19e85bc30eeacd40cf6b1a6dbd99840227fd394ade723a8fdc4b77bf8b4e3` | Interrogation climax when the Fellowship proves Steven’s spider broke Moriondo’s command. |
| `stall.web_takeover` | 16:9 + **4:3 profile** under `/duesterwald/cycle-01/stall-web-takeover-*` | `dfb9c3348e7397093a35d7d7b0daa88b60d0f63ff0e92401f5868e8d573d0e35` | First post-abduction stall/profile takeover. 4:3 is canonical for profile UI. |
| `spider.steven_command` | 16:9 + 4:3 under `/duesterwald/cycle-01/steven-spider-command-*` | `119b5df7f26b149422b248c81c9041f1464b5421e847684f8f826c0b0085f17e` | Discovery of Steven’s authority. May open the later counter-command before a new continuation. |
| `mounts.hidden_nest` | `/duesterwald/cycle-01/mounts-hidden-nest.mp4` · `.jpg` | `f3fcf22b8fa2ebbb6849130910b869c747cf7ca44b4eff189f13bff6fc8d6412` | First collective proof the stall-roster mounts live in the Düsterwald. **Mount nest only** — not the Jan great cocoon. |

All five: `status: owner-approved-existing`, `locked: true` in `storyPresence.ts` and `public/presence-manifest.json`.

---

## Cycle I spine (review-only)

Played by **Play Cycle I spine** on `/review/presence` (or filter *Cycle I Spine*).

1. `moriondo.corridor` — approach the chamber  
2. `moriondo.capture_rage` — **locked Batch 1**  
3. `moriondo.mask_reassembles` — connective (Phase 1 / Batch 2 production)  
4. `stall.web_takeover` — **locked Batch 1**  
5. `mounts.hidden_nest` — **locked Batch 1**  
6. `spider.steven_command` — **locked Batch 1**  
7. Reusable presence: `pace` → `approach` → `glass` → `whisper` → `bow` → `delight` → `turn` → `sit`  
8. `moriondo.rage_true_break` — **locked Batch 1**  
9. `moriondo.rage_aftermath` — connective (Phase 1 / Batch 2 production)  

This is an **asset-integration proof**, not final game logic.

---

## Distinct sites

| Asset | Meaning |
|---|---|
| `mounts.hidden_nest` | Living **mount** roster in silk. Stall species must remain recognisable. **Rev. 4 (in review):** Mûmak, Königselch, Schattenelch, Glutfalke, Sturmfalke, Grauwarg, Kriegswidder, Fellbiest, ponies, Khazad-Lämmchen. |
| Future `nest.great_cocoon_*` | Older, larger **human-binding** site. Not a rebrand of the mount nest. |

---

## Phase gate

No new Jan / Phial generation is accepted until:

- all five locked cues remain unchanged and playable;
- the spine sequence runs end-to-end in review;
- 16:9 and 4:3 pairs for stall and Steven remain reviewable;
- this map matches manifest + `storyPresence.ts`.

Then Phase 1 connective production (remaining brood / abduction / counter-command) and Phase 2 Jan teasers follow `docs/JAN_ARC_EXTENSION.md`.
