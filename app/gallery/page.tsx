import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { GalleryFilterGrid } from "@/components/sections/gallery/gallery-filter-grid";
import { getGalleryItems } from "@/lib/data/gallery";
import { collectionPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import type { GalleryCategory } from "@/types/gallery";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Gallery Perth | Capital Garage Door",
  description:
    "See recent garage door repairs, installations, and motor upgrades completed by Capital Garage Door across Perth suburbs.",
  path: "/gallery",
});

const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Repairs",
  "Installations",
  "Motors",
  "Roller Doors",
  "Commercial",
  "Before & After",
];

export default async function GalleryPage() {
  const phone = siteConfig.business.phone;
  const items = await getGalleryItems();

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Garage Door Gallery",
          description: "Recent garage door repairs, installations, and motor upgrades completed across Perth.",
          path: "/gallery",
        })}
      />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Gallery", url: "/gallery" }]} />
      </Container>

      <PageHero
        eyebrow="Local Proof"
        title="Recent Garage Door Work in Perth"
        subtitle="A look at recent repairs, installations, and motor upgrades completed by our technicians across Perth suburbs."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background pb-2 sm:pb-4">
        <Container>
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              These photos are a sample of our recent jobs — as more job photos come through from our technicians,
              we&apos;ll keep adding them here so you can see exactly the kind of work to expect.
            </p>
          </Reveal>
        </Container>
      </section>

      <GalleryFilterGrid items={items} categories={GALLERY_CATEGORIES} />

      <CTASection
        heading="Want a Similar Result?"
        body="Tell us what's going on with your garage door and we'll get back to you with a fast, fair quote."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
