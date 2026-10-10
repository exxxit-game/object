// The automatic stop before the owner meets anything: the headset tools do not start VR and the
// test copy is not published until the practice reviewer (.claude/agents/practice-reviewer.md)
// has seen the files a person meets: the game and the headset probe, as the local server serves
// them (PUBLIC, tests/static-server.mjs). A check built from a first idea wasted his headset run
// (docs/mistakes.md); a rule in text was not enough to stop the next one.
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

// Every file a person meets, read once: a hash of each (by path) and the print, one hash of them
// all by path and content. Text is read with LF line ends, so a checkout where git writes CRLF
// gives the same print as one with LF.
export function scan(root) {
  const names = [];
  for (const p of PUBLIC) {
    const abs = path.join(root, p);
    if (!fs.existsSync(abs)) continue;
    const found = p.endsWith('/') ? fs.readdirSync(abs, { recursive: true }).map((f) => p + String(f).split(path.sep).join('/')) : [p];
    for (const rel of found) if (isPublic(rel) && fs.statSync(path.join(root, rel)).isFile()) names.push(rel);
  }
  const hash = crypto.createHash('sha256'), files = {};
  for (const rel of names.sort()) {
    let bytes = fs.readFileSync(path.join(root, rel));
    if (!bytes.subarray(0, 8000).includes(0)) bytes = Buffer.from(bytes.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
    hash.update(`${rel}\0${bytes.length}\0`).update(bytes);
    files[rel] = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  }
  return { print: hash.digest('hex'), files };
}
export const fingerprint = (root) => scan(root).print;

// the files a reviewer's report names, by path or by file name: the fixes it asks for touch these
export const named = (report) => [...new Set((String(report).match(/[\w./\\-]+\.(?:m?js|html|css|json|svg|png|jpe?g|webp|mp3|wav|woff2|glb|gltf)\b/g) || [])
  .map((p) => p.replace(/\\/g, '/').replace(/^(\.\/)+/, '')))];

export const entries = (record = RECORD) => {
  try {
    return fs.readFileSync(record, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return {}; } });
  } catch { return []; }
};

export const write = (entry, record = RECORD) => {
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.appendFileSync(record, `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`);
};

// the last assistant entry of a transcript (JSON lines), as text: a subagent hands its report back
// through a tool call, so its text or its tool call's input
export function lastReport(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    let e;
    try { e = JSON.parse(lines[i]); } catch { continue; }
    if (e.type !== 'assistant') continue;
    const parts = (e.message && e.message.content) || [];
    const text = parts.map((p) => (p.type === 'text' ? p.text : p.type === 'tool_use' ? JSON.stringify(p.input || {}) : '')).join('\n');
    if (text.trim()) return text;
  }
  return '';
}

// the reviewer run that saw these very files, or null: what the owner meets, and the test copy
export const reviewOf = (root, record = RECORD) => {
  const print = fingerprint(root);
  return entries(record).filter((e) => e.kind === 'review' && e.print === print).pop() || null;
};

// The assistant's own look in the headset after fixing what a review found: a review that saw
// these files, or one whose report names every file changed since (a file it did not name, or one
// added or removed that it did not name, needs a new review). Without this, a one-line fix
// waited for a whole new review before the look that checks it.
export const lookOf = (root, record = RECORD) => {
  const now = scan(root);
  const fixes = (e) => Array.isArray(e.named) && e.files && Object.keys({ ...e.files, ...now.files })
    .filter((f) => e.files[f] !== now.files[f]).every((f) => e.named.some((n) => f === n || f.endsWith(`/${n}`)));
  return entries(record).filter((e) => e.kind === 'review' && (e.print === now.print || fixes(e))).pop() || null;
};

// Called by a tool before it starts VR in the headset or publishes the test copy; no flag skips it.
// look: the assistant's own look (tools/quest-look.mjs vr), which a fix of the review's findings
// does not stop; anything else needs a review of exactly the current files.
export function requireReview(root, action, { look = false } = {}) {
  if (look ? lookOf(root) : reviewOf(root)) return;
  console.log(`not now: ${action} waits for the practice reviewer. The game or the probe changed since its last review (or none ran)${look ? ' in a file its report did not name' : ''}: run the practice-reviewer agent on what the owner will meet and fix what it finds; a review of the files as they then stand, recorded by Claude Code's hook, lets this go ahead.`);
  process.exit(1);
}
