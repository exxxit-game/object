# Engine (`src/engine/`)

Reusable parts. The engine never imports from `src/app/` or `src/rooms/`.

| File | What it gives a room |
|---|---|
| `panel.js` | Component `panel`: text drawn on a canvas, shrinks to fit. `write(blocks, opt)`; block = `{ t, size, color, weight, gap, spacing }` |
| `ui/sheet.js`, `ui/sheet-math.js` | `createSheet(scene, { inside })` (inside: the space's wall faces; the sheet is never read beyond them) → `choose(blocks, labels)`, `say(blocks)`, `close()`, `hang(pose, cover, light)`, `take(blocks)` (shows blocks while it waits; emits `taken` on the click), `back(blocks)` (a clipboard that waits on a hook, glides to the player on a click and back after the answers), `interrupt(blocks, labels)` and `resume()` (a question that cuts in on any page, then the page comes back; a page set meanwhile waits behind the question), `isAsking()`: the clipboard sheet 1 m in front of the player for everything to read or answer; it follows the player on `recentered` and `player-moved`; blocks have roles (`kicker`, `title`, `body`, `soft`); a page that does not fit sets `data-overflow` |
| `ui/choice.js` | `createChoice(parent, place)` → `show(labels, onPick)`, `hide()`: answer buttons on the scene or the sheet, laser or mouse; ready after 0.3 s (`data-ready`) |
| `ui/scale.js` | `createScale(parent, place)` → `show({ labels, step, unit, doneLabel }, onDone)`: 0–100 rating scale |
| `glide.js` | Component `glide`: `go({ to, ctrl, rotation, ms, step })` moves an entity along a curve, easing in and out (`step(e)` each frame) (path rules: `glidePath` in `ui/sheet-math.js`) |
| `lightbox.js` | Component `lightbox` on a `panel`: a back-lit sign with one lamp per word; `show(words, style)`, `run(keys)` with a level per word, `lamp-cue` with the key's cue (`{ sound, hum, humS }`); patterns stay under the flash rule (`tests/glow.test.mjs`) |
| `surface.js`, `tile-math.js` | Component `surface`: block, linoleum, ceiling, cork, lens, wood; `glow` for a lamp's lens; tiles laid out per space (`space: cx cz lx lz`) by the trade rules |
| `log.js` | `eventLog`: `reset()`, `begin()`, `end()`, `add(kind, value)`, `entries`. Accepts events only between `begin()` and `end()` |
| `locomotion.js`, `locomotion-math.js`, `vignette.js` | Component `locomotion` on the rig: thumbstick teleport (arc to the floor, release to go, click to cancel), 45° snap turn, 80 cm back step; or `move: smooth` (left stick walks at 1.4 m/s) and `turn: smooth`, with a vignette while moving smoothly; only inside its bounds; emits `player-moved` |
| `audio.js` | `unlock()` (call after a click), `getContext()`, `onUnlock(fn)` (a timed sound waits for the first gesture) |
| `voice.js` | `loadVoice(lines, baseUrl)`, `speak(text)` → Promise, resolves when the line ends; a `voice-line` event on `window` as a line starts |
| `sfx.js` | `loadSounds`, `playSound(name, position, volume, loop)` → handle with `stop()`, `fade(volume, seconds)`; component `sound-listener` for spatial sound |
| `recenter.js`, `recenter-math.js` | Component `recenter`: puts the player at the table in VR, seated or standing |
| `grab-press.js`, `haptics.js` | Press `.grabbable` things with the hand; controller vibration |
| `blob-shadow.js` | Soft contact shadow under objects |
| `fader.js` | Component `fader` on the camera: `to(opacity)` fades the view to black and back (moving between places without a jump); a newer fade settles the older one's promise |
| `merge-static.js` | Component `merge-static`: after load, the opaque static parts under it that share a look become one mesh (`data-dynamic` parts are left alone) |
| `shapes.js` | Components `rounded-box` and `lathe`: shapes A-Frame lacks |
| `cable.js` | Component `cable`: one smooth tube through a list of points |
| `mirror.js` | Component `mirror-glass`: a one-way mirror whose reflection is captured once |
| `away-meter.js` | `createAwayMeter(camEl, target, paused, degrees)`: seconds the head points away from a place |
| `room-bounds.js` | Keeps the desktop camera inside the room (bounds as parameters) |
| `results.js` | `sendResult`, `markPlayed`: used only through `src/app/session.js` |

Rules: components are tick-driven (CSS and `requestAnimationFrame` do not run
in a headset); anything the reveal reports must come from `eventLog`.
