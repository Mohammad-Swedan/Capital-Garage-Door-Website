# Authority & Google Business Profile kit — Capital Garage Doors (Oct–Nov 2026)

Written 2026-09-30 for the business owner to execute. Builds on
[`citations-pack.md`](./citations-pack.md), [`citations-tracker.csv`](./citations-tracker.csv) and
[`semrush-2026-08/link-prospects.md`](./semrush-2026-08/link-prospects.md).

Every fact here was checked on 2026-09-29/30 (DataForSEO, the live site, the brand websites).
**Every price comes from the live price list** (`https://capitalgaragedoors.com.au/api/pricing`, 27 rows as at
2026-09-30). Never type a price that is not on that list — the list changes, and a wrong price on Google is a
consumer-law problem, not just an SEO one.

## Why this kit exists (60 seconds)

- The site is stuck at about **187 organic clicks per 28 days**.
- Cause #1 is **authority**: 19 backlinks from 19 low-quality domains (spam score 60, one `.com.au`) and **0 live
  directory citations**. Page-one Perth competitors have **59–211 referring domains**.
- Every money search ("garage door repairs perth", "garage door springs perth", "near me") opens with the Google
  **local 3-pack**. Capital's profile only makes the top 3 near Southern River and Armadale.
- On comparable Perth garage-door sites the **GBP website link produces 17–50% of all organic clicks**. It is the
  single biggest lever you control without touching the website.
- Where the profile stands today: name "Capital Garage Door", **4.9 stars from 114 reviews** (77 on 2026-08-01 —
  37 in two months, keep that up), 88 photos, claimed, open 24/7, primary category "Garage door supplier",
  secondary "Repair service".

Rules that keep you safe, whatever else you do:

1. Never offer a discount, gift or entry for a review, and never ask only the happy customers. Both break Google's
   review policy and the ACCC treats incentivised or filtered reviews as misleading.
2. Never state a price that is not on the price list. Never claim "flat rate" or "no call-out fee" — the price
   list has a $140 attendance fee on small parts jobs and a $500 after-hours surcharge.
3. The profile must only say things the website also says (warranty terms, dealer brands, hours).
4. Never buy links, join "blogroll" networks or pay for site-wide "home improvement" links. The competitor with the
   most paid links is the one whose traffic is now falling.

---

## 1. One-page summary — the 10 highest-impact actions, in order

| # | Action | Time | Expected effect |
|---|---|---|---|
| 1 | Put the UTM website link on the profile (§2.1) | 5 min | Search Console starts showing exactly how many clicks the map pack sends (17–50% on comparable sites). Everything else gets measured against this. |
| 2 | Replace the description with the provable version, fix the name, decide the hours (§2.3–2.5) | 20 min | Keeps only claims you can prove (warranty term, call-out fees, "licensed", "20+ years / 10,000 doors"). The **website makes the same claims** (see the callout under §2.5), so confirm the wording once and the developer updates the site to match — profile and website must say the same thing. |
| 3 | Start the review routine: SMS after every job + QR card on the invoice (§3) | 30 min setup, 1 min per job | 15–20 new reviews a month. Pack leaders have 347–670; at 20/month you pass 347 in about 12 months. Reviews widen the radius in which you make the 3-pack. |
| 4 | Enter 20 service areas and the priced services list (§2.6–2.7) | 45 min | Tells Google which suburbs you want to appear in and answers the "how much" question inside the pack. |
| 5 | One post and 3–5 job photos every week (§2.8, §4) | 15 min/week | Fresh, local, price-led content on the profile; posts show in the knowledge panel and carry tracked links to the site. |
| 6 | Email the 8 brand dealer-locator requests (§6) | 1 hour to send; weeks to land | Manufacturer links are the most trusted, hardest-to-copy links in this industry. Five locators are confirmed live. |
| 7 | Bing Places + Apple Business Connect (§7) | 30 min | Bing and Apple Maps listings, plus Bing Webmaster Tools so new links can be verified later. |
| 8 | The remaining 10 Tier-1 citations with the identical NAP block (§7) | 3–4 hours over two weeks | Goes from 0 to 12 consistent citations — the handicap every competitor has already removed. |
| 9 | Three corridor sporting-club sponsorships + two supplier links (§8) | 2 hours + sponsorship cost | Real Perth links from suburbs you service (Piara Waters, Gosnells, Southern River). |
| 10 | Monthly 30-minute tracking review with the developer (§9) | 30 min/month | Shows what moved (reviews, citations, referring domains, GBP clicks, calls) so the next month's effort goes where it works. |

Realistic target: with all ten running, plan for organic clicks to move from ~187 towards 300+ per 28 days by
March 2027. December–January always dips in this market — compare like-for-like months, and don't panic in January.

---

## 2. GBP fixes (copy-paste ready)

Open **business.google.com** (or search your business name while signed in and click "Edit profile").

### 2.1 Website link

Paste exactly this into the **Website** field:

```
https://capitalgaragedoors.com.au/?utm_source=google&utm_medium=organic&utm_campaign=gbp
```

