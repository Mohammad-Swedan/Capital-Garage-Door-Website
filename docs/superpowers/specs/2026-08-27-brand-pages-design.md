# Brand pages ("Brand Atlas") — motors & door brands — design

**Date:** 2026-08-27 · **Status:** approved for planning · **Owner ask:** "add motors and door brands like the Perth Garage Doors Repairs site, but *better* — creative, SEO-great, every brand in Perth, a design that makes the owner say wow."

## 1. Goal & success criteria

Give the site a ranking surface for every "{brand} garage door / motor / opener / remote + perth / repair / service" query, and a nav that exposes it site-wide.

Success =

1. Two directory hubs + one page per major brand, all statically generated, all in the sitemap, each with unique copy and PAA-derived FAQs.
2. Three hover mega-menus (Services, Doors, Motors) in the desktop header; accordion groups in the mobile menu. Every href resolves (200, never a redirect).
3. Brand facts come only from official manufacturer sites; prices only from the pricing catalog; "authorised dealer" only for the 8 brands the site already names.
4. `npm run build`, `npx tsc --noEmit`, lint on changed files and the new content check script all pass; the pages are verified in a browser at 390 / 1024 / 1280 px.
5. A GSC check ~2026-09-27 shows brand queries landing on the new pages instead of the homepage.

### Research this design rests on (2026-08-27)

- **DataForSEO Google Ads volumes (AU/month, `docs/marketing/brand-research-2026-08/` will hold the raw pull):** doors — Steel-Line 8,100 · B&D 3,600 · Gliderol 3,600 · Centurion 3,600 · Taurean 480 · Superlift 480 · Doorworks 390 · Dominator 320 · Allstyle 320 · Danmar 260 (the only one with a native "…perth" variant, 260) · Avanti 210 · Guardian/Best Doors 90 · Hörmann/Jaytech 70. Motors — Merlin opener 4,400 + remote 2,900 + motor 590 · Chamberlain 1,600 · Gliderol remote 1,600 · Steel-Line opener 1,300 · B&D remote 1,300 · Centurion opener 720 · Boss 590 · Avanti 590 · ATA 480 · Superlift 480 · LiftMaster 320 · Grifco 320 · Guardian/Dominator/Marantec/Genie 110. Head terms: "garage door openers" 2,900, "garage door motors" 1,900, "garage door brands" 210, "garage door motor brands"/"opener brands" 30–40.
- **Perth SERPs (location 1000676):** small local competitors' brand pages already rank top-5 (`perthgaragedoor.com.au/brands/merlin` #4, `perthgaragedoorrepairs.com.au/supplier/gliderol-garage-doors` #1, `garagedoorrepairsperth.com.au/garage-door-motors` #2). Every query shows a People-Also-Ask block ("How much does a Merlin motor cost?", "Gliderol or B&D?", "Are Steel-Line doors any good?", "common problems with {brand}") and "…reviews / prices / cost" related searches.
- **GSC (120 days, domain property):** brand queries already hit the site with no page to catch them — Guardian 18 imp @ pos 45, B&D/Gliderol/Steel-Line/Merlin/LiftMaster/Centurion/Chamberlain/Dominator/Avanti 1–5 imp each, "garage door remotes perth" 74 imp @ 22.9.
- **Reference project:** brand pages there are generic `ServicePage`s with a text-only 2-column dropdown (4 motor + 3 door brands). This design deliberately exceeds it.

## 2. Decisions already made with the owner's delegate

| Decision | Choice |
|---|---|
| Content source | **Local typed content** (`content/brands/…`) behind the async `lib/data` seam; **not** CMS-managed. Prices and reviews still come live from the CMS. Copy edits are code changes. |
| Nav shape | Keep **Home**; **Services ▾, Doors ▾, Motors ▾** become mega-menus. 10 items. |
| Dealer claims | "Authorised dealer" wording only for **B&D, Steel-Line, Gliderol, Avanti, Superlift, Boss Openers, Perth Windsor Doors, Jaytech** (the existing `BRANDS` list). Every other brand: "we service, repair and replace". |
| Scope | Full pages for 23 brands in two phases; directory tiles for 16 more. |

