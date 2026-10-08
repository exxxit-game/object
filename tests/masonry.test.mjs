// Block walls are laid out on their module (NCMA TEK 05-12, Modular Layout of Concrete Masonry):
// door openings start and end on it, so no block beside a door is cut into a sliver. Our blocks
// are 0.4 × 0.2 m in running bond, the module 0.2 m. The same holds for the flat things fixed to a
// wall (class "on-wall": the board, the sign box, the switch) that no standard places: each edge
// lies on a joint, or at least MIN_GAP from every joint, because a joint a few millimetres from an
// edge reads as a cut stub (MIN_GAP is our choice). Door signs (class "door-sign") hang where the
// sign standard puts them (src/app/brand.js), and the joints fall where they fall, as on a real
// block wall.
import assert from 'node:assert/strict';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML } from '../src/app/lobby/scene.js';
import { bondOrigin, courseShifted } from '../src/engine/tile-math.js';
import { PLAN, DOORS, CENTRE, LENGTH, WIDTH } from '../src/app/lobby/plan.js';
import { SIGN } from '../src/app/brand.js';

const BLOCK = 0.4, COURSE = 0.2, MODULE = 0.2, MIN_GAP = 0.04, EPS = 0.002;
// the walls things sit on, by the z of their face: the corridor's long walls (from its plan) and
// room 01's back wall, each with the joint origin its surface uses (surface.js, space of the
// corridor / the room), and how many door frames stand in it
const WALLS = [
  { name: 'corridor north wall', z: [1.79, 1.95], x: [PLAN.from, PLAN.to], origin: bondOrigin(CENTRE.x, LENGTH, BLOCK), doors: DOORS.filter(d => d.wall === 'north').length },
  { name: 'room back wall', z: [1.55, 1.79], x: [-1.6, 1.6], origin: bondOrigin(0, 3.2, BLOCK), doors: 1 },
  { name: 'corridor south wall', z: [3.5, 3.85], x: [PLAN.from, PLAN.to], origin: bondOrigin(CENTRE.x, LENGTH, BLOCK), doors: DOORS.filter(d => d.wall === 'south').length }
];
// the corridor's end walls, for anything fixed to them: they run along z, their joints laid out
// across the corridor's depth
const END = { name: 'corridor end wall', origin: bondOrigin(CENTRE.z, WIDTH, BLOCK) };
const wallAt = (z) => WALLS.find(w => z >= w.z[0] && z < w.z[1]);
const offGrid = (v, origin, step) => { const r = (((v - origin) % step) + step) % step; return Math.min(r, step - r); };
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`)); return m && m[1]; };
const prop = (value, name) => { const m = value && value.match(new RegExp(`${name}:\\s*([-\\d.]+)`)); return m && Number(m[1]); };
const html = sceneHTML + corridorHTML;

// door openings: a jamb of the 2 in frame stands 14.3 mm inside its opening's edge
const jambs = [...html.matchAll(/<a-box position="([-\d.]+) 1\.1021 ([\d.]+)" width="0\.051" height="2\.2042"/g)]
  .map(m => ({ x: Number(m[1]), z: Number(m[2]) }));
assert.equal(jambs.length, DOORS.length * 2, 'every door of the plan, two jambs each');
// the floor course is laid whole from the origin, the next one shifted (as surface.js draws)
assert.ok(!courseShifted(0) && courseShifted(1) && !courseShifted(2), 'running bond from a whole floor course');
for (const wall of WALLS) {
  // a frame goes through the whole wall (z 1.7 on the north): it counts for each wall it stands in
  const xs = jambs.filter(j => (wallAt(j.z) === wall || (j.z === 1.7 && wall.z[1] <= 1.95)) && j.x > wall.x[0] && j.x < wall.x[1]).map(j => j.x).sort((a, b) => a - b);
  assert.equal(xs.length, wall.doors * 2, `${wall.name}: its door frames`);
  for (let i = 0; i < xs.length; i += 2) {
    for (const edge of [xs[i] - 0.0143, xs[i + 1] + 0.0143]) {
      assert.ok(offGrid(edge, wall.origin, MODULE) < EPS, `${wall.name}: door opening edge at ${edge.toFixed(4)} is off the block module`);
    }
  }
}

// flat things on a wall: no joint closer than MIN_GAP to an edge, unless the edge is on it
const items = [...html.matchAll(/<a-[a-z]+[^>]*class="[^"]*\bon-wall\b[^"]*"[^>]*>/g)].map(m => m[0]);
assert.ok(items.length >= 5, `${items.length} things on walls`);
for (const tag of items.filter(t => !/\bdoor-sign\b/.test(attr(t, 'class')))) {
  const [x, y, z] = attr(tag, 'position').split(' ').map(Number);
  const panel = attr(tag, 'panel'), box = attr(tag, 'rounded-box');
  const w = panel ? prop(panel, 'w') : box ? prop(box, 'width') : Number(attr(tag, 'width'));
  const h = panel ? prop(panel, 'h') : box ? prop(box, 'height') : Number(attr(tag, 'height'));
  const wall = x <= PLAN.from + 0.05 || x >= PLAN.to - 0.05 ? END : wallAt(z);
  assert.ok(wall, `no wall at z ${z}`);
  const across = wall === END ? z : x;
  const name = `${(attr(tag, 'id') || tag.slice(0, 40))} on the ${wall.name}`;
  const clear = (d) => d < EPS || d >= MIN_GAP - 1e-9;
  for (const edge of [y - h / 2, y + h / 2]) {
    assert.ok(clear(offGrid(edge, 0, COURSE)), `${name}: a bed joint ${(offGrid(edge, 0, COURSE) * 1000).toFixed(0)} mm from its edge at ${edge.toFixed(3)} m`);
  }
  // the vertical joints of each course it covers, courses counted up from the floor
  for (let k = Math.floor((y - h / 2) / COURSE + EPS); k < Math.ceil((y + h / 2) / COURSE - EPS); k++) {
    const origin = wall.origin + (courseShifted(k) ? BLOCK / 2 : 0);
    for (const edge of [across - w / 2, across + w / 2]) {
      const d = offGrid(edge, origin, BLOCK);
      assert.ok(clear(d), `${name}: a joint ${(d * 1000).toFixed(0)} mm from its edge at ${edge.toFixed(3)} in course ${k}`);
    }
  }
}

// every door sign centred 60 in above the floor (LSU 1.3.1.2, ADA 1991 4.30.6), its text between
// 48 and 60 in (docs/building-standards.md, S1 703.4.1)
const signs = items.filter(t => /\bdoor-sign\b/.test(attr(t, 'class')));
assert.equal(signs.length, DOORS.length + 1, 'a sign at every corridor door and inside room 01');
for (const tag of signs) {
  const y = Number(attr(tag, 'position').split(' ')[1]);
  assert.ok(y === SIGN.y && y >= 1.22 && y <= 1.525, `${attr(tag, 'id') || attr(tag, 'data-number')} centre at ${y} m`);
}
console.log(`masonry tests: ok (${jambs.length / 2} doors, ${items.length} things on walls)`);
