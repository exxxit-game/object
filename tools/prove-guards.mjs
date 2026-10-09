// Proves every guard sees its mistake. A test that passes says only that nothing broke the rule
// OR that the test cannot see it; the way to tell them apart is to plant the mistake and watch the
// guard go red (mutation testing). Each case below plants exactly the mistake one guard exists
// for, in a throwaway clone of the last commit, runs that guard, and puts the clone back.
// Usage: node tools/prove-guards.mjs [--lf]   (default: the laptop's own checkout, CRLF lines
// where git converts them; --lf: plain LF, as on GitHub's runners). Exits 1 if any guard is blind.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRIVATE_EMAIL, withoutGitVars } from './secrets.mjs';
import { MARK } from './owner-links.mjs';
import { fingerprint, write } from './review-gate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LF = process.argv.includes('--lf');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prove-guards-'));
const env = withoutGitVars();
const git = (...a) => execFileSync('git', a, { cwd: dir, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
execFileSync('git', ['-c', `core.autocrlf=${LF ? 'false' : 'true'}`, 'clone', '-q', '--no-hardlinks', ROOT, dir], { env, stdio: 'ignore' });
git('config', 'core.autocrlf', LF ? 'false' : 'true');
git('config', 'user.email', PRIVATE_EMAIL);
git('config', 'user.name', 'prove-guards');
git('config', 'commit.gpgsign', 'false');

const at = (f) => path.join(dir, f);
const eol = (f) => (fs.readFileSync(at(f), 'utf8').includes('\r\n') ? '\r\n' : '\n');
const append = (f, text) => fs.appendFileSync(at(f), text.split('\n').join(eol(f)));
const swap = (f, from, to) => {
  const s = fs.readFileSync(at(f), 'utf8');
  if (!s.includes(from)) throw new Error(`${f} has no "${from}" to plant the mistake in`);
  fs.writeFileSync(at(f), s.replace(from, to));
};
const many = (n, text) => Array.from({ length: n }, () => text).join('\n');
const run = (cmd, args, extra = {}) => {
  const r = spawnSync(cmd, args, { cwd: dir, env: { ...env, ...extra }, encoding: 'utf8' });
  return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
};
const test = (file) => () => run(process.execPath, [`tests/${file}`]);
// Claude Code hands its hook the event as JSON on stdin (code.claude.com/docs/en/hooks)
const askGuard = (mode, event) => {
  const r = spawnSync(process.execPath, ['tools/claude-guard.mjs', mode], { cwd: dir, env, encoding: 'utf8', input: JSON.stringify(event) });
  return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
};
const structure = test('structure.test.mjs');
// player's words built from their codes: Russian letters belong only in the texts files
const ru = (...codes) => String.fromCharCode(...codes);
// The guards read every tool, this one too: a planted name written out here whole would count as
// "imported" or "in the code" and hide the mistake, so it is joined only when planted.
const PLANTED = ['plan', 'ted', 'zq'].join('');
// built from parts so this file holds no token of its own
const token = 'ghp' + '_' + 'Zx9Q'.repeat(9);

// [guard, the rule it keeps, the mistake planted, plant, run, words the failure must name]
const CASES = [
  ['structure 1', 'CLAUDE.md rule 6', 'a code file over 300 lines', () => append('src/engine/ui/choice.js', `\n${many(300, '// x')}\n`), structure, 'files over 300 lines'],
  ['structure 1', 'CLAUDE.md rule 6', 'a doc over 300 lines', () => append('docs/roadmap.md', `\n${many(300, 'x')}\n`), structure, 'docs over 300 lines'],
  ['structure 2', 'CLAUDE.md rule 2', 'the engine imports the app', () => append('src/engine/sfx.js', "\nimport '../app/session.js';\n"), structure, 'imports ../app'],
  ['structure 3', 'CLAUDE.md rule 4', 'a Russian word in a tool', () => append('tools/morning.mjs', `\n// ${ru(0x43f, 0x440, 0x438, 0x432, 0x435, 0x442)}\n`), structure, 'Russian outside'],
  ['structure 4', 'CLAUDE.md rule 2', 'a room without a required file', () => fs.rmSync(at('src/rooms/01-control/sound-list.js')), structure, 'has no sound-list.js'],
  ['structure 5', 'docs/state.md cap', 'docs/state.md over 80 lines', () => append('docs/state.md', `\n${many(81, 'x')}\n`), structure, 'docs/state.md over'],
  ['structure 6', 'no dead code', 'a module nobody imports', () => fs.writeFileSync(at(`src/engine/${PLANTED}.js`), 'export const x = 1;\n'), structure, 'modules nobody imports'],
  ['structure 7', 'docs tell the truth', 'a doc names a file that does not exist', () => append('docs/roadmap.md', '\nSee `src/engine/nope.js`.\n'), structure, 'docs name files that do not exist'],
  ['structure 8', 'CLAUDE.md rule 19', 'a mistake row with no guard', () => append('docs/mistakes.md', '\n| A planted mistake | care |\n'), structure, 'mistake without a guard'],
  ['structure 8', 'CLAUDE.md rule 19', 'docs/mistakes.md over 60 lines', () => append('docs/mistakes.md', `\n${many(10, 'x')}\n`), structure, 'mistakes.md over 60'],
  ['structure 9', 'heredoc damage', 'a tool that no longer parses', () => append('tools/morning.mjs', '\nconst = ;\n'), structure, 'syntax error'],
  ['structure 10', 'catalog current', 'the catalog edited by hand', () => append('docs/catalog.md', '\n| x | planted |\n'), structure, 'catalog'],
  ['structure 11', 'A-Frame play/pause', 'a component method play(x)', () => append('src/engine/fader.js', '\nconst planted = {\n  play(arg) { return arg; }\n};\n'), structure, 'play/pause'],
  ['structure 12', 'room lights', 'a room light without class room-light', () => swap('src/rooms/01-control/scene.js', '<a-entity id="rig"', '<a-entity light="type: point; intensity: 1"></a-entity>\n  <a-entity id="rig"'), structure, 'room-light'],
  ['structure 13', 'the game\'s name', 'the name translated in the player\'s text', () => append('src/app/texts.ru.js', `\n// ${ru(0xab, 0x41e, 0x431, 0x44a, 0x435, 0x43a, 0x442, 0xbb)}\n`), structure, 'translates the game'],
  ['structure 17', 'words in full', 'a word cut short', () => append('src/app/texts.ru.js', `\nexport const planted = '${ru(0x41a, 0x43e, 0x43c, 0x43d)}. 101';\n`), structure, 'cuts a word short'],
  ['structure 16', 'CLAUDE.md rule 1', 'a comment saying who asked', () => append('tools/morning.mjs', `\n// the ${['own', 'er'].join('')} said so\n`), structure, 'tells history'],
  ['structure 16', 'CLAUDE.md rule 1', 'a comment with a date', () => append('tools/morning.mjs', `\n// changed ${['2026', '10', '09'].join('-')}\n`), structure, 'tells history'],
  ['structure 18', 'heredoc damage', 'a control character in code', () => append('tools/morning.mjs', '\n// a\bb\n'), structure, 'control character'],
  ['structure 19', 'no keys', 'a token in a doc', () => append('docs/roadmap.md', `\n${token}\n`), structure, 'secret key'],
  ['structure 15', 'room interior', 'a room with no room-interior part', () => { const f = 'src/rooms/01-control/scene.js'; fs.writeFileSync(at(f), fs.readFileSync(at(f), 'utf8').replaceAll('room-interior', 'room-planted')); }, structure, 'room-interior'],
  ['structure 14', 'the hidden address', 'git signing with a personal address', () => git('config', 'user.email', 'someone@example.com'), structure, 'would show the address'],
  ['structure 20', 'ARCHITECTURE.md map', 'a tool missing from the map', () => fs.writeFileSync(at('tools/planted.mjs'), 'export const x = 1;\n'), structure, 'missing from the map'],
  ['structure 21', 'CLAUDE.md rule 3', 'an inline style', () => swap('index.html', '</body>', '<div style="color: red"></div></body>'), structure, 'styles outside css'],
  ['structure 22', 'no forgotten doc', 'a doc nothing links to', () => fs.writeFileSync(at('docs/planted.md'), '# Planted\n'), structure, 'docs nothing links to'],
  ['structure 23', 'docs tell the truth', 'a doc names a constant the code lacks', () => append('docs/roadmap.md', `\n${PLANTED.toUpperCase()}_NAME\n`), structure, 'constants the code does not have'],
  ['pre-commit hook', 'CLAUDE.md rule 8', 'a commit while npm test fails', () => { git('config', 'core.hooksPath', 'tools/hooks'); append('docs/state.md', `\n${many(81, 'x')}\n`); },
    () => { const r = run('git', ['commit', '-qam', 'planted']); return { ok: r.ok, out: r.out }; }, 'npm test fails'],
  ['pre-push hook', 'main only on the owner\'s word', 'a push to main without his word', () => { git('config', 'core.hooksPath', 'tools/hooks'); git('init', '-q', '--bare', at('.planted-remote')); },
    () => run('git', ['push', '-q', at('.planted-remote'), 'HEAD:refs/heads/main'], { OBJECT_LIVE: '' }), 'main is the live site'],
  ['claude-guard pre', 'CLAUDE.md rule 8', 'the assistant skips the git hooks', () => {}, () => askGuard('pre', { tool_name: 'Bash', tool_input: { command: 'git commit --no-verify -m x' } }), 'REFUSED'],
  ['claude-guard pre', 'CLAUDE.md rule 8', 'the assistant runs Playwright locally', () => {}, () => askGuard('pre', { tool_name: 'PowerShell', tool_input: { command: 'npm run test:smoke' } }), 'REFUSED'],
  ['claude-guard pre', 'CLAUDE.md rule 8', 'a connected tool starts a browser on the laptop', () => {}, () => askGuard('pre', { tool_name: 'mcp__plugin_playwright_playwright__browser_navigate', tool_input: {} }), 'REFUSED'],
  ['claude-guard pre', 'data: read only', 'a migration applied to the live database', () => {}, () => askGuard('pre', { tool_name: 'mcp__db__apply_migration', tool_input: {} }), 'REFUSED'],
  ['claude-guard pre', 'data: read only', 'a write hidden behind a read on the live database', () => {}, () => askGuard('pre', { tool_name: 'mcp__db__execute_sql', tool_input: { query: 'select 1; delete from app.runs' } }), 'REFUSED'],
  ['claude-guard pre', 'main only on the owner\'s word', 'files pushed to GitHub past the push hook', () => {}, () => askGuard('pre', { tool_name: 'mcp__gh__push_files', tool_input: { branch: 'main' } }), 'REFUSED'],
  ['claude-guard start', 'the owner\'s decisions', 'a session starts without his decisions in front of it', () => fs.rmSync(at('docs/owner-decisions.md')), test('guard.test.mjs'), 'does not show the owner\'s decisions'],
  ['review gate', 'the owner\'s automatic stop', 'VR started in the headset with no practice review', () => {},
    () => run(process.execPath, ['tools/quest-look.mjs', 'vr'], { OBJECT_REVIEW_RECORD: `${dir}-reviews.jsonl` }), 'waits for the practice reviewer'],
  ['review gate', 'the owner\'s automatic stop', 'the probe run in VR after the game changed since its review',
    () => { write({ kind: 'review', agent: 'planted', print: fingerprint(dir) }, `${dir}-reviews.jsonl`); append('src/engine/sfx.js', '\n// changed after the review\n'); },
    // the probe, not the test copy: were the stop blind, the copy would really be published
    () => run(process.execPath, ['tools/xr-probe-run.mjs', 'input'], { OBJECT_REVIEW_RECORD: `${dir}-reviews.jsonl` }), 'waits for the practice reviewer'],
  ['claude-guard pre', 'the owner\'s automatic stop', 'the assistant writes the practice review record itself', () => {},
    () => askGuard('pre', { tool_name: 'Write', tool_input: { file_path: `${dir}-reviews.jsonl`.replace(/\.jsonl$/, '-practice-reviews.jsonl'), content: '{}' } }), 'REFUSED'],
  ['claude-guard stop', 'the owner\'s yes is the measure', 'a session with no row saying what he will see today',
    () => { const f = at('docs/board.md'); fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => !/^\|\s*\d{1,2}\.\d{1,2}\s*\|/.test(l)).join(eol('docs/board.md'))); },
    () => askGuard('stop', { stop_hook_active: false }), 'no row for today'],
  ['claude-guard stop', 'CLAUDE.md rules 8, 14', 'a turn ends with unsaved work', () => append('docs/roadmap.md', '\nunsaved\n'), () => askGuard('stop', { stop_hook_active: false }), 'work not saved'],
  ['claude-guard stop', 'ask the owner at a barrier', 'a turn ends with a page only the owner can open not given to him', () => fs.writeFileSync(`${dir}-record.jsonl`, `{"content":"${MARK}\\n- https://archive.example.org/locked - the page\\n\\n"}\n`),
    () => askGuard('stop', { stop_hook_active: false, transcript_path: `${dir}-record.jsonl` }), 'pages only the owner can open'],
];

