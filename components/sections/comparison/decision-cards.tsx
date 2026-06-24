import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ComparisonDecisionCard } from "@/types/comparison-page";

interface DecisionCardsProps {
  heading?: string;
  cards: ComparisonDecisionCard[];
}

const TONE_STYLES: Record<ComparisonDecisionCard["tone"], { border: string; bg: string; text: string }> = {
  optionA: { border: "border-primary/15", bg: "bg-primary/5", text: "text-primary" },
  optionB: { border: "border-emerald-600/15", bg: "bg-emerald-600/5", text: "text-emerald-700" },
  uncertain: { border: "border-amber-500/25", bg: "bg-amber-500/10", text: "text-amber-700" },
};

/** "Which one should you choose?" — three decision-aid cards, tinted per option/uncertain via each card's own `tone` field. */
export function DecisionCards({ heading = "Which One Should You Choose?", cards }: DecisionCardsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = resolveIcon(card.icon);
            const tone = TONE_STYLES[card.tone];
            return (
              <Reveal key={card.heading} delay={index * 0.05}>
                <div className={cn("h-full rounded-2xl border p-5", tone.border, tone.bg)}>
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-card",
                      tone.text,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className={cn("mt-4 font-heading text-base font-semibold", tone.text)}>{card.heading}</h3>
                  <ul className="mt-3 space-y-2">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                        <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", tone.text, "bg-current")} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
