// The question between the two rounds: four answer buttons laid over the
// experimenter screen, chosen with the laser (VR) or the mouse (desktop).
const NORMAL = '#1d2026';
const HOVER = '#343b47';
const TEXT = '#f2efe8';

let buttons = [];

function paint(button, bg) {
  button.el.components.panel.write([{ t: button.text, size: 54, weight: 600, color: TEXT }], { bg });
}

// Creates the hidden buttons; call once after the scene has loaded.
export function buildAnswers(scene, answers) {
  buttons = answers.map((text, i) => {
    const el = document.createElement('a-entity');
    el.setAttribute('panel', 'w: 1.5; h: 0.15; px: 1024');
    el.setAttribute('position', `0 ${(2.02 - i * 0.17).toFixed(2)} -1.555`);
    el.setAttribute('visible', false);
    scene.appendChild(el);
    const button = { el, text, i, onPick: null };
    el.addEventListener('loaded', () => paint(button, NORMAL));
    el.addEventListener('mouseenter', () => paint(button, HOVER));
    el.addEventListener('mouseleave', () => paint(button, NORMAL));
    el.addEventListener('click', () => button.onPick && button.onPick(i));
    return button;
  });
}

// Shows the buttons; onPick(index) fires once, then the buttons hide.
export function showAnswers(onPick) {
  let done = false;
  for (const b of buttons) {
    b.onPick = (i) => { if (done) return; done = true; hideAnswers(); onPick(i); };
    paint(b, NORMAL);
    b.el.setAttribute('visible', true);
    b.el.classList.add('clickable', 'answer');
  }
}

export function hideAnswers() {
  for (const b of buttons) {
    b.onPick = null;
    b.el.setAttribute('visible', false);
    b.el.classList.remove('clickable', 'answer');
  }
}
