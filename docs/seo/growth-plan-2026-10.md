# Capital Garage Doors: SEO growth plan, October 2026 to March 2027

Written 2026-09-30. The evidence behind this plan is in `docs/seo/capital-diagnosis-2026-09.md`. Progress is tracked in `docs/seo/measurement.md`.

## Target

**380 organic clicks per 28 days (13.6 a day)**, up from 187 at the frozen baseline (28 days to 2026-09-27). Measured on Search Console property `sc-domain:capitalgaragedoors.com.au`, all countries.

| Checkpoint | Clicks per 28 days | What should be true |
|---|---|---|
| Baseline, 28 days to 2026-09-27 | 187 | Frozen. |
| End of October 2026 | about 230 | Price hub, installation guide, internal links and click-through fixes are live and crawled. |
| End of November 2026 | about 290 | Those pages rank. The owner's Google Business Profile and review work shows up. |
| December to January | hold | Seasonal dip. Do not lose ground, and do not read the dip as failure. |
| About March 2027 | 380 | Authority work has compounded, helped by the March search bump. |

On-site work alone is estimated to reach about 260 to 300. The rest depends on the owner's off-page work: Google Business Profile, reviews, dealer-locator listings and citations.

## Strategy change

**Stop**

| Stop | Why |
|---|---|
| New suburb pages (leave the 9 drafts unpublished) | Suburb demand is about 500 searches a month across metro Perth and the map pack takes most of it. The 44 live suburb pages earned 3 clicks in 28 days. |
| Case studies written for search | The 38 case studies earned 1 click. They have no search demand. Keep using them as proof on money pages. |
| National how-to guides | They need authority Capital does not have, and AI Overviews answer them. The sensor guide's query drew 181,771 impressions and 2 clicks in August. |
| Brand-page expansion | Brand searches are navigational. The 21 brand pages and 2 hubs earned 11 clicks. |

**Start, and double down**

- The price hub and the new installation-cost guide.
- Internal links to the cost pages and the money pages.
- Filling empty sections on money pages.
- Click-through (CTR) fixes on queries that already rank on page one.
- Owner-run Google Business Profile, reviews, dealer and citation links.
- A weekly report against the frozen baseline.

## Workstreams

**Measurement.** `npm run seo:report -- --label YYYY-MM-DD` pulls a 28-day Search Console window, writes a snapshot to `docs/seo/gsc-snapshots/` and appends a row to `docs/seo/measurement.md`. Totals come from a dimensionless query, because query rows hide about 65% of clicks. The report also prints the 23 money pages in `docs/seo/tracked-pages.json` with clicks, impressions, position and the position of each page's primary query, and it reports the Google Business Profile UTM link separately. `npm run seo:ga4` answers which landing pages produce quote submits, bookings and call taps. The baseline is frozen in `docs/seo/gsc-snapshots/2026-09-27-baseline.json`.

**Price hub.** `/cost-guides` becomes the full "Garage Door Prices Perth" price list. It renders every catalog price from the single price source (`pricing-data.ts` and the CMS price items), so no price is ever typed by hand. It already ranks around positions 14 to 18 for the price queries, which makes it the best home for "garage door prices perth". `/calculator` goes back to being a tool: its last retitle aimed it at that query, where it sits around position 85.

**Installation guide.** A new page, `/garage-door-installation-cost-perth`, targets "garage door installation cost perth". Live Perth results show no strong installer price page for that query. It uses catalog prices only. New prices by door type and size can only be added once the owner supplies and approves them (see the to-do table). It links to the hub and to the other four cost guides.

**Internal links.** Every money page links to its matching cost guide and to the hub, the cost guides link to each other, and the navigation, footer and menus point at the hub and the installation guide. The home page links to prices and new doors, and service pages show recent work, which uses the case studies as proof and as a source of links. Anchor text is descriptive.

**Technical fixes.** A batch of small fixes found in the audit: cost-guide structured data that stated wrong prices, price labels (`$3,000`, not `$3000`), the `lang` attribute, a nested `<main>`, the pricing section of `llms.txt`, redirect destinations (every destination must return 200), review-card guards and the review link.

