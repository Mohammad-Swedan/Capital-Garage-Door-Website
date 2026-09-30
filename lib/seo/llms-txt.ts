import { siteConfig } from "@/config/site";
import { formatHoursSummary } from "@/lib/utils";

/**
 * The pure parts of `/llms.txt` (app/llms.txt/route.ts): loading the lists with a hard cap on how
 * many CMS reads are in flight at once and no way for one failure to throw, and building the text.
 *
 * Why the cap: the route is prerendered at build and revalidated hourly, and it needs a title for
 * ~90 pages (articles, problems, service pages, cost guides, case studies). Firing those resolves
 * in one `Promise.all` opened ~90 simultaneous connections, and the CMS host drops a large share
 * of a burst that size (`UND_ERR_CONNECT_TIMEOUT`). An unguarded data-layer list rejects on the
 * first such timeout, so a failed prerender could block a deploy, and a guarded one silently came
 * back short (a 200 that then stays cached for an hour). Every CMS read here goes through ONE
 * limiter, so at most `MAX_IN_FLIGHT` are open at any moment; and every read is guarded, so a
 * failure is logged and degrades one entry (slug-derived title) or one list (empty), never the
 * route.
 */

/* ------------------------------------------------------------------ *
 * Shapes
 * ------------------------------------------------------------------ */

/** A page listed under a title. `slug` is the last URL segment; the section picks the prefix. */
export interface Titled {
  slug: string;
  title: string;
}

/** The fields of a CMS service-catalog entry that "## Services" lists. */
export interface LlmsService {
  name: string;
  canonicalHref: string;
  shortDescription: string;
}

/** Everything the text is built from: filled by `loadLlmsData`, consumed by `buildLlmsTxt`. */
export interface LlmsData {
  services: LlmsService[];
  /** Every published flat service page; the doors and "other" sections are cut from it. */
  servicePages: Titled[];
  /** Repo-only cost guides (static routes). They own their slug against a CMS guide. */
  staticGuides: Titled[];
  cmsGuides: Titled[];
  comparisonSlugs: string[];
  suburbSlugs: string[];
  /** The door hub, then the motor hub (title = the hub's name). */
  brandHubs: Titled[];
  brandPages: Titled[];
  problems: Titled[];
  articles: Titled[];
  caseStudies: Titled[];
}

/* ------------------------------------------------------------------ *
 * Small helpers
 * ------------------------------------------------------------------ */

/** "garage-door-repair-cost-perth" → "Garage Door Repair Cost Perth". */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** A site path with any origin and trailing slash removed, for de-duplicating hrefs. */
export function pathOf(href: string): string {
  return href.replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
}

/** Most CMS reads the route may have open at once (each read is one request). */
export const MAX_IN_FLIGHT = 6;

/** Runs a task, holding it back while `max` others are still running. */
export type Limiter = <T>(task: () => Promise<T>) => Promise<T>;

/**
 * A limiter shared by every read of one load. A rejected or synchronously-throwing task frees its
 * slot like any other, so one failure can never wedge the queue.
 */
export function createLimiter(max: number): Limiter {
  const cap = Math.max(1, Math.floor(max));
  let active = 0;
  const waiting: Array<() => void> = [];

  const release = () => {
    active--;
    waiting.shift()?.();
  };

  return <T>(task: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const run = () => {
        active++;
        // `Promise.resolve().then(task)` also turns a synchronous throw into a rejection.
        Promise.resolve().then(task).then(resolve, reject).finally(release);
      };
      if (active < cap) run();
      else waiting.push(run);
    });
}

/** A page with the title it is listed under; `page` is absent when its resolve failed. */
export interface ResolvedPage<T> extends Titled {
  page?: T;
}

/**
 * Resolves every slug through `limit` and lists it under `titleOf(page)`:
 * - a slug whose page no longer exists (`resolve` gives undefined/null) is left out;
 * - a slug whose resolve THROWS (timeout, 5xx) keeps its place under a slug-derived title, so a
 *   flaky read costs one heading's wording, not the entry.
 * Results keep the order of `slugs`. Never rejects.
 */
export async function resolvePages<T>(
  slugs: readonly string[],
  limit: Limiter,
  resolve: (slug: string) => Promise<T | undefined | null>,
  titleOf: (page: T) => string,
  onError?: (slug: string, error: unknown) => void,
): Promise<ResolvedPage<T>[]> {
  const entries = await Promise.all(
    slugs.map(async (slug): Promise<ResolvedPage<T> | null> => {
      try {
        const page = await limit(() => resolve(slug));
        if (page === undefined || page === null) return null;
        return { slug, title: titleOf(page).trim() || titleFromSlug(slug), page };
      } catch (error) {
        try {
          onError?.(slug, error);
        } catch {
          // Reporting must never break the route.
        }
        return { slug, title: titleFromSlug(slug) };
      }
    }),
  );
  return entries.filter((entry): entry is ResolvedPage<T> => entry !== null);
}

