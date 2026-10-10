# Meta Horizon Store payouts in Ukraine (2): individual or FOP, TIN, W-8, bank, practice

Follows docs/research/meta-payout-ukraine.md (what Meta's pages say). Checked 2026-10-10.
Every claim has its link and a short quote; "not confirmed" = no source found. Quotes from Ukrainian
sources are English translations marked "(translated)"; Ukrainian terms are transliterated (FOP = sole
proprietor, RNOKPP = individual tax number, YeDRPOU = company register code, KVED = activity codes,
PKU = Tax Code, DPS = State Tax Service, IPK = individual tax consultation, YeSV = social contribution,
NBU = National Bank). My own readings are marked "(my reading)". Not tax advice: an accountant confirms
before anything is typed into Meta. The owner's facts (coordinator, 2026-10-10): he has no FOP, he is a
private individual now; which Meta organisation the game belongs to is left for later.

## Parts
1. Individual vs FOP group 3: rates, military levy, filing, may FOP-3 take foreign store income
   (KVED 62.01 / 58.21 / 58.29), royalties ban, income limits.
2. TIN for Meta in each case (RNOKPP / YeDRPOU); W-8BEN or W-8BEN-E; treaty article and rate;
   store sales = royalties or business profits.
3. Bank: account name (person or "FOP ..."), USD account, IBAN/SWIFT; currency-control papers for
   USD from Meta Ireland; NBU limits under martial law in 2026.
4. Practice: Ukrainian developers paid by Meta/Oculus, Google Play, Apple, Steam (DOU.ua, Reddit).
5. Verdict table and what an accountant must confirm.

## Findings (appended as found)

### Part 1. Tax Code of Ukraine (PKU), edition of 17.09.2026 (basis: law 4967-IX)
Source: https://zakon.rada.gov.ua/laws/show/2755-17 (full text downloaded 2026-10-10; quotes translated).
- Individual, foreign income: 170.11.1, foreign-source income goes into the annual taxable income of a
  recipient "who must file an annual tax return" (translated), taxed at the 167.1 rate: "The tax rate is
  18 percent" (translated). Filing 49.18.4: the annual return "by 1 May of the year following the reporting
  year" (translated); payment 179.7 "by 1 August" (translated).
- Military levy (section XX, subsection 10, item 16-1): 1.3(1) for individuals "5 percent of the object of
  taxation" (translated); 1.3(3) for single-tax group 3 "1 percent of income determined under Article 292"
  (translated); 1.16: the 5% applies to annual-return income accrued "starting from 1 January 2025"
  (translated). After martial law the individual rate returns to 1.5% from 1 January after the third
  calendar year after it ends (1.3, last paragraph).
- So an individual: 18% + 5% = 23% of the foreign income (my reading of 167.1 + 16-1, 1.3(1)).
- FOP group 3, limit: 291.4(3) "income does not exceed 1167 minimum wages set by law on 1 January"
  (translated). No ban on foreign customers found in 291.
- FOP group 3, rate: 293.3 "3 percent of income" when registered for VAT; "5 percent of income" when VAT
  is included in the single tax (translated). Plus the 1% levy: 5% + 1% = 6% (my sum).
- FOP group 3, filing: 296.3 a quarterly single-tax return; 49.18.2 "within 40 calendar days" after the
  quarter (translated); tax paid 295.3 "within 10 calendar days after the filing deadline" (translated).
  The levy is shown "in the single-tax return" (translated, 16-1, 1.11).
- Royalties are NOT single-tax income: 292.1(1) "passive income in the form of interest, dividends,
  royalties" is not included (translated).
- What is NOT a royalty, 14.1.225: payments "for the purchase of copies of intellectual property objects,
  including in electronic form, for use by their function for end consumption or for resale" (translated);
  and for use of "a computer program" limited to the copies needed ("end consumer" use, translated).
  (My reading: a store sale of a copy or add-on to an end user fits these exclusions, so it is sales
  income, not a royalty; DPS consultations below read it the same way.)
- Who cannot use the single tax, 291.5.1: gambling and lotteries, currency exchange, excise goods,
  financial intermediation, and others; software, games and publishing are not in the list. 291.5.7 bars
  non-residents (not relevant to a resident).
- Settlements in money only, 291.6: "exclusively in monetary form, cash or non-cash" (translated).
- Currency and date, 292.5-292.6: foreign-currency income converted "at the official NBU exchange rate on
  the date the income is received" (translated); the date is the day the money arrives. 292.4: under
  agency contracts the income is the agent's fee (that is the agent's side, not the principal's).

### Part 1. DPS individual consultations (IPK) on store and platform sales
- IPK 29.09.2026 No 5778/IPK/99-00-24-03-03 (FOP group 3 selling own digital works through a foreign
  platform, paid via Payoneer to a USD account), as reported by 7eminar.ua 05.10.2026,
  https://7eminar.ua/news/24962-fop-prodaje-cifrovi-produkti-cerez-platformu-nerezidenta-yak-dps-viznacaje :
  where the payment is for copies for end consumption, "such payment is not a royalty and is included in
  the single taxpayer's income" (translated); if it is a royalty, it "is not included in the single
  taxpayer's income" (translated). The IPK text itself was not opened (the DPS register
  https://cabinet.tax.gov.ua/registers/ipk is a search form; not typed into). An IPK binds only the payer
  who asked (general rule, not re-checked here).
- IPK No 452/IPK/99-00-24-03-03 (published 26.01.2024; FOP group 3, non-VAT, selling apps through Apple
  as "agent for delivering licensed apps to end users", translated), as reported by
  https://zvit.vchasno.ua/taxes-consultation/iedynyy-podatok-fop-prodazh-dodatkiv-cherez-apple-1228071/ :
  the single-tax income is "the full amount including that commission" (translated: gross, before the
  store's cut); money credited to accounts opened for personal needs is taxed as an individual's income.
  IPK text not opened (same register).

### Part 1/2. Meta's agreement: agent, licence, entity (DDA, effective May 9, 2025)
https://developers.meta.com/horizon/policy/developer-distribution-agreement/
- 2.4: "Developer hereby appoints MPT as Developer's authorized agent"; 2.1(a) MPT may "sell or
  otherwise distribute licenses to Product(s)"; 2.1: the licence to Meta is "fully-paid up, royalty free,
  non-exclusive"; 3.2: end-user licences "will be deemed to be granted by Developer".
- 1.10 Net Revenues = "all gross revenues received by MPT or its Affiliates from the sale of licenses",
  less taxes, processing fees, refunds; 5.4(a) MPT collects and remits "Transaction Taxes" (incl. "value
  added" tax); 5.3 each payment comes "together with a report showing the calculation of Developer
  Revenue" (a document a bank or accountant can use); invoices are not mentioned.
- Counterparty named in the preamble: "Meta Platforms Technologies Ireland Ltd., located at Merrion Road,
  Dublin 4" (Meta's FAQ still says "Facebook Technologies Ireland Limited"; that it is the same company
  renamed is my assumption, not confirmed here).
- (My reading) Meta sells as the developer's agent to end users, like Apple in IPK 452: by that IPK's
  logic the payout is sales income for the single tax, not a royalty, and the base may be the gross price
  before Meta's 30% (and, unclear, before the taxes Meta deducts). An accountant must confirm the base.

### Part 2. IRS forms (instructions revised 10/2021)
- W-8BEN, https://www.irs.gov/instructions/iw8ben : "You must give Form W-8BEN to the withholding agent
  or payer if you are a nonresident alien"; line 6a is "the foreign tax identifying number (FTIN) issued to
  you by your jurisdiction of tax residence"; line 9 "identify the country where you claim to be a
  resident for income tax treaty purposes"; line 10 "must be used only if you are claiming treaty benefits
  that require that you meet conditions" (also for business profits not attributable to a US permanent
  establishment, with the treaty article). Sole proprietors are not named on the page.
- W-8BEN-E, https://www.irs.gov/instructions/iw8bene : do not use it if "You are a nonresident alien
  individual. Instead, use Form W-8BEN". (My reading: a FOP is not a separate legal person in Ukraine, so
  both a private individual and a FOP sign W-8BEN; not confirmed by an IRS line naming FOPs.)

