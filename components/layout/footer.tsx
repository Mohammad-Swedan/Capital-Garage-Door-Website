import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { Reveal } from "@/components/motion/reveal";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-email";
import { siteConfig } from "@/config/site";
import { formatHour } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();
  const { business, social, footerNav } = siteConfig;

  const navSections = footerNav.filter((section) => section.title !== "Legal");
  const legalLinks = footerNav.find((section) => section.title === "Legal")?.links ?? [];

  const weekday = business.hours.find((h) => h.day === "Monday");
  // Sat and Sun currently share identical hours; the footer only reads
  // Saturday's entry under the combined "Sat-Sun" label below. If they ever
  // diverge, this needs to render two separate rows again (the JSON-LD
  // schema in lib/seo/schema.ts already reads both days independently and
  // doesn't need this fix).
  const weekend = business.hours.find((h) => h.day === "Saturday");

  return (
    <footer className="relative overflow-hidden bg-[#0d1f60] text-white">
      {/* Ambient background — matches the dark sections above (service-area-map / smart-cta) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-[480px] w-[480px] rounded-full bg-[#1b3b8c]/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-cta/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_90%_60%_at_50%_0%,black_30%,transparent_80%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      <Container className="relative z-10 py-16 sm:py-20">
        <Reveal className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="inline-flex rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <Logo className="text-lg" />
            </div>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {siteConfig.tagline}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${business.phone}`}
                className="group flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-sky-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors group-hover:border-cta/40 group-hover:bg-cta/15">
                  <Phone className="h-4 w-4 text-sky-300" aria-hidden="true" />
                </span>
                {business.phoneDisplay}
              </a>
              <ObfuscatedEmail className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors group-hover:border-white/30 group-hover:bg-white/10">
                  <Mail className="h-4 w-4 text-sky-300" aria-hidden="true" />
                </span>
              </ObfuscatedEmail>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <MapPin className="h-4 w-4 text-sky-300" aria-hidden="true" />
                </span>
                <address className="not-italic">
                  {business.address.streetAddress}, {business.address.addressLocality}{" "}
                  {business.address.addressRegion} {business.address.postalCode}
                </address>
              </div>
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              Licensed &amp; Insured
            </span>
          </div>

          {/* Nav columns (Company / Services) */}
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {section.title}
              </p>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {/* prefetch={false}: ~20 footer links would otherwise fire
                        route prefetches the moment the footer scrolls into
                        view — wasted bandwidth on mobile for low-traffic links. */}
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Hours + social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Business Hours
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Mon&ndash;Fri</span>
                  <span className="font-medium text-white">
                    {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Sat&ndash;Sun</span>
                  <span className="font-medium text-white">
                    {formatHour(weekend?.opens ?? "")} &ndash; {formatHour(weekend?.closes ?? "")}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-6 flex gap-2.5">
              <a
                href={social.facebook || "https://www.facebook.com/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <img src="/images/social/facebook.svg" alt="" width={16} height={16} className="opacity-80" />
              </a>
              <a
                href={social.instagram || "https://www.instagram.com/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <img src="/images/social/instagram.svg" alt="" width={16} height={16} className="opacity-80" />
              </a>
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <img src="/images/social/youtube.svg" alt="" width={16} height={16} className="opacity-80" />
                </a>
              )}
            </div>

            {/* Review prompt. Google review count is the dominant local/map-pack
                ranking factor and this business trails its Perth rivals badly
                (77 reviews vs 643/603/244), yet the only review CTA on the site
                was buried on /reviews. This puts the ask on every page. */}
            {social.google && (
              <a
                href={social.google}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Star className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                Happy with our work? Leave a Google review
              </a>
            )}
          </div>
        </Reveal>
      </Container>

      <div className="relative z-10 border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/70 sm:flex-row">
          <p>
            &copy; {year} {business.legalName}. All rights reserved.
            {business.abn ? ` ABN ${business.abn}.` : ""}
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
