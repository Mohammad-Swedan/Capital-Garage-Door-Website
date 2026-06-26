import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export interface ContactInfoCard {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  badge?: string;
}

interface ContactInfoCardsProps {
  cards: ContactInfoCard[];
}

/** Quick-scan grid of contact methods (phone, email, hours, etc.) above the main quote form. */
export function ContactInfoCards({ cards }: ContactInfoCardsProps) {
  return (
    <section className="bg-background">
      <Container className="py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const content = (
              <div
                className={cn(
                  "group relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-5 shadow-sm ring-1 ring-foreground/5 transition-all",
                  card.href && "hover:-translate-y-0.5 hover:border-cta/30 hover:shadow-md",
                )}
              >
                {card.badge && (
                  <span className="absolute top-4 right-4 rounded-full bg-cta/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cta uppercase">
                    {card.badge}
                  </span>
                )}
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{card.label}</p>
                  <p
                    className={cn(
                      "mt-1 font-display text-base leading-snug font-bold text-foreground",
                      card.href && "group-hover:text-cta",
                    )}
                  >
                    {card.value}
                  </p>
                </div>
              </div>
            );

            return (
              <Reveal key={card.label} delay={0.04 * i} className="h-full">
                {card.href ? (
                  <a href={card.href} className="block h-full">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
