import type { StaticCostGuideSource } from "@/types/cost-guide";

/**
 * /roller-door-prices-perth: what a roller door costs in Perth, new and repaired.
 * A static cost guide (repo-only, deployed with the code, never a CMS page). Every price is a
 * {{price:<key>}} token that lib/data/static-cost-guides.ts fills from the live price catalog,
 * so this file must never hold a literal dollar figure.
 *
 * Keywords (2026-11-01, docs/seo/serp-pulls-2026-11-01.md; Google Ads Perth unless marked):
 *   primary    "roller door prices perth" — Search Console 598 impressions @ 29.9 (home page) and
 *              241 @ 11.2 (/roller-doors-perth) in 90 days, 0 clicks; Keyword Planner groups it
 *              with "roller doors perth prices" 110/mo and "garage roller doors perth prices" 110
 *   secondary  "roller door prices" 302 impr @ 13.7 (40/mo), "roller door cost" (40/mo, AU 720),
 *              "roll a door prices" 181 impr, "roller door sizes and prices" 90 impr @ 8.4,
 *              "double roller door prices perth" (related search), "garage roller door replacement
 *              cost" 30 impr
 * The live Perth SERP's AI Overview quotes competitor price pages (Gryphon, Perth Garage Door
 * Company, Slide & Glide, B&D's price guide); the organic results are Steel-Line, Tower, Door
 * Supply, Reddit and our own industrial roller door page at #7. PAA: 6 m wide roller door, door
 * lifespan, sectional door price, motor replacement cost, repair vs replace.
 * Cannibalisation guard: /roller-doors-perth owns the product intent ("roller doors perth",
 * colours, sizes, supply & install); this guide owns "roller door prices / cost". /cost-guides
 * owns the site-wide "garage door prices" list. Re-check the split 4–6 weeks after launch.
 * Owner decision pending (growth-plan to-do #7): single/double roller bands by size. Until the
 * owner supplies them, the guide uses the catalog's standard new-door range only.
 */
const REVIEWED_AT = "2026-11-01";

