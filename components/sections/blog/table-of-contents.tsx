"use client";

import { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/types/article";

interface TableOfContentsProps {
  items: TocItem[];
  /**
   * `rail` — sticky sidebar that lives in the left margin on wide screens.
   * `inline` — collapsible `<details>` shown above the article on smaller screens.
   */
  variant?: "rail" | "inline";
}

/**
 * Table of contents for long-form articles. The anchor list is real,
 * server-rendered HTML — crawlable and fully functional with JavaScript
 * disabled. A small client scroll-spy layers an "active section" highlight on
 * top (progressive enhancement only, so SEO / no-JS behaviour is unchanged).
 * The observer runs for the `rail` variant only — the `inline` one is collapsed.
 */
export function TableOfContents({ items, variant = "rail" }: TableOfContentsProps) {
  const activeId = useActiveHeading(variant === "rail" ? items : []);

  if (items.length === 0) return null;

  const list = (
    <ol className="space-y-0.5">
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active ? "location" : undefined}
              className={cn(
                "group flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-primary/5 text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "mt-px text-xs font-bold tabular-nums transition-colors",
                  active ? "text-primary" : "text-primary/40 group-hover:text-primary",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={cn("leading-snug", active && "font-semibold")}>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "inline") {
    return (
      <details className="group rounded-2xl border border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-heading text-sm font-bold tracking-wide text-foreground uppercase">
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </span>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <nav aria-label="Table of contents" className="px-2 pb-3">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-border bg-card/70 p-4">
      <p className="flex items-center gap-2 px-2.5 pb-2.5 font-heading text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
        <List className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        On this page
      </p>
      {list}
    </nav>
  );
}

/**
 * Highlights the heading currently being read. Uses an IntersectionObserver
 * tuned to a reading line near the top of the viewport; falls back to the last
 * heading scrolled past when nothing is in the band. No-ops with an empty list.
 */
function useActiveHeading(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ids = items.map((item) => item.id).join("|");

  useEffect(() => {
    if (!ids) return;

    const headings = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const visible = new Set<string>();

    const pickActive = () => {
      // First heading currently inside the reading band, in document order.
      const inBand = headings.find((h) => visible.has(h.id));
      if (inBand) {
        setActiveId(inBand.id);
        return;
      }
      // None in band: highlight the last heading we've scrolled past.
      let lastAbove: string | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top < 120) lastAbove = h.id;
        else break;
      }
      if (lastAbove) setActiveId(lastAbove);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pickActive();
      },
      // Reading band: from 100px below the top down to the upper third.
      { rootMargin: "-100px 0px -66% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
