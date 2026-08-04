"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
 * The public gallery: filter by category + type (free-text service) + suburb, then reveal the results
 * a batch at a time as the visitor scrolls. Filters combine with AND and all option lists/counts are
 * derived from the items themselves, so the gallery is a self-describing showcase (distinct from the
 * reusable media library it draws images from). The "All" defaults mean the first batch renders
 * server-side; the controls are progressive enhancement.
 */
export function GalleryFilterGrid({ items }: GalleryFilterGridProps) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [type, setType] = useState(""); // "" = all types
  const [suburb, setSuburb] = useState(""); // "" = all suburbs
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const shownCount = Math.min(visibleCount, filtered.length);
  const pageItems = filtered.slice(0, shownCount);
  const hasMore = shownCount < filtered.length;
  const hasFilters = category !== "All" || type !== "" || suburb !== "";

  // Infinite scroll: a sentinel sitting just below the grid loads the next batch while it is still
  // a full screen-and-a-half below the fold (1400px ≈ two card rows), so the next photos are
  // requested and decoded well before the visitor reaches the end of the current ones — they should
  // never see an empty gap. The sentinel is also a real button: if IntersectionObserver never fires
  // (old browser, data-saver, keyboard-only navigation), the rest of the gallery is still reachable.
  // Crawlability is NOT carried by this component — only the first batch is in the server HTML, and
  // Googlebot does not scroll. Every gallery image is listed against /gallery in
  // `app/image-sitemap.xml/route.ts`, which is how Google discovers all of them; keep it that way.
  const sentinelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisibleCount((c) => c + PAGE_SIZE);
      },
      { rootMargin: "1400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // Re-observing on every batch is deliberate: the observer only reports *changes* in
    // intersection, so after the sentinel is pushed down it must be re-checked against the viewport.
  }, [hasMore, shownCount]);

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

  // Any filter change collapses back to the first batch (event-handler setState — not an effect).
  const onCategory = (v: CategoryFilter) => {
    setCategory(v);
    setVisibleCount(PAGE_SIZE);
  };
  const onType = (v: string) => {
    setType(v);
    setVisibleCount(PAGE_SIZE);
  };
  const onSuburb = (v: string) => {
    setSuburb(v);
    setVisibleCount(PAGE_SIZE);
  };
  const clearAll = () => {
    setCategory("All");
    setType("");
    setSuburb("");
    setVisibleCount(PAGE_SIZE);
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
        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length === 0
            ? "No jobs match these filters yet."
            : `Showing ${shownCount} of ${filtered.length} ${filtered.length === 1 ? "job" : "jobs"}`}
        </p>

        {pageItems.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item, index) => (
              // Stagger within each batch only — an absolute index would give the 30th card a
              // 1.5s delay and it would appear to load nothing.
              <Reveal key={item.id} delay={(index % PAGE_SIZE) * 0.05} className="h-full">
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

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              ref={sentinelRef}
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="rounded-full border border-border bg-card px-6 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#0f4e9b]/25 hover:text-[#0f4e9b]"
            >
              Load more work
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
