import type { ServicePage } from "@/types/service-page";
import { garageDoorRepairsPerth } from "@/content/service-pages/garage-door-repairs-perth";
import { rollerDoorInstallationPerth } from "@/content/service-pages/roller-door-installation-perth";
import { sectionalGarageDoorsPerth } from "@/content/service-pages/sectional-garage-doors-perth";
import { rollerDoorsPerth } from "@/content/service-pages/roller-doors-perth";
import { tiltGarageDoorsPerth } from "@/content/service-pages/tilt-garage-doors-perth";
import { customGarageDoorsPerth } from "@/content/service-pages/custom-garage-doors-perth";
import { commercialRollerDoorsPerth } from "@/content/service-pages/commercial-roller-doors-perth";

/**
 * Registry of flat service landing pages (e.g. /garage-door-repairs-perth).
 * Add a new entry file + push it here to ship another service page —
 * no routing or component changes required.
 */
export const servicePages: ServicePage[] = [
  garageDoorRepairsPerth,
  rollerDoorInstallationPerth,
  sectionalGarageDoorsPerth,
  rollerDoorsPerth,
  tiltGarageDoorsPerth,
  customGarageDoorsPerth,
  commercialRollerDoorsPerth,
];
