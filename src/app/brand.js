// The game's own colours, the same in every room: the plaque by the door, accents
// on the experimenter's screen. One place, so every room stays recognisable.
export const BRAND = {
  accent: '#d9a441', // amber
  plate: '#15161a',
  ink: '#f2efe8',
  quiet: '#9a968d'
};

// The plaque by every room's door: "ROOM N", the experiment's name, the year.
// panel: the plaque's panel component; plaque: { number, name, year } from the room's texts.
export function writePlaque(panel, { number, name, year }) {
  panel.write([
    { t: number, size: 62, weight: 700, color: BRAND.accent, spacing: 6 },
    { t: name, size: 40, weight: 600, color: BRAND.ink, gap: 8 },
    { t: year, size: 32, weight: 500, color: BRAND.quiet, gap: 6 }
  ], { bg: BRAND.plate });
}
