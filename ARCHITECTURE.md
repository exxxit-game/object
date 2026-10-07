# Architecture

Browser VR game. Static files, GitHub Pages, no build step.
Desktop: mouse. Headset: WebXR via A-Frame, laser pointers.

## Layers

| Layer | Folder | Job | Details |
|---|---|---|---|
| Shell | `index.html`, `src/main.js` | Load A-Frame, pick room from `?room=` (default `01-ono`; no lobby yet) | — |
| Engine | `src/engine/` | Reusable parts: text panels, sound, voice, timers, event log, gaze and reach tracking | [docs/engine.md](docs/engine.md) |
| Rooms | `src/rooms/NN-name/` | One experiment each: scene, logic, analysis, texts | [docs/rooms.md](docs/rooms.md) |
| Styles | `css/` | Page chrome only (hint). The 3D world has no CSS | — |
| Content | `texts.ru.js`, `docs/sources.md` | Player text and the facts behind it | [docs/sources.md](docs/sources.md) |
| Tests | `tests/` | Pure analysis tests + one headless run per room | [docs/testing.md](docs/testing.md) |

## Data flow in a room
```
build scene → intro (experimenter speaks) → run (player acts, engine logs events)
            → analyse(log) → reveal (what you did, how it worked, the original study)
```
The event log is the single source of truth for the reveal. The reveal states
only what the log can prove.

## Folder map
```
index.html
css/            base.css · hint.css
src/main.js
src/engine/     panel.js · audio.js · voice.js · timeline.js · log.js
                swing.js · look-watch.js · reach-watch.js
src/rooms/01-ono/
                room.js       flow
                scene.js      A-Frame markup
                report.js     log → report (pure, no DOM)
                painting.js · room-bounds.js
                texts.ru.js   every word the player sees
vendor/aframe-1.7.1.min.js
tests/          report.test.mjs · voice.test.mjs · names.test.mjs · smoke.mjs
.github/workflows/test.yml   runs both tests on every push
docs/           engine.md · rooms.md · testing.md · sources.md · decisions.md
docs/rooms/     01-ono.md (one spec per room)
```
