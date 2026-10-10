# Connectors and the owner's pain (read-only audit, 10.10)

## Part 1. Connectors and plugins

Sources: `~/.claude/settings.json`, `~/.claude/plugins/installed_plugins.json`, repo `.claude/settings.json`
(no `settings.local.json`, no `.mcp.json` anywhere), the desktop app's plugins
(`AppData/Roaming/Claude/local-agent-mode-sessions/.../rpm/manifest.json`, 11 plugins) and extensions
(`Claude Extensions`: filesystem, figma, minutes, pdf-filler-simple). Usage = MCP calls counted in all 174
objekt transcripts (8.10 to now). Instructions = the `mcp_instructions_delta` this session received
(re-sent after each compaction).

| Server | Where it lives | Calls | Injects every session | Verdict |
|---|---|---|---|---|
| Claude Docs (1a59c906) | claude.ai | 485 | 1,914 chars ("make it FIRST… a reflex") | KEEP: holds the big plan (board.md line 3) |
| Browser pane (Claude_Browser) | built in | 946 | no | KEEP: the main look tool |
| PubMed/PMC (652cfc02) | claude.ai | 6 | no | KEEP (research agents) |
| research-desk lookup | plugin | 6 | 467 + 474 (two copies, local + hosted) | KEEP the hosted one |
| Consensus (4ff8cb31) | claude.ai | 0 (wired into agents 10.10 08:23) | 1,753 ("you MUST cite papers inline [1]…") | KEEP for agents |
| PDF Tools | desktop extension | 0 (in agents since today) | no | KEEP |
| Dropbox (ef4a4f62) | claude.ai | 5 (papers backup) | no | KEEP, on demand |
| Supabase (607c535c) | claude.ai | 2 (read only) | 1,344 | KEEP; the supabase plugin's server is a duplicate that needs auth |
| meta-vr (metavr) | plugin | 0 tools ever exposed; skill hz-store-pwa used 2x | 310; skill hz-quest-verify-first calls itself "MANDATORY" | ON DEMAND (install-first needs hz-store-pwa); ~25 Unity/Android skills are noise |
| scheduled-tasks | built in | 1 | no | ON DEMAND (daily power cuts) |
| visualize | built in (+ claude.ai copy 6f616b42) | 0 | tool text only | ON DEMAND |
| computer-use | desktop setting | 1 (a screenshot guide, 9.10) | 5,100, the largest | OFF; on only for a screenshot guide |
| privacy-legal (Google Drive, Slack) | plugin | 0 | 165 (Drive); Slack needs auth | OFF until board item 4 (data before testers) |
| Notion (3f04be00) | claude.ai | 0 | 2,088 ("Use the Notion search tool for every content search", "Recommend Notion…") | OFF |
| Jam (ccce8626) | claude.ai | 0 | no (35 tool names) | OFF |
| Adobe Express (a8df8e0f) | claude.ai | 0 | 2,088 ("VERY IMPORTANT… MUST first call adobe_mandatory_init") | OFF |
| Figma (e3cb30dc) = the "image generator" | claude.ai | 0 | 2,088 ("Use this server whenever the user wants to create… any design… visual") | OFF: against "we recreate" (his words, our translation) |
| GitHub (816a40f8) | claude.ai | 3 reads (8.10) | 1,842 | OFF: `gh` does it; the guard already refuses its writes |
| Claude in Chrome | desktop setting | 0 | 1,022 | OFF: the pane covers pages; the guard (`BROWSER_TOOLS`) does not cover it |
| Minutes | desktop extension | 0 | no (34 tools; can record) | OFF |
| Figma (local Dev Mode), Filesystem | desktop extensions | 0 | no | OFF |

About 20,700 chars (~5-6k tokens) of server instructions go out at every start and after every compaction;
the OFF rows are about 14,400 of them (70%). There are also 452 deferred tool names.

