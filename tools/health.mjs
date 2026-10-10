// The laptop's health in plain words: every program the project calls, the PATH, the papers library
// and its backup, the research agents' tools, and whether the guards Claude Code runs are this
// checkout's. Things here broke without a sound (an OCR program registered but gone from the disk,
// agents without their paper tools, a guard fixed in one checkout while another copy runs), and the
// owner reads no code, so each problem is one line: what is wrong and what to do.
// Usage: node tools/health.mjs [--all] [--strict]
//   exit 0 always (it informs, it never blocks); --strict exits 1 when something is broken;
//   --all also lists what passed
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PAPERS = path.join(os.homedir(), 'Documents', 'objekt-papers');
export const BACKUP = 'F:\\objekt-papers-backup';
export const MIN_WORDS = 100;
const result = (level, text, extra = {}) => ({ level, text, ...extra });
const ok = (text, extra) => result('ok', text, extra);
const broken = (text, extra) => result('broken', text, extra);
const warning = (text) => result('warning', text);
const info = (text) => result('info', text);
const few = (list) => list.slice(0, 3).join(', ') + (list.length > 3 ? ` and ${list.length - 3} more` : '');
const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Node refuses to start a .cmd or .bat without the shell (its CVE-2024-27980 fix), so those go
// through it, the rest straight
export function run(file, args = []) {
  const opts = { encoding: 'utf8', timeout: 20000, windowsHide: true };
  const r = /\.(cmd|bat)$/i.test(file) ? spawnSync(`"${file}" ${args.join(' ')}`, { ...opts, shell: true }) : spawnSync(file, args, opts);
  return { out: `${r.stdout || ''}\n${r.stderr || ''}`, error: r.error?.code };
}

const reinstall = (pkg) => `reinstall: choco install ${pkg} -y --force (as administrator)`;
// how each was installed on this laptop decides its fix: poppler and tesseract by Chocolatey,
// scrcpy and ffmpeg by Scoop, Python by its install manager
export const PROGRAMS = [
  { name: 'node', args: ['--version'], expect: /^v\d+\.\d+\S*/m, fix: 'reinstall Node.js LTS from nodejs.org' },
  { name: 'npm', args: ['--version'], expect: /^\d+\.\d+\.\d+/m, fix: 'it comes with Node.js: reinstall Node.js LTS from nodejs.org' },
  { name: 'git', args: ['--version'], expect: /^git version \S+/m, fix: 'reinstall Git for Windows from git-scm.com' },
  { name: 'gh', args: ['--version'], expect: /^gh version \S+/m, fix: 'reinstall GitHub CLI from cli.github.com' },
  { name: 'python', args: ['--version'], expect: /^Python \d\S*/m, fix: 'py install 3.14 (the Python install manager from python.org/downloads)' },
  { name: 'pdftotext', args: ['-v'], expect: /^pdftotext version \S+/m, fix: reinstall('poppler') },
  { name: 'pdftoppm', args: ['-v'], expect: /^pdftoppm version \S+/m, fix: reinstall('poppler') },
  // antiword has no version switch: run bare, it prints its usage with the version in it
  { name: 'antiword', args: [], expect: /Version: \S+/, fix: 'it lived in Git for Windows\' folder C:\\Program Files\\Git\\ucrt64\\bin (with share\\antiword): put it back there' },
  { name: 'tesseract', args: ['--version'], expect: /^tesseract v?\d\S*/m, fix: reinstall('tesseract') },
  { name: 'adb', args: ['version'], expect: /^Android Debug Bridge version \S+/m, fix: 'unpack Android platform-tools (developer.android.com/tools/releases/platform-tools) into C:\\adb\\platform-tools' },
  { name: 'scrcpy', args: ['--version'], expect: /^scrcpy \d\S*/m, fix: 'scoop install scrcpy' },
  { name: 'ffmpeg', args: ['-version'], expect: /^ffmpeg version \S+/m, fix: 'scoop install ffmpeg' }
];
export const TESSERACT_LANGS = ['eng', 'rus'];

