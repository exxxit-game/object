// Keeps the desktop camera (mouse + WASD) inside the booth. In VR the headset
// pose is the player's real position, so it is left alone there.
AFRAME.registerComponent('room-bounds', {
  tick() {
    if (this.el.sceneEl.is('vr-mode')) return;
    const p = this.el.object3D.position;
    p.x = Math.max(-1.4, Math.min(1.4, p.x));
    p.z = Math.max(-0.5, Math.min(1.0, p.z));
  }
});
