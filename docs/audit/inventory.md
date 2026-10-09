# Repo inventory: outdated, unneeded, unused, and set up but not used

Repo: .claude/worktrees/workflow-testing-plan-96f413, branch `claude/workflow-testing-plan-96f413`, HEAD 0ef5f8b (a commit landed while this ran).
Read only: nothing in the repo was changed.

How it was checked: `git ls-files`; `git log -1 --format=%cs` per file; `git grep` for every tool, doc and export;
a node script listing every `export` in src/ and who uses it; component names against markup; mp3 files against
voice-lines.js and sound-list.js; `git branch -a`, `git rev-list --count`, `git ls-remote`; this session's transcript
(`~/.claude/projects/...96f413/852b0565….jsonl`, 08.10 05:22Z – 09.10 04:19Z) to count how often each tool, agent and skill ran.

Note on tests: `npm test` ran and stopped at `tests/fonts.test.mjs:78` (path undefined). That file has an uncommitted
edit being made by the parent session (`git status`: M brand.js, fonts.test.mjs, masonry.test.mjs), so this result
does not describe HEAD. `node tools/build-catalog.mjs --check` printed "catalog up to date".

Verdicts: **keep**, **update**, **remove**, **start using**.

---

## 1. tools/

Runs counted in this session's transcript. "Refs" means files that name the tool.

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| build-catalog.mjs (08.10) | keep | Rule 10 of tests/structure.test.mjs uses it; `--check` printed "catalog up to date"; ARCHITECTURE and state.md name it | — |
| check-cards.mjs (07.10) | keep | Ran once. Named by state.md, mistakes.md and ideas/*. PAPERS path `C:\Users\admin\Documents\objekt-papers` exists (490 files) | — (see area 8: 15 papers with no card) |
| check-voice.mjs (08.10) | keep | Ran 4×; new-room step 6; testing.md | — |
| make-voice.mjs (08.10) | keep | Ran 14×; voice-lines.js files name it | — |
| make-sounds.mjs (08.10) | keep | Ran 4×; sound-list.js files name it | — |
| publish-preview.mjs (08.10) | keep | Ran 64×; checks CI through `gh` and that the commit email is the hidden one | — |
| quest-look.mjs (09.10) | keep | Ran 166×; CLAUDE.md rule 24; main headset tool (frame, perf at 72 fps / 200 draw calls, levels) | — |
| quest-check.mjs (09.10) | **update** | Ran 22×; new-room step 9 still requires "all PASS". It plays only room 01, which was set aside 08.10, through the room's `#screen` panel. It passes at `fps >= 60`, but quest-look perf and the roadmap use 72. Its screenshot comes from the Quest capture service, which quest-look's header says shows the cameras while the headset lies on the table. The URL is fixed at `localhost:3000`, while launch.json serves on 3100 | Raise the check to 72 fps, take `frame` the way quest-look does, accept a port argument. Or make it a `quest-look play` command |
| quest-wifi.mjs (08.10) | keep (dormant) | Ran 9× before 9.10. From 9.10 the headset stays on USB (state.md). Still named in testing.md and in the quest-look header as an option | Leave it; fix testing.md (area 4) |
| xr-probe-run.mjs (08.10) | **update** | Ran 0× in this session. Only ARCHITECTURE's folder map names it. Its header says "quest-wifi keeps it awake", which is false: quest-wifi has no keep-awake, `quest-look worn on` does. state.md says "owner presses VR/MR/mic buttons", but this script presses them over CDP | Fix the header to say `quest-look worn on` and say in state.md or headset-capabilities.md that the probe can run without him. Otherwise remove it |
| xr-probe.html (+ css/xr-probe.css) | keep | In the `PUBLIC` list of static-server.mjs; headset-capabilities.md "last probe 8 Oct" | — |
| tests/static-server.mjs (`npm run serve`) | keep | package.json, smoke.mjs, publish-preview (PUBLIC). Default port 3000, or `PORT` | — (port note in area 2) |

## 2. .claude/ (agents, skill, launch, settings, hooks)

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| agents/paper-reviewer.md (added 07.10) | keep | Registered in the session; new-room step 8. Ran 0× in this session: no room was built | — |
| agents/request-auditor.md (added 08.10 17:59) | **start using** (for real) | CLAUDE.md rule 22i. Calling it by type failed on 09.10 04:13Z: "Agent type 'request-auditor' not found". The session started 08.10 05:22Z, before the file existed, so it was never loaded. It was imitated 4× by general-purpose agents told to read the .md file | Start a fresh session (after the fast-forward below) so it is a real agent type |
| agents/architecture-auditor.md (added 09.10 00:16) | **start using** | CLAUDE.md rule 22i requires it before any step is called done. It ran 0×: no call by type, and no prompt mentions it. Not registered in this session | Run it once in a fresh session before the next "done" |
| agents/quick-research.md (added 08.10 22:15) | **start using** | Memory "research-time-box" says to use it for every narrow fact search. It ran 0× (the 72 general-purpose agents did that work). Not registered in this session | Use it for the next rule-23 lookup, in a fresh session |
| skills/new-room/SKILL.md (07.10, 08.10) | **update** | Not run in this session (no new room). Step 5 says "Room from the shared parts only", but the shared flow helpers (say, ask, reveal paging) still sit in room 01's room.js (target-architecture "Still to build"), so a second room would copy them. It does not mention the large-print rule (24 mm, `MIN_LETTER`) or docs/research/vr. Step 9 relies on quest-check's 60 fps | Add a step 0: move room 01's flow into src/app/ first. Name the 24 mm rule and research/vr |
| launch.json (08.10): `npm run serve`, port 3100, autoPort | **update** | CLAUDE.md and testing.md say the preview runs at `localhost:3000`. quest-check, quest-wifi and xr-probe-run are hard-wired to 3000. Only `quest-look open local 3100` bridges the two | Write in CLAUDE.md and testing.md that the preview pane uses 3100 and the headset tools use 3000 (or set the pane to 3000) |
| Project settings.json, settings.local.json, hooks | **start using** (optional) | None exist in the worktree or in the main folder. `~/.claude/settings.json` has no hooks and no permissions. Rules 8 and 22 depend on memory alone | Optional: a project allowlist for `npm test` and `node tools/quest-look.mjs` (fewer prompts). A Stop hook reminding to run `npm test` |
| Main folder `objekt/.claude/` (branch room-polish) | **update** | It holds only an older paper-reviewer.md (2205 B against 2253 B) and new-room. It has no request-auditor, architecture-auditor, quick-research or launch.json. room-polish is 57 commits behind this branch, and a lesson in state.md says to open Object sessions from objekt, so a new session there loads stale rules and agents | Owner: `git -C objekt merge --ff-only claude/workflow-testing-plan-96f413` (state.md already gives this command) |

## 4. docs/

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| state.md (09.10, 79 of 80 lines) | keep | Read-first file, enforced by rule 5 of structure.test | — |
| ARCHITECTURE.md (09.10) | keep | Folder map enforced by rule 20; matches git ls-files | — |
| target-architecture.md (09.10) | **update** | "Still to build" lists "future src/engine/stats.js" for "you against other players". Room 01 already reads the aggregates through `compareRoom` (src/engine/results.js:25, room.js:195, migration 0006). That migration's comment says the name avoids "stats" because ad blockers block it | Reword: compareRoom exists for room 01; what is left is a per-room version under a name that is not "stats" |
| roadmap.md (09.10) | **update** | Phase 4 "Statistics live" (privacy page, whitelist, consent, you vs others) is mostly built: state.md says sending is ON, privacy.html exists, compare_room exists. Phase 0 says "130+ experiments", but there are 145 cards. Room 01 is "set aside" (phase 1) and also "sits mid-game, not first" (Decided). The corridor-first order is missing | Mark the done parts of phase 4, change 130+ to 145, give room 01 one wording |
| decisions.md (09.10) | **update** | (a) "Studio's poster … the consent page says how to stop: the EXXXIT sign on the board". The consent text now reads "take off the headset or close the page" (APP_T.consent.form.known; EXXXIT removed in 978a039). (b) "Rooms by play space: at the start the game reads the player's boundary (WebXR bounded-floor)". `git grep bounded-floor\|boundsGeometry src` finds nothing. (c) The bias-blind-spot hook question for a random half: `git grep -i blind src` finds nothing | (a) Fix the sentence. (b) and (c) Add "not built yet" and list them in target-architecture's "Still to build" |
| engine.md (09.10) | **update** (minor) | createSheet also returns `open` and `el` (sheet.js:270), which the doc does not list. It says "results.js … used only through src/app/session.js", but room 01 imports `compareRoom` directly (room.js:24) | Two words in the sheet row; reword the results.js row |
| rooms.md (08.10) | keep | Matches the code (runLobby, room-interior, room-light, SIGN) | — |
| testing.md (08.10) | **update** | quest-look is said to run "headset linked over Wi-Fi", but it has been USB since 9.10 (state.md). The `npm test` row leaves out fonts, playtest, results, issues and control-* (all in package.json). check-cards, build-catalog, make-voice, make-sounds and xr-probe-run have no rows. The serve port is given as 3000 only | Change Wi-Fi to "USB cable (Wi-Fi with quest-wifi)", add the missing rows, mention port 3100 |
| building-standards.md (08.10) | **update** | It has a "Lever" row (strike 40-5/16 in) and "Not verified: levers vs knobs in 1979". decisions.md and src/engine/door.js:4-5 use round knobs from a source (Schlage A Series Plymouth, Allegion cut sheet), and the audit (docs/audit/scene.md:259) confirms it | Rename the row to Knob with Schlage as its source; drop that line from "Not verified" |
| sources.md (09.10) | **update** | Says the Ono sources "stay under the git tag ono-room-final", but the tag is local only (`git ls-remote` shows no tags on origin). The commit 005c92a it points to is on origin. The Latané & Darley 1968 section is shown in no room (`git grep -i latan src` finds nothing) | Push the tag (owner's word) or write the hash 005c92a. Mark Latané & Darley "not shown yet" |
| methodology.md (09.10) | **update** | The room-01 rows quote Ono's numbers: "5 per schedule, p. 263" and "original n = 20". Room 01 is Alloy & Abramson 1979 Exp. 2: n = 64, 8 per cell, pp. 441–485 (sources.md). Only research/vr/06-science.md links to it | Replace with the Alloy & Abramson numbers or make the rows generic |
| experiments.md (07.10) | **remove** (or mark superseded) | Lists Ono as "(01) … Built, but unsuitable" and "02 Smoke room". The 145 cards and the generated catalog.md replace it. Only research/vr/06-science.md and research/vr/README.md link to it; it is missing from ARCHITECTURE's doc list and from state.md | Delete it and point the two links at catalog.md, or put "superseded by catalog.md" at the top |
| vr-checklist.md (09.10) | **update** | "painting behind is optional" belongs to the Ono era (`git grep painting src` finds nothing). "requestSession … remote tools cannot" is false: `quest-look vr` uses CDP `userGesture: true` (quest-look.mjs:87). "Unlock audio [done: start button / Space]": there is no start button, and Space only presses room 01's button (room.js:273) | Fix these three lines |
| rooms/01-control.md (07.10) | **update** (minor) | "Data sent (only with consent, only at full speed, only after the privacy page exists)": the page exists and sending is ON. Room 01 is set aside | Fix the heading; add a one-line "set aside 08.10" note |
| headset-capabilities.md, search-coverage.md, papers-needed.md, catalog.md, cards/ (145), ideas/ (4) | keep | All linked (rule 22). The catalog is current. The roadmap's science track uses the ideas | — |
| research/vr/ (01–08, README), research/projects/ (4) | keep | Base for rule 23; ARCHITECTURE links them | — |
| audit/ (scene, paper, flow, 09.10) | keep | The fix list being worked now (state.md item 1) | Archive once every fix is done |
| mistakes.md, art/, rooms/*-shots, README.md | keep | Guards exist (rule 8); art is used by logo.js and plan.js; the shots back rule 13 | — |

## 5. package.json, package-lock.json, CI

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| scripts `test`, `test:smoke`, `serve` | keep | All 21 `tests/*.test.mjs` are in `test`; smoke.mjs runs in CI | — |
| devDependency playwright 1.64.0, package-lock | keep | Used only by smoke.mjs in CI (`npm ci`) | — |
| .github/workflows/test.yml | keep | Runs on push and PR on every branch: npm test, then smoke. publish-preview reads its result | — |
| .gitignore (`quest-check.jpg`), CNAME | keep | quest-check writes that file; CNAME = youaretheobject.com | — |
| supabase/migrations 0001–0008 | keep | Applied history. 0001 and 0003 name `01-ono`, which 0005 replaces; never edit an applied migration | — |

## 6. src/, css/, vendor/, assets

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| Modules | keep | No dead module: every src file is named by another file (my script; rule 6 of structure.test). Every A-Frame component is used in markup | — |
| `MIN_TARGET_DEG` (src/engine/ui/sheet-math.js:32) | **start using** (or remove) | Exported and used nowhere: no src, test or tool file. docs/audit/paper.md:86 says the same. The 2.5° target rule (decisions.md "answer targets at least 2.5° high") has no shared constant in use | Make choice.js, sheet-page.js and the smoke check use it, or delete it |
| Exports used only by tests | keep | `SIGN_ENDING_DEFAULT` (sign.js:75, only glow.test), `letterDeg` (only sheet.test) | — |
| Needless `export` (used only inside their own file) | keep (tidy later) | `wordWidth` logo.js, `RING_LETTER` seal.js, `ARC` locomotion-math.js, `CLEAR` sheet-math.js, `MARGIN` sheet-page.js | Optional: drop the keyword |
| Engine parts used only by room 01 | keep | away-meter, blob-shadow, grab-press, mirror (mirror-glass), sound-listener. Room 01 is still the default `?room=` and sits behind door 1, so they are live | Review when room 01 moves onto the clipboard |
| css/ (5 files) | keep | Every file is linked (index, privacy, xr-probe). Every custom property is used. No inline style (rule 21) | — |
| vendor/ (aframe-1.7.1, Inter latin and cyrillic, OFL) | keep | Loaded by index.html and css/fonts.css; the licence ships beside the fonts | — |
| Audio (25 voice and 3 sounds in room 01; 3 voice and 4 sounds in the lobby) | keep | Every mp3 is listed in voice-lines.js or sound-list.js, and every sound name reaches `playSound` or a lamp cue. No orphan files | — |
| index.html `<title>Object</title>` | **update** | privacy.html says "You are the object · …". The game's name is "You are the object" (memory, structure rule 13). This title is what the browser tab and a Quest bookmark show | Set the title to "You are the object" |

## 7. git (no stashes: `git stash list` is empty)

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| claude/workflow-testing-plan-96f413 | keep | Current work, pushed | — |
| room-polish (main folder) | **update** | 0 commits not in HEAD; HEAD has 57 more. The main folder therefore runs old rules and agents (area 2) | Owner fast-forwards it |
| main (live site) | keep | 126 commits behind; changes only on the owner's word | — |
| claude/wip-experimenter | **update** | 1 commit, 7815b4b (09.10): decisions.md +5 lines and src/engine/ui/checklist.js, 101 lines. Local only: it is missing from `git ls-remote`, though state.md calls the branch parked | Push it on the owner's word, so it is not on the laptop alone |
| claude/hello-22df14 + worktree .claude/worktrees/hello-22df14 | **remove** | Same commit as main (f8ca364); 0 own commits; the worktree is a detached HEAD; its transcript is 40 min from 08.10 | `git worktree remove` it, then `git branch -d` |
| experiments, fix-dark-screen, fix-painting-jitter, fix-score-screen, hotfix-adblock, restructure-by-architecture, roadmap, text-readability | **remove** (8 local + 8 on origin) | Each has 0 commits outside main (fully merged). All dated 07.10. Each also sits on origin | `git branch -d` for each, then `git push origin --delete` on the owner's word |
| ono-faithful-wip (local + origin) | **remove** | 1 unmerged commit, 64ed3e7: src/rooms/01-ono/* for Ono's 40-minute protocol, "Parked … unsuitable". Ono was dropped (sources.md, experiments.md) | Tag it (e.g. ono-faithful-wip) before deleting, the way ono-room-final was kept |
| test-firefox (local + origin) | **remove** | 2 unmerged commits (07.10) running the smoke test in Firefox. Quest Browser is Chromium, and smoke.mjs has been rewritten since | Delete |
| tag ono-room-final | **update** | Local only, while sources.md relies on it | Push the tag or write the hash (area 4) |

## 8. Set up but never used (beyond the rows above)

| Item | Verdict | Evidence | Smallest action |
|---|---|---|---|
| 15 papers on disk with no card | **start using** | papers-needed.md says "cards not written yet". `git grep "paper: <id>" docs/cards` finds none for: easton-1974, mullen-davidenko-2021, ringelmann-1913 (owner's downloads), pronin-2002, glucksberg-1962, fitts-1954, vonasch-2023, lenggenhager-2007, bahrami-2010, shelton-mcnamara-2001, holway-boring-1941, simons-wang-1998, rieser-1989, aglioti-1995, navarrete-2012 | Card them with check-cards when room choice resumes (state.md item 3) |
| Playtest pipeline (`?playtest=1`, src/app/playtest*.js, migration 0004, `submit_playtest`) | **start using** (later) | Built and tested. askPlaytest is called only from room 01 (room.js:210), and its "when was it most boring" answers name room 01's phases. docs/playtests/ (roadmap phase 2) does not exist. Real tester rows are unverified: Supabase was not queried | Move it to the shared flow together with room 01's helpers before the first-room playtest |
| Decisions the code does not follow | see decisions.md row | boundary read (bounded-floor), the bias-blind-spot hook, the EXXXIT wording on the consent form | — |
| architecture-auditor, quick-research, request-auditor as real agents | see area 2 | 0, 0 and 0 successful calls by type in this session | — |

## Counts

| Verdict | Rows |
|---|---|
| keep | 32 (some rows group several files, e.g. cards/, research/) |
| update | 19 |
| remove | 5 (they cover 11 branches, 9 of them also on origin, and 1 worktree) |
| start using | 7 |
