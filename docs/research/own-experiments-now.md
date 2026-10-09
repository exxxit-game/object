# Running our own experiments now: what the field does, what fits us, how to do it properly

Research for the owner's idea of new experiments with real players, in the present (docs/ideas/owner-experiments.md).
Every claim has its link and a short quote from the page read. "Unverified" marks what was not confirmed on a
primary page. Parts, each answered or marked "not found":

1. What psychology runs now (2023-2026) that a home VR game could join or run: 1a multi-site studies and registered
   reports; 1b citizen science and game-based research; 1c VR studies outside the lab; 1d open questions.
2. 8-12 candidate experiments for our setup (one player, 5-10 min, body and head data, Russian-speaking first).
3. The two-phones idea: 3a confabulation (Nisbett & Wilson 1977); 3b choice blindness; 3c price as a quality cue;
   3d what our version adds.
4. Running and publishing: 4a ethics review without a university; 4b preregistration; 4c data rules; 4d partners.
5. Risks to data quality (inattention, repeat players, bots, suspicion) and how studies handle them.

---

## Findings

### 1b. Game-based citizen science: Sea Hero Quest

- Spiers, Coutrot & Hornberger (2023), Topics in Cognitive Science 15(1), 120-138, "Explaining world-wide variation
  in navigation ability from millions of people: Citizen science project Sea Hero Quest".
  https://ueaeprints.uea.ac.uk/id/eprint/86715 — the game was used to "test 3.9 million people on their navigation
  ability", players "from 18 to 99 years of age", analysis over "all countries sufficiently sampled (N = 63)";
  "All countries showed a male advantage"; city upbringing linked to worse navigation.
- Origin and cost argument (CNRS News): Deutsche Telekom approached UCL and UEA in 2015; a professional studio
  (Glitchers) built it; released May 2016; data sent "with the participant's consent"; Coutrot estimated a
  classic study of that size would cost about $10 billion and take 10,000 years. https://news.cnrs.fr/print/1460
  (read via search snippet only; unverified on the page itself).
- Lesson for us: a game made by a studio with a university partner, data with consent, published in top venues.

### 1c. VR studies run outside the lab, on players' own headsets

- Mottelson, Petersen, Lilija & Makransky (2021), Frontiers in Virtual Reality 2:681482, "Conducting Unsupervised
  Virtual Reality User Studies Online". https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2021.681482/full
  - Own Oculus Quest headsets, recruited mainly on Reddit, $15 gift card. Study I: 161 online vs 185 in lab,
    collected over 11 days; about 13% online showed no or negative learning gain vs 3% in the lab.
  - Hand tracking: a screening test cut rejected hand data from 27% (8 of 30, pilot) to 8% (3 of 39).
  - Quotes: "a good reliability of collected data, which requires only slightly more sanitation than a comparable
    laboratory study"; "We estimate an approximate 10% ill-intended user participation which can be mitigated with
    appropriate practices"; "over-recruitment is necessary because of the number of aberrant responses".
- Cesanek, Shivkumar, Ingram & Wolpert (2024), Nature Human Behaviour 8(6):1209-1224, "Ouvrai opening access to
  remote VR studies of human behavioral neuroscience". https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/
  - Open-source, runs in the headset's web browser through the WebXR Device API with Three.js (same family of
    technology as our A-Frame game); Firebase hosting; recruits on Prolific with a "VR headset ownership" screener.
  - 30 participants from 14 countries; paid $5-6; about 10 participants per experiment within 90 minutes of
    posting; median about 18 minutes; latency 8.3 ms on a Meta Quest 2.
  - Claim: "immersion, interactivity, and data quality rivaling what is currently achievable in a physical
    laboratory" (their comparison to lab results was qualitative, no direct lab dataset).
- Lesson for us: a browser WebXR study on home Quests is published in Nature Human Behaviour; our tech stack is
  already the kind the field uses. Paid recruitment (Prolific) is the norm for these small studies; our free
  floor could give far larger and more natural samples, but self-selected.

### 1b (cont.). Unpaid volunteers who play for feedback about themselves: LabintheWild

