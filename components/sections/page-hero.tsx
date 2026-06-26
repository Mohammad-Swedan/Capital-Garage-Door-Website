import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface PageHeroCta {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: "cta" | "outline";
}

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle: string;
  ctas: PageHeroCta[];
  /** "warning" adds a soft amber accent — helpful without feeling alarming. */
  tone?: "default" | "warning";
}

/**
 * Reusable above-the-fold hero for inner templated pages (problem, service,
 * suburb, etc). Mirrors the homepage hero's backdrop/typography language
 * without touching the homepage hero itself.
 */
export function PageHero({ eyebrow, title, subtitle, ctas, tone = "default" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.07)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/2 h-90 w-200 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        {tone === "warning" && (
          <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl sm:h-80 sm:w-80" />
        )}
      </div>

      <Container className="relative z-10 py-14 sm:py-20 lg:py-24">
        <div className="flex max-w-3xl flex-col items-start gap-5 sm:gap-7">
          {eyebrow && (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase",
                tone === "warning"
                  ? "border-amber-500/25 bg-amber-500/10 text-amber-700"
                  : "border-emerald-600/20 bg-emerald-600/10 text-emerald-700",
              )}
            >
              {tone === "warning" && <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
              {eyebrow}
            </span>
          )}

          <h1 className="text-balance font-display text-[clamp(1.75rem,5vw,3rem)] leading-[1.08] font-black tracking-tight text-foreground">
            {title}
          </h1>

          <p className="text-pretty max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                size="lg"
                nativeButton={false}
                variant={cta.variant === "outline" ? "outline" : "default"}
                className={cn(
                  "h-12 w-full gap-2 rounded-xl px-8 text-base transition-transform hover:scale-[1.03] sm:w-auto",
                  cta.variant === "outline"
                    ? "border-[#0f4e9b]/35 bg-[#0f4e9b]/5 text-[#0f4e9b] hover:bg-[#0f4e9b]/10 hover:text-[#0f4e9b]"
                    : "bg-cta text-cta-foreground shadow-[0_3px_10px_rgba(200,34,42,0.25)] hover:bg-cta/90",
                )}
                render={
                  <a href={cta.href}>
                    {cta.icon}
                    {cta.label}
                  </a>
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
