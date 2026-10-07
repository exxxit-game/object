import { T } from './texts.ru.js';

// Every line the experimenter says aloud and its recording in voice/.
// `text` is the line as shown on screen; `spoken` (optional) is what the voice
// reads when it differs, e.g. numbers written as words.
// Regenerate recordings: node tools/make-voice.mjs 01-ono [--force]
export const VOICE_LINES = [
  { file: 'voice/intro-1.mp3', text: T.intro[0] },
  { file: 'voice/intro-2.mp3', text: T.intro[1] },
  { file: 'voice/intro-3.mp3', text: T.intro[2] },
  { file: 'voice/praise-1.mp3', text: T.praise[0] },
  { file: 'voice/praise-2.mp3', text: T.praise[1] },
  { file: 'voice/praise-3.mp3', text: T.praise[2] },
  { file: 'voice/prod-1.mp3', text: T.prods[0] },
  { file: 'voice/prod-2.mp3', text: T.prods[1] },
  { file: 'voice/question.mp3', text: T.question.ask },
  { file: 'voice/round-2.mp3', text: T.round2 },
  { file: 'voice/time-up.mp3', text: T.timeUp }
];
