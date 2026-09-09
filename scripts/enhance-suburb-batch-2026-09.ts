/**
 * 2026-09-09 batch enhancement of 10 DRAFT suburb pages before publishing
 * (idempotent; PRODUCTION default).
 *
 * Picks (GSC Domain property 90d to 2026-09-07 + DataForSEO AU volumes):
 *   Stirling (45 imp, "garage door repair stirling" @77; 10+10/mo), Malaga
 *   ("garage doors malaga" 30/mo, commercial), Willetton (20+10/mo, 3 imp @11),
 *   Osborne Park (14 imp installation @29; 10+10/mo), Parkwood (17 imp @11),
 *   Langford (11 imp @1), Lynwood (9 imp @13 + a LIVE Lynwood case study),
 *   High Wycombe (10+10/mo), Port Kennedy (10+10/mo), Kelmscott (Armadale anchor).
 *
 * What it fixes: the batch-2 builder rotated a shared FAQ pool, so drafts carry
 * FOREIGN-suburb questions ("How fast can you get to Maddington?" on Osborne Park,
 * "…Kingsley door" on Port Kennedy) and batch-3 pages carry duplicates. Per page:
 *  1. Drop FAQs that name a suburb other than the page's own/allowed neighbours,
 *     and exact-duplicate questions.
 *  2. seoTitle/seoDescription -> desired state (≤60 / ≤160, "Same-Day" + WA).
 *  3. Append one proof paragraph to data.localIntro (MARKER-guarded).
 *  4. Append 3 PAA-derived FAQs (cost / lifespan / most-common-problem family).
 *  5. Pin the standard guide-price rows if pricingRows is empty (+ commercial for
 *     Malaga / Osborne Park).
 *  6. Append RelatedPages links (cost guides, motors, same-suburb case study).
 *  7. --publish: POST /publish for each page still in Draft.
 *
 *   npx tsx scripts/enhance-suburb-batch-2026-09.ts            # enhance only
 *   npx tsx scripts/enhance-suburb-batch-2026-09.ts --publish  # enhance + publish
 * Afterwards: finalize-suburb-pages-batch2.ts, finalize-suburb-pages-batch3.ts,
 * add-suburb-price-pins.ts (all idempotent).
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const STANDARD_PINS = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Motor / opener replacement",
  "Door off track / stuck",
  "Service / tune-up",
  "Remote (extra / replacement)",
];
const COMMERCIAL_PIN = "Commercial roller door (service, from)";

const COST_LINKS = [
  { label: "Garage Door Repair Cost Guide", href: "/garage-door-repair-cost-perth" },
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
  { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
];

/** Every suburb name that appears in the rotated FAQ pools. A question naming one of
 *  these (other than the page's own suburb / allowed neighbours) is a foreign FAQ. */
const ALL_SUBURBS = [
  "Maddington", "Kingsley", "Huntingdale", "Malaga", "Kewdale", "Langford", "Ferndale", "Wilson",
  "Champion Lakes", "Roleystone", "Mandurah", "Bayswater", "Belmont", "Stirling", "Osborne Park",
  "High Wycombe", "Port Kennedy", "Riverton", "Duncraig", "Kalamunda", "Willetton", "Parkwood",
  "Lynwood", "Shelley", "Rossmoyne", "Kelmscott", "Camillo", "Seville Grove", "Brookdale",
  "Harrisdale", "Piara Waters", "Forrestdale", "Gosnells", "Thornlie", "Canning Vale",
  "Cockburn", "Success", "Atwell", "Padbury", "Clarkson", "Butler", "Dayton", "Midland",
];

interface Plan {
  slug: string;
  suburb: string;
  allowed: string[]; // neighbour names that may legitimately appear in FAQs
  title: string;
  description: string;
  marker: string;
  proof: string;
  faqs: { question: string; answer: string }[];
  commercial?: boolean;
  caseStudy?: { label: string; href: string };
}

