# Clipboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline, this session).
> Steps use checkbox (`- [ ]`) syntax for tracking. Files that do not exist yet are written in
> bold without backticks (the structure test checks that backticked paths exist).

**Goal:** everything the player reads or answers (corridor welcome, consent, "you left early",
room 01 instructions, questions, reveal, playtest questions) moves from wall boards onto one 1979
clipboard sheet that appears 1 m in front of the player and stays still until the answer.

**Architecture:** one engine part, **src/engine/ui/sheet.js** (the clipboard entity and its API),
with pure placement math in **src/engine/ui/sheet-math.js** (tested in Node). The existing text
panel, answer buttons and 0–100 scale are reused, hung on the clipboard instead of the scene.
Rooms and the corridor call the sheet API; the wall screen of room 01 is removed.

**Tech stack:** A-Frame 1.7.1 (vendored), plain ES modules, Node tests, smoke test in CI only.

**Spec:** `docs/decisions.md`, section "Everything the player reads or answers is on a clipboard
in front of them" (with its sources). Owner-facing summary: plan doc, section "Как идём дальше".

## Global constraints
- No build step; files under 300 lines; no Russian outside texts files; engine never imports app
  or rooms; every module imported somewhere (`tests/structure.test.mjs`).
- Never run Playwright/Chromium locally: check in the browser pane (`npm run serve`, desktop
  mode) and in the headset with `tools/quest-check.mjs`; the smoke test runs in GitHub Actions.
- Room 01 wording, order, the 3 s rule, the 0–100 scale with step 5 and the empty scale shown
  during the control concept stay exactly as now (`docs/rooms/01-control.md`).
- Research numbers (sources in the decision): sheet centre 1 m from the eyes, 10–15° below eye
  level, facing the eyes, world-fixed; answers with the laser (mouse on desktop); answer targets at
  least 2.5° of view (44 mm at 1 m); letters at least 1.2° (21 mm at 1 m), body text about 1.6°
  (28 mm); text is never shrunk to fit: a sheet that overflows is an error.

## Files
| File | Responsibility |
|---|---|
| **src/engine/ui/sheet-math.js** (new) | `frontPose(head, yaw)`, `letterDeg(sizeM, distM)`, constants: numbers only |
| **src/engine/ui/sheet.js** (new) | `createSheet(scene)` → `open()`, `close()`, `say(blocks)`, `choose(blocks, labels)`, `rate(blocks, scale)`, `showScale(blocks, scale)` |
| `src/engine/panel.js` | `write(..., { fit: false })` never shrinks; sets `this.overflow` |
| `src/engine/ui/choice.js`, `src/engine/ui/scale.js` | first argument may be any parent entity; buttons write `data-letter-mm` |
| `src/app/consent.js`, `src/app/left-early.js`, `src/app/lobby/lobby.js` | corridor on the sheet; the board keeps only the lab sign and "choose a door" |
| `src/rooms/01-control/room.js`, `scene.js`, `reveal.js`, `questions.js` | room 01 on the sheet; wall screen removed; reveal pages split to fit |
| **tests/sheet.test.mjs** (new) | placement math |
| `tests/smoke.mjs`, `tools/quest-check.mjs` | walk the sheet; assert no overflow, letters ≥ 1.2°, ≤ 4 answers in one column |
| `docs/engine.md`, `docs/rooms.md`, `docs/rooms/01-control.md`, `docs/mistakes.md`, `docs/vr-checklist.md` | describe the sheet; deviation 5 rewritten; mistake row with its guard |

### Task 1: placement math (TDD)
**Files:** create **src/engine/ui/sheet-math.js**, **tests/sheet.test.mjs**; add the test to `package.json` "test".
**Produces:** `frontPose(head:[x,y,z], yaw) → { pos:[x,y,z], yaw, pitch }` (three.js convention:
yaw 0 looks toward −Z); `letterDeg(sizeM, distM) → degrees`; `READ_DIST = 1.0`, `DROP_DEG = 12`,
`MIN_LETTER_DEG = 1.2`, `MIN_TARGET_DEG = 2.5`.

- [ ] Step 1: write the test.
```js
import assert from 'node:assert/strict';
import { frontPose, letterDeg, READ_DIST, DROP_DEG } from '../src/engine/ui/sheet-math.js';
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
for (const [head, yaw] of [[[0, 1.2, 0.35], 0], [[-0.2, 1.65, 2.75], 0], [[0.5, 1.1, 0], Math.PI / 2], [[1, 1.7, -1], -2.4]]) {
  const p = frontPose(head, yaw);
  assert.ok(near(dist(p.pos, head), READ_DIST), 'centre 1 m from the eyes');
  const down = Math.asin((head[1] - p.pos[1]) / READ_DIST) * 180 / Math.PI;
  assert.ok(near(down, DROP_DEG), 'a little below the eyes');
  // straight ahead in the player's yaw (three.js: yaw 0 looks along -Z)
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const flat = [p.pos[0] - head[0], p.pos[2] - head[2]];
  assert.ok(near(flat[0] * ahead[1] - flat[1] * ahead[0], 0), 'not to the side');
  assert.ok(flat[0] * ahead[0] + flat[1] * ahead[1] > 0, 'in front');
  assert.ok(near(p.yaw, yaw) && near(p.pitch, DROP_DEG * Math.PI / 180), 'faces the eyes');
}
assert.ok(near(letterDeg(0.021, 1), 1.2, 0.01), '21 mm at 1 m is about 1.2°');
console.log('sheet tests: ok');
```
- [ ] Step 2: `node tests/sheet.test.mjs` fails (module missing).
- [ ] Step 3: implement `frontPose` (centre = head + READ_DIST × (cos d · ahead, −sin d)), pitch = d so
  the sheet tilts back toward the eyes; `letterDeg = 2·atan(size / 2 / dist)` in degrees.
