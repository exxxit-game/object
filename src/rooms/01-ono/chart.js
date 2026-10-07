// The "aha" screen: each round as a time line with the player's lever pulls
// (one lane per lever, colour and shape) and the points (gold bars). It shows
// with the player's own data that points came regardless of the pulls.
import { FONT } from '../../engine/panel.js';
import { LEVER_COLORS } from './levers.js';

const POINT = '#f0c96a'; // gold: must not look like the green lever
const INK = '#f2efe8';
const MUTED = '#9a968d';

function mark(ctx, shape, x, y, r) {
  ctx.beginPath();
  if (shape === 0) ctx.arc(x, y, r, 0, Math.PI * 2);
  else if (shape === 1) ctx.rect(x - r, y - r, r * 2, r * 2);
  else { ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.2, y); ctx.lineTo(x, y + r * 1.2); ctx.lineTo(x - r * 1.2, y); ctx.closePath(); }
  ctx.fill();
}

// log: event log entries; t2: start time of round 2 (s); roundSecs: round length.
export function drawChart(panel, log, t2, roundSecs, texts) {
  const { ctx, c } = panel;
  const W = c.width, H = c.height;
  ctx.fillStyle = '#0e0f11';
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillStyle = MUTED;
  ctx.font = `700 52px ${FONT}`;
  ctx.fillText(texts.header, W / 2, 80);
  ctx.letterSpacing = '0px';

  const left = 260, right = W - 90, width = right - left;
  const starts = [0, t2];
  [1, 2].forEach((round, r) => {
    const top = 190 + r * 330;
    const from = starts[r];
    if (r === 1 && !isFinite(from)) return;
    const inRound = (e) => e.t >= from && e.t < from + roundSecs + 5 && (r === 0 ? e.t < t2 : true);
    const x = (t) => left + Math.min(1, Math.max(0, (t - from) / roundSecs)) * width;
    ctx.textAlign = 'left';
    ctx.fillStyle = INK;
    ctx.font = `600 50px ${FONT}`;
    ctx.fillText(texts.round(round), 60, top + 110);
    // points: green bars across all lanes
    ctx.fillStyle = POINT;
    for (const e of log) if (e.k === 'point' && inRound(e)) ctx.fillRect(x(e.t) - 4, top, 8, 230);
    // pulls: one lane per lever
    for (const e of log) {
      if (e.k !== 'pull' || !inRound(e)) continue;
      ctx.fillStyle = LEVER_COLORS[e.v];
      mark(ctx, e.v, x(e.t), top + 40 + e.v * 75, 17);
    }
    ctx.fillStyle = '#2a2c30';
    ctx.fillRect(left, top + 250, width, 4);
  });

  // legend and caption
  ctx.textAlign = 'left';
  ctx.font = `500 44px ${FONT}`;
  ctx.fillStyle = LEVER_COLORS[0]; mark(ctx, 0, 300, 892, 16);
  ctx.fillStyle = LEVER_COLORS[1]; mark(ctx, 1, 345, 892, 16);
  ctx.fillStyle = LEVER_COLORS[2]; mark(ctx, 2, 390, 892, 16);
  ctx.fillStyle = INK; ctx.fillText(texts.pulls, 430, 892);
  ctx.fillStyle = POINT; ctx.fillRect(1100, 862, 8, 60);
  ctx.fillStyle = INK; ctx.fillText(texts.points, 1130, 892);
  ctx.textAlign = 'center';
  ctx.fillStyle = MUTED;
  ctx.font = `500 42px ${FONT}`;
  ctx.fillText(texts.caption, W / 2, 975);
  panel.tex.needsUpdate = true;
}
