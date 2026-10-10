# Tool revision, area 3 of 5: live players, voice, mixed reality, spatial audio

Research for the owner's tool revision (10 Oct 2026): for each tool or choice, what we use now, the best option,
keep / change / add, why, what it costs now versus after five rooms, and what only the owner decides. Marks:
**[read]** the page or code was opened and the quote is in it; **[code]** read in source; **[unverified]** not
confirmed on a primary page. Meta pages through `metavr docs` where it had them. Written as found.

## The parts (each gets an answer or "not found")

1. Live players
   1a. What we use now (Supabase Pro, anonymous results; no live code).
   1b. Transport options: Supabase Realtime (Broadcast, Presence; limits, price); WebRTC data channels with a
       signalling server; Colyseus; Croquet / Multisynq; PartyKit / Cloudflare Durable Objects; Photon (JS);
       Normcore (web?); Meta's own options for WebXR.
   1c. networked-aframe: state, maintenance, A-Frame 1.7 support.
   1d. Latency the experiments need: conformity (Asch, Mori & Arai), cooperation and economic games, the mirror game.
   1e. Matchmaking with few players; bots or pre-recorded partners when nobody is online (the economists' rule on
       deception).
   1f. Cheating: who holds the truth (server-authoritative state).
   1g. Cost at 100 and 10,000 players.
2. Speech
   2a. Web Speech API recognition in the Quest Browser.
   2b. Speech synthesis in the Quest Browser (voice.js says none).
   2c. On-device Whisper (WebGPU / WASM) on a Quest: feasible, speed, Russian.
   2d. Cloud speech-to-text: ElevenLabs Scribe (used by tools/check-voice.mjs), others; Russian and English accuracy.
   2e. Privacy of voice data (GDPR, 152-FZ; retention by the provider).
   2f. TTS now: ElevenLabs "Daniel", eleven_v3 (tools/make-voice.mjs): licence for commercial use; alternatives.
3. Mixed reality in WebXR on Quest (immersive-ar, hit-test, anchors, planes, meshes, depth, camera): what works
   today; Quest 2 vs Quest 3 / 3S. Start from docs/research/vr/04-mr.md, check what changed.
4. Spatial audio: Web Audio PannerNode (ours, src/engine/sfx.js) vs Resonance Audio vs Omnitone; what A-Frame
   and IWSDK use.
5. Decisions for the owner; what to do first.

## Findings (written as they come)

### 1a. What we use now [code, read]

- No live-player code exists: a grep of src/ for realtime, websocket, webrtc, networked finds nothing; the only
  server is Supabase Pro (eu-west-1 Ireland), insert-only `submit_run` / `submit_playtest` for anonymous results
  (docs/state.md: "insert-only for anon, verified"). docs/headset-capabilities.md lists live players as
  "web standard (WebSocket/WebRTC); our Supabase has realtime". So nothing is sunk yet: the choice is free today.

### 1d. Latency the experiments need (from the papers in our library) [read]

- **Economic games are turn-based in seconds, not milliseconds.** Herrmann et al. 2008 instructions
  (papers/herrmann-2008.txt l.962): "You will have 90 seconds in the first two periods and 60 seconds in the
  remaining periods"; decisions "made simultaneously, and, once the decisions were made, they were informed"
  (l.34). Fehr & Gächter 2002 (papers/fehr-gachter-2002.txt l.12): "All the punishment decisions were also made
  simultaneously." Any transport with under ~1 s delivery is enough; what matters is that nobody sees others'
  choices before deciding (a server must hold them until all are in).
- **Conformity (Mori & Arai 2010) is turn-based and spoken.** papers/mori-arai-2010.txt l.34: "I will call upon
  each of you in turn to announce your judgments"; l.39: "Each trial took approximately 30 seconds"; groups of four
  (l.26). Latency need: about a second; but the answers are said aloud, so a faithful live version needs voice
  between players (or the answer spoken and relayed), which ties part 1 to part 2.
- **The mirror game is the one hard case.** Noy et al. 2011 (papers/noy-2011.txt l.34): players "synchronized to
  less than 40 ms"; l.45: "29% of segments showing timing differences of less than 40 ms". Over the internet this
  is out of reach for any transport; docs/ideas/multiplayer-voice.md §3 already plans it on one local network with
  added delay as the manipulation. Needs a peer-to-peer path (WebRTC) or a nearby server, and logged delay.
- **Disconnects are the real cost in online multiplayer studies.** Hawkins et al. 2020
  (papers/hawkins-2020.txt l.67): games "terminated before the completion of the experiment due to server error or
  network disconnection (40 in free matching and 33 in cued)". A pre-registered dropout rule and a reconnect path
  matter more than raw speed.
