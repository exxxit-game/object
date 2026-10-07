// Emits 'look-change' ({ seen }) on the entity when the player starts or stops
// looking at it. Uses the headset camera while presenting, the page camera otherwise.
AFRAME.registerComponent('look-watch', {
  init() {
    this.seen = false;
    this.cam = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.to = new THREE.Vector3();
    this.me = new THREE.Vector3();
  },

  tick() {
    const sc = this.el.sceneEl;
    const xr = sc.renderer && sc.renderer.xr;
    const cam = xr && xr.isPresenting ? xr.getCamera() : sc.camera;
    if (!cam) return;
    cam.getWorldPosition(this.cam);
    cam.getWorldDirection(this.dir);
    this.el.object3D.getWorldPosition(this.me);
    this.to.subVectors(this.me, this.cam).normalize();
    const now = this.dir.dot(this.to) > 0.85;
    if (now !== this.seen) {
      this.seen = now;
      this.el.emit('look-change', { seen: now });
    }
  }
});
