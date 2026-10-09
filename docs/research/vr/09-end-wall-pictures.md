# 09. Pictures for the corridor's end walls

Question (owner): the two end walls of the corridor are empty and do not draw the player to walk
there; hang a picture on one or both, chosen from real things. Everything is recreated from real
sources; options go to the owner as pictures first.

Geometry now (read from `src/app/lobby/scene.js` and `src/app/lobby/plan.js`):
- End walls at x = -6.6 and x = 8.0 (`PLAN.from`, `PLAN.to`), each 1.8 m wide (`WIDTH`), ceiling
  2.5 m (`CEIL`), a wooden rail at 0.8 m (`RAIL`), painted block (`PAINT.end` #858f74 above,
  `PAINT.endBelow` #59624c below), 4 in base. Nothing else is on them.
- Arrival spot x 0.7 (`SPOT`), so 7.3 m to each end wall.
- scene.js: "openings and flat things on the walls start and end on the 0.2 m block module"
  (tests/masonry.test.mjs), so a frame's edges should land on block joints.

Verification marks: **opened** = I read the page itself in this session (WebFetch or the browser);
**search** = only a search result; **unverified** = no source read.

## Parts (each gets an answer or "not found")
1. Q1. What hung on US psychology department / lab corridor walls in the 1970s: kinds, framing,
   size, height, strength of evidence.
2. Q2. How games and level designers draw a player to the far end of a corridor; what works in VR.
3. Q3. At least 6 candidate real images: author, year, file URL, resolution, licence (US and
   EU/Russia).
4. Q4. Period presentation: frames, poster/print sizes, hanging height, glazing.
5. Q5. Headset: size to read the subject at 7 m and a caption up close; texture budget.

## Q2. Drawing the player to the far end (level design)

- **Weenies: a landmark that pulls people toward a place; light the goal; the main path is the
  brightest thing.** Scott Rogers, "Everything I learned about level design I learned from
  Disneyland", GDC San Francisco 2009, transcript notes by Cory Doctorow,
  https://craphound.com/disneylandleveldesign.txt — **opened**. Quotes: "weenies (landmarks that
  draw guests towards certain locations)"; "Lighting to draw people toward goal"; "Squint test:
  ... the main path is the brightest thing on the screen"; "Nooks and crannies that reward
  exploration". For us: a picture on an end wall is a weenie only if it reads as *something* from
  the arrival spot (shape, colour, contrast against the green-grey block) and pays off up close.
- **Key lights create contrast and a hierarchy of where to go.** Robert Yang (with David Shaver,
  Naughty Dog), "How To Light A Level", GDC 2018 Level Design Workshop, summary and slide links at
  https://www.blog.radiator.debacle.us/2018/03/gdc-2018-how-to-light-level-slides-and.html —
  **opened**. Quotes: "using point lights and spotlights to draw more attention to where the player
  might want to go"; "you want to create contrast with these key lights"; "One important concept
  here is hierarchy." Slides/notes are Dropbox PDFs linked there (not read).
- **Already in our research (docs/research/vr/05b-attention-reveals.md, §3):** in 360°/VR studies a
  static light did not redirect gaze while sound and motion did (Rothe & Hußmann 2018), and
  diegetic cues kept presence higher than arrows (Rothe, Buschek & Hußmann 2019). For us: a still
  picture alone is a weak lure in VR; its pull comes from contrast and from being the only
  distinct thing at the end of a long uniform view.

## Q4. Period presentation (frames, sizes, height)

- **Metal section frame (the "Nielsen" type) existed in 1979; invented late 1960s for lending
  prints and drawings; on retail sale from 1968; originals silver or gold only.** Wikipedia,
  "Metal Section Frame", https://en.wikipedia.org/wiki/Metal_Section_Frame — **opened**. Quotes:
  "invented by picture framer Donald P. Herbert (1926–1982) in the late 1960s"; "In 1968 metal
  section frames were also made available for retail sale for the first time"; "only available
  in a silver or gold finish". Nielsen brand in the US from 1974: **search only** (A Street Frames,
  https://astreetframes.com/frame-history/the-ubiquitous-metal-section-frame-and-its-true-inventor/,
  retailer page, not opened). For us: a narrow silver aluminium frame round a print is period-correct
  for 1979 and matches the aluminium of our cork board.
- **Hanging height (museum accessibility standard, not a 1979 rule):** Smithsonian Guidelines for
  Accessible Exhibition Design (Smithsonian Accessibility Program; undated in the copy read),
  https://www.sifacilities.si.edu/sites/default/files/Files/Accessibility/accessible-exhibition-design1.pdf
  — **opened** (PDF text extracted). Quotes: "Wall labels mounted with a centerline at 1370 mm
  (54 in.) above the floor are at optimum height for everyone"; labels "between 1220 mm (48 in.)
  and 1675 mm (67 in.)" are comfortable seated and standing; "Mount small items (to center line)
  at no higher than 1015 mm (40 in.)" (for seated viewers). The common "57-60 in centre" picture
  rule was found only on art-seller blogs (search results, not a standard): **unverified as a
  standard**.
