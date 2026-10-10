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

// whether his own messages of that day hold a «да»: the assistant writes the board, so a yes there
// counts only when his log (written by the prompt hook, word for word) has one that day
export const LOG = 'Documents/objekt-files/notes/owner-messages.md';
// «да» as a word in any case and inside any quotes: the board writes his answers quoted («да», «Да»),
// and an exact match on the bare word called every session stalled
export const isYes = (text) => new RegExp(`(^|[^\\p{L}])${YES}([^\\p{L}]|$)`, 'iu').test(text);
export function saidYes(log, when) {
  return log.split(/\r?\n(?=## \d{4}-\d\d-\d\dT)/).some((m) => {
    const at = m.match(/^## (\S+)/);
    return at && dayKey(new Date(at[1])) === when && isYes(m.slice(m.indexOf('\n')));
  });
}

// The last two rows of past sessions both without his yes: a row still waiting from an earlier day is
// a session he saw nothing in, and a yes counts only if his log confirms it (when the log is at hand)
export function stalled(rows, { today = dayKey(), log = null } = {}) {
  const yes = (r) => isYes(r.answer) && (log === null || saidYes(log, r.when));
  const done = rows.filter((r) => r.answer !== PENDING || r.when !== today);
  return done.length >= 2 && done.slice(-2).every((r) => !yes(r));
}
