---
name: new-room
description: Build or substantially change a room of Object (a re-created psychology experiment). Use whenever a new experiment is chosen or a room's procedure, texts or measures change. Fixed order of steps; none may be skipped.
---

# New room: steps in order

The owner cannot read code or papers, so every step leaves proof a machine can
check. Do not tell the owner "done" before step 9.

1. **Paper in full.** Download the original (and the main replication) into
   `C:\Users\admin\Documents\objekt-papers\` as PDF and `pdftotext` .txt. Read the
   method and results completely (CLAUDE.md rule 16). If the participant's time is
   far over ~15 min or there is no task/tension, stop and tell the owner.
2. **Owner decisions.** Everything the headset cannot copy (money, typing, paper
   forms, live experimenter, personal data) goes to the owner as one question each,
   with a recommended option.
3. **Spec** `docs/rooms/NN-name.md`: the original procedure table with pages, the
   results to compare with, deviations (told to player or docs only), "not in the
   paper: our choices", flow and states, data sent. Facts also in `docs/sources.md`.
4. **Numbers first.** `protocol.js` (procedure) and `original.js` (results shown),
   page in each comment, frozen; a test pins every value to the paper. Then pure
   `schedule.js` / `report.js` with tests. Break a value on purpose once: the test
   must go red.
5. **Room** from the shared parts only: `src/app/consent.js`, `src/app/session.js`,
   `src/engine/ui/choice.js`, `src/engine/ui/scale.js`, voice, sound. Widgets go
   under the text (`panel.write` returns where it ends). Answer options: equal size;
   random order where order could bias.
6. **Words and voice.** `texts.ru.js` only; formal "вы". Record with
   `node tools/make-voice.mjs NN-name`, then `node tools/check-voice.mjs NN-name`:
   every line must match (a number heard as digits is fine).
7. **Tests.** `npm test` green (structure rules included). Update `tests/smoke.mjs`
   and `tools/quest-check.mjs` for the room's flow.
8. **Independent review.** Run the `paper-reviewer` agent on the room. Verify its
   main claims in the paper yourself, fix, then run it again on the fixes.
9. **See it.** Browser pass at `?speed=20` with screenshots of every new screen;
   `node tools/quest-check.mjs` in the headset (all PASS). Only now report, saying
   what ran and what was seen.
10. **Lessons.** Every mistake found on the way gets a guard (test, tool or agent
    check) and a row in `docs/mistakes.md`.
