import { siteConfig } from "@/config/site";
import type { BreadcrumbItem, FAQ, Problem, Service } from "@/types";
import type { ServicePage, ServiceReview } from "@/types/service-page";
import type { ComparisonPage } from "@/types/comparison-page";
import type { CostGuidePage } from "@/types/cost-guide";
import type { Article } from "@/types/article";
import type { CaseStudyPage } from "@/types/case-study";
import type { LandingPage } from "@/types/landing-page";
import type { Review, ReviewsSummary } from "@/types/review";
import type { CoverageRegion } from "@/types/coverage-area";

/* ------------------------------------------------------------------ *
 * Shared helpers
 * ------------------------------------------------------------------ */

/** Resolve a possibly-relative path/URL to an absolute URL against the site origin. */
function absUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return siteConfig.url;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, siteConfig.url).toString();
}

/** Drop `undefined` values so optional schema fields are simply omitted, not serialized as null. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** A reusable Organization reference for publisher/author/provider links (with sameAs). */
function organizationRef() {
  const { business } = siteConfig;
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return compact({
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absUrl("/images/CGD-logo-with-text.png"),
    },
    telephone: business.phone,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  });
}

/** A provider reference (HomeAndConstructionBusiness) for Service nodes. */
function providerRef() {
  return {
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    telephone: siteConfig.business.phone,
    url: siteConfig.url,
  };
}

/** Build a schema.org ImageObject for a hero/featured image (absolute URL). */
export function imageObject(src: string, alt?: string) {
  return compact({
    "@type": "ImageObject",
    url: absUrl(src),
    ...(alt ? { caption: alt } : {}),
  });
}

/**
 * Builds the site-wide LocalBusiness JSON-LD schema (NAP, hours, geo).
 *
 * Pass the live reviews summary to embed `aggregateRating` — this is what makes
 * Google show ⭐ star rich snippets against the brand across the site, not just
 * on /reviews. Omit it (or pass zero reviews) and the node is left off cleanly.
 */
export function localBusinessSchema(
  rating?: { ratingValue: number; reviewCount: number },
  areaServedNames?: string[],
) {
  const { business } = siteConfig;

  // Only emit address fields that are actually filled in — shipping empty
  // `streetAddress`/`postalCode` strings is worse for local SEO than omitting
  // them. Locality/region/country are always present.
  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: business.address.addressLocality,
    addressRegion: business.address.addressRegion,
    addressCountry: business.address.addressCountry,
  };
  if (business.address.streetAddress) address.streetAddress = business.address.streetAddress;
  if (business.address.postalCode) address.postalCode = business.address.postalCode;

  // `sameAs` (links to the business's social/Google profiles) is a real local
  // ranking signal — populated automatically as soon as the URLs are set in
  // siteConfig.social.
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    legalName: business.legalName,
    url: siteConfig.url,
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange,
    image: new URL(siteConfig.ogImage, siteConfig.url).toString(),
    address,
    // When the served-suburb list is supplied (from the CMS service-area catalog),
    // enumerate every suburb as a City — a stronger multi-suburb local signal than a
    // single locality. Falls back to the head-office locality when none is passed.
    areaServed:
      areaServedNames && areaServedNames.length > 0
        ? areaServedNames.map((name) => ({ "@type": "City", name }))
        : { "@type": "City", name: business.address.addressLocality },
    ...(business.geo.latitude && business.geo.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(rating && rating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.ratingValue,
            reviewCount: rating.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    openingHoursSpecification: business.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.opens,
        closes: h.closes,
      })),
  };
}

/** Site-wide Organization JSON-LD (brand entity; sameAs links the Google/social profiles). */
export function organizationSchema() {
  const { business } = siteConfig;
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: business.legalName,
    url: siteConfig.url,
    logo: new URL("/images/CGD-logo-with-text.png", siteConfig.url).toString(),
    image: new URL(siteConfig.ogImage, siteConfig.url).toString(),
    telephone: business.phone,
    email: business.email,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Site-wide WebSite JSON-LD. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-AU",
  };
}

