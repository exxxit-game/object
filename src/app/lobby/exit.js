import { drawMark, drawWordmark, wordWidth } from '../logo.js';
import { getContext } from '../../engine/audio.js';
import { LOBBY_T } from './texts.ru.js';

// The exit sign over the corridor's way out is the game's "leave" button: everybody reads an
// exit sign as the way out, and a participant may leave at any moment without penalty. Its face
// is the studio's mark and name, lit; pointing at it and pressing asks on the clipboard, which
// cuts in on whatever page it shows and gives it back if the player stays. Leaving fades to
// black, ends VR and says how to come back. Nothing has been sent at this point: results go
// only at the end of a room, with consent.
// sheet: the corridor's clipboard (src/engine/ui/sheet.js). Returns off(): the sign stops
// answering (the player went through a door: the corridor stays in the scene behind the room,
// and the lasers reach through walls to anything clickable).
export function exitSign(scene, sheet) {
  const face = scene.querySelector('#exitSign');
  const panel = face.components.panel;
  const { ctx, c } = panel;
  const s = c.height * 0.8, cap = c.height * 0.42;
  drawMark(ctx, c.height * 0.1, c.height * 0.1, s);
  drawWordmark(ctx, c.height * 0.1 + s + c.height * 0.25 + wordWidth(cap) / 2, (c.height - cap) / 2, cap);
  panel.tex.needsUpdate = true;
  const tint = (v) => face.getObject3D('mesh').material.color.setScalar(v);
  tint(0.85);
  face.addEventListener('mouseenter', () => tint(1));
  face.addEventListener('mouseleave', () => tint(0.85));
  const E = LOBBY_T.exit;
  let on = true;
  face.addEventListener('click', async () => {
    if (!on) return;
    const pick = await sheet.interrupt([{ t: E.ask, role: 'title' }, { t: E.note, role: 'body', gap: 0.02 }], [E.leave, E.stay]);
    if (pick === 0) { off(); leave(scene, E.done); } else if (pick === 1) sheet.resume();
  });
  function off() {
    on = false;
    face.classList.remove('clickable');
    tint(0.85);
    for (const r of [scene, ...scene.querySelectorAll('[raycaster]')]) r.components.raycaster?.refreshObjects();
  }
  return off;
}

async function leave(scene, done) {
  await scene.querySelector('#cam').components.fader.to(1);
  if (scene.is('vr-mode')) await scene.exitVR();
  getContext()?.suspend();
  scene.pause();
  const hint = document.querySelector('#hint');
  hint.textContent = done;
  hint.classList.add('show');
  document.documentElement.dataset.left = '1';
}
