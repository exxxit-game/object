# Experiment selection

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

## Candidates
| # | Room | Original | Robustness | VR fit | Note |
|---|---|---|---|---|---|
| 01 | Superstition | Ono 1987 | Moderate: only 3 of 20 in the original | Good | Built. Reveal already says "3 of 20" honestly |
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

## Key insight: statistics make between-player experiments possible
Anchoring, framing and leading words compare **groups**: one person cannot see the
effect in themselves. With anonymous statistics each player gets a random
condition, and the reveal shows "players who saw 10 answered X, those who saw 65
answered Y, you answered Z". The game then replicates the original live, across
its players.

## Suggested order
01 Superstition (built) → 02 Smoke room → Door swap → Anchoring (first room that
uses statistics) → Repetition = truth → Conformity → False memory → others.

## Notes for future rooms
- **Repetition = truth / propaganda (Bernays).** Reference example the owner chose:
  Dr Breen's "Instinct" broadcast in Half-Life 2 (Valve). Control is presented as
  liberation, a natural urge is declared the enemy, and the question "by what
  right?" is voiced and then soothed. Text: https://developer.valvesoftware.com/wiki/Dr._Wallace_Breen
  (copyrighted game script: quote briefly at most, never reproduce).
