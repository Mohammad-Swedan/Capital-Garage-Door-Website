import { siteConfig } from "@/config/site";
import { formatHoursSummary } from "@/lib/utils";
import { getServices } from "@/lib/data/services";
import { getArticles } from "@/lib/data/articles";
import { getProblems } from "@/lib/data/problems";
import { getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import { getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import { getBrandHub, getBrandPages } from "@/lib/data/brands";

/**
 * `/llms.txt` — the llmstxt.org convention: a concise, markdown-shaped index of
 * the site for AI assistants and answer engines (GPTBot, ClaudeBot,
 * PerplexityBot all crawl it). An AI-readiness audit flagged its absence.
 *
 * Built from the same data layer as the sitemap, so new CMS pages appear here
 * automatically on revalidation. Everything degrades gracefully when the CMS
 * is unreachable (the data layer falls back to local content).
 */
export const revalidate = 3600;

/** "garage-door-repair-cost-perth" → "Garage Door Repair Cost Perth". */
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function GET() {
  const [services, articles, problems, costGuideSlugs, comparisonSlugs, suburbSlugs, brandPagesAll] =
    await Promise.all([
      getServices(),
      getArticles(),
      getProblems(),
      getCostGuidePageSlugs(),
      getComparisonPageSlugs(),
      getServiceSuburbPageSlugs(),
      getBrandPages(),
    ]);

  const url = siteConfig.url;
  const { business } = siteConfig;

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.name} is a licensed and insured garage door repair and installation company serving the Perth metro area (Western Australia). Services: emergency and same-day garage door repairs, spring/cable/motor and opener repairs and replacements, roller and sectional door installation, and preventative servicing for homes and businesses. 24/7 emergency call-outs. Every job is quoted upfront.`,
    "",
    `- Phone: ${business.phoneDisplay} (${business.phone})`,
    `- Base: ${business.address.addressLocality}, ${business.address.addressRegion} ${business.address.postalCode}, Australia — mobile technicians cover all Perth suburbs`,
    `- Hours: ${formatHoursSummary(business.hours)} (24/7 for emergencies)`,
    `- Book online: ${url}/contact`,
    "",
    "## Services",
    ...services.map(
      (s) => `- [${s.name}](${url}${s.canonicalHref}): ${s.shortDescription}`,
    ),
    "",
    "## Pricing",
    `- [Price Calculator](${url}/calculator): instant estimate ranges for common repairs`,
    ...costGuideSlugs.map((slug) => `- [${titleFromSlug(slug)}](${url}/${slug})`),
    `- [Cost Guides](${url}/cost-guides)`,
    "",
    "## Buying Guides & Comparisons",
    ...comparisonSlugs.map((slug) => `- [${titleFromSlug(slug)}](${url}/${slug})`),
    "",
    "## Garage Door & Motor Brands",
    `- [${getBrandHub("door").name}](${url}/${getBrandHub("door").slug})`,
    `- [${getBrandHub("motor").name}](${url}/${getBrandHub("motor").slug})`,
    ...brandPagesAll.map((p) => `- [${p.hero.h1}](${url}/${p.slug})`),
    "",
    "## Common Problems",
    ...problems.map((p) => `- [${p.name}](${url}/problems/${p.slug})`),
    `- [All problems](${url}/problems)`,
    "",
    "## Articles",
    ...articles.map((a) => `- [${a.title}](${url}/blog/${a.slug})`),
    "",
    "## Service Areas",
    `- [All Perth service areas](${url}/service-areas)`,
    ...suburbSlugs.map((slug) => `- [${titleFromSlug(slug)}](${url}/${slug})`),
    "",
    "## Company",
    `- [About](${url}/about)`,
    `- [Reviews](${url}/reviews)`,
    `- [Warranty](${url}/warranty)`,
    `- [Gallery](${url}/gallery)`,
    `- [Contact](${url}/contact)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
