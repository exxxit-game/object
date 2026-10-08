// The game's own colours, the same in every room: the plaque by the door, accents
// on the experimenter's screen. One place, so every room stays recognisable.
export const BRAND = {
  accent: '#d9a441', // amber
  plate: '#15161a'
};

// The plaque by every room's door: "ROOM N" and nothing else. The experiment's name would tell
// the player what is studied before they do it, and people who know the hypothesis act on it
// (demand characteristics, Orne 1962): the name comes in the reveal, after the room
// (tests/plaque.test.mjs). panel: the plaque's panel component; plaque: { number }.
export function writePlaque(panel, { number }) {
  panel.write([{ t: number, size: 62, weight: 700, color: BRAND.accent, spacing: 6 }], { bg: BRAND.plate });
}