**CMS price and review pins on service pages.** Six money pages show an empty price table because no catalog scenarios are pinned to them: spring repair, emergency, maintenance, opener repair, roller-door repairs and commercial garage doors. Eight pages have no pinned reviews: those six plus installation and repairs. Pinning catalog scenarios and reviews in the CMS fills these sections. It is a CMS content step run after the code deploys, and prices still come only from the catalog.

**Indexing.** 146 of 169 URLs are indexed, and recent suburb pages, case studies and 3 how-to posts are unknown or not indexed. After the new pages deploy: resubmit the sitemap in Search Console, ping IndexNow for the new and changed URLs (Bing and other engines use it; Google has not adopted it), and the owner uses Request indexing on the top 10 URLs.

**Owner authority kit.** `docs/marketing/authority-kit-2026-10.md`, written separately, is the owner's working kit for the off-page work: copy-paste Google Business Profile fixes, review requests, weekly posts, the dealer-locator requests, the top citations and local links. Authority is the ceiling in the diagnosis (19 referring domains against 59 to 211 for local competitors), and only the owner can do this work.

## Owner to-do

| # | Action | Why |
|---|---|---|
| 1 | Change the Google Business Profile website link to `https://capitalgaragedoors.com.au/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. | Local-pack clicks are currently mixed into the home page row. With the tag, the report's GBP line measures them. |
| 2 | Set the Google Business Profile name to "Capital Garage Doors". | It must match the website and the citations. |
| 3a | Check three claims in the Google Business Profile description against your records: "20+ years / 10,000 doors", "no hidden callout fees" and "lifetime workmanship warranty". Keep a claim only if your records confirm it; otherwise remove it from both the profile and the website. | Two of them differ from the site's own pages, so please decide which is right: the price list has a $140 attendance fee for hinges and rollers and a +$500 after-hours surcharge, and the warranty page gives a 12-month workmanship warranty. The years and door count are not yet verified: confirm them from records before keeping them. The website repeats all three (see the note below the table), so keep the website and the Google profile consistent. |
| 3b | Keep "licensed and insured" in the profile description only if you can prove it: name the licence and the public-liability cover. | The website says it on 168 of its 169 pages (the footer, the home page badge, the About page and the site description in `config/site.ts`), so the profile and the website must change together, or neither. |
| 4 | Send a review request with the Google `writereview` link after every job. | 114 reviews against 347 to 670 for the pack leaders is the main gap in the map pack. |
| 5 | Claim the 8 manufacturer dealer-locator listings (B&D, Steel-Line, Gliderol, Avanti, Superlift, Boss, Perth Windsor Doors and Jaytech). | Links from manufacturers are the most relevant authority Capital can earn. |
| 6 | Submit the top 12 citations, using the name, address and phone in `docs/marketing/citations-pack.md`. | Capital has 0 live citations. |
| 7 | Decide whether to publish new-door prices by door type and size, and supply the figures if so. | The installation guide can only show catalog prices until then. |
| 8 | Use Request indexing in Search Console for the top 10 URLs once the new pages are live. | Speeds up discovery. Start with the price hub, the installation guide and the money pages in `docs/seo/tracked-pages.json`. |

**The website makes the same claims, so the profile is only half of the fix.** A check of all 169 sitemap pages on 2026-09-30 found "lifetime workmanship warranty" on 9 pages (home, About, services and six door and installation pages), against the 12-month term on the warranty page; "no hidden callout or travel fees" on the home and About pages, against the attendance fee and after-hours surcharge in the price list; "more than 10,000 doors" on the About page; "20+ years" or "over 20 years" on 130 pages; and "licensed" or "insured" wording on 168. Taking a claim off the profile alone leaves the site contradicting its own price list and warranty page. Once the owner has approved the wording, the website copy needs a developer edit (`config/site.ts`, the shared components and the CMS pages that repeat these lines).

## Weekly routine

1. `npm run seo:report -- --label YYYY-MM-DD` (the label is the run date).
2. `npm run seo:ga4`.
3. Compare the `clicks` column of the new row in `docs/seo/measurement.md` with the milestones above and with the 187 baseline. Check the GBP line and the tracked-page positions.
4. Four to six weeks after the hub and the installation guide ship, check whether they split the price queries cleanly: "garage door prices perth" should land on `/cost-guides`, and "garage door installation cost perth" on the installation guide. The tracked-page table names the page with the most impressions for each primary query. If the two pages keep swapping places for both queries, merge them.
