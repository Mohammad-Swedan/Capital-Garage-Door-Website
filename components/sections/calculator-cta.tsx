import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ctaPrimaryClass } from "@/components/page/cta-buttons";
import { cn } from "@/lib/utils";

/**
 * Compact "try the smart calculator" band — replaces the long price-table section.
 * A plain server component (no client JS): the button links to the real `/calculator`
 * route, which also adds the home → /calculator internal link for SEO.
 */
export function CalculatorCta() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-8 sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Not sure what it&apos;ll cost?
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Get a personalised price range for your exact door in under a minute with our smart
                  calculator — real Perth pricing, no phone call required.
                </p>
              </div>
            </div>
            <Link href="/calculator" className={cn(ctaPrimaryClass, "shrink-0")}>
              Try the calculator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
