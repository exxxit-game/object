# Audit: the paper and the UI on it

Branch claude/workflow-testing-plan-96f413 at b530c46 (read only; nothing edited).
Paths are relative to the worktree root. The arithmetic is mine, from the constants in the files, and is shown so it can be checked.

## The root question: is the sheet one consistent scale?

It is not one scale. The sheet uses at least four references, and no document says which one a printed element follows:
1. Paper and clipboard: US Letter × 2.588 (`IN = 0.56 / 8.5`, sheet-math.js:105).
2. Text: the reading rule (24, 28 and 44 mm em at 1 m). In real typing terms the body text is 28 / 2.588 = 10.8 mm em, about 30.7 pt, on that Letter page. A 1979 typed page was Courier 72 at 12 pt or Prestige Elite at 10 pt (docs/research/vr/07-corridor-1979.md §7). So relative to the paper the text is 2.56× (pica) to 3.07× (elite) its real size. Put another way, the text alone is at about ×6.6 real (28 mm / 4.23 mm). The page holds about 34 characters × 17 lines, against 65 × 54 on a real typed page: about one sixth of the text.
3. Answer buttons: Meta's target rule (70 mm = 4°). These are modern dark chips with no 1979 form counterpart. Their letter size falls out of the button height.
4. Margins, gaps, fields and clip depths: free metres (40 mm margin, gaps of 12–40 mm, clip depths of 3–20 mm), or tied to the letter size (FIELD).

The ink line (2.2 mm) happens to sit at the text scale: 2.2 / 6.6 = 0.33 mm, a real ballpoint line.

Anything sized as "real object × the paper's scale" fails the reading rule as the seal did whenever it carries text or fine detail. A real 40 mm seal with ring text of about 3 mm becomes 104 mm with about 8 mm text. At the text's scale it would be about 230–260 mm, roughly 40–45 % of the page width.

The same failure is coming for:
- a rubber or date stamp ("RECEIVED", a date);
- a letterhead typed at 10–12 pt;
- check boxes (a real 1/8–1/4 in becomes 8–16 mm, under the 2.5° target, so the hit area must be larger than the drawn box);
- a ruled table (a real 1/3 in row becomes 22 mm, less than the 28 mm text);
- a printed rating scale (a 100 mm VAS becomes 259 mm, but its real 8–10 pt anchors become 7–9 mm);
- pictures with captions;
- handwriting lines;
- blank lengths.

The board already shows the mismatch openly. The 0.56 × 0.72 m clipboard paper hangs next to real-size A4 notices (0.21 × 0.297 m), so it reads as 2.7× a sheet of paper.

Two consistent rules are possible:
- **(a) Size every element from its smallest text.** Treat the clipboard paper as a large-print document. Each printed element is scaled by S = 24 mm / (its real smallest text em), not by the paper's 2.588. The paper keeps its Letter shape and the clipboard reads as a "large-print form".
- **(b) One uniform S ≈ 5.7–6.6 for everything on the sheet.** The visible paper then stands for a real card of about 85–99 × 109–127 mm (about 3.5–4 × 4.3–5 in), and the clipboard shrinks with it. Its size on the board would then differ from the A4/Letter notices honestly.

Either way the rule belongs in docs/decisions.md before the seal, stamp, table or scale is built. Any element marked as not meant to be read (a mark, not text) needs an explicit category, or the 24 mm rule has a silent exception.

## Findings

Each finding gives its id, file:line, category (A–F), severity, what it is, the evidence, and what would settle it.

### High

**P1. sheet-math.js:105 and sheet-page.js:9, 19–23. B. High.** The paper scale and the text scale differ by 2.56–3.07×, and no rule says which one printed elements follow (see the root question above). This is the cause of the seal failure.
- Evidence: `const IN = 0.56 / 8.5;   // metres an inch at this scale`; `title: { m: 0.044 ...}, body: { m: 0.028 ...}, soft: { m: MIN_LETTER ...}`.
- 07-corridor-1979.md §7: Courier 72 (10 pitch = 12 pt) or Prestige Elite (12 pitch = 10 pt).
- Settle: a decisions.md entry that states the sheet's scale rule (a) or (b) with its source, and a test that every printed element obeys it (for example, its smallest text em ≥ 24 mm).

