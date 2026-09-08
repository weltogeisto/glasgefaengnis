# Moriondo: from scripted conversation to interrogation

Review basis: `claude/polish-refinement-21prte`, inspected 2026-09-08. This is a
companion repository, `weltogeisto/glasgefaengnis`, not a branch of Fellowship OS.

## Verdict

The branch understands the restrained voice, pauses, intimacy and the glass as
separation. It has built a strong starting point for an authored encounter. It
has not yet implemented the requested mount-recovery investigation/world event.

Evidence in the reviewed source:

- `lib/glas/verhoer.ts`: one question leads directly to the personal payment.
  Any normalized response of three characters is sufficient. The next input is
  the shared final question about Jan. There is no evidence or deduction gate.
- `README.md`: the central payoff is a printable collection of friends' answers
  about Jan. That may be a valuable optional epilogue, but it is not the objective
  in the user's capture -> interrogation -> missing-mount recovery brief.
- `components/zelle/GlasCanvas.tsx`: the prisoner is a sphere and a cylinder.
  `useFrame` adds breathing and glow, not authored movement or response to tactics.
- `components/zelle/Zelle.tsx`: a new session is created on mount; the archive is
  written at farewell, not as a resumable in-progress investigation. The glass
  stage scrolls away while the conversation grows beneath it.
- `public/`: this branch only contains `icon.svg`, not Moriondo's approved body
  performance or the original portrait. `KANON.md` names the existing portrait
  in Fellowship OS at `public/avatars/moriondo.png`.
- The new SQL schema is not proof of any live integration. The UI inspected here
  uses local storage; no authenticated group event or actual stable restoration
  has been verified. The live-world state must not be inferred from a local win.

## Implemented in this review branch

`/verhoer` and `/verhoer/[slug]` are an explicitly labelled playable rehearsal.
The original routes and reducers are preserved, with a front-page comparison link.

Four mechanical steps: inspect and pair evidence; identify what his true statement
leaves out; reconstruct the individual's seeded five-rune chain; reverse the
perspective for the return call. There is exactly one complete chain and one
valid reversed sequence. Correct answers without discovered evidence do not skip
stages. Invalid inputs, repeat taps and repeated theories cannot multiply progress.
Mistakes are remembered, but never erase clues or impose a timed lockout.

The prisoner responds to evidence, chosen topics, deductions and deliberate silence.
Questions are **topic-routed authored responses**, not general language understanding
and not a live AI actor. The interface says so. The three optional hints are aids,
not required purchases or private confessions. The established no-orders/no-new-
Blue-Wizard-names constraints are retained.

Turn logs resume locally through `useSyncExternalStore` and deterministic replay.
The storage key is separate from the existing personal archive. Reset affects only
this rehearsal. A blocked/quota-limited store degrades to memory with a warning.

The scene uses the already documented Moriondo portrait URL, or
`NEXT_PUBLIC_MORIONDO_PORTRAIT_URL`, with a visible failure state. No private avatar
file has been copied into this public repository. Postures drive a **2D portrait
stage**, not a claim of real walking footage. Evidence is also available as ordinary
keyboard-accessible controls. Reduced motion removes transitions, not information.
The desktop stage stays in view; mobile uses the stage followed by a compact current
exchange, with the long transcript collapsed. Sound stays behind the existing opt-in.

## What is still required before a live world-event release

1. Host-owned global phases: aftermath of capture, interrogation open, discoveries,
   joint synthesis, recovery. Signed-in actor identity must come from Fellowship
   OS, never a selected slug. `versiegelt` is respected in the new rehearsal but is
   not an authentication mechanism. Public `/beta` and role selection must not be
   treated as safe production access control.
2. Server-authoritative cases, accepted moves and immutable discovery receipts.
   Keep answer keys off the live client; this rehearsal deliberately ships its
   puzzle logic for offline play. Atomic, idempotent restoration of the correct
   mount/rune transformation, including the existing shapeshifter exceptions.
3. Different authored case families, not merely different rune permutations.
   Linked discoveries should require the group to compare evidence without an
   absent participant permanently blocking the event. Owner-controlled catch-up.
4. Approved Moriondo performance assets: waiting/pacing/turning, approach, listening,
   hand-on-glass, controlled retreat and a rare loss of composure. Preserve his
   actual face. A translated still portrait is not equivalent to body performance.
5. A director linking each authoritative result to posture, cue, sound, subtitles
   and interruption-safe playback. No secrets should be available only in sound,
   animation, hover, or a timed visual flash. Original voice performance must be
   approved; this patch does not imitate an actor's voice.
6. Consent and privacy for the optional Jan epilogue, plus authenticated multi-device
   verification. The earlier invitation to reveal something personal must not
   become the mandatory price for getting a mount back.

## Release/verification status

No production merge, deployment, database migration, XP award or mount mutation was
requested or performed by this patch. The new narrative facts are proposed rehearsal
material; they do not silently override Fellowship OS canon.

Local validation: new reducer strictly compiled with TypeScript; standalone tests
exercise gates, all 120 permutations, replay over 200 seeded cases, malformed input,
repeat actions, optional hints and later-phase questions. See the PR for actual run
results. Full Next/React lint/build and browser verification remain CI/preview gates;
do not describe this branch as production-ready before they pass.
