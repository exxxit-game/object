import { T } from './texts.ru.js';

// Screen pages of the reveal, built from analyseSession() output. Each page is
// short enough to stay readable in a headset.
const SOFT = '#c4c0b7';
const HEAD = '#9a968d';
const GOLD = '#f0c96a';
const header = (t) => ({ t, size: 34, color: HEAD, weight: 700, spacing: 6 });

export const totalPulls = (s) => s.r1.pulls + (s.r2 ? s.r2.pulls : 0);

export function reportLevers(s) {
  const R = T.report;
  const r1 = s.r1, r2 = s.r2 || { pulls: 0, per: [0, 0, 0], idle: 0 };
  const pulls = totalPulls(s);
  const per = r1.per.map((n, i) => n + r2.per[i]);
  const blocks = [header(R.header)];
  blocks.push({ t: pulls ? R.pulls(pulls, per) : R.noPulls, size: 50, weight: 500 });
  if (r1.best && r1.best.count > 1) {
    const names = r1.best.seq.map(i => T.leverNames[i]);
    blocks.push({ t: R.system(names, r1.best.count, r1.pts), size: 50, weight: 500 });
    if (s.r2) blocks.push({ t: R.repeats(s.repeats), size: 50, weight: 500 });
  }
  if (pulls) blocks.push({ t: R.idle(r1.idle + r2.idle), size: 50, weight: 500 });
  return blocks;
}

export function reportVerdict(s) {
  const R = T.report;
  const blocks = [header(R.header)];
  if (s.answer !== null) blocks.push({ t: R.belief[s.answer], size: 50, weight: 500 });
  if (s.looks) blocks.push({ t: R.looks(s.looks), size: 50, color: SOFT, weight: 500 });
  if (s.reaches) blocks.push({ t: R.reaches(s.reaches), size: 50, color: SOFT, weight: 500 });
  blocks.push({ t: R.verdict, size: 56, color: GOLD, weight: 700, gap: 44 });
  return blocks;
}

// prev: the previous session in this visit, if the player plays again.
export function originalBlocks(s, prev) {
  const O = T.original;
  const blocks = [
    header(O.header),
    { t: O.study, size: 44, weight: 500 },
    { t: O.result, size: 44, weight: 500 },
    { t: O.difference, size: 40, color: SOFT, weight: 500 }
  ];
  if (prev) blocks.push({ t: O.previousRun(totalPulls(prev), totalPulls(s)), size: 42, color: GOLD, weight: 600, gap: 30 });
  blocks.push({ t: O.share, size: 42, color: '#f2efe8', weight: 600, gap: 34 });
  blocks.push({ t: O.link, size: 38, color: HEAD, weight: 600 });
  return blocks;
}
