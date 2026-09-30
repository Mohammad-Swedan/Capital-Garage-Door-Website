import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText, EditablePricingRows } from "@/components/admin/editor/editable";
import { PriceGuideLinks } from "@/components/sections/price-guide-links";
import type { GuideLink } from "@/lib/pricing/guide-links";
import type { ServiceCostGuidance } from "@/types/service-page";

interface ServiceCostTableProps {
  heading?: string;
  costGuidance: ServiceCostGuidance;
  disclaimer?: string;
  /** Pricing-guide links (`priceLinksFor(slug)`): under the table, or in its place when empty. */
  links?: GuideLink[];
}

/**
 * Real `<table>` markup for crawlable cost guidance. Prices are intentionally indicative
 * ("from"/"varies"/"Request quote") until confirmed on inspection.
 *
 * A page with no pinned price rows renders no table (never an empty `<tbody>`): the pricing-guide
 * links take the table's slot instead, directly under the intro — which typically ends
 * "As a guide:" — so the section still points at real prices.
 */
export function ServiceCostTable({
  heading = "Cost Guidance",
  costGuidance,
  disclaimer = "Final pricing depends on the cause, parts required, and door size — confirmed on inspection before any work begins.",
  links = [],
}: ServiceCostTableProps) {
  const hasRows = costGuidance.rows.length > 0;

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {/* Intro is bespoke `data.costGuidanceIntro`; rows are catalog-driven
                pricing pins (PagePricingRows) managed in the Settings drawer. */}
            <EditableText path="costGuidance.intro" placeholder="Cost guidance intro…">
              {costGuidance.intro}
            </EditableText>
          </p>
        </Reveal>

        {hasRows ? (
          <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-primary/5">
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    Scenario
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    Guide Price
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-heading font-semibold text-foreground sm:table-cell sm:px-6 sm:py-4">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {costGuidance.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground sm:px-6 sm:py-4">{row.label}</td>
                    <td className="px-4 py-3 font-semibold text-cta sm:px-6 sm:py-4">{row.price}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                      {row.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ) : (
          // No lead label: the intro's closing "As a guide:" already introduces the links.
          <PriceGuideLinks links={links} lead="" className="mt-6 text-base" />
        )}

        {/* Editing-only cost-row editor (pick-or-create). Renders nothing on the public site. */}
        <EditablePricingRows
          path="costGuidance.rows"
          count={costGuidance.rows.length}
          items={costGuidance.rows}
        />

        <p className="mt-4 text-xs text-muted-foreground sm:text-sm">{disclaimer}</p>

        {hasRows && <PriceGuideLinks links={links} />}
      </Container>
    </section>
  );
}
