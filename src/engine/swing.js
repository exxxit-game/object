// Lever motion: down and back, driven by tick() so it also runs inside a headset
// (CSS and requestAnimationFrame animations do not).
AFRAME.registerComponent('swing', {
  init() {
    this.t0 = -1;
    this.el.object3D.rotation.x = -32 * Math.PI / 180;
  },

  go() { this.t0 = performance.now(); },

  tick() {
    if (this.t0 < 0) return;
    const t = performance.now() - this.t0;
    let a;
    if (t < 110) a = -32 + 64 * (t / 110);
    else if (t < 160) a = 32;
    else if (t < 480) {
      const k = (t - 160) / 320;
      a = 32 - 64 * (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    } else { a = -32; this.t0 = -1; }
    this.el.object3D.rotation.x = a * Math.PI / 180;
  }
});
