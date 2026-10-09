# The plan's first double check

The plan doc (exported to text, 2121 lines) was split in three parts (A: now, the queue, the
audits; B: strategy, science, money, the headset, risks; C: the table of the owner's requests and
the sources), and each part was checked by two `fact-checker` runs that did not see each other.
This is the merged result: where both runs agree it is marked (2), where only one found it (1).
The rows of the plan named here are fixed in the plan itself; this file keeps the causes.

## Counts

| Part | Claims checked (per run) | Confirmed | Contradicted | Stale | Unproven |
|---|---|---|---|---|---|
| A | about 109 | 60–86 | 6 | 8–10 | 6–7 |
| B | about 100–115 | 55–60 | 7–8 | 4–7 | 35–40 |
| C | about 195 rows | 45–55 | 6–9 | about 35 | 8–14 |

`npm test` passed in every run; a planted fault (the sign's 10 s wait removed) failed `glow.test` (2).

## Causes

1. **Statuses not swept (2, the biggest).** A row is written when a request arrives ("doing",
   "waiting") and not updated when the work lands; a later row is added instead, so the plan holds both.
   About 35 rows in part C, 6 items of the owner's to-do list, and the corridor findings listed as
   open after their fixes (fab3789, b1bae2e, 428356c, 8dc3417, 5571944, b04ce62, 8b0ad29).
2. **Claims wider than their guard (2).** "A test checks it" where no test does: the sign is not
   red, text contrast, test runs never send data, the style book, every sheet rests on its surface
   (the paper audit finds 1.5–4 mm gaps); "made from the standard" where the scene audit says
   otherwise: the corridor light (S16, one tuned point light), the EXXXIT letters (IBC 1013 cited,
   letterforms invented), the extinguisher (partly eyeballed); hands and body "checked" when they
   are only granted.
3. **Old rules still stated (2).** Letters "not under 1.2°" (now 24 mm at 1 m, b04ce62); the seal
   "40 mm" (now 42 cm on its own page); the typewriter face (removed, c7ea71c); 19 sources in the
   builder's reference (26); the headset "without a cable" (on the cable since 9.10).
4. **Numbers with no saved evidence (2).** Headset measures (fps, slow frames, draw calls 78 vs
   124 vs 90, battery), the server's 0 records, the domain record; the 11/11 headset run passed
   against an older 60 fps bar. About 40 outside numbers in part B (market, prices, store fees,
   studies) have no source saved in the repo, and the same fact drifts between sections
   (LabintheWild 744,739 sessions vs 3.5 M vs 5 M; Sea Hero Quest 3 M vs 3.9 M).
5. **Sources read loosely (1–2).** The catalog's "any" (VR or mixed reality) read as "not only in
   VR"; Steed 2021 for Steed et al. 2016; Mottelson's "own VR headset" as "161 Quest owners";
   Fernández-Ruiz adaptation "in 3 throws" (an aftereffect after 3, adaptation by 6–12); Valve 2016
   as the last open play-area data (updated 2017; Beat Saber census 2023); Lethal Company peak vs
   average; LabintheWild's 2.2–7.6% as "cheating"; Pronin's "some people" wording.
6. **Two numberings and loose step names (2).** The plan's list of yesterday's causes and this
   folder's README number them differently; "step 5" used for a corridor sub-item (lighting is plan
   step 4, item 5); rows point to steps 4.1 and 4.2 whose own text does not list what the rows put
   there (protection, the double check, the premortem, the rules review, the card index).
7. **Wrong facts about the project (1–2).** The signature "saved nowhere" (kept in this browser
   only, `src/app/consent.js`); the headset model "recorded" (only in playtests and issues, not in
   runs); "we store no network address" (our tables do not; the providers' logs may, as
   `privacy.html` says); the left-early choice wording; 73 requests counted as 61+5+3+8 = 77.
8. **A guard that guards one checkout (1).** `core.hooksPath` is shared by every worktree, but the
   hooks live in the files: the main folder (room-polish, behind this branch) has no `tools/hooks`,
   so commits there run no guard, and the morning check read only the setting.

## Guards

| Cause | Guard |
|---|---|
| 1, 6 | the plan as a card index: open requests only, done rows to an archive tab, one status per request; the fact-checker before the plan is relied on; the request auditor flags rows a later row closed |
| 2, 3 | the fact-checker plants the fault for every "a test checks it" it can (it did for the 10 s wait) |
| 4 | every headset measure saved as a log the plan cites; a number in the plan without a source is written "not checked" (in the plan, in Russian) |
| 5 | the source's own words kept next to the number (docs/research), checked by the fact-checker |
| 7 | the plan's facts about the project come from the code, checked by the fact-checker |
| 8 | `tools/morning.mjs` fails when any checkout of the repository lacks the hook files |

## What was fixed (9.10)

- The 153 requests that were done, answered or decided moved to the plan's tab "Archive of
  requests", their words verbatim (compared letter for letter by a script against the export); the
  states of the 43 open ones and of the archived ones corrected (done, wrong, unproven).
- "Where we are now", the queue, the yesterday's-causes list (now numbered as this folder's README),
  the corridor-check section (now a fixed / left-and-where table), the owner's to-do list, the
  player's path, the tools list, the papers list: corrected.
- Part B: the catalog's "any" field, the headset model in records, the IP address in provider logs,
  Valve 2016 (updated 2017; Beat Saber census 2023), LabintheWild's 2.2% and 7.6%, Fernandez-Ruiz's
  three throws, Mottelson's 161 people with their own headsets, Lethal Company (average 107.9k in Dec
  2023 to 12.1k in Jun 2024, checked) corrected; two checker claims were wrong after re-reading the
  source: Steed et al. 2021 exists (arXiv 2104.05359), and the Lethal Company numbers were right.
- Sections whose numbers have no saved source carry a "not checked" note; saving or removing them
  is plan step 4.2.
