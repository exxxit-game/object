// Guards on the assistant itself, run by Claude Code (.claude/settings.json), not by its memory:
// a rule written as text is skipped under load, a hook is not. Exit 2 stops the action and tells
// the assistant why (code.claude.com/docs/en/hooks: PreToolUse exit 2 blocks the tool call; Stop
// exit 2 keeps the turn going, and Claude Code ends it anyway after 8 blocks in a row).
//   pre:  a shell command that skips the git hooks or runs Playwright on the laptop is refused
//   stop: a turn does not end while npm test fails or work is unsaved or not on GitHub
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withoutGitVars } from './secrets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const input = await new Promise((done) => {
  let s = '';
  process.stdin.on('data', (c) => { s += c; }).on('end', () => done(s));
});
const event = (() => { try { return JSON.parse(input || '{}'); } catch { return {}; } })();
const stop = (why) => { process.stderr.write(`${why}\n`); process.exit(2); };

// Each refused command names the guard it would switch off (CLAUDE.md rule 8, tools/hooks).
export const REFUSED = [
  [/--no-verify\b/, 'skips the git hooks: no commit while npm test fails, no push without the secret check'],
  [/\bgit\b[^|;&\n]*\bcommit\b[^|;&\n]*\s-[a-zA-Z]*n[a-zA-Z]*\b/, '"git commit -n" skips the git hooks'],
  [/core\.hooksPath[= ]+(?!tools\/hooks\b)\S|--unset[^|;&\n]*core\.hooksPath/, 'switches the git hooks off'],
  [/\bnpm run test:smoke\b|\btests\/smoke\.mjs\b|\bnpx playwright\b|\bplaywright (test|install|open|codegen)\b/, 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free'],
];

if (mode === 'pre') {
  const command = String(event.tool_input?.command || '');
  for (const [pattern, why] of REFUSED) if (pattern.test(command)) stop(`REFUSED: this command ${why}. Do the work so the guard passes instead.`);
  process.exit(0);
}

if (mode === 'stop') {
  const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
  const problems = [];
  const dirty = git('status', '--porcelain');
  if (dirty) problems.push(`work not saved (power is cut daily):\n${dirty}`);
  const ahead = git('rev-list', '--count', '@{u}..HEAD');
  if (ahead === null) problems.push('this branch has no copy on GitHub: push it');
  else if (Number(ahead)) problems.push(`${ahead} commits not on GitHub: push the working branch`);
  const tests = spawnSync('npm', ['test', '--silent'], { cwd: ROOT, env: withoutGitVars(), encoding: 'utf8', shell: true });
  if (tests.status !== 0) problems.push(`npm test fails:\n${`${tests.stdout}${tests.stderr}`.split('\n').filter((l) => /Error|fail|STOP/i.test(l)).slice(0, 5).join('\n')}`);
  if (problems.length) stop(`NOT DONE. Before this turn ends:\n- ${problems.join('\n- ')}`);
  process.exit(0);
}
