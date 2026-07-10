import { JsonLd } from "@/components/seo/json-ld";
import {
  serviceLandingSchema,
  comparisonArticleSchema,
  costGuideSchema,
  articleSchema,
  serviceSchema,
  blogArticleSchema,
  caseStudySchema,
  landingPageSchema,
  faqSchema,
  howToSchema,
  speakableSchema,
  reviewSchemasFromServiceReviews,
  reviewSchemasFromReviews,
  BUSINESS_ID,
} from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { ServicePage } from "@/types/service-page";
import type { ComparisonPage } from "@/types/comparison-page";
import type { CostGuidePage } from "@/types/cost-guide";
import type { Article } from "@/types/article";
import type { CaseStudyPage } from "@/types/case-study";
import type { LandingPage } from "@/types/landing-page";
import type { Problem, ServiceSuburbPage } from "@/types";

/**
 * Centralised, route-level JSON-LD emitter for every detail-page template.
 *
 * ## Why this exists
 * Schema used to live inside the section/template components (which Agent 7 will
 * restyle). To keep structured data and visuals in separate files forever, all
 * JSON-LD now renders from the **route file** via this single server component.
 * It is pure (no client hooks), so it stays server-rendered — the `<script
 * type="application/ld+json">` is in the initial HTML, which is what crawlers and
 * AI answer engines read.
 *
 * ## Contract
 * `<PageSchema kind="..." ... />` — discriminated by `kind`. Each variant takes
 * the same typed page object the template already consumes (so no extra data
 * fetching) and emits the correct superset of nodes for that template type:
 *
 * | kind          | nodes emitted                                                        |
 * |---------------|----------------------------------------------------------------------|
 * | service       | Service(+image) · FAQPage · Review[] · speakable                      |
 * | problem       | Article · Service · HowTo · FAQPage · speakable                       |
 * | article       | Article(+author/publisher/image) · FAQPage · speakable               |
 * | comparison    | Article · FAQPage · speakable                                         |
 * | cost-guide    | Article · Service(+Offers) · FAQPage · speakable                      |
 * | case-study    | Article(+image) · FAQPage                                             |
 * | service-suburb| LocalBusiness · Service · FAQPage · speakable                         |
 * | landing       | Service · FAQPage · Review[] · speakable                              |
 *
 * No `aggregateRating`/`review` is attached to any `Service` node — Google's
 * review-snippet feature only supports those properties on a fixed type list
 * (LocalBusiness, Organization, Product, …), not `Service`. Review[] nodes
 * point `itemReviewed` at the business `@id` instead (see `lib/seo/schema.ts`).
 *
 * BreadcrumbList is still emitted by `<Breadcrumbs>` (unchanged). LocalBusiness +
 * Organization + WebSite remain site-wide in `app/layout.tsx`.
 */
export type PageSchemaProps =
  | { kind: "service"; data: ServicePage }
  | { kind: "problem"; data: Problem }
  | { kind: "article"; data: Article }
  | { kind: "comparison"; data: ComparisonPage }
  | { kind: "cost-guide"; data: CostGuidePage }
  | { kind: "case-study"; data: CaseStudyPage }
  | { kind: "service-suburb"; data: ServiceSuburbPage }
  | { kind: "landing"; data: LandingPage };

/** Emit one `<JsonLd>` per node; arrays are flattened so each node is its own script tag. */
function Nodes({ nodes }: { nodes: Array<object | null | undefined> }) {
  return (
    <>
      {nodes
        .filter((n): n is object => Boolean(n))
        .map((node, i) => (
          <JsonLd key={i} data={node} />
        ))}
    </>
  );
}

export function PageSchema(props: PageSchemaProps) {
  switch (props.kind) {
    case "service": {
      const data = props.data;
      return (
        <Nodes
          nodes={[
            serviceLandingSchema(data),
            data.faqs.length ? faqSchema(data.faqs) : null,
            ...reviewSchemasFromServiceReviews(data.reviews),
            speakableSchema(`/${data.slug}`),
          ]}
        />
      );
    }

    case "problem": {
      const problem = props.data;
      // Reuse the Service schema shape for the page's own implicit "repair service".
      const pageAsService = {
        slug: problem.slug,
        name: problem.name,
        shortDescription: problem.heroSubtitle,
        description: problem.directAnswer,
        image: problem.heroImage ?? "",
        icon: "Wrench",
        canonicalHref: `/problems/${problem.slug}`,
      };
      // No aggregateRating on the page's Service node — Service isn't a
      // Google-supported host type for review-snippet properties (same fix as
      // serviceLandingSchema/landingPageSchema). Pinned reviews still surface
      // as standalone Review nodes pointing at the business.
      const service = serviceSchema(pageAsService);
      return (
        <Nodes
          nodes={[
            articleSchema(problem),
            service,
            howToSchema(problem),
            ...reviewSchemasFromServiceReviews(problem.reviews),
            problem.faqs.length ? faqSchema(problem.faqs) : null,
            speakableSchema(`/problems/${problem.slug}`),
          ]}
        />
      );
    }

    case "article": {
      const article = props.data;
      return (
        <Nodes
          nodes={[
            blogArticleSchema(article),
            article.faqs.length ? faqSchema(article.faqs) : null,
            speakableSchema(`/blog/${article.slug}`),
          ]}
        />
      );
    }

    case "comparison": {
      const data = props.data;
      return (
        <Nodes
          nodes={[
            comparisonArticleSchema(data),
            data.faqs.length ? faqSchema(data.faqs) : null,
            speakableSchema(`/${data.slug}`),
          ]}
        />
      );
    }

    case "cost-guide": {
      const data = props.data;
      return (
        <Nodes
          nodes={[
            ...costGuideSchema(data), // [Article, Service(+offers)]
            data.faqs.length ? faqSchema(data.faqs) : null,
            speakableSchema(`/${data.slug}`),
          ]}
        />
      );
    }

    case "case-study": {
      const data = props.data;
      return (
        <Nodes
          nodes={[
            caseStudySchema(data),
            data.faqs.length ? faqSchema(data.faqs) : null,
          ]}
        />
      );
    }

    case "service-suburb": {
      const page = props.data;
      const titleWithSuburb = `${page.service} ${page.suburb}`;
      // The site-wide business node is already on every page (app/layout.tsx
      // @graph); linking the provider by @id consolidates the entity instead of
      // emitting a second, competing LocalBusiness per suburb page.
      const serviceLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: titleWithSuburb,
        serviceType: page.service,
        description: page.directAnswer,
        provider: {
          "@type": "HomeAndConstructionBusiness",
          "@id": BUSINESS_ID,
          name: siteConfig.name,
          telephone: siteConfig.business.phone,
          url: siteConfig.url,
        },
        areaServed: {
          "@type": "City",
          name: `${page.suburb}, ${page.region}`,
        },
      };
      return (
        <Nodes
          nodes={[
            serviceLd,
            page.faqs.length ? faqSchema(page.faqs) : null,
            speakableSchema(`/${page.slug}`),
          ]}
        />
      );
    }

    case "landing": {
      const page = props.data;
      return (
        <Nodes
          nodes={[
            landingPageSchema(page),
            page.faqs.length ? faqSchema(page.faqs) : null,
            ...reviewSchemasFromReviews(page.reviews.items),
            speakableSchema(`/lp/${page.slug}`),
          ]}
        />
      );
    }
  }
}
