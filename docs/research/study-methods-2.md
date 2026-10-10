# How a lab runs a study, applied to one game room (part 2 of 2: study plan, ethics, VR practice, checklist)

Part 1 (seriousness, data quality) is in study-methods-1.md. Same rules: link + short quote; "unverified" = snippet only.

### 3a. Preregistration: AsPredicted's eight questions (read from its own example PDF)

- https://aspredicted.org/ : "Pre-registration remains private until an author makes it public"; public ones
  "cannot be modified and are automatically backed up in the Web Archive"; "single page PDFs that are time-stamped
  and include a unique URL for verification". Cost: not stated on the page (unverified).
- Questions, verbatim from the example https://aspredicted.org/kv692.pdf :
  1 "Have any data been collected for this study already?"
  2 "What's the main question being asked or hypothesis being tested in this study?"
  3 "Describe the key dependent variable(s) specifying how they will be measured."
  4 "How many and which conditions will participants be assigned to?"
  5 "Specify exactly which analyses you will conduct to examine the main question/hypothesis."
  6 "Describe exactly how outliers will be defined and handled, and your precise rule(s) for excluding observations."
  7 "How many observations will be collected or what will determine sample size?"
  8 "Anything else you would like to pre-register?"
- The example screens out people who fail an attention check before the dependent variable is asked (screening, not
  post-hoc exclusion): the same pattern as a playable instruction check before the critical moment in a room.
- For a game room: one AsPredicted form per room, filed before the room's data are used for science (Q1 must be
  answerable "no data looked at"); data from the free floor played before the filing count as pilot only.

### 3a (cont.). OSF registration templates (OSF help page)

- https://help.osf.io/article/229-select-a-registration-template : "OSF Preregistration": "Standard, comprehensive,
  and general purpose preregistration form"; "Preregistration Template from AsPredicted.org": "Eight questions derived
  from content recommended by AsPredicted.org"; and, directly for us, "Replication Recipe (Brandt et al., 2013):
  Pre-registration": "Register a replication study with a series of questions regarding the original work" (plus a
  Post-Completion version). Also "Registered Report Protocol Preregistration" (after in-principle acceptance).
- Embargo "for up to four years"; a registration "can never be edited or deleted" (it can be withdrawn).
- For a game room that recreates a classic study: the Replication Recipe template fits (each room = a replication
  of a named original); a new-twist room (our own variation) uses OSF Preregistration or AsPredicted.

### 3b. Registered reports (Center for Open Science page)

- https://www.cos.io/initiatives/registered-reports : "methods and proposed analyses are pre-registered and
  peer-reviewed prior to research being conducted". Stage 1 = Introduction, Methods, pilot data, judged on "the
  importance of the research question and the quality of methodology"; on passing, in-principle acceptance: the
  journal "virtually guarantees publication" if the protocol is followed. Stage 2 cannot be rejected because results
  are "surprising, counterintuitive, or unappealing"; unplanned analyses go to "Exploratory Analyses". "over 300"
  journals offer the format.
- For us: the route to publication once a university partner and ethics approval exist; the room's design is fixed
  and reviewed BEFORE data that count are collected.

### 3c. Sample size and power (Lakens, Improving Your Statistical Inferences, ch. 8, online book)

- https://lakens.github.io/statistical_inferences/08-samplesizejustification.html (the journal version, Lakens 2022,
  Collabra: Psychology 8(1):33267, is behind a bot check for our tools: owner list).
- Six ways to justify N: "Measure entire population", "Resource constraints", "Accuracy", "A-priori power analysis",
  "Heuristics", "No justification".
- Smallest effect size of interest: "can be based on theoretical predictions or practical considerations".
- Using the original paper's effect for power only if "the previous study is sufficiently similar", "there was a low
  risk of bias", and "the sample size is large enough to yield a relatively accurate effect size estimate"
  (classic small-sample studies usually fail the third: our reading).
- Small telescopes heuristic for replications: "design replication studies that have 2.5 times as large sample
  sizes as the original study, as this provides 80% power for an equivalence test against an equivalence bound set
  to the effect the original study had 33% power to detect, assuming the true effect size is 0."
