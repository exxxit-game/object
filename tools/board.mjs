// The owner's one-page board (docs/board.md) as the guard reads it. Progress has one measure: he
// saw it and said yes. Each session opens with a row in «Показы» saying what he will see today, so
// a session that shows him nothing is visible as such; two finished rows in a row without his yes
// stop the side work. Claude Code's own best practices: rules a model must follow every time
// belong in hooks, which are deterministic, not in a long rules file it can lose track of
// (code.claude.com/docs/en/best-practices).
export const BOARD = 'docs/board.md';
export const YES = 'да';
export const PENDING = 'ждёт';
export const SHOWS = '## Показы';

// the rows of the «Показы» table: { when, what, answer }
export function shows(text) {
  const at = text.indexOf(SHOWS);
  if (at < 0) return [];
  return text.slice(at).split(/\r?\n/)
    .filter((l) => /^\|\s*\d{1,2}\.\d{1,2}\s*\|/.test(l))
    .map((l) => { const [when, what, answer] = l.split('|').slice(1, 4).map((c) => c.trim()); return { when, what, answer }; });
}

// today as the board writes dates: day.month, no leading zeros
export const dayKey = (d = new Date()) => `${d.getDate()}.${d.getMonth() + 1}`;

export const plannedToday = (rows, key = dayKey()) => rows.some((r) => r.when === key);

// the last two answered rows both without his yes
export function stalled(rows) {
  const answered = rows.filter((r) => r.answer && r.answer !== PENDING);
  return answered.length >= 2 && answered.slice(-2).every((r) => r.answer !== YES);
}
