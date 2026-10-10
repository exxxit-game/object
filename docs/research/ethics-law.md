# Ethics approval and lawful data for an independent team (research pass, 2026-10-10)

Builds on docs/research/own-experiments-now.md part 4 (USM fees, RPO committee does not review projects).
Rule: every claim with link and short quote; "unverified" = seen only in a snippet.

## Parts (each gets an answer or "not found")
1a. US university IRBs reviewing independent investigators (fee schedules)
1b. Commercial IRBs (Advarra, BRANY, WCG, Pearl, others): social-behavioural minimal-risk online studies
1c. EU and UK options (DGPs ethics committee, national bodies, independent committees)
1d. Russia: institute/university committees reviewing outside projects (IP RAS, HSE, MSU, others)
1e. Which routes journals and preregistration accept
2.  Partnering with a university lab: agreements, PI, who holds approval, real examples
3a. Meta Horizon Store / Quest data-use and privacy policy rules for research data
3b. Meta account age rules and the 18+ recording rule
4a. GDPR: consent, special categories, anonymous vs pseudonymous
4b. Motion identifies people: Nair et al. 2023 (USENIX Sec), Miller et al. 2020 (Sci Rep)
4c. Russia 152-FZ: biometrics, localisation, cross-border transfer
4d. How labs anonymise motion/voice/gaze in practice
4e. Consent-form examples from real labs (online or VR)
5.  Shortest lawful path for us

## Findings

### 1c. EU: German Psychological Society (DGPs) ethics committee
- Source: "Hinweise zur Antragstellung an die Ethikkommission der DGPs", V13, dated 30.01.2022 (read from PDF text).
  https://zwpd.transmit.de/images/zwpd/dienstleistungen/ethikkommission/hinweise_zum_ethikantrag_v13.pdf
- Who: free ("ehrenamtliche") review "nur fuer die Forschung an Hochschulen und anderen oeffentlichen
  Forschungsinstitutionen" (only for research at universities and other public research institutions, our
  translation); "Rein kommerzielle Forschung wird durch die Kommission nicht beraten" (purely commercial research
  is not reviewed). => A private game team on its own does NOT qualify; it qualifies only as part of a project
  run by a university/public-institute researcher (our reading).
- How: applications via the ZWPD online portal https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission ;
  form "Ethikantrag" (Word template, submitted as PDF). Opinion written when "mindestens zwei unabhaengige Voten"
  (at least two independent votes) are in.
- Time: "in der Regel vier bis sechs Wochen nach dem Eingang der vollstaendigen Unterlagen" (usually 4-6 weeks after
  complete documents).
- Why people apply: funders (DFG, EU) or "mit Blick auf die Anforderungen von Publikationsorganen" (journals).
- Fee: none stated in this guidance (ehrenamtlich = voluntary/unpaid). Current fee on the portal: unverified.
- Contrast (snippet only, unverified): the German Linguistics Society (DGfS) ethics committee charges 100 EUR members /
  300 EUR non-members per project vote (https://dgfs.de/de/assets/content/Dokumente/Ethikkommission/ordnung-april2024.pdf).

### 4b. Head and hand motion identifies people (both read in full)
- Nair et al. 2023, "Unique Identification of 50,000+ Virtual Reality Users from Head & Hand Motion Data", 32nd USENIX
  Security Symposium. https://usenix.org/system/files/usenixsecurity23-nair-identification.pdf (read from PDF text;
  NOT saved: objekt-papers/nair-2023.txt already exists and is a different Nair 2023 paper, the Beat Saber census).
  - Abstract: real VR users "(N=55,541) can be uniquely and reliably identified across multiple sessions using just
    their head and hand motion"; after 5 min training data per person, "94.33% accuracy from 100 seconds of motion,
    and with 73.20% accuracy from just 10 seconds of motion"; biomechanics "on par with widely used strong biometrics
    like facial or fingerprint recognition".
  - Features: the two most important "are an obvious proxy for the user's height (and posture)"; next six measure arm
    length; but static measurements "account for only 22.9%"; "Motion features constitute 73.9% of all entropy gain".
  - Ethics (sec 3.4): Berkeley IRB protocol #16120, "deemed IRB-exempt under 45 C.F.R. 46.104(d)(4)(i)" because data
    were already public (BeatLeader replays); they still got written permission from BeatLeader; released only
    "de-identified and normalized data". Conclusion: telemetry "should in fact be considered highly sensitive data".
  - Defences: none tested; future work "methods that intelligently corrupt VR telemetry to obscure identifiable
    properties".
