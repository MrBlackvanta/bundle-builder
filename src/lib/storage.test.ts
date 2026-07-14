import { describe, expect, it } from "vitest";
import { catalog } from "../data/catalog";

import { loadSavedState, saveState } from "./storage";
import { seedState } from "../data/seed";

function stubStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe("persistence", () => {
  it("round-trips the state through localStorage", () => {
    stubStorage();
    expect(saveState(seedState)).toBe(true);
    expect(loadSavedState(catalog)).toEqual(seedState);
  });

  it("returns null when nothing is saved", () => {
    stubStorage();
    expect(loadSavedState(catalog)).toBeNull();
  });

  it("drops unknown products and variants from a stale save", () => {
    stubStorage();
    saveState({
      quantities: {
        "wyze-cam-v4": { white: 1, "discontinued-color": 4 },
        "deleted-product": { default: 3 },
      },
      activeVariant: { "wyze-cam-v4": "no-such-variant" },
      openStepId: "no-such-step",
    });
    const loaded = loadSavedState(catalog);
    expect(loaded).toEqual({
      quantities: { "wyze-cam-v4": { white: 1 } },
      activeVariant: {},
      openStepId: "cameras",
    });
  });

  it("rejects corrupted JSON", () => {
    stubStorage({ "bundle-builder:v1": "{not json" });
    expect(loadSavedState(catalog)).toBeNull();
  });
});
