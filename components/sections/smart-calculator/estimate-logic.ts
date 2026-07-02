import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";

/**
 * Data-driven estimate engine for the Smart Price Calculator.
 *
 * Two layers (the user's chosen "built-in defaults + DB override" model):
 *   1. A comprehensive, baked-in Perth pricing model produces a transparent line-item breakdown and a
 *      default range for any selection — so the calculator always works, even with the CMS offline.
 *   2. When the live CMS pricing catalog (GET /api/pricing-items, passed in as `catalog`) has a row that
 *      matches the chosen service + issue, that row's price *overrides* the headline range and is flagged
 *      as a live "list price". The breakdown stays as the indicative default split.
 *
 * Pure + synchronous: the UI recomputes on every selection change (instant), no network in here.
 */

export type ServiceType = "repair" | "installation" | "opener" | "maintenance";

export interface CalculatorFormData {
  serviceType: ServiceType | "";
  /** The selected specific issue label, e.g. "Broken spring". Empty until chosen. */
  problem: string;
  /** "roller" | "sectional" | "tilt" | "notsure" | "" */
  doorType: string;
  /** "single" | "double" | "custom" | "" */
  doorSize: string;
  /** "today" | "24h" | "week" | "flexible" | "" */
  urgency: string;
  suburb: string;
}

export interface EstimateBreakdown {
  label: string;
  min: number;
  max: number;
}

export interface EstimateResult {
  minPrice: number;
  maxPrice: number;
  /** True when we only have a "from" price (open-ended) — render as "From $min". */
  openEnded: boolean;
  confidence: "Low" | "Medium" | "High";
  likelyIssue: string;
  breakdown: EstimateBreakdown[];
  /** Where the headline range came from. "catalog" = a live admin-maintained list price drove it. */
  priceSource: "estimate" | "catalog";
  /** The matched catalog scenario (when priceSource === "catalog"), e.g. "E2E spring". */
  catalogLabel?: string;
  /** Optional "what's included" copy from a matched catalog row. */
  includes?: string | null;
}

export const EMPTY_FORM: CalculatorFormData = {
  serviceType: "",
  problem: "",
  doorType: "",
  doorSize: "",
  urgency: "",
  suburb: "",
};

// Map each service to the catalog `category` words that count as the same family.
const CATEGORY_SYNONYMS: Record<ServiceType, string[]> = {
  repair: ["repair", "repairs", "fix"],
  installation: ["install", "installation", "new door", "doors", "supply"],
  opener: ["opener", "motor", "automation"],
  maintenance: ["service", "servicing", "maintenance", "tune"],
};

// Generic words we don't want to drive a catalog match (too common to be meaningful).
const ISSUE_STOPWORDS = new Set([
  "the", "and", "for", "you", "your", "door", "doors", "garage", "not", "sure", "is", "are",
  "my", "with", "this", "that", "will", "wont", "won't", "working", "work", "need", "needs",
  "a", "an", "of", "or", "to", "it", "in", "on", "help", "issue", "problem",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !ISSUE_STOPWORDS.has(t));
}

