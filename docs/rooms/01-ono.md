# Room 01 — "Ono" (superstition)

Original: Ono (1987), see [sources.md](../sources.md).

**Setup.** Booth, three levers, a counter, a red lamp. The experimenter says
nothing is required; points may come. Goal shown: 12.

**What really happens.** Points come from a timer every 2.5–8 s, independent
of the player. The levers are connected to nothing. The painting on the back
wall changes only while the player is not looking at it.

**Logged events.** `pull` (lever 0–2), `point`, `answer` (question choice 0–3),
`round` (2 = round 2 starts), `look` (player turned to the
painting), `reach` (controller above 2.05 m).

**Reveal.** What you did (pulls per lever, your "system", points that came
while you did nothing, looks at the painting, reaches), then the original
study. On a repeat run it compares pulls with the previous run.

**Files.** `src/rooms/01-ono/`: `room.js` flow, `scene.js` markup,
`report.js` report, `painting.js` painting, `room-bounds.js` camera limits,
`texts.ru.js` all player text.

**Note.** The `reach` event (controller above 2.05 m) is game mechanics, not a claim about the original study.
