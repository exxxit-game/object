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
