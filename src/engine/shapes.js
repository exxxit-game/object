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

shapeComponent('lathe', {
  points: { default: '0.1 0, 0.1 0.1' }, segments: { default: 32 }, side: { default: 'front' }
}, (d) => new THREE.LatheGeometry(
  d.points.split(',').map((p) => { const [r, y] = p.trim().split(/\s+/).map(Number); return new THREE.Vector2(r, y); }),
  d.segments
));
