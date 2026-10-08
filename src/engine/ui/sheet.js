import { readingPose, glidePath } from './sheet-math.js';
import { createChoice } from './choice.js';
import '../glide.js';

// The clipboard sheet: everything the player reads or answers, one thought per page.
// It is read 1 m in front of the player, a little below the eyes, and stays still
// (world-fixed) until it is closed; answers with the laser or the mouse. Why and the
// sources: docs/decisions.md, "Everything the player reads or answers is on a clipboard".
// It may hang on a hook in the room first (hang): the player clicks it (take), it glides
// to them, and after the last answer it glides back (back); docs/decisions.md, "The
// opening is calm".
// Text never shrinks to fit: a page that does not fit sets data-overflow, which the
// smoke test treats as an error (split the text into pages instead).
const PAPER = { w: 0.56, h: 0.72 };
const BOARD = { w: 0.6, h: 0.78, d: 0.006 };
const MARGIN = 0.04;
const DENSITY = 2 * 1024 / 1.5;   // canvas px per metre: sharp when read from 1 m (choice.js)
const BUTTON_H = 0.07;            // about 4 degrees at 1 m (Meta: targets at least 2.5)
const GAP = 0.025;
const UNDER_TEXT = 0.03;
const PAPER_BG = '#e9e2cf';       // cream, not white: a large white page glares in a headset
const WOOD = '#7a5c3e';
const WOOD_HOVER = '#a07a52';     // the hanging clipboard brightens under the laser or mouse
// Text roles: letter height in metres at 1 m (at least 21 mm, about 1.2 degrees) and ink.
const ROLES = {
  kicker: { m: 0.022, color: '#6b6457', weight: 700, spacing: 6 },
  title: { m: 0.048, color: '#1d1b17', weight: 700 },
  body: { m: 0.028, color: '#1d1b17', weight: 500 },
  soft: { m: 0.024, color: '#4a453c', weight: 500 }
};

