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
    "Garage door repair cost in Perth depends on the type of door, the problem, parts required, urgency, and site access. Minor adjustments are usually simpler, while motor, spring, cable, or track repairs may require replacement parts and more labour. The most accurate way to get a price is to tell us what's happening — a photo or short video helps us quote faster.",

  costTable: {
    heading: "Garage Door Repair Cost Guide",
    intro:
      "Every repair is different, so we've broken down the most common jobs by what's involved rather than a single fixed price. Send us the details and we'll confirm a clear quote before any work begins.",
    rows: [
      {
        repairType: "Minor adjustment",
        includes: "Realigning sensors, lubricating moving parts, tightening hardware, tension tweaks",
        costFactors: "Door type, time on site",
        nextStep: "Request a quick quote",
      },
      {
        repairType: "Remote issue",
        includes: "Remote/sensor diagnosis, reprogramming, or replacing a faulty remote or receiver",
        costFactors: "Remote model, opener compatibility",
        nextStep: "Send us the opener brand",
      },
      {
        repairType: "Motor repair/replacement",
        includes: "Diagnosing the opener motor, repairing or replacing it with a compatible unit",
        costFactors: "Motor brand, age, door weight",
        nextStep: "Book an inspection",
      },
      {
        repairType: "Spring or cable repair",
        includes: "Replacing a broken torsion or extension spring, or a frayed/snapped cable",
        costFactors: "Spring type, single vs double door",
        nextStep: "Send a photo for a faster quote",
      },
      {
        repairType: "Track/roller repair",
        includes: "Straightening or replacing bent tracks, worn rollers, or hinges",
        costFactors: "Damage extent, door size",
        nextStep: "Upload a photo or video",
      },
      {
        repairType: "Emergency repair",
        includes: "Same-day or after-hours response for a door stuck open, shut, or unsafe",
        costFactors: "Time of day, callout urgency",
        nextStep: "Call now for priority booking",
      },
    ],
    disclaimer:
      "Final pricing depends on the cause, parts required, door size, and access — confirmed before any work begins. No call-out fee to quote.",
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
        icon: "Camera",
        title: "Upload a photo/video",
        description: "A short clip or photo of the problem helps us quote accurately before we arrive.",
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
      name: "Garage Door Motor Replacement Perth",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "Replace an ageing or faulty opener motor with a quieter, smart-compatible unit.",
      icon: "Cpu",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repair-cost-perth",
      description: "Same-day and after-hours response when your door is stuck, jammed, or unsafe.",
      icon: "Siren",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-repairs-perth",
      description: "Routine servicing to catch small issues before they become costly repairs.",
      icon: "Settings",
    },
  ],

  faqs: [
    {
      question: "How much does garage door repair cost in Perth?",
      answer:
        "It depends on the issue — minor adjustments are typically the most affordable, while motor, spring, cable, or track repairs cost more due to parts and labour. The best way to get an accurate figure is to send us a description or photo of the problem so we can quote before any work begins.",
    },
    {
      question: "Can you quote from a photo?",
      answer:
        "Yes. A clear photo or short video of the issue — the spring, cable, track, or motor — lets us give you a far more accurate quote upfront, and often avoids the need for a separate inspection visit.",
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
      "Tell us what's happening, upload a photo if you can, and we'll get back to you with a straightforward quote — no call-out fee to ask.",
  },

  seo: {
    title: "Garage Door Repair Cost Perth | Capital Garage Door",
    description:
      "See what affects garage door repair pricing in Perth — common repair types, cost factors, and how to get an accurate quote from Capital Garage Door.",
  },
};