/** Parse the leading dollar amount out of a price label like "From $129 call-out". */
function parseLabelAmount(label: string | null | undefined): number | null {
  if (!label) return null;
  const m = label.replace(/,/g, "").match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Find the catalog row that best fits the chosen service + issue. Requires the issue keyword to
 * actually appear in the row (so we never attach an unrelated row just because the category matches);
 * the category match and a complete min/max range are tie-breakers.
 */
function matchCatalogRow(
  catalog: CmsPublicPricingItem[],
  serviceType: ServiceType,
  problem: string,
): CmsPublicPricingItem | null {
  if (catalog.length === 0) return null;
  const issueKw = tokenize(problem);
  if (issueKw.length === 0) return null;

  const catWords = CATEGORY_SYNONYMS[serviceType];
  let best: CmsPublicPricingItem | null = null;
  let bestScore = 0;

  for (const row of catalog) {
    const hay = `${row.scenario ?? ""} ${row.note ?? ""} ${row.costFactors ?? ""}`.toLowerCase();
    const issueScore = issueKw.reduce((acc, kw) => (hay.includes(kw) ? acc + 1 : acc), 0);
    if (issueScore === 0) continue; // must be relevant to the actual issue

    const catHay = (row.category ?? "").toLowerCase();
    const categoryOk = catWords.some((w) => catHay.includes(w));
    const hasRange = row.priceMin != null && row.priceMax != null;

    const score = issueScore * 10 + (categoryOk ? 3 : 0) + (hasRange ? 1 : 0);
    if (score > bestScore) {
      best = row;
      bestScore = score;
    }
  }

  return best;
}

interface BaseModel {
  likelyIssue: string;
  breakdown: EstimateBreakdown[];
}

/** The baked-in default model: a transparent line-item breakdown for the chosen service + issue. */
function buildBaseModel(formData: CalculatorFormData): BaseModel {
  const issue = formData.problem.toLowerCase();
  const breakdown: EstimateBreakdown[] = [];
  let likelyIssue = "";

  switch (formData.serviceType) {
    case "repair": {
      const calloutMin = 80, calloutMax = 120;
      let labourMin = 80, labourMax = 180;
      let partsMin = 20, partsMax = 120;

      if (issue.includes("spring")) {
        likelyIssue = "Broken torsion or extension spring";
        partsMin += 60; partsMax += 120; labourMin += 40; labourMax += 80;
      } else if (issue.includes("cable")) {
        likelyIssue = "Snapped or frayed cable / drum slip";
        partsMin += 30; partsMax += 70; labourMin += 30; labourMax += 60;
      } else if (issue.includes("stuck") || issue.includes("track") || issue.includes("off")) {
        likelyIssue = "Track misalignment or roller/cable slip";
        labourMin += 50; labourMax += 100;
      } else if (issue.includes("motor") || issue.includes("opener")) {
        likelyIssue = "Opener motor failure or logic-board fault";
        partsMin += 100; partsMax += 250; labourMin += 40; labourMax += 80;
      } else if (issue.includes("nois")) {
        likelyIssue = "Worn rollers, hinges or dry components";
        partsMin += 10; partsMax += 40;
      } else if (issue.includes("remote")) {
        likelyIssue = "Remote battery, code sync or receiver issue";
        partsMin += 20; partsMax += 50;
      } else if (issue.includes("open")) {
        likelyIssue = "Door won't open — diagnostic needed";
        labourMin += 30; labourMax += 70;
      } else {
        likelyIssue = "Mechanical garage door fault";
      }

      breakdown.push({ label: "Service call & diagnostic", min: calloutMin, max: calloutMax });
      breakdown.push({ label: "Labour", min: labourMin, max: labourMax });
      breakdown.push({ label: "Replacement parts", min: partsMin, max: partsMax });
      break;
    }

    case "installation": {
      let doorMin = 1200, doorMax = 3000;
      let labourMin = 400, labourMax = 1000;
      const partsMin = 200, partsMax = 500;
      likelyIssue = "New garage door supply & installation";

      if (issue.includes("remove") || issue.includes("old")) { labourMin += 100; labourMax += 200; }
      if (issue.includes("insulat")) { doorMin += 400; doorMax += 900; }
      if (issue.includes("roller")) { likelyIssue = "New roller door supply & installation"; }
      if (issue.includes("sectional")) { likelyIssue = "New sectional door supply & installation"; }

      breakdown.push({ label: "Garage door unit", min: doorMin, max: doorMax });
      breakdown.push({ label: "Professional installation", min: labourMin, max: labourMax });
      breakdown.push({ label: "Hardware & tracking", min: partsMin, max: partsMax });
      break;
    }

    case "opener": {
      let motorMin = 300, motorMax = 650;
      const labourMin = 100, labourMax = 200;
      let setupMin = 50, setupMax = 100;
      likelyIssue = "Garage door opener / motor upgrade";

      if (issue.includes("smart") || issue.includes("wifi") || issue.includes("wi-fi")) { motorMin += 100; motorMax += 200; }
      if (issue.includes("battery")) { motorMin += 80; motorMax += 150; }
      if (issue.includes("remote")) { setupMin += 40; setupMax += 80; }

      breakdown.push({ label: "Opener / motor unit", min: motorMin, max: motorMax });
      breakdown.push({ label: "Installation & fitment", min: labourMin, max: labourMax });
      breakdown.push({ label: "Setup & remote programming", min: setupMin, max: setupMax });
      break;
    }

    case "maintenance": {
      let inspectionMin = 40, inspectionMax = 80;
      let servicingMin = 50, servicingMax = 120;
      let adjustMin = 30, adjustMax = 80;
      likelyIssue = "Preventative service & safety inspection";

      if (issue.includes("two") || issue.includes("2") || issue.includes("double")) {
        servicingMin += 30; servicingMax += 70; adjustMin += 20; adjustMax += 50;
      } else if (issue.includes("commercial")) {
        inspectionMin += 40; inspectionMax += 80; servicingMin += 50; servicingMax += 100;
      }

      breakdown.push({ label: "Safety & alignment inspection", min: inspectionMin, max: inspectionMax });
      breakdown.push({ label: "Lubrication & spring tensioning", min: servicingMin, max: servicingMax });
      breakdown.push({ label: "Minor hardware adjustments", min: adjustMin, max: adjustMax });
      break;
    }

    default: {
      likelyIssue = "General inspection & diagnostic";
      breakdown.push({ label: "Service call & assessment", min: 80, max: 120 });
      breakdown.push({ label: "Labour", min: 70, max: 150 });
      breakdown.push({ label: "Estimated parts", min: 30, max: 120 });
      break;
    }
  }

  return { likelyIssue, breakdown };
}

/** Apply door-size and urgency modifiers to the breakdown in place. */
function applyModifiers(formData: CalculatorFormData, breakdown: EstimateBreakdown[]) {
  if (breakdown.length === 0) return;

  if (formData.doorSize === "double") {
    if (formData.serviceType === "installation") {
      breakdown[0].min += 200; breakdown[0].max += 500;
      breakdown[1].min += 50; breakdown[1].max += 120;
    } else {
      const last = breakdown[breakdown.length - 1];
      last.min += 50; last.max += 150;
    }
  } else if (formData.doorSize === "custom") {
    breakdown[0].min += 150; breakdown[0].max += 350;
  }

  if (formData.urgency === "today") {
    const idx = breakdown.findIndex((b) =>
      /labour|installation|servicing|fitment/i.test(b.label));
    if (idx !== -1) {
      breakdown[idx].min += 80; breakdown[idx].max += 150;
      breakdown[idx].label += " (same-day priority)";
    } else {
      breakdown.push({ label: "Same-day dispatch", min: 80, max: 150 });
    }
  }
}

function deriveConfidence(formData: CalculatorFormData, matchedCatalog: boolean): "Low" | "Medium" | "High" {
  let notSure = 0;
  if (!formData.problem) notSure++;
  if (formData.doorType === "notsure" || !formData.doorType) notSure++;
  if (!formData.doorSize) notSure++;

  if (matchedCatalog && formData.problem) return "High";
  if (notSure >= 2) return "Low";
  if (notSure === 0) return "High";
  return "Medium";
}

/**
 * Compute the estimate for the current selections. Pass the live catalog (or [] / omitted) to enable
 * the DB-override layer.
 */
export function calculateEstimate(
  formData: CalculatorFormData,
  catalog: CmsPublicPricingItem[] = [],
): EstimateResult {
  const { likelyIssue, breakdown } = buildBaseModel(formData);
  applyModifiers(formData, breakdown);

  const defaultMin = breakdown.reduce((sum, b) => sum + b.min, 0);
  const defaultMax = breakdown.reduce((sum, b) => sum + b.max, 0);

  // DB override: a matching live list price becomes the authoritative headline range.
  const match =
    formData.serviceType && formData.problem
      ? matchCatalogRow(catalog, formData.serviceType as ServiceType, formData.problem)
      : null;

  if (match) {
    const min = match.priceMin ?? parseLabelAmount(match.priceLabel) ?? defaultMin;
    const max = match.priceMax ?? null;
    return {
      minPrice: Math.round(min),
      maxPrice: Math.round(max ?? min),
      openEnded: max == null,
      confidence: deriveConfidence(formData, true),
      likelyIssue: match.note?.trim() || match.scenario || likelyIssue,
      breakdown,
      priceSource: "catalog",
      catalogLabel: match.scenario,
      includes: match.includes ?? null,
    };
  }

  return {
    minPrice: Math.round(defaultMin),
    maxPrice: Math.round(defaultMax),
    openEnded: false,
    confidence: deriveConfidence(formData, false),
    likelyIssue,
    breakdown,
    priceSource: "estimate",
  };
}
