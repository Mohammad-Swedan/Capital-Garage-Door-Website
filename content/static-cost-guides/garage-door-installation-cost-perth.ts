import type { StaticCostGuideSource } from "@/types/cost-guide";

/**
 * /garage-door-installation-cost-perth: what a new garage door costs to supply and install.
 * A static cost guide: repo-only, deployed with the code, never a CMS page. Every price is a
 * {{price:<key>}} token that lib/data/static-cost-guides.ts fills from the live price catalog,
 * so this file must never hold a literal dollar figure.
 *
 * Keywords (DataForSEO, 2026-09-30; Google Ads 12-month average for Perth unless marked AU):
 *   primary    "garage door installation cost perth" (below the Ads volume floor; its SERP's
 *              related search is "residential garage door installation cost perth")
 *   secondary  "garage door installation cost" / "install a garage door cost" 110 (AU 1,300),
 *              "garage door cost" 90, "garage door replacement cost" 70, "new garage door cost" 50,
 *              "roller door cost" 40, "double garage door cost" 20
 * The live Perth SERP (2026-09-29/30) has no installer cost page in its top 10, only blogs,
 * Airtasker, Reddit and Facebook groups; the FAQs follow its People Also Ask questions.
 * Cannibalisation guard: /cost-guides owns "prices / price list"; this guide owns
 * "installation / replacement cost".
 */
const REVIEWED_AT = "2026-09-30";

