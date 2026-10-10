-- The data revision as one whole (docs/research/revision-2-data.md; docs/owner-decisions.md: "one
-- migration of the live database now"), in one transaction: an error anywhere leaves the server as it was.
-- 1. A row keeps the date only and a random key. A time to the microsecond and an increasing id let
--    a row be matched to an IP in the provider's logs, kept 7 days (revision-2-data.md, L5).
-- 2. Every row names the consent text it was given under: the controller "shall be able to demonstrate
--    that the data subject has consented" (GDPR Art 7(1); D1). Rows from before carry 0: unknown.
-- 3. A room's report is checked against its JSON Schema, one per room version (pg_jsonschema; D5): the
--    same file the game's test reads (supabase/schemas/01-control-1.json), so a room's checks are data,
--    and a new room cannot break another's.
-- 4. Floods are limited per source, as Supabase's own example does (100 writes in 5 minutes from one
--    IP: "Securing your API"), but without the IP: a hash of it under a secret key, forgotten after
--    10 minutes by a job every minute (pg_cron); the global caps per minute stay (D6).

begin;

create extension if not exists pg_jsonschema with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- 1 and 2: the three tables (the old id's sequence and the created_at indexes go with their columns)
alter table app.runs add column created_on date;
update app.runs set created_on = (created_at at time zone 'utc')::date;
alter table app.runs alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.runs drop column created_at;
alter table app.runs drop column id;
alter table app.runs add column id uuid not null default gen_random_uuid() primary key;
alter table app.runs add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.runs alter column consent drop default;

alter table app.playtests add column created_on date;
update app.playtests set created_on = (created_at at time zone 'utc')::date;
alter table app.playtests alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.playtests drop column created_at;
alter table app.playtests drop column id;
alter table app.playtests add column id uuid not null default gen_random_uuid() primary key;
alter table app.playtests add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.playtests alter column consent drop default;

alter table app.issues add column created_on date;
update app.issues set created_on = (created_at at time zone 'utc')::date;
alter table app.issues alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.issues drop column created_at;
alter table app.issues drop column id;
alter table app.issues add column id uuid not null default gen_random_uuid() primary key;
alter table app.issues add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.issues alter column consent drop default;

-- 3: one schema per room version
create table app.room_schemas (
  room text not null check (room ~ '^[0-9]{2}-[a-z0-9-]{1,30}$'),
  version int not null check (version between 1 and 1000),
  schema json not null,
  primary key (room, version)
);
alter table app.room_schemas enable row level security;
revoke all on table app.room_schemas from public, anon, authenticated;

insert into app.room_schemas (room, version, schema) values ('01-control', 1, $json$
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$comment": "Room 01 (illusion of control), version 1: the report of a finished run (src/rooms/01-control/report.js, room.js). The server checks every report against it (supabase/migrations/0009_data_protection.sql); tests/results.test.mjs checks the game against it.",
  "type": "object",
  "additionalProperties": false,
  "required": ["condition", "speed"],
  "properties": {
    "condition": { "enum": ["25-25", "75-75"] },
    "speed": { "const": 1 },
    "seated": { "type": "boolean" },
    "trials": { "type": "number", "minimum": 0, "maximum": 1000 },
    "presses": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greens": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greenIfPress": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greenIfNoPress": { "type": "number", "minimum": 0, "maximum": 1000 },
    "confirming": { "type": "number", "minimum": 0, "maximum": 1000 },
    "voided": { "type": "number", "minimum": 0, "maximum": 1000 },
    "strays": { "type": "number", "minimum": 0, "maximum": 1000 },
    "total": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "ifPress": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "ifNoPress": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "successes": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "successesOfAll": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "actualControl": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errTotal": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errIfPress": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errIfNoPress": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "answers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "control": { "type": "number", "minimum": 0, "maximum": 100 },
        "total": { "type": "number", "minimum": 0, "maximum": 100 },
        "ifPress": { "type": "number", "minimum": 0, "maximum": 100 },
        "ifNoPress": { "type": "number", "minimum": 0, "maximum": 100 },
        "certainty": { "type": "number", "minimum": 0, "maximum": 100 },
        "evidence": { "type": "number", "minimum": 0, "maximum": 5 },
        "hypotheses": { "type": "number", "minimum": 0, "maximum": 1 },
        "gender": { "type": "number", "minimum": 0, "maximum": 2 },
        "age": { "type": "number", "minimum": 0, "maximum": 6 },
        "knew": { "type": "number", "minimum": 0, "maximum": 3 }
      }
    }
  }
}
$json$);

-- 4: who sent lately, as a keyed hash only, for 10 minutes
create table app.limit_key (key bytea not null);
insert into app.limit_key (key) values (extensions.gen_random_bytes(32));
alter table app.limit_key enable row level security;
revoke all on table app.limit_key from public, anon, authenticated;

create table app.recent (
  source bytea not null,
  kind text not null check (kind in ('run', 'playtest', 'issue')),
  at timestamptz not null default now()
);
create index recent_source_at_idx on app.recent (source, at);
create index recent_at_idx on app.recent (at);
alter table app.recent enable row level security;
revoke all on table app.recent from public, anon, authenticated;

select cron.schedule('forget-recent-sources', '* * * * *',
  $job$delete from app.recent where at < now() - interval '10 minutes'$job$);

-- Called by the submit functions (their owner runs it): busy when this source sent 100 in 5 minutes or
-- the game received p_global of this kind in the last minute. The client's IP is the first entry of
-- X-Forwarded-For ("Securing your API").
create function app.allow(p_kind text, p_global int)
returns void
language plpgsql
set search_path = ''
as $$
declare
  ip text := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  src bytea;
