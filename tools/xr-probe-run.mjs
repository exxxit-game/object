// Runs tools/xr-probe.html in the headset without the owner wearing it: opens the page,
// presses its buttons over the debug link (a click sent that way counts as the user's,
// so the browser allows VR, MR and the microphone) and prints what the headset gave.
// Needs: node tools/quest-wifi.mjs (or the cable) and `npm run serve`; the headset must
// be awake (quest-wifi keeps it awake). Usage: node tools/xr-probe-run.mjs [vr ar mic]
import { execFileSync } from 'node:child_process';

const URL_PROBE = 'http://localhost:3000/tools/xr-probe.html';
const steps = process.argv.slice(2).length ? process.argv.slice(2) : ['vr', 'ar', 'mic'];
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

adb('reverse', 'tcp:3000', 'tcp:3000');
adb('forward', 'tcp:9222', 'localabstract:chrome_devtools_remote');
const list = async () => (await fetch('http://127.0.0.1:9222/json/list')).json();
let tab = (await list()).find((t) => t.type === 'page' && t.url.startsWith('http://localhost:3000'));
if (!tab) {
  adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', URL_PROBE, 'com.oculus.browser');
  await sleep(4000);
  tab = (await list()).find((t) => t.type === 'page' && t.url.startsWith('http://localhost:3000'));
}
if (!tab) { console.log('FAIL no browser tab'); process.exit(1); }
await fetch(`http://127.0.0.1:9222/json/activate/${tab.id}`).catch(() => {});

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
// userGesture: the browser treats the call as the user's own click (needed for VR, MR, mic);
// synthetic mouse events do not reach a page in the headset's browser panel.
const run = async (expression, userGesture = false) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture })).result?.result?.value;

await send('Page.setWebLifecycleState', { state: 'active' });
await send('Page.bringToFront');
await send('Page.navigate', { url: `${URL_PROBE}?run=${Date.now()}` });
await sleep(3000);
await run(`localStorage.removeItem('xr-probe'), window.__probe = {}, 1`);

const KEY = { vr: 'immersive-vr', ar: 'immersive-ar', mic: 'mic' };
for (const step of steps) {
  await run(`document.getElementById('${step}').click(), 1`, true);
  // a session runs up to 5 s (longer when the headset lies on a table), then ends
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    const done = await run(`(() => { const r = (window.__probe || {})['${KEY[step]}']; return !!r && (r.frames !== undefined || r.error !== undefined || r.granted !== undefined); })()`);
    if (done) break;
  }
  await sleep(1500);
}
const probe = await run('JSON.stringify(window.__probe)');
ws.close();
const p = JSON.parse(probe || '{}');
for (const [k, r] of Object.entries(p)) {
  const short = { ...r };
  if (Array.isArray(short.planes)) short.planes = `${short.planes.length}: ${[...new Set(short.planes)].join(', ')}`;
  if (Array.isArray(short.meshes)) short.meshes = `${short.meshes.length}: ${[...new Set(short.meshes)].join(', ')}`;
  console.log(k, JSON.stringify(short));
}
