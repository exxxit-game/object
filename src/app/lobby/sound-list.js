// Sound effects of the corridor and the prompts they were generated from
// (ElevenLabs sound generation). Regenerate: node tools/make-sounds.mjs app/lobby [--force]
// The sign's starter click turns the player's eyes to it: in VR a new sound draws the
// gaze, a still light does not (Rothe & Hußmann 2018, LMU).
export const SOUNDS = [
  { name: 'sign-click', file: 'sound/sign-click.mp3', seconds: 0.5,
    prompt: 'the starter of an old fluorescent tube light clicking once with a short electric buzz, close, dry, no music' },
  { name: 'sign-hum', file: 'sound/sign-hum.mp3', seconds: 10,
    prompt: 'steady low electrical hum of an old fluorescent light box, quiet, constant, seamless loop, no clicks, no music' }
];
