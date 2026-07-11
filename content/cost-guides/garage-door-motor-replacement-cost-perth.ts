import type { CostGuidePage } from "@/types/cost-guide";

export const garageDoorMotorReplacementCostPerth: CostGuidePage = {
  slug: "garage-door-motor-replacement-cost-perth",
  pageType: "cost-guide",
  topicLabel: "Motor / Opener Replacement",
  updatedAt: "2026-07-11",

  hero: {
    h1: "Garage Door Motor Replacement Cost Perth",
    subtitle:
      "What it costs to replace or repair a garage door motor in Perth — real price-list ranges for a new opener, remotes, and smart control, quoted upfront.",
  },

  directAnswer:
    "A new garage door motor in Perth is typically $770–$990 supplied, installed, and programmed, including remotes. If the existing opener can be saved, a motor repair is $380–$490. Adding WiFi or smart control to a compatible opener is $280–$380, and extra or replacement remotes are $95 each plus $120 to attend and program them. Roller-door and sectional-door motors differ, and battery backup or smart features add to the price. After-hours call-outs add a flat $500. Every job is quoted upfront — no call-out fee to quote.",

  // Ranges mirror components/sections/smart-calculator/pricing-data.ts (the
  // single pricing source of truth, also seeded into the CMS catalog this
  // page pins) — keep them in sync when prices change.
  costTable: {
    heading: "Garage Door Motor Replacement Cost Guide",
    intro:
      "These are the typical Perth price ranges from our own price list for opener and motor work. Whether repair or replacement is the better value depends on the opener's age and fault — we'll advise honestly and quote before any work begins.",
    rows: [
      {
        repairType: "Motor / opener replacement",
        includes: "New opener supplied, installed and programmed, old unit removed",
        costFactors: "Motor model, door weight, rail type",
        nextStep: "Get a supplied-and-installed quote",
        priceRange: "$770–$990",
      },
      {
        repairType: "Motor / opener repair",
        includes: "Diagnosing and repairing the opener motor, board or drive",
        costFactors: "Opener brand, age and fault type",
        nextStep: "Book an inspection",
        priceRange: "$380–$490",
      },
      {
        repairType: "WiFi / smart control",
        includes: "Adding WiFi/smart control to a compatible opener",
        costFactors: "Opener compatibility, app or hub required",
        nextStep: "Check your opener is smart-ready",
        priceRange: "$280–$380",
      },
      {
        repairType: "Remote (extra / replacement)",
        includes: "Supplying and programming extra or replacement remotes",
        costFactors: "Remotes needed, opener compatibility",
        nextStep: "Tell us your opener brand",
        priceRange: "$95 each + $120 to attend",
      },
      {
        repairType: "After-hours emergency call-out",
        includes: "Priority after-hours response on top of the job price",
        costFactors: "Time of day, urgency",
        nextStep: "Call now — 24/7",
        priceRange: "+$500",
      },
    ],
    disclaimer:
      "Ranges are indicative for typical Perth homes; the final price depends on the opener model, door type and weight, and whether smart or battery-backup features are added — confirmed before any work begins. No call-out fee to quote.",
  },

  factors: {
    heading: "What Affects Motor Replacement Cost",
    items: [
      {
        icon: "Cpu",
        title: "Opener model",
        description: "Entry-level, heavy-duty, and quiet belt-drive motors sit at different price points and suit different doors.",
      },
      {
        icon: "DoorOpen",
        title: "Door type & weight",
        description: "Roller-door and sectional-door motors differ, and heavier or insulated doors need a stronger opener.",
      },
      {
        icon: "Plug",
        title: "Smart & WiFi features",
        description: "WiFi/app control and battery backup add to the price but let you operate and monitor the door remotely.",
      },
      {
        icon: "Radio",
        title: "Remotes & keypads",
        description: "Extra remotes are $95 each plus a one-off $120 to attend and program, regardless of how many you add.",
      },
      {
        icon: "Scale",
        title: "Repair vs replace",
        description: "If the fault is minor a $380–$490 repair may be enough; an obsolete or worn motor is better replaced.",
      },
      {
        icon: "Siren",
        title: "Emergency timing",
        description: "After-hours or same-day call-outs are priced differently to a scheduled replacement.",
      },
    ],
  },

  scenarios: {
    heading: "Example Scenarios",
    items: [
      {
        icon: "Cpu",
        title: "Motor hums but won't move the door",
        mayAffectQuote: "Could be a capacitor, gear, or drive fault. If economically repairable it's $380–$490; if the motor is worn out, a replacement makes more sense.",
      },
      {
        icon: "Radio",
        title: "Remote stopped working",
        mayAffectQuote: "Often a flat battery or lost programming — a low-cost fix. A new remote is $95 plus $120 to attend and program it to your opener.",
      },
      {
        icon: "RefreshCw",
        title: "Old opener, want it quieter and smarter",
        mayAffectQuote: "A new $770–$990 opener with a belt drive and WiFi runs quieter and adds app control, battery backup, and modern safety features.",
      },
      {
        icon: "AlertTriangle",
        title: "Motor not responding at all",
        mayAffectQuote: "Could be a power-supply, board, or end-of-life motor. The opener's age and brand decide whether repair or replacement is the better value.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Repair or Replace the Motor?",
    intro:
      "A minor fault is often worth repairing, but an ageing or obsolete opener is usually better replaced — here's how we help you decide.",
    repairWhen: [
      "The opener is only a few years old and well-supported",
      "The fault is a single part — a gear, capacitor, or board",
      "Remotes and safety sensors still work correctly",
      "A repair restores quiet, reliable operation",
    ],
    replaceWhen: [
      "The motor is obsolete or parts are hard to source",
      "It's noisy, slow, or failing repeatedly",
      "You want WiFi control, battery backup, or better security",
      "Repair costs are approaching the price of a new opener",
    ],
  },

  howToQuote: {
    heading: "How to Get an Accurate Motor Quote",
    steps: [
      {
        icon: "PhoneCall",
        title: "Tell us the symptom",
        description: "Humming, no response, a dead remote — each points to a different repair or replacement.",
      },
      {
        icon: "Cpu",
        title: "Tell us the opener",
        description: "The brand and rough age if you know it, so we can advise on repair parts or a suitable new motor.",
      },
      {
        icon: "DoorOpen",
        title: "Tell us the door",
        description: "Roller, sectional, or tilt, and single or double — this sets the motor size you need.",
      },
      {
        icon: "FileText",
        title: "Get your quote",
        description: "We'll give you a clear supplied-and-installed price, including remotes and any smart features.",
      },
      {
        icon: "Wrench",
        title: "Book the work",
        description: "Happy with the quote? We'll fit and program the opener and remove the old unit.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Garage Door Motors Perth",
      href: "/garage-door-motors-perth",
      description: "Our Capital 1100N and 1500N openers — quiet, smart-ready motors supplied and installed.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Full repair service for motors, springs, cables, tracks, and remotes across Perth.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "The full price guide across every common garage door repair, not just the motor.",
      icon: "FileText",
    },
    {
      name: "Garage Door Servicing Cost Perth",
      href: "/garage-door-service-cost-perth",
      description: "Regular servicing keeps the opener running and extends the life of the motor.",
      icon: "ShieldCheck",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a garage door motor in Perth?",
      answer:
        "A new garage door motor is typically $770–$990 supplied, installed, and programmed, including remotes and removal of the old unit. The exact price depends on the opener model, your door type and weight, and whether you add smart control or battery backup. We confirm the price before any work begins.",
    },
    {
      question: "Is it cheaper to repair or replace a garage door motor?",
      answer:
        "If the opener is only a few years old and the fault is a single part, a repair at $380–$490 is usually the cheaper option. If the motor is obsolete, noisy, or failing repeatedly, replacement at $770–$990 is better long-term value — and adds modern safety and smart features. We'll advise honestly either way.",
    },
    {
      question: "How much does a roller door motor replacement cost?",
      answer:
        "Roller-door motor replacement falls in the same $770–$990 supplied-and-installed range as sectional-door openers, though the motor type differs. The final price depends on the door's weight and size and whether you want smart or battery-backup features — we quote it upfront once we know the door.",
    },
    {
      question: "How much are extra garage door remotes?",
      answer:
        "Remotes are $95 each, plus a one-off $120 to attend and program them to your motor — that $120 is charged once no matter how many remotes you add. To make sure we bring compatible remotes, let us know the brand and model of your opener when you book.",
    },
    {
      question: "Can I add WiFi or smart control to my existing opener?",
      answer:
        "Often, yes. If your opener is smart-compatible, adding WiFi/app control is $280–$380. If it isn't, a new smart-ready opener may be the better value. Tell us your opener brand and model and we'll confirm whether it can be upgraded or is best replaced.",
    },
    {
      question: "How long does a garage door motor last?",
      answer:
        "A quality opener typically lasts 10–15 years, depending on how often the door is used and whether it's serviced. Regular servicing, keeping the door balanced, and lubricating the moving parts all reduce the load on the motor and help it reach the top of that range.",
    },
  ],

  cta: {
    heading: "Need a New or Repaired Garage Door Motor?",
    subtitle:
      "Tell us your opener and door and we'll get back to you with a clear price — no call-out fee to ask.",
  },

  seo: {
    title: "Garage Door Motor Replacement Cost Perth",
    description:
      "Garage door motor replacement cost in Perth: new opener $770–$990 installed, motor repair $380–$490, smart control $280–$380, remotes $95 each. Quoted upfront.",
  },
};
