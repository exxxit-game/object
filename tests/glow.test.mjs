// Any light that changes in the game stays under the flash rule for photosensitive
// players (WCAG 2.3.1, Three Flashes or Below Threshold): no more than three flashes in
// any one-second period. A flash is a pair of opposing changes of 10% or more where the
// darker level is below 0.80. In a headset the light can fill much of the view, so the
// small-area exception is not used (Jordan & Vanderheiden 2024).
import assert from 'node:assert/strict';
import { SIGN_START } from '../src/app/lobby/sign.js';

function maxFlashesPerSecond(keys) {
  const changes = [];
  for (let i = 1; i < keys.length; i++) {
    const [t, to] = keys[i], from = keys[i - 1][1];
    if (Math.abs(to - from) >= 0.1 && Math.min(to, from) < 0.8) changes.push(t);
  }
  let worst = 0;
  for (const start of changes) {
    const inWindow = changes.filter(t => t >= start && t < start + 1).length;
    worst = Math.max(worst, Math.floor(inWindow / 2));
  }
  return worst;
}

for (const [name, keys] of [['sign start', SIGN_START]]) {
  assert.ok(keys.every(([t], i) => i === 0 || t > keys[i - 1][0]), `${name}: times must rise`);
  const f = maxFlashesPerSecond(keys);
  assert.ok(f <= 3, `${name}: ${f} flashes in one second (at most 3)`);
}
// the counter itself: four quick on-off flashes in a second must fail
assert.equal(maxFlashesPerSecond([[0, 0], [0.1, 1], [0.2, 0], [0.3, 1], [0.4, 0], [0.5, 1], [0.6, 0], [0.7, 1], [0.8, 0]]), 4);
console.log('glow tests: ok');
