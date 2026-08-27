# Brand Pages ("Brand Atlas") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship motor-brand and door-brand pages, two brand directory hubs, and Services/Doors/Motors mega-menus for capitalgaragedoors.com.au, with every fact sourced, every price from the catalog, and every page statically generated and in the sitemap.

**Architecture:** A new local-content type (`content/brands/*`, `types/brand.ts`) behind an async data layer (`lib/data/brands.ts`) that resolves prices from the live CMS catalog with baked fallback, rendered by a bespoke `BrandPageTemplate` through the shared `app/[slug]` resolver (brand registry checked first). Two static hub routes render a `BrandHubTemplate` (brand wall + finder + facts table). The header gets three Base UI `NavigationMenu` mega-menus driven by `config/nav-menus.ts`.

**Tech Stack:** Next.js 16 (App Router, async params), React 19, TypeScript, Tailwind v4, Base UI (`@base-ui/react/navigation-menu`), lucide-react, `node:test` via `tsx --test` for pure helpers, DataForSEO REST for research.

**Spec:** `docs/superpowers/specs/2026-08-27-brand-pages-design.md` — read it first; this plan implements it section by section.

## Global Constraints

- **Next.js 16 / React 19** — `params` are `Promise`s; read `node_modules/next/dist/docs/` before touching routing/metadata/`<Image>`. `images.qualities` allows only `[60, 75]`.
- **Import alias** `@/*` → repo root. Scripts under `scripts/` must start with `export {};` (module scope) and use **relative** imports.
- **No local test runner exists** — pure helpers are tested with `npx tsx --test "lib/brands/__tests__/*.test.ts"` (Node 24 `node:test`). Everything else is verified by `npx tsc --noEmit`, `npm run lint` on changed files, `npx tsx scripts/check-brand-content.ts`, `npm run build`, and a browser.
- **Prices:** never a literal `$` followed by a digit in any content file. Use `pricingPins` (scenario ids from `components/sections/smart-calculator/pricing-data.ts`) and `{{price:<id>}}` tokens.
- **Claims:** the words "authorised"/"authorized"/"dealer" may appear only on pages whose entity has `dealer: true`. The dealer set is exactly: `b-and-d`, `steel-line`, `gliderol`, `avanti`, `superlift`, `boss`, `perth-windsor-doors`, `jaytech`.
- **Facts:** origin / ownership / founded / model names / app names only from the brand's official site (recorded in `sources`). Unknown → omit the field.
- **Titles ≤ 60 chars, descriptions ≤ 160 chars** (`buildMetadata` warns in dev). Exactly one `<h1>` per page.
- **Every href must return 200** (never a redirect) — the check script validates against the live sitemap + local registries.
- **Design tokens:** `--primary #1b3b8c`, `--foreground #0d1f45`, `--cta #c8222a`, fonts `font-display` / `font-heading` / `font-body`; existing motion = `Reveal` (`components/motion/reveal.tsx`, props `delay`, `y`, `className`) and CSS keyframes only. Respect `prefers-reduced-motion`. Nothing new on the main thread (mobile perf ceiling — see memory).
- **Commits:** one per task, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` + `Claude-Session` trailer. **Never push** — pushing `main` deploys to production; the user decides that at the end.
- **Model routing (token efficiency):** Opus for design-heavy/architectural tasks (3, 4, 6, 7, 9); Sonnet for mechanical and content tasks (1, 2, 5, 8, 10, 11). Dispatch Task 5's four content batches in parallel.

---

## File map

| Path | Responsibility |
|---|---|
| `types/brand.ts` | `BrandEntity`, `BrandPage`, `BrandHub`, `ResolvedBrandPage` types |
| `content/brands/entities.ts` | The 39 brand entities (facts + logo/accent + dealer flag) — **client-safe, data only** |
| `content/brands/hubs.ts` | The two hub definitions (slug, names, seo, hero copy, FAQs) |
| `content/brands/motors/<brand>.ts`, `content/brands/doors/<brand>.ts` | One `BrandPage` per brand page |
| `content/brands/index.ts` | `brandPages: BrandPage[]` registry |
| `lib/brands/pricing.ts` | Pure: pins → rows (catalog override), `{{price:id}}` rendering, literal-price guard |
| `lib/brands/match.ts` | Pure: brand-mention regex for case-study matching + finder |
| `lib/brands/__tests__/*.test.ts` | `node:test` specs for the two pure modules |
| `lib/data/brands.ts` | Async data layer: entities, pages, slugs, hrefs, `resolveBrandPage`, case studies |
| `components/sections/brands/brand-mark.tsx` | Logo-or-monogram tile (shared by nav, hubs, pages) |
| `components/sections/brands/brand-plate.tsx` | Hero card: mark + quick-facts rail + dealer/serviced ribbon + official link |
| `components/sections/brands/brand-hero.tsx`, `brand-services.tsx`, `brand-models.tsx`, `brand-faults.tsx`, `brand-decision.tsx`, `brand-parts.tsx`, `related-brands.tsx` | Brand page sections |
| `components/sections/brands/brand-page-template.tsx` | Composes the sections in spec §6 order |
| `components/sections/brands/brand-finder.tsx` (client), `brand-directory.tsx` (client), `brand-facts-table.tsx`, `badge-guide.tsx`, `dealer-strip.tsx`, `brand-ticker.tsx`, `brand-hub-template.tsx` | Hub sections + template |
| `components/sections/brands/brand-strip.tsx` | "We service every motor brand" chips for `/garage-door-motors-perth` |
| `app/garage-door-brands-perth/page.tsx`, `app/garage-door-motor-brands-perth/page.tsx` | Static hub routes |
| `config/nav-menus.ts` | Mega-menu data (`NAV_MENUS`) |
| `components/layout/mega-menu.tsx` | Desktop panel renderer (client) |
| `components/layout/header.tsx` | Wires `NavigationMenu` desktop + accordion mobile |
| `lib/seo/schema.ts` (+`brandPageSchema`, `brandHubSchemas`), `components/seo/page-schema.tsx` (+`kind: "brand"`) | JSON-LD |
| `app/[slug]/page.tsx`, `app/sitemap.ts`, `app/llms.txt/route.ts`, `config/site.ts`, `lib/analytics.ts` | Wiring |
| `scripts/check-brand-content.ts` | Content/link/claims guard |
| `scripts/link-brand-hubs.ts` | Phase-B CMS cross-links (prod) |
| `docs/marketing/brand-research-2026-08/entities/*.md`, `paa/*.md` | Per-brand research + PAA snapshots |

---

### Task 1: Types, pure helpers (TDD), registries, data layer

**Model:** Sonnet.

**Files:**
- Create: `types/brand.ts`, `lib/brands/pricing.ts`, `lib/brands/match.ts`, `lib/brands/__tests__/pricing.test.ts`, `lib/brands/__tests__/match.test.ts`, `content/brands/entities.ts`, `content/brands/hubs.ts`, `content/brands/index.ts`, `lib/data/brands.ts`

**Interfaces:**
- Consumes: `PRICING_BY_ID` (`components/sections/smart-calculator/pricing-data.ts`), `CmsPublicPricingItem` + `cmsPublicPricing()` (`lib/cms/pricing-client.ts`), `getCaseStudies()` (`lib/data/case-studies.ts`), `getServiceSuburbPageSlugs()` (`lib/data/service-suburb-pages.ts`), `CostGuidance`/`CostGuidanceRow`/`LocalLink`/`FAQ` (`types/index.ts`), `CaseStudyPage` (`types/case-study.ts`).
- Produces (used by every later task): everything exported from `types/brand.ts` and `lib/data/brands.ts` below.

- [ ] **Step 1: Write `types/brand.ts`**

```ts
import type { CostGuidance, FAQ, LocalLink } from "@/types";

export type BrandKind = "motor" | "door";
export type BrandTag =
  | "australian-made"
  | "wa-made"
  | "smart-app"
  | "roller"
  | "sectional"
  | "tilt"
  | "commercial";

/** One manufacturer — facts shared by its nav entry, hub tile and page(s). Client-safe data. */
export interface BrandEntity {
  /** Stable key, e.g. "merlin", "b-and-d". */
  slug: string;
  name: string;
  /** Alternative spellings for the finder and case-study matching, e.g. ["B & D", "B and D"]. */
  aliases?: string[];
  /**
   * Phrases that count as a mention in job copy. Defaults to name + aliases. Set it for brands
   * whose name is an ordinary word (Nice, Boss, Guardian, Genie) so prose never false-matches.
   */
  matchTerms?: string[];
  kinds: BrandKind[];
  /** `/images/brands/*.webp` or a CDN URL. Absent → the monogram renders. */
  logo?: string;
  /** Hex accent for the monogram + brand-plate gradient (a design choice, not a fact). */
  accent: string;
  /** VERIFIED official manufacturer site. */
  url?: string;
  /** "Australia" | "USA" | "Germany" | "Perth, WA" … */
  origin: string;
  /** Parent company — only when stated on the official site. */
  ownership?: string;
  /** Only when stated on the official site. */
  founded?: number;
  /** true ONLY for the 8 dealer brands (see plan Global Constraints). */
  dealer: boolean;
  tags: BrandTag[];
  /** ≤120 chars, shown on tiles/tooltips. */
  summary: string;
  /** What the brand is known for — product lines / families, e.g. "SilentDrive, Commander, myQ". */
  productLines: string;
  /** URLs the facts came from. Never rendered. */
  sources: string[];
}

export interface BrandQuickFact {
  label: string;
  value: string;
}

export interface BrandServiceCard {
  title: string;
  description: string;
  /** lucide icon name resolved by resolvePageIcon(). */
  icon: string;
  href: string;
}

export interface BrandModel {
  name: string;
  /** "Sectional opener" | "Roller door opener" | "Sectional door" | "Roller door" … */
  type: string;
  /** Drive/tech note, e.g. "Belt drive · myQ". */
  tech?: string;
  note: string;
}

export interface BrandFault {
  label: string;
  icon: string;
  /** Slug under /problems/ (must exist — the check script verifies). */
  problemSlug?: string;
}

export interface BrandDecision {
  repairWhen: string[];
  replaceWhen: string[];
}

export interface BrandParts {
  heading: string;
  paragraphs: string[];
}

export interface BrandPage {
  /** BrandEntity.slug */
  brand: string;
  kind: BrandKind;
  /** Full URL slug, e.g. "merlin-garage-door-motors-perth". */
  slug: string;
  /** ISO date (YYYY-MM-DD) → sitemap lastmod. */
  updatedAt: string;
  seo: { title: string; description: string };
  hero: {
    h1: string;
    subtitle: string;
    pills: { icon: string; label: string }[];
  };
  /** 4–5 rows on the brand plate. */
  quickFacts: BrandQuickFact[];
  /** May contain {{price:<scenario-id>}} tokens; never a literal $. */
  directAnswer: string;
  intro: { heading: string; paragraphs: string[] };
  services: BrandServiceCard[];
  models?: BrandModel[];
  faults: BrandFault[];
  /** Motor pages. */
  decision?: BrandDecision;
  /** Door pages. */
  parts?: BrandParts;
  /** Scenario ids from pricing-data.ts. */
  pricingPins: string[];
  costIntro: string;
  costFactors: string[];
  faqs: FAQ[];
  /** Entity slugs of the same kind. */
  relatedBrands: string[];
  relatedServices: LocalLink[];
  /** Suburb names; linked to suburb pages when one exists. */
  serviceAreas: string[];
  cta: { heading: string; subtitle: string };
}

export interface BrandHub {
  kind: BrandKind;
  /** e.g. "garage-door-brands-perth" */
  slug: string;
  name: string;
  /** Short label for breadcrumbs / nav, e.g. "Door Brands". */
  shortName: string;
  seo: { title: string; description: string };
  hero: { h1: string; subtitle: string };
  intro: string[];
  faqs: FAQ[];
}

/** A brand page with runtime data resolved (prices, tokens, related brands, area links). */
export interface ResolvedBrandPage {
  page: BrandPage;
  entity: BrandEntity;
  hub: BrandHub;
  /** Page copy with {{price:*}} tokens rendered. */
  rendered: BrandPage;
  pricing: CostGuidance;
  relatedBrands: { entity: BrandEntity; href: string }[];
  /** Motor pages: the resolved "motor-replace" range for the Capital upgrade card. */
  capitalMotorRange?: string;
  areaLinks: LocalLink[];
}
```

- [ ] **Step 2: Write the failing tests for the pricing helper**

`lib/brands/__tests__/pricing.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPricingRows,
  renderPriceTokens,
  assertNoLiteralPrices,
  formatRange,
} from "../pricing";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";

test("formatRange renders AU ranges and single values", () => {
  assert.equal(formatRange(770, 990), "$770–$990");
  assert.equal(formatRange(1200, 1200), "$1,200");
});

test("buildPricingRows uses the baked range when the catalog is empty", () => {
  const rows = buildPricingRows(["motor-replace"], []);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "motor-replace");
  assert.equal(rows[0].price, "$770–$990");
  assert.equal(rows[0].source, "baked");
});

test("buildPricingRows lets an exact-name catalog row override the baked range", () => {
  const catalog: CmsPublicPricingItem[] = [
    { id: 1, scenario: "Motor / opener replacement", priceMin: 800, priceMax: 1000, note: "Live note" },
  ];
  const rows = buildPricingRows(["motor-replace"], catalog);
  assert.equal(rows[0].price, "$800–$1,000");
  assert.equal(rows[0].source, "catalog");
  assert.equal(rows[0].note, "Live note");
});

test("buildPricingRows throws on an unknown pin", () => {
  assert.throws(() => buildPricingRows(["not-a-scenario"], []), /Unknown pricing pin/);
});

