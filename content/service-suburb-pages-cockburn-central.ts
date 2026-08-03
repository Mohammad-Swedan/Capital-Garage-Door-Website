import type { ServiceSuburbPage } from "@/types";

/**
 * Cockburn Central (2026-08) — built from dedicated keyword research to win
 * "garage door repairs Cockburn Central". Created in the CMS as a DRAFT by
 * scripts/import-cockburn-central-page.ts.
 *
 * Research behind the copy:
 *  - GSC (28d): "garage door repairs cockburn central" 7 impressions landing on
 *    the HOMEPAGE at position 49.8 — no page existed. Same area, uncaptured:
 *    atwell 16, success 13, "commercial roller doors coogee" 21, treeby 4,
 *    hamilton hill 4, spearwood 1, "garage door repair cockburn" 1.
 *  - DataForSEO: "garage door repairs cockburn" 20/mo (trend 40→30→20→30),
 *    CPC $31.77, HIGH competition — the broader money term this page also
 *    targets in-body. yangebup 10, hamilton hill 10.
 *  - Live Perth SERP: weak — positions 7–19 are directories (Oneflare,
 *    ServiceSeeking, hipages, Yellow Pages, Word of Mouth) and Facebook.
 *    Related searches drive the FAQ set: "Residential garage door repairs
 *    cockburn central", "…cockburn central cost", "Cheap garage door repairs
 *    cockburn", "…reviews".
 *  - #1 competitor (cockburngaragedoorrepairs.com.au) is an exact-match domain
 *    ranking its HOMEPAGE, with ZERO FAQs, 6 suburbs named and no job photos.
 *    This page beats it on local depth, FAQ coverage (→ FAQPage schema), the
 *    full City of Cockburn suburb list, real job photos and a commercial
 *    section for the Bibra Lake / Jandakot / Henderson industrial belt.
 *
 * Hand-written rather than built via makeSuburbPage() (batch 2) so every
 * section can carry Cockburn-specific copy.
 *
 * NOTE: no dollar figures anywhere — visible prices may only come from the
 * pricing catalog (CLAUDE.md), and the suburb template renders no pricing pins.
 * The cost intent is served by the cost FAQ + the /garage-door-repair-cost-perth
 * related link.
 */