- Simonsohn (2015), "Small Telescopes: Detectability and the Evaluation of Replication Results", Psychological
  Science 26(5):559-569, doi:10.1177/0956797614567341; abstract (APS page,
  https://www.psychologicalscience.org/journals/psychological-science/0956797614567341/): tests whether replication
  results are consistent with "an effect size big enough to have been detectable in the original study"; separates
  replications "that are too noisy" from those showing the effect is "undetectably different from zero". Its
  supplement (the owner brought it; objekt-papers/simonsohn-2015-supplement.txt): d33% is the effect the original
  had 33% power to detect (for n = 30 per cell, "d=.401"); "replications with 2.5*original sample size have 80% power
  to reject d33%".
- For a game room: N per room = max(2.5 x original N, N from an a-priori power analysis on a smallest effect of
  interest), counted AFTER exclusions and first runs only; then inflate for the expected exclusion rate (2e).

### 3e. Judging a replication: Many Labs 2 (APS Observer report)

- https://www.psychologicalscience.org/observer/replications-dont-hinge-on-sample-and-setting-differences-multilab-project-shows :
  samples "on average were more than 60 times larger than the original samples"; procedures "peer-reviewed in
  advance by experts and, in some cases, authors on the original work"; 14 of 28 replicated, "some at variable
  degrees across the different labs"; framing effect "only half as strong".
- The paper itself (Klein et al. 2018, AMPPS 1(4):443-490; the owner brought it; objekt-papers/klein-2018.txt):
  "There is no simple decision rule for declaring success or failure in replication"; five criteria, each "whether
  the observed effect size would be considered statistically significant": the replication data at p < .05 (54%)
  or p < .0001 (50%), or the observed effect at the original N, at 2.5 x the original N, or at 50 per group, p < .05
  (41%, 44%, 35%). "Ten of the effects (36%) were successfully replicated according to all the criteria", 13 (46%)
  failed all, 5 (18%) varied. Median d in WEIRD samples "0.60 for the original findings and 0.15 for the
  replications"; 21 of 28 replication effects smaller than the original; 9 in the opposite direction.
- Practice to copy: show the room's protocol to an outside expert (ideally an original author) before data count;
  report the effect with its CI next to the original, plus the small-telescopes test (3c).

### 4a. APA Ethics Code, exact text (local objekt-papers/apa-ethics-code-2017.txt; "Effective January 1, 2017")

- 8.02(a) consent tells: "(1) the purpose of the research, expected duration, and procedures; (2) their right to
  decline to participate and to withdraw ... (3) the foreseeable consequences of declining or withdrawing; (4) ...
  potential risks, discomfort, or adverse effects; (5) any prospective research benefits; (6) limits of
  confidentiality; (7) incentives for participation; and (8) whom to contact for questions".
- 8.05: consent may be dispensed with only where research "would not reasonably be assumed to create distress or
  harm" and involves e.g. "only anonymous questionnaires, naturalistic observations, or archival research". A VR
  experiment with a manipulation is not in that list: consent is needed (our reading).
- 8.07(a) deception only if "justified by the study's significant prospective scientific, educational, or applied
  value and that effective nondeceptive alternative procedures are not feasible"; (b) never about research "reasonably
  expected to cause physical pain or severe emotional distress"; (c) explain deception "as early as is feasible,
  preferably at the conclusion of their participation, but no later than at the conclusion of the data collection,
  and permit participants to withdraw their data".
- 8.08(a) "a prompt opportunity for participants to obtain appropriate information about the nature, results, and
  conclusions of the research" and correct misconceptions; (b) if delaying, "reasonable measures to reduce the risk
  of harm"; (c) if harmed, "reasonable steps to minimize the harm".
- For a game room: 8.07(c) maps onto the reveal at the end of the room AND a "withdraw my data from this room" button
  on the reveal screen; 8.08(a) "results and conclusions" = the original study's findings shown in the reveal.

### 4b. BPS (local objekt-papers/bps-2021-code.txt, bps-2021-imr.txt; basics already in 06-science.md)

- Withholding vs lying: "There is a difference between withholding some of the details of the hypothesis under test
  and deliberately falsely informing the participants of the purpose of the research"; if the reveal is "likely to
  lead to discomfort, anger or objections" the deception "is inappropriate".
- Online gaming is named: research on rewards "might include the use of online gaming. There is often a degree of
  deception involved ... Suitable debriefing will be required."
- Mood repair: after inducing negative mood, "it would be ethical to induce a happy mood state before the
  participant leaves".
- IMR: a "Quit study" button "which can lead to a debrief page" so people who leave early still get the debrief; an
  "exit" on each page, then ask "whether their partial data can be used".

### 4c. Suspicion probes and funnel debriefing (Blackhart, Brown, Clark, Pierce & Shell 2012; local objekt-papers/blackhart-2012.txt)

- Behavior Research Methods 44:24-40, doi:10.3758/s13428-011-0132-6. Survey of 77 deception researchers: most ask
  "what they thought the study was about"; 21% also ask whether anything was "weird, strange, odd, or out of place";
  "55%" use "a funnel debriefing, beginning with very basic questions (e.g., 'Do you have any questions about the
  study?') and ending with more specific questions about the study before debriefing participants"; 23% run the
  inquiry "on the computer".
- Their integrity preface (tested on 624 people): "Your answers to these questions will in no way affect the
  research credit you will receive, nor how we use your data. We just want to ensure that the design of the study is
  sound"; the authors say it "could have used stronger language".
- Conclusion: the post-experimental inquiry "does not appear to be able to reliably and accurately assess
  participant suspicion and awareness" (so: measure suspicion, analyse it as a moderator; do not trust it as a filter).
- Bargh & Chartrand (2000) funnel-debriefing chapter: not found online in this pass (book chapter): not found.

### 5a. VR reporting standard: the Openverse protocols (PNAS 2026) and vrprotocols.org

- Zelderen, Masters-Waage, Affinito, ... Banakou, ... Draschkow ... (2026), "Creating common virtual ground:
  Protocols to democratize open VR research", PNAS 123(26), doi:10.1073/pnas.2524991123 (record and abstract via Europe
  PMC: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1073/pnas.2524991123&format=json&resultType=core).
  Abstract: "an interactive checklist to support VR research from across disciplines to meet three essential
  protocols-interoperability, procedural standardization, and data sharing", "a common, easy-to-evaluate format
  for researchers to present projects to ethics boards, reviewers, and beyond". Full text read (6 pages, the owner
  brought it; PNAS Perspective, published 24 June 2026, CC BY-NC-ND; copy objekt-papers/van-zelderen-2026.pdf, image
  only, no text layer). Built "through a Delphi process". Procedural standardization has five areas: "reporting VR
  procedures, standard battery of measurements, ethics, accessibility, and safety"; VR familiarity is measured
  because "participants' VR experiences ... can strongly predict effect sizes in VR studies". The standards "do not
  adjudicate what is or is not acceptable in human-subjects research - that responsibility lies with ethics
  committees"; "the psychological realism inherent in VR can render scenarios that appear benign in written or video
  form, substantially more intense for participants". Cybersickness: "prioritizing seated experiences with no
  locomotion, restricting the field of view during movement, and blurring dynamic nonsalient regions". For a
  commercial product: "To prevent misuse (e.g., third parties illegally downloading the VR application for commercial
  purposes), researchers may opt to make their assets available only to other researchers upon reasonable request".
  Repository https://github.com/Openverse-OS/VR-Protocols (Zenodo 10.5281/zenodo.19442410). Leads in its references:
  Steed et al. 2023 (distributed and remote MR experiments, Front. Comput. Sci. 4:966319), Draschkow 2022 (remote VR
  and external validity, Nat. Rev. Psychol. 1:433-434), Gonzalez-Franco et al. 2018 (a VR Milgram, PLOS ONE).
