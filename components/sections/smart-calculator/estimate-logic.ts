import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import {
  PRICING_BY_ID,
  SERVICE_FALLBACK,
  EMERGENCY_SURCHARGE,
  priceForScenario,
  scenarioLabelForSelection,
  clampQuantity,
  type PricingScenario,
} from "./pricing-data";

/**
 * Data-driven estimate engine for the Smart Price Calculator.
 *
 * Two layers (the "built-in defaults + DB override" model):
 *   1. A baked-in Perth price list (`pricing-data.ts`) gives an exact range + line-item breakdown for the
 *      chosen scenario — so the calculator always works, even with the CMS offline.
 *   2. When the live CMS pricing catalog (GET /api/pricing-items, passed in as `catalog`) has a row that
 *      matches the chosen scenario, that row's price *overrides* the headline range and is flagged as a
 *      live "list price" (so an admin price edit reflects immediately). Both are seeded from the same
 *      `pricing-data.ts`, so they agree unless the admin has changed a price.
 *
 * A flat after-hours/emergency surcharge (+$500) is added on top when the customer flags it.
 *
 * Pure + synchronous: the UI recomputes on every selection change (instant), no network in here.
 */

export type ServiceType = "repair" | "installation" | "opener" | "maintenance";

/** Sentinel id for the "Not sure / help me choose" option (no specific priced scenario). */
export const NOT_SURE_ID = "notsure";

export interface CalculatorFormData {
  serviceType: ServiceType | "";
  /** Stable id of the selected pricing scenario (from `pricing-data.ts`), or NOT_SURE_ID. Empty until chosen. */
  problemId: string;
  /** "roller" | "sectional" | "tilt" | "notsure" | "" */
  doorType: string;
  /** "single" | "double" | "custom" | "" */
  doorSize: string;
  /** Quantity for perCount (springs 1–4) / perUnit (remotes, hinges) scenarios. Default 1. */
  quantity: number;
  /** After-hours / emergency call-out — adds a flat surcharge. */
  emergency: boolean;
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
  /** The matched catalog scenario (when priceSource === "catalog"). */
  catalogLabel?: string;
  /** Optional "what's included" copy. */
  includes?: string | null;
  /** Customer-facing "smart note" for the chosen scenario. */
  note?: string | null;
}

export const EMPTY_FORM: CalculatorFormData = {
  serviceType: "",
  problemId: "",
  doorType: "",
  doorSize: "",
  quantity: 1,
  emergency: false,
  suburb: "",
};

/** Friendly service names for the quote hand-off + summaries. */
export const SERVICE_LABELS: Record<ServiceType, string> = {
  repair: "Repair",
  installation: "New garage door",
  opener: "Motor / opener",
  maintenance: "Service",
};

