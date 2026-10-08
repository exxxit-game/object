import { frontPose } from './sheet-math.js';
import { createChoice } from './choice.js';

// The clipboard sheet: everything the player reads or answers, one thought per page.
// It appears 1 m in front of the player, a little below the eyes, and stays still
// (world-fixed) until it is closed; answers with the laser or the mouse. Why and the
// sources: docs/decisions.md, "Everything the player reads or answers is on a clipboard".
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
// Text roles: letter height in metres at 1 m (at least 21 mm, about 1.2 degrees) and ink.
const ROLES = {
  kicker: { m: 0.022, color: '#6b6457', weight: 700, spacing: 6 },
  title: { m: 0.048, color: '#1d1b17', weight: 700 },
  body: { m: 0.028, color: '#1d1b17', weight: 500 },
  soft: { m: 0.024, color: '#4a453c', weight: 500 }
};

export function createSheet(scene) {
  const el = document.createElement('a-entity');
  el.classList.add('sheet');
  el.setAttribute('visible', false);
  el.innerHTML = `
    <a-box width="${BOARD.w}" height="${BOARD.h}" depth="${BOARD.d}" position="0 0 ${-BOARD.d / 2 - 0.004}" material="color: #7a5c3e; roughness: 0.8"></a-box>
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
  let isOpen = false;

  function place() {
    const cam = scene.camera;
    const head = new THREE.Vector3(), q = new THREE.Quaternion();
    cam.getWorldPosition(head);
    cam.getWorldQuaternion(q);
    const yaw = new THREE.Euler().setFromQuaternion(q, 'YXZ').y;
    const p = frontPose(head.toArray(), yaw);
    el.object3D.position.fromArray(p.pos);
    el.object3D.rotation.set(p.pitch, p.yaw, 0, 'YXZ');
  }
  // the player was placed again (VR entry, recenter, headset put back on): follow them
  scene.addEventListener('recentered', () => { if (isOpen) setTimeout(place, 50); });

  function open() {
    if (isOpen) return;
    isOpen = true;
    place();
    el.setAttribute('visible', true);
    el.dataset.open = '1';
    el.setAttribute('animation', { property: 'scale', from: '0.94 0.94 0.94', to: '1 1 1', dur: 150 });
  }

  function close() {
    choice.hide();
    isOpen = false;
    el.setAttribute('visible', false);
    delete el.dataset.open;
  }

  // blocks: [{ t, role: 'kicker' | 'title' | 'body' | 'soft', gap }]; returns the local
  // y of the text's bottom edge (the sheet's centre is 0).
  function write(blocks) {
    open();
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
    choice.hide();
    write(blocks);
  }

  // A page with answers; resolves with the index of the one picked.
  async function choose(blocks, labels) {
    await ready;
    const top = write(blocks) - UNDER_TEXT;
    const needed = labels.length * BUTTON_H + (labels.length - 1) * GAP;
    if (top - needed < -PAPER.h / 2 + MARGIN) el.dataset.overflow = '1';
    return new Promise((resolve) => choice.show(labels, resolve, top));
  }

  return { el, open, close, say, choose };
}
