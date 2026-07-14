# Bundle Builder

A four-step security-system bundle builder with a live review panel, rebuilt
from a Figma design as a React take-home prototype.

## Run it

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

Other scripts:

```bash
pnpm test        # unit tests (reducer, selectors, persistence)
pnpm lint        # ESLint
pnpm build       # production build
pnpm start       # serve the production build
```

Requires Node 18+ and pnpm (`corepack enable` picks up the pinned version).

## Stack

Next.js 16 (App Router) + React 19 + TypeScript (strict). Tailwind CSS v4
with all theme tokens in [globals.css](src/app/globals.css). Vitest for the
state-logic tests.

## What it does

- Four accordion steps (cameras, plan, sensors, extra protection). Product
  cards are rendered from [catalog.json](src/data/catalog.json); badges,
  variants, steppers, and compare-at pricing are all optional per product,
  nothing is hardcoded.
- Each color variant tracks its own quantity and gets its own line in the
  review panel. Card and panel steppers edit the same store, so they never
  drift.
- The review panel updates live: line items, shipping, total, savings,
  financing estimate, and "Save my system for later".
- Saving persists the builder state to `localStorage`. Unknown products or
  variants in an old save are pruned, so a stale save can't break a newer
  catalog.
- Responsive: two-column desktop with a sticky panel, stacked tablet tier,
  and mobile.

## Decisions

- **State**: one small serializable object in Context + `useReducer`
  (quantities per product/variant, active variant, open step). Everything
  else is derived. Quantity buttons dispatch deltas, not absolute values, so
  batched events can't drop an increment.
- **Client boundary**: the page is one interactive tree, so `'use client'`
  sits on the single view component; `layout.tsx` and `page.tsx` stay server
  components.
- **Data**: the brief requires a JSON source, so the catalog stays
  `catalog.json` with `/public` image paths rendered through `next/image`.
- **Money is integer cents**, formatted with `Intl.NumberFormat` at render
  time.
- **Fonts**: the design's Gilroy and TT Norms Pro are commercial. Poppins via
  `next/font` stands in until licensed files are added; the font slots are
  already wired.
- **Contrast (deliberate deviation from Figma)**: three design colors fail
  WCAG AA on the blue panel. They're darkened to the closest passing values
  to hold Lighthouse Accessibility at 100.
- **Design inconsistency (flagged)**: the mock's card and review-line prices
  for the Wyze Cam Pan v3 contradict each other. The card prices are treated
  as truth, so the seeded total is $209.87 instead of the mock's $187.89.
  Swap `price`/`compareAtPrice` in the catalog to flip this.

## Lighthouse

Against the production build: Accessibility, Best Practices, and SEO score
100 on both presets. Performance is 95 on desktop; local mobile runs varied
(70–85) under CPU throttling and should be re-measured on the deployed URL.

## Not done / next

- Swap in licensed Gilroy / TT Norms Pro font files.

