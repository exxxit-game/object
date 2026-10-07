import { eventLog } from '../../engine/log.js';

// Painting on the back wall: a circle with a gap. The gap rotates only while
// the player is NOT looking at it. It has no effect on points; the reveal
// reports how often the player turned to check.
let gap = -0.6;

function draw(panel) {
  const { ctx, c } = panel;
  const W = c.width, H = c.height;
  ctx.fillStyle = '#d8cfbb';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(90,70,40,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2 + Math.random() * 6, 2 + Math.random() * 6);
  }
  ctx.strokeStyle = '#1e1b17';
  ctx.lineCap = 'round';
  const cx = W / 2, cy = H / 2, R = W * 0.3;
  for (let k = 0; k < 3; k++) {
    ctx.lineWidth = W * (0.07 - k * 0.018);
    ctx.globalAlpha = 0.55 + k * 0.2;
    ctx.beginPath();
    ctx.arc(cx + k * 2, cy - k, R - k * 3, gap + 0.35, gap + Math.PI * 2 - 0.35);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  panel.tex.needsUpdate = true;
}

export function initPainting(entity) {
  const panel = () => entity.components.panel;
  entity.addEventListener('look-change', (e) => {
    if (e.detail.seen) {
      eventLog.add('look');
    } else {
      gap += 0.5 + Math.random() * 1.6;
      draw(panel());
    }
  });
  return () => draw(panel());
}