const PLANS: Plan[] = [
  {
    slug: "garage-door-repairs-stirling",
    suburb: "Stirling",
    allowed: ["Balcatta", "Gwelup", "Tuart Hill", "Innaloo"],
    title: "Garage Door Repairs Stirling WA | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Stirling WA 6021 — springs, cables, motors & roller doors, prices agreed upfront. Also Balcatta, Gwelup, Tuart Hill & Innaloo.",
    marker: "Stirling WA 6021",
    proof:
      "This is Stirling WA 6021, the suburb between Karrinyup Road and the Mitchell Freeway, not the City of Stirling council area or the Stirling in South Australia. Most of the housing here dates from the 1970s through the 90s, which is exactly the age band where torsion springs run out of cycles, lift cables fray at the bottom brackets and first-generation openers lose their limits. We are in Balcatta, Gwelup and Innaloo most days, so a Stirling call slots into a route we already drive. Every job is priced from a published list — the common repairs are on the guide-price table below — and nothing is touched until you have agreed the number.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Stirling?",
        answer:
          "It depends on the fault, which is why the guide-price table on this page lists each common repair separately — a single spring, a pair, a cable, an opener repair or replacement, a door off its track and a service. Those are the same prices for every suburb in the City of Stirling, and the technician confirms the exact figure on the driveway before starting. Our repair cost guide explains what pushes a job toward the top or bottom of each range.",
      },
      {
        question: "What is the most common garage door problem in Stirling homes?",
        answer:
          "Broken torsion springs, by a wide margin. A spring is rated for a set number of cycles and the 1980s and 90s doors that dominate Stirling, Balcatta and Tuart Hill are simply reaching that limit. The warning signs are a door that feels heavy to lift by hand, an opener that strains or stops part-way, and a loud bang from the garage. Worn cables and tired openers come next, and they are usually caught during a routine service before they fail.",
      },
      {
        question: "How often should a garage door be serviced?",
        answer:
          "Once a year for a family door that cycles several times a day, and every eighteen months to two years for a door that is used less. A service covers spring tension and balance, track alignment, hardware, lubrication, opener travel limits and the safety-reverse test. On an older Stirling door it is the cheapest way to find a fraying cable or a fatigued spring before it strands the car inside.",
      },
    ],
  },
  {
    slug: "garage-door-repairs-malaga",
    suburb: "Malaga",
    allowed: ["Ballajura", "Beechboro", "Noranda"],
    title: "Garage Door & Roller Shutter Repairs Malaga | Same-Day",
    description:
      "Same-day commercial roller door & shutter repairs across the Malaga industrial area, plus home garage door repairs in Ballajura & Beechboro. Upfront prices.",
    marker: "Malaga WA 6090",
    proof:
      "Malaga WA 6090 is one of the busiest industrial estates in Perth, and its doors work harder than almost any we see — high-cycle roller shutters on workshops and showrooms, wide three-phase rollers on warehouses, and dust and forklift knocks on all of them. We repair and service those commercial doors across the whole estate, and we look after the homes of Ballajura, Beechboro and Noranda on the same runs. Commercial and residential work is priced from the same published list; the guide-price table below covers both, and a fixed figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does a commercial roller door repair cost in Malaga?",
        answer:
          "The commercial roller door and shutter row on the guide-price table is the starting point — it covers the common call-outs on an industrial door such as re-tensioning a curtain, replacing worn springs or a barrel, straightening bent guides and getting a motor running again. Larger doors and three-phase motors are quoted on site, always before work starts, and we can supply a written quote for a landlord or facilities manager.",
      },
      {
        question: "Can you carry out roller shutter repairs in Malaga outside trading hours?",
        answer:
          "Yes. Most Malaga businesses cannot have a door down during the day, so we schedule commercial repairs early in the morning, after close or on Saturdays where that suits, and a genuine emergency — a shutter that will not secure the premises — is treated as a same-day call. Ask for a planned servicing arrangement if you would rather catch failures before they stop trading.",
      },
      {
        question: "What is the average lifespan of a commercial roller door motor?",
        answer:
          "A well-specified industrial motor should give ten years or more, but on a high-cycle Malaga door the real limit is usually duty rating rather than age. A motor asked to do more cycles a day than it was designed for runs hot, wears its brake and drive and fails early. When we replace one we match the motor to the door's actual daily cycles and weight, which is the difference between a five-year and a fifteen-year unit.",
      },
    ],
    commercial: true,
  },
  {
    slug: "garage-door-repairs-willetton",
    suburb: "Willetton",
    allowed: ["Bull Creek", "Leeming", "Rossmoyne", "Riverton"],
    title: "Garage Door Repairs Willetton | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Willetton WA 6155 — springs, cables, motors & sectional doors, prices agreed upfront. Also Bull Creek, Leeming & Rossmoyne.",
    marker: "Willetton WA 6155",
    proof:
      "Willetton WA 6155 is one of the biggest family suburbs south of the river, built out mainly through the 1970s and 80s, and a large share of its garages are on their original door or their first replacement. That means torsion springs at the end of their cycle life, cables wearing at the bottom brackets and openers that were fitted twenty years ago. We are working in Bull Creek, Leeming, Rossmoyne and Riverton most days, so a Willetton job slots into an existing route. Every repair is priced from a published list — the common jobs are on the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to fix a garage door in Willetton?",
        answer:
          "Each common repair is listed separately on the guide-price table on this page — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices across Willetton, Bull Creek and Leeming. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common problem with garage doors in Willetton?",
        answer:
          "Broken springs. The 1970s and 80s sectional and tilt doors that dominate Willetton have mostly reached the cycle limit of their original or first-replacement springs, so the classic call is a door that has suddenly become very heavy or an opener that strains and stops. Worn lift cables and tired openers are next, and both are usually caught during a routine service before they fail.",
      },
      {
        question: "What is the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years for a typical Willetton household. What shortens it is a door out of balance: weak springs leave the motor lifting weight it was never rated for, so it runs hot and wears out its drive early. We test the balance before quoting any opener, because a new motor on unbalanced springs just restarts the same clock.",
      },
    ],
  },
  {
    slug: "garage-door-repairs-osborne-park",
    suburb: "Osborne Park",
    allowed: ["Tuart Hill", "Woodlands", "Glendalough", "Herdsman"],
    title: "Garage & Roller Door Repairs Osborne Park | Same-Day",
    description:
      "Same-day garage door & commercial roller door repairs in Osborne Park WA — workshops, showrooms and the homes of Tuart Hill & Woodlands. Prices agreed upfront.",
    marker: "Osborne Park WA 6017",
    proof:
      "Osborne Park WA 6017 is two suburbs in one: the commercial strip along Scarborough Beach Road and Main Street — showrooms, workshops and warehouses with high-cycle roller doors and shutters — and the established homes of Tuart Hill, Woodlands and Glendalough behind it. We repair both. Commercial doors are booked around trading hours and residential calls are routed with the Stirling and Innaloo runs we already drive daily. Everything is priced from a published list; the guide-price table below covers the common home repairs and the commercial roller row, and a fixed figure is agreed before any work begins.",
    faqs: [
      {
        question: "Do you install new garage doors in Osborne Park?",
        answer:
          "Yes — supply and install of new sectional, roller and tilt doors, plus openers, for homes in Osborne Park, Tuart Hill and Woodlands, and commercial roller doors and shutters for the business strip. We measure on site, quote in writing and remove the old door. See our garage door installation page for the range and lead times.",
      },
      {
        question: "How much does a commercial roller door repair cost in Osborne Park?",
        answer:
          "The commercial roller door and shutter row on the guide-price table is the starting point for the common industrial call-outs — re-tensioning a curtain, replacing springs or a barrel, straightening bent guides or getting a motor running. Larger doors and three-phase motors are quoted on site before any work starts, with a written quote for a landlord or facilities manager where needed.",
      },
      {
        question: "What is the most common garage door problem in Osborne Park?",
        answer:
          "On the residential side it is broken torsion springs on the 1960s to 80s doors of Tuart Hill and Woodlands, which have simply reached their cycle limit. On the commercial side it is worn springs and guides on shutters that cycle dozens of times a day. Both are the kind of failure a routine service catches early, which is why we offer planned servicing for the business strip.",
      },
    ],
    commercial: true,
  },
  {
    slug: "garage-door-repairs-parkwood",
    suburb: "Parkwood",
    allowed: ["Lynwood", "Ferndale", "Riverton", "Langford", "Willetton"],
    title: "Garage Door Repairs Parkwood | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Parkwood WA 6147 — springs, cables, motors & older tilt doors, prices agreed upfront. Also Lynwood, Ferndale & Riverton.",
    marker: "Parkwood WA 6147",
    proof:
      "Parkwood WA 6147 sits between Metcalfe Road and the Canning River, and it is a suburb of original 1970s and 80s homes — many of them still on their first tilt or sectional door. That is the age band where torsion springs run out of cycles, lift cables fray and first-generation openers give up, so most of our Parkwood calls are honest repairs rather than replacements. We are in Lynwood, Ferndale and Riverton daily, which is why a Parkwood job is usually a same-day slot. Every repair is priced from a published list — see the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Parkwood?",
        answer:
          "The guide-price table on this page lists each common repair separately — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service. They are the same prices across Parkwood, Lynwood and Ferndale, and the technician confirms the exact figure at the door before starting. Our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common garage door problem in Parkwood?",
        answer:
          "Broken springs on original 1970s and 80s doors. The warning signs are a door that has become heavy to lift by hand, an opener that strains or stops part-way, and a loud bang from the garage. Worn lift cables and tired openers follow, and both are usually caught during a routine service before they fail.",
      },
      {
        question: "How often should a garage door be serviced?",
        answer:
          "Once a year for a door that cycles several times a day, and every eighteen months to two years for a lightly used one. A service covers spring tension and balance, track alignment, hardware, lubrication, opener limits and the safety-reverse test — on an older Parkwood door it is the cheapest way to find a fraying cable or a fatigued spring before it strands the car inside.",
      },
    ],
  },
  {
    slug: "garage-door-repairs-langford",
    suburb: "Langford",
    allowed: ["Lynwood", "Parkwood", "Ferndale", "Thornlie", "Cannington"],
    title: "Garage Door Repairs Langford | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Langford WA 6147 — springs, cables, motors & roller doors, upfront prices, landlord invoices supplied. Also Lynwood & Parkwood.",
    marker: "Langford WA 6147",
    proof:
      "Langford WA 6147 sits on the Nicholson Road corridor between Thornlie and Cannington, and it is a suburb of solid 1970s and 80s homes with a high share of rentals. That shapes the work: original doors at the end of their spring life, tenants who need the door working today, and property managers who need a written quote and a tax invoice. We are in Lynwood, Parkwood and Ferndale daily, so a Langford call is usually a same-day slot. Every repair is priced from a published list — see the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Langford?",
        answer:
          "Each common repair is listed separately on the guide-price table on this page — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices across Langford, Lynwood and Parkwood. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common garage door problem in Langford?",
        answer:
          "Broken torsion springs on 1970s and 80s doors that have reached their cycle limit, closely followed by tired openers on rental properties where the door has never been serviced. The tell-tale sign is a door that is suddenly heavy to lift or an opener that strains and stops. A routine service catches both before they fail.",
      },
      {
        question: "What is the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years for a typical Langford household. What shortens it is a door out of balance: weak springs leave the motor lifting weight it was never rated for, so it runs hot and wears out early. We test the balance before quoting any opener, because a new motor on unbalanced springs just restarts the same clock.",
      },
    ],
  },
  {
    slug: "garage-door-repairs-lynwood",
    suburb: "Lynwood",
    allowed: ["Langford", "Parkwood", "Ferndale", "Thornlie", "Cannington"],
    title: "Garage Door Repairs Lynwood | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Lynwood WA 6147 — springs, cables, motors & older tilt doors, prices agreed upfront. See our Lynwood motor replacement job.",
    marker: "Lynwood WA 6147",
    proof:
      "Lynwood WA 6147 is an established family suburb of 1970s and 80s homes off Metcalfe Road, and its doors are deep into the age where torsion springs run out of cycles, lift cables fray at the bottom brackets and original openers stop holding their limits. Our most recent Lynwood job was exactly that — a Steel-Line motor that had given up on an otherwise sound sectional door, replaced the same day and written up in the recent work below. We are in Langford, Parkwood and Ferndale daily, so a Lynwood call slots into a route we already drive. Every repair is priced from a published list — see the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Lynwood?",
        answer:
          "The guide-price table on this page lists each common repair separately — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices across Lynwood, Langford and Parkwood. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "Can you replace a Steel-Line garage door motor in Lynwood?",
        answer:
          "Yes — Steel-Line, B&D, Merlin, Gliderol, Centurion and most other brands. If the door itself is sound we usually fit a new opener to the existing door rather than replace the door, as we did on our recent Lynwood job. We test the spring balance first, because an opener fitted to an unbalanced door wears out early.",
      },
      {
        question: "How often should a garage door be serviced?",
        answer:
          "Once a year for a family door that cycles several times a day, and every eighteen months to two years for a lightly used one. A service covers spring tension and balance, track alignment, hardware, lubrication, opener limits and the safety-reverse test — on an older Lynwood door it is the cheapest way to catch a fraying cable or a tired spring before it fails.",
      },
    ],
    caseStudy: {
      label: "Recent job: Steel-Line motor replaced in Lynwood",
      href: "/case-studies/garage-door-repairs-lynwood-steel-line-motor-replacement-perth",
    },
  },
  {
    slug: "garage-door-repairs-high-wycombe",
    suburb: "High Wycombe",
    allowed: ["Forrestfield", "Maida Vale", "Wattle Grove", "Kalamunda"],
    title: "Garage Door Repairs High Wycombe | Same-Day Service",
    description:
      "Same-day garage door repairs in High Wycombe WA 6057 — springs, cables, motors & shed roller doors, upfront prices. Also Forrestfield, Maida Vale & Kalamunda.",
    marker: "High Wycombe WA 6057",
    proof:
      "High Wycombe WA 6057 sits at the foot of the Darling Scarp, and its bigger blocks mean more doors per property — a double garage on the house and a roller door on the shed behind it. The housing runs from 1970s originals to the newer estates toward Forrestfield, so we see everything from fatigued torsion springs and frayed cables on the older doors to opener faults on the newer ones. We are in Forrestfield, Maida Vale and Kalamunda most days, so a High Wycombe call slots into an existing route. Every repair is priced from a published list — see the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in High Wycombe?",
        answer:
          "Each common repair is listed separately on the guide-price table on this page — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices across High Wycombe, Forrestfield and Maida Vale. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common garage door problem in High Wycombe?",
        answer:
          "Broken springs on the older doors and, on the bigger blocks, shed roller doors that have dropped off their drum or bent a guide. Hills dust and the extra cycles of a two-door property shorten hardware life, so a door that has become heavy, noisy or crooked is worth a look before it fails completely.",
      },
      {
        question: "What is the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years for a typical High Wycombe household. What shortens it is a door out of balance: weak springs leave the motor lifting weight it was never rated for, so it runs hot and wears out early. We test the balance before quoting any opener, because a new motor on unbalanced springs just restarts the same clock.",
      },
    ],
  },
  {
    slug: "garage-door-repairs-port-kennedy",
    suburb: "Port Kennedy",
    allowed: ["Warnbro", "Secret Harbour", "Golden Bay", "Rockingham", "Baldivis"],
    title: "Garage Door Repairs Port Kennedy | Same-Day Coastal Service",
    description:
      "Same-day garage door repairs in Port Kennedy WA 6172 — rusted springs, cables, motors & coastal wear, upfront prices. Also Warnbro, Secret Harbour & Golden Bay.",
    marker: "Port Kennedy WA 6172",
    proof:
      "Port Kennedy WA 6172 is a coastal suburb, and salt air is the story of every door here: springs pit and snap years earlier than they would inland, cables corrode at the bottom brackets and steel tracks rust through at the base. Most of the housing went up in the 1990s and 2000s, so those doors are now reaching that shortened life. We are working in Warnbro, Secret Harbour and Baldivis most days — see the recent Secret Harbour door-off-track job below — so a Port Kennedy call slots into an existing route. Every repair is priced from a published list, the common jobs are on the guide-price table below, and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Port Kennedy?",
        answer:
          "Each common repair is listed separately on the guide-price table on this page — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices along the coast from Rockingham to Golden Bay. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common garage door problem in Port Kennedy?",
        answer:
          "Rusted springs that snap. Salt air pits the spring steel, and a 1990s or 2000s coastal door can lose its springs in half the cycles an inland door would. Corroded cables and rusted bottom tracks are next. Galvanised or coated replacement springs and an annual service with a corrosion check are the two things that make the biggest difference.",
      },
      {
        question: "How often should a coastal garage door be serviced?",
        answer:
          "Annually, without fail, in Port Kennedy and the other beach suburbs. A service covers spring tension and balance, track alignment, hardware, lubrication, opener limits and the safety-reverse test, and on the coast it includes a corrosion check of springs, cables and track bases so a rusting part is replaced before it fails with the car inside.",
      },
    ],
    caseStudy: {
      label: "Recent job: door off its track in Secret Harbour",
      href: "/case-studies/garage-door-repairs-secret-harbour-door-off-track-perth",
    },
  },
  {
    slug: "garage-door-repairs-kelmscott",
    suburb: "Kelmscott",
    allowed: ["Camillo", "Seville Grove", "Roleystone", "Champion Lakes", "Armadale"],
    title: "Garage Door Repairs Kelmscott | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Kelmscott WA 6111 — rusted springs, cables, motors & older doors, upfront prices. Also Camillo, Seville Grove & Roleystone.",
    marker: "Kelmscott WA 6111",
    proof:
      "Kelmscott WA 6111 runs from the Albany Highway strip up into the hills toward Roleystone, and its doors face two problems at once: hills-fringe damp and shade that rusts springs and tracks even this far from the coast, and a housing mix that spans 1960s originals to newer subdivisions on the flats. We are in Camillo, Seville Grove and Armadale daily, so a Kelmscott call slots into a route we already drive. Every repair is priced from a published list — see the guide-price table below — and the figure is agreed before any work starts.",
    faqs: [
      {
        question: "How much does it cost to repair a garage door in Kelmscott?",
        answer:
          "Each common repair is listed separately on the guide-price table on this page — a single spring, a pair, a snapped cable, an opener repair or replacement, a door off its track and a service — and those are the same prices across Kelmscott, Camillo and Seville Grove. The technician confirms the exact figure at the door before starting, and our repair cost guide explains what moves a job within its range.",
      },
      {
        question: "What is the most common garage door problem in Kelmscott?",
        answer:
          "Broken torsion springs, with rust as the accelerator: the damp, shaded garages on the hills side of Kelmscott pit spring steel and corrode cables well before their rated cycle life. The signs are a door that is suddenly heavy, an opener that strains and stops, or a bang from the garage. A routine service with a corrosion check catches most of these before they fail.",
      },
      {
        question: "What is the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years for a typical Kelmscott household. What shortens it is a door out of balance: weak or rusted springs leave the motor lifting weight it was never rated for, so it runs hot and wears out early. We test the balance before quoting any opener, because a new motor on unbalanced springs just restarts the same clock.",
      },
    ],
  },
];

