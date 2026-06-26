import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText } from "@/components/admin/editor/editable";
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
          <span className="cgd-eyebrow text-cta">Pricing</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            <EditableText path="costTable.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
          {intro && (
            <p className="mt-3 max-w-2xl cgd-lead text-muted-foreground">
              <EditableText path="costTable.intro" placeholder="Intro…">
                {intro}
              </EditableText>
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-2xl border border-border/70 elevate-card">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-brand-soft">
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

        {disclaimer && (
          <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
            <EditableText path="costTable.disclaimer" placeholder="Disclaimer…">
              {disclaimer}
            </EditableText>
          </p>
        )}
      </Container>
    </section>
  );
}
