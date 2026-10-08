# Building standards for the lab (walk this before building or changing any scene part)

Every room and the corridor are a US university building of the late 1970s, built to trade
standards (CLAUDE.md rule 23). Values in inches and metres; sources below the table. A number
marked "ours" is the game's rounding, with the reason.

| Part | Standard | In the game |
|---|---|---|
| Wall | concrete block, nominal 8 × 8 × 16 in (0.203 × 0.203 × 0.406 m), running bond [S11, S12] | blocks 0.2 × 0.4 m (ours: the metric modular block, 1.6% smaller, so walls stay whole half-blocks); walls 0.2 m thick |
| Wall length | laid out in half blocks; masonry opening 2 or 4 in taller than the door [S11] | every wall a whole number of 0.2 m (`tests/tiles.test.mjs`) |
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
| Light | fluorescent F40T12, 48 in (1.22 m) lamps [S14]; 1975 federal guidance: 50 fc at desks, 30 fc in work areas, under 10 fc in corridors [S13] | 2 × 4 ft troffers (0.61 × 1.22 m) in the grid; the corridor dimmer than the room |
| Room sign | on the wall at the latch side; lowest letter baseline at least 48 in (1.22 m), highest at most 60 in (1.525 m) [S1, 703.4.1] | same |
| Switch, outlet | switch 42 in (1.067 m), outlet 18 in (0.457 m) to centre; reach 15–48 in [S1, S15] | same |
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
S18 LCN 4040XP closer arm · S19 Armstrong tile instructions.
