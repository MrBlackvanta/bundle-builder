import type { BuilderState, Catalog } from '../types';
import { DEFAULT_VARIANT } from '../state/selectors';

const STORAGE_KEY = 'bundle-builder:v1';

export function saveState(state: BuilderState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Load a previously saved configuration. Unknown products/variants are dropped
 * so a stale save can never break the app after the catalog changes.
 */
export function loadSavedState(catalog: Catalog): BuilderState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as { version?: unknown }).version !== 1
    ) {
      return null;
    }
    const saved = (parsed as { state?: unknown }).state;
    if (typeof saved !== 'object' || saved === null) return null;
    return sanitize(catalog, saved as Partial<BuilderState>);
  } catch {
    return null;
  }
}

function sanitize(catalog: Catalog, saved: Partial<BuilderState>): BuilderState {
  const quantities: BuilderState['quantities'] = {};
  const activeVariant: BuilderState['activeVariant'] = {};

  for (const product of catalog.products) {
    const savedQty = saved.quantities?.[product.id];
    if (savedQty && typeof savedQty === 'object') {
      const validIds = product.variants?.length
        ? product.variants.map((v) => v.id)
        : [DEFAULT_VARIANT];
      const cleaned: Record<string, number> = {};
      for (const id of validIds) {
        const qty = savedQty[id];
        if (typeof qty === 'number' && Number.isFinite(qty) && qty > 0) {
          cleaned[id] = Math.min(99, Math.trunc(qty));
        }
      }
      if (Object.keys(cleaned).length > 0) quantities[product.id] = cleaned;
    }

    const savedVariant = saved.activeVariant?.[product.id];
    if (savedVariant && product.variants?.some((v) => v.id === savedVariant)) {
      activeVariant[product.id] = savedVariant;
    }
  }

  const openStepId =
    saved.openStepId === null ||
    catalog.steps.some((step) => step.id === saved.openStepId)
      ? (saved.openStepId as string | null)
      : catalog.steps[0].id;

  return { quantities, activeVariant, openStepId };
}
