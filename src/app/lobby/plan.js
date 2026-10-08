// The lab's first floor to its end, the one source of every place in the corridor (the scene, the
// tests and the walking area read it; docs/art/corridor-plan.svg, plan B). One straight corridor
// 1.8 m wide; the stairs the player came up are in the middle of its south wall, room 101 (door 1)
// faces them; a room every 3.2 m (a bay: the width of room 01) along both walls, so every door has
// the same wall around it. Rooms are numbered from the entrance (university room numbering:
// Northwestern, Georgia Tech, Smithsonian guidelines), and every plaque hangs at its door's latch
// side, the side toward the entrance (a sign beside the latch: ADA 1991 4.30.6; its size and
// distance from the frame: brand.js). Floors above hold more rooms. Pure: no A-Frame, so tests read it in node.
export const PLAN = {
  from: -6.6, to: 8.0,          // the end walls' faces (x), a whole number of 0.2 m blocks
  north: 1.8, south: 3.6,       // the long walls' corridor faces (z); each wall 0.2 m thick
  thick: 0.2,
  bay: 3.2,
  entrance: 0.7,                // the stairs (south) and room 101 (north) face each other here
  opening: 1.0,                 // a masonry opening, door 3'0" in its 2 in frame
  bays: [-2, -1, 0, 1, 2],      // bay index along the corridor, 0 at the entrance
  floor: 1,                     // the hundreds of every room number on this floor
  // the experimenter's board left of room 101 (its edges on the block joints), and the
  // extinguisher opposite it
  board: { x: -0.8, y: 1.5, w: 1.6, h: 1.0 },
  extinguisher: -0.8
};

const round = (v) => Math.round(v * 1e4) / 1e4;
// the doors: north wall rooms in every bay; south wall rooms, with the stairs in the middle bay
const doors = [
  ...PLAN.bays.map((k) => ({ x: round(PLAN.entrance + k * PLAN.bay), k, wall: 'north', kind: k === 0 ? 'room1' : 'soon' })),
  ...PLAN.bays.map((k) => ({ x: round(PLAN.entrance + k * PLAN.bay), k, wall: 'south', kind: k === 0 ? 'stairs' : 'soon' }))
];
// Room numbers as on the plan drawing: 101 faces the stairs; from there odd numbers run to the
// left (west) and even ones to the right (east) of a player facing it, the north wall first,
// then the south, each away from the entrance. A plaque shows only its number until the room
// is done (brand.js).
const side = (sign) => doors.filter((d) => d.kind !== 'stairs' && Math.sign(d.k) === sign)
  .sort((a, b) => (a.wall === b.wall ? Math.abs(a.k) - Math.abs(b.k) : a.wall === 'north' ? -1 : 1));
const number = new Map([[doors.find((d) => d.kind === 'room1'), 1]]);
side(-1).forEach((d, i) => number.set(d, 3 + 2 * i));
side(1).forEach((d, i) => number.set(d, 2 + 2 * i));
export const DOORS = doors.map((d) => {
  const { k, ...door } = d;
  return number.has(d) ? { ...door, number: String(PLAN.floor * 100 + number.get(d)) } : door;
});
// the number of the door whose room is built: the room writes it on its own side of the wall too
export const ROOM1_NUMBER = DOORS.find((d) => d.kind === 'room1').number;

// along x, the way a door's plaque hangs from it: toward the entrance (east for the middle doors)
export const toEntrance = (x) => (x < PLAN.entrance - 1e-6 ? 1 : x > PLAN.entrance + 1e-6 ? -1 : 1);
// a plaque's centre: half the opening, the frame's 11 mm beyond it, then the sign's distance
// from the frame (brand.js)
export const plaqueX = (x, fromFrame) => round(x + toEntrance(x) * (PLAN.opening / 2 + 0.0112 + fromFrame));

// the corridor's wall faces (for what must stay inside them) and its floor space for the grids
export const WALLS = { minX: PLAN.from, maxX: PLAN.to, minZ: PLAN.north, maxZ: PLAN.south };
export const CENTRE = { x: round((PLAN.from + PLAN.to) / 2), z: round((PLAN.north + PLAN.south) / 2) };
export const LENGTH = round(PLAN.to - PLAN.from);
export const WIDTH = round(PLAN.south - PLAN.north);
// where the head may go: 0.3 m from the long walls and ends, 0.25 m from the stairs' wall
export const BOUNDS = { minX: round(PLAN.from + 0.3), maxX: round(PLAN.to - 0.3), minZ: round(PLAN.north + 0.3), maxZ: round(PLAN.south - 0.25) };

// the pieces of a long wall between its openings, [from, to] along x
export function wallRuns(wall) {
  const cuts = DOORS.filter((d) => d.wall === wall).map((d) => [d.x - PLAN.opening / 2, d.x + PLAN.opening / 2]).sort((a, b) => a[0] - b[0]);
  const runs = [];
  let at = PLAN.from;
  for (const [a, b] of cuts) { runs.push([round(at), round(a)]); at = b; }
  runs.push([round(at), PLAN.to]);
  return runs.filter(([a, b]) => b - a > 1e-6);
}
