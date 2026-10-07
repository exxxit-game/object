import { eventLog } from './log.js';

// Logs a 'reach' event when a controller rises above 2.05 m (reaching for the ceiling).
// At most one event per 1.5 s, and only while a run is active.
AFRAME.registerComponent('reach-watch', {
  init() {
    this.p = new THREE.Vector3();
    this.cool = 0;
  },

  tick(t) {
    if (!eventLog.running) return;
    this.el.object3D.getWorldPosition(this.p);
    if (this.p.y > 2.05 && t > this.cool) {
      this.cool = t + 1500;
      eventLog.add('reach');
    }
  }
});
