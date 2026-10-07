# Experiment ideas from Japanese, Chinese and Korean sources

Five proposals, each built on one experiment card that passes `node tools/check-cards.mjs`.
"Nobody has run it" means: not found in our search of J-STAGE, Acta Psychologica Sinica,
KoreaScience and the open web on 2026-10-07. That claim must be searched again, properly,
before any of these is preregistered.

What every proposal needs before its result can be called science:
- **Ethics review** by an ethics committee before collecting data from anyone other than the
  owner; informed consent shown in the headset; the right to stop at any moment.
- **Privacy**: no camera frames (the Quest Browser does not give them anyway), no raw voice,
  anonymous results only.
- **Preregistration** (for example on OSF) before data collection: hypotheses, the one
  primary measure, exclusion rules, sample size from a power analysis, and the analysis.
- **Manipulation check**: the original effect from the card must reappear in the same sample;
  if it does not, the new comparison is not interpreted.
- **Timing validation** on the owner's Quest 3 for any reaction-time or vibration measure.
- Report every result, including null results.

## 1. Whose footsteps are behind me? Personal space for a live person vs a recording, in your own room vs a copy

Built on `docs/cards/tanaka-1973.md`.

- **What is new.** Tanaka measured the shape of personal space with one real stranger in a
  lab. Two things he could not separate: (a) whether the approacher is a *live* person (another
  player's avatar moving in real time) or the *same motion recorded*; (b) whether it happens in
  the player's own room (mixed reality) or in a VR copy of it. Tanaka also wrote that a
  left–right asymmetry could only be found by collecting many measurements from one person —
  a game can do that across sessions.
- **What it measures.** Stop distance in 8 directions while being approached (standing tier);
  head yaw to check the "face forward" rule; for returning players, the left–right difference
  across sessions.
- **Predictions.** Front > diagonal > side/back (manipulation check); back distances larger in
  the dark; the live-vs-recorded and room-vs-copy contrasts are the new questions.
- **To call it science.** Preregister the back-zone distance as the primary measure. Players
  must not be told a recording is live unless an ethics committee approves deception with a
  debrief; the simplest honest design says "some approachers are recordings". Being approached
  from behind can be unpleasant: a stop button at all times.

## 2. Does the body still update the room in passthrough? Spatial updating in mixed reality vs VR

Built on `docs/cards/liu-2016.md`.

- **What is new.** Liu et al. suggest that Kelly's earlier failure in a VR "new room" came from
  the VR scene itself. The direct test is missing: the same 8 objects learned in the player's
  real room through passthrough, versus in a VR copy of that room, then a black screen, a 90°
  turn and pointing. A second step turns the "new room" condition into a switch from the
  passthrough room to a VR room (the session switch is a natural doorway).
- **What it measures.** Reaction time and absolute pointing error for the three imagined
  headings; the sensorimotor alignment effect (misaligned minus body-aligned) per condition.
- **To call it science.** Within-person design with counterbalanced order; power from Exp. 1
  of the card (likely an overestimate, so plan conservatively); preregistered primary measure
  (reaction-time alignment effect). Ethics: standing blind in a home needs the guardian on and
  a clear floor.

## 3. Crossed in the flesh, uncrossed on screen: seen vs felt hand position in the crossed-hands illusion

Built on `docs/cards/moharramipour-2022.md`.

- **What is new.** The original is done with eyes closed. In VR the hands the player sees can be
  separated from the hands they feel: real arms crossed while the virtual hands are drawn
  uncrossed, and the reverse, while the two controllers vibrate in turn. (Rubber-hand or mirror
  versions of this may exist in the literature; that must be checked before claiming novelty.)
  Second, a home test–retest of each player's "reversal value" over weeks, with far more people
  than the 24 in the thesis.
- **What it measures.** Reversal value (0 = none, 1 = complete) for real posture × seen posture,
  within each player.
- **To call it science.** First measure controller vibration onset timing on the headset with
  an external sensor; if the jitter is too large for short intervals, preregister only the long
  intervals (200–900 ms), where the reversal is still strong in the thesis. Directional
  hypothesis: seeing uncrossed hands reduces the reversal. Ethics: minimal.

## 4. Same headset, real room vs its copy: is passthrough seen like reality or like VR?

Built on `docs/cards/jin-2021.md`.

- **What is new.** Jin et al. ask future work to give the real condition the same headset size
  and weight, and to use a measure other than imagined walking. Quest 3 does both: the real room
  through passthrough and its VR copy are seen through the same device, and the headset can
  track blind walking directly. The open question is where camera passthrough falls: with
  reality, with VR, or in between.
- **What it measures.** Distance walked blind to a remembered target, and timed imagined
  walking, under the paper's three field-of-view apertures, in passthrough vs VR copy.
- **To call it science.** This is a new design, not a copy of the card: home rooms rarely allow
  the original 3–5 m targets, so the target distances must be fixed in the preregistration and
  the room offered only to players with that much clear floor. Ethics: blind walking at home
  needs the guardian, a cleared path and an automatic stop near the boundary.

## 5. A real partner instead of a recording: the social Simon effect with live players

Built on `docs/cards/li-2025.md`.

- **What is new.** Li et al. used a pre-recorded partner presented as a live remote player. The
  game can pair two real players with no deception, and compare: two people in the same real room
  seen through passthrough, a remote full-body avatar, a remote invisible partner, and alone.
  Whether the effect needs the partner to be real (and visible as a real body) is the question.
- **What it measures.** The compatibility effect in reaction time (incompatible minus compatible
  trials) per condition.
- **To call it science.** Validate button timestamp resolution in the Quest Browser first — the
  card's effect is about 14 ms. Power analysis from the card (full-body d ≈ 0.55) with hundreds
  of trials per player; preregistered primary contrast (real partner in the same room vs real
  partner as a remote avatar), with "alone" as the manipulation check.
  Ethics: strangers paired online need moderation and no open voice channel without consent.