- https://www.vrprotocols.org/ (opened in the browser): pillars "Pillar 1: Interoperability", "Pillar 2: Procedural
  Standardisation", "Pillar 3: Data Sharing", plus "Health, Safety, and Ethics"; workflow "Plan Your Project" ->
  "Conduct Research" -> "Audit & Submit" (export a checklist as JSON/Word/PDF, self-audit at the end). The item list
  appears only after ticking badges; the owner ticked all four and exported the checklist (v.0.62, 10.10.2026, 8
  pages; copy in objekt-papers/vrprotocols-checklist-v0.62.pdf). All items "Required". What it asks, and where we
  stand (our reading):
  - Interoperability: common formats and engines, assets listed in a repository with version numbers (engine and
    tools), version control, OpenXR and SDK versions. Ours: public git repo, A-Frame pinned in vendor/; WebXR is the
    browser's standard, not OpenXR itself (to state in the report).
  - Reporting: simulation name and version; trial length incl. breaks; "simulation mode" (on the headset) and
    researcher involvement; "observatory condition" (who watches); HMD make, resolution, field of view, refresh rate;
    the physical space; participant instructions incl. "training or familiarization periods" and their duration;
    the tasks. Ours: at home, unattended, the player's own room: to report as such.
  - Standard battery: a presence measure ("IPQ, SUS, or SPES") and VR familiarity ("Self-rated familiarity, 2 items").
  - Ethics: consent names cybersickness and possible distress, "withdraw at any time without penalty"; informed
    choices on biometric and interaction data; GDPR; "robust encryption ... in transit and at rest"; explicit use and
    reuse of data; IRB approval; distressing scenarios named in the consent; harm mitigation; virtual humans keep out
    of the participant's personal space unless the question needs it.
  - Accessibility: not colour alone; adjustable size and distance; dominant-hand choice; hand or controller and a
    seated alternative; subtitles that can be turned off; few buttons; highlighted interactables; small steps.
  - Safety: 90 Hz or more and 6DoF; IPD set; boundary system; "Avoid leaving ambulatory participants in VR
    unattended" (at home we cannot: a deviation to declare, seated or standing tiers only); audio level; natural
    locomotion; smooth movement; "Gradual Acclimation ... starting with simple, low-intensity tasks" and "Controls
    Training" (the owner's warm-up idea is the standard's own step); a comfort rating told beforehand; rest.
  - Data sharing: rights to share the simulation and assets; readme; the complete simulation and assets; participant
    data as a benchmark; open repository; csv with a codebook; head orientation and other automatic output "in a
    separate file"; analysis reproducible in two steps; the repository link in the paper.
  - Items that appear only for some project features (the full live list the owner sent, and the exported project
    file objekt-papers/vrprotocols-project-v0.62.json): "Detail Deviations" (off OpenXR: name the SDK and the headsets
    it runs on: ours, WebXR in the Quest browser); hardware and software reported; open source for custom software;
    asset EULAs, repurposed or reputable-store assets; controllers and motion tracking described; the code of the
    virtual environment uploaded; sensitive variables removed before sharing; analysis code also in plain text; and
    "Prevent Reidentification": body or eye tracking never combined with other data that could re-identify a person.
