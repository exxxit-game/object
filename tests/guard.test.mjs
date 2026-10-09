// The guard Claude Code runs before each shell command (tools/claude-guard.mjs) is run here on real
// commands both ways: what it exists to stop must be refused in every form a shell writes it, and a
// command that only reads or searches the smoke test's file must pass, or the assistant learns to
// work around the guard. A git command that names the hook-skipping flag is refused even when it
// only searches: searching goes through the editor's own search tool.
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
  // the smoke test (Playwright and Chromium) started on the laptop
  'npm run test:smoke',
  'npm.cmd run test:smoke',
  'npm run-script test:smoke',
  'npm --silent run test:smoke',
  'cd x; npm run test:smoke',
  'node tests/smoke.mjs',
  'node ./tests/smoke.mjs',
  'node tests\\smoke.mjs',
  'node tests\\\\smoke.mjs',
  'node.exe tests/smoke.mjs',
  '& node tests\\smoke.mjs',
  '& "C:\\Program Files\\nodejs\\node.exe" tests\\smoke.mjs',
  'cd tests && node smoke.mjs',
  'cd x && node tests/smoke.mjs --speed 20',
  'OBJECT_X=1 node tests/smoke.mjs',
  'npx playwright test',
  'npx.cmd playwright install',
  'npx playwright --version',
  'npx -y @playwright/test test',
  'playwright codegen',
  // the git hooks skipped
  'git commit --no-verify -m x',
  'git push --no-verify origin x',
  'git -C . commit -qam x --no-verify',
  'git commit -am "paper; colours" --no-verify',
  'git commit -m "A & B" --no-verify',
  'git commit "--no-verify" -m x',
  "git commit '--no-verify' -m x",
  "git commit -m \"$(cat <<'EOF'\nmessage; with | marks\nEOF\n)\" --no-verify",
  'git commit -n -m x',
  'git commit -am "a; b" -n',
  'git commit -qnm x'
];
for (const c of refused) assert.ok(ask(c).refused, `the guard let through: ${c}`);

const allowed = [
  'grep -n camera tests/smoke.mjs',
  'grep -n node tests/smoke.mjs',
  'sed -n 1,40p tests/smoke.mjs',
  'git log --oneline -- tests/smoke.mjs',
  'git diff tests/smoke.mjs',
  'grep -n -- "--no-verify" docs/mistakes.md',
  'grep -n test:smoke package.json',
  'git commit -qm "the smoke test (npm run test:smoke) runs only on GitHub"',
  'git commit --amend --no-edit',
  'npm test',
  'node tests/guard.test.mjs'
];
for (const c of allowed) {
  const r = ask(c);
  assert.ok(!r.refused, `the guard refused a command that runs nothing it guards: ${c}\n${r.out}`);
}

console.log(`guard: ok (${refused.length} refused, ${allowed.length} allowed)`);
