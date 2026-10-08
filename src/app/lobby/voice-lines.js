import { LOBBY_T } from './texts.ru.js';

// Every line the experimenter says aloud in the corridor and its recording in voice/.
// Regenerate recordings: node tools/make-voice.mjs app/lobby [--force]
export const VOICE_LINES = [
  ...LOBBY_T.welcome.map((text, i) => ({ file: `voice/welcome-${i + 1}.mp3`, text })),
  { file: 'voice/choose-door.mp3', text: LOBBY_T.chooseDoor }
];
