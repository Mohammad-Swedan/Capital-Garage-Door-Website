import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { ComparisonTable as ComparisonTableData } from "@/types/comparison-page";

interface ComparisonTableProps {
  heading?: string;
  table: ComparisonTableData;
}

/**
 * Real `<table>` markup (crawlable, AEO-friendly) comparing two options
 * feature-by-feature. Unlike a cost table, neither option column can be
 * hidden on mobile — instead the table scrolls horizontally with the
 * Feature column pinned via `sticky left-0` so row context never scrolls away.
 */
export function ComparisonTable({ heading = "Side-by-Side Comparison", table }: ComparisonTableProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-primary/5">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-r border-border bg-card px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4"
                  >
                    Feature
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    {table.optionALabel}
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    {table.optionBLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="sticky left-0 z-10 border-r border-border bg-card px-4 py-3 font-semibold text-foreground sm:px-6 sm:py-4">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">{row.optionA}</td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">{row.optionB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
          General guidance only — the right choice depends on your specific garage and requirements.
        </p>
      </Container>
    </section>
  );
}
