import { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { BuilderState, Catalog } from '../types';
import { catalog } from '../data/catalog';
import { seedState } from '../data/seed';
import { createReducer, type Action } from './reducer';
import { loadSavedState, saveState } from '../lib/storage';

interface BuilderContextValue {
  catalog: Catalog;
  state: BuilderState;
  dispatch: Dispatch<Action>;
  /** Persist the CURRENT state to localStorage (never a stale render's state). */
  save: () => boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const reducer = useMemo(() => createReducer(catalog), []);
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => loadSavedState(catalog) ?? seedState,
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const save = useCallback(() => saveState(stateRef.current), []);
  const value = useMemo(() => ({ catalog, state, dispatch, save }), [state, save]);
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder(): BuilderContextValue {
  const value = useContext(BuilderContext);
  if (!value) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return value;
}