### Part 2. Ukraine's tax numbers (OECD CRS TIN sheet for Ukraine)
https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/ukraine-tin.pdf (6 pages, downloaded)
- Individuals: each is given "a registration number of the taxpayer's account card ... (RNOKPP), which is
  also a tax number (TIN)"; "RNOKPP is the ten-digit numerical code"; it "does not change throughout the
  life of an individual".
- Legal entities: "EDRPOU Code is the eight-digit numerical code", assigned to "all legal persons
  incorporated in Ukraine". The sheet gives no separate TIN for individual entrepreneurs.
- (My reading) A FOP is the same individual registered as an entrepreneur, so Meta's TIN field takes the
  10-digit RNOKPP in both cases; YeDRPOU applies only to a company (TOV). Not confirmed by a Meta page.
- Tax Code 70.12 (same file as above): the RNOKPP is used by banks and by FOPs "in all documents
  containing information about objects of taxation of individuals" (translated).

### Part 2. US-Ukraine income tax convention (signed Washington, March 4, 1994)
https://www.irs.gov/pub/irs-trty/ukrain.pdf (text extracted with pdftotext)
- Article 7(1): "The business profits of a resident of a Contracting State shall be taxable only in that
  State unless the resident carries on ... business in the other Contracting State through a permanent
  establishment situated therein."
