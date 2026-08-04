import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Search, Clock, MapPin, ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CoverageRegions } from "@/components/sections/service-areas/coverage-regions";
import { SuburbSearch } from "@/components/sections/service-areas/suburb-search";
import { CallNowButton, GetQuoteButton } from "@/components/page/cta-buttons";
import { getServiceAreaRegions } from "@/lib/data/service-area-regions";
import { getReviewsSummary } from "@/lib/data/reviews";
import { serviceAreasSchema, faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import type { FAQ } from "@/types";

// Target queries (GSC 2026-08: this page already ranks ~10 for "garage door repairs perth
// northern suburbs", 40/mo @ $36.76 CPC; "southern suburbs" lands on the homepage instead).
// Title carries both corridors; body/FAQs carry the exact phrases.
export const metadata: Metadata = buildMetadata({
  title: "Garage Door Repairs Perth — Northern & Southern Suburbs",
  description:
    "Same-day garage door repairs across every Perth suburb — northern suburbs from Joondalup to Two Rocks, south to Mandurah. Search your suburb & call now.",
  path: "/service-areas",
});

// PAA-sourced (DataForSEO 2026-08-04: cost / where in Perth / most common problem) plus the
// coverage questions the suburb finder answers. No prices here — cost intent is linked to the
// catalog-pinned cost guides instead (prices must only ever come from CMS PricingItems).
const COVERAGE_FAQS: FAQ[] = [
  {
    question: "Which Perth suburbs do you cover for garage door repairs?",
    answer:
      "All of them — Capital Garage Doors covers the entire Perth metro area, from Two Rocks and Yanchep in the north to Mandurah in the south, and from the coast up into the Perth Hills. The directory on this page lists the suburbs we visit most; suburbs with a dedicated local page are linked so you can see guide prices and recent jobs nearby.",
  },
  {
    question: "Do you repair garage doors in Perth's northern suburbs?",
    answer:
      "Yes — the northern suburbs are one of our busiest corridors. Technicians are in Joondalup, Wanneroo, Morley, Ellenbrook and the suburbs between them most days, handling broken springs, snapped cables, doors off their tracks and motor faults — usually same-day.",
  },
  {
    question: "Do you cover Perth's southern suburbs?",
    answer:
      "Yes — we run daily jobs through the southern corridor: Canning Vale, Thornlie, Gosnells, Armadale, Baldivis, Rockingham and down to Mandurah. Same-day repairs apply across the south, and 24/7 emergency call-outs are available.",
  },
  {
    question: "My suburb isn't listed — can you still help?",
    answer:
      "Almost certainly, yes. The directory lists the suburbs we service most often, but coverage is genuinely Perth-wide — if you're anywhere in the metro area, call with your address and we'll confirm coverage and book a time on the spot.",
  },
  {
    question: "Where can I get my garage door repaired in Perth?",
    answer:
      "You don't need to take the door anywhere — garage door repair is a mobile trade. A technician comes to your home with the common parts on board (springs, cables, rollers, remotes), diagnoses the fault on-site, and completes most repairs in a single visit, anywhere in the Perth metro area.",
  },
  {
    question: "How quickly can a technician reach my suburb?",
    answer:
      "Same-day in most of the metro area. If your door is stuck open, won't close, or the car is trapped inside, 24/7 emergency call-outs run across all of Perth — call and we'll give you an honest arrival window for your suburb.",
  },
];

export default async function ServiceAreasPage() {
  const phone = siteConfig.business.phone;
  const [regions, reviews] = await Promise.all([getServiceAreaRegions(), getReviewsSummary()]);
  const totalSuburbs = regions.reduce((sum, region) => sum + region.suburbs.length, 0);

  const stats = [
    { icon: MapPin, label: `${totalSuburbs} suburbs · ${regions.length} regions` },
    { icon: Clock, label: "Same-day service" },
    { icon: Phone, label: "24/7 emergency call-outs" },
    { icon: ShieldCheck, label: "Licensed & insured" },
  ];

  return (
    <>
      <JsonLd data={serviceAreasSchema(regions)} />
      <JsonLd data={faqSchema(COVERAGE_FAQS)} />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Service Areas", url: "/service-areas" }]} />
      </Container>

      <PageHero
        eyebrow="All Perth Metro · Same-Day Service"
        title="Garage Door Repairs Across Every Perth Suburb"
        subtitle="Northern suburbs, southern corridor, coast or hills — one local team covers the whole Perth metro area with same-day repairs, new door installations and 24/7 emergency call-outs."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Find Your Suburb",
            href: "#find-your-suburb",
            variant: "outline",
            icon: <Search className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <section className="bg-background pb-2 sm:pb-4">
        <Container>
          <Reveal>
            <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Capital Garage Doors provides same-day{" "}
                <Link href="/garage-door-repairs-perth" className="font-medium text-primary underline-offset-2 hover:underline">
                  garage door repairs
                </Link>{" "}
                across Perth&apos;s northern suburbs, southern suburbs and everywhere between — one mobile team
                covering the whole metro area, from Two Rocks to Mandurah. Broken spring, snapped cable, door off
                its tracks or a motor that&apos;s given up: a local technician comes to you with parts on board.
              </p>
              <p>
                We also handle{" "}
                <Link href="/garage-doors-perth" className="font-medium text-primary underline-offset-2 hover:underline">
                  new garage door installations
                </Link>{" "}
                and routine servicing in every suburb we cover, with{" "}
                <Link href="/emergency-garage-door-repairs-perth" className="font-medium text-primary underline-offset-2 hover:underline">
                  24/7 emergency call-outs
                </Link>{" "}
                when a door won&apos;t move. Not sure what a repair should cost? Start with our{" "}
                <Link href="/garage-door-service-cost-perth" className="font-medium text-primary underline-offset-2 hover:underline">
                  service cost guide
                </Link>
                .
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {stats.map((stat) => (
                <li
                  key={stat.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
                >
                  <stat.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {stat.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <SuburbSearch regions={regions} />

      <CoverageRegions regions={regions} />

      <FAQSection faqs={COVERAGE_FAQS} heading="Perth Coverage — FAQs" />

      {/* Closing conversion band — same visual language as CTASection, but with the live
          quote dialog + the single-source review figures (never hardcode rating/count). */}
      <section className="relative overflow-hidden bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_80%)]" />
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-cta/15 blur-[100px]" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0f4e9b]/30 blur-[100px]" />
        </div>
        <Container className="relative z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="max-w-2xl font-display text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
              Same-Day Garage Door Repairs, Wherever You Are in Perth
            </h2>
            <p className="max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              North, south, coast or hills — one call covers the whole metro area. If your suburb isn&apos;t
              listed above, we almost certainly still cover it.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <CallNowButton className="h-12 rounded-xl px-8 text-base" />
              <GetQuoteButton variant="ghost" className="h-12 rounded-xl px-8 text-base" />
            </div>
            <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-primary-foreground/70">
              {/* Review figures come from getReviewsSummary() only; hidden entirely if the
                  catalog is empty so we never render "0 Google reviews". */}
              {reviews.totalReviews > 0 && (
                <>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    {reviews.averageRating.toFixed(1)}
                  </span>
                  from{" "}
                  <Link href="/reviews" className="underline underline-offset-2 hover:text-white">
                    {reviews.totalReviews} Google reviews
                  </Link>
                  <span aria-hidden="true">·</span>
                </>
              )}
              Licensed &amp; insured technicians
            </p>
          </div>
        </Container>
      </section>

      <StickyMobileCta />
    </>
  );
}
