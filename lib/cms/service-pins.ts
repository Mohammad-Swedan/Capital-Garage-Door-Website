/**
 * Pure logic behind scripts/add-service-page-pins.ts: which catalog price rows and which real
 * reviews get pinned on the money service pages, and the full-children PUT body that pins them.
 *
 * No imports and no I/O on purpose — node:test loads this without running the script's main(),
 * and nothing here can reach a CMS. (lib/brands/__tests__/service-pins.test.ts covers it.)
 */

/* ------------------------------------------------------------------ *
 * Pin tables
 * ------------------------------------------------------------------ */

/** The eight Flat ServicePage slugs this rollout touches, in the order the script processes them. */
export const SERVICE_PIN_SLUGS = [
  "garage-door-spring-repair-perth",
  "emergency-garage-door-repairs-perth",
  "garage-door-maintenance-perth",
  "garage-door-opener-repair-perth",
  "roller-door-repairs-perth",
  "commercial-garage-doors-perth",
  "garage-door-installation-perth",
  "garage-door-repairs-perth",
] as const;

/**
 * Catalog scenarios to pin on the six pages that render an EMPTY price table, in display order.
 * Exact `PricingItems.scenario` strings — note the multiplication sign in "Broken springs (×2)"
 * and the em dash in "New door — commercial / custom". (The installation and repairs pages
 * already carry price rows, so they are deliberately absent.)
 */
export const PRICE_PINS_BY_SLUG: Readonly<Record<string, readonly string[]>> = {
  "garage-door-spring-repair-perth": [
    "Broken spring (single)",
    "Broken springs (×2)",
    "Springs (×3)",
    "Springs (×4)",
    "Spring re-fit / re-tension",
    "Cable snapped or off the drum",
    "After-hours / emergency call-out",
  ],
  "emergency-garage-door-repairs-perth": [
    "After-hours / emergency call-out",
    "Broken spring (single)",
    "Broken springs (×2)",
    "Cable snapped or off the drum",
    "Door off track / stuck",
    "Motor / opener not working (repair)",
    "Door damaged (panel / section)",
  ],
  "garage-door-maintenance-perth": [
    "Service / tune-up",
    "Safety check-up / inspection",
    "Weather seal (rubber & brush)",
    "Hinges & rollers / wheels",
    "Spring re-fit / re-tension",
  ],
  "garage-door-opener-repair-perth": [
    "Motor / opener not working (repair)",
    "Motor / opener replacement",
    "Remote (extra / replacement)",
    "WiFi / smart control (supply & install)",
    "Safety sensors / photo eyes",
  ],
  "roller-door-repairs-perth": [
    "Roller door lock + arms",
    "Pelmet / hood replaced",
    "Weather seal (rubber & brush)",
    "Door off track / stuck",
    "Roller door removal & reinstall",
    "Motor / opener not working (repair)",
    "Commercial roller door (service, from)",
  ],
  "commercial-garage-doors-perth": [
    "New door — commercial / custom",
    "Commercial roller door (service, from)",
    "Springs (×4)",
    "Motor / opener replacement",
    "After-hours / emergency call-out",
  ],
};

/** Words that make a review relevant to a page. Multi-word entries are phrases. Lower-case only. */
export const REVIEW_KEYWORDS_BY_SLUG: Readonly<Record<string, readonly string[]>> = {
  "garage-door-spring-repair-perth": ["spring", "springs", "cable"],
  "emergency-garage-door-repairs-perth": [
    "emergency",
    "urgent",
    "after hours",
    "late",
    "night",
    "weekend",
    "same day",
    "quick",
    "fast",
  ],
  "garage-door-maintenance-perth": ["service", "serviced", "maintenance", "tune"],
  "garage-door-opener-repair-perth": ["motor", "opener", "remote"],
  "roller-door-repairs-perth": ["roller"],
  "commercial-garage-doors-perth": ["commercial", "business", "warehouse", "shop", "factory", "shutter"],
  "garage-door-installation-perth": ["install", "installed", "new door", "replaced the door"],
  "garage-door-repairs-perth": ["repair", "fixed"],
};

/** Reviews to pin per page (the brief asks for 2–3; the fallback tops a thin page up to this). */
export const REVIEWS_PER_PAGE = 3;
/** Below this many keyword matches the page is topped up with the newest 5-star reviews. */
export const MIN_KEYWORD_MATCHES = 2;
/** Lowest star rating that may ever be pinned. */
export const MIN_RATING = 4;

