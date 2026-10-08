# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/object` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package).
  `room-polish` = all current work; I never push (`git status -sb` shows what CI has not seen).
  08.10: pushed to a603c1d, CI red since 3feecd9 (smoke "answer text too small: 19px"). Release = owner's word.
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
  Its section "Как идём дальше" is THE queue: work only on its top step, one at a time.
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
- A session opened from another folder loads that folder's rules: open Object sessions from objekt.
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Open items (owner, 08.10). No rush; only room 01 until it is the model room. Owner is
## getting lost: ONE step at a time, a short status after each. Every request: plan doc table.
1. DONE: catalog, coverage, diagnostics, "you vs others", probes, plan doc, early-exit choice, age
   + "saw someone play" (server 0008), cable, era look (door, plaque, mirror, chair), one tile
   grid, chair under a seated player (no lift), merge-static (39 draw calls in the headset).
2. DONE frame rate: probe 72 fps, quest-check 11/11 (fps ≥ 60). Real VR fps: while the owner plays.
3. DONE arrival 08.10: corridor (src/app/lobby), welcome with the promise, consent before the
   door, door opens, fade, at the table; headset check 11/11 through it. Hook question (half
   before / half after): Pronin, Lin & Ross 2002 read in full (objekt-papers/pronin-2002.pdf +
   .txt); queue step 3. Journey by stages: plan doc section "Как идём дальше".
4. Then: owner-approved screenshot set (re-shoot all); plan doc sections: add-ons, device combos.
5. Headset without the owner: quest-wifi keeps it awake ("worn" mode); tools/xr-probe-run.mjs
   presses probe buttons as a user gesture (CDP userGesture). Mic works; VR started once, then
   NotSupportedError: investigate. Probe results now kept in localStorage.
6. Domain: owner added the GitHub TXT; visible on Google/Cloudflare/Namecheap: owner presses Verify.
7. Owner may have missed (tell him): plan doc section "Окно внимания" (VR attention is free);
   circle needs fuel (new rooms, fresh tricks); offer: owner's wording in the circle diagram.
8. Later: first-room candidates + prototypes; Plato's cave; influence (Bernays) rooms; packs not
   $1; statistics plan; target-architecture.md update; share card, desktop, Quest new tab.
9. Waiting on owner: play room 01 (queue step 1); lab letter; release word; push. Suggested plugins
   NOT installed (Data, Research Desk, Customer Research Kit, Legal, Scientific-Coding).
Facts: body-tracking legs are AI-generated; labs have Ouvrai and VERA; Meta stopped education
sales 20.02.2026; store sales need a store PWA (30%); Steam Sep 2026 Quest 3 26.9%, Quest 2
25.8%, 3S 11.1%, English 34.2%. Rules: science studies free; gate 0 = 7 of 10 finish + mean 7.
