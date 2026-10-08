// The lab corridor, built from its plan (plan.js): every wall, opening, door, plaque, rail and
// light comes from there, so the corridor can grow without one door or plaque differing from the
// next. Room 101's door is part of room 01 (src/rooms/01-control/scene.js), built by the same door
// builder (src/engine/door.js) as every other. Built to the trade standards in
// docs/building-standards.md: 4 in vinyl base and the rail stop at door frames, 12 in floor tiles
// and a 24 in ceiling grid laid out from the corridor's centre, 2 × 4 ft troffers in the grid.
// Static parts are merged after load; the plaques and the sign change, so they stay apart.
import { doorHTML, CHROME } from '../../engine/door.js';
import { PLAN, DOORS, CENTRE, LENGTH, WIDTH, toEntrance, plaqueX, wallRuns } from './plan.js';
import { SIGN } from '../brand.js';

export { WALLS } from './plan.js';

const SPACE = `space: ${CENTRE.x} ${CENTRE.z} ${LENGTH} ${WIDTH}`;
const BLOCK = (tint) => `surface="kind: block; tint: ${tint}; ${SPACE}"`;
const METAL = `material="color: ${CHROME.color}; metalness: ${CHROME.metalness}; roughness: ${CHROME.roughness}"`;
const PAINT = { wall: '#8a9479', below: '#5d6650', end: '#858f74', endBelow: '#59624c' };
const r = (v) => +v.toFixed(4);
// a long wall's corridor face, the way it faces, and how far in front of it things stand
const FACE = {
  north: { z: PLAN.north, turn: '', out: 1 },
  south: { z: PLAN.south, turn: 'rotation="0 180 0" ', out: -1 }
};
const FRAME_OUT = 0.0112;   // a frame's outer face beyond its opening's edge

// a long wall: block between the openings, over every opening up to the ceiling, the darker band
// below the rail, and the rail and base stopping at every frame
function longWall(wall) {
  const { z, turn, out } = FACE[wall];
  const openings = DOORS.filter((d) => d.wall === wall).map((d) => d.x);
  const atDoor = (v) => openings.some((x) => Math.abs(Math.abs(v - x) - PLAN.opening / 2) < 1e-6);
  return wallRuns(wall).map(([a, b]) => {
    const c = r((a + b) / 2), w = r(b - a);
    const ra = atDoor(a) ? a + FRAME_OUT : a, rb = atDoor(b) ? b - FRAME_OUT : b;
    return `
    <a-plane ${turn}position="${c} 1.25 ${z}" width="${w}" height="2.5" ${BLOCK(PAINT.wall)}></a-plane>
    <a-plane ${turn}position="${c} 0.4 ${r(z + out * 0.003)}" width="${w}" height="0.8" ${BLOCK(PAINT.below)}></a-plane>
    <a-box position="${r((ra + rb) / 2)} 0.8 ${r(z + out * 0.006)}" width="${r(rb - ra)}" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="${r((ra + rb) / 2)} 0.051 ${r(z + out * 0.0025)}" width="${r(rb - ra)}" height="0.102" depth="0.005" color="#2b2d29"></a-box>`;
  }).join('') + openings.map((x) => `
    <a-plane ${turn}position="${x} 2.35 ${z}" width="${PLAN.opening}" height="0.3" ${BLOCK(PAINT.wall)}></a-plane>
    <a-plane rotation="-90 0 0" position="${x} 0 ${r(z - out * 0.052)}" width="0.9204" height="0.104" surface="kind: linoleum; ${SPACE}"></a-plane>`).join('');
}

// an end wall (facing +x at the left end, -x at the right), with its band, rail and base
function endWall(x, facing) {
  const turn = `rotation="0 ${facing * 90} 0"`;
  return `
    <a-plane ${turn} position="${x} 1.25 ${CENTRE.z}" width="${WIDTH}" height="2.5" ${BLOCK(PAINT.end)}></a-plane>
    <a-plane ${turn} position="${r(x + facing * 0.003)} 0.4 ${CENTRE.z}" width="${WIDTH}" height="0.8" ${BLOCK(PAINT.endBelow)}></a-plane>
    <a-box position="${r(x + facing * 0.006)} 0.8 ${CENTRE.z}" width="0.012" height="0.025" depth="${WIDTH}" color="#4a3b2c"></a-box>
    <a-box position="${r(x + facing * 0.0025)} 0.051 ${CENTRE.z}" width="0.005" height="0.102" depth="${WIDTH}" color="#2b2d29"></a-box>`;
}

// every closed door of the corridor (room 101's is room 01's), its latch toward the entrance
function doors() {
  return DOORS.filter((d) => d.kind !== 'room1').map((d) => {
    const { z, out } = FACE[d.wall];
    return doorHTML({ x: d.x, room: r(z - out * PLAN.thick), corridor: z, latch: toEntrance(d.x) * out });
  }).join('');
}

// every plaque at its door's latch side, sized by its kind (brand.js); a room's carries its number
// (the lobby writes it)
function plaques() {
  return DOORS.map((d) => {
    const { z, out } = FACE[d.wall];
    const id = d.kind === 'room1' ? 'id="plaqueOut" ' : d.kind === 'stairs' ? 'id="plaqueStairs" ' : '';
    const room = d.number ? ` room-plaque" data-number="${d.number}` : '';
    const w = d.kind === 'stairs' ? SIGN.stairs : SIGN.room;
    return `
  <a-entity ${id}class="on-wall door-sign${room}" panel="w: ${w}; h: ${w}; px: ${Math.round(w * SIGN.px)}; bg: #15161a"${out < 0 ? ' rotation="0 180 0"' : ''} position="${plaqueX(d.x, SIGN.fromFrame)} ${SIGN.y} ${r(z + out * 0.006)}"></a-entity>`;
  }).join('');
}

