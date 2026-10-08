// Pure math for surface.js: where the tile joints go on a surface, by the tile
// trade's rule (Ceramic Tile Education Foundation, "centered, balanced, no small
// cuts"): centre the field on the space, equal cuts on opposite sides, and either a
// joint or a tile centre on the centre line, whichever leaves the bigger end pieces
// (never less than half a tile). Lengths in metres.

const EPS = 1e-9;
// Size of the piece left between an edge and the first joint; a whole tile when the
// edge falls on a joint.
function piece(x, tile) {
  const r = ((x % tile) + tile) % tile;
  return r < EPS || r > tile - EPS ? tile : r;
}

// A coordinate where a joint lies, for a space with this centre and length.
export function jointOrigin(centre, length, tile) {
  const jointCentred = piece(length / 2, tile);
  const tileCentred = piece(length / 2 - tile / 2, tile);
  return tileCentred > jointCentred + EPS ? centre + tile / 2 : centre;
}

// The cut tile at an edge of the field: dir +1 for the low edge, -1 for the high one.
export function endCut(edge, origin, tile, dir) {
  return piece(dir * (origin - edge), tile);
}

// Running bond (blocks): every other course is shifted by half a unit, so the rule is
// the mason's: in BOTH courses no end piece under half a unit (walls are laid out in
// half units). Among such layouts the most symmetric wins, then the one whose bottom
// course (drawn first, at the floor) keeps the bigger end pieces.
export function bondOrigin(centre, length, unit) {
  const lo = centre - length / 2, hi = centre + length / 2;
  const ends = (o) => [endCut(lo, o, unit, 1), endCut(hi, o, unit, -1)];
  let best = null;
  for (let k = 0; k < 40; k++) {
    const o = lo + unit * k / 40;
    const even = ends(o), odd = ends(o + unit / 2);
    const score = [Math.min(...even, ...odd), -(Math.abs(even[0] - even[1]) + Math.abs(odd[0] - odd[1])), Math.min(...even)];
    const wins = !best || score.some((v, i) => score.slice(0, i).every((w, j) => Math.abs(w - best.score[j]) < EPS) && v > best.score[i] + EPS);
    if (wins) best = { o, score };
  }
  return best.o;
}
