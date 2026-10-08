// Structure rules that a non-programmer owner cannot check by eye, so the machine
// does. Each rule exists because breaking it hurt before (Cosmogram: one file and
// one notes file grew until nobody could see what was in them).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(e => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const rel = (f) => path.relative(ROOT, f).replaceAll('\\', '/');
const lines = (f) => fs.readFileSync(f, 'utf8').split('\n').length;
const code = walk(path.join(ROOT, 'src')).filter(f => f.endsWith('.js'));

// 1. No code file grows past 300 lines (CLAUDE.md rule 6).
const long = code.filter(f => lines(f) > 300).map(f => `${rel(f)} (${lines(f)})`);
assert.deepEqual(long, [], `files over 300 lines: ${long.join(', ')}`);

// 2. The engine never imports the app or a room; the app never imports a room.
const imports = (f) => [...fs.readFileSync(f, 'utf8').matchAll(/from\s+'([^']+)'|import\('([^']+)'\)|import\s+'([^']+)'/g)]
  .map(m => m[1] || m[2] || m[3]);
for (const f of code) {
  const r = rel(f);
  for (const i of imports(f)) {
    if (r.startsWith('src/engine/')) assert.ok(!/\/(app|rooms)\//.test(i) && !i.includes('../app') , `${r} imports ${i}`);
    if (r.startsWith('src/app/')) assert.ok(!i.includes('rooms/'), `${r} imports ${i}`);
  }
}

// 3. Player-facing (Cyrillic) text only in texts.*.js files (CLAUDE.md rule 4).
// Comments are allowed to be in English only, so any Cyrillic outside texts files is a leak.
const cyr = code.filter(f => !/texts\.\w+\.js$/.test(f) && /[А-Яа-яЁё]/.test(fs.readFileSync(f, 'utf8')))
  .map(rel);
assert.deepEqual(cyr, [], `Russian text outside texts files: ${cyr.join(', ')}`);

// 4. Every room has the required files.
const REQUIRED = ['room.js', 'scene.js', 'report.js', 'texts.ru.js', 'voice-lines.js', 'sound-list.js'];
for (const room of fs.readdirSync(path.join(ROOT, 'src/rooms'))) {
  for (const file of REQUIRED) {
    assert.ok(fs.existsSync(path.join(ROOT, 'src/rooms', room, file)), `room ${room} has no ${file}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, 'docs/rooms', `${room}.md`)), `room ${room} has no docs/rooms/${room}.md`);
}

// 5. Notes stay short: the state file is replaced, not appended to.
const STATE_MAX = 80;
assert.ok(lines(path.join(ROOT, 'docs/state.md')) <= STATE_MAX, `docs/state.md over ${STATE_MAX} lines: rewrite it shorter`);

// 6. No dead code: every module under src/ is imported by another file
// (the shell main.js and room.js files are entry points).
const allText = [...code, ...walk(path.join(ROOT, 'tests')), ...walk(path.join(ROOT, 'tools'))]
  .map(f => fs.readFileSync(f, 'utf8')).join('\n');
const unused = code.filter(f => !/(main|room)\.js$/.test(f))
  .filter(f => (allText.match(new RegExp(`['/]${path.basename(f).replace('.', '\\.')}'`, 'g')) || []).length === 0)
  .map(rel);
assert.deepEqual(unused, [], `modules nobody imports: ${unused.join(', ')}`);

// 7. Docs do not lie about files: every `src/…`, `tests/…`, `tools/…` or `docs/…`
// path written in backticks in a doc must exist. target-architecture.md is exempt
// (it names future files on purpose); the archive keeps history.
const docs = [path.join(ROOT, 'ARCHITECTURE.md'), path.join(ROOT, 'CLAUDE.md'),
  ...walk(path.join(ROOT, 'docs')).filter(f => f.endsWith('.md') && !/target-architecture|archive/.test(f))];
const missing = [];
for (const d of docs) {
  for (const m of fs.readFileSync(d, 'utf8').matchAll(/`((?:src|tests|tools|docs|\.claude)\/[\w./-]+?)`/g)) {
    if (!m[1].includes("NN-") && !fs.existsSync(path.join(ROOT, m[1]))) missing.push(`${rel(d)} → ${m[1]}`);
  }
}
assert.deepEqual(missing, [], `docs name files that do not exist: ${missing.join(', ')}`);

// 8. The mistakes file: short, and every row names its guard (an existing file,
// which rule 7 checks).
const mistakes = fs.readFileSync(path.join(ROOT, 'docs/mistakes.md'), 'utf8').split('\n');
assert.ok(mistakes.length <= 60, 'docs/mistakes.md over 60 lines: merge rows');
for (const row of mistakes.filter(l => l.startsWith('| ') && !/^\| (Mistake|---)/.test(l))) {
  assert.ok(/`(src|tests|tools|docs|\.claude)\/[^`]+`/.test(row.split('|')[2] || ''), `mistake without a guard: ${row.slice(0, 80)}`);
}

// 9. Every script parses (a shell heredoc once changed backslashes silently).
const scripts = [...code, ...walk(path.join(ROOT, 'tests')), ...walk(path.join(ROOT, 'tools'))]
  .filter(f => /\.m?js$/.test(f));
for (const f of scripts) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
  catch (e) { assert.fail(`syntax error in ${rel(f)}: ${String(e.stderr).split('\n').slice(0, 4).join(' ')}`); }
}

// 10. The experiment catalog is generated from the cards and must be current.
try { execFileSync(process.execPath, [path.join(ROOT, 'tools/build-catalog.mjs'), '--check'], { stdio: 'pipe' }); }
catch (e) { assert.fail(String(e.stderr || e.stdout).trim()); }

// 11. A component never gives its own method the name play() or pause() with arguments:
// A-Frame calls those itself when an entity starts and stops, so a sign told to "play"
// its start-up lit nothing.
const hijacked = code.filter(f => {
  const s = fs.readFileSync(f, 'utf8');
  return /registerComponent/.test(s) && /^\s{2}(play|pause)\s*\(\s*\w/m.test(s);
}).map(rel);
assert.deepEqual(hijacked, [], `component methods named play/pause: ${hijacked.join(', ')}`);

console.log('structure tests: ok');
