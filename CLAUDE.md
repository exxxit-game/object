# CLAUDE.md — Object

"You are the object" (the name is never translated): a browser VR game (WebXR, A-Frame). The player is the
subject of real psychology experiments, one room each, then sees how he was caught and what the study found.
The start hook shows docs/owner-decisions.md (settled: never re-ask, never argue against) and docs/board.md
(the work and its only order). Maps: docs/state.md, ARCHITECTURE.md. Answer the owner in Russian, plain
words, short. The repo is English; Russian only where tests/structure.test.mjs allows.

## How we work
- Progress = he saw it and said «да». Every session opens with a row in the board's «Показы» (what he will
  see today) and ends by showing it to him, in the headset or as a picture.
- His new request goes on the board in his words; the order changes only on his word. Technical choices
  are mine: decide, give the reason in a line; never hand him a list to choose from.
- Do exactly what was asked; ideas go at the end of the answer, not into code.
- No new process: a new rule, guard, agent, hook or doc only when the game itself broke or something private
  leaked, and then in place of an old one. This file stays under 45 lines (tests/structure.test.mjs).
- Blocked (a login, a captcha, a paywall, a photo only he can take): ask him at once, with the link.
- He is angry: act on the topic, no promises.

## Truth: we recreate («воссоздаём»)
- Everything but our experiments and words comes from a real source (trade standards, Meta and W3C XR
  guidelines, research, shipped games, code), named next to it (docs/decisions.md or a WHY comment).
  A new look goes to him as pictures first.
- Names, numbers, quotes and pages come from the file (paper texts in C:\Users\admin\Documents\objekt-papers\,
  the code), never from memory. A fact the player sees has its source in docs/sources.md, or is not shown.
- A test or reviewer disagrees: re-read the source and fix the cause; never bend the test. Two or three
  failed tries at one problem: measure first.

## Checking
- "Done" only after `npm test`, saying what ran; no run = "not verified".
- Before he meets anything: my own look in the browser pane and the headset (tools/quest-look.mjs, sleep
  after), the practice-reviewer (VR and the test copy wait for it: tools/review-gate.mjs), the approved
  shots in docs/rooms/. He judges only feel and taste.
- Never Playwright or Chromium on the laptop: the smoke test runs on GitHub. Preview: `npm run serve`.

## Cannot be undone (hooks hold these; never work round them)
- main is the live site: only on his word. Work on a branch; commit and push often (power cuts).
- No key, token or his email in the repo. The live database is read only; changes go through
  supabase/migrations on his word. Never restart the headset while he wears it.

## Rooms and code
- A room starts from its card (docs/catalog.md, docs/cards/), then its paper read in full (about 10 min or
  less for the participant, a clear task), then the new-room skill; the paper-reviewer checks it.
- One room per folder in src/rooms/; the engine never imports rooms. Styles only in css/, player text only
  in texts.ru.js, comments say why (never when or who), files about 300 lines, no build step.
