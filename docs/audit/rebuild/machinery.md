# Machinery around the sessions: audit (read only, 2026-10-10)

Worktree audited: .claude/worktrees/prodolzhenie-0a1e6a at 72a7e13 (same commit as room-polish and origin/room-polish).
All timings measured on the laptop today. Nothing in the repo was edited.

## 1. Inventory

### Claude Code hooks (.claude/settings.json -> tools/claude-guard.mjs)

| Hook / mode | When | Blocks or checks | Born from |
|---|---|---|---|
| `start` (cg:97-123) | session start, resume, every compaction | prints owner-decisions.md + board (last 5 showings), STOP banner if 2 sessions without his yes, room-polish lag warning | mistakes row 26 (re-asked settled decisions); d62168e, b56c48d, 7b667c3, c84298a |
| `prompt` (cg:166-173) | every user prompt | appends the prompt to ~/Documents/objekt-notes/owner-messages.md | c84298a; request-auditor (row 26) |
| `pre`, matcher Bash/PowerShell (cg:80-90) | every shell command | REFUSED list cg:50-61: hook-skip flag, `commit -n`, core.hooksPath change, smoke/Playwright (3 regexes), adb reboot/force-stop, writes naming practice-reviews, OBJECT_REVIEW_RECORD= | rows 53 (saved past the commit hook), 54 (restarted headset on his head), 57 (review gate); c7e6279, 09299ba, e84785b, 00806ad, c4e63ad |
| `pre`, matcher mcp__.* | every MCP call (browser pane, paper tools, connectors) | Playwright/devtools plugins, Supabase writes, GitHub connector writes, non-read SQL (cg:67-85) | c84298a, 56418fa (preventive, no incident) |
| `pre`, matcher Write/Edit | every file write | path containing practice-reviews | c4e63ad |
| `subagent-start/stop` (cg:142-161), practice-reviewer only | reviewer start/end | writes the review record (fingerprint of all public files) | row 57; c4e63ad, 3a434ae, 3b708e7 |
| `stop` (cg:175-202) | every turn end, up to 8 blocks in a row | uncommitted files; commits not pushed; HEAD not in room-polish; unrelayed FOR THE OWNER links; no board row dated today | power cuts, row 53, row 55 (c0361b4, 138e8e6), 7b667c3, 238f4b6 (today 06:39) |

### Git hooks and CI
| Item | When | Does | Born from |
|---|---|---|---|
| tools/hooks/pre-commit | every commit | whole `npm test` (measured 65-75 s) | rows 38, 47; 8b0ad29 |
| tools/hooks/pre-push | every push (2 per commit: session branch + room-polish) | main needs OBJECT_LIVE; tools/secrets.mjs on the range | rows 35, 47 |
| .github/workflows/test.yml | every push, both branches | npm test, prove-guards --lf and CRLF, smoke; ~8 min a run | rows 38, 52 |
| core.hooksPath | - | main .git/config `tools/hooks`; this worktree's config.worktree sets the ABSOLUTE main-folder path, so worktree commits run the main folder's hook files | row 49 |

