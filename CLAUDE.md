# CLAUDE.md — Object

Object is a browser VR game (WebXR, A-Frame). The player is the subject of real
psychology experiments, one room per experiment. Each room catches the player,
then shows honestly how it was done and what the original study found.

Read docs/state.md first (decisions, lessons, where things are), then ARCHITECTURE.md.
Current plan and phase: docs/roadmap.md. Owner speaks Russian; answer him in
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
   No test run = say "not verified". Never run Playwright/Chromium locally
   (the owner's laptop must stay free): the smoke test runs in GitHub Actions.
   To look at the game locally use `npm run serve` and the browser pane.
9. Do exactly what was asked. Ideas go at the end of the answer, not into code.
10. Big change (new room, new engine module, new dependency): write a 3-line
    entry in docs/decisions.md first.
11. Names, numbers and thresholds never from memory: find them in the file or ask the owner.
12. Two or three failed attempts at the same problem: stop, measure first, then fix.
13. Each room has an owner-approved screenshot set (docs/rooms/NN-shots/). Compare every
    visual change against it, not against memory.
14. One branch = one session. Check `git status` before saying "done".
15. When the owner is angry: act on the topic, do not promise to do better.
16. Before designing any room: read the original paper in full (not the abstract)
    and check it fits: original participant time about 10 minutes or less, and a
    clear task or tension for the participant. If it does not fit, say so first.
17. Building or changing a room: follow the `new-room` skill (`.claude/skills/new-room/SKILL.md`)
    step by step; it ends with the `paper-reviewer` agent and the headset check.
18. When a test, a tool or a reviewer contradicts you: stop. Re-read the source
    (paper text in `C:\Users\admin\Documents\objekt-papers\`, the file, the live
    page), find the cause, fix it. Never adjust the test to agree with you.
19. Every mistake found gets a guard (test, tool or agent check) and a row in
    `docs/mistakes.md`. A lesson without a guard is not written down.
20. Numbers, quotes and page numbers come from the paper text file, never from memory.
21. Before every change, think first and say it in the answer: what exactly we are doing,
    why (what it gives the player or the science), what else it touches, and which
    checked facts it rests on. If the why is unclear, ask instead of doing.
22. A message that arrives during work (the owner often dictates from the phone) adds
    to the current task, it never replaces it: answer it in a line, write it into the
    open list in docs/state.md, finish the current step, then do it.

## Commands
- `npm test` — pure unit tests (node, under a second). Safe to run locally.
- `npm run test:smoke` — headless Chromium; CI only (see docs/testing.md).
- `npm run serve` — local preview at http://localhost:3000, no dependencies.
- Deploy: push to main, GitHub Pages serves the repo root.
- Work on a branch. The live site (main) changes only as a batch of finished,
  verified work, and only on the owner's word.
