import { BadgeCheck, Award, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export interface Brand {
  name: string;
  description: string;
}

/**
 * The garage-door manufacturers Capital is an authorized dealer for. Single source of truth —
 * also imported by the About page to feed `knowsAbout` into the AboutPage JSON-LD, so the
 * visible strip and the structured data never drift.
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

/**
 * "Brands We Work With" — a CSS perspective marquee of manufacturer wordmarks.
 *
 * Server component / pure CSS (no JS, no video runtime): the row is rendered twice and the
 * `.cgd-brand-track` keyframe (app/globals.css) translates it -50% for a seamless loop, tilted
 * in 3D and faded into the section background by an edge mask. Pauses on hover and goes static
 * under `prefers-reduced-motion` (both handled in CSS). Each item carries trailing padding (not
 * flex `gap`) so the -50% loop stays perfectly seamless.
 */
export function BrandsMarquee() {
  // Two passes of the list → translateX(-50%) lands each name exactly where its clone was.
  const row = [...BRANDS, ...BRANDS];

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

      {/* Perspective marquee. The mask fades the wordmarks into the section bg at both edges,
          so no fade colour needs to be hard-coded. */}
      <div className="relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [perspective:1200px] sm:mt-14">
        <div className="[transform:rotateX(6deg)_rotateY(-12deg)] [transform-style:preserve-3d] md:[transform:rotateX(8deg)_rotateY(-16deg)]">
          <div className="cgd-brand-track flex w-max items-center">
            {row.map((brand, i) => (
              <span
                key={i}
                title={brand.description}
                aria-hidden={i >= BRANDS.length}
                className="block shrink-0 pr-10 font-heading text-3xl font-black tracking-tight whitespace-nowrap text-foreground/80 select-none sm:pr-16 sm:text-5xl"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
