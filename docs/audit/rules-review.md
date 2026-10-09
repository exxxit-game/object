# Review of every rule, memory, skill, agent and hook

Plan step 4.1 c. Every rule of CLAUDE.md, every memory file, the `new-room` skill, the five
agents and the two git hooks, each checked for four things: is it still true, what catches a
break of it without anyone's memory (its guard), has that guard been shown failing, and does it
repeat another rule. The yardstick is what Cosmogram learned (`docs/research/projects/cosmogram.md`,
"To carry over") and the premortem (`premortem.md`, lens 1, causes 2-4). The new set goes to the
owner for his yes before CLAUDE.md changes.

## CLAUDE.md, rule by rule

"Machine" = a test, hook or tool stops it; "agent" = an independent agent finds it when run;
"none" = only my care. "Shown failing" = there is a record of the guard going red on the mistake.

| Rule | Says | Guard now | Shown failing | Verdict |
|---|---|---|---|---|
| 1 | No history in code | machine: structure test 16 | not recorded | keep; into "code shape" |
| 2 | One room = one folder; engine never imports rooms | machine: structure tests 2, 4 | not recorded | keep; into "code shape" |
| 3 | Styles only in css/ | machine: structure test 21 | not recorded | keep; into "code shape" |
| 4 | Player text only in texts.ru.js | machine: structure test 3 (Russian elsewhere fails) | yes (it failed twice on 9.10, on an agent file and the audit README) | keep; into "code shape" |
| 5 | A fact shown to the player has a source | agent: paper-reviewer; machine for room 01 only (`tests/control-protocol.test.mjs`) | room 01 test: new-room step 4 asks for it | merge with 11 and 20 into "truth" |
| 6 | Files about 300 lines max | machine: structure test 1, docs since 9.10 | docs: yes (commit 1b09818) | keep; into "code shape" |
| 7 | No build step; A-Frame vendored, pinned | none checks that nothing loads from outside | - | keep; the guard comes with the page's connection limit (CSP) in step 4.2 |
| 8 | npm test before "done"; no Playwright locally | machine: `tools/hooks/pre-commit` (no commit while npm test fails); "no Playwright locally": none | partly: `tests/secrets.test.mjs` checks the hook calls npm test, never runs it on a failing test | merge with 24 into "checking"; add deny rules for Playwright in a new project settings file for Claude Code (it does not exist yet) |
| 9 | Do exactly what was asked; ideas at the end | none | - | merge with 21 |
| 10 | Big change: a 3-line entry in docs/decisions.md first | none | - | into "rooms"; the architecture auditor checks each new module or dependency has its entry |
| 11 | Names, numbers, thresholds never from memory | agent: fact-checker (when run) | yes (plan-check.md: about 40 numbers without a source found) | merge into "truth" |
| 12 | Two or three failed attempts: stop, measure | none (the systematic-debugging skill is the method) | - | into "checking", the skill named |
| 13 | Compare visual changes with the approved shots | new-room step 9 (a skill step, not a check) | - | merge with 24 |
| 14 | One branch = one session; git status before "done" | machine: `tools/morning.mjs` (uncommitted, unpushed) | not recorded | keep; into "checking" |
| 15 | When the owner is angry: act, do not promise | none | - | keep; into "working with the owner" |
| 16 | Read the paper in full; about 10 minutes or less | skill: new-room step 1 | - | merge with 17 |
| 17 | Rooms follow the new-room skill | the skill itself | - | merge with 16 and 10 into "rooms" |
| 18 | A contradiction: stop, re-read the source, never bend the test | none | - | keep; into "truth" |
| 19 | Every mistake gets a guard and a row in docs/mistakes.md | machine: structure test 8 (each row names a real file) | not recorded | keep, and add Cosmogram's two lessons (below) |
| 20 | Numbers, quotes, pages from the paper text | machine: `tools/check-cards.mjs` (cards); agent: paper-reviewer | not recorded | merge into "truth" |
| 21 | Before every change say what, why, what it touches, which facts | none | - | keep; into "working with the owner" |
| 22 | The owner's requests: queue, table, status, after compaction, auditors (a-i) | agents: request-auditor, architecture-auditor, fact-checker | request-auditor: imitated 4 times by general agents, 0 runs as itself (`inventory.md`) | keep, shorter (the longest rule: about 2 KB of 7.9 KB) |
| 23 | Recreate, do not invent; knowledge first | machine for scene sizes only (`tests/standards.test.mjs`, `docs/building-standards.md`) | not recorded | widen and put FIRST: the owner's word 9.10, "ready solutions everywhere, our own only where none exists", for code, tools, process, security and science too, not only the scene |
| 24 | Research, build, my check in browser and headset, reviewer, fix, show | tools: `tools/quest-look.mjs`, `tools/quest-check.mjs`; skill: new-room step 9 | not recorded (its own wait was fixed after a flow change, docs/mistakes.md) | merge with 8 and 13 into "checking" |

