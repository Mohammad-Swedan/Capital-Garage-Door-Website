# Nov-2026 page program: status and hand-over (as of 2026-11-01)

The plan is `plan-2026-11-pages.md`; the evidence is `serp-pulls-2026-11-01.md`. This file records what was built on 2026-11-01, what is live, and the exact commands for the remaining steps. Everything below ran against the production CMS (`https://cgd.runasp.net`) unless marked "code".

## Built on 2026-11-01

### New pages (8)

| Page | Where it is | Status | Next |
|---|---|---|---|
| `/garage-door-cable-repair-perth` | CMS id 1147 (3 price rows, 3 reviews, 7 FAQs) | **Published 2026-11-02**, Phase B done (14 inbound links incl. 8 cable case studies) | IndexNow submitted 2026-11-02 |
| `/roller-door-prices-perth` | **code**, PR #9 | **Merged + deployed 2026-11-02** (live, 7 Offers in JSON-LD); roller-doors + installation pages now link it; live guard OK; IndexNow submitted | 4–6-week split check (2026-12-01) |
| `/garage-door-lock-repair-perth` | CMS id 1148 | **Published 2026-11-03**, Phase B done (5 inbound links), IndexNow submitted | request indexing |
| `/garage-door-sensor-repair-perth` | CMS Draft id 1149 | waiting for publish | publish, then Phase B |
| `/garage-door-off-track-repair-perth` | CMS Draft id 1150 | waiting for publish | publish, then Phase B |
| `/garage-door-hinge-roller-replacement-perth` | CMS Draft id 1151 | waiting for publish | publish, then Phase B |
| `/garage-door-seal-replacement-perth` | CMS Draft id 1152 | waiting for publish | publish, then Phase B |
| `/garage-door-repairs-wangara` | CMS Draft id 1153 (9 price rows incl. the commercial row, 10 FAQs) | waiting for publish | publish, then `import-wangara-page.ts --phase b --apply` |

Every draft passed the cross-domain duplication check against the four sister sites before import (0.2–1.1% shingle overlap; the gate is 5%, FAIL at 15%). Content fallbacks live in `content/service-pages/` and `content/service-suburb-pages-wangara.ts`.

### Enhancements applied to production (8)

