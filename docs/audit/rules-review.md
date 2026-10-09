# Review of every rule, memory, skill, agent and hook

Plan step 4.1 c. Every rule of CLAUDE.md, every memory file, the `new-room` skill, the five
agents and the git hooks, each checked for: is it still true, what keeps it without anyone's
memory (its guard), has that guard been seen going red, and does it repeat another rule. The
yardstick is what Cosmogram learned (`docs/research/projects/cosmogram.md`, "To carry over") and
the premortem (`premortem.md`, lens 1, causes 2-4). Checked by two independent fact-checker runs;
their corrections are in. The new CLAUDE.md goes to the owner for his yes before it changes.

## How each rule is kept

One standard for every row:
- **auto**: runs by itself with no one deciding (npm test via the commit hook, the push hook, CI on
  every push, Claude Code's hooks on the assistant);
- **tool**: a tool that catches it, but only when someone runs it (`tools/morning.mjs`,
  `tools/check-cards.mjs`, `tools/quest-look.mjs`, `tools/quest-check.mjs`);
- **agent**: an independent agent, when called; **skill**: a step of the `new-room` skill;
- **none**: only the assistant's care.

"Red" is the guard seen failing on its own mistake: by `tools/prove-guards.mjs` (it plants the
mistake in a clone and runs the guard), or a red run in the session record.

| Rule | Says | Kept by | Red |
|---|---|---|---|
| 1 | No history in code | auto: structure test 16 | prover: BLIND on the laptop's CRLF checkout (a line ending in \r never matched), fixed to split on CRLF; caught with LF |
| 2 | One room = one folder; engine never imports rooms | auto: structure tests 2, 4 | prover: caught |
| 3 | Styles only in css/ | auto: structure test 21 | prover: caught; a real catch (tools/xr-probe.html) |
| 4 | Player text only in texts.ru.js | auto: structure test 3 | prover: caught; two real catches on 9.10 |
| 5 | A fact shown to the player has a source | agent: paper-reviewer; auto for room 01's values (`tests/control-protocol.test.mjs`) | not recorded |
| 6 | Files about 300 lines | auto: structure test 1 (code and every doc) | prover: caught both |
| 7 | No build step; A-Frame vendored, pinned | none: nothing checks that nothing loads from outside | - (step 4.2 brings the page's connection limit, CSP, with a test) |
| 8 | npm test before "done"; no Playwright locally | auto: pre-commit hook; Claude Code hooks (`tools/claude-guard.mjs`): no skipping the git hooks, no local Playwright, no turn ends with failing tests | prover: caught (pre-commit, both claude-guard cases); a real catch on 9.10 |
| 9 | Do exactly what was asked; ideas at the end | none | - |
| 10 | Big change: decisions.md entry first | skill: new-room step 1 | - |
| 11 | Names, numbers, thresholds never from memory | agent: fact-checker | the fact-checker found about 40 numbers without a source (plan-check.md) |
| 12 | Two or three failed attempts: stop, measure | none (method: the systematic-debugging skill) | - |
| 13 | Compare visual changes with the approved shots | skill: new-room step 9 | - |
| 14 | One branch = one session; git status before "done" | auto: Claude Code's stop hook (no turn ends with unsaved or unpushed work); tool: morning check | prover: caught; the morning check once failed on uncommitted work |
| 15 | When the owner is angry: act, do not promise | none | - |
| 16 | Read the paper in full; about 10 minutes or less | skill: new-room step 1 | - |
| 17 | Rooms follow the new-room skill | skill (the skill itself) | - |
| 18 | A contradiction: stop, re-read the source, never bend the test | none | - |
| 19 | Every mistake gets a guard and a row | auto: structure test 8 (with test 7: the named guard exists) | prover: caught; a real catch |
| 20 | Numbers, quotes, pages from the paper text | tool: `tools/check-cards.mjs` (run by nothing automatically); agent: paper-reviewer | not recorded |
| 21 | Before every change say what, why, what it touches, which facts | none | - |
| 22 | The owner's requests (a-i) | agent: request-auditor, architecture-auditor, fact-checker | the request-auditor never ran as itself (imitated 4 times; `inventory.md`); the architecture-auditor 0 runs |
| 23 | Recreate, do not invent; knowledge first | auto for scene sizes (`tests/standards.test.mjs`, masonry, tiles, logo tests) | not recorded |
| 24 | Research, build, check in browser and headset, reviewer, fix, show | tool: quest-look, quest-check; skill: new-room step 9 | not recorded |

Counts: auto 8 (1, 2, 3, 4, 6, 8, 14, 19), auto in part 2 (5, 23), tool 2 (20, 24), agent 2 (11,
22), skill 4 (10, 13, 16, 17), none 6 (7, 9, 12, 15, 18, 21). Every guard the prover covers went
red but one, which was blind on the laptop and is fixed.

What the table shows:
- Six rules have no guard; they are how I behave (9, 12, 15, 18, 21) and outside loads (7). They
  stay, marked "Guard: none", so no one takes care for a check.
- Rule 23 covers the scene, the interface, mechanics and flows; it leaves out tools, process,
  security and science, which the owner's word of 9.10 adds (his words, translated: "we can take
  ready solutions everywhere; there is nothing new except the idea and how it is made").
- The order of CLAUDE.md is the order rules were added, not their weight: the owner's main rule
  is 23rd.
- CLAUDE.md has only the 300-line cap every doc has; it grew from 1.7 KB to about 7.8 KB in three
  days. Anthropic's guide: a long CLAUDE.md gets half ignored; a rule kept breaking becomes a
  hook (code.claude.com/docs/en/best-practices).
- The language line and rule 4 say Russian lives only in texts.ru.js, privacy.html and README.md;
  structure test 3 allows about 20 files (the owner's words quoted in docs and agents, the tools
  that check the Russian texts). The new text points to the test's list.
- The Commands section says the preview runs at localhost:3000; the browser pane's launch.json
  uses 3100 (`npm run serve` takes PORT, 3000 by default).

## Memory (outside the repository; `~/.claude/projects/.../memory/`)

| File | Finding | Done |
|---|---|---|
| readability-first | true, but never named in `MEMORY.md`, so it never loaded | named; `tools/morning.mjs` fails on any memory file not named (seen failing on this one) |
| verify-yourself | kept the headset awake over Wi-Fi all session; it is on the cable now and sleeps between checks | rewritten to the cable |
| vision-mythbusters | attrition numbers with no source anywhere in the project | removed |
| recreate-not-invent | spoke of objects and sizes only, narrower than the owner's widening of 9.10 | widened to code, tools, process, security and science, his words quoted |
| the other ten | true; decide-yourself, show-before-build, no-lazy-compromise and whole-picture-first refine each other | kept |

Memory files are not versioned, so their earlier text is known only from the session record.

## Skill, agents, hooks

- `new-room` skill: update. Step 5 says build only from shared parts, but asking, paging and the
  reveal still live in room 01's own code (`docs/target-architecture.md`); the skill never names
  the 24 mm smallest letter. Add both, and Cosmogram's proofreading to step 6.
- `request-auditor`: updated. It knew only the live table; it now looks in the plan's archive tab
  before calling a request missing, and reports the live tab's size and done rows left in it.
- `architecture-auditor`: add a check that each new engine module or dependency has its entry in
  docs/decisions.md (rule 10).
- `fact-checker`, `paper-reviewer`, `quick-research`: true. The fact-checker and request-auditor
  load as agents only in a session started after their files existed.
- Git hooks: pre-commit and pre-push both went red in the prover. `tests/secrets.test.mjs` runs
  pre-push and checks only the text of pre-commit; docs/mistakes.md said it runs both (corrected).

## Cosmogram's lessons, where each lands

| Lesson | Where |
|---|---|
| 1. Split the plan doc, watch its size | split 9.10 (archive tab); the size: the request-auditor (above) |
| 2. Cap CLAUDE.md; a guard line per rule | the new CLAUDE.md: each rule ends with "Guard: ..." or "Guard: none"; a test fails when it grows or a rule lacks the line |
| 3. A guard counts only once seen failing | `tools/prove-guards.mjs`, on every push on GitHub |
| 4. A miss review before any new guard | the new rule "truth" c |
| 5. A Supabase permissions guard | step 4.2 (data protection) |
| 6. Check a record against the live code first | the new rule "truth" d |
| 7. Proofreading; a build stamp on the test copy | new-room step 6; the stamp with the next test copy |

## The proposed order of CLAUDE.md

The full draft, waiting for the owner's yes: `claude-md-proposed.md` (about 7.3 KB against 7.8 KB now).

1. **Ready first** (now 23, widened to everything). 2. **Truth** (5, 11, 18, 19, 20; lessons 4, 6).
3. **Data and keys** (now spread over the Commands section and the hooks). 4. **Working with the
owner** (9, 15, 21, 22, shorter). 5. **Checking** (8, 12, 13, 14, 24). 6. **Rooms** (10, 16, 17).
7. **Code shape** (1, 2, 3, 4, 6, 7: one block the tests enforce). Each rule ends with its guard.

Renumbering moves the places that cite a rule by number. 28 say "CLAUDE.md rule N"; more say only
"rule N", and some of those are structure-test numbers ("structure rules 3 and 16") or outside
rules (OSHA, the large-print guide), so each is sorted by hand. After the move a test fails when
"CLAUDE.md rule N" names a rule CLAUDE.md does not have.
