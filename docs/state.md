# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/youaretheobject` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package). Work: `room-polish`.
  ONE QUEUE STEP = ONE SESSION (his word 9.10). Each session works in its own worktree, made from the main
  folder's HEAD (`.claude/settings.json` worktree.baseRef head; the default was old main); at the end of a step
  fast-forward the main folder (room-polish) to the session branch. Push: his "Делай"; main: his word only.
- Room 01 = illusion of control (Alloy & Abramson 1979), `src/rooms/01-control/`: SET ASIDE 08.10 as a lab
  room (16–20 min of waiting, owner found it unbearably boring). Playtest `?playtest=1`, speed `?speed=N`.
- Supabase `objekt` (`rkvdwzlymmewsxjysgma`, eu-west-1 Ireland), private schema `app`:
  `runs` via `submit_run` (room 01 whitelist), `playtests` via `submit_playtest`; both
  insert-only for anon, verified. Sending is ON in code with consent; privacy page `privacy.html`
  (contact t.me/exxxit). Tests pin client fields to the SQL (`tests/results.test.mjs`, `tests/playtest.test.mjs`).
- Papers (PDF + text, not in repo): `C:\Users\admin\Documents\objekt-papers\`; still missing:
  `docs/papers-needed.md`. 145 cards from full texts: `docs/cards/`, checked by
  `node tools/check-cards.mjs`; catalog generated: `docs/catalog.md` (`node tools/build-catalog.mjs`);
  coverage closed: `docs/search-coverage.md`; ideas: `docs/ideas/`; headset abilities:
  `docs/headset-capabilities.md`; owner page: https://claude.ai/artifact/Srhwjio7Ukp4FBDQAHpZB2
- Plan to 1M players (Russian doc for the owner, 08.10): https://claude.ai/code/artifact/71113d16-57ad-42ce-9905-87ff87dfdbd7
  Its table "Сверка всех твоих просьб" is THE list of every owner request and its state: add new ones there.
  Its section "Как идём дальше" is THE queue: work only on its top step, one at a time.
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS 08.10, old 60 fps bar, no log); `tools/xr-probe.html`.
  Owner plays the test copy https://exxxit-game.github.io/object-preview/ (bookmark in the headset, the
  game from GitHub): `node tools/publish-preview.mjs` before he looks; it never sends data. From 9.10 the
  headset stays on the laptop's USB cable (his choice); it charges slowly and power is cut daily: wake it
  only to check, end with `quest-look.mjs sleep`, push work often. I check in the headset myself:
  `tools/quest-look.mjs` (open [local port], reload, vr, frame, eval, sleep); opening 8.10: sign +10 s, 90 fps (no saved log: re-measure with a log, plan step 4.3).
- Voice: ElevenLabs key in ~/.elevenlabs-key.txt; Daniel, eleven_v3; `tools/make-voice.mjs`, `tools/check-voice.mjs`.

## Decisions with the owner
All in `docs/owner-decisions.md` (shown at every session start): settled, never asked again.

## How errors are caught (the owner cannot read code)
- `new-room` skill; `paper-reviewer` agent; `docs/mistakes.md` (every mistake has a guard); facts in one place
  with a test; `tests/structure.test.mjs` (sizes, imports, no Russian outside texts, this file ≤ 80 lines).
- Machine stops: tools/hooks (no commit while npm test fails, no push without the secret check, main only on
  his word); Claude Code hooks, `tools/claude-guard.mjs` (state at start and after compaction, owner messages
  logged, no skipping hooks, no browser on the laptop, the live DB read only, no GitHub connector writes, no
  turn ends red or unsaved); every guard seen red by `tools/prove-guards.mjs` on GitHub at every push.

## Lessons (do not repeat)
- Read the full paper before recommending or designing (summaries overstated effects twice).
- A session opened from another folder loads that folder's rules: open Object sessions from objekt.
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Open items (9.10). ONE step at a time, a short status after each. Every request: plan doc table.
1. Step 4.3 NOW (his word 9.10, before 4.1 ends). FIRST, his "Давай" 9.10: an automatic stop: tools that start VR in the
   headset (xr-probe-run, quest-look vr) or publish the test copy refuse unless a practice-reviewer run saw the current files
   (the record written by a SubagentStop hook, not by me; claude-guard refuses my writes to it; tests both ways). Then rebuild
   the probe's "input" step by docs/audit/probe-review.md (the first run 9.10 was WASTED: only a colour in the headset, the
   task on his phone): ONE line of words at a time, the next once done, started by his press; rerun with him, then the mic
   (fan off/on); results: docs/headset-capabilities.md. Same visit: "Auto Enable Hands or Controllers" (check over USB), VR
   checks not done (flicker, fps and draw calls logged, placement, sign 10 s). Housekeeping: fact-checker twice on his summary https://claude.ai/artifact/H5ht7VG5QQPDCva7LyDwcU; archive done plan rows.
   4.1 left (causes: docs/audit/README.md): cause 8 (docs/audit/numbers.md: 25 need a source); his yes on the ceiling
   pictures (docs/audit/ceiling/, S28; code: troffers.patch, then a test that troffer ends lie on joints); then the
   fact-checker, request and architecture auditors. Waiting: his yes on the new CLAUDE.md. Open talk: the start's tone,
   step 7. GitHub done fully (PRs with checks, releases, a build stamp): its place waits for his word. Git guide: https://claude.ai/artifact/V4HzbgVtK8HGqczZ3zyfS9.
2. Then 4.2, the data lever first (data stay with us, our own lab; what we need from scientists beyond
   name and ethics approval). Data protection = "the most serious of all": LINDDUN, STRIDE, OWASP ASVS, a
   break-in try on a copy, CSP, the provider must not read rows, permission rules (claude-code/C2).
   Then 4.3 (walking, sitting, hands, objects: checklist to him first), corridor items 3-7, 4a, step 5.
3. Corridor ACCEPTED 8.10 (docs/rooms/corridor-shots/). Style book: https://claude.ai/artifact/DKDDa4sH1BG9TF24MJyQaH.
   Visual designs go to him as pictures BEFORE the game. Headset: his walks over Wi-Fi (quest-wifi), I watch.
