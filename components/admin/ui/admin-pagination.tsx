import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable, link-based pagination for admin lists (server component). The caller supplies `makeHref`
 * so the page links preserve whatever filters that list uses. Renders "Page X of Y · N total" plus
 * Prev/Next and a compact window of numbered pages.
 */
export function AdminPagination({
  pageNumber,
  totalPages,
  totalCount,
  makeHref,
}: {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return (
      <p className="px-1 text-xs text-muted-foreground">
        {totalCount} {totalCount === 1 ? "page" : "pages"}
      </p>
    );
  }

  const current = Math.min(Math.max(pageNumber, 1), totalPages);
  const window = pageWindow(current, totalPages);

  return (
    <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Pagination">
      <p className="px-1 text-xs text-muted-foreground">
        Page {current} of {totalPages} · {totalCount} total
      </p>
      <div className="flex items-center gap-1">
        <PageLink href={makeHref(current - 1)} disabled={current <= 1} ariaLabel="Previous page">
          <ChevronLeft className="size-4" />
        </PageLink>
        {window.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <PageLink key={p} href={makeHref(p)} active={p === current} ariaLabel={`Page ${p}`}>
              {p}
            </PageLink>
          )
        )}
        <PageLink href={makeHref(current + 1)} disabled={current >= totalPages} ariaLabel="Next page">
          <ChevronRight className="size-4" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  ariaLabel,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const className = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium tabular-nums transition-colors",
    active
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "pointer-events-none opacity-40"
  );

  if (disabled) {
    return (
      <span aria-disabled className={className}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} aria-current={active ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
}

/** Compact page list: first, a window around current, last — with "…" gaps. */
function pageWindow(current: number, total: number): (number | "…")[] {
  const span = 1; // neighbours on each side of current
  const out: (number | "…")[] = [];
  const start = Math.max(2, current - span);
  const end = Math.min(total - 1, current + span);

  out.push(1);
  if (start > 2) out.push("…");
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push("…");
  if (total > 1) out.push(total);
  return out;
}
