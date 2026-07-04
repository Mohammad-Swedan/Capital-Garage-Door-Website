import type { ServiceType } from "./estimate-logic";

/**
 * SINGLE SOURCE OF TRUTH for the Smart Price Calculator's Perth pricing.
 *
 * This one file feeds three consumers so nothing drifts:
 *   1. The calculator option lists — `constants.ts` derives `ISSUE_OPTIONS` from `PRICING_SCENARIOS`.
 *   2. The estimate engine — `estimate-logic.ts` looks prices up by stable `id` (no more keyword formula).
 *   3. The CMS import — `scripts/seed-pricing.ts` calls `buildSeedRows()` to (re)populate the backend
 *      `PricingItems` table, which is what the AI assistant (DeepSeek + RAG) quotes from. `internalNote`
 *      maps to the backend's admin-only `InternalNote` (fed to the model, never shown to the public).
 *
 * Prices are the owner's real Perth rates; a few gap-fills use current market ranges (flagged in the
 * internal notes). All figures are indicative guides — the calculator + assistant say so explicitly and
 * always steer to a free, firm on-site quote.
 *
 * Icons are stored as Lucide names (strings) so this stays pure, serialisable data the Node seed script
 * can import without pulling in React; `constants.ts` resolves the name to a component.
 */

export type PricingModel = "range" | "perCount" | "perUnit";

export interface CountVariant {
  min: number;
  max: number;
  /** CMS Scenario for this specific count (e.g. "Broken springs (×2)"). */
  scenario: string;
  note: string;
  internalNote?: string;
}

export interface PricingScenario {
  id: string;
  service: ServiceType;
  /** Display headline + CMS Scenario (for non-count models) + estimate `likelyIssue`. */
  scenario: string;
  /** Short chip label shown in the calculator. */
  label: string;
  /** Lucide icon name — resolved to a component in `constants.ts`. */
  icon: string;
  /** CMS category (matched by the catalog override + the assistant's category filter). */
  category: string;
  pricingModel: PricingModel;
  priceMin: number | null;
  priceMax: number | null;
  /** Rendered instead of a numeric range when set (open-ended / per-unit copy for the CMS/LLM). */
  priceLabel?: string;
  /** True → the calculator renders "From $min" with no upper bound. */
  openEnded?: boolean;
  /** perCount: exact ranges + CMS scenario keyed by quantity (e.g. springs 1..4). */
  countVariants?: Record<number, CountVariant>;
  /** perUnit: price per item + one-off attendance. */
  unitPrice?: number;
  calloutFee?: number;
  unitLabel?: string;
  /** Breakdown label for the one-off attendance line (per-unit scenarios). */
  calloutLabel?: string;
  maxQty?: number;
  /** Customer-facing "smart note" → CMS `Note`. */
  publicNote: string;
  /** Private LLM-only guidance → CMS `InternalNote` (never public). */
  internalNote: string;
  /** Optional "what's included" → CMS `Includes` + shown in the price panel. */
  includes?: string;
}

const CAT_REPAIR = "repair";
const CAT_INSTALL = "installation";
const CAT_OPENER = "opener";
const CAT_MAINT = "maintenance";

