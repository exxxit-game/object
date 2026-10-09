# CLAUDE.md — Object

Object (the game "You are the object"; the name is never translated) is a browser VR game (WebXR, A-Frame). The player is the subject of real
psychology experiments, one room per experiment. Each room catches the player,
then shows honestly how it was done and what the original study found.

Read docs/state.md first (decisions, lessons, where things are), then ARCHITECTURE.md.
Current plan and its queue: the plan doc linked in docs/state.md (docs/roadmap.md is the long view). Owner speaks Russian; answer him in
Russian, plain words, no jargon. Everything in the repo is English except
player-facing text (the texts.ru.js files in src/app, src/app/lobby and src/rooms/*, and the
static page privacy.html) and README.md, which is in Russian and English.

## The main rule: we recreate («воссоздаём»)
What others already worked out is taken ready-made: books, trade standards and measurements,
research, guidelines, existing games, libraries and code. Those before us spent the imagination
and left marks on the trail; we follow the marks instead of cutting a new path. Our own
imagination goes only where nothing exists yet: the experiments we design and the words. Every
other rule serves this one; how it is done: rule 23.

## Rules
1. No history in code. Comments explain WHY, never WHEN or WHO asked.
   No dates, no "owner said", no version stories. History lives in git commits.
2. One room = one folder in src/rooms/. The engine (src/engine/) never imports
   from rooms. Rooms talk to the engine only through the room contract
   (docs/rooms.md).
3. Styles live only in css/. No inline <style>, no style="" attributes.
4. Player-facing text lives only in texts.ru.js files (the static page privacy.html aside).
   No Russian strings in logic.
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
22. My order of work (the owner often dictates many things at once from the phone; requests
    used to pile up in the dialogue and vanish after compaction):
    a. The queue is the plan doc section "Как идём дальше" (link in docs/state.md). Work only
       on its top step; the order changes only on the owner's word.
    b. Every owner message that asks for something: in the same turn add it as a row to the
       plan doc table "Сверка всех твоих просьб" (or update its row) and answer it in one line.
       It does not switch the current work unless the owner says it goes first.
    c. After each step: a short status (done, how checked, next step); update that table and
       docs/state.md.
    d. After a compaction, before anything else: read docs/state.md and the plan doc queue and
       table. The summary is not the list.
    e. A row keeps the owner's own words (a short quote), not my retelling: a retold request
       lost the sign he described and the room was rebuilt.
    f. "In the queue" is written only with the number of a real step in "Как идём дальше".
    g. When work changes a fact, search the whole plan for it and update every place that
       states it (rows, sections, the queue, "Что нужно от тебя", "Где мы сейчас").
    h. Short questions, bug reports and remarks about the vision are requests too. A question
       I ask him that waits for his answer goes into "Что нужно от тебя".
    i. Guard: after a long stretch of work, and before saying a step is done, run the
       `request-auditor` agent (owner messages vs the plan) and the `architecture-auditor` agent
       (code and docs vs ARCHITECTURE.md and docs/target-architecture.md), and fix what they find.
       Before the plan or a doc is relied on, the `fact-checker` agent checks every claim in it against
       its evidence, twice, in two runs that do not see each other.
23. We RECREATE (воссоздаём), we do not invent. Everything around the experiments (the building,
    doors, signs, furniture, objects, their sizes and proportions) is carried over from a real
    source as it is; invention goes only into the experiments we design and the words. A size or
    shape without a source is a mistake, even when it looks fine. A choice a standard answers never
    goes to the owner as taste. Knowledge first, then thinking: before building or changing anything
    (a scene part, a UI element, a mechanic, a flow), find how it is normally done and read it: trade standards and
    measurements (doors, trim, tiling, furniture), Meta and W3C XR guidelines, research, and
    existing games or code that solved it. Write the source next to the decision (decisions.md,
    the plan doc or a WHY comment). Only then design the rest. Nothing is invented from scratch
    when a standard exists; the owner's taste is input, research decides. Shapes, pictures and
    numbers come from real sources; only the words (texts, jokes) are our own. A new look goes to
    the owner as pictures before it goes into the game.
24. Every piece goes: research (rule 23) → build → my own check in the browser and in the
    headset (`tools/quest-look.mjs`: enter VR, read the game's frames, time each step, measure
    the frame rate) → an independent reviewer agent on the diff → fix → only then show the
    owner, with a frame from the headset. I never stop at "not checked in the headset" while
    the headset is linked; the owner judges only feel and taste, never what a tool can measure.
25. A barrier I cannot pass myself (a login, a captcha, a paywall, a site that blocks tools, a
    photo only a person can take): ask the owner at once, in the same answer, with the link and
    what to bring back; never work round it with a weaker invented substitute. Research agents
    end with a `FOR THE OWNER:` block, and the stop hook does not end a turn until each of its
    links has reached him (tools/owner-links.mjs).

## Commands
- `npm test` — pure unit tests (node only, about 12 s on the laptop); git runs it before every commit. Safe to run locally.
- `npm run test:smoke` — headless Chromium; CI only (see docs/testing.md).
- `npm run serve` — local preview at http://localhost:3000, no dependencies.
- Deploy: push to main, GitHub Pages serves the repo root.
- Work on a branch. The live site (main) changes only as a batch of finished,
  verified work, and only on the owner's word.
