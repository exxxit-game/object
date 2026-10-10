# Architecture audit, 10.10 evening (read only; the architecture-auditor agent)

After a large change (A-Frame 1.8.0 with multiview, merging across colours, the controller as one mesh, the VR smoke
run, data migration 0009). Kept so the next window starts from it, not from a new audit.

Verdict: in between. A sound lower half (5,939 lines in 73 game files, none over 300; engine imports one way, held by
tests/structure.test.mjs; 27 test suites; CI) and a one-room prototype on top. Process tooling (tools/ and tests/,
6,183 lines) is as large as the game.

The three changes it named, in order:
1. Turn the host around: the shell and app own the scene, rig, controllers, renderer settings and the corridor; a room
   exports mount(door) and unmount() and stands behind any door; the corridor is hidden once its door shuts; a room's
   light comes from its own lamps (today room 101 draws the corridor behind its shut door, about half of its 144 draw
   calls a frame in VR). This is the board's internal item 3.
2. Room 01's flow (say/ask, paging, phases, playtest) into src/app/; playtest and issue reports and the server
   functions for any room (today they accept only '01-control').
3. One order of work: docs/target-architecture.md mirrors the board; the size rule reaches tools/ and tests/.

Also found: the start-size check counts a warning that appears only in a stale checkout; docs/engine.md leaves out
moulding.js; room 01's walking bounds differ between room.js:63 and scene.js:33.
