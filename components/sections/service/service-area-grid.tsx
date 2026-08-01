"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { RequestQuoteButton } from "@/components/page/cta-buttons";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";

interface ServiceAreaGridProps {
  heading?: string;
  areas: string[];
  /**
   * Suburb-page links keyed by lowercased suburb name (e.g. "canning vale" →
   * "/garage-door-repairs-canning-vale"). When a chip's name matches, it renders
   * as a link to that suburb page — the hub→spoke internal links that let suburb
   * pages outrank the homepage for "garage door repairs {suburb}". Omitted in
   * the admin live-editor (chips stay plain text there).
   */
  areaLinks?: Record<string, string>;
}

/** Suburb coverage grid, reinforcing local relevance for SEO/GEO and visitor trust. */
export function ServiceAreaGrid({ heading = "Areas We Service", areas, areaLinks }: ServiceAreaGridProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Capital Garage Doors provides this service across Perth, including:
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
              renderItem={(area, index) => {
                const href = areaLinks?.[area.trim().toLowerCase()];
                const chip = (
                  <>
                    <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <EditableText path={`serviceAreas[${index}]`} singleLine placeholder="Suburb…">
                      {area}
                    </EditableText>
                  </>
                );
                return (
                  <li className="rounded-xl border border-border bg-card text-sm font-medium text-foreground">
                    {href ? (
                      <Link
                        href={href}
                        prefetch={false}
                        className="flex items-center gap-2 px-4 py-3 transition-colors hover:text-primary"
                      >
                        {chip}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 px-4 py-3">{chip}</span>
                    )}
                  </li>
                );
              }}
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
