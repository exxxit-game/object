import { unlock, tone } from '../../engine/audio.js';
import { pulse } from '../../engine/haptics.js';
import { eventLog } from '../../engine/log.js';

// The three levers of the Ono booth. They are connected to nothing: a pull only
// moves the lever, lights its lamp, sounds, vibrates and is logged.
const COLORS = ['#d23b32', '#2f9e55', '#2f6fd2'];
// Each lever also has its own knob shape, so it is never told apart by colour alone
// (red and green look alike to many colour-blind players).
const KNOBS = [
  ['a-sphere', { radius: 0.038 }],
  ['a-box', { width: 0.066, height: 0.066, depth: 0.066 }],
  ['a-cylinder', { radius: 0.036, height: 0.07 }]
];

const clunk = () => { tone(110, 0.12, 'square', 0.08, 60); tone(70, 0.18, 'sine', 0.2, 40); };
function el(tag, attrs, parent) {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}

export function buildLevers(roomEl) {
  // Close enough to the player that a full stroke never reaches the counter stand.
  [-0.30, -0.04, 0.22].forEach((x, i) => {
    const root = el('a-entity', { position: `${x} 0.86 -0.50` }, roomEl);
    el('a-box', { width: 0.14, height: 0.05, depth: 0.18, color: '#2b2b2f', roughness: 0.6 }, root);
    el('a-box', { width: 0.03, height: 0.012, depth: 0.14, position: '0 0.026 0', color: '#111' }, root);
    const lamp = el('a-sphere', { radius: 0.018, position: '0 0.035 0.075', material: `color:#222; emissive:${COLORS[i]}; emissiveIntensity:0` }, root);
    const pivot = el('a-entity', { swing: '' }, root);
    el('a-cylinder', { radius: 0.011, height: 0.24, position: '0 0.12 0', color: '#9a9a9a', metalness: 0.7, roughness: 0.3 }, pivot);
    el(KNOBS[i][0], { ...KNOBS[i][1], position: '0 0.25 0', color: COLORS[i], roughness: 0.35 }, pivot);
    const hit = el('a-box', { class: 'clickable', width: 0.16, height: 0.36, depth: 0.22, position: '0 0.16 0', material: 'opacity:0; transparent:true; depthWrite:false' }, root);
    const lever = { i, pivot, lamp, busy: false };
    hit.addEventListener('click', (e) => pull(lever, e.detail && e.detail.cursorEl));
  });
}

function pull(lever, controllerEl) {
  if (lever.busy) return;
  lever.busy = true;
  unlock();
  clunk();
  pulse(controllerEl);
  lever.pivot.components.swing.go();
  lever.lamp.setAttribute('material', 'emissiveIntensity', 2.5);
  setTimeout(() => { lever.lamp.setAttribute('material', 'emissiveIntensity', 0); lever.busy = false; }, 480);
  eventLog.add('pull', lever.i);
}

