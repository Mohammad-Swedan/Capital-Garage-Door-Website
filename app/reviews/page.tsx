import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { RatingSummaryCard } from "@/components/sections/reviews/rating-summary-card";
import { FeaturedReviews } from "@/components/sections/reviews/featured-reviews";
import { ReviewsFilterSection } from "@/components/sections/reviews/reviews-filter-section";
import { TrustCards } from "@/components/page/trust-cards";
import { getReviews, getFeaturedReviews, getReviewsSummary } from "@/lib/data/reviews";
import { aggregateReviewSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { REVIEW_SERVICE_OPTIONS, REVIEW_SUBURB_OPTIONS } from "@/types/review";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Reviews Perth | Capital Garage Door",
  description:
    "Read genuine reviews from Perth customers about Capital Garage Door's repair, installation, and servicing work — then see why local homeowners trust us.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const phone = siteConfig.business.phone;
  const [reviews, featuredReviews, summary] = await Promise.all([
    getReviews(),
    getFeaturedReviews(),
    getReviewsSummary(),
  ]);

  return (
    <>
      <JsonLd data={aggregateReviewSchema(summary, featuredReviews)} />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Reviews", url: "/reviews" }]} />
      </Container>

      <PageHero
        eyebrow="Trusted Across Perth"
        title="Garage Door Reviews from Perth Customers"
        subtitle="See what local customers say about Capital Garage Doors."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <RatingSummaryCard summary={summary} />

      <FeaturedReviews reviews={featuredReviews} />

      <ReviewsFilterSection
        heading="Reviews by Service"
        reviews={reviews}
        options={REVIEW_SERVICE_OPTIONS}
        filterBy="service"
      />

      <ReviewsFilterSection
        heading="Reviews by Suburb"
        reviews={reviews}
        options={REVIEW_SUBURB_OPTIONS}
        filterBy="suburb"
      />

      <CTASection
        heading="Had a great experience with Capital Garage Doors?"
        body="Your feedback helps other Perth homeowners find a garage door technician they can trust."
        buttons={[{ label: "Leave a Google Review", href: summary.googleWriteReviewUrl }]}
      />

      <TrustCards
        eyebrow="Why Perth Trusts Us"
        title="Backed by Warranty, Local Service, and Clear Pricing"
        description="Every review reflects the same standard we hold ourselves to on every job."
        reasons={[
          { title: "Warranty Support", description: "Parts and labour backed by a workmanship warranty on every repair and install.", icon: "ShieldCheck" },
          { title: "Local Perth Service", description: "Technicians who know Perth suburbs and turn up when they say they will.", icon: "MapPin" },
          { title: "Professional Team", description: "Licensed, insured, and trained technicians — not subcontracted strangers.", icon: "BadgeCheck" },
          { title: "Clear Quotes", description: "Upfront pricing before any work starts, with no surprise call-out fees.", icon: "FileText" },
        ]}
      />

      <CTASection
        heading="Ready to book a trusted garage door specialist?"
        body="Join hundreds of happy Perth customers — get fast, professional service today."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
