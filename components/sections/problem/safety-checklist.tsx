import { CheckCircle2, XCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

interface SafetyChecklistProps {
  heading?: string;
  safeChecks: string[];
  doNotDo: string[];
}

/** Two-column safety guidance: what's safe to check vs. what to avoid. */
export function SafetyChecklist({
  heading = "What You Can Check Safely",
  safeChecks,
  doNotDo,
}: SafetyChecklistProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-emerald-600/15 bg-emerald-600/5 p-6">
              <h3 className="font-heading text-base font-semibold text-emerald-700">
                Safe to check yourself
              </h3>
              <ul className="mt-4 space-y-3">
                {safeChecks.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-cta/15 bg-cta/5 p-6">
              <h3 className="font-heading text-base font-semibold text-cta">Do not attempt</h3>
              <ul className="mt-4 space-y-3">
                {doNotDo.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-cta" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
