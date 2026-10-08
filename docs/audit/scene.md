# Audit: corridor scene and its objects (read only)

Scope read in full: src/app/lobby/{plan,scene,board,sign,exit,extinguisher-label,opening,stairs-sign,texts.ru}.js,
src/app/{brand,logo}.js, src/engine/{door,shapes,surface,tile-math,lightbox,cable,merge-static,mirror,reflect-env}.js,
tests/{standards,masonry,tiles,plaque}.test.mjs, parts of tests/sheet.test.mjs, src/engine/ui/sheet-math.js (clipboard
size), src/app/lobby/lobby.js (lights, arrival spot). Sources checked: docs/building-standards.md, docs/decisions.md,
docs/research/vr/07-corridor-1979.md, 03-data.md / 03c (text size), docs/vr-checklist.md, docs/art/credits.md,
docs/mistakes.md.

Measurements I made (not from memory):
- Inter cap height read from the shipped font file (vendor/fonts/inter-latin-wght-normal.woff2 and the cyrillic file,
  OS/2 table, script in scratchpad capheight.mjs): unitsPerEm 2048, capHeight 1490 = **0.7275** of the font size
  (x-height 1118 = 0.546).
- Ceiling grid origin computed with the engine's own tile-math: jointOrigin(0.7, 14.6, 0.6096) = 0.7 (a joint on the
  corridor's centre line); across: 3.0048 (a tile centred on the centre line).
- Camera near plane: none set anywhere in the repo, so A-Frame's default (0.005 m) applies.

## Findings

### S1 — The clipboard on the corridor board is 2.6x real size, hung among real-size things (B, high)
- Where: src/engine/ui/sheet-math.js:13-14 (`const IN = 0.56 / 8.5;   // metres an inch at this scale`,
  `BOARD = { w: 9 * IN, ... }`), src/app/lobby/plan.js:26 (`board: { x: -0.8, y: 1.5, w: 1.6, h: 1.0, hook: 1.92, ... }`),
  plan.js:36 (SHEET_HOME), scene.js:180-181 (A4 notices 0.21 × 0.297 at 1:1).
- What: the same seal mistake, in the corridor itself. The clipboard is scaled for reading (an "inch" = 65.9 mm, board
  0.59 × 0.82 m, ring radius 26 mm), but it hangs on a real-size peg (radius 5 mm), on a tackboard, beside real-size A4
  notices and a real-size extinguisher. The tackboard size (1.6 × 1.0 m) and the peg height (1.92 m) were then chosen
  to fit the enlarged clipboard (computed: the clipboard spans y 1.07 to 1.99 on a cork field 1.044 to 1.956), so the
  oversize spreads into objects that have their own real sizes. Nothing written states which objects may be enlarged
  for reading and what they look like when not being read.
- Settle: one written rule for "reading scale vs real scale" (e.g. the object is real size on the wall and only its
  reading view is enlarged, or every print object follows the same scale); real clipboard 9 × 12-1/2 in (07, C20);
  tackboard catalog sizes (07, C19; S21).

### S2 — Notices are A4, the period source says US Letter (B, high)
- Where: scene.js:179-181 (`<!-- A4 sheets (ISO 216) pinned beside the clipboard -->`, `panel="w: 0.21; h: 0.297"`),
  tests/standards.test.mjs:53-55 (`'notices A4'`), docs/building-standards.md row "Notices".
- Evidence: docs/research/vr/07-corridor-1979.md §7 and its conflict table: "A university notice of 1979 is Letter, not
  A4" [C21, opened], marked **strong**. The clipboard on the same board is Letter-shaped. Two paper standards on one
  board, and the test guards the wrong one.
- Settle: C21 (8.5 × 11 in = 0.2159 × 0.2794 m); change the test to Letter.

