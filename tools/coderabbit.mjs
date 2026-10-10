// CodeRabbit's open remarks, read at every session start. CodeRabbit is the reviewer from outside (the
// owner's 14-day trial): it reads the pull request from room-polish into the branch `reviewed`, the last
// state it has already read, and writes its remarks on GitHub, where a remark nobody reads changes
// nothing. A pull request into main held three days of work, 428 files, over its limit of 300, so it
// read nothing; against `reviewed` it sees only what is new. A robot on GitHub moves `reviewed` up once a
// push is read and no remark is open (tools/advance-reviewed.mjs), never this session.
// Usage: node tools/coderabbit.mjs   (one line; nothing printed when GitHub cannot be reached)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const REPO = 'exxxit-game/youaretheobject';
export const BASE = 'reviewed';
export const FILE_LIMIT = 300;
const [OWNER, NAME] = REPO.split('/');
const QUERY = `query { repository(owner: "${OWNER}", name: "${NAME}") {
  pullRequests(states: OPEN, baseRefName: "${BASE}", headRefName: "room-polish", first: 1) { nodes { number url headRefOid changedFiles
    commits(last: 1) { nodes { commit { status { contexts { context state description } } } } }
    reviewThreads(first: 100) { nodes { isResolved isOutdated comments(first: 1) { nodes { author { login } path } } } } } } } }`;

// what to say at the start of a session
export function summarize(data) {
  const pr = data?.data?.repository?.pullRequests?.nodes?.[0];
  if (!pr) return { line: `CodeRabbit: no open pull request from room-polish into ${BASE}, so nothing is reviewed: open one (gh pr create --base ${BASE} --head room-polish)` };
  const open = pr.reviewThreads.nodes.filter((t) => !t.isResolved && !t.isOutdated && /^coderabbitai/.test(t.comments.nodes[0]?.author?.login || ''));
  const status = (pr.commits.nodes[0]?.commit?.status?.contexts || []).find((c) => /^coderabbit/i.test(c.context));
  const skipped = status && /skipp/i.test(status.description || '');
  const read = status?.state === 'SUCCESS' && !skipped;
  if (open.length) {
    const files = [...new Set(open.map((t) => t.comments.nodes[0].path).filter(Boolean))];
    return { line: `CodeRabbit: ${open.length} open remark${open.length === 1 ? '' : 's'} on ${pr.url} (${files.slice(0, 4).join(', ')}${files.length > 4 ? ', …' : ''}): read them before other work (gh pr view ${pr.number} --comments), fix the real ones, answer and resolve the rest` };
  }
  if (skipped) return { line: `CodeRabbit skipped the last push (${status.description}) on ${pr.url}: ${pr.changedFiles > FILE_LIMIT ? `${pr.changedFiles} files against its limit of ${FILE_LIMIT}; ` : ''}ask it again with a comment "@coderabbitai review"` };
  if (!read) return { line: `CodeRabbit: the last push to ${pr.url} is not read yet` };
  return { line: `CodeRabbit: no open remarks on ${pr.url}; the robot on GitHub moves ${BASE} up` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const gh = (args) => spawnSync('gh', args, { encoding: 'utf8', timeout: 8000, windowsHide: true });
  const r = gh(['api', 'graphql', '-f', `query=${QUERY}`]);
  let said = null;
  try { said = r.status === 0 ? summarize(JSON.parse(r.stdout)) : null; } catch { /* an answer that is not JSON: say nothing */ }
  if (said) console.log(said.line);
}
