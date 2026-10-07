# Experiment ideas from German, French, Italian, Spanish and Scandinavian sources

Five proposals, each built on one experiment card that passes `node tools/check-cards.mjs`.
"Nobody has run it" means only: not found in a quick web search on 2026-10-07 (searches named
under each idea). That claim must be searched again, properly, before any of these is
preregistered.

What every proposal needs before its result can be called science:
- **Ethics review** before collecting data from anyone other than the owner; consent shown in
  the headset; a stop button at every moment.
- **Privacy**: no camera frames (the Quest Browser gives none), no raw voice stored, anonymous
  results only; for two-player rooms, nothing that identifies the partner.
- **Preregistration** (for example on OSF): hypotheses, one primary measure, exclusion rules,
  sample size from a power analysis, analysis plan.
- **Manipulation check**: the original effect on the card must reappear in the same sample in
  the condition closest to the original; if it does not, the new comparison is not interpreted.
- **Timing and tracking validation** on the owner's Quest 3 for every angle, distance or
  reaction-time measure (hand-tracking noise, frame timing).
- Every result is reported, including null results.

## 1. Does seeing your arm brake the arm that floats by itself? Kohnstamm in passthrough vs VR

Built on `docs/cards/kohnstamm-1915.md`.

- **What is new.** Kohnstamm (1915) and his replicators watched their own real arm rise. Nobody
  has put the involuntary rise under controlled visual feedback in VR: the player pushes their
  real wall in passthrough, then on release sees (a) their real arm (passthrough), (b) a virtual
  arm that copies the real one, (c) a virtual arm that stays down while the real arm rises, or
  (d) a virtual arm that rises faster than the real one. A mirror version (a French lab, Brun
  et al. 2015, Neuroscience, HAL hal-01419386, read but not carded) found that a mirror image of
  the other, passively moved arm did not change the speed of the involuntary movement; a seen arm that contradicts the real one is a stronger test. Search:
  "Kohnstamm phenomenon virtual reality visual feedback" found avatar studies of voluntary
  movement but no Kohnstamm study with a manipulated seen arm.
- **What it measures.** Real arm angle from hand tracking (latency, peak angle, time to peak,
  fall), and a one-line rating of "the arm moved by itself" after each trial.
- **Predictions.** Condition (a) or (b) reproduces the 1915 rise (manipulation check). If the
  rise is driven only by the muscles and spinal/subcortical circuits, (c) and (d) leave the real
  peak angle unchanged; if vision feeds into it, (c) lowers and (d) raises it. The feeling of
  "a mysterious force" may change even if the angle does not.
- **To call it science.** Within-person design with condition order counterbalanced; the 1915
  reports say the effect weakens with practice (Schuster: "only the first time"), so the first
  trial must be analysed separately and practice effects modelled. Primary measure: peak angle.
  Push length fixed (for example 30 s) and optional for players with shoulder problems.

## 2. Aubert's door, opened in mixed reality: is a virtual room as good as the real one at keeping "up"?

Built on `docs/cards/aubert-1861.md`.

- **What is new.** Aubert found the tilted-head illusion only in a dark room; opening the door
  so the furniture was visible abolished it within seconds. The Quest can reproduce his door
  inside one mixed-reality session and add what he could not: the same line seen (a) in
  darkness, (b) in the player's real room through passthrough, (c) in a carefully matched
  virtual copy of a room, and (d) in that virtual room tilted by 10°. Studies of the vertical
  in headsets exist (a French lab found large errors with a head-fixed frame, HAL hal-01436156,
  not read), but the search "subjective visual vertical head tilt mixed reality passthrough
  versus virtual room" found no comparison of the real room seen through passthrough with a
  virtual room at matched head tilt.
- **What it measures.** The line angle the player sets as vertical, against head roll from the
  headset, for 2–3 head tilts within the reachable neck range (about 20–40°).
- **Predictions.** (a) shows an error that grows with tilt (manipulation check); (b) removes it,
  as Aubert's open door did; the new question is whether (c) removes it as fully as (b), and
  whether (d) pulls the vertical towards the tilted virtual room more or less than a real frame
  would.
- **To call it science.** Within-person, conditions counterbalanced; a seated version to avoid
  falls; preregister the (a)–(c) difference as primary. The headset's own glow in "darkness"
  must be measured and reported, since it may act as a weak frame.

