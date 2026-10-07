# VR checklist (walk through for every room)

Sources: Meta comfort, accessibility (VRC), performance guidelines, W3C WebXR,
A-Frame docs. Status for room 01 in brackets.

## Comfort
- No camera motion the player did not make; recenter only on VR entry and headset reset. [done: recenter.js]
- Stable frame rate: 72 Hz = 13.7 ms, 90 Hz = 11.1 ms per frame; check the heaviest moment and Quest 2. [72 fps on Quest 3; Quest 2 not checked]
- Everything reachable from one position, seated or standing; no forced turn over 90°. [seated mode: pending owner decision; painting behind is optional, not a task]
- Floor: `local-floor`, with a fallback for `local`. [not checked on Quest 2]

## Interaction
- Targets at least 2.5–3° of view; panels at 1–1.5 m. [levers ok]
- Feedback on every press: visual + sound + haptic pulse. [haptic: added]
- Playable with one hand; hand tracking optional. [one hand ok; hands not checked]

## Text and UI
- World-locked text, never head-locked. [done]
- Contrast at least 4.5:1, heavy weights, no thin fonts. [done]
- No deliberate flashing content. [counter flash: brief colour change, check]

## Audio
- Unlock audio on a user gesture. [done: start button / Space]
- Subtitles for all speech, or playable without sound. [every spoken line is also on the screen]

## WebXR pitfalls
- `requestSession` only from a real user gesture: the player presses VR; remote tools cannot.
- Pause timed events when the session is `visible-blurred`/`hidden` (system menu) or the tab is hidden. [done: points wait while paused]
- After failed session requests Quest Browser may refuse new ones until restarted: `adb shell am force-stop com.oculus.browser`.

## Accessibility
- Never rely on colour alone (red/green is the most confused pair). [levers: pending owner decision]

## Files and loading
- No served file name that looks like tracking: ad blockers block it and the room never loads. [tests/names.test.mjs]
