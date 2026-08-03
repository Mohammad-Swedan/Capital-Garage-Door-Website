import type { ServiceSuburbPage } from "@/types";

/**
 * Atwell (2026-08-04) — built from the Cockburn-cluster research pass to win
 * the cluster's biggest uncaptured term. Created in the CMS as a DRAFT by
 * scripts/import-atwell-page.ts (which also pins the guide-price table).
 *
 * Research behind the copy (GSC 90d + live Perth SERPs, 2026-08-04):
 *  - "garage door repairs atwell" 45 impressions at position 29.7 landing on
 *    the HOMEPAGE — the largest uncaptured micro-term in the Cockburn cluster.
 *  - "garage door installation atwell" 19 impressions at position 7.9 (also
 *    homepage) — a SECOND intent this page serves with a dedicated
 *    supply-and-install section + FAQ, phrased with the related-search terms
 *    ("Residential garage door installation atwell", "Garage door supply and
 *    install", "Garage door motor replacement Perth").
 *  - Repairs SERP: the Cockburn EMD ranks #1 via an off-topic /cockburn page;
 *    the only dedicated Atwell pages are CJ's (.php, thin), Eden Roc
 *    (template, "132 jobs"), Jim's (template) and a fake-review directory
 *    page. Installation SERP is weaker still — hipages (a directory) is #1.
 *    No competitor combines local depth + FAQs + real photos + prices.
 *
 * Angle that differentiates the copy: Atwell built out from the mid-1990s
 * through the 2000s (incl. the newer Harvest Lakes estate), so its
 * first-generation doors and openers are 20+ years old and aging out — which
 * honestly motivates BOTH intents: repairs (springs/cables/motors at
 * end-of-life) and replacement/installation where repair no longer pays.
 *
 * NOTE: no dollar figures anywhere — visible prices come only from the CMS
 * pricing catalog (the importer pins the standard 8-scenario table).
 */
