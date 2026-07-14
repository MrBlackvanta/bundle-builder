import { describe, expect, it } from 'vitest';
import { catalog } from '../data/catalog';
import { seedState } from '../data/seed';
import { createReducer } from './reducer';
import {
  getLineItems,
  getQty,
  getStepSelectedCount,
  getTotals,
} from './selectors';

const reducer = createReducer(catalog);

describe('variant quantities', () => {
  it('tracks each variant separately — switching variants never touches other counts', () => {
    let state = seedState;
    // Seed: 1 × white Cam v4. Add 2 black on top.
    state = reducer(state, {
      type: 'setQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      qty: 2,
    });
    state = reducer(state, {
      type: 'selectVariant',
      productId: 'wyze-cam-v4',
      variantId: 'grey',
    });

    expect(getQty(state, 'wyze-cam-v4', 'white')).toBe(1);
    expect(getQty(state, 'wyze-cam-v4', 'black')).toBe(2);
    expect(getQty(state, 'wyze-cam-v4', 'grey')).toBe(0);
    expect(state.activeVariant['wyze-cam-v4']).toBe('grey');
  });

  it('shows every variant with qty > 0 as its own review line', () => {
    let state = seedState;
    state = reducer(state, {
      type: 'setQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      qty: 2,
    });
    const camV4Lines = getLineItems(catalog, state).filter(
      (item) => item.product.id === 'wyze-cam-v4',
    );
    expect(camV4Lines.map((l) => [l.variant?.id, l.qty])).toEqual([
      ['white', 1],
      ['black', 2],
    ]);
  });

  it('applies deltas against current state, so rapid increments never drop', () => {
    let state = seedState;
    state = reducer(state, {
      type: 'adjustQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      delta: 1,
    });
    state = reducer(state, {
      type: 'adjustQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      delta: 1,
    });
    expect(getQty(state, 'wyze-cam-v4', 'black')).toBe(2);
    state = reducer(state, {
      type: 'adjustQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      delta: -1,
    });
    expect(getQty(state, 'wyze-cam-v4', 'black')).toBe(1);
  });

  it('clamps quantities at zero', () => {
    const state = reducer(seedState, {
      type: 'setQty',
      productId: 'wyze-cam-v4',
      variantId: 'white',
      qty: -5,
    });
    expect(getQty(state, 'wyze-cam-v4', 'white')).toBe(0);
  });
});

describe('single-select steps (plan)', () => {
  it('selecting a plan deselects the other plans', () => {
    const state = reducer(seedState, {
      type: 'selectSingle',
      stepId: 'plan',
      productId: 'plan-cam-plus',
    });
    expect(getQty(state, 'plan-cam-plus', 'default')).toBe(1);
    expect(getQty(state, 'plan-cam-unlimited', 'default')).toBe(0);
    expect(getStepSelectedCount(catalog, state, 'plan')).toBe(1);
  });
});

describe('step counters', () => {
  it('counts distinct products, not units or variants', () => {
    // Seed: Cam v4 (×1) + Cam Pan v3 (×2) -> 2 distinct products.
    expect(getStepSelectedCount(catalog, seedState, 'cameras')).toBe(2);
    // Adding a second variant of Cam v4 must NOT bump the distinct count.
    const state = reducer(seedState, {
      type: 'setQty',
      productId: 'wyze-cam-v4',
      variantId: 'black',
      qty: 3,
    });
    expect(getStepSelectedCount(catalog, state, 'cameras')).toBe(2);
  });

  it('matches the design seed on every step', () => {
    expect(getStepSelectedCount(catalog, seedState, 'cameras')).toBe(2);
    expect(getStepSelectedCount(catalog, seedState, 'plan')).toBe(1);
    expect(getStepSelectedCount(catalog, seedState, 'sensors')).toBe(2);
    expect(getStepSelectedCount(catalog, seedState, 'extras')).toBe(1);
  });
});

describe('totals', () => {
  it('computes total, compare-at and savings for the seeded system', () => {
    const totals = getTotals(catalog, seedState);
    // cam v4 2798 + pan v3 2×3498 + motion 2×2999 + hub 0 + sd 2×2098 + plan 999
    expect(totals.total).toBe(20987);
    expect(totals.compareAt).toBe(26079);
    expect(totals.savings).toBe(5092); // $50.92 — matches the design's savings line
  });

  it('recalculates when a quantity changes', () => {
    const state = reducer(seedState, {
      type: 'setQty',
      productId: 'wyze-cam-v4',
      variantId: 'white',
      qty: 2,
    });
    const totals = getTotals(catalog, state);
    expect(totals.total).toBe(20987 + 2798);
  });
});

describe('accordion', () => {
  it('toggles a step open and closed', () => {
    let state = reducer(seedState, { type: 'toggleStep', stepId: 'plan' });
    expect(state.openStepId).toBe('plan');
    state = reducer(state, { type: 'toggleStep', stepId: 'plan' });
    expect(state.openStepId).toBeNull();
  });
});
