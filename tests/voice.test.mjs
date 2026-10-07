// Every line the experimenter speaks must have its recording in the room folder.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { VOICE_LINES } from '../src/rooms/01-ono/voice-lines.js';

const dir = new URL('../src/rooms/01-ono/', import.meta.url);
for (const line of VOICE_LINES) {
  const file = new URL(line.file, dir);
  assert.ok(fs.existsSync(file), `missing recording: ${line.file}`);
  assert.ok(fs.statSync(file).size > 1000, `recording too small: ${line.file}`);
}
const texts = VOICE_LINES.map(l => l.text);
assert.equal(new Set(texts).size, texts.length, 'two voice lines share the same text');

console.log(`voice tests: ok (${VOICE_LINES.length} recordings)`);
