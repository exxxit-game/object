# Original experiment ideas from East European and Global South sources

Five proposals that nobody has run, as far as this search found (a targeted search, not a
systematic review). Each builds on one card that passes `node tools/check-cards.mjs`.
Numbers from the papers are on the cards; everything else here is a proposal, not a fact.

## 1. Does the prism aftereffect follow you into your own room?
Card: `docs/cards/fernandez-ruiz-1999.md` (UNAM, Mexico City).

- **What is new.** In the original, the prisms come off and the thrower stays in the same
  real room. In VR the "prism" is a sideways rotation of the rendered view; after adapting,
  the post-test can happen in three places: the same virtual room (a replication), the
  player's real room in mixed reality with a virtual target on the real wall, or a
  different virtual room. This asks whether a recalibration learned in a virtual world
  carries over to the real-looking world — the practical question behind VR training —
  with the paper's own clean measure (the first throw after the shift and the number of
  throws back to baseline).
- **What it measures.** Horizontal error of every throw; adaptation (first minus last
  shifted throw), aftereffect (first unshifted throw) and persistence (throws to baseline)
  in each post-test context. Also the paper's claim that throws, not time, drive the effect:
  the same number of shifted throws spread over a longer time.
- **What it would take to be science.** Preregistered hypotheses; the paper's 25 / 25 / 25
  structure and shift sizes equivalent to 10, 20 and 30 diopters; random assignment to
  post-test context; a no-shift control group; a pilot to make sure virtual throwing
  physics does not itself cause misses; sample size from the pilot; report the
  adaptation–aftereffect correlation next to the paper's r = −0.978. Note that switching
  from VR to mixed reality needs a new session and a button press, so the delay must be
  logged and matched in the VR-to-VR condition.

## 2. Ghost chains: how a superstition mutates over a hundred generations
Card: `docs/cards/benvenuti-2018.md` (Universidade de São Paulo).

- **What is new.** The paper passed a confederate's "ritual" along live chains of 6–8
  people. In the game, each player first watches a replay of the previous player's hands
  and button presses in the Ono booth (a "ghost"), then plays and becomes the ghost for the
  next. Chains can run for hundreds of generations across days, which no lab can do, and
  the full 3D hand path shows how the ritual changes from generation to generation
  (cumulative cultural drift of a superstition), not only whether it survives.
- **What it measures.** Per generation: share of presses in the "points" versus "no points"
  phases (the paper's measure), the 0–10 control rating, and the similarity of each
  player's hand trajectory to the previous generation's and to the seed ritual (for
  example dynamic time warping). Survival curve of the ritual along the chain. A solo group
  without any ghost as baseline.
- **What it would take to be science.** Many independent chains per condition, with the
  chain (not the player) as the unit of analysis; random assignment of players to chain or
  solo; first a replication of the paper's chain-versus-solo contrast; conditions compared
  (3D ghost vs flat video vs written instructions) decided in a preregistration; the
  scripted seed ghost disclosed in the debrief; consent for one's own hands to be replayed
  to strangers, with no identity attached.

## 3. Uznadze's set in empty hands
Card: `docs/cards/agafonov-2016.md` (Samara University; Uznadze's Georgian paradigm).

- **What is new.** Uznadze's classic set illusion uses unequal balls in the two hands.
  On the Quest the two controllers are physically identical, so virtual spheres "held" in
  each virtual hand give a pure visual-and-body-position set with identical touch in both
  hands — the touch part of the classic illusion is removed by the hardware. Combining
  this with Agafonov's version (the size difference is irrelevant to the task, outside
  attention) and adding the control group the paper lacked.
- **What it measures.** One critical trial per player after 15 setting trials: which held
  sphere looks bigger (left / right / equal), plus a size-matching answer. Groups: no setting
  series (control); attended set (judge size); unattended set (judge colour, sizes differ
  silently); spheres held in the hands versus the same spheres lying on a table in front.
- **What it would take to be science.** Preregistration; the control group; side of the big
  sphere randomised; because each player gives one critical answer, large samples through
  the game's anonymous statistics; contrast, assimilation and "equal" compared with a
  multinomial test against the control group; the result reported next to the Uznadze
  table and the 58% contrast share in the card.

## 4. Your reading direction in your fingertip: line bisection, near and far, real and virtual
Card: `docs/cards/muayqil-2021.md` (King Saud University, Riyadh).

- **What is new.** One standard home task across cultures: players who first learned a
  right-to-left script (Arabic, Persian, Hebrew, Urdu) and left-to-right readers bisect the
  same lines (a) on their own real table in mixed reality with a fingertip, as with pen and
  paper, and (b) on a far wall with a pointing ray, in mixed reality and in VR. The paper
  compared two groups on paper only; whether the cultural shift holds in far space and in a
  virtual world is open.
- **What it measures.** Percent deviation score per line, as in the paper (lines 6, 12 and
  18 cm, each hand); factors: reading direction, near/far, mixed reality/VR, hand, line
  length and position.
- **What it would take to be science.** A precision test of hand tracking first (the effect
  is about 1% of the half-line, so measurement error must be far smaller); preregistered
  mixed-effects model; only reading direction and handedness asked, never ethnicity or
  religion; minimum group sizes from the paper's d = 0.42; a null result reported as such.

## 5. Deliberating crowds without faces
Card: `docs/cards/navajas-2018.md` (Universidad Torcuato Di Tella, Buenos Aires).

- **What is new.** In the paper, groups of five talked face to face. In the game, five
  remote players deliberate as avatars with voice and head and hand movement but no faces
  or eye contact (Quest 3 has no eye tracking). Does "four debates beat thousands" survive
  faceless, embodied deliberation? And does mixing countries inside the crowd of groups
  raise the between-group diversity that the paper found drives the gain?
- **What it measures.** The paper's normalised error for averages of m group answers versus
  n first answers; within- and between-group variance before and after discussion.
  Conditions: avatars with voice (VR); voice only (desktop players); no discussion (a second
  individual guess only, the paper's control, below 3% gain); groups from one country
  versus mixed countries.
- **What it would take to be science.** The paper's question set plus fresh questions (to
  prevent looking answers up); preregistration; random assignment of groups to conditions;
  the group as the unit; enough groups for the comparison (the lab replication in the paper
  used 20 groups of five); moderation and no recording of voice.
