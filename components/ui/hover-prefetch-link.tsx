"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/**
 * A `next/link` that only prefetches once the user shows intent (hover /
 * touch), instead of the default prefetch-on-viewport-entry.
 *
 * Built for the header nav: those links are in the viewport on EVERY page
 * load, so default prefetching fired ~968 KB of route payloads (/contact,
 * /service-areas, /blog, …) at load time, competing with the LCP resource on
 * mobile (a Core-Web-Vitals audit's #2 finding). `prefetch={null}` restores
 * the default prefetch behaviour once intent is shown — this is the pattern
 * from Next's own prefetching guide.
 */
export function HoverPrefetchLink({
  onMouseEnter,
  onTouchStart,
  ...props
}: ComponentProps<typeof Link>) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(e) => {
        setActive(true);
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        setActive(true);
        onTouchStart?.(e);
      }}
    />
  );
}
