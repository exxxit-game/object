// Turns the event log of one run into a report. Pure: no DOM, no texts.
// Event kinds: 'pull' (v = lever index), 'point', 'look', 'reach', 'answer' (v = choice), 'round' (v = round number).

const LEVERS = 3;
// A point counts as "idle" when no pull happened in the 3 s before it.
const IDLE_WINDOW = 3;
// The "system" is the last pulls (up to 3) within 4 s before a point.
const SYSTEM_WINDOW = 4;

export function analyse(log) {
  const pulls = log.filter(e => e.k === 'pull');
  const pts = log.filter(e => e.k === 'point');

  const per = Array(LEVERS).fill(0);
  pulls.forEach(p => per[p.v]++);

  let idle = 0;
  const seqs = new Map();
  for (const p of pts) {
    const before = pulls.filter(e => e.t < p.t && e.t > p.t - SYSTEM_WINDOW);
    if (!pulls.some(e => e.t < p.t && e.t > p.t - IDLE_WINDOW)) idle++;
    if (before.length) {
      const seq = before.slice(-3).map(e => e.v).join(',');
      seqs.set(seq, (seqs.get(seq) || 0) + 1);
    }
  }

  const top = [...seqs.entries()].sort((a, b) => b[1] - a[1])[0];
  const best = top ? { seq: top[0].split(',').map(Number), count: top[1] } : null;

  return {
    pulls: pulls.length,
    per,
    pts: pts.length,
    idle,
    best,
    looks: log.filter(e => e.k === 'look').length,
    reaches: log.filter(e => e.k === 'reach').length,
    dur: pts.length ? Math.round(pts[pts.length - 1].t) : 0
  };
}

// Non-overlapping occurrences of `pattern` as consecutive items in `seq`.
function countRepeats(seq, pattern) {
  let n = 0;
  for (let i = 0; i + pattern.length <= seq.length;) {
    if (pattern.every((v, j) => seq[i + j] === v)) { n++; i += pattern.length; } else i++;
  }
  return n;
}

// A session: round 1, the question ('answer', v = choice index), round 2 starting
// at the 'round' event with v = 2. An 'end' event (v = round) closes a round.
// `repeats` = how often round 2 contains the round-1 "system" pull sequence.
export function analyseSession(log) {
  const split = log.find(e => e.k === 'round' && e.v === 2);
  const t2 = split ? split.t : Infinity;
  // pulls during the question and the pause before round 2 belong to neither round
  const end1 = log.find(e => e.k === 'end' && e.v === 1);
  const t1End = end1 ? end1.t : t2;
  const r1 = analyse(log.filter(e => e.t < t1End));
  const r2 = split ? analyse(log.filter(e => e.t >= t2)) : null;
  const answer = log.filter(e => e.k === 'answer').pop();
  const round2Pulls = log.filter(e => e.k === 'pull' && e.t >= t2).map(e => e.v);
  return {
    r1,
    r2,
    answer: answer ? answer.v : null,
    repeats: r1.best && r2 ? countRepeats(round2Pulls, r1.best.seq) : 0,
    looks: log.filter(e => e.k === 'look').length,
    reaches: log.filter(e => e.k === 'reach').length
  };
}
