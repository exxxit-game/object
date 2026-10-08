// Room 01's result must be exactly what the server accepts
// (the newest supabase/migrations/*.sql that defines submit_run): same fields, answer keys
// and ranges. A mismatch would silently lose every player's result.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { analyse } from '../src/rooms/01-control/report.js';
import { T } from '../src/rooms/01-control/texts.ru.js';

const dir = new URL('../supabase/migrations/', import.meta.url);
const sql = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
  .map(f => fs.readFileSync(new URL(f, dir), 'utf8')).filter(s => s.includes('function public.submit_run')).at(-1);
const list = (name) => [...sql.match(new RegExp(`${name} constant text\\[\\] := array\\[([^\\]]+)\\]`))[1]
  .matchAll(/'([^']+)'/g)].map(m => m[1]);
const allowed = list('allowed');
const answerMax = JSON.parse(sql.match(/answer_max constant jsonb := '([^']+)'/)[1]);

// a full run: every trial kind, every answer at its largest value
const log = [
  ...Array.from({ length: 40 }, (_, i) => ({ t: i, k: 'trial', v: { n: i + 1, press: i % 2 === 0, green: i % 4 !== 0, rt: 0.5 } })),
  { t: 50, k: 'void', v: 3 }, { t: 51, k: 'stray' }
];
const Q = T.questions;
const maxAnswer = { control: 100, total: 100, ifPress: 100, ifNoPress: 100, certainty: 100,
  evidence: Q.evidence.answers.length - 1, hypotheses: Q.hypotheses.answers.length - 1,
  gender: Q.gender.answers.length - 1, age: Q.age.answers.length - 1, knew: Q.knew.answers.length - 1 };
for (const [key, value] of Object.entries(maxAnswer)) log.push({ t: 60, k: 'answer', v: { key, value, pos: 0 } });

// exactly what room.js sends: { condition, ...analyse(log), seated, speed }
const report = { condition: '75-75', ...analyse(log), seated: true, speed: 1 };
for (const k of Object.keys(report)) assert.ok(allowed.includes(k), `server does not accept field ${k}`);
for (const [k, v] of Object.entries(report.answers)) {
  assert.ok(k in answerMax, `server does not accept answer ${k}`);
  assert.ok(v <= answerMax[k], `answer ${k} = ${v} above server limit ${answerMax[k]}`);
}
// every question the room asks has a server limit
for (const key of Object.keys(maxAnswer)) assert.ok(key in answerMax, `no server limit for question ${key}`);
assert.ok(Buffer.byteLength(JSON.stringify(report)) < 2048, 'report over 2 KB');

console.log('results tests: ok');
