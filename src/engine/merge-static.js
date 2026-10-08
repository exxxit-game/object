// Static parts of a room (walls, rails, furniture): each part is one draw call, and a
// hundred of them cost frame rate in a headset. After the scene loads, the opaque meshes
// under this entity that share a look are merged into one mesh per look. Parts that
// change (a lamp that lights up, a button, something shown later) carry data-dynamic
// and are left alone; transparent parts (text panels, shadows, glass) are skipped.
const KEEP = ['position', 'normal', 'uv'];

function look(m) {
  return [m.type, m.color && m.color.getHexString(), m.roughness, m.metalness,
    m.emissive && m.emissive.getHexString(), m.emissiveIntensity, m.map && m.map.uuid,
    m.side, m.envMap && m.envMap.uuid].join('|');
}

function dynamic(o, root) {
  for (let p = o; p && p !== root; p = p.parent) {
    if (p.el && p.el.hasAttribute('data-dynamic')) return true;
  }
  return false;
}

// Same attributes, no index, no groups: what mergeGeometries needs from every part.
function prepared(geometry, matrix) {
  let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name)) g.deleteAttribute(name);
  if (!g.attributes.uv) return null;
  g.clearGroups();
  return g.applyMatrix4(matrix);
}

AFRAME.registerComponent('merge-static', {
  init() {
    const later = () => setTimeout(() => this.merge(), 0);
    if (this.el.sceneEl.hasLoaded) later(); else this.el.sceneEl.addEventListener('loaded', later);
  },
  merge() {
    const root = this.el.object3D;
    root.updateMatrixWorld(true);
    const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const groups = new Map();
    root.traverse((o) => {
      if (!o.isMesh || !o.geometry || Array.isArray(o.material) || o.material.transparent) return;
      if (!o.visible || dynamic(o, root)) return;
      const key = look(o.material);
      if (!groups.has(key)) groups.set(key, { material: o.material, parts: [] });
      groups.get(key).parts.push(o);
    });
    for (const { material, parts } of groups.values()) {
      if (parts.length < 2) continue;
      const geos = parts.map((o) => prepared(o.geometry, new THREE.Matrix4().multiplyMatrices(toRoot, o.matrixWorld)));
      if (geos.some((g) => !g)) continue;
      const merged = THREE.BufferGeometryUtils.mergeGeometries(geos);
      geos.forEach((g) => g.dispose());
      if (!merged) continue;
      root.add(new THREE.Mesh(merged, material));
      parts.forEach((o) => { o.visible = false; });
    }
  }
});
