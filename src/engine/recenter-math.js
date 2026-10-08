// Pure math for recenter.js: the rig transform that puts a head with the given
// local pose (position px, pz and yaw, relative to the rig) at the target spot
// (tx, tz) facing target yaw. Angles in radians. Rotation is about the Y axis,
// using three.js conventions.
export function rigTransform(px, pz, headYaw, tx, tz, targetYaw) {
  const phi = targetYaw - headYaw;
  return {
    yaw: phi,
    x: tx - (px * Math.cos(phi) + pz * Math.sin(phi)),
    z: tz - (-px * Math.sin(phi) + pz * Math.cos(phi))
  };
}

// Seated mode: a head lower than `below` metres means the player sits. Then the
// rig is lifted so the eyes are at the designed standing height `eye`; the
// table, its controls and the screen end up at the right place relative to the body.
export function seatedLift(headY, eye = 1.6, below = 1.35) {
  return headY < below ? eye - headY : 0;
}
