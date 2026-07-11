import type { ServicePage } from "@/types/service-page";

/**
 * /commercial-roller-doors-perth — commercial & industrial roller doors.
 *
 * GSC's biggest uncovered commercial cluster: "commercial roller doors perth"
 * (106 impressions) + "industrial roller doors perth" (61) + repair/service
 * variants. Child of the existing /commercial-garage-doors-perth hub (which is
 * repairs/service-led) — this page owns the roller-specific buying intent:
 * door vs shutter, motors, wind-loading compliance, high-cycle servicing.
 * Prices mirror components/sections/smart-calculator/pricing-data.ts; the live
 * CMS page pins the matching catalog rows.
 */
export const commercialRollerDoorsPerth: ServicePage = {
  serviceName: "Commercial Roller Doors Perth",
  slug: "commercial-roller-doors-perth",
  pageType: "service",

  hero: {
    h1: "Commercial Roller Doors Perth",
    subtitle:
      "Roller doors and shutters for Perth warehouses, factories, shopfronts and storage sites — supplied, installed, repaired and serviced to keep your doors cycling and your business open.",
    badges: [
      { icon: "Warehouse", label: "Warehouse & Industrial" },
      { icon: "Clock3", label: "Fast Breakdown Response" },
      { icon: "Settings", label: "High-Cycle Motors & Springs" },
      { icon: "ShieldCheck", label: "Compliance-Minded Installs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/door-types/commercial-roller-shutter-door-perth-warehouse.webp",
    imageAlt: "Large industrial roller shutter door inside a Perth warehouse with overhead gantry crane",
    floatingCardLabel: "Fast Commercial Quote",
  },

  directAnswer:
    "Capital Garage Doors supplies, installs, repairs and services commercial roller doors and shutters across Perth. New commercial and industrial doors typically range $5,000–$15,000+ supplied and installed depending on opening size, curtain spec and motor; a commercial roller door service starts around $280–$380. We spec curtains and windlocks to the site's wind exposure, match single- or three-phase motors to your daily cycle count, and respond fast to breakdowns — because a door that won't open is a business that can't trade.",

  intro: {
    heading: "Doors That Earn Their Keep, Specified Properly",
    paragraphs: [
      "A commercial roller door works harder in a week than most home doors do in a year. Loading docks cycling all day, shopfronts opening before dawn, storage facilities where every unit is a door — the spec has to match the workload. That starts with an honest conversation about cycles per day, opening size and wind exposure, not a brochure.",
      "We install both light-commercial roller doors — a single steel curtain suited to workshops, sheds and shopfronts — and heavy interlocking-slat roller shutters for warehouses, factories and high-security sites. Curtains are specified for the opening with reinforced bottom rails and windlocked guides where the site calls for it, consistent with Australian garage-door and wind-loading standards (AS/NZS 4505 and AS/NZS 1170.2).",
      "Motors matter just as much: a single-phase opener that's fine on a home garage will burn out on a dock door cycling forty times a day. We match single- or three-phase drives to the door's weight and duty cycle, fit chain overrides so a power cut never locks you out, and set up planned servicing so springs and curtains are maintained before they fail — with fast response when something does let go.",
    ],
  },

  problems: [
    { label: "Door down and the site can't trade", icon: "Siren" },
    { label: "High-cycle motor burning out", icon: "Cpu" },
    { label: "Curtain jammed, bent or off its guides", icon: "AlertTriangle" },
    { label: "New warehouse or unit fit-out", icon: "Warehouse" },
    { label: "Shopfront security upgrade", icon: "Lock" },
    { label: "Doors overdue for compliance servicing", icon: "FileText" },
  ],

  includedItems: [
    "Site visit measuring openings, exposure and duty cycle",
    "Roller door or interlocking-slat shutter supply",
    "Windlocked guides and reinforced bottom rail where specified",
    "Single- or three-phase motor matched to the cycle count",
    "Chain override for manual operation in a power cut",
    "Safety systems — photo-electric beams and auto-reverse",
    "Planned maintenance scheduling for multi-door sites",
    "Breakdown repair across the Perth metro",
  ],

  processSteps: [
    {
      title: "Site assessment",
      description: "Openings, wind exposure, daily cycles and security needs — measured on site.",
      icon: "Search",
    },
    {
      title: "Specification & quote",
      description: "Door type, curtain, motor and safety gear itemised line by line — no vague allowances.",
      icon: "FileText",
    },
    {
      title: "Manufacture",
      description: "Curtains are rolled to your exact opening — lead time confirmed with the quote.",
      icon: "PackageCheck",
    },
    {
      title: "Installation",
      description: "Fitted, tensioned and load-tested with minimal disruption to site operations.",
      icon: "Wrench",
    },
    {
      title: "Service program",
      description: "Handover with a maintenance schedule matched to how hard the door works.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth ranges from our own price list. Commercial work is quoted to the site — opening size, curtain spec and motor drive set the price, confirmed upfront:",
    rows: [
      {
        label: "New commercial / industrial door (supply & install)",
        price: "$5,000–$15,000",
        note: "Larger openings, windlocked and high-cycle specs priced to site",
      },
      {
        label: "Commercial roller door service",
        price: "$280–$380",
        note: "Per-door service visit — springs, guides, motor and safety checks",
      },
      {
        label: "Motor / opener replacement",
        price: "$770–$990",
        note: "Drive matched to door weight and daily cycle count",
      },
    ],
  },

  whyChoose: [
    {
      title: "Specified to the site",
      description: "Wind exposure, cycle counts and security drive the spec — not a one-size brochure.",
      icon: "Ruler",
    },
    {
      title: "Downtime treated as urgent",
      description: "Fast metro response and same-visit repairs wherever parts allow.",
      icon: "Clock3",
    },
    {
      title: "High-cycle hardware",
      description: "Springs and motors rated for commercial duty, so they last under real workloads.",
      icon: "Settings",
    },
    {
      title: "Compliance-minded",
      description: "Installs consistent with AS/NZS 4505 and wind-loading requirements for the site.",
      icon: "BadgeCheck",
    },
    {
      title: "Multi-door sites welcome",
      description: "One contact and one maintenance schedule across every door on the property.",
      icon: "Warehouse",
    },
    {
      title: "Safety as standard",
      description: "Photo-electric beams, auto-reverse and chain overrides fitted and tested.",
      icon: "ShieldCheck",
    },
  ],

  relatedServices: [
    {
      name: "Commercial & Industrial Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "The full commercial service — sectional doors, shutters and repairs.",
      icon: "Building2",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Curtain, spring and guide repairs when a door lets go mid-shift.",
      icon: "Wrench",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "After-hours response when a stuck door is costing you trade.",
      icon: "Siren",
    },
    {
      name: "Garage Door Maintenance Perth",
      href: "/garage-door-maintenance-perth",
      description: "Planned servicing that catches worn springs before they fail.",
      icon: "ShieldCheck",
    },
    {
      name: "Roller Doors Perth (Residential)",
      href: "/roller-doors-perth",
      description: "Home garage roller doors — colours, sizes and prices.",
      icon: "Home",
    },
  ],

  serviceAreas: [
    "Osborne Park",
    "Balcatta",
    "Canning Vale",
    "Kwinana",
    "Cockburn Central",
    "Midland",
    "Morley",
    "Belmont",
    "Armadale",
    "Rockingham",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Silva F.",
      rating: 5,
      text: "A good company that works 24 hours. They have experience and good prices, communicate well and with respect, and make sure after the work is done that everything is working well.",
      service: "Commercial Service",
    },
  ],

  faqs: [
    {
      question: "What's the difference between a commercial roller door and a roller shutter?",
      answer:
        "A commercial roller door is a single continuous steel curtain — lighter, more affordable, and right for workshops, sheds and light-duty shopfronts. A roller shutter is built from interlocking slats, which makes it heavier, stronger and better for security-critical or very large openings like warehouses and loading docks. We install and service both, and the site visit tells us which your opening actually needs.",
    },
    {
      question: "How much does a commercial roller door cost in Perth?",
      answer:
        "New commercial and industrial doors typically range $5,000–$15,000+ supplied and installed, driven by opening size, curtain specification and the motor. A per-door service visit runs $280–$380, and motor replacements are around $770–$990 depending on the drive. Every job is quoted line by line after a site visit — no allowances that blow out later.",
    },
    {
      question: "Do commercial roller doors need to meet wind-loading standards?",
      answer:
        "Door installations should be consistent with AS/NZS 4505 (garage and shutter doors) and the wind actions standard AS/NZS 1170.2, which is what windlocked guides and reinforced bottom rails address on exposed sites. We assess the site's exposure as part of the specification, so coastal and open-industrial locations get curtains that stay in their guides in a squall.",
    },
    {
      question: "Single-phase or three-phase motor — which does my door need?",
      answer:
        "It depends on the door's weight and how many times a day it cycles. A light-commercial curtain opening a few times daily runs happily on a single-phase drive; heavy shutters and dock doors cycling constantly need a three-phase motor rated for the duty. Every powered door we fit gets a chain override, so a power cut never locks the site.",
    },
    {
      question: "How quickly can you get to a commercial breakdown?",
      answer:
        "Fast — commercial breakdowns are triaged ahead of routine work because a door that won't open is usually blocking trade, vehicles or stock. Call with the door size and the symptom, and we'll give you a realistic arrival window immediately; most metro sites see us the same day, with after-hours response available.",
    },
    {
      question: "Do you offer maintenance contracts for multiple doors?",
      answer:
        "Yes. Multi-door sites — storage facilities, factory units, loading docks — get one schedule covering every door: springs re-tensioned, guides and curtains checked, motors and safety beams tested, with a written condition report per door. Planned servicing costs a fraction of the downtime a failed spring causes mid-shift.",
    },
  ],

  cta: {
    heading: "Keep Your Doors — and Your Site — Moving",
    subtitle:
      "Tell us the opening size, what the door does all day, and what's gone wrong (if anything) — we'll come back fast with a clear plan and price.",
  },

  seo: {
    title: "Commercial Roller Doors Perth | Supply, Install, Repair",
    description:
      "Commercial roller doors and shutters for Perth warehouses, factories and shopfronts — installed, repaired and serviced. High-cycle motors, fast response.",
  },
};
