// Headless run of the default room from consent to the last reveal page at
// 20× speed (?speed=20; such runs are never sent): consent, instructions,
// 40 trials with some presses, every question, every reveal page, no page errors.
// Needs Playwright + Chromium (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';

const server = await startServer(0);
const url = `http://localhost:${server.address().port}/?speed=20`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const state = () => page.evaluate(() => document.documentElement.dataset.roomState);
const waitState = (s, timeout = 60000) =>
  page.waitForFunction((x) => document.documentElement.dataset.roomState === x, s, { timeout });
const answers = () => page.evaluate(() => document.querySelectorAll('.answer').length);
// clicks the answer button with this index, waiting until it exists
const pick = async (i) => {
  await page.waitForFunction((n) => [...document.querySelectorAll('.answer')].some(e => +e.dataset.index === n), i, { timeout: 30000 });
  await page.evaluate((n) => [...document.querySelectorAll('.answer')].find(e => +e.dataset.index === n).emit('click'), i);
};

try {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
  assert.equal(await state(), 'idle');
  await pick(1);                       // start without recording
  await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro' &&
    document.querySelectorAll('.answer').length === 2, null, { timeout: 30000 });
  await pick(0);                       // understood
  await waitState('run');
  // press during about every other yellow light
  await page.evaluate(() => {
    window.__presser = setInterval(() => {
      const on = document.querySelector('#yellow').getAttribute('material').emissiveIntensity > 0;
      if (on && Math.random() < 0.1) document.querySelector('#buttonCap').emit('click');
    }, 20);
  });
  await waitState('questions', 120000);
  await page.evaluate(() => clearInterval(window.__presser));
  for (let k = 0; k < 9; k++) {
    await page.waitForFunction(() => document.querySelector('.scale-bar') || document.querySelectorAll('.answer').length > 1, null, { timeout: 30000 });
    const isScale = await page.evaluate(() => !!document.querySelector('.scale-bar'));
    if (isScale) {
      await page.evaluate(() => {
        const bar = document.querySelector('.scale-bar');
        const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p);
        bar.emit('click', { intersection: { point: p } });
      });
    }
    await pick(0);
    await page.waitForTimeout(100);
  }
  await waitState('done');
  for (let i = 0; i < 5; i++) await pick(0);  // reveal pages; the last button restarts
  await waitState('intro');

  assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  console.log('smoke test: ok');
} finally {
  await browser.close();
  server.close();
}