// Map each service to the catalog `category` words that count as the same family.
const CATEGORY_SYNONYMS: Record<ServiceType, string[]> = {
  repair: ["repair", "repairs", "fix", "spring"],
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

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Parse the leading dollar amount out of a price label like "From $129 call-out". */
function parseLabelAmount(label: string | null | undefined): number | null {
  if (!label) return null;
  const m = label.replace(/,/g, "").match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** The scenario's CMS label at the current quantity ("" when nothing specific is chosen). */
function effectiveScenarioLabel(formData: CalculatorFormData, scenario: PricingScenario | undefined): string {
  return scenario ? scenarioLabelForSelection(scenario, formData.quantity) : "";
}

/**
 * Find the catalog row that best fits the chosen scenario. Prefers an exact scenario-name match (our
 * CMS rows are seeded with the same scenario strings), then falls back to a relevance-gated keyword
 * score. The exact-match step prevents "One spring" attaching to the "Two springs" row now that many
 * scenarios are near-identical.
 */
function matchCatalogRow(
  catalog: CmsPublicPricingItem[],
  serviceType: ServiceType,
  problem: string,
): CmsPublicPricingItem | null {
  if (catalog.length === 0) return null;

  // 1) Exact scenario-name match (with a real range).
  const target = normalize(problem);
  if (target) {
    const exact = catalog.find((r) => normalize(r.scenario ?? "") === target && r.priceMin != null);
    if (exact) return exact;
  }

  // 2) Keyword score fallback.
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
  openEnded: boolean;
  includes: string | null;
  note: string | null;
}

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Build the indicative line-item breakdown for a scenario at the chosen quantity. */
function buildScenarioBreakdown(
  scenario: PricingScenario,
  quantity: number,
  min: number,
  max: number,
): EstimateBreakdown[] {
  if (scenario.pricingModel === "perUnit") {
    const q = clampQuantity(scenario, quantity);
    const unit = scenario.unitPrice ?? 0;
    const callout = scenario.calloutFee ?? 0;
    const noun = cap(scenario.unitLabel ?? "part");
    return [
      { label: `${noun}${q > 1 ? "s" : ""} (×${q})`, min: q * unit, max: q * unit },
      { label: scenario.calloutLabel ?? "Attendance", min: callout, max: callout },
    ];
  }
  return [{ label: "Parts, labour & call-out", min, max }];
}

/** The baked-in default model: an exact range + breakdown for the chosen scenario (or a fallback). */
function buildBaseModel(formData: CalculatorFormData, scenario: PricingScenario | undefined): BaseModel {
  if (scenario) {
    const { min, max, openEnded } = priceForScenario(scenario, formData.quantity);
    return {
      likelyIssue: scenarioLabelForSelection(scenario, formData.quantity),
      breakdown: buildScenarioBreakdown(scenario, formData.quantity, min, max),
      openEnded,
      includes: scenario.includes ?? null,
      note: scenario.publicNote,
    };
  }

  // No specific scenario ("Not sure" / nothing picked) → a broad per-service fallback.
  if (formData.serviceType) {
    const f = SERVICE_FALLBACK[formData.serviceType];
    return {
      likelyIssue: f.likelyIssue,
      breakdown: [{ label: f.label, min: f.min, max: f.max }],
      openEnded: f.openEnded,
      includes: null,
      note: "Tell us a bit more and we'll sharpen this — or get a free, firm quote.",
    };
  }

  return {
    likelyIssue: "General inspection & diagnostic",
    breakdown: [
      { label: "Service call & assessment", min: 80, max: 120 },
      { label: "Labour", min: 70, max: 150 },
      { label: "Estimated parts", min: 30, max: 120 },
    ],
    openEnded: false,
    includes: null,
    note: null,
  };
}

function deriveConfidence(formData: CalculatorFormData, matchedCatalog: boolean): "Low" | "Medium" | "High" {
  const knownIssue = Boolean(formData.problemId) && formData.problemId !== NOT_SURE_ID;
  let notSure = 0;
  if (!knownIssue) notSure++;
  if (formData.doorType === "notsure" || !formData.doorType) notSure++;
  if (!formData.doorSize) notSure++;

  if (matchedCatalog && knownIssue) return "High";
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
  const scenario =
    formData.problemId && formData.problemId !== NOT_SURE_ID
      ? PRICING_BY_ID.get(formData.problemId)
      : undefined;
  const base = buildBaseModel(formData, scenario);

  // Flat after-hours/emergency surcharge, added as its own line.
  if (formData.emergency) {
    base.breakdown.push({
      label: "After-hours / emergency call-out",
      min: EMERGENCY_SURCHARGE,
      max: EMERGENCY_SURCHARGE,
    });
  }

  const defaultMin = base.breakdown.reduce((sum, b) => sum + b.min, 0);
  const defaultMax = base.breakdown.reduce((sum, b) => sum + b.max, 0);

  // DB override: a matching live list price becomes the authoritative headline range. We skip it for
  // per-unit scenarios (remotes/hinges), whose price is quantity-driven and can't be a single row.
  const problemLabel = effectiveScenarioLabel(formData, scenario);
  const allowOverride = !scenario || scenario.pricingModel !== "perUnit";
  const match =
    allowOverride && formData.serviceType && problemLabel
      ? matchCatalogRow(catalog, formData.serviceType as ServiceType, problemLabel)
      : null;

  if (match && match.priceMin != null) {
    const surcharge = formData.emergency ? EMERGENCY_SURCHARGE : 0;
    const min = (match.priceMin ?? parseLabelAmount(match.priceLabel) ?? defaultMin) + surcharge;
    const max = match.priceMax != null ? match.priceMax + surcharge : null;
    return {
      minPrice: Math.round(min),
      maxPrice: Math.round(max ?? min),
      openEnded: max == null,
      confidence: deriveConfidence(formData, true),
      likelyIssue: base.likelyIssue,
      breakdown: base.breakdown,
      priceSource: "catalog",
      catalogLabel: match.scenario,
      includes: match.includes ?? base.includes,
      note: base.note,
    };
  }

  return {
    minPrice: Math.round(defaultMin),
    maxPrice: Math.round(defaultMax),
    openEnded: base.openEnded,
    confidence: deriveConfidence(formData, false),
    likelyIssue: base.likelyIssue,
    breakdown: base.breakdown,
    priceSource: "estimate",
    includes: base.includes,
    note: base.note,
  };
}

/** Format a headline range for prose ("from $X", "about $X", "$X–$Y"). */
export function formatEstimateRange(estimate: EstimateResult): string {
  if (estimate.openEnded) return `from $${estimate.minPrice.toLocaleString()}`;
  if (estimate.minPrice === estimate.maxPrice) return `about $${estimate.minPrice.toLocaleString()}`;
  return `$${estimate.minPrice.toLocaleString()}–$${estimate.maxPrice.toLocaleString()}`;
}

export interface QuotePrefill {
  service: string;
  suburb: string;
  notes: string;
}

/**
 * Build a pre-filled, editable quote request from the calculator's current selections + estimate, so
 * the "Get my exact quote" CTA opens a form that already describes what the customer asked about.
 */
export function buildQuotePrefill(formData: CalculatorFormData, estimate: EstimateResult): QuotePrefill {
  const serviceLabel = formData.serviceType ? SERVICE_LABELS[formData.serviceType] : "Garage door enquiry";
  const scenario =
    formData.problemId && formData.problemId !== NOT_SURE_ID
      ? PRICING_BY_ID.get(formData.problemId)
      : undefined;
  const jobLabel = scenario ? scenarioLabelForSelection(scenario, formData.quantity) : "";
  const service = jobLabel ? `${serviceLabel} — ${jobLabel}` : serviceLabel;

  const lines: string[] = [`Service: ${service}`];
  if (formData.doorType && formData.doorType !== "notsure") lines.push(`Door type: ${formData.doorType}`);
  if (formData.doorSize) lines.push(`Door size: ${formData.doorSize}`);
  if (formData.emergency) lines.push("After-hours / emergency: yes (+$500)");
  lines.push(`Calculator estimate: ${formatEstimateRange(estimate)} (indicative — please confirm my exact price).`);

  return { service, suburb: formData.suburb, notes: lines.join("\n") };
}
