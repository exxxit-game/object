// The morning check: one command that checks what used to be checked by hand each day, so a
// broken tool, an unsaved change, a failed run or a drained headset shows up at once instead of
// mid-work. Power is cut daily: anything not on GitHub can be lost.
// Usage: npm run morning   (exits 1 when anything FAILs; WARN lines need a look, not a stop)
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connected, awake, battery, localPort } from './headset.mjs';
import { check, notPushed, configEmailOk, PRIVATE_EMAIL } from './secrets.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sh = (cmd, args) => { try { return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch (e) { return null; } };
let failed = false;
const say = (level, text) => { if (level === 'FAIL') failed = true; console.log(`${level.padEnd(4)}  ${text}`); };

// 1. Everything saved and on GitHub
const branch = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
const dirty = sh('git', ['status', '--porcelain']);
say(dirty ? 'FAIL' : 'ok', dirty ? `uncommitted changes:\n${dirty}` : `${branch}: nothing uncommitted`);
sh('git', ['fetch', '--quiet', 'origin']);
const ahead = sh('git', ['rev-list', '--count', `origin/${branch}..HEAD`]);
say(ahead === null ? 'FAIL' : Number(ahead) ? 'FAIL' : 'ok', ahead === null ? `${branch} is not on GitHub` : Number(ahead) ? `${ahead} commits not pushed` : 'every commit is on GitHub');
const remote = sh('git', ['ls-remote', '--heads', '--tags', 'origin']) || '';
// kept on this laptop on purpose: raw work, not for a public repo yet (the experimenter, the last Ono room)
const KEPT_HERE = ['claude/wip-experimenter', 'ono-room-final'];
const onlyHere = (sh('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/tags']) || '').split('\n').filter(Boolean)
  .filter((r) => !remote.includes(`refs/heads/${r}`) && !remote.includes(`refs/tags/${r}`) && !KEPT_HERE.includes(r));
say(onlyHere.length ? 'WARN' : 'ok', onlyHere.length ? `only on this laptop: ${onlyHere.join(', ')}` : `every branch and tag is on GitHub (kept here on purpose: ${KEPT_HERE.join(', ')})`);

// Nothing private goes out: git signs with the private address, the push guard is on, and the
// commits not yet pushed carry no key or own email (tools/secrets.mjs)
say(configEmailOk() ? 'ok' : 'FAIL', configEmailOk() ? 'git signs with the private address' : `git's user.email is not ${PRIVATE_EMAIL}`);
const guard = sh('git', ['config', 'core.hooksPath']);
say(guard === 'tools/hooks' ? 'ok' : 'FAIL', guard === 'tools/hooks' ? 'the push guard is on' : 'the push guard is off: git config core.hooksPath tools/hooks');
// the setting is shared by every checkout of the repository, the hooks are files in each: a
// checkout made before they existed runs no guard at all
const HOOKS = ['pre-commit', 'pre-push'];
const unguarded = (sh('git', ['worktree', 'list', '--porcelain']) || '').split('\n').filter((l) => l.startsWith('worktree '))
  .map((l) => l.slice(9)).filter((dir) => HOOKS.some((h) => !fs.existsSync(path.join(dir, 'tools', 'hooks', h))));
say(unguarded.length ? 'FAIL' : 'ok', unguarded.length ? `checkouts whose commits run no guard (bring them up to date): ${unguarded.join(', ')}` : `every checkout has the hooks (${HOOKS.join(', ')})`);
// main is the live site: on GitHub it can be neither deleted nor rewritten (the owner's yes, the
// ruleset "main is the live site"); a setting can be switched off without a trace in the code
const rules = sh('gh', ['api', 'repos/exxxit-game/youaretheobject/rules/branches/main', '--jq', '[.[].type] | join(" ")']);
const guarded = rules !== null && ['deletion', 'non_fast_forward'].every((r) => rules.split(' ').includes(r));
say(rules === null ? 'WARN' : guarded ? 'ok' : 'FAIL', rules === null ? 'could not read the rules of main on GitHub (gh)' : guarded ? 'main can be neither deleted nor rewritten on GitHub' : `main is not protected on GitHub (rules: ${rules || 'none'})`);
const leaks = check(notPushed());
say(leaks.length ? 'FAIL' : 'ok', leaks.length ? `private things in unpushed commits: ${leaks.join('; ')}` : 'nothing private in unpushed commits');

