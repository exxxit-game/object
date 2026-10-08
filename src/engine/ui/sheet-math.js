// Pure math for sheet.js: where the clipboard sheet appears and how big its letters
// look. Research (docs/decisions.md): read at about 1 m (Meta display guidance; rays are
// comfortable from 0.8 m), a little below the eyes, world-fixed once shown; letters at
// least the game's readable minimum, answer targets at least 2.5 degrees (Meta).
export const READ_DIST = 1.0;
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
export const GLIDE = { side: 0.35, drop: 0.2, msPerM: 700, minMs: 1000, maxMs: 1800, nearest: 0.5 };

// Where the sheet is read: frontPose, unless that spot is behind the wall the sheet hangs
// on (a player standing close to it) or past a wall of the space (a player near an end wall);
// then the nearest turn to either side that keeps it clear. A sheet behind a wall cannot be
// read, yet its buttons still take the laser through the wall.
// wall: { pos: [x, y, z] on the wall, away: [x, y, z] out of it }; inside: the space's wall
// faces { minX, maxX, minZ, maxZ }; halfW: half the sheet's width, so its side edges stay in.
export const CLEAR = 0.15;   // metres from the sheet's centre to a wall in front of it
export function readingPose(head, yaw, wall, inside, halfW = 0) {
  const fits = (p) => {
    if (wall && (p.pos[0] - wall.pos[0]) * wall.away[0] + (p.pos[2] - wall.pos[2]) * wall.away[2] < CLEAR) return false;
    if (!inside) return true;
    const [x, , z] = p.pos, rx = Math.cos(p.yaw) * halfW, rz = -Math.sin(p.yaw) * halfW;
    const within = (px, pz, m) => px >= inside.minX + m && px <= inside.maxX - m && pz >= inside.minZ + m && pz <= inside.maxZ - m;
    return within(x, z, CLEAR) && within(x + rx, z + rz, 0) && within(x - rx, z - rz, 0);
  };
  for (let turn = 0; turn <= 180; turn += 5) {
    for (const s of turn ? [1, -1] : [1]) {
      const p = frontPose(head, yaw + s * turn * Math.PI / 180);
      if (fits(p)) return p;
    }
  }
  return frontPose(head, yaw);
}

// a, b: start and end [x, y, z]; away: the horizontal way out from the wall the sheet
// hangs on; head: the eyes. Returns the curve's control point and its duration in ms.
// The full swing is used unless it would bring the sheet nearer the eyes than both
// GLIDE.nearest and its own start and end; then a smaller one.
export function glidePath(a, b, away, head) {
  const dx = b[0] - a[0], dz = b[2] - a[2];
  const len = Math.hypot(dx, dz) || 1;
  let side = [-dz / len, dx / len];
  if (side[0] * away[0] + side[1] * away[2] < 0) side = [-side[0], -side[1]];
  const allowed = Math.min(GLIDE.nearest, dist3(a, head), dist3(b, head));
  let best = null;
  for (const k of [1, 0.6, 0.3, 0]) {
    const ctrl = [
      (a[0] + b[0]) / 2 + side[0] * GLIDE.side * k,
      (a[1] + b[1]) / 2 - GLIDE.drop,
      (a[2] + b[2]) / 2 + side[1] * GLIDE.side * k
    ];
    let nearest = Infinity;
    for (let i = 0; i <= 40; i++) nearest = Math.min(nearest, dist3(curvePoint(a, ctrl, b, i / 40), head));
    if (!best || nearest > best.nearest) best = { ctrl, nearest };
    if (nearest >= allowed - 1e-9) { best = { ctrl, nearest }; break; }
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

// Slow start, slow stop.
export function easeInOut(f) {
  return f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f);
}