/* ------------------------------------------------------------------ *
 * Review selection
 * ------------------------------------------------------------------ */

/**
 * A CMS review as `GET /api/admin/reviews` returns it (only the fields selection reads).
 *
 * The visibility flags are forward-compatibility: today's CMS `Review` row has no
 * published/visible flag at all — every row in the pool is public (the /reviews page shows the
 * whole pool) — so nothing is ever excluded on them. If one is added, an explicit "off" value
 * keeps the review out of every pin.
 */
export interface PinReview {
  id: number;
  customerName?: string | null;
  /** 1–5 */
  rating: number;
  text?: string | null;
  /** ISO date "YYYY-MM-DD" (compared as a string, newest = greatest). */
  reviewDate?: string | null;
  /** The job tag the review was filed under, e.g. "Emergency Repairs". */
  service?: string | null;
  isPublished?: boolean;
  isVisible?: boolean;
  isHidden?: boolean;
  status?: string | null;
}

export interface SelectedReview {
  review: PinReview;
  /** Keyword hits in the review's text + service tag (0 for a fallback pick). */
  hits: number;
  source: "keyword" | "fallback";
}

/** Lower-case, drop apostrophes, and turn every other run of non-alphanumerics into one space. */
function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * How many times any keyword occurs in `text`. A keyword matches at the START of a word (or
 * phrase), so `install` also hits "installation" and `roller` hits "rollers", but `late` never
 * hits "template" or "plate" (it does hit "later"). Punctuation and hyphens are word breaks, so
 * "after hours" matches "after-hours". Each occurrence counts once — `spring` and `springs` both
 * being in a keyword list does not make one "springs" count twice.
 */
export function countKeywordHits(text: string | null | undefined, keywords: readonly string[]): number {
  // Normalised keywords hold only [a-z0-9 ], so they are safe to put in a pattern as-is.
  const words = keywords.map(normalise).filter(Boolean);
  if (words.length === 0 || !text) return 0;
  // Longest first, so a phrase wins over a shorter keyword that starts the same way.
  const pattern = words.sort((a, b) => b.length - a.length).join("|");
  return (normalise(text).match(new RegExp(`\\b(?:${pattern})`, "g")) ?? []).length;
}

const HIDDEN_STATUS = /^(draft|hidden|unpublished|archived|rejected|pending|spam)$/i;

function isEligible(r: PinReview): boolean {
  if (!Number.isFinite(r.rating) || r.rating < MIN_RATING) return false;
  if (r.isPublished === false || r.isVisible === false || r.isHidden === true) return false;
  if (typeof r.status === "string" && HIDDEN_STATUS.test(r.status.trim())) return false;
  return (r.text ?? "").trim().length > 0; // a review with nothing to show is not a review to pin
}

const cmpDesc = (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0);
/** Newest first; the id breaks a same-date tie so the order is total. */
const newestFirst = (a: PinReview, b: PinReview) =>
  cmpDesc(a.reviewDate ?? "", b.reviewDate ?? "") || b.id - a.id;

/** Two rows are "the same review" when they share an id or the same customer + text. */
const identityKeys = (r: PinReview) => [
  `id:${r.id}`,
  `text:${normalise(r.customerName ?? "")}::${normalise(r.text ?? "")}`,
];

/**
 * The reviews to pin on one page, best first, with the reason each was chosen.
 *
 * 1. Only reviews of at least 4 stars that are not flagged hidden and have some text.
 * 2. Keyword-matching reviews (≥ 1 hit) rank by hits, then rating (5★ first), then newest, then
 *    highest id — a total order, so the result never depends on the input order.
 * 3. If fewer than {@link MIN_KEYWORD_MATCHES} reviews match, the page is topped up to `n` with
 *    the newest 5-star reviews that are not already picked.
 * 4. A review never appears twice (same id, or same customer + text).
 *
 * Throws on a slug with no keyword list: a typo must not silently pin generic reviews.
 */
