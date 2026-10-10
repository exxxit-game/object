# Architecture audit, 10.10 evening (read only; the architecture-auditor agent)

After a large change (A-Frame 1.8.0 with multiview, merging across colours, the controller as one mesh, the VR smoke
run, data migration 0009). Kept so the next window starts from it, not from a new audit.

Verdict: in between. A sound lower half (5,939 lines in 73 game files, none over 300; engine imports one way, held by
tests/structure.test.mjs; 27 test suites; CI) and a one-room prototype on top. Process tooling (tools/ and tests/,
6,183 lines) is as large as the game.

The three changes it named, in order:
1. Turn the host around: the shell and app own the scene, rig, controllers, renderer settings and the corridor; a room
   exports mount(door) and unmount() and stands behind any door; the corridor is hidden once its door shuts; a room's
   light comes from its own lamps (today room 101 draws the corridor behind its shut door: about 66 of its draw calls
   in the board's last breakdown, at 164 before the controllers were merged; 144 now, each eye drawn on its own in the
   emulator; and the corridor's lamp lights the room through the wall, the look the owner approved:
   src/app/lobby/lobby.js). This is the board's internal item 3.
2. Room 01's flow (say/ask, paging, phases, playtest) into src/app/; playtest and issue reports and the server
   functions for any room (today they accept only '01-control').
3. One order of work: docs/target-architecture.md mirrors the board; the size rule reaches tools/ and tests/.

Why the first change takes that form (the owner's architecture page, 10.10; recounted then: 74 game files, 6,012
lines; tools and tests 60 files, 6,292 lines with the two git hooks; over 300 lines: tools/claude-guard.mjs 492,
tools/health.mjs 345, tests/smoke.mjs 304). Of three ways to join the corridor and the rooms (the room holds the
corridor, as now; the corridor holds rooms behind doors; a page per room) the second is how Meta's IWSDK changes levels:
world.loadLevel destroys the level's entities while those made persistent, the player rig among them, stay
(developers.meta.com/vr/documentation/iwsdk/concepts/ecs/world/ and .../lifecycle/; packages/core/src/level/
level-player-rig.ts), and how Unity's 2020.1 manual (Multi-Scene editing) keeps a manager scene loaded while the others
load additively (LoadSceneMode.Additive) and unload (SceneManager.UnloadScene). A page per room is not settled on Quest Browser: a new page needs a user
action to enter VR (Meta, documentation/web/pwa-webxr) unless in-VR navigation is on, which A-Frame's link docs (1.8.0)
say only the Oculus Browser ships, possibly behind a setting; a test in the headset would settle it. Also read: the WebXR spec (immersive-web.github.io/webxr: a shut-down session is
permanent), the navigation proposal (github.com/immersive-web/navigation: sessiongranted, early, no browser named), the
W3C Immersive Web minutes of 5 November 2020 (Meta: behind a flag for most origins), and Meta's PWA FAQ (in an installed
PWA requestSession may be called after the page loads). Server today (0009_data_protection.sql): submit_run takes a room
with a schema row (only 01-control has one); submit_playtest and submit_issue take only '01-control'; submit_issue takes
short text (message, file, browser).

Also found: the start-size check counts a warning that appears only in a stale checkout; docs/engine.md leaves out
moulding.js; room 01's walking bounds differ between room.js:63 and scene.js:33.
