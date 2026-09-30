import type { StaticCostGuideSource } from "@/types/cost-guide";
import { garageDoorInstallationCostPerth } from "@/content/static-cost-guides/garage-door-installation-cost-perth";

/**
 * Registry of repo-only cost guides. Each one has its own static route (app/<slug>/page.tsx),
 * reads through lib/data/static-cost-guides.ts, and takes its prices from the live catalog.
 *
 * NEVER add these to content/cost-guides/index.ts: with CMS_COST_GUIDES=off that registry feeds
 * app/[slug]'s generateStaticParams, which would then collide with the static route. Their slugs
 * are reserved in the CMS too: a CMS page published under one would be shadowed by the route.
 */
export const staticCostGuides: StaticCostGuideSource[] = [garageDoorInstallationCostPerth];
