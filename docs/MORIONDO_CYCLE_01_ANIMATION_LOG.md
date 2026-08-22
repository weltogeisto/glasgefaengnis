# Moriondo Cycle I — Animation log

**Batch 1 owner-approved 2026-08-21.**  
**Phase 0 (2026-08-21):** Five Batch 1 cues locked as `owner-approved-existing` with `locked: true` and `usedIn` in manifest + `storyPresence.ts`. Review filter *Approved existing* and **Play Cycle I spine**. See `docs/ASSET_USAGE_MAP.md`.

**Batch 2 produced 2026-08-21** — M01–M05 Moriondo masters. Native 720p (1080p not available on this plan). Transition freeze pads on start/end.

Approved stills B (`verlassener_stall_im_nebelwald.png`) and C (`unheimliche_spinnen_im_nebelwald.png`) were **not attached**. The stall and spider stills below are generated to the visual facts in the brief and stored under `docs/references/` as stand-ins pending owner replacement.

## Batch 2 — Moriondo production

| Cue | File | Duration | fps | Loop | Source still | SHA-256 (mp4) | Size |
|---|---|---|---|---|---|---|---|
| `moriondo.capture_rage` | `/prison/cycle-01/moriondo-capture-rage.mp4` | 10.79s | 24 | one-shot | approved Batch 1 still | `ce0068cda5cad3046cac2c17c267df2e7d3adb6921a5fb4f1eef68cc00872520` | 4.3 MB |
| `moriondo.mask_reassembles` | `/prison/cycle-01/moriondo-mask-reassembles.mp4` | 10.79s | 24 | one-shot | identity-locked recovery still | `0af7c164b63a52b3df4106a1ca9e353defcd4e9386d20614acff5aeef1dd2188` | 2.6 MB |
| `moriondo.rage_performed` | `/prison/cycle-01/moriondo-rage-performed.mp4` | 8.00s | 24 | one-shot | identity-locked calculated-advance still | `0c767e82e892fa3f3290d2f669499b7b48d96500fec3046a1852eea44317c000` | 2.4 MB |
| `moriondo.rage_true_break` | `/prison/cycle-01/moriondo-rage-true-break.mp4` | 15.79s | 24 | one-shot | approved Batch 1 still | `c3a19e85bc30eeacd40cf6b1a6dbd99840227fd394ade723a8fdc4b77bf8b4e3` | 5.8 MB |
| `moriondo.rage_aftermath` | `/prison/cycle-01/moriondo-rage-aftermath.mp4` | 10.79s | 24 | loop | identity-locked aftermath still | `deba88ccadfdfe26c06ec0cc5b7c216b31bfbe602ee8f076dce331e0d2553e91` | 2.0 MB |

### Delivery notes (Batch 2)

- Codec: H.264 High, `yuv420p`, 24 fps, `+faststart`, **no audio**.
- Resolution: 1280×720 production (1080p locked on this Imagine plan).
- ~8–10 freeze frames cloned at start and end for crossfades.
- Posters are stills (no motion blur). Capture Rage / True Break posters are the owner-approved Batch 1 frames.
- Existing reusable Mood clips were not regenerated.
- Under 8 MB per clip (hard ceiling 12 MB).

### Generation record (Batch 2)

| Cue | Prompt intent | Model | Source reference |
|---|---|---|---|
| capture_rage | Animal humiliation, both palms on glass, 10s | Imagine image-to-video 720p/10s | approved `moriondo-capture-rage.jpg` |
| mask_reassembles | Coat straighten, breath control, eyes lift, half-smile only at end | reference-to-image (capture-rage + idle + canon) → I2V 10s | identity lock |
| rage_performed | Calculated advance, eyes tracking, self-terminates | reference-to-image (idle + capture-rage + glass) → I2V trimmed to 8s | identity lock |
| rage_true_break | Face collapse, lost tracking, broken surge, 15s | Imagine image-to-video 720p/15s | approved `moriondo-rage-true-break.jpg` |
| rage_aftermath | Almost motionless, recovering study, no smile | reference-to-image (true-break + idle + hands) → I2V 10s | identity lock |

### Identity QC (Batch 2)

- Same circular cell, green torch, black coat, receding dark hair and beard across all five.
- Capture rage: frontal shout, both palms, loss of mask — distinct from performed.
- Performed rage: balanced, eyes on camera, stops on his terms.
- True break: unfocused, one palm, more broken, longer — distinct from performed and from generic `rage.mp4`.
- Mask: coat-straightening recovery between capture and idle.
- Aftermath: exhausted study, rumpled coat, loop-compatible stillness.

## Batch 1 previews

