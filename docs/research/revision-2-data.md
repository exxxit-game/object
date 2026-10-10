# Tool revision, area 2 of 5: data, server and data-protection law (research pass, 2026-10-10)

Rule: every claim has its link and a short quote; "unverified" = not read in the source itself; "our reading" =
an inference a lawyer must confirm. Builds on ethics-law.md (+ -3), projects/data-platforms.md, vr/06-science.md,
study-methods*.md, audit/premortem.md. Nothing installed, the live database not queried.

## Parts (each gets an answer or "not found")
L1. Ukraine: Law "On Personal Data Protection", the GDPR-aligned draft law, the regulator, duties for the owner
L2. GDPR: does it apply (EU region of the database, EU players, offering to the EU), representative (Art 27)
L3. Russia: 152-FZ "targeting", the Roskomnadzor operator registry, localisation, cross-border
L4. Head and hand traces: personal or biometric data
L5. Full timestamps and IP logs vs "anonymous"
D1. Consent version per row
D2. Sending only after the reveal
D3. Retention
D4. Codebook per room version
D5. Per-room validation in submit_run
D6. Bots and rate limits on public RPCs
D7. What science partners and ethics boards require of the data (preregistration, exports, de-identification)
S1. Backups on the Pro plan, point-in-time recovery
S2. Live server vs supabase/migrations (drift check)
S3. Supabase as processor: DPA, sub-processors, region, logs
S4. Supabase for later needs (realtime live players, edge functions, analytics) vs another backend
S5. Cost now vs after five rooms

## Findings (appended as found)

### S1. Backups (Supabase docs, read 10.10)
- https://supabase.com/docs/guides/platform/backups : "Pro Plan projects can access the last 7 days of daily
  backups"; "All projects on Postgres 15.8.1.079 and newer use the newer physical backup process"; physical backups
  "are not available for direct download" (for a copy you can hold: a logical dump with the CLI or pg_dump).
- PITR: "allows you to back up a project at shorter intervals"; price "depends on the recovery retention period":
  7 days about $100/month ($0.137/hour), 14 days about $200, 28 days about $400.
- Our reading: 7 days of daily backups held by the same provider is not an off-site copy and loses up to a day;
  a weekly or daily logical dump kept by us (objekt-files, F:, Google Drive) is the missing piece; PITR is not worth
  $100/month for a few insert-only rows a day.

### L5/S3. What Supabase logs hold (Supabase docs, read 10.10)
- https://supabase.com/docs/guides/observability/log-field-reference : edge_logs carry
  `request.headers.cf_connecting_ip` and `request.headers.x_real_ip` (the client IP), `request.cf.country`,
  `request.cf.city`, and `request.path` (so the IP sits next to "/rest/v1/rpc/submit_run" and a time).
