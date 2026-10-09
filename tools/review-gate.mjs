// The automatic stop before the owner meets anything: the headset tools do not start VR and the
// test copy is not published until the practice reviewer (.claude/agents/practice-reviewer.md)
// has seen exactly the files a person meets: the game and the headset probe, as the local server
// serves them (PUBLIC, tests/static-server.mjs). A check built from a first idea wasted his
// headset run (docs/mistakes.md); a rule in text was not enough to stop the next one.
// The record is kept outside the repository and written only by Claude Code's own hook when a
// reviewer run ends (tools/claude-guard.mjs, subagent-start and subagent-stop): the review counts
// only if the files did not change while it read them and its report reached its last block. The
// same guard refuses the assistant's own writes to the record (tests/review-gate.test.mjs).
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PUBLIC, isPublic } from '../tests/static-server.mjs';

export const RECORD = process.env.OBJECT_REVIEW_RECORD
  || path.join(os.homedir(), 'Documents', 'objekt-notes', 'practice-reviews.jsonl');
export const REVIEWER = 'practice-reviewer';
// the last block every reviewer report ends with: a run cut short has not reported
export const REPORT_END = 'FOR THE OWNER:';

// One hash of every file a person meets, by path and content. Text is read with LF line ends, so
// a checkout where git writes CRLF gives the same print as one with LF.
export function fingerprint(root) {
  const files = [];
  for (const p of PUBLIC) {
    const abs = path.join(root, p);
    if (!fs.existsSync(abs)) continue;
    const names = p.endsWith('/') ? fs.readdirSync(abs, { recursive: true }).map((f) => p + String(f).split(path.sep).join('/')) : [p];
    for (const rel of names) if (isPublic(rel) && fs.statSync(path.join(root, rel)).isFile()) files.push(rel);
  }
  const hash = crypto.createHash('sha256');
  for (const rel of files.sort()) {
    let bytes = fs.readFileSync(path.join(root, rel));
    if (!bytes.subarray(0, 8000).includes(0)) bytes = Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
    hash.update(`${rel}\0${bytes.length}\0`).update(bytes);
  }
  return hash.digest('hex');
}

export const entries = (record = RECORD) => {
  try {
    return fs.readFileSync(record, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return {}; } });
  } catch { return []; }
};

export const write = (entry, record = RECORD) => {
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.appendFileSync(record, `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`);
};

// the reviewer run that saw these very files, or null
export const reviewOf = (root, record = RECORD) => {
  const print = fingerprint(root);
  return entries(record).filter((e) => e.kind === 'review' && e.print === print).pop() || null;
};

// Called by a tool before it starts VR in the headset or publishes the test copy; no flag skips it.
export function requireReview(root, action) {
  if (reviewOf(root)) return;
  console.log(`not now: ${action} waits for the practice reviewer. The game or the probe changed since its last review (or none ran): run the practice-reviewer agent on what the owner will meet and fix what it finds; a review of the files as they then stand, recorded by Claude Code's hook, lets this go ahead.`);
  process.exit(1);
}
