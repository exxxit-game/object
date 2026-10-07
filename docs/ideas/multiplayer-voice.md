# Multiplayer and voice: five experiment proposals

Proposals only, not rooms. Each one builds on a card that passes `node tools/check-cards.mjs`.
"Not run before" means: not in the card's paper, and not known to us. That is not a
literature search. Before anyone calls a proposal new, it needs a proper search (Google
Scholar, PsyArXiv, OSF registries) for the same manipulation.

Voice rules for every proposal (some proposals add their own):
- The microphone is opt-in, asked in the headset with a plain reason. Saying no gives a
  non-voice version or a polite exit, never a penalty.
- Live voice between players is streamed only while the room runs and is never recorded
  on the server.
- Any voice measure (speaking time, word onsets, loudness) is computed on the player's
  headset. Only numbers leave it, never audio or transcripts.
- The player's own audio, kept on the headset for a reveal, is deleted when the reveal
  ends.
- No voice is ever shown with a name, a country or an avatar that lets other players
  identify the speaker outside the game.

---

## 1. Mixed-nation groups in the punishment game

Built on `docs/cards/herrmann-2008.md`.

- **What is new.** Herrmann, Thöni and Gächter ran the same public goods game with
  punishment in 16 cities, but every group came from one city. Here groups of four form
  live from players in different countries in the same session. Some groups are mixed
  (four countries) and some come from one country. Players see only "a player from
  another country" or "a player from your country", never which country.
- **What it measures.** For each period: contributions, punishment points, and
  antisocial punishment (punishing someone who gave at least as much as you), all logged
  automatically. The question: is antisocial punishment set by where the punisher comes
  from (the paper's "society" account), or by the group being mixed?
- **Live players.** 4 at once per group, for 10 periods (about 10–15 minutes with timers).
- **Voice.** Off. The original banned all communication, and voice would also reveal the
  country.
- **What it would take to be science.** A pre-registered plan where the group is the
  unit (the paper used group averages as independent observations), with a power analysis
  in groups, not players. A homogeneous-group condition as the benchmark: it should show
  antisocial punishment in every pool, as the paper did. Points instead of money must be
  reported as a deviation. Players are self-selected gamers, not matched undergraduates,
  so country differences in the game cannot be read as country differences in the world.
  Only the within-game contrast (mixed vs one-country groups, randomly assigned) is clean.
  Also needed: a pre-registered rule for players who leave mid-game, and ethics approval
  for recording country.

## 2. Speaking, not typing: the reference game in VR, between languages

Built on `docs/cards/hawkins-2020.md`.

- **What is new.** Hawkins, Frank and Goodman replicated the classic shortening of
  descriptions with typed chat and noted that the text interface probably reduced word
  counts compared with speech. This proposal brings back speech (as in the classic spoken
  studies) inside a shared virtual table. It adds one factor: pairs who share a native
  language vs pairs who talk in a common second language (for example English between a
  Japanese and a Brazilian player). Do conventions form more slowly, or end up shorter,
  in a second language?
- **What it measures.** Per figure and round: the director's speaking time (voice
  activity on the headset, no words), the number of speaking turns, the matcher's
  accuracy and response time. The reveal shows the pair their own speaking-time curve.
  Recordings of their first and last description are played only on their own headsets,
  and only if both players agree.
- **Live players.** 2 at once, for 4 blocks of 12 figures (a shortened version, reported
  as such).
- **Voice.** Live between the two players only; speaking time computed on the headset; no
  transcripts. The optional first/last recordings stay on the headsets and are deleted
  after the reveal.
- **What it would take to be science.** First replicate the reduction curve with
  same-language pairs, as a benchmark against the paper's text-based curve. Pre-register
  the second-language hypothesis, the shortened design, and exclusions for disconnects
  (the paper lost 33 of its cued games to disconnection or server errors). Measure
  language background with a short validated self-report. Speaking time is a proxy for
  word count, so validate it once against hand-counted words on a consented pilot sample.

## 3. How much delay can two people improvise through? The mirror game with added lag

Built on `docs/cards/noy-2011.md`.

