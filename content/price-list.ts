import type { PriceListContent } from "@/types/price-list";
import { COST_GUIDE_LINKS } from "@/lib/pricing/guide-links";

/**
 * /cost-guides — "Garage Door Prices Perth — {year} Price List". The whole live pricing catalog as
 * one crawlable price list, grouped by job and linked to the page that explains each job. Every
 * price is a {{price:<key>}} token that lib/data/price-list.ts fills from the live catalog (with
 * the pricing-data.ts figures as the fallback), so this file must never hold a literal dollar
 * figure. The 26 table rows plus the catalog's pricing-policy note (the disclaimer) cover every
 * catalog row; lib/brands/__tests__/price-list-content.test.ts enforces it.
 *
 * Keywords (DataForSEO, 2026-09-30; Google Ads 12-month average for Perth, location 1000676):
 *   primary    "garage door prices perth" 170/mo (CPC $7.83; Google groups "garage door cost perth"
 *              and "garage doors perth prices" with it)
 *   secondary  "garage door prices" / "garage door cost" 90, "new garage door cost" / "new garage
 *              door price" 50, "roller door price" 40, "garage door repair cost" 30 (CPC $30.90),
 *              "double garage door price" 20, "how much is a new garage door" 20,
 *              "garage door price list" 10
 * The URL stays /cost-guides: it already ranks 14–18 for these queries (the slug can't carry the
 * keyword, so the title, H1, first paragraph and meta description do).
 * The live Perth SERP (2026-09-29 mobile, 2026-09-30 desktop) shows an AI Overview citing supplier
 * price guides, then a weak organic top 10 with no installer price list built from real rates. The
 * FAQs follow its People Also Ask questions.
 * Cannibalisation guard: this hub owns "prices / price list"; /garage-door-installation-cost-perth
 * owns "installation / replacement cost"; /calculator owns "price calculator / estimate".
 */
