# Project state and lessons (read this first in every new session)

## Where things are
- Repo `exxxit-game/object` (local folder `C:\Users\admin\Documents\GitHub\objekt`).
  Site: https://youaretheobject.com (GitHub Pages, https enforced, CNAME in repo).
- Branches: `main` = live site (older package). `room-polish` = unreleased work:
  sounds, hand grab, shadows, VR recenter + seated mode, consent, stats client,
  code-review fixes, Daniel voice. `ono-faithful-wip` = parked 40-minute Ono pieces
  (original schedules, signal light, analyseOno) for reuse.
- Supabase project `objekt` (`rkvdwzlymmewsxjysgma`, eu-west-1). Table `app.runs`
  in a private schema, only `public.submit_run()` for anon (insert-only, field
  whitelist, 2 KB, flood guard). Migrations in `supabase/migrations/`.
- ElevenLabs key: `C:\Users\admin\.elevenlabs-key.txt` (never in the repo).
  Voice "Daniel", model eleven_v3, tag "[уверенно, твёрдо]". Tools:
  `tools/make-voice.mjs`, `tools/make-sounds.mjs`.
- Headset: Meta Quest 3 over USB (adb). `tools/quest-check.mjs` plays the room in
  the headset; remote VR entry is impossible (needs a real controller press);
  worn mode: `adb shell am broadcast -a com.oculus.vrpowermanager.prox_close`
  (undo: `...automation_disable`).

## Decisions with the owner
- Rooms are faithful re-creations of published experiments. No invented mechanics.
- Business: first room free, next rooms paid (bundle better than $1 each — to
  revisit); licences for education; university partners. Never sell data, no ads
  or third-party trackers.
- Ethics: consent screen, 18+, "start without recording" button (approved), quit
  any time, full debrief; anonymous data only; privacy page needed at
  youaretheobject.com/privacy before recording. Science-grade data needs ethics
  approval via a university co-author; preregister (OSF) before.
- First and repeat runs are stored and analysed separately.
- Formal address ("вы") everywhere; no music; batch releases only on the owner's word.
- Name "Object": the human is the object of the experiment. Domain youaretheobject.com.

## Lessons (do not repeat)
- **Read the original paper in full before designing a room.** Abstracts are not
  enough: a true fact (S15 touching the ceiling) was once removed for that reason.
- **Check fit before building:** original participant time ≤ ~10 minutes and the
  participant has a clear task or tension. Ono (1987) is 40 minutes of waiting:
  unsuitable as a room; compressing it changes the experiment.
- Do the steps you can do yourself; verify in the headset yourself before asking
  the owner to look; give clickable links; one decision per question.
- File names that look like analytics get blocked by ad blockers (test exists).
- Releases: batch, never many small releases per day.

## Next
- Target layout of every file (now → final): `docs/target-architecture.md`.
  Any refactor follows it; a room never re-implements shared parts.
- Room choice: smoke room (Latané & Darley 1968) is the candidate for room 01.
- Repurpose the Ono booth (levers, counter, lamp, one-way mirror) for a short,
  faithful experiment (candidate: illusion of control, Alloy & Abramson 1979).
- Privacy page, diagnostics (errors/devices, with consent), "you vs others" read.
