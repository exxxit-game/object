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

// ---- two-round session ----
import { analyseSession } from '../src/rooms/01-ono/report.js';
{
  const log = [
    // round 1: system red -> green -> blue before two points
    pull(1, 0), pull(1.5, 1), pull(2, 2), point(2.5),
    pull(5, 0), pull(5.5, 1), pull(6, 2), point(6.5),
    point(12),
    { t: 13, k: 'answer', v: 0 },
    { t: 14, k: 'round', v: 2 },
    // round 2: the same system twice, plus a stray pull
    pull(15, 0), pull(15.4, 1), pull(15.8, 2), point(16),
    pull(18, 1),
    pull(19, 0), pull(19.4, 1), pull(19.8, 2), point(20),
    { t: 21, k: 'look' }, { t: 22, k: 'reach' }
  ];
  const s = analyseSession(log);
  assert.equal(s.r1.pulls, 6);
  assert.equal(s.r1.pts, 3);
  assert.deepEqual(s.r1.best, { seq: [0, 1, 2], count: 2 });
  assert.equal(s.r2.pulls, 7);
  assert.equal(s.r2.pts, 2);
  assert.equal(s.answer, 0);
  assert.equal(s.repeats, 2);
  assert.equal(s.looks, 1);
  assert.equal(s.reaches, 1);
}
// a single round (no round marker) still analyses; nothing to repeat
{
  const s = analyseSession([pull(1, 2), point(2)]);
  assert.equal(s.r2, null);
  assert.equal(s.repeats, 0);
  assert.equal(s.answer, null);
}
console.log('session tests: ok');

// pulls between the end of round 1 and the start of round 2 count in neither round
{
  const s = analyseSession([
    pull(1, 0), point(2),
    { t: 10, k: 'end', v: 1 },
    pull(11, 1), pull(12, 2), { t: 13, k: 'answer', v: 3 },
    { t: 15, k: 'round', v: 2 },
    pull(16, 0), point(17)
  ]);
  assert.equal(s.r1.pulls, 1);
  assert.equal(s.r2.pulls, 1);
  assert.equal(s.answer, 3);
}
console.log('round split tests: ok');
