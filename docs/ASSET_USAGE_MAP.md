# Asset usage map — Cycle I Phase 2

**Branch:** `cowork/presence`  
**Rule:** Locked assets must not be regenerated or silently replaced. 1080p may only be a non-destructive production derivative; if identity or motion weakens, keep the approved 720p source.

Read order for agents: `MORIONDO_CYCLE_01_ANIMATION_LOG.md` → `JAN_ARC_EXTENSION.md` → this map → technical brief.

---

## Locked assets (Batch 1 + Phase 1)

| Cue | Files | SHA-256 | usedIn |
|---|---|---|---|
| `moriondo.capture_rage` | `/prison/cycle-01/moriondo-capture-rage.mp4` · `.jpg` | `ce0068cda5cad3046cac2c17c267df2e7d3adb6921a5fb4f1eef68cc00872520` | Immediately after Dol Guldur capture. Proves the defeat is real. Opens Cycle I. |
| `moriondo.rage_true_break` | `/prison/cycle-01/moriondo-rage-true-break.mp4` · `.jpg` | `c3a19e85bc30eeacd40cf6b1a6dbd99840227fd394ade723a8fdc4b77bf8b4e3` | Interrogation climax when the Fellowship proves Steven’s spider broke Moriondo’s command. |
| `stall.web_takeover` | 16:9 + **4:3 profile** under `/duesterwald/cycle-01/stall-web-takeover-*` | `dfb9c3348e7397093a35d7d7b0daa88b60d0f63ff0e92401f5868e8d573d0e35` | First post-abduction stall/profile takeover. 4:3 is canonical for profile UI. |
| `spider.steven_command` | 16:9 + 4:3 under `/duesterwald/cycle-01/steven-spider-command-*` | `119b5df7f26b149422b248c81c9041f1464b5421e847684f8f826c0b0085f17e` | Discovery of Steven’s authority. May open the later counter-command before a new continuation. |
| `mounts.hidden_nest` | `/duesterwald/cycle-01/mounts-hidden-nest.mp4` · `.jpg` | `ecce02f0b3109bc26f288ff54818b723758b4979d7a48bc4b51e1f354868db16` | First collective proof the stall-roster mounts live in the Düsterwald. **Rev. 4 locked.** Mount nest only — not the Jan great cocoon. |
| `spider.lower_brood_answers` | `/duesterwald/cycle-01/lower-brood-answers.mp4` · `.jpg` | `c7d0a63628fbcc66e53f0158f562b850a32137d27076f5c0dcd834c318b91845` | Partial command. Some brood answers; others stay still. |
| `mounts.abduction_flashback` | `/duesterwald/cycle-01/mounts-abduction-flashback.mp4` · `.jpg` | `2745ebcf061a2e94e80f436e7dda77fc02cfc40d05cd26501f6c29a43f4a3723` | Physical abduction evidence. Horse-sized Fellbeast. No spiders as captives. |
| `spider.counter_command` | `/duesterwald/cycle-01/spider-counter-command.mp4` · `.jpg` | `f4ccdf19eae4038722f3e819ccf388825dd727517891cbe10e8f2813d352ef7a` | Completed reversal. Slack strand toward Moriondo. |

All eight: `status: owner-approved-existing`, `locked: true`.

---

## Cycle I spine (review-only)

Played by **Play Cycle I spine** on `/review/presence`.

1. `moriondo.corridor` — approach the chamber
2. `moriondo.capture_rage` — **locked Batch 1**
3. `moriondo.mask_reassembles` — connective (Batch 2)
4. `stall.web_takeover` — **locked Batch 1**
5. `mounts.abduction_flashback` — **locked Phase 1**
6. `mounts.hidden_nest` — **locked Batch 1 · rev. 4**
7. `spider.steven_command` — **locked Batch 1**
8. `spider.lower_brood_answers` — **locked Phase 1**
9. Reusable presence: `pace` → `approach` → `glass` → `whisper` → `bow` → `delight` → `turn` → `sit`
10. `moriondo.rage_true_break` — **locked Batch 1**
11. `spider.counter_command` — **locked Phase 1**
12. `moriondo.rage_aftermath` — connective (Batch 2)

Phase 2 Jan teasers are **not** in the spine until Freigabe.

---

## Distinct sites

| Asset | Meaning |
|---|---|
| `mounts.hidden_nest` | Living **mount** roster in silk. Stall species remain recognisable. **Rev. 4 locked.** |
| `nest.great_cocoon_teaser` | Older, larger **human-binding** site. One vessel. No face. **In review.** |
| `nest.cocoon_inner_pulse` | Same vessel, sealed. Occupant trapped inside. Cloth-imprint of a hand, no visible skin. **In review.** |

---

## Phase 2 in review (not locked)

| Cue | Files | SHA-256 |
|---|---|---|
| `nest.great_cocoon_teaser` | `/duesterwald/cycle-01/nest-great-cocoon-teaser.mp4` · `.jpg` | `c143105522904b2eb1c457413466208af70b5dcdebf1f6bc37a1e7a26594db16` |
| `nest.cocoon_inner_pulse` | `/duesterwald/cycle-01/nest-cocoon-inner-pulse.mp4` · `.jpg` | `fc361c74399e85fbc93e6d842dea32fdfbea80290c4e237c8cfb0f31fb36fc23` |

Return both for review before any visible Jan reveal. Do not generate `jan.reveal_in_cocoon` yet.

---

## Phase gate

No Jan **reveal**, forge, or Phial generation until:

- the two Phase 2 teasers are owner-reviewed;
- the teasers hide Jan successfully;
- Runenschmied identity is locked from JGA OS (Phase 3).
