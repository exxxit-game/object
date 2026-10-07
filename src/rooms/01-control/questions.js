import { PROTOCOL } from './protocol.js';
import { T } from './texts.ru.js';
import { APP_T } from '../../app/texts.ru.js';
import { eventLog } from '../../engine/log.js';

// The measures after the trials, in the order of the paper (pp. 449–451):
// judgment of control, then total, if-press and if-not-press percentages, then
// the post-questionnaire, then our two additions (gender, prior knowledge).
// Every answer goes to the event log as { key, value }.
const Q = T.questions;
const SCALES = [
  ['control', Q.control.labels, ''],
  ['total', T.percentLabels, '%'],
  ['ifPress', T.percentLabels, '%'],
  ['ifNoPress', T.percentLabels, '%'],
  ['certainty', Q.certainty.labels, '']
];
const CHOICES = ['evidence', 'hypotheses', 'gender', 'knew'];

// ui: { ask(text) shows the question on the screen, scale, choice }
export async function askAll(ui) {
  for (const [key, labels, unit] of SCALES) {
    ui.ask(Q[key].ask);
    const value = await new Promise((resolve) =>
      ui.scale.show({ labels, step: PROTOCOL.scaleStep, unit, doneLabel: APP_T.done }, resolve));
    eventLog.add('answer', { key, value });
  }
  for (const key of CHOICES) {
    ui.ask(Q[key].ask);
    const value = await new Promise((resolve) => ui.choice.show(Q[key].answers, resolve));
    eventLog.add('answer', { key, value });
  }
}
