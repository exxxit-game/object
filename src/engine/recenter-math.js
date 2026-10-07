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
