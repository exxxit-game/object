# Engine, native side: Unity and Godot against our web stack (Quest)

The owner's question (10 Oct 2026): is there a better foundation than ours, Meta's IWSDK or Unity? The web side
(A-Frame, IWSDK, three.js, Babylon.js) is in [engine-and-tools.md](engine-and-tools.md) and
[engine-and-tools-2.md](engine-and-tools-2.md) and is not redone here. Since then multiview runs on our A-Frame 1.8.0
(one lost line put back, tests/vendor.test.mjs) in the owner's Quest 3 at 90 Hz (docs/board.md). Marks: **[read]** the
page was opened and the quote is in it; **[code]** read in source or a CLI; **[unverified]** not confirmed.

## The parts (each gets an answer or "not found")

1. Unity on Quest for this game: draw-call budgets, single-pass multiview, baked light, text (TextMeshPro, Cyrillic),
   store path (APK, Horizon Store), in-app purchases, Platform SDK, mixed reality and passthrough, testing without a
   headset (Meta XR Simulator), headless CI tests (licence), build times, editor on a Windows 10 laptop (size),
   licence and price today (Personal limits, Runtime Fee), what we lose (browser site, desktop play, no-install links,
   instant updates, our 6,000 lines and tests).
2. Godot 4 on Quest: OpenXR, Meta toolkit, store path, maturity, web export with WebXR.
3. An AI assistant in each: scenes and prefabs as files; official AI tooling (Unity AI, MCP servers for Unity and Godot).
4. Meta's own guidance on choosing WebXR vs Unity for a new Horizon Store title; changes since July 2026.
5. Verdict table: A-Frame / IWSDK / Unity / Godot; cost, gain, risk, future tasks; the one measurement or fact that
   would change it.
6. Future tasks (the caller's addition): live players replacing scripted people (Mori & Arai), our own experiments run
   live, mixed reality where the original was a real room, voice (answers into the microphone), ~10 floors of 9 rooms,
   paid packs (in-app purchases), several languages: for each engine built-in, a known library, or build it ourselves.

## Findings (written as they come)

### Part 1. Unity on Quest (Meta pages through `metavr docs fetch`, 10 Oct 2026)

- **Draw calls** [read] — Meta, "Unity performance" (2024-10-30), https://developers.meta.com/horizon/documentation/unity/unity-perf/ —
  "Various factors influence the number of draw calls you can execute per frame"; Quest 2 "80-200 | Busy Simulation",
  "200-300 | Medium", "400-600 | Light Simulation"; Quest 3/3S up to "700-1000 | Light Simulation"; light simulation =
  "escape room games, puzzle games". Our game is that class. The web figure is "< 100" on Quest 2
  (engine-and-tools.md, Part 1). So Unity's room per frame on Quest 2 is about 4-6 times ours, on Meta's numbers.
- **Multiview is the default** [read] — Meta, "Using Single Pass Stereo Rendering and Stereo Instancing" (undated),
  https://developers.meta.com/horizon/documentation/unity/unity-single-pass/ — "Multiview is the default stereo
  rendering mode for OpenXR on Meta Quest"; without it "each eye buffer must be rendered in sequence, doubling
  application and driver overhead". In Unity it is a menu setting, not a patched vendor file as with us.
- **Editor and setup** [read] — Meta, "Unity project setup" (2026-10-07),
  https://developers.meta.com/horizon/documentation/unity/unity-project-setup/ — "Windows 10+ (64-bit)"; "Unity Editor
  6000.0.66f2 or later (6.1 or later recommended)"; needs a "Unity ID" and the "Android Build Support" module; template
  "Universal 3D" (URP); "The Oculus XR Plugin is deprecated"; the Platform SDK gives "entitlement checks, and platform
  features such as matchmaking, in-app purchases". A Windows 10 laptop qualifies on Meta's page.
- **In-app purchases** [read] — Meta, "Add-ons Integration" (Unity, 2026-09-24),
  https://developers.meta.com/horizon/documentation/unity/ps-iap/ — consumables, durables, subscriptions (virtual SKUs
  "WEEKLY ... ANNUAL") and downloadable content through "AssetBundles"; "You must have at least one version of your APK
  uploaded". The web path has no subscriptions ("Subscriptions are not currently supported", revision-1-store.md §5).
