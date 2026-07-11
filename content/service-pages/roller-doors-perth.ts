import type { ServicePage } from "@/types/service-page";

/**
 * /roller-doors-perth — roller doors as a product (buying page).
 *
 * GSC shows "roller doors perth" (159 impressions) plus the garage-roller /
 * prices variants (~200 more) with no dedicated page — the SERP is mostly
 * competitor homepages, so a focused product page is the opening. Buying
 * intent only: door styles, colours, sizes, prices and the roller-vs-sectional
 * decision. The fitting process itself lives on /roller-door-installation-perth
 * (linked, not duplicated). Prices mirror
 * components/sections/smart-calculator/pricing-data.ts; the live CMS page pins
 * the matching catalog rows.
 */
export const rollerDoorsPerth: ServicePage = {
  serviceName: "Roller Doors Perth",
  slug: "roller-doors-perth",
  pageType: "service",

  hero: {
    h1: "Roller Doors Perth",
    subtitle:
      "Garage roller doors in every Colorbond-style colour, made to measure for Perth homes and sheds — supplied, installed and backed by a lifetime workmanship warranty.",
    badges: [
      { icon: "MapPin", label: "Local Perth Team" },
      { icon: "Palette", label: "Full Colour Range" },
      { icon: "Ruler", label: "Made to Measure" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/door-types/roller-doors-perth-colorbond-double.webp",
    imageAlt: "Charcoal Colorbond-style double roller door on a modern rendered Perth home",
    floatingCardLabel: "Free Measure & Quote",
  },

  directAnswer:
    "A new garage roller door in Perth typically costs $3,000–$5,000 supplied and installed by Capital Garage Doors, including removal of your old door; oversize and commercial curtains range $5,000–$15,000. Roller doors coil into a compact drum above the opening, so they're the best pick for tight headroom, short driveways and garages that need the ceiling clear — and the simple steel curtain makes them the most affordable door style. We measure your opening, match any Colorbond-style colour, and quote the exact door upfront.",

  intro: {
    heading: "The Practical Choice for Perth Garages and Sheds",
    paragraphs: [
      "A roller door is a single corrugated steel curtain that coils around a drum above your opening — no ceiling tracks, no hinged panels. That simplicity is its strength: the ceiling stays clear for storage or a workshop hoist, the door fits openings a sectional can't, and there are fewer moving parts to wear out over Perth summers.",
      "As an authorised dealer for B&D, Steel-Line, Gliderol and Avanti, we supply genuine made-to-measure roller doors in the full range of Colorbond-style colours — from classic Monument and Surfmist to timber-tone finishes — so the door matches your roof, gutters or fencing. Every quote names the exact door, size and colour, so you can compare like for like.",
      "Galvanised steel curtains and powder-coated finishes handle coastal Perth well, and a properly tensioned door lifts easily by hand or pairs with a compact roller-door motor for remote and app control. If you're weighing a roller door against a sectional, we'll tell you plainly which suits your garage — and if your headroom or opening is unusual, we'll measure before you commit to anything.",
    ],
  },

  problems: [
    { label: "Old curtain dented, rusted or noisy", icon: "AlertTriangle" },
    { label: "Tight headroom a sectional won't fit", icon: "Ruler" },
    { label: "Ceiling storage you want to keep clear", icon: "Layers" },
    { label: "Shed or granny flat needing a secure door", icon: "Lock" },
    { label: "Manual door you'd like motorised", icon: "Cpu" },
    { label: "New build or renovation on a budget", icon: "Home" },
  ],

  includedItems: [
    "On-site measure of the opening, headroom and side room",
    "Door supply in your choice of Colorbond-style colour",
    "Removal and disposal of the old door",
    "New guides, drum and axle fitted",
    "Spring tensioning and balance setup",
    "Optional roller-door motor, fitted and programmed",
    "Full operation and safety testing",
    "Lifetime workmanship warranty",
  ],

  processSteps: [
    {
      title: "Measure and quote",
      description: "We measure the opening, headroom and side room, then price the exact door and colour.",
      icon: "FileText",
    },
    {
      title: "Pick your colour",
      description: "Choose from the full Colorbond-style range to match your roof, trim or fencing.",
      icon: "Palette",
    },
    {
      title: "We order your door",
      description: "Roller doors are rolled to your exact width — we confirm the lead time with your quote.",
      icon: "PackageCheck",
    },
    {
      title: "Installation day",
      description: "Old door out, new curtain fitted, tensioned and tested through its full travel.",
      icon: "Wrench",
    },
    {
      title: "Handover & warranty",
      description: "We program any remotes, show you the manual release, and register the warranty.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Your exact quote depends on the opening size, colour and whether you add a motor — confirmed upfront:",
    rows: [
      {
        label: "New roller door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "Includes old-door removal and disposal",
      },
      {
        label: "Roller door removal & reinstall",
        price: "$880–$1,500",
        note: "Re-using your existing door, e.g. after rendering",
      },
      {
        label: "New door — oversize / commercial",
        price: "$5,000–$15,000",
        note: "Wide openings, industrial curtains, shopfronts",
      },
      {
        label: "Motor / opener (supply & install)",
        price: "$770–$990",
        note: "Remote and smartphone control, fitted on the day",
      },
    ],
  },

  whyChoose: [
    {
      title: "Authorised dealer",
      description: "Genuine B&D, Steel-Line, Gliderol and Avanti doors, named brand-for-brand on your quote.",
      icon: "BadgeCheck",
    },
    {
      title: "Every colour matched",
      description: "The full Colorbond-style palette, so the door ties into your roof and fencing.",
      icon: "Palette",
    },
    {
      title: "Rolled to your opening",
      description: "Curtains sized to the millimetre run true in their guides and wear evenly for years.",
      icon: "Ruler",
    },
    {
      title: "Coast-ready steel",
      description: "Galvanised curtains and powder-coated finishes that stand up to Perth's salt air.",
      icon: "ShieldCheck",
    },
    {
      title: "Old door taken away",
      description: "Removal and disposal of your existing door is part of the job, not an extra.",
      icon: "Truck",
    },
    {
      title: "Honest advice",
      description: "If a sectional or tilt door suits your garage better, we'll tell you before you spend.",
      icon: "Scale",
    },
  ],

  relatedServices: [
    {
      name: "Roller Door Installation Perth",
      href: "/roller-door-installation-perth",
      description: "How the supply-and-install process works, step by step.",
      icon: "DoorOpen",
    },
    {
      name: "Roller Door vs Sectional Door: Which Is Better?",
      href: "/roller-door-vs-sectional-door",
      description: "Weigh up both styles on cost, space, insulation and looks before you decide.",
      icon: "Scale",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Curtain, spring and guide repairs if your current door still has life in it.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Capital motors with Wi-Fi app control — an easy add-on to any roller door.",
      icon: "Cpu",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "Prefer insulated panels and a quieter door? Compare our sectional range.",
      icon: "Layers",
    },
  ],

  serviceAreas: [
    "Joondalup",
    "Wanneroo",
    "Ellenbrook",
    "Morley",
    "Dianella",
    "Canning Vale",
    "Willetton",
    "Armadale",
    "Baldivis",
    "Kwinana",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Janelle S.",
      rating: 5,
      text: "Musab was extremely efficient, professional, organised and a nice bloke. Would highly recommend his service and installation of roller doors to anyone.",
      service: "Roller Doors",
    },
  ],

  faqs: [
    {
      question: "How much do roller doors cost in Perth?",
      answer:
        "A standard garage roller door is typically $3,000–$5,000 supplied and installed, including removal and disposal of your old door. Oversize and commercial curtains range $5,000–$15,000, and adding a motor is around $770–$990. We quote the exact door, size and colour upfront before anything is ordered.",
    },
    {
      question: "Should I choose a roller door or a sectional door?",
      answer:
        "Choose a roller door when headroom is tight, you want the ceiling clear for storage, or budget matters most — the simple curtain makes it the most affordable style. Choose a sectional if you want insulation, the quietest operation or a wider choice of panel looks. We measure both options on the quote visit and tell you plainly which fits your garage.",
    },
    {
      question: "What colours do roller doors come in?",
      answer:
        "The full Colorbond-style palette — popular Perth picks include Monument, Basalt, Surfmist, Woodland Grey and timber-tone finishes. Because the curtain is rolled to order, you choose the exact shade to match your roof, gutters or fencing rather than settling for stock colours.",
    },
    {
      question: "Are roller doors OK in coastal Perth suburbs?",
      answer:
        "Yes — curtains are galvanised steel with a baked-on colour finish, which handles salt air well. Near the beach we recommend an occasional freshwater rinse and a regular service so the springs and guides stay protected; we'll advise on the right spec for your suburb at the measure.",
    },
    {
      question: "Can I add a motor to a roller door later?",
      answer:
        "Yes. Roller-door openers retrofit neatly to most curtains, typically $770–$990 supplied, installed and programmed — including remotes and smartphone app control. If you start with a manual door, we balance the spring so it lifts easily by hand until you're ready to automate.",
    },
    {
      question: "How often should a roller door be serviced?",
      answer:
        "Every 12–18 months for a home door, more often if it's your main entry. A service (from $140) re-tensions the spring, cleans and lubricates the guides, and catches curtain wear before it becomes a jammed door. It's the cheapest way to make a roller door last decades.",
    },
  ],

  cta: {
    heading: "Ready to Price Your Roller Door?",
    subtitle:
      "Tell us your opening size and the colour you're after — we'll come back with a clear supplied-and-installed price, no call-out fee to quote.",
  },

  seo: {
    title: "Roller Doors Perth | Garage Roller Doors & Prices",
    description:
      "Colorbond-style roller doors supplied and installed across Perth from $3,000, including old-door removal. Compare colours, sizes and prices — free quote.",
  },
};