/** Comparator: newest `publishedAt` first; entries whose resolve failed (no date) go last. */
export function newestFirst<T extends { publishedAt: string }>(a: ResolvedPage<T>, b: ResolvedPage<T>): number {
  const time = (entry: ResolvedPage<T>) => {
    const t = entry.page ? Date.parse(entry.page.publishedAt) : NaN;
    return Number.isNaN(t) ? -Infinity : t;
  };
  const ta = time(a);
  const tb = time(b);
  return ta === tb ? 0 : tb > ta ? 1 : -1;
}

const toTitled = <T>(entries: ResolvedPage<T>[]): Titled[] =>
  entries.map(({ slug, title }) => ({ slug, title }));

/* ------------------------------------------------------------------ *
 * Loading
 * ------------------------------------------------------------------ */

/**
 * Where the data comes from. The route wires the data layer (lib/data/*) in; tests wire fakes. Each
 * `…Slugs` reads the feed once; each singular resolves one page (undefined when it is gone).
 */
export interface LlmsSources {
  services: () => Promise<LlmsService[]>;
  servicePageSlugs: () => Promise<string[]>;
  servicePage: (slug: string) => Promise<{ hero: { h1: string } } | undefined>;
  costGuideSlugs: () => Promise<string[]>;
  costGuide: (slug: string) => Promise<{ hero: { h1: string } } | undefined>;
  staticGuides: () => Promise<Array<{ slug: string; hero: { h1: string } }>>;
  comparisonSlugs: () => Promise<string[]>;
  suburbSlugs: () => Promise<string[]>;
  brandHubs: () => Promise<Array<{ slug: string; name: string }>>;
  brandPages: () => Promise<Array<{ slug: string; hero: { h1: string } }>>;
  problemSlugs: () => Promise<string[]>;
  problem: (slug: string) => Promise<{ name: string } | undefined>;
  articleSlugs: () => Promise<string[]>;
  article: (slug: string) => Promise<{ title: string; publishedAt: string } | undefined>;
  caseStudySlugs: () => Promise<string[]>;
  caseStudy: (slug: string) => Promise<{ title: string } | undefined>;
}

export interface LoadOptions {
  /** Cap on simultaneous reads (default `MAX_IN_FLIGHT`). */
  maxInFlight?: number;
  /** Called for every read that failed and was degraded; logging only, its own errors are ignored. */
  onError?: (what: string, error: unknown) => void;
}

/**
 * Loads every list `buildLlmsTxt` needs. Never rejects: a failed slug list becomes an empty list, a
 * failed page keeps its entry under a slug-derived title (see `resolvePages`), and at most
 * `maxInFlight` reads are open at once across ALL lists (one shared limiter).
 */
export async function loadLlmsData(src: LlmsSources, options: LoadOptions = {}): Promise<LlmsData> {
  const limit = createLimiter(options.maxInFlight ?? MAX_IN_FLIGHT);

  const report = (what: string, error: unknown) => {
    try {
      options.onError?.(what, error);
    } catch {
      // Reporting must never break the route.
    }
  };

  /** One read through the shared cap; a failure is reported and yields `fallback`. */
  const read = <T>(what: string, task: () => Promise<T>, fallback: T): Promise<T> =>
    limit(task).catch((error: unknown) => {
      report(what, error);
      return fallback;
    });

  /** A list of pages: the slug list first, then each page, all through the same cap. */
  const pages = async <T>(
    what: string,
    slugs: () => Promise<string[]>,
    resolve: (slug: string) => Promise<T | undefined>,
    titleOf: (page: T) => string,
  ): Promise<ResolvedPage<T>[]> => {
    const list = await read<string[] | null>(`${what} slugs`, slugs, null); // null: failed, reported
    if (list?.length === 0) {
      // The data layer's slug lists are lenient: a failed feed read comes back as [] with no
      // error. None of these lists is legitimately empty in production, so say so.
      report(`${what} slugs`, new Error("the feed returned no slugs"));
    }
    return resolvePages(list ?? [], limit, resolve, titleOf, (slug, error) => report(`${what} ${slug}`, error));
  };

  const [
    services,
    servicePages,
    cmsGuides,
    staticGuides,
    comparisonSlugs,
    suburbSlugs,
    brandHubs,
    brandPages,
    problems,
    articles,
    caseStudies,
  ] = await Promise.all([
    read("services", src.services, [] as LlmsService[]),
    pages("service pages", src.servicePageSlugs, src.servicePage, (p) => p.hero.h1),
    pages("cost guides", src.costGuideSlugs, src.costGuide, (p) => p.hero.h1),
    read("static cost guides", src.staticGuides, [] as Array<{ slug: string; hero: { h1: string } }>),
    read("comparison slugs", src.comparisonSlugs, [] as string[]),
    read("suburb slugs", src.suburbSlugs, [] as string[]),
    read("brand hubs", src.brandHubs, [] as Array<{ slug: string; name: string }>),
    read("brand pages", src.brandPages, [] as Array<{ slug: string; hero: { h1: string } }>),
    pages("problems", src.problemSlugs, src.problem, (p) => p.name),
    pages("articles", src.articleSlugs, src.article, (a) => a.title),
    pages("case studies", src.caseStudySlugs, src.caseStudy, (c) => c.title),
  ]);

  return {
    services,
    servicePages: toTitled(servicePages),
    staticGuides: staticGuides.map((g) => ({ slug: g.slug, title: g.hero.h1 })),
    cmsGuides: toTitled(cmsGuides),
    comparisonSlugs,
    suburbSlugs,
    brandHubs: brandHubs.map((h) => ({ slug: h.slug, title: h.name })),
    brandPages: brandPages.map((p) => ({ slug: p.slug, title: p.hero.h1 })),
    problems: toTitled(problems),
    // Newest first, as the article list always was; an article whose resolve failed goes last.
    articles: toTitled([...articles].sort(newestFirst)),
    caseStudies: toTitled(caseStudies),
  };
}

