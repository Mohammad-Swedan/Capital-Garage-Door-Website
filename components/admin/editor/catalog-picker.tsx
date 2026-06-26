"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader2, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * CatalogPicker — a reusable "pick-or-create" combobox for attaching catalog
 * records to a page in the in-place editor (plan §B: universal picker UX).
 *
 * It is intentionally generic so the same primitive can back FAQs now and
 * reviews / services / pricing later (Agent 4): callers supply a `fetchItems`
 * function (search/list) and, optionally, a `createItem` function + the inline
 * "Create new" form fields. Picking (or creating) an item resolves to the
 * caller via `onPick`, which decides what draft row to insert.
 *
 * Design notes:
 * - Debounced search. If the backing endpoint understands a `search` param the
 *   caller can use it inside `fetchItems(query)`; otherwise the caller can
 *   ignore the query and let the picker client-filter (see `clientFilter`).
 * - Loading / empty / error states are all handled here.
 * - Single-select by default; `multi` keeps the panel open after each pick so
 *   the author can attach several in a row.
 * - Pure presentational + fetch glue. No knowledge of FAQs specifically — the
 *   FAQ wiring lives in `editable.tsx`.
 */

/** A normalized option rendered in the results list. */
export interface CatalogPickerItem {
  id: number;
  label: string;
  /** Optional secondary line (e.g. category, answer preview). */
  sub?: string;
}

/** One field in the inline "Create new" form. */
export interface CatalogCreateField {
  /** Key in the values object handed to `onCreate`. */
  name: string;
  label: string;
  placeholder?: string;
  /** Render a textarea instead of a single-line input. */
  multiline?: boolean;
  required?: boolean;
}

export interface CatalogPickerProps<TCreated = CatalogPickerItem> {
  /**
   * Fetch matching items. Called (debounced) whenever the panel opens or the
   * query changes. Receives the trimmed query (may be empty for the initial
   * list). Should throw / reject on transport errors so the picker can surface
   * an error state.
   */
  fetchItems: (query: string) => Promise<CatalogPickerItem[]>;
  /**
   * Called when the author picks an existing item. For `multi` pickers it may be
   * called repeatedly. The picker does not close on pick when `multi`.
   */
  onPick: (item: CatalogPickerItem) => void;

  /** Title shown at the top of the panel. */
  title?: string;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Allow attaching multiple items without closing. Default: false. */
  multi?: boolean;
  /**
   * When true, the picker filters the *fetched* list client-side by `label`/`sub`
   * substring on top of whatever `fetchItems` returned. Use when the backend has
   * no `search` param. Default: false (trusts the server to filter).
   */
  clientFilter?: boolean;
  /** Debounce for search input, ms. Default: 250. */
  debounceMs?: number;
  /** Hide ids already attached (so they can't be picked twice). */
  excludeIds?: number[];

  /**
   * Inline "Create new" support. When provided, a "Create new" affordance is
   * shown; submitting POSTs via `onCreate` and, on success, the returned item is
   * handed to `onPickCreated` (or `onPick` as a fallback) and attached.
   */
  createFields?: CatalogCreateField[];
  /** Persist a new record. Resolves with the created (normalized) item, or null on failure. */
  onCreate?: (values: Record<string, string>) => Promise<TCreated | null>;
  /** Normalize the created record + attach it. Defaults to treating it as a CatalogPickerItem via onPick. */
  onPickCreated?: (created: TCreated) => void;
  /** Label for the create toggle / submit. Default: "Create new". */
  createLabel?: string;

  /** Optional extra "blank / free-text" affordance rendered in the panel footer. */
  extraAction?: { label: string; onClick: () => void };

  /** The trigger button label. Default: "Add". */
  triggerLabel?: string;
  /** Trigger button class overrides. */
  triggerClassName?: string;
  /** Render a custom trigger instead of the default ghost button. */
  renderTrigger?: (open: () => void) => ReactNode;
}

type LoadState = "idle" | "loading" | "loaded" | "error";

const panelInputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground";