- LabintheWild home page lists 19 current online tests (self-image, Eastern vs Western perception, peripheral
  vision, multitasking, decision-making style, reading emotions from eyes, comparing your values with a chatbot's,
  and more); the reward is a comparison of yourself with others: "Find out how the image you have of yourself
  compares to other people across the globe". https://www.labinthewild.org/ (who runs it and the participant
  count are not on that page: unverified there).
- Huber & Gajos (2020), PLoS One 15(1):e0227629, "Conducting online virtual environment experiments with
  uncompensated, unsupervised samples" (Harvard), run on LabintheWild. https://pmc.ncbi.nlm.nih.gov/articles/PMC6992162/
  - Study 1 (maze navigation): 311 completers; "Our results replicate findings previously obtained in conventional
    laboratory settings".
  - Study 2 (Proteus effect: taller avatar, negotiation): 1,334 volunteers in two months; taller avatars made more
    self-favouring splits, but the effect was smaller than the original (Cohen's d 0.34 vs 1.23) and the
    acceptance effect did not replicate.
  - Pay was replaced by feedback about yourself (navigation style; negotiation skill). Only 27 of 1,645 used a
    headset: home VR was still rare then.
- Lesson for us: the "MythBusters, you are the subject" reveal is the same reward LabintheWild uses instead of money.

### 1a. Large multi-site studies and registered reports

- Psychological Science Accelerator: "a globally distributed network of researchers that pool intellectual and
  material resources to accelerate the accumulation of rigorous knowledge in psychological science"; "12+
  projects" in its portfolio (moral dilemma judgments across cultures; COVID-19 framing; stereotype threat);
  proposals by open call ("How to Submit"). https://psysciacc.org/ (lab and country counts not on the page:
  unverified; its projects page was not read).
- Many Labs 2 (APS Observer, 28 Dec 2018): 28 classic and contemporary findings, "more than 60 labs across 36
  nations and territories", 14 of 28 replicated; population characteristics had "little to no bearing on the
  failure of a finding to replicate".
  https://www.psychologicalscience.org/observer/replications-dont-hinge-on-sample-and-setting-differences-multilab-project-shows
- Small grants exist for many-lab collaborations, e.g. the Kurt Lewin Institute Many Labs grant (April 2025),
  maximum 9,000 euros (search snippet of
  https://kurtlewininstituut.nl/wp-content/uploads/sites/426/2025/04/KLI-Many-Labs-grant-information.pdf; unverified
  on the page, and KLI is a Dutch graduate school, so likely for its members only: unverified).
- What it means for us: the field's current answer to the replication crisis is many sites, big samples and plans
  fixed in advance. A game with thousands of players is "one site, very many people"; joining the PSA as a member
  lab, or offering a VR version of a PSA study, is the route in (no PSA VR study was found).

## 3. The owner's two-phones idea: closest published work

### 3a. Reasons given for a choice not made for those reasons (Nisbett & Wilson 1977)

- Nisbett, R. E. & Wilson, T. D. (1977). Telling more than we can know: Verbal reports on mental processes.
  Psychological Review 84, 231-259. Record: https://deepblue.lib.umich.edu/handle/2027.42/92167?show=full
  (citation confirmed there). The full text was NOT read: the scanned PDF found
  (https://web.math.princeton.edu/~sswang/literature_general_unsorted/Nisbett-Wilson-PsychologicalReview1977.pdf)
  has a garbled text layer. The stocking study details (four identical pairs, a right-hand position effect,
  shoppers naming knit or sheerness, never position) come from secondary summaries only: UNVERIFIED until the
  paper text is in objekt-papers.
- Its reach: Johansson et al. (2006) call it "perhaps the most cited article in the recent history of
  consciousness studies" while "no empirical research program currently exists" that continues it (search
  snippet of https://www.lucs.lu.se/fileadmin/user_upload/lucs/2011/01/Johansson-et-al.-2006-How-Something-Can-Be-Said-About-Telling-More-Than-We-Can-Know.pdf;
  unverified on the page).
