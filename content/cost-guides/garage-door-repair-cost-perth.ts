import type { CostGuidePage } from "@/types/cost-guide";

export const garageDoorRepairCostPerth: CostGuidePage = {
  slug: "garage-door-repair-cost-perth",
  pageType: "cost-guide",
  topicLabel: "Garage Door Repair",
  updatedAt: "2026-06-23",

  hero: {
    h1: "Garage Door Repair Cost Perth",
    subtitle:
      "Understand what affects garage door repair pricing and request a clear quote for your Perth property.",
  },

  directAnswer:
    "Most garage door repairs in Perth cost between $150 and $1,100. As a guide from our price list: broken springs run $240–$1,000 depending on the door and number of springs, a snapped cable is $280–$550, motor/opener repairs are $380–$490 (a full replacement is $770–$990 supplied and installed), an off-track door is $440–$770 and panel damage is $550–$1,100. After-hours emergency call-outs add a flat $500. Every job is quoted upfront before any work starts — no call-out fee to quote.",

  // Ranges mirror components/sections/smart-calculator/pricing-data.ts (the
  // single pricing source of truth, also seeded into the CMS catalog the live
  // page pins) — keep them in sync when prices change.
  costTable: {
    heading: "Garage Door Repair Cost Guide",
    intro:
      "These are the typical Perth price ranges from our own price list for the most common jobs. Your exact quote depends on the door and parts involved — we confirm it clearly before any work begins.",
    rows: [
      {
        repairType: "Broken spring (single)",
        includes: "Supply and fit of a new spring, re-tension and balance check",
        costFactors: "Spring type and size, single vs double door",
        nextStep: "Call for same-day replacement",
        priceRange: "$240–$280",
      },
      {
        repairType: "Broken springs (pair)",
        includes: "Both springs replaced together for even balance",
        costFactors: "Spring type; pairs wear together",
        nextStep: "Call for same-day replacement",
        priceRange: "$440–$550",
      },
      {
        repairType: "Cable snapped or off the drum",
        includes: "Replacing snapped or frayed cables and re-seating them on the drum",
        costFactors: "One or both cables, drum condition",
        nextStep: "Describe the issue for a faster quote",
        priceRange: "$280–$550",
      },
      {
        repairType: "Motor / opener repair",
        includes: "Diagnosing and repairing the opener motor, board or drive",
        costFactors: "Opener brand, age and fault type",
        nextStep: "Book an inspection",
        priceRange: "$380–$490",
      },
      {
        repairType: "Motor / opener replacement",
        includes: "New opener supplied, fitted and programmed, old unit removed",
        costFactors: "Motor model, door weight, rail type",
        nextStep: "Get a supplied-and-installed quote",
        priceRange: "$770–$990",
      },
      {
        repairType: "Door off track / stuck",
        includes: "Re-seating the door, straightening tracks, checking rollers",
        costFactors: "Damage extent, door size",
        nextStep: "Call now if the door is unsafe",
        priceRange: "$440–$770",
      },
      {
        repairType: "Damaged panel / section",
        includes: "Replacing a damaged panel or section to match the door",
        costFactors: "Panel availability, door brand and colour",
        nextStep: "Send a photo for a quote",
        priceRange: "$550–$1,100",
      },
      {
        repairType: "Service / tune-up",
        includes: "Full tune-up: lubricate, re-tension, balance and safety check",
        costFactors: "Door condition, any parts needed",
        nextStep: "Book an annual service",
        priceRange: "From $140 + parts",
      },
      {
        repairType: "After-hours emergency call-out",
        includes: "Priority after-hours response on top of the repair price",
        costFactors: "Time of day, urgency",
        nextStep: "Call now — 24/7",
        priceRange: "+$500",
      },
    ],
    disclaimer:
      "Ranges are indicative for typical Perth homes; the final price depends on the cause, parts required, door size, and access — confirmed before any work begins. No call-out fee to quote.",
  },

  factors: {
    heading: "Factors That Affect Cost",
    items: [
      {
        icon: "DoorOpen",
        title: "Door type",
        description: "Sectional, roller, tilt, or commercial doors all use different parts and labour time.",
      },
      {
        icon: "AlertTriangle",
        title: "Problem severity",
        description: "A simple adjustment costs less than a full spring, cable, or motor replacement.",
      },
      {
        icon: "PackageCheck",
        title: "Parts needed",
        description: "Genuine springs, cables, rollers, or opener units vary in cost by brand and size.",
      },
      {
        icon: "Clock3",
        title: "Labour time",
        description: "Quick fixes take minutes; structural repairs like track realignment take longer.",
      },
      {
        icon: "Siren",
        title: "Emergency timing",
        description: "After-hours or same-day emergency callouts are priced differently to scheduled visits.",
      },
      {
        icon: "MapPin",
        title: "Suburb/location",
        description: "Travel time across the Perth metro area can be a small factor in the final quote.",
      },
      {
        icon: "Building2",
        title: "Residential vs commercial",
        description: "Commercial doors are often larger and heavier, affecting parts and labour.",
      },
      {
        icon: "Scale",
        title: "Repair vs replacement",
        description: "Sometimes a full replacement is more cost-effective long-term than repeated repairs.",
      },
    ],
  },

  scenarios: {
    heading: "Example Scenarios",
    items: [
      {
        icon: "Radio",
        title: "Remote not working",
        mayAffectQuote: "Could be a flat battery, lost programming, or a failed receiver — usually a quick, low-cost fix unless the opener board needs replacing.",
      },
      {
        icon: "PauseCircle",
        title: "Door stuck halfway",
        mayAffectQuote: "Often a track, roller, or limit-setting issue. Cost depends on whether parts are bent, worn, or just need realigning.",
      },
      {
        icon: "Cpu",
        title: "Motor not responding",
        mayAffectQuote: "Could be a power supply, circuit board, or end-of-life motor. Age and brand of the opener affect whether repair or replacement makes sense.",
      },
      {
        icon: "Cable",
        title: "Broken spring/cable",
        mayAffectQuote: "A safety-critical repair — cost depends on spring type and whether one or both sides need replacing on a double door.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Repair vs Replace",
    intro:
      "Most issues can be repaired, but sometimes replacement is the smarter long-term option. Here's how we help you decide.",
    repairWhen: [
      "The door and frame are structurally sound",
      "Only one component has failed (spring, cable, remote, roller)",
      "The door is under 10–15 years old and otherwise reliable",
      "A repair brings it back to safe, smooth operation",
    ],
    replaceWhen: [
      "The door has multiple ageing or failing parts at once",
      "Repairs are becoming frequent or the motor is obsolete",
      "The door is damaged, rusted, or no longer insulated well",
      "You want improved security, noise, or smart-opener features",
    ],
  },

  howToQuote: {
    heading: "How to Get an Accurate Quote",
    steps: [
      {
        icon: "PhoneCall",
        title: "Tell us the issue",
        description: "Call or message us with a quick description of what your garage door is doing.",
      },
      {
        icon: "FileText",
        title: "Tell us your details",
        description: "Fill in your contact info so we can get back to you with pricing.",
      },
      {
        icon: "MapPin",
        title: "Share your suburb",
        description: "Let us know where you're located across the Perth metro area.",
      },
      {
        icon: "FileText",
        title: "Get a quote or inspection",
        description: "We'll give you a clear price or book a no-obligation inspection if needed.",
      },
      {
        icon: "Wrench",
        title: "Book repair",
        description: "Once you're happy with the quote, we'll schedule the repair at a time that suits you.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Full repair service for springs, cables, motors, tracks, and remotes across Perth.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motor Replacement Cost Perth",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new or repaired opener motor costs — supplied, installed, and programmed.",
      icon: "Cpu",
    },
    {
      name: "Spring & Cable Replacement Cost Perth",
      href: "/garage-door-spring-replacement-cost-perth",
      description: "Pricing for broken springs and cables — a single spring, a matched pair, or a full set.",
      icon: "Cable",
    },
    {
      name: "Garage Door Servicing Cost Perth",
      href: "/garage-door-service-cost-perth",
      description: "What a regular service and safety check costs — the cheapest way to avoid repairs.",
      icon: "ShieldCheck",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Same-day and after-hours response when your door is stuck, jammed, or unsafe.",
      icon: "Siren",
    },
    {
      name: "Garage Door Servicing & Maintenance Perth",
      href: "/garage-door-maintenance-perth",
      description: "Routine servicing to catch small issues before they become costly repairs.",
      icon: "Settings",
    },
  ],

  faqs: [
    {
      question: "How much does garage door repair cost in Perth?",
      answer:
        "It depends on the issue — minor adjustments are typically the most affordable, while motor, spring, cable, or track repairs cost more due to parts and labour. The best way to get an accurate figure is to send us a description of the problem so we can quote before any work begins.",
    },
    {
      question: "Can you quote without an inspection visit?",
      answer:
        "Often, yes. A clear description of the issue — the spring, cable, track, or motor, and what it's doing — lets us give you a far more accurate quote upfront, and often avoids the need for a separate inspection visit.",
    },
    {
      question: "What affects the cost?",
      answer:
        "Door type, the severity of the problem, parts required, labour time, whether it's an emergency, your suburb, and whether residential or commercial all play a role. We confirm the final price on inspection before starting any work.",
    },
    {
      question: "Is emergency repair more expensive?",
      answer:
        "Same-day or after-hours emergency callouts are generally priced differently from scheduled appointments, since they require priority response outside normal hours. Standard bookings during business hours are usually the more cost-effective option if your door is still safely operable.",
    },
    {
      question: "Is it better to repair or replace?",
      answer:
        "If only one part has failed and the door is otherwise in good condition, a repair is usually the most cost-effective option. If your door has multiple ageing components, frequent breakdowns, or visible damage, replacement may offer better value long-term. We'll give you honest advice either way.",
    },
    {
      question: "Do you repair motors, springs, and cables?",
      answer:
        "Yes — our technicians repair and replace garage door motors, torsion and extension springs, cables, tracks, rollers, and remotes across the Perth metro area.",
    },
  ],

  cta: {
    heading: "Want a Clear Garage Door Repair Quote?",
    subtitle:
      "Tell us what's happening and we'll get back to you with a straightforward quote — no call-out fee to ask.",
  },

  seo: {
    title: "Garage Door Repair Cost Perth | Capital Garage Door",
    description:
      "Garage door repair costs in Perth: springs $240–$1,000, cables $280–$550, motors $380–$990, off-track doors $440–$770. Real ranges, quoted upfront.",
  },
};
