import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { resolvePageIcon } from "@/components/page/icons";
import type { TrustReason } from "@/types";

interface TrustCardsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  reasons: TrustReason[];
}

/** "Why choose us locally" trust cards. */
export function TrustCards({ eyebrow, title, description, reasons }: TrustCardsProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = resolvePageIcon(reason.icon);
            return (
              <Reveal key={reason.title} delay={0.04 * i} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-5 shadow-sm ring-1 ring-foreground/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 cgd-h3 text-base text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
