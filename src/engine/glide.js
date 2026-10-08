import { curvePoint, easeInOut } from './ui/sheet-math.js';

// Moves an entity along a curve to a new place and turn, easing in and out (the path
// rules are in ui/sheet-math.js, glidePath). Tick-driven, so it plays in a headset.
// el.components.glide.go({ to: [x, y, z], ctrl: [x, y, z], rotation: [x, y, z] (radians,
// order YXZ), ms, step }) → Promise when it arrives; step(e), if given, gets the eased
// progress (0..1) every frame, for anything that changes along the way.
AFRAME.registerComponent('glide', {
  init() {
    this.trip = null;
  },

  go({ to, ctrl, rotation, ms, step }) {
    const o = this.el.object3D;
    this.trip = {
      from: o.position.toArray(), to, ctrl, ms, step, started: null,
      q0: o.quaternion.clone(),
      q1: new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2], 'YXZ'))
    };
    return new Promise((resolve) => { this.trip.done = resolve; });
  },

  tick(t) {
    const trip = this.trip;
    if (!trip) return;
    if (trip.started === null) trip.started = t;
    const f = Math.min(1, (t - trip.started) / trip.ms);
    const e = easeInOut(f);
    const o = this.el.object3D;
    o.position.fromArray(curvePoint(trip.from, trip.ctrl, trip.to, e));
    o.quaternion.slerpQuaternions(trip.q0, trip.q1, e);
    if (trip.step) trip.step(e);
    if (f >= 1) { this.trip = null; trip.done(); }
  }
});