const restore = () => {
  git('reset', '-q', '--hard');
  git('clean', '-qfdx', '-e', 'node_modules');
  git('config', 'user.email', PRIVATE_EMAIL);
  try { git('config', '--unset', 'core.hooksPath'); } catch { /* not set */ }
};

const rows = [];
const base = structure();
if (!base.ok) { console.log(`the clone fails before anything is planted:\n${base.out}`); process.exit(1); }
console.log(`clone of ${git('rev-parse', '--short', 'HEAD').trim()}, lines ${LF ? 'LF' : 'as this laptop checks out (CRLF)'}; structure test green before planting`);
for (const [guard, rule, mistake, plant, check, words] of CASES) {
  let caught, why;
  try {
    plant();
    const r = check();
    caught = !r.ok && r.out.includes(words);
    why = r.ok ? 'stayed green' : r.out.includes(words) ? '' : `red for another reason: ${r.out.trim().split('\n').find((l) => /Error|STOP|fail/i.test(l))?.slice(0, 120) || ''}`;
  } catch (e) { caught = false; why = `could not plant: ${e.message}`; }
  restore();
  rows.push({ guard, rule, mistake, caught, why });
  console.log(`${caught ? 'CAUGHT' : 'BLIND '}  ${guard.padEnd(16)} ${mistake}${why ? ` (${why})` : ''}`);
}
fs.rmSync(dir, { recursive: true, force: true });
fs.rmSync(`${dir}-reviews.jsonl`, { force: true });
const blind = rows.filter((r) => !r.caught);
console.log(blind.length ? `\n${blind.length} of ${rows.length} guards did not see their mistake` : `\nall ${rows.length} guards saw their mistake`);
process.exitCode = blind.length ? 1 : 0;