What the table shows:
- 9 of 24 rules have no guard at all, and they are the ones about how I behave (9, 12, 15, 18, 21)
  and about outside content (7, 10, 13, 16 as a rule outside the skill). They stay, said plainly
  as "Guard: none", so neither of us takes care for a check.
- Most machine guards have no record of ever going red. One Cosmogram guard, once made
  blocking, "accepted any fresh log line as proof of any claim". The red proof is cheap: break the
  thing once on a scratch copy, see the test fail, put it back; it is part of the change below.
- Rule 23, the owner's main rule now, sits 23rd and speaks only of scenery; the order of the file
  is the order rules were added, not their weight.
- CLAUDE.md has no size limit: 7870 bytes on 9.10, up from 1.7 KB in three days (Cosmogram's
  reached 35 KB before it was cut).

## Memory (outside the repository; `~/.claude/projects/.../memory/`)

| File | Finding | Done |
|---|---|---|
| readability-first | true and important, but never named in `MEMORY.md`: it never loaded | named; `tools/morning.mjs` now fails on any memory file not named (shown failing on this one) |
| verify-yourself | told me to keep the headset awake over Wi-Fi ("worn on" all session); since 9.10 it is on the cable and sleeps between checks (headset-sessions) | rewritten to the cable |
| vision-mythbusters | quoted attrition numbers for 5 and 10 minute studies with no source anywhere in the project | numbers removed |
| decide-yourself, show-before-build, no-lazy-compromise, recreate-not-invent, whole-picture-first | true; they refine each other (technical choices are mine, what the player sees goes to him as pictures, sizes come from standards) | kept; rule "ready first" will name them |
| game-name, headset-sessions, step-by-step-foundation, ask-when-blocked, research-time-box, power-cuts | true | kept |

## Skill, agents, hooks

- `new-room` skill: true. Add Cosmogram's proofreading to step 6 (the player's text taken from the
  file, one word per idea, a doubt flagged instead of fixed silently).
- `request-auditor`: true. Add: report the live plan tab's size and any closed row still in the
  live table (Cosmogram lesson 1; the split is done, the limit is not watched).
- `architecture-auditor`: true. Add: each new engine module or dependency has its entry in
  docs/decisions.md (rule 10 has no guard).
- `fact-checker`, `paper-reviewer`, `quick-research`: true; no change.
- `tools/hooks/pre-commit`, `tools/hooks/pre-push`: true; shown failing by `tests/secrets.test.mjs`.

## Cosmogram's lessons, where each lands

| Lesson | Where |
|---|---|
| 1. Split the plan doc, watch its size | split done 9.10 (the tab of done requests); the size watched by the request-auditor (above) |
| 2. Cap CLAUDE.md; a guard line per rule | the new CLAUDE.md: each rule ends with "Guard: ..." or "Guard: none"; a test fails when it grows past its new size or a rule lacks the line |
| 3. A guard counts only once shown failing | rule "truth" c (now 19) |
| 4. A miss review before any new guard | rule "truth" c (now 19): first ask whether an existing test, tool, agent or doc was simply not used, fix that with one edit; the same miss three times goes to the owner |
| 5. A Supabase permissions guard | step 4.2 (data protection) |
| 6. Check a record against the live code first | rule "truth" d |
| 7. Proofreading; a build stamp on the test copy | proofreading: new-room step 6; the stamp: with the next test copy (corridor items, step 4) |

## The proposed order of CLAUDE.md

1. **Ready first** (now 23, widened to everything). 2. **Truth** (5, 11, 18, 19, 20, plus lessons
3, 4, 6). 3. **Working with the owner** (9, 15, 21, 22, shorter). 4. **Checking** (8, 12, 13, 14,
24). 5. **Rooms** (10, 16, 17). 6. **Code shape** (1, 2, 3, 4, 6, 7: one block, the tests enforce
it). Each rule ends with its guard. The file may not grow past its new size; a new rule replaces or
merges an old one.

Renumbering breaks the 66 places that cite a rule by number (agents, the skill, docs, tests). They
are rewritten in the same change to the form "CLAUDE.md rule N", and a test fails when such a
reference names a rule CLAUDE.md does not have, so the move cannot leave a stale pointer behind.
