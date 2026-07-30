# Implementation notes

The design handed off in `project/Fahrschule Schultes.dc.html` is implemented as a
static site at the repo root. The prototype and its bundle (`project/`, `chats/`,
`README.md`) are left untouched as reference.

```
index.html              the whole site — seven sections, anchor navigation
assets/css/styles.css   Modernist tokens + component classes + the design's blocks
assets/js/main.js       class filter, price calculator, FAQ, contact form, scroll spy
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
- **`.grayscale` photo slots are kept as marked placeholders** — `[ Foto ]` and
  `[ Karte ]` — since no photography was supplied.

## Still open

- **Contact form has no endpoint.** `initContactForm()` in `assets/js/main.js` marks
  the spot: validation and the "Danke!" state work, nothing is sent. Without JS the
  browser's native validation applies.
- **Placeholder content**: the weekly theory topics are examples (flagged as such in
  the chat) and need the real syllabus; the download cards, Impressum, Datenschutz,
  Haftungsausschluss and Job & Karriere links have no targets yet.
- **Licence for the hero photograph.** It came in as a chat paste and looks like
  stock photography. Whoever publishes the site needs the licence for it — in
  Germany an unlicensed stock photo on a commercial site invites a cease-and-desist.
- **Prices** are the 2026 figures from the prototype; the calculator's constants live
  in one `PRICE` object in `main.js` and must stay in step with the price list in
  `index.html`.

## Verification

Checked in headless Chromium: the calculator's arithmetic and de-DE formatting at
several settings, the filter across all five categories, the FAQ's single-open
behaviour, the form's blocked and success paths, sticky-bar anchor offsets and the
scroll spy, no horizontal overflow at 1440/1180/980/760/480/380px, 123 computed
values against the values declared in the prototype, keyboard focus and labelling,
and the full page with JavaScript disabled. The hero photograph was additionally
checked for decoding, stacking behind the type, full-bleed width, and for coming
before the headline on a 390px viewport, and the hero was reviewed by eye at 1440,
1000 and 600px.

The site is deployed at https://filodeno555.github.io/fahrschule-schultes/ via
GitHub Pages, from a repository outside this session's GitHub access — pushes are
done by hand, so the files here have to be uploaded after each change.
