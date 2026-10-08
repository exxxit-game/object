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
1. Put the scene into the page (`<a-scene>` appended to `<body>`) and, before it loads, the
   corridor (`corridorHTML` from `src/app/lobby/scene.js`) so both are merged and tiled together.
   The room's door is `#door1` (pivot at its hinge, a `.clickable` leaf); the corridor stands behind it.
   Its masonry opening and every flat thing on its walls (class `on-wall`) sit on the block
   module, so no cut sliver of block shows (`tests/masonry.test.mjs`); door signs (class
   `door-sign`) are placed by the sign standard instead (`SIGN` in `src/app/brand.js`).
   Every light of the room that is on in its markup carries class `room-light`: lights pass
   through walls, so the corridor keeps them off until the door opens (corridors are much
   dimmer than rooms: docs/building-standards.md). `tests/structure.test.mjs` checks it.
   The room's inside (walls, furniture, screen) carries class `room-interior`, door 1's way
   (frame, stops, threshold, leaf) never: the corridor leaves the inside undrawn until the door
   opens (Meta: fewer than 200 draw calls a frame on Quest 3). `tests/structure.test.mjs` checks it.
2. Once the player is in the room, show its computer hint with `showHint({ title, body })`
   (src/app/hint.js): it goes at the first press or on entering VR.
3. Start with the shared arrival `runLobby(room)` with room = `{ id, real, debrief,
   seat: { x, z, yaw }, bounds, extra }` (the sign over the door, the clipboard taken from the
   board, welcome, left-early choice, consent, the door; it resolves with the consent once the
   player is at the table; the thumbsticks move the player in the corridor only) and use the shared session
   (`src/app/session.js`) for first/repeat runs, test speed and sending.
4. Mirror the flow on `<html data-room-state>` (`idle` = consent … `done` = reveal).

Shared parts a room must not re-implement: arrival (corridor), consent, session, the clipboard
(`src/engine/ui/sheet.js`), answer buttons (`src/engine/ui/choice.js`), rating scales
(`src/engine/ui/scale.js`), voice, sound, door plaques (`writePlaque` in `src/app/brand.js`).

A door sign shows the room's number only, on the door's corridor face (`doorHTML({ sign })`) and on
the wall inside: the experiment's name would tell the player what is studied before they do it
(demand characteristics); the name comes in the reveal, and on the door once the room is done
(`tests/plaque.test.mjs`). The number comes from the corridor plan (`src/app/lobby/plan.js`):
the room imports it for its texts and its own sign; the lobby writes the corridor's signs and door 1's.

Add a room: read the paper in full first (CLAUDE.md rule 16), write the spec, then
`protocol.js` and its test, then the rest. File names must not look like tracking
(see `tests/names.test.mjs`): ad blockers block them.
