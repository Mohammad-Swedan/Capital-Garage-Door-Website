"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  CallNowButton,
  BookNowButton,
  RequestQuoteButton,
  UploadPhotoButton,
} from "@/components/page/cta-buttons";
import { resolveIcon } from "@/lib/icons";
import {
  EditableText,
  EditableImage,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";
import type { ServicePageHero, ServicePageBadge } from "@/types/service-page";

interface ServiceHeroProps {
  hero: ServicePageHero;
}

/**
 * Above-the-fold hero for flat service landing pages. Mirrors the homepage
 * hero's gradient/typography language (see components/page/page-hero.tsx for
 * the suburb-page sibling) with a service image, floating availability card,
 * and icon-led trust badges instead of a map accent.
 */
export function ServiceHero({ hero }: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/3 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-[#0f4e9b]/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-cta-soft px-3.5 py-1.5 text-cta">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="cgd-eyebrow">Licensed Perth Specialists</span>
              </span>
            </Reveal>

            <Reveal delay={0.04}>
              <h1 className="cgd-display-fluid text-balance text-foreground">
                <EditableText path="hero.h1" placeholder="Hero heading…" aria-label="Hero heading">
                  {hero.h1}
                </EditableText>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-pretty cgd-lead text-muted-foreground">
                <EditableText path="hero.subtitle" placeholder="Hero subtitle…" aria-label="Hero subtitle">
                  {hero.subtitle}
                </EditableText>
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CallNowButton />
                <BookNowButton />
                <RequestQuoteButton />
                <UploadPhotoButton variant="secondary" />
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                <EditableList<ServicePageBadge>
                  path="hero.badges"
                  items={hero.badges}
                  itemTemplate={serviceItemTemplates.badge}
                  addLabel="Add badge"
                  getKey={(_b, i) => i}
                  renderItem={(badge, index) => {
                    const Icon = resolveIcon(badge.icon);
                    return (
                      <li className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 sm:text-sm">
                        <EditableIcon path={`hero.badges[${index}].icon`}>
                          <Icon className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        </EditableIcon>
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
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-navy shadow-float ring-1 ring-white/10">
              <EditableImage
                path="hero.image"
                src={hero.image}
                alt={hero.imageAlt}
                fill
                sizes="(max-width: 1024px) 28rem, 30rem"
                className="object-cover opacity-90"
                priority
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.18),transparent_60%)]"
              />

              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-3.5 shadow-elevated backdrop-blur-sm sm:left-5 sm:right-auto sm:max-w-[17rem] dark:bg-surface-elevated/95">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <p className="text-[13px] font-bold leading-snug text-foreground">
                  <EditableText
                    path="hero.floatingCardLabel"
                    singleLine
                    placeholder="Floating card label…"
                  >
                    {hero.floatingCardLabel}
                  </EditableText>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
