// Headless run of room 01 from start to finish with 5-second rounds: the page
// loads, Space starts, the question is answered, round 2 runs, the reveal ends
// in state "done", with no page errors. Needs Playwright + Chromium
// (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';

const server = await startServer(0);
const url = `http://localhost:${server.address().port}/?roundsecs=5`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

try {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'idle');
  assert.equal(await page.evaluate(() => document.querySelectorAll('.clickable').length), 4);

  await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'intro');
  await page.waitForFunction(() => document.documentElement.dataset.roomState === 'run', null, { timeout: 20000 });
  await page.waitForFunction(() => document.documentElement.dataset.roomState === 'question', null, { timeout: 20000 });
  await page.evaluate(() => document.querySelector('.answer').emit('click'));
  await page.waitForFunction(() => document.documentElement.dataset.roomState === 'done', null, { timeout: 30000 });

  assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  console.log('smoke test: ok');
} finally {
  await browser.close();
  server.close();
}