**P2. src/app/lobby/scene.js:180–181 and src/app/lobby/board.js:6, 11. B/D. High.** Two paper scales hang side by side on one board: real A4 at 1:1 next to the clipboard's paper at Letter ×2.588. A4 itself contradicts the project's own research.
- Evidence: `panel="w: 0.21; h: 0.297; px: 640; decal: true"` next to the clipboard paper `PAPER = { w: 0.56, h: 0.72 }`.
- docs/research/vr/07-corridor-1979.md:148: `| Notices on A4 (board.js, ISO 216) | US Letter 8.5 × 11 in [C21] | strong |`.
- Settle: notices on Letter (C21), plus the P1 decision on the clipboard's scale. Then a side-by-side frame from the arrival spot.

**P3. src/app/lobby/lobby.js:142, 159; src/engine/ui/sheet.js:273–276. E/F. High.** Text on the hanging sheet is read from about 1.9 m, well under the reading rule. These are the "take" and "choose a door" pages, which sheet.js says carry "what the voice says, for a player without sound".
- Distance: from SPOT (0.7, 1.6, 3.05) to SHEET_HOME (−0.8, 1.446, 1.849) is 1.93 m. Body 28 mm is then 0.83° and the title 44 mm is 1.31°. 1.375° would need 46 mm.
- The sheet is seen about 51° off its face (horizontal foreshortening ×0.63) and dimmed to 0.45 (lobby.js:41).
- The smoke test checks only an open sheet: `document.querySelector('.sheet[data-open]')` (tests/smoke.mjs:40).
- Every room will hang its sheet on a hook (decisions.md:42).
- Evidence: `await sheet.take([...cover, { t: LOBBY_T.takeSheet, role: 'body', gap: 0.04 }]);`.
- Settle: measure the eye-to-hook distance and angle per room. Either size hook pages for that distance (24 mm × d) or put no must-read text on a hanging sheet. Add a smoke check for the hanging state.

**P4. src/engine/ui/choice.js:15–16, 24–31. B/E. High.** Answer letters on the sheet are set by the button height and a wall-era pixel pad, not by the reading rule. There is no lower bound.
- On the sheet: pad = round(10/682.67 × 1365.33) = 20 px and button = 96 px, so byHeight = floor(56/1.32) = 42 px = 30.8 mm. That is the most an answer can ever get.
- A wider label shrinks it with no floor. Room 01's longest answer label ("saw how the other person did it", 37 characters in Russian) must fit 615 px. At about 0.55 em per character it falls to about 30 px, roughly 22 mm, under 24 mm (estimate, not measured).
- The smoke test checks answers only at 1.2° (smoke.mjs:52: `if (deg(a.dataset.letterMm / 1000, d) < 1.2)`), not at 24 mm.
- Evidence: `const PAD_M = 10 / PX_PER_M;   // inner margin, metres`; `const SIZE_M = 54 / PX_PER_M;  // largest letters, metres`; `return Math.min(Math.floor(size), byWidth, byHeight);`.
- Settle: answer letters = body role size. Button height derived from letter + pad, at least Meta's 2.5–3°. Smoke fails answers under 24 mm em.

**P5. src/engine/ui/choice.js:51 and tests/smoke.mjs:55. C/E. High.** A wall-screen patch also applies on the sheet: more than four answers get buttons 0.8× high.
- On the sheet that gives 56 mm buttons, 27 px letters = 19.8 mm em, about 1.08° at the button's distance. That fails both 24 mm and the smoke test's 1.2°.
- Two columns are allowed from five answers on. Each column is 0.2275 m wide, which leaves 271 px for a label: about 6.5 em.
- Room 01's age question has 7 answers (src/rooms/01-control/texts.ru.js:72) and is meant to move onto the clipboard (decisions.md:42).
- Evidence: `// long lists get lower buttons so they stay on the wall screen` / `const bh = labels.length > 4 ? h * 0.8 : h;`.
- Settle: a sourced layout for long answer lists on paper (a printed list with tick boxes, or split pages). Measure each room's longest question on the sheet before moving it.

