import { rigTransform } from './recenter-math.js';

// Puts the player at the designed spot, facing the designed direction, in VR.
// A headset sets its origin where the player happened to stand and look when the
// session started, so without this the room appears shifted or rotated.
// Runs on entering VR and when the player recenters the headset (reference
// space "reset", e.g. holding the Meta button). Put on the camera rig.
AFRAME.registerComponent('recenter', {
  schema: {
    x: { default: 0 },     // where the head should be (world metres)
    z: { default: 0.35 },
    yaw: { default: 0 }    // which way the player should face (degrees, 0 = -Z)
  },

  init() {
    this.saved = { p: this.el.object3D.position.clone(), r: this.el.object3D.rotation.y };
    this.apply = this.apply.bind(this);
    const sc = this.el.sceneEl;
    sc.addEventListener('enter-vr', () => {
      // the first pose arrives a few frames after the session starts
      setTimeout(this.apply, 300);
      const space = sc.renderer.xr.getReferenceSpace();
      if (space && !this.space) { this.space = space; space.addEventListener('reset', () => setTimeout(this.apply, 100)); }
    });
    sc.addEventListener('exit-vr', () => {
      this.space = null;
      this.el.object3D.position.copy(this.saved.p);
      this.el.object3D.rotation.y = this.saved.r;
    });
  },

  apply() {
    const sc = this.el.sceneEl;
    if (!sc.renderer.xr.isPresenting) return;
    const head = sc.camera.el.object3D; // headset pose, local to this rig
    const e = new THREE.Euler().setFromQuaternion(head.quaternion, 'YXZ');
    const t = rigTransform(head.position.x, head.position.z, e.y,
      this.data.x, this.data.z, THREE.MathUtils.degToRad(this.data.yaw));
    const rig = this.el.object3D;
    rig.rotation.y = t.yaw;
    rig.position.x = t.x;
    rig.position.z = t.z;
    this.el.emit('recentered');
  }
});
