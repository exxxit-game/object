// Ono (1987, p. 263) schedules, exactly as in the paper: a 30-minute point phase,
// then 10 minutes of extinction (no points).
//   FT30: a point every 30 s           FT60: every 60 s
//   VT30: 3–57 s in 3 s steps (mean 30) VT60: 25–95 s in 5 s steps (mean 60)
// This gives 60 points (30 s schedules) or 30 points (60 s schedules).
// Points never depend on what the player does.
export const POINT_PHASE_SECS = 1800;
export const EXTINCTION_SECS = 600;
export const SESSION_SECS = POINT_PHASE_SECS + EXTINCTION_SECS;

export const CONDITIONS = ['FT30', 'FT60', 'VT30', 'VT60'];

const range = (from, to, step) => {
  const out = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 10) / 10);
  return out;
};
const VT_VALUES = { VT30: range(3, 57, 3), VT60: range(25, 95, 5) };

function shuffle(list, random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Random assignment, as in Ono (random among the four schedules).
export const pickCondition = (random = Math.random) => CONDITIONS[Math.floor(random() * CONDITIONS.length)];

// Point times in seconds from the session start, all within the point phase.
// VT intervals are drawn from the full set without repeats until it is used up
// (then reshuffled), so their mean is exactly the nominal value.
export function pointTimes(condition, random = Math.random) {
  const times = [];
  let t = 0;
  if (condition === 'FT30' || condition === 'FT60') {
    const step = condition === 'FT30' ? 30 : 60;
    for (t = step; t <= POINT_PHASE_SECS + 1e-9; t += step) times.push(Math.round(t * 10) / 10);
    return times;
  }
  const values = VT_VALUES[condition];
  if (!values) throw new Error(`unknown condition ${condition}`);
  let bag = [];
  for (;;) {
    if (!bag.length) bag = shuffle(values, random);
    t = Math.round((t + bag.pop()) * 10) / 10;
    if (t > POINT_PHASE_SECS) return times;
    times.push(t);
  }
}
