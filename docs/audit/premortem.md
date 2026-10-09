# Premortem of the plan

Gary Klein's premortem (Harvard Business Review 85(9), 2007): assume the project has failed and ask
why, before it happens. Two analysts, each on one lens, read the plan after its double check
(`plan-check.md`) and the repository, and wrote as if it were October 2027. Each cause below names
where its guard goes; nothing here is built yet unless it says so.

## Lens 1: players, product, the owner and the way of working

| # | Cause | Earliest sign | Goes to |
|---|---|---|---|
| 1 | The first room keeps sliding behind infrastructure steps (4.1-4.3, 4a, corridor 3-5 all put ahead of step 5) | most recent commits touch no `src/rooms/`; no date for "a stranger finishes a prototype" | decided by the owner: the corridor is the reference every room is built on, so it is finished first, then step 5; the morning check could print the days since the last change to a room |
| 2 | Guard inflation, Cosmogram's failure again: CLAUDE.md grew from 1.7 to 7.8 KB in three days with no cap; every step needs several checkers | rules and guards only ever added | step 4.1 c: a cap on CLAUDE.md, a "guard" line per rule, a guard counts only once shown failing |
| 3 | Stale records: the same status written in the plan, state.md, the audit, the roadmap | rows a later commit has closed | step 4.1 c: one place per status, others link; the request auditor reports stale rows and the live tab's size |
| 4 | The owner burns out as the only approver, player and headset operator | asks that wait for days | step 4.1 c: few open asks, each dated; the age of the oldest in every status |
| 5 | Gate 0 passes when it should not: the room chosen by the owner's own reaction, testers from his own community, one measure is a stated intention | | plan step 10 and its thresholds: count behaviour (a "next room" press), half the testers strangers |
| 6 | Every player hits a dead end after a room (no "what next", no share) | the player-path table says "dead end" | plan step 7 or 9: the tester build ends on one "what next" page, gate 0 counts presses |
| 7 | Each room costs too much (full sourcing for every prop) | no measure of paper-to-tester time | step 4.1 c: full rule 23 for what the player touches or reads; the time per room recorded |
| 8 | A bad first impression on another headset or in another language | only one Quest 3 tested | plan step 4.2 (record headset model and frame rate per run) and gate 0 (one tester on another headset) |
| 9 | Checks stall on hardware (cable, daily power cuts, the boundary dialog) | headset numbers without saved logs | plan step 4.3: logged measures; the morning check shows the age of the last headset log |
| 10 | Everything rests on one assistant and one laptop; raw branches only on the laptop | | the owner's decision: a private repository for raw work |

Keep: gate 0 by numbers before building more rooms and the room filter; one queue, one step at a
time, every request a row in his words; a few blocking machine stops, not many warnings.

## Lens 2: science, data, security, money and law

| # | Cause | Where it stands | Goes to |
|---|---|---|---|
| 1 | Consent and ethics do not allow science: consent covers "general statistics", privacy.html promises science only with a later consent, no consent version is stored, no ethics approval | not guarded | plan step 4.2 first: consent wording and a consent version in every row; "pilot data are never analysed" unless approved |
| 2 | "Anonymous" may not hold (full timestamps next to provider IP logs), and the promised deletion needs a token | not guarded | plan step 4.2: one model in writing; time cut to the hour inside `submit_run`; a minimum cell size above 10 |
| 3 | Results are sent before the debrief (APA 8.07(c)) | plan step 8a; sending is on in code | plan step 8a, before testers (step 9): send only after a "keep or discard my result" answer, with a test |
| 4 | Movement data identify people; methodology.md says the raw event stream is stored, privacy.html says exact times are not sent | partly: the server takes only whitelisted numbers within a size cap | plan step 4.2: no head, hand or voice trace leaves the device, only derived numbers; a test fails a `submit_*` that accepts arrays; methodology.md corrected |
| 5 | Bots and flooding: the only limits are global per minute; a bot can fill the cap and lock real players out | named in plan step 4.2 | plan step 4.2: per-source limits at the edge, consistency checks in `submit_run`, an hourly row alert |
| 6 | No backup, no drift check between the live server and `supabase/migrations`; the assistant could write to production | not guarded | plan step 4.2: a weekly export, the morning check compares migrations and that anonymous reads fail |
| 7 | "You vs others" scans all runs on every call and a before-and-after difference can reveal one answer | not guarded | plan step 4.2: aggregates in their own table |
| 8 | Money: sales only through the Meta Store, whether Meta can pay the owner's country is deferred, no cost list | not guarded | the owner's check before any paid floor; a monthly cost line |
| 9 | Legal identity: the privacy page names no responsible person or legal basis | plan step 8a ("a lawyer on his word") | plan step 8a as a gate before testers |
| 10 | Data quality: "first run" lives in browser storage; no codebook or exclusion rules | partly | plan step 4.2: a codebook and exclusion rules per room version before testers |

Keep: the server's shape (private schema, row-level security, insert-only checked functions,
whitelists and size caps, a test pinning the client's fields to the SQL); the consent model (two
explicit buttons, nothing sent without recording, preview and test runs never send, age asked, name
and signature only on the device, no ads, no selling data); no ids in the data and comparisons only
from first runs with at least 10 players.
