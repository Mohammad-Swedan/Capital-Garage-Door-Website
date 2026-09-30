import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResolvedPriceListGroup } from "@/types/price-list";

interface PriceListTableProps {
  group: ResolvedPriceListGroup;
}

/**
 * One price-list group as a real, server-rendered `<table>`: the job (linked to the page that
 * details it), its guide price and, from `sm` up, what the job includes. The price is the row's
 * resolved price, a range when the catalog has both bounds and the authored label otherwise, the
 * same text every other page shows for that row. The group's cost guide is linked under the table.
 */
export function PriceListTable({ group }: PriceListTableProps) {
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm sm:text-base">
          <caption className="sr-only">{group.heading}: Perth guide prices</caption>
          <thead className="bg-primary/5 text-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-heading font-semibold sm:px-6">
                Job
              </th>
              <th scope="col" className="px-4 py-3 font-heading font-semibold whitespace-nowrap sm:px-6">
                Guide price
              </th>
              <th scope="col" className="hidden px-4 py-3 font-heading font-semibold sm:table-cell sm:px-6">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {group.rows.map((row) => (
              <tr key={row.id} className="align-top">
                <th scope="row" className="px-4 py-3 text-left font-medium sm:px-6">
                  <Link
                    href={row.href}
                    prefetch={false}
                    className="text-primary underline underline-offset-4 hover:text-cta"
                  >
                    {row.label}
                  </Link>
                </th>
                {/* Only a real range stays on one line; labels such as "$95 each + $120 to attend &
                    program" wrap so the table fits a phone without scrolling. */}
                <td
                  className={cn(
                    "px-4 py-3 font-semibold text-foreground sm:px-6",
                    row.min != null && row.max != null && "whitespace-nowrap",
                  )}
                >
                  {row.price}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6">
                  {row.includes ?? row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {group.guide && (
        <p className="mt-3 text-sm text-muted-foreground">
          More detail:{" "}
          <Link
            href={group.guide.href}
            prefetch={false}
            className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 hover:text-cta"
          >
            {group.guide.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      )}
    </>
  );
}
