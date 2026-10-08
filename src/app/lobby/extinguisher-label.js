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
