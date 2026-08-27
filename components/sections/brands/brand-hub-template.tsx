import { Phone, Search, Tag } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { FAQSection } from "@/components/page/faq-section";
import { CallNowButton, ctaSecondaryClass } from "@/components/page/cta-buttons";
import { SectionHeading } from "@/components/page/section-heading";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/config/site";
import { BrandTicker } from "./brand-ticker";
import { BrandFinder } from "./brand-finder";
import { BrandDirectory } from "./brand-directory";
import { BrandFactsTable } from "./brand-facts-table";
import { BadgeGuide } from "./badge-guide";
import { DealerStrip } from "./dealer-strip";
import type { FAQ } from "@/types";
import type { BrandEntity, BrandHub, HubTile } from "@/types/brand";

interface BrandHubTemplateProps {
  hub: BrandHub;
  tiles: HubTile[];
  /** Hub FAQs with `{{price:*}}` tokens already resolved by the route. */
  faqs: FAQ[];
  /** Every brand entity, both kinds — DealerStrip filters this down to the hub's kind itself. */
  entities: BrandEntity[];
}

/** Hub hero: one column, because the wall and the ticker below are the page's imagery. */
function BrandHubHero({ hub, tiles }: { hub: BrandHub; tiles: HubTile[] }) {
  const guides = tiles.filter((t) => t.href).length;
  const dealers = tiles.filter((t) => t.entity.dealer).length;
  const noun = hub.kind === "motor" ? "motor" : "door";
  const stats = [
    { value: tiles.length, label: `${noun} brands listed` },
    { value: guides, label: guides === 1 ? "in-depth guide" : "in-depth guides" },
    { value: dealers, label: "we're a dealer for" },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-[#0f4e9b]/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0f4e9b]/20 bg-[#0f4e9b]/8 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-[#0f4e9b] uppercase sm:text-xs">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              Brand directory · Perth, WA
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-balance font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.06] font-black tracking-tight text-foreground">
              {hub.hero.h1}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hub.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <CallNowButton />
              <a href="#find-your-brand" className={ctaSecondaryClass}>
                <Search className="h-4 w-4" aria-hidden="true" />
                Find your brand
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24} className="w-full">
            <dl className="mx-auto grid w-full max-w-lg grid-cols-3 gap-3 pt-2 sm:gap-8">
              {stats.map((stat) => (
                // Value above label visually, but `dt` (the label) still precedes `dd` in the DOM
                // so the pair reads correctly to a screen reader — hence flex-col-reverse.
                <div key={stat.label} className="flex flex-col-reverse text-center">
                  <dt className="mt-0.5 text-[11px] font-semibold tracking-wide text-balance text-muted-foreground uppercase sm:text-xs">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * The brand hub template — one component serves both /garage-door-brands-perth and
 * /garage-door-motor-brands-perth, differing only by `hub.kind`.
 *
 * Reading order matches how someone actually arrives: they know a name (the finder), or they
 * don't (the badge guide, linked from the finder's empty state). Everything between is the
 * crawlable payload — the full brand wall and a real comparison table, both server-rendered.
 *
 * JSON-LD (CollectionPage + ItemList + FAQPage) is emitted at the route level via `brandHubSchemas`;
 * BreadcrumbList comes from `<Breadcrumbs>` below.
 */
export function BrandHubTemplate({ hub, tiles, faqs, entities }: BrandHubTemplateProps) {
  const noun = hub.kind === "motor" ? "motor" : "door";

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: hub.name, url: `/${hub.slug}` },
          ]}
        />
      </Container>

      <BrandHubHero hub={hub} tiles={tiles} />

      <BrandTicker entities={tiles.map((t) => t.entity)} />

      <BrandFinder kind={hub.kind} tiles={tiles} />

      {hub.intro.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Start here"
              title={`What the brand on your garage ${noun} actually tells you`}
            />
            <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-10">
              {hub.intro.map((paragraph, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="text-pretty leading-relaxed text-muted-foreground">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <BrandDirectory kind={hub.kind} tiles={tiles} />

      <BrandFactsTable kind={hub.kind} tiles={tiles} />

      <BadgeGuide kind={hub.kind} />

      <DealerStrip entities={entities} kind={hub.kind} />

      <FAQSection
        eyebrow="Brand questions"
        title={`Garage ${noun} brands — your questions answered`}
        faqs={faqs}
      />

      <CTASection
        heading={`Whatever brand is on your garage ${noun}, we work on it`}
        body="Same-day slots across Perth. Tell us the brand — or send a photo of the label — and we'll quote the job before we start."
        buttons={[
          {
            label: `Call ${siteConfig.business.phoneDisplay}`,
            href: `tel:${siteConfig.business.phone}`,
            icon: <Phone className="h-4 w-4" aria-hidden="true" />,
          },
          { label: "Get a free quote", href: "/quote", variant: "outline" },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
