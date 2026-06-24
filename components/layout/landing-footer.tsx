import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Slim footer for paid landing pages — trust signals and contact only, no full
 * navigation. Reuses the navy language of the main footer so it still feels
 * on-brand while keeping the page focused on conversion.
 */
export function LandingFooter() {
  const year = new Date().getFullYear();
  const { business, footerNav } = siteConfig;
  const legalLinks = footerNav.find((section) => section.title === "Legal")?.links ?? [];

  return (
    <footer className="bg-[#0d1f60] text-white">
      <Container className="flex flex-col items-center gap-6 py-10 text-center sm:py-12">
        <div className="inline-flex rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <Image
            src="/images/CGD-logo-with-text.png"
            alt={siteConfig.name}
            width={220}
            height={110}
            className="h-8 w-auto"
          />
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-7">
          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-sky-300"
          >
            <Phone className="h-4 w-4 text-sky-300" aria-hidden="true" />
            {business.phoneDisplay}
          </a>
          <a
            href={`mailto:${business.email}`}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4 text-sky-300" aria-hidden="true" />
            {business.email}
          </a>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          Licensed &amp; Insured · Servicing Perth &amp; Surrounds
        </span>

        <div className="flex w-full flex-col items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {business.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
