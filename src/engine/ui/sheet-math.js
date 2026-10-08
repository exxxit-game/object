// Pure math for sheet.js: where the clipboard sheet appears and how big its letters
// look. Research (docs/decisions.md): read at about 1 m (Meta display guidance; rays are
// comfortable from 0.8 m), a little below the eyes, world-fixed once shown; letters at
// least the game's readable minimum, answer targets at least 2.5 degrees (Meta).
export const READ_DIST = 1.0;
// The clipboard's board, and how far the whole thing reaches behind the paper (the board, 4 mm
// behind it) and in front of it (the clip): sheet.js draws it so, the wall checks use it.
export const BOARD = { w: 0.6, h: 0.78, d: 0.006 };
export const BOARD_REACH = { w: BOARD.w, h: BOARD.h, back: BOARD.d + 0.004, front: 0.02 };
export const DROP_DEG = 12;
export const MIN_LETTER_DEG = 1.2;
export const MIN_TARGET_DEG = 2.5;

// head: [x, y, z] eyes in world metres; yaw: the way the player faces (radians,
// three.js: 0 looks along -Z). Returns the sheet centre and its three.js rotation
// (order YXZ) so that its face points back at the eyes.
export function frontPose(head, yaw) {
  const d = DROP_DEG * Math.PI / 180;
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const pos = [
    head[0] + READ_DIST * Math.cos(d) * ahead[0],
    head[1] - READ_DIST * Math.sin(d),
    head[2] + READ_DIST * Math.cos(d) * ahead[1]
  ];
  return { pos, yaw, pitch: -d };
}

// How big a letter of this size looks from this distance, in degrees of view.
export function letterDeg(sizeM, distM) {
  return 2 * Math.atan(sizeM / 2 / distM) * 180 / Math.PI;
}

// How the sheet travels between its hook and the reading spot, only after the player's
// click (motion is comfortable when the user starts it: Android XR motion guide). Never a
// straight line at the eyes (looming makes people dodge: Meta; an approach alarms, a miss
// path does not: Ball & Tronick 1971): it swings out sideways (away from the wall) and
// down, eases in and out (Meta's grab specs), and never comes nearer than NEAREST.
// SIDE, DROP and the time per metre are our choices, to be checked in the headset.
// out: how much further from the wall a swing may bend when its corners would touch a wall.
export const GLIDE = { side: 0.35, drop: 0.2, msPerM: 700, minMs: 1000, maxMs: 1800, nearest: 0.5, out: [0, 0.1, 0.2, 0.3, 0.45] };

// Where the sheet is read: frontPose, unless that spot is behind the wall the sheet hangs
// on (a player standing close to it) or past a wall of the space (a player near an end wall);
// then the nearest turn to either side that keeps it clear. A sheet behind a wall cannot be
// read, yet its buttons still take the laser through the wall.
// wall: { pos: [x, y, z] on the wall, away: [x, y, z] out of it }; inside: the space's wall
// faces { minX, maxX, minZ, maxZ }; board: { w, h, back, front } the clipboard's size and how
// far it reaches behind and in front of the paper, so every corner of it stays in, tilted and
// turned as it is read.
export const CLEAR = 0.15;   // metres from the sheet's centre to a wall in front of it
// Every corner keeps this far inside the wall faces: what hangs on a wall stands up to 35 mm
// proud of it (the cork board in its frame, src/app/lobby/scene.js) and two faces closer than
// 5 mm flicker (docs/vr-checklist.md).
export const EDGE_CLEAR = 0.04;
export function readingPose(head, yaw, wall, inside, board = null) {
  const fits = (p) => {
    if (wall && (p.pos[0] - wall.pos[0]) * wall.away[0] + (p.pos[2] - wall.pos[2]) * wall.away[2] < CLEAR) return false;
    return !inside || (within(inside, p.pos, CLEAR) && (!board || boardCorners(p, board).every((c) => within(inside, c, EDGE_CLEAR))));
  };
  for (let turn = 0; turn <= 180; turn += 5) {
    for (const s of turn ? [1, -1] : [1]) {
      const p = frontPose(head, yaw + s * turn * Math.PI / 180);
      if (fits(p)) return p;
    }
  }
  return frontPose(head, yaw);
}

