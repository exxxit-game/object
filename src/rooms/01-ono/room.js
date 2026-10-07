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
import { initPainting } from './painting.js';
import { T } from './texts.ru.js';
import { GOAL, VOICE_LINES } from './voice-lines.js';

const GREY = '#7d7a73';
const SOFT = '#c4c0b7';
const HEAD = '#9a968d';
const GOLD = '#f0c96a';

const timeline = createTimeline();
const $ = (s) => document.querySelector(s);
const screen = () => $('#screen').components.panel;

let scene;
let score = 0;
let drawPainting;
let runs = [];
let round = 1;

// idle -> intro -> run (round 1) -> question -> run (round 2) -> done -> intro ...
// Mirrored on <html data-room-state> so tests can observe the flow.
let state = 'idle';
function setState(s) {
  state = s;
  document.documentElement.dataset.roomState = s;
}

/* ---------- sound ---------- */
const buzz = () => { tone(880, 0.35, 'square', 0.06); tone(1320, 0.35, 'sine', 0.05); };

/* ---------- experimenter ---------- */
const experimenterBlocks = (text) => [
  { t: text, size: 62, color: '#f2efe8', weight: 500 }
];

function say(text, extra) {
  screen().write(experimenterBlocks(text).concat(extra || []));
  speak(text);
}

// During the run the screen shows the score on every point, so it always matches
// the counter on the table. The last praise, if any, stays above the score.
let lastPraise = null;
function drawRunScreen() {
  if (lastPraise) screen().write(experimenterBlocks(lastPraise).concat({ t: T.progress(score, GOAL), size: 44, color: GREY, weight: 500 }));
  else screen().write([{ t: T.progress(score, GOAL), size: 52, color: GREY, weight: 500 }]);
}

/* ---------- counter and signal lamp ---------- */
function drawCounter(flash) {
  $('#counter').components.panel.write(
    [{ t: String(score).padStart(2, '0'), size: 150, color: flash ? '#b6ff9a' : '#59d36a', weight: 700 }],
    { bg: '#050806' }
  );
}

// The timer must not give points while the player cannot act: headset system
// menu open (XR session not visible) or the browser tab hidden. Otherwise the
// reveal would wrongly say "a point came while you did nothing".
let xrVisible = true;
const paused = () => document.hidden || !xrVisible;

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
  const praise = T.praise[score];
  drawRunScreen();
  if (praise) timeline.later(() => { lastPraise = praise; drawRunScreen(); speak(praise); }, 900);
  if (score >= GOAL) { timeline.later(round === 1 ? askQuestion : finish, 1400); return; }
  schedule();
}

// Points come from a timer, independent of anything the player does (variable-time schedule).
function schedule() { timeline.later(point, 2500 + Math.random() * 5500); }

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
  say(T.intro[0]);
  timeline.later(() => say(T.intro[1]), 3300);
  timeline.later(() => say(T.intro[2](GOAL)), 7000);
  timeline.later(() => startRound(1), 9500);
}

function startRound(n) {
  round = n;
  if (n === 1) eventLog.begin(); else eventLog.add('round', 2);
  setState('run');
  score = 0;
  lastPraise = null;
  drawCounter(false);
  drawRunScreen();
  schedule();
}

// Between the rounds the player says what they think the points depend on.
function askQuestion() {
  setState('question');
  screen().write([{ t: T.question.ask, size: 56, color: '#f2efe8', weight: 500 }], { top: true });
  speak(T.question.ask);
  showAnswers((i) => {
    eventLog.add('answer', i);
    say(T.round2);
    timeline.later(() => startRound(2), 4200);
  });
}

// The report is split into two screens so the text stays large enough to read
// in a headset even when every line is present.
const totalPulls = (s) => s.r1.pulls + (s.r2 ? s.r2.pulls : 0);

function reportLevers(s) {
  const R = T.report;
  const r1 = s.r1, r2 = s.r2 || { pulls: 0, per: [0, 0, 0], idle: 0 };
  const pulls = totalPulls(s);
  const per = r1.per.map((n, i) => n + r2.per[i]);
  const blocks = [{ t: R.header, size: 34, color: HEAD, weight: 700, spacing: 6 }];
  blocks.push({ t: pulls ? R.pulls(pulls, per) : R.noPulls, size: 50, weight: 500 });
  if (r1.best && r1.best.count > 1) {
    const names = r1.best.seq.map(i => T.leverNames[i]);
    blocks.push({ t: R.system(names, r1.best.count, r1.pts), size: 50, weight: 500 });
    if (s.r2) blocks.push({ t: R.repeats(s.repeats), size: 50, weight: 500 });
  }
  if (pulls) blocks.push({ t: R.idle(r1.idle + r2.idle), size: 50, weight: 500 });
  return blocks;
}

function reportVerdict(r) {
  const R = T.report;
  const blocks = [{ t: R.header, size: 34, color: HEAD, weight: 700, spacing: 6 }];
  if (r.answer !== null) blocks.push({ t: R.belief[r.answer], size: 50, weight: 500 });
  if (r.looks) blocks.push({ t: R.looks(r.looks), size: 50, color: SOFT, weight: 500 });
  if (r.reaches) blocks.push({ t: R.reaches(r.reaches), size: 50, color: SOFT, weight: 500 });
  blocks.push({ t: R.verdict, size: 56, color: GOLD, weight: 700, gap: 44 });
  return blocks;
}

function originalBlocks(r) {
  const O = T.original;
  const prev = runs.length > 1 ? runs[runs.length - 2] : null;
  const extra = prev ? [{ t: O.previousRun(totalPulls(prev), totalPulls(r)), size: 44, color: GOLD, weight: 600, gap: 36 }] : [];
  return [
    { t: O.header, size: 34, color: HEAD, weight: 700, spacing: 6 },
    { t: O.study, size: 46, weight: 500 },
    { t: O.result, size: 46, weight: 500 },
    { t: O.difference, size: 44, color: SOFT, weight: 500 }
  ].concat(extra);
}

function finish() {
  setState('done');
  eventLog.end();
  hideAnswers();
  const r = analyseSession(eventLog.entries);
  runs.push(r);
  say(T.sessionOver);
  const page = { pad: 2048 * 0.07 };
  timeline.later(() => screen().write(reportLevers(r), page), 2600);
  timeline.later(() => {
    screen().write(reportVerdict(r), page);
    darkGlass(false);
  }, 11000);
  timeline.later(() => {
    screen().write(originalBlocks(r), page);
    $('#againBtn').setAttribute('visible', true);
    $('#againHit').classList.add('clickable');
  }, 22000);
}

function darkGlass(dark) {
  $('#glass').setAttribute('material', 'opacity', dark ? 0.94 : 0.12);
  $('#obsLight').setAttribute('light', 'intensity', dark ? 0 : 6);
}

/* ---------- boot ---------- */
function boot() {
  buildAnswers(scene, T.question.answers);
  drawCounter(false);
  drawPainting();
  screen().write([
    { t: T.boot.kicker, size: 34, color: HEAD, weight: 700, spacing: 8 },
    { t: T.boot.title, size: 120, weight: 700 },
    { t: T.boot.prompt, size: 50, color: SOFT, weight: 500 }
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
  scene.addEventListener('exit-vr', () => { xrVisible = true; });
  setState('idle');
  if (scene.hasLoaded) boot(); else scene.addEventListener('loaded', boot);
}