begin
  select extensions.hmac(convert_to(trim(ip), 'UTF8'), key, 'sha256') into src from app.limit_key;
  if (select count(*) from app.recent where source = src and at > now() - interval '5 minutes') >= 100
     or (select count(*) from app.recent where kind = p_kind and at > now() - interval '1 minute') >= p_global then
    raise exception 'busy';
  end if;
  insert into app.recent (source, kind) values (src, p_kind);
end;
$$;
revoke execute on function app.allow(text, int) from public, anon, authenticated;

-- The entry points, each now with the consent version. The old ones go: they wrote the old columns.
drop function public.submit_run(text, int, boolean, jsonb);
drop function public.submit_playtest(text, int, jsonb);
drop function public.submit_issue(text, int, jsonb);

create function public.submit_run(p_room text, p_version int, p_first boolean, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  s json;
begin
  select schema into s from app.room_schemas where room = p_room and version = p_version;
  if s is null then raise exception 'unknown room'; end if;
  if p_first is null then raise exception 'bad first'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or pg_column_size(p_report) >= 2048 or not extensions.jsonb_matches_schema(s, p_report) then
    raise exception 'bad report';
  end if;
  perform app.allow('run', 120);
  insert into app.runs (room, version, first_run, consent, report) values (p_room, p_version, p_first, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_run(text, int, boolean, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_run(text, int, boolean, int, jsonb) to anon;

-- 0004's checks, unchanged
create function public.submit_playtest(p_room text, p_version int, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['finished', 'secs', 'away', 'presses', 'voided', 'seated', 'device',
                                   'next', 'boring', 'guessed', 'trouble', 'psych'];
  phases constant text[] := array['intro', 'run', 'questions', 'reveal'];
  devices constant text[] := array['quest2', 'quest3', 'quest3s', 'questpro', 'desktop', 'other'];
  k text;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 2048 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  if jsonb_typeof(p_report -> 'finished') is distinct from 'boolean' then raise exception 'bad finished'; end if;
  if p_report ? 'seated' and jsonb_typeof(p_report -> 'seated') <> 'boolean' then raise exception 'bad seated'; end if;
  if p_report ? 'device' and not ((p_report ->> 'device') = any (devices)) then raise exception 'bad device'; end if;
  if p_report ? 'secs' then
    if jsonb_typeof(p_report -> 'secs') <> 'object' then raise exception 'bad secs'; end if;
    for k in select jsonb_object_keys(p_report -> 'secs') loop
      if not (k = any (phases)) then raise exception 'unexpected phase %', k; end if;
      if jsonb_typeof(p_report -> 'secs' -> k) <> 'number'
         or (p_report -> 'secs' ->> k)::numeric not between 0 and 7200 then
        raise exception 'bad phase time %', k;
      end if;
    end loop;
  end if;
  -- small whole numbers in fixed ranges
  if coalesce((p_report ->> 'away')::numeric, 0) not between 0 and 7200
     or coalesce((p_report ->> 'presses')::numeric, 0) not between 0 and 1000
     or coalesce((p_report ->> 'voided')::numeric, 0) not between 0 and 1000
     or coalesce((p_report ->> 'next')::numeric, 0) not between 0 and 10
     or coalesce((p_report ->> 'boring')::numeric, 0) not between 0 and 4
     or coalesce((p_report ->> 'guessed')::numeric, 0) not between 0 and 2
     or coalesce((p_report ->> 'trouble')::numeric, 0) not between 0 and 4
     or coalesce((p_report ->> 'psych')::numeric, 0) not between 0 and 2 then
    raise exception 'out of range';
  end if;
  perform app.allow('playtest', 60);
  insert into app.playtests (room, version, consent, report) values (p_room, p_version, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_playtest(text, int, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_playtest(text, int, int, jsonb) to anon;

-- 0007's checks, unchanged
create function public.submit_issue(p_room text, p_version int, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['kind', 'message', 'file', 'line', 'device', 'browser', 'state', 'xr'];
  kinds constant text[] := array['error', 'rejection'];
  devices constant text[] := array['quest2', 'quest3', 'quest3s', 'questpro', 'desktop', 'other'];
  states constant text[] := array['idle', 'intro', 'run', 'questions', 'done'];
  k text;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 1024 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  if not ((p_report ->> 'kind') = any (kinds)) then raise exception 'bad kind'; end if;
  if p_report ? 'device' and not ((p_report ->> 'device') = any (devices)) then raise exception 'bad device'; end if;
  if p_report ? 'state' and not ((p_report ->> 'state') = any (states)) then raise exception 'bad state'; end if;
  if p_report ? 'xr' and not ((p_report ->> 'xr') = any (array['vr', 'none'])) then raise exception 'bad xr'; end if;
  if length(coalesce(p_report ->> 'message', '')) > 200 or length(coalesce(p_report ->> 'file', '')) > 60
     or length(coalesce(p_report ->> 'browser', '')) > 40 then
    raise exception 'too long';
  end if;
  if p_report ? 'line' and (jsonb_typeof(p_report -> 'line') <> 'number'
     or (p_report ->> 'line')::numeric not between 0 and 100000) then
    raise exception 'bad line';
  end if;
  perform app.allow('issue', 60);
  insert into app.issues (room, version, consent, report) values (p_room, p_version, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_issue(text, int, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_issue(text, int, int, jsonb) to anon;

commit;
