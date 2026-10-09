<!-- Draft for the owner's yes (plan step 4.1 c, docs/audit/rules-review.md); replaces CLAUDE.md only after it. -->
# CLAUDE.md — Object

Object (the game "You are the object"; the name is never translated) is a browser VR game (WebXR,
A-Frame). The player is the subject of real psychology experiments, one room per experiment. Each
room catches the player, then shows honestly how it was done and what the original study found.

Read docs/state.md first, then ARCHITECTURE.md. The queue and every owner request: the plan doc
linked in docs/state.md (docs/roadmap.md is the long view). The owner speaks Russian; answer him in Russian, plain words, no jargon.
The repo is English; Russian only in the files tests/structure.test.mjs names (the player's text,
the owner's words quoted, README.md).

Rules go by weight. Each ends with its guard: what catches a break without anyone's memory, or
"none". This file does not grow: a new rule replaces or merges an old one (tests/structure.test.mjs).

## 1. Ready first
For anything (a scene part, a size, code, a tool, a process, security, science) first find how it
is normally done: a trade standard or measurement, Meta and W3C XR guidelines, research, an
existing game, library or method; the owner's taste is input, research decides. Write
its source next to the decision (docs/decisions.md, the plan, a WHY comment). Invent only where
nothing exists, and say so. «Воссоздаём»: the building, doors, signs, furniture and objects are
carried over from real sources as they are; only the experiments we design and the words are ours.
A choice a standard answers never goes to the owner as taste; a new look goes to him as pictures
before it goes in. Guard: tests/standards.test.mjs for scene sizes; elsewhere the fact-checker.

## 2. Truth
a. Names, numbers, thresholds, quotes and pages come from the source file (paper text in
   `C:\Users\admin\Documents\objekt-papers\`, the code, the live page), never from memory. A fact
   shown to the player has a source in docs/sources.md; unverifiable = not shown, "not checked".
   Guard: tools/check-cards.mjs, room protocol tests, paper-reviewer.
b. When a test, a tool or a reviewer contradicts me: stop, re-read the source, find the cause, fix
   it. Never bend the test to agree. Guard: none.
c. Every mistake gets a guard and a row in docs/mistakes.md. First a miss review: was an existing
   test, tool, agent or doc simply not used? Then fix that cause with one edit. A guard counts only
   once shown failing on the old mistake. The same miss three times goes to the owner.
   Guard: tests/structure.test.mjs (each row names a real file).
d. Before relying on a plan row, a state line or a memory, check it against the code or the live
   game. Before the plan or a doc is relied on, the fact-checker checks every claim, twice, in two
   runs that do not see each other. Guard: the fact-checker agent.

## 3. Data and keys
Nothing private leaves: no key, token or the owner's address in the repository (it is public);
the live site (main) changes only on the owner's word; players' data anonymous and sent only with
consent. The live database changes only through supabase/migrations, on his word.
Guard: tools/hooks/pre-push with tools/secrets.mjs, the GitHub rule on main, tools/morning.mjs.

## 4. Working with the owner
a. Before every change say what exactly, why (what it gives the player or the science), what else
   it touches and which checked facts it rests on; if the why is unclear, ask. Do exactly what was
   asked; ideas go at the end of the answer, not into code. Guard: none.
b. The queue is the plan's «Как идём дальше»: only its top step; the order changes only on his
   word. Every owner message that asks for something (questions, bug reports, remarks on the
   vision too) becomes in the same turn a row of «Сверка всех твоих просьб» in his own words,
   answered in one line; it does not switch the work unless he says so. "In the queue" only with a
   real step number. A question waiting for him goes to «Что нужно от тебя». When a fact changes,
   every place in the plan that states it changes. Guard: request-auditor.
c. After each step: a short status (done, how checked, next); update that table and
   docs/state.md. After a compaction, first read docs/state.md and the plan's queue and table.
   Guard: request-auditor.
d. When the owner is angry: act on the topic, do not promise to do better. Guard: none.

## 5. Checking
a. Every piece: research (rule 1), build, my own check in the browser (`npm run serve`, the browser
   pane) and in the headset (tools/quest-look.mjs: VR, frames, timing, frame rate), an independent
   reviewer agent on the diff, fix, then show the owner with a frame from the headset. While the
   headset is linked I never stop at "not checked in the headset"; he judges only feel and taste.
   Visual changes are compared with the approved shots (docs/rooms/NN-shots/), not memory.
   Guard: tools/quest-check.mjs (run by me, not by itself).
b. Before "done": `npm test`, saying what ran and the result (no run = "not verified"); after a
   long stretch and before a step is done, the request-auditor and the architecture-auditor; git
   status clean and pushed. Guard: tools/hooks/pre-commit; Claude Code's stop hook
   (tools/claude-guard.mjs: no turn ends with failing tests or unsaved, unpushed work).
c. Never run Playwright or Chromium locally (the owner's laptop must stay free); the smoke test
   runs in GitHub Actions. Guard: tools/claude-guard.mjs refuses the command.
d. Two or three failed attempts at the same problem: stop, measure, then fix
   (superpowers:systematic-debugging). Guard: none.

## 6. Rooms
Before designing a room read the original paper in full and check it fits: about 10 minutes or less
for the participant and a clear task or tension; if not, say so first. A big change (new room, new
engine module, new dependency) first gets a 3-line entry in docs/decisions.md. Building or changing
a room follows the `new-room` skill step by step; it ends with the paper-reviewer agent and the
headset check. Guard: .claude/skills/new-room/SKILL.md, paper-reviewer, architecture-auditor.

## 7. Code shape
One room = one folder in src/rooms/; the engine never imports rooms, which reach it only through
the room contract (docs/rooms.md). Styles only in css/, no inline style. Player-facing text only in
texts.ru.js. Comments explain WHY, never WHEN or WHO asked. Files and docs about 300 lines at most.
No build step: plain ES modules, A-Frame vendored and pinned in vendor/. One branch = one session.
Guard: tests/structure.test.mjs; every guard is seen red on its own mistake by tools/prove-guards.mjs
on GitHub at every push.

## Commands
- `npm test` — pure unit tests (node only, about 12 s on the laptop); git runs it before every commit.
- `npm run test:smoke` — headless Chromium; CI only (see docs/testing.md).
- `npm run serve` — local preview, no dependencies (port 3000; the browser pane uses 3100,
  .claude/launch.json).
- `npm run morning` — the daily check of saves, guards, tests, tools, headset and memory.
- Deploy: push to main, GitHub Pages serves the repo root. Work on a branch; main only as a batch of
  finished, verified work, on the owner's word.
