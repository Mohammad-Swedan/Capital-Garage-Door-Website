import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { ProblemCostRow } from "@/types";

interface CostTableProps {
  heading?: string;
  intro?: string;
  rows: ProblemCostRow[];
  disclaimer?: string;
}

/** Real `<table>` markup (not divs) so the pricing guidance is crawlable and accessible. */
export function CostTable({
  heading = "Cost Guidance",
  intro,
  rows,
  disclaimer = "Final pricing depends on the cause, parts required, and door size — confirmed on inspection before any work begins.",
}: CostTableProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
          {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}
        </Reveal>

        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-primary/5">
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                  Scenario
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                  Typical Price Range
                </th>
                <th scope="col" className="hidden px-4 py-3 font-heading font-semibold text-foreground sm:table-cell sm:px-6 sm:py-4">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.scenario} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground sm:px-6 sm:py-4">{row.scenario}</td>
                  <td className="px-4 py-3 font-semibold text-cta sm:px-6 sm:py-4">{row.priceRange}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                    {row.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <p className="mt-4 text-xs text-muted-foreground sm:text-sm">{disclaimer}</p>
      </Container>
    </section>
  );
}
