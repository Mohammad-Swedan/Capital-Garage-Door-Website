import type { FAQ, LocalProblem, TrustReason } from "@/types";
import type { Review } from "@/types/review";

/**
 * Google Ads / paid landing pages (served at /lp/[slug]).
 *
 * These are conversion-first pages with a minimal header, a lead form above the
 * fold and no full navigation. All copy lives in the content layer so new ad
 * pages are data entries (and later CMS records), not new components.
 */

/** A small trust badge shown in the hero (icon name + label). */
export interface LandingBadge {
  /** Icon name resolved via resolvePageIcon(). */
  icon: string;
  label: string;
}

export interface LandingPage {
  /** URL slug, e.g. "emergency-garage-door-repair". */
  slug: string;
  /** Tracking value posted with the lead form, e.g. "LandingPage:Emergency". */
  pageType: string;
  /** Prefilled form "service" value + name used in the Service JSON-LD. */
  serviceLabel: string;

  hero: {
    eyebrow?: string;
    h1: string;
    subtitle: string;
    badges: LandingBadge[];
  };

  /** Optional concise answer shown under the hero copy (AEO/GEO target). */
  directAnswer?: string;

  form: {
    heading: string;
    subheading?: string;
  };

  problems: {
    eyebrow?: string;
    heading: string;
    description?: string;
    items: LocalProblem[];
  };

  whyChoose: {
    eyebrow?: string;
    heading: string;
    description?: string;
    items: TrustReason[];
  };

  reviews: {
    heading: string;
    items: Review[];
  };

  serviceAreas: {
    heading: string;
    description?: string;
    /** Suburb labels rendered as chips that scroll to the on-page form. */
    suburbs: string[];
  };

  faqs: FAQ[];

  finalCta: {
    heading: string;
    body?: string;
  };

  seo: {
    title: string;
    description: string;
  };
}
