// Countdown for one round. Time does not run while the player cannot act
// (headset menu open, tab hidden), the same rule as for the point timer.
export function createClock(durationMs, isPaused, onTick, onEnd) {
  let left = durationMs;
  let last = performance.now();
  let lastShown = -1;
  const id = setInterval(() => {
    const now = performance.now();
    if (!isPaused()) left -= now - last;
    last = now;
    const secs = Math.max(0, Math.ceil(left / 1000));
    if (secs !== lastShown) { lastShown = secs; onTick(secs); }
    if (left <= 0) { clearInterval(id); onEnd(); }
  }, 200);
  return { stop: () => clearInterval(id), secondsLeft: () => Math.max(0, Math.ceil(left / 1000)) };
}

export const formatClock = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
