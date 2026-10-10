# Labs running experiments outside the lab, part 2 (parts list and part 1 in field-labs-1.md)

### 9. Project Implicit (non-profit; IAT demo site at Harvard's domain; IRB at University of Virginia; USA)
- LIVE FLOW WALKED: "Preliminary Information" page before choosing a test,
  https://implicit.harvard.edu/implicit/takeatest.html (read 2026-10-10):
  - Why extra questions: optional attitude questions because "the IAT can be more valuable if you also describe
    your own self-understanding"; warning up front: "Your IAT results may depart from your personal beliefs."
  - Age gate: "You must be 18 years of age or older to participate. Visitors between 14-17 years of age may visit
    Project Implicit Youth." (a separate youth site).
  - Data: "IP addresses are routinely recorded but are completely confidential. For research purposes, data
    without directly identifying information is made publicly available."
  - Disclaimer: the universities "make no claims about the validity of these suggested interpretations. If you are
    unprepared to encounter interpretations you might find objectionable, please do not proceed further."
  - Contact for leaving early: "Share why you left before completing a study"; independent contact: "Chair,
    Institutional Review Board for the Social and Behavioral Sciences ... University of Virginia".
  - Consent = one button sentence: "I am aware of the possibility of encountering interpretations of my IAT test
    performance with which I may not agree. Knowing this, I wish to proceed" (touchscreen or keyboard).
  - Geo-routing to country sites ("It looks like you are taking this from Canada. Click here to go to our Canadian
    site."); the menu has "Donate".
- About page (https://www.projectimplicit.net/about/, via WebFetch): offers to "discuss your research, education,
  or consulting needs" (paid services to organisations: details not on the page, unverified); a "Perception
  Institute" collaboration link (not read). Founders, test counts, OSF data archive: not read (unverified).

### 8. MIT Moral Machine (Awad, Dsouza, Rahwan - MIT Media Lab; Shariff, UBC; Bonnefon, Toulouse; USA/Canada/France)
- Awad et al. (2018), Nature 563:59-64, doi:10.1038/s41586-018-0637-6 - only abstract and extended data were open
  (https://www.nature.com/articles/s41586-018-0637-6): "40 million decisions in ten languages from millions of
  people in 233 countries and territories"; "data, both at the individual level (anonymized IDs) and the country
  level, can be used beyond replication". Robustness checks used "only first completed (13-scenario) session by
  any user" because those respondents "had not seen their summary of results yet" (repeat-play handling).
  Sample skew: "over-representation of males and younger individuals" vs US census data.
- Its open Supplementary Information (read in full, objekt-papers/awad-2018-supplement.txt): "A Moral Machine session
  comprises 13 scenarios, after which the user is presented with a summary of their choices along with how they
  compare to other users", then "an optional survey"; "Users can go through as many sessions as they wish";
  ten languages incl. Russian "through a process of forward-translation and back-translation"; country from
  "approximate geo-location information ... through the IP addresses". The first-session data set exists because
  repeat sessions bring "adapting respondents, who upon seeing a summary of their results decided to make different
  decisions". Checks: scenario order, left-right position, device, description seen. No ethics approval or consent
  wording in the abstract page or the supplement; the Methods are behind the paywall (EUR 39.95, not bought).
- Awad, Dsouza, Shariff, Rahwan & Bonnefon (2020), PNAS 117(5):2332-2337, full text read and saved
  objekt-papers/awad-2020.txt (Europe PMC PMC7007553):
  - Flow: 3 dilemmas ("Classic" mode, from June 2017), text translated "using a translation and back-translation
    process" into 10 languages incl. Russian; "The country ... was geolocalized through the IP address"; after the
    session "users had an opportunity to share the link ... and were presented with an optional survey of their
    demographic, political, and religious characteristics."
  - N: 70,000 participants, 42 countries, "a lower bound of 200 responses per scenario and country"; "About 20,000
    users opted to fill out that survey"; "75% of survey takers were men, 75% were younger than 32".
  - Self-critique: "We relied on voluntary participation in a viral online experiment, and our sample shows clear
    signs of self-selection." Data and code: "deposited in the Open Science Framework".
  - Ethics body: not stated in the main text read (in the SI, not read): unverified.
- Platform: a plain website (moralmachine.mit.edu), no pay; the reward is a summary of your choices vs others
  (the Nature extended data mention the "summary of results").

### 4. Sea Hero Quest (original: Spiers UCL, Hornberger UEA, Deutsche Telekom, studio Glitchers; NOW: St Andrews + Glitchers)
- The CURRENT study on the app (participant information sheet read in full in the browser 2026-10-10,
  https://seaheroquest.com/ethics): "Understanding episodic memory through the lifespan", "James Ainge
  (University of St. Andrews) & Maxwell Scott-Slade (Glitchers Ltd)". Spiers/Hornberger are not named there.
  - Task: daily "quest" of "2-3 sub-games", "about 2-5 minutes each day", play as many or few as you like.
  - Recorded: "anonymous gameplay data only" - "navigation paths and decisions, time taken to complete tasks,
    scores", optional "year of birth, gender, and country", device type and OS; "We do not collect your name,
    email address, precise location". Longitudinal link: "an anonymous linking ID will allow data across days to
    be analysed longitudinally". Withdrawal after submission impossible: "it cannot be withdrawn once submitted".
  - Stored "on a drive on the University of St Andrews network and on UK-based Amazon Web Services cloud servers";
    "retained indefinitely"; "The University of St Andrews and Glitchers Limited are joint controllers".
  - MONEY AND DATA (differs from our rules): "Glitchers Limited offers an optional paid subscription within the Sea
    Hero Quest app that allows you to track your own performance over time and see how it compares to global
    benchmarks" ("not part of this research study"); the anonymous dataset "may also be used by Glitchers Limited
    for commercial purposes, including ... licensing to academic and commercial third parties, such as
    universities, pharmaceutical companies, and digital health companies" and "training ... machine-learning
    systems (including large language models)".
  - Ethics: "granted ethical approval by the University of St Andrews Teaching and Research Ethics Committee" (no
    number); complaints also to the UK ICO, "although note that anonymous research data is generally outside the
    scope of UK data protection law".
  - Benefits: "There are no direct benefits to taking part in the research." Age limit: none stated.
- Original data deal (Telekom release, search snippet only, page returned 404 on fetch: unverified): data "stored
  in a secure T-Systems server in Germany", analysis by UCL/UEA on anonymised data; Telekom "initiated and led".
- Sea Hero Quest VR existed (search listing "saatchi londons award winning sea hero quest jumps to virtual
  reality", lbbonline.com; not read: unverified).

### 5. Stanford Virtual Human Interaction Lab (Bailenson, Stanford, USA)
- Han, Miller, DeVeaux, Jun, Nowak, Hancock, Ram & Bailenson (2023), "People, places, and time: a large-scale,
  longitudinal study of transformed avatars and environmental context in group interaction in the metaverse",
  J. Computer-Mediated Communication 28(2) zmac031, doi:10.1093/jcmc/zmac031. Publication page read
  (https://sml.stanford.edu/publications/hancock-jt/people-places-and-time-large-scale-longitudinal-study-transformed-avatars,
  gives only the DOI). Full text blocked: academic.oup.com returned 403 to fetch and a bot check ("Just a
  moment...") in the browser - goes to the owner.
- From search snippets only (unverified): Study 1, 81 participants in 8 groups meeting 8 times in headsets over
  8 weeks inside a 10-week VR course; Study 2, 137 participants through 192 virtual environments. Headset model,
  where they were worn (home vs campus), consent, IRB, pay or course credit, data storage: all unverified.
- Model to note (unverified detail): the lab runs its at-scale studies inside its own university course (students
  as participants over weeks), not with public players.

### 11. Psychological Science Accelerator and Many Labs (global networks)
- PSA 004 (with CREP): Hall et al. (2024), "Registered Replication Report: A Large Multilab Cross-Cultural
  Conceptual Replication of Turri et al. (2015)", AMPPS 7(4), read from objekt-papers/psa004-gettier.txt.
  - How a network handles ethics: "All contributing project teams were required to submit their local
    institutional ethics approval (if applicable) before data collection as part of their preregistration" -
    i.e. no central ethics board; each site's own committee.
  - Quality gate per site: "Teams could not contribute to data collection until their protocol was approved";
    65 teams signed up, 51 approved, 47 contributed, 45 teams / 37 sites in the final data.
  - Plan: Stage 1 Registered Report, "preregistered on OSF"; "Study materials, de-identified raw data, de-identified
    data with exclusions, and analysis code and output are available" on OSF.
  - Exclusions (preregistered except one): of 9,440 completers "48.88% (n = 4,614) were excluded": missing or
    under-age (age of majority by region: 18; "Taiwan, where the age of majority is 20"); "Prior participation"
    2.52%; failed all three comprehension questions 46.36%; "Knowledge of hypothesis" 2.15% (explicitly stated the
    hypothesis when asked); low language proficiency 22.17%. Final N = 4,826; site median 81 (28-588).

### 12. Russia (possible partners)
- HSE Centre for Cognition & Decision Making (Institute for Cognitive Neuroscience, HSE University, Moscow).
  Participant page read (https://www.hse.ru/cdm-centre/cdm_exp_ru): it invites people "to take part in experiments
  run by staff and students of our Centre" and points to a VKontakte group and a Telegram channel
  (https://t.me/experimentshse) "with current information about experiments" (our translation). No pay, consent
  or ethics details on that page (not found). Research lines from search snippets (unverified): decoding neural
  processes in cognitive and neuroeconomic tasks, persuasion, cognitive dissonance, trust, neuromarketing; a MEG
  lab with MSUPE's MEG centre. No VR or at-home study found for this centre.
- MSU Faculty of Psychology, "VR centre of MSU" page (https://vrmsu.ru/departments/psihfak/; region block, text sent
  by the owner, our translation): founded 1966, "13 departments and 5 research laboratories"; a programme on the
  psychological aspects of VR run by the Department of Methodology of Psychology, the "Perception" laboratory and
  the Department of Psychophysiology; coordinator G. Ya. Menshikova (DSc), lead executive A. I. Kovalev (PhD); an online course "Psychology of virtual reality and cyberpsychology"
  (lk.msu.ru/course/view?id=2079). No home-VR or online-at-scale study found.
- MSUPE (Moscow State University of Psychology and Education, MGPPU; region block, news page sent by the owner, our
  translation): the "laboratory of virtual technologies and reserve capacities of the personality" of the Faculty of
  Extreme Psychology hosted on 11 March 2024 a presentation of "PsyTechVR" by the company Kore Partners Soft, for
  training psychologists in managing stress and phobias, "more than 50 VR scenes of a phobic nature", EMDR for PTSD;
  organised by Prof. T. N. Berezina (mgppu.ru/news/13972). A company working with the lab: the partner model exists. Snippets (unverified): Institute of Experimental Psychology studies of VR and anxiety (Beck scale) and VR and
  creativity with first- and second-year students (mgppu.ru/news/11095; naked-science.ru); a master's course
  "Practicum on studying cognitive processes with a VR headset". All lab-based or clinical; no home-VR study found.
- Institute of Psychology RAS: no VR or online-at-scale project found in two searches (not found).
- RUDN University has a "Laboratory of Virtual Reality" page (https://www.rudn.ru/science/laboratories-and-centers/laboratoriya-virtualnoy-realnosti,
  search listing only, not read: unverified whether it does psychology).
- Summary for Russia: lab and clinical VR work exists (MSU "Perception" lab, MSUPE); the field model we copy
  (public, unpaid, home, consent screens, open data) was not found at any Russian institution in this pass.

### 6. Mel Slater's EventLab (Universitat de Barcelona, Spain)
- One search for a 2023-2025 EventLab study on participants' own headsets at home found none (not found). The
  lab's recent work in objekt-papers is lab-based (Slater et al. 2022, "A Separate Reality", Front. Virtual Real.,
  "Event Lab, Faculty of Psychology, Universitat de Barcelona", objekt-papers/slater-2022.txt). Their published
  open tool QuickVR (Unity library) and remote work: unverified.

### 13. Other active labs of this kind (found on the way)
- Bundeswehr University Munich / LMU Munich (Radiah, Makela, Prange, Delgado Rodriguez, Alt): "Remote VR Studies -
  A Framework for Running Virtual Reality Studies Remotely Via Participant-Owned HMDs" (arXiv:2102.11207, read
  locally, objekt-papers/rivu-2021.txt). Survey of headset owners: "227 complete surveys (out of 276)", recruited
  via "Prolific (97), Reddit (95), mailing lists (14), Facebook (12), Discord (4)"; 67% willing to join VR studies
  after the pandemic. Pay: "mostly willing to accept cash (= 189, 83%), but also game vouchers (= 103, 45%). A
  total of 77 participants (34%) stated that they would do so voluntarily without any compensation."
  (A 2022 follow-up, N=21, on setup help is listed in search only: unverified.)
- TestMyBrain (Germine; McLean Hospital / Mass General Brigham + non-profit Many Brains; USA). Who-we-are page
  read (https://v5.testmybrain.org/dashboard/who-we-are.html): "co-supported by Many Brains and the Laboratory for
  Brain and Cognitive Health Technology (BaCH Tech Lab) at McLean Hospital. Since 2005, we have collected data
  from over 3.7 million participants in a citizen science framework, as well as supporting over 2,200 research
  studies in over 240 countries"; funded by NIH grants; lists partner "Organizations that we have partnered with to
  build or develop specific cognitive tests or cognitive testing infrastructure". Citizen-science page
  (https://v5.testmybrain.org/using-tmb/citizen-science.html): "a not-for-profit initiative ... providing
  cognitive testing tools that allow people to engage in science and learn about themselves". Model: a university
  lab + a non-profit that hosts other researchers' studies (the "platform for others" route). Consent text and
  IRB: not read (unverified). LabintheWild's 2015 paper credits it: about 15-minute tests "proven to successfully
  engage participants on TestMyBrain.org".

### 7 (cont.). Steed group, lessons from running out of the lab (UCL), full text saved objekt-papers/steed-2021.txt
- Steed, Archer, Congdon, Friston, Swapp & Thiel (2021), "Some Lessons Learned Running Virtual Reality Experiments
  Out of the Laboratory", arXiv:2104.05359 (https://ar5iv.labs.arxiv.org/html/2104.05359). No 2023-2026 home-VR
  study of this group was found in one search (not found).
  - Consent: "fully on the web as part of the download experience or from within the app. Our ethics approval
    allows for short-form instruction and consent in-app as long as participants can also access a long-form
    version online if they wish."
  - Debrief: "We direct participants to debriefing and often provide a simple summary of what happened within the
    applications at the end."
  - Distribution: "extensive use of the SideQuest platform"; on PC "participants rely on our word that the
    application is not dangerous".
  - Quality: monitored participants "to make sure that they were active and looking in plausible directions";
    removed questionnaires "answered too quickly or answered the same value for each question"; reversed items.
  - Pay without linking: the app "generates a unique code on completion that can be redeemed if emailed to us.
    This unique code can't be matched to the data we received."
  - Scale: very large numbers need the experiment "attractive to run on its own; it is unlikely that this would be
    compensated". Lab-side loss: "participants can still ask these questions (via email) but are less likely to".

---

## 14. What is common (the practice to copy) and where they differ - drawn only from the entries above

Common to (nearly) all:
1. A named ethics body approves before any data: Copenhagen psychology dept (Mottelson); UCL Research Ethics
   Committee (Steed; Great Brain Experiment, no. 4354/001); Columbia IRB (Ouvrai); UW Human Subjects Division named
   on the consent screen (LabintheWild); UVA IRB named before every IAT (Project Implicit); St Andrews TREC (Sea Hero
   Quest now); networks: each site's own approval filed with the preregistration (PSA). Moral Machine: unverified.
2. Consent is a short screen before the task, with an independent contact and a long version online: LITW's four
   questions + one checkbox; Project Implicit's one-sentence "I wish to proceed"; Great Brain Experiment "on
   downloading the app"; Steed: "short-form ... consent in-app as long as participants can also access a long-form
   version online".
3. No names: anonymous device or session ID; location only coarse from the IP (LITW city/country; Moral Machine
   country; Project Implicit "IP addresses are routinely recorded but are completely confidential"; Sea Hero Quest
   "no ... precise location").
4. Short: 5-15 min (LITW), about 5 min (Great Brain Experiment), 8-10 min (frameline), 2-5 min a day (Sea Hero
   Quest), median 18 min (Ouvrai, paid).
5. A practice trial that can be repeated (Ouvrai up to three; LITW "Practice again").
6. Repeat players handled explicitly: asked ("Have you taken this test before?", excluded; PSA "Prior
   participation" 2.52%), counted (Great Brain Experiment play counter), or analysed on first sessions only (Moral
   Machine "first completed (13-scenario) session").
7. Quality rules fixed in advance plus honest self-report: objective exclusions in the preregistration (Mottelson;
   PSA); "Did you cheat or in any way provide false information?" and "technical difficulties" asked before results
   (LITW); too-fast and same-answer filters, plausible head direction (Steed 2021); tracking screening (Mottelson).
8. The end shows the person something: results compared with others (LITW; Great Brain Experiment scores; Moral
   Machine summary) and/or a debrief of the condition they had (Steed's poster; LITW reveals "Our primary research
   interest" on the results page).
9. Open materials: Ouvrai code on GitHub; Moral Machine and PSA data and code on OSF; Project Implicit "data
   without directly identifying information is made publicly available".
10. Built with outside makers and funders: White Bat Games (Great Brain Experiment, Wellcome); Glitchers and Deutsche
   Telekom (Sea Hero Quest); NSF (LITW), NIH (TestMyBrain).

Where they differ:
- Pay: Prolific $5-6 with a 33% fee (Ouvrai) or $15 gift cards (Mottelson) - small, fast, screened samples; versus
  no pay and feedback about yourself (LITW about 1,000 a day; Moral Machine 40 million decisions) - huge,
  self-selected (Moral Machine survey takers 75% men). Headset owners: 34% would take part with no pay (Radiah).
- Platform: browser (LITW, Project Implicit, Moral Machine, Ouvrai via WebXR) vs native app through SideQuest or
  stores (Mottelson, Steed, Great Brain Experiment, Sea Hero Quest).
- Where consent sits: desktop browser before install (Mottelson); in-app short + online long (Steed); web
  checkbox that gates the Next button (LITW).
- Saying no: Steed lets non-consenters play with nothing recorded; LITW and Project Implicit stop at the gate.
- Withdrawal: Steed deletes on request by emailed anonymous device ID; Sea Hero Quest says anonymous data "cannot
  be withdrawn once submitted".
- Age: Project Implicit 18+ with a separate 14-17 youth site; Steed "over 18" confirm; PSA age of majority by
  region (Taiwan 20); LITW designs studies "appropriate for minors"; Sea Hero Quest states none.
- Following a person over time: LITW's IRB asked them "not track our participants in any way" (no longitudinal);
  Sea Hero Quest keeps "an anonymous linking ID" across days.
- Money from data: Sea Hero Quest now pairs a paid subscription with licensing the anonymous dataset to
  "pharmaceutical companies" and for training "large language models"; Project Implicit offers "consulting";
  the others publish data openly and sell nothing (on the pages read). The owner's "never sell data" rule matches
  the second group.
- Exclusion rates: 2.2% (LITW Exp 1) to 48.88% (PSA Gettier, mostly comprehension and missing age).

## Not reached / unverified (limit of about 25 page reads hit)
- Stanford VHIL full text (bot check); Moral Machine ethics body (Nature main text paywalled, PNAS SI not read);
  PSA membership and current projects (home page has no numbers); Project Implicit founders, test counts, OSF
  archive; TestMyBrain consent and IRB; EventLab and Steed group home-VR studies 2023-2026 (none found in one search
  each); Ouvrai's consent screen wording (in its GitHub code, not read); LabintheWild /donate page.
- Russia: MSU VR centre and MSUPE pages opened by the owner (part 12); Institute of Psychology RAS: nothing found.

## Pages only a person can open
- https://academic.oup.com/jcmc/article/28/2/zmac031/6965183 - bot check: where headsets were worn, consent, IRB, pay.
- https://vrmsu.ru/departments/psihfak/ - failed from our tools: MSU psychology VR programme, labs, contacts.
- https://mgppu.ru/news/13972 - connection refused: MSUPE VR lab, PsyTechVR, research with participants.
- https://www.nature.com/articles/s41586-018-0637-6 - paywall: Methods, ethics approval and consent of Moral Machine.
