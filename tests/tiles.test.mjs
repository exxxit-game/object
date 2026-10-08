// Tile layout follows the trade rule (Ceramic Tile Education Foundation; UFGS 09 65 00):
// centre and balance the field, equal cuts on opposite sides, no edge tile under half a tile.
import assert from 'node:assert/strict';
import { jointOrigin, endCut, bondOrigin } from '../src/engine/tile-math.js';

const near = (a, b) => Math.abs(a - b) < 1e-9;
const FLOOR = 0.3048, CEILING = 0.6096; // 12 in tiles, 24 in grid (docs/building-standards.md)
const cases = [
  // centre, length, tile: every surface of the room and the corridor
  [0, 3.2, FLOOR], [0, 3.2, CEILING],                  // room 01
  [-0.2, 6.4, FLOOR], [-0.2, 6.4, CEILING],            // corridor, along
  [2.7, 1.8, FLOOR], [2.7, 1.8, CEILING],              // corridor, across
  [1.0, 2.7, 0.3], [-4, 5.0, 0.6]
];
for (const [centre, length, tile] of cases) {
  const o = jointOrigin(centre, length, tile);
  const lo = endCut(centre - length / 2, o, tile, +1);
  const hi = endCut(centre + length / 2, o, tile, -1);
  assert.ok(near(lo, hi), `unequal cuts ${lo} / ${hi} for ${centre}, ${length}, ${tile}`);
  assert.ok(lo >= tile / 2 - 1e-9, `cut under half a tile (${lo}) for ${centre}, ${length}, ${tile}`);
}

// Blocks in running bond: both courses keep every end piece at half a block or more.
// Possible only when a wall is a whole number of half blocks, which is why masons lay
// walls out in half units: every wall of the room and the corridor is.
const walls = [[0, 3.2], [-0.2, 6.4], [2.7, 1.8], [-0.3, 1.2], [1, 2.6]];
for (const [, length] of walls) assert.ok(near(Math.round(length / 0.2) * 0.2, length), `${length} m is not whole half blocks`);
for (const [centre, length] of walls) {
  const b = 0.4, o = bondOrigin(centre, length, b);
  for (const shift of [0, b / 2]) {
    const lo = endCut(centre - length / 2, o + shift, b, +1), hi = endCut(centre + length / 2, o + shift, b, -1);
    assert.ok(lo >= b / 2 - 1e-9 && hi >= b / 2 - 1e-9, `block piece under half (${lo}, ${hi}) on a ${length} m wall`);
  }
}
// the room's walls keep whole blocks at the floor course
assert.ok(near(((bondOrigin(0, 3.2, 0.4) % 0.4) + 0.4) % 0.4, 0));
console.log(`tiles tests: ok (${cases.length} surfaces, ${walls.length} walls)`);