- **What is new.** In the mirror game, many of the two players' stops matched within
  40 ms, too fast for vision alone. A networked game adds delay anyway. Here two players
  in the same room (same local network, so the base delay is small and measured) each see
  the other's avatar hand. The game adds a hidden extra delay (for example 0, 50, 100 or
  200 ms) in random order across rounds. The proposal finds the delay at which
  leaderless improvisation turns into leader-following, marked by the 2–3 Hz "follower
  jitter" in the paper.
- **What it measures.** Hand position every frame: velocity error (dV), stop timing (dT),
  jitter in the 2–3 Hz band, and smooth "co-confident" stretches, all as in the paper and
  all automatic. After each round: "who led?", to compare felt leadership with measured
  jitter.
- **Live players.** 2 at once (about 12–15 minutes, 9–12 one-minute rounds).
- **Voice.** Off during rounds, so the players coordinate by sight only, as in the paper.
- **What it would take to be science.** A within-pair design with pre-registered delay
  levels and order, and players blind to the delay. A manipulation check (can players tell
  which rounds were delayed?). The 0 ms rounds as a benchmark against the paper's
  leader-follower vs joint numbers, expecting novices to look like the paper's novices. The
  device delay of the headsets (motion to photon) measured and reported. Enough pairs from
  a power analysis on the jitter difference.

## 4. Chanting together across the internet: does felt synchrony or real synchrony matter?

Built on `docs/cards/reddish-2013.md`.

- **What is new.** Reddish, Fischer and Bulbulia found that groups of three who chanted
  words in unison chose the risky cooperative option more often (62%) than groups who
  chanted in turn (21%), in a sample of 27. Over the internet, each player hears the
  others late. This proposal compares three conditions across groups: (a) unison with
  the other voices played as they arrive, so the chant sounds ragged; (b) unison where
  each headset delays and aligns the other voices to a shared beat, so the chant sounds
  together even though it was not quite; (c) chanting in turn. If cooperation follows (b)
  more than (a), what matters is synchrony as heard, not as produced.
- **What it measures.** The onset time of each spoken word (computed on each headset from
  the microphone; only times are sent). The real asynchrony between players, rated
  perceived synchrony, and the stag-hunt choice (a sure 7 points, or 10 only if all three
  choose it), all automatic.
- **Live players.** 3 at once (6 minutes of chanting, then one decision and a short
  questionnaire: about 10 minutes).
- **Voice.** Live during the chant only. Word onsets computed on the headset. No
  recordings. The word list is neutral one-syllable words, as in the paper, so nobody says
  anything personal.
- **What it would take to be science.** Pre-registration, and a sample far larger than
  the original 27 (the group is the unit). A direct replication of the paper's unison vs
  in-turn contrast (conditions a or b vs c) before reading anything into a vs b. The
  network delay of every group logged. Points instead of money reported as a deviation. A
  movement-only version for players who decline the microphone, analysed separately.

## 5. Colour teams vs real countries in one 14-player arena

Built on `docs/cards/durrheim-2016.md`.

- **What is new.** Durrheim and colleagues let 14 real players give tokens to each other
  for 40 rounds, in minimal (colour) groups or with no visible groups, all students at one
  South African university. Here 14 players from several countries share one arena.
  Groups are drawn either by an arbitrary colour (the minimal group) or by real country
  (players from two countries, seven each). Both run in the same game software. Does a
  real national line produce more, less, or differently timed ingroup giving than a
  meaningless colour, when people actually interact?
- **What it measures.** Every gift (to ingroup, outgroup or self) in every round, over 40
  rounds, logged automatically. Ingroup favoritism over time, as in the paper (5 waves of
  8 rounds). How fast reciprocity across the line builds or collapses.
- **Live players.** 14 at once for about 15–20 minutes. It suits a scheduled event, not
  drop-in play.
- **Voice.** Off. Voice would reveal accent, and with it country, in the colour condition.
- **What it would take to be science.** The paper's design (colour groups vs no groups) as
  a benchmark inside the same event. Random assignment of events to condition; the game,
  not the player, is the unit, so many games are needed (the paper ran 72 in Study 1).
  Country is collected with consent and kept coarse. A pre-registered rule for dropouts
  (a 14-player game with one leaver changes the group sizes). The paper's cover story
  (painting taste) is a mild deception, so a debrief is required, or an honest
  random-draw label used and reported.
