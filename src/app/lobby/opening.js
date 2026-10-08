import { playSound } from '../../engine/sfx.js';
import { onUnlock } from '../../engine/audio.js';
import { SOUND_GAIN } from './sound-list.js';
import { SPEED } from '../session.js';
import '../../engine/lightbox.js';
import { SIGN_WORDS, SIGN_STYLE, SIGN_ENDINGS, SIGN_ANSWER, SIGN_LIT_AT, SIGN_AT, ARRIVAL, facesSign, pickEnding } from './sign.js';

// The first moments in the corridor, before any text: the light box over door 1 waits
// until the player has looked around, then starts and plays with the game's name
// (src/app/lobby/sign.js says why). Its starter clicks and its hum come from the sign.
const $ = (s) => document.querySelector(s);
const delay = (s) => new Promise((r) => setTimeout(r, s * 1000 / SPEED));
// Which ending this visit gets: the count of earlier visits lives only on this device (like
// the first-run mark); ?sign=a|b|c forces one for checks.
const VISITS_KEY = 'object.signVisits';
const forced = new URLSearchParams(location.search).get('sign');
let ending = null;
function nextEnding() {
  let visits = 0;
  try {
    visits = Number(localStorage.getItem(VISITS_KEY)) || 0;
    if (!forced) localStorage.setItem(VISITS_KEY, String(visits + 1));
  } catch (e) { /* private mode */ }
  return pickEnding(visits, forced);
}
const fast = (keys) => keys.map(([t, levels, cue]) => [t / SPEED, levels, cue]);
let hum = null;
let humLevel = 1;   // the hum's share of its full level; the cues change it

// Resolves when the sign's play is over and the voice and the clipboard may follow.
export function signOn(scene) {
  const face = $('#signFace');
  const box = face.components.lightbox;
  box.show(SIGN_WORDS, SIGN_STYLE);
  face.addEventListener('lamp-cue', (e) => {
    const cue = e.detail;
    if (cue.sound) playSound(cue.sound, SIGN_AT, SOUND_GAIN[cue.sound]);
    if (cue.hum === undefined) return;
    humLevel = cue.hum;
    if (hum) hum.fade(humLevel * SOUND_GAIN['sign-hum'], (cue.humS || 0) / SPEED);
  });
  return arrival(scene)
    .then(() => {
      ending = nextEnding();
      // on a computer the sign may light before the first click: the hum then starts with it
      delay(SIGN_LIT_AT).then(() => onUnlock(() => { hum = playSound('sign-hum', SIGN_AT, humLevel * SOUND_GAIN['sign-hum'], true); }));
      return box.run(fast(SIGN_ENDINGS[ending]));
    })
    .then(() => (scene.is('vr-mode') ? delay(ARRIVAL.litPauseS) : null));
}

// Called when the player takes the clipboard: in ending b the whole name comes back.
export function signAnswer() {
  if (ending === 'b') $('#signFace').components.lightbox.run(fast(SIGN_ANSWER));
}

// When the sign may start. In VR: after the player has looked around and faces it
// (ARRIVAL). On a computer: at once. Where VR or AR is offered but the player stays on the
// flat page (a phone with AR, a computer with a VR runtime, the headset check tool): on a
// key or a press on the 3D view itself. The VR button lies outside the view, so pressing
// it does not start the sign: it waits until the player is inside.
function arrival(scene) {
  if (!AFRAME.utils.device.checkHeadsetConnected()) return Promise.resolve();
  return new Promise((resolve) => {
    const flat = () => { if (!scene.is('vr-mode')) resolve(); };
    window.addEventListener('keydown', flat, { once: true });
    scene.canvas.addEventListener('pointerdown', flat, { once: true });
    const inside = () => settle(scene).then(resolve);
    if (scene.is('vr-mode')) inside(); else scene.addEventListener('enter-vr', inside, { once: true });
  });
}

async function settle(scene) {
  await delay(ARRIVAL.orientS);
  const head = scene.camera.el.object3D;
  const p = new THREE.Vector3(), f = new THREE.Vector3(), q = new THREE.Quaternion();
  for (let waited = 0; waited < ARRIVAL.lookWaitS; waited += 0.2) {
    head.getWorldPosition(p);
    f.set(0, 0, -1).applyQuaternion(head.getWorldQuaternion(q));
    if (facesSign(p.toArray(), f.toArray())) return;
    await delay(0.2);
  }
}
