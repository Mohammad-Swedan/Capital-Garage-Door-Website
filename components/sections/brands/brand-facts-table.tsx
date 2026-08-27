import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/page/section-heading";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./brand-mark";
import type { BrandKind, BrandTag, HubTile } from "@/types/brand";

interface BrandFactsTableProps {
  kind: BrandKind;
  tiles: HubTile[];
}

const DOOR_TYPE_TAGS: { tag: BrandTag; label: string }[] = [
  { tag: "roller", label: "Roller" },
  { tag: "sectional", label: "Sectional" },
  { tag: "tilt", label: "Tilt" },
  { tag: "commercial", label: "Commercial" },
];

/**
 * The comparison table — origin, ranges and what we actually do for each brand, side by side.
 *
 * Server-rendered as a real `<table>`, not a card grid: this is the section that answers
 * "who makes what, and are they Australian?" in one scan, and a genuine table is what both a
 * reader and a crawler can compare row-to-row. It scrolls inside its own container so the page
 * body never scrolls sideways on a phone.
 */
export function BrandFactsTable({ kind, tiles }: BrandFactsTableProps) {
  if (tiles.length === 0) return null;
  const noun = kind === "motor" ? "motor" : "door";
  const variableHeading = kind === "motor" ? "Smart control" : "Door types";

  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Side by side"
          title={`Garage ${noun} brands compared`}
          description={`Where each brand is made, what it builds, and exactly what we can do for it. Facts come from each manufacturer's own site.`}
        />

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
          <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Garage {noun} brands serviced in Perth, with their country of manufacture, product
              ranges and the work we carry out on each.
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  Brand
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  Origin
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  Product lines
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  {variableHeading}
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  What we do
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-bold text-foreground">
                  Page
                </th>
              </tr>
            </thead>
            <tbody>
              {tiles.map(({ entity, href }) => {
                const doorTypes = DOOR_TYPE_TAGS.filter((t) => entity.tags.includes(t.tag))
                  .map((t) => t.label)
                  .join(", ");
                const variable =
                  kind === "motor"
                    ? entity.tags.includes("smart-app")
                      ? "App"
                      : "—"
                    : doorTypes || "—";
                return (
                  <tr
                    key={entity.slug}
                    className="border-b border-border/60 align-top last:border-b-0 even:bg-muted/20"
                  >
                    <th scope="row" className="px-4 py-3.5 font-semibold text-foreground">
                      <span className="flex items-center gap-2.5">
                        <BrandMark entity={entity} size="sm" />
                        <span className="whitespace-nowrap">{entity.name}</span>
                      </span>
                    </th>
                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                      {entity.origin}
                    </td>
                    <td className="max-w-[22rem] px-4 py-3.5 text-muted-foreground">
                      {entity.productLines}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{variable}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {entity.dealer ? "Supply, install, service & repair" : "Service, repair & replace"}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {href ? (
                        <Link
                          href={href}
                          prefetch={false}
                          className="font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          {entity.name} guide
                        </Link>
                      ) : (
                        <a
                          href={`tel:${siteConfig.business.phone}`}
                          className="font-semibold text-cta underline-offset-4 hover:underline"
                        >
                          Call us
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
