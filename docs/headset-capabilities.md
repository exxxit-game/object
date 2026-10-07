# What the headset gives an experiment

The game runs in the Quest Browser (WebXR). Every capability below has a status:
**our headset** (checked on the owner's Quest 3), **Meta** (official Meta page), **press**
(reliable news, not Meta), **unverified**. Feature-level checks inside a session need a
button press in the headset: open `tools/xr-probe.html` (served by `npm run serve`) and
press both buttons; the result is read over USB.

| Capability | Status | Source | What it gives an experiment |
|---|---|---|---|
| VR session (`immersive-vr`) | our headset: supported (Quest 3, browser 152) | CDP check | All current rooms |
| Mixed reality, the real room seen through the cameras (`immersive-ar`) | our headset: supported | CDP check; [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Experiments inside the player's own room |
| Plane detection: walls, floor, tables | Meta | [Meta](https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/) | Put the apparatus on the player's real table |
| Persistent anchors (max 8 per site) | Meta | same | Keep an object in the same real place between sessions |
| Hit test on real surfaces through the depth sensor (Quest 3, browser 40.4, Oct 2025) | press | [UploadVR](https://www.uploadvr.com/quest-browser-depth-api-webxr-hit-testing-instant-placement/) | Place things on any real surface without a room scan |
| Room mesh (`mesh-detection`) | unverified | forums | Real furniture as part of the scene |
| Hand tracking without controllers, 25 joints | unverified on our headset | WebXR Hand Input | Body-ownership rooms with the player's own hand shape; grasping |
| Real walking inside the boundary | Meta: roomscale minimum 2 × 2 m, stationary 1 × 1 m | [Meta](https://www.meta.com/help/quest/1190192431422476/) | Rooms by space tier (`docs/decisions.md`) |
| Boundary size (`bounded-floor`) | unverified; reported unreliable | [Meta forum](https://communityforums.atmeta.com/discussions/dev-openxr/webxr-requesting-boundsgeometry-for-play-space-returns-empty-array-or-a-small-sq/1217563) | Offer large-space rooms only to players who have the space |
| Spatial sound, controller vibration | our headset: used in room 01 | `src/engine/sfx.js`, `src/engine/haptics.js` | Sounds from a place; touch confirmation |
| Eye tracking | not on Quest 3 | — | Not available: no gaze measures |
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
