import type { CostGuidePage } from "@/types/cost-guide";
import { garageDoorRepairCostPerth } from "@/content/cost-guides/garage-door-repair-cost-perth";

/**
 * Registry of flat cost-guide landing pages (e.g.
 * /garage-door-repair-cost-perth). Add a new entry file + push it here to
 * ship another cost-guide page — no routing or component changes required.
 */
export const costGuidePages: CostGuidePage[] = [garageDoorRepairCostPerth];