- Critique: Newell & Shanks (2014) argue position need not be the cause (a left-to-right "keep if as good"
  strategy) (search snippet of their review,
  https://carlsonschool-d8.prd.umn.edu/sites/carlsonschool.umn.edu/files/2019-04/newell_shanks_2014_unconscious_influences_on_decision_making_critical_review.pdf_0_0.pdf;
  unverified on the page).

### 3b. Choice blindness (Johansson, Hall and colleagues; read from objekt-papers)

- Johansson, Hall, Sikström & Olsson (2005), Science 310:116-119 (text: objekt-papers/johansson-2005.txt; card
  docs/cards/johansson-2005.md). 120 participants, faces swapped by a card trick: "With a total of 354
  manipulated trials performed, only 46 (13%) were detected concurrently"; reasons for the swapped face did not
  differ from reasons for real choices; 13.3% of them named features only the swapped face had.
- Hall, Johansson & Strandberg (2012), "Lifting the Veil of Morality: Choice Blindness and Attitude Reversals on a
  Self-Transforming Survey", PLoS ONE (text: objekt-papers/hall-2012.txt). 160 volunteers; "a full 69% of the
  participants failed to detect at least one of two changes"; people "often constructed coherent and unequivocal
  arguments supporting the opposite of their original position".
- Hall, Johansson, Tärning, Sikström & Deutgen (2010), "Magic at the marketplace: Choice blindness for the taste
  of jam and the smell of tea", Cognition 117:54-61 (cited as ref. 22 in hall-2012.txt). This is the nearest to
  products on a table; NOT read (not in objekt-papers): its numbers are unverified.
