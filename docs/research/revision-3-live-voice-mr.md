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

### 2a-2b. The browser's own speech in the Quest Browser

- **Recognition: reported missing; no Meta page names it.** Meta forum (archived), M. Mainguy, about 2024:
  the speech-recognition API "doesn't seem to be exposed on meta quest2" [read in the browser pane,
  https://communityforums.atmeta.com/discussions/dev-quest/speechrecognition-in-webxr/1168273; no reply]. Meta's
  "Browser specifications" (2026-07-21, https://developers.meta.com/horizon/documentation/web/browser-specs/, via
  metavr) lists no speech API and says "Do not use the user-agent string for feature detection"; the last ten
  release notes (42.0 to 152.1, https://developers.meta.com/horizon/documentation/web/browser-release-notes/) never
  mention speech [read]. Today's Quest 3 browser 152: **unverified**; one console line in the headset settles it.
  Even where it exists (desktop Chrome), that API sends audio to the browser maker's server [unverified here].
- **Synthesis: our own observation only.** src/engine/voice.js: "Quest Browser has no speech synthesis at all"
  (commit a41845d, 7 Oct 2026; no source or probe log recorded). No Meta page found either way: **unverified**.
  It does not matter for the choice: recorded lines are kept anyway (2f).

### 2c. On-device Whisper: accuracy by model size (the paper, read in full)

- Radford et al. 2022, "Robust Speech Recognition via Large-Scale Weak Supervision", arXiv 2212.04356
  (https://arxiv.org/abs/2212.04356; text read from the PDF), Table 13 "WER (%) on Fleurs" [read]:
  | Model | Russian WER % | English WER % |
  |---|---|---|
  | tiny | 31.1 | 12.4 |
  | base | 20.5 | 8.9 |
  | small | 11.4 | 6.1 |
  | medium | 7.2 | 4.4 |
  | large-v2 | 5.6 | 4.2 |
  Table 11 (Common Voice 9), Russian: base 28.8, small 15.0, large-v2 7.1. Read: the sizes a headset can run
  (tiny, base) get one Russian word in three to five wrong; usable for "yes / no / a number" answers, not for coding
  free explanations (choice blindness, two phones). Column order read from the rotated headers: checked against
  neighbours (Polish 5.4, Portuguese 4.3), but a fact-checker should re-read the table.

### 1b. Transports

- **Supabase Realtime (we already pay for it)** [read]
  - Limits, https://supabase.com/docs/guides/realtime/limits: concurrent connections Free 200, Pro 500, "Pro (no
    spend cap)" 10,000; messages per second Pro 500, Pro without cap 2,500; "Channels per connection" 100;
    broadcast payload 3,000 KB on Pro. Over a limit it refuses joins or disconnects (`too_many_connections`,
    `tenant_events`), and "supabase-js reconnects automatically once throughput drops".
  - Price: messages, https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages: "Each broadcast
    message counts as one message sent plus one message per subscribed client"; Pro includes 5 million, then "$2.50
    per 1 million messages". Connections, .../realtime-peak-connections: Pro includes 500, then "$10 per 1,000 peak
    connections", counted as the month's highest concurrent number.
  - Speed, https://supabase.com/docs/guides/realtime/benchmarks: broadcast over WebSockets median 6 ms, p95 28 ms,
    p99 213 ms; broadcast from the database median 46 ms (server-side figures; the player's own internet trip to
    Ireland comes on top, unmeasured).
  - Server truth, https://supabase.com/docs/guides/realtime/broadcast: "`realtime.send()` inserts a message"
    from the database (so a Postgres function can hold sealed choices and announce them only when all are in);
    private channels with row-level policies, but "private topics accept only authenticated clients" (our players
    are anonymous today: Supabase anonymous sign-in would be needed [unverified for our project]).
  - Carries no audio or video: live voice between players needs WebRTC beside it.
- **networked-aframe** [read] — GitHub API (10 Oct): 1,206 stars, 53 open issues, last push 2026-10-03, latest
  release 0.14.3 (2026-03-30). README (https://github.com/networked-aframe/networked-aframe): the basic example
  loads A-Frame 1.8.0 (no stated range); adapters: WebSockets ones carry "No audio/video"; easyrtc and janus carry
  audio; the native "webrtc" adapter has "No current maintainer". Authority: "The owner of an entity is responsible
  for syncing its component data" (owner-based, not server-held). Needs its own Node server (EasyRTC, uWebSockets,
  Socket.IO or Janus). Fit: built for shared avatars and moving objects, not for sealed simultaneous decisions;
  1.7.1 compatibility **unverified**.
- **PartyKit / Cloudflare Durable Objects** [read] — Cloudflare blog, 5 Apr 2024
  (https://blog.cloudflare.com/cloudflare-acquires-partykit): PartyKit is "an open source platform for deploying
  real-time, collaborative, multiplayer applications" on Durable Objects. Pricing
  (https://developers.cloudflare.com/durable-objects/platform/pricing/): paid plan "minimum $5/mo usage"; requests
  "1 million / month, + $0.15/million"; incoming WebSocket messages at a 20:1 ratio, outgoing free; "Durable Objects
  that are idle and eligible for hibernation are not billed for duration". One object per group = a small
  server-held room with its own code (TypeScript/JS on Cloudflare): a second platform beside Supabase.
- **Colyseus** [read] — MIT, 7,355 stars, pushed 2026-10-09 (GitHub API). https://colyseus.io/pricing/: open source
  "Self-host on your own servers", Colyseus Cloud "Starting at $15/mo", "No CCU/DAU/MAU limits". A Node server
  with server-held room state: the classic authoritative model, but one more server to run.
- **Croquet / Multisynq** [read] — croquet/croquet README: "build real-time multiuser apps without writing
  server-side code"; logic runs replicated on every client, synced by a "reflector server"; uses "Multisynq's
  global DePIN network" and needs a Multisynq API key; the multisynq-client repo is archived (GitHub API,
  `archived: true`, last push 2025-08-25). Our inference: every client holds all state, so sealed choices (economic
  games) would sit in every player's memory: a cheating hole by design.
- **Photon (Realtime)** [read] — https://www.photonengine.com/realtime/pricing: free 20 CCU, development only; "100
  CCU (launch) $95 one-time, valid 12 months"; 500 CCU $95/month; 1,000 CCU $185/month; 3 GB traffic per CCU. The
  page does not mention its JavaScript SDK (web support **unverified** here).
- **Normcore** [read] — https://docs.normcore.io/platforms: "Normcore currently supports all platforms supported by
  Unity 2020 LTS and newer"; web = Unity "WebGL" only. Not usable from A-Frame.
- **Meta's own options for WebXR** [read] — the meta-vr plugin's Group Presence skill (hz-platform-sdk,
  references/group-presence.md) is for "Meta VR Android applications" (Kotlin; minimum "HzOS v78"); `metavr docs
  search` for WebXR multiplayer returns only Unity and Unreal samples (Shared Spaces with "Photon Realtime");
  Meta's browser specification page names none. Not found: any Meta multiplayer, matchmaking or voice service for
  a WebXR page.
- **Voice between players (WebRTC relay)** [read] — Cloudflare Realtime SFU and TURN pricing
  (https://developers.cloudflare.com/realtime/sfu/pricing/): "The first 1,000 GB each month is free", then "$0.05
  per GB of egress". Our arithmetic, with an assumed 32 kbit/s voice stream: a 4-player, 10-minute room sends each
  player about 7 MB, so 10,000 players is about 72 GB, inside the free part. LiveKit (open-source relay, Apache-2.0,
  21,355 stars, GitHub API) is the self-hosted alternative; its price page was not read.

### 1e. When nobody is online: computer partners and earlier players' recorded choices [read]

- March 2019, CESifo WP 7926 (https://www.ifo.de/DocDL/cesifo1_wp7926.pdf, full text read; journal version
  J. Econ. Psychol. 2021, doi 10.1016/j.joep.2021.102426, 162 studies, paywalled): over 90 studies, "humans act more
  selfishly and more rational in the presence of computer players". His review excludes "papers that use
  deception" and names the honest alternatives economists use: telling participants "they are matched with subjects
  from a previous session" (Shapiro 2009; Cox et al. 2017).
- What follows for us (our reading): an unlabelled bot breaks the economists' norm and the owner's "no invented
  mechanics"; a labelled bot changes behaviour (March). The clean fallback is the second one: "you play against
  the recorded choices of earlier real players", stated openly. It needs a server that stores each decision with
  its context and replays it, which fits a database (Supabase) better than a pure relay. Live groups only when
  enough players are waiting; the room must work both ways from the first build.
- **What on-device costs in download** [read, Hugging Face API, onnx-community/whisper-*, 10 Oct]: 8-bit encoder +
  decoder: tiny 10.1 + 30.7 MB, base 23.2 + 53.7 MB, small 92.3 + 156.8 MB. So base (Russian WER 20.5 %) is about
  77 MB per player, small (11.4 %) about 249 MB, before the first answer; cached after. WebGPU in the Quest Browser
  is "Experimental" in Meta's notes (146.0, 21 Apr 2026: "Experimental WebGPU and WebXR depth projection support";
  152.1, 2 Oct 2026: "Experimental WebGPU composition layers") [read, release notes]; whether a page gets a GPU
  adapter by default, and how fast base or small runs on a Quest 2 or 3 while the scene renders: **unverified**
  (no report found; a headset probe is the only source).

### 2d-2e. Cloud speech-to-text and the privacy of voice [read]

- **ElevenLabs (already our account).** https://elevenlabs.io/docs/models: Scribe v2 is "designed for accurate
  transcription across 90+ languages"; the deprecated table lists `scribe_v1` "First generation speech recognition
  (outclassed by v2 models)", replacement `scribe_v2`. **Our tools/check-voice.mjs still asks for `scribe_v1`**: a
  one-word fix, no removal date given. No WER figure on the page.
- **Retention.** https://elevenlabs.io/docs/resources/zero-retention-mode: by default retention is on, data kept "to
  improve services"; deleted items "can remain in backups for up to 30 days"; the no-retention mode is for
  "Enterprise customers" only, though it covers "Speech to Text endpoints". So player voice sent to ElevenLabs on
  our plan is stored by a US company.
- **Law (already in our docs).** own-experiments-now-2.md 4c: GDPR biometric data only when processed "for the
  purpose of uniquely identifying"; Russia's 152-FZ Art. 18(5) bars collecting Russian citizens' data into
  databases outside Russia. Player audio sent to any foreign cloud is personal data at least; docs/ideas/
  multiplayer-voice.md already rules "Only numbers leave it, never audio or transcripts". A cloud recogniser breaks
  that rule; an on-device one keeps it.
- Russian-specific cloud services (e.g. Yandex SpeechKit, data in Russia): not read in this pass (**not found**).

### 2f. The voice we use now: ElevenLabs "Daniel", eleven_v3 (tools/make-voice.mjs) [code, read]

- Code: stock voice "Daniel" (comment: "ElevenLabs stock voice"), model `eleven_v3`, stability 1, every line
  evened to -18 LUFS; the key is read from the home folder, never stored.
- Licence, https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform: "The
  free plan does not include a commercial license"; "All paid plans include a commercial license, provided you're
  not using Beta Services"; "Content created outside of a paid subscription (before or after) cannot be used
  commercially." So every line that ships must be generated while a paid plan is active; which plan the owner's
  account is on: **unverified** (owner). No page found on separate terms for stock voices (**unverified**).
- Model status, https://elevenlabs.io/docs/models: "Eleven v3 is our previous generation speech synthesis model";
  the flagship is now `eleven_v4`; v3 is not in the deprecated list and nothing is marked beta. Re-recording the
  corridor in v4 would change the voice's sound: keep v3 until a reason appears; note it.
- **A country can cut the server** [read] — TechCrunch, 27 Feb 2026
  (https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/):
  "The blocking order was issued on February 24"; supabase.co was unreachable on three Indian providers while
  supabase.com stayed up. Russia: no report found (searched in Russian). Our results and any live room hang on one
  domain; a custom domain in front of it is the usual hedge [unverified for Supabase Pro].

### 3. Mixed reality in the Quest Browser: what changed since 04-mr.md (8 Oct) [read]

- docs/research/vr/04-mr.md (read in full) stands: passthrough, planes, persistent anchors (8 per site), hit test
  without a room scan, mesh, depth, hand joints; never camera pixels inside WebXR; headset cameras only through a
  separate getUserMedia permission; our headset granted all of them (docs/headset-capabilities.md).
- **Quest 2 is the weaker MR device.** Meta, "Mixed Reality Support in Browser" (metavr fetch,
  https://developers.meta.com/horizon/documentation/web/webxr-mixed-reality/): "Passthrough is in color on the Meta
  Quest Pro and grayscale on Meta Quest 2." Meta Help (https://www.meta.com/help/quest/1406582186767703/): "Mesh
  data is only available on Quest 3 and Quest 3S headsets"; "Depth data is only available on Meta Quest 3 and Quest
  3S headsets." Hit test on Quest 2 without depth (planes only?) and headset cameras on Quest 2: **unverified**.
- **Depth through Meta's SDK.** IWSDK Ch. 15 (2026-07... last_updated "2026-09-04"): "Setting `required` to `true`
  prevents the immersive session from starting when the device cannot provide depth data" (so depth must be
  optional for Quest 2 players). Ch. 14 (2026-07-22): environment raycast "does not require room scanning".
- **Browser since 8 Oct:** release 152.1 (2 Oct 2026) adds only "Experimental WebGPU composition layers"; nothing
  new for passthrough, planes, anchors or depth [read, release notes].
- **The decision that shapes every room** (from 04-mr.md, conflict 2): one `immersive-ar` session can show the
  corridor fully virtual and fade to the real room by alpha, with no second session or button press; but whether
  the boundary still guards a VR scene inside an AR session, and what it costs in frame time, is unprobed (04-mr
  Gaps). Decided now, it costs one probe; decided after five rooms, it means re-testing every room's entry.

### 4. Spatial audio [code, read]

- **Now:** src/engine/sfx.js places effects with the browser's own Web Audio panner, "HRTF panning", inverse
  distance, listener on the head every frame; src/engine/voice.js plays the voice unplaced (straight to the output).
  Meta: "most sounds should be authored as monophonic (single channel) sources" and "Apps should support 3D audio
  spatialization, although it is not required" (docs/research/vr/01-meta.md §5, read 8 Oct).
- **A-Frame's own** `sound` component (https://github.com/aframevr/aframe/blob/v1.7.1/docs/components/sound.md):
  `positional` defaults to true, `distanceModel` "inverse"; it names no panning model. Ours is equal or better.
- **Resonance Audio (web)**: GitHub API: `archived: true`, last push 2022-03-08; npm `resonance-audio` latest 1.0.0
  of 2017-11-08. Room reverberation and occlusion it offered are frozen; adopting an archived library is a debt.
- **Omnitone**: "a robust implementation of ambisonic decoding and binaural rendering written in Web Audio API"
  (README, https://github.com/GoogleChrome/omnitone); npm 2.0.0 on 2026-09-30, not archived. It decodes
  ambisonic recordings (a whole recorded sound field) and points to Resonance for "interactive panning"; useful
  only if a room needs a recorded 360-degree ambience (a crowd, a street), not for placed sounds.
- **Gap to fix in our code, not a tool:** the experimenter's voice is unplaced. In a room where the experimenter
  stands or speaks through a loudspeaker, placing the voice at that source is Meta's own advice (avoid head-locked
  sound); the corridor's automatic announcement can stay unplaced. Owner's call only where no source decides.

### 1f. Cheating and who holds the truth (our reasoning from the pages above)

- A browser client is open to its player. Sealed simultaneous choices (Herrmann, Fehr & Gächter) must sit on a
  server and be revealed only when all are in: possible in a Postgres function plus `realtime.send()` (Supabase), in
  a Durable Object, or in a Colyseus room; not in Croquet (every client holds all state) nor in networked-aframe's
  owner model. Our `submit_run` is already this pattern (insert-only, field whitelist; docs/state.md).

### 1g. Cost at 100 and 10,000 players a month (our arithmetic on the prices read; assumptions marked)

| Design | Supabase Pro (have) | Durable Objects | P2P WebRTC (+ relay) |
|---|---|---|---|
| Decisions only (4-player game, 10 periods, ~3 sends per period: about 160 messages per player) | 100: 16 k msgs, 0 $; 10,000: 1.6 M, inside the 5 M included, 0 $ | inside 1 M requests: 5 $ minimum | needs signalling anyway; 0 $ |
| Bodies streamed (head + hands, 20 Hz, 4 players, 10 min: about 48 k messages per player) | 100: 4.8 M, 0 $; 10,000: 480 M, about 1,190 $ | 10,000: about 6 M requests, about 1 $ | 0 $ server; relay inside 1,000 GB free |
| Voice (4 players, 10 min, 32 kbit/s assumed) | cannot carry it | cannot carry it | about 72 GB at 10,000: 0 $ (Cloudflare free part) |

- Peak connections: 10,000 players a month is far below 500 at once unless a scheduled event (Durrheim's 14 at
  once is the largest room in docs/ideas/multiplayer-voice.md); Pro's 500 included holds [our estimate].
- The lesson: send decisions and rare events through the server, never bodies at frame rate; if a room needs
  bodies (mirror game, proxemics), carry them peer-to-peer.
