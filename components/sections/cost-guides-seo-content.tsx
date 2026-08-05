import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  PRICING_BY_ID,
  EMERGENCY_SURCHARGE,
  type PricingScenario,
} from "@/components/sections/smart-calculator/pricing-data";

/**
 * Crawlable body copy + at-a-glance price table for the /cost-guides hub. The
 * 2026-08-05 Semrush ideas export flagged the hub for low word count, missing
 * target terms ("garage door replacement cost", "garage doors prices", "cost
 * for garage door installation") and poor readability — it was a bare card
 * list. Same approach as calculator-seo-content.tsx: prices render FROM
 * pricing-data.ts (the single source of truth — never hand-write a figure
 * here), and each row links to the detailed guide or page for that job.
 */

/** Scenario id → the detailed guide/page its table row links to. */
const TABLE_ROWS: { id: string; href: string }[] = [
  { id: "spring", href: "/garage-door-spring-replacement-cost-perth" },
  { id: "cable", href: "/garage-door-repair-cost-perth" },
  { id: "motor-repair", href: "/garage-door-motor-replacement-cost-perth" },
  { id: "motor-replace", href: "/garage-door-motor-replacement-cost-perth" },
  { id: "offtrack", href: "/garage-door-repair-cost-perth" },
  { id: "damaged", href: "/garage-door-repair-cost-perth" },
  { id: "service", href: "/garage-door-service-cost-perth" },
  { id: "new-standard", href: "/garage-door-installation-perth" },
];

function money(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

function priceLabel(s: PricingScenario): string {
  if (s.priceMin == null) return "Quoted on-site";
  if (s.priceMax == null || s.priceMax === s.priceMin) return `From ${money(s.priceMin)}`;
  return `${money(s.priceMin)}–${money(s.priceMax)}`;
}

export function CostGuidesSeoContent() {
  const rows = TABLE_ROWS.map(({ id, href }) => ({ scenario: PRICING_BY_ID.get(id), href })).filter(
    (r): r is { scenario: PricingScenario; href: string } => r.scenario !== undefined,
  );

  return (
    <section className="bg-background pb-14 sm:pb-20">
      <Container className="max-w-4xl">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Garage Door Prices in Perth at a Glance
        </h2>
        <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted-foreground">
          <p>
            Every figure below comes from our own Perth price list — the same one our technicians
            quote from. That matters, because most garage door prices published online are national
            averages that don&apos;t survive contact with a real quote. Ours do. Click any job for
            the full guide to what&apos;s included and what moves the price up or down.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[26rem] text-left text-sm">
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
              {rows.map(({ scenario, href }) => (
                <tr key={scenario.id} className="align-top">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={href}
                      className="text-primary underline underline-offset-4 hover:text-cta"
                    >
                      {scenario.label}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">
                    {priceLabel(scenario)}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {scenario.publicNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Supplied-and-fitted ranges for the Perth metro area, confirmed with a fixed quote before
          any work starts. After-hours emergencies add a flat ${EMERGENCY_SURCHARGE} call-out
          surcharge.
        </p>

        <div className="mt-10 flex flex-col gap-4 leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Repair Cost or Replacement Cost?
          </h2>
          <p>
            The most common question we get is whether a repair is worth it. As a rule of thumb: a
            single failed part on a structurally sound door — a spring, a cable, a motor — is worth
            repairing. A full garage door replacement cost makes more sense when the door itself is
            rusted, repeatedly failing, or damaged across several panels, because you&apos;d
            otherwise pay repair prices twice and still own an old door.
          </p>
          <p>
            The cost for garage door installation depends mainly on the door type and size — a
            standard sectional or roller door sits at the lower end, while custom, insulated and
            commercial doors cost more. Every install we quote includes removal and disposal of the
            old door, fitting, motor setup and safety testing, so the price you&apos;re comparing is
            the finished job. For an instant estimate on any job, try the{" "}
            <Link
              href="/calculator"
              className="font-medium text-primary underline underline-offset-4 hover:text-cta"
            >
              price calculator
            </Link>{" "}
            — or{" "}
            <Link
              href="/quote"
              className="font-medium text-primary underline underline-offset-4 hover:text-cta"
            >
              request a free quote
            </Link>{" "}
            and we&apos;ll confirm an exact figure.
          </p>
        </div>
      </Container>
    </section>
  );
}
