import { APP_T } from './texts.ru.js';

// A player who leaves before the end must be able to learn what the experiment was
// (debriefing; British Psychological Society guidance for internet research), but
// only if they ask: they may have left by accident and want to come back and play.
// Nothing is revealed without a click. Test runs (?speed=N) leave no mark.
const key = (room) => `object.left.${room}`;
function store(room, on) {
  try { if (on) localStorage.setItem(key(room), '1'); else localStorage.removeItem(key(room)); } catch (e) { /* private mode */ }
}

// The run started: if the page is closed before the debrief, the next visit asks.
export const markStarted = (room) => store(room, true);
// The player reached the debrief, or chose to read the short one.
export const markReached = (room) => store(room, false);

export function leftBefore(room) {
  try { return localStorage.getItem(key(room)) === '1'; } catch (e) { return false; }
}

// Next visit, before the consent screen: "start again" or "what was it".
// screen: a panel component; choice: an engine/ui/choice instance; screenTop: world
// height of the screen's top edge; debrief: the room's short explanation.
export async function askAfterLeaving(screen, choice, { room, debrief, screenTop }) {
  const L = APP_T.leftEarly;
  const write = (blocks) => {
    const bottom = screen.write(blocks, { top: true });
    screen.el.dataset.textBottom = (screenTop - bottom).toFixed(3);
    return screenTop - bottom - 0.05;
  };
  const pick = (labels, top) => new Promise((resolve) => choice.show(labels, resolve, top));
  const learn = (await pick([L.again, L.learn], write([{ t: L.before, size: 60, weight: 600 }]))) === 1;
  markReached(room);
  if (learn) {
    await pick([L.again], write([
      { t: L.before, size: 48, weight: 600 },
      { t: debrief, size: 40, color: '#c4c0b7', weight: 500, gap: 18 }
    ]));
  }
}

// Leaving VR in the middle of a room: a page box offers to go back or to learn what
// it was. hold(true|false) lets the room pause its trials while the box is open.
export function watchExit(scene, { room, debrief, midRoom, hold }) {
  const L = APP_T.leftEarly;
  const button = (label, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  };
  scene.addEventListener('exit-vr', () => {
    if (!midRoom() || document.querySelector('#left-early')) return;
    hold(true);
    const box = document.createElement('div');
    box.id = 'left-early';
    const lead = document.createElement('p');
    lead.textContent = L.now;
    // Without a headset (VR cannot be entered again) the room simply goes on on the screen.
    const back = button(L.back, () => {
      box.remove();
      hold(false);
      if (AFRAME.utils.device.checkHeadsetConnected()) Promise.resolve(scene.enterVR()).catch(() => {});
    });
    const learn = button(L.learn, () => {
      markReached(room);
      const body = document.createElement('p');
      body.textContent = debrief;
      box.replaceChildren(lead, body, button(L.again, () => location.reload()));
    });
    box.append(lead, back, learn);
    document.body.append(box);
  });
}
