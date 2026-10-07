// Every sound effect of the room must have its file.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SOUNDS } from '../src/rooms/01-ono/sound-list.js';

const dir = new URL('../src/rooms/01-ono/', import.meta.url);
for (const s of SOUNDS) {
  const file = new URL(s.file, dir);
  assert.ok(fs.existsSync(file), `missing sound: ${s.file}`);
  assert.ok(fs.statSync(file).size > 1000, `sound too small: ${s.file}`);
}
assert.equal(new Set(SOUNDS.map(s => s.name)).size, SOUNDS.length, 'two sounds share a name');
console.log(`sound tests: ok (${SOUNDS.length} sounds)`);
