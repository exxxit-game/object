// The guard Claude Code runs before each shell command (tools/claude-guard.mjs) is run here on real
// commands both ways: what it exists to stop must be refused in every form a shell writes it, and a
// command that only reads or searches the smoke test's file must pass, or the assistant learns to
// work around the guard. A git command that names the hook-skipping flag is refused even when it
// only searches: searching goes through the editor's own search tool.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { onHead } from '../tools/headset.mjs';
import { MARK, unrelayed } from '../tools/owner-links.mjs';

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
  'git commit -qnm x',
  // the headset or its browser restarted past the check that the owner is not wearing it
  'adb reboot',
  'adb -s 2G0YC5ZG reboot',
  'adb shell am force-stop com.oculus.browser',
  'adb shell "am force-stop com.oculus.browser"',
  'adb shell reboot',
  'adb shell svc power reboot'
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
  'node tests/guard.test.mjs',
  'node tools/quest-look.mjs reboot',
  'node tools/quest-look.mjs restart-browser',
  'adb devices',
  'adb shell dumpsys vrpowermanager'
];
for (const c of allowed) {
  const r = ask(c);
  assert.ok(!r.refused, `the guard refused a command that runs nothing it guards: ${c}\n${r.out}`);
}

// The headset tools restart nothing while the owner wears the headset: the power service's dump
// says mounted with no override of ours (tools/headset.mjs). Dumps as the headset printed them.
const dump = (state, virtual) => `Virtual proximity state: ${virtual}\nisAutosleepDisabled: false\nState: ${state}\n`;
assert.ok(onHead(dump('HEADSET_MOUNTED', 'DISABLED')), 'worn by the owner reads as on his head');
assert.ok(!onHead(dump('HEADSET_MOUNTED', 'CLOSE')), 'our own "worn on" override is not a person');
assert.ok(!onHead(dump('HEADSET_UNMOUNTED', 'DISABLED')) && !onHead(dump('STANDBY', 'DISABLED')), 'off the head is free to restart');

// Pages only the owner can open reach him: a link a research report lists after the mark must come
// up again later in the session record (raw text, JSON-escaped newlines as Claude Code writes them)
const report = `{"content":"found nothing open.\\n${MARK}\\n- https://archive.org/details/ubc1976 - section 3305\\n- https://shop.example.org/ubc.pdf.\\n\\nother text"}`;
assert.deepEqual(unrelayed(report).sort(), ['https://archive.org/details/ubc1976', 'https://shop.example.org/ubc.pdf'], 'both links are owed to the owner');
assert.deepEqual(unrelayed(report + '\n{"text":"open https://archive.org/details/ubc1976"}'), ['https://shop.example.org/ubc.pdf'], 'a link given to him is no longer owed');
assert.deepEqual(unrelayed(report + '\n{"text":"https://archive.org/details/ubc1976 and https://shop.example.org/ubc.pdf"}'), [], 'all given: the turn may end');
assert.deepEqual(unrelayed(`${MARK} none\\n\\nhttps://elsewhere.org/a`), [], 'a link after the block is not the owner\'s');
assert.deepEqual(unrelayed('no research today'), [], 'no mark, nothing owed');
// A report's block starts a line; a doc that names the mark in a sentence (docs/testing.md, read in a
// session) is not a report, and a local address further down was once held as owed to the owner
assert.deepEqual(unrelayed(`{"content":"    9\\t| claude-guard | left by a research agent after \`${MARK}\`, not reached him |\\n   20\\t| serve | http://localhost:3000 |"}`), [], 'the mark named in a sentence is no report');
assert.deepEqual(unrelayed(`{"content":"export const MARK = \\"${MARK}\\"; // see https://example.org/a"}`), [], 'the mark quoted in code is no report');

// The owner's decisions reach every session at its start and after each compaction, beside the
// open items: a session that does not see them asks him again what he settled
const start = spawnSync(process.execPath, ['tools/claude-guard.mjs', 'start'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ source: 'startup', cwd: ROOT }) });
assert.ok(/^## Decisions with the owner\r?\n- /m.test(start.stdout) && start.stdout.includes('never ask them again') && start.stdout.includes('## Open items'),
  `the start hook does not show the owner's decisions and the open items:\n${start.stdout.slice(0, 400)}`);

console.log(`guard: ok (${refused.length} refused, ${allowed.length} allowed, the headset's wearer seen, links owed to the owner found, his decisions shown at start)`);
