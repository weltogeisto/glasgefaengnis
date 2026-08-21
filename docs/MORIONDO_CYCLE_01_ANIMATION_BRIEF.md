# HANDOVER TO GROK — MORIONDO / GLASGEFÄNGNIS ANIMATION PACK

**Repository:** `weltogeisto/glasgefaengnis`  
**Working branch:** `cowork/presence`  
**Primary purpose of this repo:** cinematic presence, animation generation, asset review, and export.  
**Do not turn this repository into the authoritative game-state or puzzle engine.** JGA Fellowship OS will own participant identity, clue logic, persistence, and progression.

---

## 1. Mission

Extend the existing Moriondo presence system with the missing cinematic sequences for **Interrogation Cycle I: Das Netz der leeren Ställe**.

The existing branch already establishes the correct technical and visual direction:

- canonical Moriondo actor in `public/prison/canon.jpg` / `canon.png`;
- circular magical glass cell;
- green torchlight;
- restrained, sparse physical performance;
- full-body presence rather than constant lip-sync;
- dual-video crossfades and poster fallbacks;
- separate prebaked voice/audio;
- mobile-first entry and interrogation presentation.

Preserve those strengths. Produce the missing story-critical animations, a clean semantic asset manifest, and a review surface. Do not rebuild the whole application.

---

## 2. Hard canon — do not reinterpret

1. **Moriondo is the principal active antagonist.**
2. **Moriondo is physically imprisoned inside the glass cell.**
3. His capture at Dol Guldur is a **real defeat**, not voluntary self-imprisonment and not an effortless “everything was planned” reversal.
4. His personality is fully Dark Triad:
   - predatory intelligence;
   - grandiose narcissism;
   - calculated manipulation;
   - lack of remorse;
   - elegant self-command;
   - and, beneath it, genuine uncontrolled rage.
5. The Blue Wizards are separate figures. Do not make Moriondo their commander, creation, subordinate, or alter ego.
6. Sauron is not the active main antagonist of this feature.
7. The mounts did **not** vanish magically. Düsterwald spiders physically abducted them alive under a contingency command issued by Moriondo.
8. The empty stalls are left covered in cobwebs. The webbing is the first clue pointing toward the Düsterwald.
9. **Steven’s spider resisted Moriondo’s command**, forced its own will upon the lower spiders, and remained behind.
10. Steven’s spider is the key command channel for recovering the mounts, but it does not know or solve the full riddle alone.
11. The mounts remain alive and recoverable. No gore, maiming, death, or permanent loss.
12. Moriondo’s danger after capture is psychological and informational: he wants the Fellowship to reconstruct his command-web for him.
13. Do not depict a real actor likeness or copy an existing Hannibal Lecter scene. The reference is only sparse glass-cell blocking and predatory psychological presence.

---

## 3. Approved visual references

Use these as binding references alongside `public/prison/canon.png`.

### A. Canonical Moriondo and glass chamber
The currently approved Moriondo glass-prison image. Preserve actor identity, long dark coat, glass geometry, green lighting, scale, and atmosphere.

### B. Empty stall / Düsterwald trace
Approved image: `verlassener_stall_im_nebelwald.png`

Visual facts to preserve:

- empty stone-and-timber stall;
- tack and harness left behind;
- heavy cobwebs;
- disturbed straw and drag traces;
- web strands leading toward a dark forest;
- restrained green forest glow;
- strong feeling of absence.

### C. Steven’s dominant spider
Approved image: `unheimliche_spinnen_im_nebelwald.png`

Visual facts to preserve:

- one large, unusually intelligent dominant spider;
- lower spiders visibly subordinate;
- distinct markings and authority;
- dark, wet Düsterwald environment;
- no comic “pet spider” treatment;
- no generic boss-monster pose.

The user will provide B and C to this repo. Do not substitute new concepts without review.

---

## 4. Existing clips to reuse

Do not regenerate these unless identity or continuity is clearly broken:

