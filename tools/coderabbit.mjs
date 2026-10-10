// CodeRabbit's open remarks on the pull request from room-polish into main, read at every session
// start. CodeRabbit is the reviewer from outside (the owner's 14-day trial): it reads each push to the
// working branch against the repository's rules and writes its remarks on GitHub, where a remark
// nobody reads changes nothing. A remark stays open until it is fixed, or answered and resolved.
// Usage: node tools/coderabbit.mjs   (one line; nothing printed when GitHub cannot be reached)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const REPO = ['exxxit-game', 'youaretheobject'];
const QUERY = `query { repository(owner: "${REPO[0]}", name: "${REPO[1]}") {
  pullRequests(states: OPEN, baseRefName: "main", headRefName: "room-polish", first: 1) { nodes { number url
    reviewThreads(first: 100) { nodes { isResolved isOutdated comments(first: 1) { nodes { author { login } path } } } } } } } }`;

// the remarks still open: its threads neither resolved nor outdated by a later push
export function summarize(data) {
  const pr = data?.data?.repository?.pullRequests?.nodes?.[0];
  if (!pr) return 'CodeRabbit: no open pull request from room-polish into main, so nothing is reviewed: open one (gh pr create --base main --head room-polish)';
  const open = pr.reviewThreads.nodes.filter((t) => !t.isResolved && !t.isOutdated && /^coderabbitai/.test(t.comments.nodes[0]?.author?.login || ''));
  if (!open.length) return `CodeRabbit: no open remarks on ${pr.url}`;
  const files = [...new Set(open.map((t) => t.comments.nodes[0].path).filter(Boolean))];
  return `CodeRabbit: ${open.length} open remark${open.length === 1 ? '' : 's'} on ${pr.url} (${files.slice(0, 4).join(', ')}${files.length > 4 ? ', …' : ''}): read them before other work (gh pr view ${pr.number} --comments), fix the real ones, answer and resolve the rest`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const r = spawnSync('gh', ['api', 'graphql', '-f', `query=${QUERY}`], { encoding: 'utf8', timeout: 8000, windowsHide: true });
  if (r.status === 0) { try { console.log(summarize(JSON.parse(r.stdout))); } catch { /* an answer that is not JSON: say nothing */ } }
}