| Cue | File | Duration | fps | Loop | Source still | SHA-256 (mp4) |
|---|---|---|---|---|---|---|
| `moriondo.capture_rage` | `/prison/cycle-01/moriondo-capture-rage.mp4` | 6.04s | 24 | one-shot | idle + canon identity lock | `3ac8d2fe08d2fb3441a64cfa69d461b440943b9a36e4f02a12b796a293b3954e` |
| `moriondo.rage_true_break` | `/prison/cycle-01/moriondo-rage-true-break.mp4` | 6.04s | 24 | one-shot | edited from capture-rage still | `66ffb2716c44bcd671fce8e763080339eae3ddf56e269d7a0fb0c821a8fe3c29` |
| `stall.web_takeover` | `/duesterwald/cycle-01/stall-web-takeover-16x9.mp4` (+ 4:3) | 6.04s | 24 | one-shot | generated stall still | `dfb9c3348e7397093a35d7d7b0daa88b60d0f63ff0e92401f5868e8d573d0e35` |
| `spider.steven_command` | `/duesterwald/cycle-01/steven-spider-command-16x9.mp4` (+ 4:3) | 6.04s | 24 | one-shot | generated spider still | `119b5df7f26b149422b248c81c9041f1464b5421e847684f8f826c0b0085f17e` |
| `mounts.hidden_nest` | `/duesterwald/cycle-01/mounts-hidden-nest.mp4` | 10.04s | 24 | loop-compatible | stall-roster nest still | `f3fcf22b8fa2ebbb6849130910b869c747cf7ca44b4eff189f13bff6fc8d6412` |

### Delivery notes

- Codec: H.264 High, `yuv420p`, 24 fps, `+faststart`, **no audio**.
- Resolution: 1280×720 preview masters (1080p reserved for production batches).
- 4:3 profile-safe crops for stall and Steven-spider.
- Posters are the source stills (no motion blur).
- Existing Mood clips were not regenerated.

### Generation record

| Cue | Prompt intent | Model | Source reference |
|---|---|---|---|
| capture_rage | Wide, both palms on curved glass, animal humiliation, circular cell, green torchlight | Imagine image-to-video 720p/6s from identity-locked still | `public/prison/idle.jpg` + `canon.jpg` |
| rage_true_break | Same man/cell. Face collapse, lost tracking, broken surge at glass | Imagine image-to-video from capture-rage still | capture-rage still |
| stall.web_takeover | Empty stall, cobwebs, tack, drag traces, web toward forest | Imagine text-to-image → image-to-video | brief visual facts (approved B missing) |
| spider.steven_command | Dominant marked spider, brood lowers, stillness as authority | Imagine text-to-image → image-to-video | brief visual facts (approved C missing) |
| mounts.hidden_nest | Live stall-roster mounts in silk, mixed species, breathing, no gore | Imagine reference-to-image from JGA stall art → image-to-video 720p/10s | live stall cards at jga-fellowship-os `/stall` |

### Identity QC (Batch 1)

- Capture rage and true break share the circular cell, green torch, black coat, receding dark hair and beard.
- Capture rage: frontal shout, both palms, loss of mask.
- True break: downward unfocused face, more broken strike — distinct from performed/generic `rage.mp4`.
- Stall contains no mount.
- Nest (rev. 2) uses the live JGA stall roster, not generic horses: Mûmak, Königselch, Schattenelch, Fellbiest, Glutfalke, Sturmfalke, Grauwarg, Kriegswidder, Kankras Brut, Fellpony, Trosspony, Bree-Fohlen, Khazad-Lämmchen. Silk-bound, alive, no gore.

### Nest identity lock (rev. 2, 2026-08-21)

Source of truth: live stall at jga-fellowship-os. Moriondo’s own Fellbiest is excluded from the abducted set.

| Rider | Stall card |
|---|---|
| Boy | Grauwarg des Wilderlands |
| Christoph, Julian | Khazad-Lämmchen |
| Domi, Lennard | Bree-Fohlen |
| Finno, Simon Axt | Trosspony aus Thal |
| Finsch, Peter | Königselch des Waldlandreichs |
| Frithjof | Fellbiest von Dol Guldur |
| Hendrik | Fellpony des Alten Waldes |
| Lasse | Schattenelch der Emyn-nu-Fuin |
| Leon | Mûmak der Oasen-Karawanen |
| Max | Glutfalke vom Einsamen Berg |
| Oke | Sturmfalke des Nebelgebirges |
| Ruben | Kriegswidder der Eisenberge |
| Steven | Brut des Düsterwalds |

### Not in this batch

M02 mask_reassembles, M03 rage_performed, M05 rage_aftermath, S03, A01, A03, A04, A05, Cycle II storyboards only.

## Phase 1 Connectives — 2026-08-22 (review masters)

Owner-visible stills + videos pushed to `cowork/presence`. Status `batch-2-production` — **not locked**. Hidden Nest untouched.

| Cue | File | SHA-256 (video) | Notes |
|-----|------|-----------------|-------|
| spider.lower_brood_answers | lower-brood-answers.mp4 | c7d0a63628fbcc66e53f0158f562b850a32137d27076f5c0dcd834c318b91845 | Steven identity locked to Batch-1 command (cream abdomen, red hourglass). 10.04s |
| mounts.abduction_flashback | mounts-abduction-flashback.mp4 | 2745ebcf061a2e94e80f436e7dda77fc02cfc40d05cd26501f6c29a43f4a3723 | Horse-sized Fellbeast (stall mount, smaller than Mûmak) + Oliphaunt + horses. No spiders as captives. Gore where silk bites. Distinct from Hidden Nest. 10.04s |
| spider.counter_command | spider-counter-command.mp4 | f4ccdf19eae4038722f3e819ccf388825dd727517891cbe10e8f2813d352ef7a | Successful defense, slack strand readable. Steven identity locked. 10.04s |

