import { siteConfig } from "@/config/site";
import type { BreadcrumbItem, FAQ, Problem, Service } from "@/types";
import type { ServicePage } from "@/types/service-page";
import type { ComparisonPage } from "@/types/comparison-page";
import type { CostGuidePage } from "@/types/cost-guide";
import type { Article } from "@/types/article";
import type { CaseStudyPage } from "@/types/case-study";
import type { LandingPage } from "@/types/landing-page";
import type { Review, ReviewsSummary } from "@/types/review";
import type { CoverageRegion } from "@/types/coverage-area";

/** Builds the site-wide LocalBusiness JSON-LD schema (NAP, hours, geo). */
export function localBusinessSchema() {
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
    areaServed: { "@type": "City", name: business.address.addressLocality },
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

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      telephone: siteConfig.business.phone,
    },
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: problem.h1,
    description: problem.metaDescription,
    datePublished: problem.updatedAt,
    dateModified: problem.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: problem.name,
    mainEntityOfPage: new URL(`/problems/${problem.slug}`, siteConfig.url).toString(),
  };
}

/** Builds Service JSON-LD for flat service landing pages (e.g. /garage-door-repairs-perth). */
export function serviceLandingSchema(data: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.serviceName,
    description: data.directAnswer,
    url: new URL(`/${data.slug}`, siteConfig.url).toString(),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      telephone: siteConfig.business.phone,
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.business.address.addressLocality,
    },
    serviceType: data.serviceName,
  };
}

/** Builds Service JSON-LD for Google Ads / paid landing pages (e.g. /lp/emergency-garage-door-repair). */
export function landingPageSchema(data: LandingPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.serviceLabel,
    description: data.directAnswer ?? data.seo.description,
    url: new URL(`/lp/${data.slug}`, siteConfig.url).toString(),
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      telephone: siteConfig.business.phone,
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.business.address.addressLocality,
    },
    serviceType: data.serviceLabel,
  };
}

/** Builds Article JSON-LD for comparison/guide pages (helps AEO/GEO surfacing). */
export function comparisonArticleSchema(data: ComparisonPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.hero.h1,
    description: data.seo.description,
    datePublished: data.updatedAt,
    dateModified: data.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: data.topicLabel,
    mainEntityOfPage: new URL(`/${data.slug}`, siteConfig.url).toString(),
  };
}

/** Builds Article + Service JSON-LD for cost-guide pages (helps AEO/GEO surfacing of pricing answers). */
export function costGuideSchema(data: CostGuidePage) {
  const url = new URL(`/${data.slug}`, siteConfig.url).toString();

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.hero.h1,
      description: data.seo.description,
      datePublished: data.updatedAt,
      dateModified: data.updatedAt,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      about: data.topicLabel,
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.topicLabel,
      description: data.directAnswer,
      url,
      provider: {
        "@type": "HomeAndConstructionBusiness",
        name: siteConfig.name,
        telephone: siteConfig.business.phone,
      },
      areaServed: {
        "@type": "City",
        name: siteConfig.business.address.addressLocality,
      },
    },
  ];
}

/** Builds Article JSON-LD for blog/guide articles (e.g. /blog/{slug}) — helps AEO/GEO surfacing. */
export function blogArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo.description,
    image: new URL(article.featuredImage, siteConfig.url).toString(),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: new URL("/images/CGD-logo-with-text.png", siteConfig.url).toString(),
      },
    },
    articleSection: article.category,
    mainEntityOfPage: new URL(`/blog/${article.slug}`, siteConfig.url).toString(),
  };
}

/** Builds Article JSON-LD for completed-job case-study pages (helps AEO/GEO surfacing of local proof). */
export function caseStudySchema(data: CaseStudyPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.seo.description,
    datePublished: data.updatedAt,
    dateModified: data.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: data.service,
    mainEntityOfPage: new URL(`/case-studies/${data.slug}`, siteConfig.url).toString(),
  };
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
