import { T } from './texts.ru.js';
import { APP_T } from '../../app/texts.ru.js';
import { ORIGINAL } from './original.js';

// The reveal pages as text blocks for the wall screen. States only what the log
// proves (report r) and what the sources say (original.js). Numbers are rounded
// to whole points for reading; exact values are in docs/rooms/01-control.md.
const INK = '#f2efe8';
const SOFT = '#c4c0b7';
const HEAD = '#9a968d';
const R = T.reveal;

const head = (t) => ({ t, size: 34, color: HEAD, weight: 700, spacing: 6 });
const body = (t, gap = 22) => ({ t, size: 44, color: INK, weight: 500, gap });
const soft = (t, gap = 22) => ({ t, size: 38, color: SOFT, weight: 500, gap });
const round = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v)]));

// r: analyse() result; condition: '25-25' | '75-75'
export function revealPages(r, condition) {
  const pct = condition.split('-')[0];
  const control = r.answers.control;
  const gender = r.answers.gender; // 0 men, 1 women, 2 not said
  const nonPress = r.trials - r.presses;
  const rep = ORIGINAL.replication;
  const repRounded = { ...rep, '25-25': rep['25-25'].map(Math.round), '75-75': rep['75-75'].map(Math.round) };

  const you = [
    head(R.youHeader),
    body(R.presses(r.presses, r.trials), 30),
    body(R.whenPressed(r.greenIfPress, r.presses)),
    body(R.whenNot(r.greenIfNoPress, nonPress)),
    body(R.yourRating(control), 30)
  ];
  const truth = [head(R.truthHeader), body(R.truth(pct), 30), soft(R.observer, 30)];
  const original = [
    head(R.originalHeader),
    body(R.original(ORIGINAL.participants), 30),
    soft(R.originalResult(round(ORIGINAL.nondepressed['25-25']), round(ORIGINAL.nondepressed['75-75']), ORIGINAL.zeroIn7575), 26),
    body(R.yourCondition(pct, control), 30)
  ];
  if (gender === 0 || gender === 1) {
    const mean = ORIGINAL.nondepressed[condition][gender === 0 ? 'men' : 'women'];
    original.push(soft(R.sameGroup(R.who[gender], Math.round(mean))));
  }
  const replication = [head(R.replicationHeader), body(R.replication(repRounded), 30), soft(R.sadder, 30)];
  const diffs = [
    head(R.diffHeader),
    ...R.diffs.map((t, i) => soft(t, i ? 14 : 30)),
    body(APP_T.share, 34),
    soft(APP_T.link, 18)
  ];
  return [you, truth, original, replication, diffs];
}
