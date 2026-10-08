# Architecture

Browser VR game. Static files, GitHub Pages, no build step.
Desktop: mouse and keyboard. Headset: WebXR via A-Frame, laser pointers and hands.
Read [docs/state.md](docs/state.md) first: decisions, lessons, where the work is.

## Layers

| Layer | Folder | Job | Details |
|---|---|---|---|
| Shell | `index.html`, `src/main.js` | Load A-Frame and the game's face, pick the room from `?room=` (default `01-control`) | — |
| App | `src/app/` | What every room shares: the arrival corridor (`lobby/`: sign, clipboard, board, doors), consent, session (first/repeat, sending, test speed), the studio's mark, shared texts, playtest and issue reports | [docs/decisions.md](docs/decisions.md) |
| Engine | `src/engine/` | Reusable parts: text panels, the clipboard sheet, answer buttons, rating scale, voice, sound, event log, VR recenter, moving, surfaces, doors, the light box | [docs/engine.md](docs/engine.md) |
| Rooms | `src/rooms/NN-name/` | One experiment each: protocol, scene, flow, report, reveal, texts, recordings | [docs/rooms.md](docs/rooms.md) |
| Styles | `css/` | Page chrome (the hint, the privacy page) and the game's face, Inter (`fonts.css`, files in `vendor/fonts/`). The 3D world has no CSS | — |
| Server | `supabase/migrations/` | Anonymous results: insert-only functions with a field whitelist | — |
| Tests | `tests/` | Pure tests (`npm test`), structure rules, one headless run of the game in CI | [docs/testing.md](docs/testing.md) |
| Tools | `tools/` | Voice and sound making, the headset checks, the test copy | [docs/testing.md](docs/testing.md) |

Imports go one way: room → app → engine. `tests/structure.test.mjs` enforces it.

## Data flow in a room
```
consent (clipboard) → instructions (voice + the room's screen) → experiment (engine logs events)
        → questions → analyse(log) → reveal (what you did, the truth, the original,
          the replication, how this room differs) → result sent only with consent
```
The event log is the single source of truth for the reveal.

## Folder map

Every file of these folders, and nothing else: `tests/structure.test.mjs` fails when a file is
added, renamed or removed without this table. `voice/` and `sound/` hold recordings.

| Folder | Files |
|---|---|
| `src/` | main.js (shell) · app/ · engine/ · rooms/ |
| `src/app/` | brand.js (the game's colours, the sign family) · consent.js · hint.js (desktop hint) · issue-report.js · left-early.js · logo.js (the studio's mark) · playtest.js · playtest-report.js · session.js · texts.ru.js · lobby/ |
| `src/app/lobby/` | lobby.js (the corridor's flow) · scene.js · plan.js (the corridor to its end) · opening.js · sign.js · board.js · exit.js (the poster: leave the game) · stairs-sign.js · extinguisher-label.js · texts.ru.js · voice-lines.js · sound-list.js · voice/ · sound/ |
| `src/engine/` | panel.js (canvas text) · audio.js · voice.js · sfx.js · log.js · results.js · fader.js · recenter.js · recenter-math.js · locomotion.js · locomotion-math.js · vignette.js · grab-press.js · haptics.js · blob-shadow.js · room-bounds.js · away-meter.js · surface.js · tile-math.js · lightbox.js · glide.js · merge-static.js · shapes.js · cable.js · mirror.js · door.js (every doorway) · reflect-env.js (mirrored surroundings) · ui/ |
| `src/engine/ui/` | choice.js (answer buttons) · scale.js · sheet.js (the clipboard) · sheet-math.js |
| `src/rooms/` | 01-control/ (one folder per room, docs/rooms.md) |
| `src/rooms/01-control/` | illusion of control (Alloy & Abramson 1979): protocol.js (every number, with paper pages) · original.js (results in the reveal) · schedule.js · trials.js · questions.js · report.js (log → measures) · reveal.js · scene.js · chair.js · room.js · texts.ru.js · voice-lines.js · sound-list.js · voice/ · sound/ |
| `css/` | base.css · hint.css · privacy.css · fonts.css |
| `tests/` | names.test.mjs · voice.test.mjs · sound.test.mjs · recenter.test.mjs · tiles.test.mjs · sheet.test.mjs · fonts.test.mjs · standards.test.mjs · glow.test.mjs · logo.test.mjs · locomotion.test.mjs · plaque.test.mjs · masonry.test.mjs · structure.test.mjs · control-protocol.test.mjs · control-schedule.test.mjs · control-report.test.mjs · control-reveal.test.mjs · playtest.test.mjs · results.test.mjs · issues.test.mjs · smoke.mjs (CI) · static-server.mjs |
| `tools/` | make-voice.mjs · check-voice.mjs · make-sounds.mjs · publish-preview.mjs (the test copy) · quest-look.mjs (look and measure in the headset) · quest-check.mjs · quest-wifi.mjs · xr-probe.html · xr-probe-run.mjs · build-catalog.mjs · check-cards.mjs |

## Docs

- [docs/state.md](docs/state.md): read first. [docs/decisions.md](docs/decisions.md): why things are as they are. [docs/mistakes.md](docs/mistakes.md): mistakes and the guards that catch them.
- [docs/engine.md](docs/engine.md), [docs/rooms.md](docs/rooms.md) (the room contract), [docs/testing.md](docs/testing.md).
- [docs/building-standards.md](docs/building-standards.md): the trade standards the corridor is built to. [docs/sources.md](docs/sources.md): the source of every fact shown to the player.
- [docs/rooms/01-control.md](docs/rooms/01-control.md): room 01 against its paper. [docs/vr-checklist.md](docs/vr-checklist.md): what every scene is checked for.
