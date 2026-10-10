# Engine and tools: the right ones, the wrong ones, what we lack (Quest WebXR)

Research for the owner's question (10 Oct 2026): are A-Frame 1.7.1, plain modules and our tools the
right ones for a WebXR game on Meta Quest, and what Meta's own tools would add. Meta pages read with
the Meta VR CLI (`metavr docs search` / `metavr docs fetch`, metavr 1.8.0.17.10); GitHub and release
notes on the open web. Marks: **[read]** the page was opened and the quote is in it; **[code]** read
in source code; **[unverified]** not confirmed.

## The parts (each gets an answer or "not found")

1. Meta's WebXR performance guidance, Quest 2 and Quest 3: numbers; draw-call budget per frame or per eye;
   what Meta recommends to cut CPU and draw calls (multiview, instancing, merging, atlases, KTX2, fixed
   foveation, layers, frame rate, baked light).
2. Multiview today: Quest Browser; A-Frame 1.7.x, 1.8.x, newest; three.js (release, OVR_multiview2 vs
   OCULUS_multiview, bugs); IWSDK; Babylon.js; known-good on Quest 2?
   2a. Our own vendor file: does 1.7.1 pass the multiview flag? (vendor/aframe-1.7.1.min.js)
   2b. supermedium/three.js PR #25 (deferred texture uploads lost in 1.8.0).
3. IWSDK: what it is, version, maturity, users; performance, UI, locomotion, store/PWA path, testing
   without a headset (IWER, dev tools); fit for a no-build plain-modules repo; a move from A-Frame
   (what maps to what); cost and risk.
4. Options with cost and gain: (a) A-Frame 1.7.1 + merging/atlases; (b) A-Frame 1.8 / newest;
   (c) patched three.js inside A-Frame; (d) IWSDK; (e) plain three.js; (f) Babylon.js; which one
   Meta's guidance points to for a new Horizon Store WebXR title.
5. Meta tools we do not use: metavr perf / ovrmetrics / traces for the browser; Meta XR Simulator /
   IWER; Horizon Store PWA tooling (bubblewrap); VRC checks; what each would have caught today.

A correction to the brief: the repo does not import `@iwsdk/locomotor`. A grep of `src/`, `index.html`
and `vendor/` finds no `@iwsdk` import; `src/engine/locomotion-math.js` borrows IWSDK's numbers only
("A stick fires past 0.8, the turn threshold of Meta's Immersive Web SDK (packages/core/src/locomotion)").

## Findings (written as they come)

### Part 1. Meta's WebXR performance guidance (all pages fetched with `metavr docs fetch`, 10 Oct 2026)

- **Budget numbers, Quest 3 vs Quest 2** [read] — "Device-specific optimization (Quest 3 vs Quest 2)", last_updated
  2026-05-11, https://developers.meta.com/horizon/resources/device-optimization-comparison/ — table "Performance targets":
  target frame rate "72 Hz (90 Hz recommended)" (Quest 3) / "72 Hz" (Quest 2); frame budget "13.8 ms (at 72 Hz)" both;
  "**Recommended draw calls** | < 200 | < 100"; "**Recommended triangles per frame** | < 1.5M | < 750K"; GPU "~2.5x Quest 2 GPU";
  "Quest 2 is more draw-call sensitive. Batch geometry and use instanced rendering where possible."
- **Per frame or per eye?** The page does not say. The triangles row says "per frame"; the draw-calls row has no unit.
  The page is engine-generic (its "see" links go to Unity, Unreal and Native performance pages, not to Web), and on those
  engines Quest builds render both eyes in one pass by default [unverified for this page; the native page
  `documentation/native/po-perf-opt-mobile` returned 45 bytes through metavr]. So reading "< 100" as "per frame with
  both eyes drawn by one call each" is the strict reading our tests already use (QUEST2_VIEW = 50 per view); reading it
  as one submission per object per frame (multiview) is the native reading. **Unverified which one Meta means.**