- `idle`
- `pace`
- `stride`
- `hands`
- `over`
- `depth`
- `sit`
- `trace`
- `approach`
- `glass`
- `turn`
- `closer`
- `whisper`
- `bow`
- `delight`
- `laugh`
- `sniff`
- `corridor`

The current `rage.mp4` may remain as a placeholder or a minor generic escalation. It is **not sufficient** for the two new story-specific rage beats below.

Avoid routine close-face lip-sync. Moriondo should remain a body occupying the chamber. Close shots are rare punctuation.

---

# 5. New animation deliverables

## Priority 0 — required for Cycle I

### M01 — `moriondo.capture_rage`

**Purpose:** Opening proof that the capture is genuine.

**Scene:** Moriondo has just been sealed inside the glass prison. His cultivated mask is absent.

**Performance:**

- violent turn toward the glass;
- repeated impacts or attempts to break it;
- uncontrolled breathing;
- loss of elegant posture;
- no awareness of how he appears;
- no theatrical grin;
- no calculated pause for the audience;
- the chamber holds.

**Direction:** This is humiliation and animal rage, not a superhero power display.

**Camera:** Primarily wide or medium-wide so the whole body and cell remain legible.

**Duration:** 10–14 seconds.  
**Playback:** one-shot.  
**Ending:** a transition-compatible stop, stumble backward, or hard stillness.

---

### M02 — `moriondo.mask_reassembles`

**Purpose:** Transition from uncontrolled rage to the cold interrogator.

**Scene:** Immediately after M01.

**Performance:**

- breathing gradually controlled;
- slowly straightens his coat and posture;
- notices the observers again;
- shame becomes attention;
- a minimal, predatory half-smile may appear only at the end;
- no dialogue-specific lip movement.

**Duration:** 8–12 seconds.  
**Playback:** one-shot, then transition to `idle`, `hands`, or `over`.

---

### M03 — `moriondo.rage_performed`

**Purpose:** A deliberately staged intimidation tactic during interrogation.

**Performance:**

- sudden advance;
- raised voice/body tension;
- stops before genuine loss of control;
- eyes continue tracking the active interrogator;
- posture remains balanced;
- he is observing the reaction throughout;
- ends on his own terms.

This must be visually distinguishable from M04.

**Duration:** 6–9 seconds.  
**Playback:** one-shot.  
**Ending:** returns cleanly to `glass`, `approach`, or `idle`.

---

### M04 — `moriondo.rage_true_break`

**Purpose:** The major Cycle I revelation.

**Trigger in the game:** The Fellowship proves that Steven’s spider did not remain because Moriondo permitted it; it remained because it overpowered and broke his command.

**Performance:**

- a brief failure to process the accusation;
- involuntary facial collapse;
- he stops tracking the speaker;
- language/body rhythm fragments;
- attacks the glass despite knowing it cannot free him;
- raw narcissistic injury;
- no elegance, no ironic laugh, no controlled flourish;
- this should be more frightening precisely because it is not performed.

**Duration:** 10–15 seconds.  
**Playback:** one-shot, rare, story-critical.  
**Ending:** exhaustion or a sudden unnatural freeze suitable for M05.

---

### M05 — `moriondo.rage_aftermath`

**Purpose:** Restore menace after the true break without erasing the defeat.

**Performance:**

- almost motionless;
- controlled but still visibly recovering breath;
- eyes return to the observers;
- studies rather than threatens;
- no smile at first;
- the feeling should be: he has lost something and is already learning from it.

**Duration:** 8–12 seconds.  
**Playback:** one-shot with a loop-compatible final pose, or a subtle 10-second loop.

---

### S01 — `stall.web_takeover`

**Reference:** approved empty-stall image.

**Purpose:** First-visit profile incident animation after the mounts are abducted.

**Animation:**

- still, empty stall at first;
- several strands tighten almost imperceptibly;
- loose tack shifts under tension;
- dust/straw moves;
- one web line pulses toward the forest opening;
- a small spider crosses the foreground;
- no mount appears;
- no jump scare.

