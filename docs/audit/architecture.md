# Architecture audit: b530c46..022aa72 (read only)

`npm test`: all 22 suites ok (run locally). CI: c88b648 and 0ef5f8b green; 428356c, 4343c31 and 022aa72 were still running when this was checked.

## 1. Layers: PASS
- The engine imports nothing from the app (sheet-page.js:1-4); the stamp is generic in the engine, the seal drawing is in the app (seal.js), and consent.js:27-29 puts them together.
- A second room would still copy room 01's flow, which has not changed: room.js:76-133 (phase, say, pick, ask, writeTop), 185-207 (reveal paging), 208-217 (playtest).
- engine.md:31 says "results.js used only through session.js", but room.js:24 imports compareRoom directly (audit F28, still open).

## 2. Size and focus: WEAK
- choice.js:105: buttons on the paper are drawn with panel.write's default `fit`. The canvas height is rounded (panel.js:41), so a 3-line label shrinks from 28 to 27.4 mm (655 px, 191 < 191.39), while data-letter-mm (choice.js:99) still reports 28.0. Fix: pass `fit: !fixed`, round the needed height up, and flag the overflow.
- choice.js:28-39 `linesAt` repeats the wrapping in panel.js:64-71, and LINE_HEIGHT is written twice (choice.js:22, panel.js:6). Fix: export the wrapping from panel.js.
- The adb + CDP code is written three times (quest-check.mjs:23-55, quest-look.mjs:39-75, xr-probe-run.mjs:10-30), and only quest-look sets MSYS_NO_PATHCONV. The steps that sign the form are written twice (quest-check.mjs:99-105, smoke.mjs:117-140). Fix: one tools/headset.mjs.
- smoke.mjs:49-55 writes 24, 1.375 and 2.5 as numbers, although decisions.md:105 says "one constant". MIN_TARGET_DEG (sheet-math.js:32) is used nowhere. sheet.test.mjs:26 still checks the old 1.2° size. Fix: import MIN_LETTER and MIN_TARGET_DEG and pass them in.
- Two files are close to the 300-line limit: sheet.js has 271 lines, room 01's room.js has 286.

## 3. Docs: FAIL
- engine.md:8 lists a stamp field `letter` that does not exist (sheet-page.js:90, consent.js:28). Fix: `{ size, mark, draw }` (draw returns its smallest letter).
- engine.md:9 leaves out `place.letter` (the paper mode) and the lowest edge that show() returns.
- testing.md:9 says quest-look runs "over Wi-Fi" and lists neither `open local` nor `sleep`; state.md:25-28 says the headset is on the cable.
- testing.md:5 does not name fonts.test (which now checks CAP), nor playtest, results or issues.
- mistakes.md:13 says the guard is "letters at least 1.2°"; the smoke test now uses 1.375°.
- target-architecture.md:50-51 gives the reason "shrank under the 1.2° floor". That floor is gone, and answers on paper now wrap instead of shrinking.
- research/vr/README.md:61, 03c-viewing-text.md:12,84 and 03-data.md:294 still describe MIN_LETTER_DEG = 1.2, which no longer exists.
- state.md:24-26 contradicts itself: "no laptop or cable", then "stays on the laptop's USB cable".
- docs/audit/*.md are snapshots taken at b530c46. Nothing marks which findings are fixed (F22 is half done).
- CAP is a property of the font but lives in app/brand.js:20, while FONT is in engine/panel.js. ARCHITECTURE.md:12 and :38 name neither the seal nor CAP.
- decisions.md has no entry for the form signed by hand (ink.js, 978a039), and the two-page form depends on it.

## 4. Still to build: WEAK
- Nothing on the list moved.
- choice.js got a second layout for paper (choice.js:73-82) next to the wall layout, while the decided design for questionnaires is lines with a box to tick. The wall layout is still there only for room 01 (room.js:242-245).

## 5. Reliability: WEAK
- Only a person checks the seal against seal.png, and everything in VR (writing with the laser, fps, readability), using quest-look over the owner's cable.
- data-letter-mm and stampLetterMm (sheet-page.js:56, 106) report the sizes the code declares, not the sizes drawn.
- Biggest risk: nothing runs the game in a headset in CI.

## Fixes, most important first
1. choice.js: never shrink on paper; flag the overflow.
2. Correct engine.md:8-9, testing.md:5,9, mistakes.md:13, target-architecture.md:50-51.
3. The smoke test and sheet.test take the constants from sheet-math.js.
4. Move the shared headset code into tools/headset.mjs.
5. Share panel.js's wrapping with choice.js.
6. Mark the fixed findings in docs/audit.
7. Move CAP next to FONT; update the ARCHITECTURE.md rows.
8. Correct the research notes that still say 1.2° and the contradiction in state.md; add a decision entry for ink.js.
