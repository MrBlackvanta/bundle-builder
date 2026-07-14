import type { BuilderState, Catalog } from '../types';

export const MAX_QTY = 99;

export type Action =
  | { type: 'setQty'; productId: string; variantId: string; qty: number }
  | { type: 'adjustQty'; productId: string; variantId: string; delta: number }
  | { type: 'selectVariant'; productId: string; variantId: string }
  | { type: 'selectSingle'; stepId: string; productId: string }
  | { type: 'toggleStep'; stepId: string }
  | { type: 'openStep'; stepId: string };

const clampQty = (qty: number) => Math.max(0, Math.min(MAX_QTY, Math.trunc(qty)));

export function createReducer(catalog: Catalog) {
  return function reducer(state: BuilderState, action: Action): BuilderState {
    switch (action.type) {
      case 'setQty':
      case 'adjustQty': {
        const current = state.quantities[action.productId]?.[action.variantId] ?? 0;
        const next =
          action.type === 'setQty' ? clampQty(action.qty) : clampQty(current + action.delta);
        const forProduct = {
          ...state.quantities[action.productId],
          [action.variantId]: next,
        };
        return {
          ...state,
          quantities: { ...state.quantities, [action.productId]: forProduct },
        };
      }
      case 'selectVariant':
        return {
          ...state,
          activeVariant: { ...state.activeVariant, [action.productId]: action.variantId },
        };
      case 'selectSingle': {
        const quantities = { ...state.quantities };
        for (const product of catalog.products) {
          if (product.stepId !== action.stepId) continue;
          quantities[product.id] = { default: product.id === action.productId ? 1 : 0 };
        }
        return { ...state, quantities };
      }
      case 'toggleStep':
        return {
          ...state,
          openStepId: state.openStepId === action.stepId ? null : action.stepId,
        };
      case 'openStep':
        return { ...state, openStepId: action.stepId };
    }
  };
}
