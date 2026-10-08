import { askConsent } from '../consent.js';
import { askAfterLeaving, leftBefore } from '../left-early.js';
import { writePlaque, BRAND } from '../brand.js';
import { APP_T } from '../texts.ru.js';
import { loadVoice, speak } from '../../engine/voice.js';
import { unlock } from '../../engine/audio.js';
import { createSheet } from '../../engine/ui/sheet.js';
import { loadSounds, playSound } from '../../engine/sfx.js';
import '../../engine/fader.js';
import '../../engine/glow.js';
import { LOBBY_T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';
import { SIGN_START, SIGN_AT } from './sign.js';

export { corridorHTML } from './scene.js';

// The arrival before the first room: the player stands in the lab corridor facing door 1;
// the sign over it comes on, the clipboard sheet welcomes them and asks the consent, and
// the player points at door 1. The door opens, the view fades, and the player is at the
// table (on the chair when seated). See docs/decisions.md, "The arrival".
// The player arrives facing door 1, the thing to do first. The corridor is a place to
// stand and walk: a seated player sees it from standing eye height (lift); a room whose
// original was seated puts its chair under them instead.
const SPOT = { x: 0.6, z: 3.05, yaw: 0, lift: true };
const BOUNDS = 'minX: -3.1; maxX: 2.7; minZ: 2.1; maxZ: 3.35';
const $ = (s) => document.querySelector(s);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

loadVoice(VOICE_LINES, import.meta.url);
loadSounds(SOUNDS, import.meta.url);

// Puts the player at a spot facing a direction: in VR through the recenter component; on a
// computer the rig goes to the origin and the camera to the spot, because room-bounds
// limits the camera's own position (so its numbers are world metres with the rig at 0).
function placePlayer({ x, z, yaw, lift = false }, bounds) {
  const rig = $('#rig');
  rig.setAttribute('recenter', { x, z, yaw, lift });
  if (rig.sceneEl.is('vr-mode')) { rig.components.recenter.apply(); return; }
  rig.object3D.position.set(0, 0, 0);
  rig.object3D.rotation.y = THREE.MathUtils.degToRad(yaw);
  const cam = $('#cam');
  cam.setAttribute('room-bounds', bounds);
  cam.object3D.position.set(x, cam.object3D.position.y, z);
}

// Audio may only start after the player's first gesture (a click, a key, entering VR).
function onFirstGesture(fn) {
  let done = false;
  const go = () => { if (done) return; done = true; unlock(); fn(); };
  window.addEventListener('pointerdown', go, { once: true });
  window.addEventListener('keydown', go, { once: true });
  $('a-scene').addEventListener('enter-vr', go, { once: true });
}

// The light box over door 1 comes on first, before any text (src/app/lobby/sign.js says
// why): in a headset once the player is in VR and placed facing the door, on a computer
// at once. Its starter clicks and then its hum come from the sign.
function signOn(gesture) {
  const face = $('#signFace');
  face.components.panel.write([{ t: LOBBY_T.sign, size: 72, weight: 800, color: '#ffe7b0', spacing: 6 }], { bg: '#160f05', pad: 40 });
  face.addEventListener('glow-rise', () => playSound('sign-click', SIGN_AT, 0.6));
  const when = AFRAME.utils.device.checkHeadsetConnected() ? gesture.then(() => delay(400)) : Promise.resolve();
  return when
    .then(() => face.components.glow.run(SIGN_START))
    .then(() => { playSound('sign-hum', SIGN_AT, 0.08, true); });
}

// room: { id, plaque: { number, name, year }, debrief, seat: { x, z, yaw }, bounds, extra, real }
// Resolves with true when the player chose to start with recording, once inside the room.
export async function runLobby(room) {
  const scene = $('a-scene');
  const board = $('#lobbyBoard').components.panel;
  const sheet = createSheet(scene);
  placePlayer(SPOT, BOUNDS);
  writePlaque($('#plaqueOut').components.panel, room.plaque);
  for (const id of ['#soon1', '#soon2']) {
    $(id).components.panel.write([{ t: LOBBY_T.soon, size: 62, weight: 700, color: BRAND.accent, spacing: 6 }], { bg: BRAND.plate });
  }
  board.write([]);

  // 0. the sign comes on; 1. welcome on the sheet: the promise first; the voice reads it
  // once the sign is lit and the player has made a gesture (audio needs one)
  let spoken = Promise.resolve();
  const gesture = new Promise((resolve) => onFirstGesture(resolve));
  const lit = signOn(gesture);
  gesture.then(() => { spoken = (async () => { await lit; for (const line of LOBBY_T.welcome) await speak(line); })(); });
  await lit;
  await sheet.choose([
    { t: LOBBY_T.kicker, role: 'kicker' },
    { t: LOBBY_T.title, role: 'title', gap: 0.01 },
    ...LOBBY_T.welcome.map((t, i) => ({ t, role: 'body', gap: i ? 0.012 : 0.025 }))
  ], [APP_T.next]);
  unlock();

  // 2. a player who left the room early last time chooses: start again or learn what it was
  if (room.real && leftBefore(room.id)) {
    await askAfterLeaving(sheet, { room: room.id, debrief: room.debrief });
  }

  // 3. consent, once, before the door
  const withRecording = await askConsent(sheet, { kicker: LOBBY_T.kicker, extra: room.extra });
  sheet.close();

  // 4. the doors: door 1 opens the room
  board.write([{ t: LOBBY_T.chooseDoor, size: 54, weight: 600 }]);
  await spoken;
  speak(LOBBY_T.chooseDoor);
  const door = $('#door1');
  const leaf = door.querySelector('.clickable');
  document.documentElement.dataset.lobby = 'door';
  await new Promise((resolve) => leaf.addEventListener('click', resolve, { once: true }));
  delete document.documentElement.dataset.lobby;

  door.setAttribute('animation', { property: 'rotation', to: '0 95 0', dur: 700, easing: 'easeInOutQuad' }); // into the room
  await delay(500);
  await $('#cam').components.fader.to(1);
  placePlayer(room.seat, room.bounds);
  door.removeAttribute('animation');
  door.setAttribute('rotation', '0 0 0');
  board.write([]);
  await delay(250);
  await $('#cam').components.fader.to(0);
  return withRecording;
}