- Still open and recent (from search listings, not read, unverified): a preregistered study where changed answers
  shifted a week later even in a no-deception arm; an online study of 498; choice blindness in pension choices
  (Dec 2024); in autistic and non-autistic people (J. Cognitive Psychology, 2024); religious attitudes (2025,
  https://www.tandfonline.com/doi/full/10.1080/2153599X.2025.2557482). VR versions exist only as small conference
  papers: "Virtual Blindness" with a virtual experimenter (2015,
  https://link.springer.com/chapter/10.1007/978-3-319-21996-7_47) found fewer and later detections in high
  immersion; a 2019 UIST adjunct VR paper reported 92% missed a mismatch (both unverified, not read).

### 3c. Price as a cue to quality: marketing placebo (read)

- Plassmann, O'Doherty, Shiv & Rangel (2008), "Marketing actions can modulate neural representations of
  experienced pleasantness", PNAS 105(3):1050-1054. https://rnl.caltech.edu/publications/pdf/plassmann2008.pdf
  - 20 subjects; three wines shown as five: wine 1 at "$5 real retail price, $45 fictitious price", wine 2 at
    "$90 real retail price, $10 fictitious price", a $35 distracter.
  - "increasing the price of a wine increases subjective reports of flavor pleasantness as well as
    blood-oxygen-level-dependent activity in medial orbitofrontal cortex"; pleasantness correlated with price
    (r = 0.59); no effect on taste intensity.
  - Blind retasting 8 weeks later without prices: "there were no reported differences among the wines".
  - The authors' own caveat: "some subjects might deem it inappropriate to report to the experimenter that a
    cheaper wine tastes better" (experimenter demand). Subjects "were not debriefed" (Caltech's small pool): we
    would debrief everyone.
- Shiv, Carmon & Ariely (2005), "Placebo effects of marketing actions: Consumers may get what they pay for",
  Journal of Marketing Research 42(4):383-393, DOI 10.1509/jmkr.2005.42.4.383: people who paid a discounted price
  for an energy drink solved fewer puzzles. Full text NOT read; the drink and prices ($1.89 vs $0.89) come from
  secondary summaries: UNVERIFIED. https://fds.duke.edu/db/aas/Economics/faculty/dan.ariely/publications/265982

### 3d. What our version would test that is new (our design reasoning, not a published finding)

- Known: people give confident reasons for choices driven by things they do not report (3a, 3b); a price label
  changes reported quality of the same thing (3c).
- Not covered by the work read here: (1) a price on an object that is worthless to everyone, since a VR phone
  cannot be owned or used; taking the "$10,000" phone costs nothing, so it isolates the price cue from any real
  gain; (2) whether the reasons name the price or invent features ("calls better"), coded from the player's own
  words, which is Nisbett & Wilson's question asked of thousands; (3) a Plassmann-style quality test inside VR:
  both phones play the SAME call audio and the player rates the sound; does the "$10,000" phone sound better?
  (4) left/right position counterbalanced, so the position effect is measured on the side.
- Sketch: two identical phones, labels $10,000 / $10 (sides random) → "take one" (grab with hand) → "why?"
  (voice optional, else pick from reasons incl. "the price") → "call someone" on each, same audio, rate sound →
  reveal: same phone, same sound, your reason, and the share of players who said the same.
- Before design: read Nisbett & Wilson 1977 and Hall et al. 2010 in full (rule 16); both are missing from
  objekt-papers.

## 4. Running and publishing our own study

### 4a. Ethics review without our own university

- US, a university IRB reviewing outsiders for a fee. University of Southern Maine (schedule "Updated
  06/30/2026"), reviews "non-USM research projects as a service to the general community" for any "institution or
  individual investigator who needs a review by a federally registered IRB with a Federalwide Assurance":
  "Exempt determination: $500.00"; "Expedited IRB review: $750.00"; "Full Board convened IRB review: $1,500.00";
  exempt renewal "$250.00" at least every 3 years.
  https://usm.maine.edu/orio/wp-content/uploads/sites/361/2022/07/IRB-External-Reviews-Fee-Schedule.pdf
  (read from the PDF text).
- Other public fee lists seen only in search snippets (unverified): Rutgers exempt $250 for unaffiliated PIs
  (2020, https://research.rutgers.edu/node/5291); Washington State IRB $2,000 expedited (2015,
  https://www.dshs.wa.gov/ffa/human-research-review-section/wsirb-fees). Commercial IRBs (Advarra, BRANY) send
  fee schedules on request; BRANY's form has an "Independent Investigator/Researcher" and social-behavioral
  (SBER) option (https://www.brany.com/?p=7702, snippet only). No commercial IRB price was found published.
- Russia: the Russian Psychological Society's Ethics Committee (https://psyrus.ru/rpo/structure/ethics.php refused
  our tools; the owner downloaded its documents). Its Regulation (pologenie_etick_kodeks_16.10.2013.doc, read in
  full) makes it "a standing consultative and regulating body of the RPO on the psychologist's professional ethics"
  (1.2, our translation); its functions (2.2) are explaining the code, complaints against psychologists, sanctions
  and changes to the code, not reviewing research projects. The other file (materiali_efpa.doc: EFPA guidance on
  complaints and forensic work) has no project review either. So ethics approval goes to a university or an IRB.
- EU: not reached in this pass (no central body found; national and university committees). Not found.

### 4b. Preregistration

- AsPredicted: pre-registrations are time-stamped single-page PDFs; "Pre-registration remains private until an
  author makes it public"; linked to CredLab at Wharton (UPenn). Price and question count not on the home page
  (unverified). https://aspredicted.org/
- OSF: not read in this pass (unverified).

### 4c. Data rules

- GDPR Art. 9(1): special categories include biometric data processed "for the purpose of uniquely identifying a
  natural person" and "data concerning health"; Art. 9(2)(a) allows them with "explicit consent ... for one or
  more specified purposes"; 9(2)(j) allows research use only when based on Union or Member State law.
  https://gdpr-info.eu/art-9-gdpr/ — so head and hand motion, voice and gaze become special-category data the
  moment they are used to recognise a person; kept for behaviour only, the line is a legal question (unverified).
- Russia, 152-FZ Art. 11(1): biometric data are data on physiological and biological features "on the basis of
  which his identity can be established" (our translation); when used to identify, they "may be processed only with
  the written consent of the data subject" (our translation). https://www.consultant.ru/document/cons_doc_LAW_61801/7336c78762a98b5f4f698b8c3800dca1111acc16/
- Russia, 152-FZ Art. 18(5) (as amended by 23-FZ of 28.02.2025): collecting data of Russian citizens, including
  over the internet, "using databases located outside the territory of the Russian Federation is not allowed"
  (our translation; except listed cases). https://www.consultant.ru/document/cons_doc_LAW_61801/cbf4e15b7c330f9372e876cdf2bc928bad7950ef/
  Consequence for us: personal data of Russian players must first land in a database in Russia; anonymous data
  that cannot identify anyone is outside the law's scope (that reading is ours: a lawyer should confirm).

### 4d. Partnering with a university (examples from the pages read)

- Sea Hero Quest: a company (Deutsche Telekom) and a game studio with UCL and UEA scientists (1b). LabintheWild
  studies are run by Harvard researchers (Huber & Gajos 2020, 1b). A university IRB can also review an outside
  investigator for a fee (USM, 4a). Grant routes exist for many-lab work (KLI, up to 9,000 euros, unverified).
  Costs of a partnership itself: not found.

## 1d. Open questions the field says need data (from the pages read; no published "agenda list" was found)

- Robustness: Many Labs 2 replicated 14 of 28 (link in 1a). A VR doorway study "call[s] into question the
  generalisability and robustness of this effect" (McFadyen et al. 2021, below). Online VR effects come out
  smaller (Huber & Gajos 2020: d 0.34 vs 1.23).
- Who is sampled: home Quest owners were 86% male, median age 26; "claims about generalizability should be avoided"
  (Mottelson et al. 2021, verified in docs/research/vr/06-science.md). Cultures: the PSA runs moral-dilemma
  judgments across countries (psysciacc.org). Russian-speaking VR players are a sample none of the papers read had.

## 2. Candidate experiments for our setup (one player, 5-10 min, hands and head tracked, voice optional)

Format: builds on / still unknown / what VR at scale adds / sketch. "Unknown" is from the paper where quoted,
otherwise our reading (marked). Fit rules from 06-science.md: no high-stress or startle content unsupervised at
home (Steed et al. 2016, doi:10.1109/TVCG.2016.2518135); compare conditions within our players only.

1. Two phones (the owner's idea). Plassmann et al. 2008; Shiv et al. 2005; Nisbett & Wilson 1977 (part 3). / A
   price cue on an object worth nothing to anyone; whether stated reasons name the price (ours). / Thousands of
   choices, the grab itself, head-direction dwell on each phone before choosing. / Part 3d.
2. Choice blindness with the hand. Johansson et al. 2005; Hall et al. 2012 (objekt-papers). / VR versions are
   small conference papers only (3b, unverified); trick-aware players are the authors' own failure case. / Choice
   by grasp, detection measured at scale, prior knowledge logged. / Pick the nicer of two objects 10 times; 2 are
   swapped when pocketed; "why this one?"
3. Moral action vs judgment. Francis et al. 2016, PLoS ONE 11(10):e0164374 (objekt-papers/francis-2016.txt):
   "a greater endorsement of utilitarian responses ... when action was required" than in judgment. At home:
   Kissel et al. 2023, Societies 13:69 (33 valid; 5 said their logged action was accidental; 06-science.md). /
   Does the gap hold in thousands, across cultures? (ours) / Hesitation time, aborted hand movements. / Judge a
   (non-gory) dilemma in words, then meet it with a lever; ask "was that what you meant?"
4. Proteus effect (avatar height and bargaining). Huber & Gajos 2020 (1b): online replication with d 0.34 vs
   1.23, only 27 headset users. / Its size with a tracked first-person body (ours). / Real embodiment, many
   players. / Random avatar height seen in a mirror, then split 100 points with an agent.
5. Doorway effect. McFadyen et al. (2021), "Doorways do not always cause forgetting: a multimodal investigation",
   BMC Psychology 9:41, https://link.springer.com/article/10.1186/s40359-021-00536-3 (read in the browser): "we
   observed no significant effect of doorways on forgetting", except under working-memory load in VR. / Whether the
   effect exists; the paper asks "what factors contributed to the effect observed in previous studies". / Our
   building is a corridor of doors; huge N settles a small effect. / Carry an object through a door vs the same
   distance in one room; a memory probe halfway.
6. Cheating with a virtual observer. Mol, van der Heijden & Potters (2020), Experimental Economics,
   https://link.springer.com/article/10.1007/s10683-020-09644-0 (search snippet only, unverified: an active
   watching avatar gave less cheating than a passive one, not less than no avatar). / Whether it holds with points
   instead of money (ours). / Lying is seen only in the distribution, never per person: no one is accused. / Roll
   a die privately, report for points; observer watching, looking away, or absent.
7. Navigation with the body. Spiers et al. 2023 (1b): 3.9 million players, male advantage in all 63 countries. /
   Whether phone-game scores hold when the body turns in VR (ours). / Head and body turns logged. / Study a map,
   then reach three targets in a building.
8. Social influence in an emergency. Kinateder & Warren 2016, doi:10.3389/frobt.2016.00043 (06-science.md): 68%
   of VR participants thought the alarm was staged; responses smaller than real. / Plausibility when players
   expect tricks. / Weak fit: startle at home (Steed et al.).
9. Conformity to virtual agents. Kyrlitsias & Michael-Grigoriou 2018; Kyrlitsias et al. 2020,
   doi:10.3389/fpsyg.2020.02254 (06-science.md): unambiguous task 1.14% wrong; ambiguous 5-s task 63% conformed
   at least once. / What makes agents count as a group. / Ambiguous judgment after agents answer aloud.
10. Obedience (Slater et al. 2006; Gonzalez-Franco et al. 2018, 06-science.md): obedience higher in VR. Not
   recommended for home play: distress without a supervisor.

## 5. Risks to data quality and how studies handle them

- Inattention: about 13% online vs 3% in the lab; "approximate 10% ill-intended"; over-recruit and fix an
  objective exclusion rule in advance (Mottelson et al. 2021, 1c). Hand tracking: a screening step cut bad data
  from 27% to 8% (same).
- Drop-out: one in-the-wild VR study kept 59 of about 400 installs, "a rate of return of 15%" (Steed et al. 2016,
  06-science.md). Accidental one-shot choices: 5 of 33 (Kissel et al. 2023).
- Repeat players: Chandler, Paolacci, Peer, Mueller & Ratliff (2015), Psychological Science 26(7):1131-1139,
  doi:10.1177/0956797615585115: Many Labs tasks repeated gave smaller effects (weighted d 0.82 to 0.63), most when
  the condition changed (search snippets of https://www.psychologicalscience.org/journals/psychological-science/0956797615585115/;
  unverified). Handling: log first vs repeat run; analyse first runs; keep the condition per device.
- Bots: Westwood (2025), PNAS, https://www.pnas.org/doi/10.1073/pnas.2518075122: AI agents "evade nearly all
  existing detection methods"; "as few as 10 to 52 fake AI responses" could have flipped 2024 polls (Dartmouth,
  https://fas.dartmouth.edu/news/2026/04/sean-westwood-wins-pnas-prize-ai-polling-study). Paper itself not read.
  A WebXR run with tracked head and hands is harder to fake than a web form: our inference, untested.
- Suspicion: 68% in VR thought the alarm staged (Kinateder & Warren 2016); suspicion probes miss about half
  (Blackhart et al. 2012; both in 06-science.md); Johansson et al. expect "most participants" to spot a switch if
  told to look (card johansson-2005.md). Handling: open-first suspicion and prior-knowledge probe before the
  reveal, analysed as a moderator, preregistered.
- Self-selection: 86% male, median 26 (Mottelson et al. 2021). Report "you vs other players", never "vs people".

## Not reached / unverified

- Not read in full: Nisbett & Wilson 1977; Hall et al. 2010 (jam and tea); Shiv et al. 2005; Westwood 2025;
  Chandler et al. 2015; Mol et al. 2020; Yee & Bailenson 2007. Not found: EU review bodies for non-university
  research; OSF preregistration details; AsPredicted price; any published commercial IRB price; the PSA projects
  list and member count.
