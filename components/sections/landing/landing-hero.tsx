"use client";

import { Phone, FileText, Lightbulb } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LandingQuoteForm } from "@/components/forms/landing-quote-form";
import { resolvePageIcon } from "@/components/page/icons";
import { siteConfig } from "@/config/site";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { LandingPage, LandingBadge } from "@/types/landing-page";

interface LandingHeroProps {
  page: LandingPage;
}

/** Blank badge produced by the hero's "+ Add badge" affordance. */
const blankLandingBadge = (): LandingBadge => ({ icon: "ShieldCheck", label: "" });

/**
 * Above-the-fold hero for paid landing pages. Mirrors the inner PageHero's
 * backdrop/typography language but pairs the headline + CTAs with the lead form
 * (right column on desktop, directly below the copy on mobile) so visitors can
 * convert without scrolling. The form anchor (#quote) is the target of every
 * "Request" CTA on the page.
 */
export function LandingHero({ page }: LandingHeroProps) {
  const { business } = siteConfig;
  const problemOptions = page.problems.items.map((problem) => problem.title);

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.07)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/3 h-90 w-200 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-64 w-64 rounded-full bg-cta/8 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <Container className="relative z-10 py-10 sm:py-14 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_minmax(0,460px)] lg:gap-12">
          {/* Copy + CTAs */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            {page.hero.eyebrow && (
              <span className="cgd-eyebrow inline-flex items-center gap-2 rounded-full bg-cta-soft px-3.5 py-1.5 text-cta">
                <EditableText path="hero.eyebrow" singleLine placeholder="Eyebrow…" aria-label="Hero eyebrow">
                  {page.hero.eyebrow}
                </EditableText>
              </span>
            )}

            <h1 className="cgd-display-fluid text-balance text-foreground">
              <EditableText path="hero.h1" placeholder="Hero heading…" aria-label="Hero heading">
                {page.hero.h1}
              </EditableText>
            </h1>

            <p className="text-pretty max-w-xl cgd-lead text-muted-foreground">
              <EditableText path="hero.subtitle" placeholder="Hero subtitle…" aria-label="Hero subtitle">
                {page.hero.subtitle}
              </EditableText>
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href={`tel:${business.phone}`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-cta px-8 text-base font-bold text-cta-foreground shadow-elevated transition-all hover:-translate-y-px hover:shadow-float motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call Now
              </a>
              <a
                href="#quote"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand/35 bg-brand-soft px-8 text-base font-bold text-brand transition-all hover:-translate-y-px hover:bg-[color-mix(in_oklab,var(--brand),transparent_82%)] motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                <FileText className="h-5 w-5" aria-hidden="true" />
                Request {page.serviceLabel.includes("Emergency") ? "Emergency Repair" : "a Quote"}
              </a>
            </div>

            {/* Trust badges */}
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5 pt-1">
              <EditableList<LandingBadge>
                path="hero.badges"
                items={page.hero.badges}
                itemTemplate={blankLandingBadge}
                addLabel="Add badge"
                getKey={(_b, i) => i}
                renderItem={(badge, index) => {
                  const Icon = resolvePageIcon(badge.icon);
                  return (
                    <li className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700">
                        <EditableIcon path={`hero.badges[${index}].icon`}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </EditableIcon>
                      </span>
                      <EditableText
                        path={`hero.badges[${index}].label`}
                        singleLine
                        placeholder="Badge…"
                      >
                        {badge.label}
                      </EditableText>
                    </li>
                  );
                }}
              />
            </ul>

            {page.directAnswer && (
              <div className="mt-1 flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand-soft p-4 text-sm leading-relaxed text-foreground shadow-card sm:text-base">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <p>
                  <EditableText path="directAnswer" placeholder="Direct answer…" aria-label="Direct answer">
                    {page.directAnswer}
                  </EditableText>
                </p>
              </div>
            )}
          </div>

          {/* Lead form */}
          <div
            id="quote"
            className="scroll-mt-24 rounded-3xl border border-border/70 bg-surface-elevated p-6 elevate-float sm:p-7"
          >
            <h2 className="cgd-h3 text-xl text-foreground sm:text-2xl">
              <EditableText path="form.heading" placeholder="Form heading…" aria-label="Form heading">
                {page.form.heading}
              </EditableText>
            </h2>
            {page.form.subheading && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                <EditableText path="form.subheading" placeholder="Form subheading…" aria-label="Form subheading">
                  {page.form.subheading}
                </EditableText>
              </p>
            )}
            <div className="mt-5">
              <LandingQuoteForm
                pageType={page.pageType}
                service={page.serviceLabel}
                problemOptions={problemOptions}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
