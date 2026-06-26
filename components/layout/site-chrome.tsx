"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { GarageDoorLoader } from "@/components/motion/garage-door-loader";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";

interface SiteChromeProps {
  /** Server-rendered global header (passed in so it stays a server component). */
  header: ReactNode;
  /** Server-rendered global footer. */
  footer: ReactNode;
  children: ReactNode;
}

/**
 * Decides which page chrome to render based on the route.
 *
 * Paid landing pages (/lp/*) are conversion-first: they skip the global header,
 * footer, welcome intro and smooth-scroll, and supply their own minimal chrome
 * from app/lp/layout.tsx. Every other route keeps the full site chrome exactly
 * as before. `LazyMotionProvider` stays above this in the root layout so the
 * sticky mobile CTA's framer-motion still works on /lp too.
 */
export function SiteChrome({ header, footer, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isLanding = pathname?.startsWith("/lp");
  // The CMS admin (/admin) is an internal tool — no marketing header/footer/intro/smooth-scroll.
  const isAdmin = pathname?.startsWith("/admin");

  if (isLanding || isAdmin) {
    // /lp and /admin provide their own chrome from their own layouts.
    return <>{children}</>;
  }

  return (
    <>
      <GarageDoorLoader />
      <SmoothScrollProvider />
      <ScrollProgress />
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
