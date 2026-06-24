import type { ServicePage } from "@/types/service-page";
import { garageDoorRepairsPerth } from "@/content/service-pages/garage-door-repairs-perth";

/**
 * Registry of flat service landing pages (e.g. /garage-door-repairs-perth).
 * Add a new entry file + push it here to ship another service page —
 * no routing or component changes required.
 */
export const servicePages: ServicePage[] = [garageDoorRepairsPerth];
