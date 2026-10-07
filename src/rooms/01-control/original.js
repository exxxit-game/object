// Results of the original and of the replication, shown in the reveal.
// Single place for these numbers; tests/control-protocol.test.mjs guards them.
export const ORIGINAL = Object.freeze({
  // Alloy & Abramson 1979, Exp. 2, Table 5 (p. 459): mean judged control,
  // non-depressed students, n = 8 per cell
  nondepressed: Object.freeze({
    '25-25': Object.freeze({ men: 20.0, women: 7.5 }),
    '75-75': Object.freeze({ men: 30.3, women: 51.4 })
  }),
  // p. 461: non-depressed students who said "zero control" in 75-75
  zeroIn7575: 6,
  participants: 64,  // p. 457
  // Dev, Moore, Johnson & Garrett 2022, Table 1: end-of-task control, zero contingency
  replication: Object.freeze({
    year: 2022,
    people: 380,     // 246 + 136 (Samples One and Two), rounded
    '25-25': Object.freeze([18.15, 27.64]),
    '75-75': Object.freeze([34.23, 36.83])
  })
});
