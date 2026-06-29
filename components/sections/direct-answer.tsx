import { Lightbulb } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EditableText } from "@/components/admin/editor/editable";
import { cn } from "@/lib/utils";

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
  /**
   * Constrain the box to the article reading column and centre it, so the
   * Quick Answer shares the same vertical axis as the prose below it. Defaults
   * to full container width (used by the wider service/comparison templates).
   */
  narrow?: boolean;
}

/**
 * Highlighted answer box near the top of the page — written for AEO/GEO
 * surfacing (AI assistants and "People also ask" style answers), and for
 * users who just want the short version before reading on.
 */
export function DirectAnswer({ heading = "Quick Answer", answer, path = "directAnswer", narrow = false }: DirectAnswerProps) {
  return (
    <section className="bg-background pb-2 sm:pb-4">
      <Container>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-7",
            narrow && "mx-auto max-w-[42rem]",
          )}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10">
              <Lightbulb className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-sm font-bold tracking-wide text-primary uppercase">
                {heading}
              </h2>
              <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground sm:text-lg">
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
