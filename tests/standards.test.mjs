// The scenes are built to the trade standards in docs/building-standards.md: this test reads
// the scene markup and fails when a door, its hardware, the base or the switch drifts from
// them (an invented size shows up here before the owner sees it in the headset).
import assert from 'node:assert/strict';
import { sceneHTML } from '../src/rooms/01-control/scene.js';
import { corridorHTML } from '../src/app/lobby/scene.js';

const html = sceneHTML + corridorHTML;
const near = (a, b, e = 0.0015) => Math.abs(a - b) < e;
const attr = (tag, name) => { const m = tag.match(new RegExp(`${name}="([^"]*)"`)); return m && m[1]; };
const prop = (value, name) => { const m = value && value.match(new RegExp(`${name}:\\s*([-\\d.]+)`)); return m && Number(m[1]); };
const pos = (tag) => attr(tag, 'position').split(' ').map(Number);
const tags = (kind) => [...html.matchAll(new RegExp(`<${kind}[^>]*>`, 'g'))].map(m => m[0]);

// Door leaves: 3'0" × 7'0" (0.914 × 2.134 m)
const leaves = [...tags('a-entity')].filter(t => /color: #6a5641/.test(attr(t, 'rounded-box') || ''));
assert.equal(leaves.length, 3, 'three doors in the corridor');
for (const t of leaves) {
  const rb = attr(t, 'rounded-box');
  assert.ok(near(prop(rb, 'width'), 0.914) && near(prop(rb, 'height'), 2.134), `door leaf ${rb}`);
}
// Levers at 1.024 m (strike centreline), kick plates 10 × 34 in on every door
const levers = tags('a-cylinder').filter(t => attr(t, 'radius') === '0.028');
assert.ok(levers.length >= 4 && levers.every(t => near(pos(t)[1], 1.024)), 'levers at 1.024 m');
const kicks = tags('a-box').filter(t => attr(t, 'width') === '0.864');
assert.ok(kicks.length === 3 && kicks.every(t => near(Number(attr(t, 'height')), 0.254)), 'kick plates 254 × 864 mm');
// Door 1: three hinges, top 248 mm below the frame head (2.1532 m), bottom top 264 mm above the floor
const door1 = sceneHTML.slice(sceneHTML.indexOf('id="door1"'), sceneHTML.indexOf('</a-entity>\n  <a-entity id="plaque"'));
const hinges = [...door1.matchAll(/<a-cylinder radius="0.007" height="0.114" position="[-\d.]+ ([\d.]+)/g)].map(m => Number(m[1])).sort((a, b) => b - a);
const top = 2.1532 - 0.248 - 0.057, bottom = 0.264 - 0.057;
assert.equal(hinges.length, 3, 'three hinges on door 1');
assert.ok(near(hinges[0], top) && near(hinges[2], bottom) && near(hinges[1], (top + bottom) / 2), `hinge centres ${hinges}`);
// Threshold at most 1/2 in high
const sills = tags('a-box').filter(t => attr(t, 'depth') === '0.127'); // the 5 in wide saddle
assert.ok(sills.length === 1 && Number(attr(sills[0], 'height')) <= 0.013, 'threshold at most 13 mm');
// 4 in vinyl base everywhere
const bases = tags('a-box').filter(t => attr(t, 'color') === '#2b2d29');
assert.ok(bases.length >= 10 && bases.every(t => near(Number(attr(t, 'height')), 0.102)), 'base 102 mm high');
// Light switch at 42 in (1.067 m) to centre
const sw = tags('a-entity').find(t => /color: #d8d2c2/.test(attr(t, 'rounded-box') || ''));
assert.ok(sw && near(pos(sw)[1], 1.067), 'switch at 1.067 m');
console.log(`standards tests: ok (${leaves.length} doors, ${bases.length} base runs)`);
