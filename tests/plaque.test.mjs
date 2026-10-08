// A room's door plaque shows its number only: the experiment's name would tell the player what
// is studied before they do it (demand characteristics, Orne 1962; docs/mistakes.md). The name
// comes in the reveal, after the room.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writePlaque } from '../src/app/brand.js';

let written = null;
writePlaque({ write: (blocks) => { written = blocks; } }, { number: 'КОМНАТА 1', name: 'X', year: '1979' });
assert.deepEqual(written.map(b => b.t), ['КОМНАТА 1'], 'the plaque writes the number and nothing else');

// no room hands an experiment name or year to its plaque
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rooms = path.join(ROOT, 'src/rooms');
for (const dir of fs.readdirSync(rooms)) {
  for (const f of fs.readdirSync(path.join(rooms, dir)).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(rooms, dir, f), 'utf8');
    for (const call of src.match(/writePlaque\([^;]*\)|plaque:\s*\{[^}]*\}/g) || []) {
      assert.ok(!/name|year/.test(call), `${dir}/${f}: ${call}`);
    }
    assert.ok(!/plaque:\s*T\.|\.\.\.T\.plaque|#plaque'\)\.components\.panel\.write/.test(src), `${dir}/${f}: a plaque written past writePlaque`);
  }
}
console.log('plaque tests: ok');