- [ ] Step 4: `npm test` passes; Step 5: commit.

### Task 2: panel without shrinking, buttons and scale on any parent
**Files:** `src/engine/panel.js`, `src/engine/ui/choice.js`, `src/engine/ui/scale.js`.
- [ ] `panel.write(blocks, { fit: false })`: skip the shrink loop; `this.overflow = height > H - 2·pad`.
  Default stays `fit: true` (plaques, door signs).
- [ ] `createChoice(parent, place)` / `createScale(parent, place)`: `parent.appendChild` instead of the
  scene; positions are the parent's local metres (the scene is a valid parent, so wall uses still work).
- [ ] Each answer button sets `data-letter-mm` = size / PX_PER_M × 1000.
- [ ] Browser pane: the current corridor and room still play (desktop), `npm test` green; commit.

### Task 3: the sheet
**Files:** create **src/engine/ui/sheet.js**; `docs/engine.md` row.
- [ ] Entity: board 0.60 × 0.78 m (pressboard brown), paper 0.56 × 0.72 m (cream, dark ink, heavy
  weights), chrome clip at the top. Hidden by default (`visible=false`, nothing `.clickable`).
- [ ] `open()`: pose from `frontPose(cameraWorldPos, cameraYaw)`; fade-in 0.15 s. Stays world-fixed.
- [ ] `say(blocks)` writes a page (no buttons); `choose(blocks, labels)` → Promise<index>;
  `rate(blocks, scaleOpts)` → Promise<value>; `showScale(blocks, scaleOpts)` shows an unanswered
  scale; `close()` fades out. Answers accept clicks 0.3 s after they appear (no double answers).
  Every write sets `data-text-bottom` (local) and `data-overflow` on the sheet.
- [ ] Buttons on the paper: 0.05 m high, gaps 0.025 m, full width minus margins; the 0–100 scale spans
  the paper width.
- [ ] Browser pane (desktop): open, choose, rate, close; measure letter angles; commit.

### Task 4: the corridor on the sheet
**Files:** `src/app/consent.js`, `src/app/left-early.js`, `src/app/lobby/lobby.js`, `src/app/lobby/scene.js`.
- [ ] The board shows only the sign (kicker + title) and later "choose a door"; welcome, left-early
  and the consent pages (`APP_T.consent.pages`, already split) go on the sheet, one thought per page.
- [ ] The sheet closes before the door; the door flow is unchanged.
- [ ] Smoke test and `tools/quest-check.mjs` updated for the corridor; browser pane walk; `npm test`; commit.

### Task 5: room 01 on the sheet
**Files:** `src/rooms/01-control/room.js`, `scene.js`, `reveal.js`, `questions.js`, `docs/rooms/01-control.md`.
- [ ] `say/ask/pick/writeTop` in room.js become calls on the sheet; `choice`, `lowChoice`, `scale`,
  `shownScale` are replaced by the sheet (room.js must shrink below 294 lines).
- [ ] The sheet closes for the trials (after "I'll leave now") so it never covers the stand and the
  button, and opens when the experimenter returns.
- [ ] The wall screen entity is removed from scene.js; deviation 5 rewritten ("instructions and
  questionnaire on a paper sheet, as on paper in the original; the experimenter's voice reads them").
- [ ] Reveal pages split where a page overflows (each page one thought); `tests/control-reveal.test.mjs`
  still passes. `ROOM_VERSION` 1 → 2 (presentation changed; results are not mixed).
- [ ] `paper-reviewer` agent on the room; fix what it finds; commit.

### Task 6: checks
- [ ] `tests/smoke.mjs`: on every page assert `data-overflow` is not set, every answer's letter angle from
  the camera ≥ `MIN_LETTER_DEG` and height ≥ `MIN_TARGET_DEG`, ≤ 4 answers share one column.
- [ ] `tools/quest-check.mjs` hooks the sheet instead of `#screen`; headset run 11/11.
- [ ] `docs/mistakes.md`: "too much text on one board squeezed the buttons" → guard `tests/smoke.mjs`.
- [ ] Push only on the owner's word; CI must be green; then the owner's 2–3 minutes in the headset.
