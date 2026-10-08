# 05 — How great VR creates "wow", presence and memorable first minutes

Researcher 5 of 6. Area: what the makers of great VR say they did (talks, postmortems, developer
commentary, interviews) and what research says about presence, body illusions, awe, curiosity,
attention guidance, onboarding and escape-room design. Last part: what fits rooms that recreate real
experiments without changing the science.

How to read an item:
**Technique / finding** — Source — verified — Key line — For us.

- "verified yes" = I opened the source in this session and read it (in full unless a scope is named).
  "via X" = I read it only through another source X that I did read. "no" = could not open.
- "Key line" is a close paraphrase with its location (node, section, page or timestamp), not a verbatim
  quote: copyright rules allow me at most one short verbatim quote per answer, so the wording is
  given by location for checking. The papers are saved in `C:\Users\admin\Documents\objekt-papers\`.
- Developer statements are what the makers report from playtests, not controlled studies; research
  items give sample sizes so their weight is visible.

What the project already holds (checked in `docs/decisions.md`, not repeated here): West 2015 (people
look around for the first 10 s), Meta comfort/looming/hand-UI guidance, Ball & Tronick 1971, the
world-fixed clipboard studies (Alexandrovsky 2020, Küntzer 2026, Regal 2019), locomotion sources.
Where my findings confirm or challenge those decisions, the "For us" line says so.

---

## 1. Presence and plausibility (the base everything else stands on)

- **Presence has two parts: Place Illusion (being there) and Plausibility (this is really happening);
  people react as if real only when both hold** — Slater M., "Place illusion and plausibility can lead
  to realistic behaviour in immersive virtual environments", Phil. Trans. R. Soc. B 364:3549–3557, 2009,
  doi:10.1098/rstb.2009.0138 (postprint https://hdl.handle.net/2445/53086) — verified yes (full) —
  Key line (abstract): PI is set by the sensorimotor contingencies the system supports; Psi by events
  that relate to the participant and by the credibility of the scenario — For us: a good Quest 3 gives
  PI for free; our work is Psi: the lab and the experimenter must behave as a real lab would.

- **Plausibility comes mainly from events you did not cause that refer to you (a character looks at
  you, steps back when you approach)** — Slater 2009, §5 — verified yes — Key line (§5): a key component
  of Psi is that events outside your control refer directly to you — For us: the experimenter's voice
  and the room should react to what the player does (looks at the board, walks away, takes the sheet),
  not run a fixed script.

- **A break in Place Illusion recovers; a break in Plausibility usually does not** — Slater 2009 §7;
  restated in Slater M., Banakou D., Beacco A., Gallego J., Macia-Varela F., Oliva R., "A Separate
  Reality: An Update on Place Illusion and Plausibility in Virtual Reality", Front. Virtual Real. 3:914392,
  2022, doi:10.3389/frvir.2022.914392 — verified yes (full) — Key line (2022, "Place Illusion and
  Plausibility"): once participants realise a virtual human is unaware of them, they lose interest and
  move on (citing Garau et al. 2004) — For us: one moment where the experimenter ignores the player can
  cost the whole room; test every branch where the player does the "wrong" thing.

- **Place Illusion is the default in a good HMD; Plausibility has to be designed. Its three sources:
  the world reacts to your actions, refers to you unprompted, and matches what you expect of such a
  place** — Slater et al. 2022, sections "Place Illusion and Plausibility" and "Coherence" — verified yes
  — Key line: PI might occur by default, but Psi has to be deliberately designed — For us: write down,
  per room, how the room reacts, how it addresses the player, and what a 1979 lab visitor would expect.

- **Expectations are personal: one detail that contradicts what someone knows breaks it for them (a
  1980s concert crowd without smokers; a soccer fight in a bar soccer fans would never visit), while
  fantastic rules are accepted if consistent (a whale between buildings; chess pieces that fly)** —
  Slater et al. 2022, "The Illusions of VR" — verified yes — Key line: one participant said that in
  this world that is simply the way things are — For us: confirms the project's ".com did not exist in
  1979" rule; consistency matters more than realism.

- **Rendering quality alone did not change fear at a virtual pit; shadows and reflections that moved
  with the participant's body did raise arousal** — Slater 2009 §5 (citing Zimmons & Panter 2003 and
  Slater et al. 2009) — verified via Slater 2009 — Key line: varying rendering realism made no
  difference; body-correlated shadows and reflections did — For us: spend effort on things that move
  with the player (shadow, reflection, sound of their steps), not on texture detail.

- **Questionnaires can create the feeling they ask about** — Slater et al. 2022, "Questionnaires" —
  verified yes — Key line: an invented "colourfulness of your day" scale correlated like presence
  items do — For us: never ask "did you feel X?" before a room's measure; ask after, or measure
  behaviour.

- **Passive haptics raise presence; first exposure is the strongest; presence declines over repeat
  exposures but not to zero** — Meehan M., Insko B., Whitton M., Brooks F.P., "Physiological measures
  of presence in stressful virtual environments", ACM TOG 21(3):645–652, 2002 (in folder) — verified yes
  (abstract, methods, results on haptics, frame rate, order effects) — Key line: a real 1.5-inch wooden
  ledge under the virtual one raised heart-rate response (52 subjects); 30 > 20 > 15 fps; an "orienting
  effect" made the first exposure highest, and responses fell over 12 exposures without vanishing —
  For us: the first time is the wow; design replays expecting a weaker reaction, and match real
  surfaces (chair, table) where the procedure allows.

- **Presence is fragile: interpenetrating objects and characters that do not react shatter it** —
  Pausch R., Snoddy J., Taylor R., Watson S., Haseltine E., "Disney's Aladdin: First Steps Toward
  Storytelling in Virtual Reality", SIGGRAPH 1996, doi:10.1145/237170.237257 — verified yes (full) —
  Key line (Conclusions): guests said presence was destroyed when characters did not react to them —
  For us: same lesson from a 45,000-guest field test; it agrees with Slater.

- **The "Swayze Effect": feeling present but unacknowledged makes the story feel distant; one moment of
  a character noticing you fixed it** — Burdette M., "The Swayze Effect", Oculus Story Studio blog,
  2015 (archived https://web.archive.org/web/2016/https://storystudio.oculus.com/en-us/blog/the-swayze-effect/)
  — verified yes (full) — Key line: when the Hand came close and "sniffed" the viewer, reactions turned
  from ambivalence to curiosity and many leaned forward — For us: in rooms where the original procedure
  had a live experimenter, let that person acknowledge the player at least once.

- **Acknowledge the viewer, but not too much; define what the viewer is; place the camera at the
  viewer's real body height** — Lajeunesse F. & Raphaël P. (Felix & Paul Studios), Voices of VR #486,
  2016, https://voicesofvr.com/everything-we-do-is-experiential-the-many-innovations-of-felix-paul-studios/
  — verified yes (full transcript) — Key line (00:09:12): a viewer who is "just a camera" is the
  fastest way to kill presence; most shots are at sitting height — For us: seated rooms must put the
  eyes where a seated participant's eyes are; the player has a defined role (participant).

- **Presence first: anything that breaks it costs more than weak gameplay** — Schell J., "Making Great
  VR: Six Lessons Learned From I Expect You To Die", Game Developer blog, 26 June 2015,
  https://www.gamedeveloper.com/design/making-great-vr-six-lessons-learned-from-i-expect-you-to-die —
  verified yes (full) — Key line (Lesson Three): players happily toy with a world they feel present in,
  even with no gameplay — For us: the corridor can carry the first minutes on presence and small
  interactions alone.

## 2. The first 60 seconds and onboarding

- **Novices care about what there is to do, need a goal and a background story before they go in, and
  many shout "wow" within the first thirty seconds** — Pausch et al. 1996, "Novices' Experiences" —
  verified yes — Key line: guests asked "what should I be doing?" without a goal; context before
  immersion softened the abrupt transition — For us: the consent/briefing outside VR is our "pre-show";
  the clipboard gives one clear goal.

- **New VR users barely turn their heads; telling them to, after 90 s, produced an "aha"** — Pausch et
  al. 1996, "Logged Data" and "General Observations" — verified yes — Key line: 90% of guests never
  looked more than 75° to either side; pitch was even narrower — For us: anything important in the
  first minute (the light-box sign, the board) must be near the initial view or announced by sound;
  above-eye-level objects are at risk.

- **Holding players in place makes them look around; moving forward makes them look forward** —
  Schell 2015, Lesson Four — verified yes — Key line: seated in a parked car, players first examine
  what is ahead, then the glove box, then the back seat, and are startled how real it seems — For us:
  seated rooms gain this for free; put discoverable details beside and behind the player.

- **"The In": begin with one small, graspable thing that teaches looking around (a firefly), then open
  the world; give ~40 s of settling before any story cue** — Unseld S., "5 Lessons Learned While Making
  Lost", Oculus Story Studio blog, 15 July 2015 (archived
  https://web.archive.org/web/20170405000135/https://www.oculus.com/story-studio/blog/5-lessons-learned-while-making-lost/)
  — verified yes (full) — Key line (lessons 2–3): after about 40 seconds viewers were settled and
  willing to follow cues — For us: confirms the project's calm 10 s start; the sign is our "In"; the
  voice and clipboard come after.

- **Viewers missed the first minutes gazing at the moon; extending the opening by one minute helped** —
  Burdette 2015 (Swayze Effect) — verified yes — Key line: the opening sequence was extended by a
  minute so viewers could absorb the surroundings — For us: never put the room's instruction in the
  first seconds after a scene change.

- **The first map took two years of playtests to decide what to tell and where; information has
  priorities and every extra item can hide the important one** — Valve, Half-Life: Alyx developer
  commentary (in-game, Commentary Update Nov 2020), node "Introduction" (Robin Walker); transcript at
  https://combineoverwiki.net/wiki/Developer_commentary/Half-Life:_Alyx (read via the Wayback snapshot
  of 15 Dec 2024; the wiki says transcripts come from official captions) — verified yes (all ~120 nodes
  read) — Key line: the more is included, the more chance the player misses something important —
  For us: one thought per sheet is right; cut corridor detail that competes with the one task.

- **First-room players vary from 30 seconds to 30 minutes; first rooms must not stack story, controls
  and interaction at once** — HL:A commentary, node "Greenhouse" (Chris Emond) — verified yes — Key
  line: the video call was moved twice until it sat in a space with fewer interactables, after players
  had figured out movement — For us: no voice instructions while the player is still learning the
  thumbsticks or the laser; wait until they have done the action once.

- **Compose the very first view so the eye goes to the big sight first, then the details; sound starts
  in the fade-in** — HL:A node "Citadel Vista" (Tristan Reidford) — verified yes — Key line: scale
  references, fog, lighting and a helicopter whose sound begins in the fade-in pull attention to the
  Citadel before the balcony props — For us: let the sign's first click sound before or as the view
  appears, from its direction.

- **Hard to guide the viewer at the start of a new scene** — Rothe S., Hußmann H., "Guiding the Viewer
  in Cinematic Virtual Reality by Diegetic Cues", AVR 2018, LNCS (LMU PDF
  https://www.medien.ifi.lmu.de/pubdb/publications/pub/rothe2018AVRdiegeticguiding/rothe2018AVRdiegeticguiding.pdf)
  — verified yes (full) — Key line (summary of results): it is difficult to guide the viewer at the
  beginning of a new scene; in the first scene no single cue won (26 viewers, 360° video on Cardboard) —
  For us: after each door/fade, wait before cueing; the first cue should be the strongest kind (new
  sound + motion).

- **Before entering, align the player physically with a diegetic "podium" that says COME HERE, then
  LOOK HERE; only then teleport into the experience** — Ballantyne J., "The Problem with Reality",
  Oculus Story Studio blog, 6 July 2016 (archived
  https://web.archive.org/web/20170405000135/https://www.oculus.com/story-studio/blog/the-problem-with-reality/)
  — verified yes (full) — Key line: the antechamber guarantees a known position and facing so the first
  view is framed — For us: the door handover can use the same trick: the player faces the door, and the
  room starts with the table in front.

- **Onboarding: comfort settings first, essential skills first, safe consequence-free practice, short
  skippable story, several channels (voice + subtitle + diagrams + haptics); >30 min on day one goes
  with 3× return in Action games (Meta internal data)** — Meta Horizon, "Growth Insights Series:
  Building Competency in New User Onboarding", developer blog, 10 Apr 2025,
  https://developers.meta.com/horizon/blog/growth-insights-series-building-competency-new-user-onboarding/
  — verified yes (read through the fetch tool's summary) — Key line: about 40% of new adult users are
  seated for at least 10 minutes in their first month — For us: our rooms state seated/standing up
  front (project rule); keep practice consequence-free before a measured task.

- **Tutorials: context-sensitive (just-in-time) beats a front-loaded instruction screen for emotion and
  motivation, not for performance; for simple discoverable games tutorials matter little; slowing the
  world during teaching helped most** — Chen B., Yan X., Hu X., Kao D., Liang H.-N., "Impact of Tutorial
  Modes with Different Time Flow Rates in VR Games", Proc. ACM CGIT 7(1), 2024, doi:10.1145/3651296 —
  verified yes (intro, related work, discussion; 59 participants); Frommel et al. CHI PLAY 2017 (n=39)
  and Andersen et al. 2012 verified only via Chen 2024 — Key line: bullet-time tutorials improved
  learnability and lowered load — For us: teach the laser and the clipboard at the moment they are
  needed, never as a manual page; nothing should be timed while teaching.

- **Players should not need backstory or a control explanation: "hand it to a friend"** — Schwartz A.
  (Owlchemy Labs) in Takahashi D., "How Owlchemy Labs designed VR's funny hit Job Simulator",
  VentureBeat, 26 Feb 2017,
  https://venturebeat.com/business/how-owlchemy-labs-designed-vrs-funny-hit-job-simulator/ — verified
  yes (read through the fetch tool's summary) — Key line: goals were pass-and-play, instant pickup,
  smooth onboarding; story through the environment — For us: the corridor should be playable without
  reading anything; the clipboard is the only text.

- **Many guests fly fast to new vistas and rarely study detail; overwhelmed newcomers cannot answer
  questions early** — Pausch et al. 1996, "General Observations" — verified yes — Key line: guests were
  so cognitively taxed early on that they had trouble answering questions — For us: no consent text or
  questions in the first minute of VR (the project already keeps consent before the door).

## 3. Guiding attention with sound, motion and light

- **A new sound makes people look for its source even when it is off-screen; movement guides too;
  static light did not; a flickering lamp placed high, without sound, went unnoticed** — Rothe &
  Hußmann 2018 — verified yes — Key line (summary): sound itself mattered more than its direction; a
  moving light cone changed viewing direction, a non-moving light did not; higher objects drew less
  attention (stated as a plausible assumption) — For us: the light-box sign is high over door 1 and
  flickers: its starter clicks and hum are what will turn heads, so they must play from the sign and
  before the first flash.

- **Taxonomy of guidance: diegetic/non-diegetic, visual/auditory/haptic, on/off-screen,
  world/screen-referenced, direct/indirect, subtle/overt, voluntary/forced. Diegetic cues gave higher
  presence; forced rotation lowered it; fade-to-black disturbed, desaturation did nothing** — Rothe S.,
  Buschek D., Hußmann H., "Guidance in Cinematic Virtual Reality — Taxonomy, Research Status and
  Challenges", Multimodal Technol. Interact. 3(1):19, 2019, doi:10.3390/mti3010019 — verified yes (full);
  Nielsen et al. VRST 2016 and Danieau et al. 2017 only via this review — Key line (Table 4, §5.2):
  diegetic = high presence but story-dependent; non-diegetic = noticeable but disrupting — For us: guide
  with things that belong in a 1979 lab (a phone rings, a lamp buzzes, a door clicks); keep arrows for
  emergencies.

- **When the big moment matters, a transient sound beats a rumble; lead the eye stage by stage** — HL:A
  node "Train Crash" (Alireza Razmpoosh) — verified yes — Key line: players often missed the crash;
  a rumble was too subtle, a transient explosion sound reliably drew attention to the smokestack —
  For us: the cue that starts each room's key event should be short and sharp, from the event's place.

- **Timer plus look-trigger: if the player looks early, start the moment; if not, start it after a
  short delay anyway** — HL:A node "Shotgun Gate 2" (Dan Ginsburg) — verified yes — Key line: a common
  trick for moments the player should see but that cannot wait forever — For us: fits our engine's
  look events; useful for the sign and for reveal moments, never for the measured phase (see §11).

- **Music can tell players the world changed and they should move on; recurring musical patterns kept
  a goal in mind over hours** — HL:A nodes "Music" and "Substation Sounds" (Mike Morasky) — verified yes —
  Key line: with simple action music fewer playtesters forgot their quest or got lost in the laundry
  props — For us: music changes behaviour; allowed in the corridor and debrief, not during a measure.

- **Sound gives presence and attention: binaural, per-source placement (Henry had 3 mono sources:
  mouth, hands, feet), one attenuation curve so loudness reads as distance; too many spatial sounds
  overwhelm** — Bible T., "Binaural Audio for Narrative VR", Oculus Story Studio blog, 31 May 2016
  (archived …/story-studio/blog/binaural-audio-for-narrative-vr/) — verified yes (full) — Key line:
  sounds that turn with your head immediately break presence — For us: the voice should come from a
  place (a speaker grille, the experimenter's position), not from inside the head.

- **Content of the sound matters more than its localisation; music carries emotion but must survive
  unpredictable durations** — Pausch et al. 1996, "Sound" — verified yes — Key line: careful choice of
  ambient sounds and music mattered more than localisation details — For us: invest in a believable
  room tone for the 1979 lab before fine HRTF work.

- **Every interaction needs its own correct sound; generic sounds are noticed in VR** — HL:A nodes
  "Russell Typing" (Sara Charhon) and "Physics Sounds" (Alden Kroll); Schell 2015 Lesson Three —
  verified yes — Key line: Valve built ~2,000 object-specific sounds for 160+ objects; Schell: expect
  to double sound work in VR — For us: clipboard, door, switch, chair each need their own sounds.

- **Peripheral vision is motion- and flicker-sensitive; subtle flicker guidance is unreliable in HMDs
  (frame rate, field of view); overt cues raise recall** — Rothe et al. 2019, §2.2 and §5.4 — verified
  yes — Key line: tuned subtle cues were either not subtle or did not work — For us: do not build
  "invisible" gaze tricks; use plain diegetic cues.

- **People follow where others look or point; dead zones push the eye elsewhere; difference in colour,
  scale, motion or visibility singles out the target** — Mateer J., "Directing for Cinematic Virtual
  Reality", J. Media Practice 18(1):14–25, 2017, doi:10.1080/14682753.2017.1305838 (accepted version
  https://eprints.whiterose.ac.uk/116714/) — verified yes (full; an argued essay, not a study) — Key
  line: film techniques of differentiation and passive cueing should carry over — For us: low-weight
  source; use only alongside the tested cues above.

## 4. Diegetic UI and signifiers

- **UI design space: non-diegetic, meta-perception, meta-representation, geometric, diegetic, and
  signifiers; a fully diegetic UI is not automatically more immersive** — Fagerholt E., Lorentzon M.,
  "Beyond the HUD: User Interfaces for Increased Player Immersion in FPS Games", MSc thesis, Chalmers,
  2009, https://publications.lib.chalmers.se/records/fulltext/111921.pdf — verified yes (chapters 7–12;
  guidelines rest on small user tests, 5 players each, authors call them unverified) — Key line (§10.1):
  diegetic is a strong tool but other categories have their own advantages — For us: the clipboard is
  a good diegetic choice; do not force everything into props when a plain cue serves better.

- **Signifiers and affordance amplifiers: make the interactive thing move or stand out (a curtain
  swaying marks the one open window), suppress look-alikes; offer escalating help on request** —
  Fagerholt & Lorentzon 2009, §10.3 (Design Examples 2 and 3) — verified yes — Key line: in Mirror's
  Edge tests players preferred no guidance but sometimes got stuck; help should grow in detail only when
  asked — For us: the clipboard on its hook and the door to go through should be the only things that
  "invite"; other doors read as closed.

- **Make movement diegetic: holographic feet as the teleport target, footsteps after a teleport;
  players then described "walking", not "teleporting"** — HL:A node "Teleporting & Immersion" (Owen
  Macindoe) — verified yes — Key line: footstep audio changed how players recounted their movement —
  For us: our teleport arc could end in feet and play steps; cheap, and it supports Plausibility.

- **Even the menu can be a world object: Job Simulator's exit is a burrito you eat; a briefcase is the
  menu** — Schwartz A. in Voices of VR #315, 2016,
  https://voicesofvr.com/315-job-simulator-and-the-magic-of-hand-presence/ — verified yes (full
  transcript) — Key line (00:16:40): you open the briefcase and take two bites of the "exit" burrito —
  For us: confirms the project's EXXXIT exit door as the "leave" button.

- **Ask "why is this here?" of every object; tie each challenge to setting, world or characters, not to
  "escape-room logic"** — Nicholson S., "Ask Why: Creating a Better Player Experience Through
  Environmental Storytelling and Consistency in Escape Room Design", Meaningful Play 2016,
  https://scottnicholson.com/pubs/askwhy.pdf — verified yes (full) — Key line: a laser maze in an
  Egyptian pyramid breaks immersion; anachronisms do too — For us: every corridor object needs a 1979
  lab reason; players treat every visible object as meaningful.

- **Screen-relative HUDs are something VR is bad at** — Schell 2015, Lesson Two — verified yes — Key
  line: list of things VR is bad at includes screen-relative HUD interfaces — For us: no head-locked
  text, as the project already decided.

## 5. Reveal moments and surprise

- **A good surprise has four parts: it is unexpected, it was set up beforehand, it is not highly
  unlikely, and it makes sense afterwards** — Nicholson 2016, "Adding Surprises and Emergent
  Narratives" (citing Skolnick 2014) — verified yes (Skolnick via Nicholson) — Key line: surprise should
  be used sparingly and must fit the genre — For us: the "how it was done" reveal should point back to
  things the player already saw (the setup), so it lands as "of course!" not "cheat".

- **Awe design: a set path that ends in an unexpected view (a waterfall hidden behind trees, a panorama
  behind peaks)** — Chirico A., Ferrise F., Cordella L., Gaggioli A., "Designing Awe in Virtual
  Reality: An Experimental Study", Front. Psychol. 8:2351, 2018, doi:10.3389/fpsyg.2017.02351 (in folder)
  — verified yes (methods and results) — Key line: Mountains gave the highest awe (median 6 of 7) vs a
  closed meadow (median 3), n=36, 3 min each; but "need for accommodation" (the surprise part) did not
  differ between scenes — For us: hiding-then-revealing is a documented design, but its surprise
  component was not shown to work in that study; vastness was.

- **Elevators are one of the few ways to direct the view in VR: use them like a crane shot for a
  reveal, slowly, with the cabin always in view for comfort** — HL:A node "Elevator Comfort" (Colby
  Sieber) — verified yes — Key line: obstruction was added until part of the elevator was always in
  the field of view — For us: if a reveal needs motion, move the player in a cabin-like frame, slowly.

- **Put the player where they must look: a two-handed roller door fixes position, facing and hands;
  the designers know the exact moment the view opens** — HL:A node "Gauss Canon" (Claire Hummel) —
  verified yes — Key line: it occupies both hands so they know the player isn't teleporting or doing
  anything else — For us: a physical action that frames the view (open a lid, lift a screen) is a
  clean way to time a reveal without forcing the camera.

- **Introduce new threats at a distance and without duress; telegraph to lower tension when something
  new must be understood** — HL:A nodes "Combine Sighting" (Kelly Thornton) and "Reviver
  Foreshadowing" (Joe van den Heuvel) — verified yes — Key line: in intense situations players fail to
  notice or retain critical information — For us: the reveal/debrief must be calm; do not explain the
  science while the player is still startled.

- **Mystery ads that reveal the product only at the end produce better later brand recognition** —
  Loewenstein G., "The Psychology of Curiosity: A Review and Reinterpretation", Psychol. Bull.
  116(1):75–98, 1994 (footnote 1, citing Fazio et al. 1992) — verified yes (full; scanned PDF read page
  by page) — Key line: footnote 1 — For us: withholding the explanation until after the experience is
  supported, not only by ethics practice.

## 6. Curiosity as the engine (information gap)

- **Curiosity is a felt gap between what one knows and wants to know; it needs some prior knowledge
  ("prime the pump"); a question, an unresolved sequence, a violated expectation, someone else knowing,
  or a forgotten fact all open the gap** — Loewenstein 1994, "An Integrative Interpretation" and
  "Involuntary Curiosity" — verified yes — Key line (p. 91): five situational triggers of curiosity —
  For us: each room should open one specific gap early ("what will happen to your arm?") and close it
  in the reveal.

- **Guessing plus feedback increases curiosity; insight problems raise more curiosity than incremental
  ones; satisfaction often disappoints; curiosity fades fast when attention moves elsewhere** —
  Loewenstein 1994, "Guessing and Feedback" and "Curiosity's Combination of Intensity, Transience…" —
  verified yes — Key line (p. 91–92): guess-then-feedback raised curiosity in Loewenstein et al. 1992 —
  For us: ask the player to guess before the reveal; deliver the reveal immediately, before
  distraction; make the explanation itself a small "aha", not a lecture.

- **Curiosity peaks when confidence is ~50%; wrong guesses followed by the answer, under high curiosity,
  are remembered better 1–2 weeks later; people pay time/tokens for answers they are curious about** —
  Kang M.J., Hsu M., Krajbich I.M., Loewenstein G., McClure S.M., Wang J.T., Camerer C.F., "The Wick in
  the Candle of Learning", Psychol. Sci. 20(8):963–973, 2009, doi:10.1111/j.1467-9280.2009.02402.x —
  verified yes (full; small samples: 19 fMRI, 12 returned for recall, 30 behavioural) — Key line: peak
  curiosity at confidence 0.45–0.55 for three quarters of subjects; subjects waited 3.7 s longer per SD of
  curiosity — For us: a debrief question the player can only half-answer ("how far do you think you
  threw?") before showing their own data makes the finding memorable and shareable.

## 7. Changes of scale and awe

- **Awe = perceived vastness + need for accommodation; tone can be positive or fearful** — Keltner D.,
  Haidt J., "Approaching awe, a moral, spiritual, and aesthetic emotion", Cogn. Emot. 17(2):297–314,
  2003, doi:10.1080/02699930302297 — verified: abstract only (PubMed 29715721; full text paywalled) —
  Key line (abstract): two appraisals are central to all clear cases; five more (threat, beauty,
  ability, virtue, supernatural) flavour it — For us: definition only; use Chirico's measured studies
  for design.

- **Immersive video raises awe compared with the same content on a flat screen; it also raised
  presence; awe content in VR raised parasympathetic activity** — Chirico A., Cipresso P., Yaden D.B.,
  Biassoni F., Riva G., Gaggioli A., "Effectiveness of Immersive Videos in Inducing Awe", Sci. Rep.
  7:1218, 2017, doi:10.1038/s41598-017-01242-0 — verified yes (full; n=42, 2-min clips, Gear VR) — Key
  line (Table 1): awe 5.12 immersive vs 3.40 flat (1–7) for the awe clip — For us: a vast moment is
  cheap wow in VR; tall trees beat a mountain vista in their pilot (n=36).

- **VR is proposed as the way to get intense awe in the lab; warning: negative awe can terrify, so
  consent and debrief are needed** — Chirico A., Yaden D.B., Riva G., Gaggioli A., "The Potential of
  Virtual Reality for the Investigation of Awe", Front. Psychol. 7:1766, 2016,
  doi:10.3389/fpsyg.2016.01766 — verified yes (full; perspective paper) — Key line: need for
  accommodation is related to surprise and schema revision — For us: big-scale moments belong in the
  corridor or reveal, framed so they are wonder, not threat.

- **Owning a tiny body makes the world look bigger and farther; a giant body makes it smaller and
  nearer — and the effect grows with body ownership** — van der Hoort B., Guterstam A., Ehrsson H.H.,
  "Being Barbie: The Size of One's Own Body Determines the Perceived Size of the World", PLoS ONE
  6(5):e20195, 2011, doi:10.1371/journal.pone.0020195 — verified yes (full; 198 participants over 10
  experiments; 30 cm, 80 cm, 400 cm bodies) — Key line: most Barbie-doll participants did not notice
  the doll was small; they felt in a "giant world" — For us: a scale change is a real, sourced wow,
  but it changes size and distance judgements; never in a room whose measure involves size, distance
  or throwing.

- **Embodied in a 4-year-old's body, adults overestimate object sizes more than in a same-height adult
  body, and associate self with child traits; asynchrony removes both** — Banakou D., Groten R.,
  Slater M., PNAS 110(31):12846–12851, 2013, doi:10.1073/pnas.1306779110 (in folder) — verified yes
  (abstract, results) — Key line: n=30 synchronous + 16 asynchronous — For us: the body you give the
  player changes perception and attitudes; avatars are not cosmetic in our rooms.

- **Scale is what VR sells best: a Strider up close; a vista needs scale references in between or it
  looks flat** — HL:A nodes "Strider" (Roland Shaw), "Citadel Vista" (Tristan Reidford), "Jeff" (Robin
  Walker) — verified yes — Key line: placing players under an idling HL2 Strider in an early prototype
  got overwhelmingly positive feedback (node "Strider Introduction", Brad Kinley) — For us: if the
  corridor wants a scale moment, put familiar objects (doors, chairs) between the player and it.

- **Two scales at once: levels sized for the small hero and moments sized for the player; 80–90%
  core play, punctuated by VR set-pieces at the start, middle and climax** — Doucet N. (Japan Studio),
  "Astro Bot Rescue Mission: The Dos and Don'ts of Building a Platformer in PS VR", PlayStation Blog,
  2018, https://blog.playstation.com/?p=202362; and Road to VR "Astro Bot behind the scenes", 7 Nov 2018,
  https://www.roadtovr.com/astro-bot-behind-the-scenes-insights-and-artwork-sony-japan-studio-nicolas-doucet/
  — verified yes (both pages) — Key line: a "VR-ness" checklist (verticality, perspective play by
  leaning, proximity to create a bond, far-distance for drama, physical play with the head) — For us: a
  checklist per room: what here can only happen in VR?

- **Depth makes distance felt: "proximity infers safety"** — Doucet in PlayStation Blog 2018 — verified
  yes — Key line: players worried more as Astro moved farther away — For us: put the thing the player
  cares about (their own object, their own throw) near them; distance creates worry.

## 8. The player's own body and hands as the surprise

- **Hands complete presence; the "aha" is the first time a player bends down and picks up a dropped
  egg; hide the hand while holding an object ("tomato presence")** — Reimer D. & Schwartz A. (Owlchemy
  Labs), Voices of VR #315, 2016 — verified yes (full transcript); Owlchemy, "Tomato Presence!",
  https://owlchemylabs.com/tomatopresence — verified yes (via fetch summary) — Key line (00:03:09):
  players pause after picking up the dropped egg, realising the system let them — For us: the
  clipboard grab is our first hand moment; let the player drop things and pick them up.

- **Physical interaction wins over buttons: pull-gesture gloves, catch the object yourself; players
  blamed themselves, not the game, for fumbled physical reloads and rated them highlights** — HL:A nodes
  "Gravity Glove Training 1" (Kerry Davis) and "Pistol Reloading" (Erik Peterson) — verified yes — Key
  line: observers thought it went horribly wrong; players cited it as a high point — For us: when the
  original procedure has a physical act (throwing, holding the arm), keep it physical.

- **Players do instinctive body things: cover the mouth to stop coughing; inject into the head; brace
  the flashlight under the gun — Valve turned each into a feature** — HL:A nodes "Coughing" (Tom Bui),
  "Health Injectors" (Mike Lee), "Flashlight Articulation" (Steve Kalning) — verified yes — Key line:
  many players tried injecting the head, so it was added — For us: watch the playtests for what bodies
  do and support it, unless the procedure forbids it.

- **The body is the controller: Superhot VR removed locomotion because teleport broke the "ballet" of
  small body movements; a colleague kicked a monitor trying to kick a guard** — Iwanicki P., Voices of
  VR #483, Oct 2016, https://voicesofvr.com/?p=3928 — verified yes (full transcript) — Key line
  (00:07:57): with hands and head tracked, people act as if their whole body were there — For us: in
  body-effect rooms (Kohnstamm arm), keep the player still and the body central.

- **First-person view of a body is enough for ownership, even a body of another sex; heart-rate fell
  more when "your" body was slapped** — Slater M., Spanlang B., Sanchez-Vives M.V., Blanke O., "First
  Person Experience of Body Transfer in Virtual Reality", PLoS ONE 5(5):e10564, 2010,
  doi:10.1371/journal.pone.0010564 — verified yes (full; 24 male participants) — Key line: perspective
  dominated touch and head-movement synchrony — For us: if a room shows the player's body, first-person
  plus head tracking already makes it "theirs".

- **Body swap: people can feel another body as their own and shake hands with their own body; only
  humanoid bodies work** — Petkova V.I., Ehrsson H.H., "If I Were You: Perceptual Illusion of Body
  Swapping", PLoS ONE 3(12):e3832, 2008 (in folder) — verified yes (results) — Key line: a box of the
  same size gave no threat response — For us: a two-player body-swap room is sourced (see
  docs/ideas/europe.md #3).

- **Seen hands must sit where real hands are; a body slightly out of place is worse than none** —
  Schell 2015, Lesson Three ("proprioceptive disconnect") — verified yes — Key line: better to show no
  body than one that is slightly misplaced — For us: hands/controllers must be calibrated; no full
  avatar unless its pose is right.

- **Two-handed weapons felt wrong without the physical link between the hands; Valve went one-handed**
  — HL:A node "Shotgun Design 1" (Jane Ng) — verified yes — Key line: players had to keep "playing
  along" to hold two-handed items — For us: design props for one hand, or for two hands that do not
  have to stay rigidly linked.

## 9. Characters, comedy and personality

- **Comedy buys forgiveness: a self-mocking spy world with a sarcastic narrator made players accept
  flaws; a narrator line can acknowledge an unsupported action (the knife as screwdriver)** — Schell 2015,
  Lesson Three — verified yes — Key line: in a comic world players roll with imperfections — For us:
  the experimenter's voice can acknowledge odd player actions with a dry line; humour lives in the
  corridor and debrief, not inside a procedure.

- **Humour comes from the whole world ("slightly off"), not from lines; no writer; players should never
  feel bad for breaking the world's rules** — Schwartz in VentureBeat 2017 — verified yes (summary) —
  Key line: you can't force players to do something — For us: the corridor's props can carry the
  studio's personality (the board flyer, the sign's endings).

- **Characters work at the edge of the player's space; wave to start a conversation; friendly robots
  avoid the uncanny valley** — Reimer D. & Eiche A., "Owlchemy Labs Case Study: Lessons Learned from JOB
  to VACATION", Meta developer blog, 23 Apr 2019,
  https://developers.meta.com/horizon/blog/owlchemy-labs-case-study-lessons-learned-from-job-to-vacation/
  — verified yes (full) — Key line: waving felt so natural that most players did it automatically — For
  us: if the experimenter ever appears, keep them at the boundary, stylised rather than near-human.

- **Characters should turn head first, then body, to face the guest; even simple branches work if a
  character has a default, a reaction to arrival and a reaction to departure** — Pausch et al. 1996,
  "Authoring" — verified yes — Key line: rotation to face guests is important for the illusion that
  characters are real — For us: the minimum viable experimenter: idle, notice, farewell.

- **The player's own voice: don't let the protagonist react to everything; keep only universal
  reactions, said a beat after the player's own "whoa"** — HL:A node "Alyx Reactions" (Jay Pinkerton) —
  verified yes — Key line: too many reactions disconnected how the player felt from how the character
  felt — For us: the narrator must never tell the player what they feel ("you're surprised!"); echo,
  don't lead.

- **Keep players and characters out of each other's space; forcing the player's position made them
  deeply uncomfortable** — HL:A node "Character Choreography" (Steve Kalning) — verified yes — Key line:
  restrict access only while a character passes, then lift it — For us: matches the project's no-looming
  rule.

- **A small creature that acknowledges you (eye contact, sign language, waving back, mirroring your
  mood) creates a bond; the wave-back was added after watching E3 players** — Polyarc (Armstrong T.,
  Alderson C., Lico R.) interviewed in "How Moss developer Polyarc connects you to Quill", PlayStation
  Blog, 12 Feb 2018,
  https://blog.playstation.com/archive/2018/02/12/how-moss-developer-polyarc-connects-you-to-quill-the-world-and-more
  — verified yes (full) — Key line: everything sits within arm's reach, so the hero had to be small —
  For us: confirms Psi via contingent reference; any guide figure should return the player's gesture.

- **A look-at was the most popular feature of Henry, yet it contradicted the story of a lonely
  hedgehog** — Burdette 2015 (Swayze Effect) — verified yes — Key line: acknowledging the viewer is
  powerful but can contradict the story's intent — For us: acknowledgement must fit the procedure (an
  experimenter who greets you fits; one who comments during a measure does not).

## 10. Pacing

- **Think of the story as "moments", not "actions"; VR needs slower pacing than a film storyboard** —
  Unseld 2015, lesson 1 — verified yes — Key line: the film-paced reel felt rushed in VR — For us: each
  clipboard page and each reveal is a moment with time to look.

- **Separate required events in time and space; split one dense scene across two rooms; a drone
  delivers some lines earlier** — HL:A nodes "Pacing 1–2" (Ted Carson, Eddie Parker) and "Hideout
  Scene" (Karen Prell) — verified yes — Key line: if everything is crammed into one scene players
  remember only a couple of highlights — For us: the reveal (how it was done) and the finding (what the
  study found) can be two places/pages.

- **Playtesters remembered the actions they did, not the information given during them** — HL:A node
  "Hideout Scene" (Karen Prell) — verified yes — Key line: squeezing headcrab hearts was memorable but
  hid the critical goal — For us: do not ask the player to do something while the key fact is spoken.

- **Lulls after intensity; physically taxing sequences need gaps; a session of 30–45 min was the
  early VR expectation, later hours** — HL:A nodes "Combat Pacing" (Corey Peters), "Player Comfort &
  Pacing" (Thad Wharton) — verified yes — Key line: puzzles and trip mines were used to let players
  recuperate — For us: rooms of ~10 min (project rule 16) fit easily; alternate tension and calm.

- **Detail multiplies time: art and lighting doubled or tripled level playtime; one player spent 30
  minutes on one object** — HL:A nodes "(unused) art pacing" (Matt Wilde) and "Budget" (Thiago
  Vidotto) — verified yes — Key line: players spend far more time on world detail in VR than expected —
  For us: time each room with art in place, not in grey-box; budget for interactable detail.

- **Build each long scene like a wave: quiet start, rising, then the climax** — Felix & Paul,
  Voices of VR #486 (00:07:41) — verified yes — Key line: modulation moved viewers more than cuts —
  For us: room arcs: settle, task, peak, reveal.

- **Players lose track of time in VR: people who played 45–60 min guessed 8–15 min** — Reimer D.,
  Voices of VR #315 (00:12:13) — verified yes (anecdotal post-play interviews) — Key line: estimates were
  about four times too short — For us: watch session length; consider a gentle time cue between rooms.

- **Fast enemies were overwhelming in VR; players do everything slower; reduce simultaneous demands**
  — HL:A node "Fighting Combine" (Keith Miron) — verified yes — Key line: HL2 combat speed was simply
  too overwhelming in VR — For us: the original procedure's timing is fixed; everything around it can
  be slower than on a screen.

## 11. Escape-room and puzzle-room design (short single-room tasks)

- **What escape rooms are and do (175 facilities, 224 rooms): briefing, search, puzzles, hints from a
  watching gamemaster (82%), debrief (73% schedule it), average success 41%** — Nicholson S., "Peeking
  Behind the Locked Door: A Survey of Escape Room Facilities", white paper, 2015,
  https://scottnicholson.com/pubs/erfacwhite.pdf — verified yes (full) — Key line: post-game talk
  ("froth") is what a good room seeks to generate — For us: the debrief is part of the product, as in
  ours (the reveal is the "froth" moment).

- **Players consistently enjoy three things: being part of a spectacle, feeling heroic, a challenge
  (5 Wits); multiple satisfying endings so nobody "fails" (Memori)** — Nicholson 2015, "Conclusions"
  (citing DuPlessie 2013 and Raynes-Goldie et al. 2014) — verified yes (secondary sources via Nicholson)
  — Key line: 25% of 5 Wits business is returning players — For us: every outcome of a room should
  end in a good reveal, whatever the player did.

- **Red herrings frustrate; players take every object as important; puzzles need checkpoints and a
  clear solution; "let the player do it, then show it, tell it last"** — Nicholson 2016 — verified yes —
  Key line: few players appreciate red herrings — For us: no decoy objects in measured rooms unless the
  original study used them.

- **Initiation: a small challenge at the entrance moves players from the real world into the game
  world (5 Wits)** — Nicholson 2016, "Connecting the player into the narrative" — verified yes — Key line:
  the initiation helps players transition into the genre — For us: taking the clipboard is our
  initiation act.

- **Escape-room design is close to ours: I Expect You To Die is an escape room for a seated player;
  familiar seated settings (a desk, a car) avoid proprioceptive mismatch** — Schell J., Voices of VR #223,
  2015, https://voicesofvr.com/223-jesse-schell-on-the-vr-design-principles-of-i-expect-you-to-die/ —
  verified yes (transcript read to 00:16) — Key line (00:09:00): Blocked In (a desk) was his most
  immersive VR — For us: seated experiments at a table are the strongest possible VR situation.

- **Rich object interactions over large worlds; objects near the face are very compelling; frozen
  objects looked like a crash until a slight bob was added** — Schell 2015, Lessons Three and Four —
  verified yes — Key line: a small game with rich interactions beats a big one with weak ones — For us:
  the clipboard hanging in the air should breathe slightly, not freeze.

## 12. Sharing, spectators and replay

- **Spectators enjoy knowing more than the player: Valve's debug HUD made playtests exciting to watch,
  so they shipped a spectator HUD for streamers** — HL:A node "Spectator Hud" (Jake Rodkin) — verified
  yes — Key line: observers saw players survive with their last bullet without knowing it — For us: a
  streamer's audience that knows the trick while the player does not is the same effect; it supports
  the "share a card without the trick" plan.

- **"The value is watching friends freak out": Richie's Plank is a party piece; with a real plank
  under foot it convinces far more** — Toast (developer statement on r/PSVR) quoted in UploadVR,
  "Richie's Plank dev tells PSVR fans: don't buy our title" (date not shown in my copy; PSVR release),
  https://uploadvr.com/richies-plank-dev-tells-psvr-fans-dont-buy-our-title/ — verified yes (full) —
  Key line: without a plank the game is considerably less convincing (UploadVR's assessment) — For us:
  matches Meehan's ledge; a room's "moment" is best when friends can watch the body react.

- **Audiences change how people play (performance mode); VR must be personally experienced to be
  understood; 1 million audience members at EPCOT watched but could not grasp it** — Schwartz A.,
  Voices of VR #315 (00:10:10); Pausch et al. 1996, "VR must be personally experienced" — verified yes —
  Key line: "you have to try it" is the only true VR advert (Schwartz) — For us: the share card should
  invite a try, not explain.

- **A mixed-reality video of a player went viral by accident; scoring rewards full arcs so players
  "look good"; Easy was tested on knees to imitate a child** — Ilavsky J. & Beck J., Voices of VR #644,
  2018, https://voicesofvr.com/644-beat-saber-lets-you-become-the-music-through-puzzles-your-body-solves;
  Joynes J. ("Freeek") in PlayStation Blog level-design interview, 2019,
  https://blog.playstation.com/?p=212986 — verified yes (both) — Key line: it's just about making people
  look good (Ilavsky, 00:07:03) — For us: a replay of the player's moment should flatter the body
  movement, and show it from outside.

- **First-time magic fades on repeat; designers plan for showing VR to friends** — Bye K. & Schwartz A.,
  Voices of VR #315 (00:09:40–00:10:10) — verified yes — Key line: the original magic was not quite the
  same on later plays — For us: matches Meehan's orienting effect; the sign's changing endings are a
  sourced answer for return visits (Nicholson 2015 on different endings for replay).

## 13. What to avoid

- **Text and long dialogue up front; information during action; too many things at once** — HL:A
  "Introduction", "Pacing 2", "Hideout Scene"; Pausch 1996 (overwhelmed novices) — verified yes — Key
  line: players cannot learn something new while under pressure (HL:A "Armored Headcrabs 2") — For us:
  the clipboard's one-thought pages are right; nothing timed while reading.

- **Moving the player's body or camera for them; lateral platform motion sickened most testers; the
  original fix for a vehicle (start after the crash) underwhelmed** — HL:A nodes "Chasm Puzzle" (Chris
  Emond), "Van Crash" (Eric Kirchmer), "Barnacles" (Scott Dalton) — verified yes — Key line: small
  windows and a cabin in view kept vehicle rides comfortable — For us: consistent with the project's
  locomotion choices.

- **Dictatorial gaze control feels staged; forced rotation lowers presence** — Unseld 2015 lesson 3;
  Rothe et al. 2019 (Nielsen 2016 via review) — verified yes — Key line: heavy-handed bird fly-bys made
  the story feel forced — For us: let the player look away; repeat the cue rather than grab the view.

- **Features the hardware doesn't deliver: a fan for wind went unnoticed; a motion base had no effect
  on satisfaction** — Pausch et al. 1996, "Seating, Controls, and Motion Base" — verified yes — Key line:
  most guests in the HMD did not notice the wind — For us: don't spend on extra-sensory gimmicks before
  sound and interaction are right.

- **Characters who ignore the player; objects that pass through each other** — Pausch 1996
  conclusions; Slater 2022 — verified yes — Key line: both completely shattered presence (Pausch) — For
  us: test collisions of the clipboard and doors with hands.

- **Over-explaining with obvious cues breaks presence, while too little leaves people stuck; graduated,
  player-requested help balances both** — Fagerholt & Lorentzon 2009 §10.3; HL:A "Darkness Gate" (Phil
  Co: one line from Alyx told players their attempts were seen and the answer lay elsewhere) — verified
  yes — Key line: acknowledging the attempt redirected players — For us: if a player is stuck, the
  experimenter's voice acknowledges and redirects; never a floating arrow first.

## 14. For us: what fits experiment rooms, and what would break the science

Rule of thumb from the sources: a technique is safe when it acts before the measure (briefing,
corridor), after it (reveal, debrief), or is part of the original procedure; it breaks the science
when it changes what the player perceives, attends to, feels or does during the measured phase.

Safe (outside the measure, or already in the original):
- Presence/Plausibility work on the lab itself (Slater 2009/2022): a credible 1979 lab is what makes
  people respond as real participants did.
- Background story and one goal before the room (Pausch 1996): the original study's instructions are
  that goal; give them, nothing extra.
- Settling time after each entrance (Unseld 2015; Rothe & Hußmann 2018): it only delays the start.
- Guess-then-reveal in the debrief (Loewenstein 1994; Kang 2009): ask after the measure is taken.
- Surprise rules for the reveal (Skolnick via Nicholson 2016): show the setup the player saw.
- Comedy and personality in the corridor and debrief (Schell 2015; Owlchemy).
- Spectator/share design (HL:A spectator HUD; Richie's Plank; Beat Saber).
- Diegetic guidance to the start point of a room (Story Studio podium; Rothe 2019).

Breaks or risks the science (inside the measured phase):
- Attention cues (sound, motion, light, look-triggers) aimed at the manipulated thing: they steer gaze
  (Rothe 2018/2019; HL:A Train Crash); fatal for any attention-dependent effect.
- Music or pacing tricks to "move players along" (HL:A Music): they change behaviour and arousal.
- Fake time pressure (HL:A Shotgun Gate 2) or hints (Nicholson 2015) unless the original had them.
- Scale or body changes not in the original (van der Hoort 2011; Banakou 2013): they alter size,
  distance and self-judgements.
- Asking how the player feels before measuring it (Slater 2022 on questionnaires).
- Narrator commentary that names a feeling (HL:A Alyx Reactions) — it would also act as a suggestion.
- Replays of the same room by the same player count as repeat exposures, with weaker responses
  (Meehan 2002) — data from replays must be marked as such.
- Passive haptics that the original did not have (Meehan 2002): they raise the response, so they are
  a change of procedure, however good they feel.

---

## Top 15 for our game (ranked)

1. **Design Plausibility, not just presence: the lab must react to the player, address them, and
   match what a 1979 lab visitor expects** (Slater 2009, 2022; Pausch 1996; Burdette 2015). PI comes
   with the headset; Psi is our job and does not recover once broken.
2. **One goal and a background story before the room; one task at a time inside** (Pausch 1996;
   HL:A Introduction/Greenhouse; Meta 2025).
3. **Let the first look land: settle 10–40 s after every entrance, then cue; open with one small,
   graspable "In"** (Unseld 2015; Burdette 2015; Rothe & Hußmann 2018; matches the project's 10 s start).
4. **Turn heads with a new, sharp sound from the source, then motion; never rely on a static or high
   light alone** (Rothe & Hußmann 2018; HL:A Train Crash, Citadel Vista; Pausch head-turn data). Direct
   check for the light-box sign.
5. **The wow is the player's own body and hands doing something real** (Owlchemy VoVR #315; Slater 2010;
   Superhot VoVR #483; HL:A gloves/reload). Our best first rooms (throws, floating arm) already fit.
6. **Guess-then-reveal: open an information gap, ask for a prediction, close it at once with the
   player's own data** (Loewenstein 1994; Kang 2009). Makes the finding remembered and shareable.
7. **Reveal by the four rules of surprise: unexpected, set up, plausible, obvious afterwards**
   (Skolnick via Nicholson 2016; HL:A elevator/roller-door framing).
8. **Every touchable thing responds with its own sound and behaviour; a small world, richly
   interactive** (Schell 2015; HL:A Physics Sounds, Russell Typing; Owlchemy).
9. **Separate facts from actions: give key information in calm, separate beats, never while the player
   is acting or startled** (HL:A Hideout Scene, Pacing, Reviver Foreshadowing; Unseld "moments").
10. **The narrator acknowledges, never dictates feelings; echo the player, redirect when stuck**
    (HL:A Alyx Reactions, Darkness Gate; Schell knife line).
11. **Diegetic-first guidance built from lab objects, with graduated help on request** (Rothe et al.
    2019; Fagerholt & Lorentzon 2009; Nicholson "Ask Why"; HL:A teleport feet).
12. **Design for the first time and for the watcher: first exposure is strongest; audiences who know
    more than the player enjoy it most** (Meehan 2002; HL:A Spectator HUD; Richie's Plank; Beat Saber).
13. **Comedy and personality live in the corridor and debrief, where they buy forgiveness** (Schell
    2015; Owlchemy VentureBeat; HL:A "Sustenance!").
14. **Vastness and scale for awe moments outside measured phases, with scale references in between**
    (Chirico 2017, 2018; HL:A Strider/Citadel; Astro Bot dual scales; van der Hoort 2011 as the
    warning).
15. **Align the player with a diegetic podium before each room; never move their body for them**
    (Ballantyne 2016; HL:A Character Choreography, Elevator Comfort).

## Core sources read or watched in full

Developers (written primary sources; no video watched — see Gaps):
1. Valve, Half-Life: Alyx developer commentary, full transcript (~120 nodes), via Combine OverWiki
   (Wayback 2024-12-15). Text kept at `scratchpad/dl05/hla.txt`.
2. Schell J., "Making Great VR: Six Lessons Learned From I Expect You To Die", Game Developer, 2015.
3. Schell J., Voices of VR #223, 2015 (transcript to ~00:16).
4. Reimer D. & Schwartz A. (Owlchemy), Voices of VR #315, 2016 (full transcript).
5. Reimer D. & Eiche A., "Owlchemy Labs Case Study: Lessons Learned from JOB to VACATION", Meta blog, 2019.
6. Unseld S., "5 Lessons Learned While Making Lost", Oculus Story Studio, 2015.
7. Burdette M., "The Swayze Effect", Oculus Story Studio, 2015.
8. Bible T., "Binaural Audio for Narrative VR", Oculus Story Studio, 2016.
9. Ballantyne J., "The Problem with Reality", Oculus Story Studio, 2016.
10. Lajeunesse F. & Raphaël P., Voices of VR #486, 2016 (full transcript).
11. Polyarc interview, PlayStation Blog, 2018 (Moss).
12. Doucet N., PlayStation Blog 2018 and Road to VR 2018 (Astro Bot).
13. Iwanicki P., Voices of VR #483, 2016 (Superhot VR, full transcript).
14. Ilavsky J. & Beck J., Voices of VR #644, 2018 (full transcript); Joynes J., PlayStation Blog 2019 (Beat Saber).
15. Meta Horizon, "Growth Insights: Building Competency in New User Onboarding", 2025 (via fetch summary).
16. UploadVR on Richie's Plank (2018); VentureBeat on Owlchemy (2017, via fetch summary); Owlchemy "Tomato Presence!" (via fetch summary).

Research (PDF + pdftotext text in `objekt-papers`; † = already in the folder, read again here):
17. Pausch et al., Disney's Aladdin, SIGGRAPH 1996 — `pausch-1996`.
18. Slater 2009, Phil. Trans. B — `slater-2009`.
19. Slater et al. 2022, Front. Virtual Real. — `slater-2022`.
20. Slater et al. 2010, PLoS ONE — `slater-2010`.
21. Petkova & Ehrsson 2008, PLoS ONE — `petkova-2008` † (results read).
22. Banakou et al. 2013, PNAS — `banakou-2013` † (abstract and results read).
23. van der Hoort et al. 2011, PLoS ONE — `vanderhoort-2011`.
24. Meehan et al. 2002, ACM TOG — `meehan-2002` † (haptics, frame rate, order effects read).
25. Chirico et al. 2016, Front. Psychol. — `chirico-2016`.
26. Chirico et al. 2017, Sci. Rep. — `chirico-2017`.
27. Chirico et al. 2018, Front. Psychol. — `chirico-2018` † (methods and results read).
28. Loewenstein 1994, Psychol. Bull. — `loewenstein-1994` (scanned; read page by page; the .txt is a note).
29. Kang et al. 2009, Psychol. Sci. — `kang-2009`.
30. Rothe & Hußmann 2018, AVR — `rothe-2018`.
31. Rothe, Buschek & Hußmann 2019, MTI — `rothe-2019`.
32. Nicholson 2015, escape-room survey — `nicholson-2015`.
33. Nicholson 2016, "Ask Why" — `nicholson-2016`.
34. Fagerholt & Lorentzon 2009, Chalmers thesis — `fagerholt-2009` (chapters 7–12).
35. Chen, Yan, Hu, Kao & Liang 2024, Proc. ACM CGIT — `chen-2024` (intro, related work, discussion).
36. Mateer 2017, J. Media Practice — `mateer-2017` (essay; low weight).

## Gaps

- **GDC talks were not watched.** YouTube caption and transcript endpoints refused automated access
  (proof-of-origin bot protection; I did not try to get around it) and GDC Vault has only overviews.
  Unwatched: Owlchemy "'Job Simulator' Postmortem" (GDC 2017, https://www.gdcvault.com/play/1024256),
  Owlchemy "Spatial Storytelling Lessons" (GDC 2017), Polyarc "Engaging VR Storytelling: A Moss
  Postmortem" (GDC 2019), Doucet "Making of ASTRO BOT Rescue Mission" (GDC 2019), Superhot GDC 2016,
  Skillman & Hackett "Three Years of Tilt Brush" (VRDC 2017). The owner could watch them, or a session
  with browser access could read the captions.
- **Tilt Brush**: no design source with substance found (the VRDC Q&A has none). Unverified.
- **Valve The Lab**: no primary written source read; only HL:A commentary mentions it (session length,
  throwing).
- **Closed or blocked papers (unverified, used only via others):** Chauvergne, Hachet & Prouzeau,
  "User Onboarding in Virtual Reality", CHI 2023 (HAL and ACM blocked by bot protection); Skarbez,
  Brooks & Whitton 2017 survey (closed; covered through Slater 2022); Keltner & Haidt 2003 (abstract
  only); Sheikh et al. 2016 BBC "Directing attention in 360-degree video" (IBC download failed);
  Nielsen et al. 2016 VRST (via Rothe 2019); Frommel et al. 2017 and Andersen et al. 2012 (via Chen
  2024); Berlyne 1954/1960 (via Loewenstein 1994).
- **Mixed reality (passthrough) wow**: not covered; no source on MR first minutes (e.g. Meta's
  First Encounters) was read.
- **"Time to wow" as a measured quantity**: no study found; only Pausch's 30-s "wow" observation and
  Meta's day-one time vs return data.
- **Sharing**: only developer anecdotes (Beat Saber, Richie's Plank, Owlchemy, Valve); no research on
  why people share VR moments.
- Most developer evidence is playtest observation; most research samples are small (n = 12–60) and
  often students; Rothe 2018 used 360° video on a 3-DoF Cardboard, not 6-DoF Quest.
