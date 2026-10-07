# Room contract

A room is a folder `src/rooms/NN-name/`. `src/main.js` loads
`src/rooms/<id>/room.js` (id from `?room=`, default `01-ono`) and calls `mount()`.

```
room.js        export function mount()   builds the scene, runs the flow
scene.js       export const sceneHTML    A-Frame markup
analyse.js     export function analyse(log) → report   pure: no DOM, no texts
texts.ru.js    every word the player sees
```

`mount()` must:
1. Put the scene into the page (`<a-scene>` appended to `<body>`).
2. Fill `#hint` and add class `show` when ready.
3. Mirror the flow on `<html data-room-state>`: `idle → intro → run → done → intro …`.

Flow: `build scene → intro → run (engine logs events) → analyse(log) → reveal`.
The reveal states only what the log can prove, then shows the original study.
Every fact in the reveal needs an entry in `sources.md`.

Add a room: copy the folder layout, add `docs/rooms/NN-name.md`, add the
sources, add a test for `analyse.js`.
