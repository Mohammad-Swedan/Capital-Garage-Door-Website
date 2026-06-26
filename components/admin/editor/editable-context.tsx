"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { getPath, setPath, updateArray } from "./path";

/**
 * The in-place editor's draft store + read/write context.
 *
 * Design notes (per plan §B.3a):
 * - The draft is a single object matching the active template's **typed props**
 *   (e.g. `ServicePage`), seeded by reusing the existing `map-*.ts` loader, so the
 *   edit view and the live view start byte-for-byte identical.
 * - State lives here in a `useReducer` (NO external state lib) keyed by dot/bracket
 *   paths via the tiny `path.ts` helper. The template only *reads* via context.
 * - The default context value has `editing: false`, so any `<Editable*>` consumer
 *   rendered WITHOUT a provider (i.e. on the public site) renders its children
 *   verbatim — the public render path stays untouched.
 * - The provider owns the draft; the toolbar/serializer read the live draft by
 *   calling `useEditable()` from inside the provider (no external onChange plumbing).
 */

export interface ListOps {
  add: (item: unknown, atIndex?: number) => void;
  removeAt: (index: number) => void;
  move: (from: number, to: number) => void;
}

export interface FieldMeta {
  label?: string;
  required?: boolean;
  kind?: "text" | "list" | "image" | "icon";
}

export interface AssetSelection {
  assetId: number;
  url: string;
}

export interface EditableCtx {
  editing: boolean;
  /** The live, mutable copy of the template's typed props. */
  draft: unknown;
  get: (path: string) => unknown;
  set: (path: string, value: unknown) => void;
  listOps: (path: string) => ListOps;
  /** Opens the asset picker and writes the chosen asset back to `path`. */
  selectAsset: (path: string) => Promise<void>;
  errors: Record<string, string>;
  registerField: (path: string, meta: FieldMeta) => void;
}

const defaultCtx: EditableCtx = {
  editing: false,
  draft: undefined,
  get: () => undefined,
  set: () => {},
  listOps: () => ({ add: () => {}, removeAt: () => {}, move: () => {} }),
  selectAsset: async () => {},
  errors: {},
  registerField: () => {},
};

const EditableContext = createContext<EditableCtx>(defaultCtx);

export function useEditable(): EditableCtx {
  return useContext(EditableContext);
}

/** Typed convenience for the typical case where the draft is a known shape. */
export function useEditableDraft<T>(): T {
  return useContext(EditableContext).draft as T;
}

/* ------------------------------------------------------------------ *
 * Reducer
 * ------------------------------------------------------------------ */

type DraftAction =
  | { type: "set"; path: string; value: unknown }
  | { type: "listAdd"; path: string; item: unknown; atIndex?: number }
  | { type: "listRemove"; path: string; index: number }
  | { type: "listMove"; path: string; from: number; to: number };

function draftReducer(state: unknown, action: DraftAction): unknown {
  switch (action.type) {
    case "set":
      return setPath(state, action.path, action.value);
    case "listAdd":
      return updateArray(state, action.path, (arr) => {
        const next = [...arr];
        const at = action.atIndex ?? next.length;
        next.splice(at, 0, action.item);
        return next;
      });
    case "listRemove":
      return updateArray(state, action.path, (arr) =>
        arr.filter((_, i) => i !== action.index),
      );
    case "listMove":
      return updateArray(state, action.path, (arr) => {
        const next = [...arr];
        if (
          action.from < 0 ||
          action.from >= next.length ||
          action.to < 0 ||
          action.to >= next.length
        ) {
          return next;
        }
        const [moved] = next.splice(action.from, 1);
        next.splice(action.to, 0, moved);
        return next;
      });
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ *
 * Provider
 * ------------------------------------------------------------------ */

export interface EditableProviderProps {
  editing: boolean;
  initialDraft: unknown;
  /** Static error map keyed by path (merged with `computeErrors`). */
  errors?: Record<string, string>;
  /** Derive per-path errors from the live draft so in-place rings stay current. */
  computeErrors?: (draft: unknown) => Record<string, string>;
  /** Opens the asset picker; resolves with the chosen asset (or null if cancelled). */
  requestAsset?: () => Promise<AssetSelection | null>;
  children: ReactNode;
}

export function EditableProvider({
  editing,
  initialDraft,
  errors: staticErrors,
  computeErrors,
  requestAsset,
  children,
}: EditableProviderProps) {
  const [draft, dispatch] = useReducer(draftReducer, initialDraft);

  const fieldRegistry = useRef<Record<string, FieldMeta>>({});

  const get = useCallback((path: string) => getPath(draft, path), [draft]);

  const set = useCallback((path: string, value: unknown) => {
    dispatch({ type: "set", path, value });
  }, []);

  const listOps = useCallback(
    (path: string): ListOps => ({
      add: (item, atIndex) => dispatch({ type: "listAdd", path, item, atIndex }),
      removeAt: (index) => dispatch({ type: "listRemove", path, index }),
      move: (from, to) => dispatch({ type: "listMove", path, from, to }),
    }),
    [],
  );

  const selectAsset = useCallback(
    async (path: string) => {
      if (!requestAsset) return;
      const chosen = await requestAsset();
      if (!chosen) return;
      // Writes both the preview URL (read by the image leaf) and the assetId FK
      // (read by the serializer at `<path>AssetId`) so the template re-renders the
      // new image immediately and the save round-trips the right asset.
      dispatch({ type: "set", path, value: chosen.url });
      dispatch({ type: "set", path: `${path}AssetId`, value: chosen.assetId });
    },
    [requestAsset],
  );

  const registerField = useCallback((path: string, meta: FieldMeta) => {
    fieldRegistry.current[path] = meta;
  }, []);

  const errors = useMemo<Record<string, string>>(
    () => ({ ...(computeErrors ? computeErrors(draft) : {}), ...(staticErrors ?? {}) }),
    [computeErrors, draft, staticErrors],
  );

  const value = useMemo<EditableCtx>(
    () => ({
      editing,
      draft,
      get,
      set,
      listOps,
      selectAsset,
      errors,
      registerField,
    }),
    [editing, draft, get, set, listOps, selectAsset, errors, registerField],
  );

  return (
    <EditableContext.Provider value={value}>{children}</EditableContext.Provider>
  );
}