test("renderPriceTokens replaces tokens and rejects unknown ones", () => {
  const rows = buildPricingRows(["motor-replace"], []);
  assert.equal(renderPriceTokens("From {{price:motor-replace}} installed", rows), "From $770–$990 installed");
  assert.throws(() => renderPriceTokens("{{price:remote}}", rows), /not in this page's pricingPins/);
});

test("assertNoLiteralPrices catches hand-written figures", () => {
  assert.throws(() => assertNoLiteralPrices("costs $450 to fix", "test"), /Literal price/);
  assert.doesNotThrow(() => assertNoLiteralPrices("costs {{price:remote}} to fix", "test"));
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx tsx --test "lib/brands/__tests__/pricing.test.ts"`
Expected: FAIL — `Cannot find module '../pricing'`.

- [ ] **Step 4: Write `lib/brands/pricing.ts`**

```ts
import { PRICING_BY_ID } from "@/components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import type { CostGuidanceRow } from "@/types";

export interface ResolvedPriceRow extends CostGuidanceRow {
  /** pricing-data.ts scenario id. */
  id: string;
  min: number;
  max: number;
  source: "catalog" | "baked";
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function formatRange(min: number, max: number): string {
  const f = (n: number) => `$${n.toLocaleString("en-AU")}`;
  return min === max ? f(min) : `${f(min)}–${f(max)}`;
}

/**
 * Pins → guide-price rows. The baked pricing-data.ts range is the fallback; a live catalog row
 * whose `scenario` equals the baked scenario name (case/punctuation-insensitive) overrides it —
 * the same exact-name rule the calculator uses, without its keyword fallback (a brand page must
 * never show a neighbouring scenario's price).
 */
export function buildPricingRows(
  pins: string[],
  catalog: CmsPublicPricingItem[] = [],
): ResolvedPriceRow[] {
  const rows: ResolvedPriceRow[] = [];
  for (const id of pins) {
    const scenario = PRICING_BY_ID.get(id);
    if (!scenario) throw new Error(`Unknown pricing pin "${id}" — must be a pricing-data.ts scenario id`);
    const target = normalize(scenario.scenario);
    const live = catalog.find(
      (r) => normalize(r.scenario ?? "") === target && r.priceMin != null && r.priceMax != null,
    );
    const min = live ? (live.priceMin as number) : scenario.priceMin;
    const max = live ? (live.priceMax as number) : scenario.priceMax;
    if (min == null || max == null) continue; // per-unit / open-ended scenarios have no range
    rows.push({
      id,
      label: scenario.scenario,
      price: formatRange(min, max),
      note: live?.note ?? scenario.publicNote,
      min,
      max,
      source: live ? "catalog" : "baked",
    });
  }
  return rows;
}

const TOKEN = /\{\{price:([a-z0-9-]+)\}\}/g;

/** Replace `{{price:<id>}}` with the resolved range. Unknown id = content bug → throw. */
export function renderPriceTokens(copy: string, rows: ResolvedPriceRow[]): string {
  return copy.replace(TOKEN, (_m, id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error(`Price token "${id}" is not in this page's pricingPins`);
    return row.price;
  });
}

/** Content files may never carry a hand-written figure (CLAUDE.md pricing rule). */
export function assertNoLiteralPrices(copy: string, where: string): void {
  if (/\$\s?\d/.test(copy)) {
    throw new Error(`Literal price in ${where} — prices must come from {{price:id}} tokens`);
  }
}
```

- [ ] **Step 5: Run the pricing tests to verify they pass**

Run: `npx tsx --test "lib/brands/__tests__/pricing.test.ts"`
Expected: 6 passing. If `motor-replace` in `pricing-data.ts` no longer reads 770–990, update the expected strings in the test to the current baked range (the test asserts the baked value, not a fixed number policy).

- [ ] **Step 6: Write the failing tests for the brand matcher**

`lib/brands/__tests__/match.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { brandPattern, textMentionsBrand } from "../match";
import type { BrandEntity } from "../../../types/brand";

const base: Omit<BrandEntity, "slug" | "name"> = {
  kinds: ["motor"],
  accent: "#000000",
  origin: "Australia",
  dealer: false,
  tags: [],
  summary: "",
  productLines: "",
  sources: [],
};

test("matches the name and aliases as whole words, case-insensitively", () => {
  const bd: BrandEntity = { ...base, slug: "b-and-d", name: "B&D", aliases: ["B & D", "B and D"] };
  assert.equal(textMentionsBrand("Replaced a b&d roller door", bd), true);
  assert.equal(textMentionsBrand("A B and D Panel Lift", bd), true);
  assert.equal(textMentionsBrand("Standard door", bd), false);
});

test("does not match inside other words (ATA vs strata/data)", () => {
  const ata: BrandEntity = { ...base, slug: "ata", name: "ATA" };
  assert.equal(textMentionsBrand("strata complex, data logged", ata), false);
  assert.equal(textMentionsBrand("an ATA GDO-9 opener", ata), true);
});

test("matchTerms replaces the name for ordinary-word brands", () => {
  const nice: BrandEntity = { ...base, slug: "nice", name: "Nice", matchTerms: ["Nice motor", "Nice opener"] };
  assert.equal(textMentionsBrand("a nice clean install", nice), false);
  assert.equal(textMentionsBrand("fitted a Nice motor", nice), true);
  assert.equal(brandPattern(nice).flags.includes("i"), true);
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `npx tsx --test "lib/brands/__tests__/match.test.ts"`
Expected: FAIL — `Cannot find module '../match'`.

- [ ] **Step 8: Write `lib/brands/match.ts`**

```ts
import type { BrandEntity } from "@/types/brand";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word, case-insensitive pattern over `matchTerms` (else name + aliases). */
export function brandPattern(entity: BrandEntity): RegExp {
  const terms = entity.matchTerms ?? [entity.name, ...(entity.aliases ?? [])];
  const alternatives = terms.map((t) => escape(t).replace(/\s+/g, "\\s+"));
  return new RegExp(`(?:^|[^a-z0-9])(?:${alternatives.join("|")})(?![a-z0-9])`, "i");
}

export function textMentionsBrand(text: string, entity: BrandEntity): boolean {
  return brandPattern(entity).test(text);
}
```

- [ ] **Step 9: Run both test files to verify they pass**

Run: `npx tsx --test "lib/brands/__tests__/*.test.ts"`
Expected: 9 passing.

- [ ] **Step 10: Create the registries and hub definitions**

`content/brands/entities.ts` (Task 2 fills the array; keep the file client-safe — no server imports):

```ts
import type { BrandEntity } from "@/types/brand";

/**
 * Every garage-door / motor brand seen in Perth — one entity per manufacturer. Drives the nav
 * mega-menus (logos), the two hubs (tiles, facts table, finder) and each brand page's plate.
 *
 * Facts (origin, ownership, founded, productLines) come ONLY from the official site listed in
 * `sources`; `accent` is a design choice. `dealer: true` is allowed ONLY for the eight brands
 * the site already names as authorised dealers (B&D, Steel-Line, Gliderol, Avanti, Superlift,
 * Boss Openers, Perth Windsor Doors, Jaytech) — scripts/check-brand-content.ts enforces it.
 * Filled by the 2026-08 research pass (docs/marketing/brand-research-2026-08/entities/).
 */
export const BRAND_ENTITIES: BrandEntity[] = [];
```

`content/brands/hubs.ts` (Task 5 fills `intro` + `faqs`):

```ts
import type { BrandHub } from "@/types/brand";

export const BRAND_HUBS: Record<"door" | "motor", BrandHub> = {
  door: {
    kind: "door",
    slug: "garage-door-brands-perth",
    name: "Garage Door Brands Perth",
    shortName: "Door Brands",
    seo: {
      title: "Garage Door Brands Perth | Every Brand Serviced & Installed",
      description:
        "Every garage door brand in Perth — Steel-Line, B&D, Gliderol, Centurion, Danmar & more. Find your brand, see what we repair, service and install, and get a same-day quote.",
    },
    hero: {
      h1: "Garage Door Brands in Perth — Every Brand We Service, Repair & Install",
      subtitle:
        "Roller, sectional or tilt, new build or 1980s original: find the brand on your door and see exactly what our Perth technicians can do for it.",
    },
    intro: [],
    faqs: [],
  },
  motor: {
    kind: "motor",
    slug: "garage-door-motor-brands-perth",
    name: "Garage Door Motor Brands Perth",
    shortName: "Motor Brands",
    seo: {
      title: "Garage Door Motor & Opener Brands Perth | Repairs & Remotes",
      description:
        "Merlin, Chamberlain, B&D, Gliderol, ATA, Boss & every other garage door motor brand in Perth — repaired, re-programmed or replaced same-day. Find your opener brand here.",
    },
    hero: {
      h1: "Garage Door Motor & Opener Brands in Perth",
      subtitle:
        "Whatever is bolted to your garage ceiling, we repair it, code remotes for it, and replace it when it's done — every major opener brand, all of Perth.",
    },
    intro: [],
    faqs: [],
  },
};
```

`content/brands/index.ts`:

```ts
import type { BrandPage } from "@/types/brand";

/**
 * Registry of brand pages. Add a file under content/brands/motors or content/brands/doors and
 * push it here to ship a new brand page — no routing or component changes required.
 * Slugs must be unique across ALL flat page types (app/[slug] resolves brands first).
 */
export const brandPages: BrandPage[] = [];
```

- [ ] **Step 11: Write `lib/data/brands.ts`**

```ts
import { BRAND_ENTITIES } from "@/content/brands/entities";
import { BRAND_HUBS } from "@/content/brands/hubs";
import { brandPages } from "@/content/brands";
import { cmsPublicPricing } from "@/lib/cms/pricing-client";
import { getCaseStudies } from "@/lib/data/case-studies";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import {
  assertNoLiteralPrices,
  buildPricingRows,
  renderPriceTokens,
  type ResolvedPriceRow,
} from "@/lib/brands/pricing";
import { textMentionsBrand } from "@/lib/brands/match";
import type { CaseStudyPage } from "@/types/case-study";
import type { LocalLink } from "@/types";
import type {
  BrandEntity,
  BrandHub,
  BrandKind,
  BrandPage,
  ResolvedBrandPage,
} from "@/types/brand";

/**
 * Data-access layer for brand entities, brand pages and the two brand hubs. Local content only
 * (no CMS flag — the spec keeps brand copy in the repo); async like every other lib/data module so
 * call sites never change if that decision is revisited. Prices are the one live piece: rows come
 * from the CMS pricing catalog with the baked pricing-data.ts range as fallback.
 */

export async function getBrandEntities(): Promise<BrandEntity[]> {
  return BRAND_ENTITIES;
}

export async function getBrandEntityBySlug(slug: string): Promise<BrandEntity | undefined> {
  return BRAND_ENTITIES.find((e) => e.slug === slug);
}

export async function getBrandPages(kind?: BrandKind): Promise<BrandPage[]> {
  return kind ? brandPages.filter((p) => p.kind === kind) : brandPages;
}

export async function getBrandPageBySlug(slug: string): Promise<BrandPage | undefined> {
  return brandPages.find((p) => p.slug === slug);
}

export async function getBrandPageSlugs(): Promise<string[]> {
  return brandPages.map((p) => p.slug);
}

export function getBrandHub(kind: BrandKind): BrandHub {
  return BRAND_HUBS[kind];
}

/** Sync: "/merlin-garage-door-motors-perth" for (merlin, motor), or undefined when no page exists. */
export function brandPageHref(entitySlug: string, kind: BrandKind): string | undefined {
  const page = brandPages.find((p) => p.brand === entitySlug && p.kind === kind);
  return page ? `/${page.slug}` : undefined;
}

/** Case studies whose copy names the brand and that carry a real photo. Empty is normal. */
export async function getCaseStudiesForBrand(entity: BrandEntity): Promise<CaseStudyPage[]> {
  const all = await getCaseStudies();
  return all
    .filter((cs) => cs.images.some((img) => /^https?:\/\//.test(img.src)))
    .filter((cs) => {
      const text = [
        cs.title,
        cs.subtitle,
        cs.summary.intro,
        ...cs.summary.points,
        cs.problem.description,
        cs.diagnosis.description,
        cs.solution.description,
        ...cs.partsUsed,
      ].join(" \n ");
      return textMentionsBrand(text, entity);
    })
    .slice(0, 3);
}

const TOKENISED_FIELDS = (page: BrandPage, rows: ResolvedPriceRow[]): BrandPage => {
  const r = (s: string) => renderPriceTokens(s, rows);
  return {
    ...page,
    directAnswer: r(page.directAnswer),
    intro: { ...page.intro, paragraphs: page.intro.paragraphs.map(r) },
    costIntro: r(page.costIntro),
    costFactors: page.costFactors.map(r),
    faqs: page.faqs.map((f) => ({ ...f, answer: r(f.answer) })),
    decision: page.decision
      ? { repairWhen: page.decision.repairWhen.map(r), replaceWhen: page.decision.replaceWhen.map(r) }
      : undefined,
    parts: page.parts ? { ...page.parts, paragraphs: page.parts.paragraphs.map(r) } : undefined,
  };
};

/** Everything a brand page needs at render time. Throws on content bugs (bad pin/token/entity). */
export async function resolveBrandPage(page: BrandPage): Promise<ResolvedBrandPage> {
  const entity = BRAND_ENTITIES.find((e) => e.slug === page.brand);
  if (!entity) throw new Error(`Brand page "${page.slug}" references unknown entity "${page.brand}"`);

  if (process.env.NODE_ENV !== "production") {
    assertNoLiteralPrices(JSON.stringify(page), `content/brands (${page.slug})`);
  }

  const [catalog, suburbSlugs] = await Promise.all([cmsPublicPricing(), getServiceSuburbPageSlugs()]);
  const pins = page.kind === "motor" && !page.pricingPins.includes("motor-replace")
    ? [...page.pricingPins, "motor-replace"]
    : page.pricingPins;
  const rows = buildPricingRows(pins, catalog);
  const visibleRows = rows.filter((r) => page.pricingPins.includes(r.id));

  const suburbHref = new Map(
    suburbSlugs
      .filter((s) => s.startsWith("garage-door-repairs-"))
      .map((s) => [s.replace("garage-door-repairs-", "").replace(/-/g, " "), `/${s}`] as const),
  );
  const areaLinks: LocalLink[] = page.serviceAreas.map((name) => ({
    label: name,
    href: suburbHref.get(name.toLowerCase()) ?? "/service-areas",
  }));

  const relatedBrands = page.relatedBrands
    .map((slug) => {
      const e = BRAND_ENTITIES.find((x) => x.slug === slug);
      const href = brandPageHref(slug, page.kind);
      return e && href ? { entity: e, href } : null;
    })
    .filter((x): x is { entity: BrandEntity; href: string } => x !== null);

  return {
    page,
    entity,
    hub: BRAND_HUBS[page.kind],
    rendered: TOKENISED_FIELDS(page, rows),
    pricing: { intro: renderPriceTokens(page.costIntro, rows), factors: page.costFactors.map((f) => renderPriceTokens(f, rows)), rows: visibleRows },
    relatedBrands,
    capitalMotorRange: rows.find((r) => r.id === "motor-replace")?.price,
    areaLinks,
  };
}
```

- [ ] **Step 12: Type-check and commit**

Run: `npx tsc --noEmit`
Expected: no errors (if `tsconfig.tsbuildinfo` shows phantom errors, delete it and re-run — see memory).

```bash
git add types/brand.ts lib/brands content/brands lib/data/brands.ts
git commit -m "feat(brands): types, pricing/match helpers with tests, registries and data layer"
```

---

### Task 2: Brand research → `entities.ts` + PAA snapshots

**Model:** Sonnet. Dispatch as **two parallel agents** (motor brands / door brands) that each write their own research files, then one of them (or the orchestrator) merges `entities.ts`. Zero invented facts.

**Files:**
- Create: `docs/marketing/brand-research-2026-08/entities/<slug>.md` (39 files), `docs/marketing/brand-research-2026-08/paa/<page-slug>.md` (12 files)
- Modify: `content/brands/entities.ts`

**Interfaces:**
- Consumes: `BrandEntity` (Task 1).
- Produces: `BRAND_ENTITIES` with all 39 entities; research files that Task 5 authors from.

- [ ] **Step 1: Research every entity from its official site**

For each brand below, `WebFetch` the official site (use `WebSearch` to find it when the candidate URL is unsure) and record in `docs/marketing/brand-research-2026-08/entities/<slug>.md`:

```
# <Name>
- official_url: <verified, https>
- origin: <country / "Perth, WA">
- ownership: <parent, only if stated on the site — else "not stated">
- founded: <year, only if stated — else "not stated">
- product_lines: <families / model names for the kinds we cover, e.g. "SilentDrive (sectional belt), Commander (roller), Tiltmaster (tilt), myQ app">
- kinds: motor | door | both  (what they sell in Australia)
- door_types: roller / sectional / tilt / commercial (doors only)
- smart_app: <name or "none stated">
- australian_made: yes/no/not stated ; wa_made: yes/no
- accent_hex: <dominant identity colour approximated from the site>
- notes_for_copy: 3–6 bullets of verifiable facts useful on the page (warranty ONLY if stated; never guess)
- sources: <every URL read>
```

Entities and candidate URLs (verify each; replace when wrong):

| slug | name | kinds | dealer | logo | candidate URL |
|---|---|---|---|---|---|
| merlin | Merlin | motor | no | — | https://www.gomerlin.com.au/ |
| chamberlain | Chamberlain | motor | no | — | search "Chamberlain garage door openers Australia official" |
| liftmaster | LiftMaster | motor | no | — | search "LiftMaster Australia official" |
| b-and-d | B&D | door, motor | **yes** | /images/brands/bd.webp | https://www.bnd.com.au/ |
| gliderol | Gliderol | door, motor | **yes** | /images/brands/gliderol.webp | https://gliderol.com.au/ |
| steel-line | Steel-Line | door, motor | **yes** | /images/brands/steel-line.webp | https://www.steel-line.com.au/ |
| centurion | Centurion Garage Doors | door, motor | no | — | https://www.cgdoors.com.au/ (NOT centsys.com.au — different company; note both in the file) |
| boss | Boss Openers | motor | **yes** | /images/brands/boss-openers.webp | search "Boss garage door openers Australia" |
| ata | ATA | motor | no | — | search "Automatic Technology Australia ATA garage door openers" |
| grifco | Grifco | motor | no | — | search "Grifco commercial door openers Australia" |
| avanti | Avanti | door, motor | **yes** | /images/brands/avanti.webp | search "Avanti garage door openers Australia" |
| superlift | Superlift | door, motor | **yes** | /images/brands/superlift.webp | https://www.superliftgdo.com.au/ |
| jaytech | Jaytech | door, motor | **yes** | /images/brands/jaytech.webp | search "Jaytech garage doors openers" |
| guardian | Guardian | motor, door | no | — | search "Guardian garage door openers Australia" and "Guardian Doors Perth" — if two companies, record both and set kinds accordingly |
| dominator | Dominator | door, motor | no | — | search "Dominator garage doors Australia" |
| marantec | Marantec | motor | no | — | search "Marantec Australia" |
| genie | Genie | motor | no | — | https://www.geniecompany.com/ |
| somfy | Somfy | motor | no | — | https://www.somfy.com.au/ |
| magic-button | Magic Button | motor | no | — | search "Magic Button garage door opener" |
| nice | Nice | motor | no | — | search "Nice automation Australia" |
| dea | DEA | motor | no | — | search "DEA System gate garage automation" |
| danmar | Danmar | door | no | — | https://www.danmar.com.au/ |
| taurean | Taurean | door | no | — | search "Taurean Door Systems" |
| perth-windsor-doors | Perth Windsor Doors | door | **yes** | /images/brands/perth-windsor-doors.webp | search "Perth Windsor Doors" |
| doorworks | Doorworks | door | no | — | search "Doorworks garage doors" |
| allstyle | Allstyle | door | no | — | search "Allstyle garage doors" |
| best-doors | Best Doors | door | no | — | https://www.bestdoors.com.au/ |
| hormann | Hörmann | door | no | — | https://www.hormann.com.au/ |
| eastern-garage-doors | Eastern Garage Doors | door | no | — | search "Eastern Garage Doors" |
| gryphon | Gryphon | door | no | — | https://gryphongaragedoors.com/ |

(30 rows above + the kinds split gives the 39 hub tiles: brands with two kinds appear on both hubs.)

Set `matchTerms` for ordinary-word names: `boss` → `["Boss opener","Boss motor","Boss garage"]`, `guardian` → `["Guardian opener","Guardian motor","Guardian door"]`, `genie` → `["Genie opener","Genie motor"]`, `nice` → `["Nice motor","Nice opener","Nice automation"]`, `magic-button` → `["Magic Button"]`, `dea` → `["DEA motor","DEA opener","DEA System"]`. Aliases: `b-and-d` → `["B & D","B and D","BnD"]`, `steel-line` → `["Steel Line","Steelline"]`, `liftmaster` → `["Lift Master"]`, `hormann` → `["Hormann"]`.

- [ ] **Step 2: Pull Perth PAA for the 12 Phase-1 page queries**

Credentials: `~/.config/claude-seo/dataforseo-api.json` (`login`/`password`). One query per call (the live endpoint rejects batches). Save each result as `docs/marketing/brand-research-2026-08/paa/<page-slug>.md` with top-10 organic (domain · title · url), every PAA question, and related searches.

```bash
S="$HOME/.config/claude-seo"; L=$(node -e 'const j=require(process.argv[1]);console.log((j.login||j.username)+":"+(j.password||j.api_key))' "$S/dataforseo-api.json")
mkdir -p docs/marketing/brand-research-2026-08/paa
while IFS='|' read -r slug q; do
  printf '[{"keyword":"%s","location_code":1000676,"language_code":"en","device":"desktop","depth":10,"people_also_ask_click_depth":1}]' "$q" > /tmp/req.json
  curl -s -u "$L" -H "Content-Type: application/json" --data-binary @/tmp/req.json https://api.dataforseo.com/v3/serp/google/organic/live/advanced > "/tmp/$slug.json"
  node -e '
const j=require(process.argv[1]);const t=j.tasks[0];const r=t.result?.[0];let md=`# ${t.data.keyword}\n\nPerth SERP (DataForSEO, 2026-08-27)\n\n## Organic\n`;
for(const it of r?.items||[]){if(it.type==="organic")md+=`- #${it.rank_group} ${it.domain} — ${(it.title||"").replace(/\|/g,"-")} — ${it.url.replace(/\?srsltid.*$/,"")}\n`;}
md+="\n## People also ask\n";for(const it of r?.items||[]){if(it.type==="people_also_ask")for(const p of it.items||[])md+=`- ${p.title}\n`;}
md+="\n## Related searches\n";for(const it of r?.items||[]){if(it.type==="related_searches")for(const s of it.items||[])md+=`- ${s}\n`;}
require("fs").writeFileSync(process.argv[2],md);console.log("saved",process.argv[2],"cost",t.cost);' "/tmp/$slug.json" "docs/marketing/brand-research-2026-08/paa/$slug.md"
done <<'EOF'
merlin-garage-door-motors-perth|merlin garage door motor perth
chamberlain-garage-door-motors-perth|chamberlain garage door opener perth
b-and-d-garage-door-motors-perth|b&d garage door motor perth
gliderol-garage-door-motors-perth|gliderol garage door motor perth
steel-line-garage-door-motors-perth|steel-line garage door opener perth
boss-garage-door-motors-perth|boss garage door opener perth
steel-line-garage-doors-perth|steel-line garage doors perth
b-and-d-garage-doors-perth|b&d garage doors perth
gliderol-garage-doors-perth|gliderol garage doors perth
centurion-garage-doors-perth|centurion garage doors perth
danmar-garage-doors-perth|danmar garage doors perth
taurean-garage-doors-perth|taurean garage doors perth
EOF
```

Expected: 12 files, total cost ≈ $0.03. (Windows: run in Git Bash; replace `/tmp` with the scratchpad directory if `/tmp` is unwritable.)

- [ ] **Step 3: Fill `content/brands/entities.ts`**

One object per row of the table, e.g. (values must come from the research file — this is the shape, not the facts):

```ts
{
  slug: "merlin",
  name: "Merlin",
  kinds: ["motor"],
  accent: "#1c4fa1",
  url: "https://www.gomerlin.com.au/",
  origin: "Australia",
  ownership: "Chamberlain Group",            // only if stated on gomerlin.com.au
  dealer: false,
  tags: ["smart-app", "roller", "sectional", "tilt"],
  summary: "Australia's most-installed opener brand — belt-drive sectional, roller and tilt models with myQ.",
  productLines: "SilentDrive, Commander, Tiltmaster, myQ app",
  sources: ["https://www.gomerlin.com.au/", "https://www.gomerlin.com.au/products/"],
},
```

Tags: `smart-app` only when the site names an app; `wa-made` only for brands manufacturing in WA (Centurion Garage Doors, Danmar, Perth Windsor Doors, Gryphon — confirm each on its site); `australian-made` only when stated.

- [ ] **Step 4: Verify and commit**

Run: `npx tsc --noEmit` — expected clean. Then a quick guard:

```bash
node -e 'const s=require("fs").readFileSync("content/brands/entities.ts","utf8");const d=[...s.matchAll(/slug: "([a-z0-9-]+)"[\s\S]*?dealer: (true|false)/g)].filter(m=>m[2]==="true").map(m=>m[1]).sort();console.log(d.join(","))'
```
Expected output exactly: `avanti,b-and-d,boss,gliderol,jaytech,perth-windsor-doors,steel-line,superlift`.

```bash
git add content/brands/entities.ts docs/marketing/brand-research-2026-08
git commit -m "feat(brands): 30 researched brand entities + Perth PAA snapshots for phase-1 pages"
```

---

### Task 3: `BrandMark` + `BrandPlate` (the shared visual identity)

**Model:** Opus. Load the `frontend-design` skill before styling. This is where the "wow" starts — the monogram must look designed, never like a missing image.

**Files:**
- Create: `components/sections/brands/brand-mark.tsx`, `components/sections/brands/brand-plate.tsx`
- Modify: `app/globals.css` (append a `.cgd-brand-plate-sheen` keyframe block)

**Interfaces:**
- Consumes: `BrandEntity`.
- Produces: `BrandMark({ entity, size?: "sm"|"md"|"lg"|"xl", className?, priority? })`, `monogramFor(name): string`, `BrandPlate({ entity, quickFacts: BrandQuickFact[], kind: BrandKind })`.

- [ ] **Step 1: Write `brand-mark.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BrandEntity } from "@/types/brand";

const SIZE = {
  sm: { box: "h-9 w-9 rounded-lg", text: "text-sm", sizes: "36px" },
  md: { box: "h-14 w-14 rounded-xl", text: "text-xl", sizes: "56px" },
  lg: { box: "h-24 w-24 rounded-2xl", text: "text-4xl", sizes: "96px" },
  xl: { box: "h-32 w-32 rounded-3xl", text: "text-5xl", sizes: "128px" },
} as const;

/** "Steel-Line" → "SL", "B&D" → "BD", "Perth Windsor Doors" → "PW", "Merlin" → "M". */
export function monogramFor(name: string): string {
  const words = name.replace(/&/g, " ").split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.charAt(0).toUpperCase();
}

interface BrandMarkProps {
  entity: BrandEntity;
  size?: keyof typeof SIZE;
  className?: string;
  priority?: boolean;
}

/**
 * The one visual for a brand everywhere (nav grid, hub wall, plate, chips). Real logos sit on a
 * white card so dark-on-white source files stay crisp; brands without a logo get a designed
 * monogram — display-font initials on the brand accent, with a soft top-left light so it reads
 * as an emblem rather than a placeholder. Pure CSS, no request.
 */
export function BrandMark({ entity, size = "md", className, priority }: BrandMarkProps) {
  const s = SIZE[size];
  if (entity.logo) {
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border/60 bg-white shadow-sm",
          s.box,
          className,
        )}
      >
        <Image
          src={entity.logo}
          alt={`${entity.name} logo`}
          fill
          sizes={s.sizes}
          priority={priority}
          className="object-contain p-[14%]"
        />
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={`${entity.name} monogram`}
      className={cn(
        "relative flex shrink-0 select-none items-center justify-center overflow-hidden font-display font-black tracking-tight text-white shadow-sm",
        s.box,
        s.text,
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 20% 15%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(135deg, ${entity.accent} 0%, color-mix(in oklab, ${entity.accent} 62%, #0d1f45) 100%)`,
      }}
    >
      {monogramFor(entity.name)}
    </span>
  );
}
```

- [ ] **Step 2: Write `brand-plate.tsx`**

Visual spec: a `rounded-3xl` card, white on light theme, with (top) a 40 % tall band tinted by `entity.accent` at ~10 % over a faint 44 px grid (reuse the PageHero grid recipe), the `BrandMark size="xl"` centred and overlapping the band's bottom edge; (middle) a `<dl>` of `quickFacts` in two columns on ≥sm (`dt` 11 px uppercase tracking-wide muted, `dd` 15 px semibold foreground); (bottom) a ribbon pill — "Authorised dealer" (emerald) when `entity.dealer`, else "Serviced & repaired in Perth" (primary); and, when `entity.url` is set, a small external link "Official {name} site ↗" with `target="_blank" rel="noopener noreferrer"`. A slow diagonal sheen (`.cgd-brand-plate-sheen`, 6 s, `translateX`) crosses the band once on mount and on hover; disabled under `prefers-reduced-motion`.

```tsx
import { BadgeCheck, ExternalLink, Wrench } from "lucide-react";
import { BrandMark } from "./brand-mark";
import type { BrandEntity, BrandKind, BrandQuickFact } from "@/types/brand";

interface BrandPlateProps {
  entity: BrandEntity;
  quickFacts: BrandQuickFact[];
  kind: BrandKind;
}

export function BrandPlate({ entity, quickFacts, kind }: BrandPlateProps) {
  const ribbon = entity.dealer
    ? { icon: BadgeCheck, label: "Authorised dealer", cls: "bg-emerald-500/12 text-emerald-700" }
    : { icon: Wrench, label: `${kind === "motor" ? "Openers" : "Doors"} serviced & repaired in Perth`, cls: "bg-primary/10 text-primary" };
  const Icon = ribbon.icon;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_50px_rgba(13,31,69,0.12)]">
      <div
        aria-hidden="true"
        className="cgd-brand-plate-band relative h-36 overflow-hidden"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${entity.accent} 14%, white) 0%, color-mix(in oklab, ${entity.accent} 4%, white) 100%)` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,black_30%,transparent_90%)]" />
        <span className="cgd-brand-plate-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="-mt-16 flex justify-center">
        <BrandMark entity={entity} size="xl" priority className="ring-4 ring-card" />
      </div>
      <div className="px-6 pb-6 pt-4 sm:px-8">
        <p className="text-center font-heading text-xl font-bold text-foreground">{entity.name}</p>
        <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{f.label}</dt>
              <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${ribbon.cls}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {ribbon.label}
          </span>
          {entity.url && (
            <a
              href={entity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              Official {entity.name} site
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

Append to `app/globals.css`:

```css
/* Brand plate sheen (components/sections/brands/brand-plate.tsx) — compositor-only. */
@keyframes cgd-brand-plate-sheen {
  from { transform: translateX(0); }
  to { transform: translateX(400%); }
}
.cgd-brand-plate-sheen {
  animation: cgd-brand-plate-sheen 6s cubic-bezier(0.22, 1, 0.36, 1) 0.6s 1 both;
}
.cgd-brand-plate-band:hover .cgd-brand-plate-sheen {
  animation: cgd-brand-plate-sheen 1.8s ease-out 1 both;
}
@media (prefers-reduced-motion: reduce) {
  .cgd-brand-plate-sheen { animation: none; opacity: 0; }
}
```

- [ ] **Step 3: Verify in isolation**

Add a temporary render to `app/garage-door-motors-perth/page.tsx`? No — keep the tree clean: run `npx tsc --noEmit` and `npx eslint components/sections/brands/brand-mark.tsx components/sections/brands/brand-plate.tsx`. Visual verification happens in Task 4 once a page renders.

- [ ] **Step 4: Commit**

```bash
git add components/sections/brands/brand-mark.tsx components/sections/brands/brand-plate.tsx app/globals.css
git commit -m "feat(brands): BrandMark (logo/monogram) and BrandPlate hero card"
```

---

### Task 4: Brand page content — Phase 1 (12 pages) + hub copy

**Model:** Sonnet, **four parallel agents** (A: merlin, chamberlain, b-and-d motors; B: gliderol motors, steel-line motors, boss; C: steel-line doors, b-and-d doors, gliderol doors; D: centurion doors, danmar, taurean + `hubs.ts` intro/FAQs). Each agent reads: the spec §6/§11, `types/brand.ts`, `content/brands/entities.ts`, its brands' `entities/<slug>.md` + `paa/<page-slug>.md` research files, and the Merlin example below.

**Files:**
- Create: `content/brands/motors/{merlin,chamberlain,b-and-d,gliderol,steel-line,boss}.ts`, `content/brands/doors/{steel-line,b-and-d,gliderol,centurion,danmar,taurean}.ts`
- Modify: `content/brands/index.ts` (import + push each), `content/brands/hubs.ts` (`intro`, `faqs`)

**Content rules (all agents):**
1. Slugs: motors `<brand>-garage-door-motors-perth`; doors `<brand>-garage-doors-perth`. `updatedAt: "2026-08-28"`.
2. `seo.title` ≤ 60 chars, pattern `"{Brand} Garage Door Motors Perth | Repairs & Remotes"` / `"{Brand} Garage Doors Perth | Repairs, Service & Install"` (shorten with the brand's real term: "Openers" for Merlin/Chamberlain). `seo.description` ≤ 160 chars, includes "Perth", one hook (same-day / remotes coded / genuine panels), and a call to action.
3. `hero.h1` contains the brand + product noun + "Perth"; `subtitle` ≤ 200 chars; 3–4 `pills` (icons from `components/page/icons.ts` — e.g. `Wrench`, `Cpu`, `Radio`, `ShieldCheck`, `Clock`, `MapPin`, `Wifi`, `Building2`).
4. `quickFacts` 4–5 rows from the entity facts: "Origin", "Owned by"/"Made in" (only if known), "Known for", "Smart control"/"Door types", "What we do". Use `entity.dealer` to phrase "What we do" ("Supply, install, service & repair" vs "Service, repair & replace").
5. `directAnswer` 60–100 words: "{Brand} …in Perth" in the first sentence, what we do, one `{{price:…}}` token (motors: `motor-replace` "a full replacement is {{price:motor-replace}} supplied and installed"; doors: `service`), same-day mention.
6. `intro` heading + **3 paragraphs, 70–110 words each**, unique angle per brand (era/estate/door-type where the brand is common in Perth — general, defensible statements only), with **≥3 markdown-free inline links written as plain `<a>`-free text?** — No: `intro.paragraphs` are plain strings; links live in `services`/`relatedServices`/`faults`. Keep paragraphs link-free prose.
7. `services`: exactly 4 cards. Motor pages: `/garage-door-opener-repair-perth` (Repair), `/garage-door-remote-replacement-perth` (Remotes), `/garage-door-motors-perth` (Replace with Capital), `/garage-door-maintenance-perth` (Service). Door pages: `/garage-door-repairs-perth` (Repairs), `/garage-door-panel-replacement-perth` (Panels), `/garage-door-installation-perth` (New {brand} door), `/garage-door-maintenance-perth` (Service). Description 18–30 words each.
8. `models`: 3–5 entries **only from the research file**; omit the field entirely if the research has none.
9. `faults`: 4–6, each with a `problemSlug` from exactly this set: `garage-door-wont-open`, `garage-door-wont-close`, `garage-door-stuck-halfway`, `garage-door-remote-not-working`, `garage-door-motor-not-responding`, `garage-door-spring-or-cable-broken`, `garage-door-off-track`, `noisy-garage-door`. Icons: `Power`, `Radio`, `Volume2`, `AlertTriangle`, `MoveVertical`, `Unplug` (any lucide name in `components/page/icons.ts`; if missing, use `Wrench`).
10. Motor pages: `decision` with 4 `repairWhen` + 4 `replaceWhen` bullets (12–22 words each; may use `{{price:motor-repair}}` / `{{price:motor-replace}}`). Door pages: `parts` heading + 2 paragraphs (panel/curtain matching, genuine springs/cables, when a new door is the honest answer → mention `/garage-doors-perth` by name, not as a link).
11. `pricingPins`: motors `["motor-repair","motor-replace","wifi","remote","service"]`; doors `["spring","cable","damaged","service","new-standard"]`. `costIntro` 40–70 words (tokens allowed), `costFactors` 4 bullets.
12. `faqs`: **6–8**, questions taken from the page's `paa/<slug>.md` (rephrased to include the brand/Perth where natural) plus at most 2 of your own; answers 45–90 words, direct first sentence, tokens for any figure. Never a competitor warranty term unless in the research file.
13. `relatedBrands`: 3–4 entity slugs of the same kind that will have pages in Phase 1 or 2.
14. `relatedServices`: 4–6 `LocalLink`s from this allow-list only: `/garage-door-repairs-perth`, `/roller-door-repairs-perth`, `/garage-door-spring-repair-perth`, `/garage-door-opener-repair-perth`, `/garage-door-remote-replacement-perth`, `/garage-door-panel-replacement-perth`, `/garage-door-maintenance-perth`, `/garage-doors-perth`, `/garage-door-installation-perth`, `/roller-door-installation-perth`, `/roller-doors-perth`, `/sectional-garage-doors-perth`, `/tilt-garage-doors-perth`, `/commercial-garage-doors-perth`, `/commercial-roller-doors-perth`, `/garage-door-motors-perth`, `/garage-door-motor-replacement-cost-perth`, `/garage-door-repair-cost-perth`, `/garage-door-service-cost-perth`, `/garage-door-spring-replacement-cost-perth`, `/roller-door-vs-sectional-door`, `/garage-door-brands-perth`, `/garage-door-motor-brands-perth`. Always include the page's own hub.
15. `serviceAreas`: 8 suburb names, vary per page, from: Joondalup, Midland, Thornlie, Scarborough, Baldivis, Rockingham, Canning Vale, Clarkson, Success, Cockburn Central, Atwell, Padbury, Mandurah, Bayswater, Willetton, Belmont, Malaga, Stirling, Osborne Park, High Wycombe, Port Kennedy, Maddington, Huntingdale, Kingsley, Riverton, Duncraig, Kalamunda, Gosnells, Cannington, Lathlain, Southern River, Harrisdale, Piara Waters, Forrestdale.
16. **Claims:** the strings "authorised", "authorized" and "dealer" appear only on pages whose entity is a dealer brand. Centurion pages state they mean Centurion Garage Doors (Wangara, WA), not Centurion Systems gate motors.
17. **Never** a literal `$` + digit anywhere in the file. Never a hyphen-free "B&D" alternative — write `B&D`.

- [ ] **Step 1: Author each page — full reference example (Merlin)**

`content/brands/motors/merlin.ts` — the shape every page follows. Model names below must match `docs/marketing/brand-research-2026-08/entities/merlin.md`; drop any that the research did not verify.

```ts
import type { BrandPage } from "@/types/brand";

/**
 * /merlin-garage-door-motors-perth — "merlin garage door opener" is 4,400/mo AU (+2,900 "merlin
 * garage door remote", 590 "merlin garage door motor"; DataForSEO 2026-08-27). The national SERP
 * is manufacturer + retail; this page owns the LOCAL slice — repair, remotes, programming and
 * replacement in Perth. FAQs mirror the Perth PAA set. Merlin is NOT a dealer brand here.
 */
export const merlinGarageDoorMotorsPerth: BrandPage = {
  brand: "merlin",
  kind: "motor",
  slug: "merlin-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Merlin Garage Door Openers Perth | Repairs & Remotes",
    description:
      "Merlin garage door motor playing up? Perth-wide same-day repairs, remote coding and replacement for SilentDrive, Commander and Tiltmaster openers. Call for a fixed quote.",
  },
  hero: {
    h1: "Merlin Garage Door Motors & Openers in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "Australia's most-installed opener brand, kept running by local technicians: faults diagnosed on the day, remotes coded on the spot, and an honest call on repair versus replacement.",
    pills: [
      { icon: "Wrench", label: "Same-day Merlin repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "Wifi", label: "myQ app set up" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Known for", value: "SilentDrive, Commander & Tiltmaster openers" },
    { label: "Smart control", value: "myQ smartphone app" },
    { label: "Door types", value: "Sectional, roller & tilt" },
    { label: "What we do", value: "Service, repair, program & replace" },
  ],
  directAnswer:
    "Merlin garage door motors are repaired, re-programmed and replaced across Perth by Capital Garage Doors. Most faults — a dead unit, a remote that stopped pairing, an opener that reverses before the door closes — are fixed in one same-day visit; when a Merlin has genuinely reached the end of its life, a full replacement with a new belt-drive motor is {{price:motor-replace}} supplied and installed, remotes and programming included.",
  intro: {
    heading: "Why So Many Perth Garages Run a Merlin",
    paragraphs: [
      "Walk down almost any Perth street built from the late 1990s on and a good share of the sectional doors are lifted by a Merlin. The brand's belt-drive SilentDrive units became the default fit for two-storey homes with a bedroom over the garage, because the belt runs far quieter than the older chain-drive openers it replaced. That popularity is exactly why we see so many of them — and why our vans carry the parts that fail most often on them.",
      "Merlin openers are generally well made, but they live a hard life in Perth: summer heat in an uninsulated garage bakes the logic board and remote batteries, coastal air corrodes the limit switches, and a door whose springs have lost tension makes the motor drag far more weight than it was rated for. The typical calls we get are an opener that hums but won't lift, a remote that works from the driveway but not the street, or a door that opens then refuses to close because a safety beam is misaligned.",
      "We repair Merlin units whenever the numbers make sense and say so plainly when they don't. If your opener is under ten years old and the fault is a sensor, a remote, a gear kit or a travel limit, a repair is nearly always the right answer. If it is an original chain-drive unit from the early 2000s with a failing board, a new belt-drive motor with WiFi control will cost little more than the repair and come with a fresh warranty.",
    ],
  },
  services: [
    {
      title: "Merlin opener repairs",
      description: "Board, gear, sensor and travel-limit faults diagnosed on the day, with the common parts on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Merlin remotes & programming",
      description: "Replacement remotes supplied and coded to your opener, lost remotes wiped from its memory, and wall buttons or keypads paired.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Merlin",
      description: "When repair no longer stacks up, a new belt-drive Capital motor with WiFi app control, fitted the same day with a 5-year warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description: "Force and travel limits re-set, safety reverse tested, drive checked and the door balanced so the motor isn't doing the springs' job.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "SilentDrive", type: "Sectional door opener", tech: "Belt drive · myQ on current models", note: "The quiet belt-drive family we see most on Perth sectional doors." },
    { name: "Commander", type: "Roller door opener", tech: "Direct-drive roller unit", note: "Merlin's roller-door range — the compact unit mounted beside the drum." },
    { name: "Tiltmaster", type: "Tilt door opener", note: "Fitted to one-piece tilt doors, common on older Perth homes." },
  ],
  faults: [
    { label: "Merlin motor hums but won't lift", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or lost", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Opens, then reverses before closing", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The opener is under about ten years old and the fault is a sensor, remote, gear kit or limit setting.",
      "The motor still lifts the door smoothly once the springs are re-tensioned — the drive itself is healthy.",
      "You only need remotes coded, a wall button paired or the myQ app reconnected.",
      "A repair at {{price:motor-repair}} restores a unit with years of life left in the drive.",
    ],
    replaceWhen: [
      "It's an early-2000s chain-drive unit with a failing logic board — parts are scarce and the noise won't improve.",
      "The motor has been repaired before and a second major fault has appeared within a couple of years.",
      "You want WiFi app control, a battery backup or a quieter belt drive that the old unit can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than the repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Merlin work is priced from the same guide list as every opener we touch: a repair covers diagnosis and the common parts, a replacement at {{price:motor-replace}} includes the new motor, rail, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the drive board itself",
    "Door type and weight — a heavy insulated sectional needs a higher-rated motor",
    "Extras like WiFi control, battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How much does a Merlin garage door motor cost to replace in Perth?",
      answer:
        "A like-for-like replacement of a Merlin opener with a new belt-drive motor is {{price:motor-replace}} supplied and installed in Perth. That covers the motor and rail, two remotes, a wall control, safety sensors, programming and disposal of the old unit. If the existing Merlin can be repaired instead, that is typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
    {
      question: "What are the most common problems with Merlin garage door openers?",
      answer:
        "The faults we see most on Merlin units in Perth are remotes that stop pairing (often just a flat battery or a memory that needs clearing), safety beams knocked out of alignment so the door reverses, worn drive gears that make the motor hum without lifting, and travel limits that drift so the door stops short. Heat-stressed logic boards on older units are the one fault that usually tips the decision toward replacement.",
    },
    {
      question: "Can you program a new remote for my Merlin opener?",
      answer:
        "Yes. We supply genuine-compatible remotes and code them to your opener on the spot, and we can wipe a lost remote from the unit's memory so it can no longer open your door. Wall buttons, wireless keypads and the myQ app can be paired in the same visit.",
    },
    {
      question: "Does Bunnings sell Merlin garage door motors, and can you fit one I've bought?",
      answer:
        "Bunnings sells a DIY-oriented Merlin range, and yes, we can fit a unit you have already bought — though we will check it is rated for your door's weight first. Most customers find it simpler to have us supply and install in one visit, because the installed price includes the rail, remotes, programming and a workmanship warranty on the fit.",
    },
    {
      question: "How long should a Merlin garage door opener last?",
      answer:
        "Ten to fifteen years is typical in Perth if the door is serviced and the springs are keeping it balanced. An opener that is forced to drag an unbalanced door wears its gears and board much sooner, which is why every repair we do starts with checking the door itself, not just the motor.",
    },
    {
      question: "Is it cheaper to repair my Merlin or replace it?",
      answer:
        "For a unit under about ten years old with a single fault, a repair is almost always cheaper and worthwhile. For an early chain-drive Merlin with a failing board, a new belt-drive motor at {{price:motor-replace}} costs little more than the repair, runs quieter, adds WiFi control and comes with a fresh 5-year warranty. We quote both options so the choice is yours.",
    },
    {
      question: "Do you service Merlin openers across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Clarkson in the north to Rockingham, Baldivis and Mandurah in the south, with same-day slots on most days. Call with your suburb and the model name on the opener's label and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["chamberlain", "b-and-d", "gliderol", "steel-line"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Joondalup", "Clarkson", "Midland", "Canning Vale", "Thornlie", "Cockburn Central", "Baldivis", "Mandurah"],
  cta: {
    heading: "Merlin Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the opener's label and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
```

- [ ] **Step 2: Register every page in `content/brands/index.ts`**

```ts
import type { BrandPage } from "@/types/brand";
import { merlinGarageDoorMotorsPerth } from "@/content/brands/motors/merlin";
import { chamberlainGarageDoorMotorsPerth } from "@/content/brands/motors/chamberlain";
import { bAndDGarageDoorMotorsPerth } from "@/content/brands/motors/b-and-d";
import { gliderolGarageDoorMotorsPerth } from "@/content/brands/motors/gliderol";
import { steelLineGarageDoorMotorsPerth } from "@/content/brands/motors/steel-line";
import { bossGarageDoorMotorsPerth } from "@/content/brands/motors/boss";
import { steelLineGarageDoorsPerth } from "@/content/brands/doors/steel-line";
import { bAndDGarageDoorsPerth } from "@/content/brands/doors/b-and-d";
import { gliderolGarageDoorsPerth } from "@/content/brands/doors/gliderol";
import { centurionGarageDoorsPerth } from "@/content/brands/doors/centurion";
import { danmarGarageDoorsPerth } from "@/content/brands/doors/danmar";
import { taureanGarageDoorsPerth } from "@/content/brands/doors/taurean";

export const brandPages: BrandPage[] = [
  merlinGarageDoorMotorsPerth,
  chamberlainGarageDoorMotorsPerth,
  bAndDGarageDoorMotorsPerth,
  gliderolGarageDoorMotorsPerth,
  steelLineGarageDoorMotorsPerth,
  bossGarageDoorMotorsPerth,
  steelLineGarageDoorsPerth,
  bAndDGarageDoorsPerth,
  gliderolGarageDoorsPerth,
  centurionGarageDoorsPerth,
  danmarGarageDoorsPerth,
  taureanGarageDoorsPerth,
];
```

(Agents A–C each add only their own imports/entries; agent D adds its three and the hub copy. Resolve the merge by re-reading the file before editing.)

- [ ] **Step 3: Hub copy (agent D) — `content/brands/hubs.ts`**

`intro`: 2 paragraphs per hub (70–100 words) — doors: what "brand" means on a Perth door (the maker of the curtain/panels, often different from the motor), why knowing it matters (matching panels, springs, remotes), and that every brand is serviced regardless of who installed it. Motors: the opener brand is on the head-unit label, why it matters (remote compatibility, parts), and that repair-versus-replace is decided on the day. `faqs`: 6–7 each, answers 45–80 words, tokens allowed (`new-standard`, `motor-replace`, `service` are valid on hubs — the hub route resolves rows for exactly these three ids). Questions:
- Doors: "What is the best garage door brand in Australia?" · "Gliderol or B&D — which is better?" · "Are B&D garage doors good?" · "What are the typical prices for a new garage door in Perth?" (token `new-standard`) · "Do you service brands you don't sell?" · "Can you match panels for an older door brand?" · "How do I find out what brand my garage door is?"
- Motors: "What are the best brands of garage door openers in Australia?" · "How long does a garage door opener last?" · "How much does it cost to replace a garage door motor in Perth?" (token `motor-replace`) · "How can I tell if my garage door motor is failing?" · "Do you repair opener brands you don't sell?" · "Can I keep my existing remotes if the motor is replaced?" · "Belt drive or chain drive — which is better for Perth?"

- [ ] **Step 4: Each agent verifies its files**

Run: `npx tsc --noEmit` and this guard for every file you wrote:

```bash
grep -nE '\$\s?[0-9]' content/brands/motors/*.ts content/brands/doors/*.ts content/brands/hubs.ts && echo "LITERAL PRICE FOUND — fix" || echo "no literal prices"
grep -lniE 'authori[sz]ed|dealer' content/brands/motors/*.ts content/brands/doors/*.ts
```
Expected: "no literal prices"; the second grep lists only dealer-brand files (`b-and-d.ts`, `gliderol.ts`, `steel-line.ts`, `boss.ts`).

- [ ] **Step 5: Commit (one commit per agent, then the orchestrator merges index.ts)**

```bash
git add content/brands
git commit -m "content(brands): phase-1 brand pages (<list>) + hub copy"
```

---

### Task 5: Brand page template, schema, route wiring, sitemap, llms.txt

**Model:** Opus. Load `frontend-design` before styling; read `components/page/page-hero.tsx`, `components/sections/motors/motor-hero.tsx` and `components/page/service-suburb-page-template.tsx` first for the house style.

**Files:**
- Create: `components/sections/brands/brand-hero.tsx`, `brand-services.tsx`, `brand-models.tsx`, `brand-faults.tsx`, `brand-decision.tsx`, `brand-parts.tsx`, `related-brands.tsx`, `brand-page-template.tsx`
- Modify: `lib/seo/schema.ts` (add `brandPageSchema`), `components/seo/page-schema.tsx` (add `kind: "brand"`), `app/[slug]/page.tsx`, `app/sitemap.ts`, `app/llms.txt/route.ts`

**Interfaces:**
- Consumes: `ResolvedBrandPage`, `resolveBrandPage`, `getBrandPageBySlug`, `getBrandPageSlugs`, `getCaseStudiesForBrand`, `getBrandHub` (Task 1); `BrandMark`, `BrandPlate` (Task 3); existing `Breadcrumbs`, `DirectAnswer`? — no: render the direct answer inline as the motors page does (`<p id="direct-answer">`); `CostGuidance` (`components/page/cost-guidance.tsx`, props `{ title, eyebrow?, data: CostGuidance, ctaText }`), `RecentWork` (`components/page/recent-work.tsx`, `{ eyebrow?, title, description?, caseStudies }`), `FAQSection` (`components/page/faq-section.tsx`, `{ eyebrow?, title, description?, faqs }`), `RelatedServices` (`components/page/related-services.tsx`, `{ eyebrow?, title, description?, links: LocalLink[] }`), `ServiceAreaGrid` (`components/page/service-area-grid.tsx`, `{ eyebrow?, title, description?, suburbs: LocalLink[] }`), `ServiceContactPanel({ serviceName })`, `ServiceQuoteForm({ serviceName, heading? })`, `StickyMobileCta`, `SectionHeading({ eyebrow?, title, description?, align?, as? })`, `Reveal`, `resolvePageIcon(name)` (`components/page/icons.ts`), `CallNowButton`/`RequestQuoteButton` (`components/page/cta-buttons.tsx`), `MOTOR_IMAGES` (`components/sections/motors/motor-data.ts`).
- Produces: `BrandPageTemplate({ resolved: ResolvedBrandPage, caseStudies: CaseStudyPage[] })`, `brandPageSchema(resolved)`, `PageSchema kind="brand" data={resolved}`.

- [ ] **Step 1: `brandPageSchema` in `lib/seo/schema.ts`**

Append (imports at the top: `import type { ResolvedBrandPage } from "@/types/brand";`):

```ts
/**
 * Brand page JSON-LD: a Service (what WE do for the brand — provider = the business by @id) plus
 * a WebPage whose `about` is the manufacturer Brand (sameAs = the verified official site). No
 * Product/Offer (we don't sell the third-party brand as a product) and no aggregateRating on the
 * Service (unsupported host type — GSC rejected it on another site).
 */
export function brandPageSchema({ page, entity, rendered }: ResolvedBrandPage) {
  const noun = page.kind === "motor" ? "garage door motor" : "garage door";
  const service = compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.hero.h1,
    serviceType: `${entity.name} ${noun} repairs, service and ${page.kind === "motor" ? "replacement" : "installation"}`,
    description: rendered.directAnswer,
    url: absUrl(`/${page.slug}`),
    provider: providerRef(),
    areaServed: { "@type": "City", name: siteConfig.business.address.addressLocality },
  });
  const webPage = compact({
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absUrl(`/${page.slug}`),
    name: page.seo.title,
    about: compact({
      "@type": "Brand",
      name: entity.name,
      sameAs: entity.url,
      logo: entity.logo ? absUrl(entity.logo) : undefined,
    }),
  });
  return [service, webPage];
}
```

In `components/seo/page-schema.tsx` add `| { kind: "brand"; data: ResolvedBrandPage }` to `PageSchemaProps`, import `brandPageSchema` and the type, and add the case:

```tsx
    case "brand": {
      const r = props.data;
      return (
        <Nodes
          nodes={[
            ...brandPageSchema(r),
            r.rendered.faqs.length ? faqSchema(r.rendered.faqs) : null,
            speakableSchema(`/${r.page.slug}`, ["#direct-answer"]),
          ]}
        />
      );
    }
```

Also add a `brand` row to the doc-comment table in that file.

- [ ] **Step 2: Sections**

Visual direction (all sections use `Container`, `SectionHeading`, `Reveal` stagger ≤0.08 s; section rhythm alternates `bg-background` / `bg-muted/40` like the suburb template):

`brand-hero.tsx` (server): light hero on the PageHero grid recipe; left column `max-w-xl`: eyebrow `text-[11px] font-bold uppercase tracking-[0.22em] text-cta` "{Motor|Door} brand guide · Perth", `h1` `font-display text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.06] tracking-tight`, subtitle `text-lg text-muted-foreground`, CTA row (`CallNowButton` + `RequestQuoteButton` — the quote button scrolls to `#quote`), pills as `inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold` with the resolved icon. Right column: `<BrandPlate entity quickFacts kind />` inside `Reveal delay={0.1}`. Grid `lg:grid-cols-[1.05fr_0.95fr] lg:gap-14`.

`brand-services.tsx`: 4 cards `grid sm:grid-cols-2 lg:grid-cols-4`, each a `Link` card: icon in a `bg-primary/10 text-primary` circle, `h3` title, description, "Learn more →" hover-reveal. Heading "What we do for {Brand} owners in Perth".

`brand-models.tsx`: renders `null` when `models` is empty; cards with name (`font-heading font-bold`), a `type` chip, `tech` in mono-ish small text, note. Heading "{Brand} models we see in Perth" + description "Names to look for on the label — we work on all of them."

`brand-faults.tsx`: cards linking to `/problems/{slug}` (plain `div` when no slug), icon left. Heading "Common {Brand} faults we fix".

`brand-decision.tsx` (motor pages only): two lists (Repair when / Replace when) with check/arrow icons, and a right-hand "Capital 1100N & 1500N" card: `MOTOR_IMAGES.studio` (`next/image`, `quality={75}`, `sizes="(min-width:1024px) 30vw, 90vw"`), `capitalMotorRange` line "from {range} installed", link to `/garage-door-motors-perth`. Heading "Repair your {Brand}, or upgrade to a Capital motor?".

`brand-parts.tsx` (door pages only): `parts.heading` + paragraphs in a two-column prose layout with a link row to `/garage-door-panel-replacement-perth` and `/garage-doors-perth`.

`related-brands.tsx`: `relatedBrands` as chips (`BrandMark size="sm"` + name) linking to their pages, plus a trailing chip "All {hub.shortName} →" to `/${hub.slug}`.

- [ ] **Step 3: `brand-page-template.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { CostGuidance } from "@/components/page/cost-guidance";
import { FAQSection } from "@/components/page/faq-section";
import { RecentWork } from "@/components/page/recent-work";
import { RelatedServices } from "@/components/page/related-services";
import { ServiceAreaGrid } from "@/components/page/service-area-grid";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ServiceContactPanel } from "@/components/sections/service/service-contact-panel";
import { ServiceQuoteForm } from "@/components/sections/service/quote-form";
import { BrandHero } from "./brand-hero";
import { BrandServices } from "./brand-services";
import { BrandModels } from "./brand-models";
import { BrandFaults } from "./brand-faults";
import { BrandDecision } from "./brand-decision";
import { BrandParts } from "./brand-parts";
import { RelatedBrands } from "./related-brands";
import type { CaseStudyPage } from "@/types/case-study";
import type { ResolvedBrandPage } from "@/types/brand";

interface BrandPageTemplateProps {
  resolved: ResolvedBrandPage;
  caseStudies: CaseStudyPage[];
}

export function BrandPageTemplate({ resolved, caseStudies }: BrandPageTemplateProps) {
  const { page, entity, hub, rendered, pricing, relatedBrands, capitalMotorRange, areaLinks } = resolved;
  const noun = page.kind === "motor" ? "motor" : "door";
  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: hub.name, url: `/${hub.slug}` },
            { name: entity.name, url: `/${page.slug}` },
          ]}
        />
      </Container>

      <BrandHero page={page} entity={entity} />

      <section className="bg-background pt-12 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p id="direct-answer" className="text-pretty text-lg leading-relaxed text-foreground">
              {rendered.directAnswer}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Looking for another brand? See{" "}
              <Link href={`/${hub.slug}`} className="font-semibold text-primary hover:underline">
                every {noun} brand we service in Perth
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <Container>
          <SectionHeading title={page.intro.heading} />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {rendered.intro.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-pretty leading-relaxed text-muted-foreground">{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <BrandServices entity={entity} services={page.services} />
      <BrandModels entity={entity} models={page.models ?? []} />
      <BrandFaults entity={entity} faults={page.faults} />
      {page.kind === "motor" && rendered.decision && (
        <BrandDecision entity={entity} decision={rendered.decision} capitalMotorRange={capitalMotorRange} />
      )}
      {page.kind === "door" && rendered.parts && <BrandParts entity={entity} parts={rendered.parts} />}

      <CostGuidance
        eyebrow="Guide prices"
        title={`${entity.name} ${noun} repair & replacement prices in Perth`}
        data={pricing}
        ctaText={`Request a fixed quote for your ${entity.name} ${noun}.`}
      />

      <RecentWork
        eyebrow="Recent work"
        title={`Recent ${entity.name} jobs in Perth`}
        description="Real jobs, real photos — before and after."
        caseStudies={caseStudies}
      />

      <FAQSection
        eyebrow={`${entity.name} FAQ`}
        title={`${entity.name} ${noun} questions, answered`}
        faqs={rendered.faqs}
      />

      <RelatedBrands hub={hub} brands={relatedBrands} />

      <RelatedServices eyebrow="Related services" title="Related services & guides" links={page.relatedServices} />

      <ServiceAreaGrid
        eyebrow="Where we work"
        title={`${entity.name} ${noun} service across Perth`}
        description="Same-day slots in most suburbs — call with your address for an arrival window."
        suburbs={areaLinks}
      />

      <section className="bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <ServiceContactPanel serviceName={`${entity.name} ${noun} service`} />
            <ServiceQuoteForm serviceName={`${entity.name} garage door ${noun}`} heading={page.cta.heading} />
          </div>
        </Container>
      </section>

      <StickyMobileCta />
    </>
  );
}
```

- [ ] **Step 4: Wire `app/[slug]/page.tsx`**

Add imports (`getBrandPageBySlug`, `getBrandPageSlugs`, `resolveBrandPage`, `getCaseStudiesForBrand` from `@/lib/data/brands`; `BrandPageTemplate`), add `getBrandPageSlugs()` to the `Promise.all` in `generateStaticParams` and to the `Set`, and insert as the **first** check in both `generateMetadata` and the page (before `getServicePageBySlug`):

```ts
  const brandPage = await getBrandPageBySlug(slug);
  if (brandPage) {
    return buildMetadata({
      title: brandPage.seo.title,
      description: brandPage.seo.description,
      path: `/${brandPage.slug}`,
      lastModified: brandPage.updatedAt,
    });
  }
```

```tsx
  const brandPage = await getBrandPageBySlug(slug);
  if (brandPage) {
    const resolved = await resolveBrandPage(brandPage);
    const caseStudies = await getCaseStudiesForBrand(resolved.entity);
    return (
      <>
        <PageSchema kind="brand" data={resolved} />
        <BrandPageTemplate resolved={resolved} caseStudies={caseStudies} />
      </>
    );
  }
```

Update the file's doc comment: five registries, brands first (local, no network; a CMS page under a brand slug is shadowed).

- [ ] **Step 5: Sitemap + llms.txt**

`app/sitemap.ts`: import `getBrandPages` and `getBrandHub`; in the `Promise.all` add `getBrandPages()`; add two static entries using the newest `updatedAt` of the kind's pages:

```ts
    staticEntry(`/${getBrandHub("door").slug}`, newestBrand("door") ?? DEPLOYED_AT),
    staticEntry(`/${getBrandHub("motor").slug}`, newestBrand("motor") ?? DEPLOYED_AT),
```
with `const newestBrand = (kind: "door" | "motor") => { const ds = brandPagesAll.filter(p => p.kind === kind).map(p => new Date(p.updatedAt).getTime()); return ds.length ? new Date(Math.max(...ds)) : undefined; };` and in `dynamic`: `...brandPagesAll.map((p) => ({ url: absolute(`/${p.slug}`), lastModified: new Date(p.updatedAt) })),`. Add the two hub slugs to the reserved-slug comment.

`app/llms.txt/route.ts`: import `getBrandPages`, `getBrandHub`; add after "## Buying Guides & Comparisons":

```ts
    "",
    "## Garage Door & Motor Brands",
    `- [${getBrandHub("door").name}](${url}/${getBrandHub("door").slug})`,
    `- [${getBrandHub("motor").name}](${url}/${getBrandHub("motor").slug})`,
    ...brandPagesAll.map((p) => `- [${p.hero.h1}](${url}/${p.slug})`),
```

- [ ] **Step 6: Verify in the browser**

Run: `npx tsc --noEmit`; then use the running dev server (`:3001` per memory, else `:3000`; if neither is `next dev`, start `npm run dev`). Open `/merlin-garage-door-motors-perth` and `/steel-line-garage-doors-perth` with the Chrome DevTools MCP at 390 px and 1280 px: exactly one `h1`; the plate renders logo (Steel-Line) and monogram (Merlin); the price table shows 5 rows; `#quote` iframe present; console has no `[seo]` warnings; `document.querySelectorAll('script[type="application/ld+json"]')` includes `Service`, `WebPage` (with `about.@type === "Brand"`), `FAQPage`, `BreadcrumbList`. Save screenshots to the scratchpad and note anything off.

- [ ] **Step 7: Commit**

```bash
git add components/sections/brands lib/seo/schema.ts components/seo/page-schema.tsx "app/[slug]/page.tsx" app/sitemap.ts app/llms.txt/route.ts
git commit -m "feat(brands): brand page template, schema, [slug] resolution, sitemap + llms.txt"
```

---

### Task 6: Brand hubs — directory wall, finder, facts table, badge guide

**Model:** Opus. Load `frontend-design`. Mirror `components/sections/service-areas/suburb-search.tsx` for the finder mechanics.

**Files:**
- Create: `components/sections/brands/brand-finder.tsx` (client), `brand-directory.tsx` (client), `brand-facts-table.tsx`, `badge-guide.tsx`, `dealer-strip.tsx`, `brand-ticker.tsx`, `brand-hub-template.tsx`, `app/garage-door-brands-perth/page.tsx`, `app/garage-door-motor-brands-perth/page.tsx`
- Modify: `lib/analytics.ts` (`brand_search`), `lib/seo/schema.ts` (`brandHubSchemas`)

**Interfaces:**
- Consumes: `getBrandEntities`, `getBrandPages`, `getBrandHub`, `brandPageHref` (Task 1); `BrandMark` (Task 3); `buildPricingRows` + `cmsPublicPricing` for hub FAQ tokens; `QuoteDialog` (`components/sections/quote-dialog.tsx`, props `{ open, onOpenChange }`); `scrollToElement` (`lib/smooth-scroll.ts`); `track` (`lib/analytics.ts`); `collectionPageSchema`, `servicesItemListSchema`, `faqSchema`.
- Produces: `BrandHubTemplate({ hub, tiles: HubTile[], faqs: FAQ[] })` where `HubTile = { entity: BrandEntity; href?: string }`.

- [ ] **Step 1: Analytics event**

In `lib/analytics.ts` add to `AnalyticsEvent`:
```ts
  /** A settled query in a brand hub's finder — `results: 0` = a brand we don't list yet. */
  | "brand_search"
```

- [ ] **Step 2: Hub schema**

```ts
export function brandHubSchemas(hub: { slug: string; name: string; seo: { description: string } }, items: { name: string; url: string; image?: string }[]) {
  return [
    collectionPageSchema({ name: hub.name, description: hub.seo.description, path: `/${hub.slug}` }),
    servicesItemListSchema(items, `/${hub.slug}`),
  ];
}
```

- [ ] **Step 3: `brand-finder.tsx`** (client)

Props `{ kind: BrandKind; tiles: HubTile[] }`. Input (`aria-label="Search brands"`, `autoComplete="off"`) with a suggestion list (max 8) matching `name` + `aliases` (`startsWith` first, then `includes`, normalised); each suggestion shows `BrandMark size="sm"`. Enter/click on a tile with `href` → `router.push(href)`; without `href` → `scrollToElement(document.getElementById(\`brand-${slug}\`))` and set `highlight` state (the directory reads `?highlight` via a shared `data-highlight` attribute — simpler: dispatch `window.dispatchEvent(new CustomEvent("cgd:brand-highlight", { detail: slug }))` and let `BrandDirectory` listen and add a ring for 2 s). No match after 800 ms debounce → render the conversion card: "Every brand in Perth, one number" + `CallNowButton` + `GetQuoteButton` + a link "How to find the badge ↓" (`#badge-guide`, routed through `scrollToElement`). Fire `track("brand_search", { query, results, kind })` debounced 800 ms, same pattern as `suburb_search`.

- [ ] **Step 4: `brand-directory.tsx`** (client)

Props `{ kind, tiles }`. Chips: `All`, `Authorised dealer`, `Australian-made`, `WA-made`, and kind-specific (`Smart app` for motors; `Roller`, `Sectional`, `Tilt`, `Commercial` for doors) — only chips with ≥1 match render. State `filter`. Grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`; **every tile is rendered in the initial HTML** and hidden with `hidden` when filtered out (crawlers see all links). Tile: `id="brand-{slug}"`, `BrandMark size="lg"`, name, `summary` (2-line clamp), and a status pill ("Dealer" / "Serviced"). Tiles with `href` are `Link`s (`HoverPrefetchLink`); tiles without are `<button>`s that open one shared `<QuoteDialog>` (state `quoteOpen`). Hover: `-translate-y-1`, shadow; focus-visible ring. Listen for `cgd:brand-highlight` to flash `ring-2 ring-cta`.

- [ ] **Step 5: `brand-facts-table.tsx`** (server), `badge-guide.tsx`, `dealer-strip.tsx`, `brand-ticker.tsx`

Facts table: `<table>` in an `overflow-x-auto rounded-2xl border` wrapper, caption `sr-only`; columns Brand (mark + name) · Origin · Product lines · (motors: Smart control = has `smart-app` tag ? "App" : "—"; doors: Door types = tags ∩ {roller, sectional, tilt, commercial}) · What we do (dealer ? "Supply, install, service & repair" : "Service, repair & replace") · Page (link or "Call us").

Badge guide (`id="badge-guide"`): three cards with icons `DoorClosed` (roller: label on the curtain's side or the bottom rail), `PanelBottom` (sectional: sticker inside the bottom panel or on the track), `Cpu` (motor: label on the head unit's underside/side) — 1–2 sentences each; end with "Still not sure? Send us a photo" → `GetQuoteButton`.

Dealer strip: `entities.filter(e => e.dealer)` as `BrandMark size="md"` + name, each linking to its page for this kind if one exists (else the other kind's page, else the manufacturer URL). Heading "Authorised dealer for".

Ticker: reuse the `.cgd-brand-marquee` / `.cgd-brand-track` / `.cgd-brand-track-2` classes from `components/sections/brands-marquee.tsx` with `BrandMark size="sm"` + name pills, two identical tracks, `aria-hidden` on the second.

- [ ] **Step 6: `brand-hub-template.tsx` + the two routes**

Template order: Breadcrumbs (Home › {hub.name}) · hero (`h1`, subtitle, `CallNowButton` + a "Find your brand" anchor to `#find-your-brand` routed through the finder like the suburb hero) · `BrandTicker` · `BrandFinder` (`id="find-your-brand"`) · intro paragraphs (two-column) · `BrandDirectory` · `BrandFactsTable` · `BadgeGuide` · `DealerStrip` · `FAQSection` (hub FAQs with tokens rendered) · CTA band (`CTASection` from `components/sections/cta-section.tsx`, buttons Call + Get a quote → `/quote`) · `StickyMobileCta`.

Route (doors; motors identical with `"motor"`):

```tsx
import type { Metadata } from "next";
import { PageSchema } from "@/components/seo/page-schema"; // not used for hubs — use JsonLd
import { JsonLd } from "@/components/seo/json-ld";
import { BrandHubTemplate } from "@/components/sections/brands/brand-hub-template";
import { getBrandEntities, getBrandHub, brandPageHref } from "@/lib/data/brands";
import { cmsPublicPricing } from "@/lib/cms/pricing-client";
import { buildPricingRows, renderPriceTokens } from "@/lib/brands/pricing";
import { brandHubSchemas, faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const hub = getBrandHub("door");

export const metadata: Metadata = buildMetadata({
  title: hub.seo.title,
  description: hub.seo.description,
  path: `/${hub.slug}`,
});

export default async function GarageDoorBrandsPage() {
  const [entities, catalog] = await Promise.all([getBrandEntities(), cmsPublicPricing()]);
  const tiles = entities
    .filter((e) => e.kinds.includes("door"))
    .map((entity) => ({ entity, href: brandPageHref(entity.slug, "door") }));
  const rows = buildPricingRows(["new-standard", "motor-replace", "service"], catalog);
  const faqs = hub.faqs.map((f) => ({ ...f, answer: renderPriceTokens(f.answer, rows) }));
  const items = tiles
    .filter((t) => t.href)
    .map((t) => ({ name: `${t.entity.name} garage doors Perth`, url: t.href as string, image: t.entity.logo }));
  return (
    <>
      {brandHubSchemas(hub, items).map((node, i) => <JsonLd key={i} data={node} />)}
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <BrandHubTemplate hub={hub} tiles={tiles} faqs={faqs} />
    </>
  );
}
```
(Remove the unused `PageSchema` import — shown only to say hubs don't use it.)

- [ ] **Step 7: Verify in the browser**

Both hubs at 390/1280: every tile in HTML (`document.querySelectorAll('[id^="brand-"]').length` equals the kind's entity count); filter chips hide/show; finder: "merlin" → navigates; "genie" → scrolls + highlights; "zzz" → conversion card and a `brand_search` entry in `window.dataLayer` with `results: 0`; JSON-LD includes `CollectionPage`, `ItemList`, `FAQPage`.

- [ ] **Step 8: Commit**

```bash
git add components/sections/brands app/garage-door-brands-perth app/garage-door-motor-brands-perth lib/analytics.ts lib/seo/schema.ts
git commit -m "feat(brands): door + motor brand hubs with finder, directory wall, facts table"
```

---

### Task 7: Header mega-menus (Services / Doors / Motors) + mobile accordions

**Model:** Opus. Read `node_modules/@base-ui/react/navigation-menu/` docs (`render` prop, `openOnHover`, keyboard) before coding.

**Files:**
- Create: `config/nav-menus.ts`, `components/layout/mega-menu.tsx`
- Modify: `config/site.ts` (`nav`, `footerNav`), `components/layout/header.tsx`

**Interfaces:**
- Consumes: `NavigationMenu*` (`components/ui/navigation-menu.tsx`), `HoverPrefetchLink`, `BrandMark`, `BRAND_ENTITIES`, `MOTOR_IMAGES`/`MOTOR_PRICE`.
- Produces: `NAV_MENUS`, `NavMenuKey`.

- [ ] **Step 1: `config/nav-menus.ts`**

```ts
export type NavMenuKey = "services" | "doors" | "motors";

export interface NavMenuLink { label: string; href: string; description?: string }
export interface NavMenuColumn { title: string; links: NavMenuLink[] }
export interface NavBrandEntry { entity: string; href: string }

export interface NavMenu {
  key: NavMenuKey;
  columns: NavMenuColumn[];
  brands?: { title: string; items: NavBrandEntry[]; allLabel: string; allHref: string };
  /** Motors only — the Capital product card. */
  featured?: "capital-motors";
  footer: NavMenuLink;
}

/**
 * Mega-menu content, keyed by `menu` on siteConfig.nav items (data-keyed, never label-keyed).
 * Every href here must resolve with a 200 — scripts/check-brand-content.ts validates them.
 */
export const NAV_MENUS: Record<NavMenuKey, NavMenu> = {
  services: {
    key: "services",
    columns: [
      { title: "Repairs", links: [
        { label: "Garage door repairs", href: "/garage-door-repairs-perth" },
        { label: "Roller door repairs", href: "/roller-door-repairs-perth" },
        { label: "Spring repair", href: "/garage-door-spring-repair-perth" },
        { label: "Opener & motor repair", href: "/garage-door-opener-repair-perth" },
        { label: "Remote replacement", href: "/garage-door-remote-replacement-perth" },
        { label: "Panel replacement", href: "/garage-door-panel-replacement-perth" },
        { label: "Maintenance & service", href: "/garage-door-maintenance-perth" },
      ] },
      { title: "Install & supply", links: [
        { label: "New garage doors", href: "/garage-doors-perth" },
        { label: "Garage door installation", href: "/garage-door-installation-perth" },
        { label: "Roller door installation", href: "/roller-door-installation-perth" },
        { label: "Commercial garage doors", href: "/commercial-garage-doors-perth" },
        { label: "Custom garage doors", href: "/custom-garage-doors-perth" },
      ] },
      { title: "Guides", links: [
        { label: "Cost guides", href: "/cost-guides" },
        { label: "Common problems", href: "/problems" },
        { label: "Price calculator", href: "/calculator" },
        { label: "Roller vs sectional", href: "/roller-door-vs-sectional-door" },
      ] },
    ],
    footer: { label: "All services", href: "/services" },
  },
  doors: {
    key: "doors",
    columns: [
      { title: "Door types", links: [
        { label: "All garage doors", href: "/garage-doors-perth" },
        { label: "Roller doors", href: "/roller-doors-perth" },
        { label: "Sectional doors", href: "/sectional-garage-doors-perth" },
        { label: "Tilt doors", href: "/tilt-garage-doors-perth" },
        { label: "Custom doors", href: "/custom-garage-doors-perth" },
        { label: "Commercial roller doors", href: "/commercial-roller-doors-perth" },
        { label: "Industrial roller doors", href: "/industrial-roller-doors-perth" },
      ] },
    ],
    brands: {
      title: "Door brands",
      items: [
        { entity: "steel-line", href: "/steel-line-garage-doors-perth" },
        { entity: "b-and-d", href: "/b-and-d-garage-doors-perth" },
        { entity: "gliderol", href: "/gliderol-garage-doors-perth" },
        { entity: "centurion", href: "/centurion-garage-doors-perth" },
        { entity: "danmar", href: "/danmar-garage-doors-perth" },
        { entity: "taurean", href: "/taurean-garage-doors-perth" },
      ],
      allLabel: "All door brands",
      allHref: "/garage-door-brands-perth",
    },
    footer: { label: "Get a new-door quote", href: "/quote" },
  },
  motors: {
    key: "motors",
    columns: [
      { title: "Motors & remotes", links: [
        { label: "Opener & motor repair", href: "/garage-door-opener-repair-perth" },
        { label: "Remote replacement", href: "/garage-door-remote-replacement-perth" },
        { label: "Motor replacement cost", href: "/garage-door-motor-replacement-cost-perth" },
      ] },
    ],
    brands: {
      title: "Motor brands we service",
      items: [
        { entity: "merlin", href: "/merlin-garage-door-motors-perth" },
        { entity: "chamberlain", href: "/chamberlain-garage-door-motors-perth" },
        { entity: "b-and-d", href: "/b-and-d-garage-door-motors-perth" },
        { entity: "gliderol", href: "/gliderol-garage-door-motors-perth" },
        { entity: "steel-line", href: "/steel-line-garage-door-motors-perth" },
        { entity: "boss", href: "/boss-garage-door-motors-perth" },
      ],
      allLabel: "All motor brands",
      allHref: "/garage-door-motor-brands-perth",
    },
    featured: "capital-motors",
    footer: { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
  },
};
```
(Task 10 appends the Phase-2 brands to `items`.)

- [ ] **Step 2: `config/site.ts`**

Replace `nav` with:
```ts
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services", menu: "services" },
    { label: "Doors", href: "/garage-doors-perth", menu: "doors" },
    { label: "Motors", href: "/garage-door-motors-perth", menu: "motors" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Price Calculator", href: "/calculator" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
```
and add to the `Resources` footer column: `{ label: "Garage Door Brands", href: "/garage-door-brands-perth" }`, `{ label: "Motor Brands", href: "/garage-door-motor-brands-perth" }`. Add a comment above `nav`: 10 items; `Home` is hidden below `xl` in the desktop nav (the logo links home) so the row never wraps at 1024 px — re-measure before adding an 11th.

- [ ] **Step 3: `components/layout/mega-menu.tsx`** (client)

Props `{ menu: NavMenu; onNavigate?: () => void }`. Panel `w-[min(60rem,calc(100vw-2rem))] p-6`, `grid gap-8` with `grid-cols-[repeat(N,1fr)]` for columns + (when `brands`) a right column `min-w-[18rem]`: title, `grid grid-cols-3 gap-2` of `HoverPrefetchLink` tiles (`BrandMark size="sm"` + name, `text-xs font-semibold`), then `allLabel →`. When `featured === "capital-motors"`: a card on the left spanning the column: `MOTOR_IMAGES.studio` (`next/image`, `width={320} height={240}`, `quality={60}`, `sizes="320px"`), "Capital 1100N & 1500N", `from $${MOTOR_PRICE.min} installed` (this constant already mirrors the catalog on the motors page), "5-year warranty", link `/garage-door-motors-perth`. Footer row: `footer.label →` right-aligned. All links use `NavigationMenuLink render={<HoverPrefetchLink href=… />}` so the menu closes and keyboard works; call `onNavigate` on click.

- [ ] **Step 4: `components/layout/header.tsx`**

Desktop (`hidden lg:flex`): replace the `<nav>` map with `NavigationMenu` → `NavigationMenuList className="gap-1 xl:gap-3"`; for items with `menu`: `NavigationMenuItem` → `NavigationMenuTrigger` (styled like the current links: `text-sm font-medium text-muted-foreground hover:text-foreground`, chevron rotates on open) → `NavigationMenuContent` → `<MegaMenu menu={NAV_MENUS[item.menu]} />`; for plain items: `NavigationMenuLink render={<HoverPrefetchLink href={item.href} />}` with the existing underline span. `Home` gets `hidden xl:flex`. Keep `Get a Quote` (xl) and `Call Now` unchanged. Base UI opens on hover + focus and closes on Escape by default; verify.

Mobile (inside the existing `open` overlay): map nav items; items with `menu` render a row `flex items-center justify-between`: `Link` (label, closes the menu) + `button` (44 px, chevron, `aria-expanded`, `aria-controls`) toggling `openMenu` (`NavMenuKey | null`, one at a time). The expanded panel lists each column's links (`text-base`), then brand chips (`BrandMark size="sm"` + name, `grid grid-cols-2 gap-2`), then `allLabel`. Keep the bottom quote/booking pair untouched.

- [ ] **Step 5: Measure and verify**

Chrome DevTools MCP: resize to **1024×800** — the nav row must not wrap and `Call Now` must stay visible (`Home` hidden); **1280×800** — `Home` visible, all 10 items on one row; hover `Doors` → panel with brand marks; Tab through triggers → panels open on focus, Escape closes; **390×844** — hamburger → `Motors` row toggles an accordion with 6 brand chips; `Services` link navigates. Confirm no route payloads are fetched at load (Network: no `_next/data`/RSC prefetch for menu links before hover). Screenshots to the scratchpad.

- [ ] **Step 6: Lint + commit**

```bash
npx eslint components/layout/header.tsx components/layout/mega-menu.tsx config/nav-menus.ts config/site.ts
git add config/nav-menus.ts config/site.ts components/layout/header.tsx components/layout/mega-menu.tsx
git commit -m "feat(nav): Services/Doors/Motors mega-menus with brand logo grids + mobile accordions"
```

---

### Task 8: Internal-link surfaces + content check script

**Model:** Sonnet.

**Files:**
- Create: `scripts/check-brand-content.ts`, `components/sections/brands/brand-strip.tsx`
- Modify: `components/sections/brands-marquee.tsx`, `app/garage-door-motors-perth/page.tsx`

**Interfaces:**
- Consumes: `brandPageHref`, `getBrandEntities`, `BRAND_ENTITIES`, `brandPages`, `NAV_MENUS`, `BRAND_HUBS`, `PRICING_BY_ID`.

- [ ] **Step 1: `brand-strip.tsx`** (server)

Props `{ kind: BrandKind; title: string; description: string }`. Renders `SectionHeading` + a wrap of chips (`BrandMark size="sm"` + name) for every entity of that kind **with a page**, linking to it, plus a final chip "All {hub.shortName} →". Mount it in `app/garage-door-motors-perth/page.tsx` between `<MotorInstallBand />` and `<WarrantyTiers …>`:

```tsx
      <BrandStrip
        kind="motor"
        title="Already Have a Motor? We Service Every Brand"
        description="Merlin, Chamberlain, B&D, Gliderol, Steel-Line, Boss and more — repaired, re-programmed or replaced with a Capital motor."
      />
```

- [ ] **Step 2: Marquee cards link to brand pages**

In `components/sections/brands-marquee.tsx` add `entity?: string` to `Brand` and set it on each `BRANDS` entry (`avanti`, `gliderol`, `b-and-d`, `steel-line`, `superlift`, `boss`, `perth-windsor-doors`, `jaytech`). In `BrandLogo`, compute `const internal = brand.entity ? brandPageHref(brand.entity, "door") ?? brandPageHref(brand.entity, "motor") : undefined;` and render an internal `Link` (no `target`) when `internal` exists, else the existing external anchor. Update the doc comment: internal brand pages take priority; the manufacturer link now lives on the brand page's plate.

- [ ] **Step 3: `scripts/check-brand-content.ts`**

```ts
/**
 * Guard for the brand content type (content/brands/*). Fails the run (exit 1) on any of:
 * duplicate/invalid slugs, unknown entities, dealer wording on non-dealer pages, literal prices,
 * over-long titles/descriptions, missing FAQs, unknown pricing pins or problem slugs, hrefs that
 * don't resolve, nav menu hrefs that don't resolve, non-ISO updatedAt, missing logo files.
 *
 *   npx tsx scripts/check-brand-content.ts            # checks hrefs against the LIVE sitemap
 *   npx tsx scripts/check-brand-content.ts --offline  # skips the network check
 */
export {};

import { existsSync } from "node:fs";
import { join } from "node:path";
import { BRAND_ENTITIES } from "../content/brands/entities";
import { BRAND_HUBS } from "../content/brands/hubs";
import { brandPages } from "../content/brands";
import { NAV_MENUS } from "../config/nav-menus";
import { PRICING_BY_ID } from "../components/sections/smart-calculator/pricing-data";

const DEALERS = new Set(["avanti", "b-and-d", "boss", "gliderol", "jaytech", "perth-windsor-doors", "steel-line", "superlift"]);
const PROBLEMS = new Set([
  "garage-door-wont-open", "garage-door-wont-close", "garage-door-stuck-halfway", "garage-door-remote-not-working",
  "garage-door-motor-not-responding", "garage-door-spring-or-cable-broken", "garage-door-off-track", "noisy-garage-door",
]);
const STATIC_ROUTES = new Set(["/", "/services", "/service-areas", "/garage-door-motors-perth", "/cost-guides", "/calculator", "/quote", "/blog", "/problems", "/case-studies", "/gallery", "/reviews", "/warranty", "/warranty-registration", "/about", "/contact", "/privacy", "/terms"]);
const offline = process.argv.includes("--offline");
const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

async function liveUrls(): Promise<Set<string>> {
  const urls = new Set<string>(STATIC_ROUTES);
  for (const p of brandPages) urls.add(`/${p.slug}`);
  for (const h of Object.values(BRAND_HUBS)) urls.add(`/${h.slug}`);
  if (offline) return urls;
  const xml = await (await fetch("https://capitalgaragedoors.com.au/sitemap.xml")).text();
  for (const m of xml.matchAll(/<loc>https:\/\/capitalgaragedoors\.com\.au(\/[^<]*)<\/loc>/g)) urls.add(m[1]);
  return urls;
}

(async () => {
  const urls = await liveUrls();
  const entityBySlug = new Map(BRAND_ENTITIES.map((e) => [e.slug, e]));

  // Entities
  const seenEntity = new Set<string>();
  for (const e of BRAND_ENTITIES) {
    if (seenEntity.has(e.slug)) fail(`duplicate entity slug ${e.slug}`);
    seenEntity.add(e.slug);
    if (e.dealer !== DEALERS.has(e.slug)) fail(`entity ${e.slug}: dealer flag must be ${DEALERS.has(e.slug)}`);
    if (e.logo && e.logo.startsWith("/") && !existsSync(join(process.cwd(), "public", e.logo))) fail(`entity ${e.slug}: logo file missing ${e.logo}`);
    if (e.url && !/^https:\/\//.test(e.url)) fail(`entity ${e.slug}: url must be https`);
    if (!/^#[0-9a-f]{6}$/i.test(e.accent)) fail(`entity ${e.slug}: accent must be a 6-digit hex`);
    if (e.summary.length > 120) fail(`entity ${e.slug}: summary > 120 chars`);
    if (e.sources.length === 0) fail(`entity ${e.slug}: no sources`);
  }
  for (const slug of DEALERS) if (!entityBySlug.has(slug)) fail(`dealer entity ${slug} missing`);

  // Pages
  const seenSlug = new Set<string>();
  for (const p of brandPages) {
    const where = `page ${p.slug}`;
    if (seenSlug.has(p.slug)) fail(`${where}: duplicate slug`);
    seenSlug.add(p.slug);
    const entity = entityBySlug.get(p.brand);
    if (!entity) { fail(`${where}: unknown entity ${p.brand}`); continue; }
    if (!entity.kinds.includes(p.kind)) fail(`${where}: entity ${p.brand} has no kind ${p.kind}`);
    const expected = p.kind === "motor" ? `${p.brand}-garage-door-motors-perth` : `${p.brand}-garage-doors-perth`;
    if (p.slug !== expected && p.brand !== "perth-windsor-doors") fail(`${where}: slug should be ${expected}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.updatedAt)) fail(`${where}: updatedAt must be YYYY-MM-DD`);
    if (p.seo.title.length > 60) fail(`${where}: title ${p.seo.title.length} > 60`);
    if (p.seo.description.length > 160) fail(`${where}: description ${p.seo.description.length} > 160`);
    const json = JSON.stringify(p);
    if (/\$\s?\d/.test(json)) fail(`${where}: literal price — use {{price:id}}`);
    if (!entity.dealer && /authori[sz]ed|dealer/i.test(json)) fail(`${where}: dealer wording on a non-dealer brand`);
    if (p.faqs.length < 6) fail(`${where}: ${p.faqs.length} FAQs (< 6)`);
    if (p.services.length !== 4) fail(`${where}: services must be exactly 4`);
    if (p.intro.paragraphs.length < 2) fail(`${where}: intro needs ≥2 paragraphs`);
    for (const id of p.pricingPins) if (!PRICING_BY_ID.has(id)) fail(`${where}: unknown pricing pin ${id}`);
    for (const m of json.matchAll(/\{\{price:([a-z0-9-]+)\}\}/g)) {
      if (!p.pricingPins.includes(m[1]) && !(p.kind === "motor" && m[1] === "motor-replace")) fail(`${where}: token ${m[1]} not pinned`);
    }
    for (const f of p.faults) if (f.problemSlug && !PROBLEMS.has(f.problemSlug)) fail(`${where}: unknown problem slug ${f.problemSlug}`);
    if (p.kind === "motor" && !p.decision) fail(`${where}: motor page needs decision`);
    if (p.kind === "door" && !p.parts) fail(`${where}: door page needs parts`);
    for (const r of p.relatedBrands) {
      if (!entityBySlug.has(r)) fail(`${where}: relatedBrands unknown ${r}`);
    }
    for (const l of [...p.services.map((s) => s.href), ...p.relatedServices.map((l) => l.href)]) {
      if (!urls.has(l)) fail(`${where}: href does not resolve ${l}`);
    }
    if (!p.relatedServices.some((l) => l.href === `/${BRAND_HUBS[p.kind].slug}`)) fail(`${where}: relatedServices must link its hub`);
  }

  // Hubs
  for (const h of Object.values(BRAND_HUBS)) {
    if (h.seo.title.length > 60) fail(`hub ${h.slug}: title > 60`);
    if (h.seo.description.length > 160) fail(`hub ${h.slug}: description > 160`);
    if (h.faqs.length < 5) fail(`hub ${h.slug}: < 5 FAQs`);
    if (h.intro.length < 1) fail(`hub ${h.slug}: no intro`);
    if (/\$\s?\d/.test(JSON.stringify(h))) fail(`hub ${h.slug}: literal price`);
  }

  // Nav
  for (const menu of Object.values(NAV_MENUS)) {
    const hrefs = [
      ...menu.columns.flatMap((c) => c.links.map((l) => l.href)),
      ...(menu.brands ? [...menu.brands.items.map((b) => b.href), menu.brands.allHref] : []),
      menu.footer.href,
    ];
    for (const h of hrefs) if (!urls.has(h)) fail(`nav ${menu.key}: href does not resolve ${h}`);
    for (const b of menu.brands?.items ?? []) if (!entityBySlug.has(b.entity)) fail(`nav ${menu.key}: unknown entity ${b.entity}`);
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join("\n- "));
    process.exit(1);
  }
  console.log(`✓ ${BRAND_ENTITIES.length} entities, ${brandPages.length} brand pages, 2 hubs, ${Object.keys(NAV_MENUS).length} menus OK`);
})();
```

- [ ] **Step 4: Run the guard and fix what it finds**

Run: `npx tsx scripts/check-brand-content.ts`
Expected: `✓ 30 entities, 12 brand pages, 2 hubs, 3 menus OK`. Fix content (not the script) for any listed problem, then re-run until clean.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-brand-content.ts components/sections/brands/brand-strip.tsx components/sections/brands-marquee.tsx app/garage-door-motors-perth/page.tsx content/brands
git commit -m "feat(brands): motors-page brand strip, marquee → brand pages, content guard script"
```

