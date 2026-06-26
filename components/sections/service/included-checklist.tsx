"use client";

import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";

interface IncludedChecklistProps {
  heading?: string;
  items: string[];
}

/** "What's included" checklist — sets clear expectations for the service call-out. */
export function IncludedChecklist({ heading = "What's Included", items }: IncludedChecklistProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <ul className="grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8">
            <EditableList<string>
              path="includedItems"
              items={items}
              itemTemplate={serviceItemTemplates.includedItem}
              addLabel="Add item"
              getKey={(item, i) => item || i}
              renderItem={(item, index) => (
                <li className="flex items-start gap-2.5 text-sm text-foreground sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <EditableText path={`includedItems[${index}]`} placeholder="Included item…">
                    {item}
                  </EditableText>
                </li>
              )}
            />
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
