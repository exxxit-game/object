# Room contract

A room is a folder `src/rooms/NN-name/`. `src/main.js` loads
`src/rooms/<id>/room.js` (id from `?room=`, default `01-control`) and calls `mount()`.

Required files (checked by `tests/structure.test.mjs`):
```
room.js         export function mount()   builds the scene, runs the flow
scene.js        export const sceneHTML    A-Frame markup
report.js       export function analyse(log) → report   pure: no DOM, no texts
texts.ru.js     every word the player sees
voice-lines.js  every spoken line and its recording
sound-list.js   every sound effect and its prompt
docs/rooms/NN-name.md   the spec: original procedure with pages, deviations, our choices
```
A room built from a paper also has `protocol.js` (every number, with pages) and a
test that pins those numbers to the paper.

`mount()` must:
1. Put the scene into the page (`<a-scene>` appended to `<body>`).
2. Fill `#hint` and add class `show` when ready.
3. Start with the shared consent (`src/app/consent.js`) and use the shared session
   (`src/app/session.js`) for first/repeat runs, test speed and sending.
4. Mirror the flow on `<html data-room-state>` (`idle` = consent … `done` = reveal).

Shared parts a room must not re-implement: consent, session, answer buttons
(`src/engine/ui/choice.js`), rating scales (`src/engine/ui/scale.js`), voice, sound.

Add a room: read the paper in full first (CLAUDE.md rule 16), write the spec, then
`protocol.js` and its test, then the rest. File names must not look like tracking
(see `tests/names.test.mjs`): ad blockers block them.