---

### Task 9: Full verification, docs, memory

**Model:** Opus.

**Files:**
- Modify: `CLAUDE.md`, `on-page-seo.md`, `docs/superpowers/plans/2026-08-27-brand-pages.md` (tick boxes), memory `MEMORY.md` + new memory file

- [ ] **Step 1: Static gates**

```bash
npx tsc --noEmit
npx tsx --test "lib/brands/__tests__/*.test.ts"
npx tsx scripts/check-brand-content.ts
npx eslint $(git diff --name-only 7900a29 -- '*.ts' '*.tsx' | tr '\n' ' ')
```
Expected: all clean (lint: no NEW errors in changed files — the repo baseline has ~88 pre-existing errors elsewhere).

- [ ] **Step 2: Production build**

Run: `npm run build` (reaches the live CMS by default; if `localhost:5179` is serving a foreign DB — see memory — set `CMS_API_URL=https://cgd.runasp.net`). Expected: success; the route list shows the 12 brand slugs under `/[slug]` and the two hub routes as static.

- [ ] **Step 3: Browser sweep (Chrome DevTools MCP)**

On the dev server: `/garage-door-brands-perth`, `/garage-door-motor-brands-perth`, one motor page, one door page, the home page (marquee links now internal), `/garage-door-motors-perth` (brand strip) — at 390 and 1280. Check: single `h1`, no console errors/`[seo]` warnings, JSON-LD types per page (Task 5/6 lists), header at 1024 (no wrap). Run a Lighthouse audit (MCP `lighthouse_audit`) on one brand page — mobile performance must not regress below the site's current brand-new-page baseline (compare with `/garage-door-repairs-padbury`); if it does, find the culprit (usually an eager image) before continuing.

