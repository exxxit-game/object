import { createChoice } from './choice.js';
import './ink.js';

// The page of the clipboard (sheet.js): its text in roles, the answer buttons under it, and on a
// form a field over every blank (a run of underscores) to write in by hand (ink.js). Text never
// shrinks to fit: a page that does not fit sets data-overflow, which the smoke test treats as an
// error (split the text into pages instead). Reading comes first: no role is smaller than
// MIN_LETTER, and the smoke test fails a page drawn smaller (data-letter-mm).
export const PAPER = { w: 0.56, h: 0.72 };
export const PAPER_BG = '#e9e2cf';       // cream, not white: a large white page glares in a headset
export const DENSITY = 2 * 1024 / 1.5;   // canvas px per metre: sharp when read from 1 m (choice.js)
export const MARGIN = 0.04;
export const UNDER_TEXT = 0.03;
const BUTTON_H = 0.07;            // about 4 degrees at 1 m (Meta: targets at least 2.5)
const GAP = 0.025;
const MIN_LETTER = 0.024;
// Text roles: font size in metres at 1 m and ink, in the game's sans (FONT: a sans with a high
// x-height, as Meta asks for text in VR).
const ROLES = {
  title: { m: 0.044, color: '#1d1b17', weight: 700 },
  body: { m: 0.028, color: '#1d1b17', weight: 500 },
  soft: { m: MIN_LETTER, color: '#4a453c', weight: 500 }
};
// A field to write in: the blank's width, from a letter's height above its line (people write
// above the line) to a third of one below it.
const FIELD = { above: 1.0, below: 0.35, side: 0.3 };

// el: the sheet entity; paperEl: its paper (a panel)
export function createPage(el, paperEl) {
  const paper = () => paperEl.components.panel;
  const choice = createChoice(el, {
    x: 0, y: 0, z: 0.005, w: PAPER.w - 2 * MARGIN, h: BUTTON_H, gap: GAP,
    bottom: -PAPER.h / 2 + MARGIN, density: DENSITY
  });
  let fields = [];

  // blocks: [{ t, role: 'title' | 'body' | 'soft', gap }]; returns the local y of the text's
  // bottom edge (the sheet's centre is 0).
  function paint(blocks) {
    const panel = paper();
    const bottom = panel.write(blocks.map((b, i) => {
      const r = ROLES[b.role || 'body'];
      return { t: b.t, size: r.m * DENSITY, color: r.color, weight: r.weight,
        gap: (b.gap ?? (i ? 0.012 : 0)) * DENSITY };
    }), { top: true, fit: false, align: 'left', pad: MARGIN * DENSITY, bg: PAPER_BG });
    el.dataset.letterMm = (Math.min(...blocks.map((b) => ROLES[b.role || 'body'].m)) * 1000).toFixed(1);
    const textBottom = PAPER.h / 2 - bottom;
    el.dataset.textBottom = textBottom.toFixed(3);
    if (panel.overflow) el.dataset.overflow = '1'; else delete el.dataset.overflow;
    if (panel.orphan) el.dataset.orphan = '1'; else delete el.dataset.orphan;
    return textBottom;
  }

  // The fields over the page's blanks, made once for a form and kept while it is shown (its ink
  // stays when the page is drawn again, or after a question cut in).
  function showFields() {
    if (!fields.length) {
      const W = paper().c.width, H = paper().c.height;
      fields = paper().blanks.map((b) => {
        const x0 = b.x0 - FIELD.side * b.size, x1 = b.x1 + FIELD.side * b.size;
        const y0 = b.y - FIELD.above * b.size, y1 = b.y + b.size + FIELD.below * b.size;
        const f = document.createElement('a-entity');
        f.classList.add('clickable', 'ink-field');
        f.setAttribute('ink', `w: ${((x1 - x0) / DENSITY).toFixed(4)}; h: ${((y1 - y0) / DENSITY).toFixed(4)}; px: ${DENSITY}`);
        f.setAttribute('position', `${(((x0 + x1) / 2 - W / 2) / DENSITY).toFixed(4)} ${((H / 2 - (y0 + y1) / 2) / DENSITY).toFixed(4)} 0.002`);
        el.appendChild(f);
        return f;
      });
    }
    for (const f of fields) { f.setAttribute('visible', true); f.classList.add('clickable'); }
    return fields;
  }
  function hideFields() {
    for (const f of fields) { f.components.ink?.up(); f.setAttribute('visible', false); f.classList.remove('clickable'); }
  }
  function dropFields() { fields.forEach((f) => f.remove()); fields = []; }

  // Draws a page: the text, then the buttons (labels, onPick), and on a form its fields.
  // Returns the top edge of the buttons.
  function show({ blocks, labels = null, onPick = null, form = false }) {
    const top = paint(blocks || []) - UNDER_TEXT;
    if (labels) {
      const needed = labels.length * BUTTON_H + (labels.length - 1) * GAP;
      if (top - needed < -PAPER.h / 2 + MARGIN) el.dataset.overflow = '1';
      choice.show(labels, onPick, top);
    } else choice.hide();
    if (form) showFields(); else hideFields();
    return top;
  }

  return { paint, show, choice, fields: () => fields, hideFields, dropFields };
}
