"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { resolvePageIcon } from "@/components/page/icons";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { AvailableService } from "@/types";

interface ServiceCardsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  services: AvailableService[];
}

/** Grid of services available in the suburb. Each card has an icon badge. */
export function ServiceCards({ eyebrow, title, description, services }: ServiceCardsProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EditableList<AvailableService>
            path="availableServices"
            items={services}
            itemTemplate={() => ({ title: "", description: "", icon: "Wrench" })}
            addLabel="Add service"
            getKey={(s, i) => s.title || i}
            renderItem={(service, i) => {
              const Icon = resolvePageIcon(service.icon);
              const inner = (
                <article className="group h-full rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:shadow-[0_14px_30px_rgba(13,31,69,0.1)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f4e9b]/10 text-[#0f4e9b] transition-colors group-hover:bg-[#0f4e9b] group-hover:text-white">
                    <EditableIcon path={`availableServices[${i}].icon`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </EditableIcon>
                  </span>
                  <h3 className="mt-4 flex items-center gap-1.5 cgd-h3 text-base text-foreground">
                    <EditableText path={`availableServices[${i}].title`} singleLine placeholder="Service title…">
                      {service.title}
                    </EditableText>
                    {service.href && (
                      <ArrowRight
                        className="h-4 w-4 text-[#0f4e9b] opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    <EditableText path={`availableServices[${i}].description`} placeholder="Service description…">
                      {service.description}
                    </EditableText>
                  </p>
                </article>
              );

              return (
                <Reveal delay={0.04 * i} className="h-full">
                  {service.href ? (
                    <Link href={service.href} className="block h-full">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </Reveal>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
