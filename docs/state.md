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
- Plan to 1M players (Russian doc for the owner, 08.10): https://claude.ai/code/artifact/71113d16-57ad-42ce-9905-87ff87dfdbd7
  Its table "Сверка всех твоих просьб" is THE list of every owner request and its state: add new ones there.
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS, 72 fps, 08.10);
  `tools/xr-probe.html` (owner presses VR/MR/mic buttons); `scrcpy` installed.
  Untethered: `node tools/quest-wifi.mjs` once with the cable, then unplug (owner has a battery strap).
- Voice: ElevenLabs key `C:\Users\admin\.elevenlabs-key.txt`; Daniel, eleven_v3;
  `tools/make-voice.mjs`, `tools/check-voice.mjs` (speech-to-text check), `tools/make-sounds.mjs`.

## Decisions with the owner
- Rooms are faithful re-creations of published experiments; no invented mechanics.
- Space tiers: seated, standing, roomscale 1.8×1.8 m (base; owner's area), large (offered only, never shrunk).
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

## Open items (owner, 08.10). Owner: no rush; only room 01 until it is the model room.
1. DONE: catalog, coverage, diagnostics, "you vs others", xr-probe (area 1.88 x 2.10 m), audio
   4 + 24 ms, plan doc, early-exit choice, age group + "saw someone play" (server 0008), cable.
2. NOW room 01 look. Style CHOSEN: the experiment's era (1979 university lab) + shared signs
   (door with plaque "Room NN · name · year", observation mirror, screen, brand colour); add a
   door, a static-reflection mirror, a chair; screenshots to the owner before release.
3. Then the arrival: experimenter's welcome, lobby/menu, the room door; one unbroken journey.
   Owner's hook: "you, like everyone, are sure this does not apply to you; see for yourself"
   (bias blind spot: ask before the room, show the truth after). Entry ends seated on the chair.
4. Strategy to think through: VR attention is free (sales down, little new content, VR media
   short of topics); streams vs spoilers, media, Quest new tab.
5. Plan doc sections to add: headset add-ons (report in hand: no Web Bluetooth in Quest
   Browser; fans/lamps via smart plug; touch helps presence) and device combos (two headsets,
   phone or laptop + headset, asymmetric roles).
6. Later: first-room candidates (Kohnstamm, Morehead, Hirschhorn, Fernández-Ruiz, pendulum,
   two flashes, Drori) and 2–3 prototypes; Plato's cave; share card, desktop version, Quest new
   tab; headset measurements (battery, Hz, timing, audio loopback, jitter, hands, body, MR).
7. Waiting on owner: play room 01 at real speed; lab letter; plugins.
8. Dialogue review 08.10: all open requests are in the plan doc table (see the link above).
Facts: legs from body tracking are AI-generated (never data); labs have Ouvrai (free) and VERA;
Meta stopped commercial/education sales 20.02.2026; store sales need a store PWA (30%); Steam
Sep 2026 Quest 3 26.9%, Quest 2 25.8%, 3S 11.1%, English 34.2%. Rules: science studies free;
gate 0 = 7 of 10 finish + mean 7.