| # | Page | Applied | Script (re-runnable, dry run by default) |
|---|---|---|---|
| E1 | `/garage-door-opener-repair-perth` | 2026-11-01, verified live | `scripts/enhance-2026-11/opener-page.ts` |
| E2 | `/garage-door-maintenance-perth` | 2026-11-01 | `scripts/enhance-2026-11/servicing-page.ts` (+ home "garage door service Perth" anchor, code) |
| E3 | `/commercial-garage-doors-perth` | 2026-11-01 | `scripts/enhance-2026-11/commercial-hub.ts` |
| E4 | `/roller-doors-perth` | 2026-11-01 (paragraph + FAQs; the guide link waits for the deploy) | `scripts/enhance-2026-11/roller-doors-page.ts` |
| E5 | `/garage-door-installation-perth` | 2026-11-01 (the roller-guide link waits for the deploy) | `scripts/enhance-2026-11/installation-page.ts` |
| E6 | `/sectional-garage-doors-perth` | 2026-11-01 (new title "Sectional Garage Doors Perth \| Insulated Panels & Prices") | `scripts/enhance-2026-11/sectional-page.ts` |
| E7 | home + `/service-areas` descriptions (code, PR #9); `/emergency-garage-door-repairs-perth` description | 2026-11-01 | `scripts/enhance-2026-11/emergency-description.ts` |
| E8 | `/garage-door-repair-cost-perth` → installation guide link; home "garage door replacement cost" anchor (code, PR #9) | 2026-11-01 | `scripts/enhance-2026-11/repair-cost-guide-links.ts` |

Title lockstep: `scripts/sync-seo-fixes.ts` `SEO_FIXES` now carries the E1 and E2 titles/descriptions. E1b (motors page → opener page link) was already in place (`components/sections/motors/how-it-works.tsx`), so no change.

### Measurement

- `measurement.md` row `2026-11-01`: 295 clicks / 53,268 impressions / position 17.2 for 2026-10-02..10-29 (baseline 187 / 35,600 / 25.4). The GBP line now reads 19 clicks / 524 impressions / 4.2 after `gsc-report.py` learned the owner's `utm_source=gbp` tag.
- `gsc-snapshots/2026-11-01-inspect.json`: 147 of 170 sitemap URLs indexed. **Crawled, not indexed (20):** 14 suburb pages (Armadale, Baldivis, Butler, Canning Vale, Cockburn Central, Fremantle, Gosnells, Kingsley, Lathlain, Mandurah, Midland, Rockingham, Scarborough, Success), 4 blog posts (common problems, maintenance checklist, how long springs last, how often to service), `/problems/garage-door-off-track`, `/warranty-registration`. **Discovered only:** `/blog/how-to-open-a-garage-door-manually`, the Kingsley case study. **Unknown to Google:** `/garage-door-repairs-willetton`.

## What the owner / you do next

1. ~~Merge PR #9~~ **Done 2026-11-02** (deploy run 41410648518 green). Steps 4 and the IndexNow part of 6 were run the same day for the cable page and the roller guide.
2. **Publish the drafts from /admin** (or ask Claude to run `scripts/publish-pages.ts --flat <slug>`), one or two a day as planned, **in this order**: ~~cable repair~~ (done 2026-11-02) → ~~lock~~ (done 2026-11-03) → sensor → off-track → hinge & roller → seal → Wangara. The order is load-bearing: the off-track draft links `/garage-door-cable-repair-perth` and the hinge draft links `/garage-door-off-track-repair-perth`, so publishing out of order ships a dead link until the earlier page goes live.

   The drafts were re-pushed on 2026-11-01 after a content-integrity pass (verbatim Google review quotes, fallback price rows aligned to the catalog, no unverifiable claims); re-push a draft again with `--phase a --update --apply` if its content file changes before publishing.
3. After each publish, run Phase B (idempotent; it only touches pages that are Published and return 200):
   ```
   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-pages-2026-11.ts --phase b --apply
   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-wangara-page.ts --phase b --apply
   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/repair-cost-guide-links.ts --apply
   ```
4. **After the PR deploys**, add the roller-guide links the scripts skipped, and run the live guard:
   ```
   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/roller-doors-page.ts --apply
   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/installation-page.ts --apply
   npx tsx scripts/check-brand-content.ts
   ```
5. **Deploy #2 (code, after the service pages are published):** add the published pages to the Services mega-menu Repairs column (`config/nav-menus.ts`) and the footer Services list (`config/site.ts`) — cable repair and off-track repair first — then re-run the live guard. A Draft is a live 404, so never add a nav entry for an unpublished page.
6. **IndexNow + Request indexing:** after each deploy/publish, submit the new URLs with the SEO skill's `indexnow_submit.py`, and press **Request indexing** in Search Console for (in this order): `/roller-door-prices-perth`, `/garage-door-cable-repair-perth`, `/garage-door-opener-repair-perth`, `/garage-door-maintenance-perth`, `/sectional-garage-doors-perth`, `/commercial-garage-doors-perth`, `/garage-door-repairs-wangara`, `/garage-door-repairs-kingsley`, `/garage-door-repairs-willetton`, `/problems/garage-door-off-track`.
7. **Day 10 (about 2026-11-11):** `npm run seo:report -- --label 2026-11-11`, `npm run seo:ga4`; live duplication check `py -3.12 check_dup.py --target https://capitalgaragedoors.com.au --paths <the 8 new paths> --against <4 sisters>`.
8. **Day 30 (about 2026-12-01):** check that `/roller-door-prices-perth` and `/roller-doors-perth` split "prices" vs product intent (merge with a 301 if they keep swapping), and that the opener and servicing pages moved for their primary queries.

## Not done, on purpose

- No new nav/footer entries for the seven CMS drafts (they are 404s until published).
- No change to the five titles from the 2026-09-30 CTR pass (4–6-week rule).
- No "northern suburbs" page, no "commercial roller shutters" page, no motor-replacement service page (see the plan's "What the data says NOT to build").
- The 14 crawled-not-indexed suburb pages were not rewritten; they are a quality judgement by Google and the fix is links + requests, not more copy.