/**
 * Builds Organization + ContactPoint JSON-LD for the /contact page so search
 * engines and AI assistants can read the canonical phone/email/contact method
 * (eligibility for the local knowledge panel's contact actions).
 */
export function contactPointSchema() {
  const { business } = siteConfig;
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: business.email,
    telephone: business.phone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: business.phone,
        email: business.email,
        contactType: "customer service",
        areaServed: business.address.addressRegion,
        availableLanguage: ["English"],
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  });
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: providerRef(),
    areaServed: siteConfig.business.address.addressRegion,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, siteConfig.url).toString(),
    })),
  };
}

/** Builds Article JSON-LD for educational/problem pages (helps AEO/GEO surfacing). */
export function articleSchema(problem: Problem) {
  const url = new URL(`/problems/${problem.slug}`, siteConfig.url).toString();
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: problem.h1,
    description: problem.metaDescription,
    ...(problem.updatedAt
      ? { datePublished: problem.updatedAt, dateModified: problem.updatedAt }
      : {}),
    image: problem.heroImage ? imageObject(problem.heroImage, problem.h1) : undefined,
    author: organizationRef(),
    publisher: organizationRef(),
    about: problem.name,
    mainEntityOfPage: url,
  });
}

/**
 * Builds Service JSON-LD for flat service landing pages (e.g. /garage-door-repairs-perth).
 *
 * When the page has pinned reviews, embeds `aggregateRating` (averaged from the
 * pinned reviews) so the Service node is eligible for ⭐ star rich results.
 */
export function serviceLandingSchema(data: ServicePage) {
  const rating = aggregateFromServiceReviews(data.reviews);
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.serviceName,
    description: data.directAnswer,
    url: new URL(`/${data.slug}`, siteConfig.url).toString(),
    image: data.hero?.image ? imageObject(data.hero.image, data.hero.imageAlt) : undefined,
    provider: providerRef(),
    areaServed: {
      "@type": "City",
      name: siteConfig.business.address.addressLocality,
    },
    serviceType: data.serviceName,
    ...(rating ? { aggregateRating: rating } : {}),
  });
}

/** Builds Service JSON-LD for Google Ads / paid landing pages (e.g. /lp/emergency-garage-door-repair). */
export function landingPageSchema(data: LandingPage) {
  const rating = aggregateFromReviews(data.reviews.items);
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.serviceLabel,
    description: data.directAnswer ?? data.seo.description,
    url: new URL(`/lp/${data.slug}`, siteConfig.url).toString(),
    provider: providerRef(),
    areaServed: {
      "@type": "City",
      name: siteConfig.business.address.addressLocality,
    },
    serviceType: data.serviceLabel,
    ...(rating ? { aggregateRating: rating } : {}),
  });
}

/** Builds Article JSON-LD for comparison/guide pages (helps AEO/GEO surfacing). */
export function comparisonArticleSchema(data: ComparisonPage) {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.hero.h1,
    description: data.seo.description,
    ...(data.updatedAt ? { datePublished: data.updatedAt, dateModified: data.updatedAt } : {}),
    author: organizationRef(),
    publisher: organizationRef(),
    about: data.topicLabel,
    mainEntityOfPage: new URL(`/${data.slug}`, siteConfig.url).toString(),
  });
}

/** Builds Article + Service JSON-LD for cost-guide pages (helps AEO/GEO surfacing of pricing answers). */
export function costGuideSchema(data: CostGuidePage) {
  const url = new URL(`/${data.slug}`, siteConfig.url).toString();

  return [
    compact({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.hero.h1,
      description: data.seo.description,
      ...(data.updatedAt ? { datePublished: data.updatedAt, dateModified: data.updatedAt } : {}),
      author: organizationRef(),
      publisher: organizationRef(),
      about: data.topicLabel,
      mainEntityOfPage: url,
    }),
    compact({
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.topicLabel,
      description: data.directAnswer,
      url,
      provider: providerRef(),
      areaServed: {
        "@type": "City",
        name: siteConfig.business.address.addressLocality,
      },
      // Pricing rows surfaced as Offers so Google can read indicative prices (AUD).
      ...(costGuideOffers(data) ? { offers: costGuideOffers(data) } : {}),
    }),
  ];
}