**P6. src/engine/ui/scale.js:110–111, 118, 133–159. A/B/E. High.** The rating scale is all wall-era pixels with no source, yet it says it may sit on the sheet.
- Header: "parent: the scene or any entity (the sheet)".
- Numbers are drawn at 44/54 of the label letter, so at a 24 mm label they are 19.6 mm.
- The value is 64 px. Ticks are 12/22/44 px; the bar is 1.7 × 0.3 m; the "done" button is 0.5 × 0.11 m, 0.25 m below.
- The bar is drawn at 1205 px/m (WALL_PX/WALL_W) while its "done" button is 683 px/m: `density: place.density` is undefined on walls. Two densities in one widget.
- It claims "like the paper scales of a questionnaire", but no real scale is cited. A standard VAS is a 100 mm line; the source is still to find.
- Evidence: `ctx.font = \`500 ${44 * k}px ${FONT}\`` (scale.js:145); `const WALL_W = 1.7, WALL_PX = 2048, WALL_LETTER = 54 * WALL_W / WALL_PX;`.
- Settle: a real questionnaire scale from the room's paper (length, ticks, anchors). Every text on it ≥ 24 mm em. One density.

### Medium

**P7. src/engine/ui/sheet-math.js:28–29; docs/decisions.md:44; tests/smoke.mjs:37, 52; tests/sheet.test.mjs:26; src/engine/ui/sheet-page.js:16. A/D. Medium.** There are two letter minima: 1.2° and 24 mm.
- `MIN_LETTER_DEG = 1.2` and `MIN_TARGET_DEG = 2.5` are exported and used nowhere.
- decisions.md still says "letters at least 1.2° of view (the room's current minimum: 30 px answers on the wall)". That is not research; 03-data.md:294 says so.
- The 24 mm rule (`const MIN_LETTER = 0.024;`) has no source next to it. The source exists: McKenzie & Glazier 2017, 24 dmm = 1.375° (03-data.md:109).
- Settle: one sourced constant, used by the code, the smoke test, sheet.test and decisions.md.

**P8. src/engine/ui/sheet-page.js:20–21. A. Medium.** Title 44 mm and body 28 mm have no source.
- Google's dmm table (unverified secondary, 03-data.md:110) gives title 32 and body 24. Dingler 2018 gives preferences, not these numbers.
- Evidence: `title: { m: 0.044, ...}`, `body: { m: 0.028, ...}`.
- Settle: a source in docs/research, or a headset measurement recorded there.

**P9. src/engine/ui/sheet-page.js:44; src/app/consent.js:25, 29–30; src/app/left-early.js:66; src/app/lobby/lobby.js:142, 147, 159; src/engine/ui/sheet.js:388. A/D. Medium.** Paragraph gaps are seven different metre values spread across app code, with no source and no link to the line pitch. Every room will copy the pattern.
- Values: 0.012, 0.014, 0.018, 0.02, 0.025, 0.03 (UNDER_TEXT), 0.04.
- A typed form spaces by whole lines (6 lines per inch on a typewriter).
- Evidence: `{ t: F.agree, role: 'body', gap: 0.018 }, { t: F.known, role: 'soft', gap: 0.014 }`; `gap: i ? 0.012 : 0.025`; `gap: 0.04`.
- Settle: gaps as named multiples of the line pitch, defined once in sheet-page.js roles and sourced from typing practice.

**P10. src/engine/ui/sheet-page.js:12. A/B. Medium.** `MARGIN = 0.04` has no source. A typed Letter page has 1 in margins, which at the paper's scale is 66 mm. The same value is also the buttons' lowest edge.
- Settle: a typing manual's margin × the chosen scale (P1).

**P11. src/engine/ui/sheet-page.js:24–26, 60–61. B/F. Medium.** Handwriting fields are sized from the printed letter and reach into the line above, so ink can land on printed text.
- The field top is the line top − 1.0 em. Line pitch is 1.32 em plus the block gap (0.012 m = 0.43 em), so the field covers about the lowest 0.25 em of the previous line.
- When a blank wraps to the second line of a paragraph (gap 0, possible in a longer language), it covers about 0.68 em.
- Evidence: `const FIELD = { above: 1.0, below: 0.35, side: 0.3 };` with "(people write above the line)" and no source.
- Settle: a forms-design standard for writing space (line height for handwriting, signature line). Clip fields to the space between printed lines; test for overlap.

