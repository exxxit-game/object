// Headless run of room 01 in Chromium and Firefox: the page loads without errors,
// the scene builds, and pressing Space starts the experiment. Needs Playwright
// (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium, firefox } from 'playwright';
import { startServer } from './static-server.mjs';

const server = await startServer(0);
const url = `http://localhost:${server.address().port}/`;
let failed = false;

// Headless CI machines have no GPU: force software WebGL in Firefox.
const FIREFOX_PREFS = {
  'webgl.disabled': false,
  'webgl.force-enabled': true,
  'webgl.enable-webgl2': true,
  'webgl.forbid-software': false,
  'gfx.webrender.software': true
};

async function run(name, type, args, firefoxUserPrefs) {
  const browser = await type.launch({ args, firefoxUserPrefs });
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
    await page.waitForFunction(() => document.documentElement.dataset.roomState === 'run', null, { timeout: 15000 });
    assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
    console.log(`smoke test (${name}): ok`);
  } catch (e) {
    failed = true;
    const shown = await page.evaluate(() => document.getElementById('hint')?.textContent).catch(() => '');
    console.error(`smoke test (${name}): FAILED: ${e.message}`);
    console.error(`  errors on page: ${errors.join(' | ') || 'none'}`);
    console.error(`  text on screen: ${shown || 'none'}`);
  } finally {
    await browser.close();
  }
}

await run('chromium', chromium, ['--use-gl=swiftshader', '--enable-unsafe-swiftshader']);
await run('firefox', firefox, [], FIREFOX_PREFS);
server.close();
if (failed) process.exit(1);
