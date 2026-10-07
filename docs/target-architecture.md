# Target architecture: the finished game

Purpose: every change is made knowing where the file ends up, so fixing one place
never breaks or duplicates another. Current files are mapped to their final place.

## The finished game in one picture
```
youaretheobject.com
 ├─ index.html → lobby: list of rooms, language, progress, (paid rooms unlocked)
 ├─ privacy.html (ru, en): what is recorded, why, where, how long
 └─ ?room=NN-name → one room, always the same life cycle:

  consent (record / no record) → instruction → experiment (room logic)
     → after-questions (manipulation, prior knowledge) → reveal pages
     → original study + differences → "you vs other players" → send result
```

## Layers
| Layer | Folder | Knows about | Never knows about |
|---|---|---|---|
| Shell | `index.html`, `src/main.js` | which room or lobby to load | room logic |
| App | `src/app/` | consent, session life cycle, language, lobby, purchases | a specific room |
| Engine | `src/engine/` | A-Frame components, audio, voice, panels, log, UI widgets, results/diagnostics transport | rooms, texts |
| Room | `src/rooms/NN-name/` | its own scene, flow, report, texts, recordings | other rooms |
| Server | `supabase/migrations/` | per-room result validation, aggregates | game code |

## Final room folder (every room the same)
```
src/rooms/NN-name/
  room.js          flow only: phases of THIS experiment (uses app/session.js)
  scene.js         markup
  report.js        log → report, pure, tested
  texts.ru.js      every word, Russian      texts.en.js  English (later)
  voice-lines.js   spoken lines            voice/ru/*.mp3, voice/en/*.mp3
  sound-list.js    effects                 sound/*.mp3
  <objects>.js     room-specific objects (e.g. levers.js)
docs/rooms/NN-name.md, docs/sources.md section, docs/prereg/NN-name.md
tests/NN-name.report.test.mjs; smoke runs every room in CI
```

## Current file → final place
| Now | Final | Action |
|---|---|---|
| `src/engine/panel.js, audio.js, voice.js, sfx.js, log.js, timeline.js, haptics.js, blob-shadow.js, grab-press.js, recenter.js, recenter-math.js` | engine (as is) | keep; voice gets a language folder |
| `src/engine/results.js` | engine | keep; add `issues.js` (errors/devices, with consent) and `stats.js` (read aggregates for "you vs others") |
| `src/engine/swing.js, reach-watch.js` | engine | keep (generic) |
| `src/engine/look-watch.js` | engine | keep only if a room uses it (Ono painting removed) |
| `src/rooms/01-ono/question.js` | `src/engine/ui/choice.js` | generalize: any number of answers |
| `src/rooms/01-ono/chart.js` | `src/engine/ui/timeline-chart.js` | generalize: lanes, bands, shaded phases |
| `src/rooms/01-ono/reveal.js` | room keeps its pages; pager → `src/app/reveal.js` | split |
| consent/boot code in `room.js` | `src/app/consent.js` | move; shared texts in `src/app/texts.ru.js` |
| start/finish/send code in `room.js` | `src/app/session.js` | move (life cycle, first/repeat flag, sending) |
| `src/rooms/01-ono/room-bounds.js` | `src/engine/room-bounds.js` | generalize (bounds as parameters) |
| `src/rooms/01-ono/ambience.js` | room tone → engine `sfx`; observer noises per room | split |
| `src/rooms/01-ono/clock.js, lamps.js, painting.js` | Ono-specific, invented | remove from room 01 when the room is replaced |
| `src/rooms/01-ono/*` (scene, levers, report, texts, voice, sound) | become the booth for the next room (illusion of control) or the parked Ono | decided with the experiment catalog |
| `tools/quest-check.mjs` | per-room checks driven by room metadata | generalize |
| `tools/make-voice.mjs, make-sounds.mjs` | per room and language | add language |
| — | `tools/new-room.mjs` | scaffold a room folder with all files and tests |
| — | `privacy.html`, `src/app/lobby/` | create |
| `supabase/migrations/*` | `submit_run` with per-room validation; `room_stats(room, version)` aggregates | extend per room |

## Rules that follow from this
- A room never re-implements consent, sending, reveal paging, choice panels or charts.
- Every room ships: report tests, voice/sound file tests, a smoke run to the end,
  sources with page numbers, a deviations list, a preregistration draft.
- No music in rooms (it changes mood and behaviour). The lobby may have none too
  until the owner decides.