### S3 — Troffers straddle the ceiling grid by half a tile (B, high)
- Where: scene.js:75 (`const TROFFERS = [-4.572, -1.524, 1.524, 4.572].map((d) => r(CENTRE.x + d));`), scene.js:66-72,
  comment scene.js:153-155 ("each filling two cells of the ceiling grid").
- Evidence: the grid has a joint at CENTRE.x (computed: jointOrigin = 0.7). 1.524 m = 2.5 tiles and 4.572 m = 7.5 tiles,
  so every 2-tile troffer is centred mid-tile and both its ends fall 0.3048 m from a joint (computed for all four).
  The spacing itself ("10 ft apart") is listed "Not verified: ... troffer spacing" in building-standards.md. Placed
  against the corridor's centre instead of the grid it lies in.
- Settle: lay-in troffers sit in grid openings (S9, S10, S20); a test that troffer edges lie on ceiling joints; a source
  for spacing (or the S13 light level as the driver).

### S4 — Ceiling grid face drawn at half the standard width (A/B, high)
- Where: src/engine/surface.js:62-69 (`ctx.lineWidth = 10; ctx.strokeRect(0, 0, SIZE, SIZE);` on a 512 px canvas per
  0.6096 m), grid colour `'#9d9a92'`.
- Evidence: a stroke on the canvas edge shows 5 px on each side, 10 px per joint = 11.9 mm. building-standards.md says
  "suspended grid 24 × 24 in, 15/16 in (24 mm) face ... | same". Every room's ceiling uses this drawing. Grid colour has
  no source (S10's standard finish is not cited).
- Settle: S10 datasheet (face width and finish); a test deriving joint width from GRID and lineWidth.

### S5 — Rail at 0.8 m with a darker paint band below: no source anywhere (A/B, high)
- Where: scene.js:37-38 and 50-51 (`height="0.8" ${BLOCK(PAINT.below)}`, rail `height="0.025" depth="0.012"
  color="#4a3b2c"` at y 0.8); the same in src/rooms/01-control/scene.js:41 ("a darker band below a wooden rail at
  0.8 m (on a joint)").
- Evidence: not in building-standards.md, 07, or decisions.md. Its height is set by a block joint (a rendering
  convenience), not by a rail standard or period practice. Already copied into room 01.
- Settle: a period source for chair/bumper rails and two-tone paint in 1970s institutional corridors (07 Gap 1: a
  period photo), or remove.

### S6 — Every surface colour of the corridor is unsourced (A, high)
- Where: scene.js:17 (`const PAINT = { wall: '#8a9479', below: '#5d6650', end: '#858f74', endBelow: '#59624c' };`),
  surface.js:51 (VCT `'#6b6257', '#615950'`), surface.js:63 (ceiling `'#cfcbc0'`), scene.js:39 (base `#2b2d29`),
  door.js:57 (leaf `color: #6a5641`, wood-brown although the leaf data is Steelcraft hollow metal, S2), door.js:15
  (frame `#3d3a34`).
- Evidence: 07 lists "wall paint colours of block corridors, cove base, ceiling tile pattern" as **unverified**. The end
  walls get a different tint from the long walls (#858f74 vs #8a9479): lighting faked in paint (also C).
- Settle: period finish sources (Armstrong Excelon colour card 1973-80 for VCT, C25; a paint maker's institutional
  colour card of the 1970s; Steelcraft/wood door finish; a period photo).

### S7 — Ceiling height 2.5 m is unverified and is a literal, not in the plan (A/D, high)
- Where: scene.js:36, 41, 49, 70-71, 143 (`height="2.5"`, `1.25`, `2.35 ... height="0.3"`, `2.49`, `2.475`, ceiling
  `2.5`); plan.js:1 claims to be "the one source of every place in the corridor".
- Evidence: building-standards.md "Not verified ...: 1970s ceiling height". Ten literals derive from it by hand.
- Settle: a period source for a 1970s university corridor ceiling; then PLAN.ceiling and derive the rest.

### S8 — Paint band 3 mm off the wall, base face 2 mm off the band: against the project's own 5 mm rule (C/D, medium)
- Where: scene.js:37 (`position="${c} 0.4 ${r(z + out * 0.003)}"`, over the wall plane at z), scene.js:39 (base box
  centre z+0.0025, depth 0.005 → face at 5 mm, i.e. 2 mm in front of the band), scene.js:50, 52 (end walls).
- Evidence: docs/vr-checklist.md:21 "keep faces at least 5 mm apart"; the base was made 5 mm thick for exactly this
  (building-standards.md "5 mm keeps it from flickering against the wall"), but the band added later in front of the
  wall ate 3 mm of it. With near = 0.005 m the depth step at 14 m is about 2.3 mm (computed, 24-bit depth), so the
  far end wall's band and base are at the edge.
- Settle: draw the upper wall from 0.8 to 2.5 m only (no overlapping planes), or keep 5 mm; a test that finds parallel
  overlapping faces closer than 5 mm.

### S9 — The light box's sign face floats 2 mm off the box (C/D, medium)
- Where: scene.js:169 (box `position="... 2.302 1.845" ... depth="0.09"` → front at z 1.890), scene.js:171-172
  (`#signFace` at z 1.892, `panel="w: 0.94; h: 0.16; px: 1024; bg: #160f05"`, no `thick`, no `decal`).
- Evidence: the door signs use `thick` (door.js SIGN_GAP 6 mm) and the notices `decal`; this one does neither, 2 mm apart
  (vr-checklist.md:21). The player looks at it for 20 s in the opening.
- Settle: `thick` or `decal` like the other prints.

### S10 — Four ways to put a print or plate on a surface; two break the 5 mm rule (D, medium)
- Where: scene.js:113 (`id="extLabel" ... radius="0.0905"` over the shell `radius="0.089"`: 1.5 mm); door.js:59
  (kick plate `lz(0.0458)`, `depth="0.0015"` over the leaf face at LEAF.t 0.045: its face 1.55 mm off the leaf, on every
  door); door signs: panel `thick`; notices: panel `decal`; light box face: plain offset (S9).
- Settle: one method (decal / polygonOffset for thin real plates, or `thick`), and a guard test.

### S11 — Sign letter sizes use "a capital is about 0.7 of the font size" from memory; the font says 0.7275 (A/C, medium)
- Where: src/app/brand.js:17-21 (`SIGN.number = Math.round(inch(2) * SIGN.px / 0.7);`), tests/masonry.test.mjs:114
  (`assert.equal(SIGN.number, Math.round(0.0508 * SIGN.px / 0.7), 'a room number 2 in high');`).
- Evidence: Inter capHeight/unitsPerEm = 1490/2048 = 0.7275 (read from the vendored file). The number is 186 px at
  2560 px/m = 72.7 mm em → 52.9 mm cap = 2.08 in, over the ADA 703.2.5 maximum of 2 in the code says it meets; the
  stairs word is 19.9 mm vs 3/4 in (19.05). The test restates the code's own 0.7, so it cannot catch it (rule 11/20).
- Settle: read capHeight/unitsPerEm from the font file in a test; size so cap ≤ 50.8 mm.

### S12 — Readable corridor text is real-world size and nothing checks it at the player's distance (E/F, medium)
- Where: board.js:41-43 (flyer `size: 64 / 40 / 56` on a 640 px, 0.21 m sheet = 3048 px/m), board.js:57-62 (tab words
  ≤ 38 px), extinguisher-label.js:22-32 (`46px`, `24px`, `22px`, `25px`, `17px` on 420 px over 0.155 m = 2713 px/m),
  stairs-sign.js:21 (`SIGN.letters` = 70 px at 2560 px/m).
- Evidence (em, and the farthest distance where it still meets the sheet's 24 mm-at-1 m floor, 1.2-1.375°; 03-data.md):
  flyer body 13.1 mm (0.55 m), punch line (the flyer's last line) 18.4 mm (0.77 m), tab words ≤ 12.5 mm (0.52 m); extinguisher
  label agent 17 mm (0.7 m), steps 9.2 mm (0.38 m), small print 6.3 mm (0.26 m); stairs word 27.3 mm (1.14 m). The
  arrival spot (lobby.js:33, z 3.05) is about 1.2 m from the board and 1.5 m from the extinguisher; the clipboard is taken
  by laser, so most players never come within 0.55 m. The flyer's joke needs reading. tests/smoke.mjs:48 checks only the
  sheet. The stairs word is fine from the arrival spot (0.7 m) but not from the far side of the corridor (1.6 m).
- Settle: decide per item whether it is meant to be read; for those that are, the 03c floor at the measured normal
  distance, and a test over every canvas text in the corridor.

### S13 — The flyer's print is ~3x real relative to its 1:1 paper (B, low)
- Where: board.js:41-43 (title 64 px = 21 mm em ≈ 60 pt; body 40 px = 13 mm ≈ 37 pt on real-size A4).
- Evidence: the same two-scale sheet as the seal: paper 1:1, print enlarged; anything real-size drawn on it later (a
  stamp, a photo) will look tiny. 07 C22: a typed 1979 notice is 10/12 pitch typewriter.
- Settle: follows from S1's rule.

### S14 — Tackboard size, body and height are not from a source (A/B, medium)
- Where: plan.js:26 (`w: 1.6, h: 1.0`, `y: 1.5`, `body: 0.03`), scene.js:158.
- Evidence: building-standards.md "1.6 × 1.0 m (ours: its edges on the block joints)"; catalog sizes are 3 × 4 ft and
  4 × 6 ft (07, C19); S21 says "cork on hardboard", but the code has a 30 mm "aluminium body" (no source); no mounting
  height source. Sized against the block grid and the enlarged clipboard (S1), not a catalog.
- Settle: S21/C19 sizes and backing; a mounting-height source (e.g. the VA spec's installation clause).

### S15 — An invented threshold (MIN_GAP 40 mm) decides the sizes and heights of things on walls (A/C, medium)
- Where: tests/masonry.test.mjs:17 (`MIN_GAP = 0.04`, "MIN_GAP is our choice"), :73-76 (the light box exemption).
- Evidence: this rule is why the board is 1.6 × 1.0 on joints, the rail is "on a joint" at 0.8, the light box top is on
  the 2.4 joint, and the switch sits at 1.1 m (building-standards: "ours: inside one course") instead of the 42 in
  standard (S1, S15). Geometry a standard answers is moved to suit a perception threshold no source gives.
- Settle: a masonry/fixture source (S24 says boxes are notched into the block, so joints near edges are normal); or a
  measured headset check of the "stub" effect.

### S16 — The corridor's light is one fake point light tuned to pass the test (C, medium)
- Where: scene.js:177 (`id="corridorLamp" light="type: point; ... distance: 0; decay: 0.8" position="-0.2 2.3 ..."`),
  src/app/lobby/lobby.js:48 (`CORRIDOR_LIGHT = { '#corridorAmbient': [0.26, 0], '#corridorLamp': [0.4, 1.6] }`).
- Evidence: x -0.2 is under no troffer (they are at -3.872, -0.824, 2.224, 5.272); decay 0.8 is not physical (2);
  the troffer lenses glow but light nothing. The smoke test's 0.1-0.2 desk ratio (S13) is met by tuning this one light.
  Known as queue step 5 (lighting), listed for completeness.
- Settle: lights at the troffers, physical decay, output from F40T12 lumens (S14) to the S13 foot-candles.

### S17 — Places derived by hand and duplicated as literals (D, low)
- Where: sign.js:11 (`export const SIGN_AT = { x: 0.7, y: 2.3, z: 1.86 };` vs PLAN.entrance and the box at 2.302 /
  1.845-1.892); scene.js:169-174 (`2.302 1.845`, `1.892`, signLight `1.95 2.25`); scene.js:162-163 (pins
  `B.x - 0.4748`, `1.7364`, `B.x + 0.4736`, `1.5565`, hand-computed from the sheets' poses at :180-181); scene.js:178
  (`repeat: 3.024 1.824` = 2 × the cork size); FRAME_OUT 0.0112 in scene.js:24, as a literal in plan.js:62 and implied by
  door.js:34 (0.0143) and :49-51 (0.051).
- Evidence: if the plan or a sheet moves, these stay (the sound source, a pin in the air).
- Settle: derive from PLAN, door.js constants and the sheet poses.

### S18 — Door signs: NIU geometry, but the game's own colours and face; a modern standard for a 1979 hall (A/B, medium)
- Where: brand.js:5-8 (`accent: '#d9a441'`, `plate: '#15161a'`), brand.js:31 (`weight: 700, color: BRAND.accent,
  spacing: 8`), stairs-sign.js:22 (`letterSpacing = '4px'`).
- Evidence: decisions.md says the signs are "taken from one university standard, not drawn by us", but colour, typeface
  and spacing are ours. 07 §2: the latch-side/ADA rules are 1980s+; "Room sign material and size in 1979: unverified".
- Settle: the NIU program's colour and typeface clauses (S25), or a 1979 sign source (07 Gap 6).

### S19 — Extinguisher details rest on a photo the repo does not keep (A, medium)
- Where: scene.js:93 (`const FORK = { t: 0.006, y: 1.437, back: 0.024, front: 0.03, out: 0.031, prong: 0.008, tip:
  0.004, rise: 0.008 };`), :95 (`const z = wall - 0.03 - 0.089;` 30 mm wall standoff), :102-104 (strap 0.035 × 0.14 ×
  0.003, screws r 0.005), :114-122 (valve 0.06 × 0.03 × 0.045, lever 0.12 at -6°, gauge r 0.019/0.014, hose r 0.009,
  nozzle r 0.011 × 0.06); extinguisher-label.js:9-32 (layout px); plan.js:27 (`extinguisher: -0.8`, "opposite it").
- Evidence: decisions.md: "a seller's photo of a 1972 General WS-900 the owner found"; 07 C16: "search; fetch 403";
  docs/art/credits.md has no entry for it. Shell size and heights are sourced (S22, S23); the rest is eyeballed.
- Settle: keep the photo/URL in docs/art/credits.md, scale its parts from the 7 in shell; a 2.5 gal wall hook drawing
  for the bracket; NFPA 10 travel distance for placement.

### S20 — Light box: "(ours)", and the doc and code disagree on its size (A/D, low)
- Where: scene.js:169-172 (1.0224 × 0.196 × 0.09; face 0.94 × 0.16); building-standards.md row "Light box over a door":
  "(ours) as wide as the masonry opening, 1.0 × 0.2 m".
- Settle: an "IN SESSION" lighted sign product sheet; make the table match the code.

### S21 — Walking bounds: a special case for one wall (C, low)
- Where: plan.js:69-70 (`// where the head may go: 0.3 m from the long walls and ends, 0.25 m from the stairs' wall`).
- Settle: one padding value from Meta/WebXR guidance, or the reason written.

### S22 — Engine default tile grid is room 01's (C/F, medium)
- Where: src/engine/surface.js:156-158 (`// (default: room 01, 3.2 × 3.2 m around the origin)`,
  `space: { type: 'vec4', default: { x: 0, y: 0, z: 3.2, w: 3.2 } }`).
- Evidence: a new room's wall or floor that omits `space` silently gets room 01's joints (wrong cuts at its own edges),
  with no error; the engine encodes one room's size.
- Settle: make `space` required for gridded kinds (warn/throw), a test.

### S23 — Block joints narrower than real, and half width at every texture seam (A/D, low)
- Where: surface.js:34-46 (`ctx.lineWidth = 2;` on 512 px per 1.6 m = 6.25 mm; the bed joint at the seam, y = 0, shows
  1 px and none is drawn at y = 512).
- Evidence: a 3/8 in (9.5 mm) mortar joint is the CMHA norm (S11/S12); every 8th course reads thinner.
- Settle: S11/S12 joint width; draw seam lines half on each edge.

### S24 — Door builder numbers without a source (A, low)
- Where: door.js:33 (`depth = ... + 0.02`, frame 10 mm proud of each face), :56 (leaf 10 mm in from the room face,
  `room + s * 0.01`), :52-54 (stops at 0.063), :46-47 (closer box 0.28 × 0.055 × 0.06), :18 (`CHROME` "our choice of
  look", where BHMA 626 satin chrome answers it).
- Settle: Steelcraft frame profile drawings (S2), LCN 4040XP body dimensions (S18), BHMA finish 626.

### S25 — EXXXIT letterforms are invented (A, low)
- Where: src/app/logo.js:32-33 (`const WIDTHS = { E: 0.56, X: 0.66, I: 0, T: 0.62 }; const STROKE = 0.17, GAP = 0.2;`),
  board.js:26 (`s = W * 0.72, cap = W * 0.13, gap = H * 0.08`).
- Evidence: the mark is the official drawing (sound), but the word is drawn by us; 07 C8 gives exit lettering (6 in
  letters, 3/4 in strokes = 0.125 ratio), not used.
- Settle: the NFPA 101-1970/OSHA exit lettering proportions or a named typeface.

### S26 — Text that does not fit is not caught in two places (F, low)
- Where: stairs-sign.js:21-26 (fixed 70 px, 4 px spacing, no fit), extinguisher-label.js:22-32 (fixed px per line);
  the light box (lightbox.js:46-49) and the flyer tabs (board.js:60-63) do shrink to fit.
- Evidence: fine in Russian today; another language's word or line can run off the sign or label silently.
- Settle: the same fit rule, or a test that measures every texts file's lines.

### S27 — Builders that work on one wall only (F, low)
- Where: scene.js:94-95 (`function extinguisher(x, wall) { const z = wall - 0.03 - 0.089;`) and :113 (`theta-start="131"`
  faces -z only); the board (plan.js:33, scene.js:158) on PLAN.north only.
- Evidence: called with the north wall the extinguisher would stand inside the wall, label to the wall. Rooms will copy
  these builders.
- Settle: a facing argument as FACE does for walls and doors.

### S28 — Tests hard-code geometry the plan owns; one tolerance looks bent (C, low)
- Where: tests/standards.test.mjs:27 (`near(pos(t)[2], 1.7) || near(pos(t)[2], 3.7)`), :150 (`pos(t)[2] < 1.9`);
  tests/masonry.test.mjs:21-25 (`z: [1.79, 1.95]`, `[3.5, 3.85]`), :36 (regex on `1\.1021 ... 2\.2042`), :46 (`0.0143`),
  :99 (`[1.6, -1]`), :104 (`gap >= -0.0011`: a back may sit 1.1 mm inside the wall, reason not written).
- Settle: read from PLAN/door.js; write why -1.1 mm or tighten to 0.

### S29 — The clipboard's "Letter-shaped" paper is not Letter-shaped (D, low)
- Where: sheet-math.js:8 and :14 (`0.56 × 0.72 m`, `top: 0.36 + ...`).
- Evidence: 0.56 × 11 / 8.5 = 0.7247 m, not 0.72 (4.7 mm short); the hang height (plan.js:36) follows from it.
- Settle: C21 ratio.

### S30 — Troffers hang below the ceiling like surface fixtures; their look is ours (A/B, low)
- Where: scene.js:70-72 (box 2.48-2.50, lens at 2.475, `color="#dcdcd5"`, `emissiveIntensity: 0.95`).
- Evidence: a lay-in troffer's door sits flush with the grid face (S20); here the lens is 25 mm below the ceiling plane.
  Frame 25 mm and 2 lamps are marked "ours" in building-standards.md.
- Settle: S20 drawings.

### S31 — Corridor width and bay are not from a source (A, low)
- Where: plan.js:13-15 (`north: 1.8, south: 3.6`, `bay: 3.2`).
- Evidence: 1.8 m only satisfies the 44 in minimum (S16/S17); the bay is "the width of room 01". 72 in is a code width
  for some occupancies, but that is not written.
- Settle: the code clause that gives 72 in, or a period plan of a lab floor.

## Checked and sound (with the source found)
- Door leaf 0.914 × 2.134 × 0.045 m — S2; tests/standards.test.mjs.
- Frame 51 mm face; leaf top 2.150 vs stop 2.1532 (3.2 mm gap); floor gap 16 mm ≤ 19 mm — S2, S3 (computed from door.js).
- Hinges 4-1/2 in, top 248 mm below the head, bottom top 264 mm up — S2; test.
- Knob profile: rose 65 mm, knob 54 mm, projection 58.7 mm = Plymouth 2 9/16, 2 1/8, 2 5/16 in (Allegion cut sheet);
  strike 1.024 m, backset 70 mm — S1, S2, S5; test. Knob rather than lever for 1979 — 07 C1, C2.
- Kick plate 254 × 864 mm on the push side — S4; threshold 13 × 127 mm — S1, S6; tests.
- Vinyl base 102 mm — S7, S8 (5 mm thickness documented as ours, but see S8).
- VCT 12 in and ceiling 24 in modules; layout from the centre, equal cuts ≥ half — CTEF rule, S8, S19; tests/tiles.
  12 in tile right for 1979 — 07 C25.
- Block module 0.2 × 0.4 m (documented metric rounding of 8 × 16 in, S11/S12), running bond, openings on the module —
  NCMA TEK 05-12; tests/masonry.
- Masonry opening 1.0 m / 2.2 m (metric rounding of door + 4 in / + 2 in, S11); rails and base stop at the frame's outer
  edge (scene.js FRAME_OUT 11.2 mm = door.js 0.5 - 0.0143 + 0.0255, computed).
- Troffer size 2 × 4 ft — S14, S20; test (placement: S3).
- Tackboard trim 44 mm and cork 1/4 in — S21; test.
- Extinguisher shell 7 in, 0.62 m, top ≤ 1.524 m, bottom ≥ 0.102 m — S22, S23; test. Label canvas 420 × 690 matches the
  wrapped area 0.155 × 0.254 m (both 0.609, computed). Lever to the viewer's right, hose left — matches the comment.
- Door signs 9 × 9 in centred 60 in, on the push side — S25, ADA 703.4.2; stairs symbol AIGA 1979 — S26; tests.
- Studio mark = ISO 7010 E001 drawing — credits.md, tests/logo.test.mjs; green RAL 6032 / ISO 3864-4.
- Room numbering from the entrance and the plan drawing — decisions.md (Northwestern, Georgia Tech, Smithsonian);
  tests/plaque.test.mjs.
- Sign flicker ≤ 3/s — WCAG 2.3.1; tests/glow.test.mjs. Starter heat 0.5-2 s — DIAL (sign.js). 10 s look-around —
  West 2015.
- Light box top on the 2.4 joint and foot on the frame head 2.2042 — consistent with door.js (computed).
- Corridor width ≥ 44 in — S16, S17 (value itself: S31).
- merge-static, reflect-env, mirror-glass, cable, shapes, lightbox: engine mechanics with no real-world size in them;
  their tuning numbers (cube size, times, segments) are rendering choices, not scene facts.
- Inter as the face — decisions.md (Meta system typeface); its cap height measured above (used in S11).
- Nothing in css/ styles the 3D scene; no inline styles in the files read.