**Duration:** 8–12 seconds.  
**Playback:** one-shot followed by a calm loop or poster.  
**Deliver both:** 16:9 master and 4:3 profile-safe crop.

---

### S02 — `spider.steven_command`

**Reference:** approved dominant-spider image.

**Purpose:** Show why Steven’s spider is exceptional.

**Animation:**

- dominant spider remains composed;
- a controlled vibration runs through its web;
- lower spiders freeze;
- turn toward it;
- lower their bodies or reorient in obedience;
- the dominant spider does not thrash or roar;
- authority is shown through stillness and response.

**Duration:** 8–12 seconds.  
**Playback:** one-shot, with optional loopable ending.  
**Deliver both:** 16:9 master and 4:3 profile-safe crop.

---

### S03 — `spider.lower_brood_answers`

**Purpose:** The lower brood receives a correct partial command.

**Animation:**

- web vibration spreads outward;
- separate lower spiders respond in sequence;
- one group turns toward the correct route;
- another remains still, indicating the command is incomplete;
- no text or literal glowing map;
- any magical influence should be subtle and physical, expressed through silk tension and movement.

**Duration:** 7–10 seconds.  
**Playback:** one-shot.

---

### A01 — `mounts.abduction_flashback`

**Purpose:** Confirm the mounts were physically abducted.

**Scene:**

- several mounts alive in the Düsterwald;
- controlled by heavy web lines and lower spiders;
- frightened and resisting, but not injured;
- movement deeper into the forest;
- Moriondo is not physically present;
- only a subtle unnatural synchronisation in the web suggests his command.

**Duration:** 8–12 seconds.  
**Playback:** one-shot flashback/evidence reveal.

---

### A02 — `mounts.hidden_nest`

**Purpose:** Confirm the mounts are alive and establish stakes.

**Scene:**

- hidden forest nest;
- mounts held separately in silk restraints;
- visible breathing, eye movement, and small attempts to move;
- lower spiders maintain the web;
- no feeding on them, no gore, no body-horror;
- the nest should contain route clues without becoming a literal labelled map.

**Duration:** 8–12 seconds.  
**Playback:** subtle loop.

---

### A03 — `spider.counter_command`

**Purpose:** Steven’s spider sends the completed, evidence-backed reversal command.

**Animation:**

- dominant spider initiates a stronger but controlled pulse;
- command travels through multiple web junctions;
- lower spiders hesitate;
- then reverse orientation;
- a subtle strand linked toward Moriondo goes slack or breaks;
- the severance must be visually clear but not explosively magical.

**Duration:** 10–14 seconds.  
**Playback:** one-shot.

---

### A04 — `mounts.release`

**Purpose:** Payoff of the riddle.

**Animation:**

- web restraints loosen in sequence;
- lower spiders withdraw rather than attack;
- mounts regain footing;
- one mount tests freedom before moving;
- no triumphant superhero staging;
- the tone is tense relief.

**Duration:** 10–14 seconds.  
**Playback:** one-shot.

---

### A05 — `mounts.return`

**Purpose:** Recovery ceremony and restoration of the normal Stallungen UI.

**Scene:**

- mounts return from the forest toward the stable;
- exhausted but alive;
- silhouettes/riders may wait at a respectful distance, but faces are not required;
- emotional restraint rather than sentimental spectacle;
- end on an image that can dissolve back into each personal mount card.

**Duration:** 10–15 seconds.  
**Playback:** one-shot.

---

## Priority 1 — future Cycle II preparation

Do not prioritise these over Cycle I. Storyboard them only after Priority 0 is accepted.

### C201 — `moriondo.open_door_seated`

The glass door stands open. Moriondo remains seated inside. He does not cross the threshold.

### C202 — `moriondo.threshold_study`

He approaches the open door, studies the threshold, then voluntarily retreats.

### C203 — `moriondo.remembered_grudge`

A subtle performance variant directed at the rider who triggered the true rage break in Cycle I.

These clips establish **Cycle II: Die offene Tür** without undoing the victory of Cycle I.

