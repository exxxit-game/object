// Keeps the player's camera inside the booth.
AFRAME.registerComponent('room-bounds', {
  tick() {
    const p = this.el.object3D.position;
    p.x = Math.max(-1.4, Math.min(1.4, p.x));
    p.z = Math.max(-0.5, Math.min(1.0, p.z));
  }
});
