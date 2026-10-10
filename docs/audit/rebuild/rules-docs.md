# Rules, docs and memory: read-only audit (10.10, HEAD 72a7e13, worktree prodolzhenie-0a1e6a)

Nothing in the repo was edited. One local run: `node tests/guard.test.mjs` (it only spawns the hook's
`pre` and `start` modes, which only read). Result: it FAILS, see problem 1.

## 1. Inventory

| File | Size (B) | When it is loaded | Purpose |
|---|---|---|---|
| CLAUDE.md | 3,391 (46 lines) | always, by Claude Code | project rules |
| memory/MEMORY.md | 2,128 | always (auto-memory index) | one line for each of the 15 memory files |
| 15 memory files | 25,579 total (0.8-3.6 KB each) | on demand, only if the session follows the index | his feedback, with quotes and the incident behind each one. Kept outside git |
| docs/owner-decisions.md | 7,771 | SessionStart hook (start, resume, after compaction) | settled decisions, never re-asked |
| docs/board.md | 7,032 | SessionStart hook (the Showings table cut to its last 5 rows). The Stop hook also reads it | queue, his requests, the "Showings" table |
| (hook output: the two above plus a header) | 10,012-10,120 chars | — | limit 10,000 chars, enforced by tests/guard.test.mjs:128 |
| 7 agents' descriptions / bodies | ~1 KB each, always / 18.4 KB total, when spawned | descriptions always; a body only when that agent is spawned | reviewers, auditors, research |
| new-room SKILL.md | 3,586 | description always; body when invoked | the steps for building a room |
| .claude/settings.json + tools/claude-guard.mjs (202 lines) | 3,225 + ~12 KB | run at every event, never read | the guards, the start context, logging, the stop checks |
| docs/state.md | 6,040 (cap 80 lines) | on demand ("Maps", CLAUDE.md:6; the hook header) | where things are, lessons |
| ARCHITECTURE.md | 7,870 | on demand ("Maps") | code map (the folder map is enforced by a test) |
| docs/decisions.md | 28,266 | on demand (Truth rule, CLAUDE.md:23) | why things are built the way they are |
| docs/mistakes.md | 29,772 (cap 60 lines) | on demand (new-room step 10) | each mistake with its guard |
| docs/target-architecture.md / roadmap.md | 4,035 / 7,726 | on demand (ARCHITECTURE "Docs") | the end picture / the long view |
| docs/catalog.md + docs/cards/ | 42,827 + 850,770 | on demand when a room starts | experiment cards |
| sources, building-standards, vr-checklist, testing, engine, rooms, other root docs | 3-11 KB each | on demand | reference |
| docs/audit/ (12 files + ceiling/ 5) | 164,040 + 104,390 | never (snapshots) | the 9.10 audits, including a stale CLAUDE.md draft |
| docs/research/projects/claude-code/ | 278,049 | never (linked only from research/vr/README) | an earlier study of how to work with Claude Code |
| ~/Documents/objekt-notes/owner-messages.md | 693,392 (310 messages) | never in the main session; read by request-auditor | the prompt hook's word-for-word log of his messages |
| claude.ai artifacts (big plan, owner page, style book, git guide) | — | only by an Artifact read | "archive and strategy" |

docs/ tree: 256 files, 3,874,045 B in total. By folder (files / bytes): `.` 19 / 197,752; art 3 / 12,808;
audit 12 / 164,040 (ceiling 5 / 104,390); cards 146 / 850,770; ideas 5 / 35,787; research 11 / 208,087
(projects 7 / 99,116; projects/claude-code 8 / 278,049; vr 17 / 465,481); rooms 1 / 7,045
(01-control-shots 7 / 355,355, of which cable/ 2 / 27,144; corridor-shots 13 / 1,068,221).

## 2. What a session must read before working

