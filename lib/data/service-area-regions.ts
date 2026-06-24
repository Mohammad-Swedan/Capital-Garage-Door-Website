import { serviceAreaRegions } from "@/content/service-area-regions";
import type { CoverageRegion } from "@/types/coverage-area";

/**
 * Data-access layer for the /service-areas suburb directory. Reads from
 * local content now; swap the implementation for a CMS/API call later
 * without changing call sites.
 */
export async function getServiceAreaRegions(): Promise<CoverageRegion[]> {
  return serviceAreaRegions;
}