// --- What a name on the PATH really starts -------------------------------------------------
// Windows tries the name with each runnable extension, then (in Git Bash) the bare name: a shell
// script such as Chocolatey's folder holds for tesseract
export function findOnPath(name, dirs, platform = process.platform, pathext = process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD') {
  const exts = platform === 'win32' ? [...pathext.toLowerCase().split(';').filter((e) => ['.com', '.exe', '.bat', '.cmd'].includes(e)), ''] : [''];
  const hits = [];
  for (const dir of dirs) for (const ext of exts) {
    const f = path.join(dir, name + ext);
    try { if (fs.statSync(f).isFile()) hits.push(f); } catch { /* not in this folder */ }
  }
  return hits;
}
// Chocolatey's shims (shimgen) name their target in their own help (--shimgen-help, "Target: '…'")
export function parseShimgenHelp(text) {
  const target = text.match(/^\s*Target: '([^']*)'/m)?.[1];
  return target ? { target, exists: /Target exists: 'True'/.test(text) } : null;
}
// Scoop's shims read the target from a .shim file beside them: path = "C:\…"
export const parseScoopShim = (text) => text.match(/^\s*path\s*=\s*"?([^"\r\n]+?)"?\s*$/m)?.[1] || null;
// a shell launcher's exec line; Git Bash writes C:\ as /c/
export function parseExecScript(text) {
  const p = text.match(/^\s*exec\s+(?:"([^"]+)"|(\S+))/m);
  const target = p?.[1] || p?.[2];
  if (!target) return null;
  return /^\/[a-z]\//i.test(target) ? `${target[1].toUpperCase()}:\\${target.slice(3).replaceAll('/', '\\')}` : target;
}
// shims are small: a big file is the program itself and is not read whole
export function launcherOf(file, runIt = run) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.exe') {
    const shim = `${file.slice(0, -4)}.shim`;
    if (fs.existsSync(shim)) return { kind: 'Scoop', target: parseScoopShim(fs.readFileSync(shim, 'utf8')) };
    if (fs.statSync(file).size < 1 << 20 && fs.readFileSync(file).includes('shimgen')) {
      const help = parseShimgenHelp(runIt(file, ['--shimgen-help']).out);
      if (help) return { kind: 'Chocolatey', target: help.target };
    }
    return null;
  }
  if (ext === '') return { kind: 'script', target: parseExecScript(fs.readFileSync(file, 'utf8')) };
  return null;
}

export function checkProgram(p, dirs, { extra = [], platform = process.platform, runIt = run } = {}) {
  const onPath = findOnPath(p.name, dirs, platform);
  const outside = !onPath.length;
  for (const hit of onPath.length ? onPath : findOnPath(p.name, extra, platform)) {
    const launcher = platform === 'win32' ? launcherOf(hit, runIt) : null;
    if (launcher?.kind === 'script' && !launcher.target) continue;   // a script we cannot follow; Windows skips it too
    if (launcher && !fs.existsSync(launcher.target || '')) {
      return broken(`${p.name} missing on disk (${launcher.kind}'s launcher ${hit} points at ${launcher.target}, which is gone): ${p.fix}`, { name: p.name });
    }
    const real = launcher ? launcher.target : hit;
    const r = runIt(real, p.args);
    const version = r.out.match(p.expect)?.[0];
    if (!version) return broken(`${p.name} does not run (${r.error || r.out.trim().split(/\r?\n/)[0] || 'no answer'}): ${p.fix}`, { name: p.name });
    if (outside) return result('warning', `${p.name} runs only inside Git Bash (${path.dirname(hit)} is not on the Windows PATH): call it from the Bash tool, not PowerShell`, { name: p.name, real });
    return ok(`${p.name}: ${version.trim()} (${real})`, { name: p.name, real });
  }
  return broken(`${p.name} not found on this laptop: ${p.fix}`, { name: p.name });
}

