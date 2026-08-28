"use client";

import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/sections/brands/brand-mark";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import { BRAND_ENTITIES } from "@/content/brands/entities";
import type { NavBrandEntry } from "@/config/nav-menus";

const BRAND_BY_SLUG = new Map(BRAND_ENTITIES.map((entity) => [entity.slug, entity]));

interface MobileBrandChipsProps {
  items: NavBrandEntry[];
  allLabel: string;
  allHref: string;
  onNavigate: () => void;
}

/**
 * Mobile-accordion brand chip grid + "all brands" link. Split out of
 * header.tsx and loaded via `next/dynamic` (`ssr: false`) so the 28-entity
 * BRAND_ENTITIES registry + BrandMark never ship in the header's initial
 * bundle — this chunk loads only once the hamburger overlay is opened and a
 * brand-carrying accordion group is expanded.
 */
export function MobileBrandChips({ items, allLabel, allHref, onNavigate }: MobileBrandChipsProps) {
  return (
    <>
      <ul className="grid grid-cols-2 gap-2">
        {items.map((brand) => {
          const entity = BRAND_BY_SLUG.get(brand.entity);
          if (!entity) return null;
          return (
            <li key={brand.href}>
              <HoverPrefetchLink
                href={brand.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-background/60 p-1.5 transition-colors hover:border-cta/40"
              >
                <BrandMark entity={entity} size="sm" />
                <span className="text-xs font-semibold leading-tight text-foreground">
                  {entity.name}
                </span>
              </HoverPrefetchLink>
            </li>
          );
        })}
      </ul>
      <HoverPrefetchLink
        href={allHref}
        onClick={onNavigate}
        className="mt-2 flex min-h-11 items-center gap-1 text-base font-semibold text-primary transition-colors hover:text-cta"
      >
        {allLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </HoverPrefetchLink>
    </>
  );
}
