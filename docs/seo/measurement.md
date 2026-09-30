# Measurement log

Weekly Search Console tracking for capitalgaragedoors.com.au (property
`sc-domain:capitalgaragedoors.com.au`) while the 2026-10 SEO growth program
(`docs/seo/growth-plan-2026-10.md`) runs. One row per report run: a trailing
28-day window ending about 3 days before the run (Search Console data lags a
few days), all countries unless a column says AU.

## Target

**Double organic clicks: 187 -> 380 clicks per 28 days (13.6/day)**, all
countries, on the `sc-domain` property. Compare the `clicks` column of the
28-day rows below against 380.

## How to run

```
npm run seo:report -- --label YYYY-MM-DD
```

The window ends 3 days before today (`--end YYYY-MM-DD` overrides it, `--days N`
changes the length, `--no-write` prints without writing). Each run writes
`docs/seo/gsc-snapshots/<label>.json` and appends a row here. The per-page
table for the money pages in `docs/seo/tracked-pages.json` is in the printout
and the snapshot.

## Columns

- **clicks / impressions / avg pos**: property totals from a dimensionless
  query. They include the ~65% of clicks Search Console hides as anonymised
  queries, so never compare them with sums of query rows.
- **clicks/day**: clicks divided by the window length.
- **AU clicks**: the same window filtered to country = Australia. The total is
  exact (dimensionless query), but Australia page rows are for relative
  comparison only: Search Console drops anonymised-query clicks from page rows
  once a country filter is applied, so the baseline's Australia page groups add
  up to 61 of its 174 clicks (each block prints its `rows sum`); take
  page-level click counts from the all-country rows.
- **brand**: clicks from identifiable queries containing `capital` or `capitol`.
- **non-brand**: clicks minus brand (includes anonymised queries).
- **GBP-UTM (clicks / impr / pos)**: page URLs containing `utm_campaign=gbp` or
  `utm_source=google`, i.e. the Google Business Profile website link once it
  carries the UTM. These clicks are also inside `clicks`. Expect 0 until the
  link is tagged.

## Baseline

The first row, `2026-09-27-baseline` (window 2026-08-31..2026-09-27), is the
frozen baseline; never re-run the script with that label. Full detail is in
`docs/seo/gsc-snapshots/2026-09-27-baseline.json`.

## Runs

| label | window | clicks | clicks/day | impressions | avg pos | AU clicks | brand | non-brand | GBP-UTM (clicks / impr / pos) |
|---|---|---|---|---|---|---|---|---|---|
| 2026-09-27-baseline | 2026-08-31..2026-09-27 | 187 | 6.68 | 35,600 | 25.4 | 174 | 25 | 162 | 0 / 0 / - |
