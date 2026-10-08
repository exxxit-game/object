// The lab corridor in front of room 01's door, behind the room's back wall (a 0.2 m block
// wall, room face z 1.6, corridor face z 1.8). Along the north wall from left to right: a
// "soon" door, the experimenter's cork board with the clipboard, door 1 (its frame and leaf are in
// src/rooms/01-control/scene.js) with its plaque on the latch side, another "soon" door.
// Built to the trade standards in docs/building-standards.md: 4 in vinyl base and the rail
// stop at door frames, 3'0" × 7'0" doors with 2 in frames, 12 in floor tiles and a 24 in
// ceiling grid laid out from the corridor's centre, 2 × 4 ft troffers in the grid. Static
// parts are merged after load; the plaques and the sign change, so they stay apart. Sizes in
// metres; the corridor runs x -3.4 to 3.0, z 1.8 to 3.6.
const SPACE = 'space: -0.2 2.7 6.4 1.8';
// its wall faces, for what must stay inside them (the clipboard; tests/sheet.test.mjs checks
// they match SPACE)
export const WALLS = { minX: -3.4, maxX: 3.0, minZ: 1.8, maxZ: 3.6 };
const BLOCK = (tint) => `surface="kind: block; tint: ${tint}; ${SPACE}"`;
const FRAME = 'color="#3d3a34"';
const METAL = 'material="color: #c9ccce; metalness: .8; roughness: .25"';

// A closed door of a room to come, set on the wall: frame, leaf, lever on the latch side
// (dir +1: latch on the right), kick plate on the push side.
function soonDoor(c, dir) {
  const latch = c + dir * 0.387;
  return `
    <a-box position="${c - 0.4857} 1.1021 1.8125" width="0.051" height="2.2042" depth="0.025" ${FRAME}></a-box>
    <a-box position="${c + 0.4857} 1.1021 1.8125" width="0.051" height="2.2042" depth="0.025" ${FRAME}></a-box>
    <a-box position="${c} 2.1787 1.8125" width="1.0224" height="0.051" depth="0.025" ${FRAME}></a-box>
    <a-entity rounded-box="width: 0.914; height: 2.134; depth: 0.02; radius: 0.004; color: #6a5641; roughness: 0.55" position="${c} 1.083 1.81"></a-entity>
    <a-box position="${c} 0.143 1.8208" width="0.864" height="0.254" depth="0.0015" material="color: #b9bcbe; metalness: .7; roughness: .3"></a-box>
    <a-cylinder radius="0.028" height="0.012" rotation="90 0 0" position="${latch} 1.024 1.826" ${METAL}></a-cylinder>
    <a-box position="${latch - dir * 0.06} 1.024 1.855" width="0.13" height="0.018" depth="0.018" ${METAL}></a-box>`;
}

// The exit door in the corridor's left end wall (face x = -3.4, facing +x), set on the wall like the
// closed doors: frame, leaf, kick plate, and the panic bar exit doors carry on the push side (they
// swing out, the way people leave): 34–48 in above the floor, at least half the leaf wide (S25).
// Over it the lit exit sign, which is the game's "leave" button (exit.js); the box sits on the
// joints like every flat thing on a wall. Parts stand at least 5 mm proud of each other.
function exitDoor() {
  const x = -3.4, z = 2.7;
  return `
    <a-box position="${x + 0.0125} 1.1021 ${z - 0.4857}" rotation="0 90 0" width="0.051" height="2.2042" depth="0.025" ${FRAME}></a-box>
    <a-box position="${x + 0.0125} 1.1021 ${z + 0.4857}" rotation="0 90 0" width="0.051" height="2.2042" depth="0.025" ${FRAME}></a-box>
    <a-box position="${x + 0.0125} 2.1787 ${z}" rotation="0 90 0" width="1.0224" height="0.051" depth="0.025" ${FRAME}></a-box>
    <a-entity rounded-box="width: 0.914; height: 2.134; depth: 0.02; radius: 0.004; color: #6a5641; roughness: 0.55" rotation="0 90 0" position="${x + 0.015} 1.083 ${z}"></a-entity>
    <a-box position="${x + 0.0262} 0.143 ${z}" rotation="0 90 0" width="0.864" height="0.254" depth="0.0015" material="color: #b9bcbe; metalness: .7; roughness: .3"></a-box>
    <a-box position="${x + 0.04} 0.99 ${z - 0.33}" rotation="0 90 0" width="0.05" height="0.09" depth="0.03" ${METAL}></a-box>
    <a-box position="${x + 0.04} 0.99 ${z + 0.33}" rotation="0 90 0" width="0.05" height="0.09" depth="0.03" ${METAL}></a-box>
    <a-box position="${x + 0.065} 0.99 ${z}" rotation="0 90 0" width="0.72" height="0.05" depth="0.03" ${METAL}></a-box>
    <a-box class="on-wall" position="${x + 0.05} 2.3 ${z}" rotation="0 90 0" width="1.0" height="0.2" depth="0.09" color="#2a2a2c"></a-box>`;
}

