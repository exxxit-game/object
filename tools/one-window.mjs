// One window at a time. On 10.10 four windows worked at once: each read everything again, made its
// own audit and plan and edited the same board, 116 commits went to the process and 17 to the game,
// and the owner wrote that we go round in circles eleven times (his message log). The window he last wrote in
// holds the work; any other may read but not run commands or change files until he writes there
// (tools/claude-guard.mjs: prompt takes the work, pre refuses the others, stop lets them end).
// The holder lives in the repository's shared git folder, which every worktree sees.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// OBJECT_WINDOW: a file of its own for the tests, so they never move the real holder
export function windowFile(cwd, env = process.env) {
  if (env.OBJECT_WINDOW) return env.OBJECT_WINDOW;
  try {
    const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return path.join(path.resolve(cwd, common), 'objekt-window.json');
  } catch { return null; }
}

export const holderOf = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };

// the owner wrote in this window: it holds the work from now
export function take(file, session, now = new Date()) {
  if (!file || !session) return;
  fs.writeFileSync(file, JSON.stringify({ session, at: now.toISOString() }));
}

// another window holds the work: who and since when, or null (no holder yet, or this window)
export function elsewhere(file, session) {
  const h = file && session ? holderOf(file) : null;
  return h && h.session && h.session !== session ? h : null;
}
