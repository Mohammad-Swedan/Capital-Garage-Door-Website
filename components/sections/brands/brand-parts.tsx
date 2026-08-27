import Link from "next/link";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import type { BrandEntity, BrandParts as BrandPartsData } from "@/types/brand";

interface BrandPartsProps {
  entity: BrandEntity;
  parts: BrandPartsData;
}

const PARTS_LINKS = [
  { label: "Panel replacement in Perth", href: "/garage-door-panel-replacement-perth" },
  { label: "Compare new doors across every brand", href: "/garage-doors-perth" },
];

/** Bare internal paths written in prose, e.g. "…see /garage-doors-perth." */
const PATH_TOKEN = /(\/[a-z0-9]+(?:-[a-z0-9]+)+)/g;

/** "/garage-doors-perth" → "garage doors in Perth" — reads as an anchor mid-sentence. */
function labelForPath(path: string): string {
  const words = path.slice(1).split("-");
  const inPerth = words[words.length - 1] === "perth";
  const base = (inPerth ? words.slice(0, -1) : words).join(" ");
  return inPerth ? `${base} in Perth` : base;
}

/**
 * Content files write cross-references as bare paths ("…see /garage-doors-perth."), which would
 * otherwise render as a raw URL in the middle of a sentence. Turn them into real links so the
 * prose reads properly and the reference counts as an internal link.
 */
function renderProse(text: string) {
  return text.split(PATH_TOKEN).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} className="font-semibold text-[#0f4e9b] hover:underline">
        {labelForPath(part)}
      </Link>
    ) : (
      part
    ),
  );
}

/**
 * Door pages only: what "genuine parts" actually means for this manufacturer — which panels and
 * hardware can be matched, and when we'd say replace instead of patch.
 */
export function BrandParts({ entity, parts }: BrandPartsProps) {
  if (parts.paragraphs.length === 0) return null;

  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow="Parts & panels" title={parts.heading} />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-10">
          {parts.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {renderProse(paragraph)}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {PARTS_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:text-[#0f4e9b]"
                >
                  <PackageCheck className="h-4 w-4 text-[#0f4e9b]" aria-hidden="true" />
                  {link.label}
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[#0f4e9b]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Genuine {entity.name} parts sourced to the correct rating for your door.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