- [ ] **Step 4: Docs**

`CLAUDE.md` — add a **"Brand pages (Brand Atlas)"** bullet under *SEO* covering: local-content type (`content/brands`, `types/brand.ts`, `lib/data/brands.ts`), brands resolve **first** in `app/[slug]`, reserved hub slugs `/garage-door-brands-perth` + `/garage-door-motor-brands-perth`, `{{price:id}}` tokens + `pricingPins`, dealer set + claims rule, `scripts/check-brand-content.ts` must pass before a build, `config/nav-menus.ts` drives the three mega-menus (add a Phase-2 brand = content file + registry + nav entry), `brand_search` in the analytics table, and the research folder. Update the *Site chrome* paragraph (mega-menus, `Home` hidden below `xl`).

`on-page-seo.md` — two matrix rows: `Brand page | ✅ hero | ✅ | Service · WebPage(about: Brand) · speakable | ✅ | #quote form + tel:` and `Brand hub | ✅ | ✅ | CollectionPage · ItemList | ✅ | tel: + quote`.

Memory: write `brand-pages-launch-2026-08.md` (what shipped, Phase-2 list, GSC check date 2026-09-27 with the baseline file path) and add the index line to `MEMORY.md`.

- [ ] **Step 5: Commit and report**

```bash
git add CLAUDE.md on-page-seo.md docs/superpowers/plans/2026-08-27-brand-pages.md
git commit -m "docs: brand pages system in CLAUDE.md + on-page-seo matrix"
```
Report to the user: what is live locally, the build result, screenshots, and that **pushing `main` deploys** — ask before pushing.

