import { askConsent } from '../consent.js';
import { askAfterLeaving, leftBefore } from '../left-early.js';
import { writePlaque, BRAND } from '../brand.js';
import { APP_T } from '../texts.ru.js';
import { loadVoice, speak } from '../../engine/voice.js';
import { unlock } from '../../engine/audio.js';
import { createChoice } from '../../engine/ui/choice.js';
import '../../engine/fader.js';
import { LOBBY_T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';

export { corridorHTML } from './scene.js';

// The arrival before the first room: the player stands in the lab corridor facing the
// doors; the experimenter welcomes them on the board, asks the consent, and the player
// points at door 1. The door opens, the view fades, and the player is at the table
// (on the chair when seated). See docs/decisions.md, "The arrival".
// The player arrives facing door 1, the thing to do first. The corridor is a place to
// stand and walk: a seated player sees it from standing eye height (lift); a room whose
// original was seated puts its chair under them instead.
const SPOT = { x: 0.6, z: 2.9, yaw: 0, lift: true };
const BOUNDS = 'minX: -3.1; maxX: 2.7; minZ: 1.95; maxZ: 3.2';
const BOARD_TOP = 1.95; // the board: centre 1.5 m, 0.9 m high
const $ = (s) => document.querySelector(s);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

loadVoice(VOICE_LINES, import.meta.url);

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

function write(board, blocks) {
  const bottom = board.write(blocks, { top: true });
  board.el.dataset.textBottom = (BOARD_TOP - bottom).toFixed(3);
  return BOARD_TOP - bottom - 0.05;
}

// room: { id, plaque: { number, name, year }, debrief, seat: { x, z, yaw }, bounds, extra, real }
// Resolves with true when the player chose to start with recording, once inside the room.
export async function runLobby(room) {
  const scene = $('a-scene');
  const board = $('#lobbyBoard').components.panel;
  const choice = createChoice(scene, { x: -1.0, y: 1.3, z: 1.705, w: 0.62, h: 0.1, bottom: 1.07 });
  const pick = (labels, top) => new Promise((resolve) => choice.show(labels, resolve, top));
  placePlayer(SPOT, BOUNDS);
  writePlaque($('#plaqueOut').components.panel, room.plaque);
  for (const id of ['#soon1', '#soon2']) {
    $(id).components.panel.write([{ t: LOBBY_T.soon, size: 62, weight: 700, color: BRAND.accent, spacing: 6 }], { bg: BRAND.plate });
  }

  // 1. welcome: the promise first; the voice starts with the player's first gesture
  let spoken = Promise.resolve();
  onFirstGesture(() => { spoken = (async () => { for (const line of LOBBY_T.welcome) await speak(line); })(); });
  const top = write(board, [
    { t: LOBBY_T.kicker, size: 34, color: '#9a968d', weight: 700, spacing: 8 },
    { t: LOBBY_T.title, size: 90, weight: 700, gap: 14 },
    ...LOBBY_T.welcome.map((t, i) => ({ t, size: 40, color: '#c4c0b7', weight: 500, gap: i ? 10 : 22 }))
  ]);
  await pick([APP_T.next], top);
  unlock();

  // 2. a player who left the room early last time chooses: start again or learn what it was
  if (room.real && leftBefore(room.id)) {
    await askAfterLeaving(board, choice, { room: room.id, debrief: room.debrief, screenTop: BOARD_TOP });
  }

  // 3. consent, once, before the door
  const withRecording = await askConsent(board, choice, {
    kicker: LOBBY_T.kicker, screenTop: BOARD_TOP, extra: room.extra
  });

  // 4. the doors: door 1 opens the room
  write(board, [{ t: LOBBY_T.chooseDoor, size: 54, weight: 600 }]);
  await spoken;
  speak(LOBBY_T.chooseDoor);
  const door = $('#door1');
  const leaf = door.querySelector('.clickable');
  document.documentElement.dataset.lobby = 'door';
  await new Promise((resolve) => leaf.addEventListener('click', resolve, { once: true }));
  delete document.documentElement.dataset.lobby;

  door.setAttribute('animation', { property: 'rotation', to: '0 -95 0', dur: 700, easing: 'easeInOutQuad' });
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