- Loaded on its own: CLAUDE.md + MEMORY.md + hook output, about 20 KB (about 10k tokens).
- Plus the two maps CLAUDE.md points to (state 6.0 KB, ARCHITECTURE 7.9 KB): about 34 KB in total.
- Before any visible or room work, the files the rules cite, where the reasons and the traps live: decisions 28.3, mistakes 29.8,
  memory files 25.6, catalog 42.8, building-standards 9.1, vr-checklist 4.8, sources 3.6, skill 3.6.
  That adds about 150 KB, so roughly 185 KB of rules and reasons in all. Most of it repeats itself (section 3).

## 3. Duplicates, contradictions, stale facts, blunt caps

**Duplicates.** Every memory file restates a rule that is already in the repo:
- ask-when-blocked = CLAUDE.md:17 = owner-decisions:48
- recreate-not-invent = CLAUDE.md:20-27 = owner-decisions:27-29 = decisions:89
- options-not-fantasy = CLAUDE.md:12-13 = owner-decisions:44-46
- verify-yourself = CLAUDE.md:31-33 = owner-decisions:47
- power-cuts = CLAUDE.md:37
- readability-first = owner-decisions:41 = decisions:97-101 = mistakes:41
- show-before-build = owner-decisions:41-42 = SKILL:33
- whole-picture-first and step-by-step = owner-decisions:34
- game-name = CLAUDE.md:3 = mistakes:31

The copies drift. research-time-box memory and the MEMORY.md index say quick-research works with 6 searches and is
stopped at 5 min. The agent itself (quick-research.md:12) says 8 searches, 8 reads, about 10 min.

**Contradictions.**
- Who decides:
  - decide-yourself memory: "Never hand him a list to approve".
  - options-not-fantasy memory: "several real options… he picks".
  - SKILL.md:17-19: each question goes to him "with a recommended option".
  - CLAUDE.md:12-13 draws the line at "a source settles it". That is a judgment call every time.
- Scope:
  - CLAUDE.md:14 says "Do exactly what was asked".
  - owner-decisions:34-35 says a fix is made only once the whole system around it is seen, and the whole-picture-first memory says the same.
- Per session:
  - state.md:6 says "One board item per session".
  - board.md:17 says one visible thing plus a piece of internal work.
- Push:
  - state.md:8 says push on his "Do it" (his words, our translation).
  - CLAUDE.md:37 and the Stop hook (claude-guard.mjs:179-188) force a push and a room-polish merge at every turn.
- Release:
  - roadmap.md:21 makes the web page the 1.0 release and the Store "optional later".
  - owner-decisions:21 says install first and the site second; the board's steps 3-5 go through Meta's channel.