export const PRICING_SCENARIOS: PricingScenario[] = [
  // ─────────────────────────────── REPAIR ───────────────────────────────
  {
    id: "spring",
    service: "repair",
    scenario: "Broken spring(s)",
    label: "Broken spring",
    icon: "Unplug",
    category: CAT_REPAIR,
    pricingModel: "perCount",
    priceMin: 240,
    priceMax: 1000,
    publicNote: "Torsion/extension springs supplied & fitted — our most common same-day repair.",
    internalNote:
      "Price scales with spring count (1:$240–280, 2:$440–550, 3:$660–770, 4:$880–1000). Double doors usually need a matched pair — steer to replacing both; quote toward the top for heavy or insulated doors.",
    includes: "Supply & fit of new spring(s), re-tension and safety test.",
    countVariants: {
      1: {
        min: 240,
        max: 280,
        scenario: "Broken spring (single)",
        note: "One torsion/extension spring supplied & fitted — the most common same-day repair.",
        internalNote: "Single-spring door. If it's a double, recommend replacing as a matched pair.",
      },
      2: {
        min: 440,
        max: 550,
        scenario: "Broken springs (×2)",
        note: "Two springs supplied & fitted — best replaced as a matched pair.",
        internalNote: "Standard double-door job.",
      },
      3: {
        min: 660,
        max: 770,
        scenario: "Springs (×3)",
        note: "Three springs for larger/heavier doors.",
        internalNote: "Larger or heavier doors.",
      },
      4: {
        min: 880,
        max: 1000,
        scenario: "Springs (×4)",
        note: "Four springs for oversized or commercial doors.",
        internalNote: "Confirm door width & weight; may tip into commercial rates.",
      },
    },
  },
  {
    id: "spring-refit",
    service: "repair",
    scenario: "Spring re-fit / re-tension",
    label: "Re-fit springs",
    icon: "RotateCcw",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 280,
    priceMax: 330,
    publicNote: "Refit or re-tension your existing springs (no new parts needed).",
    internalNote: "Use when springs are intact but slipped/loose — not snapped. If snapped, quote a replacement.",
  },
  {
    id: "cable",
    service: "repair",
    scenario: "Cable snapped or off the drum",
    label: "Cable / off drum",
    icon: "Cable",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 280,
    priceMax: 550,
    publicNote: "Lift cable(s) replaced or re-seated and re-tensioned.",
    internalNote: "Range covers 1 vs 2 cables plus a drum re-seat; quote higher if the door has dropped or jammed.",
  },
  {
    id: "motor-repair",
    service: "repair",
    scenario: "Motor / opener not working (repair)",
    label: "Motor not working",
    icon: "Cpu",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 380,
    priceMax: 490,
    publicNote: "Diagnose & repair the opener — gears, logic board, capacitor or limit switches.",
    internalNote: "If beyond economical repair, pivot to a replacement motor ($770–990).",
  },
  {
    id: "offtrack",
    service: "repair",
    scenario: "Door off track / stuck",
    label: "Off track / stuck",
    icon: "AlertTriangle",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 440,
    priceMax: 770,
    publicNote: "Re-rail the door, straighten/realign the tracks and replace damaged rollers.",
    internalNote: "Higher end when panels are bent or several rollers are gone — check for panel damage and ask for photos.",
  },
  {
    id: "damaged",
    service: "repair",
    scenario: "Door damaged (panel / section)",
    label: "Damaged panel",
    icon: "Hammer",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 550,
    priceMax: 1100,
    publicNote: "Repair or replace a damaged panel/section and hardware.",
    internalNote:
      "Per-panel roughly $350–1,500 (market); discontinued colours/profiles push higher and may need a full section. Ask for photos and the door brand/colour.",
  },
  {
    id: "hinges-rollers",
    service: "repair",
    scenario: "Hinges & rollers / wheels",
    label: "Hinges & rollers",
    icon: "Settings",
    category: CAT_REPAIR,
    pricingModel: "perUnit",
    priceMin: null,
    priceMax: null,
    priceLabel: "$30 each + $140 call-out",
    unitPrice: 30,
    calloutFee: 140,
    unitLabel: "part",
    calloutLabel: "Call-out & fitting",
    maxQty: 12,
    publicNote: "Worn hinges/rollers replaced — $30 per part plus a $140 attendance fee.",
    internalNote: "A typical door has 8–10 rollers; quote parts × qty + $140 (one attendance fee regardless of qty).",
  },
  {
    id: "roller-lock",
    service: "repair",
    scenario: "Roller door lock + arms",
    label: "Roller door lock",
    icon: "Lock",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 380,
    priceMax: 440,
    publicNote: "Replace the roller-door lock and lock arms.",
    internalNote: "Common on older manual roller doors.",
  },
  {
    id: "pelmet",
    service: "repair",
    scenario: "Pelmet / hood replaced",
    label: "Pelmet / hood",
    icon: "PanelTopOpen",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 380,
    priceMax: 480,
    publicNote: "Replace the roller-door pelmet (hood).",
    internalNote: "Colour-match to the door where possible.",
  },
  {
    id: "seal",
    service: "repair",
    scenario: "Weather seal (rubber & brush)",
    label: "Weather seal",
    icon: "Wind",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 280,
    priceMax: 480,
    publicNote: "Bottom rubber and/or brush seals supplied & fitted.",
    internalNote: "Range covers single vs double door plus brush pile; measure the opening width.",
  },
  {
    id: "sensors",
    service: "repair",
    scenario: "Safety sensors / photo eyes",
    label: "Safety sensors",
    icon: "ScanEye",
    category: CAT_REPAIR,
    pricingModel: "range",
    priceMin: 150,
    priceMax: 300,
    publicNote: "Replace and realign the safety photo-eye sensors.",
    internalNote: "Gap-fill from current market ($125–300). Common after impact or misalignment; check opener compatibility.",
  },

  // ───────────────────────── NEW DOOR / INSTALL ─────────────────────────
  {
    id: "new-standard",
    service: "installation",
    scenario: "New garage door — standard (supply & install)",
    label: "New standard door",
    icon: "Home",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 3000,
    priceMax: 5000,
    publicNote: "Supplied & installed including removal of the old door, new tracks and hardware.",
    internalNote:
      "Owner's standard figure ($3k–5k). Market per type/size: roller single ~$1,200–3,000, sectional single ~$1,800–3,800 / double ~$3,200–6,000, tilt single ~$1,700–2,300. Ask door type, size, material, insulated?, and whether a motor is included. Always offer a firm quote.",
    includes: "Old door removal, new door, tracks, hardware and fitting.",
  },
  {
    id: "new-custom",
    service: "installation",
    scenario: "New door — commercial / custom",
    label: "Commercial / custom",
    icon: "Building2",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 5000,
    priceMax: 15000,
    openEnded: true,
    publicNote: "Commercial and custom doors — supplied & installed. Priced to your opening and specs.",
    internalNote:
      "$5k–$15k+. Always collect opening size, material, wind rating and motor before quoting, and offer a firm on-site quote rather than committing to a number.",
  },
  {
    id: "tilt-arms-kit",
    service: "installation",
    scenario: "Tilt-door arms kit + springs",
    label: "Tilt arms kit",
    icon: "Wrench",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 1200,
    priceMax: 1800,
    publicNote: "Tilt-door conversion/replacement arms kit with springs.",
    internalNote: "For older tilt (up-and-over) doors; confirm the frame is sound.",
  },
  {
    id: "roller-reinstall",
    service: "installation",
    scenario: "Roller door removal & reinstall",
    label: "Roller remove/reinstall",
    icon: "Truck",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 880,
    priceMax: 1500,
    publicNote: "Remove and reinstall your roller door (e.g. for rendering or building works).",
    internalNote: "Confirm whether the same door is being reused and if a new motor/curtain is needed.",
  },
  {
    id: "sectional-reinstall",
    service: "installation",
    scenario: "Sectional door removal & reinstall",
    label: "Sectional remove/reinstall",
    icon: "Truck",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 990,
    priceMax: 1300,
    publicNote: "Remove and reinstall your sectional door.",
    internalNote: "Confirm reuse of the existing door and hardware condition.",
  },
  {
    id: "commercial-roller",
    service: "installation",
    scenario: "Commercial roller door (service, from)",
    label: "Commercial roller",
    icon: "DoorClosed",
    category: CAT_INSTALL,
    pricingModel: "range",
    priceMin: 280,
    priceMax: 380,
    publicNote: "Commercial roller door service/repair.",
    internalNote:
      "AMBIGUOUS in the owner's list ($280–380) — this figure reads like a service/repair, NOT a new commercial supply (new commercial/custom is $5k–$15k+). Confirm the exact scope with the customer before quoting.",
  },

  // ──────────────────────── MOTOR / OPENER / CONTROLS ────────────────────────
  {
    id: "motor-replace",
    service: "opener",
    scenario: "Motor / opener replacement",
    label: "Replace motor",
    icon: "Cpu",
    category: CAT_OPENER,
    pricingModel: "range",
    priceMin: 770,
    priceMax: 990,
    publicNote: "New opener supplied, installed and programmed — including remotes.",
    internalNote:
      "Perth motors from ~$700 (B&D Power Drive, Merlin SilentDrive). Roller-door vs sectional motor differs; battery backup / smart (WiFi) adds. Confirm door type & weight.",
    includes: "New motor, installation, programming and remotes.",
  },
  {
    id: "wifi",
    service: "opener",
    scenario: "WiFi / smart control (supply & install)",
    label: "WiFi / smart",
    icon: "Wifi",
    category: CAT_OPENER,
    pricingModel: "range",
    priceMin: 280,
    priceMax: 380,
    publicNote: "Add WiFi/smart control to a compatible opener.",
    internalNote: "myQ / Merlin etc. Confirm the existing opener is smart-compatible before quoting.",
  },
  {
    id: "remote",
    service: "opener",
    scenario: "Remote (extra / replacement)",
    label: "Remote",
    icon: "RadioTower",
    category: CAT_OPENER,
    pricingModel: "perUnit",
    priceMin: null,
    priceMax: null,
    priceLabel: "$95 each + $120 to attend & program",
    unitPrice: 95,
    calloutFee: 120,
    unitLabel: "remote",
    calloutLabel: "Attend & program",
    maxQty: 6,
    publicNote: "Remotes are $95 each, plus $120 to attend and program them to your motor.",
    internalNote: "One $120 attendance regardless of how many remotes. Confirm the motor brand/model for compatibility.",
  },

  // ───────────────────────── SERVICE / MAINTENANCE ─────────────────────────
  {
    id: "service",
    service: "maintenance",
    scenario: "Service / tune-up",
    label: "Service / tune-up",
    icon: "ShieldCheck",
    category: CAT_MAINT,
    pricingModel: "range",
    priceMin: 140,
    priceMax: null,
    priceLabel: "From $140 + parts",
    openEnded: true,
    publicNote: "Full service and safety adjustment — $140 plus any parts required.",
    internalNote: "Attendance $140; quote any parts on top if found. Good upsell entry to a spring/roller replacement.",
  },
  {
    id: "checkup",
    service: "maintenance",
    scenario: "Safety check-up / inspection",
    label: "Safety check-up",
    icon: "CalendarCheck",
    category: CAT_MAINT,
    pricingModel: "range",
    priceMin: 120,
    priceMax: 120,
    publicNote: "20-point safety inspection and report — $120.",
    internalNote: "Entry point; upsell a full service if adjustments are needed.",
  },
];

