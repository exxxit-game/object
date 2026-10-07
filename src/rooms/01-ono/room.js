import '../../engine/panel.js';
import '../../engine/swing.js';
import '../../engine/look-watch.js';
import '../../engine/reach-watch.js';
import './room-bounds.js';
import { eventLog } from '../../engine/log.js';
import { createTimeline } from '../../engine/timeline.js';
import { unlock, tone } from '../../engine/audio.js';
import { speak } from '../../engine/voice.js';
import { sceneHTML } from './scene.js';
import { analyse } from './analyse.js';
import { initPainting } from './painting.js';
import { T } from './texts.ru.js';

const COLORS = ['#d23b32', '#2f9e55', '#2f6fd2'];
const GOAL = 12;
const GREY = '#7d7a73';
const SOFT = '#b9b5ac';
const GOLD = '#f0c96a';

const timeline = createTimeline();
const $ = (s) => document.querySelector(s);
const screen = () => $('#screen').components.panel;

let scene;
let score = 0;
let drawPainting;
let runs = [];

// idle -> intro -> run -> done -> intro ...
// Mirrored on <html data-room-state> so tests can observe the flow.
let state = 'idle';
function setState(s) {
  state = s;
  document.documentElement.dataset.roomState = s;
}

/* ---------- sound ---------- */
const clunk = () => { tone(110, 0.12, 'square', 0.08, 60); tone(70, 0.18, 'sine', 0.2, 40); };
const buzz = () => { tone(880, 0.35, 'square', 0.06); tone(1320, 0.35, 'sine', 0.05); };

/* ---------- experimenter ---------- */
const experimenterBlocks = (text) => [
  { t: T.experimenter, size: 26, color: GREY, weight: 600 },
  { t: text, size: 50, color: '#ece9e2' }
];

function say(text, extra) {
  screen().write(experimenterBlocks(text).concat(extra || []));
  speak(text);
}

// During the run the screen shows the score on every point, so it always matches
// the counter on the table. The last praise, if any, stays above the score.
let lastPraise = null;
function drawRunScreen() {
  if (lastPraise) screen().write(experimenterBlocks(lastPraise).concat({ t: T.progress(score, GOAL), size: 34, color: GREY }));
  else screen().write([{ t: T.progress(score, GOAL), size: 34, color: '#55524c' }]);
}

/* ---------- levers ---------- */
function el(tag, attrs, parent) {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (parent || scene).appendChild(e);
  return e;
}

function buildLevers() {
  [-0.28, 0, 0.28].forEach((x, i) => {
    const root = el('a-entity', { position: `${x} 0.86 -0.62` }, $('#room'));
    el('a-box', { width: 0.14, height: 0.05, depth: 0.18, color: '#2b2b2f', roughness: 0.6 }, root);
    el('a-box', { width: 0.03, height: 0.012, depth: 0.14, position: '0 0.026 0', color: '#111' }, root);
    const lamp = el('a-sphere', { radius: 0.018, position: '0 0.035 0.075', material: `color:#222; emissive:${COLORS[i]}; emissiveIntensity:0` }, root);
    const pivot = el('a-entity', { swing: '' }, root);
    el('a-cylinder', { radius: 0.011, height: 0.24, position: '0 0.12 0', color: '#9a9a9a', metalness: 0.7, roughness: 0.3 }, pivot);
    el('a-sphere', { radius: 0.038, position: '0 0.25 0', color: COLORS[i], roughness: 0.35 }, pivot);
    const hit = el('a-box', { class: 'clickable', width: 0.16, height: 0.36, depth: 0.22, position: '0 0.16 0', material: 'opacity:0; transparent:true; depthWrite:false' }, root);
    const lever = { i, pivot, lamp, busy: false };
    hit.addEventListener('click', () => pull(lever));
  });
}

function pull(lever) {
  if (lever.busy) return;
  lever.busy = true;
  unlock();
  clunk();
  lever.pivot.components.swing.go();
  lever.lamp.setAttribute('material', 'emissiveIntensity', 2.5);
  setTimeout(() => { lever.lamp.setAttribute('material', 'emissiveIntensity', 0); lever.busy = false; }, 480);
  eventLog.add('pull', lever.i);
}

/* ---------- counter and signal lamp ---------- */
function drawCounter(flash) {
  $('#counter').components.panel.write(
    [{ t: String(score).padStart(2, '0'), size: 150, color: flash ? '#b6ff9a' : '#59d36a', weight: 700 }],
    { bg: '#050806' }
  );
}

function point() {
  if (state !== 'run') return;
  score++;
  eventLog.add('point');
  drawCounter(true);
  buzz();
  $('#signal').setAttribute('material', 'emissiveIntensity', 3);
  $('#timerLed').setAttribute('material', 'emissiveIntensity', 3);
  setTimeout(() => {
    $('#signal').setAttribute('material', 'emissiveIntensity', 0.05);
    $('#timerLed').setAttribute('material', 'emissiveIntensity', 0.2);
    drawCounter(false);
  }, 600);
  const praise = T.praise[score];
  drawRunScreen();
  if (praise) timeline.later(() => { lastPraise = praise; drawRunScreen(); speak(praise); }, 900);
  if (score >= GOAL) { timeline.later(finish, 1400); return; }
  schedule();
}

