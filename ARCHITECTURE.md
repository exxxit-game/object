# Architecture

Browser VR game. Static files, GitHub Pages, no build step.
Desktop: mouse and keyboard. Headset: WebXR via A-Frame, laser pointers and hands.
Where every file ends up in the finished game: [docs/target-architecture.md](docs/target-architecture.md).

## Layers

| Layer | Folder | Job | Details |
|---|---|---|---|
| Shell | `index.html`, `src/main.js` | Load A-Frame, pick room from `?room=` (default `01-control`) | — |
| App | `src/app/` | What every room shares: the arrival corridor (`lobby/`: sign, clipboard, board, door), consent, session (first/repeat, sending, test speed), the studio's mark, shared texts | below |
| Engine | `src/engine/` | Reusable parts: text panels, the clipboard sheet, answer buttons, rating scale, voice, sound, event log, VR recenter, thumbstick moving, surfaces, the sign's light box | [docs/engine.md](docs/engine.md) |
| Rooms | `src/rooms/NN-name/` | One experiment each: protocol, scene, flow, report, reveal, texts, recordings | [docs/rooms.md](docs/rooms.md) |
| Styles | `css/` | Page chrome only (hint). The 3D world has no CSS | — |
| Server | `supabase/migrations/` | Anonymous results: insert-only function with a field whitelist | — |
| Tests | `tests/` | Pure tests, structure rules, one headless run of the room in CI | [docs/testing.md](docs/testing.md) |

Imports go one way: room → app → engine. `tests/structure.test.mjs` enforces it.

## Data flow in a room
```
consent → instructions (voice + screen) → experiment (engine logs events)
        → questions → analyse(log) → reveal (what you did, the truth, the original,
          the replication, how this room differs) → result sent only with consent
```
The event log is the single source of truth for the reveal.

## Folder map
```
index.html · css/ · vendor/aframe-1.7.1.min.js
src/main.js
src/app/        consent.js · session.js · left-early.js · brand.js · logo.js · texts.ru.js
                playtest.js · playtest-report.js · issue-report.js
src/app/lobby/  the arrival corridor: lobby.js (the flow) · scene.js · opening.js · sign.js
                plan.js (the corridor to its end) · board.js · exit.js (the studio's poster: leave the game) · texts.ru.js
                voice-lines.js · sound-list.js · voice/ · sound/
src/engine/     panel.js · audio.js · voice.js · sfx.js · log.js · results.js · fader.js
                recenter.js · recenter-math.js · locomotion.js · locomotion-math.js · vignette.js
                grab-press.js · haptics.js · blob-shadow.js · room-bounds.js · away-meter.js
                surface.js · tile-math.js · lightbox.js · glide.js · merge-static.js
                shapes.js · cable.js · mirror.js
                ui/choice.js · ui/scale.js · ui/sheet.js · ui/sheet-math.js
src/rooms/01-control/   illusion of control (Alloy & Abramson 1979)
                protocol.js   every number of the procedure, with paper pages
                original.js   results shown in the reveal, with pages
                schedule.js   tapes and intervals (pure)
                trials.js     the 40 trials at runtime
                questions.js  measures after the trials
                report.js     log → measures (pure)
                reveal.js     reveal pages (pure)
                scene.js · room.js · texts.ru.js · voice-lines.js · sound-list.js
                voice/ · sound/
tests/          *.test.mjs (npm test) · smoke.mjs (CI) · static-server.mjs
tools/          make-voice.mjs · check-voice.mjs · make-sounds.mjs · quest-check.mjs
                quest-look.mjs (look and measure in the headset) · quest-wifi.mjs
                publish-preview.mjs (the test copy for the headset)
docs/           state.md (read first) · rooms/01-control.md · sources.md · ...
```
