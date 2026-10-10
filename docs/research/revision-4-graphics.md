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
