# Room 01: Illusion of control (Alloy & Abramson 1979, Experiment 2)

Source read in full: Alloy, L. B., & Abramson, L. Y. (1979). Judgment of contingency
in depressed and nondepressed students: Sadder but wiser? *JEP: General, 108*(4),
441–485. Page numbers below are journal pages. Facts are also in `docs/sources.md`.
Every number here lives in code only in `src/rooms/01-control/protocol.js`, and
`tests/control-protocol.test.mjs` fails if it drifts from this file.

## What the participant does (original)
| Element | Original | Page |
|---|---|---|
| Apparatus | Black stand 23×23 cm, yellow and green light 5 cm from its top, facing the subject; black box 15.5×7.5×4 cm, spring button in the centre | 450 |
| Room | Subject alone, observed through a one-way mirror from the next room | 450 |
| Trial | Yellow light = start; press once within 3 s or do nothing; at the end of the 3 s the green light comes on or not | 451 |
| Trials | 40 | 451 |
| Intertrial interval | 10–25 s, mean 14 s | 451 |
| Outcome schedule | Two punched tapes: one read on press trials, one on no-press trials | 450 |
| Conditions (Exp. 2) | 25-25 or 75-75: green on 25% or 75% of trials, whether or not you press. Random assignment | 457–458 |
| Instructions | Learn how much control you have; 3 s rule; four possibilities; sample both responses; control concept explained | 451–452 |
| Experimenter | Leaves during the 40 trials; returns and rereads the control concept | 452 |
| Measures, in order | Judgment of Control 0–100 step 5 (No / Intermediate / Complete Control); Total reinforcement %; Reinforcement if press %; if not press % | 449–451 |
| Post-questionnaire | Certainty of the control judgment; two open questions on evidence; complex hypotheses used? | 449–450 |
| Money task | 10 more trials, 25 cents per green light | 452 |
| Debrief | Careful debriefing | 452 |

## Results to compare with (Table 5, p. 459; text p. 461)
Mean judged control (SD): non-depressed men 20.0 (26.7) in 25-25, 30.3 (12.8) in 75-75;
non-depressed women 7.5 (14.5) and 51.4 (29.8); depressed men 13.8 (12.7) and 21.2 (28.5);
depressed women 17.1 (23.7) and 13.1 (13.6). n = 8 per cell.
Said "zero control": 25-25 — 50% of both groups; 75-75 — 50% depressed, 6% non-depressed (p. 461).
Replication (Dev, Moore, Johnson & Garrett 2022, preregistered, Table 1): end-of-task control
in zero contingency — 25%: 27.64 (MTurk, n = 83) and 18.15 (students, n = 40); 75%: 34.23 (n = 77)
and 36.83 (n = 42). Overestimation of control replicated; the depression link did **not**.

## Our room: deviations (each is said in the reveal or in docs only, as marked)
| # | Deviation | Why | Told to player |
|---|---|---|---|
| 1 | No depression screening (BDI/MAACL) | Health data; not needed for the main effect, and the depression link failed replication | Yes |
| 2 | Money task removed | No real money; null result in Exp. 2 (p. 460) | Yes |
| 3 | Instructions paraphrased in Russian, all elements kept | Copyright; translation | No (docs) |
| 4 | "Any questions?" → buttons "Понятно" / "Повторить" | No live experimenter | No (docs) |
| 5 | Experimenter is a recorded voice and a wall screen with the same text | VR; hearing access | No (docs) |
| 6 | Open questions → choices taken from the participants' answers quoted on p. 461 | Typing in a headset | Yes |
| 7 | Gender asked at the end, "prefer not to say" allowed | Main result differs by sex | — |
| 8 | Prior knowledge asked at the end ("did you know this experiment?") | Standard for online replications | — |
| 9 | Players are not Penn students in 1979 | — | Yes |

## Not in the paper: our choices (owner may change)
| Item | Our value | Reason |
|---|---|---|
| Tape content | Blocks of 4 with exactly 1 (25%) or 3 (75%) green, shuffled within block | Keeps actual rate near nominal at any number of presses (p. 450 fn. 2: actual control "deviated only slightly or not at all") |
| Tape advance | A tape moves on only when its response happens | One reader per response (p. 450) |
| Interval distribution | 39 values, 0.1 s steps, all 10–25 s, mean exactly 14 s, skewed toward 10 | Only range and mean are given |
| Green light duration | 2 s | Not given |
| Yellow light | On for the 3 s window, then off | Not given |
| Press outside the window | Logged as "stray", no effect | Instruction: press once, right after yellow |
| Second press in a window | Logged, no effect | "once and only once" |
| Headset menu / tab hidden during a trial | Trial voided, tapes not moved, repeated after return | A trial the player could not see is not a trial |
| Certainty scale | 0–100 step 5 | Format not given |

## Flow and states (`<html data-room-state>`)
`idle` (consent) → `intro` (instructions, Понятно/Повторить) → `run` (40 trials, experimenter out)
→ `questions` (control concept reread, 4 scales, certainty, evidence, hypotheses, gender, prior knowledge)
→ `done` (reveal: what you did → the truth → original → replication → differences).

## Data sent (only with consent, only at full speed, only after the privacy page exists)
condition, presses, greens per response, actual Δp, the 4 judgments, certainty, evidence choice,
hypotheses, gender, prior knowledge, voided trials, seated, first/repeat. No log of raw times.