**For the owner, by place.** claude.ai → Connectors: Notion, Jam, Adobe Express, Figma, GitHub (already on
the board, "Waiting for you" (the board's words, our translation) 1; still connected in this session).
Desktop app → Settings: Claude in Chrome, computer use (on only when asked for a screenshot guide).
Desktop app → Extensions: Minutes, Figma, Filesystem. Plugins: privacy-legal off until step 4.

**Plugins that inject text every session (not connectors).** superpowers (CLI, user settings): a SessionStart
hook (startup|clear|compact) injects ~3,900 chars, "ABSOLUTELY MUST invoke the skill", at every start and
compaction, against CLAUDE.md's single process; used 4 times in objekt. security-guidance is enabled again
(it was off on 9.10 morning): 5 hooks, including an LLM review on Stop (the owner asked about it, 9.10 15:08).
Repo settings already turn off data, marketing, design, customer-research, canva, adobe, figma, hookify, github.
Stale: `~/.claude/settings.json` autoMode text still describes cosmogram-app ("git push is never performed").

## Part 2. The owner's pain

Source note: `owner-messages.md` starts 9.10 07:32 UTC (that is when the hook began logging). The messages
from 8.10 were taken from the session transcripts; the repo is from 7.10. That makes 228 + 104 owner
messages over 3 days. Ranked by count and recency:

1. **The first, shallow fix; a part patched instead of the whole** (~18 messages, every day, his last message).
   "you are solving some… little piece of this problem" (his words, our translation) 8.10 22:19; "the simplest,
   the dumbest" (his words, our translation) 9.10 09:27, 12:52, 14:12, 15:17, 10.10 05:23; "You are again
   solving problems point by point, when the problem is solved globally" (his words, our translation)
   9.10 18:23; "radically… it backfires" (his words, our translation) 10.10 05:23; "rebuild the whole engine"
   (his words, our translation) 05:31.
   Done: the "whole before a part" decision, 57 rows in the mistakes list, the new form of work (9.10 19:25).
   **It came back every day.**
2. **Going in circles: process work instead of the game** (~20). "the hooks… not only stop it, but also get in
   the way" (his words, our translation) 9.10 08:22; "we are going in circles… you set it up, and it still does
   not work" (his words, our translation) 14:42; "there are not that many tokens to go round in circles" (his
   words, our translation) 15:17; "you are putting sticks in your own wheels" (his words, our translation)
   10.10 05:22; "at the speed of a wall" (his words, our translation) 05:26.
   Measured: of 138 commits on 9.10, 88 touched only process files and 37 touched the game; on 10.10 it is
   2 of 32. Done: "no new process" in CLAUDE.md, plugins switched off, research caps raised (10.10 08:23).
   **It came back on 10.10.**
3. **He is the only tester, and he has not trusted me since Cosmogram** (~15). "I cannot double-check after
   you" (his words, our translation) 9.10 12:39; "about 15 times… the mistakes of Cosmogram must not be
   repeated" (his words, our translation) 15:18; "The first project had to be closed because of this" (his
   words, our translation) 15:59; "you have lost trust… I have to double-check all the time" (his words, our
   translation) 10.10 05:31.
   Errors he caught himself: his email in 32 public commits (8.10 14:56), the architecture drift (8.10 21:04),
   the old room on GitHub (9.10 07:40), "And are you sure they cannot be seen?" (his words, our translation)
   (9.10 11:32), the main folder behind again ("I thought we had sorted this out long ago" (his words, our
   translation) 10.10 03:34). Done: guards, review-gate, practice-reviewer. **It came back on 10.10.**
4. **Inventing things and choosing his taste for him** (~15, peak 9.10). "chose… the font for me" (his words,
   our translation) 8.10 20:36; "You light objects from a light that does not exist" (his words, our
   translation) 9.10 18:22; "you make it up yourself… you do not ask me" (his words, our translation) 18:25;
   "if you invent something of your own, that is where the hallucinations start" (his words, our translation)
   19:52. Done: "we recreate" (his words, our translation), options in pictures (21:27), the rule extended to
   code (22:54). **Not repeated since 9.10 19:52**; too early to call it fixed.
5. **Lost context: compactions, new windows, saying it again** (~14). One session had 8 compactions in about
   26 h (8-9.10). "the dialogue will be compressed soon" (his words, our translation) 8.10 10:43; "How many
   times will I have to repeat this? Every… new dialogue" (his words, our translation) 9.10 14:13; "I have
   said it lots of times, write it all down somewhere in the rules" (his words, our translation) 10:15; "you
   saved them there on your side" (his words, our translation) 13:19. Done: his message log, the decisions and
   the board shown at start, the request-auditor, a new window per stage (at most 1 compaction since), the
   main-folder stop (10.10 06:39).
   **Partly back** (10.10 03:34, 05:22).
6. **Juggling the headset** (~15, 8-9.10). The cable and charging outburst 8.10 07:11; "The headset is asleep"
   (his words, our translation) 10:10; "you split me between two actions" (his words, our translation)
   9.10 09:14; hints shown only as colours 12:51. Done: the cable for good, one action at a time, the probe
   that asks inside the headset (20 of 20 at 20:02, his "yes" (his words, our translation)).
   **It did not come back: the only one fixed.**
7. **Explanations too basic or too tangled** ("you explain… the elementary" (his words, our translation),
   "you made it… so complicated" (his words, our translation) 9.10 07:39-07:41), and **waiting for poor
   results** ("I am waiting… what am I paying money for?" (his words, our translation) 9.10 12:56; "11 minutes
   have passed" (his words, our translation) 19:00). Both feed 2 and 3.

Underneath: exhaustion ("exhaustion" (his words, our translation) 9.10 12:56, 15:41, 15:59; "I am losing my
mind" (his words, our translation) 10.10 05:31), the war, daily power cuts, two months lost on Cosmogram.

**Pattern.** Most complaints were answered with a new rule, guard or hook, and that process then became
complaint 2. The one complaint that stopped (6) was fixed by changing what he lives through: the cable, one
action, words inside the headset. No rule was added for it.

Index of the 10.10 rebuild audits: [README.md](README.md)
