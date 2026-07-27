"use client";

import { useEffect } from "react";

/**
 * Google Analytics (gtag.js), loaded on `requestIdleCallback` instead of
 * `afterInteractive`.
 *
 * The googletagmanager.com script was the site's #1 unused-JS contributor
 * (~70 KB) and drove 12 long tasks on throttled mobile (audit findings). The
 * dataLayer + `config` command are queued synchronously here, so the pageview
 * is still recorded when the script arrives a moment later — nothing is lost,
 * it just stops competing with hydration and the LCP.
 */
export function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    if (!gaId || document.getElementById("cgd-gtag")) return;

    // Queue the init immediately — gtag.js drains window.dataLayer on load.
    // gtag commands MUST be pushed as `arguments` objects (plain arrays are
    // ignored by gtag.js), hence the classic function + `arguments` pattern.
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    function gtag(..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", gaId);

    const load = () => {
      if (document.getElementById("cgd-gtag")) return;
      const script = document.createElement("script");
      script.id = "cgd-gtag";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);
    };

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(load, { timeout: 5000 });
    } else {
      window.setTimeout(load, 2500);
    }
  }, [gaId]);

  return null;
}

/**
 * Microsoft Clarity (session recordings + heatmaps), loaded on
 * `requestIdleCallback` for the same reason as gtag above — Clarity's tag is
 * heavier than GA and would otherwise compete with hydration and the LCP on a
 * perf-sensitive site.
 *
 * Clarity's own snippet installs a `window.clarity` command queue synchronously
 * (mirroring gtag's dataLayer) and drains it when the tag arrives, so deferring
 * the network load loses nothing functional — the recording just begins a moment
 * later, once the main thread is idle. Any early `clarity("set", …)` calls are
 * still captured because they land on the queue first.
 */
export function DeferredMicrosoftClarity({ clarityId }: { clarityId: string }) {
  useEffect(() => {
    if (!clarityId || document.getElementById("cgd-clarity")) return;

    // Install the command-queue stub immediately (Clarity's canonical shim).
    const w = window as Window & { clarity?: { q?: unknown[] } & ((...args: unknown[]) => void) };
    if (!w.clarity) {
      const clarity = function (...args: unknown[]) {
        (clarity.q = clarity.q || []).push(args);
      } as { q?: unknown[] } & ((...args: unknown[]) => void);
      w.clarity = clarity;
    }

    const load = () => {
      if (document.getElementById("cgd-clarity")) return;
      const script = document.createElement("script");
      script.id = "cgd-clarity";
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
      document.head.appendChild(script);
    };

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(load, { timeout: 5000 });
    } else {
      window.setTimeout(load, 2500);
    }
  }, [clarityId]);

  return null;
}
