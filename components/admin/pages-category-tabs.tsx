import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PageTypeCount } from "@/lib/cms/admin";
import { TEMPLATE_TYPES, pagesHref, type PagesFilters } from "./pages-list";

/**
 * Category chip row for the pages list (server component). One chip per TemplateType plus an "All"
 * chip; each is a link that sets `?type=` (preserving the other filters, resetting the page). When
 * `showCounts` is true each chip shows its count from the counts payload.
 */
export function PagesCategoryTabs({
  current,
  total,
  byType,
  showCounts,
}: {
  current: PagesFilters;
  total: number;
  byType: PageTypeCount[];
  showCounts: boolean;
}) {
  const counts = new Map(byType.map((b) => [b.templateType, b.count]));

  const chips: { value?: string; label: string; count: number }[] = [
    { value: undefined, label: "All", count: total },
    ...TEMPLATE_TYPES.map((t) => ({ value: t.value, label: t.label, count: counts.get(t.value) ?? 0 })),
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => {
        const active = (current.type ?? undefined) === chip.value;
        return (
          <Link
            key={chip.label}
            href={pagesHref(current, { type: chip.value })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {chip.label}
            {showCounts && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {chip.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
