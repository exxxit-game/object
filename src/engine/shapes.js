// Shapes A-Frame lacks, for objects that should look made rather than cut from blocks.
// rounded-box: a box with rounded edges (bakelite boxes, table tops, chair seats).
// lathe: a shape turned around the vertical axis (lamp shades, bezels), from
// "radius height" pairs listed bottom to top.
function roundedBoxGeometry(w, h, d, r, smooth) {
  const rr = Math.min(r, w / 2, h / 2, d / 2) - 1e-5;
  const shape = new THREE.Shape();
  const eps = 1e-5;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, h - rr * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(w - rr * 2, h - rr * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(w - rr * 2, eps, eps, 0, -Math.PI / 2, true);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(d - rr * 2, 1e-4), bevelEnabled: true, bevelSegments: smooth,
    steps: 1, bevelSize: rr, bevelThickness: rr, curveSegments: smooth
  });
  g.center();
  return g;
}

const MATERIAL = {
  color: { default: '#222' },
  roughness: { default: 0.6 },
  metalness: { default: 0 }
};
const SIDES = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };
const material = (d) => new THREE.MeshStandardMaterial({
  color: d.color, roughness: d.roughness, metalness: d.metalness, side: SIDES[d.side] || THREE.FrontSide
});

function shapeComponent(name, schema, build) {
  AFRAME.registerComponent(name, {
    schema: { ...MATERIAL, ...schema },
    update() {
      this.remove();
      this.mesh = new THREE.Mesh(build(this.data), material(this.data));
      this.el.setObject3D('mesh', this.mesh);
    },
    remove() {
      if (!this.mesh) return;
      this.el.removeObject3D('mesh');
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = null;
    }
  });
}

shapeComponent('rounded-box', {
  width: { default: 1 }, height: { default: 1 }, depth: { default: 1 }, radius: { default: 0.01 }
}, (d) => roundedBoxGeometry(d.width, d.height, d.depth, d.radius, 3));

// plate: a flat plate with its corners rounded in its own plane (a clipboard, a clip's jaw), however
// thin it is; its thickness along z, centred on the entity.
function plateGeometry(w, h, d, c) {
  const x = w / 2, y = h / 2, r = Math.min(c, x, y), s = new THREE.Shape();
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y); s.absarc(x - r, -y + r, r, -Math.PI / 2, 0);
  s.lineTo(x, y - r); s.absarc(x - r, y - r, r, 0, Math.PI / 2);
  s.lineTo(-x + r, y); s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI);
  s.lineTo(-x, -y + r); s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -d / 2);
  return g;
}
shapeComponent('plate', {
  width: { default: 1 }, height: { default: 1 }, depth: { default: 0.01 }, corner: { default: 0.01 }
}, (d) => plateGeometry(d.width, d.height, d.depth, d.corner));

// loop: a flat ring of sheet metal (a clipboard clip's hanging loop): outer and hole radius,
// thickness along z, centred on the entity.
function loopGeometry(outer, hole, d) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.absarc(0, 0, hole, 0, Math.PI * 2, true);
  s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 24 });
  g.translate(0, 0, -d / 2);
  return g;
}
shapeComponent('loop', {
  outer: { default: 0.03 }, hole: { default: 0.02 }, depth: { default: 0.003 }
}, (d) => loopGeometry(d.outer, d.hole, d.depth));

shapeComponent('lathe', {
  points: { default: '0.1 0, 0.1 0.1' }, segments: { default: 32 }, side: { default: 'front' }
}, (d) => new THREE.LatheGeometry(
  d.points.split(',').map((p) => { const [r, y] = p.trim().split(/\s+/).map(Number); return new THREE.Vector2(r, y); }),
  d.segments
));