export function parseLangs(text) {
  const lines = text.split(/\r?\n/);
  const at = lines.findIndex((l) => /^List of available languages/.test(l));
  return { dir: lines[at]?.match(/"([^"]+)"/)?.[1] || null, langs: at < 0 ? [] : lines.slice(at + 1).map((l) => l.trim()).filter(Boolean) };
}
export function checkTesseractLangs(real, runIt = run) {
  const { dir, langs } = parseLangs(runIt(real, ['--list-langs']).out);
  const missing = TESSERACT_LANGS.filter((l) => !langs.includes(l));
  return missing.length
    ? broken(`tesseract has no ${missing.join(' or ')} language data: put ${missing.map((l) => `${l}.traineddata`).join(' and ')} from github.com/tesseract-ocr/tessdata into ${dir || 'its tessdata folder'}`)
    : ok(`tesseract reads ${TESSERACT_LANGS.join(' and ')}`);
}

// --- PATH ------------------------------------------------------------------------------------
export const parseRegPath = (text) => text.match(/^\s*Path\s+REG_(?:EXPAND_)?SZ\s+(.*?)\s*$/mi)?.[1] || '';
export function expandVars(s, env) {
  const keys = Object.keys(env);
  return s.replace(/%([^%]+)%/g, (all, name) => { const k = keys.find((e) => e.toLowerCase() === name.toLowerCase()); return k ? env[k] : all; });
}
export const splitPath = (s, platform = process.platform) =>
  s.split(platform === 'win32' ? ';' : ':').map((e) => e.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean);
const samePath = (a, b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
// sources: [{ where, entries }], checked in order; a folder named in two places is reported once
export function deadPathEntries(sources, exists = fs.existsSync) {
  const seen = [], dead = [];
  for (const { where, entries } of sources) for (const e of entries) {
    if (seen.some((s) => samePath(s, e))) continue;
    seen.push(e);
    if (!exists(e)) dead.push({ entry: e, where });
  }
  return dead;
}
// On Windows the PATH saved in its settings is the one to fix; a session's own additions are left
// out (Git Bash adds folders it may not have, such as usr\local\bin)
function checkPath() {
  const reg = (key) => expandVars(parseRegPath(spawnSync('reg', ['query', key, '/v', 'Path'], { encoding: 'utf8', windowsHide: true }).stdout || ''), process.env);
  const sources = process.platform === 'win32'
    ? [{ where: 'the machine PATH', entries: splitPath(reg('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment'), 'win32') },
      { where: 'your user PATH', entries: splitPath(reg('HKCU\\Environment'), 'win32') }]
    : [{ where: 'the PATH', entries: splitPath(process.env.PATH || '') }];
  const dead = deadPathEntries(sources);
  const fix = 'remove it (Windows: Edit the system environment variables, Environment Variables)';
  return dead.length ? dead.map((d) => warning(`PATH names a folder that does not exist: ${d.entry} (in ${d.where}): ${fix}`)) : [ok('every PATH folder exists')];
}

// --- The papers and their backup -------------------------------------------------------------
const walk = (dir, base = dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name)).replaceAll('\\', '/')]));
export const words = (text) => (text.match(/\S+/g) || []).length;
export function checkPapers(lib = PAPERS, backup = BACKUP, exists = fs.existsSync) {
  if (!exists(lib)) return [broken(`the papers library ${lib} is gone: copy it back from the backup: robocopy "${backup}" "${lib}" /E`)];
  const files = walk(lib).sort(), have = new Set(files);
  const pdfs = files.filter((f) => /\.pdf$/i.test(f));
  const noText = pdfs.filter((f) => { const t = f.replace(/\.pdf$/i, '.txt'); return !have.has(t) || words(fs.readFileSync(path.join(lib, t), 'utf8')) < MIN_WORDS; });
  const out = [noText.length
    ? broken(`${count(noText.length, 'paper')} without a text copy of ${MIN_WORDS}+ words beside it (${few(noText)}): make it: pdftotext -enc UTF-8 paper.pdf; a scan: pdftoppm -r 300 -png, then tesseract page.png page -l eng+rus`)
    : ok(`${count(pdfs.length, 'paper')}, each with a text copy`)];
  const drive = path.parse(backup).root;
  if (!exists(drive)) return [...out, warning(`the backup drive ${drive} is not plugged in, so the papers' backup was not checked`)];
  if (!exists(backup)) return [...out, broken(`no backup of the papers on ${drive}: make it: robocopy "${lib}" "${backup}" /E`)];
  const saved = new Set(walk(backup));
  const unsaved = files.filter((f) => !saved.has(f)), gone = [...saved].sort().filter((f) => !have.has(f));
  out.push(unsaved.length ? broken(`${count(unsaved.length, 'file')} of the papers library not in the backup (${few(unsaved)}): copy them: robocopy "${lib}" "${backup}" /E`) : ok(`the backup holds all ${files.length} files`));
  if (gone.length) out.push(warning(`the backup holds ${count(gone.length, 'file')} the library no longer has (${few(gone)}): renamed or removed in the library; keep or remove them in the backup by hand`));
  return out;
}

