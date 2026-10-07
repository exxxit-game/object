# Decisions

Three lines each: what, why, consequence. No diary.

## No build step, A-Frame vendored
Plain ES modules and `vendor/aframe-1.7.1.min.js`, served as static files.
Fewer moving parts for a non-programmer owner and for AI sessions.
Consequence: no bundler, no npm runtime dependencies.

## Rooms talk to the engine only through the contract
Engine never imports rooms; components communicate by DOM events
(`look-change`) or the shared `eventLog`. Keeps rooms replaceable.
Consequence: no `window.*` globals between files.

## Heavy tests run in GitHub Actions, not on the laptop
The smoke test needs Chromium; the owner's laptop must stay free.
Locally only `npm test` (Node, under a second).
Consequence: the smoke result is seen on GitHub after a push.
