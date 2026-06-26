"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogPicker, type CatalogPickerItem, type CatalogCreateField } from "./catalog-picker";

/**
 * In-place Settings-drawer pin pickers (plan §B.3g/B.6). Manages the page's relational pins —
 * review pins, pricing rows, service links — that the backend replaces wholesale on save.
 * Catalog options are fetched via the server proxy /admin/api/pins (the admin endpoints need the
 * httpOnly JWT). Each section emits the exact payload shape the serializer/backend expect.
 *
 * Each section's "Add…" affordance is a reusable `CatalogPicker` that lets the author either pick
 * an existing catalog row (search) or CREATE a new one inline (POST /admin/api/pins) and pin it in
 * one step (Agent 4). A freshly-created row is folded into the in-memory catalog so its label shows.
 */

export interface ReviewPin {
  reviewId: number;
  sortOrder: number;
}
export interface PricingPin {
  pricingItemId: number;
  sortOrder: number;
  noteOverride: string | null;
}
export interface ServicePin {
  serviceId: number;
  sortOrder: number;
}

interface CatalogItem {
  id: number;
  label: string;
  sub?: string;
}

/** A raw catalog row as returned by the API (camelCase, loosely typed). */
type RawCatalogRow = Record<string, unknown>;

type PinType = "reviews" | "pricing" | "services";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function numOrUndef(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

async function fetchCatalog(type: PinType): Promise<RawCatalogRow[]> {
  try {
    const res = await fetch(`/admin/api/pins?type=${type}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as RawCatalogRow[]) : [];
  } catch {
    return [];
  }
}

/** Create a catalog row inline via the server proxy; resolves the created (raw) row or null. */
async function createCatalogRow(type: PinType, values: Record<string, string>): Promise<RawCatalogRow | null> {
  try {
    const res = await fetch(`/admin/api/pins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...values }),
    });
    if (!res.ok) return null;
    return (await res.json()) as RawCatalogRow;
  } catch {
    return null;
  }
}

/** Normalized pin row used inside a section: a catalog id + optional note. */
interface NormPin {
  id: number;
  note?: string;
}

/** Per-type config for the inline "Create new" form + how to normalize the created/raw rows. */
interface CreateConfig {
  type: PinType;
  createLabel: string;
  createFields: CatalogCreateField[];
  /** Normalize a raw catalog row (from GET or POST) to a CatalogItem. */
  normalize: (raw: RawCatalogRow) => CatalogItem;
}

