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
5. Verdict table: A-Frame / IWSDK / Unity / Godot; cost, gain, risk; the one measurement or fact that would change it.

## Findings (written as they come)
