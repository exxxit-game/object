// End-to-end check of the default room inside a Meta Quest connected by USB.
// Plays the whole room in the headset browser at 10× speed, then prints a report:
// screens shown, voice lines played, page errors, frame rate, and a screenshot.
//
// Usage: node tools/quest-check.mjs [url]
//   url defaults to http://localhost:3000/ (run `npm run serve` first; adb reverse maps it).
// Needs: adb in PATH, headset awake (for a headset lying on a table:
//   adb shell am broadcast -a com.oculus.vrpowermanager.prox_close
//   and afterwards: adb shell am broadcast -a com.oculus.vrpowermanager.automation_disable).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

// 10× speed so the whole room (40 trials) is checked in about three minutes.
const URL_TO_TEST = process.argv[2] || 'http://localhost:3000/?speed=10';
const ROOM = '01-control';
const { VOICE_LINES } = await import(new URL(`../src/rooms/${ROOM}/voice-lines.js`, import.meta.url));
// Every line is played at least once except the repeat question's answer path;
// instructions, concept twice, leave, back, 9 questions, thanks.
const EXPECTED_VOICE_FILES = VOICE_LINES.length;
const MIN_VOICE_PLAYS = 20;
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

adb('reverse', 'tcp:3000', 'tcp:3000');
adb('forward', 'tcp:9222', 'localabstract:chrome_devtools_remote');
if (!/mWakefulness=Awake/.test(adb('shell', 'dumpsys', 'power'))) {
  console.log('FAIL headset is asleep: put it on or enable worn mode (see header)');
  process.exit(1);
}

// Use the open game tab if there is one, else open the URL in the headset browser.
let tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
let tab = tabs.find(t => t.type === 'page' && /object|localhost:3000/.test(t.url));
if (!tab) {
  adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', URL_TO_TEST, 'com.oculus.browser');
  await sleep(5000);
  tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  tab = tabs.find(t => t.type === 'page' && t.url.startsWith(URL_TO_TEST.split('?')[0]));
}
if (!tab) { console.log('FAIL no browser tab with the game'); process.exit(1); }

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
  if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map(a => a.value ?? a.description).join(' '));
};
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'evaluate failed');
  return r.result?.result?.value;
};

await send('Runtime.enable');
const freshUrl = URL_TO_TEST + (URL_TO_TEST.includes('?') ? '&' : '?') + 'check=' + Date.now();
await send('Page.navigate', { url: freshUrl });
// Wait for the NEW document (the old one may still report a loaded scene).
const marker = freshUrl.split('check=')[1];
let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  await sleep(500);
  ready = await run(`location.href.includes('${marker}') && !!document.querySelector('#screen')?.components?.panel && !!document.querySelector('a-scene')?.hasLoaded`).catch(() => false);
}
if (!ready) { console.log('FAIL page did not load in 30 s'); process.exit(1); }
// Runtime.enable replays console history of earlier page loads: count only this load.
errors.length = 0;

// Hooks: count voice playback, record what the experimenter screen shows, fast timer.
await run(`(() => {
  window.__played = []; window.__screens = []; window.__states = [];
  const start = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...a) { window.__played.push(Math.round(this.buffer.duration * 10) / 10); return start.apply(this, a); };
  const panel = document.querySelector('#screen').components.panel; const write = panel.write.bind(panel);
  panel.write = (blocks, opt) => { window.__screens.push(blocks.map(b => b.t).join(' | ')); return write(blocks, opt); };
  new MutationObserver(() => window.__states.push(document.documentElement.dataset.roomState)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-room-state'] });
  return 1;
})()`);

const page = await run(`({ url: location.href, screenPx: document.querySelector('#screen').getAttribute('panel').px, voiceFiles: performance.getEntriesByType('resource').filter(e => e.name.includes('/voice/')).length })`);

