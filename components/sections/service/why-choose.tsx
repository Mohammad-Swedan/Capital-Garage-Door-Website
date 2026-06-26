"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import { EditableText, EditableList, EditableIcon } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";
import type { ServiceWhyChooseItem } from "@/types/service-page";

interface WhyChooseProps {
  heading?: string;
  items: ServiceWhyChooseItem[];
}

/** Trust grid — kept to plain Reveal fade/slide-up rather than the homepage's scroll-linked sticky-numeral pattern, which is too heavy for an inner page. */
export function WhyChoose({ heading = "Why Choose Capital Garage Door", items }: WhyChooseProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Why Choose Us</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EditableList<ServiceWhyChooseItem>
            path="whyChoose"
            items={items}
            itemTemplate={serviceItemTemplates.whyChoose}
            addLabel="Add reason"
            getKey={(item, i) => item.title || i}
            renderItem={(item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal delay={index * 0.05}>
                  <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-105">
                      <EditableIcon path={`whyChoose[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="cgd-h3 text-base text-foreground">
                      <EditableText path={`whyChoose[${index}].title`} placeholder="Reason title…">
                        {item.title}
                      </EditableText>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <EditableText path={`whyChoose[${index}].description`} placeholder="Reason description…">
                        {item.description}
                      </EditableText>
                    </p>
                  </div>
                </Reveal>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