- **Testing without a headset: Meta XR Simulator** [read] — Meta, "Meta XR Simulator Overview" (2026-09-04),
  https://developers.meta.com/horizon/documentation/unity/xrsim-intro/ — "a lightweight OpenXR runtime that runs on
  your computer"; profiles include "Meta Quest 2" and "Meta Quest 3" ("Meta Quest 3 is the default profile");
  synthetic rooms with "Walls, floors, ceilings, furniture"; "Record a simulator session to a VRS file, then replay
  it"; "Connect more than one application client to the simulator" (multiplayer). It needs a GPU API ("Vulkan works on
  Windows and macOS"); a headless CI run of it: **not found** on the page. Our IWER does the same job for the web in CI.
- **Camera pixels (mixed reality)** [read] — Meta, "Passthrough Camera API Overview" (Unity, 2026-10-07),
  https://developers.meta.com/horizon/documentation/unity/unity-pca-overview/ — access to "the forward-facing cameras on
  Meta Quest 3 and Meta Quest 3S" for computer vision; needs Android's camera permission or Meta's headset-camera permission. The web:
  "never camera pixels inside WebXR; headset cameras only through a separate getUserMedia permission"
  (revision-3-live-voice-mr.md §3, from docs/research/vr/04-mr.md).
- **Licence and price** [read] — Unity, "Changes to Unity subscription plans and pricing" (announced 2025-11-10),
  https://unity.com/products/pricing-updates — Runtime Fee: "As of September 12, 2024, we decided to cancel it";
  Personal: "available to customers with up to $200,000 in revenue and funding"; "Splash screen optional with Unity
  6"; Pro "$2,310/yr per seat" or "$210/mo per seat". For us: Personal is free until $200,000 a year.
- **Editor on our laptop** [read + measured] — Unity Manual 6000.2, "System requirements",
  https://docs.unity3d.com/6000.2/Documentation/Manual/system-requirements.html — "Windows 10 version 21H1 (build 19043)
  or newer"; "a minimum of 8 GB RAM"; no disk figure ("a disk drive with a high ... IOPS rating" for builds). The laptop
  (read 10 Oct, PowerShell): Windows 10 22H2, Intel Core i3-7130U (2 cores), 11.9 GB RAM, GeForce MX110, **C: 24.1 GB
  free**. It meets the floor; the editor's install size: see below.
- **Headless tests on GitHub need the owner's Unity account** [read] — GameCI, "Activation" (v4),
  https://game.ci/docs/github/activation — for the free licence: add three secrets: the Unity licence file ("contents of your `.ulf`
  license file"), the account email, and the account password ("the password for your Unity account"). GitHub secrets keep them out
  of the repo, but every CI run then logs in as him; our web CI needs no account at all.
- **Editor install size** [read, a user report; no Unity figure found] — Unity Discussions, 2025-10-17,
  https://discussions.unity.com/t/unity-hub-feature-request-optimise-installation-of-editor/1690858 — Editor 6.2: "in
  total it required 8.49 GB", but "installation process requires ±30 GB", failing with "Not enough space" on 22 GB free.
  Our C: has 24.1 GB free: an install there would likely fail; F: (322 GB free) would hold it [unverified until tried].
  Android modules on top (Meta setup page lists "Android Build Support", "Android SDK & NDK Tools").
- **Text in Russian** [read] — Unity scripting reference 6000.0, `AtlasPopulationMode.Dynamic`,
  https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TextCore.Text.AtlasPopulationMode.Dynamic.html —
  "Dynamic font assets can be populated at runtime, but incur a higher performance overhead"; "depends on its source
  font file, which is included in builds". Cyrillic is a matter of the font file (Inter has it); a Unity 6 page
  naming Cyrillic: **not found**. Our canvas panels already draw any script the font holds.