## 3. Scope — the brand list

| Group | Full pages (Phase 1 in **bold**) | Directory-only tiles |
|---|---|---|
| Motors (13) | **Merlin, Chamberlain, B&D, Gliderol, Steel-Line, Boss**, Centurion, Avanti, ATA, Superlift, LiftMaster, Grifco, Jaytech | Guardian, Dominator, Marantec, Genie, Somfy, Magic Button, Nice, DEA |
| Doors (10) | **Steel-Line, B&D, Gliderol, Centurion, Danmar, Taurean**, Dominator, Avanti, Superlift, Perth Windsor Doors | Doorworks, Allstyle, Best Doors, Jaytech, Hörmann, Eastern Garage Doors, Gryphon, Guardian Doors |

A directory-only brand becomes a full page by adding one content file and pushing it onto the registry — no code. Phase 2 = the 11 non-bold pages plus the Phase-B CMS cross-links (§9).

## 4. URLs, routing & data layer

- **Brand pages are flat slugs** (site convention, keyword in URL, matches the competitor patterns that rank): motors `/{brand}-garage-door-motors-perth` (e.g. `/merlin-garage-door-motors-perth`, `/b-and-d-garage-door-motors-perth`), doors `/{brand}-garage-doors-perth` (e.g. `/steel-line-garage-doors-perth`, `/windsor-garage-doors-perth`). Slug is declared per page in content.
- **Hubs are static routes** (like `app/garage-door-motors-perth`): `app/garage-door-brands-perth/page.tsx` (doors) and `app/garage-door-motor-brands-perth/page.tsx` (motors). Both slugs are reserved — document in CLAUDE.md alongside the motors slug.
- `app/[slug]/page.tsx`: the brand registry is checked **first** in the resolution chain (local, no network round-trip) and added to `generateStaticParams`. A CMS page created under a brand slug would be shadowed — acceptable, documented.
- `lib/data/brands.ts` (async, same shape as the other data layers):
  - `getBrandEntities()`, `getBrandEntityBySlug(slug)`
  - `getBrandPages(kind?: BrandKind)`, `getBrandPageBySlug(slug)`, `getBrandPageSlugs()`
  - `getBrandPageHref(entitySlug, kind)` — used by nav, hub tiles, related-brand chips
  - `getCaseStudiesForBrand(entity)` — case studies whose title/summary/body match the brand name (word-boundary regex, alias-aware e.g. `B&D|B & D|B and D`), only those with a real photo; may be empty today (job content rarely names brands) — the section renders nothing when empty.
  - `resolveBrandPricing(page)` — turns `pricingPins` (scenario ids from `components/sections/smart-calculator/pricing-data.ts`) into `CostGuidance.rows`: baked scenario range, overridden by a live `cmsPublicPricing()` row when one matches (reuse the exact-name-then-keyword matcher from `estimate-logic.ts`; export it if it isn't). Live fetch failure → baked range, never an empty table.
  - `renderPriceTokens(copy, rows)` — replaces `{{price:<scenario-id>}}` tokens in copy with the resolved "$min–$max". Dev-mode assertion: any literal `$` followed by a digit in content copy throws (`pricing must come from the catalog`).
- `app/sitemap.ts`: brand pages + both hubs, `lastmod` from each page's `updatedAt` (ISO date in content); a hub's `lastmod` = max of its children. `app/llms.txt/route.ts`: a "Brands" section listing hubs + pages.

## 5. Content model (`types/brand.ts`)

```ts
export type BrandKind = "motor" | "door";
export type BrandTag = "australian-made" | "wa-made" | "smart-app" | "roller" | "sectional" | "tilt" | "commercial";

export interface BrandEntity {
  slug: string;                 // "merlin" — stable key, used by nav/hub/pages
  name: string;                 // "Merlin"
  aliases?: string[];           // ["B & D", "B and D", "BnD"] — finder + case-study matching
  kinds: BrandKind[];           // which product lines the brand has in Perth
  logo?: string;                // /images/brands/*.webp or CDN URL; absent → monogram
  accent: string;               // hex used by the monogram + brand-plate gradient
  url?: string;                 // VERIFIED official site only
  origin: string;               // "Australia" | "USA" | "Germany" | "Perth, WA"
  ownership?: string;           // "Chamberlain Group" — only if on the official site
  founded?: number;             // only if on the official site
  dealer: boolean;              // true ONLY for the 8 dealer brands
  tags: BrandTag[];             // "australian-made" | "wa-made" | "smart-app" | "roller" | "sectional" | "tilt" | "commercial"
  summary: string;              // one line for tiles/tooltips, ≤120 chars
  sources: string[];            // URLs the facts were taken from (not rendered)
}

export interface BrandPage {
  brand: string;                // BrandEntity.slug
  kind: BrandKind;
  slug: string;                 // full URL slug
  updatedAt: string;            // ISO date → sitemap lastmod
  seo: { title: string; description: string };      // ≤60 / ≤160
  hero: { h1: string; subtitle: string; pills: { icon: string; label: string }[] };
  quickFacts: { label: string; value: string }[];  // 4–5 rows on the brand plate
  directAnswer: string;         // may contain {{price:<id>}} tokens; no literal $
  intro: { heading: string; paragraphs: string[] };  // 2–3 unique paragraphs
  services: { title: string; description: string; icon: string; href: string }[]; // 4 cards
  models?: { name: string; type: string; tech?: string; note: string }[];        // E-E-A-T
  faults: { label: string; icon: string; problemSlug?: string }[];               // → /problems/{slug}
  decision?: { repairWhen: string[]; replaceWhen: string[] };                     // motor pages
  parts?: { heading: string; paragraphs: string[] };                              // door pages
  pricingPins: string[];        // scenario ids, e.g. ["motor-repair","motor-replace","remote","service"]
  costIntro: string; costFactors: string[];
  faqs: FAQ[];                  // 6–8, PAA-derived
  relatedBrands: string[];      // entity slugs (same kind)
  relatedServices: LocalLink[]; // money pages — real link surface
  serviceAreas: string[];       // suburb names → areaLinks chips
  cta: { heading: string; subtitle: string };
}
```

Files: `content/brands/entities.ts` (30 entities — 9 brands carry both kinds, so the two hubs show 39 tiles), `content/brands/motors/<slug>.ts`, `content/brands/doors/<slug>.ts`, `content/brands/index.ts` (exports `brandPages: BrandPage[]`). `entities.ts` must stay import-free of server code — the header (client) imports it for logos.

## 6. Brand page anatomy (`components/sections/brands/brand-page-template.tsx`)

Sections in order; each is its own file under `components/sections/brands/`:

1. **Breadcrumbs** — Home › Garage Door Brands Perth / Garage Door Motor Brands Perth › {Brand}.
2. **BrandHero** — left: eyebrow ("Door brand guide · Perth" / "Motor brand guide · Perth"), `h1`, subtitle, CTAs (Call now `tel:`, Get a quote → `#quote`), trust pills. Right: **BrandPlate** — a card with the **BrandMark** (real logo on white, or the monogram: brand initial in the display font on an `accent`-tinted gradient with the `cgd-shimmer` sheen) above a **quick-facts rail** (Origin · Owned by / Made in · Known for · Smart control · What we do). Dealer brands get an "Authorised dealer" ribbon; others a "Serviced & repaired" ribbon. Official-site link (external, `rel="noopener"`) sits under the facts — the E-E-A-T corroboration. Motion: `Reveal` stagger only (CSS/LazyMotion, reduced-motion safe; nothing new on the main thread — see the mobile-perf memory).
3. **DirectAnswer** — `#direct-answer`, speakable; brand keyword + what we do + a catalog price anchor via token.
4. **Intro** — heading + 2–3 paragraphs with ≥3 in-body links (hub, a money page, a problem page or the Capital motors page).
5. **BrandServices** — "What we do for {Brand} owners": 4 cards → money pages (`/garage-door-opener-repair-perth`, `/garage-door-remote-replacement-perth`, `/garage-door-motors-perth`, `/garage-door-maintenance-perth` for motors; repairs / panel replacement / installation / `/garage-doors-perth` for doors).
6. **BrandModels** — "{Brand} models we see in Perth" (renders only when `models` is non-empty).
7. **BrandFaults** — "Common {Brand} faults we fix" → `/problems/{slug}` cards.
8. **BrandDecision** (motor pages) — "Repair your {Brand}, or upgrade to a Capital motor?": two columns (repair when… / replace when…) + a Capital 1100N/1500N card (image `MOTOR_IMAGES.studio`, range from the `motor-replace` catalog row, link `/garage-door-motors-perth`). **BrandParts** (door pages) — matching panels, curtains, springs and genuine parts; new-door pathway → `/garage-door-installation-perth` and `/garage-doors-perth`.
9. **Guide prices** — reuse `components/page/cost-guidance.tsx` with rows from `resolveBrandPricing`. Crawlable `<table>`.
10. **Recent {Brand} work** — reuse `components/page/recent-work.tsx` with `getCaseStudiesForBrand`; nothing when empty.
11. **FAQSection** — 6–8 PAA-derived FAQs + `FAQPage`.
12. **RelatedBrands** — BrandMark chips for `relatedBrands` + "All {kind} brands →" hub link.
13. **RelatedServices** — `components/page/related-services.tsx`.
14. **ServiceAreaGrid** — `components/page/service-area-grid.tsx` with `areaLinks` built exactly as `app/[slug]/page.tsx` does for service pages (hub→spoke suburb links).
15. **Quote section** — `ServiceContactPanel` + `ServiceQuoteForm` (`#quote`, prefill serviceId via `bookingServiceIdFor`), then `StickyMobileCta`.

## 7. Hub anatomy (`components/sections/brands/brand-hub-template.tsx`, parameterised by `kind`)

1. Breadcrumbs + hero: `h1` "Garage Door Brands in Perth — Every Brand We Service, Repair & Install" / "Garage Door Motor & Opener Brands in Perth"; subtitle; CTAs; a pure-CSS **brand ticker** (reuse the `.cgd-brand-track` marquee keyframes) of BrandMarks under the hero.
2. **BrandFinder** (client island, mirrors `service-areas/suburb-search.tsx`): input with suggestions over all entities of that kind (name + aliases). Select → navigate to the page; directory-only brand → scroll to its tile and show "We service {Brand} too" (Call + quote). No match → conversion card ("Every brand in Perth, one number") + the **badge guide**. Fires `brand_search` (`query`, `results`, `kind`) — `results: 0` = brand demand to add next. Native hash jumps are cancelled under Lenis — route scrolls through `scrollToElement`.
3. **BrandDirectory** — the brand wall. SSR grid of every tile (page brands link; directory-only tiles show a "Serviced" badge and open the quote dialog). Client filter chips: All · Authorised dealer · Australian-made · WA-made · Smart-app (motors) · Roller / Sectional / Tilt / Commercial (doors). The initial HTML contains every tile and link (filter only toggles visibility after hydration). Hover: lift + one-line summary; keyboard focus shows the same.
4. **BrandFactsTable** — crawlable `<table>`: Brand · Origin · Product lines · Smart control (motors) / Door types (doors) · What we do · Page. Facts only from `entities.ts`.
5. **BadgeGuide** — "How to find your brand": three icon-illustrated steps (roller-door curtain label, sectional-door bottom-panel sticker, motor head-unit label).
6. **Dealer strip** — "Authorised dealer for…" logos of the 8 dealer brands.
7. FAQs (PAA: best brand in Australia · Gliderol vs B&D · common problems · lifespan · do you service brands you don't stock) + `FAQPage`.
8. CTA + quote section + `StickyMobileCta`.

## 8. Navigation

- `config/nav-menus.ts` exports `navMenus` keyed `services | doors | motors`; nav items in `config/site.ts` gain an optional `menu` key (data-keyed, never label-keyed). Brand entries reference `BrandEntity.slug`, so logos/monograms come from `entities.ts`.
- **Desktop** — `components/ui/navigation-menu.tsx` (Base UI, already in the repo): hover **and** focus-within, Escape closes, arrow keys move. Panels:
  - **Services ▾** — three columns: *Repairs* (`/garage-door-repairs-perth`, `/roller-door-repairs-perth`, `/garage-door-spring-repair-perth`, `/garage-door-opener-repair-perth`, `/garage-door-remote-replacement-perth`, `/garage-door-panel-replacement-perth`, `/garage-door-maintenance-perth`), *Install & supply* (`/garage-doors-perth`, `/garage-door-installation-perth`, `/roller-door-installation-perth`, `/commercial-garage-doors-perth`, `/custom-garage-doors-perth`), *Guides* (`/cost-guides`, `/problems`, `/calculator`, `/roller-door-vs-sectional-door`). Footer row: "All services →" `/services`.
  - **Doors ▾** — column 1 *Door types* (`/garage-doors-perth`, `/roller-doors-perth`, `/sectional-garage-doors-perth`, `/tilt-garage-doors-perth`, `/custom-garage-doors-perth`, `/commercial-roller-doors-perth`, `/industrial-roller-doors-perth`); column 2 *Door brands* — BrandMark tile grid of the 10 page brands + "All door brands →" `/garage-door-brands-perth`.
  - **Motors ▾** — column 1: featured **Capital motors card** (`MOTOR_IMAGES.studio`, "Capital 1100N & 1500N — from $770 installed" via `MOTOR_PRICE`, → `/garage-door-motors-perth`) + links (`/garage-door-opener-repair-perth`, `/garage-door-remote-replacement-perth`, `/garage-door-motor-replacement-cost-perth`); column 2 *Motor brands* — BrandMark grid of the 13 page brands + "All motor brands →" `/garage-door-motor-brands-perth`.
  - Links are `HoverPrefetchLink`; panel content mounts on open so logos never load at page load (LCP guard).
- **Width rule:** 10 items must fit 1024 px. `Home` is `hidden xl:inline-flex` (the logo is the home link; Home stays in the mobile menu and at ≥1280 px). Measure in the browser at 1024 and 1280 before calling it done; tighten `lg` gaps only if still needed.
- **Mobile** — inside the existing full-screen menu, each menu item becomes a row (link + 44 px chevron toggle) that expands an accordion: text links, then brand chips (BrandMark + name). One group open at a time.
- **Footer** — add both hubs to the "Resources" column.

## 9. Internal-link surfaces (why these pages won't be orphans)

- Nav mega-menus (site-wide inlinks to 23 pages + 2 hubs), footer hubs, breadcrumbs.
- `components/sections/brands-marquee.tsx` (home + about): a card links to the **internal brand page** when one exists (manufacturer URL moves to the brand page's plate).
- `app/garage-door-motors-perth/page.tsx`: new strip "We service every motor brand" (BrandMark chips → motor brand pages, + hub link).
- Brand pages ↔ hubs ↔ related brands ↔ money pages ↔ problem pages ↔ suburb chips.
- **Phase B (CMS, idempotent script `scripts/link-brand-hubs.ts`, prod default with the usual creds):** append `RelatedServices` links to the doors hub `/garage-doors-perth` (→ door brands hub) and to `/garage-door-opener-repair-perth` + `/garage-door-remote-replacement-perth` (→ motor brands hub). Curl each destination for 200 first (HREF rule in CLAUDE.md).

## 10. SEO & schema

- `buildMetadata` per page; titles ≤60 (pattern "Merlin Garage Door Motors Perth | Repairs & Remotes"), descriptions ≤160 with a price or "same-day" hook; hubs "Garage Door Brands Perth | Every Brand Serviced & Installed".
- One `h1`, no skipped levels; `#direct-answer` + speakable.
- **Per brand page:** `Service` (`name` = page h1 subject, `serviceType` "{Brand} garage door motor repairs & replacement" / "{Brand} garage door repairs & installation", `provider: providerRef()`, `areaServed` Perth) + a `WebPage` node with `about: { "@type": "Brand", name, sameAs: entity.url, logo }` + `FAQPage` + `BreadcrumbList` + speakable. **No** `aggregateRating`/`Review` on `Service` (GSC rejects it — reference project finding), **no** `Product`/`Offer` for third-party brands. New builders: `brandPageSchema(page, entity)` in `lib/seo/schema.ts`; `PageSchema` gains `kind: "brand"`.
- **Per hub:** `CollectionPage` + `ItemList` of the kind's pages (name/url/logo) + `FAQPage` + `BreadcrumbList`.
- Images: logos via `next/image` with `alt="{Brand} logo"`; monograms are CSS/SVG (no request). Brand heroes have no photo → text LCP.
- External links: one official-site link per brand page (E-E-A-T), `rel="noopener"`, verified domain only.
- `on-page-seo.md` matrix: add "Brand page" (Service+Brand · FAQ · speakable · `#quote`) and "Brand hub" (CollectionPage+ItemList · FAQ) rows.

## 11. Content rules for the authoring agents

1. **Research first, per brand:** WebFetch the official site (and, for volume-leading brands, one DataForSEO Perth SERP for PAA — ~$0.002 each). Save `docs/marketing/brand-research-2026-08/<entity>.md` with: origin, ownership, product families/model names, smart app, door types, source URLs, PAA questions. Unknown → omit; never guess a founding year, warranty term or model name.
2. **Claims:** dealer wording only when `entity.dealer` is true; never a competitor warranty period; never "genuine parts in stock" unless dealer.
3. **Prices:** no literal `$` in copy; `pricingPins` + `{{price:id}}` tokens only. Motor pages pin `motor-repair`, `motor-replace`, `remote`, `service`; door pages pin `spring`, `cable`, `damaged`, `service`, `new-standard` (+ `commercial-roller` where copy is commercial-flavoured).
4. **Centurion is two companies:** Centurion Garage Doors (Wangara WA, cgdoors.com.au — doors + openers) vs Centurion Systems (gate motors). Both Centurion pages say which one they mean.
5. **Uniqueness:** each page has its own intro angle (era/estate/door-type where the brand is common in Perth, stated generally), its own models list, fault emphasis and FAQ set. No shared paragraphs beyond the template chrome.
6. **Links:** every href must exist in the live sitemap or the new brand registry; the check script enforces it.
7. Tone: even-handed and expert; never disparage a brand; owner-verifiable Perth detail only.

## 12. Analytics

`lib/analytics.ts` gains `brand_search` (`query`, `results`, `kind`) fired by `BrandFinder`; brand tiles carry no extra events (page views suffice). Directory-only tiles open the existing `QuoteDialog` (already tracked as `quote_open`).

## 13. Error handling & guards

- Catalog unreachable → baked ranges. Logo missing → monogram. Case studies empty → section hidden. Unknown scenario id → build-time failure from the check script.
- `scripts/check-brand-content.ts` (run before build, in the plan): unique slugs; every `BrandPage.brand` exists in entities; `dealer` wording ("authorised") appears only on dealer-brand pages; no `$\d` in copy; titles ≤60, descriptions ≤160; ≥6 FAQs; every `href`/`problemSlug`/nav href resolves against the live sitemap + local registries; every `pricingPins` id exists in `pricing-data.ts`; `updatedAt` is ISO.
- Reserved slugs documented in CLAUDE.md; `app/[slug]` chain order comment updated.

## 14. Verification

- `npx tsc --noEmit`, `npm run lint` on changed files (repo baseline has pre-existing errors — lint changed files individually), `npx tsx scripts/check-brand-content.ts`, `npm run build` (reaches the live CMS by default — fine).
- Browser (Chrome DevTools MCP against the running dev server): header fit at 1024/1280, mega-menu hover + keyboard, mobile accordion at 390, hub finder (match / directory-only / no-match), filter chips, a motor page and a door page end-to-end incl. `#quote`; extract each page's JSON-LD and check types; confirm no `[seo]` length warnings in the console.
- Post-launch: note the publish date; GSC check ~2026-09-27 for the brand query set (compare against the 120-day baseline pulled today).

## 15. Out of scope (deliberately)

CMS-managed brand pages; per-brand OG images; brand-specific parts catalogue (`/products`, as in the reference project); new gallery photos; paid landing pages for brands.
