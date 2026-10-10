# Process rebuild: the whole picture, then one change

The owner's request (board, the current step): set up the whole process at once, not part by part. Five read-only
audits (10.10.2026) are the evidence; their notes stayed in the session scratchpad, their findings are
here. This plan replaces docs/audit/rules-review.md and docs/audit/claude-md-proposed.md (older audits never
acted on); they are removed in step 3.

## What the audits found (the causes, not the symptoms)

1. Rules grew by reaction. Almost every complaint got a new rule, guard, hook or cap; the process then became
   the complaint ("in circles", "at the speed of a wall", his words). On 9.10, 88 of 138 commits touched only process files.
   The one complaint that stopped (juggling the headset) was fixed by changing what the owner goes through,
   not by a rule.
2. One concern lives in many places. His requests and decisions sit in about 12 files; several rules
   contradict each other (who decides; "do exactly what was asked" vs "the whole before a part"; "push on his
   word" vs a stop hook that pushes every turn); memory files restate repo rules and drift from them; rules
   are cited by numbers that no longer exist.
3. Caps count length, not purpose. The start message must stay under 10,000 characters (Claude Code's limit
   on hook output), so his words get trimmed; mistakes.md is capped at 60 lines, so rows are crammed into
   1,500-character lines; research was capped at 25 reads and stopped short every time.
4. Tools are installed but not wired or not working. Research agents lacked the paper tools and did not know
   the 567 MB library; tesseract is registered but missing on disk; the meta-vr server gives 0 tools; three
   servers are duplicated; about 20,700 characters of connector instructions load every session, 70% from
   servers the work never uses; a plugin injects "ABSOLUTELY MUST" process text that competes with ours.
5. Checks match text, not meaning. The shell guard refuses searches and reads that merely contain its words;
   a "guard" for a mistake only has to be a file name, so stale rows count as guarded; the message log mixed
   helpers' reports into his words (fixed 10.10: 77 of 318 entries, nine with a yes).
6. The step's progress lives nowhere lasting, so a compaction loses where the step stood: circles.
7. The library has no index of its own. 168 of 311 papers have no card, 24 are named nowhere (room 01's own
   paper among them), some records contradict the files on disk; a search takes a second, making sense of it
   takes minutes and depends on which file is opened first.
8. Slow, doubled machinery. Every commit runs the full 65-75 s suite; every commit is pushed twice and CI runs
   twice (about 8 minutes each); hooks run from the main folder's copy, so a fixed guard is not live until it
   reaches the main folder.

## How others do it (sources in the scratchpad notes, Claude Code docs and library practice)

- CLAUDE.md holds only what every session needs ("would removing this cause mistakes? If not, cut it"); it is
  re-read after a compaction; files it imports load with it, without the 10,000-character hook limit.
- Progressive disclosure: an always-loaded index of a few hundred words, sections loaded on demand, the full
  text only when a task needs it (Anthropic's skills; library catalogues: one record per item, Dublin Core
  fields, tags; Zotero collections).
- Hooks only for what must always happen; short output; fast.
- A progress file plus git as the hand-off between sessions (Anthropic's long-running harness).
- Unused connectors switched off; command-line tools preferred where they exist.

## The design: one place for each thing

| Thing | One place | Loaded |
|---|---|---|
| His settled decisions | docs/owner-decisions.md, imported by CLAUDE.md | always, and after every compaction |
| Rules for the assistant | CLAUDE.md, about 40 lines, no copies elsewhere | always |
| The work queue and showings | docs/board.md (current step, next steps, waiting for him, showings) | start hook |
| Where the current step stands | the board's current step, kept up to date at each sub-step | start hook |
| Where things are | docs/state.md (a map, no history) | on demand |
| Papers | docs/library.md: generated index by section, one line per paper, then card, then text | index always cheap, rest on demand |
| Research | docs/research/README.md: one index of all research files | on demand |
| What he and how he works | auto memory: only facts about him not in the repo | always (index) |
| Mistakes | docs/mistakes.md: each row names a real test that fails without its fix | on demand |
| Procedures | the new-room skill; research, review and audit agents with full tools | on demand |

## The changes, all in one go (step 3)

1. Start context: owner-decisions.md moves into CLAUDE.md by import; the start hook prints only the board.
   The 10,000-character trimming of his words ends.
2. One place each: remove duplicates and contradictions between CLAUDE.md, state.md, decisions.md, roadmap.md,
   memory and the skill; fix stale numbers and rule references; old audits removed.
3. Library index: a script builds docs/library.md and its section files from the papers folder and the cards
   (fields: id, authors, year, title, section, tags, text quality, status, used in, source, relation);
   npm test keeps it current; it replaces search-coverage.md and papers-needed.md. Missing text copies made;
   byte-identical duplicates noted.
4. Agents: every research and review agent gets the paper tools, the browser and the library first; limits
   sized to the question; a report cut short says so in its first line.
5. Guards: keep the ones for what cannot be undone (main, secrets, live database, headset restart) and saving
   work; rewrite the shell guard to judge the command, not words inside it; mistakes rows must name a test.
6. Speed: a fast commit check (seconds); the full suite on GitHub only; CI on one branch.
7. Connectors (the owner switches them on claude.ai and in the app): off - Notion, Jam, Adobe, Figma (both),
   the GitHub connector (gh does it), Claude in Chrome, computer use, Minutes, the privacy-legal plugin; keep -
   Claude Docs, the browser pane, Consensus, PubMed, reference lookup (hosted copy), PDF Tools, Dropbox,
   Supabase (one copy); meta-vr only for its store skill.
8. Health check: tools/health.mjs checks every program the project uses, dead PATH entries, the guards' live
   copy, the library index, agents' tool lists; the start message shows only what is broken.
9. After the rebuild the process is frozen: a change to it comes only from a health-check finding or the
   owner's word, and replaces something.

## What the research gives the rooms: one recipe

Kept in one place, the new-room skill (.claude/skills/new-room/SKILL.md, "The room recipe"): eight steps, each
already tested somewhere, from the what-stands-for-what table to preregistration and ethics approval.

## Risks of the rebuild itself, and their answers

- It becomes another circle: it has a fixed list (the changes above), a done test (step 4) and then a freeze.
- Agent files change only for new sessions (a helper started today did not get the new paper tools): step 3
  ends by opening a fresh session, which runs step 4.
- Guards run from the main folder's copy: every guard change is merged into the main folder before it is tested.

## Step 4, the proof

Run one real piece of work through it: the extinguisher (board item 4) from the 19-photo findings to his
headset. Measure: time to the first picture, number of process commits (target: none), circles (none).

## Decisions only the owner makes

1. The connector list above: switch off as listed?
2. The superpowers plugin (injects "ABSOLUTELY MUST invoke the skill" into every session and competes with
   this process): switch off?
3. Freeze the process after the rebuild (point 9)?