- Other checklists seen only in search results (unverified): Skorupska et al., "All Factors Should Matter!" (arXiv
  2101.01285), a reference checklist of hardware, software and human factors for describing IVR experiments;
  VR-Check (Krohn et al. 2020, JMIR, PMC7215516), 10 dimensions for clinical neuropsychology VR paradigms.
- For a game room: run the room through vrprotocols.org's checklist (all four badges) and keep the exported JSON
  with the room's preregistration; it is the newest field standard and is aimed at ethics boards and reviewers.

### 5b. Simulator sickness: how the SSQ is meant to be used (Kennedy et al. 1993; local objekt-papers/kennedy-1993.txt)

- Int. J. Aviation Psychology. Scoring weights in the paper: Nausea = [1] x 9.54; Oculomotor = [2] x 7.58;
  Disorientation = [3] x 13.92; Total = ([1]+[2]+[3]) x 3.74.
- Pre-screen: a "pre-exposure checklist" asked whether people were "sick" or not in their "usual state of fitness";
  "Records from subjects who reported themselves as 'other than healthy' were excluded"; the scoring "is intended
  only for application to postexposure symptoms, with the further precondition that a screening of 'unhealthy'
  subjects is required".
- For a game room: one pre-room question ("feeling well right now?"); a no answer = play allowed, run not used for
  science; the full 16-item SSQ is too long for every room (our reading); a short post-room sickness item plus
  drop-out logging (06-science.md, Pan & Hamilton; Mottelson 2021) is the practical minimum. Presence: IPQ details are
  in 06-science.md (not repeated).

