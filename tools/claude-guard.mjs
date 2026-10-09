// Guards on the assistant itself, run by Claude Code (.claude/settings.json), not by its memory:
// a rule written as text is skipped under load, a hook is not. Exit 2 stops the action and tells
// the assistant why (code.claude.com/docs/en/hooks: PreToolUse exit 2 blocks the tool call; Stop
// exit 2 keeps the turn going, and Claude Code ends it anyway after 8 blocks in a row).
//   pre:  a shell command that skips the git hooks or runs Playwright on the laptop is refused, and
//         so are a connected browser tool and any write to the live database
//   stop: a turn does not end while npm test fails or work is unsaved or not on GitHub, or while
//         a page only the owner can open, left by research, has not reached him (owner-links.mjs)
//   start, prompt: the state comes back after every compaction; every owner message is logged
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withoutGitVars } from './secrets.mjs';
import { unrelayed } from './owner-links.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const input = await new Promise((done) => {
  let s = '';
  process.stdin.on('data', (c) => { s += c; }).on('end', () => done(s));
});
const event = (() => { try { return JSON.parse(input || '{}'); } catch { return {}; } })();
const stop = (why) => { process.stderr.write(`${why}\n`); process.exit(2); };
// The checkout the session works in: Claude Code runs this script from the folder the session was
// opened in (the main folder), while the work sits in the session's own worktree, named by the
// event's cwd. Checked there, or the guard would judge the main folder instead of the work.
const HERE = (() => {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: event.cwd || ROOT, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ROOT; }
})();

