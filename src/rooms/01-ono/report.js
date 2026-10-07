// Turns the event log of one session into a report. Pure: no DOM, no texts.
// Event kinds: 'pull' (v = lever index), 'point', 'signal' (v = colour index, at
// every colour change), 'reach', 'answer' (v = choice), 'knew' (v = 0/1),
// 'end' (point phase over). Times are seconds from the session start.

const LEVERS = 3;
const COLORS = 3;
// Ono (1987, p. 267): a point within 1 s after a pull counts as contiguous.
const CONTIGUOUS_SECS = 1;
// A point counts as "idle" when no pull happened in the 3 s before it.
const IDLE_WINDOW = 3;
// The "system" is the last pulls (up to 3) within 4 s before a point.
const SYSTEM_WINDOW = 4;
// Sensory superstition is reported only with enough pulls under a colour and a
// clear favourite lever.
const SENSORY_MIN_PULLS = 5;
const SENSORY_MIN_SHARE = 0.6;

const pullsBefore = (pulls, t, window) => pulls.filter(e => e.t < t && e.t >= t - window);

// The point phase: what the player did while points were coming.
function pointPhase(log) {
  const pulls = log.filter(e => e.k === 'pull');
  const pts = log.filter(e => e.k === 'point');
  const per = Array(LEVERS).fill(0);
  pulls.forEach(p => per[p.v]++);
  let idle = 0;
  let contiguous = 0;
  const seqs = new Map();
  for (const p of pts) {
    if (!pullsBefore(pulls, p.t, IDLE_WINDOW).length) idle++;
    if (pullsBefore(pulls, p.t, CONTIGUOUS_SECS).length) contiguous++;
    const before = pullsBefore(pulls, p.t, SYSTEM_WINDOW);
    if (before.length) {
      const seq = before.slice(-3).map(e => e.v).join(',');
      seqs.set(seq, (seqs.get(seq) || 0) + 1);
    }
  }
  const top = [...seqs.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    pulls: pulls.length,
    per,
    pts: pts.length,
    idle,
    // percentage of contiguous points, Ono's PCR
    pcr: pts.length ? Math.round((contiguous / pts.length) * 100) : 0,
    best: top ? { seq: top[0].split(',').map(Number), count: top[1] } : null
  };
}

// Which lever the player favoured under each colour of the signal light.
function sensory(log) {
  const changes = log.filter(e => e.k === 'signal');
  const colorAt = (t) => {
    let c = null;
    for (const s of changes) { if (s.t <= t) c = s.v; else break; }
    return c;
  };
  const table = Array.from({ length: COLORS }, () => Array(LEVERS).fill(0));
  for (const p of log.filter(e => e.k === 'pull')) {
    const c = colorAt(p.t);
    if (c !== null) table[c][p.v]++;
  }
  const favourite = table.map((row) => {
    const total = row.reduce((a, b) => a + b, 0);
    const lever = row.indexOf(Math.max(...row));
    const share = total ? row[lever] / total : 0;
    return total >= SENSORY_MIN_PULLS && share >= SENSORY_MIN_SHARE ? { lever, share: Math.round(share * 100) } : null;
  });
  return { table, favourite };
}

export function analyseOno(log) {
  const end = log.find(e => e.k === 'end');
  const tEnd = end ? end.t : Infinity;
  const phase = pointPhase(log.filter(e => e.t < tEnd));
  const extinction = log.filter(e => e.k === 'pull' && e.t >= tEnd).length;
  const answer = log.filter(e => e.k === 'answer').pop();
  const knew = log.filter(e => e.k === 'knew').pop();
  return {
    ...phase,
    extinction,
    sensory: sensory(log),
    reaches: log.filter(e => e.k === 'reach').length,
    answer: answer ? answer.v : null,
    knew: knew ? knew.v : null
  };
}
