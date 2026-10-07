import { T } from './texts.ru.js';

// Points needed to finish the session.
export const GOAL = 12;

// Every line the experimenter says aloud and its recording in voice/.
// `text` is the line as shown on screen; `spoken` (optional) is what the voice
// reads when it differs, e.g. numbers written as words.
// Regenerate recordings: node tools/make-voice.mjs 01-ono
export const VOICE_LINES = [
  { file: 'voice/intro-1.mp3', text: T.intro[0] },
  { file: 'voice/intro-2.mp3', text: T.intro[1] },
  { file: 'voice/intro-3.mp3', text: T.intro[2](GOAL), spoken: T.spoken.goal },
  { file: 'voice/praise-3.mp3', text: T.praise[3] },
  { file: 'voice/praise-6.mp3', text: T.praise[6] },
  { file: 'voice/praise-9.mp3', text: T.praise[9] },
  { file: 'voice/question.mp3', text: T.question.ask },
  { file: 'voice/round-2.mp3', text: T.round2 },
  { file: 'voice/session-over.mp3', text: T.sessionOver }
];
