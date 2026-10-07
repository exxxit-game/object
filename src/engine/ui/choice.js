// A column of answer buttons in front of a wall, chosen with the laser (VR) or
// the mouse (desktop). Any number of answers; one pick, then the buttons go away.
const NORMAL = '#1d2026';
const HOVER = '#343b47';
const TEXT = '#f2efe8';

// place: { x, y (top button), z, w, h, gap }
export function createChoice(scene, place) {
  const { x = 0, y, z, w = 1.5, h = 0.13, gap = 0.025 } = place;
  let els = [];

  function hide() {
    els.forEach(el => el.remove());
    els = [];
  }

  // labels: strings. onPick(index) fires once.
  function show(labels, onPick) {
    hide();
    let done = false;
    els = labels.map((text, i) => {
      const el = document.createElement('a-entity');
      el.setAttribute('panel', `w: ${w}; h: ${h}; px: 1024`);
      el.setAttribute('position', `${x} ${(y - i * (h + gap)).toFixed(3)} ${z}`);
      el.classList.add('clickable', 'answer');
      el.dataset.index = i;
      const paint = (bg) => el.components.panel && el.components.panel.write([{ t: text, size: 54, weight: 600, color: TEXT }], { bg, pad: 16 });
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
