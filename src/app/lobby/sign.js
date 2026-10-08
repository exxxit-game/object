// The light box above door 1 comes on like an old fluorescent tube: the starter tries
// twice, then the tube lights and stays. Glow levels (0..1) from each time on, in seconds.
// The first thing the player sees, before any text (phenomenon first: Allen 2004,
// Exploratorium), and its clicks turn the eyes to it (a new sound draws the gaze in VR,
// a still light does not: Rothe & Hußmann 2018). Safe for photosensitive players:
// at most three flashes in any one second, never red (WCAG 2.3.1; tests/glow.test.mjs).
export const SIGN_START = [
  [0, 0.04],
  [0.15, 0.55], [0.23, 0.06],
  [0.75, 0.7], [0.85, 0.08],
  [1.6, 1]
];
// Where the sign hangs (world metres): its sounds come from here.
export const SIGN_AT = { x: 0.6, y: 2.34, z: 1.85 };
