// Headless runs of the default room from consent to the last screen at 20× speed
// (?speed=20; such runs are never sent): once normally and once in playtest mode
// (?playtest=1, five playtest questions after the reveal). Checks that no button
// covers text, answers have one readable size, and the page logs no errors.
// Needs Playwright + Chromium (heavy: run it in CI, not on a laptop).
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { startServer } from './static-server.mjs';

const server = await startServer(0);
const base = `http://localhost:${server.address().port}/?speed=20`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });

async function playRoom(url, playtest) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  const waitState = (s, timeout = 60000) =>
    page.waitForFunction((x) => document.documentElement.dataset.roomState === x, s, { timeout });
  // No button or scale may cover the text on the screen: the top edge of every
  // widget must be below the last line (#screen data-text-bottom, metres).
  const overlaps = () => page.evaluate(() => {
    const bottom = Number(document.querySelector('#screen').dataset.textBottom);
    const p = new THREE.Vector3();
    return [...document.querySelectorAll('.answer, .scale-bar')].map((el) => {
      el.object3D.getWorldPosition(p);
      const top = p.y + el.getAttribute('panel').h / 2;
      return top > bottom + 0.001 ? `${el.className} top ${top.toFixed(3)} > text ${bottom}` : null;
    }).filter(Boolean);
  });
  // clicks the answer button with this index, waiting until it exists
  const pick = async (i) => {
    await page.waitForFunction((n) => [...document.querySelectorAll('.answer')].some(e => +e.dataset.index === n), i, { timeout: 30000 });
    assert.deepEqual(await overlaps(), [], 'a button covers the text');
    // all answers of a question share one readable text size
    const sizes = await page.evaluate(() => [...new Set([...document.querySelectorAll('.answer')].map(e => Number(e.dataset.size)))]);
    assert.equal(sizes.length, 1, `answer sizes differ: ${sizes}`);
    assert.ok(sizes[0] >= 30, `answer text too small: ${sizes[0]}px`);
    await page.evaluate((n) => [...document.querySelectorAll('.answer')].find(e => +e.dataset.index === n).emit('click'), i);
  };
  // answers one question: a scale (click its middle, then "done") or a choice
  const answer = async () => {
    await page.waitForFunction(() => document.querySelector('.scale-bar') || document.querySelectorAll('.answer').length > 1, null, { timeout: 30000 });
    if (await page.evaluate(() => !!document.querySelector('.scale-bar'))) {
      assert.deepEqual(await overlaps(), [], 'the scale covers the text');
      await page.evaluate(() => {
        const bar = document.querySelector('.scale-bar');
        const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p);
        bar.emit('click', { intersection: { point: p } });
      });
    }
    await pick(0);
    await page.waitForTimeout(100);
  };

  try {
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('a-scene')?.hasLoaded, null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.roomState), 'idle');
    await pick(1);                       // start without recording
    // "understood" twice: after the instructions and after the control concept
    for (let i = 0; i < 2; i++) {
      await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro' &&
        document.querySelectorAll('.answer').length === 2, null, { timeout: 30000 });
      await pick(0);
      await page.waitForFunction(() => document.querySelectorAll('.answer').length === 0, null, { timeout: 30000 });
    }
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
    for (let k = 0; k < 9; k++) await answer();
    await waitState('done');
    for (let i = 0; i < 6; i++) await pick(0);   // reveal pages
    if (playtest) {
      for (let k = 0; k < 5; k++) await answer(); // playtest questions
      await pick(0);                              // thanks → play again
    }
    await waitState('intro');
    assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
  } finally {
    await page.close();
  }
}

try {
  await playRoom(base, false);
  console.log('smoke test: ok (normal)');
  await playRoom(`${base}&playtest=1`, true);
  console.log('smoke test: ok (playtest)');
} finally {
  await browser.close();
  server.close();
}