/* ------------------------------------------------------------------ *
 * Building
 * ------------------------------------------------------------------ */

/** Service pages listed under "Garage Doors & Installation": door-type and installation pages. */
const DOORS_AND_INSTALLATION = /(doors|installation)-perth$/;

/** Static route (app/garage-door-motors-perth), so it is not a CMS service page. */
const MOTORS_PATH = "/garage-door-motors-perth";

/**
 * The `/llms.txt` body (llmstxt.org style) from loaded data. Total: an empty list simply leaves its
 * section short, so a degraded load still yields a valid file.
 */
export function buildLlmsTxt(data: LlmsData): string {
  const url = siteConfig.url;
  const { business } = siteConfig;

  const doorPages = data.servicePages.filter((p) => DOORS_AND_INSTALLATION.test(p.slug));

  // Whatever "Services" (the CMS catalog) or the doors section already lists is not repeated.
  const listedPaths = new Set([
    ...data.services.map((s) => pathOf(s.canonicalHref)),
    ...doorPages.map((p) => `/${p.slug}`),
    MOTORS_PATH,
  ]);
  const otherServices = data.servicePages.filter((p) => !listedPaths.has(`/${p.slug}`));

  // A static guide owns its slug (its route shadows any CMS page with the same one).
  const staticGuideSlugs = new Set(data.staticGuides.map((g) => g.slug));
  const cmsOnlyGuides = data.cmsGuides.filter((g) => !staticGuideSlugs.has(g.slug));

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
    ...data.services.map((s) => `- [${s.name}](${url}${s.canonicalHref}): ${s.shortDescription}`),
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
    ...data.staticGuides.map((g) => `- [${g.title}](${url}/${g.slug})`),
    ...cmsOnlyGuides.map((g) => `- [${g.title}](${url}/${g.slug})`),
    `- [Price Calculator](${url}/calculator): instant estimate ranges for common repairs`,
    "",
    "## Buying Guides & Comparisons",
    ...data.comparisonSlugs.map((slug) => `- [${titleFromSlug(slug)}](${url}/${slug})`),
    "",
    "## Garage Door & Motor Brands",
    ...data.brandHubs.map((h) => `- [${h.title}](${url}/${h.slug})`),
    ...data.brandPages.map((p) => `- [${p.title}](${url}/${p.slug})`),
    "",
    "## Common Problems",
    ...data.problems.map((p) => `- [${p.title}](${url}/problems/${p.slug})`),
    `- [All problems](${url}/problems)`,
    "",
    "## Articles",
    ...data.articles.map((a) => `- [${a.title}](${url}/blog/${a.slug})`),
    "",
    "## Case Studies",
    `- [All case studies](${url}/case-studies)`,
    ...data.caseStudies.map((c) => `- [${c.title}](${url}/case-studies/${c.slug})`),
    "",
    "## Service Areas",
    `- [All Perth service areas](${url}/service-areas)`,
    ...data.suburbSlugs.map((slug) => `- [${titleFromSlug(slug)}](${url}/${slug})`),
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

  return lines.join("\n");
}
