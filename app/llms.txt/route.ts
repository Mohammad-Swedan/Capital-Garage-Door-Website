import { siteConfig } from "@/config/site";
import { formatHoursSummary } from "@/lib/utils";
import { getServices } from "@/lib/data/services";
import { getServicePages, getServicePageSlugs } from "@/lib/data/service-pages";
import { getArticles } from "@/lib/data/articles";
import { getProblems } from "@/lib/data/problems";
import { getCostGuidePages, getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import { getStaticCostGuides } from "@/lib/data/static-cost-guides";
import { getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import { getCaseStudies } from "@/lib/data/case-studies";
import { getBrandHub, getBrandPages } from "@/lib/data/brands";
import type { CaseStudyPage } from "@/types/case-study";

/**
 * `/llms.txt` — the llmstxt.org convention: a concise, markdown-shaped index of
 * the site for AI assistants and answer engines (GPTBot, ClaudeBot,
 * PerplexityBot all crawl it). An AI-readiness audit flagged its absence.
 *
 * Built from the same data layer as the sitemap, so new CMS pages appear here
 * automatically on revalidation. Everything degrades gracefully when the CMS
 * is unreachable (the data layer falls back to local content). The lists that
 * need each page's real title (service pages, cost guides) fall back to
 * slug-derived titles if a page resolve fails, and the case-study list to just
 * the hub link, so a CMS failure in those lists never makes the route throw.
 */
export const revalidate = 3600;

/** "garage-door-repair-cost-perth" → "Garage Door Repair Cost Perth". */
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** A page slug with the title it is listed under. */
interface Titled {
  slug: string;
  title: string;
}

/**
 * Loads pages for their real titles. If a page resolve fails (a CMS blip; `getServicePages` and
 * `getCostGuidePages` throw on one), the section keeps listing the same pages under slug-derived
 * titles, exactly what this route did before it read page titles, instead of dropping them.
 */
async function withTitles<T extends { slug: string }>(
  loadPages: () => Promise<T[]>,
  loadSlugs: () => Promise<string[]>,
  titleOf: (page: T) => string,
): Promise<Titled[]> {
  try {
    const pages = await loadPages();
    return pages.map((page) => ({ slug: page.slug, title: titleOf(page) || titleFromSlug(page.slug) }));
  } catch {
    const slugs = await loadSlugs();
    return slugs.map((slug) => ({ slug, title: titleFromSlug(slug) }));
  }
}

/** Service pages listed under "Garage Doors & Installation": door-type and installation pages. */
const DOORS_AND_INSTALLATION = /(doors|installation)-perth$/;

/** Static route (app/garage-door-motors-perth), so it is not a CMS service page. */
const MOTORS_PATH = "/garage-door-motors-perth";

/** A site path with any origin and trailing slash removed, for de-duplicating hrefs. */
function pathOf(href: string): string {
  return href.replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
}

export async function GET() {
  const [
    services,
    articles,
    problems,
    comparisonSlugs,
    suburbSlugs,
    brandPagesAll,
    servicePages,
    staticGuides,
    cmsGuides,
    caseStudies,
  ] = await Promise.all([
    getServices(),
    getArticles(),
    getProblems(),
    getComparisonPageSlugs(),
    getServiceSuburbPageSlugs(),
    getBrandPages(),
    withTitles(getServicePages, getServicePageSlugs, (p) => p.hero.h1),
    getStaticCostGuides(),
    withTitles(getCostGuidePages, getCostGuidePageSlugs, (p) => p.hero.h1),
    getCaseStudies().catch((): CaseStudyPage[] => []),
  ]);

  const url = siteConfig.url;
  const { business } = siteConfig;

  const doorPages = servicePages.filter((p) => DOORS_AND_INSTALLATION.test(p.slug));

  // Whatever "Services" (the CMS catalog) or the doors section already lists is not repeated.
  const listedPaths = new Set([
    ...services.map((s) => pathOf(s.canonicalHref)),
    ...doorPages.map((p) => `/${p.slug}`),
    MOTORS_PATH,
  ]);
  const otherServices = servicePages.filter((p) => !listedPaths.has(`/${p.slug}`));

  // A static guide owns its slug (its route shadows any CMS page with the same one).
  const staticGuideSlugs = new Set(staticGuides.map((g) => g.slug));
  const cmsOnlyGuides = cmsGuides.filter((g) => !staticGuideSlugs.has(g.slug));

  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.name} is a licensed and insured garage door repair and installation company serving the Perth metro area (Western Australia). Services: emergency and same-day garage door repairs, spring/cable/motor and opener repairs and replacements, roller and sectional door installation, and preventative servicing for homes and businesses. 24/7 emergency call-outs. Every job is quoted upfront.`,
    "",
    `- Phone: ${business.phoneDisplay} (${business.phone})`,
    `- Base: ${business.address.addressLocality}, ${business.address.addressRegion} ${business.address.postalCode}, Australia — mobile technicians cover all Perth suburbs`,
    `- Hours: ${formatHoursSummary(business.hours)} (24/7 for emergencies)`,
    `- Book online: ${url}/contact`,
    `- Get a free quote: ${url}/quote`,
    "",
    "## Services",
    ...services.map(
      (s) => `- [${s.name}](${url}${s.canonicalHref}): ${s.shortDescription}`,
    ),
    "",
    "## Garage Doors & Installation",
    ...doorPages.map((p) => `- [${p.title}](${url}/${p.slug})`),
    `- [Garage Door Motors Perth](${url}${MOTORS_PATH}): Capital 1100N and 1500N motors, supplied and installed`,
    "",
    // Only when there is something left over: an empty heading is noise to a reader.
    ...(otherServices.length > 0
      ? ["## Other Services", ...otherServices.map((p) => `- [${p.title}](${url}/${p.slug})`), ""]
      : []),
    "## Pricing",
    `- [Garage Door Prices Perth — price list](${url}/cost-guides): guide prices for every job on our list, from a safety inspection to a new door supplied and installed`,
    ...staticGuides.map((g) => `- [${g.hero.h1}](${url}/${g.slug})`),
    ...cmsOnlyGuides.map((g) => `- [${g.title}](${url}/${g.slug})`),
    `- [Price Calculator](${url}/calculator): instant estimate ranges for common repairs`,
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
    "## Case Studies",
    `- [All case studies](${url}/case-studies)`,
    ...caseStudies.map((c) => `- [${c.title}](${url}/case-studies/${c.slug})`),
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
    `- [Get a Quote](${url}/quote)`,
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
