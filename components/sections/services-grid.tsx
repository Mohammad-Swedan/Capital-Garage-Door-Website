import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import { getServices } from "@/lib/data/services";
import { cn } from "@/lib/utils";

type Tone = "navy" | "red";

interface TileLayout {
  /** Grid placement at the `lg` bento breakpoint. */
  span: string;
  /** Aspect ratio below `lg`, where tiles stack instead of spanning rows. */
  aspect: string;
  tone: Tone;
  feature?: boolean;
}

// Tessellates a 4-col x 3-row bento at `lg`: the feature tile (2x2) + two 2x1
// tiles + two 1x1 tiles + one 2x1 tile = 12 cells, no gaps, no overlap. Below
// `lg` it collapses to a 2-col bento (full-width banners + a paired square
// row) instead of a plain single-column stack.
const LAYOUT: TileLayout[] = [
  {
    span: "col-span-2 lg:col-span-2 lg:row-span-2",
    aspect: "aspect-[4/3] sm:aspect-[16/10]",
    tone: "navy",
    feature: true,
  },
  {
    span: "col-span-2 lg:col-span-2",
    aspect: "aspect-[16/10]",
    tone: "navy",
  },
  {
    span: "col-span-1 lg:col-span-1",
    aspect: "aspect-square",
    tone: "navy",
  },
  {
    span: "col-span-1 lg:col-span-1",
    aspect: "aspect-square",
    tone: "navy",
  },
  {
    span: "col-span-2 lg:col-span-2",
    aspect: "aspect-[16/10]",
    tone: "red",
  },
  {
    span: "col-span-2 lg:col-span-2",
    aspect: "aspect-[16/10]",
    tone: "navy",
  },
];

export async function ServicesGrid() {
  const services = await getServices();

  return (
    <section className="relative overflow-hidden bg-[#0a1733] py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(27,59,140,0.45),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(200,34,42,0.18),transparent_45%)]"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-cta uppercase">Our Services</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything Your Garage Door Needs
          </h2>
          <p className="mt-4 text-white/70">
            From emergency repairs to full installations, our licensed technicians handle it all.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[220px] lg:grid-flow-row-dense lg:gap-5">
          {services.map((service, index) => {
            const Icon = resolveIcon(service.icon);
            const layout = LAYOUT[index] ?? LAYOUT[LAYOUT.length - 1];
            const compact = layout.aspect === "aspect-square";

            return (
              <Reveal
                key={service.slug}
                delay={index * 0.06}
                className={cn("h-full", layout.aspect, "lg:aspect-auto", layout.span)}
              >
                <Link
                  href={service.canonicalHref}
                  className="group relative block h-full cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-300 ease-out active:scale-[0.98] sm:rounded-3xl sm:active:scale-100 hover:ring-cta/60 focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none"
                >
                  <ServiceMedia image={service.image} alt={service.name} tone={layout.tone} />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1733]/95 via-[#0a1733]/25 to-transparent" />

                  <span
                    className={cn(
                      "cgd-glass-card-dark absolute left-3 top-3 inline-flex items-center justify-center text-white sm:left-4 sm:top-4 sm:h-11 sm:w-11",
                      compact ? "h-8 w-8" : "h-9 w-9",
                    )}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </span>

                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0",
                      compact ? "p-3 sm:p-4" : "p-4 sm:p-6 lg:p-7",
                    )}
                  >
                    <h3
                      className={cn(
                        "font-heading font-bold leading-snug text-white",
                        layout.feature
                          ? "text-lg sm:text-2xl lg:text-3xl"
                          : compact
                            ? "text-sm sm:text-lg"
                            : "text-base sm:text-xl",
                      )}
                    >
                      {service.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 max-w-md text-xs leading-relaxed text-white/75 sm:mt-1.5 sm:text-sm",
                        compact && "hidden sm:block",
                      )}
                    >
                      {service.shortDescription}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white transition-[gap] duration-200 group-hover:gap-2 sm:mt-3 sm:text-sm",
                        compact && "hidden sm:inline-flex",
                      )}
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-12">
          <p className="text-sm text-white/60">Looking for something specific? We cover the full range.</p>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-cta/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

function ServiceMedia({ image, alt, tone }: { image: string; alt: string; tone: Tone }) {
  return (
    <div className="absolute inset-0 origin-center overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.05]">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={60}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(10,23,51,0.55),transparent_50%)]" />
      {tone === "red" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(200,34,42,0.4),transparent_60%)]" />
      )}
    </div>
  );
}
