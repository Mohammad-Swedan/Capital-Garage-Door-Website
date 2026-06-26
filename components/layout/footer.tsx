import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/config/site";

function formatHour(time: string) {
  if (!time) return "Closed";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function Footer() {
  const year = new Date().getFullYear();
  const { business, social, footerNav } = siteConfig;

  const navSections = footerNav.filter((section) => section.title !== "Legal");
  const legalLinks = footerNav.find((section) => section.title === "Legal")?.links ?? [];

  const weekday = business.hours.find((h) => h.day === "Monday");
  const saturday = business.hours.find((h) => h.day === "Saturday");
  const sunday = business.hours.find((h) => h.day === "Sunday");

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
        <Reveal className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="inline-flex rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <Image
                src="/images/CGD-logo-with-text.png"
                alt={siteConfig.name}
                width={220}
                height={110}
                className="h-9 w-auto"
              />
            </div>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {siteConfig.tagline}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${business.phone}`}
                className="group flex items-center gap-3 rounded-md text-sm font-semibold text-white outline-none transition-colors hover:text-sky-300 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors group-hover:border-cta/40 group-hover:bg-cta/15">
                  <Phone className="h-4 w-4 text-sky-300" aria-hidden="true" />
                </span>
                {business.phoneDisplay}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="group flex items-center gap-3 rounded-md text-sm text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors group-hover:border-white/30 group-hover:bg-white/10">
                  <Mail className="h-4 w-4 text-sky-300" aria-hidden="true" />
                </span>
                {business.email}
              </a>
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
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 rounded-sm text-sm text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3 -translate-x-1 text-sky-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none" />
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
                  <span>Saturday</span>
                  <span className="font-medium text-white">
                    {formatHour(saturday?.opens ?? "")} &ndash; {formatHour(saturday?.closes ?? "")}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Sunday</span>
                  <span className="font-medium text-white">{formatHour(sunday?.opens ?? "")}</span>
                </span>
              </li>
            </ul>

            <div className="mt-6 flex gap-2.5">
              <a
                href={social.facebook || "https://www.facebook.com/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 outline-none transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <img src="/images/social/facebook.svg" alt="" width={16} height={16} className="opacity-80" />
              </a>
              <a
                href={social.instagram || "https://www.instagram.com/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 outline-none transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <img src="/images/social/instagram.svg" alt="" width={16} height={16} className="opacity-80" />
              </a>
            </div>
          </div>
        </Reveal>
      </Container>

      <div className="relative z-10 border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            &copy; {year} {business.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
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