**P12. src/app/texts.ru.js:183, 186 and src/app/lobby/texts.ru.js:193. A/E. Medium.** A blank's length is the number of underscores a translator types × the font's underscore advance × the body size. It is not a real form's name or signature line, and another language's translator can change it.
- Evidence: the form's name blank (22 underscores), its signature blank (22) and the cover's participant blank (20), in src/app/texts.ru.js and src/app/lobby/texts.ru.js.
- Settle: real blank lengths from forms practice × scale. Draw the line by the engine at a set length rather than from a character count.

**P13. src/engine/ui/sheet-page.js:10; src/app/lobby/board.js:11; src/engine/ui/choice.js:9. A/E. Medium.** The paper colour is brighter than the limit the research recorded, and it is drawn unlit at full brightness while read.
- Evidence: `PAPER_BG = '#e9e2cf'; // cream, not white: a large white page glares in a headset`. 233 and 226 are above 0xDA = 218.
- docs/research/vr/01-meta.md:56 says "light backgrounds no brighter than #DADADA", and :232 says "paper ≤ #DADADA, ink ≥ #1A1A1A".
- Button text `#f2efe8` is also above #DADADA. Ink `#1d1b17` has a blue channel of 0x17, under 0x1A.
- board.js copies the paper colour by hand (`const PAPER = '#e9e2cf';  // the clipboard's paper (src/engine/ui/sheet.js)`), and its comment points to the wrong file.
- Settle: Meta "Color" page values, and a real paper shade if one is wanted. Use one exported constant.

