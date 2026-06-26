import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface CTASectionButton {
  label: string;
  href: string;
  icon?: ReactNode;
  variant?: "cta" | "outline";
}

interface CTASectionProps {
  heading: string;
  body?: string;
  buttons: CTASectionButton[];
  /** "primary" = navy band (general CTA), "emergency" = red-tinted band (urgent CTA). */
  tone?: "primary" | "emergency";
}

/**
 * Strong, full-width conversion band. Reused for both the mid-page emergency
 * CTA and the page-ending final CTA on templated pages.
 */
export function CTASection({ heading, body, buttons, tone = "primary" }: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 text-primary-foreground sm:py-24",
        tone === "emergency" ? "bg-gradient-cta" : "bg-gradient-navy",
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_80%)]" />
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cta/15 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#0f4e9b]/30 blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="cgd-h1 text-balance text-white">
            {heading}
          </h2>
          {body && (
            <p className="max-w-xl cgd-lead text-primary-foreground/85">{body}</p>
          )}
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                size="lg"
                variant={btn.variant === "outline" ? "outline" : "cta"}
                nativeButton={false}
                className={cn(
                  "h-13 w-full gap-2 rounded-xl px-8 text-base sm:w-auto",
                  btn.variant === "outline" &&
                    "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white",
                )}
                render={
                  <a href={btn.href}>
                    {btn.icon}
                    {btn.label}
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