---

## Phase 2

### Task 10: Brand pages batch 2 (11 pages) + nav entries

**Model:** Sonnet, four parallel agents (E: centurion motors, avanti motors, ata; F: superlift motors, liftmaster, grifco, jaytech motors; G: dominator doors, avanti doors, superlift doors; H: perth-windsor-doors + PAA pulls). Same rules as Task 4.

- [ ] **Step 1: PAA pulls** for `centurion garage door opener perth`, `avanti garage door opener perth`, `ata garage door opener perth`, `superlift garage door opener perth`, `liftmaster garage door opener perth`, `grifco roller door motor perth`, `jaytech garage door opener perth`, `dominator garage doors perth`, `avanti garage doors perth`, `superlift garage doors perth`, `perth windsor doors` — the Task 2 Step 2 loop with these rows (page slugs: `centurion-garage-door-motors-perth`, `avanti-garage-door-motors-perth`, `ata-garage-door-motors-perth`, `superlift-garage-door-motors-perth`, `liftmaster-garage-door-motors-perth`, `grifco-garage-door-motors-perth`, `jaytech-garage-door-motors-perth`, `dominator-garage-doors-perth`, `avanti-garage-doors-perth`, `superlift-garage-doors-perth`, `windsor-garage-doors-perth`).
- [ ] **Step 2: Author the 11 files** (Perth Windsor Doors uses slug `windsor-garage-doors-perth` — the check script exempts it). Grifco is commercial: add `"commercial-roller"` to its pins and a commercial angle. Centurion motors page carries the two-companies note.
- [ ] **Step 3: Register** in `content/brands/index.ts`; append to `NAV_MENUS.doors.brands.items` (dominator, avanti, superlift, perth-windsor-doors) and `NAV_MENUS.motors.brands.items` (centurion, avanti, ata, superlift, liftmaster, grifco, jaytech) — the mega-menu grid is 3 columns, so 10 and 13 tiles wrap to 4–5 rows; verify the panel still fits 800 px tall at 1024×800 (reduce tile padding if not).
- [ ] **Step 4: Gates**: `npx tsx scripts/check-brand-content.ts` → `✓ 30 entities, 23 brand pages …`; `npx tsc --noEmit`; browser check of two new pages + both mega-menus.
- [ ] **Step 5: Commit** `content(brands): phase-2 brand pages (11) + nav entries`.

