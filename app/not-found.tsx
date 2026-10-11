import Link from "next/link";
import { Phone, SearchX } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
// @module source-tracking:begin not-found-import
import { NotFoundReporter } from "@/modules/source-tracking";
// @module source-tracking:end not-found-import

/**
 * Site-wide 404 — rendered for unmatched URLs and for every `notFound()` call.
 * It renders inside the root layout, so the normal header/footer chrome is
 * around it; Next adds `noindex` automatically.
 *
 * Created by scripts/module-sync.mjs (source-tracking module) because this
 * repo had no app/not-found.tsx. It is an ordinary host page from now on —
 * restyle it freely. `NotFoundReporter` logs a `not_found` event (path +
 * referrer) so broken inbound links show up in the source-tracking data.
 */
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our services" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <section className="py-16 sm:py-24">
      {/* @module source-tracking:begin not-found-reporter */}
      <NotFoundReporter />
      {/* @module source-tracking:end not-found-reporter */}
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <SearchX className="h-12 w-12 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">We couldn&apos;t find that page</h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            The link may be old or mistyped. If your garage door needs help right now, give us a call.
          </p>
          <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={`tel:${siteConfig.business.phone}`}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {siteConfig.business.phoneDisplay}
            </a>
            <Link href="/" className="font-semibold text-primary underline-offset-4 hover:underline">
              Back to the home page
            </Link>
          </div>
          <nav aria-label="Popular pages" className="mt-4">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
