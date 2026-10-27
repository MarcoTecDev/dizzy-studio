# Dizzy Studio · online store

Online store for **Dizzy Studio**, a clothing brand of chunky knitwear and accessories, with a
separate western capsule called **High Noon (Drop 02)**. It is built with plain HTML, CSS and
JavaScript: no frameworks, no libraries, no build step and no external CDNs. Opening `index.html`
with a double click is enough to run it.

> © 2026 Marco · Dizzy Studio. All rights reserved. This repository is published for viewing only;
> see [LICENSE](LICENSE). It is **not** open source.

## Features

- **Wool store** (`#inicio`): catalogue with filters by category, bestsellers, new arrivals,
  lookbook, workshop section and a countdown to the next drop.
- **High Noon capsule** (`#high-noon`): its own page with a western theme (sand, leather, stitch
  orange and denim blue), a giant title that opens on scroll, an expanding duel photo, a product
  mosaic that shows the garment being worn on hover, a horizontal-scrolling lookbook and unisex
  size charts.
- **Product pages** (`#<id>` or `#<id>-<colour>`): four model poses per garment, colour variants,
  sizes and add to bag.
- **Bag and favourites** saved in the visitor's browser (`localStorage`).
- **Three languages**: English (default), Spanish and Simplified Chinese, switched instantly and
  remembered for the next visit.
- **Light and dark mode**, for both the wool store and the High Noon theme.
- **Animated intros**:
  - *Yarn intro*: the screen opens covered in magenta yarn whose threads unravel in about two
    seconds, revealing "DIZZY STUDIO", which then rolls into a ball of yarn and flies to the header
    logo.
  - *Sheriff star intro*: on entering High Noon, a brass sheriff star engraved with
    "DIZZY STUDIO" takes five bullet holes, comes off its nail and falls.
  - Both can be skipped with a click or Escape and are not shown when the system has
    *reduce motion* enabled.
- **Responsive** down to 390 px wide with no horizontal scroll.

## Project structure

```
dizzy-studio/
├── index.html          Single page with three views: wool store, High Noon and product page
├── css/styles.css      Styles, colour tokens, light/dark mode, western theme and animations
├── js/i18n.js          All visible text in English, Spanish and Simplified Chinese
├── js/main.js          Catalogue, bag, favourites, routing, scroll effects and intros
├── fonts/              Self-hosted fonts (Anton, Albert Sans, IBM Plex Mono, Rye) and their licences
└── img/                All photos in .webp, each with a smaller copy in an sm/ folder
    ├── logo/           Yarn ball, thread and full logos without background
    ├── productos/      Flat-lay photo of each garment
    ├── poses/          Four model photos per garment (<id>-1 … <id>-4)
    ├── lookbook/       Lookbook photos
    ├── west/           High Noon duel photo and sheriff star frames
    ├── hero.webp       Cover photo
    └── taller.webp     Workshop section photo
```

## Running it

- Quick: double-click `index.html`.
- Closer to a real server: from this folder run `python3 -m http.server 8000` and open
  `http://localhost:8000` (or use the *Live Server* extension in Visual Studio Code).

## How it is built

### Catalogue

Products live in the `P` array in `js/main.js`. Each one has an `id`, category, colour, price,
sizes and optional flags (`best`, `new`, `wanted`). Images are found by convention:
`img/productos/<id>.webp` for the flat-lay and `img/poses/<id>-1.webp` … `-4.webp` for the poses.
Colour variants (`variants`) add the colour to the file name, e.g. `img/poses/cinturon-negro-1.webp`,
and open at `#cinturon-negro`. Products with `drop: "west"` belong to the High Noon capsule.

### Translations

Every visible string is in `js/i18n.js`, split into `en`, `es` and `zh` blocks that share the same
keys. In `index.html`, translatable elements use `data-i18n` (text), `data-i18n-html` (text with
tags) or `data-i18n-attr="attribute:key"` (e.g. `alt`, `aria-label`). Chinese falls back to the
visitor's system fonts, since the display fonts have no Chinese glyphs.

### Theming

Colour tokens are CSS custom properties on `:root` (light) and `:root[data-look="dark"]` (dark).
The High Noon page adds the `theme-west` class to `<html>`, with its own tokens in
`:root.theme-west` and `:root.theme-west[data-look="dark"]`.

### Fonts

All fonts are bundled in `fonts/` and loaded with `@font-face`, so nothing depends on Google Fonts
or an internet connection:

| Font          | Use                         |
| ------------- | --------------------------- |
| Anton         | Headlines                   |
| Albert Sans   | Body text (variable weight) |
| IBM Plex Mono | Labels, prices and sizes    |
| Rye           | High Noon headlines         |

### Performance and accessibility

- Every image has a smaller version in `sm/` (520 px products, 640 px poses, 720 px lookbook,
  900 px duel) and the browser picks the right one with `srcset`.
- The yarn intro draws each layer once and only redraws the layer being removed.
- Scroll handlers read all measurements before writing any styles, to avoid layout thrashing.
- All animations respect `prefers-reduced-motion`.

## Notes

- The logo lettering is embedded in `styles.css` as an encoded image so that CSS masks also work
  when the page is opened from the file system.
- The **Checkout** button is a demo: no payments are processed.
- All model and product photos are **AI-generated** (Google Gemini) and are placeholders until real
  photography is available.

## Licence

Copyright © 2026 Marco · Dizzy Studio. **All rights reserved.**

The code, design, texts, images and brand assets in this repository may not be copied, modified,
distributed or used, in whole or in part, without prior written permission. See [LICENSE](LICENSE).

The fonts in `fonts/` are third-party works under the SIL Open Font License 1.1; their licences are
included next to each font file.