## 3. Is the handshake needed? Body swap between two players with real touch, vibration or no touch

Built on `docs/cards/petkova-2008.md`.

- **What is new.** Petkova and Ehrsson concluded that, in the handshake swap, the visual
  first-person perspective was the critical factor, while synchronous touch only strengthened
  it. Two-player avatar swaps in mixed reality have now been run (He, Rooney & McDonnell 2025,
  arXiv 2509.09815, measured with a joint Simon task; not read in full), but a direct test of
  the touch question is missing: two players see the scene from each other's tracked head and
  (a) shake real hands in the same room, (b) are in different rooms and squeeze a controller
  that vibrates when the partner squeezes, (c) are in different rooms with no touch at all.
- **What it measures.** The Exp. 1 questionnaire statements of the card after each 2-minute
  period, and a behavioural index the paper lacked on the Quest: how far each hand withdraws
  when a virtual knife approaches the partner's hand (the "new body") versus one's own.
- **Predictions.** If perspective dominates, ownership ratings stay high in (b) and (c);
  if touch is needed, (a) > (b) > (c). Synchronous versus alternating squeezing (the paper's
  control) is the manipulation check within (a).
- **To call it science.** Needs two headsets per session and a shared coordinate frame for (a);
  latency of the streamed head and hand poses measured and reported. Preregister the
  questionnaire ownership score as primary and the withdrawal measure as secondary (new, to be
  validated). Ethics: the swap can feel uncanny; strangers paired over the network must not see
  each other's identity.

## 4. Are good readers of intention also easy to read? A crowd version of pour-or-drink

Built on `docs/cards/cavallo-2016.md`.

- **What is new.** Cavallo et al. had 17 actors and separate observers, and found observers at
  chance on the full set of movements, above chance only on selected ones. In the game every
  player is both: first they reach for a real bottle on their own table (mixed reality, hand
  tracking) with a hidden instruction, then they judge other players' reaches replayed as avatar
  hands, cut at contact. This gives, per player, how readable their own movements are and how
  well they read others, so the relation between the two can be tested on hundreds of people.
  Related work links one's own movement style to judging others' affective states (Edey et al.
  2017, not read); the search "intention reading from movement kinematics own movement
  readability correlates with reading others" found nothing on grasp intention.
- **What it measures.** Readers' AUC (drink vs pour with confidence, as in the card); actors'
  readability (how often others decoded them); wrist-height difference between each actor's
  pour and drink reaches.
- **Predictions.** Overall reading accuracy near the card's values (manipulation check: above
  chance for the reaches that show the telling wrist-height difference); the new hypothesis is
  a positive correlation between a player's own wrist-height difference and their reading
  accuracy.
- **To call it science.** Acting must be recorded before players learn what the game is about
  (the original actors were naive). Preregister the correlation and its sample size; show each
  reader a balanced, random sample of other players' reaches; check hand-tracking precision of
  wrist height against a ruler.

## 5. "Did I do that, or did my partner?" Doing, watching and false memories in a two-player room

Built on `docs/cards/schult-2014.md`.

- **What is new.** Schult et al. had one partner act out phrases and the other watch, and found
  a recognition advantage for the actor. A related German finding (Lindner et al. 2010,
  "observation inflation", not carded) is that watching someone perform an action can create a
  false memory of having done it oneself; the only VR study found used recorded avatars
  with children (Segovia & Bailenson 2009, not read). The two-player room can alternate the roles phrase by phrase and then ask, for each
  phrase, "did you do it, did your partner, or was it not in the list?", with the partner either
  (a) in the same room seen through passthrough or (b) remote, seen as an avatar driven by their
  tracked hands. Search: "observation inflation virtual reality avatar" found the children's
  study but no adult live-partner comparison.
- **What it measures.** Old/new recognition per role (manipulation check: actor > watcher, as on
  the card) and source errors: phrases the partner performed that a player claims they performed
  themselves.
- **Predictions.** Source errors in the "I did it" direction for watched actions; the new question
  is whether a remote avatar partner produces as many as a partner in the room.
- **To call it science.** Mixed phrase lists counterbalanced across roles; the game checks that
  the actor really moved on each phrase; preregister the source-error rate as primary; no
  deception is needed.