- **Draw calls cost CPU, not GPU** [read] — "WebXR performance optimization workflow", 2026-07-21,
  https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/ — "draw calls can be CPU intensive";
  "Submitting 1000 individual triangles as unique draw calls would likely cause your app to run at less than 72 frames
  per second". Fixes named there, in this order: "merge small meshes into larger chunks"; "Both multi-view rendering and
  instanced mesh rendering are great options for reducing the number of draw calls"; "minimizing state changes between
  draw calls"; batching "objects that use the same material into a single call"; portal/occlusion culling; LOD;
  "Any app logic that takes longer than two milliseconds should be considered for optimization." Frame budgets listed:
  "72 FPS = 13.7 milliseconds per frame", "90 FPS = 11.1 milliseconds per frame". First step it demands: find out CPU- or
  GPU-bound ("not render anything"), then vertex- or fragment-bound (render scale 0.01).
- **Multiview** [read] — "Multiview WebGL Rendering" (undated), https://developers.meta.com/horizon/documentation/web/web-multiview/ —
  "Multiview is an experimental feature"; "Only CPU-bound experiences will benefit from multi-view. Often, a CPU usage
  reduction of 25% - 50% is possible"; "`OCULUS_multiview` is available out-of-the-box in the Browser, while the
  `OVR_multiview2` extension is behind the flag"; "Only WebGL 2.0 supports this extension"; it is set up through a WebXR
  Layers projection layer with `textureType: "texture-array"`; "This is the recommended way to render a scene on Quest hardware."
- **Textures** [read] — "WebXR Performance Best Practices" (undated), https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/ —
  "KTX 2.0/Basis Universal is the recommended approach to texture-compression for WebXR experiences on Meta Quest devices".
  Device page: "Compress textures using ASTC format".
- **Lights, baked light** [read] — same page: "limit yourself to one directional light or one point light if you're making
  heavy use of PBR materials"; "For fully static setups (i.e., static lighting and static objects), consider baking
  lighting into lightmaps." Shadows: "Drawing the scene to render the shadow map counts against your overall scene budget
  for draw calls and triangles."
- **Clear colour** [read] — same page: "Set your clear color to white or black" (Adreno "Fast clear" on Quest 1 and 2).
  Our room 01 clears to `#0b0b0d` (src/rooms/01-control/scene.js:25), not black: a small free fix to measure.
- **Staggered updates** [read] — same page: "you might only need to update animations 30 times a second even though
  you're rendering at 90 frames a second".
- **Fixed foveation** [read] — workflow page: FFR "can significantly improve performance"; it is for fragment-bound apps.
  We set `foveationLevel: 0` for sharp door numbers (scene.js:17-20): right while we are CPU-bound, worth re-testing
  at "low" if a GPU (fragment) bound is found.
- **Frame rate** [read] — "WebXR App Framerate Control" (undated), https://developers.meta.com/horizon/documentation/web/webxr-frames/ —
  "A WebXR session on the Browser runs by default at 90 frames per second on Meta Quest 2 and 72 frames per second on Meta
  Quest headsets"; set with `session.updateTargetFrameRate` (Browser 16.4+). Our code never calls it (grep of src/: no
  `updateTargetFrameRate`), so **on Quest 2 our budget may be 11.1 ms, not 13.7 ms** [unverified on a Quest 2 today; the page is old].
- **Layers** [read] — "WebXR Layers", https://developers.meta.com/horizon/documentation/web/webxr-layers/ — "With Layers, you
  only need to submit rendered content when the layer updates"; workflow page: "rendering the background scene of your
  application into a layer means you only need to re-render it when the background changes". Also "Higher quality
  rendering of imagery and text" (fits the clipboard and the plaques).
- **Measuring tools Meta names for the browser** [read] — "WebXR Performance Tools", https://developers.meta.com/horizon/documentation/web/webxr-perf-tools/ —
  OVR Metrics Tool HUD ("highly recommended that you keep this HUD up and running throughout development");
  `ovrgpuprofiler --realtime="29,30"` (vertex vs fragment share); CPU cost through `chrome://inspect#devices` → "trace"
  with the "xr.debug" category; RenderDoc Meta fork (draw-call GPU cost).

### Part 2a. Our A-Frame 1.7.1: multiview cannot turn on [code, verified 10 Oct]

