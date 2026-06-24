import type { CaseStudyPage } from "@/types/case-study";
import { garageDoorMotorReplacementJoondalup } from "@/content/case-studies/garage-door-motor-replacement-joondalup";
import { rollerDoorRepairCanningVale } from "@/content/case-studies/roller-door-repair-canning-vale";
import { sectionalDoorInstallationFremantle } from "@/content/case-studies/sectional-door-installation-fremantle";

/**
 * Registry of case-study pages (e.g. /case-studies/garage-door-motor-replacement-joondalup).
 * Add a new entry file + push it here to publish another completed job —
 * no routing or component changes required. Designed to later be replaced
 * by a CRM job export feeding the same CaseStudyPage shape.
 */
export const caseStudies: CaseStudyPage[] = [
  garageDoorMotorReplacementJoondalup,
  rollerDoorRepairCanningVale,
  sectionalDoorInstallationFremantle,
];
