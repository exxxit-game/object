// The guard Claude Code runs before each shell command (tools/claude-guard.mjs) is run here on real
// commands both ways: what it exists to stop must be refused, and a command that only names a
// guarded file (reading the smoke test, searching it) must pass, or the assistant learns to work
// around the guard.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ask = (command) => {
  const event = { tool_name: 'Bash', tool_input: { command }, cwd: ROOT };
  const r = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'pre'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify(event) });
  return { refused: r.status === 2, out: `${r.stdout}${r.stderr}` };
};

const refused = [
  'npm run test:smoke',
  'node tests/smoke.mjs',
  'node ./tests/smoke.mjs',
  'node tests\\smoke.mjs',
  'cd x && node tests/smoke.mjs --speed 20',
  'npx playwright test',
  'git commit --no-verify -m x',
  'git push --no-verify origin x',
  'git -C . commit -qam x --no-verify',
  'git commit -n -m x'
];
for (const c of refused) assert.ok(ask(c).refused, `the guard let through: ${c}`);

const allowed = [
  'grep -n camera tests/smoke.mjs',
  'sed -n 1,40p tests/smoke.mjs',
  'git log --oneline -- tests/smoke.mjs',
  'git diff tests/smoke.mjs',
  'grep -n -- "--no-verify" docs/mistakes.md',
  'npm test'
];
for (const c of allowed) {
  const r = ask(c);
  assert.ok(!r.refused, `the guard refused a command that runs nothing it guards: ${c}\n${r.out}`);
}

console.log('guard: ok');
