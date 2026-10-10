# Store fees and selling paid content ourselves (2026)

The owner's question, 10 Oct 2026: the game free in every store that takes it, paid content sold with the
smallest legal commission, ideally straight to us, never breaking a store's rule. Context: our route is a WebXR
site (youaretheobject.com) packaged for Meta's Horizon Store as a TWA (docs/research/revision-1-store.md);
payouts to Ukraine (docs/research/meta-payout-ukraine.md, -2.md). Every claim has its link, the page date where
shown, and a short quote; "not confirmed" = no source found; "(my reading)" = my inference. Not legal advice.
The project's paper library (C:\Users\admin\Documents\objekt-files\papers\) has nothing on this topic (grep for
"anti-steering", "merchant of record", "Digital Markets Act": no hits).

## Parts
1. Per store: fee on digital goods (and any small-developer rate); may an app (a) sell through its own web
   payment, (b) link or point to the web (anti-steering, incl. US court orders, EU DMA, Japan, Korea),
   (c) unlock content bought elsewhere (cross-platform / reader apps), (d) be free with all unlocked by a code
   or account from our site.
   1.1 Meta Horizon Store (incl. web-app / PWA listings)  1.2 PICO Store  1.3 Steam (desktop wrapper)
   1.4 Google Play / Android XR  1.5 Apple App Store / visionOS  1.6 SideQuest  1.7 itch.io
   1.8 Web-app stores found (heyVR, VIVERSE, others)
2. Our own site in the Quest Browser: payment providers for a merchant resident in Ukraine selling digital goods
   worldwide (Paddle, Lemon Squeezy, FastSpring, Xsolla; Stripe's country list; WayForPay, LiqPay, Fondy/Solidgate):
   fees, EU VAT / sales tax handled or not, payout to a Ukrainian bank.
3. Worked example: what we keep of a $10 sale via each route.
4. Verdict table and what Meta support or a lawyer must confirm.

## Findings (appended as found)

### 1.1 Meta Horizon Store (the TWA/PWA listing included)
- Distribution Agreement, "Effective Date: May 9, 2025",
  https://developers.meta.com/horizon/policy/developer-distribution-agreement/ (read 10.10 with curl):
  5.1(a) Meta retains "thirty percent (30%) of the Net Revenues" and remits "seventy percent (70%)"; subscriptions
  from month 4: Meta retains "fifteen percent (15%)". No small-developer or web/PWA rate in the text.
  1.10 Net Revenues = gross "less (a) applicable taxes, (b) sales processing costs or fees" and refunds etc.
  4.5: "Developer may only implement in-Product purchases (made from, within or through a Product) ... using the
  means that are (a) approved in a writing by MPT or its Affiliate to Developer or (b) approved in publicly
  available Terms and Policies."
- App policies, "Updated : Mar 10, 2026", https://developers.meta.com/horizon/policy/app-policies/ (read):
  1.1.1 "if your app has in-app purchases, and your app is distributed through any Meta Platforms Technologies
  distribution channel, including the Meta Horizon Store, you must use the Platform In-App Purchases".
  1.1.2 exceptions: "Bulk IAP or Subscription Licenses : Developers may sell licenses for prepaid in-app
  functionality off-platform only when selling such licenses in bulk to business customers (such as companies or
  educational institutions)"; "Windows into an Existing Service : Apps that are Windows into an existing service
  may sell access off-platform for their pre-existing, off-platform subscription content" (4.1.1 defines these as
  apps for "non-interactive media content" with "limited interactivity": a game is not one (my reading)).
  3.3.3 not allowed: "Intentionally using linking to manipulate app distribution on Meta's surfaces or circumvent
  any Meta policies, including Meta's Payments policy". 3.1.1: apps "may enable access to other apps ... only if:
  The content has already been purchased by the user and the app is merely enabling access to that content".
  4.3.1: apps with in-app purchases "may not provide only limited utility or functionality".
- So for Meta (my reading): (a) own web payment inside the app: no (1.1.1); (b) a link or text sending players to
  buy on the web: no written allowance found, and 3.3.3 bars linking that circumvents the Payments policy;
  (c) unlocking content bought elsewhere: no general reader/cross-buy permission found in the policies (only the
  two exceptions above); (d) a free app unlocked by a code from our site: not allowed by 1.1.1 for an individual
  player (it is an off-platform sale of in-app content); allowed only as bulk licences to schools/companies (1.1.2).