- `vendor/aframe-1.7.1.min.js` (A-Frame "1.7.1", three.js REVISION "173") defines the XR manager as
  `class Rm extends gr{constructor(t,e,n,i){...` and switches multiview with `r.isMultiview=i&&n.has("OCULUS_multiview")`
  (fourth argument). The renderer builds it as `const wt=new Rm(E,xt);` — two arguments — so `isMultiview` is always
  false. The renderer does read the option (`multiviewStereo:d=!1`, and A-Frame passes `n.multiviewStereo`), it is
  simply never handed to the manager. The caller's statement is confirmed.
- In the same file `runDeferredUploads` appears once (its definition) and is never called; harmless there because
  deferral is only switched on in the multiview path.

### Part 2b. A-Frame 1.8.0 and master: multiview is passed, the deferred texture uploads are lost [code + read]

- A-Frame 1.8.0, released 2026-06-24 (GitHub API `releases/tags/v1.8.0`), is the newest release (npm `latest` = 1.8.0).
  Its package.json: `"three": "npm:super-three@0.184.0"`; release notes: "Update THREE to r184". A-Frame master
  (commit 4573b95, 2026-07-08, "Bump THREE to r185") uses `npm:super-three@0.185.0`.
- super-three's renderer (jsdelivr `super-three@<v>/build/three.module.js`, grep):
  - 0.181.0: `new WebXRManager( _this, _gl, extensions, multiviewStereo )` and, after the scene, `textures.runDeferredUploads();` (line 17226) — **fixed**.
  - 0.184.0 (A-Frame 1.8.0): `if ( xr.enabled && xr.isMultiview ) { textures.setDeferTextureUploads( true ); ...`
    (line 18105) but **no call** to `runDeferredUploads` anywhere — **broken**.
  - 0.185.0 (A-Frame master, super-three `latest`, 2026-07-08): same as 0.184.0 — **broken**.
  So with `multiviewStereo: true` on 1.8.0 or master, a texture first uploaded during a multiview frame is queued and
  never uploaded (stays black). The reviewer's statement is confirmed for 1.8.0 and also holds for master.
- The history [read] — https://github.com/supermedium/three.js/pull/25 "Fix multiview for WebXRManager, restoring and
  updating lost changes", merged 2025-09-17; its first point: the `textures.runDeferredUploads()` call had been lost.
  A comment of 2026-03-24 (KooIaIa) says the fix "was overwritten in dev again"; vincentfretin (2026-03-28): correct in
  branch `super-r181` (commit 9bee41b), the dev commit broken. https://github.com/supermedium/three.js/pull/26 "Added
  WebXR Spacewarp on top of Multiview" (open since 2026-03-24, no review) "Re-adds multiview fixes that were lost in an
  upstream update"; its A-Frame side is aframevr/aframe#5795 (open).
