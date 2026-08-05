import Link from "next/link";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/schema";
import { FAQSection } from "@/components/sections/faq-section";
import {
  PRICING_BY_ID,
  EMERGENCY_SURCHARGE,
  type PricingScenario,
} from "@/components/sections/smart-calculator/pricing-data";
import type { FAQ } from "@/types";

/**
 * Crawlable content below the full-viewport calculator tool. The 2026-08-05
 * Semrush audit flagged /calculator for "low word count" — the page was 100%
 * client-side tool with a sr-only h1 and nothing for a crawler to read, on a
 * URL that ranks for "garage doors perth price"-type queries. This section
 * gives it real text: how the estimate works, a guide-price table rendered
 * FROM pricing-data.ts (the same single source of truth that drives the tool
 * and the CMS catalog — never hand-write prices here), and a FAQ + FAQPage
 * schema per the on-page-seo.md visible-FAQ rule.
 */

/** Scenario ids (stable, ASCII) → shown in the crawlable guide-price table. */
const TABLE_SCENARIO_IDS = [
  "spring",
  "cable",
  "motor-repair",
  "motor-replace",
  "offtrack",
  "damaged",
  "service",
  "new-standard",
] as const;

function money(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

function priceLabel(s: PricingScenario): string {
  if (s.priceMin == null) return "Quoted on-site";
  if (s.priceMax == null || s.priceMax === s.priceMin) return `From ${money(s.priceMin)}`;
  return `${money(s.priceMin)}–${money(s.priceMax)}`;
}

const FAQS: FAQ[] = [
  {
    question: "How accurate is the garage door price calculator?",
    answer:
      "The ranges come from our own live price list — the same one our technicians quote from — so for common repairs the estimate is usually very close. Your exact price depends on the door type, parts needed and access, which is why every job is still confirmed with a fixed quote before any work starts. The price we agree is the price you pay.",
  },
  {
    question: "Is the estimate free, and do I have to book?",
    answer:
      "Yes, and no. The calculator is free to use with no sign-up, and the estimate commits you to nothing. If you want the exact figure, request a quote from the result screen or call us — there's no call-out fee to quote.",
  },
  {
    question: "Why is a price range shown instead of one number?",
    answer:
      "Because the same fault costs different amounts on different doors. A broken spring on a light single roller door and on a heavy insulated double sectional door need different parts, which moves the price within the range. The calculator narrows the range from your answers; the on-site quote pins the exact figure.",
  },
  {
    question: "Do after-hours or emergency jobs cost more?",
    answer: `Standard pricing applies during business hours. Genuine after-hours emergency call-outs add a flat $${EMERGENCY_SURCHARGE} surcharge, which the calculator includes when you flag the job as an emergency — and which we always confirm with you before dispatching a technician.`,
  },
];

export function CalculatorSeoContent() {
  const scenarios = TABLE_SCENARIO_IDS.map((id) => PRICING_BY_ID.get(id)).filter(
    (s): s is PricingScenario => s !== undefined,
  );

  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <section className="bg-background py-14 sm:py-20">
        <Container className="max-w-4xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How the Perth Garage Door Price Calculator Works
          </h2>
          <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground">
            <p>
              The calculator above estimates garage door repair, installation, motor and servicing
              costs for Perth using our real price list — not industry averages. Answer a few
              questions about your door and the problem, and it looks up the matching scenario,
              adjusts for quantity (springs, remotes, hinges), and shows the honest range we
              actually charge. When our live pricing catalog is reachable it even overrides the
              baked-in ranges with today&apos;s prices.
            </p>
            <p>
              Prefer to talk it through? The{" "}
              <Link href="/quote" className="font-medium text-primary underline underline-offset-4 hover:text-cta">
                free quote form
              </Link>{" "}
              goes straight to our team, and the{" "}
              <Link
                href="/garage-door-repair-cost-perth"
                className="font-medium text-primary underline underline-offset-4 hover:text-cta"
              >
                repair cost guide
              </Link>{" "}
              explains every price below in detail.
            </p>
          </div>

          <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Typical Garage Door Prices in Perth
          </h2>
          <p className="mt-3 text-muted-foreground">
            The most common jobs from our price list — the same ranges the calculator uses:
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Job
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                    Typical price
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scenarios.map((s) => (
                  <tr key={s.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-foreground">{s.label}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground">{priceLabel(s)}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {s.publicNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            All prices are typical supplied-and-fitted ranges for the Perth metro area and are
            confirmed with a fixed quote before work starts. After-hours emergencies add a flat $
            {EMERGENCY_SURCHARGE} call-out surcharge.
          </p>
        </Container>
      </section>

      <FAQSection heading="Price Calculator FAQs" faqs={FAQS} />
    </>
  );
}