export const rollerDoorPricesPerth: StaticCostGuideSource = {
  slug: "roller-door-prices-perth",
  pageType: "cost-guide",
  topicLabel: "Roller Doors",
  reviewedAt: REVIEWED_AT,

  // Table order first; "new-custom" and "after-hours" are used in the copy only.
  pricingPins: [
    "new-standard",
    "motor-replace",
    "roller-reinstall",
    "spring-x1",
    "roller-lock",
    "service",
    "commercial-roller",
    "new-custom",
    "after-hours",
  ],

  hero: {
    h1: "Roller Door Prices Perth",
    subtitle:
      "What a roller door costs in Perth from our current price list: a new door supplied and installed, a motor, a removal and refit, and the common roller door repairs.",
  },

  directAnswer:
    "A new roller door in Perth costs {{price:new-standard}} supplied and installed, including removal of your old door and new guides and hardware; a single door sits toward the lower end of that range and a wide double door toward the top. Adding a roller door motor is {{price:motor-replace}}, programmed with remotes. Oversized and commercial roller doors are made to the opening, usually {{price:new-custom}}. Every figure is confirmed in a fixed written quote after we measure.",

  costTable: {
    heading: "Roller Door Prices in Perth: New Doors, Motors & Repairs",
    intro:
      "Guide prices from our current list for a new roller door and the jobs that go with owning one. The width of the opening, the curtain profile and colour, and whether you want it motorised decide the final figure, which you'll have in writing before anything is ordered.",
    rowHeader: "Door / Job",
    // Each row's includes / cost factors / next step come from the live catalog row when it has
    // them; the text here fills any column the catalog leaves blank.
    rows: [
      {
        key: "new-standard",
        label: "New roller door (supply & install)",
        includes: "New Colorbond-style roller door, guides and hardware fitted, old door removed",
        costFactors: "Opening width and height, curtain profile and colour, single or double",
        nextStep: "Book a measure-and-quote visit",
      },
      {
        key: "motor-replace",
        label: "Roller door motor (supply & install)",
        includes: "Roller door opener fitted to the drum, programmed, with remotes",
        costFactors: "Door size and weight, motor model, battery backup or app control",
        nextStep: "Choose the motor with your new door",
      },
      {
        key: "roller-reinstall",
        includes: "Taking your roller door down and refitting it after rendering or building work",
        costFactors: "Door width, site access, condition of the curtain and springs",
        nextStep: "Tell us when the building work is booked",
      },
      {
        key: "spring-x1",
        label: "Roller door spring (single)",
        includes: "New spring fitted inside the drum, curtain re-tensioned and tested",
        costFactors: "Door size and weight, spring type, access to the drum",
        nextStep: "Send a photo of the door and describe how it fails",
      },
      {
        key: "roller-lock",
        label: "Roller door lock & lock arms",
        includes: "New centre lock and lock arms fitted to the curtain, keys supplied",
        costFactors: "Lock type, curtain condition, whether the arms are bent or seized",
        nextStep: "Book a lock replacement visit",
      },
      {
        key: "service",
        label: "Roller door service / tune-up",
        includes: "Spring tension, guides, drum, lock and motor checked, lubricated and adjusted",
        costFactors: "Door age and condition, any parts found worn on the day",
        nextStep: "Book an annual service",
      },
      {
        key: "commercial-roller",
        label: "Commercial roller door service or repair (from)",
        includes: "A starting guide for servicing or a straightforward repair on a commercial roller door",
        costFactors: "Door size, duty cycle, motor type, parts needed",
        nextStep: "Send the door size and a photo for a firm quote",
      },
    ],
  },

  factors: {
    heading: "What Changes the Price of a Roller Door",
    items: [
      {
        icon: "Ruler",
        title: "Width and height",
        description:
          "A single-car roller door is the simplest and cheapest new door we fit. A double door needs a longer, heavier curtain, a bigger drum and stronger springs, which is why it sits toward the top of the {{price:new-standard}} range.",
      },
      {
        icon: "Palette",
        title: "Curtain profile and colour",
        description:
          "A standard steel curtain in a common Colorbond colour keeps the price down. Premium colours, a different profile or a matt or timber-look finish add to the door's cost but not to the fitting.",
      },
      {
        icon: "Cpu",
        title: "Manual or motorised",
        description:
          "A manual roller door is lifted by hand and locked with a centre lock. A roller door motor at {{price:motor-replace}} adds remotes and, on some models, battery backup and app control.",
      },
      {
        icon: "Building2",
        title: "Oversized and commercial doors",
        description:
          "Openings wider than a standard double, very tall doors and industrial units need a heavier curtain, a wind rating and often a three-phase or high-cycle motor, so they are priced to the opening, usually {{price:new-custom}}.",
      },
      {
        icon: "Truck",
        title: "Access and the old door",
        description:
          "Removing the old door is part of a standard install. A tight side room, a drum that has to be fitted at height, or brickwork and lintels that need making good once the old door is out can add time.",
      },
      {
        icon: "Wrench",
        title: "Repair instead of replace",
        description:
          "A roller door with a sound curtain rarely needs replacing. A spring at {{price:spring-x1}}, a lock at {{price:roller-lock}} or a service from {{price:service}} often puts it right for a fraction of a new door.",
      },
    ],
  },

  scenarios: {
    heading: "Roller Door Costs: Common Perth Jobs",
    items: [
      {
        icon: "DoorOpen",
        title: "Replacing a worn single roller door",
        mayAffectQuote:
          "The most common new-door job we do. A standard single door sits toward the lower end of the {{price:new-standard}} range, supplied and installed with the old door removed. Keeping your existing motor is possible if it suits the new door; otherwise a new motor is {{price:motor-replace}}.",
      },
      {
        icon: "Ruler",
        title: "A double roller door for a two-car garage",
        mayAffectQuote:
          "The extra width means a heavier curtain, a bigger drum and stronger springs, so a double door sits toward the top of the {{price:new-standard}} range. Very wide or tall openings move into custom pricing, typically {{price:new-custom}}, and we confirm that when we measure.",
      },
      {
        icon: "Home",
        title: "Rendering or building work",
        mayAffectQuote:
          "If the door is fine and only has to come off while the walls are rendered or the garage is extended, a removal and refit costs {{price:roller-reinstall}}, far less than a new door. We take it down before the trades start and refit it afterwards.",
      },
      {
        icon: "Siren",
        title: "A roller door that won't open",
        mayAffectQuote:
          "Most jammed roller doors are a broken spring inside the drum ({{price:spring-x1}}), a seized lock ({{price:roller-lock}}) or a motor fault, not a door that needs replacing. A door stuck with the car inside after hours is attended as an emergency, which adds {{price:after-hours}}.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Repair the Roller Door or Replace It?",
    intro:
      "A roller door is a simple machine, and most faults are cheap to fix. Our garage door repair cost guide lists every repair we price; replacement makes sense when the curtain itself is finished.",
    repairWhen: [
      "The curtain is straight, with no rust holes or creased slats",
      "The fault is one part: a spring, the lock, a guide or the motor",
      "The door only has to come off for building work: a refit is {{price:roller-reinstall}}",
      "It is a manual door you simply want motorised: a motor is {{price:motor-replace}}",
    ],
    replaceWhen: [
      "Rust has gone through the curtain or the bottom rail",
      "Slats are creased or bent so the curtain jams in the guides",
      "The door was undersized or badly fitted and never ran well",
      "You are renovating and want a quieter, better-looking or insulated door",
    ],
  },

  howToQuote: {
    heading: "How a Roller Door Quote Works",
    steps: [
      {
        icon: "Ruler",
        title: "Measure the opening",
        description:
          "We measure width, height, headroom for the drum and side room for the guides, and check the lintel and the power supply if you want a motor.",
      },
      {
        icon: "Palette",
        title: "Choose the door",
        description:
          "Pick the curtain profile and colour, decide between manual and motorised, and add any extras such as a second remote or battery backup.",
      },
      {
        icon: "FileText",
        title: "Fixed written quote",
        description:
          "One written price for the door, the fitting and removal of the old door, agreed before the door is ordered.",
      },
      {
        icon: "Wrench",
        title: "Installation",
        description:
          "The old door comes out, the new drum, curtain and guides go in, the springs are tensioned and the motor is programmed.",
      },
      {
        icon: "ShieldCheck",
        title: "Handover",
        description:
          "We run the door with you, show you the manual release and the lock, and explain the motor warranty and how to register it.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Roller Doors Perth",
      href: "/roller-doors-perth",
      description: "The roller doors we supply and install: profiles, colours, sizes and motor options.",
      icon: "DoorOpen",
    },
    {
      name: "Roller Door Installation Perth",
      href: "/roller-door-installation-perth",
      description: "How a new roller door is measured, ordered and fitted, from quote to handover.",
      icon: "Wrench",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Jammed curtains, springs, locks, guides and motors repaired same-day.",
      icon: "Settings",
    },
    {
      name: "Garage Door Motors Perth",
      href: "/garage-door-motors-perth",
      description: "Our Capital openers, plus the roller door motors we supply and fit.",
      icon: "Cpu",
    },
    {
      name: "Commercial Roller Doors Perth",
      href: "/commercial-roller-doors-perth",
      description: "Roller doors and shutters for warehouses, factories and shopfronts.",
      icon: "Building2",
    },
    {
      name: "Industrial Roller Doors Perth",
      href: "/industrial-roller-doors-perth",
      description: "Heavy-duty roller doors for industrial openings, supplied, installed and maintained.",
      icon: "Warehouse",
    },
    {
      name: "Garage Door Installation Cost Perth",
      href: "/garage-door-installation-cost-perth",
      description: "New door costs across every type: roller, sectional, tilt and custom.",
      icon: "Home",
    },
    {
      name: "Garage Door Prices & Cost Guides",
      href: "/cost-guides",
      description: "Our full Perth price list, plus the repair, spring, motor and servicing guides.",
      icon: "FileText",
    },
    {
      name: "Roller Door vs Sectional Door",
      href: "/roller-door-vs-sectional-door",
      description: "Which door type suits your garage, and how the two compare on price and space.",
      icon: "Layers",
    },
    {
      name: "Motor Warranty & Registration",
      href: "/warranty",
      description: "What our motor warranty covers and how to register it once the opener is fitted.",
      icon: "ShieldCheck",
    },
  ],

  faqs: [
    {
      question: "How much does a roller door cost in Perth?",
      answer:
        "A new roller door costs {{price:new-standard}} in Perth, supplied and installed, with the old door removed and new guides and hardware fitted. A standard single door sits toward the lower end of that range and a double toward the top. Motorising it adds {{price:motor-replace}}. Oversized, industrial and custom-colour doors are priced to the opening, usually {{price:new-custom}}, and every figure is confirmed in a written quote after we measure.",
    },
    {
      question: "How much is a double roller door?",
      answer:
        "Most double roller doors fall within the {{price:new-standard}} supply-and-install range, higher in it than a single because the curtain is longer and heavier and needs a bigger drum and stronger springs. If you want it motorised, add {{price:motor-replace}} for a roller door opener with remotes. A very wide or tall opening may need a made-to-order curtain, which moves it into custom pricing of {{price:new-custom}}.",
    },
    {
      question: "Can you get a 6 m wide roller door?",
      answer:
        "Yes. Roller doors are made to the opening, and wide doors for double and triple garages, sheds and commercial premises are common in Perth. Beyond a standard double width the curtain needs a heavier gauge, a larger drum and a wind rating, so a six-metre door is quoted as a custom door, typically {{price:new-custom}}, rather than at the standard rate. We measure first and confirm the price in writing.",
    },
    {
      question: "Is it cheaper to repair or replace a roller door?",
      answer:
        "Almost always cheaper to repair, as long as the curtain is sound. A broken spring is {{price:spring-x1}}, a new lock and arms {{price:roller-lock}}, and a service starts from {{price:service}}, while a new door is {{price:new-standard}}. Replacement is the better spend when rust has gone through the curtain, the slats are creased and jamming, or the door was never the right size for the opening.",
    },
    {
      question: "How much does a roller door motor cost?",
      answer:
        "A roller door motor is {{price:motor-replace}} supplied, fitted and programmed, with remotes included. The motor bolts to the drum and drives the curtain directly, so it suits both new and existing manual doors. Door size and weight decide the model, and battery backup or app control add to the price. If a motor you already own is compatible, we can also fit it to a new door and tell you on the day whether that is worthwhile.",
    },
    {
      question: "What is the lifespan of a roller door?",
      answer:
        "A steel roller door that is serviced every year or two commonly runs for twenty years or more in Perth; the springs and the lock wear first, and both are cheap to replace. Doors near the coast or in damp garages corrode sooner, and a door that is left unbalanced wears its guides and motor. An annual service, from {{price:service}}, is the cheapest way to get the full life out of it.",
    },
  ],

  cta: {
    heading: "Get a Fixed Price for Your Roller Door",
    subtitle:
      "We'll measure the opening, show you the profiles and colours, and give you one written price for the door, the fitting and removal of the old one.",
  },

  seo: {
    title: `Roller Door Prices Perth (${REVIEWED_AT.slice(0, 4)} Price Guide)`,
    description:
      "Roller door prices in Perth: a new roller door is {{price:new-standard}} supplied & installed, old door removed; a motor adds {{price:motor-replace}}. Fixed quotes first.",
    descriptionFallback:
      "Roller door prices in Perth: what a new single or double roller door costs supplied and installed, plus motors, refits, springs, locks and servicing.",
  },
};
