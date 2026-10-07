# CLAUDE.md — Objekt

Objekt is a browser VR game (WebXR, A-Frame). The player is the subject of real
psychology experiments, one room per experiment. Each room catches the player,
then shows honestly how it was done and what the original study found.

Read ARCHITECTURE.md before changing code. Owner speaks Russian; answer him in
Russian, plain words, no jargon. Everything in the repo is English except
player-facing text (src/rooms/*/texts.ru.js).

## Rules
1. No history in code. Comments explain WHY, never WHEN or WHO asked.
   No dates, no "owner said", no version stories. History lives in git commits.
2. One room = one folder in src/rooms/. The engine (src/engine/) never imports
   from rooms. Rooms talk to the engine only through the room contract
   (docs/rooms.md).
3. Styles live only in css/. No inline <style>, no style="" attributes.
4. Player-facing text lives only in texts.ru.js files. No Russian strings in logic.
5. Any fact shown to the player needs a source in docs/sources.md
   (author, year, journal). If you cannot verify it, do not show it.
6. Keep files small: about 300 lines max. Split before you grow past it.
7. No build step. Plain ES modules. A-Frame is vendored in vendor/ (pinned).
8. Before saying "done": run `npm test` and report what ran and the result.
   No test run = say "not verified".
9. Do exactly what was asked. Ideas go at the end of the answer, not into code.
10. Big change (new room, new engine module, new dependency): write a 3-line
    entry in docs/decisions.md first.

## Commands
- `npm test` — unit tests (node) + smoke test (headless Chromium).
- `npx serve .` — local preview at http://localhost:3000
- Deploy: push to main, GitHub Pages serves the repo root.
