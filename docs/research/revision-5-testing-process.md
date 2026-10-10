# Revision 5 of 5: testing, measuring and our development tools

The owner's question (10 Oct 2026): the smartest set of tools for testing, measuring and developing, checked
now, because today a feature claimed to work did nothing (multiview in A-Frame 1.7.1), tests passed on the
laptop and failed on GitHub, a red test got committed, Meta's own tools sat installed and unused, and a
database "risk" came from not reading our own plan. He reads no code: the tools must catch mistakes themselves.
Marks: **[read]** the page was opened and the quote is in it; **[code]** read in our files or a package's source;
**[unverified]** not confirmed. Meta facts through `metavr docs fetch`; Claude Code facts from code.claude.com.

## The parts (each gets an answer or "not found")

1. Testing a WebXR game: (a) IWER in the GitHub smoke test (enter VR, both eyes' draw calls, controllers,
   hands); (b) the IWER dev UI; (c) Meta XR Simulator for WebXR; (d) automated headset runs; (e) visual
   regression against docs/rooms/ shots; (f) performance in CI.
2. Measuring on the headset: (a) metavr perf capture / monitor; (b) OVR Metrics Tool; (c) Chrome tracing with
   xr.debug / Perfetto; (d) RenderDoc Meta fork; (e) ovrgpuprofiler; (f) CPU- vs GPU-bound, run without the owner.
3. The metavr MCP server in Claude Code: install (user or project), why no tools showed, what it gives.
4. Code quality: (a) `// @ts-check` / checkJs with the TypeScript server; (b) ESLint; (c) CodeRabbit after
   its trial vs alternatives.
5. Claude Code for a non-programmer owner: (a) the guards that matter; (b) noise to drop; (c) claims checked;
   (d) no feature claim without a measurement. Plus today's four failures, each traced to its cause.

## What we use now (read from the repo, 10 Oct) [code]

- `npm test`: 26 node test files (package.json `"test"`); the commit hook runs all but `structure` and
  `review-gate` in parallel (tools/hooks/pre-commit `SLOW='structure review-gate'`), the push hook runs those two.
- GitHub (`.github/workflows/test.yml`, on push to room-polish and main): `npm test`, `prove-guards.mjs --lf` and
  CRLF, then `npm run test:smoke` (Playwright Chromium with `--use-gl=swiftshader`, tests/smoke.mjs:19).
- Draw calls in CI: `tests/draw-calls.mjs` renders the scene with a plain `THREE.PerspectiveCamera` from 24-ish
  spots ("looking every 45 degrees round") and reads `renderer.info.render.calls`: one desktop view, **not the XR
  path** (no XR session, no second eye); `VIEW_BUDGET = { corridor: 70, room: 100 }`, `QUEST2_VIEW = 50`.
- Headset: `tools/quest-look.mjs perf` = 5 s of `requestAnimationFrame` deltas plus `renderer.info` over the
  DevTools socket (`adb forward tcp:9222 localabstract:chrome_devtools_remote`, tools/headset.mjs:56); it fails
  under 72 fps, at 100 calls or 750,000 triangles. No CPU/GPU split. `tools/quest-check.mjs` plays the corridor
  and room at 10x and fails under 72 fps or on a page error.
- No visual comparison anywhere: the approved shots in docs/rooms/*-shots/ are looked at by people only.
- No type check, no linter: `node --check` (syntax only) on staged scripts in the commit hook.
- Claude Code: tools/claude-guard.mjs on SessionStart, UserPromptSubmit, PreToolUse (Bash|PowerShell, mcp__.*,
  Write|Edit), SubagentStart/Stop (practice-reviewer), Stop (.claude/settings.json); seven agents in .claude/agents/.

## Findings (written as they come)

### Part 3. The metavr MCP server in Claude Code

- **What metavr itself would install** [read, ran `metavr mcp install claude-code --dry-run`, nothing written]:
  "would execute: claude mcp add metavr -- npx -y metavr@latest mcp server". The plugin starts the same thing
  ("`npx -y metavr mcp server`", docs/research/projects/claude-code/F-inventory.md:73). So `metavr mcp install
  claude-code` repeats the npx start that gave 0 tools; it does not fix it.
- **Options of the installer** [read, `metavr --markdown-help`, metavr 1.8.0.17.10]: `claude-code` "Show command to
  install into Claude Code CLI", `--execute` "Execute the installation command directly", `--executable` "Path to
  metavr executable"; `project` "Install into a project directory (creates mcp.json or .mcp.json)". The server:
  `mcp server` with `--no-telemetry`, `--enable-full-docs`, `--disable-perf-tools`, "only stdio is supported".
- **The likely cause, now documented by Claude Code** [read] — https://code.claude.com/docs/en/mcp.md, "MCP client
  runtimes": the v2 runtime "adds MCP protocol revision 2026-07-28"; it "Asks HTTP, stdio, and claude.ai connector
  servers whether they support the newer revision"; "To pick the runtime yourself, set `MCP_SDK_GENERATION` to `v1`
  or `v2`. To decide whether Claude Code asks, set `MCP_PROTOCOL_NEGOTIATION` to `auto` or `legacy`." Our board's
  own diagnosis (docs/board.md, commit f1852e1): the server "refuses the tool list" with «request _meta is missing».
  That fits a server that mis-answers the new revision's probe [unverified: the error was seen on 10.10, the docs
  page does not name metavr].
- **Status and timeouts** [read, same page]: "The `/mcp` panel shows the tool count next to each connected server"
  and "flags servers that advertise the tools capability but expose no tools"; `claude mcp list` "appends the
  failure detail"; "Configure MCP server startup timeout using the `MCP_TIMEOUT` environment variable"; "Stdio
  servers are local processes, and Claude Code doesn't reconnect them automatically." Plugin servers: "You add and
  remove plugin servers by installing or uninstalling the plugin, not with `/mcp` commands." Scopes: local (default,
  `~/.claude.json`), project (`.mcp.json`, approved once per person: "Claude Code prompts for approval in interactive
  sessions before using project-scoped servers"), user.
- **The fix, best to worst** [the steps are documented; that they cure metavr is unverified]: (1) a project server
  that runs the global binary, no npx: `.mcp.json` `{"mcpServers":{"metavr":{"command":"metavr","args":["mcp",
  "server","--no-telemetry"]}}}` (what `metavr mcp install project --executable ...` writes [unverified: dry-run not
  run]), plus `"env": {"MCP_PROTOCOL_NEGOTIATION": "legacy"}` in .claude/settings.json if the tool list is still
  refused (it "keeps every server on" the earlier handshake: Supabase and the others too); (2) the same at user
  scope; (3) leave the plugin's server and use the CLI from Bash, as now. Then switch the plugin's own server off
  (deny `plugin:meta-vr:metavr` in `deniedMcpServers`, as already done for reference-lookup) so two copies do not run.
- **What the server would give over the CLI** [read]: the same commands as tools (docs, device, perf, capture,
  app, files, logs); the plugin README promised "40+ tools ... documentation search, performance tracing"
  (F-inventory.md:74). The CLI already gives all of them from Bash (`metavr docs fetch` worked for this research).
  Gain of the server: tools Claude finds without remembering the CLI; cost: one more server's instructions in every
  session. **Verdict: change** (one project entry without npx, tested with `claude mcp list`); if it still gives 0
  tools, drop the server and keep the CLI (no loss: every needed command runs from Bash).
- Note: this research session itself received the plugin server's instructions ("This server provides tools for
  Horizon OS development"), but no metavr tool is in its tool list (they may be deferred behind tool search;
  unverified).
