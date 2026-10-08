// Polished metal shows the room round it; with nothing to mirror it reads as grey plastic.
// reflect-env takes a small picture of the surroundings from the object's place (a cube map) and
// gives it to the object's metal parts (metalness 0.5 or more). It takes it again a few times
// while the lights settle after load, then never, so it costs nothing afterwards.
// <a-entity reflect-env> ... polished parts ... </a-entity>
AFRAME.registerComponent('reflect-env', {
  schema: { size: { default: 128 }, times: { default: 6 }, every: { default: 2500 } },

  init() {
    const THREE = AFRAME.THREE;
    this.target = new THREE.WebGLCubeRenderTarget(this.data.size);
    this.cam = new THREE.CubeCamera(0.05, 30, this.target);
    this.el.sceneEl.object3D.add(this.cam);
    this.taken = 0;
    this.last = -Infinity;
  },

  tick(t) {
    if (this.taken >= this.data.times || t - this.last < this.data.every) return;
    this.last = t;
    this.taken++;
    this.take();
  },

  take() {
    const renderer = this.el.sceneEl.renderer, o = this.el.object3D;
    // from the middle of the object itself (its parts may sit far from the entity's origin)
    new AFRAME.THREE.Box3().setFromObject(o).getCenter(this.cam.position);
    o.visible = false;   // the object must not mirror itself
    const xr = renderer.xr.enabled;
    renderer.xr.enabled = false;
    this.cam.update(renderer, this.el.sceneEl.object3D);
    renderer.xr.enabled = xr;
    o.visible = true;
    o.traverse((m) => {
      if (m.material && m.material.metalness >= 0.5 && m.material.envMap !== this.target.texture) {
        m.material.envMap = this.target.texture;
        m.material.needsUpdate = true;
      }
    });
  },

  remove() {
    this.el.sceneEl.object3D.remove(this.cam);
    this.target.dispose();
  }
});
