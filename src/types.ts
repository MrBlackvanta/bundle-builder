export type ReviewCategory = 'Cameras' | 'Sensors' | 'Accessories' | 'Plan';

export interface Variant {
  id: string;
  label: string;
  /** Swatch color hex for the chip dot (placeholder until Figma assets are exported). */
  swatch: string;
}

export interface Product {
  id: string;
  stepId: string;
  reviewCategory: ReviewCategory;
  name: string;
  description: string;
  image: string;
  learnMoreUrl?: string;
  badge?: string;
  /** Price in cents (per unit, or per month when `perMonth` is set). */
  price: number;
  /** Struck-through compare-at price in cents. */
  compareAtPrice?: number;
  perMonth?: boolean;
  /** Render the name as a Wyze brandmark (e.g. the plan logo lockup). */
  brandmark?: boolean;
  /** Quantity cannot be changed (e.g. the required Sense Hub). */
  locked?: boolean;
  variants?: Variant[];
}

export interface Step {
  id: string;
  title: string;
  icon: string;
  selectionMode: 'quantity' | 'single';
  nextLabel: string | null;
}

export interface CatalogMeta {
  shipping: { label: string; price: number; compareAtPrice?: number };
  /** Financing chip: monthly price = round(total * asLowAsRate). */
  asLowAsRate: number;
  guarantee: { headline: string; body: string };
}

export interface Catalog {
  steps: Step[];
  products: Product[];
  meta: CatalogMeta;
}

export interface BuilderState {
  /** productId -> variantId ("default" for variant-less products) -> quantity */
  quantities: Record<string, Record<string, number>>;
  /** productId -> variant currently shown on the card */
  activeVariant: Record<string, string>;
  openStepId: string | null;
}
