import type { CostGuidePage } from "@/types/cost-guide";

export const garageDoorSpringReplacementCostPerth: CostGuidePage = {
  slug: "garage-door-spring-replacement-cost-perth",
  pageType: "cost-guide",
  topicLabel: "Spring & Cable Replacement",
  updatedAt: "2026-07-11",

  hero: {
    h1: "Garage Door Spring & Cable Replacement Cost Perth",
    subtitle:
      "What it costs to replace broken garage door springs and cables in Perth — real price-list ranges, with your exact quote confirmed before any work starts.",
  },

  directAnswer:
    "Garage door spring replacement in Perth typically costs $240–$280 for a single spring, $440–$550 for a matched pair, and $660–$1,000 for heavier three- or four-spring doors. If your springs are intact but slipped, a re-fit and re-tension is $280–$330. Cable replacement runs $280–$550 depending on whether one or both cables need doing and the drum condition. After-hours emergency call-outs add a flat $500. Springs and cables are under high tension and safety-critical — every job is quoted upfront and no call-out fee to quote.",

  // Ranges mirror components/sections/smart-calculator/pricing-data.ts (the
  // single pricing source of truth, also seeded into the CMS catalog this
  // page pins) — keep them in sync when prices change.
  costTable: {
    heading: "Spring & Cable Replacement Cost Guide",
    intro:
      "These are the typical Perth price ranges from our own price list for spring and cable work. Your exact quote depends on the door, the spring type, and how many parts need replacing — we confirm it clearly before any work begins.",
    rows: [
      {
        repairType: "Broken spring (single)",
        includes: "Supply and fit of one new spring, re-tension and balance check",
        costFactors: "Spring type and size, single vs double door",
        nextStep: "Call for same-day replacement",
        priceRange: "$240–$280",
      },
      {
        repairType: "Broken springs (pair)",
        includes: "Both springs replaced together for even balance",
        costFactors: "Pairs are replaced together for even balance",
        nextStep: "Call for same-day replacement",
        priceRange: "$440–$550",
      },
      {
        repairType: "Springs (×3)",
        includes: "Three springs supplied and fitted for larger or heavier doors",
        costFactors: "Door size and weight",
        nextStep: "Call for same-day replacement",
        priceRange: "$660–$770",
      },
      {
        repairType: "Springs (×4)",
        includes: "Four springs for oversized or commercial doors",
        costFactors: "Door width and weight",
        nextStep: "Call for same-day replacement",
        priceRange: "$880–$1,000",
      },
      {
        repairType: "Spring re-fit / re-tension",
        includes: "Re-tensioning or re-fitting springs that have slipped or lost balance",
        costFactors: "Spring condition, door weight and balance",
        nextStep: "Book a quick adjustment",
        priceRange: "$280–$330",
      },
      {
        repairType: "Cable snapped or off the drum",
        includes: "Replacing snapped or frayed cables and re-seating them on the drum",
        costFactors: "One or both cables, drum condition",
        nextStep: "Describe the issue for a fast quote",
        priceRange: "$280–$550",
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
      "Ranges are indicative for typical Perth homes; the final price depends on the spring type, cable condition, door size, and access — confirmed before any work begins. No call-out fee to quote.",
  },

  factors: {
    heading: "Factors That Affect Spring & Cable Cost",
    items: [
      {
        icon: "RefreshCw",
        title: "Number of springs",
        description: "A single-spring door is cheaper than a double, and heavier doors may run three or four springs.",
      },
      {
        icon: "Scale",
        title: "Spring type & size",
        description: "Torsion and extension springs are rated by wire size, length, and door weight — heavier doors cost more.",
      },
      {
        icon: "Cable",
        title: "One or both cables",
        description: "Cables usually wear in pairs; replacing both at once avoids a repeat call-out and keeps the door balanced.",
      },
      {
        icon: "DoorOpen",
        title: "Door weight & size",
        description: "Larger, insulated, or double doors put more load on springs and cables, which affects the parts needed.",
      },
      {
        icon: "Settings",
        title: "Drum & hardware condition",
        description: "Worn drums, bearings, or brackets discovered during the repair can add to the quote.",
      },
      {
        icon: "Siren",
        title: "Emergency timing",
        description: "After-hours or same-day emergency call-outs are priced differently to a scheduled visit.",
      },
    ],
  },

  scenarios: {
    heading: "Example Scenarios",
    items: [
      {
        icon: "AlertTriangle",
        title: "Loud bang, door won't lift",
        mayAffectQuote: "A snapped torsion spring is the usual cause. Cost depends on spring type and whether it's a single or double door needing a matched pair.",
      },
      {
        icon: "Scale",
        title: "Door heavy or uneven",
        mayAffectQuote: "Often a spring that's lost tension or a stretched cable. A re-fit and re-tension is cheaper than a full replacement if the parts are still sound.",
      },
      {
        icon: "Cable",
        title: "Cable hanging loose or off the drum",
        mayAffectQuote: "A safety-critical fix — cost depends on whether one or both cables are affected and the condition of the drum they wind onto.",
      },
      {
        icon: "PauseCircle",
        title: "Door drops or slams shut",
        mayAffectQuote: "A sign of failed springs or cables holding the door's weight. This is unsafe to operate — we prioritise these and quote before starting.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Replace One Spring or Both?",
    intro:
      "On a double-spring door we usually recommend replacing both springs together — here's why, and when a single replacement makes sense.",
    repairWhen: [
      "Your door runs a single spring that has failed",
      "The second spring is newer and still within its rated cycles",
      "You need the cheapest safe fix to get the door working today",
      "The cables and drums are in good condition",
    ],
    replaceWhen: [
      "Both springs are the original pair and one has broken",
      "The springs are the same age and near end of life",
      "You want to avoid a second call-out when the other soon fails",
      "The door is heavy, insulated, or gets heavy daily use",
    ],
  },

  howToQuote: {
    heading: "How to Get an Accurate Spring & Cable Quote",
    steps: [
      {
        icon: "PhoneCall",
        title: "Tell us the symptom",
        description: "Call or message us — a loud bang, a heavy door, or a loose cable each point to a different fix.",
      },
      {
        icon: "DoorOpen",
        title: "Tell us the door",
        description: "Single or double door, and roller, sectional, or tilt — this tells us the likely spring type.",
      },
      {
        icon: "MapPin",
        title: "Share your suburb",
        description: "Let us know where you are across the Perth metro area.",
      },
      {
        icon: "FileText",
        title: "Get your quote",
        description: "We'll give you a clear price for a single, pair, or full set — confirmed before any work starts.",
      },
      {
        icon: "Wrench",
        title: "Book the repair",
        description: "Happy with the quote? We'll fit new springs or cables, re-tension, and safety-test the door.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Full repair service for springs, cables, motors, tracks, and rollers across Perth.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "The full price guide across every common garage door repair, not just springs and cables.",
      icon: "FileText",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Same-day and after-hours response when a broken spring or cable leaves your door stuck.",
      icon: "Siren",
    },
    {
      name: "Garage Door Servicing Cost Perth",
      href: "/garage-door-service-cost-perth",
      description: "What a regular service costs — the best way to catch worn springs and cables early.",
      icon: "ShieldCheck",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a garage door spring in Perth?",
      answer:
        "A single spring is typically $240–$280 supplied and fitted, and a matched pair is $440–$550. Heavier doors running three or four springs range from $660 up to $1,000. The exact price depends on the spring type and size, and whether it's a single or double door — we confirm it before any work begins.",
    },
    {
      question: "How much does garage door cable replacement cost?",
      answer:
        "Cable replacement in Perth is typically $280–$550. The range covers whether one or both cables need doing, the condition of the drums they wind onto, and whether the door has dropped or jammed. Cables often wear in pairs, so we'll advise if replacing both saves you a repeat call-out.",
    },
    {
      question: "Should I replace both springs or just the broken one?",
      answer:
        "On a double-spring door we usually recommend replacing both. They wear at the same rate, so once one breaks the other is often close behind — replacing the pair keeps the door balanced and avoids a second call-out. If your door only ever had a single spring, we simply replace that one.",
    },
    {
      question: "Can I replace a garage door spring myself?",
      answer:
        "We don't recommend it. Torsion and extension springs are under extreme tension and can cause serious injury if released incorrectly. It's one of the most common DIY jobs that ends in an emergency call-out — a trained technician has the tools to do it safely and correctly.",
    },
    {
      question: "Is a broken spring or cable an emergency?",
      answer:
        "It can be. A door with a snapped spring or cable can be too heavy to lift, drop unexpectedly, or be left open and insecure. If your door is stuck or unsafe, call us — we offer same-day and after-hours response, with the after-hours call-out adding a flat $500 on top of the repair.",
    },
    {
      question: "How long do garage door springs last?",
      answer:
        "Most springs are rated for around 10,000–15,000 cycles — roughly 7–12 years for an average household, less with heavy daily use. A regular service that re-tensions and lubricates the springs helps them reach the top of that range and flags wear before they snap.",
    },
  ],

  cta: {
    heading: "Broken Spring or Cable? Get a Clear Quote",
    subtitle:
      "Tell us what your door is doing and we'll get back to you with a straightforward price — no call-out fee to ask.",
  },

  seo: {
    title: "Garage Door Spring & Cable Replacement Cost Perth",
    description:
      "Garage door spring replacement cost in Perth: single $240–$280, pair $440–$550, heavy doors to $1,000. Cable replacement $280–$550. Quoted upfront.",
  },
};
