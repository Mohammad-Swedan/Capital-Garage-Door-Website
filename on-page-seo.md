# On-page SEO — do these on every page

**15 categories · 80+ items** — the complete on-page SEO spec for this repo, tailored to how *this* codebase builds pages. Read it before generating or substantially editing any page. Technical SEO that's already automated here (sitemap, robots, manifest, canonical) is noted so you don't redo it by hand.

> **This is Capital Garage Doors — a Next.js 16 + React 19 + Tailwind v4 marketing site for a Perth garage-door business.** Pages are data-driven and statically generated. Before writing routing/metadata/`<Image>` code, also read the relevant guide in `node_modules/next/dist/docs/` (Next 16 has breaking changes — `params` are async, etc.).

## How pages are built here (read this first)

Every page type flows through four layers — to ship a page you usually only add content:

1. **`content/<type>/…`** — typed content object(s) + a registry array.
2. **`lib/data/<type>.ts`** — async access layer (`get…BySlug`, `get…Slugs`). All call sites go through this, never `content/` directly.
3. **`types/<type>.ts`** — the shared interface.
4. **`components/.../<type>-page-template.tsx`** — the template that renders sections.

Most public routes are thin: resolve slug → data layer → template + `generateMetadata` via `buildMetadata`. **Flat pages** (service / comparison / cost-guide / service-suburb) all share `app/[slug]/page.tsx` — extend its resolution chain, never add a sibling `app/[other]/page.tsx`.

**The shared SEO tools — use these, don't hand-roll:**

| Need | Use | File |
|---|---|---|
| Page metadata (title/desc/canonical/OG/Twitter) | `buildMetadata({ title, description, path, image?, noIndex?, publishedTime?, lastModified? })` | `lib/seo/metadata.ts` |
| JSON-LD builders (LocalBusiness, Service, FAQPage, Article, BreadcrumbList, Organization, …) | the `…Schema()` functions | `lib/seo/schema.ts` |
| Render any JSON-LD node | `<JsonLd data={…} />` | `components/seo/json-ld.tsx` |
| Route-level schema bundles | `<PageSchema kind="…" data={…} />` | `components/seo/page-schema.tsx` |
| Breadcrumb trail **+ BreadcrumbList JSON-LD** (one component) | `<Breadcrumbs items={[…]} />` | `components/seo/breadcrumbs.tsx` |
| NAP / hours / nav / URLs (single source of truth) | `siteConfig` | `config/site.ts` |
| Icon string → component | `resolveIcon(name)` | `lib/icons.ts` |

---

## 0. Live SEO data — pull real numbers before writing

**Google Search Console, GA4, and DataForSEO are connected and verified working** (as of 2026-08-01) — don't guess keywords, search volume, or competitor rankings when this data is one command away. Credentials live in `~/.config/claude-seo/` (`google-api.json`, `dataforseo-api.json`), outside the repo. Scripts live in `C:\Users\Mohammad swedan\.claude\skills\seo\scripts\`; run them with `py -3.12` (not the default `python3`, which lacks the installed packages).

| Question when creating/enhancing a page | Command |
|---|---|
| What's this URL/topic already ranking for, at what position, with what CTR? | `py -3.12 .../scripts/gsc_query.py --property "https://capitalgaragedoors.com.au/" --json` |
| Is a specific page indexed / any coverage issues? | `py -3.12 .../scripts/gsc_inspect.py <url> --json` |
| What organic traffic/engagement is a page or the site getting? | `py -3.12 .../scripts/ga4_report.py --property "properties/544287277" --json` |
| Real search volume / difficulty / intent for candidate keywords | DataForSEO REST API — `curl -u "<login>:<password>" https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live -d '...'` (credentials in `dataforseo-api.json`; see `references/tool-catalog.md` in the `seo-dataforseo` skill for endpoint shapes) |
| What's actually ranking in the SERP for a target keyword (competitors, PAA, featured snippets) | DataForSEO `serp_organic_live_advanced` equivalent REST endpoint |

**Practical use when writing a new page or rewriting an existing one:**
- Before choosing a title/H1/primary keyword, check GSC for queries the site (or a near-duplicate page) already gets impressions for — a query sitting at position 8–15 with real impressions is a far better target than a guessed keyword with zero signal.
- Before drafting FAQs, pull DataForSEO "People Also Ask" / related-keyword data for the target query instead of inventing questions.
- After publishing or substantially rewriting a page, note it so a future GSC check can confirm the change moved the needle — this repo doesn't auto-track that.
- **DataForSEO is metered** (account balance was ~$0.58 as of setup) — check balance via `GET /v3/appendix/user_data` before bulk operations (keyword lists, full backlink crawls); prefer bulk endpoints over N single calls.
- PageSpeed Insights / CrUX (Core Web Vitals field data) are **not yet connected** — need a separate plain API key (same GCP project `totemic-access-504210-f6`, Credentials → API key). Ask the user if that's needed for a task.