export const cockburnCentralPage: ServiceSuburbPage = {
  slug: "garage-door-repairs-cockburn-central",
  service: "Garage Door Repairs",
  suburb: "Cockburn Central",
  region: "Perth, WA",

  // Success/Canning Vale/Fremantle are live pages; the rest point at the
  // service-areas index until (and unless) they get their own pages.
  nearbySuburbs: [
    { label: "Success", href: "/garage-door-repairs-success" },
    { label: "Atwell", href: "/service-areas" },
    { label: "Aubin Grove", href: "/service-areas" },
    { label: "Hammond Park", href: "/service-areas" },
    { label: "Beeliar", href: "/service-areas" },
    { label: "Bibra Lake", href: "/service-areas" },
    { label: "Yangebup", href: "/service-areas" },
    { label: "Jandakot", href: "/service-areas" },
    { label: "Treeby", href: "/service-areas" },
    { label: "Spearwood", href: "/service-areas" },
    { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    { label: "Fremantle", href: "/garage-door-repairs-fremantle" },
  ],

  hero: {
    subtitle:
      "Same-day garage door repairs across Cockburn Central and the wider City of Cockburn — broken springs, dead motors, off-track doors and commercial roller doors, fixed properly the first time.",
    trustBadges: [
      "Local Perth Team",
      "Same-Day Response",
      "Emergency Repairs",
      "Warranty Support",
    ],
  },

  directAnswer:
    "Capital Garage Doors provides same-day garage door repairs in Cockburn Central and across the City of Cockburn, including broken springs and cables, faulty motors and smart openers, off-track and noisy doors, remote and sensor faults, commercial roller doors, and doors that won't open or close.",

  localIntro: [
    "Cockburn Central is one of Perth's busiest southern hubs — the train station, Cockburn Gateway Shopping City, Cockburn ARC and the growing Cockburn Central West precinct all sit within a couple of kilometres, ringed by estate homes with big double garages. Those doors do a lot of work: two, three, four cycles every morning between school runs, the freeway commute and the station car park. That daily workload is exactly what wears out torsion springs, stretches lift cables and burns out openers.",
    "We repair residential and commercial doors right across the City of Cockburn — Cockburn Central, Success, Atwell, Aubin Grove, Hammond Park, Beeliar, Treeby, Banjup, Yangebup, Bibra Lake, Jandakot and out to the coastal strip through Spearwood, Munster, Coogee and Hamilton Hill. Because we already run this corridor daily via Beeliar Drive, North Lake Road and Armadale Road, a Cockburn Central call-out slots into a route we're on anyway, which is why same-day is normal here rather than a promise we hope to keep.",
    "The area's commercial side is just as busy. We service high-cycle roller doors and shutters through the Bibra Lake and Jandakot industrial estates, the Cockburn Central West commercial precinct and the workshops toward Henderson — the doors that cost a business money every hour they're stuck. We can work around your operating hours so a repair doesn't shut you down mid-trade.",
    "If your door has failed right now — stuck open with the house exposed, or stuck shut with the car trapped inside before work — that's an emergency call-out and we prioritise it. If it's a slow-building problem instead (grinding noise, jerky travel, a door that's getting heavier, a remote that works only from three metres away), it's cheaper to catch it before the spring actually snaps and takes the opener with it.",
    "Whatever brand is on your door, we carry parts for the major Australian makes — B&D, Steel-Line, Centurion, Gliderol and Dominator — plus Merlin, ATA, Chamberlain and Grifco openers and motors, so most Cockburn Central repairs are diagnosed and finished in a single visit. Not sure what you've got? Send a photo with your quote request and we'll identify it before we arrive.",
  ],

  availableServices: [
    {
      title: "Garage Door Repairs",
      description:
        "Diagnosis and repair for doors that won't open, close or run smoothly — sectional, roller and tilt doors across Cockburn Central.",
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Repairs",
      description:
        "Safe replacement of broken torsion springs and frayed lift cables — the most common cause of a dead door in the Cockburn estates.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Replacement",
      description:
        "Repair or replace worn-out openers with quality, warranty-backed motors — including smart Wi-Fi units for newer homes.",
      icon: "Cpu",
    },
    {
      title: "Commercial Roller Doors",
      description:
        "High-cycle roller doors and shutters for the Bibra Lake, Jandakot and Cockburn Central West business precincts.",
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
        "Door stuck open or shut? Priority response across Cockburn Central to secure your home or business fast.",
      icon: "Siren",
    },
    {
      title: "Servicing & Maintenance",
      description:
        "Routine tune-ups that keep your door quiet, balanced and safe — and stop small faults becoming breakdowns.",
      icon: "Settings",
    },
  ],

  problems: [
    {
      title: "Door won't open",
      description:
        "Usually a broken spring, snapped cable or motor fault — we find the real cause and get you moving again.",
      icon: "DoorClosed",
    },
    {
      title: "Door suddenly feels heavy",
      description:
        "The classic broken-spring symptom. Don't force it — the opener will fail next. We replace springs in pairs and rebalance.",
      icon: "Scale",
    },
    {
      title: "Remote or keypad not working",
      description:
        "Flat batteries, lost programming or a failing receiver — we test, re-pair or replace, including smart and Wi-Fi openers.",
      icon: "BatteryWarning",
    },
    {
      title: "Door stuck halfway",
      description:
        "Often an obstruction, an off-track roller or a misaligned safety sensor stopping the door mid-travel.",
      icon: "TrafficCone",
    },
    {
      title: "Loud or noisy operation",
      description:
        "Grinding, banging or squealing points to worn rollers, loose hardware or springs that need attention.",
      icon: "Volume2",
    },
    {
      title: "Commercial door down",
      description:
        "A jammed warehouse roller stops trade — we prioritise business call-outs across the Cockburn industrial estates.",
      icon: "Building2",
    },
  ],

  costGuidance: {
    intro:
      "There's no flat rate for garage door repairs in Cockburn Central — the cost depends on what's actually wrong and what your door needs. We quote clearly and upfront before any work starts, so you approve the price before we touch the door.",
    factors: [
      "The type of problem (a remote re-pair is very different to a spring replacement)",
      "Parts required and their quality (genuine vs aftermarket components)",
      "Your door type — sectional, roller, tilt or a commercial shutter",
      "Single vs double door, and whether springs are replaced as a pair",
      "Urgency — standard booking vs after-hours emergency call-out",
      "Whether a repair will last, or a replacement is the smarter long-term option",
    ],
    note: "Describe the issue (or send a photo) with your quote request for a faster, more accurate estimate — see our Perth repair price guide below for typical ranges.",
  },

  whyChooseUs: [
    {
      title: "Genuinely local to Cockburn",
      description:
        "We run the Cockburn corridor daily — Beeliar Drive, North Lake Road, Armadale Road — so we're nearby, not dispatched from across the city.",
      icon: "MapPin",
    },
    {
      title: "Same-day response",
      description:
        "Most Cockburn Central repairs are booked and completed the same day, with emergency call-outs prioritised.",
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description:
        "You get the price before we start — no vague estimates, no pressure and no surprise charges added at the end.",
      icon: "FileText",
    },
    {
      title: "One-visit repairs",
      description:
        "We arrive stocked for the common failures on all major brands, so you're not waiting days for a second visit.",
      icon: "BadgeCheck",
    },
    {
      title: "Homes and businesses",
      description:
        "Estate-home sectionals and high-cycle commercial rollers in Bibra Lake and Jandakot — both are everyday work for us.",
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
    { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
    { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
    { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" },
    { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
  ],

  faqs: [
    {
      question: "Do you repair garage doors in Cockburn Central?",
      answer:
        "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Cockburn Central every week, including same-day and emergency repairs. We cover broken springs and cables, faulty motors and openers, off-track and noisy doors, remote and sensor problems, and doors that won't open or close.",
    },
    {
      question: "Do you cover the wider Cockburn area, or only Cockburn Central?",
      answer:
        "The whole City of Cockburn. Cockburn Central is our anchor point, and from there we service Success, Atwell, Aubin Grove, Hammond Park, Beeliar, Treeby, Banjup, Yangebup, Bibra Lake and Jandakot, plus the coastal suburbs of Spearwood, Munster, Coogee, North Coogee and Hamilton Hill. If you're anywhere in Cockburn, you're covered.",
    },
    {
      question: "How much does garage door repair cost in Cockburn Central?",
      answer:
        "It depends on the fault, the parts needed, your door type and whether it's an after-hours call-out — a remote re-pair and a double-door spring replacement are very different jobs. We give you a clear, upfront quote before starting, and our Perth repair price guide (linked on this page) lists the typical ranges for common repairs so you know roughly where you'll land before you call.",
    },
    {
      question: "Do you charge a call-out fee in Cockburn Central?",
      answer:
        "You'll always know the full price before we begin — we quote the job upfront rather than springing extra charges on you afterwards. Describe the problem when you request a quote and we'll explain exactly what's included, so there are no surprises when the invoice arrives.",
    },
    {
      question: "Can you come out the same day?",
      answer:
        "Usually, yes. Cockburn Central sits on a corridor we already drive daily, so same-day bookings are routine rather than exceptional. If your door is stuck open and your home isn't secure, or stuck shut with a car trapped inside, tell us when you call — those are treated as emergency call-outs and pushed to the front of the queue.",
    },
    {
      question: "Do you repair residential garage doors as well as commercial?",
      answer:
        "Both, every day. Most of our Cockburn Central work is residential — estate homes with double sectional doors — while the Bibra Lake, Jandakot and Cockburn Central West precincts keep us busy with high-cycle commercial rollers and shutters. The same technicians handle both, so you get someone who's seen your problem many times before.",
    },
    {
      question: "Can you repair the high-cycle roller doors on our Cockburn warehouse?",
      answer:
        "Yes — commercial roller doors and shutters are core work for us across the Cockburn industrial estates. We repair and re-tension curtains, replace worn springs and barrels, straighten guides after forklift or truck damage, and service or replace industrial motors. We can schedule outside your trading hours so the repair doesn't cost you a day's business.",
    },
    {
      question: "Can you fix smart and Wi-Fi garage door openers?",
      answer:
        "Yes. A lot of the newer Cockburn Central and Treeby homes have app-controlled openers, and we repair, reprogram and replace them — including re-pairing remotes and phone apps, resetting travel limits and fixing safety sensors. We can also upgrade an older opener on a sound door to a modern smart unit.",
    },
    {
      question: "Which garage door brands do you repair in Cockburn Central?",
      answer:
        "All major Australian brands — B&D, Steel-Line, Centurion, Gliderol and Dominator doors and more, plus openers and motors from Merlin, ATA, Chamberlain and Grifco. If you're unsure which brand you have, send a photo with your quote request and we'll identify it and bring the right parts.",
    },
    {
      question: "Do you supply and install new garage doors in Cockburn Central?",
      answer:
        "Yes — as well as repairs we supply and install new sectional, roller, tilt and custom garage doors across Cockburn Central, including automatic openers. If your existing door is beyond economical repair we'll tell you straight and quote a replacement after a free on-site measure, but we never push a new door where a repair will genuinely do the job.",
    },
    {
      question: "What's the most common garage door problem in Cockburn Central?",
      answer:
        "Broken torsion springs, by a wide margin. Cockburn's estate homes have large double doors that cycle several times a day, and springs are a wear item — they eventually snap, almost always without warning. Worn lift cables, burnt-out openers and doors that have jumped their tracks make up most of the rest. All of these are typically same-day repairs.",
    },
    // The last three FAQs mirror the live PAA questions on the Cockburn SERPs
    // (2026-08-04 DataForSEO pull): repair-vs-replace, service frequency,
    // lifespan. Added to the prod CMS by scripts/enhance-cockburn-central-page.ts.
    {
      question: "Is it worth repairing a garage door, or is it better to replace it?",
      answer:
        "In most cases a repair is the economical choice — springs, cables, rollers, sensors and even motors can be replaced individually, and a well-made door has plenty of life beyond any single failed part. Replacement starts to make sense when the door itself is structurally tired: rusted or cracked panels, a frame twisted out of square, or repeated failures on a door that's decades old. We give you an honest assessment on site — most Cockburn Central call-outs end in a same-day repair, and if a replacement genuinely is the smarter option we'll say so and quote it without pressure.",
    },
    {
      question: "How often should a garage door be serviced?",
      answer:
        "Once a year for a typical Cockburn Central home — an annual service keeps the door balanced, quiet and safe, and catches wear before it becomes a breakdown. Doors that work harder need attention sooner: busy family homes near the station precinct where the door cycles several times a day, and the coastal-side doors around Spearwood, Coogee and Munster where salt air attacks springs and fittings. High-cycle commercial rollers in Bibra Lake and Jandakot are usually put on a scheduled maintenance program rather than serviced ad hoc.",
    },
    {
      question: "How long do garage doors, springs and openers last?",
      answer:
        "A quality garage door lasts 15–30 years when it's serviced regularly. The wear parts are shorter-lived: torsion springs are rated in cycles rather than years — around ten thousand opens for standard springs, which is roughly 7–10 years in an average home but noticeably less for the hard-working double doors in Cockburn Central's estates — and openers typically give 10–15 years. If the door itself is sound, replacing a worn spring or motor buys the rest of the door many more years of service.",
    },
  ],

  // Real completed jobs from the surrounding southern corridor.
  caseStudySlugs: [
    "garage-door-cable-replacement-willetton-perth",
    "emergency-sectional-door-repair-canning-vale-perth",
    "garage-door-cable-drum-repair-fremantle-perth",
  ],

  seo: {
    title: "Garage Door Repairs Cockburn Central | Same-Day Service",
    description:
      "Same-day garage door repairs in Cockburn Central & across Cockburn — springs, motors, roller & commercial doors. Covering Success, Atwell & Bibra Lake.",
  },
};