### 5c/5d. Frame rate, tracking loss, interruptions, play area: what WebXR itself reports (W3C spec, read)

- WebXR Device API, W3C Candidate Recommendation Snapshot, https://immersive-web.github.io/webxr/
- Frame rate: "The frameRate attribute reflects the internal nominal framerate"; supportedFrameRates "returns a list
  of supported target frame rate values"; updateTargetFrameRate(rate) sets the target. -> log the nominal rate and the
  measured frame times per run.
- Interruptions: visibilityState "visible" / "visible-blurred" (seen but "not the primary focus", input not
  processed) / "hidden" (imagery "cannot be seen by the user", frame callbacks pause). -> log every state change
  with time; a run with "hidden" during the critical moment is flagged (headset off or system menu).
- Tracking quality: emulatedPosition "is false when the transform represents an actively tracked 6DoF pose ... or
  true if its position value includes a computed offset, such as that provided by a neck or arm model". -> log the
  flag per frame for head and each hand.
- Tracking loss / recentre: a "reset" event fires on "discontinuities of the native origin", e.g. "After user
  recalibration of their XR device or if the XR device automatically shifts its origin after losing and regaining
  tracking", and when boundsGeometry changes; not for momentary loss "within the same tracking area".
- Play area: boundsGeometry "MUST report an empty array" during "extended periods of tracking loss"; bounded-floor
  "Always requires consent". -> log reference-space type and bounds size if granted.
- Session end is "permanent and irreversible" ("end" event): log it; an ended-early run is a drop-out, reported per
  condition (Mottelson 2021 checklist, 06-science.md).
- Hardware differences (06-science.md, not repeated): absolute performance depended on hardware (Mottelson &
  Hornbaek 2017); built-in timing off by about 55 ms in a native engine (Wiesing et al. 2020); browser RT delays
  70-120 ms (Anwyl-Irvine et al. 2021) -> compare conditions within the same device type; log device model.

### 3d. Randomisation, counterbalancing, within vs between (from texts read; the general standards were not opened)

- Within-design exposure lowers effects: Chandler et al. 2015 (local): attenuation was strongest when people saw the
  other condition, "analogous to participating once in a within-participant experiment (Greenwald, 1976)". -> a
  deception or one-shot room is between-subjects: one condition per player, first run only.
- Between-design cost: Lumsden et al. 2016: a between design "confounds hardware/individual differences with
  effects caused by the task variant", offset by "the large sample size" online. -> stratify or block by device model.
- Simple randomisation in the wild leaves cells unequal: Steed et al. 2016 (local): "participants are randomly
  assigned and are not matched in any way. Thus the conditions are not balanced." -> assign in shuffled blocks
  (our reading; block randomisation is the trial standard, e.g. CONSORT: not opened in this pass).
- Position and order: counterbalance left/right and order of options within the room (the two-phones sketch in
  own-experiments-now.md already does this); log the assigned side/order.
- Charness, Gneezy & Kuhn (2012), "Experimental methods: Between-subject and within-subject design", J. Economic
  Behavior & Organization 81:1-8: between-subjects "more conservative", demand effects stronger within (search
  snippet only: unverified; the PDF tried was a CV, not the paper).

## 6. Checklist: how a lab runs a study, applied to one game room

Each step: what to do -> source (file section). "Ours" = our adaptation where no source sets the detail.

1. Choose the original study and read it in full; note its N, effect size, procedure, exclusions -> project rule;
   Lakens ch. 8 (3c) for whether its effect can drive power.
