"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { Dispatch, ReactNode } from "react";
import type { Catalog } from "../data/data.types";
import { catalog } from "../data/catalog";
import { seedState } from "../data/seed";
import { createReducer, type Action, type BuilderState } from "./reducer";
import { loadSavedState, saveState } from "../lib/storage";

interface BuilderContextValue {
  catalog: Catalog;
  state: BuilderState;
  dispatch: Dispatch<Action>;
  save: () => boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export default function BuilderProvider({ children }: { children: ReactNode }) {
  const reducer = useMemo(() => createReducer(catalog), []);
  const [state, dispatch] = useReducer(reducer, seedState);
  useEffect(() => {
    const saved = loadSavedState(catalog);
    if (saved) dispatch({ type: "hydrate", state: saved });
  }, []);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const save = useCallback(() => saveState(stateRef.current), []);
  const value = useMemo(
    () => ({ catalog, state, dispatch, save }),
    [state, save],
  );
  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder(): BuilderContextValue {
  const value = useContext(BuilderContext);
  if (!value)
    throw new Error("useBuilder must be used inside <BuilderProvider>");
  return value;
}