// inside: the wall faces of the space { minX, maxX, minZ, maxZ }; the sheet is never read
// beyond them (sheet-math.js, readingPose).
export function createSheet(scene, { inside = null } = {}) {
  const el = document.createElement('a-entity');
  el.classList.add('sheet');
  el.setAttribute('visible', false);
  el.setAttribute('glide', '');
  el.innerHTML = `
    <a-box class="board" width="${BOARD.w}" height="${BOARD.h}" depth="${BOARD.d}" position="0 0 ${-BOARD.d / 2 - 0.004}" material="color: ${WOOD}; roughness: 0.8"></a-box>
    <a-entity class="paper" panel="w: ${PAPER.w}; h: ${PAPER.h}; px: ${Math.round(PAPER.w * DENSITY)}; bg: ${PAPER_BG}"></a-entity>
    <a-box width="0.16" height="0.05" depth="0.02" position="0 ${PAPER.h / 2} 0.01" material="color: #c9ccce; metalness: 0.8; roughness: 0.3"></a-box>`;
  scene.appendChild(el);
  const choice = createChoice(el, {
    x: 0, y: 0, z: 0.005, w: PAPER.w - 2 * MARGIN, h: BUTTON_H, gap: GAP,
    bottom: -PAPER.h / 2 + MARGIN, density: DENSITY
  });
  // An entity added to a running scene starts its components a moment later: pages wait.
  const paperEl = el.querySelector('.paper');
  const ready = new Promise((resolve) => {
    if (paperEl.hasLoaded) resolve(); else paperEl.addEventListener('loaded', resolve, { once: true });
  });
  const paper = () => paperEl.components.panel;
  const board = el.querySelector('.board');
  let isOpen = false;
  let page = { blocks: null, labels: null, onPick: null };   // what it shows, to come back to
  let waitingTake = false;
  let asking = false, saved = null;
  let home = null;   // { pos: [x, y, z], yaw, away: [x, y, z] } while it has a hook
  // The paper is drawn unlit so it reads well; on its hook it is dimmed to the light of the
  // room around it (or it would glow in a dim corridor), and brightens on the way to the player.
  let hookLight = 1;
  const tint = (v) => { const m = paperEl.getObject3D('mesh'); if (m) m.material.color.setScalar(v); };

  function front() {
    const cam = scene.camera;
    const head = new THREE.Vector3(), q = new THREE.Quaternion();
    cam.getWorldPosition(head);
    cam.getWorldQuaternion(q);
    const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y;
    return readingPose(head.toArray(), yaw, home, inside, BOARD.w / 2);
  }

  function eyes() {
    const head = new THREE.Vector3();
    scene.camera.getWorldPosition(head);
    return head.toArray();
  }

  function place() {
    const p = front();
    el.object3D.position.fromArray(p.pos);
    el.object3D.rotation.set(p.pitch, p.yaw, 0, 'YXZ');
  }
  // the player was placed again (VR entry, recenter, headset put back on) or moved with the
  // thumbsticks: follow them; a sheet on its way to them goes to their new place once it arrives
  let movedOnTheWay = false;
  const follow = () => {
    if (!isOpen) return;
    if (el.components.glide.trip) movedOnTheWay = true; else setTimeout(place, 50);
  };
  scene.addEventListener('recentered', follow);
  scene.addEventListener('player-moved', follow);

  function glideTo(pos, rotation, step) {
    const { ctrl, ms } = glidePath(el.object3D.position.toArray(), pos, home.away, eyes());
    return el.components.glide.go({ to: pos, ctrl, rotation, ms, step });
  }

  async function comeToPlayer() {
    const p = front();
    await glideTo(p.pos, [p.pitch, p.yaw, 0], (e) => tint(hookLight + (1 - hookLight) * e));
    if (movedOnTheWay) { movedOnTheWay = false; place(); }
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    el.setAttribute('visible', true);
    el.dataset.open = '1';
    if (home) { comeToPlayer(); return; }
    place();
    el.setAttribute('animation', { property: 'scale', from: '0.94 0.94 0.94', to: '1 1 1', dur: 150 });
  }

  function close() {
    choice.hide();
    isOpen = false;
    el.setAttribute('visible', false);
    delete el.dataset.open;
  }

  // Hangs the sheet on a hook showing a cover page (blocks as in write); light: how bright the
  // paper looks there (0..1), as lit as the room around the hook.
  async function hang(pose, cover, light = 1) {
    await ready;
    home = pose;
    hookLight = light;
    tint(light);
    el.object3D.position.fromArray(pose.pos);
    el.object3D.rotation.set(0, pose.yaw, 0, 'YXZ');
    el.setAttribute('visible', true);
    setPage({ blocks: cover });
  }

  // Lasers and the mouse keep a list of what they can hit; a class change on an entity
  // that is already in the scene does not update it.
  const clickable = (on) => {
    for (const part of [board, paperEl]) part.classList.toggle('clickable', on);
    for (const r of [scene, ...scene.querySelectorAll('[raycaster]')]) r.components.raycaster?.refreshObjects();
  };

  // Resolves once the player clicked the hanging sheet and it has reached them. blocks, if
  // given, are shown on it while it waits (what the voice says, for a player without sound).
  function take(blocks) {
    if (blocks) setPage({ blocks });
    if (!asking) clickable(true);   // else resume() makes it so, once the question is gone
    waitingTake = true;
    const hover = (on) => board.setAttribute('material', 'color', on ? WOOD_HOVER : WOOD);
    const enter = () => { if (!asking) hover(true); }, leave = () => hover(false);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.dataset.take = '1';
    return new Promise((resolve) => {
      // a click on a question that cut in (interrupt) is not a take
      const onClick = async () => {
        if (asking) return;
        el.removeEventListener('click', onClick);
        waitingTake = false;
        el.emit('taken', null, false);
        delete el.dataset.take;
        clickable(false);
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        hover(false);
        isOpen = true;
        el.dataset.open = '1';
        await comeToPlayer();
        resolve();
      };
      el.addEventListener('click', onClick);
    });
  }

  // Back on its hook (after the last answer); blocks, if given, are shown there.
  async function back(blocks) {
    choice.hide();
    isOpen = false;
    delete el.dataset.open;
    await glideTo(home.pos, [0, home.yaw, 0], (e) => tint(1 - (1 - hookLight) * e));
    if (blocks) setPage({ blocks });
  }

  // Every page change goes through here. While a question has cut in (interrupt), the new page
  // is kept for resume() instead of being drawn over the question, and its answers wait with it.
  // Returns the top of the answer buttons, or null when kept.
  function setPage({ blocks, labels = null, onPick = null }) {
    if (asking && saved) { Object.assign(saved, { blocks, labels, onPick }); return null; }
    page = { blocks, labels, onPick };
    const top = paint(blocks || []) - UNDER_TEXT;
    if (labels) {
      const needed = labels.length * BUTTON_H + (labels.length - 1) * GAP;
      if (top - needed < -PAPER.h / 2 + MARGIN) el.dataset.overflow = '1';
      choice.show(labels, onPick, top);
    } else choice.hide();
    return top;
  }

  // A question that cuts in on whatever the sheet shows (leaving the game): a hanging sheet
  // comes to the player first, a closed one opens. Resolves with the index picked; resume()
  // then shows the current page again (or one that came meanwhile) and puts the sheet back
  // where it was. Null while one is already asked.
  async function interrupt(blocks, labels) {
    await ready;
    if (asking) return null;
    asking = true;
    while (el.components.glide.trip) await new Promise((r) => setTimeout(r, 100));
    saved = { ...page, was: isOpen ? 'open' : home ? 'hanging' : 'closed' };
    if (saved.was === 'hanging') {
      clickable(false);
      isOpen = true;
      el.dataset.open = '1';
      await comeToPlayer();
    } else if (saved.was === 'closed') open();
    const top = paint(blocks) - UNDER_TEXT;
    return new Promise((resolve) => choice.show(labels, resolve, top));
  }

  async function resume() {
    if (!saved) return;
    choice.hide();
    if (saved.was === 'hanging') {
      isOpen = false;
      delete el.dataset.open;
      await glideTo(home.pos, [0, home.yaw, 0], (e) => tint(1 - (1 - hookLight) * e));
    }
    const p = saved;
    saved = null;
    asking = false;
    setPage(p);
    if (p.was === 'hanging' && waitingTake) clickable(true);
    if (p.was === 'closed') close();
  }

  // blocks: [{ t, role: 'kicker' | 'title' | 'body' | 'soft', gap }]; returns the local
  // y of the text's bottom edge (the sheet's centre is 0).
  function paint(blocks) {
    const panel = paper();
    const bottom = panel.write(blocks.map((b, i) => {
      const r = ROLES[b.role || 'body'];
      return { t: b.t, size: r.m * DENSITY, color: r.color, weight: r.weight, spacing: r.spacing || 0,
        gap: (b.gap ?? (i ? 0.012 : 0)) * DENSITY };
    }), { top: true, fit: false, align: 'left', pad: MARGIN * DENSITY, bg: PAPER_BG });
    const textBottom = PAPER.h / 2 - bottom;
    el.dataset.textBottom = textBottom.toFixed(3);
    if (panel.overflow) el.dataset.overflow = '1'; else delete el.dataset.overflow;
    return textBottom;
  }

  // A page to read (the voice may read it too); no buttons.
  async function say(blocks) {
    await ready;
    open();
    setPage({ blocks });
  }

  // A page with answers; resolves with the index of the one picked.
  async function choose(blocks, labels) {
    await ready;
    open();
    return new Promise((resolve) => setPage({ blocks, labels, onPick: resolve }));
  }

  // whether a question has cut in (the caller holds other actions until it is answered)
  const isAsking = () => asking;

  return { el, open, close, say, choose, hang, take, back, interrupt, resume, isAsking };
}