/**
 * Maps cost-guide table rows that carry an indicative price into schema.org
 * Offers (priceCurrency AUD). Rows without a `priceRange` are skipped. Returns
 * undefined when no row has a price (so the `offers` key is omitted entirely).
 *
 * Price strings like "$220–$450" / "From $180" are parsed into a numeric
 * `priceSpecification` (min/max) where possible; the human label is preserved
 * in the Offer `description` so the markup never loses the original wording.
 */
export function costGuideOffers(data: CostGuidePage) {
  const offers = data.costTable.rows
    .filter((row) => row.priceRange && row.priceRange.trim().length > 0)
    .map((row) => {
      const parsed = parsePriceRange(row.priceRange!);
      return compact({
        "@type": "Offer",
        name: row.repairType,
        description: row.priceRange,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        ...(parsed
          ? {
              priceSpecification: compact({
                "@type": "PriceSpecification",
                priceCurrency: "AUD",
                minPrice: parsed.min,
                maxPrice: parsed.max,
              }),
            }
          : {}),
      });
    });
  return offers.length > 0 ? offers : undefined;
}

/** Parse "$220–$450", "$180 - $300", "From $180", "$250" into numeric min/max. */
function parsePriceRange(label: string): { min?: number; max?: number } | null {
  const nums = (label.match(/\d[\d,]*/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
  if (nums.length === 0) return null;
  if (nums.length === 1) {
    // "From $180" → min only; a bare "$250" → treat as both min and max.
    return /from/i.test(label) ? { min: nums[0] } : { min: nums[0], max: nums[0] };
  }
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

/** Builds Article JSON-LD for blog/guide articles (e.g. /blog/{slug}) — helps AEO/GEO surfacing. */
export function blogArticleSchema(article: Article) {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo.description,
    image: article.featuredImage
      ? imageObject(article.featuredImage, article.featuredImageAlt)
      : undefined,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: compact({
      "@type": "Person",
      name: article.author,
      worksFor: organizationRef(),
    }),
    publisher: organizationRef(),
    articleSection: article.category,
    mainEntityOfPage: new URL(`/blog/${article.slug}`, siteConfig.url).toString(),
  });
}

/** Builds Article JSON-LD for completed-job case-study pages (helps AEO/GEO surfacing of local proof). */
export function caseStudySchema(data: CaseStudyPage) {
  const heroImage = data.images?.[0];
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.seo.description,
    ...(data.updatedAt ? { datePublished: data.updatedAt, dateModified: data.updatedAt } : {}),
    image: heroImage ? imageObject(heroImage.src, heroImage.alt) : undefined,
    author: organizationRef(),
    publisher: organizationRef(),
    about: data.service,
    mainEntityOfPage: new URL(`/case-studies/${data.slug}`, siteConfig.url).toString(),
  });
}

/** Builds LocalBusiness + aggregateRating + review[] JSON-LD for the /reviews page (Google star rich snippets). */
export function aggregateReviewSchema(summary: ReviewsSummary, reviews: Review[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.business.phone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: summary.averageRating,
      reviewCount: summary.totalReviews,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.customerName,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.text,
      datePublished: review.date,
    })),
  };
}

/** Builds CollectionPage JSON-LD for index/listing pages (e.g. /blog, /gallery). */
export function collectionPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: new URL(path, siteConfig.url).toString(),
  };
}