// Points come from a timer, independent of anything the player does (variable-time schedule).
function schedule() { timeline.later(point, 2500 + Math.random() * 5500); }

/* ---------- flow ---------- */
function start() {
  if (state === 'run' || state === 'intro') return;
  unlock();
  timeline.clearAll();
  setState('intro');
  score = 0;
  eventLog.reset();
  drawCounter(false);
  $('#startBtn').setAttribute('visible', false);
  $('#startHit').classList.remove('clickable');
  $('#againBtn').setAttribute('visible', false);
  $('#againHit').classList.remove('clickable');
  darkGlass(true);
  say(T.intro[0]);
  timeline.later(() => say(T.intro[1]), 3300);
  timeline.later(() => say(T.intro[2](GOAL)), 7000);
  timeline.later(() => {
    setState('run');
    eventLog.begin();
    lastPraise = null;
    drawRunScreen();
    schedule();
  }, 9500);
}

function reportBlocks(r) {
  const R = T.report;
  const blocks = [{ t: R.header, size: 30, color: GREY, weight: 600 }];
  blocks.push({ t: r.pulls ? R.pulls(r.pulls, r.per) : R.noPulls, size: 40 });
  if (r.best && r.best.count > 1) {
    const names = r.best.seq.map(i => T.leverNames[i]);
    blocks.push({ t: R.system(names, r.best.count, r.pts), size: 40 });
  }
  if (r.pulls) blocks.push({ t: R.idle(r.idle), size: 40 });
  if (r.looks) blocks.push({ t: R.looks(r.looks), size: 34, color: SOFT });
  if (r.reaches) blocks.push({ t: R.reaches(r.reaches), size: 34, color: SOFT });
  blocks.push({ t: R.verdict, size: 44, color: GOLD, weight: 600, gap: 34 });
  return blocks;
}

function originalBlocks(r) {
  const O = T.original;
  const prev = runs.length > 1 ? runs[runs.length - 2] : null;
  const extra = prev ? [{ t: O.previousRun(prev.pulls, r.pulls), size: 36, color: GOLD, gap: 30 }] : [];
  return [
    { t: O.header, size: 30, color: GREY, weight: 600 },
    { t: O.study, size: 40 },
    { t: O.result, size: 40 },
    { t: O.difference, size: 36, color: SOFT }
  ].concat(extra);
}

function finish() {
  setState('done');
  eventLog.end();
  const r = analyse(eventLog.entries);
  runs.push(r);
  say(T.sessionOver);
  timeline.later(() => {
    screen().write(reportBlocks(r));
    darkGlass(false);
  }, 2600);
  timeline.later(() => {
    screen().write(originalBlocks(r));
    $('#againBtn').setAttribute('visible', true);
    $('#againHit').classList.add('clickable');
  }, 17000);
}

function darkGlass(dark) {
  $('#glass').setAttribute('material', 'opacity', dark ? 0.94 : 0.12);
  $('#obsLight').setAttribute('light', 'intensity', dark ? 0 : 6);
}

/* ---------- boot ---------- */
function boot() {
  drawCounter(false);
  drawPainting();
  screen().write([
    { t: T.boot.kicker, size: 30, color: GREY, weight: 600 },
    { t: T.boot.title, size: 90, weight: 700 },
    { t: T.boot.prompt, size: 38, color: SOFT }
  ]);
  $('#startLabel').components.panel.write([{ t: T.startLabel, size: 64, weight: 700, color: '#1a1a1a' }]);
  $('#againLabel').components.panel.write([{ t: T.againLabel, size: 64, weight: 700, color: '#1a1a1a' }]);
  $('#timerLabel').components.panel.write(
    [{ t: T.timerLabel[0], size: 70, weight: 700, color: '#d8d4ca' }, { t: T.timerLabel[1], size: 46, color: '#d8d4ca' }],
    { bg: '#222' }
  );
  // On desktop the view starts tilted slightly down.
  const lc = $('#cam').components['look-controls'];
  if (lc && lc.pitchObject) lc.pitchObject.rotation.x = -0.28;
  $('#hint').classList.add('show');
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
  document.body.insertAdjacentHTML('beforeend', sceneHTML);
  scene = $('a-scene');
  buildLevers();
  drawPainting = initPainting($('#painting'));
  $('#startHit').addEventListener('click', start);
  $('#againHit').addEventListener('click', start);
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && state === 'idle') start(); });
  setState('idle');
  if (scene.hasLoaded) boot(); else scene.addEventListener('loaded', boot);
}