// A 2 × 4 ft troffer centred at x in the corridor's grid: a 25 mm painted frame around a lens
// that glows with its two lamps behind it.
function troffer(x) {
  return `
    <a-box position="${x} 2.49 2.7" width="1.2192" height="0.02" depth="0.6096" color="#dcdcd5"></a-box>
    <a-plane position="${x} 2.475 2.7" rotation="90 0 0" width="1.1692" height="0.5596"
             material="color: #ffffff; emissive: #f2f6ff; emissiveIntensity: 0.95; roughness: 1" surface="kind: lens; glow: true"></a-plane>`;
}

// A 2.5 gal pressurized-water extinguisher (0.178 m across, 0.62 m tall) on a bracket on the
// wall whose face is at z = wall, facing -z: top 1.496 m, bottom 0.869 m (at most 1.524 m and
// at least 0.102 m: tests/standards.test.mjs). Parts stand at least 5 mm proud of each other.
function extinguisher(x, wall) {
  const z = wall - 0.03 - 0.089;
  return `
    <a-entity class="extinguisher">
      <a-box position="${x} 1.36 ${wall - 0.015}" width="0.05" height="0.08" depth="0.03" color="#2b2b2b"></a-box>
      <a-cylinder position="${x} 1.14 ${z}" radius="0.089" height="0.48" color="#a8231d"></a-cylinder>
      <a-sphere position="${x} 1.38 ${z}" radius="0.089" scale="1 0.35 1" color="#a8231d"></a-sphere>
      <a-sphere position="${x} 0.9 ${z}" radius="0.089" scale="1 0.35 1" color="#a8231d"></a-sphere>
      <a-cylinder position="${x} 1.14 ${z}" radius="0.094" height="0.16" open-ended="true" theta-start="125" theta-length="110" color="#e2dccb"></a-cylinder>
      <a-cylinder position="${x} 1.43 ${z}" radius="0.02" height="0.05" ${METAL}></a-cylinder>
      <a-box position="${x} 1.462 ${z}" width="0.13" height="0.014" depth="0.03" ${METAL}></a-box>
      <a-box position="${x} 1.49 ${z}" width="0.11" height="0.012" depth="0.026" ${METAL}></a-box>
      <a-cylinder position="${x} 1.425 ${z - 0.021}" radius="0.016" height="0.006" rotation="90 0 0" color="#f2f0ea"></a-cylinder>
      <a-cylinder position="${x + 0.1} 1.2 ${z - 0.035}" radius="0.008" height="0.46" color="#151515"></a-cylinder>
      <a-cylinder position="${x + 0.1} 0.955 ${z - 0.035}" radius="0.011" height="0.04" color="#151515"></a-cylinder>
    </a-entity>`;
}