/** Broad fallback range per service for the "Not sure / help me choose" option (no specific scenario). */
export const SERVICE_FALLBACK: Record<
  ServiceType,
  { min: number; max: number; openEnded: boolean; label: string; likelyIssue: string }
> = {
  repair: { min: 140, max: 770, openEnded: false, label: "Repair (call-out + parts)", likelyIssue: "Garage door repair" },
  installation: { min: 3000, max: 15000, openEnded: true, label: "New door supply & install", likelyIssue: "New garage door" },
  opener: { min: 280, max: 990, openEnded: false, label: "Opener / motor work", likelyIssue: "Motor / opener work" },
  maintenance: { min: 120, max: 300, openEnded: false, label: "Service & safety check", likelyIssue: "Service & safety check" },
};

export const PRICING_BY_ID: Map<string, PricingScenario> = new Map(
  PRICING_SCENARIOS.map((s) => [s.id, s]),
);

export function getScenariosByService(service: ServiceType): PricingScenario[] {
  return PRICING_SCENARIOS.filter((s) => s.service === service);
}

/** Clamp a requested quantity to the scenario's supported range (default 1). */
export function clampQuantity(scenario: PricingScenario, qty: number | undefined): number {
  const n = Math.floor(qty ?? 1);
  if (scenario.pricingModel === "perCount" && scenario.countVariants) {
    const counts = Object.keys(scenario.countVariants).map(Number);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    return Math.min(max, Math.max(min, n));
  }
  if (scenario.pricingModel === "perUnit") {
    return Math.min(scenario.maxQty ?? 6, Math.max(1, n));
  }
  return 1;
}

