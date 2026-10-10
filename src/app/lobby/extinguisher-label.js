import { FONT } from '../../engine/panel.js';
import { LOBBY_T } from './texts.ru.js';

// The extinguisher's label, laid out as on a 1972 General WS-900 (a seller's photo of one): a tall
// silver label with a thin dark rule round it, an oval mark at the top, the agent under it, a blue
// band with how to operate it, the small print below. The maker's own name is left out of the
// oval (it is a trade mark); the words are ours (texts.ru.js). Drawn on a canvas wrapped round the
// label's piece of the shell (scene.js, #extLabel), u running left to right as seen from the front.
const W = 420, H = 690;
const SILVER = '#d9dcdd', RULE = '#3c3f44', BLUE = '#2b4c94', INK = '#2a2c30', GREY = '#5d6168';

export function paintExtinguisherLabel(el) {
  const t = LOBBY_T.extinguisher;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = SILVER; x.fillRect(0, 0, W, H);
  x.strokeStyle = RULE; x.lineWidth = 5; x.strokeRect(12, 12, W - 24, H - 24);
  // the oval mark
  x.lineWidth = 6; x.beginPath(); x.ellipse(W / 2, 92, 150, 44, 0, 0, Math.PI * 2); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK;
  x.font = `700 46px ${FONT}`; x.fillText(t.agent, W / 2, 94);
  x.font = `600 24px ${FONT}`; x.fillText(t.name, W / 2, 168);
  // how to operate, white on the blue band
  x.fillStyle = BLUE; x.fillRect(12, 196, W - 24, 150);
  x.fillStyle = '#ffffff';
  x.font = `700 22px ${FONT}`; x.fillText(t.operate, W / 2, 222);
  x.font = `700 25px ${FONT}`;
  t.steps.forEach((s, i) => x.fillText(s, W / 2, 258 + i * 30));
  // the small print
  x.fillStyle = GREY; x.textAlign = 'left'; x.font = `500 17px ${FONT}`;
  t.small.forEach((s, i) => x.fillText(s, 34, 380 + i * 30));
  const tex = new AFRAME.THREE.CanvasTexture(c);
  tex.colorSpace = AFRAME.THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = el.getObject3D('mesh');
  mesh.material.map = tex;
  mesh.material.color.set('#ffffff');
  mesh.material.needsUpdate = true;
}

// The gauge's dial, as on the 1970 WS-900 (the owner's photo 5): dark blue; round its rim a red band
// on the left (recharge) and on the right (overcharged), and between them at the top a yellow wedge
// (the right range) with 100 in it; 0 on the left, 200 on the right; the needle in the range. Drawn on
// the dial's disc (scene.js, #extGauge).
const DIAL = 256, NAVY = '#1d2f5c', RED = '#c0242a', YELLOW = '#e8c547', WHITE = '#f2f0ea';
// the scale's angle (canvas angles: 0 to the right, clockwise) for a reading: 0 at the left, 100 at the
// top, 200 at the right
const reading = (v) => Math.PI + (v / 200) * Math.PI;
function along(x, text, m, r, from, to) {
  const chars = [...text], step = (to - from) / chars.length;
  chars.forEach((ch, i) => {
    const a = from + step * (i + 0.5);
    x.save(); x.translate(m + Math.cos(a) * r, m + Math.sin(a) * r); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, 0); x.restore();
  });
}
export function paintGauge(el) {
  const t = LOBBY_T.extinguisher.gauge, c = document.createElement('canvas');
  c.width = c.height = DIAL;
  const x = c.getContext('2d'), m = DIAL / 2;
  x.fillStyle = NAVY; x.beginPath(); x.arc(m, m, m, 0, Math.PI * 2); x.fill();
  x.lineWidth = DIAL * 0.12;
  x.strokeStyle = RED;
  for (const [a, b] of [[-25, 75], [125, 225]]) { x.beginPath(); x.arc(m, m, m * 0.84, reading(a), reading(b)); x.stroke(); }
  x.fillStyle = YELLOW; x.beginPath(); x.moveTo(m, m); x.arc(m, m, m * 0.9, reading(75), reading(125)); x.closePath(); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = WHITE; x.font = `700 ${DIAL * 0.05}px ${FONT}`;
  along(x, t.low, m, m * 0.84, reading(-20), reading(70));
  along(x, t.high, m, m * 0.84, reading(130), reading(220));
  // the numbers stand in the blue, clear of the red bands (whose inner edge is 0.72 of the radius)
  x.font = `700 ${DIAL * 0.1}px ${FONT}`;
  x.fillText('0', m * 0.52, m); x.fillText('200', m * 1.45, m);
  x.fillStyle = NAVY; x.fillText('100', m, m * 0.42);
  x.font = `700 ${DIAL * 0.06}px ${FONT}`; x.fillText(t.range, m, m * 0.25);
  // the needle in the range, and its hub
  const n = reading(100);
  x.strokeStyle = '#111'; x.lineWidth = DIAL * 0.025; x.beginPath(); x.moveTo(m, m); x.lineTo(m + Math.cos(n) * m * 0.7, m + Math.sin(n) * m * 0.7); x.stroke();
  x.fillStyle = '#111'; x.beginPath(); x.arc(m, m, DIAL * 0.04, 0, Math.PI * 2); x.fill();
  const tex = new AFRAME.THREE.CanvasTexture(c);
  tex.colorSpace = AFRAME.THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = el.getObject3D('mesh');
  mesh.material.map = tex;
  mesh.material.color.set('#ffffff');
  mesh.material.needsUpdate = true;
}
