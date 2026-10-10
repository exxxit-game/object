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

// polished stainless and chrome, as on the General WS-900, mirroring the corridor round it
// (reflect-env, src/engine/reflect-env.js); left out of the corridor's merge (data-dynamic) and
// merged on its own, so its steel parts are one mesh with the mirrored picture
const STEEL = 'material="color: #eef0f2; metalness: 1; roughness: .12"';
const CHROME_SHAPE = 'color: #eef0f2; metalness: 1; roughness: .12';
const BRASS = 'material="color: #b08d4a; metalness: 1; roughness: .3"';
// A 2.5 gal stored-pressure water extinguisher, the General WS-900 of 1970 as a seller photographed
// one whole (a flea-market listing: 19 photos, 62.2 cm tall, 18.3 cm across; docs/research/vr/07-corridor-
// 1979.md). Every height below is read off its straight-on photos in parts of the shell's 7 in
// diameter (S23): a foot ring, the straight shell 2.5 diameters tall with a seam band at its top, a
// high round top 0.41 of the diameter, then the neck, a hex collar, the cast valve body and on it the
// squeeze lever, 0.62 m in all. On the wall whose face is at z = wall, facing -z; top at most 1.524 m,
// bottom at least 0.102 m (tests/standards.test.mjs). As in its photos 3 and 18: the gauge on the
// valve's front, its dark blue dial with red arcs and the RANGE wedge (extinguisher-label.js); the
// lever and below it the carry handle to the right as seen from the corridor, both curved castings
// with turned-down ends; the ring pin through them on its chain and the fill valve on its chain; the
// hose's brass coupling on the left, the brown hose down the left side to its black nozzle at the
// foot (photo 17); the label round the front (extinguisher-label.js). How thick the lever and handle
// are across is not in a photo: our estimate. Every part touches the one it is fixed to.
// The hanger's fork, in metres from the shell's axis: its top at the neck's top under the collar
// (y), its prongs from just behind the neck (back) to past the collar's front (front), outer edges at
// out, each prong wide, inner edges clear of the neck (radius 0.022) by 1 mm; each prong's last tip
// millimetres bent up by rise, clear of the collar.
const EXT = { r: 0.089, foot: 0.853, footH: 0.018, shell: 0.445, dome: 0.073, neck: 0.012, collar: 0.019, body: 0.043 };
const EXT_Y = (() => {
  const shellTop = EXT.foot + EXT.footH + EXT.shell, domeTop = shellTop + EXT.dome;
  return { shellTop, domeTop, neckTop: domeTop + EXT.neck, collarTop: domeTop + EXT.neck + EXT.collar, bodyTop: domeTop + EXT.neck + EXT.collar + EXT.body };
})();
const FORK = { t: 0.006, y: EXT_Y.neckTop - 0.003, back: 0.024, front: 0.03, out: 0.031, prong: 0.008, tip: 0.004, rise: 0.008 };
// the lever and the handle, side views in metres from the valve's axis and its top, read off photos
// 6 and 9: the lever pivots at the back of the valve's top and runs over it, falling to its turned-down
// thumb end; the handle leaves the valve's side lower and curves down to its own turned-down end
const LEVER = '0.022 -0.004, 0.022 0.006, 0.010 0.017, -0.030 0.013, -0.065 0.008, -0.076 0.004, -0.081 -0.005, -0.076 -0.007, -0.068 0.000, -0.030 0.004, 0.000 0.005, 0.016 -0.002';
const HANDLE = '-0.015 -0.012, -0.050 -0.022, -0.085 -0.040, -0.105 -0.060, -0.112 -0.073, -0.105 -0.075, -0.095 -0.061, -0.075 -0.045, -0.045 -0.033, -0.015 -0.025';
function extinguisher(x, wall) {
  const z = wall - 0.03 - EXT.r, Y = EXT_Y, f = (v) => v.toFixed(4);
  const gaugeY = Y.bodyTop - 0.021, gaugeZ = z - 0.019;
  return `
    <a-entity class="extinguisher" data-dynamic merge-static reflect-env>
      <!-- the wall hanger, as such brackets are made: a steel strap screwed to the wall, its top bent
           out into a fork that takes the neck between its prongs under the collar; the collar rests
           on the prongs and their turned-up tips keep it from sliding off, so the extinguisher lifts
           straight off it -->
      <a-box class="hanger" decal position="${x} 1.33 ${wall - 0.0015}" width="0.035" height="0.14" depth="0.003" color="#2b2b2b"></a-box>
      <a-cylinder position="${x} 1.38 ${wall - 0.004}" radius="0.005" height="0.003" rotation="90 0 0" decal="layer: 2" ${METAL}></a-cylinder>
      <a-cylinder position="${x} 1.275 ${wall - 0.004}" radius="0.005" height="0.003" rotation="90 0 0" decal="layer: 2" ${METAL}></a-cylinder>
      <a-box class="hanger" position="${x} ${f(FORK.y)} ${f((wall + z + FORK.back) / 2)}" width="${2 * FORK.out}" height="${FORK.t}" depth="${f(wall - z - FORK.back)}" color="#2b2b2b"></a-box>
      ${[-1, 1].map((s) => `<a-box class="hanger" position="${f(x + s * (FORK.out - FORK.prong / 2))} ${f(FORK.y)} ${f(z + (FORK.back - FORK.front) / 2)}" width="${FORK.prong}" height="${FORK.t}" depth="${FORK.back + FORK.front}" color="#2b2b2b"></a-box>
      <a-box class="hanger" position="${f(x + s * (FORK.out - FORK.prong / 2))} ${f(FORK.y + FORK.rise / 2)} ${f(z - FORK.front + FORK.tip / 2)}" width="${FORK.prong}" height="${FORK.t + FORK.rise}" depth="${FORK.tip}" color="#2b2b2b"></a-box>`).join('')}
      <!-- the shell: foot ring, straight shell, the seam band at its top, the high round top -->
      <a-cylinder position="${x} ${f(EXT.foot + EXT.footH / 2)} ${z}" radius="${EXT.r + 0.0005}" height="${EXT.footH}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(EXT.foot + EXT.footH + EXT.shell / 2)} ${z}" radius="${EXT.r}" height="${EXT.shell}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(Y.shellTop)} ${z}" radius="${EXT.r + 0.0015}" height="0.006" ${STEEL}></a-cylinder>
      <a-sphere position="${x} ${f(Y.shellTop)} ${z}" radius="${EXT.r}" scale="1 ${f(EXT.dome / EXT.r)} 1" ${STEEL}></a-sphere>
      <!-- the label, as on the 1972 model: about 98 degrees round the front (painted by
           extinguisher-label.js) -->
      <a-cylinder id="extLabel" data-dynamic decal position="${x} 1.121 ${z}" radius="${EXT.r}" height="0.254" open-ended="true" theta-start="131" theta-length="98" material="roughness: 0.6"></a-cylinder>
      <!-- the neck, the hex collar, the cast valve body; the collar turned so two corners reach out
           over the fork's prongs (three.js puts a corner at +z, its flats would slip between them) -->
      <a-cylinder position="${x} ${f(Y.domeTop + EXT.neck / 2 - 0.004)} ${z}" radius="0.022" height="${EXT.neck + 0.008}" ${STEEL}></a-cylinder>
      <a-cylinder position="${x} ${f(Y.neckTop + EXT.collar / 2)} ${z}" radius="0.026" height="${EXT.collar}" segments-radial="6" rotation="0 30 0" ${STEEL}></a-cylinder>
      <a-entity position="${x} ${f(Y.collarTop)} ${z}" lathe="points: 0 0, 0.019 0, 0.019 0.03, 0.017 0.038, 0.012 0.043, 0 0.043; ${CHROME_SHAPE}"></a-entity>
      <!-- the gauge on the valve's front: a chrome bezel round its dial -->
      <a-cylinder position="${x} ${f(gaugeY)} ${f(gaugeZ - 0.005)}" radius="0.0235" height="0.010" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-circle id="extGauge" data-dynamic decal position="${x} ${f(gaugeY)} ${f(gaugeZ - 0.0101)}" radius="0.0205" rotation="0 180 0" segments="48" material="roughness: 0.5"></a-circle>
      <!-- the squeeze lever on its pin at the back of the valve's top, the carry handle under it -->
      <a-entity position="${x} ${f(Y.bodyTop)} ${z}" outline="points: ${LEVER}; depth: 0.016; bevel: 0.002; ${CHROME_SHAPE}"></a-entity>
      <a-entity position="${x} ${f(Y.bodyTop)} ${z}" outline="points: ${HANDLE}; depth: 0.014; bevel: 0.002; ${CHROME_SHAPE}"></a-entity>
      <a-cylinder position="${x + 0.016} ${f(Y.bodyTop + 0.002)} ${z}" radius="0.0035" height="0.022" rotation="90 0 0" ${STEEL}></a-cylinder>
      <!-- the ring pin through lever and handle, and its chain to the valve; the ring's wire 1.3 mm in
           radius (A-Frame draws twice radius-tubular) -->
      <a-cylinder position="${x - 0.022} ${f(Y.bodyTop - 0.007)} ${z}" radius="0.0016" height="0.026" rotation="90 0 0" ${STEEL}></a-cylinder>
      <a-torus position="${x - 0.022} ${f(Y.bodyTop - 0.017)} ${f(z - 0.013)}" radius="0.010" radius-tubular="0.00065" ${STEEL}></a-torus>
      <!-- the fill valve on the valve's right side under the lever, the ring's chain hanging to it -->
      <a-cylinder position="${f(x - 0.025)} ${f(Y.collarTop + 0.008)} ${f(z - 0.004)}" radius="0.004" height="0.012" rotation="0 0 90" ${BRASS}></a-cylinder>
      <a-entity cable="radius: 0.0007; color: #9a9ca0; points: ${x - 0.022} ${f(Y.bodyTop - 0.027)} ${f(z - 0.013)}, ${f(x - 0.026)} ${f(Y.collarTop + 0.006)} ${f(z - 0.012)}, ${f(x - 0.029)} ${f(Y.collarTop + 0.008)} ${f(z - 0.006)}"></a-entity>
      <!-- the hose: its brass coupling on the valve's left, the brown hose down the left side to its
           black nozzle at the foot -->
      <a-cylinder position="${f(x + 0.025)} ${f(Y.collarTop + 0.022)} ${z}" radius="0.008" height="0.012" rotation="0 0 90" ${STEEL}></a-cylinder>
      <a-cylinder position="${f(x + 0.039)} ${f(Y.collarTop + 0.022)} ${z}" radius="0.0075" height="0.018" rotation="0 0 90" ${BRASS}></a-cylinder>
      <a-entity cable="radius: 0.0078; color: #4f3f31; points: ${f(x + 0.047)} ${f(Y.collarTop + 0.022)} ${z}, ${f(x + 0.075)} ${f(Y.collarTop + 0.012)} ${f(z - 0.008)}, ${x + 0.105} 1.33 ${z - 0.02}, ${x + 0.112} 1.15 ${z - 0.03}, ${x + 0.108} 0.93 ${z - 0.03}"></a-entity>
      <a-cylinder position="${x + 0.108} 0.9 ${z - 0.03}" radius="0.0095" height="0.06" color="#1c1c1c"></a-cylinder>
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
// (a find for a game played again to be understood: docs/owner-decisions.md; the candidates in
// docs/research/vr/09-end-wall-pictures.md). It hangs as in its museum (Museo Civico Ala Ponzone,
// Cremona; Monica Rondoni's photo, Wikimedia Commons, CC BY-SA 4.0): 24 cm wide (Web Gallery of Art, which gives 36 x 24 cm; the museum 35.8 x 24.2), its height
// from the scan, 1.33 of its width as in every reproduction (the difference is not explained),
// straight in a gilded frame with no mat; the frame laps the panel's edge by 1/4 in, as framers lap
// a picture (frameiteasy.com: 1/4 in, at least 1/8 in), the lap inside the moulding's face, so the
// face keeps its width and the panel's raw edge lies hidden under it (Profile Products: outside size
// = the artwork plus the moulding on both sides, minus the lip's overlap on both). The frame's profile (src/engine/moulding.js) is read off that photo at
// full size, its widths in parts of the moulding, a third of the picture it shows: from the outside
// in, a rounded outer bead, two steps down into a hollow, the broad flat band of stippled gilding, a
// rounded ridge, a deep hollow running in, a bead, and the sight edge over the picture. The photo is
// taken from a little below, so how high each part stands off the wall is our estimate (PROFILE's h;
// docs/board.md). Gold as measured (Physically Based database, "Gold": linear 1.059, 0.773, 0.307,
// metalness 1); the broad band matte and the beads burnished, as the photo shows them and as frames
// are gilded (MFA Boston: "matte and burnished areas"), how rough each is our estimate. It mirrors
// the corridor round it (reflect-env, its picture taken 10 cm out from the wall, past the camera's
// near limit), as the extinguisher's steel does: bare metal reads as plastic. Its bottom edge lies on a block joint
// (tests/masonry.test.mjs). No glass is drawn: in a headset it would only mirror the troffers. The
// picture is the Commons scan less its dark scanner edge (1024 x 1360 px), lit by the corridor's own
// light; it is turned after load (lobby.js).
const ART = 'vendor/art/arcimboldo-vegetable-gardener.jpg';
const PICTURE = { w: 0.24, h: r(0.24 * 1360 / 1024) };
const LAP = 0.00635;       // the frame's lip over the panel's edge, 1/4 in
const M = r((PICTURE.w - 2 * LAP) / 3);   // the moulding's face, a third of the picture it shows
const BODY = 0.012;        // the picture's back off the wall, in the frame's rebate
// points round an arc in the profile's plane (u in, h off the wall), from angle a to b in degrees
const arc = (cu, ch, rad, a, b, n = 4) => Array.from({ length: n + 1 }, (_, i) => {
  const t = (a + (b - a) * i / n) * Math.PI / 180;
  return [cu + rad * Math.cos(t), ch + rad * Math.sin(t)];
});
// the profile, outside in, drawn for a moulding 8 cm wide and scaled to M; the widths in parts of M
// as measured (outer bead 0-0.075, steps and hollow to 0.26, flat band to 0.66, ridge to 0.73, hollow
// to 0.88, bead to 0.95, sight edge to 1; as drawn, within 1 mm of the photo's)
const PROFILE = [
  [0, 0], [0, 0.033], ...arc(0.003, 0.033, 0.003, 180, 0).slice(1),
  [0.006, 0.031], [0.010, 0.031], [0.010, 0.029], ...arc(0.013, 0.029, 0.003, 180, 270).slice(1),
  [0.0185, 0.026], ...arc(0.0185, 0.0285, 0.0025, 270, 360).slice(1), [0.053, 0.0285],
  ...arc(0.0555, 0.0285, 0.0025, 180, 0).slice(1), ...arc(0.068, 0.0285, 0.0100, 180, 270, 6).slice(1),
  [0.070, 0.0185], ...arc(0.073, 0.0185, 0.003, 180, 0).slice(1), [0.076, 0.018], [0.080, 0.018], [0.080, BODY]
].map(([u, h]) => r(u * M / 0.08) + ' ' + r(h)).join(', ');
const OUTER = { w: r(PICTURE.w - 2 * LAP + 2 * M), h: r(PICTURE.h - 2 * LAP + 2 * M) };
const PRINT_Y = r(1.2 + OUTER.h / 2);
const END_PRINTS = [{ x: PLAN.from, facing: 1, turn: 0 }, { x: PLAN.to, facing: -1, turn: 180 }];
// Each new visit the two swap ends, for whoever notices on a replay (docs/owner-decisions.md): the picture's turn
// on end i (0 west, 1 east), visits counted from 0 (opening.js, visitsSoFar)
export const printTurn = (i, visits) => (END_PRINTS[i].turn + 180 * (Math.abs(visits | 0) % 2)) % 360;
// the gilded frame and the picture in it (turned 180 degrees on one end)
const printImage = ({ x, facing, turn }) => `
  <a-entity class="end-frame on-wall" reflect-env="out: 0.1" position="${x} ${PRINT_Y} ${CENTRE.z}" rotation="0 ${facing * 90} 0"
            moulding="width: ${OUTER.w}; height: ${OUTER.h}; profile: ${PROFILE}; color: #ffe396; metalness: 1; roughness: .35; matte: ${r(0.021 * M / 0.08)} ${r(0.053 * M / 0.08)}; matteRoughness: .7"></a-entity>
  <a-plane class="end-print" rotation="0 ${facing * 90} ${turn}" position="${r(x + facing * (BODY + 0.0005))} ${PRINT_Y} ${CENTRE.z}"
           width="${PICTURE.w}" height="${PICTURE.h}" material="src: ${ART}; roughness: 1"></a-plane>`;
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
