"use client";

import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { RequestQuoteButton } from "@/components/page/cta-buttons";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";

interface ServiceAreaGridProps {
  heading?: string;
  areas: string[];
}

/** Suburb coverage grid, reinforcing local relevance for SEO/GEO and visitor trust. */
export function ServiceAreaGrid({ heading = "Areas We Service", areas }: ServiceAreaGridProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Coverage</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl cgd-lead text-muted-foreground">
            Capital Garage Door provides this service across Perth, including:
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <EditableList<string>
              path="serviceAreas"
              items={areas}
              itemTemplate={serviceItemTemplates.serviceArea}
              addLabel="Add suburb"
              getKey={(area, i) => area || i}
              renderItem={(area, index) => (
                <li className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface-elevated px-4 py-3 text-sm font-medium text-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <EditableText path={`serviceAreas[${index}]`} singleLine placeholder="Suburb…">
                    {area}
                  </EditableText>
                </li>
              )}
            />
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm text-muted-foreground sm:text-base">
            Don&apos;t see your suburb? We still likely cover it.
          </p>
          <RequestQuoteButton />
        </Reveal>
      </Container>
    </section>
  );
}
