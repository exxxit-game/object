import '../../engine/panel.js';
import '../../engine/recenter.js';
import '../../engine/sfx.js';
import '../../engine/grab-press.js';
import '../../engine/blob-shadow.js';
import '../../engine/room-bounds.js';
import { eventLog } from '../../engine/log.js';
import { unlock } from '../../engine/audio.js';
import { loadSounds, playSound } from '../../engine/sfx.js';
import { loadVoice, speak } from '../../engine/voice.js';
import { pulse } from '../../engine/haptics.js';
import { createChoice } from '../../engine/ui/choice.js';
import { createScale } from '../../engine/ui/scale.js';
import { askConsent } from '../../app/consent.js';
import { createSession, SPEED } from '../../app/session.js';
import { APP_T } from '../../app/texts.ru.js';
import { sceneHTML } from './scene.js';
import { pickCondition, makeTapes, makeIntervals } from './schedule.js';
import { createTrials } from './trials.js';
import { askAll } from './questions.js';
import { analyse } from './report.js';
import { revealPages } from './reveal.js';
import { T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';
import { SOUNDS } from './sound-list.js';

// Bump when a change makes new results not comparable with older ones.
const ROOM_ID = '01-control';
const ROOM_VERSION = 1;

const INK = '#f2efe8';
const $ = (s) => document.querySelector(s);
const screen = () => $('#screen').components.panel;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
// Behind the player, where the door would be.
const DOOR = { x: 0.6, y: 1.0, z: 1.5 };

let scene, choice, lowChoice, scale, session, trials = null;
let seated = false;
let xrVisible = true;
const paused = () => document.hidden || !xrVisible;

// idle (consent) -> intro -> run -> questions -> done -> intro ...
// Mirrored on <html data-room-state> so tests can observe the flow.
let state = 'idle';
function setState(s) {
  state = s;
  document.documentElement.dataset.roomState = s;
}

/* ---------- the experimenter: voice plus the same words on the screen ---------- */
function show(text, top = false) {
  screen().write([{ t: text, size: top ? 54 : 60, color: INK, weight: 500 }], { top });
}

// Shows the line and waits until it has been spoken (or read, without audio).
async function say(text, top = false) {
  show(text, top);
  if (SPEED > 1) { speak(text); await delay(150); return; }
  const spoken = await speak(text);
  await delay(spoken ? 450 : 1500 + text.length * 55);
}

// Buttons low on the screen, under a text that fills it (consent, pages).
function pick(labels) {
  return new Promise((resolve) => lowChoice.show(labels, resolve));
}

function darkGlass(dark) {
  $('#glass').setAttribute('material', 'opacity', dark ? 0.94 : 0.12);
  $('#obsLight').setAttribute('light', 'intensity', dark ? 0 : 6);
  $('#observer').setAttribute('visible', !dark);
}

/* ---------- flow ---------- */
async function intro() {
  setState('intro');
  darkGlass(true);
  for (;;) {
    for (const line of T.instructions) await say(line);
    for (const line of T.concept) await say(line);
    show(T.repeatQuestion, true);
    speak(T.repeatQuestion);
    if ((await pick([APP_T.understood, APP_T.repeat])) === 0) break;
  }
  await say(T.leave);
  playSound('door', DOOR, 0.8);
  screen().write([]);
  await delay(4000 / SPEED);
}

async function runTrials() {
  setState('run');
  eventLog.reset();
  eventLog.begin();
  const condition = pickCondition(Math.random);
  trials = createTrials({
    tapes: makeTapes(condition, Math.random),
    intervals: makeIntervals(Math.random),
    speed: SPEED,
    paused
  });
  await trials.run();
  trials = null;
  return condition;
}

async function questions() {
  playSound('door', DOOR, 0.8);
  await delay(1500 / SPEED);
  await say(T.back);
  // the experimenter rereads the part about control (p. 452)
  for (const line of T.concept.slice(1)) await say(line);
  setState('questions');
  await askAll({ ask: (text) => { show(text, true); speak(text); }, scale, choice });
}

async function reveal(condition) {
  setState('done');
  eventLog.end();
  const r = analyse(eventLog.entries);
  session.finish({ condition, ...r, seated, speed: SPEED });
  await say(T.thanks);
  darkGlass(false);
  const pages = revealPages(r, condition);
  const page = { pad: 2048 * 0.07, top: true };
  for (let i = 0; i < pages.length; i++) {
    screen().write(pages[i], page);
    const last = i === pages.length - 1;
    await pick([last ? APP_T.again : APP_T.next]);
  }
}

async function play(withRecording) {
  session.begin(withRecording);
  await intro();
  const condition = await runTrials();
  await questions();
  await reveal(condition);
  play(withRecording);
}

/* ---------- the response button ---------- */
function pressButton(e) {
  if (state !== 'run' || !trials) return;
  trials.press();
  const cap = $('#buttonCap');
  cap.object3D.position.y = 0.001;
  setTimeout(() => { cap.object3D.position.y = 0.006; }, 120);
  if (e && e.detail && e.detail.cursorEl) pulse(e.detail.cursorEl, 0.6, 40);
}

/* ---------- boot ---------- */
async function boot() {
  // answer buttons under a short question at the top of the screen
  choice = createChoice(scene, { y: 2.02, z: -1.555, w: 1.2 });
  lowChoice = createChoice(scene, { y: 1.48, z: -1.555, w: 0.9, h: 0.12 });
  scale = createScale(scene, { y: 1.78, z: -1.555 });
  // On desktop the view starts tilted slightly down, toward the table.
  const lc = $('#cam').components['look-controls'];
  if (lc && lc.pitchObject) lc.pitchObject.rotation.x = -0.28;
  $('#hint').classList.add('show');
  const withRecording = await askConsent(screen(), lowChoice, { kicker: T.kicker, title: T.title });
  unlock();
  playSound('room', null, 0.12, true);
  play(withRecording);
}

function fillHint() {
  const hint = $('#hint');
  const title = document.createElement('b');
  const body = document.createElement('span');
  title.textContent = T.hint.title;
  body.textContent = T.hint.body;
  hint.replaceChildren(title, ' ', body);
}

// Room contract: mount() builds the scene and starts the flow. See docs/rooms.md.
export function mount() {
  document.title = T.pageTitle;
  fillHint();
  session = createSession(ROOM_ID, ROOM_VERSION);
  loadVoice(VOICE_LINES, import.meta.url);
  loadSounds(SOUNDS, import.meta.url);
  document.body.insertAdjacentHTML('beforeend', sceneHTML);
  scene = $('a-scene');
  scene.setAttribute('sound-listener', '');
  $('#buttonCap').addEventListener('click', pressButton);
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') pressButton(); });
  scene.addEventListener('enter-vr', () => {
    const s = scene.xrSession;
    if (s) s.addEventListener('visibilitychange', () => { xrVisible = s.visibilityState === 'visible'; });
  });
  scene.addEventListener('exit-vr', () => { xrVisible = true; seated = false; });
  $('#rig').addEventListener('recentered', (e) => { seated = !!(e.detail && e.detail.seated); });
  setState('idle');
  if (scene.hasLoaded) boot(); else scene.addEventListener('loaded', boot);
}
