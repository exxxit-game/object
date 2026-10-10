// Event log of one run. Single source of truth for the reveal:
// whatever the reveal says about the player must be provable from these entries.
// Entries are accepted only while the run is active.
export const eventLog = {
  running: false,
  entries: [],
  t0: 0,

  reset() { this.entries = []; this.running = false; },
  begin() { this.t0 = performance.now(); this.running = true; },
  end() { this.running = false; },

  // t is seconds since begin(); k is the event kind; v is an optional payload.
  add(k, v) {
    if (!this.running) return;
    this.entries.push({ t: (performance.now() - this.t0) / 1000, k, v });
  }
};
