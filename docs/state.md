# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/youaretheobject` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package). Work: `room-polish`.
  Session in a worktree (branch `claude/workflow-testing-plan-96f413` on top of room-polish); the main folder is
  fast-forwarded to it on the owner's word (last 9.10). Push of the branch: his "Делай"; main (the live site): his word.
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
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS 08.10 at the old 60 fps bar, no saved log);
  `tools/xr-probe.html` (owner presses VR/MR/mic buttons); `scrcpy` installed.
  Owner plays the test copy https://exxxit-game.github.io/object-preview/ (bookmark in the headset, the
  game from GitHub): `node tools/publish-preview.mjs` before he looks; it never sends data. From 9.10 the
  headset stays on the laptop's USB cable (his choice); it charges slowly and power is cut daily: wake it
  only to check, end with `quest-look.mjs sleep`, push work often. I check in the headset myself:
  `tools/quest-look.mjs` (open [local port], reload, vr, frame, eval, sleep); opening 8.10: sign +10 s, 90 fps (no saved log: re-measure with a log, plan step 4.3).
- Voice: ElevenLabs key `C:\Users\admin\.elevenlabs-key.txt`; Daniel, eleven_v3;
  `tools/make-voice.mjs`, `tools/check-voice.mjs` (speech-to-text check), `tools/make-sounds.mjs`.

## Decisions with the owner
- Rooms are faithful re-creations of published experiments; no invented mechanics.
- Space tiers: seated, standing, roomscale 1.8×1.8 m (base; owner's area), large (offered only, never shrunk).
- Live players replace scripted people only where the original had real participants or
  a design like Mori & Arai; mixed reality where the original was a real room.
- Business (08.10): the first 5–10 rooms free, chosen to work even when the trick is known, so streamers
  spread them; keep releasing. Then paid packs; education licences; university partners; never sell data.
- Ethics: consent, 18+ for recording, "start without recording", quit any time, debrief,
  anonymous data; science only after ethics approval + preregistration + separate consent.
- Playtest: 5–10 testers from the owner's Telegram VR community; 5 approved questions.
- Formal "вы"; no music; batch releases only on the owner's word.

## How errors are caught (the owner cannot read code)
- `new-room` skill; `paper-reviewer` agent; `docs/mistakes.md` (every mistake has a guard).
- Facts live in one place with a test; cards need quotes the checker finds in the paper.
- `tests/structure.test.mjs`: file sizes, import direction, no Russian outside texts,
  no dead modules, docs name real files, this file ≤ 80 lines, syntax, catalog current.
- Answers say what was run and seen; otherwise "not verified". Owner sees CI light.
- Machine stops (tools/hooks): no commit while npm test fails; no push without the secret check; main only
  on his word; on GitHub main can be neither deleted nor rewritten. `fact-checker` agent: every claim, twice.

## Lessons (do not repeat)
- Read the full paper before recommending or designing (summaries overstated effects twice).
- A session opened from another folder loads that folder's rules: open Object sessions from objekt.
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Open items (9.10). ONE step at a time, a short status after each. Every request: plan doc table.
1. Queue step 4.1 NOW (his word 9.10: yesterday's mistakes fixed for good, control not resting on my
   memory). Done: causes 1-4, 6, 9-11 (docs/audit/README.md), hooks, the GitHub rule on main, the plan
   checked twice and fixed (docs/audit/plan-check.md), done requests in the tab «Архив просьб», premortem
   (docs/audit/premortem.md), docs split under a 300-line test. Next: c) review of every rule, memory,
   skill and agent with Cosmogram's lessons (docs/research/projects/cosmogram.md), rule 23 first, to him
   for "да"; e) causes 5, 7, 8; f) the style book (Design System) from the game.
2. Then 4.2, the data lever first (data stay with us, our own lab; study what we need from scientists
   beyond name and ethics approval, how our conditions differ from a lab). Data protection = "the most
   serious of all" (his word 9.10): LINDDUN, STRIDE, OWASP ASVS, a break-in try on a copy, CSP, the
   provider must not read rows, my server access read-only (2 rows in app.runs, advisors clean, 9.10);
   against "secret extraction" (Zuboff, NYT 12.11.2021). Then 4.3:
   the headset and his gear, with logged measures. Then the corridor: 3 end-wall pictures and a lively
   opening, 4 floor directory, 5 lighting (lights on the ceiling grid). Then room 01 onto the experimenter
   (parked on claude/wip-experimenter), then the first room (step 5).
3. Corridor: ACCEPTED 8.10 (docs/rooms/corridor-shots/); consent form signed by hand and sealed (2 pages,
   seal by the signature, GOST R 7.0.97-2025 5.24, approved 9.10). Style book (THE whole picture):
   https://claude.ai/artifact/DKDDa4sH1BG9TF24MJyQaH. Visual designs go to him as pictures BEFORE the game.
4. Headset on USB: `quest-look.mjs worn on`, check, `sleep`. Waiting on him: plan «Что нужно от тебя».
