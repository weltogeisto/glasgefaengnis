# Shared Forge Preview — Design & QA Review

**Target:** `/intern/shared-forge-preview/` (jga-fellowship, Vercel preview)
**Build:** `eregion-v1` · `forge-polish v2` · `data-preview=fixtures`
**Date:** 13 Sep 2026

The Season II shared-forge preview is structurally sound and unusually honest about being a
preview. Contrast passes everywhere, the landscape gate works, the microphone flow is properly
double-locked. Almost every defect sits on one seam: where the Season I `tf-` components meet
the Season II `s2-` design system. Fix that seam and most of this list closes at once.

**1 blocks the main action · 4 should fix before sign-off · 3 need a decision · 9 verified clean**

## Findings

### 01 — The HUD row covers the play label in portrait
*Blocks the main action · 390×844*

`AUF DEN AMBOSS TIPPEN` sits underneath the `Stimmen` / `Ton aus` / `Vollbild` buttons.
On a phone it reads `AUF DEN … N`.

```
label    x 120–270  y 1031–1061
Stimmen  x 175–242  y 1038–1068  -> overlap 67x23 px
Ton aus  x 247–306  y 1038–1068  -> overlap 23x23 px
```

**Fix:** move the HUD row below the canvas in portrait, or lift the label above it. Both belong
to the same overlay stack, so this is a layout call, not a z-index one.

### 02 — Section IV is missing from the numbering
*Should fix · all viewports*

Kickers run I, II, III, then V. The voice section (`Stimmen am Amboss`) sits exactly where IV
belongs but carries no numeral, and is the only section whose top-level heading is an `h3` while
every sibling uses `h2`. `Dein Stahl. Dein Zeichen.` is likewise unnumbered, between II and III.

**Fix:** number the voice section IV and promote it to `h2`. Decide whether the customization
block is part of II or a section of its own.

### 03 — Half the controls are under the 44 px touch minimum
*Should fix · 390×844*

16 of 31 visible controls are shorter than 44 px on a page titled `Mobile Vorschau`.

```
back link  "Zur Schmiede der ersten Saison"   178x18
HUD        "Stimmen / Ton aus / Vollbild"     ~60x30
consent    checkbox                            20x20
remainder  12 controls                         38 high
```

**Fix:** raise the 38 px group to 44. The back link and the consent checkbox need real hit
areas — the checkbox especially, since it gates a privacy decision.

### 04 — A third typeface leaks in on eight elements
*Should fix · all viewports*

EB Garamond (116 elements) and Cinzel (28) carry the page. Eight elements fall through to
`system-ui`, and every one is a Season I carry-over: `.tf-ready-calls`, `.tf-rotate-notice`
(the ↻ and its copy), `.tf-empty`, `.tf-explainer`, and the three HUD buttons.

**Fix:** give the `tf-` components the `s2-` font tokens. Same seam as finding 01.

### 05 — "Cameo ansehen" runs off the screen at 320 px
*Should fix · 320×640*

`.s2-cameo > button` right edge lands at 330 against a 320 viewport (+10 px). It is the only
element on the page that overflows at any width.

**Fix:** let `.s2-cameo` wrap below ~360 px.

### 06 — Four controls have no visible focus ring
*Needs a decision · keyboard*

The anvil play button, the `Metallfinish` select, the fixtures select, and
`10 Sekunden lokal aufnehmen` clear `outline` without putting anything back. Everything else
on the page shows focus properly.

**Fix:** one `:focus-visible` token applied across the four.

### 07 — Meisterzeichen count as global in one place and per-weapon in another
*Needs a decision · data model*

Driving the fixture to 3 gives Sterneneid 3/3, the leaderboard `3 Meisterläufe`, and three
provenance rows — while Bergspalter and Donnerbund stay at 0/3. The same quantity is presented
at two scopes, so a player cannot tell whether three qualifying runs unlock one epic weapon or
all three.

**Fix:** pick one scope and make the epic cards, the leaderboard and the fixture label agree.
If it really is per-weapon, the card copy should say so.

### 08 — Portrait ends in a dead beat after everyone is ready
*Needs a decision · 390×844*

`Ich bin bereit!` updates the status to `Du: Bereit! · Übung 2: Bereit! · Übung 3: Bereit!` and
nothing visible happens. The start button is correctly enabled at that moment but lives behind
the rotation gate further down.

```
portrait   CTA display:none  disabled:false
landscape  CTA flex 274x48   -> run starts, crew panel fills
```

**Fix:** when all three are ready in portrait, let the rotate notice say so — turn it into the
next step rather than a standing hint.

## What holds up

- **Contrast: zero failures.** Every visible text node clears WCAG AA against its actual
  composited background, at every viewport.
- **No horizontal scroll** at 390, 844 or 1280 px. The seal grid fits its container exactly
  (right edge 378 = container 378); it only looks clipped in a cropped screenshot.
- **The microphone flow is properly double-locked.** Recording enables only after a successful
  mic test *and* the local-storage consent box. Neither alone opens it.
- **The landscape gate works end to end.** Portrait hides the CTA and shows the rotate notice;
  landscape reveals it, the run starts, the crew panel fills with all three smiths.
- **Selection state is coherent across sections.** Choosing `Axt` flips `aria-pressed` on the
  anvil selector and the cards together, and moves `is-selected` to Felsspalter.
- **The cameo dialog behaves.** Native `<dialog>`, opens focused on its close button, closes
  on Escape.
- **Empty states exist.** At zero progress the leaderboard reads
  `Der neue Titel ist noch unbesetzt.` and the provenance disclosure removes itself.
- **All six weapon illustrations load with specific alt text**, e.g.
  `Sternenklinge · neue Silhouettenstudie`. Decorative glyphs (◇, ↻, the S seal) are correctly
  `aria-hidden`.
- **No console or page errors**, and the preview is honest about itself: `NUR VORSCHAU` above
  the fold, `Nicht live. Keine Produktionsmigration angewendet.` at the foot.

## Method

Rendered in headless Chromium 1194 with SwiftShader WebGL at 390×844, 844×390, 320×640 and
1280×900. Geometry, contrast ratios and computed styles read from the live DOM after hydration.

Exercised: weapon target selection, the ready call, the practice run in landscape, both fixture
selects at 0/2/3 and 0/9/10, the consent and microphone flow with a fake capture device, the
cameo dialog, and tab focus across every control.

Not covered: real multiplayer, audio playback, iOS Safari specifics, and the outstanding art
hand-off the page itself flags — individual weapon portraits and final art approval.