export const atwellPage: ServiceSuburbPage = {
  slug: "garage-door-repairs-atwell",
  service: "Garage Door Repairs",
  suburb: "Atwell",
  region: "Perth, WA",

  // Success, Cockburn Central and Canning Vale are live pages; the rest point
  // at the service-areas index until they get their own pages.
  nearbySuburbs: [
    { label: "Success", href: "/garage-door-repairs-success" },
    { label: "Cockburn Central", href: "/garage-door-repairs-cockburn-central" },
    { label: "Aubin Grove", href: "/service-areas" },
    { label: "Hammond Park", href: "/service-areas" },
    { label: "Beeliar", href: "/service-areas" },
    { label: "Yangebup", href: "/service-areas" },
    { label: "Jandakot", href: "/service-areas" },
    { label: "Banjup", href: "/service-areas" },
    { label: "Treeby", href: "/service-areas" },
    { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
  ],

  hero: {
    subtitle:
      "Same-day garage door repairs across Atwell and Harvest Lakes — broken springs, snapped cables, dead motors and off-track doors fixed in one visit, plus new doors supplied and installed when a repair no longer makes sense.",
    trustBadges: [
      "Local Perth Team",
      "Same-Day Response",
      "Repairs & New Doors",
      "Warranty Support",
    ],
  },

  directAnswer:
    "Capital Garage Doors provides same-day garage door repairs in Atwell — broken springs and cables, faulty motors and openers, remotes and sensors, noisy or off-track doors — plus the supply and installation of new sectional and roller doors when an old door is past economical repair.",

  localIntro: [
    "Atwell grew up fast — most of the suburb was built between the mid-1990s and the 2000s, with the Harvest Lakes estate filling in the newer streets. That timing matters for garage doors: the first-generation double sectionals installed during the build-out are now well past twenty years old, and we're seeing their original springs, cables and openers reach the end of their working life across the suburb, often one street after another.",
    "Add the daily workload and it's no surprise Atwell keeps us busy. Between the school runs to Atwell College, Atwell Primary and Harmony Primary, the dash to the Aubin Grove station car park and the freeway commute, a family garage door here can cycle four or more times a day — exactly the duty that wears out torsion springs and burns out motors. We run this corridor daily via Beeliar Drive, Lydon Boulevard and Russell Road, so an Atwell call-out slots into a route we're already driving, and same-day repair is the norm rather than a stretch.",
    "The faults we repair most in Atwell follow the age of the doors: springs that snap without warning and leave the door impossibly heavy, stretched lift cables that fray or jump the drum, first-generation openers that strain, stall or ignore the remote, and rollers or tracks that have worn to the point the door grinds and shudders. All of these are standard same-day repairs — we arrive stocked for them, replace springs in matched pairs and rebalance the door so the fix lasts.",
    "When a door genuinely is past saving — rusted panels, a twisted frame, or repair bills that keep coming — we'll tell you straight and quote a replacement instead. We supply and install new sectional and roller garage doors across Atwell, from like-for-like swaps on original-spec doors through to insulated panels and quiet, Wi-Fi-connected openers that suit the newer Harvest Lakes homes. Every residential garage door installation starts with a free on-site measure, and we never push a new door where a repair will honestly do the job.",
    "Whatever is on your door today, we carry parts for the major Australian brands — B&D, Steel-Line, Centurion, Gliderol and Dominator — plus Merlin, ATA, Chamberlain and Grifco openers, so most Atwell repairs are diagnosed and finished in a single visit. Not sure what you've got? Send a photo with your quote request and we'll identify it before we arrive.",
  ],

  availableServices: [
    {
      title: "Garage Door Repairs",
      description:
        "Diagnosis and repair for sectional, roller and tilt doors that won't open, close or run smoothly — Atwell's most common call-out.",
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Replacement",
      description:
        "Broken torsion springs and frayed lift cables replaced in matched pairs and rebalanced — the classic failure on Atwell's original estate doors.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Repairs",
      description:
        "First-generation openers repaired or upgraded to modern quiet, smart Wi-Fi units — including remotes, keypads and safety sensors.",
      icon: "Cpu",
    },
    {
      title: "New Door Supply & Install",
      description:
        "New sectional and roller doors supplied and installed after a free on-site measure — when repairing the old door no longer adds up.",
      icon: "Building2",
    },
    {
      title: "Roller Door Repairs",
      description:
        "Realign, re-spring and service roller doors that stick, jam or have lost curtain tension.",
      icon: "Disc3",
    },
    {
      title: "Emergency Repairs",
      description:
        "Door stuck open with the house exposed, or shut with the car inside? Priority response across Atwell and Harvest Lakes.",
      icon: "Siren",
    },
    {
      title: "Servicing & Maintenance",
      description:
        "Annual tune-ups that keep an ageing door quiet, balanced and safe — and catch worn parts before they strand you.",
      icon: "Settings",
    },
  ],

  problems: [
    {
      title: "Door won't open",
      description:
        "Usually a snapped spring, a failed cable or a dead opener — we find the real cause and get you moving the same day.",
      icon: "DoorClosed",
    },
    {
      title: "Door suddenly feels heavy",
      description:
        "The tell-tale broken-spring symptom on Atwell's double doors. Don't force it — the opener fails next. Springs are replaced in pairs.",
      icon: "Scale",
    },
    {
      title: "Grinding, banging or squealing",
      description:
        "Worn rollers, dry tracks and loose hardware on doors that have cycled daily since the 2000s — a service usually quiets them.",
      icon: "Volume2",
    },
    {
      title: "Remote or keypad not working",
      description:
        "Lost programming, flat batteries or a failing receiver on an older opener — we re-pair, repair or upgrade, including smart units.",
      icon: "BatteryWarning",
    },
    {
      title: "Door stuck halfway",
      description:
        "Often an off-track roller, an obstruction or a misaligned safety sensor stopping the door mid-travel.",
      icon: "TrafficCone",
    },
    {
      title: "Old door beyond repair?",
      description:
        "Rusted panels, a twisted frame or repeat failures on an original-spec door — we'll quote an honest replacement with a free measure.",
      icon: "Building2",
    },
  ],

  costGuidance: {
    intro:
      "Garage door repair costs in Atwell depend on what's actually failed, the parts your door needs and whether it's an after-hours emergency. You'll get a clear, fixed quote before any work starts — the guide prices below show where common repairs typically land.",
    factors: [
      "The fault — re-pairing a remote is a very different job to replacing snapped springs",
      "Parts required and their quality (genuine vs aftermarket components)",
      "Door type and size — single vs double, sectional vs roller",
      "The age of the door — worn companion parts are often best replaced in the same visit",
      "Urgency — standard booking vs after-hours emergency call-out",
      "Whether a repair still adds up, or a new door is the smarter long-term spend",
    ],
    note: "Describe the fault (or send a photo) with your quote request and we'll confirm an exact price before we arrive.",
  },

  whyChooseUs: [
    {
      title: "Genuinely local to Atwell",
      description:
        "We work the Cockburn corridor every day — Beeliar Drive, Lydon Boulevard, Russell Road — so we're nearby, not dispatched from across Perth.",
      icon: "MapPin",
    },
    {
      title: "Same-day response",
      description:
        "Most Atwell repairs are booked and completed the same day, with emergency call-outs pushed to the front of the queue.",
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description:
        "The price is agreed before we start — no vague estimates and no surprise extras on the invoice.",
      icon: "FileText",
    },
    {
      title: "One-visit repairs",
      description:
        "Vans stocked for the common failures on every major brand, so you're not waiting days for a second visit.",
      icon: "BadgeCheck",
    },
    {
      title: "Repairs and new doors",
      description:
        "We repair what's worth repairing and supply-and-install when it isn't — you get one honest recommendation, not a sales pitch.",
      icon: "Building2",
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
    { label: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" },
    { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
    { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    { label: "Garage Doors Perth — Supply & Install", href: "/garage-doors-perth" },
    { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
  ],

  faqs: [
    {
      question: "Do you repair garage doors in Atwell?",
      answer:
        "Yes — Atwell is core territory for us. We repair sectional, roller and tilt doors across the suburb and Harvest Lakes every week: broken springs and cables, faulty motors and openers, remote and sensor problems, noisy operation and doors that won't open or close. Same-day and emergency repairs are both available.",
    },
    {
      question: "How much does garage door repair cost in Atwell?",
      answer:
        "It depends on the fault, the parts needed, your door type and whether it's an after-hours call-out. The guide-price table on this page shows where the common repairs typically land, and you always get a fixed quote before work starts — describe the problem or send a photo with your quote request and we'll confirm the price up front.",
    },
    {
      question: "Can you come out the same day in Atwell?",
      answer:
        "Usually, yes. We drive the Cockburn corridor daily, so Atwell bookings slot into a route we're already on. If your door is stuck open and the house isn't secure, or stuck shut with the car trapped before work, say so when you call — those are emergency call-outs and they're prioritised.",
    },
    {
      question: "Do you charge a call-out fee in Atwell?",
      answer:
        "You'll always know the full price before we begin — we quote the whole job upfront rather than adding charges afterwards. Tell us what's happening with the door when you request a quote and we'll explain exactly what's included, so there are no surprises on the invoice.",
    },
    {
      question: "My Atwell door is over 20 years old — should I repair it or replace it?",
      answer:
        "Age alone doesn't condemn a door. Most of Atwell's original mid-90s and 2000s doors are structurally sound, and replacing a spring, cable or opener buys them years more service — that's the economical fix and it's what most call-outs end in. Replacement is the smarter spend when the panels are rusted or cracked, the frame is out of square, or you're paying for repairs repeatedly. We'll assess it honestly on site and quote whichever genuinely serves you better.",
    },
    {
      question: "Do you supply and install new garage doors in Atwell?",
      answer:
        "Yes. Alongside repairs we handle complete residential garage door installation across Atwell — new sectional and roller doors, insulated panels, and modern quiet openers, including smart Wi-Fi units popular in the Harvest Lakes homes. Every supply-and-install job starts with a free on-site measure and a fixed quote, and we take care of removing the old door.",
    },
    {
      question: "Can you replace just the motor without replacing the door?",
      answer:
        "Absolutely — if the door itself is sound, a new opener is all you need. We replace worn or failed motors on existing Atwell doors with modern units from Merlin, ATA, Chamberlain and Grifco, re-tension and balance the door so the new motor isn't fighting it, and pair your remotes, keypads and phone app before we leave.",
    },
    {
      question: "Which garage door brands do you repair in Atwell?",
      answer:
        "All the major Australian makes — B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus openers and motors from Merlin, ATA, Chamberlain and Grifco. If you're not sure what's on your door, send a photo with your quote request and we'll identify it and bring the right parts first visit.",
    },
    {
      question: "How often should a garage door be serviced in Atwell?",
      answer:
        "Annually for most homes — and it earns its keep on Atwell's older doors, where a service catches worn springs, dry rollers and tired cables before they fail. Doors that cycle several times a day on the school and station runs are worth checking every nine to twelve months, and a freshly repaired or newly installed door should be serviced on schedule to protect its warranty.",
    },
    {
      question: "How long do garage door springs last?",
      answer:
        "Springs are rated in cycles, not years — standard torsion springs give roughly ten thousand opens. On a lightly used door that can stretch well past a decade; on a busy Atwell family door cycling four times a day it can be seven years or less. When one spring on a double door snaps, its twin has done identical work, so we replace them as a matched pair and rebalance the door.",
    },
    {
      question: "What's the most common garage door problem in Atwell?",
      answer:
        "Broken torsion springs on the suburb's original double sectional doors — the mid-90s and 2000s build-out means thousands of springs across Atwell are now at cycle end-of-life, and they let go without warning. Stretched cables, worn first-generation openers and grinding rollers make up most of the rest. All of them are routine same-day repairs for us.",
    },
  ],

  // Real completed jobs from the surrounding southern corridor.
  caseStudySlugs: [
    "garage-door-cable-replacement-willetton-perth",
    "emergency-sectional-door-repair-canning-vale-perth",
    "garage-door-cable-drum-repair-fremantle-perth",
  ],

  seo: {
    title: "Garage Door Repairs Atwell | Same-Day Service & Install",
    description:
      "Same-day garage door repairs in Atwell — springs, cables, motors & openers — plus new door supply & installation. Covering Harvest Lakes, Success & Aubin Grove.",
  },
};