interface AdminPage {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { id: number; question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: { id: number; targetPageId: number | null; staticHref: string | null; labelOverride: string | null; linkGroup: string; sortOrder: number }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

function resolveAdminPassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = readFileSync(CMS_APPSETTINGS_PROD, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}

let token = "";
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
}
async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: resolveAdminPassword() }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
  token = ((await res.json()) as { token: string }).token;
}

function toUpdateBody(page: AdminPage) {
  return {
    id: page.id, templateType: page.templateType, slug: page.slug, title: page.title,
    seoTitle: page.seoTitle, seoDescription: page.seoDescription, noIndex: page.noIndex, status: page.status,
    heroImageAssetId: page.heroImageAssetId, socialImageAssetId: page.socialImageAssetId, data: page.data,
    faqs: page.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i, faqItemId: f.faqItemId })),
    relatedLinks: page.relatedLinks.map((l) => ({ targetPageId: l.targetPageId, staticHref: l.staticHref, labelOverride: l.labelOverride, linkGroup: l.linkGroup, sortOrder: l.sortOrder })),
    pricingRows: page.pricingRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

function foreignSuburb(question: string, plan: Plan): string | null {
  for (const s of ALL_SUBURBS) {
    if (s === plan.suburb || plan.allowed.includes(s)) continue;
    if (new RegExp(`\\b${s}\\b`, "i").test(question)) return s;
  }
  return null;
}

