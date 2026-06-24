import Image from "next/image";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  CallNowButton,
  BookNowButton,
  RequestQuoteButton,
  UploadPhotoButton,
} from "@/components/page/cta-buttons";

interface PageHeroProps {
  /** Small kicker above the title, e.g. "Garage Door Repairs · Perth, WA". */
  eyebrow: string;
  /** Main H1. */
  title: string;
  subtitle: string;
  trustBadges: string[];
  /** Floating card label over the map accent, e.g. "Servicing Joondalup & Nearby Suburbs". */
  areaLabel: string;
}

/**
 * Reusable inner-page hero. Light background with soft navy gradient accents
 * to match the homepage, a Perth map location accent, a floating "service area"
 * card, primary CTAs and trust-badge chips. Server-rendered for SEO.
 */
export function PageHero({ eyebrow, title, subtitle, trustBadges, areaLabel }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative background — grid + soft ambient glows (matches homepage hero). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/3 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-[#0f4e9b]/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy + CTAs */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0f4e9b]/20 bg-[#0f4e9b]/8 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-[#0f4e9b] uppercase sm:text-xs">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="text-balance font-display text-3xl leading-[1.1] font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CallNowButton />
                <BookNowButton />
                <RequestQuoteButton />
                <UploadPhotoButton variant="secondary" />
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                {trustBadges.map((badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 sm:text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {badge}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right — map accent + floating service-area card */}
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1f60] to-[#0a1733] shadow-[0_30px_60px_rgba(13,31,69,0.25)] ring-1 ring-white/10">
              {/* Soft radial glow inside the panel */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.18),transparent_60%)]"
              />
              <Image
                src="/images/perth-map-white.png"
                alt={`Map of ${areaLabel}`}
                fill
                sizes="(max-width: 1024px) 28rem, 30rem"
                className="object-contain p-8 opacity-80"
              />
              {/* Pulsing location pin */}
              <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-cta/40" />
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-cta text-white shadow-lg">
                  <MapPin className="h-3 w-3" />
                </span>
              </span>

              {/* Floating glass card */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:left-5 sm:right-auto sm:max-w-[16rem]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f4e9b]/10 text-[#0f4e9b]">
                  <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <p className="text-[13px] font-bold leading-snug text-foreground">{areaLabel}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
