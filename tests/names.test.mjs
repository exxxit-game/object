// Ad and tracker blockers (AdGuard, Ghostery, uBlock lists) block files whose
// names look like analytics. One blocked module kills the whole game, so no file
// served to the browser may have such a name. Found in practice: "analyse.js"
// was blocked in Quest Browser with AdGuard.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVED = ['src', 'css', 'vendor'];
const RISKY = /analy[sz]|track|telemetr|beacon|metric|stats?\b|statistic|collect|advert|banner|pixel|counter|fingerprint/i;

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(e => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

const bad = SERVED.flatMap(d => walk(path.join(ROOT, d)))
  .map(f => path.relative(ROOT, f).replaceAll('\\', '/'))
  .filter(f => RISKY.test(f));

assert.deepEqual(bad, [], `file names that ad blockers may block: ${bad.join(', ')}`);
console.log('names tests: ok');
