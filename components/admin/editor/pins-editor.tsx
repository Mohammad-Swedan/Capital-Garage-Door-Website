"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * In-place Settings-drawer pin pickers (plan §B.3g/B.6). Manages the page's relational pins —
 * review pins, pricing rows, service links — that the backend replaces wholesale on save.
 * Catalog options are fetched via the server proxy /admin/api/pins (the admin endpoints need the
 * httpOnly JWT). Each section emits the exact payload shape the serializer/backend expect.
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

const inputClass =
  "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

async function fetchCatalog(type: "reviews" | "pricing" | "services"): Promise<unknown[]> {
  try {
    const res = await fetch(`/admin/api/pins?type=${type}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Normalized pin row used inside a section: a catalog id + optional note. */
interface NormPin {
  id: number;
  note?: string;
}

function PinSection({
  title,
  emptyHint,
  catalog,
  loading,
  pins,
  hasNote,
  onChange,
}: {
  title: string;
  emptyHint: string;
  catalog: CatalogItem[];
  loading: boolean;
  pins: NormPin[];
  hasNote?: boolean;
  onChange: (pins: NormPin[]) => void;
}) {
  const [toAdd, setToAdd] = useState<string>("");
  const byId = new Map(catalog.map((c) => [c.id, c]));
  const available = catalog.filter((c) => !pins.some((p) => p.id === c.id));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= pins.length) return;
    const next = [...pins];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(pins.filter((_, idx) => idx !== i));
  const add = () => {
    const id = Number(toAdd);
    if (!id || pins.some((p) => p.id === id)) return;
    onChange([...pins, hasNote ? { id, note: "" } : { id }]);
    setToAdd("");
  };
  const setNote = (i: number, note: string) =>
    onChange(pins.map((p, idx) => (idx === i ? { ...p, note } : p)));

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

      <div className="flex items-center gap-2 pt-1">
        <select className={inputClass} value={toAdd} onChange={(e) => setToAdd(e.target.value)} disabled={loading}>
          <option value="">{loading ? "Loading…" : available.length ? "Add…" : "Nothing left to add"}</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
              {c.sub ? ` — ${c.sub}` : ""}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" variant="outline" disabled={!toAdd} onClick={add}>
          <Plus className="size-4" /> Add
        </Button>
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
      setReviewCat(
        r.map((x: any) => ({
          id: x.id,
          label: x.customerName ?? `Review #${x.id}`,
          sub: [x.rating ? `${x.rating}★` : "", (x.text ?? "").slice(0, 40)].filter(Boolean).join(" "),
        })),
      );
      setPricingCat(p.map((x: any) => ({ id: x.id, label: x.scenario ?? `Item #${x.id}`, sub: x.priceLabel ?? "" })));
      setServiceCat(s.map((x: any) => ({ id: x.id, label: x.name ?? `Service #${x.id}`, sub: x.slug ?? "" })));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

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
      />

      <PinSection
        title="Service links"
        emptyHint="No service pins. Link catalog services (e.g. ProblemPage related services)."
        catalog={serviceCat}
        loading={loading}
        pins={services.map((r) => ({ id: r.serviceId }))}
        onChange={(np) => onServicesChange(np.map((p, i) => ({ serviceId: p.id, sortOrder: i })))}
      />
    </div>
  );
}
