import { Lightbulb } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EditableText } from "@/components/admin/editor/editable";

interface DirectAnswerProps {
  heading?: string;
  answer: string;
  /**
   * Draft path the answer binds to in the in-place editor. Defaults to
   * "directAnswer" (Service/Comparison/CostGuide/Problem); Article passes
   * "shortAnswer". Public render is unaffected — EditableText passes the value
   * through verbatim when no editor is mounted.
   */
  path?: string;
}

/**
 * Highlighted answer box near the top of the page — written for AEO/GEO
 * surfacing (AI assistants and "People also ask" style answers), and for
 * users who just want the short version before reading on.
 */
export function DirectAnswer({ heading = "Quick Answer", answer, path = "directAnswer" }: DirectAnswerProps) {
  return (
    <section className="bg-background pb-2 sm:pb-4">
      <Container>
        <div className="group/answer relative overflow-hidden rounded-3xl border-gradient-brand bg-surface-elevated p-6 elevate-card sm:p-8">
          {/* Brand accent rail down the start edge */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 start-0 w-1 bg-gradient-cta"
          />
          {/* Soft ambient glow toward the icon */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-glow-brand blur-2xl"
          />
          <div className="relative flex items-start gap-4 sm:gap-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-elevated ring-1 ring-white/15 sm:h-12 sm:w-12">
              <Lightbulb className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="cgd-eyebrow text-brand">
                {heading}
              </h2>
              <p className="mt-2.5 max-w-3xl cgd-lead text-foreground">
                <EditableText path={path} placeholder="Write the short, quotable answer…" aria-label="Direct answer">
                  {answer}
                </EditableText>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