// Whether a point [x, y, z] is at least m inside the wall faces.
export function within(inside, [x, , z], m) {
  return x >= inside.minX + m && x <= inside.maxX - m && z >= inside.minZ + m && z <= inside.maxZ - m;
}

// The eight corners of the board at pose { pos, pitch, yaw } (three.js order YXZ: pitch about its
// own x, then yaw about the vertical).
export function boardCorners({ pos, pitch, yaw }, { w, h, back = 0, front = 0 }) {
  const cx = Math.cos(pitch), sx = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const out = [];
  for (const x of [-w / 2, w / 2]) for (const y of [-h / 2, h / 2]) for (const z of [-back, front]) {
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    out.push([pos[0] + x * cy + z1 * sy, pos[1] + y1, pos[2] - x * sy + z1 * cy]);
  }
  return out;
}

// a, b: start and end [x, y, z]; away: the horizontal way out from the wall the sheet
// hangs on; head: the eyes; room (optional): { from, to: { pitch, yaw }, board, inside } to keep
// every corner of the board EDGE_CLEAR inside the walls all the way (tripPose).
// Returns the curve's control point and its duration in ms. The full swing is used unless it
// would bring the sheet nearer the eyes than both GLIDE.nearest and its own start and end; then a
// smaller one; a swing that would put a corner into a wall is pushed further out from the wall.
export function glidePath(a, b, away, head, room = null) {
  const dx = b[0] - a[0], dz = b[2] - a[2];
  const len = Math.hypot(dx, dz) || 1;
  let side = [-dz / len, dx / len];
  if (side[0] * away[0] + side[1] * away[2] < 0) side = [-side[0], -side[1]];
  const allowed = Math.min(GLIDE.nearest, dist3(a, head), dist3(b, head));
  const clear = (ctrl) => !room || Array.from({ length: 41 }, (_, i) => tripPose({ pos: a, ...room.from }, ctrl, { pos: b, ...room.to }, i / 40))
    .every((p) => boardCorners(p, room.board).every((c) => within(room.inside, c, EDGE_CLEAR)));
  let best = null;
  search: for (const out of GLIDE.out) {
    for (const k of [1, 0.6, 0.3, 0]) {
      const ctrl = [
        (a[0] + b[0]) / 2 + side[0] * GLIDE.side * k + away[0] * out,
        (a[1] + b[1]) / 2 - GLIDE.drop,
        (a[2] + b[2]) / 2 + side[1] * GLIDE.side * k + away[2] * out
      ];
      let nearest = Infinity;
      for (let i = 0; i <= 40; i++) nearest = Math.min(nearest, dist3(curvePoint(a, ctrl, b, i / 40), head));
      const ok = clear(ctrl);
      if (!best || ok > best.ok || (ok === best.ok && nearest > best.nearest)) best = { ctrl, nearest, ok };
      if (ok && nearest >= allowed - 1e-9) { best = { ctrl, nearest, ok }; break search; }
    }
  }
  let length = 0;
  for (let i = 1, p = a; i <= 20; i++) {
    const q = curvePoint(a, best.ctrl, b, i / 20);
    length += dist3(p, q);
    p = q;
  }
  const ms = Math.min(GLIDE.maxMs, Math.max(GLIDE.minMs, length * GLIDE.msPerM));
  return { ctrl: best.ctrl, ms };
}

const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// A point on the curve a → b bent towards ctrl, at f from 0 to 1.
export function curvePoint(a, ctrl, b, f) {
  const u = 1 - f;
  return a.map((v, i) => u * u * v + 2 * u * f * ctrl[i] + f * f * b[i]);
}

// The pose along a trip at eased progress e: the curve for the place, the shorter way round for
// the turn, a straight blend for the tilt (the sheet never rolls). glide.js moves it by this.
export function tripPose(a, ctrl, b, e) {
  const turn = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw));
  return { pos: curvePoint(a.pos, ctrl, b.pos, e), pitch: a.pitch + (b.pitch - a.pitch) * e, yaw: a.yaw + turn * e };
}

// Slow start, slow stop.
export function easeInOut(f) {
  return f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
}
