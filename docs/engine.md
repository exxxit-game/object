# Engine (`src/engine/`)

Reusable parts. The engine never imports from `src/app/` or `src/rooms/`.

| File | What it gives a room |
|---|---|
| `panel.js` | Component `panel`: text drawn on a canvas, shrinks to fit. `write(blocks, opt)`; block = `{ t, size, color, weight, gap, spacing }` |
| `ui/sheet.js`, `ui/sheet-math.js` | `createSheet(scene)` → `choose(blocks, labels)`, `say(blocks)`, `close()`: the clipboard sheet 1 m in front of the player for everything to read or answer; blocks have roles (`kicker`, `title`, `body`, `soft`); a page that does not fit sets `data-overflow` |
| `ui/choice.js` | `createChoice(parent, place)` → `show(labels, onPick)`, `hide()`: answer buttons on the scene or the sheet, laser or mouse; ready after 0.3 s (`data-ready`) |
| `ui/scale.js` | `createScale(parent, place)` → `show({ labels, step, unit, doneLabel }, onDone)`: 0–100 rating scale |
| `surface.js`, `tile-math.js` | Component `surface`: block, linoleum, ceiling, wood; tiles laid out per space (`space: cx cz lx lz`) by the trade rules |
| `log.js` | `eventLog`: `reset()`, `begin()`, `end()`, `add(kind, value)`, `entries`. Accepts events only between `begin()` and `end()` |
| `audio.js` | `unlock()` (call after a click), `getContext()` |
| `voice.js` | `loadVoice(lines, baseUrl)`, `speak(text)` → Promise, resolves when the line ends |
| `sfx.js` | `loadSounds`, `playSound(name, position, volume, loop)`; component `sound-listener` for spatial sound |
| `recenter.js`, `recenter-math.js` | Component `recenter`: puts the player at the table in VR, seated or standing |
| `grab-press.js`, `haptics.js` | Press `.grabbable` things with the hand; controller vibration |
| `blob-shadow.js` | Soft contact shadow under objects |
| `room-bounds.js` | Keeps the desktop camera inside the room (bounds as parameters) |
| `results.js` | `sendResult`, `markPlayed`: used only through `src/app/session.js` |

Rules: components are tick-driven (CSS and `requestAnimationFrame` do not run
in a headset); anything the reveal reports must come from `eventLog`.