// 2. The last run on GitHub of what is pushed
const runs = sh('gh', ['run', 'list', '--branch', branch, '--limit', '1', '--json', 'status,conclusion,headSha,displayTitle']);
if (!runs) say('WARN', 'cannot read GitHub runs (gh not logged in?)');
else {
  const [run] = JSON.parse(runs);
  const head = sh('git', ['rev-parse', 'HEAD']);
  if (!run) say('WARN', 'no GitHub run for this branch');
  else if (run.status !== 'completed') say('WARN', `GitHub run still ${run.status}: ${run.displayTitle.slice(0, 60)}`);
  else say(run.conclusion === 'success' ? 'ok' : 'FAIL', `GitHub run ${run.conclusion}${run.headSha === head ? '' : ' (for an older commit)'}: ${run.displayTitle.slice(0, 60)}`);
}

// 3. The quick tests
let tested = true;
try { execSync('npm test --silent', { cwd: ROOT, stdio: 'ignore' }); } catch (e) { tested = false; }
say(tested ? 'ok' : 'FAIL', 'npm test');

// 4. Every tool at least loads (a tool that no longer parses is found now, not when needed)
const tools = fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => /\.m?js$/.test(f));
const broken = tools.filter((f) => sh('node', ['--check', path.join('tools', f)]) === null);
say(broken.length ? 'FAIL' : 'ok', broken.length ? `tools that do not parse: ${broken.join(', ')}` : `${tools.length} tools parse`);

// 5. The headset: on the cable, charged, and asleep when nothing is being checked
if (!connected()) say('WARN', 'headset not connected (cable out, or adb not running)');
else {
  const b = battery();
  say(b.level < 30 ? 'WARN' : 'ok', `headset battery ${b.level}%${b.charging ? ', charging' : ', not charging'}`);
  say(awake() ? 'WARN' : 'ok', awake() ? 'headset awake: put it to sleep after a check (node tools/quest-look.mjs sleep)' : 'headset asleep');
}
say('ok', `local server port ${localPort()} (.claude/launch.json); the headset sees it as localhost:3000`);

// 6. Reviews since the code last changed: the audits in docs/audit/ are older than the code?
const lastCode = Number(sh('git', ['log', '-1', '--format=%ct', '--', 'src', 'tools', 'tests']));
const lastAudit = Number(sh('git', ['log', '-1', '--format=%ct', '--', 'docs/audit']));
say(lastAudit >= lastCode ? 'ok' : 'WARN', lastAudit >= lastCode ? 'the audit is newer than the code'
  : 'the code changed since the last audit: run the architecture and request auditors before the next "done"');

// 7. My memory: a memory file its index does not name never loads, and an index line naming a
// missing file points at nothing (a lesson about readable text was lost the first way)
const mainDir = ((sh('git', ['worktree', 'list', '--porcelain']) || '').split('\n')[0] || '').slice(9);
const memDir = path.join(os.homedir(), '.claude', 'projects', mainDir.replace(/[^A-Za-z0-9]/g, '-'), 'memory');
if (!mainDir || !fs.existsSync(path.join(memDir, 'MEMORY.md'))) say('WARN', `no memory index at ${memDir}`);
else {
  const named = [...fs.readFileSync(path.join(memDir, 'MEMORY.md'), 'utf8').matchAll(/\]\(([^)]+\.md)\)/g)].map((m) => m[1]);
  const files = fs.readdirSync(memDir).filter((f) => f.endsWith('.md') && f !== 'MEMORY.md');
  const bad = [...files.filter((f) => !named.includes(f)).map((f) => `${f} is not in MEMORY.md`),
    ...named.filter((f) => !files.includes(f)).map((f) => `MEMORY.md names a missing ${f}`)];
  say(bad.length ? 'FAIL' : 'ok', bad.length ? `memory index: ${bad.join('; ')}` : `MEMORY.md names all ${files.length} memory files`);
}

process.exitCode = failed ? 1 : 0;