// A 2 × 4 ft troffer centred at x in the corridor's grid: a 25 mm painted frame around a lens
// that glows with its two lamps behind it.
function troffer(x) {
  return `
    <a-box position="${x} 2.49 ${CENTRE.z}" width="1.2192" height="0.02" depth="0.6096" color="#dcdcd5"></a-box>
    <a-plane position="${x} 2.475 ${CENTRE.z}" rotation="90 0 0" width="1.1692" height="0.5596"
             material="color: #ffffff; emissive: #f2f6ff; emissiveIntensity: 0.95; roughness: 1" surface="kind: lens; glow: true"></a-plane>`;
}
// two cells each, 10 ft apart, from the grid's centre outwards
const TROFFERS = [-4.572, -1.524, 1.524, 4.572].map((d) => r(CENTRE.x + d));

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

const B = PLAN.board;
export const corridorHTML = `
<a-entity id="corridor">
  <a-entity merge-static>
    <a-plane rotation="-90 0 0" position="${CENTRE.x} 0 ${CENTRE.z}" width="${LENGTH}" height="${WIDTH}" surface="kind: linoleum; ${SPACE}"></a-plane>
    <a-plane rotation="90 0 0" position="${CENTRE.x} 2.5 ${CENTRE.z}" width="${LENGTH}" height="${WIDTH}" surface="kind: ceiling; ${SPACE}"></a-plane>
    <!-- the long walls with their openings and the end walls: openings and flat things on the walls
         start and end on the 0.2 m block module, so no sliver of a cut block shows beside them
         (NCMA TEK 05-12; tests/masonry.test.mjs) -->
    ${longWall('north')}
    ${longWall('south')}
    ${endWall(PLAN.from, 1)}
    ${endWall(PLAN.to, -1)}
    <!-- the closed doors: rooms to come and the stairs the player came up -->
    ${doors()}
    <!-- 2 × 4 ft fluorescent troffers, each filling two cells of the ceiling grid: a painted
         steel door frame and a prismatic lens (docs/building-standards.md, S20) -->
    ${TROFFERS.map(troffer).join('')}
    <!-- the experimenter's board: cork in an aluminium frame (S21); the hook the clipboard
         hangs on (src/app/lobby/lobby.js) -->
    <a-box class="on-wall" position="${B.x} ${B.y} 1.815" width="${B.w}" height="${B.h}" depth="0.03" material="color: #b9bcbf; metalness: .6; roughness: .35"></a-box>
    <a-cylinder position="${B.x} 1.875 1.8575" radius="0.005" height="0.045" rotation="90 0 0" ${METAL}></a-cylinder>
    <!-- the pins of the two sheets beside the clipboard (#notePoster, #noteFlyer below), at the
         top middle of each tilted sheet -->
    <a-sphere position="${r(B.x - 0.4748)} 1.7364 1.843" radius="0.006" color="#9b2a22"></a-sphere>
    <a-sphere position="${r(B.x + 0.4736)} 1.5565 1.843" radius="0.006" color="#2a4a8b"></a-sphere>
    <!-- a 2.5 gal water extinguisher on its wall bracket, opposite the board (S22, S23) -->
    ${extinguisher(PLAN.extinguisher, PLAN.south)}
    <!-- the light box over room 101's door (like the "in session" boxes over lab doors), standing
         just in front of the frame head it rests on -->
    <a-box class="on-wall" position="${PLAN.entrance} 2.3 1.86" width="1.0" height="0.2" depth="0.09" color="#2a2a2c"></a-box>
  </a-entity>
  <a-entity id="signFace" panel="w: 0.94; h: 0.16; px: 1024; bg: #160f05" lightbox="light: #signLight; lightMax: 0.7"
            position="${PLAN.entrance} 2.3 1.907"></a-entity>
  <!-- the sign's warm spill on the door and floor below it (not a hot spot on the ceiling) -->
  <a-entity id="signLight" light="type: point; color: #ffd9a0; intensity: 0; distance: 2.5; decay: 2" position="${PLAN.entrance} 1.95 2.25"></a-entity>
  <!-- the corridor's own light, dim while the player is here (lobby.js, CORRIDOR_LIGHT) -->
  <a-entity id="corridorAmbient" light="type: ambient; color: #c9cfd6; intensity: 0"></a-entity>
  <a-entity id="corridorLamp" light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 ${CENTRE.z}"></a-entity>
  <a-plane position="${B.x} ${B.y} 1.835" width="1.512" height="0.912" surface="kind: cork; repeat: 3.024 1.824"></a-plane>
  <!-- plaques, all one size, each at its door's latch side toward the entrance (plan.js) -->
  ${plaques()}
  <!-- A4 sheets (ISO 216) pinned beside the clipboard: the studio's poster and a flyer (board.js) -->
  <a-entity id="notePoster" class="clickable" panel="w: 0.21; h: 0.297; px: 640" position="${r(B.x - 0.47)} 1.6 1.84" rotation="0 0 2"></a-entity>
  <a-entity id="noteFlyer" panel="w: 0.21; h: 0.297; px: 640" position="${r(B.x + 0.47)} 1.42 1.84" rotation="0 0 -1.5"></a-entity>
</a-entity>`;