// --- The research agents ---------------------------------------------------------------------
export const RESEARCH_AGENTS = ['deep-research', 'quick-research'];
const NEEDS = [
  ['the papers search (4ff8cb31 search)', (t) => /4ff8cb31[\w-]*__search\b/.test(t)],
  ['reference lookup', (t) => t.includes('reference-lookup')],
  ['PDF Tools', (t) => t.includes('PDF_Tools')],
  ['the browser', (t) => t.includes('Claude_Browser')]
];
// an agent with no tools line inherits every tool of the session (code.claude.com/docs/en/sub-agents)
export function agentLacks(text) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
  const tools = front.match(/^tools:\s*(.*)$/m)?.[1];
  const lacks = tools === undefined ? [] : NEEDS.filter(([, has]) => !has(tools)).map(([what]) => what);
  if (!text.includes('objekt-papers')) lacks.push('the papers library (objekt-papers) named in its instructions');
  return lacks;
}
export function checkAgents(root = ROOT) {
  return RESEARCH_AGENTS.map((name) => {
    const file = path.join(root, '.claude', 'agents', `${name}.md`);
    if (!fs.existsSync(file)) return broken(`the ${name} agent is gone (.claude/agents/${name}.md): bring the file back from git`);
    const lacks = agentLacks(fs.readFileSync(file, 'utf8'));
    return lacks.length ? broken(`the ${name} agent lacks ${lacks.join(', ')}: add them to .claude/agents/${name}.md (a new session picks it up)`) : ok(`the ${name} agent has the paper tools, the browser and the library`);
  });
}

