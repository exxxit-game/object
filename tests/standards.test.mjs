// The scenes are built to the trade standards in docs/building-standards.md: this test reads
// the scene markup and fails when a door, its hardware, the base or the switch drifts from
// them (an invented size shows up here before the owner sees it in the headset).
import assert from 'node:assert/strict';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML } from '../src/app/lobby/scene.js';
import { DOORS } from '../src/app/lobby/plan.js';

const html = sceneHTML + corridorHTML;
const near = (a, b, e = 0.0015) => Math.abs(a - b) < e;
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m && m[1]; };
const prop = (value, name) => { const m = value && value.match(new RegExp(`${name}:\\s*([-\\d.]+)`)); return m && Number(m[1]); };
const pos = (tag) => attr(tag, 'position').split(' ').map(Number);
const tags = (kind) => [...html.matchAll(new RegExp(`<${kind}[^>]*>`, 'g'))].map(m => m[0]);

// Door leaves: 3'0" × 7'0" (0.914 × 2.134 m)
const leaves = [...tags('a-entity')].filter(t => /color: #6a5641/.test(attr(t, 'rounded-box') || ''));
assert.equal(leaves.length, DOORS.length, 'every door of the corridor plan');
for (const t of leaves) {
  const rb = attr(t, 'rounded-box');
  assert.ok(near(prop(rb, 'width'), 0.914) && near(prop(rb, 'height'), 2.134), `door leaf ${rb}`);
}
// Every door set in its wall the same way (src/engine/door.js): leaves at one depth, frames
// through the whole wall
assert.equal(new Set(leaves.map(t => Math.abs(pos(t)[2]))).size, 1, 'door leaves at different depths in their walls');
const jambs = tags('a-box').filter(t => attr(t, 'height') === '2.2042');
assert.ok(jambs.length === DOORS.length * 2 && jambs.every(t => attr(t, 'depth') === '0.22' && (near(pos(t)[2], 1.7) || near(pos(t)[2], 3.7))), 'every frame through the wall');
// Round knobs as in 1979, at 1.024 m (strike centreline), 2 3/4 in (70 mm) from the latch edge;
// one on the corridor side of every door, one inside the room that opens
const knobs = tags('a-entity').filter(t => /class="knob"/.test(t));
assert.equal(knobs.length, DOORS.length + 1, 'a knob on each door, and inside room 1');
assert.ok(knobs.every(t => near(pos(t)[1], 1.024) && near(Math.abs(pos(t)[0]), 0.914 - 0.07)), 'knobs at 1.024 m, 70 mm from the latch edge');
assert.ok(!tags('a-cylinder').some(t => attr(t, 'radius') === '0.028'), 'no lever roses left');
// kick plates 10 × 34 in on every door
const kicks = tags('a-box').filter(t => attr(t, 'width') === '0.864');
assert.ok(kicks.length === DOORS.length && kicks.every(t => near(Number(attr(t, 'height')), 0.254)), 'kick plates 254 × 864 mm');
// Door 1: three hinges, top 248 mm below the frame head (2.1532 m), bottom top 264 mm above the floor
const door1 = sceneHTML.slice(sceneHTML.indexOf('id="door1"'), sceneHTML.indexOf('</a-entity>\n  <a-entity id="plaque"'));
const hinges = [...door1.matchAll(/<a-cylinder radius="0.007" height="0.114" position="[-\d.]+ ([\d.]+)/g)].map(m => Number(m[1])).sort((a, b) => b - a);
const top = 2.1532 - 0.248 - 0.057, bottom = 0.264 - 0.057;
assert.equal(hinges.length, 3, 'three hinges on door 1');
assert.ok(near(hinges[0], top) && near(hinges[2], bottom) && near(hinges[1], (top + bottom) / 2), `hinge centres ${hinges}`);
// Threshold at most 1/2 in high
const sills = tags('a-box').filter(t => attr(t, 'depth') === '0.127'); // the 5 in wide saddle
assert.ok(sills.length === DOORS.length && sills.every(t => Number(attr(t, 'height')) <= 0.013), 'a threshold at most 13 mm at every door');
// 4 in vinyl base everywhere
const bases = tags('a-box').filter(t => attr(t, 'color') === '#2b2d29');
assert.ok(bases.length >= 10 && bases.every(t => near(Number(attr(t, 'height')), 0.102)), 'base 102 mm high');
// Light switch within reach, 15–48 in (0.381–1.219 m) to centre; set inside one block course
// (docs/building-standards.md; the joints: tests/masonry.test.mjs)
const sw = tags('a-entity').find(t => /color: #d8d2c2/.test(attr(t, 'rounded-box') || ''));
assert.ok(sw && pos(sw)[1] >= 0.381 && pos(sw)[1] <= 1.219, 'switch within reach');
// Notices on the board: A4, 210 × 297 mm
const a4 = tags('a-entity').filter(t => /^note/.test(attr(t, 'id') || ''));
assert.ok(a4.length === 2 && a4.every(t => near(prop(attr(t, 'panel'), 'w'), 0.21) && near(prop(attr(t, 'panel'), 'h'), 0.297)), 'notices A4');
// Tackboard: a 44 mm aluminium trim round the cork
const board = tags('a-box').find(t => /metalness: .6/.test(attr(t, 'material') || '') && attr(t, 'class') === 'on-wall');
const cork = tags('a-plane').find(t => /kind: cork/.test(attr(t, 'surface') || ''));
assert.ok(near((Number(attr(board, 'width')) - Number(attr(cork, 'width'))) / 2, 0.044) && near((Number(attr(board, 'height')) - Number(attr(cork, 'height'))) / 2, 0.044), 'tackboard trim 44 mm');
// Troffers: 2 × 4 ft (0.6096 × 1.2192 m)
const troffers = tags('a-box').filter(t => attr(t, 'color') === '#dcdcd5');
assert.ok(troffers.length >= 2 && troffers.every(t => near(Number(attr(t, 'width')), 1.2192) && near(Number(attr(t, 'depth')), 0.6096)), 'troffers 2 × 4 ft');
// Fire extinguisher up to 40 lb: top at most 5 ft (1.524 m), bottom at least 4 in (102 mm)
const extAt = html.indexOf('class="extinguisher"');
const ext = html.slice(extAt, html.indexOf('\n    </a-entity>', extAt));
// each part's box in the world [min, max] per axis: boxes (turned a little about z at most),
// cylinders upright or laid along z, flattened spheres, hoses through their points
const bound = (t) => {
  const kind = t.match(/^<a-([a-z]+)/)[1];
  if (/cable="/.test(t)) {
    const r = prop(attr(t, 'cable'), 'radius');
    const pts = attr(t, 'cable').match(/points:\s*([^"]*)/)[1].split(',').map((p) => p.trim().split(/\s+/).map(Number));
    return [0, 1, 2].map((i) => [Math.min(...pts.map((p) => p[i])) - r, Math.max(...pts.map((p) => p[i])) + r]);
  }
  const [x, y, z] = pos(t);
  const rot = (attr(t, 'rotation') || '0 0 0').split(' ').map(Number);
  let half;
  if (kind === 'box') {
    const [w, h, d] = ['width', 'height', 'depth'].map((n) => Number(attr(t, n)));
    const a = rot[2] * Math.PI / 180;
    half = [(w * Math.abs(Math.cos(a)) + h * Math.abs(Math.sin(a))) / 2, (w * Math.abs(Math.sin(a)) + h * Math.abs(Math.cos(a))) / 2, d / 2];
  } else if (kind === 'cylinder') {
    const r = Number(attr(t, 'radius')), h = Number(attr(t, 'height'));
    half = rot[0] === 90 ? [r, r, h / 2] : [r, h / 2, r];
  } else if (kind === 'sphere') {
    const r = Number(attr(t, 'radius')), s = (attr(t, 'scale') || '1 1 1').split(' ').map(Number);
    half = [r * s[0], r * s[1], r * s[2]];
  }
  return [[x - half[0], x + half[0]], [y - half[1], y + half[1]], [z - half[2], z + half[2]]];
};
const parts = [...ext.matchAll(/<a-(box|cylinder|sphere|entity cable)[^>]*>/g)].map((m) => bound(m[0]));
assert.ok(parts.length > 5, 'an extinguisher in the corridor');
const extTop = Math.max(...parts.map((b) => b[1][1])), extBottom = Math.min(...parts.map((b) => b[1][0]));
assert.ok(extTop <= 1.524 && extBottom >= 0.102, `extinguisher from ${extBottom.toFixed(3)} to ${extTop.toFixed(3)} m`);
// nothing hangs in the air: every part touches the parts it is fixed to, all held by the wall hook
// (the first part, on the wall); 1 mm of play for rounding
const touch = (a, b) => [0, 1, 2].every((i) => a[i][0] <= b[i][1] + 0.001 && b[i][0] <= a[i][1] + 0.001);
const held = new Set([0]);
for (let grew = true; grew;) {
  grew = false;
  parts.forEach((b, i) => { if (!held.has(i) && [...held].some((j) => touch(b, parts[j]))) { held.add(i); grew = true; } });
}
assert.equal(held.size, parts.length, `extinguisher parts hanging in the air: ${parts.map((_, i) => i).filter((i) => !held.has(i)).join(', ')}`);
console.log(`standards tests: ok (${leaves.length} doors, ${bases.length} base runs, extinguisher ${extBottom.toFixed(2)}–${extTop.toFixed(2)} m)`);
