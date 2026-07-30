# Implementation notes

The design handed off in `project/Fahrschule Schultes.dc.html` is implemented as a
static site at the repo root. The prototype and its bundle (`project/`, `chats/`,
`README.md`) are left untouched as reference.

```
index.html              the whole site — seven sections, anchor navigation
impressum.html          § 5 DDG provider identification — has gaps to fill
datenschutz.html        GDPR privacy notice — has gaps to fill
haftungsausschluss.html liability and copyright notice — complete
karriere.html           jobs and career page — has gaps to fill
assets/css/styles.css   Modernist tokens + component classes + the design's blocks
assets/js/main.js       class filter, price calculator, FAQ, contact form, scroll spy
assets/fonts/           Archivo, self-hosted (see below)
assets/img/logo.png     the uploaded logo, background knocked out to transparency
assets/img/hero-color.jpg  the hero photograph in colour (what the page uses)
assets/img/hero.jpg     the same frame in black and white, kept as a fallback
```

No build step and no dependencies — open `index.html` or serve the directory.

## Decisions taken with the user

| Question | Answer |
| --- | --- |
| Technology | Static HTML/CSS/JS |
| A/B home concept | **Konzept A only** — the switcher is a prototype-review tool and was dropped |
| Page structure | One long page, nav links scroll to anchors |
| Contact form | UI only, no submission endpoint yet |

## How the seven pages became seven sections

The prototype was a page-switching app, so several blocks appeared on more than
one page. On a single page each block appears once, at the anchor where it reads
best:

- **`#start`** — Konzept A hero + stats bar, the Führerscheinklassen grid with its
  filter, and the six-step Ablauf.
- **`#standorte`** — the four location cards with photo slots, plus Team & Fahrzeuge.
- **`#leistungen`** — intro, the red "Inklusive – ohne Aufpreis" poster (Konzept A's
  benefits block, kept in place of the grey card grid that carried the same six
  items on the Leistungen page), and the dark Probeunterricht panel.
- **`#preise`** — the Preise page's price list and other-classes groups, next to the
  price calculator. Konzept A's calculator copy and fine print were kept.
- **`#unterricht`** — the weekly theory plan, the per-location theory times from
  Konzept A, and the "Einfach vorbeikommen" card.
- **`#infos`** — the downloads grid and the FAQ accordion (in Konzept A's wider
  900px measure).
- **`#kontakt`** — the form, the four location contact cards and the map slot.

Duplicates that were dropped as duplicates only: the Klassen grid and FAQ that
also appeared on the Infos page, and the benefits card grid described above.

## Deviations from the prototype, and why

- **The remaining `<table>` on the Preise page** (prototype line 456) is now the
  same div-row pattern as everywhere else, per the last instruction in the chat
  ("remove table everywhere"). Every other list had already been converted.
- **The section nav sticks** below the brand bar. In the prototype only the brand
  bar was sticky, which was fine when nav links switched pages; on one long page
  the links have to stay reachable. Anchor targets clear both bars (the offset is
  measured at runtime, since the nav row wraps on narrow viewports).
- **The map slot moved into the right column**, under the location cards. In the
  prototype's two-column grid it was the third child, so it landed under the form
  in column one — the `margin-top` on it says it was meant to follow the locations.
- **Heading levels** follow the document rather than the type scale: one `h1` (the
  hero), section titles as `h2` at the drawn 42px, cell titles as `h3` at 20px, and
  the small-caps eyebrows as `.eyebrow` paragraphs. Seven `h1`s and `h2`→`h6` jumps
  were correct across seven separate pages, not on one.
- **The grid lines sit on the cells, not on the container.** The design draws the
  modular grid as the container's divider-coloured background showing through 2px
  gaps. That works only while every row is full: the class grid is `auto-fill`, and
  any incomplete row (12 classes over 5 columns, or a filtered subset) left the
  container colour showing as a grey block. Each cell now carries a 2px `outline`
  instead, so a line exists only where a card does and an incomplete row simply
  ends. Identical rendering when a grid is full.
- **The phone number outranks the CTA on a phone.** In the sticky bar the spacing
  tightens first and the "Probeunterricht" button drops below 360px — calling is
  the most valuable action on a mobile visit, and the CTA is still in the nav row
  and as the hero's primary button.
- **Responsive breakpoints were added.** The prototype is drawn for the desktop grid
  only (fixed `repeat(4,1fr)` etc.). Above ~1080px the rendering is unchanged; below
  it, cells fold down in order and the 2px rules stay 2px.
