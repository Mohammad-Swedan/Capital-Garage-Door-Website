"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { GalleryCard } from "@/components/sections/gallery/gallery-card";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryItem } from "@/types/gallery";

const PAGE_SIZE = 12;

// Canonical category order (matches the GalleryCategory union). Only categories present in the
// data are shown as pills, so the filter bar never offers an empty bucket.
const CATEGORY_ORDER: readonly GalleryCategory[] = [
  "Repairs",
  "Installations",
  "Motors",
  "Roller Doors",
  "Commercial",
  "Before & After",
];

type CategoryFilter = "All" | GalleryCategory;

interface GalleryFilterGridProps {
  items: GalleryItem[];
}

/**
 * The public gallery: filter by category + type (free-text service) + suburb, then paginate. Filters
 * combine with AND and all option lists/counts are derived from the items themselves, so the gallery
 * is a self-describing showcase (distinct from the reusable media library it draws images from). The
 * "All" defaults mean the first page renders server-side; the controls are progressive enhancement.
 */
export function GalleryFilterGrid({ items }: GalleryFilterGridProps) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [type, setType] = useState(""); // "" = all types
  const [suburb, setSuburb] = useState(""); // "" = all suburbs
  const [page, setPage] = useState(1);

  // Stable option lists derived once from the full dataset.
  const categoryOptions = useMemo(
    () => CATEGORY_ORDER.filter((c) => items.some((it) => it.category === c)),
    [items],
  );
  const typeOptions = useMemo(
    () => Array.from(new Set(items.map((it) => it.service).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const suburbOptions = useMemo(
    () => Array.from(new Set(items.map((it) => it.suburb).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (category === "All" || it.category === category) &&
          (type === "" || it.service === type) &&
          (suburb === "" || it.suburb === suburb),
      ),
    [items, category, type, suburb],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasFilters = category !== "All" || type !== "" || suburb !== "";

  // How many items a hypothetical selection would yield, respecting the other two active dimensions.
  const countMatching = (over: { category?: CategoryFilter; type?: string; suburb?: string }) => {
    const c = over.category ?? category;
    const t = over.type ?? type;
    const s = over.suburb ?? suburb;
    return items.filter(
      (it) =>
        (c === "All" || it.category === c) && (t === "" || it.service === t) && (s === "" || it.suburb === s),
    ).length;
  };

  // Any filter change resets to page 1 (event-handler setState — not an effect).
  const onCategory = (v: CategoryFilter) => {
    setCategory(v);
    setPage(1);
  };
  const onType = (v: string) => {
    setType(v);
    setPage(1);
  };
  const onSuburb = (v: string) => {
    setSuburb(v);
    setPage(1);
  };
  const clearAll = () => {
    setCategory("All");
    setType("");
    setSuburb("");
    setPage(1);
  };

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Recent Work</h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 space-y-4">
          {/* Category */}
          <FilterRow label="Category">
            <Pill active={category === "All"} onClick={() => onCategory("All")} count={countMatching({ category: "All" })}>
              All
            </Pill>
            {categoryOptions.map((c) => (
              <Pill key={c} active={category === c} onClick={() => onCategory(c)} count={countMatching({ category: c })}>
                {c}
              </Pill>
            ))}
          </FilterRow>

          {/* Type (free-text service) */}
          {typeOptions.length > 0 && (
            <FilterRow label="Type">
              <Pill active={type === ""} onClick={() => onType("")} count={countMatching({ type: "" })}>
                All types
              </Pill>
              {typeOptions.map((t) => (
                <Pill key={t} active={type === t} onClick={() => onType(t)} count={countMatching({ type: t })}>
                  {t}
                </Pill>
              ))}
            </FilterRow>
          )}

          {/* Suburb + clear */}
          <div className="flex flex-wrap items-center gap-3">
            {suburbOptions.length > 0 && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Suburb</span>
                <select
                  value={suburb}
                  onChange={(e) => onSuburb(e.target.value)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:border-[#0f4e9b]/25 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">All suburbs</option>
                  {suburbOptions.map((s) => (
                    <option key={s} value={s}>
                      {s} ({countMatching({ suburb: s })})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        </Reveal>

        {/* Result summary */}
        <p className="mt-6 text-sm text-muted-foreground">
          {filtered.length === 0
            ? "No jobs match these filters yet."
            : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} ${filtered.length === 1 ? "job" : "jobs"}`}
        </p>

        {pageItems.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05} className="h-full">
                <GalleryCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Try a different filter — or{" "}
            <button
              type="button"
              onClick={clearAll}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              show all work
            </button>
            .
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition-colors enabled:hover:border-[#0f4e9b]/25 enabled:hover:text-[#0f4e9b] disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition-colors enabled:hover:border-[#0f4e9b]/25 enabled:hover:text-[#0f4e9b] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-[#0f4e9b]/35 bg-[#0f4e9b]/10 text-[#0f4e9b]"
          : "border-border bg-card text-muted-foreground hover:border-[#0f4e9b]/25 hover:text-[#0f4e9b]",
      )}
    >
      {children}
      {typeof count === "number" && <span className="ml-1.5 tabular-nums opacity-60">{count}</span>}
    </button>
  );
}
