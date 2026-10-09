// Runs tools/xr-probe.html in the headset: opens the page, presses its buttons over the debug link
// (a click sent that way counts as the user's, so the browser allows VR, MR and the microphone)
// and prints what the headset gave. VR and MR need the owner wearing it; the microphone does not.
// Needs the laptop's server running (the app's preview, or `npm run serve`) and the headset on
// its cable; it is kept awake for the run and put back to sleep after (tools/headset.mjs).
// Usage: node tools/xr-probe-run.mjs [vr ar mic input]   (input: controllers, hands and body, 30 s)
import { serveToHeadset, worn, sleepNow, openUrl, page, wornByPerson } from './headset.mjs';

// the laptop's server: the preview's port from .claude/launch.json, or OBJECT_PORT when the preview
// took another (autoPort)
const URL_PROBE = serveToHeadset(Number(process.env.OBJECT_PORT) || undefined) + 'tools/xr-probe.html';
const steps = process.argv.slice(2).length ? process.argv.slice(2) : ['vr', 'ar', 'mic'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// VR and MR only on the owner's head: on a table the boundary window holds the request and the
// browser then refuses VR until it restarts (tools/quest-look.mjs, vr)
if (steps.some((s) => s !== 'mic') && !wornByPerson()) {
  console.log('not now: VR and MR only while the owner wears the headset (run "mic" alone without him)');
  process.exit(1);
}
worn(true);
let probePage = await page(/localhost:3000/);
if (!probePage) { openUrl(URL_PROBE); await sleep(4000); probePage = await page(/localhost:3000/); }
if (!probePage) { console.log('FAIL no browser tab'); sleepNow(); process.exit(1); }
await fetch(`http://127.0.0.1:9222/json/activate/${probePage.tab.id}`).catch(() => {});
const { send } = probePage;
// gesture: the browser treats the call as the user's own click (needed for VR, MR, mic);
// synthetic mouse events do not reach a page in the headset's browser panel.
const run = (expression, gesture = false) => probePage.run(expression, gesture);

await send('Page.setWebLifecycleState', { state: 'active' });
await send('Page.bringToFront');
await send('Page.navigate', { url: `${URL_PROBE}?run=${Date.now()}` });
await sleep(3000);
await run(`localStorage.removeItem('xr-probe'), window.__probe = {}, 1`);

const KEY = { vr: 'immersive-vr', ar: 'immersive-ar', mic: 'mic', input: 'input' };
for (const step of steps) {
  await run(`document.getElementById('${step}').click(), 1`, true);
  // a session runs up to 5 s (input 30 s; longer when the headset lies on a table), then ends
  for (let i = 0; i < (step === 'input' ? 100 : 60); i++) {
    await sleep(500);
    const done = await run(`(() => { const r = (window.__probe || {})['${KEY[step]}']; return !!r && (r.frames !== undefined || r.error !== undefined || r.granted !== undefined); })()`);
    if (done) break;
  }
  await sleep(1500);
}
const probe = await run('JSON.stringify(window.__probe)');
probePage.close();
sleepNow();
const p = JSON.parse(probe || '{}');
for (const [k, r] of Object.entries(p)) {
  const short = { ...r };
  if (Array.isArray(short.planes)) short.planes = `${short.planes.length}: ${[...new Set(short.planes)].join(', ')}`;
  if (Array.isArray(short.meshes)) short.meshes = `${short.meshes.length}: ${[...new Set(short.meshes)].join(', ')}`;
  console.log(k, JSON.stringify(short));
}
