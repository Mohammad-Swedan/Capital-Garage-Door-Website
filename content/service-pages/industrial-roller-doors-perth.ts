import type { ServicePage } from "@/types/service-page";

/**
 * /industrial-roller-doors-perth — heavy-duty industrial roller doors & shutters.
 *
 * Built from the 2026-08 Semrush pull (docs/marketing/semrush-2026-08/):
 * "industrial roller doors" is 1,000/mo at KD 14 — the cheapest 1,000/mo term
 * in the whole niche — plus "commercial roller doors" 880/13. The existing
 * /commercial-roller-doors-perth page targets the "perth"-modified commercial
 * term; this page owns the INDUSTRIAL cluster (warehouses, factories, heavy
 * cyclic use) and cross-links it. Prices mirror pricing-data.ts; the CMS page
 * pins the matching catalog rows.
 */
export const industrialRollerDoorsPerth: ServicePage = {
  serviceName: "Industrial Roller Doors Perth",
  slug: "industrial-roller-doors-perth",
  pageType: "service",

  hero: {
    h1: "Industrial Roller Doors Perth",
    subtitle:
      "Heavy-duty industrial roller doors and shutters for Perth warehouses, factories and workshops — supplied, installed, repaired and maintained with minimal downtime.",
    badges: [
      { icon: "Building2", label: "Warehouse & Factory Specialists" },
      { icon: "Clock", label: "Fast Response, Low Downtime" },
      { icon: "ShieldCheck", label: "Compliance & Safety Testing" },
      { icon: "Wrench", label: "Planned Maintenance Programs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/industrial-roller-door-service-perth.webp",
    imageAlt: "Technician servicing a heavy-duty industrial roller door at a Perth warehouse",
    floatingCardLabel: "Site Visits Within 24h",
  },

  directAnswer:
    "Capital Garage Doors supplies, installs, repairs and maintains industrial roller doors across Perth — from single workshop shutters to full warehouse door fleets. New industrial and custom doors typically run $5,000–$15,000 supplied and installed depending on size, gauge and motorisation, and scheduled servicing starts around $280–$380 per door. We work around your operating hours, prioritise doors that are blocking loading bays, and can put your whole site on a planned maintenance program so a seized door never stops work again.",

  intro: {
    heading: "Industrial Roller Doors Built for Daily Punishment",
    paragraphs: [
      "An industrial roller door works harder than any door on a home — forklifts clip it, salt-laden coastal air corrodes it, and a busy loading bay can cycle it fifty times a day. That duty cycle is why industrial doors need heavier curtains, larger drums, industrial-rated motors and a maintenance schedule, not just a bigger version of a domestic roller door.",
      "We supply and install new industrial roller doors and shutters for warehouses, factories, workshops, self-storage sites and commercial units across Perth — steel curtain doors sized to the opening, wind-rated where the site needs it, with three-phase or single-phase motorisation, chain-hoist backup and safety edges. Every quote covers the door, the motor, safety compliance and the changeover plan, so you know exactly how long the bay is out of action.",
      "Just as important, we keep existing doors running: jammed curtains freed, bent guides straightened or replaced, snapped springs and cables replaced, and industrial operators repaired or upgraded. If a door has trapped stock or blocked a bay, tell us when you call — those jobs get priority scheduling, and most repairs are completed in a single visit from a stocked van.",
    ],
  },

  problems: [
    { label: "Door jammed and blocking a loading bay", icon: "AlertTriangle" },
    { label: "Curtain damaged by a forklift or truck", icon: "Truck" },
    { label: "Industrial motor tripping or burnt out", icon: "Cpu" },
    { label: "Guides bent, curtain running off line", icon: "Move" },
    { label: "Door too heavy to lift on manual override", icon: "Hand" },
    { label: "Ageing door fleet needing planned maintenance", icon: "CalendarCheck" },
  ],

  includedItems: [
    "Site measure and duty-cycle assessment",
    "New industrial roller doors and shutters, supplied and installed",
    "Three-phase and single-phase motorisation with chain-hoist backup",
    "Curtain, guide, drum, spring and cable repairs",
    "Industrial operator repairs and upgrades",
    "Safety edge, photo-eye and compliance checks",
    "Planned maintenance programs across whole door fleets",
    "Priority response for doors blocking operations",
  ],

  processSteps: [
    {
      title: "Site assessment",
      description: "We measure the opening, check the duty cycle and power supply, and scope wind-rating needs.",
      icon: "FileText",
    },
    {
      title: "Specification & quote",
      description: "Door gauge, drum, motor and safety gear specified line-by-line so you can compare quotes fairly.",
      icon: "ClipboardList",
    },
    {
      title: "Manufacture",
      description: "Industrial doors are made to measure — we confirm lead time and plan the changeover around your operations.",
      icon: "PackageCheck",
    },
    {
      title: "Installation",
      description: "Old door out, new guides, drum and curtain in, motor wired and limits set — usually one bay-day per door.",
      icon: "Wrench",
    },
    {
      title: "Compliance & handover",
      description: "Safety devices tested, manual override demonstrated, maintenance schedule agreed.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth ranges from our own price list. Industrial work is always quoted on-site because size, gauge and motorisation drive the price — but these are honest starting points:",
    rows: [
      {
        label: "New door — commercial / industrial / custom",
        price: "$5,000–$15,000",
        note: "Supplied and installed; size, gauge and motor drive the range",
      },
      {
        label: "Commercial roller door service (from)",
        price: "$280–$380",
        note: "Per door; fleet and scheduled-program rates on request",
      },
      {
        label: "Roller door removal & reinstall",
        price: "$880–$1,500",
        note: "Re-hanging an existing door on a new opening",
      },
      {
        label: "Motor / opener replacement",
        price: "$770–$990",
        note: "Domestic-rated; industrial three-phase operators quoted on-site",
      },
    ],
  },

  whyChoose: [
    {
      title: "Downtime comes first",
      description: "Doors blocking bays or trapping stock get priority scheduling — tell us when you call.",
      icon: "Clock",
    },
    {
      title: "Industrial-rated gear",
      description: "Curtain gauge, drums and operators specified for the door's real duty cycle, not the minimum.",
      icon: "Settings",
    },
    {
      title: "Whole-fleet maintenance",
      description: "One scheduled program covers every door on site, with a condition report after each visit.",
      icon: "CalendarCheck",
    },
    {
      title: "Safety and compliance",
      description: "Safety edges, photo eyes and manual overrides tested and documented on every job.",
      icon: "ShieldCheck",
    },
    {
      title: "Commercial experience",
      description: "Warehouses, factories, workshops and storage sites across the Perth metro area.",
      icon: "Building2",
    },
    {
      title: "Stocked vans",
      description: "Common industrial springs, cables and guide stock on board — most repairs finish in one visit.",
      icon: "Wrench",
    },
  ],

  relatedServices: [
    {
      name: "Commercial Roller Doors Perth",
      href: "/commercial-roller-doors-perth",
      description: "Shopfronts, storage units and light-commercial roller shutters.",
      icon: "Building2",
    },
    {
      name: "Commercial Garage Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "The full commercial range — sectional, roller and high-cycle doors.",
      icon: "Warehouse",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Jammed curtains, snapped springs and off-line guides repaired fast.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Operators and openers supplied, installed and repaired.",
      icon: "Cpu",
    },
    {
      name: "Roller Door Installation Perth",
      href: "/roller-door-installation-perth",
      description: "Domestic roller door supply and installation.",
      icon: "DoorOpen",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Every door type repaired — residential and commercial.",
      icon: "Hammer",
    },
  ],

  serviceAreas: [
    "Malaga",
    "Wangara",
    "Osborne Park",
    "Bibra Lake",
    "Jandakot",
    "Kewdale",
    "Welshpool",
    "Canning Vale",
    "Bayswater",
    "Rockingham",
  ],

  // Real Google review (content/reviews.ts) — the CMS page pins the same review.
  reviews: [
    {
      name: "Charlotte D.",
      rating: 5,
      text: "I highly recommend Capital Garage Doors and am very appreciative of Moussab's excellent, prompt and efficient service. He fixed my roller door at short notice with no fuss at all. Thank you so much, Moussab.",
      service: "Roller Door Repairs",
    },
  ],

  faqs: [
    {
      question: "How much does an industrial roller door cost in Perth?",
      answer:
        "New industrial and custom roller doors typically run $5,000–$15,000 supplied and installed. The main cost drivers are the opening size, the curtain gauge (heavier steel for security or wind rating), and motorisation — a three-phase industrial operator with chain-hoist backup costs more than a light commercial motor. We quote on-site, line by line, so you can compare the specification and not just the bottom number.",
    },
    {
      question: "What's the difference between an industrial and a commercial roller door?",
      answer:
        "Duty cycle and construction. A light commercial door on a shopfront might cycle a few times a day and can use a lighter curtain and motor. An industrial door on a busy warehouse bay cycles dozens of times a day, so it needs a heavier-gauge curtain, a larger drum and springs rated for high cycles, and an industrial operator. Fitting light-commercial gear on an industrial opening is the most common cause of early failure we see.",
    },
    {
      question: "Our roller door is jammed and blocking the loading bay — how fast can you come?",
      answer:
        "Tell us that when you call — doors blocking operations get priority scheduling, and we aim to have a technician on-site within 24 hours, usually much sooner for the Perth industrial belts around Malaga, Wangara, Bibra Lake, Kewdale and Canning Vale. Most jams (curtain off its guides, snapped spring, failed limit switch) are fixed in a single visit from a stocked van.",
    },
    {
      question: "Do you offer maintenance contracts for multiple doors?",
      answer:
        "Yes — planned maintenance is how most of our commercial clients use us. We schedule regular servicing across every door on site (typically every 6–12 months depending on duty cycle), starting around $280–$380 per door with fleet rates for larger sites, and you get a condition report after each visit flagging anything that will need attention before the next one. It's the difference between a planned part replacement and a bay out of action on a delivery day.",
    },
    {
      question: "Can you motorise an existing manual industrial door?",
      answer:
        "Usually, yes. If the door and its springs are in good condition we can fit an industrial operator — three-phase or single-phase depending on your supply — with a chain-hoist manual override for power failures. If the curtain or drum isn't up to motorised cycling we'll tell you plainly and price both the fix and the motorisation together.",
    },
    {
      question: "Are your industrial doors wind-rated?",
      answer:
        "They can be — wind-locked guides and heavier curtains are available where the site needs them, which matters for exposed openings and for buildings that must meet a specified wind classification. Tell us the site conditions at the assessment and we'll specify the door to suit, with the rating documented on the quote.",
    },
  ],

  cta: {
    heading: "Keep Your Doors — and Your Site — Moving",
    subtitle:
      "One door or a whole fleet: tell us what you're running and we'll quote supply, repair or a maintenance program that fits your operating hours.",
  },

  seo: {
    title: "Industrial Roller Doors Perth | Supply, Install & Repair",
    description:
      "Industrial roller doors for Perth warehouses & factories — supplied, installed, repaired and maintained. Priority response, fleet servicing. Get a quote.",
  },
};
