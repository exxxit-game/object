# Revision 4 of 5: graphics and the content pipeline, at the scale of the whole game

The owner's question (10 Oct 2026): the smartest way, not the simplest, to build the pictures and sounds of
about 10 floors of 9 rooms, decided now while one corridor and one room exist. Budget: Quest 2, Meta's
"< 100" draw calls and "< 750K" triangles a frame; in our A-Frame 1.7.1 each eye draws on its own, so a view
must stay under 50 (tests/draw-calls.mjs). Measured worst views: corridor 66, room 97.
Marks: **[read]** the page was opened and the quote is in it; **[code]** read in source code here;
**[unverified]** not confirmed. Meta pages read with `metavr docs fetch` unless a URL says otherwise.

## The parts (each gets an answer or "not found")

1. Authoring rooms at 90-room scale: primitives in code vs glTF from Blender (baked lightmaps, KTX2/Basis,
   Draco/meshopt, gltf-transform), instancing, texture atlases; what Meta and shipped WebXR titles do; how much
   of the corridor would move.
2. Lighting: real-time vs baked; what Meta recommends for Quest 2.
3. Text: canvas textures vs MSDF (troika-three-text, A-Frame text) for sharpness and draw calls; readability limits.
4. A draw-call plan to under 50 a view for corridor and room, in order of payoff, from Meta's perf workflow.
5. Assets and licences: CC0 libraries, photogrammetry, Meta's own asset library (metavr), the provenance rule.
6. Audio: formats, spatialisation, loudness.
For each: what we use now; the best option; keep / change / add; cost now vs after five rooms.

## Findings (written as they come)

### Meta's WebXR best-practices page, re-read today [read]
"WebXR Performance Best Practices" (undated), https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/
(fetched 10 Oct with `metavr docs fetch`):
- Lights: "limit yourself to one directional light or one point light if you're making heavy use of PBR
  materials"; "consider using light probes as an alternative method of illuminating dynamic objects. For fully static
  setups (i.e., static lighting and static objects), consider baking lighting into lightmaps."
- Shadows: "Shadow-casting point lights are particularly problematic because they usually have 6 shadow maps".
- Textures: "KTX 2.0/Basis Universal is the recommended approach to texture-compression for WebXR"; "the in-memory
  size of the texture will be smaller and the GPU is able to access these textures more efficiently".
- PBR maps: "Experiment with dropping maps entirely or using lower-resolution maps".
- Overdraw: sort opaque "front-to-back"; transparent objects "rendered back-to-front ... a lot of fragments ... rendered
  to multiple times"; "make sure to stop drawing them once they're completely faded out".
- "Set your clear color to white or black" (Adreno fast clear on Quest 1 and 2).

### Meta's 3D asset library through the CLI [code, run 10 Oct]
`metavr asset search "fire extinguisher" --count 3 --json` answered with three models (ids 932110 "fire extinguisher",
620451 "compact canister", 47590 "A scuba tank"); each record has only the fields `id, name, image_url, fbx_url,
glb_url` (Facebook CDN links that expire). **No licence, author or source field.** The meta-vr skill
`metavr-cli/SKILL.md` describes it only as "Search Meta's 3D asset library". Nothing downloaded.

### Meta's WebXR perf workflow, re-read today [read]
"WebXR performance optimization workflow", https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/ :
"merge small meshes into larger chunks and look for any meshes that can be removed from the scene entirely";
"Both multi-view rendering and instanced mesh rendering are great options for reducing the number of draw calls";
"minimizing state changes between draw calls"; "batching objects that use the same material into a single call (either
through instanced rendering or manually combining these meshes in a 3D editing tool)"; "a portal system or occlusion
culling"; "Break apart large models ... to enable better frustum culling"; "If using instanced meshes, make sure you're
still performing some kind of frustum culling on them". GPU side: "Consider using static lighting (lightmaps,
environment maps, or light probes)"; "Compress textures to ETC or ASTC"; "If using anisotropic filtering, try switching
to bilinear"; "keep PBR materials on the 'hero objects' ... cheaper materials for things in the background".

### A shipped WebXR title by Meta: Project Flowerbed (three.js) [read]
- Repo, https://github.com/meta-quest/ProjectFlowerbed : "All 3D models are found in `content/models` are saved as
  `.gltf`s from Blender"; "The asset pipeline will compress them and convert textures to `ktx2` basis textures";
  "Any content that is modified in the `content` directory _must_ go through the **asset pipeline**"; sounds "compressed
  with `ffmpeg`"; "Assets ... have their own licenses" (code MIT).