/** Builds LocalBusiness + areaServed JSON-LD for the /service-areas suburb directory. */
export function serviceAreasSchema(regions: CoverageRegion[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    telephone: siteConfig.business.phone,
    url: new URL("/service-areas", siteConfig.url).toString(),
    areaServed: regions.flatMap((region) =>
      region.suburbs.map((suburb) => ({
        "@type": "City",
        name: suburb.name,
      })),
    ),
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ------------------------------------------------------------------ *
 * AEO / rich-result builders (added by SEO/AEO pass)
 * ------------------------------------------------------------------ */

/**
 * Builds HowTo JSON-LD from a problem page's safe self-checks ("what to do").
 *
 * Maps the `safeChecks` into ordered HowToStep items — these are the
 * do-it-yourself steps a homeowner can safely follow, which is exactly what
 * Google's HowTo rich result is for. `doNotDo` is intentionally NOT included as
 * a step (negative instructions aren't valid HowToSteps); it stays in the FAQ /
 * page copy. Returns null when there are no safe steps so the caller can omit it.
 */
export function howToSchema(problem: Problem) {
  if (!problem.safeChecks || problem.safeChecks.length === 0) return null;
  return compact({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `What to do: ${problem.name}`,
    description: problem.directAnswer || problem.metaDescription,
    image: problem.heroImage ? absUrl(problem.heroImage) : undefined,
    totalTime: "PT10M",
    step: problem.safeChecks.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text.length > 70 ? `Step ${i + 1}` : text,
      text,
    })),
  });
}

/** Average a list of {rating} into a 1-decimal AggregateRating, or null if empty. */
function buildAggregateRating(ratings: number[]) {
  const valid = ratings.filter((r) => typeof r === "number" && r > 0);
  if (valid.length === 0) return null;
  const avg = valid.reduce((sum, r) => sum + r, 0) / valid.length;
  return {
    "@type": "AggregateRating",
    ratingValue: Math.round(avg * 10) / 10,
    reviewCount: valid.length,
    bestRating: 5,
    worstRating: 1,
  };
}

/** AggregateRating from the flat ServiceReview[] carried by a ServicePage. */
export function aggregateFromServiceReviews(reviews: ServiceReview[] | undefined) {
  if (!reviews || reviews.length === 0) return null;
  return buildAggregateRating(reviews.map((r) => r.rating));
}

/** AggregateRating from full Review[] (landing pages). */
export function aggregateFromReviews(reviews: Review[] | undefined) {
  if (!reviews || reviews.length === 0) return null;
  return buildAggregateRating(reviews.map((r) => r.rating));
}

/**
 * Builds a list of schema.org Review nodes from a page's pinned reviews, each
 * attached (via `itemReviewed`) to the page's Service so the reviews are
 * eligible for star rich results in context. Returns [] when there are none.
 */
export function reviewSchemasFromServiceReviews(
  reviews: ServiceReview[] | undefined,
  itemReviewedName: string,
) {
  if (!reviews || reviews.length === 0) return [];
  return reviews.map((r) =>
    compact({
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "Service", name: itemReviewedName, provider: providerRef() },
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.text,
    }),
  );
}

/** Review nodes from full Review[] (landing pages) — includes datePublished. */
export function reviewSchemasFromReviews(reviews: Review[] | undefined, itemReviewedName: string) {
  if (!reviews || reviews.length === 0) return [];
  return reviews.map((r) =>
    compact({
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "Service", name: itemReviewedName, provider: providerRef() },
      author: { "@type": "Person", name: r.customerName },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.text,
      datePublished: r.date || undefined,
    }),
  );
}

/**
 * Builds a WebPage node carrying a SpeakableSpecification — tells voice
 * assistants which on-page regions are the best short, spoken answer.
 *
 * Targets the page `<h1>` (always present) and the FAQ question triggers, which
 * are the canonical "direct answer" surfaces on these templates. Uses
 * `cssSelector` against classes/tags already in the markup, so it adds NO
 * visible DOM. Pass extra selectors for a page's specific answer block.
 */
export function speakableSchema(path: string, extraSelectors: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absUrl(path),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ...extraSelectors],
    },
  };
}
