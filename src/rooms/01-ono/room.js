import '../../engine/panel.js';
import '../../engine/swing.js';
import '../../engine/look-watch.js';
import '../../engine/reach-watch.js';
import '../../engine/recenter.js';
import './room-bounds.js';
import { eventLog } from '../../engine/log.js';
import { createTimeline } from '../../engine/timeline.js';
import { unlock, tone } from '../../engine/audio.js';
import { loadVoice, speak } from '../../engine/voice.js';
import { sceneHTML } from './scene.js';
import { analyseSession } from './report.js';
import { buildAnswers, showAnswers, hideAnswers } from './question.js';
import { buildLevers } from './levers.js';
import { buildLamps, startLamps, stopLamps } from './lamps.js';
import { createClock, formatClock } from './clock.js';
import { drawChart } from './chart.js';
import { reportLevers, reportVerdict, originalBlocks } from './reveal.js';
import { initPainting } from './painting.js';
import { T } from './texts.ru.js';
import { VOICE_LINES } from './voice-lines.js';
import { sendResult, markPlayed } from '../../engine/results.js';

// Bump when a change makes new results not comparable with older ones.
const ROOM_ID = '01-ono';
const ROOM_VERSION = 3;

// Each round lasts two minutes; the player is asked for as many points as possible.
// Tests may shorten it with ?roundsecs=N (5–120); players always get 120.
const requestedSecs = Number(new URLSearchParams(location.search).get('roundsecs'));
const ROUND_SECS = requestedSecs >= 5 && requestedSecs <= 120 ? requestedSecs : 120;
// Points after which the experimenter praises (T.praise in order).
const PRAISE_AT = [3, 8, 14];
// Seconds without a lever pull before the experimenter prods.
const IDLE_PROD_SECS = 8;

const SOFT = '#c4c0b7';
const HEAD = '#9a968d';
const INK = '#f2efe8';

const timeline = createTimeline();
const $ = (s) => document.querySelector(s);
const screen = () => $('#screen').components.panel;

let scene;
let score = 0;
let drawPainting;
let runs = [];
let round = 1;
let clock = null;
let secsLeft = ROUND_SECS;
let seated = false;

// idle -> intro -> run (round 1) -> question -> run (round 2) -> done -> intro ...
// Mirrored on <html data-room-state> so tests can observe the flow.
let state = 'idle';
function setState(s) {
  state = s;
  document.documentElement.dataset.roomState = s;
}

const buzz = () => { tone(880, 0.35, 'square', 0.06); tone(1320, 0.35, 'sine', 0.05); };

/* ---------- experimenter and screen ---------- */
function say(text) {
  screen().write([{ t: text, size: 62, color: INK, weight: 500 }]);
  speak(text);
}

// During a round the screen shows the countdown, and above it the last thing the
// experimenter said (praise or prod).
let note = null;
function drawRunScreen() {
  const blocks = note ? [{ t: note, size: 56, color: INK, weight: 500 }] : [];
  blocks.push({ t: formatClock(secsLeft), size: 150, color: SOFT, weight: 700, gap: 30 });
  screen().write(blocks);
}
function experimenterNote(text) {
  note = text;
  drawRunScreen();
  speak(text);
}

function drawCounter(flash) {
  $('#counter').components.panel.write(
    [{ t: String(score).padStart(2, '0'), size: 150, color: flash ? '#b6ff9a' : '#59d36a', weight: 700 }],
    { bg: '#050806' }
  );
}

// Timed events wait while the player cannot act: headset system menu open
// (XR session not visible) or the browser tab hidden.
let xrVisible = true;
const paused = () => document.hidden || !xrVisible;
const now = () => (performance.now() - eventLog.t0) / 1000;

/* ---------- points: a timer, independent of the player ---------- */
function point() {
  if (state !== 'run') return;
  if (paused()) { schedule(); return; }
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
  const p = PRAISE_AT.indexOf(score);
  if (p >= 0) timeline.later(() => experimenterNote(T.praise[p]), 900);
  schedule();
}
// Variable-time schedule: every 2.5–8 s.
function schedule() { timeline.later(point, 2500 + Math.random() * 5500); }

/* ---------- prods when the player stops acting ---------- */
let idleTimer = null;
let lastProd = 0;
let prodCount = 0;
let roundStartT = 0;
function watchIdle() {
  clearInterval(idleTimer);
  idleTimer = setInterval(() => {
    if (state !== 'run' || paused()) return;
    const pulls = eventLog.entries.filter(e => e.k === 'pull');
    const lastPull = pulls.length ? pulls[pulls.length - 1].t : -Infinity;
    if (now() - Math.max(lastPull, roundStartT, lastProd) < IDLE_PROD_SECS) return;
    lastProd = now();
    eventLog.add('prod');
    experimenterNote(T.prods[prodCount++ % T.prods.length]);
  }, 1000);
}

