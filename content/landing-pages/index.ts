import type { LandingPage } from "@/types/landing-page";
import { emergencyGarageDoorRepair } from "./emergency-garage-door-repair";
import { garageDoorMotorReplacement } from "./garage-door-motor-replacement";
import { garageDoorRepairsPerth } from "./garage-door-repairs-perth";

/** All Google Ads / paid landing pages served at /lp/[slug]. */
export const landingPages: LandingPage[] = [
  emergencyGarageDoorRepair,
  garageDoorMotorReplacement,
  garageDoorRepairsPerth,
];
