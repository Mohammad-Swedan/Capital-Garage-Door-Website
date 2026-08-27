import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandHubTemplate } from "@/components/sections/brands/brand-hub-template";
import { buildHubProps } from "@/components/sections/brands/hub-data";
import { getBrandHub } from "@/lib/data/brands";
import { brandHubSchemas, faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const hub = getBrandHub("door");

export const metadata: Metadata = buildMetadata({
  title: hub.seo.title,
  description: hub.seo.description,
  path: `/${hub.slug}`,
});

/**
 * The door-brand hub. A static route rather than a `content/` entry because it isn't a page type —
 * it's the parent of the brand guides that `app/[slug]` serves, and it renders the full brand
 * directory. Its twin at /garage-door-motor-brands-perth differs only by the kind passed below.
 */
export default async function GarageDoorBrandsPage() {
  const { hub: doorHub, tiles, faqs, items, entities } = await buildHubProps("door");
  return (
    <>
      {brandHubSchemas(doorHub, items).map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <BrandHubTemplate hub={doorHub} tiles={tiles} faqs={faqs} entities={entities} />
    </>
  );
}
