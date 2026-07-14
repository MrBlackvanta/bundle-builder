import type { BuilderState, Catalog, Product, ReviewCategory, Variant } from '../types';

export const DEFAULT_VARIANT = 'default';

export const REVIEW_CATEGORY_ORDER: ReviewCategory[] = [
  'Cameras',
  'Sensors',
  'Accessories',
  'Plan',
];

export interface LineItem {
  product: Product;
  variant?: Variant;
  qty: number;
  /** Line totals in cents (unit price × qty). */
  lineTotal: number;
  lineCompareAt?: number;
}

export interface ReviewGroup {
  category: ReviewCategory;
  items: LineItem[];
}

export function getActiveVariantId(state: BuilderState, product: Product): string {
  const stored = state.activeVariant[product.id];
  if (stored && product.variants?.some((v) => v.id === stored)) return stored;
  return product.variants?.[0]?.id ?? DEFAULT_VARIANT;
}

export function getQty(state: BuilderState, productId: string, variantId: string): number {
  return state.quantities[productId]?.[variantId] ?? 0;
}

export function getProductTotalQty(state: BuilderState, product: Product): number {
  const byVariant = state.quantities[product.id];
  if (!byVariant) return 0;
  return Object.values(byVariant).reduce((sum, qty) => sum + qty, 0);
}

/** Number of DISTINCT products with any quantity in a step (variants count once). */
export function getStepSelectedCount(
  catalog: Catalog,
  state: BuilderState,
  stepId: string,
): number {
  return catalog.products.filter(
    (p) => p.stepId === stepId && getProductTotalQty(state, p) > 0,
  ).length;
}

export function getLineItems(catalog: Catalog, state: BuilderState): LineItem[] {
  const items: LineItem[] = [];
  for (const product of catalog.products) {
    const variants: (Variant | undefined)[] = product.variants?.length
      ? product.variants
      : [undefined];
    for (const variant of variants) {
      const qty = getQty(state, product.id, variant?.id ?? DEFAULT_VARIANT);
      if (qty <= 0) continue;
      items.push({
        product,
        variant,
        qty,
        lineTotal: qty * product.price,
        lineCompareAt:
          product.compareAtPrice != null ? qty * product.compareAtPrice : undefined,
      });
    }
  }
  return items;
}

export function getReviewGroups(catalog: Catalog, state: BuilderState): ReviewGroup[] {
  const items = getLineItems(catalog, state);
  return REVIEW_CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.product.reviewCategory === category),
  })).filter((group) => group.items.length > 0);
}

export interface Totals {
  total: number;
  compareAt: number;
  savings: number;
}

/** Totals across product lines (shipping is free and excluded, matching the design). */
export function getTotals(catalog: Catalog, state: BuilderState): Totals {
  const items = getLineItems(catalog, state);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const compareAt = items.reduce(
    (sum, item) => sum + (item.lineCompareAt ?? item.lineTotal),
    0,
  );
  return { total, compareAt, savings: compareAt - total };
}
