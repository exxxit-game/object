import { jointOrigin, bondOrigin } from './tile-math.js';

// Surfaces drawn once on a canvas (no image files to load): painted block wall,
// linoleum tiles, acoustic ceiling tiles, wood. Each kind is drawn once and shared.
// Tiles and blocks follow ONE grid per space (a room, the corridor), laid out from that
// space's centre in world metres by the tile trade's rule (tile-math.js), so a wall cut
// into pieces, the band below the rail and the next wall all line up, and the edges of
// the space get equal cuts, never less than half a tile.
// Wood (no grid) only repeats.
// <a-plane surface="kind: linoleum"></a-plane>  <a-entity surface="kind: wood; repeat: 1 1">
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
  // linoleum: 2 × 2 tiles of 32 cm in two muted tones, fine speckle
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
  // acoustic ceiling tile 64 cm with pinholes, framed by the metal grid
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

// Metres covered by one copy of the drawing (a joint at its edge) and the size of one
// tile or block across. Where the joints go is worked out per space (tile-math.js).
const GRID = {
  block: { size: 1.6, tile: 0.4, bond: true }, // running bond: courses shifted by half a block
  linoleum: { size: 0.64, tile: 0.32 },
  ceiling: { size: 0.64, tile: 0.64 }
};

// UVs from world positions: across the surface (x, or z for walls facing x) and up
// (y for walls, z for floor and ceiling); block courses start at the floor. The
// geometry is cloned first: A-Frame shares one geometry between planes of the same size.
// space: { x, y: centre (x, z), z, w: length along x and along z } of the room it belongs to.
function worldUV(mesh, { size, tile, bond }, space) {
  const origin = bond ? bondOrigin : jointOrigin;
  const ox = origin(space.x, space.z, tile), oz = origin(space.y, space.w, tile);
  mesh.updateMatrixWorld(true);
  mesh.geometry = mesh.geometry.clone();
  const pos = mesh.geometry.attributes.position, uv = mesh.geometry.attributes.uv;
  const n = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()));
  const flat = Math.abs(n.y) > 0.5, facesZ = Math.abs(n.z) > 0.5;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
    const across = flat || facesZ ? p.x - ox : p.z - oz;
    const up = flat ? p.z - oz : p.y;
    uv.setXY(i, across / size, up / size);
  }
  uv.needsUpdate = true;
}

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
    repeat: { type: 'vec2', default: { x: 1, y: 1 } }, // wood only; tiled kinds use the room grid
    tint: { default: '#ffffff' }, // multiplies the drawn colours (darker paint band, etc.)
    // the space whose tiles this surface shares: centre x, centre z, length along x, along z
    // (default: room 01, 3.2 × 3.2 m around the origin)
    space: { type: 'vec4', default: { x: 0, y: 0, z: 3.2, w: 3.2 } }
  },
  init() { this.apply = this.apply.bind(this); this.el.addEventListener('object3dset', this.apply); },
  update() { this.apply(); },
  remove() { this.el.removeEventListener('object3dset', this.apply); },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    const grid = GRID[this.data.kind];
    const sceneEl = this.el.sceneEl;
    // world positions are final only once the scene has loaded (merge-static runs after this)
    if (grid && !sceneEl.hasLoaded) { sceneEl.addEventListener('loaded', () => this.apply(), { once: true }); return; }
    if (grid) worldUV(mesh, grid, this.data.space);
    const map = texture(this.data.kind).clone();
    if (!grid) map.repeat.set(this.data.repeat.x, this.data.repeat.y);
    map.needsUpdate = true;
    mesh.material.map = map;
    mesh.material.color.set(this.data.tint);
    mesh.material.needsUpdate = true;
  }
});