// A trusted key press gives the page user activation (audio may start), then the
// room is played: consent without recording, understood, presses on some trials,
// every question, every reveal page.
const key = { key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 };
await send('Input.dispatchKeyEvent', { type: 'keyDown', ...key });
await send('Input.dispatchKeyEvent', { type: 'keyUp', ...key });
await run(`(async () => {
  const st = () => document.documentElement.dataset.roomState; const w = (ms) => new Promise(r => setTimeout(r, ms));
  const pick = async (i) => { for (;;) { const a = [...document.querySelectorAll('.answer')].find(e => +e.dataset.index === i); if (a) { a.emit('click'); return; } await w(150); } };
  (async () => {
    await pick(0); // corridor: "next" after the welcome
    await pick(1); // start without recording
    while (document.documentElement.dataset.lobby !== 'door') await w(150);
    document.querySelector('#door1 .clickable').emit('click');
    for (let c = 0; c < 2; c++) {
      while (!(st() === 'intro' && document.querySelectorAll('.answer').length === 2)) await w(150);
      await pick(0);
      while (document.querySelectorAll('.answer').length) await w(100);
    }
    while (st() !== 'run') await w(100);
    let k = 0;
    while (st() === 'run') { if (document.querySelector('#yellow').getAttribute('material').emissiveIntensity > 0 && k++ % 3 === 0) document.querySelector('#buttonCap').emit('click'); await w(60); }
    for (let q = 0; q < 10; q++) { // 5 scales + 5 choices (src/rooms/01-control/questions.js)
      // the experimenter speaks first: wait until a scale or several answers are shown
      while (!document.querySelector('.scale-bar') && document.querySelectorAll('.answer').length < 2) await w(150);
      await w(300);
      const bar = document.querySelector('.scale-bar');
      if (bar) { const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p); bar.emit('click', { intersection: { point: p } }); await w(300); }
      await pick(0);
    }
    while (st() !== 'done') await w(200);
    for (let i = 0; i < 5; i++) { await w(2500); await pick(0); }
  })();
  return 1;
})()`);
const fps = await run(`new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); }; requestAnimationFrame(f); })`);
await run(`new Promise(r => { const t = setInterval(() => { if (document.documentElement.dataset.roomState === 'done') { clearInterval(t); r(1); } }, 300); setTimeout(() => r(0), 300000); })`);
await sleep(19000);
const result = await run(`({ states: window.__states, played: window.__played, screens: window.__screens, drawCalls: document.querySelector('a-scene').renderer.info.render.calls })`);

// Screenshot of what the headset shows, via the Quest capture service.
let shot = 'not taken';
try {
  adb('shell', 'am', 'startservice', '-n', 'com.oculus.metacam/.capture.CaptureService', '-a', 'TAKE_SCREENSHOT');
  await sleep(2500);
  const latest = adb('shell', 'ls', '-t', '/sdcard/Oculus/Screenshots/').split(/\s+/).filter(Boolean)[0];
  if (latest) { adb('pull', `/sdcard/Oculus/Screenshots/${latest}`, 'quest-check.jpg'); shot = 'quest-check.jpg'; }
} catch (e) { shot = 'failed: ' + e.message.split('\n')[0]; }

const checks = [
  ['tested build is the requested URL', page.url.startsWith(URL_TO_TEST.split('?')[0])],
  ['all voice recordings loaded', page.voiceFiles === EXPECTED_VOICE_FILES],
  ['room went idle -> intro -> run -> questions -> done', ['intro', 'run', 'questions', 'done'].every(s => result.states.includes(s))],
  [`voice played at least ${MIN_VOICE_PLAYS} times`, result.played.length >= MIN_VOICE_PLAYS],
  ['all questions shown', result.screens.some(s => s.includes('управляли зелёной лампой?')) && result.screens.some(s => s.includes('знали этот опыт'))],
  ['reveal: what you did', result.screens.some(s => s.startsWith('ЧТО ВЫ ДЕЛАЛИ'))],
  ['reveal: the truth', result.screens.some(s => s.startsWith('КАК БЫЛО НА САМОМ ДЕЛЕ'))],
  ['reveal: original and replication', result.screens.some(s => s.startsWith('ОРИГИНАЛ')) && result.screens.some(s => s.startsWith('ПОВТОРЕНИЕ'))],
  ['reveal: differences with the share line', result.screens.some(s => s.startsWith('ЧЕМ ЭТА КОМНАТА') && s.includes('Не рассказывайте'))],
  ['no page errors', errors.length === 0],
  ['frame rate at least 60', fps >= 60]
];
console.log(`URL ${page.url}\nscreen resolution ${page.screenPx}, draw calls ${result.drawCalls}, fps ${fps}`);
console.log(`voice durations: ${result.played.join(', ') || 'none'}`);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (errors.length) console.log('errors:\n  ' + errors.join('\n  '));
console.log('screenshot:', shot);
ws.close();
process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