- Miller et al. 2020, "Personal identifiability of user tracking data during observation of 360-degree VR video",
  Scientific Reports 10:17404, doi 10.1038/s41598-020-74486-y. https://pmc.ncbi.nlm.nih.gov/articles/PMC7567078/
  SAVED: C:\Users\admin\Documents\objekt-papers\miller-2020.txt (from Europe PMC full-text XML).
  - "Out of a pool of 511 participants, the system identifies 95% of users correctly when trained on less than 5 min
    of tracking data per person"; "By far, the most important feature is Headset Y".
  - De-identification: "in practice taking one's name off a dataset accomplishes very little."
  - Removing horizontal position: "identification was still 92.5% accurate" (vs 95.3%).
  - Mitigation ideas (not tested): "Tracking fewer channels of data may help"; "displacing positional data by some
    amount may allow one person to reliably appear as the height of another person".
  - Their consent practice: "approved by the Stanford University IRB under protocol number 43879"; "All adult
    participants read and signed an IRB-approved consent form"; under-18s needed "child assent and parental consent";
    museum visitors who opted out "still had the option to view the 360 videos without having their data collected".
- Consequence for us (our reading): raw per-frame head/hand tracks of one player are, by these results, data that can
  single a person out, so under GDPR they are personal data, not anonymous, even with no name attached (see 4a).

### 3a. Meta Horizon platform: Developer Data Use Policy (page last_updated 2026-07-02; read via fetch summariser)
https://developers.meta.com/horizon/policy/data-use/
- 2.1: developers must "obtain any permissions/consents from the end user and/or rely on any appropriate legal basis".
- 2.2: "You must clearly articulate your collection, use and processing of Developer User Data" (public privacy policy).
- 2.3: "you may not sell User Data even if you disclose your intention to do so in your privacy policy." 4.3 bans
  "Selling, licensing, purchasing, renting, or lending User Data". 5.2: written agreement with any Service Provider.
- 11A (definitions): covered data "includes data from sensors such as a microphone or camera and the position of a
  user's headset", "data calculated about a user's hands and body", "face (i.e., abstracted facial expressions data),
  and eyes (i.e., abstracted gaze data)".
- 4.6 prohibits "Using User Data to ascertain the identity of a natural person, including real name".
- 4.13 prohibits "Using any permanent or persistent, device-based identifier (e.g., device serial number)".
- Research: no rule on research or academic use found on the page; nearest is 3.1(b) analytics to improve content,
  insights "aggregated, de-identified, or anonymized".
- Deletion: 6.3 requires "an easily accessible and clearly marked way to ask for their User Data to be corrected or
  deleted"; 6.2 delete when user asks or data "no longer necessary".
- Caveat: these quotes passed through the fetch tool's summariser; exact clause wording should be re-read before it
  goes into our privacy policy (unverified at clause level). Whether WebXR data we collect ourselves in the Quest
  Browser counts as "User Data" under this policy (it covers apps on the Horizon platform): unverified.

### 3b. Age rules (Meta)
- https://developers.meta.com/horizon/resources/age-groups/ (last updated 2026-04-02): "Users under the age of 10 are
  not permitted on the Meta Horizon platform." Self-certified groups: "Teens and Adults (13+)"; "Mixed Ages" (10-12 and
  13+); "Children (under 13)". For 13+ the Get Age Category API is not required. No 18+ option and no rule on
  developer-run age gates on the page.
- https://developers.meta.com/horizon/documentation/spatial-sdk/ps-get-age-category-api/ (last updated 2026-04-27):
  returns "CH (child, ages 10-12)", "TN (teen, ages 13-17)", "AD (adult, ages 18+)", "UNKNOWN"; "exclusive to apps
  built on the Android Platform" (so not available to a WebXR page in the Quest Browser).
- What it means for us (our reading): a Quest account can belong to a 10-17-year-old, so "18+ for recording" cannot be
  assumed from the platform. In the browser we must ask age ourselves (self-declared gate before any recording); in a
  future native store build we could also read AD/TN/CH from the API (Android builds only). Self-declared age is what
  Miller 2020 and most online studies rely on plus consent; parental consent route not needed if under-18s simply
  play without recording.

