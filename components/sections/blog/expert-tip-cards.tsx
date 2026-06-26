"use client";

import { DollarSign, PhoneCall, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import type { ExpertTip, ExpertTipKind } from "@/types/article";

interface ExpertTipCardsProps {
  heading?: string;
  tips: ExpertTip[];
}

const kindStyles: Record<ExpertTipKind, { icon: typeof Wrench; label: string; iconWrap: string }> = {
  maintenance: { icon: Wrench, label: "Maintenance Tip", iconWrap: "bg-primary/10 text-primary" },
  safety: { icon: ShieldCheck, label: "Safety Tip", iconWrap: "bg-emerald-600/10 text-emerald-700" },
  technician: { icon: PhoneCall, label: "When to Call a Technician", iconWrap: "bg-cta/10 text-cta" },
  cost: { icon: DollarSign, label: "Cost & Quote Tip", iconWrap: "bg-[#0f4e9b]/10 text-[#0f4e9b]" },
};

/** Reusable expert-advice cards (maintenance / safety / technician / cost) for educational articles. */
export function ExpertTipCards({ heading = "Expert Tips", tips }: ExpertTipCardsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="cgd-h2 text-balance text-foreground">{heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <EditableList<ExpertTip>
            path="expertTips"
            items={tips}
            itemTemplate={(): ExpertTip => ({ kind: "maintenance", title: "", body: "" })}
            addLabel="Add tip"
            getKey={(t, i) => t.title || i}
            renderItem={(tip, index) => {
              const style = kindStyles[tip.kind];
              const Icon = style.icon;
              return (
                <Reveal delay={index * 0.05} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6">
                    <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", style.iconWrap)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs font-bold tracking-wide text-muted-foreground uppercase">{style.label}</p>
                    <h3 className="mt-1 cgd-h3 text-base text-foreground">
                      <EditableText path={`expertTips[${index}].title`} placeholder="Tip title…">
                        {tip.title}
                      </EditableText>
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      <EditableText path={`expertTips[${index}].body`} placeholder="Tip body…">
                        {tip.body}
                      </EditableText>
                    </p>
                  </article>
                </Reveal>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
