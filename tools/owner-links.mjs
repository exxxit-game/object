// Pages only the owner can open (behind a login, a captcha, a paywall, a site that blocks tools)
// must reach him in the same turn, not sit in a research report. A research agent lists them
// after the marker MARK (.claude/agents/quick-research.md); the stop hook (claude-guard.mjs) reads
// the session's record and does not let a turn end while one of those links has not appeared
// again after the report: in the answer to him or in the plan's list of what is asked of the owner. The record's
// format is Claude Code's own and changes between versions, so this only searches its raw text.
export const MARK = 'FOR THE OWNER:';

// A report's block starts a line (raw, as \n inside JSON, or at a JSON string's start); a doc
// that names the mark inside a sentence or quotes it in code is not a report.
const BLOCK = new RegExp(String.raw`(?:^|\n|\\n|(?<!\\)")[ \t*_>#]*` + MARK, 'g');

// text: the session record as one string. Returns the links listed after a mark that never come
// up again later in the record. A block ends at a blank line (raw or as \n\n inside JSON).
export function unrelayed(text) {
  const missing = new Set();
  for (const found of text.matchAll(BLOCK)) {
    const at = found.index + found[0].length - MARK.length;
    const tail = text.slice(at, at + 4000);
    const end = tail.search(/\n\s*\n|\\n\\n/);
    const block = end === -1 ? tail : tail.slice(0, end);
    const after = text.slice(at + block.length);
    for (const [url] of block.matchAll(/https?:\/\/[^\s"'\\)<>`]+/g)) {
      const link = url.replace(/[.,;:]+$/, '');
      if (!after.includes(link)) missing.add(link);
    }
  }
  return [...missing];
}
