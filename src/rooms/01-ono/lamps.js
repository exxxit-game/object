import { eventLog } from '../../engine/log.js';

// Three signal lamps on the wall, as in Ono (1987): they light up at random and
// are connected to nothing. They give the player more "patterns" to latch onto.
const COLORS = ['#ffb020', '#f4f4ee', '#40d0e0'];
let lamps = [];
let timer = null;

export function buildLamps(scene) {
  const plate = document.createElement('a-box');
  plate.setAttribute('position', '1.25 1.86 -1.585');
  plate.setAttribute('width', '0.18');
  plate.setAttribute('height', '0.56');
  plate.setAttribute('depth', '0.03');
  plate.setAttribute('color', '#1b1c1e');
  scene.appendChild(plate);
  lamps = COLORS.map((c, i) => {
    const s = document.createElement('a-sphere');
    s.setAttribute('radius', '0.045');
    s.setAttribute('position', `1.25 ${(2.04 - i * 0.18).toFixed(2)} -1.56`);
    s.setAttribute('material', `color: #222; emissive: ${c}; emissiveIntensity: 0`);
    scene.appendChild(s);
    return s;
  });
}

// Random lamp every 3–9 s for 0.7 s while `isActive()` is true.
export function startLamps(isActive) {
  stopLamps();
  const next = () => {
    timer = setTimeout(() => {
      if (isActive()) {
        const i = Math.floor(Math.random() * lamps.length);
        lamps[i].setAttribute('material', 'emissiveIntensity', 2.5);
        setTimeout(() => lamps[i].setAttribute('material', 'emissiveIntensity', 0), 700);
        eventLog.add('signal', i);
      }
      next();
    }, 3000 + Math.random() * 6000);
  };
  next();
}

export function stopLamps() { clearTimeout(timer); timer = null; }