export function selectReviewsForPage(
  reviews: readonly PinReview[],
  pageSlug: string,
  n: number = REVIEWS_PER_PAGE,
): SelectedReview[] {
  const keywords = REVIEW_KEYWORDS_BY_SLUG[pageSlug];
  if (!keywords) throw new Error(`No review keywords defined for page slug "${pageSlug}"`);
  const limit = Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
  const eligible = reviews.filter(isEligible);

  const seen = new Set<string>();
  const firstTime = (r: PinReview) => {
    const keys = identityKeys(r);
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  };

  const matched = eligible
    .map((review): SelectedReview => ({
      review,
      hits: countKeywordHits(review.text, keywords) + countKeywordHits(review.service, keywords),
      source: "keyword",
    }))
    .filter((s) => s.hits > 0)
    .sort((a, b) => b.hits - a.hits || b.review.rating - a.review.rating || newestFirst(a.review, b.review))
    .filter((s) => firstTime(s.review)); // the best-ranked copy of a duplicate survives

  const picked = matched.slice(0, limit);
  if (matched.length < MIN_KEYWORD_MATCHES) {
    for (const review of eligible.filter((r) => r.rating >= 5).sort(newestFirst)) {
      if (picked.length >= limit) break;
      if (firstTime(review)) picked.push({ review, hits: 0, source: "fallback" });
    }
  }
  return picked;
}

/** {@link selectReviewsForPage} without the explanations: just the chosen reviews, best first. */
export function pickReviewsForPage(
  reviews: readonly PinReview[],
  pageSlug: string,
  n: number = REVIEWS_PER_PAGE,
): PinReview[] {
  return selectReviewsForPage(reviews, pageSlug, n).map((s) => s.review);
}

/* ------------------------------------------------------------------ *
 * The admin page + the plan for one page
 * ------------------------------------------------------------------ */

