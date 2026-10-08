// The shared audio context. Browsers start audio suspended until a user gesture,
// so call unlock() from a click or key handler before playing anything.
let ctx = null;
const waiting = [];

export function unlock() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio available */ }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  if (ctx) waiting.splice(0).forEach((fn) => fn());
}

// Runs fn once audio is unlocked: at once if it is, otherwise on the first unlock(). For a
// sound that starts on a timer: started before the player's first gesture it would be lost.
export function onUnlock(fn) {
  if (ctx) fn(); else waiting.push(fn);
}

// The shared audio context, or null before the first unlock().
export function getContext() { return ctx; }