- Case study, 23 Feb 2023, https://developers.meta.com/horizon/blog/project-flowerbed-a-webxr-case-study/ :
  "All of our 3D assets, including the main environment, were created in Blender"; "Textures were compressed into KTX2
  basis textures"; "KTX2 textures are much smaller in memory, faster to render"; instanced meshes for plants, fauna and
  repeating parts, "render in a single draw call" (with their own frustum culling and LOD added); "Be sure you're
  combining meshes where possible"; multiview "can almost halve the number of calls"; target "72 frames per second".
  Not in it: lightmaps, atlases, Quest 2 by name (WebFetch summary of the page; quotes checked against its text).

### A-Frame's own guidance and glTF support in our 1.7.1 [read + code]
- A-Frame 1.7.1 "Best Practices", https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/introduction/best-practices.md :
  "Each geometry, object, model without optimization is generally a draw call"; "Merge together all static meshes if
  possible"; "Texture atlases provide one efficient way to reuse materials while giving the impression of more variety";
  "If using models, look to bake your lights into textures rather than relying on real-time lighting and shadows."
- `gltf-model` docs, https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/components/gltf-model.md : Draco
  "occurs off the main thread in a Web Worker"; KTX2 needs `basis_transcoder.js` and `basis_transcoder.wasm` "from the
  three.js repository"; "Meshopt may have similar compression ratios to Draco, with much faster decompression";
  "compression does not particularly affect framerate".
- [code] `vendor/aframe-1.7.1.min.js` already holds the loaders for `KHR_texture_basisu`, `EXT_meshopt_compression`,
  `KHR_draco_mesh_compression`, `EXT_mesh_gpu_instancing`, `KHR_materials_unlit`; `basisTranscoderPath` and
  `meshoptDecoderPath` default to empty, the Draco path to gstatic.com. So glTF with KTX2 and meshopt needs only three
  decoder files vendored beside A-Frame: **no build step**.

