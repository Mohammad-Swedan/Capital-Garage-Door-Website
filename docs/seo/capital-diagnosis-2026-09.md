# Capital Garage Doors: organic search diagnosis, September 2026

Written 2026-09-30 for the owner and for future sessions. It records why organic clicks have stalled at 187 per 28 days. The plan that follows from it is `docs/seo/growth-plan-2026-10.md`.

**In short.** Capital ranks on pages 2 to 5 for almost every competitive search, so most of its clicks come from the home page (which also catches searches for the brand by name) and from the cost pages. The main cause is a weak backlink profile. Two other causes are that August and September effort went into page types with little search demand, and that the Google Business Profile, which drives the map pack, is under-used. The one inner-page cluster that ranks despite low authority is price content, and it is under-built.

## 1. Baseline

Source: Search Console property `sc-domain:capitalgaragedoors.com.au`, 28 days from 2026-08-31 to 2026-09-27, all countries. It is frozen in `docs/seo/gsc-snapshots/2026-09-27-baseline.json` and in the first row of `docs/seo/measurement.md`.

- **187 clicks** (6.7 a day), 174 of them from Australia.
- **35.6k impressions**, click-through rate 0.53%, **average position 25.4**.
- Weekly clicks have been flat at about 50 since the July spike wore off: 39 to 52 a week from the week of 2026-07-27 onward.
- **The July spike was one-off.** It was 99 and 72 clicks in the weeks of 2026-07-06 and 2026-07-13, from the relaunch plus the redirects from the old site's URLs. It fell to 29 the week after and has not come back.
- **The August "221k impressions" is noise.** One worldwide query, "how to fix garage door sensor", took 181,771 impressions and 2 clicks; Google answers it with an AI Overview. Australian searches for it were only 2.4k impressions. That one query also made August's average position look good (11.2, against 25.4 now).
- **Seasonality.** September is the peak month for repair searches, March has a smaller bump, and December to January dips. Compare like with like, or compare against the frozen baseline.

## 2. Where the clicks come from

Clicks by page group over the same 28 days. Groups are the ones `classify_page` in `scripts/seo/gsc-report.py` uses, so the weekly report reproduces this table. Shares are of the 187 total.

| Group | Clicks | Share | Notes |
|---|---|---|---|
| Home | 63 | 34% | |
| Cost and price pages | 57 | 30% | Motor replacement cost 22, repair cost 18, `/cost-guides` 12. The other 5 are a blog post on panel replacement cost (3), the calculator (1) and the springs cost guide (1). |
| Door-type and product pages | 26 | 14% | Tilt doors 8, roller doors 7, custom doors 5. |
| Service pages (11) | 14 | 7% | Panel replacement 7 and remote replacement 1. The other nine (repairs, emergency, springs, openers, servicing, installation, roller-door repairs and installation, roller vs sectional) took 6 between them. |
| Static pages | 8 | 4% | Reviews 3, service areas 2, and one each for services, contact and a mistyped tilt-door URL (`/tilt-garage_doors-perth`, which returns a 404). |
| Blog | 8 | 4% | Springs guide 6. The panel cost post above is counted under cost. |
| 21 brand pages and 2 brand hubs | 11 | 6% | |
| 44 suburb pages | 3 | 2% | |
| 38 case studies | 1 | 1% | |
| Problem pages (8) | 0 | 0% | |

Page rows add up to 191, slightly more than the 187 property total, so the shares add up to about 102%. Use the property total for anything site-wide.

About **65% of clicks come from anonymised queries**: 124 of the 187 clicks do not appear against any query, and the query report shows only 63. Brand queries ("capital garage doors" and variants) account for about 23 clicks per 28 days from Australia (25 worldwide). The other 162 clicks are non-brand or anonymised.

## 3. Leads

Source: GA4 property 544287277, Organic Search only, 2026-08-02 to 2026-09-28, 505 sessions. Reproduce it with `npm run seo:ga4 -- --start 2026-08-02 --end 2026-09-28`.

- **5 quote submits:** home 2, and one each from the custom doors, panel replacement and tilt doors pages.
- **1 booking:** home.
- **8 call taps:** home 4, and one each from the springs guide, the buying guide, the emergency page and the remote replacement page.
- **The home page produces about half of the measured organic leads** (7 of 14). Cost pages attract research visits (the repair cost, motor cost and `/cost-guides` pages had 87 organic sessions between them) but rarely start leads: none of the three produced a quote, booking or call.
- **AI assistants sent 51 sessions**, about 10% of the organic volume. 50 came from ChatGPT and 1 from Gemini. ChatGPT's top landing pages were `/industrial-roller-doors-perth` (15) and `/calculator` (6).

## 4. Root causes, weighted

In order of weight.

1. **Authority ceiling.** DataForSEO counts 19 backlinks from 19 referring domains, a spam score of 60, only one `.com.au`, and 0 live citations. Local page-one competitors have 59 to 211 referring domains (for example perthgaragedoorsrepairs.com.au 106, edenrocgaragedoors.com.au 211, slideandglide.com.au 108). As a result:
   - Every competitive term sits on pages 2 to 5: the repairs cluster at about position 21, the emergency page 32, installation 52, commercial 41, and "garage doors perth" 37.
   - The home page outranks the dedicated pages: repairs 21 against 62, emergency 9 against 32.
   - Indexing is incomplete: 146 of 169 URLs are indexed. Recent suburb pages, case studies and 3 how-to posts are unknown or not indexed.
2. **August and September effort went to page types with little search demand.** Brand pages are navigational (people want the manufacturer). Suburb demand is about 500 searches a month across all of metro Perth, and the map pack takes most of it. Case studies have no search demand.
3. **The map pack is under-used.**
   - The Google Business Profile has 4.9 stars from 114 reviews, against 347 to 670 for the pack leaders. It reaches the top 3 only near Southern River and Armadale.
   - Its website link has no UTM tag, so its clicks cannot be measured: they are mixed into the home page row.
   - Benchmark, from comparable Perth garage-door sites and not from Capital's own data: the profile's website link produces 17% to 50% of all clicks.
4. **Price intent is the one inner-page cluster that ranks with low authority, and it is under-built.**
   - Cost pages rank 8 to 23.
   - Live Perth results for "garage door prices perth" and "garage door installation cost perth" show no strong installer price page.
   - Capital had no real price-list page and no installation-cost page. The cost guides got few internal links, and six money pages showed an empty price table.
5. **Low click-through on page-one queries.** For example "garage door repair cost" at position 7.8 with 0 clicks, "garage door cable repair perth" at 8.7, and "garage door motor replacement cost" at 9.0.
6. **Not a cause: duplicate content across domains.** Capital's pages are unique on the live web; the median shared text is about 2%.

## 5. Reading and measuring these numbers

- Use the `sc-domain:` property. The URL-prefix property under-reports historical windows.
- Take totals from a dimensionless query, never by summing query rows: the query report leaves out anonymised queries (about 65% of Capital's clicks). `scripts/seo/gsc-report.py` does this.
- Australia page rows are for relative comparison only. Search Console drops anonymised-query clicks from page rows once a country filter is applied, so the baseline's Australia page groups add up to 61 of the 174 Australian clicks. Use the all-country page rows for click counts; the Australia totals (174 clicks) come from the dimensionless query and are correct.
- Filter to Australia before judging how much demand a query has. Worldwide impression spikes, like the August one, are noise.
- Backlink, review-count, index-status and ranking figures in section 4 come from DataForSEO, Search Console and Google Business Profile checks in late September 2026 and were not re-measured for this document. Re-check them before quoting them as current.
