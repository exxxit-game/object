import { playSound } from '../../engine/sfx.js';

// The room's own sound: a quiet constant lab tone, and now and then a cough or a
// chair creak from the dark observation room behind the glass, so the player
// feels watched. No music: it would change mood and behaviour in the experiment.
const OBSERVER = { x: -2.6, y: 1.0, z: -0.3 };
const NOISES = ['cough', 'chair'];
let tone = null;
let timer = null;

export function startRoomTone() {
  if (!tone) tone = playSound('room', null, 0.12, true);
}

// A noise from behind the glass every 25–50 s while `isActive()` is true.
export function startObserverNoises(isActive) {
  stopObserverNoises();
  const next = () => {
    timer = setTimeout(() => {
      if (isActive()) playSound(NOISES[Math.floor(Math.random() * NOISES.length)], OBSERVER, 0.7);
      next();
    }, 25000 + Math.random() * 25000);
  };
  next();
}

export function stopObserverNoises() { clearTimeout(timer); timer = null; }