/** `GET /api/admin/pages/{id}` (the fields the update round-trips). */
export interface AdminPage {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { id: number; question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: {
    id: number;
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

export interface PlannedPriceRow {
  pricingItemId: number;
  sortOrder: number;
  noteOverride: null;
  scenario: string;
}

export interface PlannedReview extends SelectedReview {
  reviewId: number;
  sortOrder: number;
}

export interface PagePinPlan {
  slug: string;
  priceRows: PlannedPriceRow[];
  /** Scenarios in this page's table that the catalog did not contain (warned about, not pinned). */
  missingScenarios: string[];
  /** Why no price rows are planned; null when there are some. */
  priceSkipReason: string | null;
  reviews: PlannedReview[];
  /** Why no reviews are planned; null when there are some. */
  reviewSkipReason: string | null;
}

/**
 * What to add to one page. Idempotent: price rows are planned only while the page has none, and
 * reviews only while it has none pinned — a page that already has some is reported and skipped.
 * A catalog scenario is matched by its exact string; one that is missing is skipped and reported.
 */
export function planPagePins(
  page: Pick<AdminPage, "slug" | "pricingRows" | "reviews">,
  catalog: readonly { id: number; scenario: string }[],
  reviewPool: readonly PinReview[],
  n: number = REVIEWS_PER_PAGE,
): PagePinPlan {
  const plan: PagePinPlan = {
    slug: page.slug,
    priceRows: [],
    missingScenarios: [],
    priceSkipReason: null,
    reviews: [],
    reviewSkipReason: null,
  };

  const scenarios = PRICE_PINS_BY_SLUG[page.slug];
  if (page.pricingRows.length > 0) {
    plan.priceSkipReason = `already has ${page.pricingRows.length} price row(s)`;
  } else if (!scenarios) {
    plan.priceSkipReason = "no price table defined for this page";
  } else {
    const idByScenario = new Map(catalog.map((c) => [c.scenario, c.id]));
    for (const scenario of scenarios) {
      const pricingItemId = idByScenario.get(scenario);
      if (pricingItemId === undefined) plan.missingScenarios.push(scenario);
      else plan.priceRows.push({ pricingItemId, sortOrder: plan.priceRows.length, noteOverride: null, scenario });
    }
    if (plan.priceRows.length === 0) plan.priceSkipReason = "none of its scenarios matched the catalog";
  }

  if (page.reviews.length > 0) {
    plan.reviewSkipReason = `already has ${page.reviews.length} pinned review(s)`;
  } else {
    plan.reviews = selectReviewsForPage(reviewPool, page.slug, n).map((s, i) => ({
      ...s,
      reviewId: s.review.id,
      sortOrder: i,
    }));
    if (plan.reviews.length === 0) plan.reviewSkipReason = "no eligible reviews in the CMS pool";
  }
  return plan;
}

/* ------------------------------------------------------------------ *
 * The full-children PUT, and the check that it kept the page intact
 * ------------------------------------------------------------------ */

// The update endpoint replaces EVERY child collection with what the body carries, so each one is
// rebuilt from the page it read. Server-only fields (child ids, hero asset expansion, dates) are
// left out.
const faqBody = (f: AdminPage["faqs"][number]) => ({
  question: f.question,
  answer: f.answer,
  sortOrder: f.sortOrder,
  faqItemId: f.faqItemId,
});
const linkBody = (l: AdminPage["relatedLinks"][number]) => ({
  targetPageId: l.targetPageId,
  staticHref: l.staticHref,
  labelOverride: l.labelOverride,
  linkGroup: l.linkGroup,
  sortOrder: l.sortOrder,
});
const priceBody = (r: { pricingItemId: number; sortOrder: number; noteOverride: string | null }) => ({
  pricingItemId: r.pricingItemId,
  sortOrder: r.sortOrder,
  noteOverride: r.noteOverride,
});
const reviewBody = (r: { reviewId: number; sortOrder: number }) => ({
  reviewId: r.reviewId,
  sortOrder: r.sortOrder,
});
const serviceBody = (s: AdminPage["services"][number]) => ({
  serviceId: s.serviceId,
  sortOrder: s.sortOrder,
});

/**
 * The PUT body for `page` with the plan's pins added. Everything else — data, FAQs, related
 * links, services and any pins the page already has — is carried over unchanged; the planned pins
 * go after the existing ones. Does not modify `page`.
 */
export function buildUpdateBody(page: AdminPage, plan: Pick<PagePinPlan, "priceRows" | "reviews">) {
  return {
    id: page.id,
    templateType: page.templateType,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    noIndex: page.noIndex,
    status: page.status,
    heroImageAssetId: page.heroImageAssetId,
    socialImageAssetId: page.socialImageAssetId,
    data: page.data,
    faqs: page.faqs.map(faqBody),
    relatedLinks: page.relatedLinks.map(linkBody),
    pricingRows: [...page.pricingRows.map(priceBody), ...plan.priceRows.map(priceBody)],
    reviews: [...page.reviews.map(reviewBody), ...plan.reviews.map(reviewBody)],
    services: page.services.map(serviceBody),
  };
}

/** JSON with object keys sorted, so two equal documents compare equal whatever their key order. */
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  );
}

/**
 * Compares the page as re-read after the write (`after`) with the page as read before (`before`)
 * plus the plan's pins. Returns one message per difference; an empty list means the write kept
 * everything intact. Child ids, ordering and JSON key order are ignored.
 */
export function diffPageState(
  before: AdminPage,
  after: AdminPage,
  plan: Pick<PagePinPlan, "priceRows" | "reviews">,
): string[] {
  const problems: string[] = [];

  for (const key of [
    "templateType",
    "slug",
    "title",
    "seoTitle",
    "seoDescription",
    "noIndex",
    "status",
    "heroImageAssetId",
    "socialImageAssetId",
  ] as const) {
    if (before[key] !== after[key]) {
      problems.push(`${key} changed: ${JSON.stringify(before[key])} -> ${JSON.stringify(after[key])}`);
    }
  }
  if (canonicalJson(before.data) !== canonicalJson(after.data)) problems.push("data changed");

  const sameSet = (label: string, expected: readonly unknown[], found: readonly unknown[]) => {
    const a = expected.map(canonicalJson).sort();
    const b = found.map(canonicalJson).sort();
    if (a.length !== b.length || a.some((row, i) => row !== b[i])) {
      problems.push(`${label} differ (${a.length} expected, ${b.length} found)`);
    }
  };
  sameSet("faqs", before.faqs.map(faqBody), after.faqs.map(faqBody));
  sameSet("relatedLinks", before.relatedLinks.map(linkBody), after.relatedLinks.map(linkBody));
  sameSet("services", before.services.map(serviceBody), after.services.map(serviceBody));
  sameSet(
    "pricingRows",
    [...before.pricingRows, ...plan.priceRows].map(priceBody),
    after.pricingRows.map(priceBody),
  );
  sameSet(
    "reviews",
    [...before.reviews, ...plan.reviews].map(reviewBody),
    after.reviews.map(reviewBody),
  );
  return problems;
}
