# Mistakes and their guards

A mistake is written here only together with the guard that now catches it. A row
without a working guard is not allowed (`tests/structure.test.mjs` checks that each
row names an existing file, and caps this file at 60 lines). No diary: replace rows
when a better guard appears.

| Mistake (what happened) | Guard that catches it now |
|---|---|
| Designed a room without reading the paper; a 40-minute experiment was planned, then compressed into a different one | `.claude/skills/new-room/SKILL.md` step 1 |
| A number told to the player belonged to another group or sample (380 vs 242 people; "men" meaning 8 non-depressed men) | `src/rooms/01-control/original.js` + `tests/control-protocol.test.mjs`; `.claude/agents/paper-reviewer.md` |
| A sentence of the original instructions was dropped and not declared | `.claude/agents/paper-reviewer.md` |
| A closed question lacked the valid answer, and options had unequal size and fixed order (bias) | `src/engine/ui/choice.js` (common size) + `tests/smoke.mjs` (size check); `.claude/agents/paper-reviewer.md` |
| Button labels shrank to unreadable: margins ate the button height | `tests/smoke.mjs` (minimum answer text size) |
| Answer buttons covered the question text | `src/engine/panel.js` (`write` returns the text end) + `tests/smoke.mjs` (overlap check) |
| The voice misread an ending ("зелёное загорелось") | `tools/check-voice.mjs` |
| Russian words slipped into code comments | `tests/structure.test.mjs` rule 3 |
| Files and notes grew until nobody saw what was inside (Cosmogram index file) | `tests/structure.test.mjs` rules 1, 5 |
| Unused modules and docs naming deleted files stayed around | `tests/structure.test.mjs` rules 6, 7 |
| A shell heredoc silently changed backslashes in a written file | `tests/structure.test.mjs` rule 9 (syntax of every file) |
| File names like analytics were blocked by ad blockers (dark screen) | `tests/names.test.mjs` |
| "Done" said before checking in the browser and headset | `.claude/skills/new-room/SKILL.md` step 9; `tools/quest-check.mjs` |
| The headset check started answering before the question was on screen after the flow changed | `tools/quest-check.mjs` waits for the scale or the answers, not for a state name |
| A research summary overstated an effect and it was recommended as the first room before the paper was read (pseudo-haptic weight: 4 of 8 noticed unprompted) | `.claude/skills/new-room/SKILL.md` step 1: no recommendation before the full paper is read |
| A ranked list of experiments was built from search summaries without reading the papers | `tools/check-cards.mjs`: every fact in `docs/cards/README.md` cards must quote the full text |
| Paper titles were written from memory into a list (one was wrong) | `docs/papers-needed.md`: every title and DOI looked up in Crossref before writing |
| The quote checker dropped Japanese, Chinese and Korean characters, so any quote in those languages passed | `tools/check-cards.mjs` keeps letters of every script and refuses quotes under 8 characters |
| The headset probe requested the `layers` feature, so the mixed-reality session failed to start | `docs/headset-capabilities.md` (do not request `layers`); note in `tools/xr-probe.html` |
| Five consent paragraphs and two buttons were crammed onto one wall board; the buttons fell into two narrow columns with 19 px letters (CI red) | `tests/smoke.mjs`: every sheet page must fit, letters at least 1.2° and buttons 2.5° of view, up to four answers in one column; consent is paged (`src/app/consent.js`) |
| The corridor was built from imagination: tiles cut unevenly, the door narrower than its opening (gaps into the room), the baseboard in the same plane as the door (flicker), no threshold | `tests/tiles.test.mjs` (trade tile and masonry rules); `docs/vr-checklist.md` "Scene build quality"; CLAUDE.md rule 23 (standards first) |
| Doors, walls and trim were sized by eye (5 cm wall, door filling its opening, base 8 cm, hinges evenly spread, sign on the hinge side) | `tests/standards.test.mjs` checks the scenes against `docs/building-standards.md` (sourced trade standards) |
