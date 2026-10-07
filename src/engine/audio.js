// The shared audio context. Browsers start audio suspended until a user gesture,
// so call unlock() from a click or key handler before playing anything.
let ctx = null;

export function unlock() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio available */ }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// The shared audio context, or null before the first unlock().
export function getContext() { return ctx; }