/** Headline price for a scenario at a given quantity. */
export function priceForScenario(
  scenario: PricingScenario,
  qty = 1,
): { min: number; max: number; openEnded: boolean } {
  const q = clampQuantity(scenario, qty);
  if (scenario.pricingModel === "perCount" && scenario.countVariants) {
    const v = scenario.countVariants[q] ?? scenario.countVariants[1];
    return { min: v.min, max: v.max, openEnded: false };
  }
  if (scenario.pricingModel === "perUnit") {
    const total = q * (scenario.unitPrice ?? 0) + (scenario.calloutFee ?? 0);
    return { min: total, max: total, openEnded: false };
  }
  const min = scenario.priceMin ?? 0;
  const max = scenario.priceMax ?? min;
  return { min, max, openEnded: Boolean(scenario.openEnded) };
}

/** The CMS Scenario string for a given selection (per-count scenarios vary by quantity). */
export function scenarioLabelForSelection(scenario: PricingScenario, qty = 1): string {
  if (scenario.pricingModel === "perCount" && scenario.countVariants) {
    const q = clampQuantity(scenario, qty);
    return (scenario.countVariants[q] ?? scenario.countVariants[1]).scenario;
  }
  return scenario.scenario;
}

// ─────────────────────────────── CMS SEED ───────────────────────────────

