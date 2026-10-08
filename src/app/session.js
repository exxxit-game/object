import { sendResult, sendPlaytest, markPlayed } from '../engine/results.js';

// One play of a room, from consent to result. Every room uses this, so consent,
// first/repeat runs and sending work the same everywhere.

// Results are sent only with the privacy page published (privacy.html) and only
// when the player chose "start with recording".
const SENDING_ENABLED = true;

// ?speed=N runs all timings N times faster for tests and headset checks; such
// runs are never sent, so test data cannot reach the statistics.
const requested = Number(new URLSearchParams(location.search).get('speed'));
export const SPEED = requested >= 1 && requested <= 100 ? requested : 1;

// ?playtest=1: after the reveal the player answers the playtest questions, and the
// answers with the run measures go to the playtest table (with consent).
export const PLAYTEST = new URLSearchParams(location.search).get('playtest') === '1';

export function createSession(roomId, roomVersion) {
  let record = false;
  let first = true;
  return {
    // record: the player chose "start with recording" on the consent screen
    begin(withRecording) {
      record = !!withRecording;
      first = markPlayed(roomId);
    },
    get record() { return record; },
    get first() { return first; },
    // Sends the report when the player agreed and this is a real-speed run.
    finish(report) {
      if (!SENDING_ENABLED || !record || SPEED !== 1) return Promise.resolve(false);
      return sendResult(roomId, roomVersion, first, report);
    },
    // Playtest feedback: the same conditions, plus playtest mode.
    finishPlaytest(report) {
      if (!SENDING_ENABLED || !PLAYTEST || !record || SPEED !== 1) return Promise.resolve(false);
      return sendPlaytest(roomId, roomVersion, report);
    }
  };
}
