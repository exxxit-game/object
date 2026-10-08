# Building standards for the lab (walk this before building or changing any scene part)

Every room and the corridor are a US university building of the late 1970s, built to trade
standards (CLAUDE.md rule 23). Values in inches and metres; sources below the table. A number
marked "ours" is the game's rounding, with the reason.

| Part | Standard | In the game |
|---|---|---|
| Wall | concrete block, nominal 8 × 8 × 16 in (0.203 × 0.203 × 0.406 m), running bond [S11, S12] | blocks 0.2 × 0.4 m (ours: the metric modular block, 1.6% smaller, so walls stay whole half-blocks); walls 0.2 m thick |
| Wall length | laid out in half blocks; masonry opening 4 in wider and 2 in taller than the door, widths in 8 in steps, so no unit beside an opening is cut [S11] | every wall a whole number of 0.2 m (`tests/tiles.test.mjs`); door openings 1.0 m wide, their edges on the 0.2 m module (`tests/masonry.test.mjs`) |
| Door leaf | 3'0" × 7'0" (0.914 × 2.134 m), 1-3/4 in (45 mm) thick [S2] | same |
| Door frame | hollow metal, 2 in (51 mm) face; gap leaf–frame 1/8 in (3.2 mm) at jambs and head, at most 3/4 in (19 mm) at the floor [S2, S3] | same; frame stops hide the gaps |
| Hinges | 3 per leaf, 4-1/2 in (114 mm); top hinge top 9-3/4 in (248 mm) below the frame head, bottom hinge top 10-3/8 in (264 mm) above the floor, middle equally spaced [S2] | same, on the pull side |
| Lever | strike centreline 40-5/16 in (1.024 m); operable parts 34–48 in (0.865–1.22 m); backset 2-3/4 in (70 mm) [S1, S2, S5] | same |
| Kick plate | 10 × 34 in (254 × 864 mm), 2 in narrower than the door, on the push side [S4] | same |
| Threshold | at most 1/2 in (13 mm) high; 5 in (127 mm) wide, aluminium [S1, S6] | same |
| Closer | regular arm, pull side or top jamb [S18] | on the pull side |
| Base | vinyl wall base 4 in (102 mm) high, 1/8 in thick [S7, S8] | 102 mm high, 5 mm thick (ours: 5 mm keeps it from flickering against the wall) |
| Floor | vinyl composition tile 12 × 12 in (0.305 m); no edge tile under half a tile [S8, S19] | same (`src/engine/tile-math.js`) |
| Ceiling | suspended grid 24 × 24 in (0.61 m), 15/16 in (24 mm) face [S9, S10] | same |
| Light | fluorescent F40T12, 48 in (1.22 m) lamps [S14]; 1975 federal guidance: 50 fc at desks, 30 fc in work areas, under 10 fc in corridors [S13] | 2 × 4 ft troffers (0.61 × 1.22 m) in the grid; the corridor floor gets 0.1–0.2 of the light on a room's desk (`tests/smoke.mjs`) |
| Troffer lens | prismatic acrylic, pattern 12, 0.125 in (3 mm), in a steel or aluminium door frame with mitred corners [S20] | lens with the lamps showing as soft bands; frame 25 mm (ours: frame width not in the sources); 2 lamps (ours) |
| Tackboard | 1/4 in (6 mm) cork on hardboard; extruded aluminium trim about 1-3/4 in (44 mm) face [S21] | the experimenter's board in the corridor, same; 1.6 × 1.0 m (ours: its edges on the block joints, `tests/masonry.test.mjs`) |
| Notices | A4 paper, 210 × 297 mm (ISO 216); psychology hallways carry flyers calling for participants, with tear-off strips (Indiana University, Psychological and Brain Sciences) | two A4 sheets on the board: a flyer and the studio's poster (`src/app/lobby/board.js`) |
| Fire extinguisher | top at most 5 ft (1.524 m) above the floor for units up to 40 lb, bottom at least 4 in (102 mm) [S22]; 2.5 gal pressurized water (Class A) about 7 in (0.18 m) across, 24.5 in (0.62 m) tall, about 30 lb [S23] | one in the corridor, by the stairs (the way out); shaped after a 1972 General WS-900 (polished stainless, grey hose, gauge, label as on the original) |
| Room sign | on the wall at the latch side; lowest letter baseline at least 48 in (1.22 m), highest at most 60 in (1.525 m) [S1, 703.4.1]; allowed on the push side of a door with a closer [S1, 703.4.2]; characters 5/8 to 2 in [S1, 703.2.5] | one sign family [S25]: 9 × 9 in, centred 60 in up, on the leaf's corridor (push) face; a room's number centred, 2 in; the stairs' symbol [S26] 4 1/2 in over the word 3/4 in; a wall sign (inside room 01) 4 in from the frame (`SIGN` in `src/app/brand.js`, `tests/masonry.test.mjs`) |
| Light box over a door | (ours) as wide as the masonry opening, 1.0 × 0.2 m, on the joints | the sign over door 1 |
| Switch, outlet | switch 42 in (1.067 m), outlet 18 in (0.457 m) to centre; reach 15–48 in [S1, S15]; in a block wall the box is set as the courses are laid, notched into the block [S24] | switch at 1.1 m (ours: inside one course, so no joint runs beside the plate; within reach) |
| Corridor | at least 44 in (1.118 m) in a university building [S16, S17] | 1.8 m |