- **Baked light** [read] — Unity Manual 6000.0, "Progressive Lightmapper",
  https://docs.unity3d.com/6000.0/Documentation/Manual/progressive-lightmapper.html — "To generate baked lightmaps and
  Light Probes" a "Progressive GPU Lightmapper" (default, "uses your computer's GPU and Video Ram") or a CPU backend.
  Built into the editor; on the web we bake in Blender (board, internal item 3). On an MX110 the GPU backend's speed:
  **unverified**.

### Part 3. An AI assistant in Unity (pages read 10 Oct)

- **Unity's own MCP server exists, in beta, paid** [read] — Unity blog, 2026-05-11,
  https://unity.com/blog/unity-ai-mcp-how-to-get-started — "Unity's AI tools are currently in open beta"; needs "An
  active trial or subscription to Unity's AI tools beta"; "Unity 6 (6000.0) or later". Manual (package 2.0.0-pre.1),
  https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.0/manual/unity-mcp-get-started.html — "An MCP-compatible
  AI client such as Claude Code"; tools named `Unity_ManageScene`, `Unity_ManageGameObject`, `Unity_ReadConsole`.
  The price of Unity's AI subscription: not on these pages (they point to unity.com/features/ai, not read).
- **Scenes as text** [read] — Unity Manual 6000.0, "Text-based scene files",
  https://docs.unity3d.com/6000.0/Documentation/Manual/TextSceneFormat.html — "a text-based format for scene data, in
  addition to the default binary format"; "the text data can be generated and parsed by tools". So an assistant can
  read Unity scenes, but they are YAML with object ids written for the editor, not hand-written code; with the MCP
  bridge the assistant works through a running editor (on our 2-core laptop, at its speed).
- Published evidence measuring how well an AI assistant builds in Unity vs plain JS: **not found** (no search spent
  beyond the pages above).

### Part 2. Godot 4 on Quest (pages read 10 Oct)

- **Version and licence** [read, GitHub API] — godotengine/godot: MIT, 118,232 stars, latest release 4.7.2-stable
  (2026-08-18). Free, no revenue limit, no account.
- **Quest through OpenXR, an Android build** [read] — Godot 4.7 docs, "Deploying to Android",
  https://docs.godotengine.org/en/stable/tutorials/xr/deploying_to_android.html — needs "OpenJDK 17", "Android Studio",
  a Gradle build; "It is highly advisable to use the compatibility renderer (OpenGL) for the time being when targeting
  Android based XR devices"; the vendors plugin "may be required to release on app stores". GodotVR/godot_openxr_vendors:
  MIT, 195 stars, release 5.1.0-stable (2026-05-19) (GitHub API).
- **Meta's store services** [read] — Godot blog, Feb 2025, https://godotengine.org/article/godot-xr-update-feb-2025/ —
  the Godot Meta Toolkit "exposes Meta's Platform SDK": "In-App Purchases (IAP)", "Downloadable Content (DLC)", "Group
  Presence", "Leaderboards". Its repo (godot-sdk-integrations/godot-meta-toolkit, GitHub API): 50 stars, latest release
  1.0.3-stable of 2025-07-29 ("Update for Meta Platform SDK v77"), last push 2026-03-04. Small and slower than Unity's.
- **Web export with WebXR exists** [read] — Godot docs, "WebXRInterface",
  https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html — "WebXR is an open standard that allows
  creating VR and AR applications that run in the web browser"; "only available when running in Web exports".
  "Exporting for the Web", https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html — "Godot 4
  can only target WebGL 2.0 (using the Compatibility rendering method)"; "Projects written in C# using Godot 4
  currently cannot be exported to the web"; threads need "complete cross-origin isolation" headers, which GitHub Pages
  cannot send [our knowledge of Pages; unverified here]. Multiview in Godot's WebXR export: **not found**.
