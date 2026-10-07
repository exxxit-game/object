// Synthesised sound. Browsers start audio suspended until a user gesture,
// so call unlock() from a click or key handler before the first tone().
let ctx = null;

export function unlock() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio available */ }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function tone(freq, dur, type = 'sine', vol = 0.15, slideTo = 0) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