### 1a/1b. US IRBs: published prices (read on the pages unless marked)
- Solutions IRB (commercial, US), https://www.solutionsirb.com/fees/ (page shows only "(c) 2025 Solutions IRB"):
  "Initial Exempt Review Base Fee": $1200.00 ("if not exempt, the fee is applied toward the higher level of review");
  exempt studies "do not require annual check-ins"; "Initial Review- Social Behavioral" (expedited): $2100.00, plus
  annual "Continuation report" $1300.00; full board non-clinical $2950.00; "International Review - Any Research
  Outside of the US": "Expedited International Initial Review- Non-Clinical": $2570.00; "Each Additional Country":
  $500.00; modifications $550 (exempt) / $600 (expedited). Independent researchers not mentioned (not excluded).
- Health Media Lab IRB (HML IRB), https://www.healthmedialabirb.com/irb-fees-and-payment : "Exemption Review -
  US$1500"; "Expedited Review - US$1500"; full board "US$2,500 for 1st hour"; substantive amendments US$500.
  Social/behavioural, online, international and independent researchers not mentioned on the fee page (HML IRB's
  focus on social-behavioural research: unverified).
- Rutgers (university, for non-Rutgers PIs), search snippet only: "Expedited Review $750", "Exempt Status $250",
  rates "last updated 10/16/20" (unverified). https://research.rutgers.edu/faculty-staff/compliance/human-research-protection/irb-fees
- IPA (Innovations for Poverty Action) IRB, snippet only: expedited/exempt initial $2,100 plus "$600 non-IPA fee"
  from 1 March 2025 (unverified). https://poverty-action.org/sites/default/files/2025-01/IPA%20IRB%20Fee%20Update%20-%20March%201%202025.pdf
- Cheapest found so far: USM $500 exempt (earlier pass), then Solutions IRB $1,200, HML IRB $1,500.
- Pearl IRB, https://www.pearlirb.com/irb-services/ : social-behavioural welcome: "We regularly review studies involving
  interviews, surveys, focus groups, observational methods"; "Pearl IRB is an AAHRPP-accredited independent IRB";
  offers "Exemption Determination"; fees on a separate "Fee Schedule" page (not read). Independent researchers: not
  stated. Advarra / WCG / BRANY: only general exemption guidance seen (https://www.wcgclinical.com/insights/irb-exemption/ ,
  https://www.advarra.com/blog/beginners-guide-to-minimal-risk-research/); no prices published; not read in full.
- US rule worth knowing (snippet level, WCG page): exemption category 2 covers "surveys, interviews, or observation of
  public behavior" with privacy conditions; the IRB, not the researcher, makes the exempt call, and never
  retroactively (unverified wording).

### 1d. Russia
- HSE (Higher School of Economics), Department of Psychology, "Commission for ethical assessment of empirical research
  projects": https://social.hse.ru/psy/ethics/ says it was created "to give staff and students of the Department of
  Psychology the opportunity to obtain an official opinion" (our translation) and to relieve the university-wide
  survey commission; external applicants not mentioned; no fee mentioned. Contact: commission secretary
  mhachaturova@hse.ru (public page). Procedure https://social.hse.ru/psy/ethics/algorithm : supervisor sends a signed
  application ("Zayavlenie") and a study-description table ("Prilozhenie A"); review "within 14 days"; signed
  conclusion "in Russian and English" e-mailed "within seven working days" (our translation). => Open to us only
  through an HSE psychology co-investigator (our reading; asking the secretary is the only way to confirm).
- MGPPU (Moscow State University of Psychology and Education) ethics committee, https://mgppu.ru/project/459 (region
  block for our tools; the owner opened it and sent its text). Set up by the Academic Council on 31 March 2021 to
  review research by the university's staff and students, "and also (when needed) carried out by them jointly with
  other organisations, and other research using the University's infrastructure" (our translation). Members serve
  "on a voluntary basis" (no fee is named). Among those who may submit: "an employee of the University acting as
  representative of a research lead who is not an employee of the University" (our translation). Documents: an
  application, a list of appendices, information about the study (Appendix 1 to its Regulation), the study
  protocol, the lead's training and research experience. Decision "not later than 15 calendar days" after the
  materials arrive. => Open to us as a joint study with an MGPPU employee as our representative (e.g. its VR lab).