---

# 6. Performance language

## Moriondo

Default:

- sparse movement;
- long observation;
- exact posture;
- minimal facial expression;
- no generic villain gesticulation;
- no constant smirking;
- threat through attention and proximity.

Performed rage:

- still situationally aware;
- deliberately timed;
- watches the target;
- self-terminates.

True rage:

- loses target tracking;
- loses compositional elegance;
- acts against his own strategic interest;
- cannot immediately recover;
- frightening because his control has genuinely failed.

## Steven’s spider

- intelligent;
- hierarchical;
- sovereign;
- economical movement;
- not cute;
- not a giant fantasy boss attacking the camera;
- visually distinct from the lower brood through markings, scale, posture, and the brood’s reaction.

## Lower spiders

- numerous but legible;
- operate in coordinated groups;
- movement follows command waves;
- no chaotic “swarm noise” that obscures cause and effect.

## Mounts

- alive;
- physically present;
- frightened but not mutilated;
- each animal retains dignity and weight;
- no slapstick or overly human facial acting.

---

# 7. Visual continuity rules

1. Use the same canonical Moriondo face, hair, coat, body proportions, glass chamber, lighting, and green-torch palette as `public/prison/canon.png`.
2. Never revert to the bald/white-linen prisoner.
3. Keep Moriondo’s chamber photorealistic and physically coherent.
4. Purple/violet influence may appear only as a restrained secondary accent. Do not turn the web into neon magic.
5. Düsterwald palette:
   - black-brown timber and trees;
   - cold grey silk;
   - damp blue-green darkness;
   - subtle sickly green depth;
   - minimal violet contamination from Moriondo.
6. Avoid hard camera changes that make clips impossible to crossfade.
7. Keep the subject within the centre-safe area for mobile crops.
8. No text, subtitles, HUD, logos, or UI inside rendered video.
9. No baked-in dialogue audio.
10. No direct recreation of a film shot or actor performance.

---

# 8. Technical delivery contract

## Video

- Minimum master: **1920×1080**, 16:9.
- Stall and Steven-spider scenes additionally require **4:3 profile-safe versions**.
- Preserve a mobile-safe central composition.
- Preferred cinematic frame rate: **24 fps**, unless matching the existing clip family requires another fixed rate.
- Delivery codec: **H.264 MP4**, `yuv420p`, web-compatible, `faststart`.
- Optional WebM may be included, but MP4 is mandatory.
- No baked audio.
- Target size: under 8 MB when quality permits; hard ceiling 12 MB per normal 1080p clip.
- One-shot clips must not loop accidentally.
- Loop clips require visually compatible first/last frames.
- Give every clip 8–12 stable transition frames at its start and/or end where possible.

## Poster

For every video:

- matching `.jpg` or `.webp` poster;
- same crop;
- no motion blur;
- should work as the complete low-power fallback.

## Source record

For every generated clip, record:

- semantic cue ID;
- filename;
- generation prompt;
- model/version;
- seed or generation ID where available;
- source reference image;
- duration;
- frame rate;
- loop or one-shot;
- intended entry pose;
- intended exit pose;
- desktop `object-position`;
- mobile `object-position`;
- SHA-256.

---

# 9. Repository structure

Use a clean asset split rather than adding all new files to the existing flat directory.

Suggested structure:

```text
public/
  prison/
    canon.*
    existing-clips...
    cycle-01/
      moriondo-capture-rage.mp4
      moriondo-capture-rage.jpg
      moriondo-mask-reassembles.mp4
      moriondo-mask-reassembles.jpg
      moriondo-rage-performed.mp4
      moriondo-rage-performed.jpg
      moriondo-rage-true-break.mp4
      moriondo-rage-true-break.jpg
      moriondo-rage-aftermath.mp4
      moriondo-rage-aftermath.jpg
  duesterwald/
    cycle-01/
      stall-web-takeover-16x9.mp4
      stall-web-takeover-4x3.mp4
      steven-spider-command-16x9.mp4
      steven-spider-command-4x3.mp4
      lower-brood-answers.mp4
      mounts-abduction-flashback.mp4
      mounts-hidden-nest.mp4
      spider-counter-command.mp4
      mounts-release.mp4
      mounts-return.mp4
```