export const corridorHTML = `
<a-entity id="corridor">
  <a-entity merge-static>
    <a-plane rotation="-90 0 0" position="-0.2 0 2.7" width="6.4" height="1.8" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="90 0 0" position="-0.2 2.5 2.7" width="6.4" height="1.8" surface="kind: ceiling; ${SPACE}"></a-plane>
    <!-- the floor inside door 1's opening, from the threshold to the corridor -->
    <a-plane rotation="-90 0 0" position="0.7 0 1.748" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>
    <!-- north wall with door 1's masonry opening (x 0.2 to 1.2, up to 2.2 m). Openings and the
         flat things on the walls start and end on the 0.2 m block module, so no sliver of a cut
         block shows beside them (NCMA TEK 05-12; tests/masonry.test.mjs) -->
    <a-plane position="-1.6 1.25 1.8" width="3.6" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="2.1 1.25 1.8" width="1.8" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="0.7 2.35 1.8" width="1.0" height="0.3" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="-1.6 0.4 1.803" width="3.6" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane position="2.1 0.4 1.803" width="1.8" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <!-- south and end walls -->
    <a-plane rotation="0 180 0" position="-0.2 1.25 3.6" width="6.4" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane rotation="0 180 0" position="-0.2 0.4 3.597" width="6.4" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.4 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 -90 0" position="3.0 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.397 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <a-plane rotation="0 -90 0" position="2.997 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <!-- rail at 0.8 m and 4 in vinyl base; on the north wall both stop at door 1's frame -->
    <a-box position="-1.6056 0.8 1.806" width="3.5888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="2.1056 0.8 1.806" width="1.7888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-0.2 0.8 3.594" width="6.4" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-3.394 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="2.994 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="-1.6056 0.051 1.8025" width="3.5888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="2.1056 0.051 1.8025" width="1.7888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-0.2 0.051 3.5975" width="6.4" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-3.3975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <a-box position="2.9975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <!-- closed doors of the rooms to come -->
    ${soonDoor(-2.7, 1)}
    ${soonDoor(2.3, -1)}
    ${exitDoor()}
    <!-- 2 × 4 ft fluorescent troffers, each filling two cells of the ceiling grid: a painted
         steel door frame and a prismatic lens (docs/building-standards.md, S20) -->
    ${troffer(-1.724)}
    ${troffer(1.324)}
    <!-- the experimenter's board: cork in an aluminium frame (S21); the hook the clipboard
         hangs on (src/app/lobby/lobby.js) -->
    <a-box class="on-wall" position="-1.0 1.5 1.815" width="1.6" height="1.0" depth="0.03" material="color: #b9bcbf; metalness: .6; roughness: .35"></a-box>
    <a-cylinder position="-1.0 1.875 1.8575" radius="0.005" height="0.045" rotation="90 0 0" ${METAL}></a-cylinder>
    <!-- the pins of the two sheets beside the clipboard (#notePoster, #noteFlyer below), at the
         top middle of each tilted sheet -->
    <a-sphere position="-1.4748 1.7364 1.843" radius="0.006" color="#9b2a22"></a-sphere>
    <a-sphere position="-0.5264 1.5565 1.843" radius="0.006" color="#2a4a8b"></a-sphere>
    <!-- a 2.5 gal water extinguisher on its wall bracket, opposite the doors (S22, S23) -->
    ${extinguisher(-1.6, 3.6)}
    <!-- the light box over door 1 (like the "in session" boxes over lab doors), standing just
         in front of the frame head it rests on -->
    <a-box class="on-wall" position="0.7 2.3 1.86" width="1.0" height="0.2" depth="0.09" color="#2a2a2c"></a-box>
  </a-entity>
  <a-entity id="signFace" panel="w: 0.94; h: 0.16; px: 1024; bg: #160f05" lightbox="light: #signLight; lightMax: 0.7"
            position="0.7 2.3 1.907"></a-entity>
  <!-- the sign's warm spill on the door and floor below it (not a hot spot on the ceiling) -->
  <a-entity id="signLight" light="type: point; color: #ffd9a0; intensity: 0; distance: 2.5; decay: 2" position="0.7 1.95 2.25"></a-entity>
  <!-- the exit sign's face, drawn and made a button by exit.js, and its green spill -->
  <a-entity id="exitSign" class="clickable" panel="w: 0.94; h: 0.16; px: 1024; bg: #237f52" rotation="0 90 0" position="-3.304 2.3 2.7"></a-entity>
  <a-entity id="exitLight" light="type: point; color: #7dffb0; intensity: 0.3; distance: 2.5; decay: 2" position="-3.1 2.0 2.7"></a-entity>
  <!-- the corridor's own light, dim while the player is here (lobby.js, CORRIDOR_LIGHT) -->
  <a-entity id="corridorAmbient" light="type: ambient; color: #c9cfd6; intensity: 0"></a-entity>
  <a-entity id="corridorLamp" light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 2.7"></a-entity>
  <a-plane position="-1.0 1.5 1.835" width="1.512" height="0.912" surface="kind: cork; repeat: 3.024 1.824"></a-plane>
  <!-- plaques: room 1 on the latch side of its door, "soon" notices on the closed doors -->
  <a-entity id="plaqueOut" class="on-wall" panel="w: 0.4; h: 0.2; px: 640; bg: #15161a" position="1.5 1.5 1.806"></a-entity>
  <a-entity id="soon1" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="-2.7 1.55 1.822"></a-entity>
  <a-entity id="soon2" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="2.3 1.55 1.822"></a-entity>
  <!-- A4 sheets (ISO 216) pinned beside the clipboard: the studio's poster and a flyer (board.js) -->
  <a-entity id="notePoster" panel="w: 0.21; h: 0.297; px: 640" position="-1.47 1.6 1.84" rotation="0 0 2"></a-entity>
  <a-entity id="noteFlyer" panel="w: 0.21; h: 0.297; px: 640" position="-0.53 1.42 1.84" rotation="0 0 -1.5"></a-entity>
</a-entity>`;
