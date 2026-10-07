// Pure tests of the room 01 report (Ono session). Fast, no browser.
import assert from 'node:assert/strict';
import { analyseOno } from '../src/rooms/01-ono/report.js';
import { plural } from '../src/rooms/01-ono/texts.ru.js';

const pull = (t, v) => ({ t, k: 'pull', v });
const point = (t) => ({ t, k: 'point' });
const signal = (t, v) => ({ t, k: 'signal', v });
const end = (t) => ({ t, k: 'end' });

// empty session
{
  const r = analyseOno([]);
  assert.equal(r.pulls, 0);
  assert.equal(r.pts, 0);
  assert.equal(r.pcr, 0);
  assert.equal(r.best, null);
  assert.equal(r.extinction, 0);
  assert.equal(r.answer, null);
  assert.equal(r.knew, null);
}

// counts, idle points, Ono's contiguity (point within 1 s after a pull)
{
  const r = analyseOno([pull(1, 0), point(1.5), pull(4, 2), point(9), point(20), end(30)]);
  assert.deepEqual(r.per, [1, 0, 1]);
  assert.equal(r.pts, 3);
  assert.equal(r.idle, 2);          // 9 s and 20 s: no pull in the 3 s before
  assert.equal(r.pcr, 33);          // only the point at 1.5 s is contiguous
}

// the "system": last 3 pulls within 4 s before a point; the most frequent wins
{
  const r = analyseOno([pull(1, 0), pull(1.5, 1), pull(2, 2), point(3), pull(5, 0), pull(5.5, 1), pull(6, 2), point(7)]);
  assert.deepEqual(r.best, { seq: [0, 1, 2], count: 2 });
}

// pulls after the point phase ended are extinction pulls, not phase pulls
{
  const r = analyseOno([pull(1, 0), point(2), end(10), pull(11, 1), pull(12, 1), { t: 13, k: 'answer', v: 2 }, { t: 14, k: 'knew', v: 0 }]);
  assert.equal(r.pulls, 1);
  assert.equal(r.extinction, 2);
  assert.equal(r.answer, 2);
  assert.equal(r.knew, 0);
}

// sensory superstition: a favourite lever per colour, only with enough pulls and a clear share
{
  const log = [signal(0, 0)];
  for (let i = 0; i < 6; i++) log.push(pull(1 + i * 0.1, 0));      // red: left lever ×6
  log.push(signal(5, 2));
  for (let i = 0; i < 5; i++) log.push(pull(6 + i * 0.1, 1));      // green: middle ×5
  log.push(pull(6.9, 2));
  log.push(signal(10, 1));
  log.push(pull(11, 2), pull(11.2, 0));                             // orange: too few pulls
  const r = analyseOno(log);
  assert.deepEqual(r.sensory.favourite[0], { lever: 0, share: 100 });
  assert.deepEqual(r.sensory.favourite[2], { lever: 1, share: 83 });
  assert.equal(r.sensory.favourite[1], null);
  assert.deepEqual(r.sensory.table[2], [0, 5, 1]);
}

// Russian plural forms
assert.equal(plural(1, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(2, 'раз', 'раза', 'раз'), 'раза');
assert.equal(plural(5, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(11, 'раз', 'раза', 'раз'), 'раз');
assert.equal(plural(22, 'раз', 'раза', 'раз'), 'раза');

console.log('report tests: ok');
