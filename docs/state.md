# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/youaretheobject` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package). Work: `room-polish`.
  Session in a worktree (branch `claude/workflow-testing-plan-96f413` on top of room-polish): I may not
  touch the main folder; the owner fast-forwards it (`git -C <objekt> merge --ff-only <branch>`). Push = owner's word.
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
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS, 72 fps, 08.10);
  `tools/xr-probe.html` (owner presses VR/MR/mic buttons); `scrcpy` installed.
  Owner plays the test copy https://exxxit-game.github.io/object-preview/ (bookmark in the headset; no
  laptop or cable): `node tools/publish-preview.mjs` before he looks; it never sends data. Never make
  him plug cables; adb over Wi-Fi (`tools/quest-wifi.mjs`) only for my own checks. I check in the
  headset myself, without him: `tools/quest-look.mjs` (open, reload past caches, enter VR, read the
  game's own frames, run JS); opening 08.10 measured there: sign at +10 s, 90 fps, clipboard trip 1 s.
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

## Lessons (do not repeat)
- Read the full paper before recommending or designing (summaries overstated effects twice).
- A session opened from another folder loads that folder's rules: open Object sessions from objekt.
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Open items (08.10). ONE step at a time, a short status after each. Every request: plan doc table.
1. Queue step 4: CORRIDOR ACCEPTED by the owner 8.10 (approved shots: docs/rooms/corridor-shots/). Clipboard from a photo,
   hangs by its loop; consent form signed by hand. Detail pass done. Font: Inter (READING FIRST, >= 24 mm). THE CORRIDOR FIRST (his word): finish it before
   anything else, in his order: 1 signature on the form (DONE, he signed in VR 9.10), 2 the lab's seal (his sign: a snake round a globe,
   ring "Лаборатория экспериментальной психологии"; drawing APPROVED 9.10, src/app/seal.js, head and tongue after Heath's Lachesis;
   two stars = the snake's bite; place: by the signature (GOST R 7.0.97-2025 5.24), he chose it; its size waits for the paper rule).
   NOW (his word: no stupid decisions carried into rooms): corridor AUDIT 9.10, docs/audit/scene.md, docs/audit/paper.md, docs/audit/flow.md (~90 findings,
   highs checked by me), fix order in the plan doc section «Проверка коридора 9.10»; first fix = the paper rule (large print,
   docs/research/vr/08-paper.md): DONE in code 9.10 (form = 2 pages, seal pressed by the signature, reviewed, browser-checked);
   MORNING FIRST: headset check of the form (headset asleep: he presses power), request-auditor, then the next fixes.
   17 other projects compared (docs/research/projects/, plan doc «Сверка с другими проектами»), 3 end-wall pictures + a lively opening (Portal-like
   look-at tasks, 1–2 clever jokes), 4 floor directory, 5 LIGHTING (research, before/after pictures). Then
   room 01 onto the experimenter (parked on claude/wip-experimenter: lines to tick, chosen by him).
   Branch pushed ("Делай"), hidden address (rule 14). Style book https://claude.ai/artifact/DKDDa4sH1BG9TF24MJyQaH = THE whole picture. Built: plan B corridor 14.6 m (src/app/lobby/plan.js), numbers 101-109, NIU signs ON the
   doors (SIGN in src/app/brand.js), EXXXIT poster = leave, age asked, WS-900 extinguisher by the stairs, hint never in
   VR. Decided: floor = 9 rooms = one pack, floor 1 free, packs in the Horizon Store app. 72 fps, 124 calls. Ideas: plan doc.
2. Headset: `quest-look.mjs worn on` keeps it awake (`worn off` after); asleep = only his power button wakes it;
   frames render only while the VR session is visible. Visual designs go to him as pictures BEFORE the game.
3. Then first room: read in full Fernández-Ruiz 1999, Hirschhorn 2024, Kohnstamm 1915; 5-minute
   prototypes; owner picks (wow fast, replay your moment, share). Gate 0: 7 of 10 finish, mean 7.
4. Waiting on owner: his decisions in plan «Что нужно от тебя»; domain Verify.
