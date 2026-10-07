# Methodology: running rooms the way experimental psychologists run studies

Each room is a replication of a published study. These are the practices it
follows, with the reason and the concrete implementation.

| Practice | Why | In the game |
|---|---|---|
| **Standardized protocol** (Brandt et al. 2014, Replication Recipe) | Differences in results must not come from differences in procedure | Same recorded instruction and timings for everyone; `ROOM_VERSION` in every stored result; a table of every deviation from the original (below) |
| **Preregistration** (OSF; Simons 2014, Registered Replication Reports) | Hypotheses, outcome, sample, exclusions and analysis fixed before data | Before data counts as science: publish on OSF the operational definition of the outcome, sample size, exclusion rules, analysis script |
| **Funnel debriefing / suspicion probe** (Blackhart et al. 2012) | People hide suspicion and prior knowledge; it changes results | After the session and before the reveal: general to specific questions ("what was studied?", "anything odd?", "did you know this experiment?"); suspicion is analysed as a moderator, excluded only by a preregistered rule |
| **Technical quality / exclusions** (Meade & Craig 2012) | Hidden tabs, very short sessions and repeat players distort data | Log pauses (tab hidden, headset menu) with durations; session length; first vs repeat run |
| **Random assignment, recorded** | The condition must come from a generator, not a choice | Condition drawn at start (block randomization), stored with the result, as Ono assigned schedules (5 per schedule, p. 263) |
| **Raw data + derived measures, data dictionary** (FAIR, Wilkinson et al. 2016; APA JARS) | Others must be able to re-analyse | Store the raw event stream (ms timestamps) next to the derived report; publish the codebook and the analysis script |
| **Sample size** (Brandt et al. 2014: about 2.5× the original; Simonsohn 2015 "small telescopes") | Replications need more participants than the original | At least 50 analysed participants for room 01 (original n = 20); pilot data (5–10) used only for debugging, never analysed |
| **VR reporting** (Kennedy et al. 1993 SSQ) | Reviewers expect sickness, presence and hardware | Log device, browser, mode (headset / screen), frame rate; optional short sickness check |

## Room 01: deviations from Ono (1987)
Listed openly in the reveal and in the preregistration.
- Online VR instead of a lab booth; participants are not screened students.
- Two rounds of 2 minutes with a question between, instead of one 40-minute session.
- Points every 2.5–8 s (much more often than 30/60 s schedules).
- The experimenter praises and prods; the original only played a taped instruction.

Sources: Brandt et al. 2014 (Replication Recipe); Simons 2014; Blackhart et al. 2012
(doi:10.3758/s13428-011-0132-6); Meade & Craig 2012; Wilkinson et al. 2016 (FAIR);
Appelbaum et al. 2018 (APA JARS); Simonsohn 2015; Kennedy et al. 1993 (SSQ).
