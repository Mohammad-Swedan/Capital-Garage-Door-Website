import { AlertTriangle, Search, Wrench, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText } from "@/components/admin/editor/editable";
import type { CaseStudyPage } from "@/types/case-study";

interface JobSummaryCardsProps {
  data: CaseStudyPage;
}

/** Quick-glance Problem / Diagnosis / Solution / Result overview before the full narrative sections. */
export function JobSummaryCards({ data }: JobSummaryCardsProps) {
  const cards = [
    { icon: AlertTriangle, title: "Problem", description: data.summary.problem, path: "summary.problem" },
    { icon: Search, title: "Diagnosis", description: data.summary.diagnosis, path: "summary.diagnosis" },
    { icon: Wrench, title: "Solution", description: data.summary.solution, path: "summary.solution" },
    { icon: CheckCircle2, title: "Result", description: data.result, path: "result" },
  ];

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">At a Glance</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            Job Summary
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.05}>
              <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-105">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="cgd-h3 text-base text-foreground">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <EditableText path={card.path} placeholder={`${card.title}…`} aria-label={card.title}>
                    {card.description}
                  </EditableText>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
