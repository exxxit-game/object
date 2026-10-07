// Ono schedules exactly as in the paper, and the signal light sequence.
import assert from 'node:assert/strict';
import { pointTimes, pickCondition, CONDITIONS, POINT_PHASE_SECS } from '../src/rooms/01-ono/schedule.js';
import { signalSequence, SIGNAL_COLORS } from '../src/rooms/01-ono/signal.js';

// deterministic random for tests
function seeded(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); }

// FT: exact counts, as Ono's 60 / 30 points
assert.equal(pointTimes('FT30').length, 60);
assert.equal(pointTimes('FT60').length, 30);
assert.equal(pointTimes('FT30')[0], 30);

// VT: all points inside the point phase, intervals from Ono's ranges, mean close to nominal
for (const [cond, lo, hi, mean] of [['VT30', 3, 57, 30], ['VT60', 25, 95, 60]]) {
  for (let seed = 1; seed <= 20; seed++) {
    const t = pointTimes(cond, seeded(seed));
    assert.ok(t.every(x => x > 0 && x <= POINT_PHASE_SECS), `${cond} outside phase`);
    const gaps = t.map((x, i) => Math.round((x - (i ? t[i - 1] : 0)) * 10) / 10);
    assert.ok(gaps.every(g => g >= lo - 1e-9 && g <= hi + 1e-9), `${cond} gap out of range`);
    const avg = t[t.length - 1] / t.length;
    assert.ok(Math.abs(avg - mean) < mean * 0.15, `${cond} mean ${avg}`);
    assert.ok(Math.abs(t.length - 1800 / mean) <= 4, `${cond} gave ${t.length} points`);
  }
}

// random assignment covers all four conditions
const seen = new Set();
const r = seeded(7);
for (let i = 0; i < 200; i++) seen.add(pickCondition(r));
assert.deepEqual([...seen].sort(), [...CONDITIONS].sort());

// signal: covers the whole session, each colour 6–8 times, equal total time, never twice in a row
for (let seed = 1; seed <= 50; seed++) {
  const seq = signalSequence(2400, seeded(seed));
  assert.equal(seq[0].from, 0);
  assert.equal(seq[seq.length - 1].to, 2400);
  for (let i = 1; i < seq.length; i++) {
    assert.ok(Math.abs(seq[i].from - seq[i - 1].to) < 1e-6, 'gap in sequence');
    assert.notEqual(seq[i].color, seq[i - 1].color, 'same colour twice in a row');
  }
  for (const c of SIGNAL_COLORS) {
    const parts = seq.filter(s => s.color === c);
    const total = parts.reduce((sum, s) => sum + (s.to - s.from), 0);
    assert.ok(parts.length >= 6 && parts.length <= 8, `${c} lit ${parts.length} times`);
    assert.ok(Math.abs(total - 800) < 0.5, `${c} total ${total}`);
  }
}
console.log('schedule and signal tests: ok');
