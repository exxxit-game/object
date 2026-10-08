import { FONT } from '../panel.js';

// A column of answer buttons in front of a wall, chosen with the laser (VR) or
// the mouse (desktop). Any number of answers; one pick, then the buttons go away.
// All answers of one question share one text size: a smaller answer would look
// less important and could bias the choice.
const NORMAL = '#1d2026';
const HOVER = '#343b47';
const TEXT = '#f2efe8';
// Canvas pixels per metre of button: the same on every button, so a text size means
// the same real letter height on a narrow button as on a wide one.
const PX_PER_M = 1024 / 1.5;
const PAD = 10;
const MIN_GAP = 0.01; // metres between buttons when a long list is squeezed into one column
const SIZE = 54;
const WEIGHT = 600;
const LINE_HEIGHT = 1.32; // as in panel.js

// The largest common size at which every label fits on one line of the button.
function commonSize(labels, pxW, pxH) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${WEIGHT} ${SIZE}px ${FONT}`;
  const widest = Math.max(...labels.map(t => ctx.measureText(t).width));
  const byWidth = Math.floor(SIZE * (pxW - PAD * 2) / widest);
  const byHeight = Math.floor((pxH - PAD * 2) / LINE_HEIGHT);
  return Math.min(SIZE, byWidth, byHeight);
}

// place: { x, y (top button), z, w, h, gap, bottom (lowest edge the buttons may reach) }
// A list that would run below `bottom` in one column is shown in two columns,
// read down the first column, then the second; smaller buttons would mean smaller letters.
export function createChoice(scene, place) {
  const { x = 0, y, z, w = 1.5, h = 0.13, gap = 0.025, bottom = null } = place;
  let els = [];

  function hide() {
    els.forEach(el => el.remove());
    els = [];
  }

  // labels: strings. onPick(index) fires once. top (optional): the top edge of the
  // first button, to start below a question of any length.
  function show(labels, onPick, top) {
    // long lists get lower buttons so they stay on the wall screen
    const bh = labels.length > 4 ? h * 0.8 : h;
    const y0 = top == null ? y : top - bh / 2;
    // One column if it fits, first with the usual gaps, then with gaps down to 1 cm;
    // otherwise two columns (letters keep their size either way).
    const n = labels.length;
    const space = bottom == null ? Infinity : y0 + bh / 2 - bottom;
    const tight = n > 1 ? (space - n * bh) / (n - 1) : gap;
    const cols = tight >= MIN_GAP ? 1 : 2;
    const g = cols === 1 ? Math.min(gap, tight) : gap;
    const rows = Math.ceil(n / cols);
    const bw = cols === 1 ? w : (w - g) / 2;
    hide();
    let done = false;
    const px = Math.round(bw * PX_PER_M);
    const size = commonSize(labels, px, Math.round(bh * PX_PER_M));
    els = labels.map((text, i) => {
      const col = Math.floor(i / rows), row = i % rows;
      const el = document.createElement('a-entity');
      el.setAttribute('panel', `w: ${bw}; h: ${bh}; px: ${px}`);
      el.setAttribute('position', `${(x - w / 2 + bw / 2 + col * (bw + g)).toFixed(3)} ${(y0 - row * (bh + g)).toFixed(3)} ${z}`);
      el.classList.add('clickable', 'answer');
      el.dataset.index = i;
      el.dataset.size = size;
      const paint = (bg) => el.components.panel && el.components.panel.write([{ t: text, size, weight: WEIGHT, color: TEXT }], { bg, pad: PAD });
      el.addEventListener('loaded', () => paint(NORMAL));
      el.addEventListener('mouseenter', () => paint(HOVER));
      el.addEventListener('mouseleave', () => paint(NORMAL));
      el.addEventListener('click', () => {
        if (done) return;
        done = true;
        hide();
        onPick(i);
      });
      scene.appendChild(el);
      return el;
    });
  }

  return { show, hide };
}
