// Emits 'look-change' ({ seen }) on the entity when the player starts or stops
// looking at it. Uses the headset camera while presenting, the page camera otherwise.
//
// Two thresholds (hysteresis), as cosines of the angle between gaze and object:
//   on  — becomes "seen" when the gaze is closer than this (0.85 ≈ 32°);
//   off — becomes "not seen" only when farther than this (0 = 90°, i.e. behind the
//         view plane: outside the field of view of both screens and headsets).
// Between the two nothing changes, so small head movements cause no flicker.
AFRAME.registerComponent('look-watch', {
  schema: {
    on: { default: 0.85 },
    off: { default: 0 }
  },

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
    const dot = this.dir.dot(this.to);
    const now = this.seen ? dot > this.data.off : dot > this.data.on;
    if (now !== this.seen) {
      this.seen = now;
      this.el.emit('look-change', { seen: now });
    }
  }
});
