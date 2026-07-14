# Bundle Builder

A multi-step security-system bundle builder with a live review panel — a React
take-home prototype rebuilt from a Figma design.

## Run it

```bash
pnpm install
pnpm dev         # http://localhost:5173
```

Other scripts:

```bash
pnpm test        # unit tests (reducer, selectors, persistence)
pnpm build       # typecheck + production build into dist/
pnpm preview     # serve the production build
```

Requires Node 18+ and pnpm (`corepack enable` will pick up the pinned version
from `packageManager`).

## What's here

- **4-step accordion builder** (cameras → plan → sensors → extra protection);
  step 1 open on load, headers show a "STEP X OF 4" kicker, icon, title, and a
  live "N selected" count (distinct products, not units).
- **Data-driven cards** rendered from [src/data/catalog.json](src/data/catalog.json) —
  badge, image, description, Learn More, variant chips, quantity stepper, and
  compare-at/active pricing are all optional per product; nothing is hardcoded
  per product.
- **Per-variant quantities**: each color tracks its own count. The card stepper
  is bound to the active variant; every variant with a count > 0 gets its own
  review-panel line (a small variant label appears only when a product has more
  than one variant in the system, so the seeded view matches the design exactly).
- **Live review panel**: grouped line items with their own steppers (two-way
  sync with the cards via a single reducer store), shipping row, guarantee
  seal, financing chip, struck-through total, savings callout, checkout
  placeholder, and a working **Save my system for later**.
- **Persistence**: saving serializes the whole builder state to `localStorage`
  (`bundle-builder:v1`); on return it's restored exactly — with unknown
  products/variants pruned so stale saves can't break a newer catalog.
- **Responsive tiers**: two-column desktop (≥1200px, horizontal cards, sticky
  panel), stacked tablet tier (vertical cards, review below with two internal
  columns and the returns copy), and mobile (≤640px: visible page heading,
  counts on collapsed steps, full-bleed panels).

## Decisions & tradeoffs

- **State**: one small serializable object in React Context + `useReducer`
  (`quantities[productId][variantId]`, `activeVariant`, `openStepId`). Everything
  else — line items, counts, totals — is derived, which is what keeps the card
  and panel steppers in sync for free. Quantity buttons dispatch *deltas* that
  are applied against current state in the reducer, so batched events can never
  drop an increment.
- **Money is integer cents**, formatted with `Intl.NumberFormat` at render time.
- **Design inconsistency (flagged)**: the mock's card shows Wyze Cam Pan v3 at
  $39.98 → $34.98, but its review line reads $57.98 → $47.98 for qty 2 (implying
  a $28.99 → $23.99 unit). The two can't both be true. I kept the **card** prices
  as data truth, so the seeded review line is $79.96 → $69.96 and the total is
  $209.87 instead of the mock's $187.89. The savings ($50.92) matches the mock
  either way. Swap `price`/`compareAtPrice` in the catalog to flip this decision.
- **Financing chip** ("as low as $X/mo") is computed as `total × asLowAsRate`
  from the catalog meta so it stays live as the total changes; the rate matches
  the mock's $19.19/$187.89 ratio.
- **Plan step** is single-select (radio semantics); the plan review line has no
  stepper, and the required Sense Hub's steppers are disabled, per the design.
- **Placeholder assets**: product images, the guarantee seal, and the plan
  brandmark are hand-drawn SVGs standing in for Figma-exported assets; design
  tokens in [src/styles/tokens.css](src/styles/tokens.css) are estimated from
  PNG exports and marked `TODO(figma)`. Poppins stands in for the design's font
  until confirmed.

## Not done / next

- Pixel-perfect pass against the Figma file (exact hex values, type scale,
  spacing, exported imagery) once design-token access is available.
- Lighthouse run + fixes to hold 100s across the board (structure is already
  built for it: semantic landmarks/roles, labeled controls, self-hosted subset
  fonts, tiny SVG assets, meta description).
- Optional bonus: serve `catalog.json` from a small API instead of a local import.
