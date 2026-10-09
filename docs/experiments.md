# Experiment selection

**Superseded** by the 145 cards (`docs/cards/`) and their catalog (`docs/catalog.md`): read those. This list is kept because the research notes cite its rows (docs/research/vr/06-science.md).

Which experiments become rooms, and why. Every number here needs a source in
`sources.md` before it is shown to the player.

## Criteria
1. **Replicated.** The effect survived large replications. A famous effect that
   failed replication is never presented as fact.
2. **Survives awareness.** Players know they are in a psychology game. Prefer
   effects that work even when the person expects a trick (perception, memory,
   anchoring, repetition) over ones that need full naivety.
3. **Fits VR.** Presence, space, the body, things behind your back.
4. **Measurable.** The event log can prove what the player did.
5. **Ethical.** Short, no real harm, full reveal right after, quit any time.
6. **Feasible.** A few minutes, a small scene, plain WebXR.

## Do not use (failed or flawed)
| Effect | Why | Source |
|---|---|---|
| Stanford Prison (Zimbardo 1971) | Guards were coached; replication failed | [Live Science](https://livescience.com/62832-stanford-prison-experiment-flawed.html) |
| Ego depletion | 23-lab registered replication: d = 0.04 | [summary](https://mindsetonline.com/roy-baumeister-willpower-ego-depletion-failed-replicate/) |
| Elderly-walking priming (Bargh 1996) | Failed replication (Doyen 2012) | [National Geographic](https://www.nationalgeographic.com/science/article/failed-replication-bargh-psychology-study-doyen) |
| Facial feedback pen study | 17-lab replication found no effect | [APS](https://www.psychologicalscience.org/news/releases/effect-of-facial-expression-on-emotional-state-not-replicated-in-multilab-study.html) |
| Power posing | Repeated failures | [Scientific American](https://www.scientificamerican.com/podcast/episode/power-poses-dont-stand-up) |
| Money / flag priming | Did not replicate in Many Labs 1 | [Many Labs](https://www.bitss.org/education/mooc-parent-page/week-4-replication-and-open-data/approaches-to-the-replication-of-research/a-replication-example-the-many-labs-project/) |
| Marshmallow test as predictor | Correlation mostly disappears with family controls | [Big Think](https://bigthink.com/neuropsych/marshmallow-test/) |
| Zeigarnik (interrupted tasks remembered better) | Meta-analysis 2025: ratio 0.99, no effect | [Ghibellini & Meier 2025](https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html) |
| Divers' context memory (Godden & Baddeley 1975) | Exact replication (Murre 2021) found nothing | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8568063) |
| Doorway forgetting (Radvansky) | Not replicated in VR or real rooms (McFadyen 2021) | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7938580) |
| Digital chameleons (Bailenson & Yee 2005) | Preregistered test (Hale & Hamilton 2016) found no effect | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5064448) |
| Watching eyes increase generosity | Review of 27 studies (Northover 2017): no effect | [SPSP](https://spsp.org/news-center/character-context-blog/can-images-watching-eyes-increase-generosity) |
| Illusion of control, Langer 1975 version | Did not replicate; use the Alloy & Abramson task instead | — |
| Ono 1987 superstition as a room | 40 minutes of waiting; compressing it changes the experiment | `sources.md` |

## Candidates
| # | Room | Original | Robustness | VR fit | Note |
|---|---|---|---|---|---|
| (01) | Superstition | Ono 1987 | Moderate: only 3 of 20 in the original | Good | Built, but unsuitable (40 min). Parked; booth reused |
| 02 | Smoke room | Latané & Darley 1968: 75% alone, 38% with naive others, 10% with passive confederates | Bystander effect holds in meta-analysis (Fischer 2011, 105 effects), weaker when danger is clear | VR replication with passive virtual bystanders reduced evacuation (Kinateder) | **Chosen next** |
| — | Door swap | Simons & Levin 1998: about half miss a person swap | Very robust | Native: swap the experimenter while an object passes between | Cheap scene, strong reveal |
| — | Anchoring | Tversky & Kahneman 1974 | Replicated at nearly every Many Labs site | Spin a wheel, then estimate | Between players: needs statistics |
| — | Framing | Tversky & Kahneman 1981 (gain/loss) | Replicated in Many Labs 1 | Neutral | Between players. Fits Stuart Chase (power of words) |
| — | Repetition = truth | Hasher 1977; meta-analysis d = 0.53 (Dechêne 2010); works even when people know better (Fazio 2015) | Robust | Posters and voices around you repeat claims | The Bernays / propaganda room |
| — | Conformity | Asch 1951 | 133 studies, 17 countries (Bond & Smith 1996) | Weaker with virtual agents: about 26–34% | Needs good NPCs |
| — | False memory | Deese–Roediger–McDermott 1995: the absent word "remembered" as often as real ones | Among the most reliable demos | Voice reads a word list | Needs the recorded voice |
| — | Leading words | Loftus & Palmer 1974 | Broad misinformation effect robust; the exact verb–speed result is under large replication now | Watch a crash, answer a question | Use the broader effect; between players |
| — | Personal space | Bailenson 2003: people keep more distance from agents that hold eye contact | Replicated in VR | Native | Simple; measured by position |
| — | Virtual hand | Rubber/virtual hand illusion; reaction to a threat to the virtual hand | Robust | Headset only (controllers) | Strong "on your skin" moment |
| — | Obedience | Milgram 1963; Burger 2009: 70% went past 150 V; VR version Slater 2006 | Replicated in reduced form | Proven in VR | Ethically heaviest: later, with care |

## Worldwide search, 07.10.2026
Seven searches: English canon, Europe, Russia/USSR/Ukraine, Asia/Latin America/Africa,
VR-native labs, behavioural economics and perception, original protocols.
Robustness marked "?" was not checked against a source yet (rule 16 before design).

| Room | Original | Robustness | VR fit / caveat |
|---|---|---|---|
| Illusion of control (booth) | Alloy & Abramson 1979, Exp. 2: 40 trials × 3 s, gaps 10–25 s (≈11 min); button, yellow and green lamps; 0–100 rating | Preregistered replication Dev et al. 2022 (242 people in zero-contingency conditions): overestimation of control holds; 75% > 25% only for trial-level predictions; depression link does not | Near-verbatim; reuses the Ono booth (one button instead of levers). Trial sequences must be generated |
| Candle problem | Duncker 1935; Glucksberg 1962 | Box-full vs box-empty effect holds; the reward effect did not | Objects and physics; time to solve |
| Choice blindness | Johansson & Hall 2005 (Science) | Replicated many times (Hall 2012: 69%) | Swap is perfect in VR; close, not literal |
| Return to interrupted task | Ovsiankina 1928 | Meta-analysis 2025: ≈67% resume vs 50% chance | Resumed or not, after how long |
| Asch without confederates | Mori & Arai 2010: polarised glasses, each sees a different line | Asch robust (Bond & Smith 1996) | Native: each player sees their own line |
| Rare-colour pen | Kim & Markus 1999 | Replication 2022 (n = 729): weaker | 1 minute; interlude between rooms |
| Fish in the aquarium | Masuda & Nisbett 2001 | Eye-tracking replication (Chua 2005) | Gaze recorded by the headset |
| Size–weight illusion | Charpentier 1891 | Robust; weaker in VR | Controller weight fixed, visible size changes |
| Uznadze set illusion (visual) | Uznadze 1930s | Robust (verbal); grasping version mixed | Visual version, answers automatic |
| Incidental memory | Zinchenko 1939 | Principle robust (levels of processing) | Sort objects by hand, surprise recall |
| Tunnel fire, passive agent | Kinateder et al. 2014 ? | ? (text not read) | Path and time automatic |
| Retrospective gambler's fallacy | Oppenheimer & Monin 2009 | Many Labs 1: replicated | Agent rolls dice |
| Door-in-the-face | Cialdini 1975 | Genschow 2021: replicated | Agent asks; yes or no |
| Autokinetic norm | Sherif 1935 | Old replications only | Dark room and a dot; illusion in a headset unverified |
| Crowd looks up | Milgram, Bickman & Berkowitz 1969 | Gallup 2012: weaker | Agents; head direction |
| Avatar perspective (dots) | Samson 2010 | Effect repeats, meaning disputed | Native |
| Change blindness (flicker) | Rensink 1997 ? | ? | Response time automatic |
| Binocular rivalry, attentional blink, Posner, Simon | classic ? | ? | Short perception rooms; need stable 90 Hz |
| Ellsberg urns, delay discounting, default effect | Ellsberg 1961; Kirby 1999; Johnson & Goldstein 2003 | ? / ? / meta d = 0.68 | Short choice rooms |

Caveats:
- **The smoke room is weaker in VR.** Kinateder & Warren 2016 (an alarm, not smoke):
  alone, 68% left the real room vs 36% in VR; with a passive neighbour, 12% vs 24%.
  The original visit took about 15 min (two-page form, then up to 6 min after
  noticing the smoke). The reveal must say this.
- **Games with "partners"** (ultimatum, trust, public goods, dictator): economics
  forbids deceiving participants, and people treat known bots differently. Only as
  labelled variants.
- **Shocking scenes** (VR Milgram, trolley, bar fight): later, with warning and debrief.
- **Need extra hardware:** Ringelmann/Ingham rope pull (force sensor), rubber hand and
  out-of-body (real touch), child body (full-body tracking).
- **Disputed:** Allais paradox, loss aversion, line-in-frame. Only with a "disputed" label.

**Count.** About 15–20 full rooms are realistic with plain WebXR and the current
engine (replicated, ≤ ~10–15 min, automatic measurement), plus 5–10 short interludes
(pen choice, perception tasks).

## Key insight: statistics make between-player experiments possible
Anchoring, framing and leading words compare **groups**: one person cannot see the
effect in themselves. With anonymous statistics each player gets a random
condition, and the reveal shows "players who saw 10 answered X, those who saw 65
answered Y, you answered Z". The game then replicates the original live, across
its players.

## Suggested order
Smoke room or illusion of control (existing booth) → Door swap → Anchoring (first room that
uses statistics) → Repetition = truth → Conformity → False memory → others.

## Notes for future rooms
- **Repetition = truth / propaganda (Bernays).** Reference example the owner chose:
  Dr Breen's "Instinct" broadcast in Half-Life 2 (Valve). Control is presented as
  liberation, a natural urge is declared the enemy, and the question "by what
  right?" is voiced and then soothed. Text: https://developer.valvesoftware.com/wiki/Dr._Wallace_Breen
  (copyrighted game script: quote briefly at most, never reproduce).
