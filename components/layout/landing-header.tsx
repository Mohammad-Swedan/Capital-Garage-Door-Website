import Image from "next/image";
import { Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Minimal header for paid landing pages — logo, phone number and a single
 * "Call Now" CTA. No site navigation, so paid traffic stays focused on the
 * page's one job: converting. The logo is intentionally not a link to avoid
 * leaking ad clicks away from the landing page.
 */
export function LandingHeader() {
  const { business } = siteConfig;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <span className="flex items-center" aria-label={siteConfig.name}>
          <Image
            src="/images/CGD-logo-with-text.png"
            alt={siteConfig.name}
            width={220}
            height={110}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 180px, 220px"
            className="h-16 w-auto sm:h-20"
          />
        </span>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={`tel:${business.phone}`}
            className="hidden items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-cta sm:flex"
          >
            <Phone className="h-4 w-4 text-cta" aria-hidden="true" />
            {business.phoneDisplay}
          </a>

          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-1.5 rounded-full bg-cta px-4 py-2.5 text-sm font-bold text-cta-foreground shadow-[0_4px_20px_rgba(200,34,42,0.3)] transition-all hover:-translate-y-0.5 hover:bg-cta/90 hover:shadow-[0_6px_28px_rgba(200,34,42,0.45)] active:translate-y-0 active:scale-95"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call Now
          </a>
        </div>
      </Container>
    </header>
  );
}