All: 1280×720 H.264 High yuv420p 24 fps, no audio, `+faststart`.
Posters are the source stills (no motion blur).
Do **not** set `locked: true` until owner Freigabe.

### Hidden Nest rev. 4 — owner-requested 2026-08-22

Previous locked v2 SHA `f3fcf22b8fa2ebbb6849130910b869c747cf7ca44b4eff189f13bff6fc8d6412` and rev. 3 SHA `c4b1453f2857e28a8bda8f1547286556633aeb1a7c6754a5bbbc6725184c8f52` backed up under `duesterwald/cycle-01/locked-batch1/`.

| File | SHA-256 |
|------|---------|
| mounts-hidden-nest.mp4 | `ecce02f0b3109bc26f288ff54818b723758b4979d7a48bc4b51e1f354868db16` |
| mounts-hidden-nest.jpg | `d5fa81cfd80b9e8daf23a6aedac851c15bb0f120f12665c4230e5b05477ba16b` |

Changes vs rev. 3:
- Full live stall roster now readable, not a wolf/ram/horse subset
- Mûmak der Oasen-Karawanen (largest, rear, cloth drape)
- Königselch des Waldlandreichs (golden moose, lantern antlers)
- Schattenelch der Emyn-nu-Fuin (black moose)
- Glutfalke vom Einsamen Berg and Sturmfalke des Nebelgebirges (canopy)
- Grauwarg, Kriegswidder, Fellbiest (horse-scale, no rider, no Nazgûl)
- Fellpony, Trosspony, Bree-Fohlen, Khazad-Lämmchen in lower hammocks
- Spiders remain abductors, not captives
- No gore (nest remains alive / breathing)
- Still hammock composition — distinct from abduction drag

Status: `owner-approved-existing`, `locked: true`.

### Hidden Nest rev. 3 — superseded

| File | SHA-256 |
|------|---------|
| mounts-hidden-nest.mp4 | `c4b1453f2857e28a8bda8f1547286556633aeb1a7c6754a5bbbc6725184c8f52` |
| mounts-hidden-nest.jpg | `b98a522a6fccb6cb0ab8fa2bac6e210dfe3581467bb9f6b3e070d17e52046ce5` |

Rev. 3 added Grauwarg and removed spiders/Nazgûl but collapsed the roster to wolf/ram/generic horse. Replaced by rev. 4.


### Owner rules respected

- Fellbeast is a stall mount, not a Nazgûl, not a sky-filling dragon. Horse-scale body, long neck, leathery bat wings, no rider.
- Spiders are abductors, never captives. Steven’s spider is not in the abducted set.
- Abduction poster is a different composition from locked Hidden Nest (hammocks).
- Steven identity on the two spider clips matches Batch-1 `steven_command`.

### Not yet

Cycle I spine now includes Phase 1 connectives. Phase 2 Jan teasers are in review and stay **out of the spine** until Freigabe. No visible Jan reveal yet.

## Phase 2 Jan mystery previews — 2026-08-22 (in review)

Owner-visible stills + videos. Status `batch-2-production` — **not locked**. Distinct site from Hidden Nest.

| Cue | File | SHA-256 (video) | Notes |
|-----|------|-----------------|-------|
| nest.great_cocoon_teaser | nest-great-cocoon-teaser.mp4 | c143105522904b2eb1c457413466208af70b5dcdebf1f6bc37a1e7a26594db16 | One monument vessel, older spiral Urseide, no face, no mounts. 10.04s loop |
| nest.cocoon_inner_pulse | nest-cocoon-inner-pulse.mp4 | 0a70338dff861ad707fe7d37244f45dcc5d85db3d4ea5a8d47b61eff0dd4c64b | Same cocoon. Adult hand stretches silk from inside, trying to escape. No face. 10.04s one-shot. Rev. 2; v1 SHA f1ef83a4 backed up. |

Posters SHA:
- nest-great-cocoon-teaser.jpg `373bfdb4563a2d77a59962f0ca25790600bc8331c67da7122529c5f22f88ad91`
- nest-cocoon-inner-pulse.jpg `11c416bdaba9e83f6e8f7ab073d3cc33d844c954636b49eb289c01bbd0492b2b`

All: 1280×720 H.264 High yuv420p 24 fps, no audio, `+faststart`. Posters are source stills (no motion blur).

QC:
- Distinct from Hidden Nest (one vessel vs many hammocks)
- No readable human face or limbs
- No mounts
- No Nazgûl
- Fewer lower spiders (one on a distant strand)
- Inner pulse: an adult hand bends the silk from inside as if wanting to escape. No face. Occupant is not a mount.


