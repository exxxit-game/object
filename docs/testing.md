# Testing

| Command | What | Where to run |
|---|---|---|
| `npm test` | Node only, about a second: structure rules (`tests/structure.test.mjs`), the room protocol pinned to the paper, schedule, report, reveal pages, every recording and sound present (and every corridor sound has a measured gain), file names safe from ad blockers, VR recenter math, tile and block layout (`tiles`, `masonry`), the building standards (`standards`), the sign's flash safety and endings (`glow`), the clipboard's trips (`sheet`), the studio's mark (`logo`), thumbstick moving (`locomotion`), door plaques (`plaque`) | Anywhere, locally too |
| `npm run test:smoke` | `tests/smoke.mjs`: headless Chromium plays the default room at 20× speed: the sign, taking the clipboard from the board, the corridor/desk light ratio, consent, the room to the last reveal page, and a playtest pass with `?sign=b`; fails on any console error | GitHub Actions only (heavy) |
| `node tools/check-voice.mjs <room>` | Speech-to-text of every recording compared with the script (wrong or skipped words) | Locally, costs ElevenLabs credits |
| `node tools/quest-check.mjs` | Plays the room inside the Quest over USB | Locally, headset connected |
| `node tools/quest-look.mjs <command>` | In the headset, without the owner: `open`, `reload` (past caches), `vr` (enter VR), `frame out.jpg` (what the left eye sees), `eval "<js>"`, `worn on|off` (keep it awake while checking), `levels` (each corridor sound at its game gain and a voice line measured at the output; fails outside the mix: events at most 12 dB under the voice, the hum 15–30 dB under it) | Locally, headset linked over Wi-Fi |
| `node tools/publish-preview.mjs` | Publishes the game files to the test copy the headset opens (exxxit-game.github.io/object-preview); never the live site | Locally, before a headset check |
| `node tools/quest-wifi.mjs` | Links the headset over Wi-Fi for the tools above | Locally, once after the headset restarts |
| `node tests/static-server.mjs` | Local preview at http://localhost:3000 | Locally |

`?speed=N` (1–100) makes every timing N times faster; such runs are never sent.
Before saying "done", report which of these ran and what they printed.
A new rule in a pure module needs its test first (red), then the change (green).
