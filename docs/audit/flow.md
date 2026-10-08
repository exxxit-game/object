# Audit: how the corridor runs, the engine parts it uses, the guards

Read only. Repo at branch claude/workflow-testing-plan-96f413. Paths are relative to the repo root.
Severity: high = rooms will copy it or the player meets it; medium; low.

## Findings

F1. src/engine/ui/sheet-page.js:9, :19-22; src/engine/ui/sheet-math.js:8,13. Root of the seal problem. Category B.
  What: the clipboard and its paper are scaled 2.6x to a UI reading distance, and the text roles are set in mm on that enlarged paper. Anything drawn "relative to the paper" (the seal, a form's boxes, a stamp) then inherits two different wrong scales.
  Evidence: `export const PAPER = { w: 0.56, h: 0.72 };` and `const IN = 0.56 / 8.5;   // metres an inch at this scale` ("scaled so its Letter-shaped paper ... reads at 1 m"). Letter is 8.5 x 11 in (0.216 x 0.279 m), so the whole clipboard is 2.59x real. Roles `title 0.044, body 0.028, soft 0.024` m on a 0.72 m page are 0.061/0.039/0.033 of the page height. Typed 18/12/10 pt on Letter would be about 0.023/0.015/0.013 of the page height, so the text is about 2.6x too big relative to the paper. In world size, together with the 2.6x paper, that is about 6-7x a real form.
  The reading distance is the reference that was chosen wrongly: READ_DIST 1.0 m is Meta's distance for UI panels, not the distance a hand-held paper is read at.
  Settles it: a sourced reading distance for paper (ergonomics or ISO reading-distance figures), the real Letter page with real type sizes, and a decision in docs/decisions.md that says which of the two (real scale or legibility) wins and how a stamp or seal is then sized (as a share of the real page, never of the scaled text).
  Severity: high. Every form, stamp and printed thing in every room is built on this sheet.

F2. src/app/lobby/opening.js:63-67. Category C/F.
  What: the fix for mistakes.md row 24 moved the symptom instead of removing it. The VR button no longer starts the sign, but any press on the 3D view still starts it on a device where a headset is connected. In the Quest Browser's flat window, players press or drag on the canvas to look around before they press VR. The sign then plays on the flat page, and the 10 s rule (West 2015) is broken for exactly the players it was meant for.
  Evidence: `if (!AFRAME.utils.device.checkHeadsetConnected()) return Promise.resolve();` ... `scene.canvas.addEventListener('pointerdown', flat, { once: true });`
  Settles it: a check in the headset with quest-look: load the page, click the canvas once in 2D, then enter VR, and time when the sign starts. Also a guard test of the arrival rule itself, not of the constant (see F12).
  Severity: high. The player meets it on Quest, the main target.

F3. src/engine/fader.js:5 (`ms: { default: 450 }`); src/app/lobby/lobby.js:49, 173, 175, 182. Category A.
  What: the passage through door 1 is timed entirely by guesses: 700 ms door swing, a fade that starts 500 ms in (before the door has finished), a 450 ms linear fade, 250 ms of black, then a 450 ms fade back. The door also opens to a 95 degree angle with no source. None of these numbers has a source written anywhere. This is the template every room's entry will copy.
  Evidence: `const DOOR_MS = 700;` `door.setAttribute('animation', { property: 'rotation', to: '0 95 0', dur: DOOR_MS, ...` `await delay(500);` `await delay(250);` `schema: { ms: { default: 450 } }`
  Settles it: Meta's locomotion and transition guidance on fade or blink length for scene changes; the door closer's opening speed and swing in the door hardware standard (the door.js sources: ANSI/BHMA A156.4 for closers); a headset frame-timing measurement of the passage with quest-look.
  Severity: high.

F4. src/engine/recenter.js:14-15, :55. Category A/B.
  What: "is the player seated" is decided by a head height of 1.35 m, with a ±0.15 m margin to switch, and a seated player is lifted to 1.6 m. No source is given. A short adult or a child standing (Meta allows ages 10 and up) can be under 1.35 m and gets lifted 0.2-0.4 m into the air. A tall player on a high stool can sit above 1.35 m and is not lifted. Every room uses this component.
  Evidence: `eye: { default: 1.6 },` `seatedBelow: { default: 1.35 },` `if (this.seated ? y > this.data.seatedBelow + 0.15 : y < this.data.seatedBelow - 0.15) this.apply();`
  Settles it: anthropometric tables (ANSUR II, or the NASA-STD-3000 / HFES 300 percentiles) for standing eye height (5th percentile female) and sitting eye height plus seat height (95th percentile male); or ask the player (Meta's own seated/standing choice) instead of guessing from height.
  Severity: high.

F5. src/engine/recenter.js:27, 29, 37. Category C.
  What: timeouts that hide a race. "The first pose arrives a few frames after the session starts", so placement runs after a fixed 300 ms (100 ms after a reset). On a slow first frame (shader compile, a heavy scene, a cold cache), apply() reads the pre-pose camera: the player is placed with the wrong offset and yaw, and nothing retries. apply() also returns quietly when `!isPresenting`.
  Evidence: `setTimeout(this.apply, 300);` `space.addEventListener('reset', () => setTimeout(this.apply, 100));`
  Settles it: wait for the first XRFrame whose getViewerPose(refSpace) is non-null (the WebXR way to know a pose exists), then apply. Measure in the headset with quest-look how many ms the first pose actually takes after a cold load.
  Severity: medium.

F6. src/app/lobby/lobby.js:135, 140, 143; src/app/lobby/opening.js:37 vs :46; src/engine/voice.js:24. Category D/F.
  What: three different policies for a sound requested before audio is unlocked, all in one sequence:
  - the sign's hum waits for the unlock (onUnlock);
  - the starter clicks, the breaker and the relay are dropped silently (playSound returns a dead handle);
  - the voice line "take the clipboard" is dropped silently (speak resolves false).
  On a computer with no headset the sign plays at once (arrival resolves at once), so a player who has not clicked hears no clicks and no voice. The clicks are what is meant to turn the eyes to the sign (Rothe & Hußmann 2018). In VR the gesture listener is registered only at line 135, after `await sheet.hang(...)`. A press on the VR button before that point is missed, and audio stays locked until the explicit `unlock()` after the take.
  Evidence: `if (cue.sound) playSound(cue.sound, SIGN_AT, SOUND_GAIN[cue.sound]);` vs `delay(SIGN_LIT_AT).then(() => onUnlock(() => { hum = playSound(...)` ; `speak(LOBBY_T.takeSheet);` (line 140) before `unlock();` (line 143); voice.js `if (!ctx || !raw.has(text)) return Promise.resolve(false);`
  Settles it: one rule for every timed sound (the onUnlock pattern), the gesture listener registered at mount, and a run on desktop and in the headset logging `voice-line` events, to check that every line is heard.
  Severity: medium.

F7. src/app/lobby/lobby.js:41. Category A.
  What: the brightness of every print on the corridor walls (plaques, notices, the clipboard on its hook) is set by eye.
  Evidence: `const WALL_PRINT_LIGHT = 0.45;` with the comment "(chosen by eye in rendered frames ...)".
  Settles it: derive it from the corridor illuminance that is already sourced (S13, at most 10 fc) and paper reflectance, with the same white-card meter the smoke test uses; or light the prints instead of drawing them unlit.
  Severity: medium. Rooms will hang prints the same way.

F8. src/app/lobby/lobby.js:50-53. Category A.
  What: how much of the room's light shows while the door opens is declared unchecked.
  Evidence: `const DOOR_PEEK = 0.25;` with the comment "(our choice, to be checked in the headset)".
  Settles it: the smoke test's light meter on the corridor floor during the peek, against S13; a headset frame.
  Severity: low.

F9. src/app/lobby/sign.js:91-93. Category A.
  What: three of the four arrival numbers are declared unchecked, and they control the first minute of the game.
  Evidence: `export const ARRIVAL = { orientS: 10, lookDeg: 30, lookWaitS: 10, litPauseS: 3 };` "lookDeg, lookWaitS and litPauseS are our choices, to be checked in the headset."
  Settles it: lookDeg from the comfortable head-rotation range (Meta's field-of-view and comfort-zone guidance); litPauseS and lookWaitS from timed quest-look runs with players. state.md records only "sign at +10 s".
  Severity: medium.

F10. src/engine/ui/sheet-math.js:50-57; tests/sheet.test.mjs:42. Category A/E.
  What: the clipboard trip's side swing, drop and speed are declared unchecked, yet mistakes.md row 25 writes "at least 1 s" as if it were a rule. The test then asserts the code's own constant.
  Evidence: `export const GLIDE = { side: 0.35, drop: 0.2, msPerM: 700, minMs: 1000, maxMs: 1800, ...` "SIDE, DROP and the time per metre are our choices, to be checked in the headset." Test: `assert.ok(ms >= 1000 && ms <= GLIDE.maxMs && GLIDE.minMs >= 1000, ...)`
  Settles it: Meta's grab and motion timing specs (cited only as "Meta's grab specs" for the easing), or a timed headset run.
  Severity: medium.

F11. src/app/lobby/plan.js:69-70. Category A.
  What: the walkable area keeps the head 0.3 m from three walls and 0.25 m from the fourth. No source, and no reason for the difference. Every room's locomotion bounds will copy this.
  Evidence: `// where the head may go: 0.3 m from the long walls and ends, 0.25 m from the stairs' wall` `minZ: round(PLAN.north + 0.3), maxZ: round(PLAN.south - 0.25)`
  Settles it: half the shoulder breadth from anthropometric tables plus the camera's near plane; Meta's guidance on keeping the camera out of walls.
  Severity: medium.

F12. tests/glow.test.mjs:79-80 (guard of mistakes.md row 24). Category E.
  What: row 24 says the guard catches "opening.js arrival() starts it in VR only after that wait, never on the VR button press". The test only checks two constants. It never runs arrival(), never checks that orientS is used, and never checks what starts the sign (see F2). Deleting `await delay(ARRIVAL.orientS)` from opening.js would pass npm test.
  Evidence: `assert.ok(ARRIVAL.orientS >= 10, ...)`, `assert.ok(ARRIVAL.litPauseS > 0, ...)`
  Settles it: a smoke-test step with a stubbed vr-mode that measures when lightbox.run starts, and a flat-page click that must not start it.
  Severity: medium.

F13. tools/quest-look.mjs:28-34, 88-157; tests/sound.test.mjs:21-23 (guards of mistakes.md row 28). Category E.
  What:
  - The levels check is manual and runs only when someone remembers. npm test only checks that every corridor sound has some gain key, so a changed gain passes CI.
  - It covers only the corridor's SOUND_GAIN. Room sounds are still set by ear (room.js `playSound('room', null, 0.12, true)`, trials.js `playSound('button', ..., 0.7)`), which is exactly the mistake the row describes.
  - The mix is measured at one spot facing one way. With refDistance 0.6 and an inverse model, a player who walks under the sign (BOUNDS reach z 2.1) is about 0.74 m from it instead of 1.38 m, so the events are about 5 dB louder than measured, against a voice that is not spatial.
  Evidence: `assert.deepEqual(Object.keys(lobby.SOUND_GAIN).sort(), lobby.SOUNDS.map(s => s.name).sort(), 'every corridor sound has a gain');`
  Settles it: record the measured levels in a file that a test compares with SOUND_GAIN; extend the levels check to every room's sounds and to the nearest spot the walkable area allows.
  Severity: medium.

F14. src/app/lobby/sound-list.js:120-125. Category C/D.
  What: the starter click's file is quiet, and a runtime gain of 9 (+19 dB) makes up for it. Voice files are evened in the tool to one loudness (make-voice.mjs: -18 LUFS, -1.5 dBTP); effect files are not evened at all. Any future replacement of the click file then carries a 19 dB boost.
  Evidence: `export const SOUND_GAIN = { 'sign-click': 9, 'breaker-clack': 1.1, 'relay-thunk': 1.7, 'sign-hum': 0.28 };` "The starter click is a faint sound on its own ... hence its large gain."
  Settles it: normalise the effect files in make-sounds.mjs as the voice is (EBU R128 or a peak target), then measure the gains again.
  Severity: medium.

F15. src/engine/grab-press.js:15-16, 25. Category C/D/F.
  What:
  - Two input paths send the same click with no dedupe. grab-press sends 'click' on triggerdown when the hand is within 10 cm; the laser's cursor sends 'click' on triggerup for whatever it points at. A hand on the button that also points at it presses twice. Room 01 logs the second press as 'extra' (trials.js:101) and plays the button sound twice.
  - The 10 cm radius and the haptic 0.25/25 ms have no source.
  - The refresh assumes 72 Hz.
  Evidence: `this.el.addEventListener('triggerdown', press);` `if (this.frame++ % 72 === 0)` `radius: { default: 0.1 }`
  Settles it: one press per trigger cycle per hand; Meta's direct-touch interaction specs for the touch radius; refresh by time, not by frame count.
  Severity: medium. An engine part for every hand-pressed thing.

F16. src/app/session.js:69 with src/engine/results.js:50-55. Category B.
  What: "first vs repeat" is marked when the player starts (consent), but the comment and the statistics mean "finished before". A player who quits after a few seconds is counted as a repeat on their real first full run, which mixes the very groups that "must never be mixed".
  Evidence: results.js `// Whether this browser has finished this room before (first vs repeat runs must never be mixed ...)`; session.js `begin(withRecording) { record = !!withRecording; first = markPlayed(roomId); ...`
  Settles it: decide (with the paper's or a preregistration's definition of naive) whether exposure means consent, the start of the trials or the end, then mark at that point.
  Severity: medium.

F17. src/engine/locomotion-math.js:189-192. Category B/A.
  What: the arc's throw speed (6 m/s) and air time (1.2 s) are justified as reaching "most of the corridor", which was true of the old 5.8 m corridor. The corridor is now 14 m walkable (BOUNDS x -6.3..7.7). The reference is stale, and the speed has no source.
  Evidence: `// The teleport arc: a thrown point (metres, seconds). At 45° from the hand it reaches about 4.5 m, most of the corridor;` `export const ARC = { speed: 6, gravity: 9.8, step: 0.025, maxT: 1.2 };`
  Settles it: the teleport range in Meta's locomotion guidance or the Immersive Web SDK's teleport defaults (the source already used for the stick threshold).
  Severity: medium.

F18. tests/locomotion.test.mjs:9. Category B/E.
  What: the guard tests against the old corridor, typed in by hand, not against the plan it claims to guard.
  Evidence: `const corridor = { minX: -3.1, maxX: 2.7, minZ: 2.1, maxZ: 3.35 };`. plan.js BOUNDS is now `{minX:-6.3,maxX:7.7,minZ:2.1,maxZ:3.35}`. The same stale bounds stand in the usage comment at locomotion.js:13.
  Settles it: import BOUNDS from src/app/lobby/plan.js, as sheet.test.mjs does.
  Severity: low.

F19. src/app/lobby/opening.js:46 vs the lamps' tick-driven run. Category D.
  What: two clocks for one event. The hum starts on a window timer (wall clock); the lamps and their cues run on the scene's frames. When frames stall or the session is hidden, the timer runs on and the hum starts before or after the sign lights. The cues already carry hum levels, so the hum's start could be a cue too.
  Evidence: `delay(SIGN_LIT_AT).then(() => onUnlock(() => { hum = playSound('sign-hum', ...` while `face.addEventListener('lamp-cue', ...)` drives every other sound.
  Settles it: make the hum's start a lamp cue at SIGN_LIT_AT.
  Severity: low.

F20. src/app/lobby/lobby.js:107, 173; src/engine/fader.js:24; src/engine/glide.js:28-29; src/engine/locomotion.js:121; src/engine/ui/sheet.js:111. Category D.
  What: five ways to animate a change, each with its own clock and curve:
  - A-Frame `animation` with easeInOutQuad (door, room light);
  - the glide component with its own easeInOut;
  - the fader's linear step with a `dt || 16` fallback;
  - exponential smoothing at 10/s (vignette);
  - a 150 ms scale pop (sheet).
  In the same way, the test speed (?speed=N) scales opening.js but not lobby.js's `delay(500)`/`delay(250)`, the fader, the door or the glide.
  Evidence: as quoted in the listed lines; lobby.js `const delay = (ms) => new Promise((r) => setTimeout(r, ms));` vs opening.js `const delay = (s) => new Promise((r) => setTimeout(r, s * 1000 / SPEED));`
  Settles it: one tween helper in the engine (tick-driven, one easing family, SPEED-aware), named in docs/engine.md.
  Severity: low.

F21. src/engine/ui/sheet.js:84, 204. Category C/D.
  What: a 50 ms timeout before following the player (most likely waiting for the camera's world matrix to update), and a 100 ms polling loop on `glide.trip`, although glide.go already returns a promise.
  Evidence: `if (el.components.glide.trip) movedOnTheWay = true; else setTimeout(place, 50);` `while (el.components.glide.trip) await new Promise((r) => setTimeout(r, 100));`
  Settles it: place on the next tick (or after `camera.updateMatrixWorld()`); keep and await the trip's promise.
  Severity: low.

F22. src/engine/ui/sheet-page.js:16 vs src/engine/ui/sheet-math.js:28; tests/smoke.mjs:48 (guard of mistakes.md row 41). Category A/D/E.
  What: two references for one rule. sheet-math says letters are at least 1.2 degrees (21 mm at 1 m); sheet-page uses a separate 24 mm with no source. The smoke test reads `data-letter-mm`, which is copied from the declared role constants, not measured from the drawn text. So the guard compares the code with itself and would not see a thin face or a smaller drawn size. Row 41's actual mistake (a thin typewriter face) is guarded only by the decision text.
  Evidence: `const MIN_LETTER = 0.024;` `export const MIN_LETTER_DEG = 1.2;` `el.dataset.letterMm = (Math.min(...blocks.map((b) => ROLES[b.role || 'body'].m)) * 1000).toFixed(1);` smoke `if (Number(sheet.dataset.letterMm) < 24) ...`
  Settles it: derive MIN_LETTER from MIN_LETTER_DEG and READ_DIST (or source 24 mm); have panel.write report the size it drew; a font test for the x-height ratio.
  Severity: medium.

F23. src/app/lobby/sign.js:11 vs src/app/lobby/scene.js:171. Category D.
  What: the sign's position is written twice and has drifted. Sounds and the facing check use one copy, the drawn sign the other: z 1.86 against the face at 1.892, y 2.3 against 2.302. The x is the plan's entrance, typed in by hand.
  Evidence: `export const SIGN_AT = { x: 0.7, y: 2.3, z: 1.86 };` vs `position="${PLAN.entrance} 2.302 1.892"`
  Settles it: derive SIGN_AT from PLAN (entrance, north wall, frame head), as decisions.md says "walls, openings, doors, plaques, rails, lights, the walking area and the tests all read it".
  Severity: low.

F24. src/app/lobby/lobby.js:33. Category A/D.
  What: the arrival spot is typed in, not taken from the plan, and the 0.55 m off the stairs' wall has no source.
  Evidence: `export const SPOT = { x: 0.7, z: 3.05, yaw: 0, lift: true };`
  Settles it: PLAN.entrance and a sourced stand-off from the stairs (landing depth in the building standard used for the stairs).
  Severity: low.

F25. src/engine/away-meter.js:5, 21. Category A.
  What: "attention drifted" is head direction more than 45 degrees off the target, sampled every 200 ms, with no source. The eyes alone cover a good part of that angle without the head turning. Room 01 only, but it is an engine measure that rooms will reuse and that feeds numbers into results.
  Evidence: `export function createAwayMeter(camEl, target, paused, degrees = 45) {` `}, 200);`
  Settles it: head-eye coordination literature (the share of a gaze shift made by the head), or the original paper's own measure.
  Severity: low.

F26. tests/structure.test.mjs:106-113 (guard of mistakes.md row 23). Category E.
  What: the regex catches only the shorthand `play(x)` at the start of a line. It misses `play: function (keys)`, `async play(keys)` and arrow properties, which hijack A-Frame's play() just the same.
  Evidence: `/^\s+(play|pause)\s*\(\s*\w/m`
  Settles it: also match `(async\s+)?(play|pause)\s*(:\s*(async\s+)?function)?\s*\(\s*\w`.
  Severity: low.

F27. Category A. Small unsourced numbers. Each is low on its own:
  - src/main.js:20 `FONT_WAIT_MS = 6000`
  - src/engine/ui/choice.js:21 `READY_MS = 300`
  - src/engine/results.js:25 compareRoom `4000`
  - src/engine/locomotion.js:49 target ring `RingGeometry(0.16, 0.2, 40)`
  - locomotion.js:121 vignette ease rate `-10`
  - vignette.js:11-12 `REACH = 5`, `FEATHER = 0.6`
  - recenter.js:12 default `z: 0.35` (room 01's seat, baked into the engine default)
  Severity: low.

F28. docs/engine.md:31. Category D (doc drift).
  What: the doc says results.js is used only through session.js, but room 01 imports `compareRoom` from it directly (src/rooms/01-control/room.js:24).
  Severity: low.

## Checked and sound
- Snap turn 45°, back step 0.8 m: Meta design/locomotion-user-preferences and locomotion-input-maps (locomotion-math.js:2-4, decisions.md).
- Stick fires past 0.8: Immersive Web SDK's turn threshold. Re-arm 0.5 is declared ours.
- Smooth move 1.4 m/s (Meta, about 3 mph), no acceleration (Bonato et al. 2008), dead zone 0.2 and 180°/s (IWSDK defaults).
- Vignette to 50° of a 100° view at full speed: Al Zayer et al. CHI 2019, after Fernandes & Feiner 2016.
- Vignette distance 10 m: plain geometry (each eye 32 mm off centre); guarded in locomotion.test.mjs:94-97.
- MAX_STEP_MS 40: declared ours with its reason (three frames at 72 Hz).
- Corridor/desk light ratio at most 0.2: S13 (10 fc against 50 fc). The smoke test measures it with a white card rendered into a linear render target, the room lit and the corridor dark, as the standard compares. The 0.1 floor is declared ours.
- Flash rule in glow.test.mjs: WCAG 2.3.1 counter, which tests itself with a failing case. Starter tries of 0.5-2 s (DIAL) guarded.
- The 10 s orientation wait: West 2015 (Unity Labs). The constant is guarded; its use is not (F12).
- Clipboard trip never nearer the eyes than 0.5 m (Meta, long reading), and every board corner at least 4 cm inside the walls: checked over 49 x 3 x 12 = 1764 spots, matching mistakes.md row 33.
- Levels thresholds in quest-look.mjs: hum at least 15 dB under speech (ANSI/ASA S12.60). Events at most 12 dB under the voice's peak and never above it, with the reason given.
- Voice files evened to -18 LUFS and -1.5 dBTP in make-voice.mjs (EBU R128).
- ?speed=N runs and the preview copy never send (session.js:13-17, 31). finish and finishPlaytest check both.
- Room interior hidden while its door is shut: Meta's draw-call budget, measured 124 to 41 (decisions.md "What walls hide is not drawn").
- recenter-math rigTransform: proved over 6 poses in recenter.test.mjs.
- seatedLift arithmetic: tested (the threshold itself is F4).

## Count
high 4 (F1-F4); medium 13 (F5, F6, F7, F9, F10, F11, F12, F13, F14, F15, F16, F17, F22); low 11 (F8, F18, F19, F20, F21, F23, F24, F25, F26, F27, F28). Total 28.
