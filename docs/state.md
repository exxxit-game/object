# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/object` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package).
  `room-polish` = all current work, pushed, CI green. Release = owner's word only.
- Room 01 = illusion of control (Alloy & Abramson 1979, Exp. 2), `src/rooms/01-control/`;
  Ono kept under git tag `ono-room-final`. Playtest mode: `?playtest=1`. Test speed `?speed=N`.
- Supabase `objekt` (`rkvdwzlymmewsxjysgma`, eu-west-1 Ireland), private schema `app`:
  `runs` via `submit_run` (room 01 whitelist), `playtests` via `submit_playtest`; both
  insert-only for anon, verified. Sending is ON in code with consent; privacy page `privacy.html`
  (contact t.me/exxxit). Tests pin client fields to the SQL (`tests/results.test.mjs`, `tests/playtest.test.mjs`).
- Papers (PDF + text, not in repo): `C:\Users\admin\Documents\objekt-papers\`; still missing:
  `docs/papers-needed.md`. 145 cards from full texts: `docs/cards/`, checked by
  `node tools/check-cards.mjs`; catalog generated: `docs/catalog.md` (`node tools/build-catalog.mjs`);
  coverage closed: `docs/search-coverage.md`; ideas: `docs/ideas/`; headset abilities:
  `docs/headset-capabilities.md`; owner page: https://claude.ai/artifact/Srhwjio7Ukp4FBDQAHpZB2
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (last full PASS before playtest mode);
  `tools/xr-probe.html` (owner presses VR/MR/mic buttons); `scrcpy` installed.
- Voice: ElevenLabs key `C:\Users\admin\.elevenlabs-key.txt`; Daniel, eleven_v3;
  `tools/make-voice.mjs`, `tools/check-voice.mjs` (speech-to-text check), `tools/make-sounds.mjs`.

## Decisions with the owner
- Rooms are faithful re-creations of published experiments; no invented mechanics.
- Space tiers: seated, standing, roomscale 2×2 m (base), large (offered only, never shrunk).
- Live players replace scripted people only where the original had real participants or
  a design like Mori & Arai; mixed reality where the original was a real room.
- Business: first room free, later paid (decide with data); education licences; university
  partners; never sell data, no ads or trackers. Possible second role: platform bringing
  VR players to labs (hypothesis; ask labs first).
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
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Open items (owner list, 08.10) — close in order
1. DONE catalog from cards; DONE coverage map.
2. First room: read in full Kohnstamm, Morehead, Hirschhorn, Fernández-Ruiz (+ pendulum,
   two flashes, Drori); build 2–3 short prototypes; playtest decides.
3. Plato's cave room design (own experiment, labelled as such).
4. Owner-approved screenshot set for room 01 (rule 13).
5. DONE diagnostics: app.issues + submit_issue, sent only with recording (max 5 per load).
6. DONE "you vs others": compare_room (first runs, n >= 10) + reveal page.
7. Engagement: share card without spoilers, desktop version, Quest new-tab submission.
8. Waiting on owner: play room 01 in headset; xr-probe; audio delay test; plugins; lab letter.
