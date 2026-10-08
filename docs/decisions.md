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

## Rooms by play space, never shrunk
Each room carries the space its original procedure needs: seated, standing (Meta's 1 × 1 m stationary boundary), roomscale (walking within 1.8 × 1.8 m, the base design) or large W × L m.
Why 1.8 and not Meta's 2 × 2 m minimum: on the owner's headset the browser reported 1.88 × 2.10 m, less than Meta's minimum, so a 2 × 2 m room would not fit even there.
A room bigger than the player's boundary is offered only to players who have that space; it is never shrunk, since a shrunk procedure is a different experiment.
Consequence: every room states the space its original needs; at the start the game reads the player's boundary (WebXR bounded-floor, works on the owner's Quest 3) and compares. Too small: say how much is needed and offer another room. Boundary unreadable: only seated and standing rooms, or ask the player.

## Research studies are always free for the player
A room whose data goes into a registered study is free while the study runs; paid rooms are entertainment only, and payment is recorded.
Why: paying changes who takes part and biases the sample; all known citizen-science projects are free.
Consequence: a study is paid for by the partner lab or a grant, never by the participant.

## A player who leaves early chooses whether to learn what it was
Leaving VR mid-room shows "go back" or "learn what it was"; a closed page asks the same at the next visit. Nothing is revealed without a click.
Why: debriefing must be available to early leavers (BPS), but someone who left by accident may want to come back naive.
Consequence: src/app/left-early.js; test runs (?speed=N) leave no mark.
