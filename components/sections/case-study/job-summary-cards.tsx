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
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Job Summary
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.05}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-base font-semibold text-foreground">{card.title}</h3>
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
