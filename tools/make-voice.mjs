// Generates the experimenter recordings of a room with ElevenLabs.
// Usage: node tools/make-voice.mjs <room-id | app/lobby> [--force]
// The API key is read from ~/.elevenlabs-key.txt and never printed or stored in the repo.
// Existing files are kept unless --force is given, so re-running costs nothing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The experimenter voice chosen by the owner: "Daniel" (ElevenLabs stock voice),
// firm and confident: model v3 with a delivery tag in front of every line.
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';
const MODEL_ID = 'eleven_v3';
const SETTINGS = { stability: 0.5 };
const DELIVERY = '[уверенно, твёрдо] ';

// A room id (01-control) or a folder under src/ with its own voice-lines.js (app/lobby).
const room = process.argv[2];
const force = process.argv.includes('--force');
if (!/^[\w/-]+$/.test(room || '')) { console.error('usage: node tools/make-voice.mjs <room-id | app/lobby> [--force]'); process.exit(1); }

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const roomDir = room.includes('/') ? path.join(src, room) : path.join(src, 'rooms', room);
const { VOICE_LINES } = await import(pathToFileURL(path.join(roomDir, 'voice-lines.js')).href);
const key = fs.readFileSync(path.join(os.homedir(), '.elevenlabs-key.txt'), 'utf8').replace(/^﻿/, '').trim();

for (const line of VOICE_LINES) {
  const out = path.join(roomDir, line.file);
  if (fs.existsSync(out) && !force) { console.log('keep  ', line.file); continue; }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: DELIVERY + (line.spoken || line.text), model_id: MODEL_ID, voice_settings: SETTINGS })
  });
  if (!res.ok) { console.error('error ', line.file, res.status, (await res.text()).slice(0, 200)); process.exitCode = 1; continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log('wrote ', line.file);
}
