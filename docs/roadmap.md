# Roadmap

## What Objekt is
A living archive of classic psychology experiments that you go through yourself
in VR. One short room per experiment. Every room follows the same arc:

1. **Catch** — you are the subject; the room reproduces the original situation.
2. **Reveal** — what you did, proven by the event log; how the trick worked.
3. **Original** — what the study found (sourced in `sources.md`).
4. **You vs others** — your result next to other players and the original numbers.

Not a big game: small rooms, minutes each. Reading about an experiment is weak,
watching is better, living through it is the strongest form of explanation.

## End point (release 1.0)
- Lobby + 3 rooms, each through the full arc above.
- Runs smoothly in Quest Browser and on desktop; works in Chrome and Firefox.
- Anonymous statistics with consent; "you vs others" shown in every reveal.
- Closed playtest done with VR players; top issues fixed.
- Public page and link; optional later: Meta Horizon Store via WebXR PWA.

## Principles (from research)
| Area | Rule | Source |
|---|---|---|
| Frame rate | 72 fps on Quest (13.7 ms per frame), 90 fps on Quest 2 (11.1 ms) | [Meta WebXR perf](https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/) |
| Draw calls | Under ~300 per frame for A-Frame/three.js. Room 01 measured: 46 max | [Meta WebXR best practices](https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/) |
| Materials | Prefer Basic/Lambert or baked lighting over Standard (PBR). Room 01 uses 71 Standard materials: fine for now, first thing to change if a headset drops frames | same |
| Comfort | No forced artificial movement; if movement is needed, teleport and snap turn; no sudden camera motion | [Meta comfort](https://developers.meta.com/horizon/design/comfort/) |
| Text | Large, bold, high contrast; comfortable reading distance about 2–3 m | [Meta typography](https://developers.meta.com/horizon/design/styles_typography/) |
| VR is valid for this | People react to virtual social situations as if real: Milgram in VR (Slater 2006), smoke/bystander in VR (Kinateder), Asch in VR (conformity about 34%) | [Slater 2006](https://doaj.org/article/ac663279a2064039873d63c77347297f), [Frontiers 2016](https://www.frontiersin.org/articles/10.3389/frobt.2016.00043/pdf) |
| Deception | Allowed only with a full debriefing right after; the player can quit at any time | [IRB guidance on deception](https://irb.northwestern.edu/resources-guidance/policies-guidance/docs/guidance-for-research-involving-deception-or-incomplete-disclosure---general---1919.pdf) |
| Data | Store only truly anonymous data (no IP, no account, no free text); ask consent before sending anything; say upfront that anonymous runs cannot be deleted later | [GDPR Recital 26](https://presencis.com/regulations/gdpr/recital-26/) |
| Wording | "Online experiment", not "scientific study": publishing research needs ethics approval | — |

Unknown, check in a headset: whether Quest Browser has Russian speech
synthesis voices. If not, the experimenter is silent and needs recorded audio.

## Phases
Work on one phase at a time. A phase is done only when its exit check passes.

### 0. Foundation — done
Structure, rules, docs, sources, unit + smoke tests, CI on every push.

### 1. Room 01 at release quality
- Headset check on Quest: stable frame rate, readable text, levers reachable.
- Experimenter voice that works in the headset (recorded or verified synthesis).
- Start screen: what this is, that you can quit any time, consent for statistics.
- Exit check: the owner plays it in the headset start to finish with no problem.

### 2. Statistics
- Each finished run sends an anonymous summary (the `analyse()` report, no ids).
- Server: insert-only endpoint, aggregated read for the reveal.
- Reveal shows "you / all players / original".
- Exit check: test runs appear in the database and the numbers show in the reveal.

### 3. Lobby and room 02
- Lobby to pick a room. Room 02 is a new folder under the room contract.
- Exit check: both rooms pass unit + smoke tests; owner plays both in the headset.

### 4. Closed playtest
- Link to VR community testers, short feedback form.
- Watch: share of players who finish, where they quit, frame-rate problems.
- Exit check: top issues from testers fixed.

### 5. Public release
- Public page, link for headsets; Firefox smoke test working in CI.
- Later, optional: Meta Horizon Store as a WebXR PWA.

## Room candidates
| Room | Original | Status |
|---|---|---|
| 01 Superstition | Ono 1987 | built |
| Conformity | Asch 1951 (VR replication exists) | candidate |
| Smoke room | Latané & Darley 1968 (75% alone vs 10% with passive confederates) | candidate |
| Door swap | Simons & Levin 1998 (change blindness) | candidate |
| Leading words | Loftus & Palmer 1974 | candidate |
| Obedience | Milgram 1963 / Slater 2006 in VR | candidate, ethically heaviest |
| Bernays, Chase | propaganda and the power of words: not lab experiments, need a room format first | idea |

## Scope guard
- New ideas go to "Room candidates" or a "Later" note, not into the current phase.
- No feature without the owner's word. One phase at a time.