- Article 12(2): royalties may be taxed where they arise, but "the tax so charged shall not exceed 10
  percent of the gross amount of the royalties". 12(3): royalties are payments "for the use of, or the right
  to use, any copyright of literary, artistic, or scientific work, including computer programs".
- Article 12(5)(a): royalties "arise in a Contracting State when the payer is ... a resident of that State".
  (My reading: payouts from Meta Platforms Technologies Ireland Ltd. are not US-source royalties under this
  rule; the US treaty matters mainly if the payer is the US entity Facebook Technologies, LLC.)
- Store sales of copies to end users: whether the US side treats them as royalties or business profits
  is not settled by the treaty text; Meta's FAQ "Meta does not withhold any developer income tax" (part
  1 file). For W-8BEN line 10 the IRS instructions mention business profits with the treaty article
  (above). Which article, if any, to name on W-8BEN for Meta: not confirmed (Meta's own form wizard decides
  what it asks).

### Part 3. Currency rules (laws and NBU acts, texts downloaded from zakon.rada.gov.ua 2026-10-10)
- Law on Currency and Currency Operations 2473-VIII (edition of 26.06.2026),
  https://zakon.rada.gov.ua/laws/show/2473-19 : Art. 13(1) the NBU "may set settlement deadlines for export
  and import operations of goods" (translated); 13(2) the export proceeds "are to be credited to the
  residents' accounts in Ukrainian banks" (translated), the deadline counted, for "works, services,
  intellectual property rights", "from the day an act, invoice or other document confirming their provision
  is drawn up in writing" (translated). Art. 1: "goods" has the meaning of the Foreign Economic Activity law
  (translated); (my reading) that covers services and IP rights, so a software sale abroad is "export of goods"
  for currency control.
- NBU Resolution 18 of 24.02.2022 (edition of 17.09.2026), https://zakon.rada.gov.ua/laws/show/v0018500-22 :
  14-2 "settlement deadlines for export and import operations of goods are 180 calendar days" (translated).
  No mandatory sale of export currency proceeds found in its text (searched; not found).
- NBU Instruction on currency supervision, Resolution 7 of 02.01.2019 (edition of 31.05.2025),
  https://zakon.rada.gov.ua/laws/show/v0007500-19 : 6(1) the bank supervises an export operation if, on the
  date of "performing works, providing services, exporting intellectual property rights", payment has not yet
  arrived (translated); 9(1) supervision ends when the unsettled amount "does not exceed the insignificant
  amount" (translated), defined in 3(5) by reference to Article 20 of the AML law.
- AML law 361-IX, https://zakon.rada.gov.ua/laws/show/361-20 : Art. 20(1) financial operations are threshold
  operations if each "equals or exceeds 400 thousand hryvnias" (translated).
- (My reading) Meta pays after the month of sale, so each month's sales are an export settled later; under
  about UAH 400,000 per operation the bank does not keep it under deadline supervision; above it, the
  180-day deadline applies, which Meta's 30-day payment meets. The documents a bank wants to close it
  (contract, act/invoice, Meta's payment report) are each bank's own list: not confirmed per bank.

