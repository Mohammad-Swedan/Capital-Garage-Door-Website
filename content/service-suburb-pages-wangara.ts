import type { ServiceSuburbPage } from "@/types";

/**
 * Wangara (2026-11-01) — the one suburb page of the Nov-2026 program, and the only one the data
 * supports: Keyword Planner shows "garage door repairs wangara" at 20 searches a month in Perth
 * (the playbook's floor for a suburb page), "Garage door repairs Wangara" is a related search
 * on the commercial-maintenance SERP, and Wangara is the northern industrial estate the
 * commercial hub names. Created in the CMS as a DRAFT by scripts/import-pages-2026-11.ts, which
 * pins the standard eight-scenario guide-price table PLUS the commercial roller door service row
 * (Cockburn Central pattern) and, after the user publishes it, links the "Wangara" suburb row
 * (Northern Suburbs region), adds it to the repairs hub grid and repoints placeholder chips.
 *
 * Angle: Wangara is a working estate — roller doors on factory units and warehouses along
 * Prindiville Drive, Buckingham Drive and Berriman Drive that cycle dozens of times a day — with
 * the residential suburbs of Madeley, Darch, Landsdale, Pearsall and Hocking around it, whose
 * 1990s–2010s sectional doors are reaching spring and motor end-of-life. Both intents are served.
 *
 * NOTE: no dollar figures anywhere — visible prices come only from the CMS pricing catalog.
 */