function PinSection({
  title,
  emptyHint,
  catalog,
  loading,
  pins,
  hasNote,
  onChange,
  create,
  onCreated,
}: {
  title: string;
  emptyHint: string;
  catalog: CatalogItem[];
  loading: boolean;
  pins: NormPin[];
  hasNote?: boolean;
  onChange: (pins: NormPin[]) => void;
  create: CreateConfig;
  /** Fold a freshly-created catalog row into the parent catalog so its label renders. */
  onCreated: (item: CatalogItem) => void;
}) {
  const byId = new Map(catalog.map((c) => [c.id, c]));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= pins.length) return;
    const next = [...pins];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(pins.filter((_, idx) => idx !== i));
  const addId = (id: number) => {
    if (!id || pins.some((p) => p.id === id)) return;
    onChange([...pins, hasNote ? { id, note: "" } : { id }]);
  };
  const setNote = (i: number, note: string) =>
    onChange(pins.map((p, idx) => (idx === i ? { ...p, note } : p)));

  // The picker searches the already-loaded catalog client-side (no per-type search endpoint).
  const fetchItems = useCallback(
    async (): Promise<CatalogPickerItem[]> =>
      catalog.map((c) => ({ id: c.id, label: c.label, sub: c.sub })),
    [catalog],
  );

  const onCreate = useCallback(
    async (values: Record<string, string>): Promise<CatalogItem | null> => {
      const raw = await createCatalogRow(create.type, values);
      if (!raw || typeof raw.id !== "number") return null;
      return create.normalize(raw);
    },
    [create],
  );

  return (
    <fieldset className="space-y-2 rounded-xl border border-border bg-card p-3">
      <legend className="px-1 text-sm font-medium text-foreground">{title}</legend>

      {pins.length === 0 && <p className="text-xs text-muted-foreground">{emptyHint}</p>}

      {pins.map((p, i) => {
        const item = byId.get(p.id);
        return (
          <div key={`${p.id}-${i}`} className="space-y-1.5 rounded-lg border border-border/60 bg-muted/30 p-2">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {item ? item.label : `#${p.id}`}
                {item?.sub && <span className="ml-1 text-xs text-muted-foreground">· {item.sub}</span>}
              </span>
              <Button type="button" size="icon-xs" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                <ArrowUp className="size-3.5" />
              </Button>
              <Button type="button" size="icon-xs" variant="ghost" disabled={i === pins.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                <ArrowDown className="size-3.5" />
              </Button>
              <Button type="button" size="icon-xs" variant="destructive" onClick={() => remove(i)} aria-label="Remove">
                <X className="size-3.5" />
              </Button>
            </div>
            {hasNote && (
              <input
                className={inputClass}
                placeholder="Per-page note override (optional)"
                value={p.note ?? ""}
                onChange={(e) => setNote(i, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <div className="pt-1">
        <CatalogPicker<CatalogItem>
          title={loading ? "Loading…" : "Add from library"}
          searchPlaceholder="Search…"
          triggerLabel="Add"
          multi
          clientFilter
          excludeIds={pins.map((p) => p.id)}
          fetchItems={fetchItems}
          onPick={(item) => addId(item.id)}
          createLabel={create.createLabel}
          createFields={create.createFields}
          onCreate={onCreate}
          onPickCreated={(item) => {
            onCreated(item);
            addId(item.id);
          }}
        />
      </div>
    </fieldset>
  );
}

export interface PinsEditorProps {
  reviews: ReviewPin[];
  onReviewsChange: (v: ReviewPin[]) => void;
  pricingRows: PricingPin[];
  onPricingChange: (v: PricingPin[]) => void;
  services: ServicePin[];
  onServicesChange: (v: ServicePin[]) => void;
}

function normReview(x: RawCatalogRow): CatalogItem {
  const id = numOrUndef(x.id) ?? 0;
  const rating = numOrUndef(x.rating);
  return {
    id,
    label: str(x.customerName) || `Review #${id}`,
    sub: [rating ? `${rating}★` : "", str(x.text).slice(0, 40)].filter(Boolean).join(" "),
  };
}
function normPricing(x: RawCatalogRow): CatalogItem {
  const id = numOrUndef(x.id) ?? 0;
  return { id, label: str(x.scenario) || `Item #${id}`, sub: str(x.priceLabel) };
}
function normService(x: RawCatalogRow): CatalogItem {
  const id = numOrUndef(x.id) ?? 0;
  return { id, label: str(x.name) || `Service #${id}`, sub: str(x.slug) };
}

export function PinsEditor({
  reviews,
  onReviewsChange,
  pricingRows,
  onPricingChange,
  services,
  onServicesChange,
}: PinsEditorProps) {
  const [reviewCat, setReviewCat] = useState<CatalogItem[]>([]);
  const [pricingCat, setPricingCat] = useState<CatalogItem[]>([]);
  const [serviceCat, setServiceCat] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const [r, p, s] = await Promise.all([fetchCatalog("reviews"), fetchCatalog("pricing"), fetchCatalog("services")]);
      if (!active) return;
      setReviewCat(r.map(normReview));
      setPricingCat(p.map(normPricing));
      setServiceCat(s.map(normService));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  /** Append a created row to a catalog list (dedupe by id) so its label renders on the pinned row. */
  const foldInto =
    (setter: React.Dispatch<React.SetStateAction<CatalogItem[]>>) => (item: CatalogItem) =>
      setter((list) => (list.some((c) => c.id === item.id) ? list : [...list, item]));

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Relational pins attached to this page. Add/remove/reorder here; they save with the page.
      </p>

      <PinSection
        title="Review pins"
        emptyHint="No reviews pinned. Add ones from the global pool to feature on this page."
        catalog={reviewCat}
        loading={loading}
        pins={reviews.map((r) => ({ id: r.reviewId }))}
        onChange={(np) => onReviewsChange(np.map((p, i) => ({ reviewId: p.id, sortOrder: i })))}
        create={{
          type: "reviews",
          createLabel: "Create new review",
          createFields: [
            { name: "customerName", label: "Customer name", placeholder: "Jane D.", required: true },
            { name: "rating", label: "Rating (1–5)", placeholder: "5", required: true },
            { name: "text", label: "Review text", placeholder: "Great service…", multiline: true, required: true },
            { name: "suburb", label: "Suburb", placeholder: "Joondalup" },
            { name: "service", label: "Service", placeholder: "Repairs" },
          ],
          normalize: normReview,
        }}
        onCreated={foldInto(setReviewCat)}
      />

      <PinSection
        title="Pricing rows"
        emptyHint="No pricing rows. Add centralized pricing items (with an optional per-page note)."
        catalog={pricingCat}
        loading={loading}
        hasNote
        pins={pricingRows.map((r) => ({ id: r.pricingItemId, note: r.noteOverride ?? "" }))}
        onChange={(np) =>
          onPricingChange(np.map((p, i) => ({ pricingItemId: p.id, sortOrder: i, noteOverride: p.note ? p.note : null })))
        }
        create={{
          type: "pricing",
          createLabel: "Create new pricing item",
          createFields: [
            { name: "scenario", label: "Scenario", placeholder: "Spring replacement", required: true },
            { name: "priceLabel", label: "Price label", placeholder: "From $250" },
            { name: "priceMin", label: "Price min", placeholder: "250" },
            { name: "priceMax", label: "Price max", placeholder: "450" },
            { name: "category", label: "Category", placeholder: "Repairs" },
          ],
          normalize: normPricing,
        }}
        onCreated={foldInto(setPricingCat)}
      />

      <PinSection
        title="Service links"
        emptyHint="No service pins. Link catalog services (e.g. ProblemPage related services)."
        catalog={serviceCat}
        loading={loading}
        pins={services.map((r) => ({ id: r.serviceId }))}
        onChange={(np) => onServicesChange(np.map((p, i) => ({ serviceId: p.id, sortOrder: i })))}
        create={{
          type: "services",
          createLabel: "Create new service",
          createFields: [
            { name: "name", label: "Name", placeholder: "Garage Door Repairs", required: true },
            { name: "slug", label: "Slug", placeholder: "garage-door-repairs", required: true },
            { name: "shortDescription", label: "Short description", placeholder: "Fast, reliable repairs…", multiline: true, required: true },
            { name: "iconName", label: "Icon name", placeholder: "Wrench" },
          ],
          normalize: normService,
        }}
        onCreated={foldInto(setServiceCat)}
      />
    </div>
  );
}
