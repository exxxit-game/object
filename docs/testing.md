# Testing

| Command | What | Where to run |
|---|---|---|
| `npm test` | `tests/analyse.test.mjs`: pure analysis and Russian plural forms. Node only, under a second | Anywhere, locally too |
| `npm run test:smoke` | `tests/smoke.mjs`: headless Chromium opens the page, builds the scene, presses Space, waits for `run`, fails on any console error | GitHub Actions (`.github/workflows/test.yml`). Heavy: needs Playwright and Chromium |
| `node tests/static-server.mjs` | Local preview at http://localhost:3000, no dependencies | Locally |

Locally run only `npm test`. The smoke test runs on every push in CI.
Before saying "done", report which of these ran and what they printed.

A new `analyse.js` rule needs a test in `analyse.test.mjs` first (red), then the fix (green).
