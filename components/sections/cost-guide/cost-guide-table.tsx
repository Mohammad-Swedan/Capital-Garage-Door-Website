import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { CostGuideTableData } from "@/types/cost-guide";

interface CostGuideTableProps {
  table: CostGuideTableData;
}

/**
 * Real `<table>` markup (not divs) so pricing guidance is crawlable and
 * accessible. Deliberately qualitative (repair type / what's included / cost
 * factors / next step) rather than fixed dollar figures — the optional
 * `priceRange` column only renders once a row actually supplies one, so a
 * page can switch on indicative pricing later without a component change.
 */
export function CostGuideTable({ table }: CostGuideTableProps) {
  const { heading, intro, rows, disclaimer } = table;
  const hasPriceColumn = rows.some((row) => row.priceRange);

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}
        </Reveal>

        <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-primary/5">
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                  Repair Type
                </th>
                <th scope="col" className="hidden px-4 py-3 font-heading font-semibold text-foreground sm:table-cell sm:px-6 sm:py-4">
                  What It Includes
                </th>
                {hasPriceColumn && (
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    Typical Range
                  </th>
                )}
                <th scope="col" className="hidden px-4 py-3 font-heading font-semibold text-foreground lg:table-cell lg:px-6 lg:py-4">
                  Cost Factors
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                  Best Next Step
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.repairType} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground sm:px-6 sm:py-4">{row.repairType}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                    {row.includes}
                  </td>
                  {hasPriceColumn && (
                    <td className="px-4 py-3 font-semibold text-cta sm:px-6 sm:py-4">{row.priceRange ?? "—"}</td>
                  )}
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell lg:px-6 lg:py-4">
                    {row.costFactors}
                  </td>
                  <td className="px-4 py-3 text-foreground sm:px-6 sm:py-4">{row.nextStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {disclaimer && <p className="mt-4 text-xs text-muted-foreground sm:text-sm">{disclaimer}</p>}
      </Container>
    </section>
  );
}
