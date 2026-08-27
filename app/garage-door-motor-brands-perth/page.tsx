import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandHubTemplate } from "@/components/sections/brands/brand-hub-template";
import { buildHubProps } from "@/components/sections/brands/hub-data";
import { getBrandHub } from "@/lib/data/brands";
import { brandHubSchemas, faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const hub = getBrandHub("motor");

export const metadata: Metadata = buildMetadata({
  title: hub.seo.title,
  description: hub.seo.description,
  path: `/${hub.slug}`,
});

/**
 * The motor/opener-brand hub — the twin of /garage-door-brands-perth, differing only by the kind
 * passed to `buildHubProps`. Every brand whose entity carries the "motor" kind gets a tile here,
 * whether or not it has a guide page yet.
 */
export default async function GarageDoorMotorBrandsPage() {
  const { hub: motorHub, tiles, faqs, items, entities } = await buildHubProps("motor");
  return (
    <>
      {brandHubSchemas(motorHub, items).map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <BrandHubTemplate hub={motorHub} tiles={tiles} faqs={faqs} entities={entities} />
    </>
  );
}
