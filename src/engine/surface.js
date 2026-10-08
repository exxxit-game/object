// Surfaces drawn once on a canvas (no image files to load): painted block wall,
// linoleum tiles, acoustic ceiling tiles, wood. Each kind is drawn once and shared;
// an entity only sets how many times it repeats.
// <a-plane surface="kind: linoleum; repeat: 5.3 5.3"></a-plane>
const SIZE = 512;
const cache = {};

// The same speckle every load: rooms must look identical for every player.
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

function speckle(ctx, rand, count, size, colors) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.fillRect(rand() * SIZE, rand() * SIZE, size, size);
  }
}

const KINDS = {
  // painted concrete block: 4 × 8 blocks of 40 × 20 cm over 1.6 m, joints under the paint
  block(ctx, rand) {
    ctx.fillStyle = '#e6e4da'; // light paint; the entity's tint gives the colour
    ctx.fillRect(0, 0, SIZE, SIZE);
    speckle(ctx, rand, 9000, 2, ['rgba(255,255,255,.035)', 'rgba(0,0,0,.05)']);
    ctx.strokeStyle = 'rgba(0,0,0,.075)';
    ctx.lineWidth = 2;
    const bw = SIZE / 4, bh = SIZE / 8;
    for (let row = 0; row < 8; row++) {
      const y = row * bh;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(SIZE, y); ctx.stroke();
      const shift = row % 2 ? bw / 2 : 0;
      for (let x = shift; x < SIZE + 1; x += bw) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke();
      }
    }
  },
  // linoleum: 2 × 2 tiles of 30 cm in two muted tones, fine speckle
  linoleum(ctx, rand) {
    const half = SIZE / 2;
    ['#6b6257', '#615950', '#615950', '#6b6257'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i % 2) * half, Math.floor(i / 2) * half, half, half);
    });
    speckle(ctx, rand, 14000, 2, ['rgba(255,255,255,.06)', 'rgba(0,0,0,.08)', 'rgba(140,120,90,.1)']);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, SIZE, SIZE);
    ctx.beginPath(); ctx.moveTo(half, 0); ctx.lineTo(half, SIZE); ctx.moveTo(0, half); ctx.lineTo(SIZE, half); ctx.stroke();
  },
  // acoustic ceiling tile 60 cm with pinholes, framed by the metal grid
  ceiling(ctx, rand) {
    ctx.fillStyle = '#cfcbc0';
    ctx.fillRect(0, 0, SIZE, SIZE);
    speckle(ctx, rand, 2600, 3, ['rgba(60,55,45,.35)', 'rgba(60,55,45,.2)']);
    ctx.strokeStyle = '#9d9a92';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, SIZE, SIZE);
  },
  // light wood with long grain (table top)
  wood(ctx, rand) {
    ctx.fillStyle = '#8a6d4f';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (let i = 0; i < 220; i++) {
      const y = rand() * SIZE;
      ctx.strokeStyle = `rgba(${rand() < 0.5 ? '70,45,25' : '190,150,105'},${0.05 + rand() * 0.12})`;
      ctx.lineWidth = 1 + rand() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= SIZE; x += 32) ctx.lineTo(x, y + Math.sin(x / 90 + i) * 3);
      ctx.stroke();
    }
  }
};

function texture(kind) {
  if (cache[kind]) return cache[kind];
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  KINDS[kind](c.getContext('2d'), seeded(kind.length * 7919));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  cache[kind] = t;
  return t;
}

AFRAME.registerComponent('surface', {
  schema: {
    kind: { default: 'block', oneOf: Object.keys(KINDS) },
    repeat: { type: 'vec2', default: { x: 1, y: 1 } },
    tint: { default: '#ffffff' } // multiplies the drawn colours (darker paint band, etc.)
  },
  init() { this.apply = this.apply.bind(this); this.el.addEventListener('object3dset', this.apply); },
  update() { this.apply(); },
  remove() { this.el.removeEventListener('object3dset', this.apply); },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    const map = texture(this.data.kind).clone();
    map.repeat.set(this.data.repeat.x, this.data.repeat.y);
    map.needsUpdate = true;
    mesh.material.map = map;
    mesh.material.color.set(this.data.tint);
    mesh.material.needsUpdate = true;
  }
});
