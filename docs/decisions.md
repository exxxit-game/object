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

## The arrival: a lab corridor whose doors are the menu
The player starts in a 1979 lab corridor behind the room's door: the experimenter's welcome and the consent are there (once, before the door); each door with its plaque is a room ("soon" on the closed ones). Pointing at a door opens it, the screen fades, and the player is at the table, on the chair when seated. One page and one scene, so VR is never left between corridor and room.
Why: the owner wants an unbroken journey that begins like a real experiment and says the promise first ("take part in a real experiment and learn how YOU react"); a page change would end the VR session.
Consequence: the room's flow starts after the corridor hands over the consent; the hook question (bias blind spot) is asked to a random half before the room and to the other half after it, recorded, once the paper is read in full.

## Everything the player reads or answers is on a clipboard in front of them
A 1979 clipboard sheet appears 1 m in front of the player, a little below the eyes, facing them, only when there is something to read or answer, and stays still there (world-fixed) until the answer; answers are given with the laser (the mouse on a desktop). One thought per sheet, pages in turn; the walls stay a lab.
Why: a wall board shared its space between text and buttons and broke (five consent paragraphs squeezed the buttons to 19 px); the original questionnaire was on paper. Proven practice, chosen over the hand-held idea: studies rated a world-fixed questionnaire answered with a pointer best (Alexandrovsky et al. CHI 2020: SUS 91 vs 79 hand-held; Küntzer et al. TVCG 2026: 92 vs 75 on the wrist; Regal et al. 2019: billboard preferred over hand-mounted); Meta: do not anchor menus to the hand (developers.meta.com/horizon/design/hands-ui-best-practices), about 1 m is comfortable to read (…/design/display), rays are comfortable from 0.8 to 3 m, targets 2.5–3° of view.
Consequence: one engine part serves every room and works the same seated, standing, one-handed and on a desktop. Text that does not fit a sheet is an error caught by the smoke test, never shrunk; letters at least 1.2° of view (the room's current minimum: 30 px answers on the wall); answer targets at least 2.5° high.
