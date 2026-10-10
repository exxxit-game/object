# Knowledge base audit (read only, 10.10.2026)

## 1. What exists and how it is indexed
- **Library:** 586 files, 567 MB: 311 papers by file name, plus evacuation-library (21 PDFs with a .bib) and ansur2 data.
- **Cards:** 145. 143 point to an existing .txt; 2 have no text. Only the cards have an index: catalog.md (43 KB, generated, tested).
- **Nothing indexes the library itself.** 168 papers have no card. Of these, 86 are named only in research/vr prose, 53 in other research prose and 16 in papers-needed. **24 are named nowhere**, among them room 01's own paper, alloy-abramson-1979, and its replication. sources.md cites both by author only.
- **Invisible to grep:** 15 evacuation PDFs with no text, van-zelderen-2026 (no .txt), and loewenstein-1994.txt (a placeholder line).
- **Stale records:**
  - glucksberg-1962: the card says "no legal text", search-coverage says "paid only", papers-needed says "free scan found", and the library holds the PDF and the text. navarrete-2012 is the same case.
  - Remington 2024 and EUREC are called "not opened" but sit on disk.
  - Plassmann 2008 and McFadyen 2021 are marked "read" but were never saved.
- **Duplicates:** 6 byte-identical PDFs (bode-2014, bode-2018, kinateder-2016, kinateder-ronchi-2014, kinateder-warren-2016, snopkova-2021).
- **Research:** 45 files, 1.09 MB (about 270k tokens). The 11 top-level files are reached only via own-experiments-now.md.

## 2. "Do we have X?" today
A grep over 23 MB of text takes 0.3 s, but it returns bare file names. Making sense of them takes 4–6 more reads.
- **Choice blindness:** 8 hits. 3 have cards, 4 papers have no card (hall-2010, johansson-2006, mckay-2025, remington-2024), 1 is false.
- **Price and quality:** 6 hits, none on the topic. The answer is in own-experiments-now §3c: Plassmann read online, not saved.
- **Doorway effect:** 8 hits, all just the word "doorway". The answer is split across three docs.

The search takes seconds and interpreting it takes minutes. The answer depends on which file opens first.

## 3. Practice relied on
- **Zotero:** one record per item. Tags work as "keywords"; collections work "like playlists" (one item can sit in several without being copied).
- **Dublin Core (ISO 15836):** 15 fields, such as title, creator, subject, date, type, identifier, source, relation and rights.
- **APA PsycInfo classification:** 22 major categories, 1–2 per record (university listings; APA's page did not load).
- **Progressive disclosure (Anthropic Agent Skills):** metadata is always loaded (about 100 tokens), the body when triggered (under 5k), files when needed. llms.txt (Howard 2024) has the same shape.
- **Own lesson:** a generated catalog never drifts, while in Cosmogram a stale record was the top cause of bugs.

## 4. Proposed index
- **Always loaded:** library.md with one line per section (name, count, about 10 keywords, link) and the status counts. About 0.8k tokens.
- **On demand:** one file per section with one line per paper. About 12 sections of about 26 papers, about 0.9k tokens each, about 11k for all.
- **Then:** the card, then the .txt.
- **Sections:** perception · body and space · memory and attention · decisions and self-knowledge · social · emotion, morality, culture · VR norms · methods, ethics, law · games and platforms · data sets. Also three views: wanted, read but not saved, dropped (with the reason).
- **Fields per entry:**
  - id (file stem), authors, year, short title
  - section (1–2), tags (phenomenon names), type
  - text quality, status
  - used in (computed from the repo)
  - source URL and rights
  - relation (replication, supplement, duplicate)
- **How it stays current:** a script generates it and `npm test` checks it, as with the catalog. It replaces search-coverage.md and papers-needed.md.

Index of the 10.10 rebuild audits: [README.md](README.md)
