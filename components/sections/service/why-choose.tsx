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
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <EditableIcon path={`whyChoose[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">
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
