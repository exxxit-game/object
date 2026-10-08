// The game's own colours, the same in every room: the plaque by the door, accents
// on the experimenter's screen. One place, so every room stays recognisable.
export const BRAND = {
  accent: '#d9a441', // amber
  plate: '#15161a'
};

// The signs by the doors, one family (Louisiana State University, Interior & Exterior Room Signage
// Guidelines, rev. 07.2024): a room's number on a 6 × 6 in plaque (Type A1); the stairs' on an
// 8 × 8 in one, a 4 in stair symbol in a 6 in field over the word (Type E; ADA 2010 703.6.1);
// a room number 1 in high, the word for a stairwell 5/8 in (University of Maryland, Design Criteria
// / Facility Standards Manual 10 14 00, 2023; ADA 2010 703.2.5 allows 5/8 to 2 in); centred 60 in
// above the floor (LSU 1.3.1.2, ADA 1991 4.30.6) and 9 in from the door's frame (Iowa State
// University, Division 10 Interior Signage Standards). Drawn at 2560 px a metre, where a capital is
// about 0.7 of the font size.
export const SIGN = { room: 0.1524, stairs: 0.2032, y: 1.524, fromFrame: 0.2286, px: 2560 };
SIGN.number = Math.round(0.0254 * SIGN.px / 0.7);
SIGN.letters = Math.round(0.015875 * SIGN.px / 0.7);

// The plaque by every room's door: its number and nothing else. The experiment's name would tell
// the player what is studied before they do it, and people who know the hypothesis act on it
// (demand characteristics, Orne 1962): the name comes in the reveal, after the room
// (tests/plaque.test.mjs). panel: the plaque's panel component; plaque: { number }.
export function writePlaque(panel, { number }) {
  panel.write([{ t: number, size: SIGN.number, weight: 700, color: BRAND.accent, spacing: 6 }], { bg: BRAND.plate });
}
