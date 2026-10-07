// The signal light of Ono (1987, p. 263): red, orange or green, each colour lit
// 6–8 times in random order, with equal total time for every colour, over the
// whole session. It is connected to nothing.
export const SIGNAL_COLORS = ['red', 'orange', 'green'];

function shuffle(list, random) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const noRepeats = (order) => order.every((c, i) => i === 0 || c !== order[i - 1]);

// Returns [{ color, from, to }] covering 0..totalSecs. No colour follows itself.
export function signalSequence(totalSecs, random = Math.random) {
  const counts = SIGNAL_COLORS.map(() => 6 + Math.floor(random() * 3));
  const bag = SIGNAL_COLORS.flatMap((c, i) => Array(counts[i]).fill(i));
  // with 6–8 of each colour a valid order comes up within a few dozen shuffles
  let order = shuffle(bag, random);
  for (let tries = 0; !noRepeats(order) && tries < 10000; tries++) order = shuffle(bag, random);
  if (!noRepeats(order)) throw new Error('no valid signal order');
  const perColor = totalSecs / SIGNAL_COLORS.length;
  const out = [];
  let t = 0;
  for (const i of order) {
    const len = perColor / counts[i];
    out.push({ color: SIGNAL_COLORS[i], from: Math.round(t * 1000) / 1000, to: Math.round((t + len) * 1000) / 1000 });
    t += len;
  }
  out[out.length - 1].to = totalSecs;
  return out;
}
