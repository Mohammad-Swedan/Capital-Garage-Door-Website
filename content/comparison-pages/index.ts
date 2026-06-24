import type { ComparisonPage } from "@/types/comparison-page";
import { rollerDoorVsSectionalDoor } from "@/content/comparison-pages/roller-door-vs-sectional-door";

/**
 * Registry of flat comparison/guide pages (e.g. /roller-door-vs-sectional-door).
 * Add a new entry file + push it here to ship another comparison page — no
 * routing or component changes required.
 */
export const comparisonPages: ComparisonPage[] = [rollerDoorVsSectionalDoor];