- First room:
  - roadmap.md:70-73 picks it "on the playtest numbers, not by opinion".
  - board.md:11 says "you picked one" (the board's words, our translation), and the vision memory says "owner picks".
- Corridor:
  - state.md:64 says "Corridor ACCEPTED 8.10".
  - board.md:10 and owner-decisions:8 say it is unfinished and comes first.

**Stale facts (sample checked against the code and git).**
- Rules cited by a number that no longer exists. CLAUDE.md has no numbered rules now, yet:
  - decisions.md:89 cites "rule 23" and :119 cites "rule 18";
  - mistakes.md cites rule 24 (:19), rule 12 (:29), rule 23 (:37) and rule 22i (:50);
  - memory recreate-not-invent cites "rule 23" and "above the numbered rules";
  - memory game-name cites "rule 4".
- state.md:56 says the CLI is 2.1.293; `claude --version` here prints 2.1.268.
- decisions.md:88 cites "queue step 8"; the queue has been renumbered.
- docs/audit/claude-md-proposed.md:9 says "The queue and every owner request: the plan doc". That contradicts the board.
- decisions.md:119 says every claim is checked by the fact-checker twice. No rule, hook or skill calls the fact-checker now.
- Facts that checked out: room-polish (state.md:5) is the main folder's branch; the default room `01-control` (ARCHITECTURE:11) matches src/main.js:3; `quest-look worn` exists.

**Hard caps and blunt reactions to a single incident.**
- Line caps, where content cannot shrink to fit, get crammed instead (no line-length cap):
  - CLAUDE.md is capped at 45 lines (structure.test:74);
  - state.md at 80 (:69);
  - mistakes.md at 60 lines with 2 kept free for a planted row (:102,109). Its rows run to 1,376 chars (510 on average);
  - decisions.md says "Three lines each" (:3), and its lines run to 883 chars.
- The start hook's 10,000-char cap (guard.test:128): the Showings table is already cut to 5 rows (claude-guard.mjs:116-119).
- The research agents' limits were retuned on the same day after one incident each (deep-research went from 25 to 80 reads, 10.10).
- The Stop hook refuses to end a turn without a Showings row for today (claude-guard.mjs:199).

**Rules nobody can follow together.**
- CLAUDE.md:31 and verify-yourself require my own VR look before he sees anything.
- But `quest-look vr` refuses to run until a practice review has covered the exact set of player-facing files (quest-look.mjs:75, review-gate.mjs), and any change voids that review. So the loop is: look, fix, review again, look again.
- new-room SKILL.md step 9 never mentions the practice-reviewer, so following the skill as written gets refused.
- CLAUDE.md:15 says "No new process". Yet in 4 days (317 commits) .claude/agents changed 17 times, claude-guard.mjs 17 times and structure.test 27 times.

## 4. Where his requests and decisions live

About 12 places:
1. owner-decisions.md
2. board.md (7 sections)
3. owner-messages.md (raw log, 693 KB)
4. 15 memory files (not in git)
5. decisions.md ("the owner chose…")
6. roadmap.md "Decided with the owner"
7. state.md
8. the big-plan artifact
9. research/own-experiments-now.md ("your questions" at the top, our translation)
10. ideas/owner-experiments.md
11. research/vr/07-corridor-1979.md (his 19 photos)
12. CLAUDE.md and SKILL.md

How a new session finds the current task:
- The SessionStart hook prints the decisions and the board. The task is board.md:6, one line long.
- What is behind that line ("overview of everything → one diagram", the board's words, our translation) is not kept anywhere that lasts. state.md:62-63 says the whole-picture reports are "in the session scratchpad only".
- After a compaction the hook brings back the board, but not how far the step has got.

## 5. Top 10 problems

1. **The always-loaded channel is full and the tests are red here.** tests/guard.test.mjs:128 fails with "the start hook prints 10012 characters". owner-decisions.md is checked out with CRLF; on CI, with LF, it is about 9,950 and passes. Any new decision pushes it over.
2. **Line caps cause cramming:** mistakes rows up to 1,376 chars, decisions lines up to 883 (structure.test:74,69,102,109; decisions.md:3).
3. **Rules cited by numbers that no longer exist:** decisions:89,119; mistakes:19,29,37,50; 2 memory files.
4. **Memory duplicates the repo rules and drifts:** research-time-box (6 searches / 5 min) against quick-research.md:12 (8 searches, 8 reads, about 10 min).
5. **Conflicting rules on who decides:** decide-yourself, options-not-fantasy and SKILL.md:17-19 each say something different.
6. **Conflicting rules on scope and order:** CLAUDE.md:14 against owner-decisions:34-35; state.md:6 against board.md:17; state.md:8 against claude-guard.mjs:179-188; roadmap:21,70-73 against owner-decisions:21 and board:11; state:64 against board:10.
7. **The verification loop:** CLAUDE.md:31-33 against review-gate (quest-look.mjs:75), where any edit voids the review. SKILL step 9 leaves out the gate.
8. **"No new process" does not hold:** guards and agents change many times a day; the fact-checker, architecture-auditor and request-auditor are triggered by nothing (decisions:119 claims the fact-checker runs).
9. **Requests are spread over about 12 places;** the progress of the current step is kept only in the scratchpad (state.md:62-63). That is the source of the circles after compaction.
10. **Dead audits compete with the live rules:** audit/claude-md-proposed.md:9 (the queue lives in "the plan doc"), audit/rules-review.md (the same review, 9.10, unused), and research/projects/claude-code (278 KB, effectively unlinked). The process has been re-audited at least twice before; the board's current task is a third time (board.md:6).

Index of the 10.10 rebuild audits: [README.md](README.md)
