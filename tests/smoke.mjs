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

async function playRoom(url, playtest, { leave = false } = {}) {
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
    if (sheet.dataset.orphan) out.push('a blank to fill in stands on a line of its own');
    if (Number(sheet.dataset.letterMm) < 24) out.push(`text ${sheet.dataset.letterMm} mm, under 24 mm`);
    for (const a of answers) {
      a.object3D.getWorldPosition(p);
      const d = p.distanceTo(eye);
      if (deg(a.dataset.letterMm / 1000, d) < 1.2) out.push(`letters ${deg(a.dataset.letterMm / 1000, d).toFixed(2)}° < 1.2°`);
      if (deg(a.getAttribute('panel').h, d) < 2.5) out.push(`button ${deg(a.getAttribute('panel').h, d).toFixed(2)}° < 2.5°`);
    }
    if (answers.length <= 4 && new Set(answers.map(a => a.object3D.position.x.toFixed(3))).size > 1) out.push('answers in two columns');
    return out;
  });
  // Light falling on a level white card at a point (a light meter): the card is drawn alone
  // from just above, and its linear brightness is read.
  const lightAt = (p) => page.evaluate(([x, y, z]) => {
    const sc = document.querySelector('a-scene'), r = sc.renderer;
    const rt = new THREE.WebGLRenderTarget(8, 8);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 }));
    card.rotation.x = -Math.PI / 2;
    card.position.set(x, y, z);
    sc.object3D.add(card);
    const cam = new THREE.PerspectiveCamera(10, 1, 0.01, 2);
    cam.position.set(x, y + 0.3, z);
    cam.lookAt(x, y, z);
    sc.object3D.updateMatrixWorld(true);
    r.setRenderTarget(rt);
    r.render(sc.object3D, cam);
    const px = new Uint8Array(4 * 64);
    r.readRenderTargetPixels(rt, 0, 0, 8, 8, px);
    r.setRenderTarget(null);
    sc.object3D.remove(card);
    let sum = 0;
    for (let i = 0; i < 64; i++) sum += (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
    return sum / 64;
  }, p);
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
  // The studio's poster cuts in with "leave?" on the clipboard (src/app/lobby/exit.js); "stay" gives
  // back the page that was there, with its answers, on its hook or in front (sheet.js resume).
  const sheetState = () => page.evaluate(() => {
    const s = document.querySelector('.sheet');
    return { take: !!s.dataset.take, open: !!s.dataset.open, answers: s.querySelectorAll('.answer').length, text: s.dataset.textBottom };
  });
  const askLeave = async () => {
    await page.evaluate(() => document.querySelector('#notePoster').emit('click'));
    await page.waitForFunction(() => document.querySelector('.sheet[data-open]') && document.querySelectorAll('.sheet .answer').length === 2, null, { timeout: 30000 });
  };
  const exitThenStay = async () => {
    const before = await sheetState();
    await askLeave();
    await pick(1);
    await page.waitForFunction((b) => {
      const s = document.querySelector('.sheet');
      return !!s.dataset.take === b.take && !!s.dataset.open === b.open && s.querySelectorAll('.answer').length === b.answers && s.dataset.textBottom === b.text;
    }, before, { timeout: 30000 });
  };
  // The consent form is signed by hand: a field over the name's and the signature's blanks, listed
  // for the mouse and the lasers, and no button until both have writing (src/engine/ui/ink.js).
  const signForm = async () => {
    await page.waitForFunction(() => document.querySelectorAll('.sheet .ink-field').length === 2, null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => document.querySelectorAll('.sheet .answer').length), 0, 'the form moves on before it is signed');
    const listed = await page.evaluate(() => {
      const rc = document.querySelector('a-scene').components.raycaster;
      return [...document.querySelectorAll('.ink-field')].every((f) => rc.objects.some((o) => { for (let x = o; x; x = x.parent) if (x.el === f) return true; return false; }));
    });
    assert.ok(listed, 'the fields to sign are not listed for the mouse and the lasers');
    await page.evaluate(() => document.querySelectorAll('.ink-field').forEach((f) => f.components.ink.addStroke([[0.1, 0.6], [0.4, 0.3], [0.7, 0.6], [0.9, 0.4]])));
    await pick(0);
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
    // the poster pressed while the sign still plays: the clipboard's "take me" page comes
    // while the question is open and waits behind it; "stay" puts it on its hook, ready
    await page.waitForFunction(() => document.querySelector('.sheet')?.getAttribute('visible'), null, { timeout: 30000 });
    if (!playtest && !leave) {
      await askLeave();
      await page.waitForFunction(() => document.querySelector('.sheet[data-take]'), null, { timeout: 60000 });
      assert.equal(await page.evaluate(() => document.querySelectorAll('.sheet .answer').length), 2, 'the leave question was drawn over');
      await pick(1);
      await page.waitForFunction(() => {
        const s = document.querySelector('.sheet');
        return s.dataset.take && !s.dataset.open && !s.querySelector('.answer') && s.querySelector('.paper').classList.contains('clickable');
      }, null, { timeout: 30000 });
    }
    // corridor: the sign plays, then the clipboard is taken from the board and welcomes
    await page.waitForFunction(() => document.querySelector('.sheet[data-take]'), null, { timeout: 60000 });
    const corridorLight = await lightAt([0.6, 0.01, 2.7]);   // the corridor floor, door shut
    if (leave) {
      // "leave" fades out, ends the game and says how to come back
      await askLeave();
      await pick(0);
      await page.waitForFunction(() => document.documentElement.dataset.left === '1' && document.querySelector('#hint.show'), null, { timeout: 30000 });
      assert.deepEqual(errors, [], `page errors: ${errors.join(' | ')}`);
      return;
    }
    if (!playtest) await exitThenStay();   // the clipboard waits on its hook to be taken
    await page.evaluate(() => document.querySelector('.sheet[data-take]').emit('click'));
    // ending b leaves only "you" lit; taking the clipboard brings the whole name back
    if (url.includes('sign=b')) {
      await page.waitForFunction(() => document.querySelector('#signFace').components.lightbox.levels.slice(0, 4).every(l => l >= 0.9), null, { timeout: 10000 });
    }
    if (!playtest) {                     // the welcome page, in front of the player
      await page.waitForFunction(() => document.querySelectorAll('.sheet .answer').length === 1, null, { timeout: 30000 });
      await exitThenStay();
    }
    await pick(0);                       // "next" after the welcome
    await signForm();                    // consent page 1, the form: signed by hand, then "next"
    if (playtest) await pick(0);         // the playtest note, a page of its own
    if (playtest) {
      await pick(1);                     // the age: "no" leads to a page of its own,
      await pick(0);                     // which starts without recording
    } else {
      await pick(0);                     // the age: "yes"
      await pick(1);                     // last consent page: start without recording
    }
    // the door to room 1 opens when pointed at
    await page.waitForFunction(() => document.documentElement.dataset.lobby === 'door', null, { timeout: 30000 });
    if (!playtest) {
      // under the leave question door 1 stays shut; after "stay" it opens
      await askLeave();
      await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.lobby), 'door', 'door 1 opened under the leave question');
      await pick(1);
      await page.waitForFunction(() => !document.querySelector('.sheet[data-open]'), null, { timeout: 30000 });
    }
    await page.evaluate(() => document.querySelector('#door1 .clickable').emit('click'));
    // through the door the poster stops answering (the lasers reach it through the walls)
    assert.equal(await page.evaluate(() => document.querySelector('#notePoster').classList.contains('clickable')), false, 'the poster still answers from the room');
    // "understood" twice: after the instructions and after the control concept
    for (let i = 0; i < 2; i++) {
      await page.waitForFunction(() => document.documentElement.dataset.roomState === 'intro' &&
        document.querySelectorAll('.answer').length === 2, null, { timeout: 30000 });
      await pick(0);
      await page.waitForFunction(() => document.querySelectorAll('.answer').length === 0, null, { timeout: 30000 });
    }
    await waitState('run');
    // Corridors under 10 fc, desks 50 fc (docs/building-standards.md, S13): the corridor
    // floor gets at most a fifth of the light on the room's desk, and is not left dark (the
    // 0.1 floor is our choice, so the corridor stays visible).
    const ratio = corridorLight / await lightAt([0.4, 0.846, -0.3]);
    assert.ok(ratio <= 0.2 && ratio >= 0.1, `corridor floor / room desk light = ${ratio.toFixed(3)} (0.1–0.2)`);
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
  await playRoom(`${base}&playtest=1&sign=b`, true);
  console.log('smoke test: ok (playtest)');
  await playRoom(base, false, { leave: true });
  console.log('smoke test: ok (leave from the corridor)');
} finally {
  await browser.close();
  server.close();
}
