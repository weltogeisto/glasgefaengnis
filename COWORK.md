# Cowork contract — Das Glasgefängnis

Repository: `weltogeisto/glasgefaengnis`  
Production branch: `cowork/presence`

This repository is the cinematic presence and animation workshop for the Moriondo arc. It is **not** the authoritative multiplayer game engine. JGA Fellowship OS owns participant identity, private clues, clue release, shared progression, interrogation persistence, mount state and final puzzle resolution.

## Read before changing anything

1. `docs/STORY_CONTRACT.md` — the only active canon contract.
2. `config/presence-approvals.json` — immutable owner-approved asset revisions.
3. `docs/MORIONDO_CYCLE_01_BRIEF_OVERRIDES.md` — explicit owner changes to the original animation brief.
4. `public/presence-manifest.json` — runtime delivery metadata.
5. `docs/ASSET_USAGE_MAP.md` — where approved assets belong in the story.
6. `docs/JAN_ARC_EXTENSION.md` — current Jan, cocoon and Phial production arc.
7. `docs/MORIONDO_CYCLE_01_ANIMATION_LOG.md` — generation history, not an authority over the current contract.

When documents conflict, `docs/STORY_CONTRACT.md`, the approval registry and the explicit override file win.

## Repository responsibilities

### This repository owns

- Moriondo, Düsterwald, cocoon, mount and Phial animation assets;
- posters and mobile-safe variants;
- semantic cue IDs;
- asset provenance and checksums;
- cinematic review tooling;
- fallbacks and transition testing.

### JGA Fellowship OS owns

- the canonical participant roster and character identities;
- private assignments and evidence;
- `Freigeben`, `Bestreiten`, `Belegen`, `Widerlegen` and `Unter Siegel`;
- interrogation truth and dependency graphs;
- shared and participant-specific state;
- mount disappearance and recovery state;
- Jan reveal gating;
- Spielmeister recovery controls.

Never place the master solution or participant-private clue graph in this public media repository.

## Active canon in one paragraph

Moriondo is the principal active antagonist and is physically imprisoned after a genuine defeat at Dol Guldur. His contingency command causes lower Düsterwald spiders to abduct the mounts alive and leave web-filled stalls. Steven’s spider resists and overpowers the command, remains behind and becomes the indispensable—but insufficient—channel for the later counter-command. The visible mount crisis conceals a larger unassigned cocoon that ultimately contains Jan. The ancient binding is broken through a jointly forged Phial containing inherited light and the freely contributed strength of the Fellowship.

## Owner-approved decisions

The owner has explicitly confirmed both of the following and they must not be reopened as errors:

- `mounts.abduction_flashback` may show the current restrained injury treatment where the silk bites. The mounts remain alive and recoverable.
- The current three-smith strike and Ruben assembly structure is intentional. Do not revert it to a single-smith production concept unless the owner changes the decision.

## Forbidden active canon

The active UI, dialogue and current documentation must not claim that:

- Moriondo is place-bound beneath the Ostberge;
- Moriondo is an evil Tom Bombadil analogue;
- Moriondo imprisoned himself;
- a song made the stall empty;
- the mounts were not physically abducted;
- the Blue Wizards command Moriondo or are commanded by him;
- Sauron is the active main antagonist of this arc;
- any participant name is universally hard-coded into Moriondo’s speech.

Historical prototypes may preserve those ideas only under an explicitly deprecated archive path.

## Asset lock rules

1. Every owner-approved revision must exist in `config/presence-approvals.json`.
2. A locked cue must be `status: "owner-approved-existing"` and `locked: true` in the manifest.
3. Approved binaries are immutable by checksum. Replace them only by adding a new revision and recording a new explicit owner approval.
4. Do not silently overwrite a locked path.
5. Run `npm run check:presence` before every push.
6. A failing approval or checksum check blocks delivery.

## Current visual canon

Moriondo:

- dark-haired, pale, narrow-faced man;
- long damaged black coat;
- circular glass cell;
- green torchlight and gothic stone;
- full-body psychological presence rather than constant close-up lip-sync;
- controlled manipulation and genuinely uncontrolled rage are visibly distinct.

Düsterwald:

- wet black trees, old silk, green-black depth and visible hierarchy among spiders;
- Steven’s spider must remain visually identical across its command and counter-command clips;
- the mount nest and Jan’s great cocoon are different places and different structures.

## Audio

Existing speech audio belongs to the deprecated song-prototype script. Do not reuse it under new canon merely because filenames still exist. Current canon dialogue may remain text-only until matching audio is deliberately generated and approved. Ambient sound and glass effects may remain active.

## Current production checkpoint — Phase C

The following work already exists and must not be regenerated merely because an older handover still calls it missing:

- `mounts.release`
- `mounts.return`
- `phial.forge_night_watch`
- `phial.forge_completion`
- `phial.ignition_against_silk`

`phial.forge_night_watch` and `phial.forge_completion` are owner-approved and locked. The release/return clips and the ignition clip remain review masters until Hendrik explicitly approves them.

The immutable integration snapshot for the current JGA rehearsal is:

```text
snapshot/moriondo-phase-c-20260823
f0fe9136df1baa5d58454a3e0128527777524c44
```

Never rewrite that snapshot. New work stays on `cowork/presence` and enters JGA only through a later reviewed snapshot.

## Immediate work order

1. Keep every approved and snapshotted asset unchanged.
2. Use `/review/presence` to present one focused owner-review queue for:
   - `moriondo.mask_reassembles`
   - `moriondo.rage_performed`
   - `moriondo.rage_aftermath`
   - `mounts.release`
   - `mounts.return`
   - `phial.ignition_against_silk`
3. For each review master, verify identity continuity, story continuity, mobile crop, first/last frame compatibility and absence of accidental spoilers.
4. Do not mark any review master as `owner-approved-existing` without Hendrik’s explicit Freigabe.
5. Do not regenerate `phial.forge_night_watch` or `phial.forge_completion`; they are complete and locked.
6. Do not generate a readable Jan face yet. First import and lock Jan’s canonical JGA identity, then produce a still reveal sheet for owner approval.
7. Keep `nest.great_cocoon_teaser` and `nest.cocoon_inner_pulse` non-identifying.
8. After the Jan identity and reveal-still gate, the next unresolved Cycle-I assets are:
   - `jan.reveal_in_cocoon`
   - `nest.silk_break_release`
   - `jan.emergence`
9. Cycle-II assets remain lower priority until Cycle I has a complete owner-approved resolution sequence.
10. Never add puzzle answers, private clue rules or participant state to this public media repository.

## Development rules

- Keep the interface dark.
- Mobile-first; all controls at least 44 px.
- Preserve `PreviewHostBridge`, Grok PWA branding and `startup.sh`.
- Preview on `0.0.0.0:8080`.
- No runtime TTS.
- No embedded UI, text or audio in generated videos.
- No replacement of approved assets without an explicit new approval record.
