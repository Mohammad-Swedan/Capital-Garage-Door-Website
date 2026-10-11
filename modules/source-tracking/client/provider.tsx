"use client";

/**
 * Mount once in the root layout, in every environment. Renders nothing.
 *
 * The route tracker uses useSearchParams, so it sits in its own <Suspense>:
 * without it, every statically prerendered page would fail `next build`
 * ("Missing Suspense boundary with useSearchParams"). Inside the boundary it is
 * client-rendered only, which is all a null-rendering tracker needs.
 */
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { sourceTrackingConfig as config } from "@/config/source-tracking";
import { installDelegatedClicks } from "./delegated-clicks";
import { initSession } from "./session";
import { reportWebVital, trackRoute } from "./tracker";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.toString() : "";

  useEffect(() => {
    trackRoute(pathname ?? "/", search);
  }, [pathname, search]);

  return null;
}

function VitalsReporter() {
  useReportWebVitals(reportWebVital);
  return null;
}

function ClickTracker() {
  useEffect(() => {
    // Snapshot the landing URL before anything (a client navigation) can rewrite it.
    try {
      initSession();
    } catch {
      // Tracking must never break hydration.
    }
    return installDelegatedClicks();
  }, []);
  return null;
}

export function SourceTrackingProvider() {
  if (!config.enabled) return null;
  return (
    <>
      <ClickTracker />
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
      <VitalsReporter />
    </>
  );
}
