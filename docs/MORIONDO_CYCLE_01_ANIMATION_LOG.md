# Moriondo Cycle I — Animation log

**Batch 1 owner-approved 2026-08-21** (identity lock including stall-roster nest). 720p previews. 1080p masters are Batch 2+.

Approved stills B (`verlassener_stall_im_nebelwald.png`) and C (`unheimliche_spinnen_im_nebelwald.png`) were **not attached**. The stall and spider stills below are generated to the visual facts in the brief and stored under `docs/references/` as stand-ins pending owner replacement.

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