- How long: https://supabase.com/docs/guides/troubleshooting/check-usage-for-monthly-active-users-mau-MwZaBs :
  "Free plan users can access the logs of the last day, Pro plan users 7 days". No switch to turn collection off
  (https://supabase.com/docs/guides/platform/logs : hiding connection logs "only affects what you see").
- Degraded state after overusing the logs-query allowance (https://supabase.com/docs/guides/platform/manage-your-usage/logs-query):
  "Log retention shrinks to 24 hours (Pro, Team, and Enterprise)"; not enforced until "early 2027".

### L1. Ukraine (official texts read 10.10; all quotes our translation from Ukrainian, originals at the links)
- Law of Ukraine No. 2297-VI "On Personal Data Protection", https://zakon.rada.gov.ua/laws/show/2297-17 , edition
  "of 14.06.2025". Art 2: personal data = data about a person "who is identified or can be specifically identified";
  controller = "a natural or legal person who determines the purpose of processing" -> the owner is the controller.
  Art 25(2) excludes only processing by a natural person "exclusively for personal or household needs"; a public
  game is not that (our reading).
- Art 7(1): special categories include "biometric or genetic data".
- Art 9(1): the controller notifies the Ombudsman of processing that "poses a special risk to the rights and
  freedoms" of data subjects, "within thirty working days from the start of such processing".
- Regulator: Art 22-23, control by "1) the Commissioner; 2) the courts" (the Parliament Commissioner for Human
  Rights, Art 4).
- Grounds (Art 11(1)): item 1 consent; item 6 the controller's legitimate interests. Rights (Art 8(2)): to object,
  and to demand "change or destruction" of one's data. Art 6(8): processed "no longer than necessary for lawful
  purposes"; "further processing ... for historical, statistical or scientific purposes" is provided for.
- Cross-border (Art 29): only where the state ensures adequate protection; adequate: "member states of the European
  Economic Area, and states that signed the Council of Europe Convention" (No. 108) -> Ireland (EEA) qualifies;
  also allowed with the person's "unambiguous consent" (Art 29(4)).
- Which processing is "special risk": the Ombudsman's clarification of the notification procedure (official PDF,
  https://www.ombudsman.gov.ua/storage/app/media/uploaded-files/rozyasnennya__3.pdf , read with pdftotext): the list
  includes "biometric data" and "location and/or routes of movement of a person"; biometric data are illustrated by
  "a digitised image of the face, digitised fingerprints, a digitised retina pattern"; "routes of movement" means
  where a person is at a given time (cash machines, phone billing), not movement inside a virtual room (our
  reading). The notice names the controller, the data, purpose, recipients, cross-border transfer, the server
  address and the security measures.
- Our reading: anonymous derived numbers (what we send now) are not personal data under Art 2; raw head/hand tracks
  or voice would be, and could be argued "biometric" -> a notice to the Ombudsman within 30 working days. Lawyer
  needed: whether the law reaches a Ukrainian private person whose players are abroad (no territorial article found).
- The GDPR-aligned draft, bill No. 8153 "On Personal Data Protection": the Rada committee page
  (https://comeuroint.rada.gov.ua/news/main_news/75033.html , 25.11.2024) says it was adopted "as a basis" in first
  reading, to align with "Regulation (EU) 2016/679", with "financial liability, administrative-economic sanctions".
  Cabinet bill page (https://www.kmu.gov.ua/bills/proekt-zakonu-pro-zakhyst-personalnykh-danykh): "Being prepared for
  the second reading". Passed by 10.10.2026: unverified (the Rada bill card did not load). Its regulator: unverified.

### L2. Does the GDPR apply? (EDPB Guidelines 3/2018 on territorial scope, v2.1, 12 Nov 2019, read in full text;
saved as objekt-files/papers/edpb-2019.txt; https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_3_2018_territorial_scope_after_public_consultation_en_1.pdf)
- The EU database region alone does not pull the owner in: "a 'non-EU' controller ... will not become subject to the
  GDPR simply because it chooses to use a processor in the Union"; the processor (Supabase) still has its own GDPR
  duties.
- Offering to people in the EU (Art 3(2)(a)) applies "irrespective of whether a payment of the data subject is
  required"; "mere accessibility" of a site is "insufficient"; signs of intent include "the use of a language or a
  currency other than that generally used in the trader's country, especially a language or currency of one or more
  EU Member states", "the mention of an international clientele". Our reading: a Russian-only free game is weakly
  aimed at the EU; an English version, prices in euros or a paid store listing in EU countries makes it targeting.
- Monitoring (Art 3(2)(b)): no intent test, but "the use of the word 'monitoring' implies that the controller has a
  specific purpose in mind"; "not ... any online collection or analysis ... would automatically count"; key is "the
  tracking of natural persons on the Internet, including ... profiling". Recording behaviour in rooms for analysis
  could be read as monitoring if the data are personal (our reading; lawyer).
- If the GDPR applies, an EU representative is required unless processing is "occasional" and does not include "on
  a large scale" special categories; "occasional" = "not carried out regularly, and occurs outside the regular course
  of business" -> a game that records every run is not occasional (our reading): a representative would be needed,
  named in the privacy notice (EDPB example 24).
- The way out, already in the design: GDPR Recital 26 (ethics-law-3.md 4a): rules "not apply to anonymous
  information". If what we store is truly anonymous, Art 3 does not matter for the stored rows; it still matters for
  anything personal (IP logs at the processor, a future player account, raw tracks, voice).

### L3. Russia, 152-FZ: targeting, the operator registry, fines (all quotes our translation from Russian)
- Already read (ethics-law.md 4c, own-experiments-now-2.md): Art 3(1) personal data = "any information relating to a
  directly or indirectly identified or identifiable natural person"; Art 18(5) collection of Russian citizens' data
  "using databases located outside the territory of the Russian Federation is not allowed"; Art 22(1) notify
  Roskomnadzor "before starting to process"; Art 12(3) notify before a cross-border transfer.
- Targeting: the Ministry of Communications' 2015 clarification was seen only through a law firm's summary (Mondaq,
  in ethics-law.md 4c): binding on foreign operators "only if they conduct activity targeting Russia"; signs: "a
  Russian language version", roubles, advertising in Russia. Roskomnadzor's own FAQ
  (https://rkn.gov.ru/treatments/chasto-zadavaemye-voprosy/zashchita-prav-subektov-personalnykh-dannykh/) refused our
  tools and the browser pane (region block): unverified. Our reading: a Russian-language game promoted in Russian
  communities is the textbook "targeting" case, so if ANY personal data of Russian players is stored, 18(5) and 22(1)
  bite; with anonymous derived numbers only, Art 3(1) is not met and the law does not apply.
- Fines, Code of Administrative Offences Art 13.11 (edition of 04.08.2026, read in the browser pane on
  https://www.consultant.ru/document/cons_doc_LAW_34661/1f421640c6775ff67079ebde06a7d2f6d17b96db/):
  part 8 (localisation): citizens "from thirty thousand to fifty thousand roubles", legal entities "from one million
  to six million roubles"; part 9 (repeat): legal entities "from six million to eighteen million roubles"; part 10
  (no notice to Roskomnadzor "of the intention to process", added by 420-FZ of 30.11.2024): citizens 5,000-10,000,
  legal entities 100,000-300,000 roubles; part 17 (leak of biometric data): legal entities 15-20 million roubles.
  Note 1: individual entrepreneurs answer "as legal entities" for parts 8-18.
- Practical exposure for a Ukrainian private person abroad: not researched (enforcement would be by blocking the site
  in Russia, the registry of violators; seen only in a search summary: unverified). Lawyer needed (Russian data law
  plus Ukrainian rules on dealings with Russia), only if we ever store personal data of Russian players.

### L4. Head and hand traces: personal or biometric?
- Already read in full (ethics-law-3.md 4b): Nair et al. 2023, 55,541 users identified, "94.33% accuracy from 100
  seconds of motion"; Miller et al. 2020, "95% of users" of 511 from under 5 min of tracking. GDPR Art 4(14): biometric
  = data from "specific technical processing" that "allow or confirm the unique identification"; special category
  (Art 9) only "for the purpose of uniquely identifying". UK ICO reads it the same: special category "only ... if you
  use it to uniquely identify someone" (own-experiments-now-2.md). 152-FZ Art 11(1): biometric = features "on the
  basis of which his identity can be established". Ukraine: biometric is a special category (Art 7(1)); the
  Ombudsman's examples are face, fingerprints, retina (L1).
- Verdict (our reading, lawyer to confirm): raw per-frame head/hand tracks are personal data in all three laws
  (they single a person out); "biometric" only if processed to identify, which we never do, but Ukraine's notice
  duty and Russia's written-consent rule make the label costly. Derived numbers (presses, a rating, "looked away 4 s")
  are not traces. Keep the rule already in the plan: no trace leaves the headset.

### L5. Full timestamps and IP logs vs "anonymous"
- CJEU Breyer, C-582/14, 19.10.2016 (https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62014CJ0582):
  a dynamic IP address is personal data for a site operator "where the latter has the legal means which enable it
  to identify the data subject"; identification is not reasonably likely only if "prohibited by law or practically
  impossible" ("a disproportionate effort in terms of time, cost and man-power", para 46).
- CJEU EDPS v SRB, C-413/23 P, 4.9.2025 (https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62023CJ0413):
  pseudonymised data are not personal "in all cases and for every person" (para 86), but for whoever holds the means
  they are "still personal in nature" (para 76); transparency is judged "at the time of collection of the data and
  from the point of view of the controller" (para 111).
- Our server today: every row has `created_at` to the microsecond and an increasing `id`; Supabase's edge log keeps,
  for 7 days on Pro, the caller's IP, city and the path `/rest/v1/rpc/submit_run` with its time (S3 above). The owner
  can open both in the dashboard. Our reading: for those 7 days a row can be matched to an IP by time or by order, so
  it is pseudonymous personal data, not anonymous; after the logs expire, nothing links it. privacy.html already
  names the logs ("may contain an IP address") but calls the result "anonymous".
- Fix, cheap now: `created_at` cut to the day inside submit_run, the identity `id` replaced by a random key (order no
  longer leaks), no reading of edge logs for submit_* paths; privacy.html says "for up to 7 days our provider's
  logs could link it to your IP; after that it is anonymous". Lawyer: whether that wording is enough.

### S2. Does the live server match supabase/migrations? (Supabase CLI docs, read 10.10)
- https://supabase.com/docs/reference/cli/supabase-db-diff : `db diff` "Diffs schema changes made to the local or
  remote database"; it compares "against a shadow database" "created by applying migrations in local
  supabase/migrations directory in a separate container" (needs Docker: not on the laptop, the owner's rule);
  `--linked` "Diffs local migration files against the linked project".
- `supabase migration list` "Lists migration history in both local and remote databases"; remote history lives in
  the `supabase_migrations.schema_migrations` table; "Only the timestamps are compared". Whether our 0001-0008 were
  recorded there (applied through the connector) or pasted in the SQL editor: unverified (we do not query the live DB).
- Best option (our design): a GitHub Actions job (GitHub's runner has Docker) running `db diff --linked --schema
  app,public` weekly and on every migration, with the database password as a GitHub secret (never in the repo); a
  non-empty diff fails the job. Without Docker, a lighter check: a read-only catalog query of the function bodies
  compared with the last migration's text.

### D5. Per-room validation in submit_run (Supabase docs, read 10.10)
- Today one `submit_run` holds room 01's whitelist inline (0008, about 70 lines); nine rooms per floor would make it
  one ever-growing function where an edit for one room can break another.
- https://supabase.com/docs/guides/database/extensions/pg_jsonschema : it "adds the ability to validate Postgres's
  built-in json and jsonb data types against JSON Schema documents"; `jsonb_matches_schema(schema json, instance
  jsonb)`; "generally used in tandem with a check constraint"; enabled with `create extension pg_jsonschema with
  schema extensions`.
- Best option (our design): one JSON Schema per room version (a file in the room's folder, loaded by a migration
  into a private table keyed by room and version); `submit_run` only looks it up and calls jsonb_matches_schema. The
  same file is the machine half of the codebook (field, type, range, description) and the test that pins client
  fields to the SQL reads it. A room is added by data, not by rewriting the function.

### D6. Bots and flooding on the public RPCs (Supabase docs, read 10.10)
- Now: one global count per table ("at most 120 results per minute", 0001/0008); a script can fill it and lock out
  real players (premortem lens 2 #5).
- https://supabase.com/docs/guides/api/securing-your-api : a pre-request function; "The private.rate_limits table
  records the IP address and timestamp of each write request"; rejects "when an IP address makes more than 100 write
  requests in 5 minutes"; "only works with the Data API (PostgREST)"; only POST-type requests can be limited.
- Conflict: that pattern stores IPs in our database. Our design: store a keyed hash of the IP, delete rows older than
  10 minutes (pg_cron), say so in privacy.html (security purpose); the header to trust (cf-connecting-ip vs
  x-forwarded-for) must be checked on our project (unverified). Plus consistency checks per room in the JSON Schema
  (D5) and an hourly row-count alert. Note: if `created_at` is cut to the day (L5), the per-minute counts need their
  own short-lived table.

### S4. Supabase for later needs (Supabase docs, read 10.10)
- Realtime limits (https://supabase.com/docs/guides/realtime/limits), Pro: "Concurrent connections | ... | 500",
  "Messages per second | ... | 500" (2,500 with no spend cap), "Presence messages per second | ... | 50", broadcast
  payload 3,000 KB; "All limits are configurable per project".
- Counting and price (https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages): broadcast =
  "one message sent plus one message per subscribed client that receives it"; Pro includes 5 million a month;
  "$2.50 per 1 million messages".
- Our arithmetic: two live players streaming head and hands to each other at 20 Hz = 2 x 20 x 2 = 80 messages/s per
  pair; a 10-minute room = 48,000 messages; 5 million = about 100 pair-sessions a month, then about $0.12 each; the
  500/s cap = about 6 pairs at once. So: Supabase Realtime fits lobbies, matchmaking and signalling, not continuous
  pose streaming at scale; pose goes peer-to-peer (WebRTC data channel, signalled through Realtime), which also
  keeps motion off our server (L4). Source for WebRTC not yet opened (see "not reached").
- Edge Functions (https://supabase.com/docs/guides/functions/limits): "Maximum Memory: 256MB", "Maximum CPU Time:
  2s", wall clock on paid plans "400s": enough for consent checks, a CAPTCHA check or an export job.
- Analytics: Postgres views plus exported files cover our sizes; no case found for a second analytics service.

### S3. Supabase as processor (Supabase docs, read 10.10)
- https://supabase.com/docs/guides/security/gdpr-compliance : choosing a region "does not make your application GDPR
  compliant on its own"; "Backups, logs, data exported to external systems" affect residency; "Supabase secures the
  underlying infrastructure", "you're responsible for your application's data processing activities, consent flows,
  and access controls". The DPA itself sits on a legal page ("Request or view the DPA", supabase.com/legal/dpa),
  outside the docs we may read: its terms and whether it binds us without signing are unverified (owner to open).

### D1. Consent version on every row
- GDPR Art 7(1) (https://gdpr-info.eu/art-7-gdpr/): "the controller shall be able to demonstrate that the data
  subject has consented"; Art 7(3): "It shall be as easy to withdraw as to give consent". Art 5(2)
  (https://gdpr-info.eu/art-5-gdpr/): the controller must "be able to demonstrate compliance".
- With anonymous rows we cannot show who consented, only under which text: a `consent` field (the consent text's
  version, an integer) in every row is the only record that row X was collected under wording Y. Science needs it
  most: rows under "general statistics only" wording can never be used for papers (data-platforms.md, decision 1).

### D2. Sending only after the reveal
- Already read (vr/06-science.md): APA 8.07(c) "permit participants to withdraw their data"; BPS IMR "A button at the
  very end of a study confirming consent"; Greenspan & Loftus 2022: "nine participants" withdrew after debriefing.
  Today `reveal()` sends before the reveal pages (06-science.md, finding 3; premortem lens 2 #3).
- GDPR Art 7(3) adds the same for personal data. Verdict: send only after "keep / discard my result", shown after
  the reveal; discard sends nothing. Cost now: one screen and a test; after five rooms: the same change five times.

### D3. Retention
- GDPR Art 5(1)(e): identifiable data "for no longer than is necessary", longer only "solely for ... scientific or
  historical research purposes or statistical purposes" under Art 89(1) safeguards. Ukraine Art 6(8): "no longer than
  necessary for lawful purposes" (L1). Anonymous data: no limit in either text (Recital 26).
- BPS Code of Human Research Ethics 2021 (objekt-files/papers/bps-2021-code.txt, line 746, the ethics-application
  template): give "details of how your research data will be managed including retention, archiving, destruction and
  publishing open datasets"; "It is recommended that all researchers ... write a Data Management Plan (DMP)".
- Verdict: three clocks written in privacy.html and the data plan: provider logs 7 days (Supabase's, S3); a
  rate-limit table minutes (D6); anonymous result rows kept without limit, plus a yearly frozen snapshot.

### D7. What science partners and ethics boards will ask of the data
- Preregistration before data collection (OSF / AsPredicted, ethics-law.md 1e); approval documents at submission
  (PLOS ONE: "prior approval"); a Data Management Plan (BPS, D3); vrprotocols checklist: "csv with a codebook", head
  orientation "in a separate file", "Prevent Reidentification" (study-methods-3.md).
- Data sharing: APA Ethics Code 8.14(a) (objekt-files/papers/apa-ethics-code-2017.txt): after publication
  psychologists "do not withhold the data on which their conclusions are based" from those verifying, "provided that
  the confidentiality of the participants can be protected".
- De-identification standard: UK Data Service, "Introduction to anonymisation techniques" (2025, read in full, saved
  objekt-files/papers/ukds-2025.txt): de-identification alone leaves data "identifiable, hence data protection
  legislation applies"; anonymisation makes "the risk of identifying a data subject ... negligible", "generally by
  treating indirect identifiers" (sex, age, region...); techniques "recoding, banding, top/bottom coding,
  generalisation"; tools "sdcMicro" (R, free) and "QAMyData" (detects "missingness, duplication, outliers and direct
  identifiers"). For us: our indirect identifiers are age group, gender, seated/standing, device, date; check the
  rare combinations before any public file (cell threshold, data-platforms.md decision 10).
