// The morning check: one command that checks what used to be checked by hand each day, so a
// broken tool, an unsaved change, a failed run or a drained headset shows up at once instead of
// mid-work. Power is cut daily: anything not on GitHub can be lost.
// Usage: npm run morning   (exits 1 when anything FAILs; WARN lines need a look, not a stop)
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connected, awake, battery, localPort } from './headset.mjs';

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
const onlyHere = (sh('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/tags']) || '').split('\n').filter(Boolean)
  .filter((r) => !remote.includes(`refs/heads/${r}`) && !remote.includes(`refs/tags/${r}`));
say(onlyHere.length ? 'WARN' : 'ok', onlyHere.length ? `only on this laptop: ${onlyHere.join(', ')}` : 'every branch and tag is on GitHub');

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

process.exitCode = failed ? 1 : 0;
