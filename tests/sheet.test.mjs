// The clipboard sheet appears where research puts comfortable reading: 1 m from the
// eyes, a little below them, straight ahead, facing the player (sources in docs/decisions.md).
import assert from 'node:assert/strict';
import { frontPose, letterDeg, READ_DIST, DROP_DEG } from '../src/engine/ui/sheet-math.js';

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
console.log(`sheet tests: ok (${poses.length} poses)`);
