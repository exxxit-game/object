// The game draws every text in its own faces (css/fonts.css, src/engine/panel.js), each split
// into files by script. A letter no file covers would show as an empty box in the headset: every
// character of every player-facing text file must be covered by every face, so a new language
// fails here until its script's files are added. Each file is vendored with its licence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(ROOT, 'css/fonts.css'), 'utf8');
const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => ({
  family: body.match(/font-family:\s*([^;]+);/)[1].trim(),
  file: body.match(/url\(([^)]+)\)/)[1],
  ranges: body.match(/unicode-range:\s*([^;]+);/)[1].split(',').map((r) => {
    const [a, b] = r.trim().replace(/^U\+/i, '').split('-').map((h) => parseInt(h, 16));
    return [a, b ?? a];
  })
}));
assert.ok(faces.length >= 2, 'faces declared in css/fonts.css');
const families = [...new Set(faces.map((f) => f.family))];
for (const f of faces) {
  const file = path.join(ROOT, 'css', f.file);
  assert.ok(fs.existsSync(file) && fs.readFileSync(file).subarray(0, 4).toString() === 'wOF2', `${f.file}: a woff2 file in the repo`);
  assert.ok(fs.existsSync(path.join(path.dirname(file), `OFL-${f.family.toLowerCase()}.txt`)), `${f.family}: its licence beside the file`);
}
// the faces the game waits for before a room starts are the ones declared
const main = fs.readFileSync(path.join(ROOT, 'src/main.js'), 'utf8');
for (const family of families) assert.ok(main.includes(`px ${family}'`), `src/main.js waits for ${family}`);

const texts = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (/^texts\.[a-z]{2}\.js$/.test(e.name)) texts.push(p);
  }
};
walk(path.join(ROOT, 'src'));
assert.ok(texts.length >= 1, 'player-facing text files');
let count = 0;
for (const file of texts) {
  const chars = new Set([...fs.readFileSync(file, 'utf8')].filter((c) => c.codePointAt(0) >= 0x20));
  for (const c of chars) {
    const cp = c.codePointAt(0);
    for (const family of families) {
      const covered = faces.some((f) => f.family === family && f.ranges.some(([a, b]) => cp >= a && cp <= b));
      assert.ok(covered, `${path.relative(ROOT, file)}: "${c}" (U+${cp.toString(16).toUpperCase().padStart(4, '0')}) is in no file of ${family}`);
    }
  }
  count += chars.size;
}
console.log(`fonts tests: ok (${families.join(', ')}: ${faces.length} files; ${count} characters in ${texts.length} text files covered)`);
