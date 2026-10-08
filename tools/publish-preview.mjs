// Publishes the game files of this checkout to the owner's test copy for the headset:
// https://exxxit-game.github.io/object-preview/ (GitHub Pages of exxxit-game/object-preview).
// The headset opens it from a bookmark: no laptop, no cable, after any restart. Only what
// the page needs goes there (the PUBLIC list of tests/static-server.mjs): no notes, tests
// or history. Games on the test copy never send results (src/app/session.js, PREVIEW).
// The live site (main of exxxit-game/object) is not touched: it changes on the owner's word.
// Usage: node tools/publish-preview.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC } from '../tests/static-server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/exxxit-game/object-preview.git';
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();

// the copy is public and its commit shows the author's address: only the hidden GitHub one
const email = git(ROOT, 'config', 'user.email');
if (!email.endsWith('@users.noreply.github.com')) {
  console.log(`not published: the commit would show the address ${email}; set the hidden GitHub address first`);
  process.exit(1);
}
const sha = git(ROOT, 'rev-parse', '--short', 'HEAD');
const dirty = git(ROOT, 'status', '--porcelain', '--', ...PUBLIC.map(p => p.replace(/\/$/, '')));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'object-preview-'));
for (const p of PUBLIC) {
  const from = path.join(ROOT, p);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(dir, p), { recursive: true });
}
fs.writeFileSync(path.join(dir, '.nojekyll'), ''); // serve files as they are
// search engines must not list the test copy
const index = path.join(dir, 'index.html');
fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">'));

git(dir, 'init', '-q', '-b', 'main');
git(dir, 'add', '-A');
git(dir, '-c', `user.name=${git(ROOT, 'config', 'user.name')}`, '-c', `user.email=${git(ROOT, 'config', 'user.email')}`,
  'commit', '-q', '-m', `Preview of ${sha}${dirty ? ' with uncommitted changes' : ''}`);
git(dir, 'push', '-q', '--force', REPO, 'main');
fs.rmSync(dir, { recursive: true, force: true });
console.log(`published ${sha}${dirty ? ' (+ uncommitted changes)' : ''}: https://exxxit-game.github.io/object-preview/`);

// GitHub Pages builds the copy after the push and now and then fails with no reason given
// ("Page build failed"); the old copy then stays online unnoticed. Wait for the build, ask for
// one rebuild if it fails, and say how it ended (needs the GitHub CLI, signed in).
const build = () => JSON.parse(execFileSync('gh', ['api', 'repos/exxxit-game/object-preview/pages/builds/latest'], { encoding: 'utf8' }));
const settled = async () => {
  for (let i = 0; i < 36; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const b = build();
    if (b.status === 'built' || b.status === 'errored') return b.status;
  }
  return 'still building';
};
try {
  let status = await settled();
  if (status === 'errored') {
    execFileSync('gh', ['api', '-X', 'POST', 'repos/exxxit-game/object-preview/pages/builds']);
    status = await settled();
  }
  console.log(status === 'built' ? 'live: the build finished' : `NOT live: the Pages build ${status}`);
  if (status !== 'built') process.exitCode = 1;
} catch (e) {
  console.log('could not read the Pages build (gh):', e.message.split('\n')[0]);
}
