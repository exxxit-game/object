# Revision 1 of 5: delivery and the Meta Horizon Store

Tool revision for the owner, 10 Oct 2026. Question: is the way the game reaches players (hosting, packaging,
store, payments, paperwork) the smartest choice now, while one corridor and one room exist, before ten floors
of nine rooms are built on it. Marks: **[read]** the page or file was opened and the quote is in it;
**[skill]** the meta-vr plugin's own skill file (Meta's helper, not a Meta page); **[unverified]** not confirmed.
Work in progress: findings are appended as they are read.

## Parts (each gets an answer or "not found")
1. Hosting: GitHub Pages + custom domain (CNAME) + test copy
2. Packaging for the Store: PWA/TWA via @meta-quest/bubblewrap-cli, app mode immersive
3. Entering VR right after launch (no 2D landing page); consent and start in VR
4. Manifest scope and privacy.html inside it
5. /.well-known/assetlinks.json (Digital Asset Links) on GitHub Pages: the 404 and .nojekyll
6. Paid floors: Digital Goods API / in-app purchases inside a Horizon TWA
7. Signing key (keystore) and its backup
8. Age group (13+ vs Mixed Ages; age API)
9. Comfort rating with an optional smooth-moving mode
10. Meta paperwork: data-use checkup, data-protection assessment, developer verification
11. VRC testing plan (what Meta checks, which tools)
12. Updates of a PWA in the Store (web changes vs APK rebuilds; release channels)
13. Other stores later: Steam, Pico, SideQuest
14. Decisions for the owner; what to do first

## Findings

### 1. Hosting now (checked 10 Oct 2026 with curl and the GitHub API, read only)
- Live site: GitHub Pages of exxxit-game/youaretheobject, `"build_type":"legacy"`, `"source":{"branch":"main","path":"/"}`,
  `"cname":"youaretheobject.com"`, `"https_enforced":true`, `"protected_domain_state":"verified"` (gh api repos/.../pages).
  Legacy = GitHub runs Jekyll over the branch. **[read]**
- https://youaretheobject.com/ 200; `/.well-known/assetlinks.json` 404; `/privacy.html` 404 (privacy.html exists on the
  branch, not yet on main); `/manifest.webmanifest` 404 (no manifest in the repo at all). **[read]**
- The live site serves the whole repo root: `/CLAUDE.md` and `/docs/roadmap.md` return 200. The test copy
  (tools/publish-preview.mjs) copies only the PUBLIC list and writes `.nojekyll` ("serve files as they are"). **[read]**
- No `.well-known/` folder exists in the repo: the 404 is first of all a missing file, not only Jekyll. **[read]**

### 6. Paid floors: in-app purchases in a WebXR PWA (Meta's own pages, fetched with `metavr docs fetch`)
- Meta has a page for exactly our case: "In-app purchases in WebXR PWAs", 2026-07-22,
  https://developers.meta.com/horizon/documentation/web/ps-iap/ **[read]**
  - Supported: "Meta Horizon OS currently supports in-app purchases through the Digital Goods API only in WebXR PWAs.
    Subscriptions are not currently supported." (one-time floor packs fit; a subscription does not)
  - Only in a Store install: "the Digital Goods service is only available for WebXR PWAs that are installed from the
    Meta Horizon Store (including ALPHA and BETA channels)". Sideload test: enable `#enable-debug-for-store-billing`
    in chrome://flags of the Browser.
  - Flow: `window.getDigitalGoodsService('https://quest.meta.com/billing')`, `getDetails([sku])`, a `PaymentRequest`
    with `supportedMethods: "https://quest.meta.com/billing"`, then `listPurchases()` for owned durables. "There is no
    function to get a list of item IDs; those have to be hard-coded". "Meta Horizon Store doesn't support purchase history."
  - Needs paperwork: "This is a Platform SDK feature requiring Data Use Checkup".
- Monetization overview, 2026-07-22, https://developers.meta.com/horizon/documentation/web/ps-monetization-overview/
  **[read]**: "For PWAs, in-app purchases (IAP) are currently supported only in WebXR PWAs"; products are made under
  "Monetization > Add-ons" in the Developer Dashboard.
- Verdict: the floor-packs model has a documented Meta path; never tested by us on a headset **[unverified in practice]**.

### 8. Age group: the age API exists for WebXR PWAs (corrects the board's "Android-only" worry)
- Same page (ps-iap, 2026-07-22) **[read]**: "If your WebXR PWA's target age group is Mixed Ages, then you are required
  to implement the Get Age Category API and call it every time your WebXR PWA launches." and
  "The `DigitalGoodsService.getUserAccountAgeCategory()` API is exclusive to WebXR PWAs running on Meta Horizon OS."
- So Mixed Ages is technically open to us; whether we want 10-12 year olds is the owner's question (our decision
  "18+ for recording" already stands, docs/owner-decisions.md).

### 1b. Hosting: what Meta asks of a host
- "Host your web experience", 2026-09-23, https://developers.meta.com/horizon/documentation/web/web-hosting/ **[read]**:
  requirements are only "Serve the site over HTTPS from a publicly accessible origin" and "Serve the static files that
  your build produces"; it names two hosts: "**GitHub Pages** publishes the static build from a repository, using
  a GitHub Actions workflow" and Vercel (the meta-vr skill `hz-store-pwa` assumes Vercel **[skill]**).
- Verdict: GitHub Pages is a host Meta names; Vercel is not needed. Meta's own wording is Pages published by an
  Actions workflow, not our current branch build ("legacy").

### 2-5. Packaging, auto-enter, scope, asset links (Meta's pages)
- "Package a PWA for Meta Quest", 2026-07-22, https://developers.meta.com/horizon/documentation/web/pwa-packaging/
  **[read]**: verified with `@meta-quest/bubblewrap-cli` "version `1.24.1`", "requires Node.js 18 or later";
  create the app in the Dashboard first ("The Meta Horizon Application ID is required if a WebXR PWA uses in-app
  purchases"); "Enable Horizon Billing only for a WebXR PWA that uses in-app purchases"; "Every update to an existing
  Store app must use the same package identifier"; "Every future update must use the same signing certificate";
  "An immersive PWA does not launch if this verification fails" (Digital Asset Links); `bubblewrap fingerprint add`
  "generates `assetlinks.json`", to be published at `https://example.com/.well-known/assetlinks.json`; one
  assetlinks.json "can authorize more than one Android package on the same web origin".
- "Get started with PWA packaging", 2026-09-23, https://developers.meta.com/horizon/documentation/web/pwa-overview-gs/
  **[read]**: manifest needs `start_url` inside `scope` ("Keep `start_url` within `scope`"); "In an `immersive` package,
  an out-of-scope link opens in Meta Quest Browser" (so privacy.html must sit inside scope, or the player is thrown
  out of VR into the browser); Bubblewrap "uses a 512-pixel-or-larger app icon when available".
- "Getting Started with WebXR PWAs", 2026-07-22, https://developers.meta.com/horizon/documentation/web/pwa-webxr/
  **[read]**: "launching directly into immersive mode right after launch without a 2D landing page"; A-Frame code:
  `if (window.getDigitalGoodsService !== undefined)` then `scene.enterVR()` on `renderstart`; "clicking the PWA app
  icon is considered user action to create a WebXR session". So the Store build has no 2D page: consent, the start
  and the privacy text must all be readable inside VR.