export interface CmsSeedRow {
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  category: string | null;
  internalNote: string | null;
  includes: string | null;
}

/** Extra rows seeded to the CMS purely for the assistant (not selectable in the calculator). */
export const SPECIAL_SEED_ROWS: CmsSeedRow[] = [
  {
    scenario: "After-hours / emergency call-out",
    priceMin: null,
    priceMax: null,
    priceLabel: "+$500",
    note: "Emergency or after-hours attendance adds $500.",
    category: "emergency",
    internalNote:
      "Flat +$500 on top of the job for nights, weekends and urgent same-day call-outs. Add it to whatever the base job costs.",
    includes: null,
  },
  {
    scenario: "Estimates & quotes (how we price)",
    priceMin: null,
    priceMax: null,
    priceLabel: "Indicative",
    note: "All prices are indicative guides, not final quotes — your exact price is confirmed on-site, free and with no obligation.",
    category: "general",
    internalNote:
      "ALWAYS tell customers estimates are indicative (not 100% accurate) and offer a free, firm on-site quote. Ask for door type, size, material, brand and photos to narrow the range. For new/commercial/custom doors always collect details and offer a quote rather than committing to a single number. Add ~$500 for after-hours/emergency work.",
    includes: null,
  },
];

/**
 * Flatten the pricing data into CMS `PricingItems` rows for the import script. Per-count scenarios
 * (springs) expand into one row per count; per-unit scenarios keep their descriptive `priceLabel`.
 */
export function buildSeedRows(): CmsSeedRow[] {
  const rows: CmsSeedRow[] = [];

  for (const s of PRICING_SCENARIOS) {
    if (s.pricingModel === "perCount" && s.countVariants) {
      for (const key of Object.keys(s.countVariants).map(Number).sort((a, b) => a - b)) {
        const v = s.countVariants[key];
        rows.push({
          scenario: v.scenario,
          priceMin: v.min,
          priceMax: v.max,
          priceLabel: null,
          note: v.note,
          category: s.category,
          internalNote: v.internalNote ?? s.internalNote,
          includes: s.includes ?? null,
        });
      }
      continue;
    }

    rows.push({
      scenario: s.scenario,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      priceLabel: s.priceLabel ?? null,
      note: s.publicNote,
      category: s.category,
      internalNote: s.internalNote,
      includes: s.includes ?? null,
    });
  }

  return [...rows, ...SPECIAL_SEED_ROWS];
}

/** Flat, per-$500 emergency surcharge applied when the customer flags an after-hours/emergency job. */
export const EMERGENCY_SURCHARGE = 500;
