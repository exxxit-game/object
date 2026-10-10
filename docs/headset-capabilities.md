# What the headset gives an experiment

The game runs in the Quest Browser (WebXR). Every capability below has a status:
**our headset** (checked on the owner's Quest 3), **Meta** (official Meta page), **press**
(reliable news, not Meta), **unverified**. Feature-level checks inside a session need a
button press in the headset: open `tools/xr-probe.html` (served by `npm run serve`) and
press the buttons; the result is read over USB. Last probe: 9 Oct 2026, Quest 3, browser 152: controllers, hands and body asked one task at a time in the headset (tools/xr-probe-input.html); all 20 tasks done in 1 min 50 s, none skipped.
Do not request the `layers` feature: with the normal base layer the session fails
("Can't use baseLayer with layers feature requested").

| Capability | Status | Source | What it gives an experiment |
|---|---|---|---|
| VR session (`immersive-vr`) | our headset: supported (Quest 3, browser 152) | CDP check | All current rooms |
| Both eyes in one pass (`OCULUS_multiview`) | our headset: on in the corridor, 10 Oct 2026 (A-Frame 1.8.0: `renderer.xr.isMultiview` true, the extension present) | `tools/quest-look.mjs eval`, in VR | Each draw call made once a frame, not once an eye |
| Frame rate | our headset: 90 Hz in the corridor; offered 72, 80, 90, 120 (`supportedFrameRates`), 10 Oct 2026 | `tools/quest-look.mjs eval`, in VR | The frame budget is 11.1 ms at 90 Hz; whether the game is CPU- or GPU-bound: not measured yet |
| Mixed reality, the real room seen through the cameras (`immersive-ar`) | our headset: supported | CDP check; [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Experiments inside the player's own room |
| Plane detection: walls, floor, tables | our headset: 57 planes with labels (wall, window, door, table, shelf, floor, ceiling, bed, wall art) | [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Put the apparatus on the player's real table |
| Persistent anchors (max 8 per site) | our headset: feature granted | same | Keep an object in the same real place between sessions |
| Hit test on real surfaces through the depth sensor (Quest 3, browser 40.4, Oct 2025) | our headset: hit-test and depth-sensing granted | [UploadVR](https://www.uploadvr.com/quest-browser-depth-api-webxr-hit-testing-instant-placement/) | Place things on any real surface without a room scan |
| Room mesh (`mesh-detection`) | our headset: 22 meshes, some labelled table | probe | Real furniture as part of the scene |
| Hand tracking without controllers, 25 joints | our headset 9.10: both hands seen with all 25 joints posed once the controllers were put down (the headset switches on its own) | [Meta](https://developers.meta.com/horizon/documentation/web/webxr-hands/) | Body-ownership rooms with the player's own hand shape; grasping, pointing, gestures |
| Microphone (spoken answers) | our headset: permission granted, sound level read | [Babylon forum](https://forum.babylonjs.com/t/using-meta-quest-2-microphone-inside-of-webxr-game/38321) | Spoken explanations (choice blindness), voice timing; needs the player's permission and a privacy rule |
| Several live players at once | web standard (WebSocket/WebRTC); our Supabase has realtime | — | Experiments with real people instead of scripted agents (Asch, economic games, coordination) |
| Statistics across players | built (anonymous results, sent only with the player's consent; privacy page `privacy.html`) | `src/app/session.js` | Between-group effects (anchoring, framing) become visible as "you vs others" |
| Real walking inside the boundary | Meta: roomscale minimum 2 × 2 m, stationary 1 × 1 m; our headset: the browser reported 1.88 × 2.10 m, less than Meta's minimum (cause unknown) | [Meta](https://www.meta.com/help/quest/1190192431422476/) | Rooms by space tier (`docs/decisions.md`) |
| Boundary size (`bounded-floor`) | our headset: works in VR and MR; owner's area 1.88 × 2.10 m | [Meta forum](https://communityforums.atmeta.com/discussions/dev-openxr/webxr-requesting-boundsgeometry-for-play-space-returns-empty-array-or-a-small-sq/1217563) | Offer large-space rooms only to players who have the space |
| Controllers (Meta Quest Touch Plus) | our headset 9.10: profiles meta-quest-touch-plus down to generic-trigger-squeeze-thumbstick, mapping xr-standard, 13 buttons on the left, 12 on the right, 4 axes; pressed and read by the page: trigger 0, grip 1, stick press 3, A/X 4, B/Y 5, stick tilt on its axes; the left menu button (three stripes) is buttons[12] and did not end the session; touch sensors on most buttons; select and squeeze events on both | probe `input` | Which buttons a room can use, the menu button included (e.g. a pause) |
| Spatial sound, controller vibration | our headset 9.10: a pulse on each controller on his own press, felt on both | `src/engine/sfx.js`, `src/engine/haptics.js` | Sounds from a place; touch confirmation |
| Eye tracking | not on Quest 3 | — | Not available: no gaze measures (head direction only) |
| Camera images (raw passthrough frames) | not available in Quest Browser WebXR | [Meta forum](https://communityforums.atmeta.com/discussions/Questions_Discussions/request-webxr-raw-camera-access-camera-access-feature-in-quest-browser/1367463) | Not available to a web game (native apps only) |
| Full-body tracking | our headset: `body-tracking` granted without flags (browser 152); 9.10: `frame.body` gives 83 joints, all 83 posed | [Wikipedia: Quest Browser](https://en.wikipedia.org/wiki/Meta_Quest_Browser) | Posture and arm movement, once the output is checked |
| Desktop players (mouse, no headset) | built | `src/main.js` | Rooms that do not need the body can also run on a computer |
| Force feedback, smell, heat | not available | — | Weight, smoke smell, fire heat cannot be real |

## What mixed reality could add (ideas, to be checked against papers)
- **Closer to the original lab.** Many originals took place in a real room at a real
  table. In mixed reality the apparatus can stand on the player's own table, which may
  be closer to the original than a virtual booth.
- **A research question nobody has answered for these rooms.** In the smoke-alarm
  replication the real room gave 68% leaving alone and VR only 36%
  (Kinateder & Warren 2016, `docs/sources.md`). Whether mixed reality brings the effect
  back towards the real-room number is open; the game could measure it.
- **Changes in your own room.** Change-blindness and size illusions with virtual
  objects placed among the player's real furniture.
- **Limits.** Switching between VR and mixed reality means ending one session and
  starting another, which needs a button press; mixed reality shows the player's real
  room, so nothing personal from the cameras may be recorded or sent.
