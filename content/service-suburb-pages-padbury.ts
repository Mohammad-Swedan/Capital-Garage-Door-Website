import type { ServiceSuburbPage } from "@/types";

/**
 * Padbury (2026-08-19) — northern-suburbs page built to own a weak SERP and a
 * term the homepage is already drawing for. Created in the CMS as a DRAFT by
 * scripts/import-padbury-page.ts (which pins the guide-price table), then
 * published + wired in (Phase B) by the same script.
 *
 * Research behind the copy (GSC Domain property 90d + DataForSEO live Perth
 * SERP, 2026-08-19):
 *  - "garage door repairs padbury" = 71–73 impressions @ pos ~31, ALL landing on
 *    the homepage — no page or case study of ours targeted Padbury. Neighbours:
 *    kingsley 53 imp (page live), woodvale 19, hillarys/duncraig/craigie
 *    sporadic — the Whitfords corridor is a real demand pocket.
 *  - Live SERP is weak: Eden Roc's "212 jobs completed" location page is #1,
 *    then hipages, NWSM and A1 location pages, and irrelevant Bunbury / Vic Park
 *    pages at #8–9. The local pack is Balcatta/Sorrento operators. A real-photo,
 *    real-job page competes on content.
 *  - Related searches: "Residential garage door repairs padbury", "Garage door
 *    repairs padbury prices", "Best garage door repairs padbury". PAA: service
 *    cost in Perth, "is it worth repairing a garage door", up-and-over repair
 *    cost, motor replacement cost in Australia.
 *
 * Angle: Padbury is 1970s–80s brick-and-tile Whitfords-corridor stock, largely
 * built with steel roller doors on carports and single garages — 40+ years on,
 * guide tracks and lintels rust out (exactly the real Padbury job on this page),
 * first-generation openers fail, and infill/renovated homes bring newer
 * sectional doors into the mix. Two kilometres from the coast, so salt air is a
 * factor without being the whole story.
 *
 * NOTE: no dollar figures anywhere — visible prices come only from the CMS
 * pricing catalog (the importer pins the standard 8-scenario table).
 */