- A-Frame's own documentation of the flag [read] — https://raw.githubusercontent.com/aframevr/aframe/v1.8.0/docs/components/renderer.md —
  "Performance improvement for applications that are CPU limited and draw count bound"; uploads are "deferred until the
  rendering of the main scene has ended, adding one extra frame of latency"; "Another issue is rendering mirror
  reflexions or rendering another view in the middle of the scene. The logic would have to move to the beginning of the
  frame"; "this flag is disabled by default". This matters to us: src/engine/mirror.js and reflect-env.js render other
  views. A user report on Quest 2 (aframevr/aframe#5260, 2024-01-31): text vanished in immersive mode with
  `multiviewStereo: true`; mrxz: "With multiview you're not allowed to perform any texture operations once rendering has started."

### Part 2c. three.js upstream, IWSDK, Meta's skill text [code]

- **Upstream three.js** (npm `three` latest = 0.186.1, jsdelivr build, grep): `build/three.module.js` (WebGLRenderer)
  has **no** "multiview" at all. `build/three.webgpu.js` (WebGPURenderer, also on its WebGL 2 fallback) has XR
  multiview: `constructor( renderer, multiview = false )`, and it turns on only
  `if ( this._useMultiviewIfPossible && renderer.hasFeature( 'OVR_multiview2' ) )`. Meta's multiview page says
  `OVR_multiview2` "is behind the flag (chrome://flags)" in the Quest Browser while `OCULUS_multiview` is on by default,
  so upstream three.js multiview may not engage on Quest Browser at all [unverified on today's browser; Meta's page is undated].
  Multiview with WebGLRenderer exists only in the supermedium fork ("super-three"), which A-Frame and IWSDK both use.
- **IWSDK turns multiview on by default, on the good fork build** [code] — `@iwsdk/core@1.0.1` (npm latest, 2026-10-01)
  depends on `"three": "npm:super-three@0.181.0"` — the build that still calls `textures.runDeferredUploads()` — and
  `dist/init/world-initializer.js` creates `new WebGLRenderer({ antialias: true, ... multiviewStereo: true, ... })`;
  `dist/init/xr.js` offers `['local-floor', 'bounded-floor', 'layers']` by default (multiview needs the layers feature).
  So the one shipped stack that runs supermedium multiview with its upload fix in place today is IWSDK.
- **Meta's IWSDK agent skill** (meta-vr plugin, `skills/hz-iwsdk-webxr/SKILL.md`) [read]: "Draw call budget is much lower
  than native -- Aim for under 50-80 draw calls on Quest 2 and under 100-120 on Quest 3. JavaScript overhead per draw
  call is higher than native." `references/performance-tips.md`: "Aim for fewer than 100 draw calls total"; "Multiview
  effectively halves the draw call count for stereo rendering. It is supported on all Quest headsets and should be
  enabled whenever possible." **Caution**: the same reference shows APIs that do not match the sources I read —
  `renderer.xr.useMultiview = true` (no such property in super-three or three.js; multiview is a renderer constructor
  option), `session.fixedFoveatedRendering.level` (Meta's FFR page uses `XRWebGLLayer.fixedFoveation`),
  `navigator.xr.enableSpaceWarp` [unverified], "Triangle count under 750K per eye" (Meta's device page: "per frame"),
  and "Quest Browser defaults to 72 Hz" (Meta's frame-rate page: 90 on Quest 2). The skill is a helper, not a source.

### Part 3. Meta's Immersive Web SDK (IWSDK)

- **What Meta says to use** [read] — "WebXR overview", 2026-07-21, https://developers.meta.com/horizon/documentation/web/webxr-overview/ —
  "Use the Immersive Web SDK (IWSDK) as the primary path for building an immersive web experience."
- **What it is** [read] — "Immersive Web SDK" overview, 2026-09-04, https://developers.meta.com/horizon/documentation/iwsdk/guides/overview/ —
  "It combines Three.js rendering with an Entity Component System (ECS)"; includes "XR and browser input", "Locomotion
  and grabbing", "Spatial audio and Havok physics", "UIKitML spatial interfaces", "A managed browser, XR emulation, a
  native scene editor, and command-line tools". Note: the page says it was "verified against landed source ... (IWSDK v0.5.3)",
  older than the package now shipped.
- **Version and maturity** [read, npm registry] — `@iwsdk/core` first published 2025-09-17; 1.0.0 on 2026-09-24; latest
  1.0.1 on 2026-10-01; MIT. Meta's blog of Oct 7, 2025 (https://developers.meta.com/horizon/blog/immersive-web-sdk-new-era-spatial-web-development/)
  called it "available now in early access" and claimed custom input management "reduces draw calls by up to 70 percent"
  [read; the claim is not explained there]. GitHub facebook/immersive-web-sdk: 338 stars, 33 open issues, last push
  2026-10-01 (API, 10 Oct) — against A-Frame 17,654, Babylon.js 26,150, three.js 116,196. Shipped titles built on it:
  **not found** (the blog names *In Tirol* and a PUMA demo as examples of what can be built, not as IWSDK titles).
- **Build step required** [read] — "Chapter 1: Project Setup", 2026-09-04, https://developers.meta.com/horizon/documentation/iwsdk/guides/01-project-setup/ —
  "IWSDK projects use Vite, Three.js, and an Entity Component System (ECS)"; Node "20.19 or later"; the project is
  `iwsdk.config.json` + `public/scenes/main.iwsdk.scene.json` + `src/*.ts` + `vite.config.ts`. "Chapter 8: Build and
  Deploy", 2026-09-23, https://developers.meta.com/horizon/documentation/iwsdk/guides/08-build-deploy/ — "Your starter
  app uses Vite to create a production build"; output `dist/` to GitHub Pages. This contradicts our rule "no build
  step" (CLAUDE.md): a move to IWSDK means adopting Vite and npm dependencies (`@iwsdk/core` 1.0.1 pulls `elics`,
  `@pmndrs/uikit`, `@babylonjs/havok`, `three-mesh-bvh`, `@preact/signals-core`, ... per its package.json).
  Using `@iwsdk/core` from a CDN through an import map without Vite: **not documented** [unverified].
- **Performance it gives** [code] — multiview on by default on super-three 0.181.0 (Part 2c); `layers` offered by
  default. No IWSDK GitHub issue mentions multiview (search `repo:facebook/immersive-web-sdk multiview`: 0 results);
  Meta's IWSDK tutorial is "verified with" Quest 3 / 3S, not Quest 2 (testing guide below). Known-good on Quest 2: **not found**.
- **Testing without a headset: IWER** [read] — "Chapter 2: Testing Your Experience", 2026-09-04,
  https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/ — "IWER (Immersive Web Emulator
  Runtime) is a WebXR emulator that runs entirely in your browser, allowing you to develop and test WebXR applications
  without a headset"; "We recommend using a Meta Quest 3 or Quest 3S for development, because this tutorial is verified
  with those devices." IWER is a separate package: npm `iwer` 2.5.0 (2026-09-24), MIT, deps only `gl-matrix` and
  `webxr-layers-polyfill`. Its getting-started page (https://meta-quest.github.io/immersive-web-emulation-runtime/getting-started.html)
  offers a script tag or an import map without a bundler, `new XRDevice(metaQuest3); xrDevice.installRuntime();`, and
  a JS API to move the head and press controller buttons (`xrDevice.controllers['left'].updateButtonValue('x-button', 1)`).
  **It works in our no-build page as it is** — the "headset run in CI (an emulated WebXR device)" that
  docs/target-architecture.md lists as still to build.
- **Store path is framework-free; Meta documents A-Frame on it** [read] — "Getting Started with WebXR PWAs", 2026-07-22,
  https://developers.meta.com/horizon/documentation/web/pwa-webxr/ — "WebXR PWAs should behave like native immersive
  apps ... launching directly into immersive mode right after launch"; the page gives code for "### Three.js" and
  "### A-Frame" (`if (window.getDigitalGoodsService !== undefined) { const scene = document.querySelector('a-scene'); ...`).
  The meta-vr skill `hz-store-pwa/SKILL.md` [read]: "Immersive WebXR app ... (IWSDK is the easy path)"; the pipeline is
  "package as a signed Meta VR APK with `@meta-quest/bubblewrap-cli`, and upload with `ovr-platform-util`". IWSDK is
  therefore not required for the Horizon Store; nothing read ties the store or in-app purchases to IWSDK.
  (The web in-app purchase page `documentation/web/web-iap` returned nothing through metavr: **unverified** URL.)

### Part 3 (cont.). Babylon.js multiview [read, forum]

- Enabled through the WebXR Layers feature: `enableFeature(WebXRFeatureName.LAYERS, ..., { preferMultiviewOnInit: true })`
  (https://forum.babylonjs.com/t/multiview-in-webxr-using-quest-3-in-2024/48191, Feb 2024). A Quest 3 user "never saw an
  improvement in FPS while using the OVR metrics tool"; maintainer RaananW: "multiview is not a magic solution to suddenly
  render in double the framerate."
- Apr 2025, Babylon.js v8.1.1 (https://forum.babylonjs.com/t/xr-multiview-layers-water-material-crashes-in-quest-browser/57698):
  RaananW: "all materials in the babylon materials library) does not work in multiview, as it is missing the multiview
  extension in the shader." No fix shown. Known-good on Quest 2: **not found**.

### A side effect of this research (for the owner)

- Running `metavr vrc-local guide` (expected to print a guide) **downloaded a 305 MB "VRC-local runtime bundle" (668 MB unpacked)**
  into `C:\Users\admin\.hzdb\cache\vrc-local` and **installed ten skills for Claude Code**: new folders in
  `C:\Users\admin\.agents\skills\` (analyze-drive, da-scout, perf-render-capture, renderdoc-optimize, runtime-optimizer,
  troubleshoot, vrc-drive, vrc-listing-assets, vrc-listing-check, vrc-verdict) and links to them in the newly created
  `C:\Users\admin\.claude\skills\`. User-level skills load in every project, against the owner's decision that only
  CodeRabbit and the TypeScript server are on for every project. Not undone by me: the owner decides. To undo: delete
  the ten links in `C:\Users\admin\.claude\skills\` (and, if wanted, `C:\Users\admin\.agents\` and the cache folder).

### Part 2b (cont.). The A-Frame 1.8.0 build itself [code]

- `aframe@1.8.0/dist/aframe-v1.8.0.js` (jsdelivr, grep): `const xr=new WebXRManager(_this,_gl,extensions,multiviewStereo);`
  (line 53318) — multiview is passed; occurrences: `setDeferTextureUploads(true)` 1, `runDeferredUploads(){` 1 (the
  definition), `textures.runDeferredUploads()` **0**. Every texture first uploaded during an XR frame with multiview on
  is queued forever. In our game that is every canvas we redraw in VR: panel.js, the clipboard sheet and ink.js (hand
  writing), board.js, lightbox.js, decal.js, blob-shadow.js (grep `CanvasTexture|needsUpdate = true` in src/).
- Our mirrors already render in `tick`, before either eye (src/engine/reflect-env.js:5-6, mirror.js:2-3: "captured once"),
  which is what A-Frame's docs ask for under multiview.

### Part 1 (cont.). A second Meta budget: native ranges per frame [read]

- Meta, "Unity performance" (last_updated 2024-10-30), https://developers.meta.com/horizon/documentation/unity/unity-perf/ —
  "Various factors influence the number of draw calls you can execute per frame"; table: "Quest 2, Quest Pro | 80-200 |
  Busy Simulation", "200-300 | Medium", "400-600 | Light Simulation"; Quest 3/3S 200-300 / 400-600 / 700-1000. "Light
  Simulation: Applications with minimal pipeline state changes such as escape room games, puzzle games". These are Unity
  numbers (Unity on Quest renders single-pass multiview; Meta's draw-call analysis page notes "there are twice as many
  objects" in VR, https://developers.meta.com/horizon/documentation/unity/po-draw-call-analysis/). Meta's WebXR pages
  give no draw-call number of their own; the "< 100 on Quest 2" is the device-comparison page, engine-generic.
  Our strict reading (< 100 per frame, both eyes drawn separately → < 50 per view) is the safe one; Meta does not say
  "per eye" anywhere I read.

### Part 2a (cont.). 1.7.1 has both faults [code]

- The same vendored file also holds the multiview render path:
  `if(X&&At.render(t),wt.enabled&&wt.isMultiview)et.setDeferTextureUploads(!0),Ot(m,t,e,e.cameras[0].viewport);`
  and no call of `runDeferredUploads`. So 1.7.1 would need two edits to run multiview: hand the flag and the extensions
  to the manager, and run the deferred uploads after the scene. The supermedium PR history matches: #22 "Fix multiview"
  (closed unmerged, 2025-01-31), #24 "some changes were lost in a previous rebase" (closed, 2025-08-14), #25 merged
  2025-09-17 (GitHub API `repos/supermedium/three.js/pulls?state=all`).

### Part 2 summary: multiview, where it works today

| Stack | Multiview passed | Deferred uploads run | State |
|---|---|---|---|
| A-Frame 1.7.1 (ours; super-three r173) | no (`new Rm(E,xt)`) | no | off; two edits to turn on [code] |
| A-Frame 1.8.0 (2026-06-24; super-three 0.184.0) | yes | **no** | on = textures drawn first in VR stay black [code] |
| A-Frame master (2026-07-13; super-three 0.185.0) | yes | **no** | same as 1.8.0 [code] |
| super-three 0.181.0 | yes | yes | the good build [code] |
| IWSDK 1.0.1 (super-three 0.181.0) | yes, on by default | yes | the only shipped stack with it on [code]; Quest 2 not confirmed |
| three.js upstream 0.186.1 WebGLRenderer | no multiview | — | [code] |
| three.js upstream WebGPURenderer | only via `OVR_multiview2` | — | Meta: that extension is behind a flag in Quest Browser [read, undated page] |
| Babylon.js | via the Layers feature | — | library materials lack multiview shaders (Apr 2025) [read, forum] |

Does `OCULUS_multiview` exist in today's Quest Browser? Meta's page says yes ("available out-of-the-box"), undated;
no 2026 report either way was found; IWSDK 1.0 relies on it. **Unverified on our headset**: one line in the headset
console (`renderer.getContext().getExtension('OCULUS_multiview')`) settles it.

### Part 4. The options, each with its cost and its gain

Our size (wc/grep, 10 Oct): src/engine ~2,900 lines, src/app ~1,900, room 01 ~1,000; 19 `AFRAME.registerComponent`;
~150 `<a-...>` tags in the two scene files; the smoke and draw-call tests read `document.querySelector('a-scene')`.

| Option | Cost | Gain | Risk |
|---|---|---|---|
| (a) Stay on 1.7.1, cut draw calls (merge by material, one atlas for plaques/signs, instancing for repeats, room behind the door hidden) | work on content only; already started (merge-static.js) | Meta's first-listed fix ("merge small meshes into larger chunks"); needed on every engine (IWSDK's skill also says "< 100"); to pass the strict reading: corridor 66 → < 50 per view (-25 %), room 97 → < 50 (-49 %) | low |
| (a+) free fixes on 1.7.1: clear colour pure black; `updateTargetFrameRate(72)` on Quest 2 | minutes | Adreno fast clear on Quest 1/2 [read]; 13.9 ms instead of 11.1 ms if Quest 2 really starts at 90 [read, undated page] | low; measure |
| (b) A-Frame 1.8.0 / master as shipped | upgrade r173 → r184/185 (release notes: Clock → Timer, `pcfsoft` removed, `npot` removed); retest all | fixes we use: "Click event triggered on the wrong controller with the `cursor` component", controller reconnect, Quest `hand-controls` orientation [read, release notes] | multiview **must stay off**: on, our canvas texts go black [code] |
| (c) 1.8.0 with the one lost line restored (`textures.runDeferredUploads()` after the scene, as in super-three 0.181.0), vendored as a static file | one patched vendor file we own until upstream fixes it (PR #26 open); keep no build step; mirrors already render in `tick` | multiview: one submission for both eyes; Meta: "CPU usage reduction of 25% - 50% is possible" for CPU-bound apps; per-frame calls ≈ per-view calls (corridor ~66, room ~97, both < 100) [arithmetic from our measures; unverified in headset] | medium: experimental ("Multiview is an experimental feature"); one frame of texture lag; KooIaIa found it working on a built A-Frame (Aug 2025, device not named) |
| (d) Move to IWSDK 1.0.1 | Vite build + npm deps + Node ≥ 20.19 (breaks "no build step"); rewrite 19 components into ECS systems, the HTML scenes into code or `*.iwsdk.scene.json`; tests rewritten | Meta's "primary path"; multiview on by default on the good fork; IWER, locomotor (whose numbers we already copy), pointers, UIKitML, Havok; the store skill's "easy path" | high: 1.0 is 16 days old; 338 stars; docs verified against v0.5.3; tutorial verified on Quest 3/3S, not Quest 2; no shipped title found |
| (e) Plain three.js (upstream) | rewrite all of A-Frame's role (entities, controllers, lasers, scene loading) | none on multiview: upstream WebGLRenderer has none; WebGPURenderer needs `OVR_multiview2` (behind a flag on Quest per Meta) | high, and no draw-call gain; plain *super-three 0.181* = IWSDK without its tools |
| (f) Babylon.js | full rewrite into another engine | multiview through Layers; mature engine | high; library materials without multiview (Apr 2025); a Quest 3 user saw no FPS gain |

**Which one Meta points to.** For a new WebXR title: IWSDK — "Use the Immersive Web SDK (IWSDK) as the primary path"
(webxr-overview, 2026-07-21); "IWSDK is the recommended development path for both screen-based 3D sites and immersive
WebXR experiences on Meta Quest" (https://developers.meta.com/horizon/documentation/web/3d-web/, 2026-07-22). For the
Store: no engine is required — Meta's PWA page gives A-Frame code for the auto-enter step (pwa-webxr, 2026-07-22).
