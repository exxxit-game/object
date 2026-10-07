// End-to-end check of room 01 inside a Meta Quest connected by USB.
// Plays the whole room in the headset browser (fast timer), then prints a report:
// screens shown, voice lines played, page errors, frame rate, and a screenshot.
//
// Usage: node tools/quest-check.mjs [url]
//   url defaults to http://localhost:3000/ (run `npm run serve` first; adb reverse maps it).
// Needs: adb in PATH, headset awake (for a headset lying on a table:
//   adb shell am broadcast -a com.oculus.vrpowermanager.prox_close
//   and afterwards: adb shell am broadcast -a com.oculus.vrpowermanager.automation_disable).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const URL_TO_TEST = process.argv[2] || 'http://localhost:3000/';
const EXPECTED_VOICE_LINES = 7;
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
let tab = tabs.find(t => t.type === 'page' && /objekt|localhost:3000/.test(t.url));
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
  Math.random = () => 0;
  return 1;
})()`);

const page = await run(`({ url: location.href, screenPx: document.querySelector('#screen').getAttribute('panel').px, voiceFiles: performance.getEntriesByType('resource').filter(e => e.name.includes('/voice/')).length })`);

// Start like a player would (a trusted key press also unlocks audio), then act during the run.
const key = { key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 };
await send('Input.dispatchKeyEvent', { type: 'keyDown', ...key });
await send('Input.dispatchKeyEvent', { type: 'keyUp', ...key });
await run(`(async () => {
  const st = () => document.documentElement.dataset.roomState; const w = (ms) => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 100 && st() !== 'run'; i++) await w(200);
  const lev = [...document.querySelectorAll('.clickable')].slice(0, 3); const p = document.querySelector('#painting');
  let i = 0;
  (async () => { while (st() === 'run') { if (i % 7 < 4) lev[i % 3].emit('click'); if (i % 6 === 0) { p.emit('look-change', { seen: true }); p.emit('look-change', { seen: false }); } i++; await w(600); } })();
  return 1;
})()`);
const fps = await run(`new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); }; requestAnimationFrame(f); })`);
await run(`new Promise(r => { const t = setInterval(() => { if (document.documentElement.dataset.roomState === 'done') { clearInterval(t); r(1); } }, 300); setTimeout(() => r(0), 120000); })`);
await sleep(24000);
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
  ['all voice recordings loaded', page.voiceFiles === EXPECTED_VOICE_LINES],
  ['room went idle -> intro -> run -> done', ['intro', 'run', 'done'].every(s => result.states.includes(s))],
  [`voice played ${EXPECTED_VOICE_LINES} lines`, result.played.length === EXPECTED_VOICE_LINES],
  ['report screen 1 shown', result.screens.some(s => s.startsWith('ЧТО ТЫ ДЕЛАЛ') && !s.includes('Посмотри налево'))],
  ['report screen 2 shown', result.screens.some(s => s.includes('Посмотри налево'))],
  ['original screen shown', result.screens.some(s => s.startsWith('ОРИГИНАЛ'))],
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
