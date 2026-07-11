# Cost-Guide Pages — Design (2026-07-11)

## Goal

Capture the P1 "how much / cost / price" keyword clusters (from Search Console)
that currently have **no dedicated cost page**, and lightly enhance the existing
Repair Cost page. Cost pages win "how much" queries and AI-overview answers.

## Scope

Three new `CostGuidePage`s (flat `app/[slug]` pages) + a light enhancement of the
existing `garage-door-repair-cost-perth` page.

| Page | Slug | GSC | Head keywords |
|---|---|---|---|
| Spring & Cable Replacement Cost | `garage-door-spring-replacement-cost-perth` | 268 impr, 43 kw | garage door spring replacement cost, garage spring replacement cost, garage door cable replacement cost, cost to replace garage door springs and cables |
| Servicing & Maintenance Cost | `garage-door-service-cost-perth` | 204 impr, 13 kw | garage door service cost perth, garage door service cost, garage door servicing cost, garage door maintenance cost, how much to service a garage door |
| Motor / Opener Replacement Cost | `garage-door-motor-replacement-cost-perth` | 218 impr, 4 kw | garage door motor replacement cost perth, garage motor replacement cost, roller door motor replacement cost |

Out of scope: rewriting the repair page; redirecting/re-angling the existing
`/blog/garage-door-motor-replacement-cost-perth` article (noted as a light follow-up —
the new flat cost-guide page becomes the canonical "cost" page for that keyword).

## Architecture (follows the established content pipeline)

Each page flows through the four existing layers — no routing/template/type changes:

1. **`content/cost-guides/<slug>.ts`** — full `CostGuidePage` object (git source of
   truth + local fallback). Pushed onto `content/cost-guides/index.ts`.
2. **`lib/data/cost-guides.ts`** — unchanged; already CMS-cutover (`CMS_COST_GUIDES`
   defaults on).
3. **`types/cost-guide.ts`** — unchanged.
4. **`components/sections/cost-guide/cost-guide-page-template.tsx`** — unchanged;
   `<PageSchema kind="cost-guide">` auto-emits Article/FAQ/Breadcrumb JSON-LD.

### Pricing (single source of truth)

All price ranges mirror `components/sections/smart-calculator/pricing-data.ts`. On the
live site cost tables render from **CMS `PricingItems`** pinned to the page; the local
content file's `costTable.rows` are the git-readable mirror + fallback.

Pinned scenarios per page (catalog scenario names):

- **Spring & Cable:** Broken spring (single), Broken springs (×2), Springs (×3),
  Springs (×4), Spring re-fit / re-tension, Cable snapped or off the drum,
  After-hours / emergency call-out.
- **Service:** Service / tune-up, Safety check-up / inspection,
  Weather seal (rubber & brush), Hinges & rollers / wheels,
  After-hours / emergency call-out.
- **Motor:** Motor / opener replacement, Motor / opener not working (repair),
  WiFi / smart control (supply & install), Remote (extra / replacement),
  After-hours / emergency call-out.

Scenarios not yet enriched with `includes/costFactors/nextStep` (added by the
importer's enrichment map): Springs (×3), Springs (×4),
WiFi / smart control (supply & install), Safety check-up / inspection,
Weather seal (rubber & brush).

## Internal linking (SEO)

- Each new page's `relatedServices` → its 2 sibling cost pages + the most relevant
  service page(s) (e.g. spring page → `/garage-door-repairs-perth`,
  `/emergency-garage-door-repairs-perth`; service page → `/garage-door-maintenance-perth`;
  motor page → `/garage-door-motors-perth`, `/garage-door-repairs-perth`).
- Existing `garage-door-repair-cost-perth` gains `relatedServices` links to all three
  new siblings (de-orphaning), and its blog motor-cost link is repointed to the new
  flat `/garage-door-motor-replacement-cost-perth`.

## Shipping

`scripts/import-new-cost-guide-pages.ts` (mirrors `import-door-type-pages.ts`):
login → fetch `PricingItems` → enrich the ~5 missing scenarios (PUT) → create+publish
each page with pinned pricing rows + relatedServices → append cross-links on the repair
page (append-if-missing, idempotent). Local by default; production via explicit
`CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=…`.

Verify: `npx tsc --noEmit`, lint changed files, run importer against a local CMS if
available, confirm resolve + `npm run build`. Production import run by the owner (or
with the provided prod password).

## Definition of done

- 3 content files + registry updated; repair page cross-linked; importer written.
- `npx tsc --noEmit` clean; changed-file lint clean.
- Titles ≤60, descriptions ≤160, real ranges; `on-page-seo.md` cost-guide matrix
  satisfied (Article + FAQ + Breadcrumb schema via the template).
- Pages created + published in the CMS (local verified; production command supplied/run).
