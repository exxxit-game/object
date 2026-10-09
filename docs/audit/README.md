# The corridor audit: one list by cause

The corridor is what every room is built from, so its mistakes were listed once, by cause, and each
cause gets a guard so it cannot come back. The detail is in the reports, each a snapshot of the code
when it was written (their file:line may have moved since):

- `scene.md`, `paper.md`, `flow.md`: three reviewers on the corridor (scene and objects; the paper and
  its buttons; the flow, the engine and the guards), about 90 findings.
- `inventory.md`: every tool, agent, doc, branch and setting, kept, updated, removed or to start using.
- `architecture.md`: the code and docs against ARCHITECTURE.md and the target architecture.

| # | Cause | Fix | Guard | State |
|---|---|---|---|---|
| 1 | Checks done by hand; tools rot (a headset check on the set-aside room at 60 fps, ports 3000 and 3100, the headset link written three times) | `tools/headset.mjs` is the one link; quest-check plays the corridor at 72 fps | `npm run morning` (`tools/morning.mjs`) checks it all in one command | done |
| 2 | Docs say what is no longer true | eleven docs corrected; a decision for signing by hand | `tests/structure.test.mjs` rule 23: a doc names no constant the code lacks; the architecture auditor before every "done" | done |
| 3 | The same number or code in two places (letter floors in the tests, line wrapping, paper size and colour, the sign's place) | one source each | the tests import the constants | done |
| 4 | Guards that read what the code declares, not what is drawn; a 10 s test that checks a constant; the walking test on the old corridor; the play/pause rule | measure what the player sees; run the rule with a fake clock | each guard fails when its mistake is put back | done (the sound levels stay a manual headset check) |
| 5 | Printed things sized from the paper | the large-print rule (`docs/decisions.md`); the seal and the answer buttons done | `tests/smoke.mjs` letter checks | in part: hanging pages, paper colour, the flyer's format, the scale |
| 6 | Measures off the standard | the room number's capitals and the ceiling grid's 15/16 in face (done); the lights on the grid go with the lighting step, whose source sets their spacing | `tests/masonry.test.mjs`, `tests/tiles.test.mjs` | done but the lights |
| 7 | Behaviour (double click from hand and laser, first or repeat marked early, the sign starting before VR, sound before the first press, a sheet without a hook popping up, placement by a timer) | fix each at its cause | a test per fix | to do |
| 8 | Numbers without a source, and patches | a source or a headset measurement for each | the source written next to it | to do |
| 9 | Promises dropped, auditors not run | the plan doc table, the morning check's reminder | `tools/morning.mjs` warns when the code is newer than the last audit | done |
| 10 | Work only on the laptop; stale branches | ten branches removed, two parked ones kept as tags, the main folder brought up | `tools/morning.mjs` lists what is only here | done |
| 11 | Commits with the owner's own email; keys never checked | history searched: no key ever left; the owner judged the old email acceptable | `tools/secrets.mjs` before every push (`tools/hooks/pre-push`), and in the morning check | done |