- **The logo replaces the text wordmark** in the brand bar. The upload sat on a flat
  grey ground, which would have shown as a box on `--color-bg`, so it was knocked
  out to transparency (`assets/img/logo.png`).
- **The hero carries a full-bleed photograph, in colour.** This is the one place
  the system's black-and-white rule for imagery is broken, at the client's request;
  `hero.jpg` holds the same frame in black and white if it ever needs to fall back
  in line. The photo sits *behind* the hero with the ground colour over it as a
  scrim, so the ink type, the red accent and the 2px rules are unchanged. The band
  ends at the `hr`: the stats row sits below it on plain ground, so no small type
  ever lands on the photograph and the colour can run nearly undamped on the right.
  Below 720px the type spans the full width, so the photo steps out into a
  full-bleed band *above* the headline, where it is still the first thing on screen.
- **The font is self-hosted.** The prototype pulls Archivo from Google's CDN, which
  transmits every visitor's IP address to Google and therefore needs consent under
  the GDPR — a well-known source of cease-and-desist letters in Germany. The two
  woff2 subsets (latin, latin-ext, 67 KB together) now ship with the site and the
  `<link>` to fonts.googleapis.com is gone. The page now makes no third-party
  requests at all.
- **The class cards expand.** Each of the twelve is a native `<details>`: the card
  as drawn is the `<summary>`, the prices for that class sit in a panel below it.
  Native means it opens without JavaScript and is keyboard-operable without any
  ARIA. The 12px card padding moved to the summary so the detail panel carries its
  own. Filtering closes any card it hides.
- **`.grayscale` photo slots are kept as marked placeholders** — `[ Foto ]` and
  `[ Karte ]` — since no photography was supplied.

## Still open

- **Contact form has no endpoint.** `initContactForm()` in `assets/js/main.js` marks
  the spot: validation and the "Danke!" state work, nothing is sent. Without JS the
  browser's native validation applies.
- **Placeholder content**: the weekly theory topics are examples (flagged as such in
  the chat) and need the real syllabus; the download cards have no targets yet.
- **The legal pages have deliberate gaps**, marked with `.fill` spans that render as
  loud "AUSFÜLLEN" boxes — company name and legal form, e-mail address, VAT number,
  register entry, the supervising authority for the driving-school licence under
  § 10 FahrlG, the person responsible under § 18 (2) MStV, and the choice on
  consumer arbitration. None of this can be invented; it has to come from the
  operator. Both pages need a legal review before the site is advertised, in
  particular the hosting section (GitHub Pages transfers data to the USA) and the
  contact-form section, which currently and correctly states that nothing is sent.
- **Licence for the hero photograph.** It came in as a chat paste and looks like
  stock photography. Whoever publishes the site needs the licence for it — in
  Germany an unlicensed stock photo on a commercial site invites a cease-and-desist.
- **Prices** are the operator's own figures, supplied in chat and now carried in three
  places that must stay in step: the per-class detail panels in `index.html`, the
  Klasse B list and other-class summaries in the `#preise` section, and the `PRICE`
  object in `main.js` that drives the calculator. Klasse B: 300 / 65 / 65 / 40 / 200,
  Testfahrt 25, Lernsystem 30. Motorrad: 300 / 73 / 73 / 40 / 220. BE: 120 / 69 / 69
  / 210, no theory exam. AM: 200 / 68 / 40 / 210. Fixed-price courses: B96 320 €,
  B196 850 €, Mofa 150 €.
- **A2 power rating.** The operator's price page says "bis 37KW 48PS"; the legal limit
  for A2 is 35 kW (≈48 PS), which is what the card says. Worth confirming — it looks
  like a typo on their side, and the site should not repeat it.

## Verification

Checked in headless Chromium: the calculator's arithmetic and de-DE formatting at
several settings, the filter across all five categories, the FAQ's single-open
behaviour, the form's blocked and success paths, sticky-bar anchor offsets and the
scroll spy, no horizontal overflow at 1440/1180/980/760/480/380px, 123 computed
values against the values declared in the prototype, keyboard focus and labelling,
and the full page with JavaScript disabled. The hero photograph was additionally
checked for loading, stacking behind the type, full-bleed width, and for coming
before the headline on a 390px viewport; the hero and the class grid were reviewed
by eye at 1440, 1000, 600 and 390px; and horizontal overflow, the visibility of the
phone number and of the photograph were checked at 1440/980/760/460/430/412/390/375/
360/320px.

The site is deployed at https://filodeno555.github.io/fahrschule-schultes/ via
GitHub Pages, from a repository outside this session's GitHub access — pushes are
done by hand, so the files here have to be uploaded after each change.
