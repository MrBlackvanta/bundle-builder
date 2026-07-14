# Bundle Builder

A multi-step security-system bundle builder with a live review panel — a React
take-home prototype rebuilt from a Figma design.

## Run it

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

Other scripts:

```bash
pnpm test        # unit tests (reducer, selectors, persistence)
pnpm lint        # ESLint (next/core-web-vitals + typescript)
pnpm build       # production build
pnpm start       # serve the production build
```

Requires Node 18+ and pnpm (`corepack enable` picks up the pinned version from
`packageManager`).

## Stack

- **Next.js 16** (App Router, React Compiler, Turbopack) + **React 19** +
  **TypeScript** (strict)
- **Tailwind CSS v4** — all theme/config in
  [globals.css](src/app/globals.css) (`@theme` tokens from the Figma
  variables, `v-`-prefixed `@utility` compositions), `cn()` helper
  (clsx + tailwind-merge)
- **Vitest** for the state-logic tests

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
  (`bundle-builder:v1`). The app renders the seed on the server and first
  client paint, then applies a saved configuration after mount — unknown
  products/variants are pruned so stale saves can't break a newer catalog.
- **Responsive tiers**: two-column desktop (`xl:`, horizontal cards, sticky
  panel), stacked tablet tier (vertical cards, review below with two internal
  columns), and mobile (visible page heading, counts on collapsed steps,
  full-bleed panels).

## Decisions & tradeoffs

- **State**: one small serializable object in React Context + `useReducer`
  (`quantities[productId][variantId]`, `activeVariant`, `openStepId`).
  Everything else — line items, counts, totals — is derived, which keeps the
  card and panel steppers in sync for free. Quantity buttons dispatch *deltas*
  applied against current state in the reducer, so batched events can never
  drop an increment.
- **Client boundary**: the whole page is one interactive tree sharing the
  builder store, so `'use client'` sits on the single view component;
  `layout.tsx`/`page.tsx` stay server components.
- **JSON source**: the brief requires a JSON data source, so the catalog stays
  `catalog.json` with `/public` image paths (rendered through `next/image`
  with explicit dimensions) instead of static asset imports.
- **Money is integer cents**, formatted with `Intl.NumberFormat` at render time.
- **Fidelity**: colors, type sizes, tracking, spacing, icons, and variant-chip
  thumbnails come straight from the Figma nodes — 74:19845 (mobile), 68:9663
  (two-column desktop, the canonical layout per the brief), and 70:14135 (wide
  stacked layout, used as the structure for the in-between tier at the
  desktop type scale). Exported icon vectors are committed as React components
  in [src/components/icons](src/components/icons). The plan step's cards have
  no Figma node, so their layout reuses the product-card chrome.
- **Fonts**: the design uses Gilroy + TT Norms Pro (commercial). Poppins via
  `next/font` stands in until licensed files are added (`--font-sans` /
  `--font-checkout` slots are already wired). The public Gilroy gist only
  contains usable Bold/Black weights — not the Regular/Medium/Semibold the
  design needs.
- **Variant chip highlight**: per the design, a chip gets the green treatment
  when that variant has quantity in the system; the radio (active) state drives
  which variant the stepper edits.
- **Design inconsistency (flagged)**: the mock's card shows Wyze Cam Pan v3 at
  $39.98 → $34.98, but its review line reads $57.98 → $47.98 for qty 2 (implying
  a $28.99 → $23.99 unit). The two can't both be true. The **card** prices are
  data truth, so the seeded review line is $79.96 → $69.96 and the total is
  $209.87 instead of the mock's $187.89. The savings ($50.92) matches the mock
  either way. Swap `price`/`compareAtPrice` in the catalog to flip this decision.
- **Financing chip** ("as low as $X/mo") is computed as `total × asLowAsRate`
  from the catalog meta so it stays live as the total changes; the rate matches
  the mock's $19.19/$187.89 ratio.
- **Plan step** is single-select (radio semantics); the plan review line has no
  stepper, and the required Sense Hub's steppers are disabled, per the design.

## Not done / next

- Swap in licensed Gilroy / TT Norms Pro font files.
- Lighthouse run + fixes to hold 100s across the board.
- Optional bonus: serve `catalog.json` from a small API route instead of a
  local import.
