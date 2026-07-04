/**
 * Single source of truth for the Capital motor range shown on
 * /garage-door-motors-perth — models, specs, price and CDN imagery.
 * The page, its sections, and the Product JSON-LD all read from here.
 *
 * Price mirrors the `motor-replace` scenario in
 * components/sections/smart-calculator/pricing-data.ts ($770–$990 supplied &
 * installed) — keep the two in sync if the range changes.
 */

const MOTOR_CDN = "https://jadara-hub.b-cdn.net/capital-garage-door/motors";

export interface MotorImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const MOTOR_IMAGES = {
  heroDark: {
    src: `${MOTOR_CDN}/capital-garage-door-motor-hero-dark.png`,
    width: 2390,
    height: 1792,
    alt: "Capital garage door motor with glowing LED light strip — dark studio shot",
  },
  studio: {
    src: `${MOTOR_CDN}/capital-garage-door-motor-studio.png`,
    width: 2390,
    height: 1792,
    alt: "Capital garage door motor head unit with belt rail — white studio shot",
  },
  howItWorks: {
    src: `${MOTOR_CDN}/capital-garage-door-motor-how-it-works.png`,
    width: 2390,
    height: 1792,
    alt: "Cutaway diagram of a Capital garage door motor lifting a sectional door: drive unit, belt rail, trolley and lift arm",
  },
  accessoriesKit: {
    src: `${MOTOR_CDN}/capital-garage-door-motor-accessories-kit.png`,
    width: 1024,
    height: 768,
    alt: "Capital garage door motor kit laid out: motor head, remotes, wall control, rail sections, brackets, fixings and smartphone app",
  },
  installedGarage: {
    src: `${MOTOR_CDN}/capital-garage-door-motor-installed-garage.png`,
    width: 2390,
    height: 1792,
    alt: "Capital garage door motor installed on a sectional door in a modern Perth garage",
  },
} satisfies Record<string, MotorImage>;

export const MOTOR_OG_IMAGE = `${MOTOR_CDN}/capital-garage-door-motors-og-1200x630.jpg`;

/** Supplied-and-installed range — mirrors pricing-data.ts `motor-replace`. */
export const MOTOR_PRICE = { min: 770, max: 990 } as const;

export interface MotorModel {
  id: "1100n" | "1500n";
  name: string;
  sku: string;
  /** Rated lifting force in newtons. */
  force: number;
  tagline: string;
  bestFor: string;
  doorFit: string;
  /** Short description reused by the Product JSON-LD. */
  description: string;
}

export const MOTOR_MODELS: MotorModel[] = [
  {
    id: "1100n",
    name: "Capital 1100N",
    sku: "CGD-M1100",
    force: 1100,
    tagline: "The everyday workhorse for standard Perth doors.",
    bestFor: "Single and standard double sectional doors",
    doorFit: "Most uninsulated sectional doors up to ~16 m²",
    description:
      "Belt-drive garage door motor with 1100 N of lifting force, soft start and stop, WiFi app control, built-in LED lighting and auto-reverse safety sensors. Supplied and installed in Perth with a 5-year warranty, extendable to 7 years.",
  },
  {
    id: "1500n",
    name: "Capital 1500N",
    sku: "CGD-M1500",
    force: 1500,
    tagline: "Extra pulling power for big, heavy or insulated doors.",
    bestFor: "Large double, insulated and heavier timber-look doors",
    doorFit: "Oversize or insulated sectional doors where extra torque matters",
    description:
      "High-torque belt-drive garage door motor with 1500 N of lifting force for large, insulated or heavy sectional doors. Soft start and stop, WiFi app control, built-in LED lighting and auto-reverse safety. Supplied and installed in Perth with a 5-year warranty, extendable to 7 years.",
  },
];

/** Specs shared by both models — rendered under the per-model rows. */
export const SHARED_SPECS: { label: string; value: string }[] = [
  { label: "Drive", value: "Reinforced belt rail — whisper-quiet" },
  { label: "Start & stop", value: "Soft start / soft stop on every cycle" },
  { label: "Lighting", value: "Built-in LED strip, lights up as the door moves" },
  { label: "Connectivity", value: "WiFi smartphone app control" },
  { label: "Backup power", value: "Battery backup option — opens in a blackout" },
  { label: "Safety", value: "Auto-reverse safety sensors included" },
  { label: "In the box", value: "2× remotes, wall control, rail kit & fixings" },
  { label: "Warranty", value: "5 years standard — 7 with annual servicing" },
];

export const MOTORS_PATH = "/garage-door-motors-perth";
