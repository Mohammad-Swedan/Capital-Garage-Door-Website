"use client";

import { useEffect, useState } from "react";
import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";

/**
 * Loads the public pricing catalog from the same-origin /api/pricing proxy and module-caches it, so
 * however many calculator instances mount (page, dialog, in-chat overlay) the network is hit at most
 * once per page load. Always resolves to an array — [] when the CMS is unreachable, in which case the
 * estimate engine simply uses its built-in defaults.
 */

let cache: CmsPublicPricingItem[] | null = null;
let inflight: Promise<CmsPublicPricingItem[]> | null = null;

function loadCatalog(): Promise<CmsPublicPricingItem[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch("/api/pricing")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: unknown }) => {
        cache = Array.isArray(data?.items) ? (data.items as CmsPublicPricingItem[]) : [];
        return cache;
      })
      .catch(() => {
        cache = [];
        return cache;
      });
  }
  return inflight;
}

export function usePricingCatalog(): CmsPublicPricingItem[] {
  // Initialised straight from the module cache, so a later-mounting instance needs no effect at all.
  const [catalog, setCatalog] = useState<CmsPublicPricingItem[]>(cache ?? []);

  useEffect(() => {
    if (cache) return; // already have it (and state was seeded from it)
    let active = true;
    loadCatalog().then((items) => {
      if (active) setCatalog(items); // async resolution, not a synchronous effect setState
    });
    return () => {
      active = false;
    };
  }, []);

  return catalog;
}
