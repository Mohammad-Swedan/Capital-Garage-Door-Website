import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FaqCategories } from "@/lib/cms/admin";
import { faqsHref, UNCATEGORIZED, type FaqsFilters } from "./faqs-list";

/**
 * Dynamic category chip row for the FAQ library (server component). Categories come from the data (free
 * text), so chips are built from the counts payload: All (total) + each category + Uncategorized, each a
 * link that sets `?category=` (preserving search, resetting the page). Hidden entirely when counts aren't
 * available (e.g. older API) so the page still works.
 */
export function FaqsCategoryTabs({
  current,
  counts,
}: {
  current: FaqsFilters;
  counts: FaqCategories | undefined;
}) {
  if (!counts) return null;

  const chips: { value?: string; label: string; count: number }[] = [
    { value: undefined, label: "All", count: counts.total },
    ...counts.categories.map((c) => ({ value: c.category, label: c.category, count: c.count })),
  ];
  if (counts.uncategorized > 0) {
    chips.push({ value: UNCATEGORIZED, label: "Uncategorized", count: counts.uncategorized });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => {
        const active = (current.category ?? undefined) === chip.value;
        return (
          <Link
            key={chip.label}
            href={faqsHref(current, { category: chip.value })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {chip.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {chip.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