---

## 1. Head & Metadata

**In this repo:** every page's `generateMetadata`/`metadata` MUST go through `buildMetadata`. It sets canonical, OG (title/description/image/url/type/locale), Twitter (`summary_large_image`), and robots for you, and applies `title.absolute` so the root `" | Capital Garage Doors"` template is **not** appended (titles are authored complete). It `console.warn`s in dev when a title >60 or description >160 chars — fix those.

- [ ] **Title tag** — 50–60 chars, primary keyword near the start. Authored in `seo.title` (content) — keyword-first, e.g. `"Garage Door Spring Repair Perth | Fast Same-Day Fix"`. Include the brand only if it fits.
- [ ] **Meta description** — 150–160 chars, keyword + benefit + soft CTA. Authored in `seo.description`.
- [ ] **Canonical URL** — automatic via `buildMetadata` (`alternates.canonical` from `path` + `metadataBase`). Just pass the right `path`.
- [ ] **Open Graph** — automatic. Pass `image` only when you have a page-specific 1200×630 asset; otherwise the default card (`config/site.ts → ogImage`) is used with correct `width/height/alt`.
- [ ] **Twitter Card** — automatic (`summary_large_image`, mirrors OG).
- [ ] **`lang`** — set on `<html>` in `app/layout.tsx` (don't change per page).
- [ ] **Viewport / charset** — injected by Next; do not add manually.
- [ ] **Favicon** — `app/favicon.ico` (file convention). *(Apple-touch / PWA 192·512 icons are a pending asset — see "needs content".)*

## 2. URL Structure

**In this repo:** flat keyword slugs resolve through `app/[slug]/page.tsx`; namespaced types live under `/blog/[slug]`, `/problems/[slug]`, `/case-studies/[slug]`, `/lp/[slug]`.

- [ ] **Short slug** — under 60 chars, **lowercase, hyphens only**, primary keyword in it (e.g. `garage-door-repairs-perth`).
- [ ] **No stop words / no underscores / no query params.**
- [ ] **Unique across the flat namespace** — a new flat slug must not collide with any service/comparison/cost-guide/suburb slug (first match wins in the resolution chain).
- [ ] **Logical hierarchy** — use the existing namespaces; don't invent new dynamic segments at `/`.

## 3. Headings

- [ ] **Exactly one `<h1>`** per page — it lives in the page's hero component; never add a second `<h1>`.
- [ ] **Logical `<h2>` → `<h3>`, never skip a level.** (Don't use headings for decorative stats/numbers — use `<p>`/`<span>`.)
- [ ] **`<h2>`s carry supporting keywords / the cluster's questions.** Section headings use `SectionHeading` (defaults to `h2`); article body headings map level 2→`h2`, 3→`h3`.
- [ ] **H1 contains the primary keyword**, written naturally — no stuffing.

## 4. Copy & Body

- [ ] **Primary keyword in the first 100 words**, and a **direct answer in the first paragraph** — service/cost/comparison/suburb pages have a `directAnswer`; articles have `shortAnswer`. Fill them.
- [ ] **Length** within ~20% of the top-3 results for the query.
- [ ] **Short paragraphs (1–4 sentences)**, 8th–10th grade readability, active voice.
- [ ] **Bold key phrases sparingly; use bullets/numbered lists** — article content blocks support `list` (ordered/unordered) and `checklist`.

## 5. FAQ Section — every blog post (and service/cost/comparison/suburb pages)

**In this repo:** `Article.faqs` is **required** by the type, so blog posts always carry FAQs. Render with `FAQSection`; emit `faqSchema(faqs)` (PageSchema already does this for the article/service/etc. kinds). **If a page shows a visible FAQ, it MUST emit FAQPage JSON-LD — and vice-versa.**

- [ ] **4–8 questions** from real "People Also Ask" / keyword-tool questions.
- [ ] **Direct answers, 2–4 sentences each.**
- [ ] **FAQ schema present** wherever the FAQ renders (cross-check the page's `PageSchema`/`JsonLd`).

## 6. Images

**In this repo:** use `next/image`. `next.config.ts` allows `qualities: [60, 75]` and serves AVIF/WebP automatically — only use `quality={60}` or `quality={75}`.

- [ ] **Alt text** describes the image (+ keyword where natural). Alt comes from a content field (`hero.imageAlt`, `featuredImageAlt`, `block.alt`, `item.alt`) — **never leave it blank** for meaningful images. Decorative images use `alt=""` (and the wrapping link/control must carry the accessible name).
- [ ] **Width/height or `fill` + `sizes`** on every image (prevents CLS). Use `fill` + a real `sizes` for responsive/cover images.
- [ ] **Hero/above-the-fold** image: `priority` + `fetchPriority="high"`. **Everything below the fold:** lazy (the default) / `priority={false}`.
- [ ] **Descriptive filenames** for new assets (hyphens, keyword), e.g. `garage-door-spring-repair-joondalup.webp`.
- [ ] **Featured/hero image** set for social sharing (drives the OG card when passed to `buildMetadata`).

## 7. Internal Links

**In this repo:** `<Breadcrumbs>` renders on (almost) every template — keep it. In-body links: write **Markdown links in article paragraph/list text** — `[garage door spring repair](/garage-door-spring-repair-perth)` — they render as `next/link`. Related-content sections (`RelatedArticles`, `RelatedServicesCta`, `ServiceRelatedLinks`) provide card links.

- [ ] **3–5 internal links per post**, **contextually placed in the body** (not only in the bottom card rows).
- [ ] Link to **related posts** and **relevant service pages**; only link slugs that actually resolve (the data layer prunes dead related-article links, but author them correctly).
- [ ] **Descriptive anchor text** — never "click here"/"read more" as the sole accessible name (whole-card links whose name includes the title are fine).
- [ ] **Breadcrumbs on every page** via `<Breadcrumbs>` (home omits it; `/lp/*` intentionally bare).

## 8. External Links

- [ ] **2–3 links to authoritative sources** (.gov / .edu / major industry — e.g. WA fair-trading, manufacturer docs) on long-form posts. Write them as Markdown links with an `https://` href — the article renderer auto-adds `target="_blank" rel="noopener noreferrer"`.
- [ ] **Relevant** to the topic; `rel="nofollow"` only for sponsored/paid links.

## 9. Schema Markup (JSON-LD)

**In this repo:** site-wide `LocalBusiness` (HomeAndConstructionBusiness) + `Organization` + `WebSite` are emitted in `app/layout.tsx` — don't repeat them. Per-page schema comes from `lib/seo/schema.ts` via `PageSchema`/`JsonLd`.

- [ ] **Article** on blog posts (+ Person author) and case studies.
- [ ] **Service** on service / cost-guide / comparison / suburb / landing pages.
- [ ] **FAQPage** wherever a FAQ renders (see §5).
- [ ] **BreadcrumbList** on every page (free with `<Breadcrumbs>`).
- [ ] **CollectionPage** on index/listing pages (`/services`, `/blog`, `/cost-guides`, `/gallery`, …).
- [ ] **Organization / LocalBusiness** — site-wide already; don't duplicate.
- [ ] **Author/Person** — for blog bylines (enriched with `jobTitle`/`description` from `authorTitle`/`authorBio`).

## 10. E-E-A-T

**In this repo:** articles carry `author`, optional `authorTitle` + `authorBio` (renders the `AuthorBio` box + enriches Person schema), and `publishedAt` + `updatedAt` (both shown in the hero; "Updated" only when it differs).

- [ ] **Author byline with a name** on every post.
- [ ] **Author bio + credentials** — set `authorTitle` (e.g. "Capital Garage Doors Technical Team") and `authorBio`; it links to `/about` where credentials live.
- [ ] **Published date displayed** + **"Last updated"** when refreshed.
- [ ] **Real stories, numbers, opinions** in the business's voice; **cite authoritative sources** (§8).
- [ ] **About page** with company credentials + **Contact page** with real NAP (both exist; NAP comes from `config/site.ts`).

## 11. Accessibility (a11y = SEO)

**In this repo:** the root layout provides a **skip-to-content link** + the single `<main id="main-content">` landmark, and `globals.css` defines a global `:focus-visible` ring — don't add a second `<main>` in a page, and don't remove focus outlines.

- [ ] **Semantic HTML5** — `<header>/<nav>/<main>/<article>/<footer>`; pages render **inside** the chrome `<main>`, so never wrap a page in its own `<main>`.
- [ ] **ARIA labels** on icon-only buttons/links (the icon-only control must have an accessible name; decorative icons get `aria-hidden`).
- [ ] **Color contrast** ≥ WCAG AA (4.5:1 body). Avoid very low-opacity text (`/45` etc.) for meaningful copy.
- [ ] **Visible focus** — provided globally; don't override to `outline-none` on interactive elements.
- [ ] **Alt text** (meaningful vs `alt=""` decorative); **descriptive link text**; **skip link** present (global).

## 12. Mobile & Responsive

- [ ] **Responsive Tailwind layout**; **no horizontal scroll** at any viewport (`body` is `overflow-x-hidden`).
- [ ] **Touch targets ≥ 44–48px** — CTA buttons use `min-h-11`; nav/sticky controls are ≥44px. Match this for new interactive elements.
- [ ] **Body font ≥ 16px** (`text-base`); small text only for secondary labels.
- [ ] **No intrusive interstitials** (the one-time welcome loader is session-gated + reduced-motion aware — leave it).

## 13. Social Preview

- [ ] **Default OG card** is correct (1200×630, `config/site.ts → ogImage`). For a **page-specific** card, pass a **1200×630** image to `buildMetadata({ image })` — don't pass an arbitrary aspect-ratio hero (it'll have no asserted dimensions).
- [ ] **Compelling `og:description`** — reuses the meta description; make it benefit-led.

## 14. Conversion Elements *(service / money pages)*

**In this repo:** flat service pages render `ServiceContactPanel` + `ServiceQuoteForm` inside an `id="quote"` section; the hero/area-grid CTA (`RequestQuoteButton`) scrolls to it. Reuse this pattern — every `#quote` CTA needs a real `#quote` target on the page.

- [ ] **Primary CTA above the fold** (hero) + **`tel:` click-to-call** (`siteConfig.business.phone`).
- [ ] **Multiple CTA placements** (hero, mid-page band/`SmartCta`, sticky mobile bar).
- [ ] **Trust signals** — reviews/ratings, "Licensed & Insured", years; **testimonials with names** (`ReviewCards`).
- [ ] **Service-area coverage** listed (`ServiceAreaGrid`); **business hours + physical address** surfaced on-page (`ServiceContactPanel`), not only in the footer. *(An embedded map is a pending item — see "needs content".)*

## 15. Long-form Content *(1500+ word posts)*

**In this repo:** articles get an auto **table of contents** (`TableOfContents`, from `tableOfContents` or level-2 heading blocks) with crawlable `#id` anchors + scroll-spy, and a **`BackToTop`** button — both already wired into the article template. Just write enough level-2 headings.

- [ ] **Table of contents** with anchor links (automatic — ensure ≥3 level-2 headings).
- [ ] **Jump links per H2** (automatic — heading blocks emit `id` + `scroll-mt`).
- [ ] **Back-to-top** (automatic for articles).

---

## Per-page-type requirements (quick matrix)

| Page type | One `<h1>` | Breadcrumb | Required schema (beyond site-wide) | FAQ + FAQPage | Quote/CTA |
|---|---|---|---|---|---|
| Service (flat) | ✅ hero | ✅ | Service · Review · speakable | ✅ | `#quote` form + `tel:` |
| Comparison | ✅ | ✅ | Article · speakable | ✅ | `#quote` |
| Cost-guide | ✅ | ✅ | Article · Service(+Offers) · speakable | ✅ | `#quote` |
| Service-suburb | ✅ | ✅ | LocalBusiness · Service · speakable | ✅ | `#quote` |
| Brand page | ✅ hero | ✅ | Service · WebPage(about: Brand, +speakable) | ✅ | `#quote` form + `tel:` |
| Brand hub | ✅ | ✅ | CollectionPage · ItemList | ✅ | `tel:` + quote |
| Blog post | ✅ | ✅ | Article(Person) | ✅ (required) | in-body links + related |
| Case study | ✅ | ✅ | Article | ✅ if `faqs` set | — |
| Index/listing | ✅ | ✅ | CollectionPage (+ ItemList for /services) | optional | — |
| Standalone (about/contact/…) | ✅ | ✅ | page-appropriate | if visible FAQ → FAQPage | `tel:` |

## Definition of done (before considering a page complete)

1. `generateMetadata` uses `buildMetadata`; no dev `[seo]` length warnings in the console.
2. Exactly one `<h1>`; headings don't skip levels.
3. Every meaningful image has real `alt` + `sizes`/dimensions; hero is `priority`.
4. Breadcrumb renders; 3–5 contextual in-body internal links; 2–3 authoritative external links on long-form.
5. Required schema emitted (matrix above); visible FAQ ⇔ FAQPage JSON-LD.
6. `npx tsc --noEmit` clean; `npx eslint <changed files>` has no errors.
7. `npm run build` passes with the CMS backend running on `:5179`.
