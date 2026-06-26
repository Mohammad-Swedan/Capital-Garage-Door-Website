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
  aggregateFromServiceReviews,
  localBusinessSchema,
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
 * | service       | Service(+aggregateRating+image) · FAQPage · Review[] · speakable      |
 * | problem       | Article · Service · HowTo · FAQPage · speakable                       |
 * | article       | Article(+author/publisher/image) · FAQPage · speakable               |
 * | comparison    | Article · FAQPage · speakable                                         |
 * | cost-guide    | Article · Service(+Offers) · FAQPage · speakable                      |
 * | case-study    | Article(+image) · FAQPage                                             |
 * | service-suburb| LocalBusiness · Service · FAQPage · speakable                         |
 * | landing       | Service(+aggregateRating) · FAQPage · Review[] · speakable            |
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
            ...reviewSchemasFromServiceReviews(data.reviews, data.serviceName),
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
      // Attach an AggregateRating to the page's Service node when reviews are pinned,
      // and emit each pinned review as its own Review node (star-rich-result eligible).
      const rating = aggregateFromServiceReviews(problem.reviews);
      const service = serviceSchema(pageAsService);
      return (
        <Nodes
          nodes={[
            articleSchema(problem),
            rating ? { ...service, aggregateRating: rating } : service,
            howToSchema(problem),
            ...reviewSchemasFromServiceReviews(problem.reviews, problem.name),
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
      const serviceLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: titleWithSuburb,
        serviceType: page.service,
        description: page.directAnswer,
        provider: {
          "@type": "HomeAndConstructionBusiness",
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
            localBusinessSchema(),
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
            ...reviewSchemasFromReviews(page.reviews.items, page.serviceLabel),
            speakableSchema(`/lp/${page.slug}`),
          ]}
        />
      );
    }
  }
}
