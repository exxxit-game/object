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
  // No button or scale may cover the text: the top edge of every widget must be below
  // the last line. On the clipboard sheet in its own metres (data-text-bottom of .sheet),
  // on the room's wall screen in world metres (#screen data-text-bottom).
  const overlaps = () => page.evaluate(() => {
    const sheet = document.querySelector('.sheet[data-open]');
    const p = new THREE.Vector3();
    return [...document.querySelectorAll('.answer, .scale-bar')].map((el) => {
      const onSheet = !!el.closest('.sheet');
      const bottom = Number((onSheet ? sheet : document.querySelector('#screen')).dataset.textBottom);
      if (onSheet) p.copy(el.object3D.position); else el.object3D.getWorldPosition(p);
      const top = p.y + el.getAttribute('panel').h / 2;
      return top > bottom + 0.001 ? `${el.className} top ${top.toFixed(3)} > text ${bottom}` : null;
    }).filter(Boolean);
  });
  // What a sheet page must satisfy (src/engine/ui/sheet-math.js; sources in docs/decisions.md):
  // nothing runs off the paper, letters at least 1.2° and buttons at least 2.5° of view from
  // the eyes, and up to four answers in one column.
  const sheetProblems = () => page.evaluate(() => {
    const sheet = document.querySelector('.sheet[data-open]');
    if (!sheet) return [];
    const eye = new THREE.Vector3(), p = new THREE.Vector3();
    document.querySelector('a-scene').camera.getWorldPosition(eye);
    const deg = (size, d) => 2 * Math.atan(size / 2 / d) * 180 / Math.PI;
    const answers = [...sheet.querySelectorAll('.answer')];
    const out = sheet.dataset.overflow ? ['the page does not fit the sheet'] : [];
    for (const a of answers) {
      a.object3D.getWorldPosition(p);
      const d = p.distanceTo(eye);
      if (deg(a.dataset.letterMm / 1000, d) < 1.2) out.push(`letters ${deg(a.dataset.letterMm / 1000, d).toFixed(2)}° < 1.2°`);
      if (deg(a.getAttribute('panel').h, d) < 2.5) out.push(`button ${deg(a.getAttribute('panel').h, d).toFixed(2)}° < 2.5°`);
    }
    if (answers.length <= 4 && new Set(answers.map(a => a.object3D.position.x.toFixed(3))).size > 1) out.push('answers in two columns');
    return out;
  });
  // clicks the answer button with this index, waiting until it exists
  const pick = async (i) => {
    // buttons accept a click once they are ready (choice.js ignores the first 0.3 s)
    await page.waitForFunction((n) => [...document.querySelectorAll('.answer')].some(e => +e.dataset.index === n && e.dataset.ready), i, { timeout: 30000 });
    assert.deepEqual(await overlaps(), [], 'a button covers the text');
    assert.deepEqual(await sheetProblems(), [], 'a sheet page breaks the reading rules');
    // all answers of a question share one readable text size
    const sizes = await page.evaluate(() => [...new Set([...document.querySelectorAll('.answer')].map(e => Number(e.dataset.size)))]);
    assert.equal(sizes.length, 1, `answer sizes differ: ${sizes}`);
    const onWall = await page.evaluate(() => !document.querySelector('.answer').closest('.sheet'));
    if (onWall) assert.ok(sizes[0] >= 30, `answer text too small: ${sizes[0]}px`);
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
    await pick(0);                       // corridor: "next" after the welcome
    await pick(0);                       // consent page 1 (what this is, leaving, 18+): "next"
    if (playtest) await pick(0);         // the playtest note, a page of its own
    await pick(1);                       // last consent page: start without recording
    // the door to room 1 opens when pointed at
    await page.waitForFunction(() => document.documentElement.dataset.lobby === 'door', null, { timeout: 30000 });
    await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
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
    for (let k = 0; k < 10; k++) await answer(); // 5 scales + 5 choices (questions.js)
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