Not verified (do not present as fact): levers vs knobs in 1979, closer body position, 1970s
ceiling height, colour temperature of 1970s cool-white lamps, troffer spacing.

Sources (opened 08.10.2026):
S1 ADA 2010 Standards, ada.gov/assets/pdfs/2010-design-standards.pdf ·
S2 Steelcraft Tech Data Manual, Section 1 (Allegion) ·
S3 Steel Door Institute FAQ, steeldoor.org/faqs ·
S4 Ives, protection plates (iveshardware.com) ·
S5 cylindrical lockset backset, doorwaysplus.com blog ·
S6 Pemko 171A saddle threshold ·
S7 Roppe vinyl wall base ·
S8 UFGS 09 65 00 resilient flooring (wbdg.org) ·
S9 UFGS 09 51 00 acoustical ceilings (wbdg.org) ·
S10 Chicago Metallic 200 grid datasheet (rockfon.com) ·
S11 CMHA TEK 5-12 · S12 CMHA TEK 14-6 (cmha.org) ·
S13 Federal Energy Administration, Lighting and Thermal Operations guidelines, 1975 (stacks.cdc.gov) ·
S14 Srivastava & Sommerer, ECS Interface 1998 ·
S15 University of Arizona design standard 16140 ·
S16 California Building Code 2025, Table 1020.3 · S17 CBC 304.1 ·
S18 LCN 4040XP closer arm · S19 Armstrong tile instructions ·
S20 Hew 50 static troffer spec (hew.com); Signify SP troffer ordering guide (pattern 12 lens) ·
S21 VA master spec 10 11 23 tackboards (wbdg.org); Univ. of Houston master spec 10 11 00 ·
S22 NFPA 10, 6.1.3.8 (quoted by San Diego Fire-Rescue, sandiego.gov; same values in the 1994 edition) ·
S23 Kidde Pro 2.5 W-1 (466403) and Amerex 240 product listings ·
S24 Hubbell RACO masonry boxes: the mason builds to the device height and notches the block round the box (hubbell.com) ·
S25 Northern Illinois University, Campus Interior Signage Program: planning and purchasing guide, sign types A and E, installation (via cdb.illinois.gov) ·
S26 US DOT / AIGA Symbol Signs, "Stairs" (1979 set, public domain; Wikimedia Commons "Aiga stairs.svg") ·