### Text: canvas now; SDF options [code + read]
- Now [code]: every text is a 2D canvas on a `CanvasTexture` (src/engine/panel.js: "canvas text shows in a headset");
  in Inter (vendor/fonts, woff2). Panels with a transparent background are skipped by merge-static ("transparent parts
  (text panels, shadows, glass) are skipped"), so each such panel is its own draw call.
- A-Frame `text` (1.7.1), https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/components/text.md : "renders
  signed distance field (SDF) font text"; "MSDF helps to preserve sharp corners and edges"; "To use non-ascii characters,
  you need to create your own custom font"; "Bitmap font rendering limits you to the characters included in the font";
  "Tools for MSDF fonts may be less mature".
- troika-three-text, https://raw.githubusercontent.com/protectwise/troika/main/packages/troika-three-text/README.md :
  "signed distance fields (SDF)"; "All font parsing, SDF generation, and glyph layout is performed in a web worker";
  supports ".ttf", ".otf", ".woff" and ".woff2 is _not_ supported" (our Inter files are woff2). npm latest 0.52.5
  (2026-07-24). [code] troika-three-text's BatchedText source on its main branch: "@experimental ... batches them together to render in a single
  draw call ... only works in WebGL2 or where the OES_texture_float extension is available."
- aframe-troika-text 0.14.0 (2025-04-14), peer "aframe": "1.1.x - 1.7.x", used by a plain script tag after
  aframe 1.7.1 (README): "similar performance and quality to A-Frame's built-in SDF `text` component"; "reads font files
  directly (ttf, otf, woff)". https://github.com/lojjic/aframe-troika-text
- Sharpness beyond either: Meta "WebXR Layers" (undated),
  https://developers.meta.com/horizon/documentation/web/webxr-layers/ : "Higher quality rendering of imagery and text";
  "you can avoid double sampling and distortions". Earlier finding (docs/research/vr/02-standards.md): setting both
  `baseLayer` and `layers` throws, so layers need A-Frame's projection-layer path.

### Audio: what we have, what Meta asks [code + read]
- Now [code, ffprobe 10 Oct]: every file MP3 44.1 kHz 128 kbps; the voice mono, the effects **stereo** (corridor's
  breaker-clack, relay-thunk, sign-click, sign-hum; room 01's button, door, room). The voice is evened to -18 LUFS,
  -1.5 dBTP (tools/make-voice.mjs: "EBU R128 normalises programme loudness"); the effects are written as ElevenLabs
  returns them, with no loudness step (tools/make-sounds.mjs). Effects go through an HRTF `PannerNode`
  (src/engine/sfx.js, `panningModel = 'HRTF'`, inverse distance, `refDistance = 0.6`); the voice goes straight to the
  output (src/engine/voice.js: `src.connect(ctx.destination)`), i.e. head-locked.
- Meta "Immersive sound" (2026-03-11), https://developers.meta.com/horizon/design/immersive_sound/ : "most sounds should
  be authored as monophonic (single channel) sources"; head-locked stereo "should generally be avoided when possible";
  "a doubling of distance is a halving of intensity ... -6dB when it's 10 meters away". VRC.Quest.Audio.1: "Apps should
  support 3D audio spatialization, although it is not required" (docs/research/vr/01-meta.md, line 94).

### The glTF tool chain: gltf-transform [read]
- CLI page, https://gltf-transform.dev/cli : "npm install --global @gltf-transform/cli"; `optimize` "Optimize model by
  all available methods" ("Defaults ... may not be ideal for all scenes"); `etc1s` / `uastc` "KTX + Basis ... texture
  compression"; `meshopt` "Compress geometry and animation with Meshopt"; `instance` "Create GPU instances from shared
  mesh references"; `join` "Join meshes and reduce draw calls"; `palette` "Creates palette textures and merges materials".
- `palette`, https://gltf-transform.dev/modules/functions/functions/palette : "Currently only a material's base color,
  alpha, emissive factor, metallic factor, and roughness factor"; for many solid-coloured materials it "can reduce the
  number of materials used" and "significantly increase the number of Mesh objects eligible for join operations";
  "Materials already containing texture coordinates (UVs) are not eligible". **This is our case**: the corridor's parts
  are solid colours, and merge-static makes one draw call per colour (`look()` keys on colour, roughness, metalness...).
- It is an offline tool run on the laptop (Node), like tools/make-voice.mjs: the game still ships static files.
  Not installed by me.

### Baked light in three.js r173 (inside our A-Frame) [read + code]
- three.js r173 docs, https://raw.githubusercontent.com/mrdoob/three.js/r173/docs/api/en/materials/MeshStandardMaterial.html :
  "The light map. Default is null. The lightMap requires a second set of UVs." Same for aoMap.
- [code] r173 GLTFLoader maps the second UV set (glTF texcoord 1) to `uv1` and `occlusionTexture` to `aoMap`, but has no lightmap slot (glTF
  core has none): a baked lightmap is either baked into the colour texture (with `KHR_materials_unlit`, which our loader
  reads) or attached by a small component after load [unverified which looks better on the corridor].
- [code] merge-static keeps only `position`, `normal`, `uv` (`const KEEP`): a second UV set would be dropped; a merged
  lightmapped scene needs `uv1` added there.
- A shipped three.js-based WebXR engine, Needle (docs "Last Updated: 4/21/26"),
  https://engine.needle.tools/docs/how-to-guides/xr/vr-performance : "Keep draw calls under ~100-150 for Quest";
  lightmaps: "Pre-computed lighting for static scenes - zero runtime cost"; "Realtime shadows are one of the most
  expensive rendering features"; "Limit to a single directional light"; "Compressed textures use 4-8x less GPU memory".

### Our lights today [code]
- The corridor and room 01 live in one scene (docs/decisions.md, "One page and one scene"), so every lit material
  shades with every light in it: ambient x2 and **four point lights** (src/app/lobby/scene.js: `signLight`,
  `corridorLamp`; src/rooms/01-control/scene.js: the room's lamp, `obsLight`). Off lights are set to `intensity: 0`
  (src/app/lobby/lobby.js, room.js line 111), not removed, so three.js still shades them: [code] r173 `WebGLLights.js` counts every point light
  (`pointLength ++`) whatever its intensity, and only `object.visible === false` skips one (`WebGLRenderer.js`
  projectObject); a change in the light count recompiles shaders. The GPU cost itself is unmeasured. A-Frame's default material is PBR (`standard`).
  Meta's line: "one directional light or one point light if you're making heavy use of PBR materials".
- No real-time shadows: soft shadows are textured quads (src/engine/blob-shadow.js), the cheap way.

### Meta's art pages: bake, budget, sourcing [read]
- "Art and performance" (2025-07-25), https://developers.meta.com/horizon/design/art-and-performance/ : "You can gain a
  large performance boost by relying on static environment lighting that can be baked into lightmaps, light probes, or
  in some cases even a static object's diffuse texture. While a slowly swinging, flickering light bulb may create a
  wonderful atmospheric effect, it is not free." Triangle budgets "are per-frame totals, not per character".
- "Lighting and effects" (2025-06-27), https://developers.meta.com/horizon/design/lighting-and-effects/ : "Using
  real-time lights sparingly as they are resource-intensive. Bake lighting whenever possible."
- "Art assets" (2025-06-25), https://developers.meta.com/horizon/design/art-assets/ : for Spatial SDK "limit .gltf
  textures to 1024x1024 for best performance" (a native SDK; no WebXR number found).
- "Sourcing art assets", https://developers.meta.com/horizon/design/art-sourcing-assets/ : "Ensure assets are properly
  licensed before using them"; AI-generated assets "may suffer from issues like unoptimized geometry, poor UV mapping".
- Meta's Asset Library, https://developers.meta.com/horizon/documentation/unity/unity-asset-library-overview/ : "a
  collection of 3D models generated by AI"; "All assets are free to use and provide four levels of detail (LOD)".
  The page is for Unity (Meta XR Core SDK v83+); its licence for use outside Unity, in a public web game: **not found**.

### Free libraries and their licences [read]
- Poly Haven, https://polyhaven.com/license : "Our assets are all licensed as CC0"; "You do not need to give credit".
- ambientCG, https://docs.ambientcg.com/license/ : "All ambientCG assets are provided under the Creative Commons CC0 1.0
  Universal License"; "even for commercial purposes, all without asking permission".
- Smithsonian Open Access (FAQ, opened in the browser pane), https://www.si.edu/openaccess/faq : "2D and 3D images and
  data"; "Open Access items carry what's called a CC0 designation"; "CC0 only applies to copyright so you may still
  need someone else's permission" (trade marks).
- Fab (Epic; Quixel Megascans moved there), https://www.fab.com/eula (browser pane): Standard License "usage is not
  limited to Unreal Engine"; "You may not: Resell or redistribute the asset for free on a standalone basis or allow
  others to do the same". Our reading [unverified, legal]: a web game serves every model and texture as a public file
  anyone can save, which sits badly with that clause; CC0 has no such clause.

### More on our code and the remaining sources [code + read]
- [code] Every text panel's face is `new THREE.MeshBasicMaterial({ map: this.tex, transparent: true })` with a canvas of
  its own (src/engine/panel.js), even on an opaque plate (door signs: `bg: ${BRAND.plate}`, src/app/brand.js). So the 10
  door signs (9 rooms and the stairs, src/app/lobby/scene.js line 69), the two notices, the light box face and the
  extinguisher's label are each a separate, back-to-front sorted draw call; merge-static never takes them. The
  extinguisher (about 30 primitives) is kept out of the merge (`data-dynamic`), "a dozen more draw calls"
  (docs/decisions.md). Surfaces (block, linoleum, ceiling, cork, lens, wood) are 512 px canvases, one per kind
  (src/engine/surface.js): one draw call per kind per merged group.
- KTX Artist Guide (Khronos), https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md :
  "ETC1S offers greater compression and works better with large areas of solid colors"; "UASTC offers higher visual
  quality for high-contrast high-detail color textures"; example: "saves about 82% in GPU memory".
- MP3 loops: WebKit bug 228215 (2021), https://bugs.webkit.org/show_bug.cgi?id=228215 : "Chrome and Firefox properly
  parse those MP3 which results in a continuous audio stream when looping" (fixed in Safari since). Quest Browser is
  Chromium-based, so MP3 can stay [unverified on the Quest itself].
- Game loudness targets: Sony's ASWG-R001 (-24 LUFS console, -18 LUFS portable) is cited only second-hand (Audiokinetic
  blog, its page did not render in the browser pane): **unverified**. A 2016 VR article,
  https://www.gamedeveloper.com/audio/standardizing-loudness-in-virtual-reality , proposes no number: "Loudness
  standardization has started for regular console games based on broadcast standards (-23LUFS".
