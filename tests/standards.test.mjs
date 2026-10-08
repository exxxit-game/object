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
assert.equal(leaves.length, 3, 'three doors in the corridor: door 1 and two to come');
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
assert.ok(troffers.length === 2 && troffers.every(t => near(Number(attr(t, 'width')), 1.2192) && near(Number(attr(t, 'depth')), 0.6096)), 'troffers 2 × 4 ft');
// Fire extinguisher up to 40 lb: top at most 5 ft (1.524 m), bottom at least 4 in (102 mm)
const ext = html.slice(html.indexOf('class="extinguisher"'), html.indexOf('</a-entity>', html.indexOf('class="extinguisher"')));
const spans = [...ext.matchAll(/<a-(box|cylinder|sphere)[^>]*>/g)].map(([t, kind]) => {
  const y = pos(t)[1];
  const half = kind === 'sphere' ? Number(attr(t, 'radius')) * Number((attr(t, 'scale') || '1 1 1').split(' ')[1]) : Number(attr(t, 'height')) / 2;
  return [y - half, y + half];
});
assert.ok(spans.length > 5, 'an extinguisher in the corridor');
const extTop = Math.max(...spans.map(s => s[1])), extBottom = Math.min(...spans.map(s => s[0]));
assert.ok(extTop <= 1.524 && extBottom >= 0.102, `extinguisher from ${extBottom.toFixed(3)} to ${extTop.toFixed(3)} m`);
console.log(`standards tests: ok (${leaves.length} doors, ${bases.length} base runs, extinguisher ${extBottom.toFixed(2)}–${extTop.toFixed(2)} m)`);