### Tools (tools/*.mjs)
board (board parser for the guard), build-catalog (catalog from cards, --check in structure test), check-cards (card quotes exist in paper .txt), check-voice (STT vs script), claude-guard (all hooks), headset (adb/CDP link, onHead), make-sounds / make-voice (ElevenLabs), morning (daily check: dirty, pushed, email, hooksPath, worktrees' hooks, main ruleset, secrets, CI, npm test, parse, headset, audit age), owner-links (owed links parser), prove-guards (mutation test of ~45 guards, CI only), publish-preview (test copy; review gate, secrets, CI green, Pages wait), quest-check (end-to-end in headset), quest-look (headset look; VR gated by review), quest-wifi, review-gate (fingerprint + record), secrets (keys/emails in unpushed commits), xr-probe-run (+ two probe pages).

### Tests (npm test, 24 files in one chain)
Room/science: control-protocol, -schedule, -report, -reveal, results, playtest, issues (row 11, server schemas). Scene/VR: standards, tiles, masonry (rows 22, 37, 40), sheet (25, 33), glow (24, 46), locomotion (34), recenter, plaque (30), logo (29), fonts, names (18), voice, sound. Process: structure (23 rules: 300-line files and docs, state.md 80, CLAUDE.md 45, mistakes 60 with 2 reserved, Russian whitelist, dead code, doc paths, node --check of 117 scripts, no history in comments, secrets, ARCHITECTURE map, styles, orphan docs, UPPER_SNAKE names), guard (37 commands both ways, start output < 10,000 chars), review-gate, secrets. smoke + near-faces: CI only.
Slowest: structure 28.2 s, guard 13.6 s, review-gate 7.7 s; the rest < 2.4 s each.

### Agents (.claude/agents)
paper-reviewer (rows 11-12), practice-reviewer (row 57, gates VR and test copy), quick-research (8 searches / 8 reads / 10 min / 250 words), deep-research (60 / 80 / 45 min / 600 words; was 25 / 25 / 20 min until e04a2f4 today), request-auditor (row 26; was "first five" losses until f8771c9 today), fact-checker (row 50, 900 words), architecture-auditor (row 43, 400 words).

## 2. Overlaps, false blocks, caps, per-turn cost

### Overlaps
- Secrets: structure rule 19 (st:187) and secrets.mjs PATTERNS (secrets.mjs:17-23) are two different regex lists; plus publish-preview and morning.
- Address: structure rule 14 (st:214-216), secrets.mjs, publish-preview, morning.
- Unsaved/unpushed: stop hook (cg:177-181) and morning (morning:12-16).
- Hooks on: morning:28 expects exactly `tools/hooks`, but this worktree has the absolute path, so morning reports "push guard is off" here (false FAIL); morning:32-34 checks the hook files per worktree, now moot with the absolute path.
- npm test: pre-commit + morning + CI + "Done only after npm test" (sessions run it by hand, then the hook runs it again).
- One marker, two jobs: `FOR THE OWNER:` is both the reviewer's report end (review-gate.mjs:20) and the owed-links mark (owner-links.mjs:7).
- Two branches kept equal: every commit is ff-merged into room-polish and pushed twice (reflog: 25+ ff merges this morning); the last 60 CI runs cover 27 commits run twice, once per branch (54 of 60 runs; ~8 min each).

### False blocks (run through the guard today; all REFUSED)
Rule cg:52 (`git` + `commit` anywhere + any dash word containing n):
`grep -rn "git commit" docs/`; `cat docs/mistakes.md | grep -n "git commit"`; `git log --format=commit -n 5`; `find . -name "*.md" | xargs grep -l "git commit"`; `git commit -m x && git log --oneline -n 3`; `... Get-Content f -Encoding utf8`; `... Write-Host -NoNewline`; `git commit -m "sed -n prints a range"`.
Rule cg:51 (hook-skip flag anywhere with `git`): a commit message describing the guard; `git log | grep -- <flag>`; a heredoc writing a test file that contains the string (my own probe script for this audit was refused live).
Rule cg:59 (practice-reviews + `>` anywhere): `tail -5 .../practice-reviews.jsonl 2>/dev/null`; any `node -e` reading it with an arrow function `=>`.
guard.test.mjs:4-5 accepts the search refusals by design.

### Hard caps and what they cost
| Cap | Where | Cost seen |
|---|---|---|
| start output < 10,000 chars | guard.test.mjs:128 | decisions + board are at 10,001-10,010 chars now; one of my two npm test runs failed on it while they were being edited. Every new owner decision breaks commits until something is cut |
| mistakes.md <= 60 lines, 2 reserved | st:102, 109 | 58 + 2 = 60: zero room. Rows are crammed into single lines up to ~1,500 chars (row 53) |
| CLAUDE.md <= 45 lines | st:74-75 | rules squeezed; old numbered rules (22i, 23, 24, 25) still cited in mistakes lines 19, 22, 26, 29, 37, 43, 50, 55, 57 |
| state.md <= 80, every .md <= 300 | st:22-24, 69 | docs split into parts and indexes |
| research reads | agents | deep was 25 reads until today: "stopped every wide run of the day short" (e04a2f4); quick was 4 fetches (f8771c9) |
| report words 250-900 | agents | wide answers compressed |
| board: last 5 showings | cg:116-119 | fine |
| stop: 8 blocks then Claude Code ends the turn anyway | cg:4 | a stop that cannot be satisfied loops 8 times |

### Cost per turn / per action
- `pre`: 280-1,700 ms per Bash, PowerShell, MCP, Write and Edit call, subagents included. It runs `git rev-parse` (cg:37-39) before the mode switch even though `pre` never uses it.
- `stop`: ~0.9-1.0 s, reads the whole 42.6 MB transcript every turn and grows.
- `start`: ~0.6 s.
- each commit: 65-75 s npm test (pre-commit comment still says "a few seconds"), then 2 pushes with secrets.mjs, a ff merge, 2 CI runs. 138 commits on 10-09, 31 by 08:30 today.
- structure rule 9 (st:112-117) spawns `node --check` 117 times: most of the 28 s.

## 3. Missing checks for today's failures
1. Research capped at 25 reads: caps are prose in agent files; nothing reads a research agent's end ("parts left", "limit reached"). SubagentStop has a matcher only for practice-reviewer (settings.json), so a capped report reaches the session as if complete. mistakes row 39, the "guard" for research sizing, still says 6 searches and 20 minutes: rule 8 checks only that a row names an existing file, not that it is true.
2. Library not told: no check ties "agent has WebSearch" to "agent names objekt-papers". practice-reviewer.md still has WebSearch and no word of the 567 MB / 555-file library; general-purpose agents get nothing. A SubagentStart hook for all agents could add the pointer once.
3. Main folder behind: the check exists (cg:185-188, since 06:39 today) but only at turn end, so a power cut mid-turn leaves the gap; per the guard's own comment (cg:34-36) the hook script is run from the main folder, and the git hooks are the main folder's (absolute hooksPath), so any guard fix made in a session is not live until it reaches the main folder; a dirty main folder makes the ff-only step fail; 4 stale worktrees (1a37c5f, 97005d6, 138e8e6, 5796a29) remain.

## 4. Top 10 problems
1. ROOT. Hand-off by two branches: session branch + room-polish + main folder kept equal after every commit (cg:182-188, settings worktree.baseRef head). Doubles pushes and CI, and the guards running are the main folder's copies.
2. ROOT. Text-matching shell guard (cg:47-61): refuses reads, searches, commit messages and heredocs (list above). Teaches workarounds; the test (guard.test.mjs:4-5) accepts it.
3. ROOT. Owner log is not the owner: 66 of 312 entries (312K of 611K chars) are subagent hand-backs and task notifications logged by `prompt` (cg:166-172); 8 of them hold "yes" (our translation), which board.mjs:29-33 counts as his yes. The request auditor also reads them as "his every message".
4. ROOT. Caps by line or character count instead of by purpose: start 10,000 (guard.test.mjs:128, at the limit now), mistakes 60 (zero room), CLAUDE.md 45.
5. ROOT. Every commit runs the full 65-75 s suite (tools/hooks/pre-commit:6), and the stop hook forces a commit every turn (cg:177-178); structure rule 9 alone is ~20 s.
6. SYMPTOM. Unsatisfiable stop loop: an edit to the board/decisions that pushes the start output past 10,000 chars cannot be committed (pre-commit fails), and the stop hook will not end the turn while it is uncommitted: up to 8 forced continuations.
7. SYMPTOM. "Guard" = a file name: structure rule 8 (st:103-105) only checks a path exists, so mistakes rows 39 and 53 (stop runs npm test, removed in a5e54c9; cg:189-190) and the numbered CLAUDE.md rules are stale yet "guarded".
8. ROOT. Limits set by guess, raised only after a wall: research 25 -> 80 reads, quick 4 -> 8, auditor "first five" -> all, all today (e04a2f4, f8771c9). No check reports when an agent hits its cap.
9. SYMPTOM. Review gate voids on any byte of any public file (review-gate.mjs:24-39, 53-56; quest-look.mjs:75): the assistant's own VR look after a one-line fix waits for a full web-researching review run.
10. SYMPTOM. Morning check disagrees with the real setup (morning.mjs:28 expects `tools/hooks`; this worktree has the absolute path) and stale comments mislead (pre-commit "a few seconds" vs 65-75 s).

Index of the 10.10 rebuild audits: [README.md](README.md)
