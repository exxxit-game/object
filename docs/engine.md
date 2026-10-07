# Engine (`src/engine/`)

Reusable parts. The engine never imports from `src/rooms/`.

| File | What it gives a room |
|---|---|
| `panel.js` | A-Frame component `panel`: text drawn on a canvas. `write(blocks, opt)`; block = `{ t, size, color, weight, gap }` |
| `log.js` | `eventLog`: `reset()`, `begin()`, `end()`, `add(kind, value)`, `entries`. Accepts events only between `begin()` and `end()` |
| `timeline.js` | `createTimeline()` → `later(fn, ms)`, `clearAll()` |
| `audio.js` | `unlock()` (call from a click/key), `tone(freq, dur, type, vol, slideTo)` |
| `voice.js` | `speak(text)`; silent if no matching voice is installed |
| `swing.js` | Component `swing`: `go()` plays a lever stroke (tick-driven, works in a headset) |
| `look-watch.js` | Component: emits `look-change` `{ seen }` on its entity |
| `reach-watch.js` | Component: logs `reach` when a controller goes above 2.05 m |

Rules: components are tick-driven (CSS and `requestAnimationFrame` do not run
in a headset); anything the reveal reports must come from `eventLog`.
