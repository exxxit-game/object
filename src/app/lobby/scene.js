// The lab corridor in front of room 01's door, behind the room's back wall (a 0.2 m block
// wall, room face z 1.6, corridor face z 1.8). Along the north wall from left to right: a
// "soon" door, the experimenter's cork board with the clipboard, door 1 (its frame and leaf are in
// src/rooms/01-control/scene.js) with its plaque on the latch side, another "soon" door.
// Built to the trade standards in docs/building-standards.md: 4 in vinyl base and the rail
// stop at door frames, 3'0" × 7'0" doors with 2 in frames, 12 in floor tiles and a 24 in
// ceiling grid laid out from the corridor's centre, 2 × 4 ft troffers in the grid. Static
// parts are merged after load; the plaques and the sign change, so they stay apart. Sizes in
// metres; the corridor runs x -3.4 to 3.0, z 1.8 to 3.6.
import { doorHTML, CHROME } from '../../engine/door.js';

const SPACE = 'space: -0.2 2.7 6.4 1.8';
// its wall faces, for what must stay inside them (the clipboard; tests/sheet.test.mjs checks
// they match SPACE)
export const WALLS = { minX: -3.4, maxX: 3.0, minZ: 1.8, maxZ: 3.6 };
const BLOCK = (tint) => `surface="kind: block; tint: ${tint}; ${SPACE}"`;
const FRAME = 'color="#3d3a34"';
const METAL = `material="color: ${CHROME.color}; metalness: ${CHROME.metalness}; roughness: ${CHROME.roughness}"`;

// A 2 × 4 ft troffer centred at x in the corridor's grid: a 25 mm painted frame around a lens
// that glows with its two lamps behind it.
function troffer(x) {
  return `
    <a-box position="${x} 2.49 2.7" width="1.2192" height="0.02" depth="0.6096" color="#dcdcd5"></a-box>
    <a-plane position="${x} 2.475 2.7" rotation="90 0 0" width="1.1692" height="0.5596"
             material="color: #ffffff; emissive: #f2f6ff; emissiveIntensity: 0.95; roughness: 1" surface="kind: lens; glow: true"></a-plane>`;
}

// A 2.5 gal stored-pressure water extinguisher as made in the 1970s (General WS-900, 1972:
// polished stainless steel, 24 in tall, with a gauge; docs/research/vr/07-corridor-1979.md):
// 7 in across, 0.62 m tall (S23), on a wall hook under its neck, on the wall whose face is at
// z = wall, facing -z; top 1.484 m, bottom 0.869 m (at most 1.524 m and at least 0.102 m:
// tests/standards.test.mjs). On the valve, as on every such unit: the carry handle and above it
// the squeeze lever on one pin, the gauge in front, the hose out of the other side hanging down
// to its nozzle. Every part touches the one it is fixed to (tests/standards.test.mjs).
// brushed stainless: a mirror finish has nothing to mirror in a dim corridor and reads as dark grey
const STEEL = 'material="color: #d3d7db; metalness: .25; roughness: .35"';
function extinguisher(x, wall) {
  const z = wall - 0.03 - 0.089;
  return `
    <a-entity class="extinguisher">
      <a-box position="${x} 1.43 ${wall - 0.003}" width="0.04" height="0.1" depth="0.006" color="#2b2b2b"></a-box>
      <a-box position="${x} 1.4 ${(wall + z) / 2}" width="0.03" height="0.012" depth="${(wall - z).toFixed(3)}" color="#2b2b2b"></a-box>
      <a-cylinder position="${x} 1.14 ${z}" radius="0.089" height="0.48" ${STEEL}></a-cylinder>
      <a-sphere position="${x} 1.38 ${z}" radius="0.089" scale="1 0.35 1" ${STEEL}></a-sphere>
      <a-sphere position="${x} 0.9 ${z}" radius="0.089" scale="1 0.35 1" ${STEEL}></a-sphere>
      <a-cylinder position="${x} 1.14 ${z}" radius="0.0905" height="0.17" open-ended="true" theta-start="130" theta-length="100" color="#a8231d"></a-cylinder>
      <a-cylinder position="${x} 1.14 ${z}" radius="0.0912" height="0.146" open-ended="true" theta-start="133" theta-length="94" color="#ece6d6"></a-cylinder>
      <a-cylinder position="${x} 1.425 ${z}" radius="0.022" height="0.04" ${METAL}></a-cylinder>
      <a-box position="${x} 1.455 ${z}" width="0.06" height="0.03" depth="0.045" ${METAL}></a-box>
      <a-cylinder position="${x} 1.455 ${z - 0.028}" radius="0.019" height="0.012" rotation="90 0 0" ${METAL}></a-cylinder>
      <a-cylinder position="${x} 1.455 ${z - 0.035}" radius="0.015" height="0.002" rotation="90 0 0" color="#f2f0ea"></a-cylinder>
      <a-box position="${x + 0.085} 1.447 ${z}" width="0.12" height="0.012" depth="0.03" ${METAL}></a-box>
      <a-box position="${x + 0.085} 1.476 ${z}" rotation="0 0 6" width="0.12" height="0.012" depth="0.026" ${METAL}></a-box>
      <a-cylinder position="${x + 0.03} 1.462 ${z}" radius="0.006" height="0.036" rotation="90 0 0" ${METAL}></a-cylinder>
      <a-entity cable="radius: 0.008; color: #151515; points: ${x - 0.025} 1.455 ${z}, ${x - 0.06} 1.45 ${z - 0.01}, ${x - 0.105} 1.38 ${z - 0.02}, ${x - 0.11} 1.22 ${z - 0.03}, ${x - 0.105} 1.06 ${z - 0.035}"></a-entity>
      <a-cylinder position="${x - 0.105} 1.03 ${z - 0.035}" radius="0.012" height="0.06" color="#151515"></a-cylinder>
    </a-entity>`;
}

