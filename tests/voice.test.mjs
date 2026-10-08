// Every line the experimenter speaks, in every room, must have its recording.
import assert from 'node:assert/strict';
import fs from 'node:fs';

// every room, and the lab corridor before the rooms
const rooms = [...fs.readdirSync(new URL('../src/rooms/', import.meta.url)).map((r) => `rooms/${r}`), 'app/lobby'];
let total = 0;
for (const room of rooms) {
  const dir = new URL(`../src/${room}/`, import.meta.url);
  const { VOICE_LINES } = await import(new URL('voice-lines.js', dir));
  for (const line of VOICE_LINES) {
    const file = new URL(line.file, dir);
    assert.ok(fs.existsSync(file), `${room}: missing recording ${line.file}`);
    assert.ok(fs.statSync(file).size > 1000, `${room}: recording too small ${line.file}`);
  }
  const texts = VOICE_LINES.map(l => l.text);
  assert.equal(new Set(texts).size, texts.length, `${room}: two voice lines share the same text`);
  assert.equal(new Set(VOICE_LINES.map(l => l.file)).size, VOICE_LINES.length, `${room}: two lines share a file`);
  total += VOICE_LINES.length;
}
console.log(`voice tests: ok (${total} recordings in ${rooms.length} rooms)`);