/* ---------- flow ---------- */
function start() {
  if (state !== 'idle' && state !== 'done') return;
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
  // Timed to the recorded lines (3.1 s, 4.5 s, 3.4 s): the round and the clock
  // start right as "Время пошло" ends.
  say(T.intro[0]);
  timeline.later(() => say(T.intro[1]), 3400);
  timeline.later(() => say(T.intro[2]), 8200);
  timeline.later(() => startRound(1), 11400);
}

function startRound(n) {
  round = n;
  if (n === 1) eventLog.begin(); else eventLog.add('round', 2);
  setState('run');
  score = 0;
  note = null;
  secsLeft = ROUND_SECS;
  roundStartT = now();
  lastProd = 0;
  drawCounter(false);
  drawRunScreen();
  schedule();
  watchIdle();
  startLamps(() => state === 'run' && !paused());
  clock = createClock(ROUND_SECS * 1000, paused,
    (secs) => { secsLeft = secs; if (state === 'run') drawRunScreen(); },
    () => endRound());
}

function endRound() {
  clearInterval(idleTimer);
  stopLamps();
  if (round === 1) askQuestion(); else finish();
}

// Between the rounds the player says what they think the points depend on.
function askQuestion() {
  setState('question');
  screen().write([{ t: T.question.ask, size: 56, color: INK, weight: 500 }], { top: true });
  speak(T.question.ask);
  showAnswers((i) => {
    eventLog.add('answer', i);
    say(T.round2);
    timeline.later(() => startRound(2), 5500);
  });
}

function finish() {
  setState('done');
  eventLog.end();
  hideAnswers();
  if (clock) clock.stop();
  const entries = eventLog.entries;
  const s = analyseSession(entries);
  const prev = runs.length ? runs[runs.length - 1] : null;
  runs.push(s);
  say(T.timeUp);
  // Real sessions only: shortened test rounds never reach the statistics.
  if (ROUND_SECS === 120) {
    const prods = entries.filter(e => e.k === 'prod').length;
    sendResult(ROOM_ID, ROOM_VERSION, markPlayed(ROOM_ID), { ...s, seated, prods, roundSecs: ROUND_SECS });
  }
  const split = entries.find(e => e.k === 'round' && e.v === 2);
  const page = { pad: 2048 * 0.07 };
  timeline.later(() => screen().write(reportLevers(s), page), 2600);
  timeline.later(() => drawChart(screen(), entries, split ? split.t : Infinity, ROUND_SECS, T.chart), 11000);
  timeline.later(() => { screen().write(reportVerdict(s), page); darkGlass(false); }, 21000);
  timeline.later(() => {
    screen().write(originalBlocks(s, prev), page);
    $('#againBtn').setAttribute('visible', true);
    $('#againHit').classList.add('clickable');
  }, 31000);
}

function darkGlass(dark) {
  $('#glass').setAttribute('material', 'opacity', dark ? 0.94 : 0.12);
  $('#obsLight').setAttribute('light', 'intensity', dark ? 0 : 6);
}

/* ---------- boot ---------- */
function boot() {
  buildAnswers(scene, T.question.answers);
  buildLamps(scene);
  drawCounter(false);
  drawPainting();
  screen().write([
    { t: T.boot.kicker, size: 34, color: HEAD, weight: 700, spacing: 8 },
    { t: T.boot.title, size: 96, weight: 700, gap: 18 },
    ...T.boot.consent.map((t, i) => ({ t, size: 40, color: SOFT, weight: 500, gap: i ? 14 : 30 })),
    { t: T.boot.prompt, size: 46, color: INK, weight: 600, gap: 34 }
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
  loadVoice(VOICE_LINES, import.meta.url);
  document.body.insertAdjacentHTML('beforeend', sceneHTML);
  scene = $('a-scene');
  buildLevers($('#room'));
  drawPainting = initPainting($('#painting'));
  $('#startHit').addEventListener('click', start);
  $('#againHit').addEventListener('click', start);
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && state === 'idle') start(); });
  scene.addEventListener('enter-vr', () => {
    const session = scene.xrSession;
    if (session) session.addEventListener('visibilitychange', () => { xrVisible = session.visibilityState === 'visible'; });
  });
  scene.addEventListener('exit-vr', () => { xrVisible = true; seated = false; });
  $('#rig').addEventListener('recentered', (e) => { seated = !!(e.detail && e.detail.seated); });
  setState('idle');
  if (scene.hasLoaded) boot(); else scene.addEventListener('loaded', boot);
}