### Task 11: Phase-B CMS cross-links (`scripts/link-brand-hubs.ts`)

**Model:** Sonnet. Pattern: `scripts/link-suburb-pages.ts` (login, read page, append-if-missing, update, prod via `CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=…`; the classifier may block prod runs — hand the user a `!` wrapper, see memory).

- [ ] **Step 1:** Write the script: for `/garage-doors-perth` append a `RelatedServices` link `{ name: "Garage door brands in Perth", href: "/garage-door-brands-perth", description: "Every door brand we service, repair and install — find yours.", icon: "BadgeCheck" }`; for `/garage-door-opener-repair-perth` and `/garage-door-remote-replacement-perth` append `{ name: "Garage door motor brands", href: "/garage-door-motor-brands-perth", description: "Merlin, Chamberlain, B&D, Gliderol and every opener brand we repair.", icon: "Cpu" }`. Filter `routeGroup === "Flat"` on every slug lookup; idempotent (skip when the href is already present). Curl each destination for a 200 first.
- [ ] **Step 2:** Run against LOCAL first (dry), then prod with the user's go-ahead; verify the three live pages show the new related link after the webhook revalidates.
- [ ] **Step 3:** Commit `feat(scripts): link-brand-hubs.ts — CMS related links to the brand hubs`.