export const garageDoorInstallationCostPerth: StaticCostGuideSource = {
  slug: "garage-door-installation-cost-perth",
  pageType: "cost-guide",
  topicLabel: "New Garage Door Installation",
  reviewedAt: REVIEWED_AT,

  // Table order first; "after-hours" is used in the copy only.
  pricingPins: [
    "new-standard",
    "new-custom",
    "roller-reinstall",
    "sectional-reinstall",
    "tilt-arms-kit",
    "motor-replace",
    "wifi",
    "after-hours",
  ],

  hero: {
    h1: "Garage Door Installation Cost Perth",
    subtitle:
      "What a new garage door costs to supply and install in Perth: standard and custom doors, door refits, tilt-door kits and motors, all priced from our current list.",
  },

  directAnswer:
    "Garage door installation in Perth typically costs {{price:new-standard}} for a new standard door, supplied and fitted. That price includes removing your old door and fitting new tracks and hardware. Custom and commercial doors are priced to the opening, usually {{price:new-custom}}. Fitting a new motor at the same time adds {{price:motor-replace}}, including programming and remotes. We measure the opening and confirm a fixed written quote on site before any work starts.",

  costTable: {
    heading: "New Garage Door Cost in Perth, Supplied & Installed",
    intro:
      "Guide prices from our current list for new doors, door refits and the extras most people weigh up when replacing a garage door. Your opening and the door you choose decide the final figure, and you'll have it in writing before the job is booked.",
    rowHeader: "Door / Job",
    // Each row's includes / cost factors / next step come from the live catalog row when it has
    // them; the text here fills any column the catalog leaves blank.
    rows: [
      {
        key: "new-standard",
        label: "New standard garage door (supply & install)",
        includes: "New door, tracks and hardware fitted, with the old door taken down and removed",
        costFactors: "Door type, opening size, material and insulation",
        nextStep: "Book a measure-and-quote visit",
      },
      {
        key: "new-custom",
        label: "Custom or commercial door (supply & install)",
        includes: "A door made to your opening and specification, supplied and fitted",
        costFactors: "Opening size, cladding or material, wind rating, motor",
        nextStep: "Send the opening size and a few photos",
      },
      {
        key: "roller-reinstall",
        includes: "Taking your roller door down and refitting it after rendering or building work",
        costFactors: "Door width, site access, condition of the curtain and springs",
        nextStep: "Tell us when the building work is booked",
      },
      {
        key: "sectional-reinstall",
        includes: "Removing your sectional door and refitting it with its tracks and hardware",
        costFactors: "Door size, track and hardware condition, access",
        nextStep: "Send photos of the door and tracks",
      },
      {
        key: "tilt-arms-kit",
        includes: "New tilt-door arms and springs fitted to your existing door, then balanced",
        costFactors: "Door weight, frame condition, type of tilt mechanism",
        nextStep: "Book a check of the door and frame",
      },
      {
        key: "motor-replace",
        label: "Motor / opener (supply & install)",
        includes: "Opener supplied, fitted and programmed, with remotes",
        costFactors: "Door type and weight, motor model",
        nextStep: "Choose the motor with your new door",
      },
      {
        key: "wifi",
        includes: "WiFi or app control added to a compatible opener",
        costFactors: "Opener compatibility and any hub required",
        nextStep: "Tell us your opener's brand and model",
      },
    ],
  },

  factors: {
    heading: "What Changes the Cost of Installing a Garage Door",
    items: [
      {
        icon: "DoorOpen",
        title: "Door type",
        description:
          "Roller doors are usually the simplest and most economical option. Sectional doors carry more hardware and need headroom for their tracks, tilt doors swing out in one piece, and custom designs are priced to order.",
      },
      {
        icon: "Ruler",
        title: "Opening size",
        description:
          "A double door is wider and heavier than a single, so it needs more material and stronger springs. We measure width, height, headroom and side room, and an odd-sized opening may need a made-to-measure door.",
      },
      {
        icon: "Layers",
        title: "Material & insulation",
        description:
          "Colorbond steel in a standard profile keeps the cost down. Timber-look finishes and insulated panels add to it, and an insulated door's extra weight can change the springs and motor it needs.",
      },
      {
        icon: "Cpu",
        title: "Motor & smart control",
        description:
          "Fitting a motor with the door adds {{price:motor-replace}}, programmed and with remotes, while WiFi control for a compatible opener you already own is {{price:wifi}}.",
      },
      {
        icon: "Truck",
        title: "Old door, access & making good",
        description:
          "Removing the old door is part of a standard install. Tight access, an out-of-square opening, or framing or brickwork that needs repair once it's exposed can add time and materials.",
      },
      {
        icon: "Building2",
        title: "Wind rating & commercial spec",
        description:
          "Large commercial openings and exposed sites can call for a wind-rated door, heavier materials or a commercial-grade motor. We confirm the spec when we measure, so the quote matches the opening.",
      },
    ],
  },

  scenarios: {
    heading: "Garage Door Replacement Cost: Common Jobs",
    items: [
      {
        icon: "RefreshCw",
        title: "Replacing an old tilt door with a sectional",
        mayAffectQuote:
          "It depends most on headroom for the tracks and the state of the frame once the tilt door is off. A standard sectional sits within the {{price:new-standard}} range installed. If the tilt door itself is in good shape, fresh arms and springs ({{price:tilt-arms-kit}}) could keep it working instead.",
      },
      {
        icon: "DoorOpen",
        title: "Swapping a worn roller door",
        mayAffectQuote:
          "Width, colour and whether your existing motor suits the new door all play a part. Our standard supply-and-install range of {{price:new-standard}} covers a standard-size door, including removal of the old one. If the old door has jammed and the garage can't be locked, an after-hours visit to secure it is charged extra ({{price:after-hours}}).",
      },
      {
        icon: "Home",
        title: "A new build or renovation opening",
        mayAffectQuote:
          "We measure once the opening is built and its finished size is known. If you're keeping your current door while the walls are rendered, we can take it down first and put it back up afterwards: {{price:roller-reinstall}} on a roller door, {{price:sectional-reinstall}} on a sectional.",
      },
      {
        icon: "Cpu",
        title: "Adding a motor at the same time",
        mayAffectQuote:
          "Having the opener fitted on installation day means one visit instead of two, and {{price:motor-replace}} covers the motor, programming and remotes. On a sectional door, its weight decides the model: a heavy or insulated sectional may need the stronger Capital 1500N. A roller door needs its own type of opener.",
      },
    ],
  },

  repairVsReplace: {
    heading: "Repair the Door or Replace It?",
    intro:
      "A new door isn't always the right spend. If a single part has failed, our garage door repair cost guide lists what that fix usually costs; when the door itself is worn out, replacement tends to be better value over time.",
    repairWhen: [
      "The fault is one worn part, such as a spring, cable or roller",
      "The panels or roller curtain are straight, with no rust coming through",
      "A tilt door is solid but its arms and springs are worn: a replacement kit is {{price:tilt-arms-kit}}",
      "Parts for your door and opener are still easy to get",
    ],
    replaceWhen: [
      "Panels are dented, cracked or rusting through in several places",
      "Breakdowns keep coming back and parts are hard to find",
      "Dust, water or heat gets in and new seals won't stop it",
      "You're renovating and want a quieter, insulated or better-looking door",
    ],
  },

  howToQuote: {
    heading: "How a Garage Door Installation Quote Works",
    steps: [
      {
        icon: "Ruler",
        title: "Measure & inspect on site",
        description:
          "We measure the opening's width, height, headroom and side room, and check the frame, the floor and whether there's power for a motor.",
      },
      {
        icon: "Palette",
        title: "Choose your door & colour",
        description:
          "Pick the door type, panel profile and colour, plus any insulation, motor or smart control you want included in the price.",
      },
      {
        icon: "FileText",
        title: "Get a fixed written quote",
        description:
          "One written price covering the door, the installation and removal of the old door, agreed before anything is ordered.",
      },
      {
        icon: "Wrench",
        title: "Installation day",
        description:
          "We take the old door down and install the new one on fresh tracks and hardware, then balance it and program any motor and remotes.",
      },
      {
        icon: "ShieldCheck",
        title: "Handover & warranty registration",
        description:
          "We run the door with you and, if a motor was fitted, show you how to register its warranty online. What's covered is on our Warranty page.",
      },
    ],
  },

  relatedServices: [
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description: "How we supply and fit new doors across Perth, from the first measure to handover.",
      icon: "Wrench",
    },
    {
      name: "Garage Doors Perth",
      href: "/garage-doors-perth",
      description: "Browse the new doors we supply and install: roller, sectional, tilt and custom.",
      icon: "Home",
    },
    {
      name: "Roller Doors Perth",
      href: "/roller-doors-perth",
      description: "Roller doors for Perth garages, with the colours, sizes and choices a replacement involves.",
      icon: "DoorOpen",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "Panel-lift sectional doors, including insulated and timber-look options.",
      icon: "Layers",
    },
    {
      name: "Tilt Garage Doors Perth",
      href: "/tilt-garage-doors-perth",
      description: "New tilt doors, plus arm and spring kits that keep older ones running.",
      icon: "Move",
    },
    {
      name: "Custom Garage Doors Perth",
      href: "/custom-garage-doors-perth",
      description: "Doors designed around your home's facade, from timber battens to aluminium slats.",
      icon: "Palette",
    },
    {
      name: "Garage Door Motors Perth",
      href: "/garage-door-motors-perth",
      description: "Our own Capital 1100N and 1500N sectional-door openers, fitted and programmed alongside a new door.",
      icon: "Cpu",
    },
    {
      name: "Commercial Garage Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "Roller shutters and sectional doors for workshops, warehouses and other business premises.",
      icon: "Building2",
    },
    {
      name: "Garage Door Prices & Cost Guides",
      href: "/cost-guides",
      description: "Our full price list, plus the repair, spring, motor and servicing cost guides.",
      icon: "FileText",
    },
    {
      name: "Motor Warranty & Registration",
      href: "/warranty",
      description: "What our motor warranty covers and how to register it once your opener is fitted.",
      icon: "ShieldCheck",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to install a garage door in Perth?",
      answer:
        "A standard garage door costs {{price:new-standard}} supplied and installed in Perth, and that covers removing your old door plus new tracks and hardware. Door type, opening size and material decide where your door lands in that range; a motor adds {{price:motor-replace}}. A custom or commercial door is priced to its opening and specification, usually {{price:new-custom}}. We confirm the figure in a fixed written quote after measuring on site.",
    },
    {
      question: "How much does it cost to replace a garage door?",
      answer:
        "Replacing a worn-out door with a new standard one is {{price:new-standard}}, with the old door removed as part of the job. If your door is fine and only has to come down for rendering or building work, a roller door removal and refit is {{price:roller-reinstall}} and a sectional is {{price:sectional-reinstall}}. For a sound tilt door with tired arms and springs, a new kit at {{price:tilt-arms-kit}} may be all it needs.",
    },
    {
      question: "How much is a double garage door?",
      answer:
        "Most standard double doors fall within our {{price:new-standard}} supply-and-install range, and a double generally sits higher in that range than a single. The extra width means more material, stronger springs and, if you want it automated, a motor sized to the weight. Insulated panels, premium finishes or an oversized opening can move it into custom pricing, typically {{price:new-custom}}, so we measure before we quote a figure.",
    },
    {
      question: "Is removal of my old door included?",
      answer:
        "Yes. Removing your old door is included in the standard new-door price of {{price:new-standard}}, along with new tracks and hardware. What can add to the quote is the opening itself: a rotten timber frame, an opening that's out of square, or brickwork that needs making good once the old door is out. We check for these when we measure, so anything extra is in the written quote before work starts.",
    },
    {
      question: "How much is a new door with a motor?",
      answer:
        "To budget for both, add the two prices from our list: {{price:new-standard}} for a standard door and {{price:motor-replace}} for a motor supplied, installed and programmed with remotes. Fitting them together lets us match the opener to the door you choose: a heavy insulated sectional may call for the Capital 1500N rather than the 1100N, while a roller door takes a roller-door opener. Keeping an opener you already have? If it's compatible, WiFi control can be added for {{price:wifi}}.",
    },
    {
      question: "How long does installation take?",
      answer:
        "As a typical guide, most standard residential installs are completed in a day: the old door comes out, the new door, tracks and hardware go in, and the door is balanced and tested before we leave. Made-to-order, custom and commercial doors take longer from quote to installation, as does an opening that needs work first, so timing is confirmed with your written quote rather than promised up front.",
    },
  ],

  cta: {
    heading: "Book a Measure-and-Quote Visit",
    subtitle:
      "We'll measure your opening, walk you through door styles and colours, and give you a fixed written price for supply and installation before anything is booked in.",
  },

  seo: {
    title: `Garage Door Installation Cost Perth (${REVIEWED_AT.slice(0, 4)} Price Guide)`,
    description:
      "Garage door installation cost in Perth: {{price:new-standard}} for a standard door supplied & fitted, old door removed, new tracks included. Free measure & quote.",
    descriptionFallback:
      "Garage door installation cost in Perth: what a new standard, custom or commercial door costs supplied and fitted, what changes the price, and how quotes work.",
  },
};
