// Fades the view to black and back (moving between places without a jump). A black
// sphere around the camera whose opacity follows a target; it runs in the scene's own
// frame loop, so it also works inside a VR session, where window timers do not drive frames.
AFRAME.registerComponent('fader', {
  schema: { ms: { default: 450 } },
  init() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false })
    );
    this.mesh.renderOrder = 9999;
    this.mesh.visible = false;
    this.el.setObject3D('fader', this.mesh);
    this.target = 0;
    this.done = null;
  },
  // to: 1 = black, 0 = clear. Resolves when the fade has finished.
  to(target) {
    this.target = target;
    this.mesh.visible = true;
    return new Promise((resolve) => { this.done = resolve; });
  },
  tick(t, dt) {
    const m = this.mesh.material;
    if (!this.done) return;
    const step = (dt || 16) / this.data.ms;
    m.opacity = this.target > m.opacity ? Math.min(this.target, m.opacity + step) : Math.max(this.target, m.opacity - step);
    if (m.opacity === this.target) {
      this.mesh.visible = this.target > 0;
      const done = this.done;
      this.done = null;
      done();
    }
  }
});
