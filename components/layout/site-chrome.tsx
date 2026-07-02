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
      {/* Skip link — first focusable element; lets keyboard/screen-reader users
          jump past the header straight to the page content (WCAG 2.4.1). */}
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <GarageDoorLoader />
      <SmoothScrollProvider />
      <ScrollProgress />
      {header}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      {footer}
    </>
  );
}
