// Pure tests of room 01 analysis. Fast, no browser: safe to run on any laptop.
import assert from 'node:assert/strict';
import { analyse } from '../src/rooms/01-ono/report.js';
import { plural } from '../src/rooms/01-ono/texts.ru.js';

const pull = (t, v) => ({ t, k: 'pull', v });
const point = (t) => ({ t, k: 'point' });

// empty run
{
  const r = analyse([]);
  assert.deepEqual(r, { pulls: 0, per: [0, 0, 0], pts: 0, idle: 0, best: null, looks: 0, reaches: 0, dur: 0 });
}

// counts per lever, looks, reaches, duration
{
  const r = analyse([pull(1, 0), pull(2, 0), pull(3, 2), { t: 4, k: 'look' }, { t: 5, k: 'reach' }, point(10.4)]);
  assert.deepEqual(r.per, [2, 0, 1]);
  assert.equal(r.pulls, 3);
  assert.equal(r.looks, 1);
  assert.equal(r.reaches, 1);
  assert.equal(r.dur, 10);
}

// a point with no pull in the previous 3 s is idle
{
  const r = analyse([pull(1, 0), point(2), point(9)]);
  assert.equal(r.idle, 1);
}

// the "system" is the last 3 pulls within 4 s before a point
{
  const r = analyse([pull(1, 0), pull(1.5, 1), pull(2, 2), pull(2.5, 1), point(3)]);
  assert.deepEqual(r.best, { seq: [1, 2, 1], count: 1 });
}

// the most frequent system wins
{
  const r = analyse([pull(1, 0), point(2), pull(5, 1), point(6), pull(9, 1), point(10)]);
  assert.deepEqual(r.best, { seq: [1], count: 2 });
}

// ties keep the first system seen
{
  const r = analyse([pull(1, 2), point(2), pull(5, 0), point(6)]);
  assert.deepEqual(r.best, { seq: [2], count: 1 });
}

// Russian plural forms
assert.equal(plural(1, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(2, 'раз', 'раза', 'раз'), 'раза');
assert.equal(plural(5, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(11, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(21, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(22, 'раз', 'раза', 'раз'), 'раза');

console.log('report tests: ok');