export const PRICE_LIST: PriceListContent = {
  reviewedAt: "2026-09-30",

  hero: {
    eyebrow: "Perth price list",
    subtitle:
      "Guide prices for every job on our list, from a safety inspection to a new door supplied and installed. Each job links to a page that explains the work involved and why its price can vary.",
  },

  directAnswer:
    "Garage door prices in Perth, from our current list: a safety inspection is {{price:checkup}} and a full service {{price:service}}. A single broken spring costs {{price:spring-x1}} to replace, a matched pair {{price:spring-x2}}, and a snapped lift cable {{price:cable}}. A new motor, supplied and installed, is {{price:motor-replace}}. A standard-size new door is {{price:new-standard}} fitted, with the old door taken away, while custom and commercial doors typically cost {{price:new-custom}}. After-hours call-outs cost extra ({{price:after-hours}}). Every price is confirmed with a fixed quote before any work starts.",

  groups: [
    {
      id: "new-doors",
      navLabel: "New doors",
      heading: "New Garage Door & Installation Prices",
      intro:
        "A standard door's price covers supply, installation and taking the old door away; where it lands in the range depends mostly on size and finish. Keeping your existing door through rendering or building work? The refit prices cover taking it down and putting it back.",
      rows: [
        {
          key: "new-standard",
          href: "/garage-door-installation-cost-perth",
          label: "New garage door — standard size, supplied & installed",
        },
        { key: "roller-reinstall", href: "/roller-door-installation-perth", label: "Roller door taken down & refitted" },
        { key: "sectional-reinstall", href: "/sectional-garage-doors-perth", label: "Sectional door taken down & refitted" },
        { key: "tilt-arms-kit", href: "/tilt-garage-doors-perth", label: "Tilt door arms & springs kit" },
      ],
      guide: COST_GUIDE_LINKS.installation,
    },
    {
      id: "repairs",
      navLabel: "Repairs",
      heading: "Garage Door Repair Prices",
      intro:
        "Most repairs are priced per job. Hinges and rollers are the exception: each part is charged on top of one call-out fee, so replacing every worn one in a single visit costs less than doing them one at a time.",
      rows: [
        { key: "offtrack", href: "/problems/garage-door-off-track", label: "Door off its tracks or jammed" },
        { key: "damaged", href: "/garage-door-panel-replacement-perth", label: "Damaged panel or section replaced" },
        { key: "hinges-rollers", href: "/garage-door-repair-cost-perth", label: "Worn hinges, rollers or wheels" },
        {
          key: "sensors",
          href: "/problems/garage-door-wont-close",
          label: "Safety sensors (photo eyes) replaced & realigned",
        },
        { key: "seal", href: "/garage-door-service-cost-perth", label: "Weather seal — bottom rubber & brush" },
        { key: "roller-lock", href: "/roller-door-repairs-perth", label: "Roller door lock & lock arms" },
        { key: "pelmet", href: "/roller-door-repairs-perth", label: "Roller door pelmet (hood) replaced" },
      ],
      guide: COST_GUIDE_LINKS.repair,
    },
    {
      id: "springs-cables",
      navLabel: "Springs & cables",
      heading: "Spring & Cable Prices",
      intro:
        "Spring prices go by how many springs your door runs on: a single door usually has one, a double a matched pair, and heavier doors three or four. We recommend replacing them as a set so the door stays balanced, and a spring that has slipped rather than snapped can often be refitted instead.",
      rows: [
        { key: "spring-x1", href: "/garage-door-spring-replacement-cost-perth", label: "Broken spring (single)" },
        { key: "spring-x2", href: "/garage-door-spring-replacement-cost-perth", label: "Broken springs — matched pair" },
        {
          key: "spring-x3",
          href: "/garage-door-spring-replacement-cost-perth",
          label: "Three springs (larger or heavier doors)",
        },
        {
          key: "spring-x4",
          href: "/garage-door-spring-replacement-cost-perth",
          label: "Four springs (oversized or commercial doors)",
        },
        { key: "cable", href: "/garage-door-spring-replacement-cost-perth", label: "Lift cable snapped or off the drum" },
        {
          key: "spring-refit",
          href: "/garage-door-spring-repair-perth",
          label: "Spring refit or re-tension (no new springs)",
        },
      ],
      guide: COST_GUIDE_LINKS.springs,
    },
    {
      id: "motors",
      navLabel: "Motors & remotes",
      heading: "Motor, Opener & Remote Prices",
      intro:
        "An opener repair covers the drive, the circuit board or the limit settings. If fixing yours would cost nearly as much as a new motor, we'll tell you before starting; new motors come fitted and programmed with remotes.",
      rows: [
        { key: "motor-repair", href: "/garage-door-opener-repair-perth", label: "Motor or opener repair" },
        {
          key: "motor-replace",
          href: "/garage-door-motor-replacement-cost-perth",
          label: "New motor — supplied, installed & programmed",
        },
        { key: "wifi", href: "/garage-door-motors-perth", label: "WiFi / smartphone control added" },
        { key: "remote", href: "/garage-door-remote-replacement-perth", label: "Extra or replacement remote" },
      ],
      guide: COST_GUIDE_LINKS.motor,
    },
    {
      id: "servicing",
      navLabel: "Servicing",
      heading: "Garage Door Service & Inspection Prices",
      intro:
        "A service lubricates, re-tensions and balances the door and checks its safety features, with any parts it needs priced on top. The safety inspection is a standalone check that ends with a written report of what we found.",
      rows: [
        { key: "service", href: "/garage-door-service-cost-perth", label: "Full service & tune-up" },
        { key: "checkup", href: "/garage-door-maintenance-perth", label: "Safety inspection & written report" },
      ],
      guide: COST_GUIDE_LINKS.service,
    },
    {
      id: "commercial",
      navLabel: "Commercial & custom",
      heading: "Commercial & Custom Door Prices",
      intro:
        "Custom and commercial doors are built to the opening, so size, materials, wind rating and the motor set the price, and each one is quoted once we've measured. The commercial roller door figure is a starting guide for servicing or a straightforward repair; bigger faults are quoted on inspection.",
      rows: [
        {
          key: "new-custom",
          href: "/custom-garage-doors-perth",
          label: "Custom or commercial door — supplied & installed",
        },
        {
          key: "commercial-roller",
          href: "/commercial-roller-doors-perth",
          label: "Commercial roller door service or repair",
        },
      ],
      guide: { label: "Commercial garage doors in Perth", href: "/commercial-garage-doors-perth" },
    },
    {
      id: "after-hours",
      navLabel: "After-hours",
      heading: "After-Hours Call-Out Surcharge",
      intro:
        "Work done outside business hours carries a flat surcharge on top of the job itself, which is priced from the tables above. We confirm the total with you before a technician is sent.",
      rows: [
        {
          key: "after-hours",
          href: "/emergency-garage-door-repairs-perth",
          label: "After-hours or emergency call-out (on top of the job)",
        },
      ],
    },
  ],

  factors: {
    heading: "What Changes a Garage Door Price",
    items: [
      {
        icon: "Ruler",
        title: "Size of the opening",
        description:
          "The opening sets how much door you need. Doubles weigh more than singles and need stronger springs, and a non-standard opening can mean a door made to measure.",
      },
      {
        icon: "Layers",
        title: "Material & insulation",
        description:
          "Plain steel panels sit at the economical end. Insulated, timber-look and custom-clad doors cost more, and the extra weight of an insulated door can call for heavier springs or a stronger motor.",
      },
      {
        icon: "Cpu",
        title: "Motor & smart control",
        description:
          "Automating a door adds {{price:motor-replace}} for a motor that's fitted and programmed. Smart control on a compatible opener is {{price:wifi}}, and extra remotes are {{price:remote}}.",
      },
      {
        icon: "Settings",
        title: "Parts & condition",
        description:
          "Repairs follow the parts involved. An older or neglected door often needs rollers, cables and springs together, and discontinued parts for some older doors take longer to source.",
      },
      {
        icon: "Truck",
        title: "Access & site work",
        description:
          "Taking the old door away is part of the new-door price. What can add to it is the site: a damaged frame, an uneven floor or awkward access means extra time or materials.",
      },
      {
        icon: "Siren",
        title: "Timing",
        description:
          "Out-of-hours and emergency call-outs carry a surcharge ({{price:after-hours}}) on top of the job. A door that's secure can wait for a standard booking at the normal price.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Garage Door Repair Cost vs Replacement Cost",
    intro:
      "When one part fails on a door that's otherwise sound, a repair is almost always the cheaper fix: a pair of springs at {{price:spring-x2}} against a new door at {{price:new-standard}}. Once the door itself is worn out, though, paying for repair after repair can end up costing more than replacing it.",
    repairWhen: [
      "A single part has failed, such as a spring, cable, roller or the opener",
      "The panels or curtain are free of rust and serious dents",
      "Parts for your door and its motor are still being made",
      "It's the first breakdown in years, not the third this year",
    ],
    replaceWhen: [
      "Rust or dents run across several panels or the whole curtain",
      "Breakdowns are becoming regular rather than one-off",
      "The door or opener is old enough that its parts are discontinued",
      "A renovation calls for an insulated door or a different style",
    ],
  },

  faqs: [
    {
      question: "What are typical garage door prices in Perth?",
      answer:
        "It depends on the job. On our current list, a safety inspection is {{price:checkup}}, one broken spring {{price:spring-x1}}, a door that has come off its tracks {{price:offtrack}} and a new motor {{price:motor-replace}}. A new standard-size door supplied and installed is {{price:new-standard}}, and custom or commercial doors typically cost {{price:new-custom}}. The tables on this page list every job we price, each linked to a fuller guide.",
    },
    {
      question: "How much does a new garage door cost in Perth?",
      answer:
        "For a standard-size door, our list price is {{price:new-standard}}, covering the door, its tracks and hardware, installation and removal of the old one. A single roller door tends to sit toward the lower end of that range and an insulated double sectional toward the top. Architectural, oversized and commercial doors are made to order and typically cost {{price:new-custom}}. The measure-and-quote visit fixes the exact figure.",
    },
    {
      question: "How much should I budget for a new garage door?",
      answer:
        "Start with the door: {{price:new-standard}} for a standard size, supplied and installed. To automate it, add {{price:motor-replace}} for a motor fitted and programmed with remotes, and allow {{price:wifi}} more if you want smartphone control through a compatible opener. A custom, insulated or oversized door can move the budget into the custom range ({{price:new-custom}}), so have the opening measured before you settle on a final number.",
    },
    {
      question: "How much does it cost to replace a garage door in Australia?",
      answer:
        "Prices differ from city to city, so here is how it works in Perth. On our list, swapping an old door for a new standard-size one is {{price:new-standard}} fitted, with the old door taken away. A door that's still sound but has to come off for rendering or building work costs less: {{price:roller-reinstall}} for a roller door taken down and refitted, or {{price:sectional-reinstall}} for a sectional door. Custom replacements are quoted to the opening.",
    },
    {
      question: "How much does a B&D garage door cost?",
      answer:
        "Size, material and insulation affect the price far more than the brand. We're an authorised B&D dealer, and a standard-size B&D roller or sectional door sits within our standard supply-and-install range of {{price:new-standard}}, the same range we use for other brands of that size. Insulated panels, designer finishes or an oversized opening can push it into custom pricing ({{price:new-custom}}). A measure-and-quote visit gives you the exact figure for your opening.",
    },
    {
      question: "How much does garage door repair cost in Perth?",
      answer:
        "Repairs are priced by the job. A single broken spring is {{price:spring-x1}}, a snapped cable {{price:cable}}, an opener repair {{price:motor-repair}}, a door that's come off its tracks {{price:offtrack}} and a damaged panel {{price:damaged}}. Worn hinges and rollers are {{price:hinges-rollers}}. The technician confirms what has failed and gives you the price before starting, and the repair table on this page lists every fault we price.",
    },
    {
      question: "Do after-hours call-outs cost more?",
      answer:
        "Yes. An after-hours or emergency call-out carries a surcharge ({{price:after-hours}}) on top of the normal price of the job, so a single spring replaced at night costs {{price:spring-x1}} plus the surcharge. If the door is safe and the garage can be locked, a booking during business hours avoids the extra charge. Either way, you'll know the full price before anyone is sent out.",
    },
    {
      question: "Are these prices fixed?",
      answer:
        "They're guide prices, not quotes. Each range covers the usual spread for that job, and your door's size, type, condition and the parts it needs decide where it lands. Where a price starts with \"from\", such as a service, any parts needed are added on top. Before any work starts, you get a fixed quote for your job, and nothing goes ahead until you've agreed to it.",
    },
  ],

  seo: {
    descriptionTemplate:
      "Garage door prices in Perth from our current price list: new doors {{price:new-standard}} installed, motors {{price:motor-replace}}, a new spring {{price:spring-x1}}. Fixed quotes first.",
    descriptionFallback:
      "Garage door prices in Perth from our current price list: repairs, springs, motors, servicing and new doors supplied and installed, with a fixed quote first.",
  },
};
