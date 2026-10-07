# Testing

| Command | What | Where to run |
|---|---|---|
| `npm test` | Node only, about a second: structure rules (`tests/structure.test.mjs`), the room protocol pinned to the paper, schedule, report, reveal pages, every recording and sound present, file names safe from ad blockers, VR recenter math | Anywhere, locally too |
| `npm run test:smoke` | `tests/smoke.mjs`: headless Chromium plays the default room at 20× speed from consent to the last reveal page; fails on any console error | GitHub Actions only (heavy) |
| `node tools/check-voice.mjs <room>` | Speech-to-text of every recording compared with the script (wrong or skipped words) | Locally, costs ElevenLabs credits |
| `node tools/quest-check.mjs` | Plays the room inside the Quest over USB | Locally, headset connected |
| `node tests/static-server.mjs` | Local preview at http://localhost:3000 | Locally |

`?speed=N` (1–100) makes every timing N times faster; such runs are never sent.
Before saying "done", report which of these ran and what they printed.
A new rule in a pure module needs its test first (red), then the change (green).
