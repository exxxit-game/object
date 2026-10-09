// The lab corridor, built from its plan (plan.js): every wall, opening, door, plaque, rail and
// light comes from there, so the corridor can grow without one door or plaque differing from the
// next. Room 101's door is part of room 01 (src/rooms/01-control/scene.js), built by the same door
// builder (src/engine/door.js) as every other. Built to the trade standards in
// docs/building-standards.md: 4 in vinyl base and the rail stop at door frames, 12 in floor tiles
// and a 24 in ceiling grid laid out from the corridor's centre, 2 × 4 ft troffers in the grid.
// Static parts are merged after load; the door signs and the light box change, so they stay apart.
import { doorHTML, CHROME } from '../../engine/door.js';
import { PLAN, DOORS, CENTRE, LENGTH, WIDTH, CORK_Z, toEntrance, wallRuns } from './plan.js';
import { LETTER } from '../../engine/ui/sheet-math.js';
import { jointOrigin, CEILING } from '../../engine/tile-math.js';
import { SIGN, SIGN_PANEL } from '../brand.js';
import { SIGN_AT, SIGN_BOX } from './sign.js';

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
// The paint band below the rail and the wall above it lie in one plane and meet under the rail:
// one plane over the other, millimetres apart, flickers in a headset (docs/vr-checklist.md).
const RAIL = 0.8;
export const CEIL = 2.5;
const UPPER = { y: r((RAIL + CEIL) / 2), h: r(CEIL - RAIL) };

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
    <a-plane ${turn}position="${c} ${UPPER.y} ${z}" width="${w}" height="${UPPER.h}" ${BLOCK(PAINT.wall)}></a-plane>
    <a-plane ${turn}position="${c} ${RAIL / 2} ${z}" width="${w}" height="${RAIL}" ${BLOCK(PAINT.below)}></a-plane>
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
    <a-plane ${turn} position="${x} ${UPPER.y} ${CENTRE.z}" width="${WIDTH}" height="${UPPER.h}" ${BLOCK(PAINT.end)}></a-plane>
    <a-plane ${turn} position="${x} ${RAIL / 2} ${CENTRE.z}" width="${WIDTH}" height="${RAIL}" ${BLOCK(PAINT.endBelow)}></a-plane>
    <a-box position="${r(x + facing * 0.006)} 0.8 ${CENTRE.z}" width="0.012" height="0.025" depth="${WIDTH}" color="#4a3b2c"></a-box>
    <a-box position="${r(x + facing * 0.0025)} 0.051 ${CENTRE.z}" width="0.005" height="0.102" depth="${WIDTH}" color="#2b2d29"></a-box>`;
}

// every closed door of the corridor (room 101's is room 01's), its latch toward the entrance
function doors() {
  return DOORS.filter((d) => d.kind !== 'room1').map((d) => {
    const { z, out } = FACE[d.wall];
    // its sign on the leaf (brand.js): a room's number, written by the lobby, or the stairs'
    const attrs = d.kind === 'stairs' ? `id="plaqueStairs" class="door-sign" ${SIGN_PANEL}` : `class="door-sign room-plaque" data-number="${d.number}" ${SIGN_PANEL}`;
    return doorHTML({ x: d.x, room: r(z - out * PLAN.thick), corridor: z, latch: toEntrance(d.x) * out, sign: { attrs, y: SIGN.y } });
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
// Lay-in troffers sit in the grid's openings, in place of two tiles, their ends on its tees (S20):
// each is centred on a joint along the corridor. A 2 × 4 opening lies between two main beams 48 in
// apart (S29), so a row steps by 4 ft: 8 ft (4 tiles) apart, inside the troffer's spacing
// criterion, 1.25 times its height over the floor (Metalux 2G-240A, two F40, pattern 12 lens:
// 3.1 m at 2.5 m, S28), from the corridor's centre, a joint, to both ends.
const JOINT = jointOrigin(CENTRE.x, LENGTH, CEILING.tile);
const TROFFERS = [-8, -4, 0, 4, 8].map((k) => r(JOINT + k * CEILING.tile));

// polished stainless, as on the 1972 General WS-900 (a seller's photo of one), mirroring the
// corridor round it (reflect-env, src/engine/reflect-env.js); left out of the corridor's merge
// (data-dynamic) and merged on its own, so its steel parts are one mesh with the mirrored picture
const STEEL = 'material="color: #eef0f2; metalness: 1; roughness: .12"';
// A 2.5 gal stored-pressure water extinguisher as made in the 1970s, shaped after the 1972 General
// WS-900 (a seller's photo of one; docs/research/vr/07-corridor-1979.md): a polished stainless
// shell 7 in across with a high round top and a flat foot ring, 0.62 m tall (S23), on a wall hook
// under its neck, on the wall whose face is at z = wall, facing -z; top at most 1.524 m, bottom at
// least 0.102 m (tests/standards.test.mjs). On the valve: the carry handle and above it the
// squeeze lever on one pin, to the right as seen from the corridor; the gauge with its red rim in
// front; the grey hose down the left side to its nozzle at the foot; the label round the front
// (extinguisher-label.js). Every part touches the one it is fixed to (tests/standards.test.mjs).
// The hanger's fork, in metres from the shell's axis: its top at the valve's underside (y), its
// prongs from just behind the neck (back) to past the valve's front (front), outer edges at out,
// each prong wide, inner edges clear of the neck (radius 0.022) by 1 mm; each prong's last tip
// millimetres bent up by rise, clear of the valve's front (0.0225).
const FORK = { t: 0.006, y: 1.437, back: 0.024, front: 0.03, out: 0.031, prong: 0.008, tip: 0.004, rise: 0.008 };
function extinguisher(x, wall) {
  const z = wall - 0.03 - 0.089;
  return `
    <a-entity class="extinguisher" data-dynamic merge-static reflect-env>
      <!-- the wall hanger, as such brackets are made: a steel strap screwed to the wall, its top bent
           out into a fork that takes the neck between its prongs above the round top; the valve
           rests on the prongs and their turned-up tips keep it from sliding off, so the
           extinguisher lifts straight off it -->
      <a-box class="hanger" decal position="${x} 1.37 ${wall - 0.0015}" width="0.035" height="0.14" depth="0.003" color="#2b2b2b"></a-box>
      <a-cylinder position="${x} 1.42 ${wall - 0.004}" radius="0.005" height="0.003" rotation="90 0 0" decal="layer: 2" ${METAL}></a-cylinder>
      <a-cylinder position="${x} 1.315 ${wall - 0.004}" radius="0.005" height="0.003" rotation="90 0 0" decal="layer: 2" ${METAL}></a-cylinder>
      <a-box class="hanger" position="${x} ${FORK.y} ${((wall + z + FORK.back) / 2).toFixed(4)}" width="${2 * FORK.out}" height="${FORK.t}" depth="${(wall - z - FORK.back).toFixed(4)}" color="#2b2b2b"></a-box>
      ${[-1, 1].map((s) => `<a-box class="hanger" position="${(x + s * (FORK.out - FORK.prong / 2)).toFixed(4)} ${FORK.y} ${(z + (FORK.back - FORK.front) / 2).toFixed(4)}" width="${FORK.prong}" height="${FORK.t}" depth="${FORK.back + FORK.front}" color="#2b2b2b"></a-box>
      <a-box class="hanger" position="${(x + s * (FORK.out - FORK.prong / 2)).toFixed(4)} ${FORK.y + FORK.rise / 2} ${(z - FORK.front + FORK.tip / 2).toFixed(4)}" width="${FORK.prong}" height="${FORK.t + FORK.rise}" depth="${FORK.tip}" color="#2b2b2b"></a-box>`).join('')}
      <a-cylinder position="${x} 1.109 ${z}" radius="0.089" height="0.48" ${STEEL}></a-cylinder>
      <a-sphere position="${x} 1.349 ${z}" radius="0.089" scale="1 0.7 1" ${STEEL}></a-sphere>
      <a-cylinder position="${x} 0.861 ${z}" radius="0.0895" height="0.016" ${STEEL}></a-cylinder>
      <!-- the label, as on the 1972 model: about 98 degrees round the front, from a fifth to three
           quarters down the shell (painted by extinguisher-label.js) -->
      <a-cylinder id="extLabel" data-dynamic decal position="${x} 1.121 ${z}" radius="0.089" height="0.254" open-ended="true" theta-start="131" theta-length="98" material="roughness: 0.6"></a-cylinder>
      <a-cylinder position="${x} 1.425 ${z}" radius="0.022" height="0.04" ${STEEL}></a-cylinder>
      <a-box position="${x} 1.455 ${z}" width="0.06" height="0.03" depth="0.045" ${STEEL}></a-box>
      <a-cylinder position="${x} 1.455 ${z - 0.028}" radius="0.019" height="0.012" rotation="90 0 0" color="#b3261e"></a-cylinder>
      <a-cylinder position="${x} 1.455 ${z - 0.035}" radius="0.014" height="0.002" rotation="90 0 0" decal color="#f2f0ea"></a-cylinder>
      <a-box position="${x - 0.085} 1.447 ${z}" width="0.12" height="0.012" depth="0.03" ${STEEL}></a-box>
      <a-box position="${x - 0.085} 1.476 ${z}" rotation="0 0 -6" width="0.12" height="0.012" depth="0.026" ${STEEL}></a-box>
      <a-cylinder position="${x - 0.03} 1.462 ${z}" radius="0.006" height="0.036" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-entity cable="radius: 0.009; color: #77726a; points: ${x + 0.025} 1.455 ${z}, ${x + 0.065} 1.445 ${z - 0.01}, ${x + 0.105} 1.37 ${z - 0.02}, ${x + 0.112} 1.15 ${z - 0.03}, ${x + 0.108} 0.93 ${z - 0.03}"></a-entity>
      <a-cylinder position="${x + 0.108} 0.9 ${z - 0.03}" radius="0.011" height="0.06" color="#8c6a3c"></a-cylinder>
    </a-entity>`;
}

const B = PLAN.board;
const ALU = 'material="color: #b9bcbf; metalness: .6; roughness: .35"';
// what lies on the cork: a sheet half a millimetre off it (drawn over it as a decal, panel.js), a
// pin's head touching the sheet
const ON_CORK = r(CORK_Z + 0.0005), PIN = 0.006;
// the two notices beside the clipboard, Letter sheets (sheet-math.js), each tilted a little as
// pinned by hand; a pin in the middle of each sheet's top, 12 mm below its edge
const NOTES = { poster: { x: r(B.x - 0.47), y: 1.6, tilt: 2 }, flyer: { x: r(B.x + 0.47), y: 1.42, tilt: -1.5 } };
const pinAt = ({ x, y, tilt }) => {
  const s = LETTER.h / 2 - 0.012, a = tilt * Math.PI / 180;
  return `${r(x - s * Math.sin(a))} ${r(y + s * Math.cos(a))}`;
};
const note = ({ x, y, tilt }) => `panel="w: ${LETTER.w}; h: ${LETTER.h}; px: 640; decal: true" position="${x} ${y} ${ON_CORK}" rotation="0 0 ${tilt}"`;
// the board's lip: four aluminium bars round the cork on the body's face
function lip() {
  const z = r(PLAN.north + B.body + B.lip / 2), inner = B.h - 2 * B.border;
  return [[0, (B.h - B.border) / 2, B.w, B.border], [0, -(B.h - B.border) / 2, B.w, B.border],
    [-(B.w - B.border) / 2, 0, B.border, inner], [(B.w - B.border) / 2, 0, B.border, inner]]
    .map(([dx, dy, w, h]) => `
    <a-box position="${r(B.x + dx)} ${r(B.y + dy)} ${z}" width="${r(w)}" height="${r(h)}" depth="${B.lip}" ${ALU}></a-box>`).join('');
}
// The end walls: Arcimboldo's Vegetable Gardener (about 1590; Wikimedia Commons, public domain,
// docs/art/credits.md) on each, the right way up (a face) at one end and upside down (a bowl of
// vegetables) at the other, with no caption: whoever walks to both ends may notice it is one picture
// (the owner's choice; docs/research/vr/09-end-wall-pictures.md). It hangs as in its museum (Museo
// Civico Ala Ponzone, Cremona; Monica Rondoni's photo, Wikimedia Commons, CC BY-SA 4.0, the owner's
// pick): at its own size, 24 cm wide (Web Gallery of Art; its height from the scan), straight in a
// gilded frame with no mat. The frame's face is measured on that photo, in parts of the picture's
// width: the moulding a third of it each side; from the picture out, a narrow gilded sight edge, a
// dark liner, a gilded slope and the broad flat outer band. The photo is frontal, so the frame's
// depths are not in it (the depths in FRAME: our estimate, docs/board.md). Its bottom edge lies on a block joint
// (tests/masonry.test.mjs). No glass is drawn: in a headset it would only mirror the troffers. The
// picture is the Commons scan less its dark scanner edge (1024 x 1360 px), lit by the corridor's own
// light. The frames merge with the corridor; the picture is turned after load (lobby.js).
const ART = 'vendor/art/arcimboldo-vegetable-gardener.jpg';
// gold as measured (Physically Based database, "Gold": linear 1.059, 0.773, 0.307, metalness 1), its
// roughness our estimate for old gilding; the liner's colour sampled on the photo. The gilding mirrors
// the corridor round it (reflect-env), as the extinguisher's steel does: bare metal reads as plastic.
const GOLD = 'material="color: #ffe396; metalness: 1; roughness: .35"';
const LINER = 'material="color: #5d3e21; roughness: .8"';
const PICTURE = { w: 0.24, h: r(0.24 * 1360 / 1024) };
// the moulding's width (m); its bands as [from, to] in parts of it, out from the picture's edge, with
// the depth of each band's face off the wall; the body behind is the frame's back on the wall
const FRAME = { m: r(0.24 / 3), body: 0.012, bands: [[0, 0.06, 0.024, GOLD], [0.06, 0.19, 0.02, LINER], [0.19, 0.48, 0.03, GOLD], [0.48, 1, 0.04, GOLD]] };
const OUTER = { w: r(PICTURE.w + 2 * FRAME.m), h: r(PICTURE.h + 2 * FRAME.m) };
const PRINT_Y = r(1.2 + OUTER.h / 2);
const END_PRINTS = [{ x: PLAN.from, facing: 1, turn: 0 }, { x: PLAN.to, facing: -1, turn: 180 }];
// Each new visit the two swap ends, for whoever notices (the owner's detail): the picture's turn
// on end i (0 west, 1 east), visits counted from 0 (opening.js, visitsSoFar)
export const printTurn = (i, visits) => (END_PRINTS[i].turn + 180 * (Math.abs(visits | 0) % 2)) % 360;
// the frame on an end wall, every part placed in the corridor's own axes, facing along x: its body,
// then each band as four boxes round the picture, from the body's face to the band's face
function printFrame({ x, facing }) {
  const at = (d) => r(x + facing * d), rot = `rotation="0 ${facing * 90} 0"`, y = PRINT_Y, z = CENTRE.z;
  const ring = ([from, to, face, mat]) => {
    const a = from * FRAME.m, b = to * FRAME.m, band = r(b - a), mid = (a + b) / 2, d = r(face - FRAME.body), cx = at(FRAME.body + d / 2);
    const across = r(PICTURE.w + 2 * b), up = r(PICTURE.h + 2 * a);
    return [[y + PICTURE.h / 2 + mid, z, across, band], [y - PICTURE.h / 2 - mid, z, across, band], [y, z - PICTURE.w / 2 - mid, band, up], [y, z + PICTURE.w / 2 + mid, band, up]]
      .map(([by, bz, w, h]) => `<a-box ${rot} position="${cx} ${r(by)} ${r(bz)}" width="${w}" height="${h}" depth="${d}" ${mat}></a-box>`).join('');
  };
  return `
    <a-entity class="end-frame" data-dynamic merge-static reflect-env>
      <a-box class="on-wall" ${rot} position="${at(FRAME.body / 2)} ${y} ${z}" width="${OUTER.w}" height="${OUTER.h}" depth="${FRAME.body}" ${LINER}></a-box>
      ${FRAME.bands.map(ring).join('')}
    </a-entity>`;
}
// the picture in the frame's rebate, on the body's face (turned 180 degrees on one end)
const printImage = ({ x, facing, turn }) => `
  <a-plane class="end-print" rotation="0 ${facing * 90} ${turn}" position="${r(x + facing * (FRAME.body + 0.0005))} ${PRINT_Y} ${CENTRE.z}"
           width="${PICTURE.w}" height="${PICTURE.h}" decal material="src: ${ART}; roughness: 1"></a-plane>`;
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
    <!-- the experimenter's board: cork in an aluminium frame (S21), the body on the wall and the
         lip round the cork; the peg the clipboard hangs on, out of the cork (src/app/lobby/lobby.js) -->
    <a-box class="on-wall" position="${B.x} ${B.y} ${r(PLAN.north + B.body / 2)}" width="${B.w}" height="${B.h}" depth="${B.body}" ${ALU}></a-box>${lip()}
    <a-cylinder position="${B.x} ${B.hook} ${r(CORK_Z + 0.0225)}" radius="${B.peg}" height="0.045" rotation="90 0 0" ${METAL}></a-cylinder>
    <!-- the pins of the two sheets beside the clipboard (#notePoster, #noteFlyer below), at the
         top middle of each tilted sheet -->
    <a-sphere position="${pinAt(NOTES.poster)} ${r(ON_CORK + PIN)}" radius="${PIN}" color="#9b2a22"></a-sphere>
    <a-sphere position="${pinAt(NOTES.flyer)} ${r(ON_CORK + PIN)}" radius="${PIN}" color="#2a4a8b"></a-sphere>
    <!-- a 2.5 gal water extinguisher on its wall bracket, opposite the board (S22, S23) -->
    ${extinguisher(PLAN.extinguisher, PLAN.south)}
    <!-- the print on each end wall: its frame and paper (the picture below) -->
    ${END_PRINTS.map(printFrame).join('')}
    <!-- the light box over room 101's door (like the "in session" boxes over lab doors): surface
         mounted, its back on the wall, as wide as the frame head it stands on (1.0224 m, door.js),
         its foot on the head's top, its top on a block joint (sign.js) -->
    <a-box class="on-wall" position="${SIGN_AT.x} ${SIGN_AT.y} ${SIGN_BOX.z}" width="1.0224" height="${SIGN_BOX.h}" depth="${SIGN_BOX.depth}" color="#2a2a2c"></a-box>
  </a-entity>
  <a-entity id="signFace" panel="w: 0.94; h: 0.16; px: 1024; bg: #160f05; decal: true" lightbox="light: #signLight; lightMax: 0.7"
            position="${SIGN_AT.x} ${SIGN_AT.y} ${SIGN_AT.z}"></a-entity>
  <!-- the sign's warm spill on the door and floor below it (not a hot spot on the ceiling) -->
  <a-entity id="signLight" light="type: point; color: #ffd9a0; intensity: 0; distance: 2.5; decay: 2" position="${PLAN.entrance} 1.95 2.25"></a-entity>
  <!-- the corridor's own light, dim while the player is here (lobby.js, CORRIDOR_LIGHT) -->
  <a-entity id="corridorAmbient" light="type: ambient; color: #c9cfd6; intensity: 0"></a-entity>
  <a-entity id="corridorLamp" light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 ${CENTRE.z}"></a-entity>
  <a-plane position="${B.x} ${B.y} ${CORK_Z}" width="${r(B.w - 2 * B.border)}" height="${r(B.h - 2 * B.border)}" surface="kind: cork; repeat: 3.024 1.824"></a-plane>
  <!-- Letter sheets pinned beside the clipboard: the studio's poster and a flyer (board.js) -->
  <a-entity id="notePoster" class="clickable" ${note(NOTES.poster)}></a-entity>
  <a-entity id="noteFlyer" ${note(NOTES.flyer)}></a-entity>
  <!-- the Vegetable Gardener on both end walls, one upside down (which end, lobby.js by visit) -->
  ${END_PRINTS.map(printImage).join('')}
</a-entity>`;
