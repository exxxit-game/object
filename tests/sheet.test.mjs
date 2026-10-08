// The clipboard sheet appears where research puts comfortable reading: 1 m from the
// eyes, a little below them, straight ahead, facing the player (sources in docs/decisions.md).
import assert from 'node:assert/strict';
import { frontPose, readingPose, letterDeg, READ_DIST, DROP_DEG, GLIDE, glidePath, curvePoint, easeInOut } from '../src/engine/ui/sheet-math.js';
import { corridorHTML, WALLS } from '../src/app/lobby/scene.js';
import { BOUNDS, PLAN } from '../src/app/lobby/plan.js';

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const poses = [[[0, 1.2, 0.35], 0], [[0.6, 1.65, 2.9], 0], [[0.5, 1.1, 0], Math.PI / 2], [[1, 1.7, -1], -2.4]];
for (const [head, yaw] of poses) {
  const p = frontPose(head, yaw);
  assert.ok(near(dist(p.pos, head), READ_DIST), 'centre 1 m from the eyes');
  const down = Math.asin((head[1] - p.pos[1]) / READ_DIST) * 180 / Math.PI;
  assert.ok(near(down, DROP_DEG), 'a little below the eyes');
  // straight ahead in the player's yaw (three.js: yaw 0 looks along -Z)
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const flat = [p.pos[0] - head[0], p.pos[2] - head[2]];
  assert.ok(near(flat[0] * ahead[1] - flat[1] * ahead[0], 0), 'not to the side');
  assert.ok(flat[0] * ahead[0] + flat[1] * ahead[1] > 0, 'in front');
  // three.js rotation (order YXZ): the sheet's face (+Z) must point back at the eyes
  const n = [Math.sin(p.yaw) * Math.cos(p.pitch), -Math.sin(p.pitch), Math.cos(p.yaw) * Math.cos(p.pitch)];
  const toEyes = head.map((h, i) => (h - p.pos[i]) / READ_DIST);
  assert.ok(near(n[0], toEyes[0]) && near(n[1], toEyes[1]) && near(n[2], toEyes[2]), 'faces the eyes');
}
assert.ok(near(letterDeg(0.021, 1), 1.2, 0.01), '21 mm at 1 m is about 1.2 degrees');

// The clipboard's trip from its hook to the reading spot and back (docs/mistakes.md):
// slow enough, eased, swinging out from the wall and down, never nearer than
// GLIDE.nearest to the eyes, and the same arc back.
const home = [PLAN.board.x, 1.5, 1.855], away = [0, 0, 1], wall = { pos: home, away };
let trips = 0;
// from the arrival spot, across the corridor, and pressed against the board (people walk
// up to a thing they are told to take); the corridor keeps the eyes at z 2.1 or more
for (const head of [[0.7, 1.6, 3.05], [-1.0, 1.6, 2.9], [2.5, 1.2, 3.3], [-3.0, 1.75, 2.2], [-1.0, 1.6, 2.1], [-0.6, 1.3, 2.3]]) {
  const look = [home[0] - head[0], home[2] - head[2]];
  const p = readingPose(head, Math.atan2(-look[0], -look[1]), wall);   // the player looks at the hook
  assert.ok(near(dist(p.pos, head), READ_DIST), 'read 1 m from the eyes');
  assert.ok(p.pos[2] - home[2] >= 0.15 - 1e-9, `the reading spot is behind the wall (z ${p.pos[2].toFixed(2)})`);
  for (const [a, b] of [[home, p.pos], [p.pos, home]]) {
    const { ctrl, ms } = glidePath(a, b, away, head);
    assert.ok(ms >= 1000 && ms <= GLIDE.maxMs && GLIDE.minMs >= 1000, `a trip takes ${ms} ms (at least 1 s)`);
    assert.ok(ctrl[2] >= Math.min(a[2], b[2]), 'the arc swings out from the wall, not into it');
    assert.ok(ctrl[1] < (a[1] + b[1]) / 2, 'the arc dips below the straight line');
    let nearest = Infinity;
    for (let i = 0; i <= 100; i++) nearest = Math.min(nearest, dist(curvePoint(a, ctrl, b, i / 100), head));
    const allowed = Math.min(0.5, dist(a, head), dist(b, head));   // never nearer the eyes than 0.5 m
    assert.ok(nearest >= allowed - 0.01, `the sheet comes within ${nearest.toFixed(2)} m of the eyes (allowed ${allowed.toFixed(2)})`);
    trips++;
  }
}
// Anywhere the player can stand in the corridor, facing anywhere, the sheet is read inside its
// walls: a question asked near the exit door must not land in the end wall (docs/mistakes.md).
// Facing door 1 from the arrival spot it stays straight ahead.
const SPACE = corridorHTML.match(/space: ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)/).slice(1).map(Number);
assert.deepEqual([(WALLS.minX + WALLS.maxX) / 2, (WALLS.minZ + WALLS.maxZ) / 2, WALLS.maxX - WALLS.minX, WALLS.maxZ - WALLS.minZ].map(v => +v.toFixed(3)), SPACE, 'WALLS is the corridor drawn by scene.js');
const HALF_W = 0.3;
let spots = 0;
for (let x = BOUNDS.minX; x <= BOUNDS.maxX + 1e-9; x += 0.29) {
  for (const z of [BOUNDS.minZ, (BOUNDS.minZ + BOUNDS.maxZ) / 2, BOUNDS.maxZ]) {
    for (let deg = 0; deg < 360; deg += 30) {
      const p = readingPose([x, 1.6, z], deg * Math.PI / 180, wall, WALLS, HALF_W);
      const rx = Math.cos(p.yaw) * HALF_W, rz = -Math.sin(p.yaw) * HALF_W;
      for (const [px, pz] of [[p.pos[0] + rx, p.pos[2] + rz], [p.pos[0] - rx, p.pos[2] - rz]]) {
        assert.ok(px >= WALLS.minX && px <= WALLS.maxX && pz >= WALLS.minZ && pz <= WALLS.maxZ,
          `head (${x.toFixed(2)}, ${z}) facing ${deg}°: the sheet's edge at (${px.toFixed(2)}, ${pz.toFixed(2)}) is in a wall`);
      }
      spots++;
    }
  }
}
assert.equal(readingPose([0.7, 1.6, 3.05], 0, wall, WALLS, HALF_W).yaw, 0, 'facing door 1: straight ahead');

assert.ok(easeInOut(0) === 0 && easeInOut(1) === 1 && near(easeInOut(0.5), 0.5), 'eases from start to end');
assert.ok(easeInOut(0.1) < 0.1 && easeInOut(0.9) > 0.9, 'slow start and slow stop');
console.log(`sheet tests: ok (${poses.length} poses, ${trips} trips, ${spots} corridor spots)`);