// --- The guards Claude Code runs -------------------------------------------------------------
// Claude Code runs the hooks of the folder a session was opened in, the main folder, while a
// session edits its own checkout under .claude/worktrees: a guard fixed here is not live until the
// two match
export const localImports = (text) => [...text.matchAll(/from\s+'\.\/([\w.-]+\.m?js)'/g)].map((m) => m[1]);
const readOr = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
export const sameText = (a, b) => a !== null && b !== null && a.replace(/\r\n/g, '\n') === b.replace(/\r\n/g, '\n');
export function guardFiles(here, main) {
  const hooks = (dir) => { try { return fs.readdirSync(path.join(dir, 'tools', 'hooks')); } catch { return []; } };
  const imports = localImports(readOr(path.join(here, 'tools', 'claude-guard.mjs')) || '').map((f) => `tools/${f}`);
  return ['tools/claude-guard.mjs', ...imports, ...[...new Set([...hooks(here), ...hooks(main)])].sort().map((h) => `tools/hooks/${h}`), '.claude/settings.json'];
}
export function checkGuards(here, main, mainBranch = 'its branch') {
  if (!main || samePath(here, main)) return [ok('this is the main folder: the guards Claude Code runs are these')];
  const files = guardFiles(here, main);
  const differ = files.filter((f) => !sameText(readOr(path.join(here, f)), readOr(path.join(main, f))));
  return differ.length
    ? [broken(`the guards Claude Code runs are the main folder's (${main}) and ${differ.length} differ from this checkout's (${few(differ)}): a guard fixed here is not live; merge this branch into ${mainBranch} there, or bring this checkout up to date`)]
    : [ok(`the guards Claude Code runs equal this checkout's (${files.length} files)`)];
}
function mainFolder() {
  const git = (...args) => { const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', windowsHide: true }); return r.status === 0 ? r.stdout.trim() : null; };
  const common = git('rev-parse', '--path-format=absolute', '--git-common-dir');
  const first = (git('worktree', 'list', '--porcelain') || '').split(/\r?\n\r?\n/)[0];
  return { main: common ? path.dirname(common) : null, branch: first.match(/^branch refs\/heads\/(.+)$/m)?.[1] };
}

// --- The headset (information only) ----------------------------------------------------------
export function parseAdbDevices(text) {
  const lines = text.split(/\r?\n/);
  const at = lines.findIndex((l) => /^List of devices attached/.test(l));
  return at < 0 ? [] : lines.slice(at + 1).map((l) => l.trim().split(/\s+/)).filter((p) => p.length >= 2).map(([serial, state]) => ({ serial, state }));
}
export function headsetInfo(devices) {
  if (devices.some((d) => d.state === 'device')) return info('headset connected');
  if (devices.some((d) => d.state === 'unauthorized')) return info('headset on the cable but not allowed: put it on and accept the USB debugging question');
  return info('no headset on the cable');
}

// --- The report ------------------------------------------------------------------------------
export function format(results, { all = false } = {}) {
  const bad = results.filter((r) => r.level === 'broken'), look = results.filter((r) => r.level === 'warning');
  const more = look.length ? `, ${look.length} to look at` : '';
  const lines = [bad.length ? `health: ${bad.length} broken${more}` : `health: ok (${results.length} checks)${more}`,
    ...bad.map((r) => `broken: ${r.text}`), ...look.map((r) => `warning: ${r.text}`)];
  if (all) lines.push(...results.filter((r) => r.level === 'ok' || r.level === 'info').map((r) => `${r.level}: ${r.text}`));
  return lines.join('\n');
}

export function runAll() {
  const dirs = splitPath(process.env.PATH || '');
  const gitExe = findOnPath('git', dirs)[0];
  // Git for Windows' own folders, on the PATH only inside Git Bash
  const extra = process.platform === 'win32' && gitExe ? ['ucrt64', 'mingw64', 'usr'].map((d) => path.join(path.dirname(path.dirname(gitExe)), d, 'bin')) : [];
  const programs = PROGRAMS.map((p) => checkProgram(p, dirs, { extra }));
  const results = [...programs];
  const tess = programs.find((r) => r.name === 'tesseract' && r.real);
  if (tess) results.push(checkTesseractLangs(tess.real));
  results.push(...checkPath(), ...checkPapers(), ...checkAgents());
  const { main, branch } = mainFolder();
  results.push(...checkGuards(ROOT, main, branch));
  const adb = programs.find((r) => r.name === 'adb' && r.real);
  results.push(adb ? headsetInfo(parseAdbDevices(run(adb.real, ['devices']).out)) : info('headset not checked: adb does not run'));
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const results = runAll();
  console.log(format(results, { all: process.argv.includes('--all') }));
  process.exitCode = process.argv.includes('--strict') && results.some((r) => r.level === 'broken') ? 1 : 0;
}