export function CatalogPicker<TCreated = CatalogPickerItem>({
  fetchItems,
  onPick,
  title = "Add from library",
  searchPlaceholder = "Search…",
  multi = false,
  clientFilter = false,
  debounceMs = 250,
  excludeIds,
  createFields,
  onCreate,
  onPickCreated,
  createLabel = "Create new",
  extraAction,
  triggerLabel = "Add",
  triggerClassName,
  renderTrigger,
}: CatalogPickerProps<TCreated>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<CatalogPickerItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [creating, setCreating] = useState(false);
  const [createValues, setCreateValues] = useState<Record<string, string>>({});
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const excludeSet = useMemo(() => new Set(excludeIds ?? []), [excludeIds]);

  // Debounce the query so we don't refetch on every keystroke. The loading flag
  // is flipped here (a timer callback, not synchronously in an effect body) so
  // the spinner shows while the upcoming fetch is in flight.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim());
      if (open) setState("loading");
    }, debounceMs);
    return () => clearTimeout(t);
  }, [query, debounceMs, open]);

  // Fetch whenever the panel is open and the debounced query changes. This
  // effect only writes terminal states (loaded/error); "loading" is set by the
  // handlers that trigger a fetch (openPanel / the debounce timer).
  useEffect(() => {
    if (!open) return;
    let active = true;
    fetchItems(debounced)
      .then((res) => {
        if (!active) return;
        setItems(Array.isArray(res) ? res : []);
        setState("loaded");
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setState("error");
      });
    return () => {
      active = false;
    };
  }, [open, debounced, fetchItems]);

  const close = useCallback(() => {
    setOpen(false);
    setCreating(false);
    setCreateError(null);
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    setQuery("");
    setDebounced("");
    setItems([]);
    setState("loading");
  }, []);

  const visible = useMemo(() => {
    let list = items.filter((i) => !excludeSet.has(i.id));
    if (clientFilter && debounced) {
      const q = debounced.toLowerCase();
      list = list.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          (i.sub ? i.sub.toLowerCase().includes(q) : false),
      );
    }
    return list;
  }, [items, excludeSet, clientFilter, debounced]);

  const handlePick = (item: CatalogPickerItem) => {
    onPick(item);
    if (!multi) close();
  };

  const beginCreate = () => {
    setCreating(true);
    setCreateError(null);
    // Prefill the first text field with the current query for convenience.
    const seed: Record<string, string> = {};
    for (const f of createFields ?? []) seed[f.name] = "";
    if (createFields && createFields[0] && query.trim()) {
      seed[createFields[0].name] = query.trim();
    }
    setCreateValues(seed);
  };

  const submitCreate = async () => {
    if (!onCreate || !createFields) return;
    const missing = createFields.find(
      (f) => f.required && !(createValues[f.name] ?? "").trim(),
    );
    if (missing) {
      setCreateError(`${missing.label} is required.`);
      return;
    }
    setCreateBusy(true);
    setCreateError(null);
    try {
      const created = await onCreate(createValues);
      if (!created) {
        setCreateError("Could not create. Please try again.");
        return;
      }
      if (onPickCreated) onPickCreated(created);
      else onPick(created as unknown as CatalogPickerItem);
      setCreating(false);
      if (!multi) close();
    } catch {
      setCreateError("Could not create. Please try again.");
    } finally {
      setCreateBusy(false);
    }
  };

  return (
    <span className="relative inline-block">
      {renderTrigger ? (
        renderTrigger(openPanel)
      ) : (
        <button
          type="button"
          onClick={openPanel}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40",
            triggerClassName,
          )}
        >
          <Plus className="size-3.5" />
          {triggerLabel}
        </button>
      )}

      {open && (
        <>
          {/* Click-away backdrop. */}
          <span
            className="fixed inset-0 z-40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label={title}
            className="absolute top-full left-0 z-50 mt-1 w-80 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {creating ? createLabel : title}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {creating ? (
              /* ---- Inline create form ---- */
              <div className="space-y-2.5 p-3">
                {(createFields ?? []).map((f) => (
                  <label key={f.name} className="block space-y-1">
                    <span className="text-xs font-medium text-foreground">
                      {f.label}
                      {f.required && <span className="text-destructive"> *</span>}
                    </span>
                    {f.multiline ? (
                      <textarea
                        className={cn(panelInputClass, "min-h-16 resize-y")}
                        placeholder={f.placeholder}
                        value={createValues[f.name] ?? ""}
                        onChange={(e) =>
                          setCreateValues((v) => ({ ...v, [f.name]: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        className={panelInputClass}
                        placeholder={f.placeholder}
                        value={createValues[f.name] ?? ""}
                        onChange={(e) =>
                          setCreateValues((v) => ({ ...v, [f.name]: e.target.value }))
                        }
                      />
                    )}
                  </label>
                ))}
                {createError && (
                  <p className="text-xs text-destructive">{createError}</p>
                )}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={createBusy}
                    onClick={() => setCreating(false)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={createBusy}
                    onClick={submitCreate}
                  >
                    {createBusy ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" /> Create &amp; attach
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* ---- Search + results ---- */
              <>
                <div className="border-b border-border p-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      autoFocus
                      className={cn(panelInputClass, "pl-8")}
                      placeholder={searchPlaceholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {state === "loading" && (
                    <p className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Loading…
                    </p>
                  )}
                  {state === "error" && (
                    <p className="px-3 py-4 text-sm text-destructive">
                      Could not load. Is the API running?
                    </p>
                  )}
                  {state === "loaded" && visible.length === 0 && (
                    <p className="px-3 py-4 text-sm text-muted-foreground">
                      {debounced
                        ? "No matches."
                        : "Nothing in the library yet."}
                    </p>
                  )}
                  {state === "loaded" &&
                    visible.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handlePick(item)}
                        className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-muted"
                      >
                        <span className="line-clamp-1 text-sm font-medium text-foreground">
                          {item.label}
                        </span>
                        {item.sub && (
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {item.sub}
                          </span>
                        )}
                      </button>
                    ))}
                </div>

                {/* Footer actions: create new + optional extra (e.g. blank). */}
                {(onCreate || extraAction) && (
                  <div className="flex flex-col gap-1 border-t border-border p-2">
                    {onCreate && createFields && (
                      <button
                        type="button"
                        onClick={beginCreate}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/8"
                      >
                        <Plus className="size-4" />
                        {createLabel}
                        {query.trim() ? ` “${query.trim()}”` : ""}
                      </button>
                    )}
                    {extraAction && (
                      <button
                        type="button"
                        onClick={() => {
                          extraAction.onClick();
                          if (!multi) close();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {extraAction.label}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </span>
  );
}