Add:

```text
src/lib/prison/storyPresence.ts
public/presence-manifest.json
docs/MORIONDO_CYCLE_01_ANIMATION_LOG.md
```

`storyPresence.ts` should expose semantic cues without breaking the current `Mood` API.

---

# 10. Manifest contract

Create a machine-readable manifest similar to:

```json
{
  "moriondo.capture_rage": {
    "video": "/prison/cycle-01/moriondo-capture-rage.mp4",
    "poster": "/prison/cycle-01/moriondo-capture-rage.jpg",
    "loop": false,
    "durationMs": 12000,
    "camera": "wide",
    "desktopObjectPosition": "50% 50%",
    "mobileObjectPosition": "52% 50%",
    "entryPose": "capture",
    "exitPose": "staggered-still"
  }
}
```

The JGA app will consume semantic cue IDs. It must never depend on experimental filenames.

---

# 11. Review surface

Add a branch-only review page, for example:

`/review/presence`

It should show:

- semantic cue ID;
- poster;
- play/replay;
- loop/one-shot label;
- duration;
- desktop crop;
- mobile crop;
- previous/next transition preview;
- filename and checksum.

Provide separate sections:

1. Existing reusable clips.
2. New Moriondo clips.
3. Stall and spider clips.
4. Mount rescue clips.
5. Future Cycle II concepts.

Do not wire the new clips into the old six-question prototype as final story logic. The page is for visual review and export readiness.

---

# 12. Explicit non-goals

Do not:

- implement Supabase or multiplayer state here;
- encode the final riddle solution in public client files;
- expand the existing regex answer matcher;
- rewrite the JGA Fellowship OS;
- make Moriondo self-imprisoned;
- make the mounts disappear magically;
- make Steven’s spider obey Moriondo;
- make the Blue Wizards part of this plot;
- build runtime TTS;
- turn every spoken line into a close-up lip-sync video;
- use real participant faces unless separate approved source images are supplied;
- deploy to production without review.

---

# 13. Delivery and review order

## Batch 1 — storyboard approval

First create high-quality still or very short motion previews for:

1. `moriondo.capture_rage`
2. `moriondo.rage_true_break`
3. `stall.web_takeover`
4. `spider.steven_command`
5. `mounts.hidden_nest`

Do not generate every final clip before these five establish identity and continuity.

## Batch 2 — Moriondo production

Produce M01–M05 and add transition previews.

## Batch 3 — Düsterwald production

Produce S01–S03 and A01–A03.

## Batch 4 — payoff

Produce A04–A05.

## Batch 5 — optional Cycle II storyboards

Only after Cycle I is approved.

---

# 14. Acceptance criteria

The delivery is accepted only when:

- Moriondo is recognisably the same actor in every new prison clip;
- the chamber matches the existing canon;
- initial capture rage and later true rage are distinct;
- performed rage is visibly calculated;
- the true break shows genuine loss of control;
- the empty stall clearly points toward the Düsterwald without text;
- Steven’s spider visibly commands the lower brood;
- the mounts are physically abducted and visibly alive;
- no clip implies that Moriondo allowed Steven’s spider to stay;
- no clip conflates Moriondo with the Blue Wizards or Sauron;
- all clips have posters and manifest entries;
- mobile crops preserve the subject;
- the experience remains fully understandable when only posters are shown;
- existing `cowork/presence` preview behaviour continues to work;
- the review page makes every asset inspectable before integration.

---

## Immediate next action

1. Commit this brief as `docs/MORIONDO_CYCLE_01_ANIMATION_BRIEF.md`.
2. Add the two approved reference images under `docs/references/`.
3. Add the manifest skeleton and review page.
4. Produce **Batch 1 only**.
5. Return the five previews for owner approval before final animation production.
