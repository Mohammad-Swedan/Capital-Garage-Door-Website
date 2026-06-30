import Image from "next/image";
import { BadgeCheck, Award, ShieldCheck, Image as PlaceholderIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export interface Brand {
  name: string;
  description: string;
  /**
   * Logo image URL — a local `/public` path or a CDN URL. When omitted, a labelled placeholder
   * slot is rendered instead, so the strip works before the real logos are supplied. Drop the
   * file paths in here (or upload to the media library and reference the CDN URL) to go live.
   */
  logo?: string;
}

/**
 * The garage-door manufacturers Capital is an authorized dealer for. Single source of truth —
 * also imported by the About page to feed `knowsAbout` into the AboutPage JSON-LD, so the
 * visible strip and the structured data never drift. Add a `logo` to swap a placeholder for the
 * real brand logo.
 */
export const BRANDS: Brand[] = [
  { name: "Avanti", description: "Premium garage door solutions with innovative design and reliable performance." },
  { name: "Gliderol", description: "Leading manufacturer of residential and commercial garage doors in Australia." },
  { name: "B&D", description: "Trusted Australian brand known for quality garage doors and automation systems." },
  { name: "Steel-Line", description: "Innovative garage door solutions with superior engineering and design." },
  { name: "Superlift", description: "Quality garage door solutions with professional installation and service." },
  { name: "Boss Openers", description: "Reliable garage door systems designed for Australian conditions." },
  { name: "Perth Windsor Doors", description: "Advanced garage door technology with superior performance and durability." },
  { name: "Jaytech", description: "Premium garage door manufacturer with comprehensive warranty coverage." },
];

const TRUST_PILLS = [
  { icon: BadgeCheck, label: "Authorized Dealers" },
  { icon: Award, label: "Premium Quality" },
  { icon: ShieldCheck, label: "Full Warranties" },
];

/** One logo slot — the real logo (next/image) when supplied, otherwise a labelled placeholder. */
function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <div
      title={brand.description}
      className="mx-4 inline-flex h-14 w-32 shrink-0 items-center justify-center sm:mx-7 sm:h-16 sm:w-40"
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={160}
          height={64}
          className="max-h-full w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-muted-foreground">
          <PlaceholderIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          <span className="truncate text-xs font-semibold sm:text-sm">{brand.name}</span>
        </div>
      )}
    </div>
  );
}

/**
 * "Brands We Work With" — a flat, continuous logo marquee.
 *
 * Two identical tracks (`.cgd-brand-track` / `.cgd-brand-track-2`, keyframes in app/globals.css)
 * chase each other for a seamless horizontal scroll, pure CSS (no JS, no video runtime). Pauses on
 * hover and goes static under `prefers-reduced-motion`. Logos render once the `logo` field is set on
 * a brand; until then each slot shows a labelled placeholder.
 */
export function BrandsMarquee() {
  return (
    <section
      className="overflow-hidden border-y border-border/60 bg-muted/30 py-14 sm:py-20"
      aria-labelledby="brands-heading"
    >
      <Container className="max-w-3xl text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <span className="text-xs font-bold tracking-wider text-cta uppercase">
            Authorized Dealer Network
          </span>
          <h2
            id="brands-heading"
            className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Brands We Work With
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            We partner with Australia&apos;s most trusted garage door manufacturers to bring you the highest
            quality products, backed by comprehensive warranties and expert installation.
          </p>
          <ul className="mt-1 flex flex-wrap items-center justify-center gap-2.5">
            {TRUST_PILLS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      {/* Flat dual-track marquee: two identical rows offset by one track-width loop seamlessly. */}
      <div className="cgd-brand-marquee relative mt-10 flex w-full overflow-hidden sm:mt-14">
        <div className="cgd-brand-track flex shrink-0 items-center">
          {BRANDS.map((brand) => (
            <BrandLogo key={brand.name} brand={brand} />
          ))}
        </div>
        <div className="cgd-brand-track-2 absolute top-0 flex shrink-0 items-center" aria-hidden="true">
          {BRANDS.map((brand) => (
            <BrandLogo key={brand.name} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