2. Decide what is replicated exactly and what changes for VR; write it as a Replication Recipe -> OSF template (3a).
3. Fix the design: between-subjects for one-shot or deception rooms; first run per player only; conditions in shuffled
   blocks, stratified by device; counterbalance sides/order -> Chandler 2015, Steed 2016, Lumsden 2016 (3d, 2c).
4. Set N: max(2.5 x original N, a-priori power on a smallest effect of interest), after exclusions; recruit
   1.2-1.35 x for exclusions -> Lakens/Simonsohn (3c), Mottelson 2021, Chandler 2015 (2e).
5. Write exclusion rules before any data: instruction check failed, nonserious answer, felt unwell, "hidden" or
   tracking loss during the critical moment, run ended early, repeat run, admitted trick, prior knowledge of the
   classic -> Aust 2013, AsPredicted Q6, Kennedy 1993, WebXR spec (1a, 3a, 5b, 5c).
6. Preregister (AsPredicted 8 questions or OSF) before the data count; for a journal, a registered report Stage 1
   -> AsPredicted, OSF, COS (3a, 3b).
7. Ethics: approval by an IRB/REC before science use; deception only if justified and no alternative; no pain or
   severe distress -> APA 8.07(a)(b); BPS 7; ethics routes in own-experiments-now.md 4a.
8. Run the room through the VR Protocols checklist (all badges); keep the JSON with the preregistration ->
   Openverse 2026, vrprotocols.org (5a).
9. Consent screen with the eight APA 8.02 elements, stating that some details are withheld until the end -> APA
   8.02(a); BPS 4.1 (4a, 4b).
10. Pre-room health question ("feeling well?") -> Kennedy 1993 (5b).
11. Commitment request ("play it for real?") -> Geisen 2022 (1b); not a pledge -> Kristal 2020 (1b).
12. Practice + playable instruction check that repeats until done right -> Oppenheimer 2009 (1d).
13. The critical moment: same stimulus timing/readability as the paper; no points or decoration on the measured
    response -> Lumsden 2016 (1e).
14. Log: condition, side/order, run number, device model, nominal frame rate and frame times, visibilityState
    changes, emulatedPosition flags, reset events, session end, time on task -> WebXR spec (5c); Mottelson 2021
    checklist (06-science.md).
15. Quit button on every screen that leads to the reveal/debrief -> BPS IMR (4b).
16. Before the reveal: suspicion probe, open first ("what do you think this room was testing?", "anything odd?"),
    then prior knowledge of the classic; with a no-consequence preface -> Blackhart 2012 (4c); Orne 1962 (06-science.md).
17. Seriousness question at the end with "don't count it" -> Aust 2013 (1a); no-blame distraction/trick question +
    comment -> Reinecke & Gajos 2015 (1f).
18. Reveal = debrief: what was hidden and why, the original findings, how the player compares with other players;
    name the specific manipulation; mood repair if needed -> APA 8.07(c), 8.08(a); BPS 10; Greenspan & Loftus 2022
    (06-science.md); LabintheWild feedback (1f).
19. After the reveal: "withdraw my data from this room" -> APA 8.07(c); BPS IMR (4a, 4b).
20. Analyse exactly as preregistered; exploratory analyses labelled; suspicion as a moderator, not a silent filter ->
    COS (3b); Blackhart 2012 (4c).
21. Judge the replication: effect with CI next to the original, plus the small-telescopes test; report exclusions and
    drop-outs per condition -> Simonsohn 2015, Lakens ch. 8 (3c); Mottelson 2021.
22. Treat the sample as players, not people ("you vs other players"); state it is a self-selected convenience
    sample; stay alert to automated runs -> Westwood 2025 (2b); Mottelson 2021 demographics (06-science.md).

## Not reached / unverified (part 2)

- Behind bot checks or 403 for our tools: Simonsohn 2015 full text (its supplement read, 3c); Hauser
  & Schwarz 2015; Lakens 2022 journal version; Openverse 2026 full text (the vrprotocols.org item list: 5a).
- Not opened: Charness et al. 2012; CONSORT randomisation items; Bargh & Chartrand 2000 funnel debriefing; Meade &
  Craig 2012; Ward & Meade 2023; Curran 2016; AsPredicted price.