Why: without the tag, map-pack clicks land on the plain homepage URL and are impossible to tell apart from normal
search clicks. With it, the developer can filter Search Console (page contains `utm_campaign=gbp`) and GA4
(campaign = `gbp`) and report the pack's share of clicks every month. The site treats the tagged URL as the
homepage, so nothing breaks.

### 2.2 Appointment link

In **Bookings / Appointment links**, use the quote page on your own domain rather than the raw booking-system URL:

```
https://capitalgaragedoors.com.au/quote?utm_source=google&utm_medium=organic&utm_campaign=gbp-appointment
```

It loads the same live quote widget (requests still land in the CRM), it is on your brand's domain instead of an
unbranded hosting address, and the site records the submission as a lead. If you prefer people to book a time slot
directly, keep the booking-system link — but then those clicks and bookings won't show in the site's analytics.

### 2.3 Business name

The profile says **"Capital Garage Door"**; the website, logo and social handles say **"Capital Garage Doors"**;
the registered company is "Capital Garage Door Pty Ltd". Google's rule is the real-world name on your signage,
vans and invoices — no "Pty Ltd", no keywords added.

- If your vans and invoices say **Capital Garage Doors**, change the profile name to that, then use that spelling
  on every citation in §7. Do it **before** the citation run, not after — one spelling everywhere is the point.
- Renaming can trigger re-verification (video or postcard). Allow for it; do not change anything else on the
  profile the same day.
- The Facebook page is named "Capital Garage Door Repairs" — rename it to match as well.

### 2.4 Hours — pick one truth

The profile says **open 24 hours, 7 days**. The website says **Mon–Fri 7 am–6 pm, Sat–Sun 8 am–4 pm**. Google
compares the two, and customers do too. Choose:

- **Option A (recommended):** set the profile to the website's hours and add the line about 24/7 emergency call-outs
  to the description (already in §2.5). Honest, and the surcharge is disclosed.
- **Option B:** keep 24/7 on the profile only if a human genuinely answers at 3 am every night — and tell the
  developer to change the website hours to match (they live in one place on the site).

### 2.5 Business description (≤ 750 characters)

Paste this (728 characters; the limit is 750):

```
Capital Garage Doors is a Perth garage door repair and installation business based in Southern River, servicing the whole metro area. Our vans carry common springs, cables, rollers and motors, so most repairs are finished in one visit, often the same day. We fix broken springs and cables, doors off their tracks, faulty motors and remotes, and supply and install new roller, sectional, tilt, custom and commercial doors. Authorised dealer for B&D, Steel-Line, Gliderol, Avanti, Boss Openers, Jaytech, Superlift and Perth Windsor Doors, plus our own Capital motor range: 5-year warranty (7 with annual servicing) and a 12-month workmanship warranty. 24/7 emergency call-outs (after-hours surcharge applies). Free on-site quotes.
```

What the current description claims, and why each line is removed or changed:

