import type { ComparisonPage } from "@/types/comparison-page";

export const rollerDoorVsSectionalDoor: ComparisonPage = {
  slug: "roller-door-vs-sectional-door",
  pageType: "comparison",
  topicLabel: "Roller Door vs Sectional Door",
  updatedAt: "2026-06-23",

  hero: {
    h1: "Roller Door vs Sectional Door: Which Is Better?",
    subtitle:
      "Both are popular choices for Perth homes, but they suit different garages. Compare design, cost, space requirements, maintenance, and day-to-day performance to find the door that's right for your property.",
  },

  directAnswer:
    "For most Perth homes with a standard-depth garage, a sectional door offers better insulation, a cleaner look, and easier integration with smart openers — making it the better long-term choice. A roller door is usually the better fit for garages with limited headroom, tighter budgets, or where simple, low-maintenance operation matters more than appearance. If you're unsure which applies to your garage, a quick on-site measure from a technician settles it in minutes.",

  comparisonTable: {
    optionALabel: "Roller Door",
    optionBLabel: "Sectional Door",
    rows: [
      {
        feature: "Appearance",
        optionA: "Simple curved profile; functional rather than decorative",
        optionB:
          "Flat panel sections with finish options — wood-look, ribbed, flush — for a more architectural look",
      },
      {
        feature: "Space requirements",
        optionA: "Curls into a compact roll above the opening — ideal for low headroom or shallow garages",
        optionB: "Needs more headroom and ceiling clearance to track back and overhead",
      },
      {
        feature: "Cost factors",
        optionA: "Lower upfront cost; fewer moving parts to manufacture and install",
        optionB: "Higher upfront cost; more panels, hardware, and insulation typically included",
      },
      {
        feature: "Maintenance",
        optionA: "Minimal — occasional lubrication of the roll mechanism and guide tracks",
        optionB: "Moderate — hinges, rollers, and panel seals benefit from periodic checks",
      },
      {
        feature: "Automation",
        optionA: "Compatible with most standard openers; simpler drive mechanism",
        optionB: "Wide compatibility with smart openers, including quieter belt-drive systems",
      },
      {
        feature: "Noise",
        optionA: "Can be noisier in operation due to the rolling curtain mechanism",
        optionB: "Generally quieter, especially with a belt-drive opener",
      },
      {
        feature: "Insulation",
        optionA: "Single-skin steel is standard; insulated roller options exist but are less common",
        optionB: "Commonly available with foam-core insulated panels — better thermal and noise performance",
      },
      {
        feature: "Best for",
        optionA: "Tight garages, budget-conscious installs, low-maintenance priorities",
        optionB: "Insulated garages, home gyms/workshops, street-facing aesthetics",
      },
    ],
  },

  optionA: {
    name: "Roller Door",
    icon: "Move",
    summary:
      "A roller door is a single curtain of interlocking steel slats that rolls up into a compact barrel above the opening. It's a proven, low-fuss option that's been a standard choice for Perth garages for decades, especially where space is tight or budget is the deciding factor.",
    benefits: [
      "Compact roll-up design suits garages with limited headroom",
      "Generally the lower-cost option to buy and install",
      "Fewer moving parts means less to go wrong long-term",
      "Widely available, so parts and servicing are easy to source in Perth",
    ],
    limitations: [
      "Less thermal and acoustic insulation than a sectional door, unless an insulated variant is chosen",
      "Curved profile offers fewer style and finish options than flat panel doors",
      "Can be louder in operation than a quality sectional door",
    ],
    bestFor: [
      "Garages with shallow ceiling space or low headroom",
      "Investment properties or budget-focused renovations",
      "Homeowners who don't need insulation as a priority",
    ],
  },

  optionB: {
    name: "Sectional Door",
    icon: "Layers",
    summary:
      "A sectional door is made up of several horizontal panels hinged together, which travel up and back along tracks to sit flush against the garage ceiling. It's the more design-forward option, with finishes that suit modern Perth streetscapes and stronger insulation for garages used as more than storage.",
    benefits: [
      "Stronger insulation options, ideal for garages used as workshops, gyms, or living-adjacent spaces",
      "Broader range of finishes and colours to match the home's facade",
      "Quieter operation, particularly when paired with a belt-drive opener",
      "Flush panel design gives a tidy, finished appearance from the street",
    ],
    limitations: [
      "Requires more ceiling and side-room clearance than a roller door",
      "Higher upfront cost due to panel construction and hardware",
      "More components (hinges, rollers, seals) to maintain over time",
    ],
    bestFor: [
      "Homes where street appeal and facade finish matter",
      "Garages doubling as a workshop, gym, or storage room needing insulation",
      "Owners upgrading to a quieter, smart-opener-compatible door",
    ],
  },

  decisionCards: [
    {
      heading: "Choose a roller door if...",
      icon: "Move",
      tone: "optionA",
      points: [
        "Your garage has limited headroom or a shallow ceiling cavity",
        "Keeping the upfront cost down is the main priority",
        "You want a simple, low-maintenance door with minimal moving parts",
        "Insulation and noise levels aren't a major concern",
      ],
    },
    {
      heading: "Choose a sectional door if...",
      icon: "Layers",
      tone: "optionB",
      points: [
        "Your garage doubles as a workshop, gym, or storage area that benefits from insulation",
        "You want a wider range of finishes to match your home's exterior",
        "Quiet operation and smart opener compatibility matter to you",
        "You have adequate ceiling and side clearance for the tracking system",
      ],
    },
    {
      heading: "Ask a technician if...",
      icon: "HelpCircle",
      tone: "uncertain",
      points: [
        "You're not sure how much headroom or side clearance your garage actually has",
        "You're comparing quotes and want to know which option suits your specific opening size",
        "Your garage has an unusual shape, low bulkhead, or unusual roof pitch",
        "You want a recommendation based on your home's layout, not a general rule of thumb",
      ],
    },
  ],

  relatedServices: [
    {
      name: "Roller Door Installation Perth",
      href: "/roller-door-installation-perth",
      description: "Supply and installation of new roller doors, sized and fitted for your garage opening.",
      icon: "Move",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "Insulated sectional door supply and installation, with a range of panel finishes.",
      icon: "Layers",
    },
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description:
        "Full installation service for any garage door type, including site measure and removal of the old door.",
      icon: "DoorOpen",
    },
    {
      name: "Garage Door Motor Replacement Perth",
      href: "/garage-door-motor-replacement-perth",
      description:
        "Replace an ageing or faulty motor with a quieter, smart-compatible opener — suits both door types.",
      icon: "Cpu",
    },
  ],

  faqs: [
    {
      question: "Which is cheaper: a roller door or a sectional door?",
      answer:
        "A roller door is typically the cheaper option upfront, since it uses a simpler curtain mechanism with fewer parts. A sectional door costs more to buy and install because of its multi-panel construction and additional hardware, but it often includes better insulation as standard, which can offset some of the cost difference over time.",
    },
    {
      question: "Can a sectional door fit in a garage with low headroom?",
      answer:
        "It depends on the available bulkhead space above the opening. Sectional doors need more clearance to track back along the ceiling than roller doors, which roll into a compact barrel. If your garage has limited headroom, a roller door is usually the safer fit — a technician can measure your specific opening to confirm what will work.",
    },
    {
      question: "Is a roller door or sectional door quieter?",
      answer:
        "Sectional doors are generally quieter in operation, especially when paired with a belt-drive opener rather than a chain-drive. Roller doors can be louder because the rolling steel curtain creates more mechanical noise as it moves, though a well-maintained roller door is still reasonably quiet.",
    },
    {
      question: "Which door type offers better insulation?",
      answer:
        "Sectional doors usually offer better insulation, since foam-core insulated panels are a common standard option. Roller doors are typically single-skin steel, though insulated roller variants do exist. If your garage is used as a workshop, gym, or temperature-sensitive storage space, a sectional door is generally the stronger choice.",
    },
    {
      question: "Do both roller doors and sectional doors work with automatic openers?",
      answer:
        "Yes, both door types are compatible with automatic openers, including smart, app-controlled systems. Sectional doors have slightly wider compatibility with quieter belt-drive openers, while roller doors typically pair with simpler chain or screw-drive systems.",
    },
    {
      question: "How do I know which garage door is right for my home?",
      answer:
        "The right choice depends on your garage's headroom, how the space is used, your budget, and the look you want from the street. As a general rule, roller doors suit tighter spaces and lower budgets, while sectional doors suit insulated, design-focused installs. If you're unsure, a technician can assess your garage and recommend the best fit in a short on-site visit.",
    },
  ],

  cta: {
    heading: "Need help choosing the right garage door?",
    subtitle:
      "Every garage is different. Our technicians can measure your space, talk through your budget, and recommend the door that actually suits your home — no guesswork required.",
  },

  seo: {
    title: "Roller Door vs Sectional Door: Which Is Better? | Capital Garage Door",
    description:
      "Compare roller doors and sectional doors on design, cost, space, maintenance, and insulation to find the best fit for your Perth garage. Get expert advice today.",
  },
};
