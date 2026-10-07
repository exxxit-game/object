// Sound effects of room 01 and the prompts they were generated from
// (ElevenLabs sound generation). Regenerate: node tools/make-sounds.mjs 01-ono [--force]
export const SOUNDS = [
  { name: 'lever', file: 'sound/lever.mp3', seconds: 0.8,
    prompt: 'a heavy metal lever pulled down and snapping back on an old laboratory control panel, single mechanical clunk, dry, close' },
  { name: 'point', file: 'sound/point.mp3', seconds: 0.7,
    prompt: 'an old electromechanical counter ticking one step with a short electric buzzer, 1980s laboratory equipment, dry' },
  { name: 'cough', file: 'sound/cough.mp3', seconds: 1.5,
    prompt: 'a man quietly clears his throat in the next room, heard muffled through a wall, short' },
  { name: 'chair', file: 'sound/chair.mp3', seconds: 1.5,
    prompt: 'an old office chair creaks once as someone shifts their weight, in the next room, muffled through a wall' },
  { name: 'room', file: 'sound/room.mp3', seconds: 20,
    prompt: 'quiet constant room tone of a small windowless laboratory booth, soft ventilation hum and faint electrical hum of a lamp, no voices, seamless' }
];
