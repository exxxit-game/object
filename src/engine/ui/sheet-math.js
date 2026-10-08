// Pure math for sheet.js: where the clipboard sheet appears and how big its letters
// look. Research (docs/decisions.md): read at about 1 m (Meta display guidance; rays are
// comfortable from 0.8 m), a little below the eyes, world-fixed once shown; letters at
// least the game's readable minimum, answer targets at least 2.5 degrees (Meta).
export const READ_DIST = 1.0;
export const DROP_DEG = 12;
export const MIN_LETTER_DEG = 1.2;
export const MIN_TARGET_DEG = 2.5;

// head: [x, y, z] eyes in world metres; yaw: the way the player faces (radians,
// three.js: 0 looks along -Z). Returns the sheet centre and its three.js rotation
// (order YXZ) so that its face points back at the eyes.
export function frontPose(head, yaw) {
  const d = DROP_DEG * Math.PI / 180;
  const ahead = [-Math.sin(yaw), -Math.cos(yaw)];
  const pos = [
    head[0] + READ_DIST * Math.cos(d) * ahead[0],
    head[1] - READ_DIST * Math.sin(d),
    head[2] + READ_DIST * Math.cos(d) * ahead[1]
  ];
  return { pos, yaw, pitch: -d };
}

// How big a letter of this size looks from this distance, in degrees of view.
export function letterDeg(sizeM, distM) {
  return 2 * Math.atan(sizeM / 2 / distM) * 180 / Math.PI;
}