export const wangaraPage: ServiceSuburbPage = {
  slug: "garage-door-repairs-wangara",
  service: "Garage Door Repairs",
  suburb: "Wangara",
  region: "Perth, WA",

  // Joondalup, Kingsley, Padbury and Wanneroo are live pages; the rest point at the
  // service-areas index until they get their own pages.
  nearbySuburbs: [
    { label: "Wanneroo", href: "/garage-door-repairs-wanneroo" },
    { label: "Joondalup", href: "/garage-door-repairs-joondalup" },
    { label: "Kingsley", href: "/garage-door-repairs-kingsley" },
    { label: "Padbury", href: "/garage-door-repairs-padbury" },
    { label: "Madeley", href: "/service-areas" },
    { label: "Darch", href: "/service-areas" },
    { label: "Landsdale", href: "/service-areas" },
    { label: "Pearsall", href: "/service-areas" },
    { label: "Hocking", href: "/service-areas" },
    { label: "Gnangara", href: "/service-areas" },
  ],

  hero: {
    subtitle:
      "Same-day garage door and roller door repairs in Wangara — factory and warehouse roller doors kept working through the day, and the sectional doors of Madeley, Darch and Landsdale fixed in one visit.",
    trustBadges: [
      "Local Perth Team",
      "Same-Day Response",
      "Commercial & Residential",
      "Warranty Support",
    ],
  },

  directAnswer:
    "Capital Garage Doors provides same-day garage door repairs in Wangara — commercial roller doors and shutters on the industrial estate, and residential sectional and roller doors in the surrounding suburbs — covering broken springs and cables, faulty motors and openers, off-track doors, locks and safety sensors, with scheduled maintenance contracts for business premises and new doors supplied and installed where a repair no longer pays.",

  localIntro: [
    "Wangara is a working suburb. Most of it is the industrial estate between Wanneroo Road and the Mitchell Freeway, and the garage doors here are commercial roller doors on factory units, warehouses and workshops along Prindiville Drive, Buckingham Drive, Berriman Drive and Dellamarta Road, cycling twenty, fifty or a hundred times a day. Those doors wear differently from a home door: springs reach their cycle limit in a few years, barrels and curtains take forklift strikes, and a door that stops during the day stops a business. For those doors we offer same-day breakdown response and scheduled maintenance contracts.",
    "The residential side matters just as much. The homes around the estate — Madeley, Darch, Landsdale, Pearsall, Hocking and the older streets of Wanneroo and Gnangara — were largely built from the 1990s through the 2010s, and their first double sectional doors are now at the age where torsion springs snap, lift cables fray and the original openers give out. We service these doors with the same vans that cover the estate, so a Wangara call-out slots into a route we already drive via Wanneroo Road and Ocean Reef Road, and same-day repair is the normal outcome.",
    "The faults we fix most in Wangara follow those two groups. On commercial roller doors: snapped springs inside the barrel, curtains out of their guides after a forklift knock, burnt-out motors from running a door whose springs had lost tension, failed safety photo-eyes and worn bottom rails. On the homes: broken springs and cables, openers that strain or ignore the remote, noisy rollers and hinges, and doors off their tracks. All of it is standard same-day work with the parts carried on the van.",
    "For businesses, the most useful thing we offer is a maintenance contract: a quarterly or six-monthly visit to every roller door and shutter on the site, with springs, barrels, guides, motors, limits and safety edges checked and adjusted, worn parts replaced before they stop the door, and a written condition report. It is priced per door from the commercial service row in the guide-price table below, and breakdown call-outs between visits are charged at the listed rate.",
    "Whatever is on the door, we carry parts for the major Australian makes — B&D, Steel-Line, Centurion, Gliderol and Taurean doors, and Merlin, ATA, Grifco and Chamberlain motors, including the light-commercial Grifco units common on Wangara's factory doors — so most repairs are diagnosed and finished in a single visit. Send a photo with your quote request and we will identify the door and bring the right parts first time.",
  ],

  availableServices: [
    {
      title: "Commercial Roller Door Repairs",
      description:
        "Factory and warehouse roller doors and shutters repaired same-day — springs, barrels, curtains, guides, motors and safety edges — to keep the unit trading.",
      icon: "Building2",
    },
    {
      title: "Maintenance Contracts",
      description:
        "Quarterly or six-monthly servicing of every door on a Wangara site, with a condition report and worn parts replaced before they fail.",
      icon: "CalendarCheck",
    },
    {
      title: "Garage Door Repairs",
      description:
        "Residential sectional, roller and tilt doors in Madeley, Darch, Landsdale and the streets around the estate — the most common call-out.",
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Replacement",
      description:
        "Broken torsion springs and frayed lift cables replaced in matched pairs and rebalanced, on homes and on high-cycle commercial doors.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Repairs",
      description:
        "Residential openers and light-commercial motors repaired or replaced, with remotes, keypads and safety sensors set up on the day.",
      icon: "Cpu",
    },
    {
      title: "New Door Supply & Install",
      description:
        "New roller and sectional doors for homes, and commercial roller doors for factory units, supplied and installed after an on-site measure.",
      icon: "LayoutPanelTop",
    },
    {
      title: "Emergency Repairs",
      description:
        "A warehouse door stuck open overnight or a home door jammed with the car inside — priority response across Wangara and the northern suburbs.",
      icon: "Siren",
    },
  ],

  problems: [
    {
      title: "Commercial roller door stuck down",
      description:
        "Usually a snapped spring inside the barrel on a high-cycle door — the motor cannot lift it. Replaced the same day so the unit keeps trading.",
      icon: "DoorClosed",
    },
    {
      title: "Curtain out of its guides",
      description:
        "A forklift knock or a forced lift walks the curtain out of one guide and jams it. Re-fed, guides re-set and the cause fixed.",
      icon: "TrafficCone",
    },
    {
      title: "Door suddenly feels heavy",
      description:
        "The broken-spring symptom on the double sectional doors of Madeley and Darch. Do not force it; springs are replaced in pairs.",
      icon: "Scale",
    },
    {
      title: "Motor runs but the door won't move",
      description:
        "A stripped gear or a motor burnt out by a door whose springs had lost tension — repaired or replaced, and the door re-balanced first.",
      icon: "Power",
    },
    {
      title: "Door won't close, light flashing",
      description:
        "Safety photo-eyes knocked out of line or wired through a damaged cable — realigned, rewired or replaced and the limits reset.",
      icon: "AlertTriangle",
    },
    {
      title: "Grinding, banging or squealing",
      description:
        "Worn rollers, dry tracks and loose hardware on doors that have cycled daily for twenty years — a service and new rollers usually quiet them.",
      icon: "Volume2",
    },
  ],

  costGuidance: {
    intro:
      "Garage door repair costs in Wangara depend on what has failed, the parts the door needs, whether it is a residential or a commercial door and whether it is an after-hours emergency. You get a fixed quote before any work starts; the guide prices below show where the common repairs and the commercial service visit typically land.",
    factors: [
      "The fault — resetting a safety sensor is a very different job from replacing a high-cycle commercial spring",
      "Residential or commercial door — commercial springs, barrels and motors are heavier-duty parts",
      "Parts required and their quality (genuine vs aftermarket components)",
      "Door type and size — single vs double, sectional vs roller, factory-unit vs warehouse width",
      "Urgency — a scheduled visit vs an after-hours emergency call-out",
      "Whether a repair still adds up, or a new door or a maintenance contract is the smarter spend",
    ],
    note: "Describe the fault (or send a photo) with your quote request and we will confirm an exact price before we arrive.",
  },

  whyChooseUs: [
    {
      title: "Commercial and residential",
      description:
        "The same technicians handle a warehouse roller door on Prindiville Drive and a family sectional door in Darch, so Wangara gets one local team for both.",
      icon: "Building2",
    },
    {
      title: "Same-day response",
      description:
        "We drive the northern corridor daily via Wanneroo Road and Ocean Reef Road, so most Wangara repairs are booked and completed the same day.",
      icon: "Zap",
    },
    {
      title: "Maintenance contracts",
      description:
        "Scheduled visits with a written condition report keep a site's doors working and make the cost predictable.",
      icon: "CalendarCheck",
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
        "Vans stocked for the common failures on every major brand, residential and light-commercial, so you are not waiting days for a second visit.",
      icon: "BadgeCheck",
    },
    {
      title: "Warranty support",
      description:
        "Workmanship and parts backed by warranty, with real people to call if anything needs a second look.",
      icon: "ShieldCheck",
    },
  ],

  relatedPages: [
    { label: "Commercial Garage Doors Perth", href: "/commercial-garage-doors-perth" },
    { label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" },
    { label: "Industrial Roller Doors Perth", href: "/industrial-roller-doors-perth" },
    { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" },
    { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
    { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
  ],

  faqs: [
    {
      question: "Do you repair commercial roller doors in Wangara?",
      answer:
        "Yes — commercial roller doors and shutters on Wangara's factory units and warehouses are the bulk of our work in the suburb. We repair snapped springs, curtains out of their guides, burnt-out motors, failed safety photo-eyes and damaged bottom rails, usually on a same-day visit so the unit keeps trading, and we run scheduled maintenance contracts for sites with several doors.",
    },
    {
      question: "How much does garage door repair cost in Wangara?",
      answer:
        "It depends on the fault, the parts, whether the door is residential or commercial and whether it is an after-hours call-out. The guide-price table on this page shows where the common repairs and the commercial service visit typically land, and you always get a fixed quote before work starts — describe the problem or send a photo with your quote request and we will confirm the price up front.",
    },
    {
      question: "Can you come out the same day in Wangara?",
      answer:
        "Usually, yes. We drive the northern corridor daily, so Wangara bookings slot into a route we are already on. A warehouse door stuck open with stock exposed, or a home door jammed shut with the car inside, is an emergency call-out and goes to the front of the queue; tell us when you call.",
    },
    {
      question: "Do you offer maintenance contracts for Wangara businesses?",
      answer:
        "Yes. A contract is a quarterly or six-monthly visit to every roller door and shutter on the site: springs, barrels, guides, motors, limits and safety edges checked and adjusted, worn parts replaced before they stop the door, and a written condition report for the facilities manager. It is priced per door from the commercial service row in the guide-price table, with breakdown call-outs between visits at the listed rate.",
    },
    {
      question: "How often should a factory roller door be serviced?",
      answer:
        "Every six months for a door that cycles more than a dozen times a day — a loading dock, a workshop or a unit that opens and closes all day — and once a year for a door opened a few times a day. High-cycle doors use up their springs and motors far faster than a home door, and a missed service usually shows up as a snapped spring during business hours.",
    },
    {
      question: "Do you repair garage doors in Madeley, Darch and Landsdale?",
      answer:
        "Yes. The residential suburbs around the Wangara estate are covered by the same vans: sectional, roller and tilt doors in Madeley, Darch, Landsdale, Pearsall, Hocking, Gnangara and Wanneroo, with broken springs and cables, faulty openers, remotes, sensors, noisy rollers and off-track doors all handled as same-day repairs.",
    },
    {
      question: "Do you charge a call-out fee in Wangara?",
      answer:
        "You always know the full price before we begin — we quote the whole job up front rather than adding charges afterwards. Tell us what is happening with the door when you request a quote and we will explain exactly what is included, so there are no surprises on the invoice.",
    },
    {
      question: "Can you supply and install a new commercial roller door in Wangara?",
      answer:
        "Yes. We supply and install commercial roller doors for factory units and warehouses, sized and wind-rated to the opening, with a light-commercial or industrial motor matched to the duty cycle. Every supply-and-install job starts with an on-site measure and a fixed quote, and we remove the old door. New residential roller and sectional doors for the surrounding suburbs are handled the same way.",
    },
    {
      question: "My door's motor runs but the door doesn't move — what is wrong?",
      answer:
        "On a roller door that is usually a stripped drive gear or a spring that has snapped inside the barrel, so the motor is trying to lift the full weight of the curtain and cannot. On a sectional door it is often a broken spring or a sheared carriage. Stop running the motor, because it will burn out, and call us: we replace the spring, re-balance the door and check whether the motor has survived.",
    },
    {
      question: "Which garage door brands do you repair in Wangara?",
      answer:
        "All the major Australian makes — B&D, Steel-Line, Centurion, Gliderol and Taurean doors, plus openers and motors from Merlin, ATA, Grifco and Chamberlain, including the light-commercial Grifco units common on Wangara's factory doors. Send a photo with your quote request if you are not sure what you have and we will identify it and bring the right parts.",
    },
  ],

  // Real completed jobs: the Malaga commercial roller shutter service and two northern-corridor homes.
  caseStudySlugs: [
    "commercial-roller-shutter-service-malaga-perth",
    "roller-door-repair-wanneroo-perth",
    "garage-door-repairs-kingsley-opener-chain-snapped-perth",
  ],

  seo: {
    title: "Garage Door Repairs Wangara | Same-Day Local Service",
    description:
      "Same-day garage door & commercial roller door repairs in Wangara — springs, motors, curtains & maintenance contracts — plus Madeley, Darch & Landsdale homes.",
  },
};