export const corridorHTML = `
<a-entity id="corridor">
  <a-entity merge-static>
    <a-plane rotation="-90 0 0" position="-0.2 0 2.7" width="6.4" height="1.8" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="90 0 0" position="-0.2 2.5 2.7" width="6.4" height="1.8" surface="kind: ceiling; ${SPACE}"></a-plane>
    <!-- the floor inside each door's opening, from the threshold to the corridor -->
    <a-plane rotation="-90 0 0" position="-2.7 0 1.748" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="-90 0 0" position="0.7 0 1.748" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="-90 0 0" position="2.3 0 1.748" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>
    <!-- north wall with door 1's masonry opening and the soon doors' (x 0.2 to 1.2, -3.2 to -2.2, 1.8 to 2.8, up to 2.2 m). Openings and the
         flat things on the walls start and end on the 0.2 m block module, so no sliver of a cut
         block shows beside them (NCMA TEK 05-12; tests/masonry.test.mjs) -->
    <a-plane position="-3.3 1.25 1.8" width="0.2" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="-1.0 1.25 1.8" width="2.4" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="1.5 1.25 1.8" width="0.6" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="2.9 1.25 1.8" width="0.2" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="-2.7 2.35 1.8" width="1.0" height="0.3" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="0.7 2.35 1.8" width="1.0" height="0.3" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="2.3 2.35 1.8" width="1.0" height="0.3" ${BLOCK('#8a9479')}></a-plane>
    <a-plane position="-3.3 0.4 1.803" width="0.2" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane position="-1.0 0.4 1.803" width="2.4" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane position="1.5 0.4 1.803" width="0.6" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane position="2.9 0.4 1.803" width="0.2" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <!-- south and end walls -->
    <a-plane rotation="0 180 0" position="-0.2 1.25 3.6" width="6.4" height="2.5" ${BLOCK('#8a9479')}></a-plane>
    <a-plane rotation="0 180 0" position="-0.2 0.4 3.597" width="6.4" height="0.8" ${BLOCK('#5d6650')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.4 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 -90 0" position="3.0 1.25 2.7" width="1.8" height="2.5" ${BLOCK('#858f74')}></a-plane>
    <a-plane rotation="0 90 0" position="-3.397 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <a-plane rotation="0 -90 0" position="2.997 0.4 2.7" width="1.8" height="0.8" ${BLOCK('#59624c')}></a-plane>
    <!-- rail at 0.8 m and 4 in vinyl base; on the north wall both stop at every door frame -->
    <a-box position="-3.3056 0.8 1.806" width="0.1888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-1 0.8 1.806" width="2.3776" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="1.5 0.8 1.806" width="0.5776" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="2.9056 0.8 1.806" width="0.1888" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-0.2 0.8 3.594" width="6.4" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-3.394 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="2.994 0.8 2.7" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="-3.3056 0.051 1.8025" width="0.1888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-1 0.051 1.8025" width="2.3776" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="1.5 0.051 1.8025" width="0.5776" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="2.9056 0.051 1.8025" width="0.1888" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-0.2 0.051 3.5975" width="6.4" height="0.102" depth="0.005" color="#2b2d29"></a-box>
    <a-box position="-3.3975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <a-box position="2.9975 0.051 2.7" width="0.005" height="0.102" depth="1.8" color="#2b2d29"></a-box>
    <!-- closed doors of the rooms to come, built like door 1 (src/engine/door.js) -->
    ${doorHTML({ x: -2.7, latch: 1 })}
    ${doorHTML({ x: 2.3, latch: -1 })}
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
  <!-- the corridor's own light, dim while the player is here (lobby.js, CORRIDOR_LIGHT) -->
  <a-entity id="corridorAmbient" light="type: ambient; color: #c9cfd6; intensity: 0"></a-entity>
  <a-entity id="corridorLamp" light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 2.7"></a-entity>
  <a-plane position="-1.0 1.5 1.835" width="1.512" height="0.912" surface="kind: cork; repeat: 3.024 1.824"></a-plane>
  <!-- plaques, all one size: each on the wall at its door's latch side, 4 cm from the frame (soon door 2's latch side
       is door 1's: its plaque on the nearest wall beside it, ADA 1991 4.30.6) -->
  <a-entity id="plaqueOut" class="on-wall" panel="w: 0.2; h: 0.2; px: 512; bg: #15161a" position="1.35 1.5 1.806"></a-entity>
  <a-entity id="soon1" class="on-wall" panel="w: 0.2; h: 0.2; px: 512; bg: #15161a" position="-2.05 1.5 1.806"></a-entity>
  <a-entity id="soon2" class="on-wall" panel="w: 0.2; h: 0.2; px: 512; bg: #15161a" position="1.65 1.5 1.806"></a-entity>
  <!-- A4 sheets (ISO 216) pinned beside the clipboard: the studio's poster and a flyer (board.js) -->
  <a-entity id="notePoster" class="clickable" panel="w: 0.21; h: 0.297; px: 640" position="-1.47 1.6 1.84" rotation="0 0 2"></a-entity>
  <a-entity id="noteFlyer" panel="w: 0.21; h: 0.297; px: 640" position="-0.53 1.42 1.84" rotation="0 0 -1.5"></a-entity>
</a-entity>`;
