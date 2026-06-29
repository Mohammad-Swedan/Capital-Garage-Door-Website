import { serviceAreaRegions } from "@/content/service-area-regions";
import type { CoverageRegion } from "@/types/coverage-area";
import { cmsServiceAreaRegions, type CmsServiceAreaRegionDto } from "@/lib/cms/client";

/**
 * Data-access layer for the /service-areas suburb directory, grouped by region.
 *
 * When `CMS_CATALOGS === "on"` this reads the public `GET /api/service-area-regions` catalog (regions
 * with their suburbs) from the ASP.NET CMS and maps it to the `CoverageRegion[]` shape the page
 * consumes; otherwise it falls back to the local `content/service-area-regions` module. Mirrors the
 * per-page-type cutover seam (lib/data/service-pages.ts).
 */
const CMS_ON = process.env.CMS_CATALOGS === "on";

/** Kebab-case fallback slug from a suburb name, for the (rare) suburb with no stored slug. */
function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Map a CMS region DTO to the front `CoverageRegion` shape. The coverage component only needs each
 * suburb's `name` + `slug` (slug is the React key and the future per-suburb link), so we keep those
 * and guarantee a non-empty slug. `pageHref` is available on the DTO for a future linked-chip
 * enhancement but the current component renders plain chips.
 */
function mapRegion(dto: CmsServiceAreaRegionDto): CoverageRegion {
  return {
    name: dto.name,
    suburbs: dto.suburbs.map((s) => ({
      name: s.name,
      slug: s.slug ?? slugify(s.name),
      // `pageHref` is present only when the suburb is linked to a published page in the CMS —
      // when set, the directory renders the chip as a link to that suburb's local-SEO page.
      ...(s.pageHref ? { href: s.pageHref } : {}),
    })),
  };
}

export async function getServiceAreaRegions(): Promise<CoverageRegion[]> {
  if (CMS_ON) {
    const dtos = await cmsServiceAreaRegions();
    // Empty CMS catalog (or a transient fetch failure) falls back to content so the page never goes blank.
    if (dtos.length > 0) return dtos.map(mapRegion);
  }
  return serviceAreaRegions;
}
