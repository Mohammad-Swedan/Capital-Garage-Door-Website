import type { BrandEntity } from "@/types/brand";

/**
 * Every garage-door / motor brand seen in Perth — one entity per manufacturer. Drives the nav
 * mega-menus (logos), the two hubs (tiles, facts table, finder) and each brand page's plate.
 *
 * Facts (origin, ownership, founded, productLines) come ONLY from the official site listed in
 * `sources`; `accent` is a design choice. `dealer: true` is allowed ONLY for the eight brands
 * the site already names as authorised dealers (B&D, Steel-Line, Gliderol, Avanti, Superlift,
 * Boss Openers, Perth Windsor Doors, Jaytech) — scripts/check-brand-content.ts enforces it.
 * Filled by the 2026-08 research pass (docs/marketing/brand-research-2026-08/entities/).
 */
export const BRAND_ENTITIES: BrandEntity[] = [];
