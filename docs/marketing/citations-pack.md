# Citations & Backlinks Pack — Capital Garage Doors

Written 2026-08-04. Companion tracker: [`citations-tracker.csv`](./citations-tracker.csv).

## How to use this

Paste the **same** business details into every listing, character for character. Consistency is the
entire point of a citation: search engines match listings to your Google Business Profile by
comparing name, address and phone, and a listing that says "Suite 2/13 Amrock St" or an old phone
number is worse than no listing at all, because it splits the signal instead of reinforcing it.

Work top-down through the tracker. Record the live URL of each listing once it is published, so the
set can be re-checked later when details change.

**What this does and does not do.** Citations are foundational — they make the business verifiable
and consistent across the web, and they are what most competitors have and this business does not
(the last backlink check found essentially none). They are not, on their own, a ranking lever that
moves a map pack. The review count is still the larger gap (77 against Dynasty's 643, Silverline's
603, Statewest's 244). Treat this as removing a handicap, not as a growth campaign.

---

## Master NAP block

Copy this verbatim. Source of truth: `config/site.ts` + the Google Business Profile.

```
Business name:  Capital Garage Doors
Legal entity:   Capital Garage Door Pty Ltd
ABN:            86 689 651 643
Address:        13 Amrock Street, Southern River WA 6110, Australia
Phone:          0475 333 335        (international: +61 475 333 335)
Email:          info@capitalgaragedoors.com.au
Website:        https://capitalgaragedoors.com.au
Hours:          Mon–Fri 7 AM–6 PM · Sat–Sun 8 AM–4 PM
```

Two things to watch:

- **The GBP name is "Capital Garage Door" (singular)** while the site and legal entity are "Capital
  Garage Doors". Align the GBP to the plural before submitting anywhere, then use the plural
  everywhere. Do not create listings under both spellings.
- **The address came from the business owner** and was corrected once already (it used to read
  "6 Carnegie Parade"). Never change it without asking them.

The email address is fine to type into directory forms. It must still never be rendered as
plaintext on the website itself — the site uses `ObfuscatedEmail` for that, deliberately, to keep
it away from address harvesters.

## Categories

Verified against the live GBP on 2026-08-01, and against competitors:

- **Primary:** Garage door supplier
- **Secondary:** Repair service

Do not "fix" the primary category. Dynasty, Silverline and Statewest — the businesses outranking
this one — all use *Garage door supplier* as their primary too. It has been checked.

Where a directory uses its own taxonomy, pick the closest of: Garage Doors, Garage Door Repairs,
Doors & Door Fittings, Home Improvement / Trades.

## Descriptions

**Short (~50 characters)** — for fields that cut off hard:

```
Same-day garage door repairs across Perth.
```

**Medium (~150 characters)**:

```
Same-day garage door repairs, servicing and new installations across the Perth metro area. Springs, motors, cables, rollers and full door replacements.
```

**Long (~750 characters)**:

```
Capital Garage Doors is a Perth-based garage door repair and installation company servicing the
whole metro area, from Two Rocks in the north to Mandurah in the south, and from the coast out to
the Perth Hills. Our mobile technicians carry the common parts on board, so most repairs —
broken springs, worn cables, failed motors, off-track and noisy doors — are finished in a single
visit, often the same day you call.

Alongside repairs we service and tune existing doors, replace motors and remotes, and supply and
install new roller, sectional, tilt and custom doors, including commercial and industrial roller
shutters. We work with B&D, Steel-Line and Centurion equipment.

Licensed and insured. Call 0475 333 335 or request a quote at capitalgaragedoors.com.au.
```

Rules for any variation you write: no prices (prices live only in the CMS pricing catalog and
change), no claims that cannot be backed up, and always the phone number and the website.

## Services list

Garage door repairs · Emergency garage door repairs · Garage door installation · Roller door
installation · Roller door repairs · Sectional garage doors · Tilt garage doors · Custom garage
doors · Garage door opener/motor repair · Garage door spring repair · Garage door maintenance and
tune-ups · Commercial and industrial garage doors · Commercial roller doors

## Service area

Perth metropolitan area — northern suburbs (Joondalup, Wanneroo, Clarkson, Ellenbrook), southern
suburbs (Canning Vale, Gosnells, Cockburn, Baldivis, Rockingham, Mandurah), eastern suburbs and the
hills (Midland, Kalamunda), the western suburbs and the coastal strip.

## Images to upload

Every listing that accepts photos should get them — listings with images are clicked more, and
these are real jobs, not stock:

- Logo: `public/images/logo-icon-512.png` in this repo
- https://jadara-hub.b-cdn.net/capital-garage-door/gallery/new-garage-doors-installed-perth.webp
- https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-torsion-spring-replacement-perth.webp
- https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-installation-perth.webp
- https://jadara-hub.b-cdn.net/capital-garage-door/gallery/sectional-garage-door-cable-repair-perth.webp

More at https://capitalgaragedoors.com.au/gallery if a directory wants a larger set. Some
directories reject WebP — if so, open the image and re-save as JPEG.

---

## Tier 1 — core Australian citations

Do these in order. The first two matter most: they feed the two search engines and the map data
behind iOS, and both are free.

| # | Site | Submit at | Cost | Notes |
|---|---|---|---|---|
| 1 | Bing Places | bingplaces.com | Free | **Do this first.** Can import directly from Google Business Profile, so it is the fastest listing to create. Also gives you Bing Webmaster Tools, which is how the inbound links from this whole exercise get verified later. |
| 2 | Apple Business Connect | businessconnect.apple.com | Free | Feeds Apple Maps and Siri. Needs an Apple ID; verification is usually by phone call. |
| 3 | Yellow Pages AU | yellowpages.com.au | Free tier | The strongest Australian directory. The free listing is enough — decline the paid upsell unless there is a reason. |
| 4 | White Pages AU | whitepages.com.au | Free tier | Same operator as Yellow Pages; usually a separate submission. |
| 5 | TrueLocal | truelocal.com.au | Free | Long-established AU directory, still well indexed. |
| 6 | Localsearch | localsearch.com.au | Free tier | AU-owned; will phone to upsell. Free listing is fine. |
| 7 | StartLocal | startlocal.com.au | Free | Quick form, no verification friction. |
| 8 | AussieWeb | aussieweb.com.au | Free tier | Older directory, low effort, still worth the citation. |
| 9 | Yelp AU | biz.yelp.com | Free | Claim rather than create if a listing already exists — search first. |
| 10 | Hotfrog AU | hotfrog.com.au | Free | Fast, accepts a description and images. |
| 11 | Cylex AU | cylex.net.au | Free | Fast, low value individually, fine as part of the set. |
| 12 | Word of Mouth | wordofmouth.com.au | Free | AU review-led directory; a listing here can also collect reviews. |

**Paid lead marketplaces — optional, your call:** Oneflare (oneflare.com.au), hipages
(hipages.com.au) and ServiceSeeking (serviceseeking.com.au) all give a citation and a link, but
their business model is charging per lead and putting you in a bidding pool against competitors
for work that might otherwise have come to you directly. List them for the citation only if you are
willing to field the sales calls. They are in the tracker marked `optional`.

**ABN note:** several of these ask for it. It is `86 689 651 643` — no blocker.

## Profiles you already own — re-verify

These are citations you have already earned, and they drift silently. Check each one shows the
master NAP block exactly, then tick it off in the tracker:

- Google Business Profile — https://www.google.com/maps?cid=14180702000236315157
  (also fix the singular/plural name here, see above)
- Facebook — https://www.facebook.com/p/Capital-Garage-Door-Repairs-61581857974729/
- Instagram — https://www.instagram.com/capitalgaragedoorperth1
- YouTube — https://www.youtube.com/@CapitalGarageDoors

## Supplier and dealer listings

These are the highest-value links in this document. A dealer page on a manufacturer's site is
industry-relevant and hard for a competitor to replicate, which is exactly what a directory link is
not. The site already names all three brands as equipment it works with.

For each: check whether the manufacturer runs a dealer or stockist locator, find the route to the
Western Australia rep or the marketing contact, and send the email below.

- **B&D Doors** — bnd.com.au
- **Steel-Line** — steel-line.com.au
- **Centurion Systems** — centsys.com.au

Reusable outreach email:

```
Subject: Perth installer — dealer locator listing request

Hi,

I run Capital Garage Doors, a garage door repair and installation business in Perth. We regularly
install and service your products for residential and commercial customers across the metro area.

I'd like to be listed on your dealer/stockist locator so local customers looking for an installer
can find us. Our details:

  Capital Garage Doors
  13 Amrock Street, Southern River WA 6110
  0475 333 335
  info@capitalgaragedoors.com.au
  https://capitalgaragedoors.com.au

Happy to provide anything you need — ABN, insurance certificates or trade account details.
Who's the right person for this?

Thanks,
Capital Garage Doors
```

If a manufacturer has no public locator, ask anyway whether they list accredited installers
anywhere — some maintain one only for trade-account holders.

## Local sponsorship and community links

Worth doing slowly and only where it is genuine. A sponsorship link from a Perth club in a suburb
you actually service is a strong local signal; a paid link from an unrelated site is not.

Research procedure — do not guess at club names:

1. Search `"<suburb> junior football club" sponsors`, `"<suburb> cricket club" sponsors`,
   `"<suburb> netball" sponsors`, and `"<suburb> community group" sponsors` for the suburbs that
   already have their own pages: Southern River, Gosnells, Canning Vale, Cockburn Central, Atwell,
   Baldivis, Joondalup.
2. Keep only clubs whose website **actually publishes outbound sponsor links** — many list sponsors
   as logos with no link, which is worth nothing for SEO (though it may still be worth doing for
   the business).
3. Record 5–8 candidates in the tracker with the contact and the likely cost, then let the owner
   choose which to approach.

Also worth checking: the local chamber of commerce and any Perth trade associations that publish a
member directory.

---

## Order of work

1. Bing Places and Apple Business Connect (free, highest value, unblocks link verification).
2. Fix the GBP name to the plural, then re-verify the four profiles you already own.
3. Tier 1 items 3–12, a few at a time.
4. Supplier outreach — send all three emails in one sitting; replies take weeks.
5. Sponsorship research, once the above is done.

After each batch, the listings can be checked for being live and recorded in the tracker, and new
inbound links watched for in Bing Webmaster Tools.
