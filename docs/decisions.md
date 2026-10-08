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
A 1979 clipboard sheet is read 1 m in front of the player, a little below the eyes, facing them, and stays still there (world-fixed) until the answer; between readings it hangs on a hook in the room (the corridor: the experimenter's board), and it follows a player who is placed again or moves with the thumbsticks (entries below); answers are given with the laser (the mouse on a desktop). One thought per sheet, pages in turn; the walls stay a lab.
Why: a wall board shared its space between text and buttons and broke (five consent paragraphs squeezed the buttons to 19 px); the original questionnaire was on paper. Proven practice, chosen over the hand-held idea: studies rated a world-fixed questionnaire answered with a pointer best (Alexandrovsky et al. CHI 2020: SUS 91 vs 79 hand-held; Küntzer et al. TVCG 2026: 92 vs 75 on the wrist; Regal et al. 2019: billboard preferred over hand-mounted); Meta: do not anchor menus to the hand (developers.meta.com/horizon/design/hands-ui-best-practices), about 1 m is comfortable to read (…/design/display), rays are comfortable from 0.8 to 3 m, targets 2.5–3° of view.
Consequence: one engine part serves every room and works the same seated, standing, one-handed and on a desktop. Text that does not fit a sheet is an error caught by the smoke test, never shrunk; letters at least 1.2° of view (the room's current minimum: 30 px answers on the wall); answer targets at least 2.5° high.

## The opening is calm: the sign plays with the site's name, the clipboard waits on the wall
In VR nothing happens for the first 10 s. Then the light box over door 1, one lamp per word, starts like an old fluorescent box and reads "youaretheobject.com"; the ".com" lamp fails and dies, "are" and "the" dim to leave "you object", and the sign then plays one of its endings ("The sign ends differently from visit to visit"). Only then does the voice point to the clipboard hanging on the experimenter's board; the player clicks it and it glides on an arc, out to the side and below, to the reading spot 1 m ahead; after the last answer it glides back to its hook.
Why: people spend at least the first 10 s of a new VR place looking around (West 2015, Unity Labs); motion is comfortable when the user starts it (Android XR motion guide) and looming content makes people dodge (Meta health and safety; Ball & Tronick 1971: approach, not a miss path, alarms), so nothing pops up or flies at the face. A word goes dark alone only with its own lamp or transformer (Signs of the Times, neon and fluorescent articles); a sign losing letters to say something else is a known device (TV Tropes "Signs of Disrepair", e.g. L.A. Noire's "LIE"); ".com" did not exist in 1979 (first registration 1985). The clipboard does not stay in the hand: Meta advises against hand-anchored menus, wants at least 0.5 m for long reading and 0.8 m for laser UI, and raised arms tire (Hincapié-Ramos et al. CHI 2014; VRDoc, Lee et al. 2022: 4 of 8 tired within 20 min).
Consequence: src/engine/lightbox.js draws the sign word by word; src/engine/glide.js moves the sheet, its path math in src/engine/ui/sheet-math.js; sheet.js gains hang, take and back; tests/glow.test.mjs and tests/sheet.test.mjs guard the timings and the path; the smoke test and the headset check take the clipboard first.

## The sign ends differently from visit to visit
The sign's play keeps one shared start and has several last beats (src/app/lobby/sign.js, SIGN_ENDINGS): the first visit gets "breaker", then "YOU", then "snap", then round again (SIGN_ROUND); the count of visits stays on the player's device. New endings join the round.
Why: the owner wants a player who comes back to meet something new each time, as a signature of the game; each ending follows the same pattern of a strong last beat (a pause, one clear event, a still hold on the name) and the same flash limits.
Consequence: tests/glow.test.mjs checks every ending and the round; ?sign=a|b|c forces one ending for checks.

## The studio's mark hangs on the experimenter's board
The board beside door 1 carries two A4 sheets: a flyer calling for participants ("Вы подходите", tear-off strips to door 1) and the studio's poster, EXXXIT under its mark: the official ISO 7010 E001 exit sign whose doorway opens onto black space, only the sign's green and black (src/app/logo.js, src/app/lobby/board.js).
Why: the owner's own mark (an exit sign, a figure stepping into space) in place of blank notices; built only from the official drawing, in his colours (green and black, no "studio": the name alone, as Playdead signs).
Consequence: tests/logo.test.mjs keeps the figure official and nothing else drawn into the mark; sources in docs/art/credits.md. The mark may change over time (the owner's wish: a detail for those who notice).

## Moving in the corridor with the thumbsticks
In VR the player moves through the corridor by teleport: a stick pushed forward shows an arc to the floor, releasing it moves them there, a click on the stick cancels; a stick to the side turns them 45° at once, a quick pull back steps them back 80 cm (src/engine/locomotion.js, tests/locomotion.test.mjs). Only the corridor's floor is a target; walls are never crossed. Off in the rooms behind the doors.
Why: the owner found he could not walk in a corridor made for walking. Meta's locomotion guidance (developers.meta.com/horizon/design/locomotion-user-preferences and locomotion-input-maps): default to the comfort-friendly options (teleport, snap turn), snap angles of 30, 45 or 90°, a quick pull back steps back 80 cm; a stick fires past 0.8 as in Meta's Immersive Web SDK, re-arming under 0.5 is ours; snap turning cut sickness in Farmani & Teather 2020. Smooth sliding is the player's other choice (1.4 m/s at once, no acceleration, a vignette while moving: Meta, Bonato et al. 2008, Al Zayer et al. 2019), with smooth turning; until a settings page is approved it is reached with ?move=smooth and ?turn=smooth.
Consequence: the clipboard follows a player who moved (event player-moved); recenter keeps the new place when a seated player stands up.

## The studio's poster on the board is the game's "leave" button
Pointing at the EXXXIT poster on the experimenter's board brightens it; pressing asks "Прекратить участие?" on the clipboard, in the lab's words, not a game's (it cuts in on any page and gives it back on "Продолжить"); the consent page says how to stop: the EXXXIT sign on the board, taking the headset off, or closing the page; leaving fades out, ends VR and says how to come back (src/app/lobby/exit.js; sheet.js interrupt/resume). No exit door of its own.
Why: the owner's idea in his words: the logo will be taken for an exit, so let pressing it be the way out; a participant may leave at any time without penalty (ethics). A separate exit door with its own sign was built first and removed: the owner had asked for the poster itself.
Consequence: the corridor has three doors (tests/standards.test.mjs); the poster stops answering once the player is through door 1; rooms leave through the left-early flow.
## Recording is for adults: the age is asked, not stated
Before the recording choice the clipboard asks "Вам уже исполнилось 18 лет?"; "Нет" goes to a page of its own and the game starts without recording, with no way back to the choice in that run (src/app/consent.js).
Why: a sentence "from 18" checks nothing, and Meta lets children from 10 use Quest; Steed et al. 2016 (IEEE TVCG) asked an 18+ item in their at-home VR study; the BPS guidance for internet research (2021) sends under-age entries to an exit page with no re-entry (docs/research/vr/06-science.md).
Consequence: privacy.html already says recording is from 18; the game itself stays playable without recording; the smoke test answers "Да" in one run and "Нет" in the other.
## What walls hide is not drawn
While its door is shut the room behind it (class room-interior) is not drawn; it appears as the door starts to open (src/app/lobby/lobby.js). Door 1's way (frame, stops, threshold, leaf) is its own group, seen from both sides.
Why: the corridor sat at 200 draw calls a frame in the headset, Meta's limit for Quest 3 (fewer than 200; device optimization comparison), and most of them were the room behind the wall; Meta's WebXR guidance: cull what cannot be seen. Measured: 124 to 41 draw calls for one view.
Consequence: every room marks its inside (tests/structure.test.mjs); `node tools/quest-look.mjs perf` checks the budget in the headset before any new detail goes in.