---

## Self-review (done while writing)

- **Spec coverage:** §3 list → Tasks 4/10; §4 routes/data → Tasks 1/5; §5 model → Task 1; §6 anatomy → Task 5 (all 15 sections present: breadcrumbs, hero+plate, direct answer, intro, services, models, faults, decision/parts, prices, recent work, FAQs, related brands, related services, area grid, quote); §7 hub → Task 6 (hero, ticker, finder, directory, facts table, badge guide, dealer strip, FAQs, CTA); §8 nav → Task 7; §9 link surfaces → Tasks 7/8/11; §10 SEO/schema → Tasks 5/6/9; §11 content rules → Task 4 header; §12 analytics → Task 6; §13 guards → Tasks 1/8; §14 verification → Task 9.
- **Placeholders:** none — every code step has code; the two empty arrays in Task 1 are filled by Tasks 2/4 and enforced by the check script.
- **Type consistency:** `ResolvedBrandPage.rendered/pricing/relatedBrands/capitalMotorRange/areaLinks` used identically in Tasks 1, 5; `brandPageHref(entitySlug, kind)` in Tasks 1, 6, 8; `HubTile = { entity, href? }` in Task 6; `NAV_MENUS`/`NavMenuKey` in Tasks 7, 8, 10; `check-brand-content.ts` reads the same registries.
