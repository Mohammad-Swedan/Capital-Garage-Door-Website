"use client";

import type { MouseEvent } from "react";
import { scrollToElement } from "@/lib/smooth-scroll";

export interface PriceListJumpNavItem {
  id: string;
  label: string;
}

interface PriceListJumpNavProps {
  items: PriceListJumpNavItem[];
}

/**
 * Jump links to the price-list sections. They are real `<a href="#id">` links, so they are
 * crawlable and work without JavaScript; with it, the click is routed through `scrollToElement`,
 * because Lenis (desktop smooth scroll) cancels the browser's native hash jump. The targets carry
 * `scroll-mt-24`, which clears the sticky header on the native path.
 */
export function PriceListJumpNav({ items }: PriceListJumpNavProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Leave modified clicks (new tab / window) to the browser.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Price list sections">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => handleClick(event, item.id)}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-cta/40 hover:text-cta"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
