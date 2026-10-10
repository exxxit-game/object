// Keeps the desktop camera (mouse + WASD) inside the room. In VR the headset
// pose is the player's real position, so it is left alone there.
AFRAME.registerComponent('room-bounds', {
  schema: {
    minX: { default: -1.4 }, maxX: { default: 1.4 },
    minZ: { default: -0.5 }, maxZ: { default: 1.0 }
  },
  tick() {
    if (this.el.sceneEl.is('vr-mode')) return;
    const p = this.el.object3D.position;
    const d = this.data;
    p.x = Math.max(d.minX, Math.min(d.maxX, p.x));
    p.z = Math.max(d.minZ, Math.min(d.maxZ, p.z));
  }
});