async function main() {
  const publish = process.argv.includes("--publish");
  for (const p of PLANS) {
    if (p.title.length > 60) throw new Error(`${p.slug}: title ${p.title.length} chars`);
    if (p.description.length > 160) throw new Error(`${p.slug}: description ${p.description.length} chars`);
    if (!p.proof.includes(p.marker)) throw new Error(`${p.slug}: proof lacks marker`);
    if (/\$\s?\d/.test(JSON.stringify(p))) throw new Error(`${p.slug}: copy contains a dollar figure`);
  }
  console.log(`Suburb batch enhancement (${PLANS.length} pages) → ${CMS_API_URL}${publish ? " + PUBLISH" : ""}`);
  await login();

  const list = await api<{ items: { id: number; slug: string; routeGroup: string; status: string }[] }>("/api/admin/pages?pageSize=500");
  const pricingBody = await api<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>("/api/admin/pricing-items?pageSize=200");
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((x) => [x.scenario, x.id]));

  for (const plan of PLANS) {
    const ref = list.items.find((x) => x.routeGroup === "Flat" && x.slug === plan.slug);
    if (!ref) { console.error(`  ! ${plan.slug} not found`); continue; }
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const notes: string[] = [];

    // 1. drop foreign-suburb + duplicate FAQs
    const seen = new Set<string>();
    const kept = page.faqs.filter((f) => {
      const key = f.question.trim().toLowerCase();
      const foreign = foreignSuburb(f.question, plan);
      if (foreign) { notes.push(`dropped foreign FAQ (${foreign}): ${f.question}`); return false; }
      if (seen.has(key)) { notes.push(`dropped duplicate FAQ: ${f.question}`); return false; }
      seen.add(key);
      return true;
    });
    page.faqs = kept;

    // 2. seo
    if (page.seoTitle !== plan.title) { page.seoTitle = plan.title; notes.push("seoTitle"); }
    if (page.seoDescription !== plan.description) { page.seoDescription = plan.description; notes.push("seoDescription"); }

    // 3. proof paragraph
    const intro = Array.isArray(page.data.localIntro) ? (page.data.localIntro as string[]) : [];
    if (!intro.some((x) => x.includes(plan.marker))) { page.data.localIntro = [...intro, plan.proof]; notes.push("localIntro += proof"); }

    // 4. new FAQs
    for (const f of plan.faqs) {
      const key = f.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      page.faqs.push({ id: 0, question: f.question, answer: f.answer, sortOrder: page.faqs.length, faqItemId: null });
      notes.push(`faq: ${f.question}`);
    }

    // 5. pins
    if (page.pricingRows.length === 0) {
      const pins = plan.commercial ? [...STANDARD_PINS, COMMERCIAL_PIN] : STANDARD_PINS;
      for (const scenario of pins) {
        const id = byScenario.get(scenario);
        if (!id) { console.warn(`  ! scenario missing: "${scenario}"`); continue; }
        page.pricingRows.push({ pricingItemId: id, sortOrder: page.pricingRows.length, noteOverride: null });
      }
      notes.push(`pinned ${page.pricingRows.length} price rows`);
    } else if (plan.commercial && !page.pricingRows.some((r) => r.pricingItemId === byScenario.get(COMMERCIAL_PIN))) {
      const id = byScenario.get(COMMERCIAL_PIN);
      if (id) { page.pricingRows.push({ pricingItemId: id, sortOrder: page.pricingRows.length, noteOverride: null }); notes.push("pinned commercial row"); }
    }

    // 6. related links
    let linkSort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
    for (const l of [...COST_LINKS, ...(plan.caseStudy ? [plan.caseStudy] : [])]) {
      if (page.relatedLinks.some((x) => x.staticHref === l.href)) continue;
      page.relatedLinks.push({ id: 0, targetPageId: null, staticHref: l.href, labelOverride: l.label, linkGroup: "RelatedPages", sortOrder: linkSort++ });
      notes.push(`related: ${l.href}`);
    }

    if (notes.length) {
      await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
      console.log(`  ✓ ${plan.slug} [${page.status}] — ${page.faqs.length} FAQs\n    - ${notes.join("\n    - ")}`);
    } else {
      console.log(`  = ${plan.slug} already at desired state`);
    }

    if (publish && page.status !== "Published") {
      const pub = await api<{ status: string }>(`/api/admin/pages/${page.id}/publish`, { method: "POST" });
      console.log(`  ★ published ${plan.slug} → ${pub.status}`);
    }
  }
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