- SPbU ethics committee for social, humanitarian and natural sciences, Regulation of 15.08.2013
  (https://spbu.ru/openuniversity/documents/ob-eticheskom-komitete-spbgu; region block, text sent by the owner; all
  quotes our translation). Registered with US HHS as "IRB00003875 St.Petersburg State University IRB#1 - Behavioral"
  (1.2). Applicants may be individual researchers and "representatives of commercial and non-commercial organisations"
  (1.6); free for SPbU staff, outside organisations pay "administrative costs" set by the first vice-rector for
  economics, whatever the decision (1.7; amount not on the page); it signs agreements to review, "including remotely",
  with individuals and legal entities (1.9). Documents (5.6): request, study protocol (international projects in
  Russian and English), methods, consent form, the applicant's consent to processing his personal data; electronic and
  printed. Review "within 1 month" (4.1.5); yearly review of running studies (4.1.2). => The one route found that takes
  a team like ours directly, with an IRB number US-registered; fee to ask the secretary.
- Institute of Psychology RAS (ipras.ru): no page on its own ethics committee found; its draft code points to the RPO
  ethics committee (snippet only, http://www.ipras.ru/cntnt/rus/novosti/rus_psy/n3353.html). Not found.
- Snippet (unverified): one Russian institute's regulation says no fee is charged to study organisers
  (https://urniif.ru/science/etica/pologenie/ , a law institute, not psychology).

### 4a. GDPR text (read on gdpr-info.eu)
- Art 4(14): "'biometric data' means personal data resulting from specific technical processing relating to the
  physical, physiological or behavioural characteristics of a natural person, which allow or confirm the unique
  identification of that natural person". https://gdpr-info.eu/art-4-gdpr/
- Art 4(5) pseudonymisation: data "can no longer be attributed to a specific data subject without the use of additional
  information, provided that such additional information is kept separately". Same page.
- Recital 26: pseudonymised data "should be considered to be information on an identifiable natural person";
  identifiability judged by "all the means reasonably likely to be used, such as singling out"; the rules do "not apply
  to anonymous information ... including for statistical or research purposes." https://gdpr-info.eu/recitals/no-26/
- Art 89(1): research processing "shall be subject to appropriate safeguards"; measures "may include pseudonymisation";
  where purposes can be met without identifying people, "those purposes shall be fulfilled in that manner".
  https://gdpr-info.eu/art-89-gdpr/
- Art 9 (earlier pass): biometric data "for the purpose of uniquely identifying" is special category; explicit consent
  (9(2)(a)) lifts the ban.
- Our reading (lawyer to confirm): (1) a random session ID instead of a name = pseudonymised = still personal data;
  (2) raw head/hand tracks can single a person out (Nair, Miller, 4b), so they are personal data; (3) they become
  "biometric"/special category only when processed to identify someone, which we never do, but explicit consent costs
  us nothing and covers both readings; (4) truly anonymous = only derived numbers (e.g. "reaction time 412 ms",
  "chose B") with raw tracks deleted. Voice recordings are personal data in any reading.

### 4c. Russia, 152-FZ (read on consultant.ru; page notes an edition with changes not yet in force)
- Art 3(1): personal data = "any information relating to a directly or indirectly identified or identifiable natural
  person" (our translation). Art 3(9): "depersonalisation" = actions after which it is impossible "without the use of
  additional information" to tell whose data they are (our translation) => like GDPR pseudonymisation, still personal.
  https://www.consultant.ru/document/cons_doc_LAW_61801/4f41fe599ce341751e4e34dc50a4b676674c1416/
- Art 12 (cross-border, as amended by 266-FZ of 14.07.2022 and 265-FZ of 26.07.2026):
  https://www.consultant.ru/document/cons_doc_LAW_61801/e4ebbe1780de623c7cf32a59ca82a7bb523a25dd/
  12(2): Roskomnadzor approves a list of countries with adequate protection, namely those whose rules "correspond to the
  provisions of the Council of Europe Convention" on automated processing (our translation).
  12(3): "before starting cross-border transfer the operator must notify" Roskomnadzor (our translation); 12(4)-(5):
  contents (legal basis and purpose, list of countries, the assessment of the foreign recipient's protection).
  12(9): a decision to ban/limit is taken "within ten working days" of the notice; 12(10): to listed countries the
  operator may transfer right after notifying; 12(11): to unlisted countries not before that period ends.
- Art 22(1): "Before starting to process personal data the operator must notify" Roskomnadzor (our translation),
  except the cases in 22(2) (manual-only processing etc., none fits us).
  https://www.consultant.ru/document/cons_doc_LAW_61801/d996966e22e1320c9de1ab82d9f6be12c3d9d765/
- Combined with Art 18(5) localisation (earlier pass): personal data of Russian citizens must first be recorded in a
  database in Russia; only then may a copy go abroad after the Art 12 notice. Whether 152-FZ applies at all to a
  foreign-registered team with no Russian presence: unverified (lawyer). Anonymous derived numbers (not "personal
  data" under Art 3(1)) are outside the law (our reading).

### 1e. What journals accept
- PLOS ONE, https://journals.plos.org/plosone/s/human-subjects-research : "Obtain prior approval for human subjects
  research by an institutional review board (IRB) or equivalent ethics committee(s)"; "Submit documentation from the
  review board or ethics committee confirming approval"; exempt only "per applicable IRB/ethics committee regulations".
  No rule on independent/commercial IRBs (so an OHRP-registered commercial IRB or fee-for-service university IRB is the
  "IRB" route; acceptance of a specific body is the editor's call: unverified). "Report details on how informed consent
  for the research was obtained".
- Snippet only (unverified): PLOS ONE requires original approval documents at submission since 1 March 2023 and has
  retracted papers over doubts about a committee's independence (https://pmc.ncbi.nlm.nih.gov/articles/PMC10411757/).
  => The committee must be independent of us; approval must exist before data collection.
- Preregistration (OSF, AsPredicted): no ethics-approval requirement found; not read in this pass (unverified).

### 2. Industry-university partnership: a worked real example
- Vuorre et al. 2022, "Time spent playing video games is unlikely to impact well-being", Royal Society Open Science,
  doi 10.1098/rsos.220411, https://pmc.ncbi.nlm.nih.gov/articles/PMC9326284/ (read via fetch summariser):
  - Approval held by the university: "granted ethical approval by our institute's Central University Research Ethics
    Committee" "(SSH-OII-CIA-21-011 (underscores in the original))" (Oxford Internet Institute).
  - Recruitment by the companies: "We collaborated with game publishers who recruited players with emails";
    participants "reported being 18 years or older" and consented "to have their game-play behaviour data provided by
    the respective game publisher".
  - Data flow: "the publishers sent the behavioural data of all consented participants to our team"; "The game
    publishers created those hashed IDs for each player account"; "At no point did we collect personally identifiable
    data".
  - Roles: industry partners "reviewed the study design and assisted with play behaviour data collection and
    recruitment" "but had no role in ... data analysis, decision to publish or preparing the manuscript". Funded by
    the Huo Family Foundation. Data open at https://osf.io/fb38n/ . "This study was not preregistered."
  - Pattern to copy: university PI and ethics committee own the protocol and the analysis; the company recruits,
    collects in-game data under the protocol's consent, hands over pseudonymous IDs; no editorial control.
- Nair et al. 2023 (4b): the BeatLeader community service (not a university) supplied public data; the Berkeley IRB
  held the approval; written permission from BeatLeader obtained anyway.
- Sea Hero Quest (Deutsche Telekom + Glitchers + UCL/UEA) and LabintheWild (Harvard): in the earlier pass, 1b.
- Formal data-sharing agreement texts: not found in this pass.

### 4d/4e. How a psychology ethics committee wants data handled and consent written (DGPs guidance V13, same PDF as 1c)
- Data: either a participant-chosen code word, or "Pseudonymisierung" first and, for long-term storage, "Anonymisierung
  ohne Kenntnis der untersuchten Person" (anonymisation without knowledge of the person, our translation); the code list
  "ist nach der Datenerhebung oder der Datenauswertung zu vernichten" (must be destroyed after collection or analysis);
  after that a person's record "kann ... nicht mehr identifiziert und eine Loeschung ... nicht mehr durchgefuehrt
  werden, auch wenn dies verlangt wird" (can no longer be identified or deleted, even on request). The participant
  sheet must say which variant is used.
- Participant information must state: voluntariness and "jederzeit von der Teilnahme zuruecktreten" (withdraw at any
  time) with no disadvantage; "in welcher Form und wie lange die Daten gespeichert werden" (form and duration of
  storage); that deletion can be requested "bis zu einem definierten Zeitpunkt" (until a defined point); a named
  contact person.
- Consent statement: must show "worin genau die unterzeichnende Person einwilligt"; avoid stock phrases like "Ich habe
  verstanden"; templates (general information, consent, consent for picture and sound recordings) on
  https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission/vorlagen-antragstellung (templates not opened).
- Real-lab consent practice for a VR tracking study (Miller 2020, 4b): signed IRB-approved form for adults; opting out
  of research still let people watch without data being collected. Online game data study (Vuorre 2022, 2): info page
  first, then "the option to consent", 18+ self-report.
- Fit for us (our reading): this matches the owner's rules almost one to one (consent, quit any time, debrief,
  anonymous). Our in-game version: session ID only (pseudonymous), raw tracks kept only until the derived numbers are
  computed, then deleted; tell the player that from then on his record cannot be found or deleted.
- Motion anonymisation tools: MetaGuard, Nair, Munilla Garrido, Song, "Going Incognito in the Metaverse", UIST 2023,
  https://arxiv.org/abs/2208.05604 (abstract read): "leverages local differential privacy to quantifiably obscure
  sensitive user data attributes"; result only "a significant degradation of attacker capabilities". Snippets only
  (unverified): up to 96.0% less deanonymisation; the same team later found a large identification model "can
  convincingly bypass" this, leading to "deep motion masking" (https://www2.eecs.berkeley.edu/Pubs/TechRpts/2023/EECS-2023-232.html).
  => Noise on height/arm length helps but is not a guarantee; the safe practice is not to keep raw tracks at all.

### 1c (cont.) UK
- No UK committee that reviews unaffiliated researchers for a fee was found (search only). ESRC framework delegates
  review to institutional RECs (snippet, unverified). Not found.

## 5. Shortest lawful path for us (our synthesis from the sources above; a lawyer should confirm the legal readings)
Phase A, the game now (no publication, no ethics approval needed for the in-game "you vs other players" view):
 1. Keep raw head/hand tracks and voice on the headset; compute the room's numbers there; send only derived numbers
    plus a random session ID. Raw tracks single people out (Nair 2023: 94.33% from 100 s; Miller 2020: 95% of 511),
    so never upload them in Phase A. Cost 0, our code time.
 2. Self-declared 18+ question before anything is recorded (Meta accounts start at 10; the age API is Android-only).
    Under 18: play, nothing recorded (Miller 2020 did the same for opt-outs).
 3. Public privacy policy and a clear delete-my-data path (Meta Data Use Policy 2.2, 6.3); no selling (2.3).
 4. Russian players: with only anonymous derived numbers, 152-FZ localisation (18(5)) and notices (22(1), 12(3)) should
    not bite (Art 3(1) reading). If any personal data of Russian citizens is kept (raw tracks, voice, e-mail), it must
    first land in a database in Russia, Roskomnadzor notified before processing, and a cross-border notice filed (10
    working days wait for non-listed countries). EU/Supabase Ireland is fine under GDPR with consent.
Phase B, a publishable study (the owner's "science only after approval, preregistration, separate consent"):
 5. Get approval BEFORE collecting (PLOS ONE: "prior approval", documents at submission). Cheapest routes found:
    a) a university co-investigator: HSE psychology commission (free, 14 days review + 7 working days; staff/students
       only, so via a co-PI), DGPs (free, 4-6 weeks; university/public researchers only); the co-PI's committee holds
       the approval, we build and run the game, like Vuorre 2022 (Oxford approval, publishers recruited and passed
       hashed IDs, no editorial control);
    b) SPbU IRB#1 (1d): takes outside organisations directly, remote, fee on request, 1 month;
    c) pay an IRB alone: USM $500 exempt / $750 expedited; Solutions IRB $1,200 exempt, $2,570 international expedited
       + $1,300/yr; HML IRB $1,500. Total time for IRBs: not published (unverified).
 6. Preregister before data collection (OSF or AsPredicted; cost and rules not read: unverified).
 7. Separate in-game consent screen for science use (what is recorded, for how long, quit any time with no loss,
    delete until a stated point, then anonymised and undeletable: DGPs template logic), debrief after.
 8. If raw tracks are needed for the science: explicit consent (GDPR 9(2)(a) covers the biometric reading), keep only
    until derived numbers are computed, then delete; state the deletion point in the consent.

## Not reached / unverified
- Advarra, WCG, BRANY, Pearl prices and whether they take an unaffiliated game team; IRB total turnaround times.
- Russia: IP RAS committee (not found); the SPbU fee (ask its secretary). EU bodies beyond DGPs, UK RECs: not found.
- Whether 152-FZ applies to a team with no Russian entity; whether Ireland is on Roskomnadzor's adequate list.
- OSF/AsPredicted rules; formal data-sharing agreement texts; Meta policy clause wording (read via summariser).
