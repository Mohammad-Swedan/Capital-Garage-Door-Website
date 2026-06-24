import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

interface DirectAnswerProps {
  /** Concise, AEO-friendly answer rendered as real HTML near the top of the page. */
  answer: string;
  /** Short label above the answer, e.g. "Garage Door Repairs in Joondalup". */
  label: string;
}

/**
 * Highlighted "direct answer" box for AEO/GEO — a clear, quotable statement
 * placed high on the page so search engines and AI assistants can surface it.
 */
export function DirectAnswer({ answer, label }: DirectAnswerProps) {
  return (
    <section aria-label="Quick answer" className="bg-background">
      <Container className="py-8 sm:py-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[#0f4e9b]/15 bg-gradient-to-br from-[#0f4e9b]/5 to-cta/5 p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f4e9b]/10 text-[#0f4e9b]">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-[#0f4e9b] uppercase">
                  {label}
                </p>
                <p className="mt-1.5 text-pretty text-base font-medium leading-relaxed text-foreground sm:text-lg">
                  {answer}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
