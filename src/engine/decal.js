// A thin thing lying on a surface (a kick plate on a leaf, a strap on a wall, a label on a shell,
// a dial on its gauge) keeps its real thickness and is drawn over what it lies on by a depth
// offset, as decals are: two faces that face the same way a few millimetres apart flicker into
// each other in a headset (docs/vr-checklist.md, docs/decisions.md). Prints on a canvas use the
// panel's decal, which takes the same offset. Where several prints lie on one surface at their own
// depths (the clipboard's board under its page, its ink and its buttons), the surface is pushed
// back instead (back: true), so the prints keep their order among themselves.
// <a-box decal ...></a-box>  <a-entity plate="..." decal="back: true">
export const DECAL_OFFSET = { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 };
const BACK_OFFSET = { polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 };

AFRAME.registerComponent('decal', {
  schema: { back: { default: false } },
  // the material component may set its material after this one starts: offset it again then
  init() {
    this.apply = this.apply.bind(this);
    this.onComponent = (e) => { if (e.detail.name === 'material') this.apply(); };
    this.el.addEventListener('object3dset', this.apply);
    this.el.addEventListener('componentinitialized', this.onComponent);
    this.el.addEventListener('loaded', this.apply);
    this.apply();
  },
  remove() {
    this.el.removeEventListener('object3dset', this.apply);
    this.el.removeEventListener('componentinitialized', this.onComponent);
    this.el.removeEventListener('loaded', this.apply);
  },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    for (const m of [].concat(mesh.material)) { Object.assign(m, this.data.back ? BACK_OFFSET : DECAL_OFFSET); m.needsUpdate = true; }
  }
});
