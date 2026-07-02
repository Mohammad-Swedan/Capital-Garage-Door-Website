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
  { name: "Avanti", description: "Premium garage door solutions with innovative design and reliable performance.", logo: "/images/brands/avanti.webp" },
  { name: "Gliderol", description: "Leading manufacturer of residential and commercial garage doors in Australia.", logo: "/images/brands/gliderol.webp" },
  { name: "B&D", description: "Trusted Australian brand known for quality garage doors and automation systems.", logo: "/images/brands/bd.webp" },
  { name: "Steel-Line", description: "Innovative garage door solutions with superior engineering and design.", logo: "/images/brands/steel-line.webp" },
  { name: "Superlift", description: "Quality garage door solutions with professional installation and service.", logo: "/images/brands/superlift.webp" },
  { name: "Boss Openers", description: "Reliable garage door systems designed for Australian conditions.", logo: "/images/brands/boss-openers.webp" },
  { name: "Perth Windsor Doors", description: "Advanced garage door technology with superior performance and durability.", logo: "/images/brands/perth-windsor-doors.webp" },
  { name: "Jaytech", description: "Premium garage door manufacturer with comprehensive warranty coverage.", logo: "/images/brands/jaytech.webp" },
];

const TRUST_PILLS = [
  { icon: BadgeCheck, label: "Authorized Dealers" },
  { icon: Award, label: "Premium Quality" },
  { icon: ShieldCheck, label: "Full Warranties" },
];

/**
 * One logo slot — a white card holding the real logo (the source logos are dark-on-white,
 * so a white card keeps them crisp and uniform on the section's muted background). Falls back
 * to a labelled placeholder when a brand has no logo yet.
 */
function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <div
      title={brand.description}
      className="relative mx-3 h-16 w-36 shrink-0 rounded-xl border border-border/60 bg-white shadow-sm sm:mx-4 sm:h-20 sm:w-44"
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={`${brand.name} garage doors logo`}
          fill
          sizes="(min-width: 640px) 176px, 144px"
          className="object-contain p-3.5 sm:p-4"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-2 px-3 text-muted-foreground">
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

      {/* Flat dual-track marquee: two identical rows offset by one track-width loop seamlessly.
          The edge-fade mask softens both ends so cards slide in/out rather than hard-clip. */}
      <div className="cgd-brand-marquee relative mt-10 flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:mt-14">
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
