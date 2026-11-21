# Moriondo: from illustrated dialogue to an investigation

## Review basis

Reviewed `claude/polish-refinement-21prte` at `45257e23fb84d8b2bd1c67433ac004593678160b` in `weltogeisto/glasgefaengnis`, against the owner's request for a Lecter-like glass-prison world event recovering abducted mounts.

The branch understands restraint, personal address and atmosphere. It implements a different objective: one question, an arbitrary personal answer of at least three characters, a final answer about Jan, then a printed keepsake. The rendered prisoner is a sphere and cylinder with a breathing oscillation. There is no evidence adjudication, repeated investigative loop, actual shared-world state or mount recovery. These are missing mechanics, not problems more particles will fix.

The original prototype remains intact at `/`, `/zelle/[slug]` and `/protokoll`. Its data and personal answers are neither imported nor overwritten by the new route.

## A playable rehearsal, not a production multiplayer release

`/ermittlung` is a local director's rehearsal with an explicit role switcher. It can be played from capture to an earned counter-command. It deliberately exposes the truth table to its browser, so it MUST NOT be promoted into the live event unchanged. The UI and exported logs label this clearly. There are no authenticated identities, cross-device updates, live stall writes or XP mutations in this change.

The browser holds a versioned move log, not an authoritative World object. Invalid or impossible moves cannot grant clues or conclusions during replay. This protects the integrity of the demo's mechanics; it is NOT anti-cheat, authentication, secrecy or a multiplayer transaction boundary.

## Restored source material

The earlier game exists in `weltogeisto/jga-fellowship-os`, branch `codex/moriondo-runtime-current`:

- `content/moriondo/cycles/netz-der-leeren-staelle.ts`, blob `ab6f4b9cba4aa717edf5ad79e291ef2292febdaf`: eight required role families, physical spider abduction, staged evidence, Steven's broken-command exception, four final claims and a silent alternative to the rage clue.
- `lib/interrogation/server.ts`, `view.ts`, `assignmentResolver.ts`, `evidenceResolver.ts`, `rageModel.ts`, `graphCompiler.ts` and `app/actions/moriondoInterrogation.ts`: existing production integration work to review and reuse, not blindly merge across its diverged branch.
- `lib/moriondoPresence.ts`: semantic media cues.

Original footage is copied, not regenerated, from `glasgefaengnis` commit `0931a60a5f48608ab2c3294410b4ae0d77df25cd` (`moriondo-cycle-01-approved-assets-v1`). `public/presence-manifest.json` retains its approval labels and hashes. Capture and true rage are expressly owner-approved there; performed-rage and aftermath remain labelled `batch-2-production`. This patch does not upgrade their approval status. The player loads only the current clip. The media test checks each used MP4 against its source SHA-256.

## Deliberate adaptations, not new canon claims

This is a new draft adaptation of Cycle I, not a verbatim port or an approved canon expansion. It retains 25 existing clue IDs and the four outcomes: Brut, Pfad, Hort, Schnitt. Roles are assigned deterministically for rehearsal, with Steven fixed as Netzführer. Several originally multi-owner clues have one owner role here; the optional Provokateur observations are folded into Schweiger and Netzleser. These are simplifications, not final participant assignments.

The obsolete prototype's absolute "Er befiehlt nichts" conflicts with the later physical-spider story. For this route, the later Cycle I source takes precedence: Moriondo's prior command affects lower spiders, not the two Blue Wizards. No Blue Wizard is renamed, subordinated or put under his command. The ten old voice rules and their tests continue to apply to the original keepsake route; the draft dialogue here uses the same restrained voice without making personal disclosures a condition of rescue.

Two conclusions require a confrontation before their next clue can be discovered: the capture alibi and the northern-water evasion. Genuine rage requires the two already-authored proofs that Steven's spider broke his command; an empty accusation produces a performed display only. The severance clue explicitly requires either the rage rune or the condensation rune, in addition to the timing clue. A complete non-rage route is tested. These extra gameplay gates are draft design decisions.

No claim is made that the glass permits an unconstrained AI conversation, that footage is lip-synchronised to the text, or that a player's real gestures or psychology are inferred. Interaction is through authored topics, investigative methods, selected evidence and supported conclusions. The five investigation controls are accessible scene instruments, not unverified pixel-perfect hotspots inside the footage.

## What now changes when you play

1. Enter as a role; Moriondo's capture, waiting, pacing, glass approach, whispered response, performed rage and genuine break use separate scene cues.
2. Inspect threads, traces, the glass seam, silence and the living bond. What is discovered depends on role and previously shared evidence. A finding is not yet a conclusion.
3. Release findings into the local shared notebook. A second perspective can use them. Questions alone cannot advance the case.
4. Confront evasions with actually discovered evidence. Repeated or unsupported accusations cannot manufacture a rupture or progression.
5. Prove each claim with the correct conclusion AND relevant released evidence from two different roles and two different actors. Duplicate clues, private-only clues, unrelated evidence and the pollen decoy do not count.
6. Steven transmits only after all four proofs and the concrete route/living-mount/severance chain exist. Completion means the rehearsal has earned the start of recovery, not that a production mount has been restored.

## Release gates still open

- Replace the local role switcher and browser truth table with authenticated participant projections from the existing JGA server; determine the final roster from current production data.
- Persist discoveries, released clues and proof provenance server-side. Resolve simultaneous actions transactionally, with an idempotent recovery command and explicit authority checks.
- Connect Dol Guldur capture, the real stable takeover, Legendarium clues, returning sessions and the group event lifecycle. Do not fabricate completion by updating a local counter.
- Design and review the remaining personalised interrogations; eight role perspectives are not seventeen fully distinct puzzle campaigns. Free-form language interpretation, a voice performance and wider cinematic transitions remain separate work.
- Human review of the adapted dialogue, footage continuity, mobile cropping and non-approved batch-2 clips. Local execution lacked the original app dependencies and network access, so no visual browser approval is claimed here.
- Keep the Jan cocoon / Phial continuation distinct from the living-mount nest. This rehearsal stops before it.

## Verification

The pure engine compiles under strict TypeScript. Nineteen engine tests were executed locally using Node's test runner on the same test body (only the Vitest `test` import was substituted). Both legal success routes, false claims, evidence ownership/provenance, role locking, repeat actions, replay and malformed saves are covered.

Four storage tests and two media-manifest tests are added to the existing Vitest suite. Full lint, repository TypeScript and production build are CI gates; consult the PR checks for their actual result, not this document as a green-build assertion.

Browser smoke: with a development server running, `node scripts/smoke-ermittlung.mjs` checks 320/390/768/1440 layouts, a real DOM-driven full silent route at 390px, the saved-log reload, blocked-storage fallback and missing-media fallback. Screenshots go to `.artifacts/ermittlung-smoke`. The script exists as a repeatable gate; writing it does not mean the screenshots have been reviewed.