| Current claim | Problem | What replaces it |
|---|---|---|
| "Licensed and insured technicians" | Only say "licensed" if you can name the licence (for example an electrical licence for hard-wired motor work, or building-contractor registration) and show it on request. "Insured" is fine **only** if you hold public liability cover and can show the certificate — if so, say "public liability insured". (The website's default page description also says "Licensed, insured" — keep it on both, or take it off both, but make them match what you can prove.) | Omitted until you can name the licence / cover. |
| "20+ years of experience and over 10,000 doors installed" | The website says it too ("For over 20 years…" on the home and About pages, "Two decades and more than 10,000 doors" on About, and "Trusted by Perth homeowners for 20+ years" on most pages). 10,000 doors over 20 years is 500 a year, every year — if your records prove it, keep it on both; if not, it is a false representation under the Australian Consumer Law, which applies to a Google profile and a website exactly as it does to an ad. | Omitted until you confirm it. |
| "Flat-rate pricing with no hidden callout fees" | Directly contradicted by the price list: prices are ranges, small parts jobs carry a **$140 attendance fee** (hinges/rollers are "$30 each + $140 call-out"), and after-hours work is **+$500**. A customer who reads both has a complaint ready-made. | "Free on-site quotes" and "after-hours surcharge applies". |
| "Lifetime workmanship warranty" | The website's warranty page states **12-month workmanship** and **5-year motor (7 with annual servicing)** — yet the website's own marketing copy on 9 pages also promises a "lifetime workmanship warranty". The site contradicts itself. A warranty term you don't honour is misleading, and the mismatch is visible to anyone who checks. | The real terms, word for word. |
| "Fully stocked service vans" | Soft, but keep it honest. | "carry common springs, cables, rollers and motors" — say it only because it is true. |

> **The website says these things too — decide once, fix both.** A crawl of all 169 live pages (30 Sep 2026)
> found: "lifetime workmanship warranty" on 9 pages (home, About, services, custom, garage-doors, roller doors,
> roller-door installation, sectional, tilt) against the warranty page's 12 months; "No hidden callout or travel
> fees" on the home and About pages against the price list's $140 attendance fee and +$500 after-hours surcharge;
> "20+ years" / "10,000 doors" on the home and About pages and in shared boilerplate; and "licensed" / "insured" on
> almost every page. Tell the developer, in writing, which of these are true: (1) your real workmanship warranty
> term, (2) whether any call-out/attendance fee applies, (3) years in business and doors installed, (4) the licence
> and insurance you hold. The developer then makes the website match — and you paste the matching wording into the
> profile. Until then, the profile description above only uses facts that already agree across the site.

### 2.6 Categories

- **Keep "Garage door supplier" as primary.** The businesses that outrank you use the same primary; it is
  checked. Do not "fix" it.
- Keep **"Repair service"** as a secondary.
- Add **"Door supplier"** (a real category — confirmed 2026-09-30 against public category lists).
- "Garage builder" also exists but is for people who build garages. Don't add it; irrelevant categories dilute.
- Anything else: type it into the category box and only add it if Google offers it and it describes work you
  actually do (e.g. a commercial-door category, if one is offered). Never guess.

### 2.7 Service areas (Google allows a maximum of 20)

All twenty have their own page on the website. South-east corridor first (your base, and the only area where you
already make the 3-pack), then the big-volume suburbs.

```
Southern River, Gosnells, Canning Vale, Thornlie, Huntingdale, Maddington, Harrisdale, Piara Waters,
Forrestdale, Armadale, Kelmscott, Cannington, Willetton, Cockburn Central, Rockingham, Baldivis,
Mandurah, Midland, Joondalup, Wanneroo
```

Notes: entering "Perth WA" alone is too broad to help. If a name is refused, try the local-government version
("City of Gosnells"). Service areas do **not** move where you rank in the pack — that is driven by your verified
address, reviews and relevance — they tell Google which searches you are eligible for.

If 13 Amrock Street is a home with no customer-facing premises, Google's rules say the address should be hidden
(kept for verification, not shown). Talk to the developer before doing that, because the website and the citations
below currently show it, and hiding it changes what must be pasted everywhere.

### 2.8 Services, with prices from the price list

Google's services editor normally accepts a price as **Free, Fixed or From**. Enter the "From" figure and put the
range in the 300-character description (if your editor offers a price range, enter the full range instead). Keep the services you already have; rename where shown.

| GBP service (rename to this) | Price field | Description to paste |
|---|---|---|
| Garage door repair | From $240 | Springs, cables, rollers, off-track and stuck doors, most fixed same day. Single spring $240–$280, snapped cable $280–$550, door off track $440–$770. Exact price confirmed on-site, free, before work starts. |
| Broken spring replacement | From $240 | Single spring $240–$280 supplied and fitted. Pair $440–$550 (best replaced together). Re-tension of existing springs $280–$330. Same-day across Perth. |
| Cable repair | From $280 | Snapped or frayed lift cables replaced or re-seated on the drum and re-tensioned: $280–$550. |
| Door off track / stuck door | From $440 | Re-rail the door, straighten and realign the tracks, replace damaged rollers: $440–$770. Call now if the door is unsafe. |
| Garage door opener repair | From $380 | Diagnose and repair the motor, gears, logic board, capacitor or limit switches: $380–$490. |
| Garage door motor replacement | From $770 | New opener supplied, installed and programmed, remotes included: $770–$990. Capital 1100N/1500N belt-drive motors with 5-year warranty (7 with annual servicing). |
| Garage door remote | Fixed $95 | Extra or replacement remotes $95 each, plus $120 to attend and program them to your motor. Tell us your opener brand. |
| WiFi / smart control | From $280 | Add app control to a compatible opener, supplied and installed: $280–$380. |
| Safety sensors | From $150 | Replace and realign the photo-eye safety sensors: $150–$300. Quick, same-day fix. |
| Garage door service / tune-up | From $140 | Full tune-up (lubricate, re-tension, balance, safety check) from $140 plus any parts. 20-point safety inspection with written report: $120. |
| Emergency garage door repairs | No price | 24/7 attendance across Perth. After-hours or emergency attendance adds $500 to the repair price. Door off track $440–$770, cables $280–$550, springs $240–$280 single. |
| Garage door installation (new door) | From $3,000 | Standard roller or sectional door supplied and installed, including removal of the old door, new tracks and hardware: $3,000–$5,000. Commercial and custom doors $5,000–$15,000. Free measure and quote. |
| Roller door repairs | From $380 | Roller-door lock and arms $380–$440; pelmet/hood replaced $380–$480; weather seals $280–$480. |
| Panel / section replacement | From $550 | Repair or replace a damaged panel or section and hardware to match the door: $550–$1,100. Send a photo for a quote. |
| Hinges & rollers | From $140 | Worn hinges, rollers and wheels replaced: $30 per part plus $140 attendance. Cheaper bundled with a service. |
| Commercial roller doors | From $280 | Commercial roller door service and repair $280–$380. New commercial or custom doors $5,000–$15,000. |
| Door removal & reinstall | From $880 | Remove and reinstall for rendering or building works: roller door $880–$1,500, sectional door $990–$1,300. |
| Tilt door arms & springs | From $1,200 | Tilt-door arms kit with springs: $1,200–$1,800. |
| Garage door consultation / design | Free | Free on-site measure and quote for new doors, with no obligation. |
| Garage door parts | No price | Genuine springs, cables, rollers, remotes and motors for all major brands. |

### 2.9 Photo plan

- **Every week, 3–5 photos from real jobs**: the fault (broken spring, cable off the drum, buckled panel), the
  finished door, and the van at the job. Before/after pairs are the most clicked.
- Once, this month: a clean **logo**, a **cover photo** of a finished installation, the **team**, and each **van**.
- Phone photos are fine: landscape, daylight, no filters, minimum 720 × 720 px, JPG. Geotagging is not needed —
  Google strips it. Never photograph house numbers, number plates or people who haven't agreed.
- Also add the same photos to the profile's **Products** section as "Capital 1100N motor", "Capital 1500N motor",
  "Sectional doors", "Roller doors" (price: the From figures above), which puts a priced tile in the knowledge panel.

### 2.10 Two-minute extras

- Turn on **Messaging** and answer within an hour during the day (Google shows the response time).
- Keep the **"Online estimates"** and **"On-site services"** attributes (already on) and tick any other
  "From the business" attribute Google offers that is true — never one that isn't.
- Add the Q&A seeds in §5 and answer them from the business account.

---

## 3. Review velocity kit

**The link** (one for everything — SMS, email, QR code, invoice footer):

```
https://search.google.com/local/writereview?placeid=ChIJe-GkxTxvuA8RFcLBLVb5y8Q
```

Ask the developer for a short branded redirect (`capitalgaragedoors.com.au/review`) that forwards to it — easier to
say out loud and to print.

**When to ask:** at the door, the moment the job is signed off — "If you're happy with that, I'll text you a link
to leave us a Google review, it really helps a small local business." Then send the SMS within the hour. Ask
**every** customer, not only the happy ones. Same-day repair customers are the most likely to review; the technician
who did the job should be the one sending.

**SMS (paste, fill the brackets; plain characters only — a curly quote or a long dash makes the phone send it as
several messages):**

```
Hi {first name}, thanks for choosing Capital Garage Doors. Happy with the {job}? A quick Google review helps our small Perth team: https://search.google.com/local/writereview?placeid=ChIJe-GkxTxvuA8RFcLBLVb5y8Q  Cheers, {technician}. Reply STOP to opt out.
```

Once the developer adds the `capitalgaragedoors.com.au/review` redirect, swap the long link for it and the text fits
in a single SMS.

**Email (send 3 days later if no review has appeared):**

```
Subject: How did we go with your garage door, {first name}?

Hi {first name},

Thanks again for having us out to {suburb} on {date} for your {job}. If everything is still running smoothly, would you take a minute to leave us a Google review? It is the main way new customers find a local repairer, and it means a lot to the team.

Leave a review here: https://search.google.com/local/writereview?placeid=ChIJe-GkxTxvuA8RFcLBLVb5y8Q

If anything isn't right, please reply to this email or call 0475 333 335 and we will come back and fix it.

{Technician name}
Capital Garage Doors
```

**QR card:** in Chrome, open the review link, right-click the page and choose "Create QR code for this page" (free,
no account). Print it on a business-card-size sticker: "Scan to review Capital Garage Doors on Google", and put it
on the invoice, the job-sheet clipboard and the van's rear window.

**Cadence:** 15–20 reviews a month. From 114 today, 20 a month reaches 347 (the low end of the pack leaders) in
about 12 months; 15 a month takes about 16. Track the count monthly in §9.

**Replying (reply to every review within a week — Google shows it, and it is the cheapest local-relevance signal
there is; name the suburb and the job, never the customer's address):**

Positive:

```
Thanks {first name} — glad the spring replacement in Thornlie got the door back up the same day. Enjoy the quiet door, and give us a call if anything needs a look. — {Technician}, Capital Garage Doors
```

Negative (never argue, never post personal details, take it offline, then fix it):

```
{First name}, I'm sorry the job in {suburb} didn't go the way it should have — that is not the standard we hold ourselves to. I would like to put it right. Please call me directly on 0475 333 335 or reply to the email we sent so I can book a technician back out at no charge to look at it. — {Owner name}, owner, Capital Garage Doors
```

**Never:** offer money, discounts or prize draws for reviews; ask staff or family to review; use a "review gate"
that only sends happy customers to Google; buy reviews. Google removes them, and the ACCC has taken action over
fake and incentivised reviews.

---

## 4. Weekly GBP posts — 8 drafts, October–November 2026

One post every Monday. Type: **Update**. Button: **Learn more** with the link shown (every link carries
`?utm_source=google&utm_medium=organic&utm_campaign=gbp-post` so the developer can measure post clicks separately).
Attach one real photo to each. All prices are from the price list on 2026-09-30 — before posting, glance at
`capitalgaragedoors.com.au/cost-guides` and, if a figure has changed, use the new one.

**Post 1 — Mon 5 Oct — "What garage door repairs actually cost in Perth"**

```
Nobody likes calling a tradie with no idea what the bill will be, so we publish our prices. Typical Perth jobs right now: broken spring $240–$280 (a pair $440–$550), snapped cable $280–$550, door off its tracks $440–$770, opener repair $380–$490, new motor supplied and installed $770–$990, annual service from $140 plus parts.

These are indicative ranges. Your exact price is confirmed on-site, free and with no obligation, before any work starts. Same-day repairs across Perth from our Southern River base.

See the full price list and cost guides:
```
Link: `https://capitalgaragedoors.com.au/cost-guides?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 2 — Mon 12 Oct — "A loud bang from the garage is usually a spring"**

```
If you heard a bang and now the door feels twice as heavy or the opener strains and stops, a torsion spring has most likely snapped. Don't keep running the motor and don't try to lift the door by hand — with the spring gone you are lifting the door's full weight, and a double door can weigh over 100 kg.

We carry the common spring sizes on the van, so most spring jobs are done in one visit, usually the same day. Single spring supplied and fitted $240–$280; pair $440–$550 (springs on a two-spring door are best replaced together so the door stays balanced); re-tensioning existing springs $280–$330.

More on spring repairs, and what to check first:
```
Link: `https://capitalgaragedoors.com.au/garage-door-spring-repair-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 3 — Mon 19 Oct — "Book a service before summer"**

```
Perth summer is hard on garage doors: heat, dust, and a door that gets opened far more often once school holidays and Christmas visitors arrive. A spring service catches the worn cable, dry rollers and out-of-balance springs before they fail on a 40-degree day.

Service and tune-up from $140 plus any parts: we lubricate, re-tension, balance and safety-check the whole door. Prefer a report first? Our 20-point safety inspection with a written report is $120.

If we installed your Capital motor, a yearly service also keeps your extended 7-year motor warranty valid.

Book a service:
```
Link: `https://capitalgaragedoors.com.au/garage-door-maintenance-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 4 — Mon 26 Oct — "Motor on its last legs? A new opener is $770–$990 installed"**

```
Grinding, stopping halfway, or a remote that only works from a metre away? Sometimes it is a repair ($380–$490 to diagnose and fix the gears, board, capacitor or limit switches). When the motor is past saving, a new opener supplied, installed and programmed — remotes included — is $770–$990.

Our Capital 1100N suits standard single and double sectional doors; the 1500N has the extra pull for large, insulated or timber-look doors. Both are quiet belt-drive units with soft start and stop, WiFi app control, built-in LED lighting, auto-reverse safety sensors and a battery-backup option. 5-year warranty, extendable to 7 with annual servicing, plus a 12-month workmanship warranty on our installation.

See the range:
```
Link: `https://capitalgaragedoors.com.au/garage-door-motors-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 5 — Mon 2 Nov — "Recent job: car trapped behind a jammed door in Southern River"**

```
A sectional door in Southern River buckled off its tracks and jammed halfway, with the family car stuck inside. Several rollers had pulled out of the track and the top section was distorted.

Our technician made the door safe first, freed the car, realigned the panels in the tracks and replaced the bent rollers and brackets — all in the same visit. A door off its tracks is one of the most common emergency calls we get; typical repair cost is $440–$770, and we attend 24/7 (after-hours call-outs add $500).

If your door is jammed, don't force it — call us. Read the full job:
```
Link: `https://capitalgaragedoors.com.au/case-studies/emergency-garage-door-repair-southern-river-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 6 — Mon 9 Nov — "Lost or dead garage remote?"**

```
First, try a new battery — it fixes more "broken" remotes than anything else. If that's not it, we supply and program replacement or extra remotes for all the major opener brands: $95 per remote plus $120 to attend and program them to your motor. Ordering two or three at once costs only the extra $95 each.

Want your phone as the remote? Adding WiFi/smart control to a compatible opener is $280–$380 supplied and installed — handy for letting in a delivery or checking the door is shut from work.

Tell us your opener brand and we'll bring the right remote:
```
Link: `https://capitalgaragedoors.com.au/garage-door-remote-replacement-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 7 — Mon 16 Nov — "Thinking about a new garage door before Christmas?"**

```
A tired, dented or rusting door drags the whole front of the house down. A new standard roller or sectional door supplied and installed — including removal of the old door, new tracks and hardware — is $3,000–$5,000. Commercial and custom doors, priced to your opening, run $5,000–$15,000.

We are an authorised dealer for B&D, Steel-Line, Gliderol and Perth Windsor Doors, and we install Avanti, Boss Openers, Jaytech and Superlift openers as well as our own Capital motors. Roller, sectional, tilt, insulated and custom doors; free on-site measure and quote.

Book a free measure and quote:
```
Link: `https://capitalgaragedoors.com.au/garage-door-installation-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

**Post 8 — Mon 23 Nov — "Door stuck at 10 pm? We answer 24/7"**

```
A garage door that won't open when you need the car, or won't close when you're leaving the house empty, can't always wait until morning. We take emergency calls 24 hours a day, 7 days a week, across the Perth metro area.

Being straight about the cost: after-hours or emergency attendance adds $500 to the normal repair price. The common night-time fixes are a door off its tracks ($440–$770), a snapped cable ($280–$550) or a broken spring ($240–$280 single). If it can safely wait until the morning, we'll tell you — and you save the surcharge.

While you wait: don't force the door and don't lift it if a spring has snapped. Call us:
```
Link: `https://capitalgaragedoors.com.au/emergency-garage-door-repairs-perth?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`

---

## 5. GBP Q&A seeds — 8 questions to post and answer from the business account

Post each question from the business account, then answer it from the same account. Update an answer the day a
price changes.

1. **Do you charge a call-out fee?**
   Quotes are free — our technician confirms the exact price on-site, with no obligation, before starting. Two things
   to know: on small parts jobs (hinges, rollers, wheels) parts are $30 each plus a $140 attendance fee, and
   after-hours or emergency attendance adds $500 to the repair price.

2. **How much does it cost to replace a garage door spring in Perth?**
   Single spring supplied and fitted $240–$280; a pair $440–$550 (best replaced together so the door stays
   balanced); re-tensioning your existing springs $280–$330. Most spring jobs are done the same day.

3. **How much is a new garage door motor?**
   $770–$990 supplied, installed and programmed, remotes included. Our Capital 1100N and 1500N belt-drive motors
   carry a 5-year warranty, extendable to 7 years with annual servicing, plus a 12-month workmanship warranty.

4. **Can you repair my existing opener instead of replacing it?**
   Often, yes. Diagnosing and repairing the motor, gears, logic board, capacitor or limit switches is $380–$490.
   If the unit is beyond economic repair we'll say so and quote a replacement.

5. **Do you do emergency and after-hours repairs?**
   Yes, 24/7 across the Perth metro area. After-hours or emergency attendance adds $500 to the normal repair price.
   If the door can safely wait until morning, we'll tell you so you can avoid the surcharge.

6. **How much does a new garage door cost?**
   A standard roller or sectional door supplied and installed, including removal of the old door, new tracks and
   hardware, is $3,000–$5,000. Commercial and custom doors are $5,000–$15,000, priced to your opening. The
   measure and quote is free.

7. **Which brands do you install and service?**
   We are an authorised dealer for B&D, Steel-Line, Gliderol, Perth Windsor Doors, Avanti, Boss Openers, Jaytech
   and Superlift, and we supply our own Capital motor range. We repair and service all the common brands found in
   Perth homes.

8. **Which suburbs do you cover?**
   We're based in Southern River and cover the whole Perth metro area. Closest to us: Gosnells, Canning Vale,
   Thornlie, Huntingdale, Harrisdale, Piara Waters, Armadale and Kelmscott — and we regularly work everywhere from
   Joondalup to Rockingham, Baldivis and Mandurah.

---

## 6. Dealer-locator links — the 8 brands you are an authorised dealer for

Checked 2026-09-30. A dealer or installer listing on the manufacturer's own site is the highest-trust link this
business can earn, and your competitors mostly don't have them. Ask for: **a listing with your business name,
suburb, phone and a link to `https://capitalgaragedoors.com.au`**. Where a locator shows no website link, ask
anyway — the name, address and phone on a manufacturer site is still a citation.

| Brand | Locator page | Status | Who to ask / what to request |
|---|---|---|---|
| **B&D** | `https://www.bnd.com.au/dealers-near-me/` | Live — "Accredited B&D dealer" search by suburb/postcode, with state directories (WA included). No public application route. | Your B&D rep or trade-account manager; otherwise 13 62 63. Ask to be added as an Accredited Dealer for the Perth south-east area, with website link. |
| **Steel-Line** | `https://www.steel-line.com.au/installers/` | Live — state-by-state list of accredited independent installers; **each installer gets an individual profile page** on steel-line.com.au. | The Steel-Line Perth branch (its page is `https://www.steel-line.com.au/garage-doors-perth/`; national line 1300 767 900). The online "installer recruitment" form currently targets Queensland only, so go through the branch. Request an installer profile page with your website link. |
| **Gliderol** | `https://gliderol.com.au/our-dealers/` | Live — dealer list filterable by state, showing name, address and a quote button; WA dealers already listed. | Gliderol on 1300 799 177 or your rep. Ask for the WA dealer listing and whether a website link can be included. |
| **Superlift** | `https://www.superliftgdo.com.au/find-an-installer/` | Live — suburb/postcode installer search. WA-based brand (Forrestfield). | `enquiries@superliftgdo.com.au` / (08) 9454 9677. Ask to be listed as an installer for the south-east corridor suburbs, with website link. |
| **Jaytech** | `https://www.jaytechopeners.com.au/stockists/` | Live — stockists page ("Contact a Stockist today"). | `info@jaytechopeners.com.au`. Ask to be listed as a Perth stockist/installer with website link. |
| **Avanti** | not found — `avantigdo.com` has no dealer locator (it only mentions a "network of partners") | Not available | Superlift's own site carries an Avanti opener page, so ask the Superlift rep whether the Avanti line can be covered by the same installer listing; also email Avanti through its contact page asking for a "where to buy in Australia" mention. |
| **Boss Openers** | not found — the brand's site could not be reached (two attempts); directory listings suggest BOSS is distributed through Steel-Line's branch network (unverified) | Not confirmed | Ask your BOSS supplier rep directly; raise it with the Steel-Line Perth branch at the same time as the Steel-Line request. |
| **Perth Windsor Doors** | not found — local Wangara manufacturer with no dealer/installer locator on its site | Not available | Ask the owner for a "preferred installer" mention with a link on their site (they are a local manufacturer; a Perth installer page benefits them too), and offer a reciprocal mention on your brand page. |

Email to send to each brand (edit the brand name and the two bracketed lines; send all eight in one sitting —
replies take weeks):

```
Subject: Perth installer — dealer locator listing request ({Brand})

Hi {name / team},

I run Capital Garage Doors, a garage door repair and installation business based in Southern River, Perth. We are an authorised dealer for {Brand} and install and service your products for residential and commercial customers across the Perth metro area.

Could we be added to your {dealer locator / installer finder / stockists} page? Our details:

  Capital Garage Doors
  13 Amrock Street, Southern River WA 6110
  0475 333 335
  info@capitalgaragedoors.com.au
  https://capitalgaragedoors.com.au

If the listing can include our website link, that would be appreciated. Happy to supply our ABN (86 689 651 643), insurance certificate or trade-account details, and a couple of photos of recent {Brand} installs if you feature dealers.

Who is the right person to arrange this?

Thanks,
{Owner name}
Capital Garage Doors
```

---

## 7. Citations — the top 12, plus the gaps

Citations make you verifiable and consistent; they are foundational, not a growth engine on their own. The
**exact same** name, address and phone everywhere is the whole point — "Suite 2/13 Amrock St" or an old number
splits the signal instead of reinforcing it. Fix the profile name (§2.3) first, then paste this block, character
for character, into every listing. Record each live URL in `citations-tracker.csv`.

```
Business name:  Capital Garage Doors
Legal entity:   Capital Garage Door Pty Ltd
ABN:            86 689 651 643
Address:        13 Amrock Street, Southern River WA 6110, Australia
Phone:          0475 333 335        (international: +61 475 333 335)
Email:          info@capitalgaragedoors.com.au
Website:        https://capitalgaragedoors.com.au
Hours:          Mon–Fri 7 AM–6 PM · Sat–Sun 8 AM–4 PM   (or 24 hours, if you chose Option B in §2.4 — same choice everywhere)
Category:       Garage Doors / Garage Door Repairs (closest available)
Short blurb:    Same-day garage door repairs, servicing and new installations across the Perth metro area. Springs, motors, cables, rollers and full door replacements.
```

For a long description use the §2.5 text — it supersedes the older long description in `citations-pack.md`, which
still contains the "licensed and insured" line.

| # | Site | Submit at | Cost | Priority | Notes |
|---|---|---|---|---|---|
| 1 | Bing Places | bingplaces.com | Free | Do first | Imports straight from your Google profile. Also gives you Bing Webmaster Tools, which is how the developer verifies new links later. |
| 2 | Apple Business Connect | businessconnect.apple.com | Free | Do first | Apple Maps and Siri. Needs an Apple ID; verification usually by phone. |
| 3 | Yellow Pages AU | yellowpages.com.au | Free tier | High | The strongest AU directory — every page-one competitor has it. Decline the paid upsell. |
| 4 | White Pages AU | whitepages.com.au | Free tier | High | Same operator, separate submission. |
| 5 | TrueLocal | truelocal.com.au | Free | High | Long-established, still well indexed. |
| 6 | Localsearch | localsearch.com.au | Free tier | Medium | AU-owned; expect a sales call — the free listing is enough. |
| 7 | StartLocal | startlocal.com.au | Free | Medium | Quick form. |
| 8 | AussieWeb | aussieweb.com.au | Free tier | Medium | Older directory, low effort. |
| 9 | Yelp AU | biz.yelp.com | Free | Medium | Search first and claim an existing listing rather than creating a duplicate. |
| 10 | Hotfrog AU | hotfrog.com.au | Free | Medium | Accepts description and images. |
| 11 | Cylex AU | cylex.net.au | Free | Low | Fast, low individual value, fine as part of the set. |
| 12 | Word of Mouth | wordofmouth.com.au | Free | Medium | Review-led directory; can collect reviews too (never at Google's expense). |

Gaps worth adding next (from the competitor backlink research in `semrush-2026-08/link-prospects.md`):

| Site | Cost | Priority | Why |
|---|---|---|---|
| nationaldirectory.com.au | Free | High | Page-one competitors hold dozens of links from it. |
| avenueperth.com | Free | High | Perth-specific; every competitor studied is listed. |
| purelocal.com.au, dlook.com.au, fyple.com.au, atozpages.com.au | Free | Medium | Standard AU directories the competitors all have. |
| threebestrated.com.au | Free (editorial) | Medium | They pick the listed businesses — get the review count up first, then apply. |
| hipages.com.au, oneflare.com.au | Free profile, paid per lead | Optional | Real citation and link, but they sell leads back to you in a bidding pool. List for the profile only if you are prepared for the sales calls. |

Also re-check the profiles you already own — Facebook, Instagram, YouTube — show the block above exactly, including
the plural name once you have changed it.

---

## 8. Local links (white-hat only)

Ten-plus concrete asks. All free or a normal sponsorship fee; none is a paid link. Skip anything that offers "a
link for $X" — that is a link scheme, and Google penalises the buyer.

| # | Target | The ask |
|---|---|---|
| 1 | **Manufacturer locators** (§6) — eight brands, five confirmed live | The highest-value links in this list. Send all eight emails in one sitting. |
| 2 | **Piara Waters Junior Football Club** — sponsors page `piarawaterspirates.com.au/sponsors/`; the club publishes a 2026 sponsorship-packages PDF | Take a package that includes a linked logo on the sponsors page (confirm the link is clickable before paying). Photo of the sponsored team on your profile and website. |
| 3 | **Gosnells Junior Football Club** — sponsors page `gosnellsjfc.com.au/sponsors` | Same ask; contact via the club website. Gosnells is your next-door suburb. |
| 4 | **Southern River Hockey Club** — sponsors page `southernriverhockey.asn.au/new-sponsors` | Same ask — your home suburb, and the club already lists local trades as sponsors. |
| 5 | **Your parts and door suppliers** (whoever you buy springs, cables, motors and doors from, including the Steel-Line Perth branch) | Ask for a "stockist / trusted installer" listing, or offer a short case study ("how Capital fitted 40 of your motors this year") for their news page, with a link. |
| 6 | **Jaytech and Superlift** (both WA-linked brands) | Beyond the locator listing, offer a photo-led "featured installer" story for their blog or socials. Local brands like a Perth installer they can point to. |
| 7 | **Master Builders WA and HIA** | If you want a membership for its own sake (contracts, insurance, training), the member directory listing is a legitimate link. Don't join only for the link. |
| 8 | **Perth Home Show / HIA Home Show** exhibitor listing | If you exhibit, the exhibitor directory links to your site. A by-product of exhibiting, not a purchased link. |
| 9 | **Property managers and strata managers in Southern River, Canning Vale and Cockburn** | The three agencies that already send you work: ask to be on their published "preferred trades" page. Strata managers often list approved contractors too. |
| 10 | **Local school P&C fetes** (Southern River, Harrisdale, Piara Waters primary schools) | Fete sponsorship pages usually list and link sponsors. Small money, very local. |
| 11 | **Perth family site (buggybuddys.com.au)** | Pitch a free "garage door safety check for families" checklist — auto-reverse test, pinch points, remote out of kids' reach — written by your technician, with one link to the safety-inspection service. |
| 12 | **Local news** — PerthNow's Canning/Armadale/Cockburn editions and any surviving Armadale–Gosnells community paper | Offer a seasonal tips piece ("five things to check on your garage door before summer") or a storm-damage comment. Journalists take a local tradie's quote readily; ask for a link to the site. |
| 13 | **Renovation forum (homeone.com.au) and design directory (archipro.com.au)** | A modest profile with genuinely helpful answers on the forum; a free portfolio profile on the directory. No signature spam. |

Procedure for any new club or group: search "`{suburb} {sport} club` sponsors", open the sponsors page, and only
proceed if it publishes clickable links (many show logos with no link — still fine for the business, worth nothing
for SEO). Log each one in the tracker with contact, cost and the live URL.

---

## 9. Tracking — monthly checklist

Fill one row a month (first working day). Baselines are from 2026-09-29.

| Month | Google reviews (count / rating) | Citations live | Referring domains | GBP link clicks (GSC, page contains `utm_campaign=gbp`) | GBP calls + direction requests (profile Performance tab) | Site calls (GA4 `call_click`) | Leads (GA4 `quote_submit` + `booking_submit`) | Organic clicks, 28 days | 3-pack check (search "garage door repairs" from Southern River / Canning Vale / Armadale / Cockburn Central on your phone) |
|---|---|---|---|---|---|---|---|---|---|
| Sep 2026 (baseline) | 114 / 4.9 | 0 | 19 | — (starts once the UTM is live) | | | | ~187 | top 3 near Southern River & Armadale only |
| Oct 2026 | | | | | | | | | |
| Nov 2026 | | | | | | | | | |
| Dec 2026 | | | | | | | | | |
| Jan 2027 | | | | | | | | | |
| Feb 2027 | | | | | | | | | |
| Mar 2027 | | | | | | | | | |

Where each number comes from:

- **Reviews**: the profile itself. Write down count and rating.
- **Citations live**: count of rows in `citations-tracker.csv` with a live URL.
- **Referring domains**: Bing Webmaster Tools (free, unlocked by the Bing Places listing) or the developer's
  DataForSEO pull. Domains, not links.
- **GBP link clicks**: Search Console → Performance → filter Page **contains** `utm_campaign=gbp`. That catches the
  website link (`gbp`), the posts (`gbp-post`) and the appointment link (`gbp-appointment`) together; use
  "equals" on the full URL to see the website link alone. Expect a 2–3 day reporting lag.
- **Calls and leads**: GA4 events by landing page. Phone calls made by *reading* the number, rather than tapping
  it, are invisible to every analytics tool — the profile's own "calls" figure is the nearest thing.
- **Organic clicks**: the `sc-domain:` Search Console property, 28 days, date dimension (query-level totals hide
  35–65% of clicks as anonymised — never compare one dimension's total against another's).

Developer commands (run from the repo on the first working day of the month, and paste the two summaries into the
row):

```
npm run seo:report -- --label YYYY-MM-DD
npm run seo:ga4
```

(If those scripts are not wired up on the branch being used, the equivalent is the Search Console / GA4 scripts
described in `on-page-seo.md` §0.)

Seasonality reminder: September is the annual peak for repairs in Perth, there is a bump in March, and
December–January dips. Judge each month against the same month last year or against this table, not against the
month before.
