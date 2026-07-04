/**
 * Shared contract for the live booking system's embeddable quote widget
 * (https://booking-system-cgd.netlify.app/embed/quote — a separate app, not this repo).
 * Every "request a quote" surface on the site renders this embed instead of a local form,
 * so quote requests land directly in the CRM.
 */

export const BOOKING_EMBED_ORIGIN = "https://booking-system-cgd.netlify.app";

const QUOTE_EMBED_PATH = "/embed/quote";

/**
 * The full set of query params the quote widget accepts for pre-filling its form.
 * Anything else is ignored by the widget, so don't add keys here without booking-app support.
 */
export interface QuoteEmbedPrefill {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhone?: string;
  address?: string;
  address2?: string;
  suburb?: string;
  state?: string;
  postCode?: string;
  serviceId?: number;
}

/**
 * Live service ids from the booking system's catalog (GET {CRM}/api/Categories).
 * If services are re-created in the CRM admin these ids must be updated to match.
 */
export const BOOKING_SERVICE_IDS = {
  /** "Expert Garage Door Repairs" — motors, springs, cables + more. The default quote service. */
  repair: 3,
  /** "Free Installation Quote – By Phone". */
  installationQuote: 2,
  /** "Garage Door Tune-Up". */
  tuneUp: 7,
  /** "Emergency Repair". */
  emergency: 9,
} as const;

/** Build the iframe src, appending only the prefill params that have a value. */
export function buildQuoteEmbedSrc(prefill?: QuoteEmbedPrefill): string {
  const url = new URL(QUOTE_EMBED_PATH, BOOKING_EMBED_ORIGIN);
  if (prefill) {
    for (const [key, value] of Object.entries(prefill)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Map a human service/topic label (e.g. "Emergency Garage Door Repairs", "Roller vs
 * Sectional Doors") to the closest booking-system service id. Returns undefined when
 * nothing matches — the widget then shows its own service picker unprefilled.
 */
export function bookingServiceIdFor(text?: string): number | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  if (/emergency|after.?hours|urgent/.test(t)) return BOOKING_SERVICE_IDS.emergency;
  if (/install|new (garage |roller )?door|replacement door|supply/.test(t)) {
    return BOOKING_SERVICE_IDS.installationQuote;
  }
  if (/tune.?up|servicing|maintenance|annual service/.test(t)) return BOOKING_SERVICE_IDS.tuneUp;
  if (/repair|spring|cable|motor|opener|roller|track|panel|remote|sensor|stuck|off.?track|won.?t open|noisy/.test(t)) {
    return BOOKING_SERVICE_IDS.repair;
  }
  return undefined;
}
