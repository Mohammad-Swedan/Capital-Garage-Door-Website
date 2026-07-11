import type { CostGuidePage } from "@/types/cost-guide";

export const garageDoorServiceCostPerth: CostGuidePage = {
  slug: "garage-door-service-cost-perth",
  pageType: "cost-guide",
  topicLabel: "Servicing & Maintenance",
  updatedAt: "2026-07-11",

  hero: {
    h1: "Garage Door Service & Maintenance Cost Perth",
    subtitle:
      "How much it costs to service and maintain a garage door in Perth — real price-list ranges for a tune-up, safety check, seals, and roller work, quoted upfront.",
  },

  directAnswer:
    "A garage door service in Perth starts from $140 plus any parts, and a standalone 20-point safety check-up is $120. From there, common maintenance items are priced individually: new weather seals are $280–$480, and worn hinges or rollers are $30 each plus a $140 attendance fee. A regular annual service is the cheapest way to keep a door running and catch worn springs, cables, or rollers before they fail. After-hours call-outs add a flat $500. Every visit is quoted upfront — no call-out fee to quote.",

  // Ranges mirror components/sections/smart-calculator/pricing-data.ts (the
  // single pricing source of truth, also seeded into the CMS catalog this
  // page pins) — keep them in sync when prices change.
  costTable: {
    heading: "Garage Door Service & Maintenance Cost Guide",
    intro:
      "These are the typical Perth price ranges from our own price list for servicing and maintenance. A standard service covers the full door; individual parts are quoted on top only if they're needed — and always confirmed first.",
    rows: [
      {
        repairType: "Service / tune-up",
        includes: "Full tune-up: lubricate, re-tension, balance and safety check",
        costFactors: "Door condition, any parts needed",
        nextStep: "Book an annual service",
        priceRange: "From $140 + parts",
      },
      {
        repairType: "Safety check-up / inspection",
        includes: "20-point safety inspection and written report",
        costFactors: "Door type and condition",
        nextStep: "Book a safety check",
        priceRange: "$120",
      },
      {
        repairType: "Weather seal (rubber & brush)",
        includes: "Bottom rubber and/or brush seals supplied and fitted",
        costFactors: "Single vs double door, seal type",
        nextStep: "Measure your opening width",
        priceRange: "$280–$480",
      },
      {
        repairType: "Hinges & rollers / wheels",
        includes: "Replacing worn hinges, rollers and wheels",
        costFactors: "Number of parts, door type",
        nextStep: "Bundle with a service visit",
        priceRange: "$30 each + $140 call-out",
      },
      {
        repairType: "After-hours emergency call-out",
        includes: "Priority after-hours response on top of the service price",
        costFactors: "Time of day, urgency",
        nextStep: "Call now — 24/7",
        priceRange: "+$500",
      },
    ],
    disclaimer:
      "Ranges are indicative for typical Perth homes; the final price depends on the door's condition, any parts required, and access — confirmed before any work begins. No call-out fee to quote.",
  },

  factors: {
    heading: "What Affects a Service Price",
    items: [
      {
        icon: "ShieldCheck",
        title: "Service vs safety check",
        description: "A full tune-up (from $140) does more than a standalone $120 safety inspection, which is report-only.",
      },
      {
        icon: "PackageCheck",
        title: "Parts found on the day",
        description: "The base service is labour; worn rollers, seals, or springs are quoted on top only if they need doing.",
      },
      {
        icon: "DoorOpen",
        title: "Door type & size",
        description: "Roller, sectional, and tilt doors take different time and parts to service — double doors have more to check.",
      },
      {
        icon: "Clock3",
        title: "How overdue it is",
        description: "A door serviced yearly is quick; one that hasn't been touched in years usually needs more adjustment.",
      },
      {
        icon: "Settings",
        title: "Opener & smart features",
        description: "Motorised doors add opener checks, safety-sensor tests, and travel/force limit adjustments to the service.",
      },
      {
        icon: "Siren",
        title: "Emergency timing",
        description: "After-hours or same-day call-outs are priced differently to a scheduled maintenance visit.",
      },
    ],
  },

  scenarios: {
    heading: "Example Scenarios",
    items: [
      {
        icon: "Volume2",
        title: "Door has become noisy",
        mayAffectQuote: "Often just dry rollers and hinges. A standard service that lubricates and adjusts usually fixes it; worn rollers are $30 each if replacement is needed.",
      },
      {
        icon: "RefreshCw",
        title: "Door feels heavy or sluggish",
        mayAffectQuote: "A service re-tensions springs and re-balances the door. If the springs are worn rather than just loose, we'll quote a replacement separately.",
      },
      {
        icon: "AlertTriangle",
        title: "Draughts, dust, or water under the door",
        mayAffectQuote: "A perished bottom seal is the usual cause — new rubber and brush seals are $280–$480 depending on single vs double door.",
      },
      {
        icon: "ShieldCheck",
        title: "Selling or renting the property",
        mayAffectQuote: "A $120 safety check-up gives you a written report on the door's condition and any items to address before handover.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Service, Repair, or Replace?",
    intro:
      "Regular servicing is the cheapest way to protect a garage door — here's when a service is enough and when it's time to budget for repairs or replacement.",
    repairWhen: [
      "The door is a few years old and running normally",
      "You want to keep it that way and avoid surprise breakdowns",
      "It's making noise or feels a little heavy but still works",
      "You're preparing the property for sale or a new tenant",
    ],
    replaceWhen: [
      "A service keeps flagging the same worn parts each visit",
      "Springs, cables, or rollers are failing across the door",
      "The door is rusted, damaged, or poorly insulated",
      "Repeated repairs are costing more than a new door would",
    ],
  },

  howToQuote: {
    heading: "How to Book a Service or Get a Quote",
    steps: [
      {
        icon: "PhoneCall",
        title: "Tell us what you need",
        description: "A routine tune-up, a one-off safety report, or a specific issue like noise or draughts.",
      },
      {
        icon: "DoorOpen",
        title: "Tell us the door",
        description: "Roller, sectional, or tilt, single or double, and whether it's motorised.",
      },
      {
        icon: "MapPin",
        title: "Share your suburb",
        description: "Let us know where you are across the Perth metro area.",
      },
      {
        icon: "FileText",
        title: "Get your price",
        description: "We'll confirm the service price and flag any likely parts before we attend.",
      },
      {
        icon: "ShieldCheck",
        title: "Book the visit",
        description: "We'll service, adjust, and safety-test the door — and quote any parts before fitting them.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Garage Door Servicing & Maintenance Perth",
      href: "/garage-door-maintenance-perth",
      description: "Our routine servicing and maintenance service for homes and businesses across Perth.",
      icon: "ShieldCheck",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "What repairs cost if a service turns up a broken spring, cable, motor, or track.",
      icon: "FileText",
    },
    {
      name: "Spring & Cable Replacement Cost Perth",
      href: "/garage-door-spring-replacement-cost-perth",
      description: "Pricing for the spring and cable work most often flagged during a service.",
      icon: "Cable",
    },
    {
      name: "Garage Door Motor Replacement Cost Perth",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new opener costs when a service shows the motor is near end of life.",
      icon: "Cpu",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to service a garage door in Perth?",
      answer:
        "A full garage door service starts from $140 plus any parts required. That covers lubrication, re-tensioning, balancing, and a safety check of the door and opener. If you only want a written condition report, a standalone 20-point safety check-up is $120.",
    },
    {
      question: "How often should a garage door be serviced?",
      answer:
        "Once a year is the general recommendation for a home, and every six months for doors that get heavy daily use or are on a business premises. Regular servicing keeps the door running quietly and catches worn springs, cables, and rollers before they fail and become a more expensive repair.",
    },
    {
      question: "What's included in a garage door service?",
      answer:
        "A standard service lubricates the rollers, hinges, and springs, re-tensions and balances the door, checks and adjusts the tracks, tests the opener's safety features and travel limits, and tightens hardware. Anything worn — like rollers at $30 each or a perished seal — is quoted separately before we replace it.",
    },
    {
      question: "Is a service the same as a repair?",
      answer:
        "No. A service is preventative maintenance to keep a working door running well. A repair fixes something that has already failed, like a broken spring or motor. A service often prevents repairs, and if we find a fault during a service we'll quote the repair before doing any extra work.",
    },
    {
      question: "How much do new garage door seals cost?",
      answer:
        "New weather seals — the bottom rubber and/or brush seals — are $280–$480 supplied and fitted, depending on whether it's a single or double door and the seal type. New seals stop draughts, dust, and water getting under the door and are a common item at service time.",
    },
    {
      question: "Do you service commercial garage doors?",
      answer:
        "Yes. We service and maintain residential and commercial doors across the Perth metro area, including roller shutters and industrial doors. Commercial doors are often larger and used more heavily, so a scheduled maintenance plan is usually the most cost-effective approach — we'll quote based on the door and frequency.",
    },
  ],

  cta: {
    heading: "Ready to Book a Garage Door Service?",
    subtitle:
      "Tell us your door and what you need and we'll confirm a clear service price — no call-out fee to ask.",
  },

  seo: {
    title: "Garage Door Service & Maintenance Cost Perth",
    description:
      "Garage door service cost in Perth: full tune-up from $140, safety check-up $120, new seals $280–$480, rollers $30 each. Real price-list ranges, quoted upfront.",
  },
};
