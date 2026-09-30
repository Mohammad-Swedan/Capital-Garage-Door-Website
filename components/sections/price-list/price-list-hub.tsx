import Link from "next/link";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Reveal } from "@/components/motion/reveal";
import { CostFactorsGrid } from "@/components/sections/cost-guide/cost-factors-grid";
import { RepairVsReplace } from "@/components/sections/cost-guide/repair-vs-replace";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { FAQSection } from "@/components/sections/faq-section";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { SmartCta } from "@/components/sections/smart-cta";
import { PriceListJumpNav } from "@/components/sections/price-list/price-list-jump-nav";
import { PriceListTable } from "@/components/sections/price-list/price-list-table";
import type { CostGuideCard } from "@/lib/data/cost-guides";
import type { ResolvedPriceList } from "@/types/price-list";

interface PriceListHubProps {
  list: ResolvedPriceList;
  /** The detailed cost guides, in display order. */
  guides: CostGuideCard[];
}

const LINK_CLASS = "font-medium text-primary underline underline-offset-4 hover:text-cta";

/**
 * The /cost-guides body below the hero: the quick answer, a jump nav, one anchored table per price
 * group (with the catalog's pricing-policy note as the disclaimer), the detailed cost guides, what
 * changes a price, repair vs replace, the FAQs and the conversion CTAs. The page's JSON-LD (price
 * list, FAQPage) is emitted by the route; the BreadcrumbList comes from its <Breadcrumbs>.
 */
export function PriceListHub({ list, guides }: PriceListHubProps) {
  return (
    <>
      <DirectAnswer id="direct-answer" answer={list.directAnswer} />

      <section className="bg-background pt-4">
        <Container>
          <p className="max-w-3xl text-muted-foreground">
            Want an estimate for your own door first? You can{" "}
            <Link href="/calculator" className={LINK_CLASS}>
              try the instant price calculator
            </Link>
            , which prices the job from the same list.
          </p>
        </Container>
      </section>

      <section className="bg-background py-10 sm:py-14">
        <Container>
          <PriceListJumpNav items={list.groups.map((group) => ({ id: group.id, label: group.navLabel ?? group.heading }))} />

          {list.groups.map((group) => (
            <section key={group.id} id={group.id} className="mt-12 scroll-mt-24 sm:mt-14">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {group.heading}
              </h2>
              <p className="mt-3 max-w-3xl text-muted-foreground">{group.intro}</p>
              <PriceListTable group={group} />
            </section>
          ))}

          <p className="mt-12 max-w-3xl rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground sm:p-5">
            <span className="font-semibold text-foreground">About these prices:</span> {list.policyNote}
          </p>
        </Container>
      </section>

      {guides.length > 0 && (
        <section className="bg-background py-14 sm:py-20">
          <Container>
            <Reveal>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Detailed Garage Door Cost Guides
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Each guide goes deeper on one kind of job: what the price includes, what moves it and how
                the quote works.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {guides.map((guide, index) => (
                <Reveal key={guide.href} delay={index * 0.05}>
                  <InternalLinkCard href={guide.href} title={guide.title} description={guide.description} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CostFactorsGrid heading={list.factors.heading} items={list.factors.items} />

      <RepairVsReplace data={list.repairVsReplace} />

      <FAQSection heading="Garage Door Price FAQs" faqs={list.faqs} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