// Each refused command names the guard it would switch off (CLAUDE.md rule 8, tools/hooks). A
// program counts as run only where a command starts (the line's start, after ; & | or a newline,
// past variables set for it and PowerShell's call operator), written in any path form the shells
// take; a command that reads or searches the smoke test's file passes, or the guard teaches working
// around it. A git command naming the hook-skipping flag is refused wherever the flag stands, even in
// a search. tests/guard.test.mjs runs both ways.
const AT = String.raw`(?:^|[;&|\n])\s*(?:\w+=\S*\s+)*(?:&\s*)?`;
const DIR = String.raw`(?:"[^"\n]*[\\/])?(?:[\w.:~\\/-]*[\\/])?`;
const run = (body) => new RegExp(AT + DIR + body, 'i');
export const REFUSED = [
  [/^(?=[\s\S]*\bgit\b)[\s\S]*(?:^|[\s'"=])--no-verify\b/, 'skips the git hooks: no commit while npm test fails, no push without the secret check'],
  [/^(?=[\s\S]*\bgit\b[\s\S]*\bcommit\b)[\s\S]*\s-[a-zA-Z]*n[a-zA-Z]*(?=[\s'"]|$)/, '"git commit -n" skips the git hooks'],
  [/core\.hooksPath[= ]+(?!tools\/hooks\b)\S|--unset[^|;&\n]*core\.hooksPath/, 'switches the git hooks off'],
  [run(String.raw`npm(?:\.cmd)?\b[^;&|\n]*\btest:smoke\b`), 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free'],
  [run(String.raw`node(?:\.exe)?"?\s+(?:-{1,2}[\w-]+(?:=\S+)?\s+)*["']?(?:[\w.:~-]*[\\/]+)*smoke\.mjs\b`), 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free'],
  [run(String.raw`(?:npx(?:\.cmd)?(?:\s+-{1,2}[\w-]+)*\s+@?playwright\b|playwright(?:\.cmd)?\s+(?:test|install|open|codegen)\b)`), 'runs Playwright or Chromium, which run only on GitHub: the owner\'s laptop stays free'],
  [run(String.raw`adb(?:\.exe)?\b[^;&|\n]*\s(?:reboot\b|shell\s+["']?(?:am\s+force-stop|reboot\b|svc\s+power\s+(?:reboot|shutdown)))`), 'restarts the headset or its browser past tools/quest-look.mjs, which first checks that the owner is not wearing it'],
];

// Connected tools that do what a refused command would: a browser started on the laptop, and
// writes to the live database (the owner: the assistant's access to the server is read only;
// changes go through supabase/migrations on his word). Names are matched across connectors.
const BROWSER_TOOLS = /^mcp__plugin_(playwright|chrome-devtools)/;
const DB_WRITES = /__(apply_migration|deploy_edge_function|pause_project|restore_project|create_project|delete_branch|merge_branch|reset_branch|rebase_branch|confirm_cost)$/;
// The GitHub connector writes to the repository directly, past the push hook that guards main
// and checks for secrets: work reaches GitHub only through git push.
const GITHUB_WRITES = /__(push_files|create_or_update_file|delete_file|merge_pull_request|update_pull_request_branch|create_repository|fork_repository)$/;
// a query that only reads: one statement, starting with a read, naming no write
export const readOnlySql = (q) => /^\s*(select|with|explain|show)\b/i.test(q) && !/;\s*\S/.test(q)
  && !/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|call|do|merge|vacuum|comment|set|reset|lock|refresh|reindex|cluster|import|security)\b/i.test(q);

if (mode === 'pre') {
  const tool = String(event.tool_name || '');
  if (BROWSER_TOOLS.test(tool)) stop('REFUSED: this tool starts a browser on the laptop; Playwright and Chromium run only on GitHub (use the browser pane for a look).');
  if (DB_WRITES.test(tool)) stop('REFUSED: the live database is read-only for the assistant; a change goes into supabase/migrations and reaches the server only on the owner\'s word.');
  if (GITHUB_WRITES.test(tool)) stop('REFUSED: this connector writes to GitHub past the push hook (main only on the owner\'s word, the secret check); commit and git push instead.');
  if (/__execute_sql$/.test(tool) && !readOnlySql(String(event.tool_input?.query || ''))) stop('REFUSED: only a single read-only query (SELECT) may run on the live database.');
  const command = String(event.tool_input?.command || '');
  for (const [pattern, why] of REFUSED) if (pattern.test(command)) stop(`REFUSED: this command ${why}. Do the work so the guard passes instead.`);
  process.exit(0);
}

const git = (...a) => { try { return execFileSync('git', a, { cwd: HERE, env: withoutGitVars(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };

// start: at startup, resume and after every compaction Claude Code adds this output to the
// context, so the state and the queue come back without anyone remembering to read them, and a
// checkout made from the old live branch is named before work starts on it.
if (mode === 'start') {
  const out = [`Session ${event.source || 'start'}: before anything else (CLAUDE.md rule 22d) read docs/state.md, then the plan doc's queue and its open request table (link in docs/state.md); the summary is not the list.`];
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  if (git('rev-parse', '--verify', '-q', 'room-polish') && git('merge-base', '--is-ancestor', 'room-polish', 'HEAD') === null) {
    out.push(`WARNING: this checkout (${branch}) lacks the latest work on room-polish; it was probably made from the old live branch. If it has no commits of its own, reset it to room-polish; otherwise merge room-polish. Say so to the owner.`);
  }
  try {
    const state = fs.readFileSync(path.join(HERE, 'docs/state.md'), 'utf8');
    const open = state.slice(state.indexOf('## Open items'));
    if (open.startsWith('## Open items')) out.push(open.slice(0, 6000));
  } catch { out.push('docs/state.md is missing here: this checkout is not the project\'s current work.'); }
  process.stdout.write(`${out.join('\n\n')}\n`);
  process.exit(0);
}

// prompt: every message the owner sends is appended, word for word, to a log on the laptop,
// outside the public repository, so no request is lost to a compaction (the request auditor
// reads it). It never blocks the message.
if (mode === 'prompt') {
  try {
    const log = path.join(os.homedir(), 'Documents', 'objekt-notes', 'owner-messages.md');
    fs.mkdirSync(path.dirname(log), { recursive: true });
    fs.appendFileSync(log, `\n## ${new Date().toISOString()} ${event.session_id || ''}\n${String(event.prompt || '')}\n`);
  } catch { /* a failed log must not stop his message */ }
  process.exit(0);
}

if (mode === 'stop') {
  const problems = [];
  const dirty = git('status', '--porcelain');
  if (dirty) problems.push(`work not saved (power is cut daily):\n${dirty}`);
  const ahead = git('rev-list', '--count', '@{u}..HEAD');
  if (ahead === null) problems.push('this branch has no copy on GitHub: push it');
  else if (Number(ahead)) problems.push(`${ahead} commits not on GitHub: push the working branch`);
  const tests = spawnSync('npm', ['test', '--silent'], { cwd: HERE, env: withoutGitVars(), encoding: 'utf8', shell: true });
  if (tests.status !== 0) problems.push(`npm test fails:\n${`${tests.stdout}${tests.stderr}`.split('\n').filter((l) => /Error|fail|STOP/i.test(l)).slice(0, 5).join('\n')}`);
  // pages only the owner can open, left by a research agent: they reach him in this turn
  let record = '';
  try { record = event.transcript_path ? fs.readFileSync(event.transcript_path, 'utf8') : ''; } catch { /* no record to read */ }
  const owed = unrelayed(record);
  if (owed.length) problems.push(`pages only the owner can open, left by research: give him each link (the answer, or the plan's list of what is asked of him), with what to bring back:\n${owed.join('\n')}`);
  if (problems.length) stop(`NOT DONE. Before this turn ends:\n- ${problems.join('\n- ')}`);
  process.exit(0);
}