export const padburyPage: ServiceSuburbPage = {
  slug: "garage-door-repairs-padbury",
  service: "Garage Door Repairs",
  suburb: "Padbury",
  region: "Perth, WA",

  // Kingsley, Joondalup, Wanneroo and Scarborough are live pages; the rest
  // point at the service-areas index until they get their own pages.
  nearbySuburbs: [
    { label: "Hillarys", href: "/service-areas" },
    { label: "Craigie", href: "/service-areas" },
    { label: "Kallaroo", href: "/service-areas" },
    { label: "Mullaloo", href: "/service-areas" },
    { label: "Duncraig", href: "/service-areas" },
    { label: "Woodvale", href: "/service-areas" },
    { label: "Kingsley", href: "/garage-door-repairs-kingsley" },
    { label: "Joondalup", href: "/garage-door-repairs-joondalup" },
    { label: "Wanneroo", href: "/garage-door-repairs-wanneroo" },
    { label: "Scarborough", href: "/garage-door-repairs-scarborough" },
  ],

  hero: {
    subtitle:
      "Same-day garage door repairs across Padbury and the Whitfords corridor — rusted roller door tracks, snapped springs, tired openers and off-track sectional doors fixed in one visit, with the price agreed before we start.",
    trustBadges: [
      "Local Perth Team",
      "Same-Day Response",
      "All Major Brands",
      "Warranty Support",
    ],
  },

  directAnswer:
    "Capital Garage Doors provides same-day residential garage door repairs in Padbury — roller door tracks, springs and cables, motors and openers, remotes and sensors, noisy or off-track doors — plus servicing, roller-to-sectional upgrades and the supply and installation of new garage doors.",

  localIntro: [
    "Padbury was built out through the 1970s and 80s, and most of its brick-and-tile homes were fitted with steel roller doors on carports and single garages. Forty-odd years on, those doors are still going — but the parts around them aren't. Rusted guide tracks, corroded lintels and curtains that scrape and bind on one side are the most common calls we take in the suburb, along with first-generation openers that have simply reached the end of their working life.",
    "The job that typifies Padbury for us is the one on this page: an older double-brick carport where the original roller door guides had rusted through where they meet the brick piers, so the curtain no longer ran true and was chewing its own edges. New galvanised guide tracks fitted plumb to the piers, the curtain re-hung and re-tensioned, and the customer kept their door and opener — a track replacement at a fraction of the cost of a new door. That's the honest answer to most Padbury roller door problems: the curtain is usually sound, it's the steel around it that's gone.",
    "It isn't all 1980s roller doors. Padbury has been steadily renovated and infilled — rear-strata homes around Padbury Shopping Centre and the Whitfords Avenue side, extensions that turned carports into garages — so there's a growing stock of sectional doors with openers, remotes and safety sensors, and those bring the modern faults: snapped torsion springs on busy family doors, frayed lift cables, doors that stop half-way, and remotes that have lost their programming.",
    "Being a couple of kilometres from Hillarys and the coast matters too. Salt air reaches Padbury on the sea breeze and quietly shortens the life of springs, cables, bottom brackets and roller stems — not as aggressively as on the beachfront, but enough that an annual service pays for itself by catching a corroding cable before it snaps and jams the door.",
    "Same-day calls cover Padbury, Hillarys, Craigie, Kallaroo, Mullaloo, Duncraig, Woodvale and Kingsley, with Joondalup and Wanneroo both on our daily northern run, and the van carries parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA, Chamberlain, Superlift and Grifco openers. Not sure what you've got? Send a photo with your quote request and we'll identify it and bring the right parts first visit.",
  ],

  availableServices: [
    {
      title: "Roller Door Repairs",
      description:
        "Rusted guide tracks replaced, curtains re-hung and re-tensioned, drums and springs serviced — the Padbury specialty, usually without replacing the door.",
      icon: "Disc3",
    },
    {
      title: "Garage Door Repairs",
      description:
        "Diagnosis and repair for sectional and roller doors that won't open, close or run smoothly — same-day across Padbury and the Whitfords corridor.",
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Replacement",
      description:
        "Snapped torsion springs and frayed lift cables replaced in matched pairs and the door rebalanced — the classic first failure on a hard-working family door.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Repairs",
      description:
        "First-generation openers repaired or replaced with quiet modern units — remotes, keypads and safety sensors programmed and tested on the day.",
      icon: "Cpu",
    },
    {
      title: "Servicing & Tune-Ups",
      description:
        "Annual service for older doors: tension checked, guides and tracks aligned, hardware tightened, corrosion caught early, opener limits and safety reverse set.",
      icon: "Settings",
    },
    {
      title: "Roller-to-Sectional Upgrades & New Doors",
      description:
        "Replacing a tired roller door with an insulated sectional, or a new door for a renovated garage — supplied and installed after a free on-site measure.",
      icon: "Building2",
    },
    {
      title: "Emergency Repairs",
      description:
        "Door stuck open with the house exposed, or shut with the car inside? Priority response across Padbury and the northern suburbs.",
      icon: "Siren",
    },
  ],

  problems: [
    {
      title: "Roller door scraping or jamming on one side",
      description:
        "Almost always worn or rusted guide tracks, a curtain shifted on the drum, or a corroded lintel letting the assembly sag — new galvanised guides fix it without a new door.",
      icon: "Disc3",
    },
    {
      title: "Door suddenly feels heavy",
      description:
        "The tell-tale broken-spring symptom. Don't force it or run the opener — springs are replaced as a matched pair and the door rebalanced the same day.",
      icon: "Scale",
    },
    {
      title: "Opener strains, stalls or stops half-way",
      description:
        "An older opener losing its drive, or a door out of balance making it work too hard. We rebalance the door first — then repair or replace the unit.",
      icon: "Cpu",
    },
    {
      title: "Door won't open or close",
      description:
        "A snapped spring or cable, a tripped safety sensor or a failed opener — we find the real cause and get you moving the same day.",
      icon: "DoorClosed",
    },
    {
      title: "Remote not working",
      description:
        "Flat batteries, lost programming or a receiver board on the way out — we re-pair, repair or replace on the spot.",
      icon: "BatteryWarning",
    },
    {
      title: "Grinding, banging or squealing",
      description:
        "Dry rollers, rusted guides, loose hardware or tracks knocked out of line — a service usually returns an older door to quiet, smooth travel.",
      icon: "Volume2",
    },
  ],

  costGuidance: {
    intro:
      "Garage door repair costs in Padbury depend on what's actually failed, the parts your door needs and whether it's an after-hours emergency. You'll get a clear, fixed quote before any work starts — the guide prices below show where the common repairs typically land.",
    factors: [
      "The fault — re-pairing a remote is a very different job to replacing guide tracks or springs",
      "Parts required and their quality (genuine vs aftermarket components)",
      "Door type and size — single vs double, roller vs sectional",
      "Opener — a quick repair on a sound unit vs replacing a first-generation opener",
      "Urgency — standard booking vs after-hours emergency call-out",
      "Whether a repair still adds up, or a new door is the smarter long-term spend",
    ],
    note: "Describe the fault (or send a photo) with your quote request and we'll confirm an exact price before we arrive.",
  },

  whyChooseUs: [
    {
      title: "On the northern run daily",
      description:
        "Padbury sits between our Kingsley, Joondalup and Wanneroo work — we're already on Whitfords Avenue and the Mitchell Freeway, not dispatched from across Perth.",
      icon: "MapPin",
    },
    {
      title: "Same-day response",
      description:
        "Most Padbury repairs are booked and completed the same day, with emergency call-outs pushed to the front of the queue.",
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description:
        "The price is agreed before we start — no vague estimates and no surprise extras on the invoice.",
      icon: "FileText",
    },
    {
      title: "Older-door specialists",
      description:
        "We know 1970s–80s roller doors and first-generation openers inside out — what rusts first, what's worth saving, and when a new door genuinely makes sense.",
      icon: "BadgeCheck",
    },
    {
      title: "One-visit repairs",
      description:
        "Vans stocked with guide tracks, springs, cables, brackets and openers for every major brand, so you're not waiting days for a second visit.",
      icon: "Wrench",
    },
    {
      title: "Warranty support",
      description:
        "Workmanship and parts backed by warranty, with real people to call if anything needs a second look.",
      icon: "ShieldCheck",
    },
  ],

  relatedPages: [
    { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
    { label: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" },
    { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
    { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
    { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Roller Doors Perth", href: "/roller-doors-perth" },
    { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
  ],

  faqs: [
    {
      question: "Do you repair garage doors in Padbury?",
      answer:
        "Yes — Padbury is on our daily northern run between Kingsley, Joondalup and Wanneroo. We repair roller and sectional doors across the suburb every week: rusted roller door tracks, broken springs and cables, faulty motors and openers, remote and sensor problems, noisy operation and doors that won't open or close. Same-day and emergency repairs are both available.",
    },
    {
      question: "How much does garage door repair cost in Padbury?",
      answer:
        "It depends on the fault, the parts needed, your door type and whether it's an after-hours call-out. The guide-price table on this page shows where the common repairs typically land, and you always get a fixed quote before work starts — describe the problem or send a photo with your quote request and we'll confirm the price up front.",
    },
    {
      question: "Is it worth repairing an old roller door, or should I replace it?",
      answer:
        "Usually worth repairing. If the curtain is straight and not split or badly corroded, new guide tracks, a re-tension or a new opener restores smooth travel at a fraction of the cost of a new door — exactly what we did on the Padbury carport featured on this page. We only recommend a new door when the curtain itself is bent, split or rusted through, and we'll tell you honestly which side of that line your door sits on.",
    },
    {
      question: "Why does my roller door scrape or jam on one side?",
      answer:
        "On Padbury's older doors it's almost always the guide tracks: they rust where they meet the brick piers, the curtain no longer runs true and it binds and chews its edges. A curtain that has shifted on the drum or a corroded lintel letting the whole assembly sag does the same. A service visit identifies which it is before any parts are ordered; new galvanised guides are fitted the same day.",
    },
    {
      question: "Can you come out the same day in Padbury?",
      answer:
        "Usually, yes. We drive Whitfords Avenue and the Mitchell Freeway daily for our Kingsley, Joondalup and Wanneroo work, so Padbury bookings slot into a route we're already on. If your door is stuck open and the house isn't secure, or stuck shut with the car trapped, say so when you call — those are emergency call-outs and they're prioritised.",
    },
    {
      question: "How much does a garage door service cost in Padbury?",
      answer:
        "A standard service is one of the guide-price rows on this page, and it's the same price across the northern suburbs. It covers spring tension and balance, guide and track alignment, hardware tightening, lubrication, opener limits and safety reverse — and on Padbury's older doors it's where we catch a corroding cable or a rusting track before it fails. Our garage door service cost guide explains what's included.",
    },
    {
      question: "Does the coastal air affect garage doors in Padbury?",
      answer:
        "Yes, though less than on the beachfront. Padbury is a couple of kilometres inland from Hillarys, and the sea breeze carries enough salt to corrode springs, cables, bottom brackets, roller stems and roller door guides faster than in the eastern suburbs. An annual service and a light lubricant on the running edges slow it right down.",
    },
    {
      question: "My garage door opener has died — repair or replace?",
      answer:
        "If it's a mid-life unit with a simple fault — a capacitor, gear, limit switch or remote — we repair it. If it's a first-generation opener from the 80s or 90s with a failed board or drive, parts are scarce and a new opener with a full warranty, quieter operation and rolling-code remotes is better value. We test the door's balance first either way, because an out-of-balance door is what kills openers early. Our motor replacement cost guide lists the ranges.",
    },
    {
      question: "Which garage door brands do you repair in Padbury?",
      answer:
        "All the major Australian makes — B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus openers and motors from Merlin, ATA, Chamberlain, Superlift, Grifco and the older Guardian and Glidermatic units still common in the suburb. If you're not sure what's on your door, send a photo with your quote request and we'll identify it and bring the right parts first visit.",
    },
    {
      question: "Can you replace my old roller door with a sectional door?",
      answer:
        "Yes — roller-to-sectional upgrades are a common Padbury job, especially on renovated homes and converted carports. A sectional door gives you an insulated panel, a quieter opener and a modern look, and it starts with a free on-site measure and a fixed quote. We remove and dispose of the old roller door and guides as part of the install.",
    },
    {
      question: "What's the most common garage door problem in Padbury?",
      answer:
        "Roller door guide tracks and lintels rusting out, followed by snapped springs and tired openers. Padbury's doors are largely 40-year-old steel roller doors, so instead of the builder-grade opener faults we see in new estates, it's corrosion in the steel around the curtain and first-generation hardware reaching the end of its life. All of them are routine same-day repairs for us.",
    },
  ],

  // The real Padbury job first, then completed jobs from the surrounding
  // northern corridor.
  caseStudySlugs: [
    "garage-door-repairs-padbury-roller-door-tracks-perth",
    "broken-garage-door-spring-replacement-duncraig-perth",
    "roller-door-repair-wanneroo-perth",
  ],

  seo: {
    title: "Garage Door Repairs Padbury | Same-Day Roller & Sectional",
    description:
      "Same-day residential garage door repairs in Padbury — roller door tracks, springs, openers & remotes, prices agreed upfront. Also Hillarys, Craigie & Kingsley.",
  },
};
