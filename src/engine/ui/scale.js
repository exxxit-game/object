import { createChoice } from './choice.js';
import { FONT } from '../panel.js';

// A 0–100 rating scale on a wall, like the paper scales of a questionnaire:
// marked every `step`, three labels (left, middle, right). Point and click on the
// bar to place the mark; "done" confirms. Works with the laser and the mouse.
const BAR_BG = '#15171b';
const INK = '#f2efe8';
const SOFT = '#9a968d';
const MARK = '#f0c96a';

// place: { x, y (bar centre), z, w }
export function createScale(scene, place) {
  const { x = 0, y, z, w = 1.7 } = place;
  const h = 0.3;
  const done = createChoice(scene, { x, y: y - 0.25, z, w: 0.5, h: 0.11 });
  let bar = null;

  function draw(labels, step, value, unit) {
    const panel = bar && bar.components.panel;
    if (!panel) return;
    const { ctx, c } = panel;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BAR_BG;
    ctx.fillRect(0, 0, W, H);
    const left = W * 0.05, right = W * 0.95, lineY = H * 0.4;
    const xOf = (v) => left + (right - left) * v / 100;
    ctx.strokeStyle = SOFT;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(left, lineY); ctx.lineTo(right, lineY); ctx.stroke();
    ctx.fillStyle = SOFT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let v = 0; v <= 100; v += step) {
      const big = v % 50 === 0;
      ctx.fillRect(xOf(v) - 1.5, lineY - (big ? 22 : 12), 3, big ? 44 : 24);
      if (v % 10 === 0) { ctx.font = `500 44px ${FONT}`; ctx.fillText(String(v), xOf(v), lineY + 26); }
    }
    ctx.fillStyle = INK;
    ctx.font = `600 54px ${FONT}`;
    [[0, 'left'], [50, 'center'], [100, 'right']].forEach(([v, align], i) => {
      if (!labels[i]) return;
      ctx.textAlign = align;
      ctx.fillText(labels[i], align === 'left' ? left : align === 'right' ? right : xOf(50), H * 0.05);
    });
    if (value != null) {
      ctx.fillStyle = MARK;
      ctx.beginPath(); ctx.arc(xOf(value), lineY, 16, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'center';
      ctx.font = `700 64px ${FONT}`;
      ctx.fillText(value + (unit || ''), xOf(value), H * 0.74);
    }
    panel.tex.needsUpdate = true;
  }

  function hide() {
    done.hide();
    if (bar) { bar.remove(); bar = null; }
  }

  // opt: { labels: [left, middle, right], step, unit, doneLabel }. onDone(value) once.
  // Without onDone the scale is only shown, not answered (to explain it first).
  function show(opt, onDone) {
    hide();
    let value = null;
    bar = document.createElement('a-entity');
    bar.setAttribute('panel', `w: ${w}; h: ${h}; px: 2048`);
    bar.setAttribute('position', `${x} ${y} ${z}`);
    bar.addEventListener('loaded', () => draw(opt.labels, opt.step, value, opt.unit));
    scene.appendChild(bar);
    if (!onDone) return;
    bar.classList.add('clickable', 'scale-bar');
    bar.addEventListener('click', (e) => {
      const point = e.detail && e.detail.intersection && e.detail.intersection.point;
      if (!point) return;
      const local = bar.object3D.worldToLocal(point.clone());
      // the drawn line runs from 5% to 95% of the bar width
      const frac = (local.x / w + 0.5 - 0.05) / 0.9;
      value = Math.max(0, Math.min(100, Math.round(frac * 100 / opt.step) * opt.step));
      draw(opt.labels, opt.step, value, opt.unit);
      done.show([opt.doneLabel], () => { const v = value; hide(); onDone(v); });
    });
  }

  return { show, hide };
}
