import type { ReactNode } from "react";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";

/**
 * Minimal chrome for paid landing pages. The global header/footer/intro are
 * suppressed on /lp/* by <SiteChrome> in the root layout, so this layout
 * supplies a focused header, slim footer and the shared sticky mobile CTA.
 */
export default function LandingRouteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
      <StickyMobileCta />
    </>
  );
}
