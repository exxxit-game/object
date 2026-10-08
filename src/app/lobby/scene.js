// The lab corridor in front of room 01's door, behind the room's back wall (a 0.2 m block
// wall, room face z 1.6, corridor face z 1.8). Along the north wall from left to right: a
// "soon" door, the experimenter's board (the lab's sign), door 1 (its frame and leaf are in
// src/rooms/01-control/scene.js) with its plaque on the latch side, another "soon" door.
// Built to the trade standards in docs/building-standards.md: 4 in vinyl base and the rail
// stop at door frames, 3'0" × 7'0" doors with 2 in frames, 12 in floor tiles and a 24 in
// ceiling grid laid out from the corridor's centre, 2 × 4 ft troffers in the grid. Static
// parts are merged after load; the board and plaques change, so they stay apart. Sizes in
// metres; the corridor runs x -3.4 to 3.0, z 1.8 to 3.6.
const SPACE = 'space: -0.2 2.7 6.4 1.8';
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

export const corridorHTML = `
<a-entity id="corridor">
  <a-entity merge-static>
    <a-plane rotation="-90 0 0" position="-0.2 0 2.7" width="6.4" height="1.8" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="90 0 0" position="-0.2 2.5 2.7" width="6.4" height="1.8" surface="kind: ceiling; ${SPACE}"></a-plane>
    <!-- the floor inside door 1's opening, from the threshold to the corridor -->
    <a-plane rotation="-90 0 0" position="0.6 0 1.748" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>
    <!-- north wall with door 1's masonry opening (x 0.1 to 1.1, up to 2.2 m: whole blocks) -->
    <a-plane position="-1.65 1.25 1.8" width="3.5" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="2.05 1.25 1.8" width="1.9" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="0.6 2.35 1.8" width="1.0" height="0.3" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="-1.65 0.4 1.803" width="3.5" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane position="2.05 0.4 1.803" width="1.9" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <!-- south and end walls -->
    <a-plane rotation="0 180 0" position="-0.2 1.25 3.6" width="6.4" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane rotation="0 180 0" position="-0.2 0.4 3.597" width="6.4" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.4 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 -90 0" position="3.0 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.397 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <a-plane rotation="0 -90 0" position="2.997 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <!-- rail at 0.8 m and 4 in vinyl base; on the north wall both stop at door 1's frame -->
    <a-box position="-1.6556 0.8 1.806" width="3.4888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="2.0556 0.8 1.806" width="1.8888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-0.2 0.8 3.594" width="6.4" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-3.394 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="2.994 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="-1.6556 0.051 1.8025" width="3.4888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="2.0556 0.051 1.8025" width="1.8888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-0.2 0.051 3.5975" width="6.4" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-3.3975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <a-box position="2.9975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <!-- closed doors of the rooms to come -->
    ${soonDoor(-2.6, 1)}
    ${soonDoor(2.32, -1)}
    <!-- 2 × 4 ft fluorescent troffers, each filling two cells of the ceiling grid -->
    <a-box position="-1.724 2.49 2.7" width="1.2192" height="0.02" depth="0.6096" material="color: #f4f6f8; emissive: #eef4ff; emissiveIntensity: 1.1"></a-box>
    <a-box position="1.324 2.49 2.7" width="1.2192" height="0.02" depth="0.6096" material="color: #f4f6f8; emissive: #eef4ff; emissiveIntensity: 1.1"></a-box>
    <!-- the experimenter's board frame -->
    <a-box position="-1.0 1.5 1.815" width="1.42" height="1.02" depth="0.03" color="#1b1c1e"></a-box>
    <!-- the light box over door 1 (like the "in session" boxes over lab doors) -->
    <a-box position="0.6 2.34 1.845" width="0.96" height="0.26" depth="0.09" color="#2a2a2c"></a-box>
  </a-entity>
  <a-entity id="signFace" panel="w: 0.9; h: 0.2; px: 1024; bg: #160f05" glow="light: #signLight; lightMax: 0.7; level: 0.04"
            position="0.6 2.34 1.891"></a-entity>
  <!-- the sign's warm spill on the door and floor below it (not a hot spot on the ceiling) -->
  <a-entity id="signLight" light="type: point; color: #ffd9a0; intensity: 0; distance: 2.5; decay: 2" position="0.6 1.95 2.25"></a-entity>
  <a-entity light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 2.7"></a-entity>
  <a-entity id="lobbyBoard" panel="w: 1.3; h: 0.9; px: 1331; ref: 845; bg: #0e0f11" position="-1.0 1.5 1.834"></a-entity>
  <!-- plaques: room 1 on the latch side of its door, "soon" notices on the closed doors -->
  <a-entity id="plaqueOut" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="1.33 1.55 1.806"></a-entity>
  <a-entity id="soon1" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="-2.6 1.55 1.822"></a-entity>
  <a-entity id="soon2" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="2.32 1.55 1.822"></a-entity>
</a-entity>`;
