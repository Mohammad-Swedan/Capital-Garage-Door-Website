import { ChevronDown, List } from "lucide-react";
import type { TocItem } from "@/types/article";

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Table of contents for long-form articles. Pure HTML/CSS — no client JS:
 * a sticky `<aside>` on desktop, a collapsible `<details>` on mobile. Real
 * anchor links so it works without JavaScript and is fully crawlable.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  const links = (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="group flex items-start gap-2.5 text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            <span className="mt-0.5 text-xs font-bold text-brand/50 group-hover:text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <nav aria-label="Table of contents" className="sticky top-24 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card">
          <p className="flex items-center gap-2 cgd-eyebrow text-foreground">
            <List className="h-4 w-4 text-brand" aria-hidden="true" />
            On this page
          </p>
          <div className="mt-4">{links}</div>
        </nav>
      </aside>

      {/* Mobile/tablet: collapsible */}
      <details className="group rounded-2xl border border-border/70 bg-surface-elevated elevate-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 cgd-eyebrow text-foreground">
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <nav aria-label="Table of contents" className="px-4 pb-4">
          {links}
        </nav>
      </details>
    </>
  );
}
