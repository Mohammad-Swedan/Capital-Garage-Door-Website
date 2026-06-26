import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText } from "@/components/admin/editor/editable";

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
          <div className="relative overflow-hidden rounded-3xl border-gradient-brand bg-surface-elevated p-6 elevate-card sm:p-8">
            <span aria-hidden="true" className="absolute inset-y-0 start-0 w-1 bg-gradient-cta" />
            <span aria-hidden="true" className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-glow-brand blur-2xl" />
            <div className="relative flex items-start gap-4 sm:gap-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-elevated ring-1 ring-white/15 sm:h-12 sm:w-12">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="cgd-eyebrow text-brand">
                  {label}
                </p>
                <p className="mt-2.5 max-w-3xl cgd-lead text-foreground">
                  <EditableText path="directAnswer" placeholder="Direct answer…" aria-label="Direct answer">
                    {answer}
                  </EditableText>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