**P14. src/app/lobby/lobby.js:38–41; src/app/lobby/exit.js:13; src/engine/ui/sheet.js:184–187. C. Medium.** Print is drawn unlit, then dimmed by constants picked by eye. That moves the symptom (a glowing page) instead of the cause (the paper ignores the scene's light).
- Evidence: `const WALL_PRINT_LIGHT = 0.45;` "(chosen by eye in rendered frames ...)"; `const HOVER_LIGHT = 0.75; // ... (our choice)`.
- The planned lighting step will make 0.45 wrong silently. The read sheet is always at 1.0, whatever the room's light.
- Settle: derive the tint from the measured light at the hook (the smoke test's lightAt light meter), or use a lit material with an emissive floor. Record the source.

**P15. src/engine/ui/choice.js:7–8, 85–86; src/engine/ui/sheet.js:146, 279; src/app/lobby/exit.js:13. A/D. Medium.** Hover feedback is colour only: buttons go from #1d2026 to #343b47, the hanging board darkens to #6e5038, the poster brightens.
- docs/research/vr/01-meta.md:136: "Focus indicators visible and distinct from hover/selected; ≥2 px; not colour only — For us: hover on clipboard buttons should change shape/outline, not only colour".
- The hover colours have no source.
- Settle: Meta Accessibility page. A ≥ 2 px outline or shape change, the same on every clickable thing.

**P16. src/engine/ui/sheet.js:159–161; src/engine/ui/sheet-math.js:112–115; src/app/lobby/scene.js:180. D/C. Medium.** Paper is laid on a surface two ways: notices lie on the cork as decals (polygon offset), while the clipboard's paper floats 4 mm in front of its board.
- That is under the 5 mm flicker rule the same code cites (sheet-math.js:161–162, lobby.js:35). At ×2.59 it is a 1.5 mm real air gap under the clip.
- Evidence: `position="0 ${(BOARD.top - BOARD.bottom) / 2} ${-BOARD.d / 2 - 0.004}"`; "(4 mm behind the paper)".
- Settle: paper as a decal on the board, as the notices are, and a side-view frame.

**P17. src/engine/ui/sheet-math.js:107–110; src/engine/ui/sheet.js:162–166. B. Medium.** The clip mixes scales. Widths and heights are scaled inches from the photo; depths and small parts are absolute metres with no source.
- Evidence: `jaw: { w: 0.6 * BOARD.w, h: 0.7 * IN, y: 0.36, d: 0.005 }`, `hump: { ... d: 0.02 }`, `ring: { ... z: 0.01 }`.
- sheet.js: rivets `radius="0.005" height="0.003"`, `corner: 0.004`, `radius: 0.008`, ring `depth: 0.003`.
- Settle: measure the clip in the catalog or photo (C20, Wikimedia Clipboard.jpg) and scale every dimension by IN.

**P18. src/engine/ui/sheet-math.js:105–110 and src/engine/ui/sheet-page.js:9. D/A. Medium.** The paper size is hard-coded twice and is not quite Letter.
- `IN = 0.56 / 8.5`, and `0.36` (= PAPER.h/2) appears in BOARD and CLIP instead of importing PAPER.
- At its own scale, 11 × IN = 0.7247 m, so the 0.72 m paper is 5 mm short of Letter.
- A fix of P1 that changes PAPER would leave the board and clip at the old size with no test failing.
- Settle: one PAPER constant that both files read, and a test that the board is 9 × 12½ in at the paper's scale.

**P19. src/engine/ui/sheet.js:239–241. C/F. Medium.** The calm-arrival fix covers only a sheet with a hook. Without one, the sheet still pops up at 1 m in 150 ms, which docs/mistakes.md:25 forbids ("popped up in 0.15 s right in front of the player").
- Evidence: `if (home) { comeToPlayer(); return; } place(); el.setAttribute('animation', { property: 'scale', from: '0.94 0.94 0.94', to: '1 1 1', dur: 150 });`.
- Any room that calls say/choose before hang gets the pop.
- Settle: decisions.md "The opening is calm" and Meta's looming guidance. Either require a hook or fade in. Add a test.

**P20. src/engine/ui/sheet-page.js:11; src/engine/ui/choice.js:10–14; src/engine/ui/ink.js:231. B. Medium.** The sheet's pixel density comes from a wall canvas (1024 px over 1.5 m, doubled), not from the headset's pixels per degree.
- Evidence: `DENSITY = 2 * 1024 / 1.5;   // canvas px per metre: sharp when read from 1 m (choice.js)`. The comment refers to choice.js, which in turn has no source.
- ink.js repeats `px: { default: 1365 }` by value.
- Quest 3's ppd is not in docs/research. About 25 ppd would mean about 1432 px/m at 1 m (unverified).
- Settle: Meta's Quest 3 ppd in research; density = ppd / (1 m × tan 1°); one constant.

**P21. src/engine/ui/sheet-math.js:27. A. Medium.** `DROP_DEG = 12` has no source for placing content.
- docs/research/vr/03-data.md:293: "no read source states 12° for content ... Needs a cited source or a headset check".
- The code comment still says "Research ...: a little below the eyes".
- Settle: a headset preference check, or adopt Google's 6° or HFES 15–20° with the source written.

### Low

**P22. src/engine/ui/sheet-page.js:46; tests/smoke.mjs:48; src/engine/ui/choice.js:82 with panel.js:97. C. Low.** The 24 mm guard reads the role table, not what was drawn, so it can fail only if ROLES change.
- It cannot see the hanging distance (P3) or a path that skips roles.
- Answer panels call `write` with fit on by default, so they can shrink silently while `data-letter-mm` reports the unshrunk size.
- Evidence: `el.dataset.letterMm = (Math.min(...blocks.map((b) => ROLES[b.role || 'body'].m)) * 1000).toFixed(1);`.
- Settle: report the drawn size, the real distance and the angle from the panel.

**P23. src/engine/ui/sheet-page.js:82–84; src/engine/ui/sheet.js:344–345. D. Low.** A page is laid out two ways.
- `show()` checks button fit with the full BUTTON_H and GAP, while choice draws 0.8 h for more than four answers.
- `interrupt()` lays out by hand (`const top = pg.paint(blocks) - UNDER_TEXT;` then `choice.show`) with no overflow check.
- Settle: one layout function for every page.

**P24. src/engine/ui/choice.js:17. A. Low.** `MIN_GAP = 0.01` (10 mm) is under Meta's 12 mm between interactables (01-meta.md:53).
- It cannot be reached on the sheet, where `show()` flags overflow first, but it can on walls.
- Settle: 12 mm, from Meta "Inputs and hit targets".

**P25. src/engine/panel.js:6; src/engine/ui/choice.js:19, 21; src/engine/ui/ink.js:210–214, 325. A. Low.** Several numbers have no source or measurement:
- `LINE_HEIGHT = 1.32`, and choice.js copies it by value.
- `READY_MS = 300`.
- `LINE_M = 0.0022` "wide enough to see from 1 m". It is 0.33 mm real at the text scale and 0.85 mm at the paper scale.
- Ink `#1f3a93`.
- 1€ filter values `MIN_CUTOFF = 1.5, BETA = 30, D_CUTOFF = 1`, unmeasured; Casiez et al. 2012 give a tuning procedure.
- `STEP_M = 0.0005`, and `written()` ≥ 0.01 m.
- Settle: a source or a recorded measurement for each.

**P26. css/hint.css:35 and src/app/left-early.js:72–101. D. Low.** The same question ("go back / learn what it was") appears as a DOM box in system-ui and, on the next visit, on the sheet in Inter.
- A DOM box is right outside VR, but its face and look differ.
- Evidence: `font: 20px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;`.

**P27. tests/smoke.mjs:91. B. Low.** Wall answers are checked in canvas pixels (`sizes[0] >= 30`), which depend on density, not in mm or degrees.

**P28. tests/smoke.mjs (whole file). E. Low.** Nothing measures how much room a page has left. The smoke test runs only in Russian, and the consent form page is the fullest, so a longer language will overflow with no warning beforehand.
- Settle: log data-text-bottom per page, and add a pseudo-localised run with text 30 % longer.

**P29. src/engine/ui/ink.js:254–259. F. Low.** `held()` returns true for any input without a gamepad. With hand tracking the pen lifts only on mouseup or leaving VR. This was not checked in the headset with hands.
- Evidence: `return !pad || !!(pad.buttons[0] && pad.buttons[0].pressed);`.

**P30. src/app/lobby/board.js:41–43. A. Low.** Flyer letters are sized in pixels of a 640 px A4 canvas (64/40/56 px = 21/13/18 mm em), not from a real typed notice (12 pt) or the reading rule.
- The joke intends the flyer to be unreadable from across the corridor. That is fine, but it is not written as a decision.

**P31. src/engine/ui/sheet.js:214. C. Low.** `setTimeout(place, 50)` after a recenter or move is a timing fudge with no stated cause.

## Checked and sound

- Reading distance 1 m: Meta "Display", "1 meter is a comfortable distance for menus" (01-meta.md:49).
- Button height 70 mm = 4.0° at 1 m: passes Meta's 2.5–3° and Google's 3.67° (03-data.md:123–124).
- Button gap 25 mm: at least Meta's 12 mm between interactables (01-meta.md:53).
- Paper width 0.56 m at 1 m spans ±15.6°, about ISO 9241-306's ±15° "at a glance" (03-data.md:71).
- Clipboard 9 × 12½ in, ⅛ in hardboard, brown, clip after the photo: C20 (School Specialty) and Wikimedia Clipboard.jpg (sheet-math.js:98–104; 07-corridor-1979.md §6).
- Inter (sans, high x-height, no italics): Meta "Typography" and decisions.md "a face of its own". tests/fonts.test.mjs covers every character of every text file.
- Contrast, computed from sRGB relative luminance; all above Meta's 4.5:1 (01-meta.md:55):
  - ink #1d1b17 on #e9e2cf: about 13.4:1;
  - soft #4a453c on the same paper: about 7.4:1;
  - button text #f2efe8 on #1d2026: about 14:1.
- Soft text 24 mm = 1.375° and body 28 mm = 1.6° at the reading spot: Google's 24 dmm "comfortably readable body text" (03-data.md:109).
- One letter size per answer set (choice.js commonSize): avoids bias (mistakes.md:12).
- On the sheet, overflow is an error, never a shrink (`fit: false`, sheet-page.js:45; smoke fails data-overflow). An orphaned blank is caught (panel.js:103).
- Ink smoothing method: the 1€ filter, Casiez, Roussel & Vogel 2012, CHI (the method is sourced; its values are not, see P25).
- Glide: at least 1 s, eased, on an arc, never nearer than 0.5 m, started by the player (Meta looming, Ball & Tronick 1971, Android XR). Side and drop are honestly marked "our choices, to be checked in the headset".
- Line length at body size: about 34 characters (estimate, not measured), at the lower edge of Dingler 2018's preferred 40 ± 6.5.
