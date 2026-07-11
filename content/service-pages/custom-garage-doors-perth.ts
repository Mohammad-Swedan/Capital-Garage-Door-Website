import type { ServicePage } from "@/types/service-page";

/**
 * /custom-garage-doors-perth — designer / architectural doors.
 *
 * Completes the door-type set (sectional, roller, tilt, custom). Competitors
 * treat custom as a materials showcase; almost none publish prices — West
 * Coast's "from $6,000" is the only one. We publish our real $5,000–$15,000
 * range (pricing-data.ts "New door — commercial / custom") as the
 * differentiator. Covers residential + custom commercial fronts. The live CMS
 * page pins the matching catalog rows.
 */
export const customGarageDoorsPerth: ServicePage = {
  serviceName: "Custom Garage Doors Perth",
  slug: "custom-garage-doors-perth",
  pageType: "service",

  hero: {
    h1: "Custom Garage Doors Perth",
    subtitle:
      "Cedar battens, aluminium slats, timber-look composites and glass — designer garage doors made to measure for Perth homes, supplied and installed by one local team.",
    badges: [
      { icon: "MapPin", label: "Local Perth Installers" },
      { icon: "Palette", label: "Designed to Your Façade" },
      { icon: "Ruler", label: "Made to Measure" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/door-types/custom-garage-door-perth-timber-batten-coastal.webp",
    imageAlt: "Custom vertical timber-batten garage door on a coastal Perth home overlooking the ocean",
    floatingCardLabel: "Free Design Consult & Quote",
  },

  directAnswer:
    "Capital Garage Doors designs and installs custom garage doors across Perth, typically $5,000–$15,000 supplied and installed depending on size and material — cedar and timber battens, powder-coated aluminium slats, low-maintenance timber-look finishes, and glass or perforated infills. The door is built on a sectional or tilt base sized to your opening, the finish is matched to your façade, and the springs and opener are specified for the finished panel weight. Every design is quoted exactly before anything is ordered.",

  intro: {
    heading: "The Door Is a Third of the Façade — Make It Count",
    paragraphs: [
      "On most Perth frontages the garage door is the single largest surface facing the street. A custom door treats it that way: vertical cedar battens that turn the garage into a feature, wide aluminium slats that line up with the fence, timber-look composites that match the entry door, or frosted glass panels that glow at night. If you can sketch it, it can almost certainly be built.",
      "Custom doors are built on a proven base — usually a sectional door for insulation and quiet running, or a tilt panel when the design calls for one uninterrupted face. That means designer looks without prototype risk: standard tracks, standard springs and standard openers underneath, with the finish doing the talking. We work with genuine Australian-made doors as an authorised dealer for B&D, Steel-Line, Gliderol and Avanti.",
      "Material choice is where we earn our keep. Real cedar is unmatched up close but needs re-oiling to stay that way; powder-coated aluminium battens give the same lines with almost no upkeep and shrug off coastal salt air; timber-look steel and composite panels split the difference on budget. We'll lay out the trade-offs plainly at the design consult, with samples, and the quote names the exact door and finish.",
    ],
  },

  problems: [
    { label: "Street appeal for a renovation or new build", icon: "Home" },
    { label: "Plain door letting a striking façade down", icon: "Palette" },
    { label: "Cedar door weathered grey and flaking", icon: "AlertTriangle" },
    { label: "Coastal home needing salt-proof materials", icon: "ShieldCheck" },
    { label: "Non-standard opening size or shape", icon: "Ruler" },
    { label: "Matching door wanted for a shopfront or office", icon: "Building2" },
  ],

  includedItems: [
    "Design consult with material and finish samples",
    "On-site measure of the opening, headroom and side room",
    "Made-to-measure door on a sectional or tilt base",
    "Springs and hardware sized to the finished panel weight",
    "Removal and disposal of the old door",
    "Optional quiet opener, fitted and programmed",
    "Balance and safety testing through full travel",
    "Lifetime workmanship warranty",
  ],

  processSteps: [
    {
      title: "Design consult",
      description: "We look at the façade, talk materials and budget, and bring samples to the measure.",
      icon: "Palette",
    },
    {
      title: "Exact quote",
      description: "The quote names the base door, cladding, finish and opener — nothing vague.",
      icon: "FileText",
    },
    {
      title: "Made to order",
      description: "Your door is manufactured to the millimetre — we confirm the lead time upfront.",
      icon: "PackageCheck",
    },
    {
      title: "Installation day",
      description: "Old door out, new door hung on springs sized for its real weight, tested end to end.",
      icon: "Wrench",
    },
    {
      title: "Handover & care guide",
      description: "Opener programmed, finish care explained, lifetime workmanship warranty registered.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Custom work is quoted to the design — these are the honest brackets we see:",
    rows: [
      {
        label: "Custom / designer door (supply & install)",
        price: "$5,000–$15,000",
        note: "Cedar, aluminium slat, timber-look, glass — sized to your opening",
      },
      {
        label: "New garage door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "The baseline a custom design is priced against",
      },
      {
        label: "Motor / opener (supply & install)",
        price: "$770–$990",
        note: "Quiet belt-drive with remotes and app control",
      },
    ],
  },

  whyChoose: [
    {
      title: "Designed to the façade",
      description: "Battens, slats and finishes matched to your cladding, fencing and entry door.",
      icon: "Palette",
    },
    {
      title: "Proven base underneath",
      description: "Sectional or tilt mechanics with standard parts — designer looks, no prototype risk.",
      icon: "Layers",
    },
    {
      title: "Honest material advice",
      description: "Real cedar vs timber-look aluminium vs composite — trade-offs explained with samples.",
      icon: "Scale",
    },
    {
      title: "Coast-ready options",
      description: "Powder-coated aluminium and marine-grade finishes for beachside suburbs.",
      icon: "ShieldCheck",
    },
    {
      title: "Weighted correctly",
      description: "Cladding adds kilograms — springs and openers are specified for the finished door.",
      icon: "Settings",
    },
    {
      title: "One team, start to finish",
      description: "Design, measure, manufacture coordination and install by the same local crew.",
      icon: "BadgeCheck",
    },
  ],

  relatedServices: [
    {
      name: "Our Work — Gallery",
      href: "/gallery",
      description: "Recent installs across Perth, including custom and designer doors.",
      icon: "Camera",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "The most common base for a custom design — insulated and quiet.",
      icon: "Layers",
    },
    {
      name: "Tilt Garage Doors Perth",
      href: "/tilt-garage-doors-perth",
      description: "One uninterrupted panel — the base for flush architectural fronts.",
      icon: "DoorOpen",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Quiet belt-drive motors with the torque for heavier clad doors.",
      icon: "Cpu",
    },
    {
      name: "Commercial & Industrial Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "Custom fronts for offices, showrooms and shopfronts too.",
      icon: "Building2",
    },
  ],

  serviceAreas: [
    "Applecross",
    "South Perth",
    "Hillarys",
    "Scarborough",
    "Subiaco",
    "Fremantle",
    "Joondalup",
    "Victoria Park",
    "Ellenbrook",
    "Canning Vale",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Khaled K.",
      rating: 5,
      text: "Capital Garage Doors provided exceptional service from start to finish. Their team was professional, prompt and knowledgeable. The quality of work exceeded my expectations and the pricing was fair.",
      service: "Installation",
    },
  ],

  faqs: [
    {
      question: "How much does a custom garage door cost in Perth?",
      answer:
        "Most custom doors land between $5,000 and $15,000 supplied and installed, depending on size, base type and material — a cedar-batten double door sits at the upper end, powder-coated aluminium slats and timber-look steel usually less. For comparison, a standard door is $3,000–$5,000. The design consult produces an exact itemised quote before anything is ordered.",
    },
    {
      question: "What materials can a custom garage door be made from?",
      answer:
        "The popular Perth choices are Western red cedar and timber battens, powder-coated aluminium slats, low-maintenance timber-look steel and composite panels, and frosted glass or perforated infills for a lit-at-night look. Each can be arranged vertically or horizontally, and colours are matched to your façade.",
    },
    {
      question: "Real timber or timber-look — which should I choose?",
      answer:
        "Real cedar looks and feels unmatched up close, but it needs re-oiling every year or two to keep its colour, especially in full sun. Timber-look aluminium and composite finishes get you the same lines with almost no upkeep and better salt-air resistance — most coastal clients choose them. We bring samples of both so you can decide in daylight, on your driveway.",
    },
    {
      question: "How long does a custom garage door take?",
      answer:
        "Custom doors are made to order, so there's a manufacturing lead time after the design is locked in — typically a few weeks, confirmed exactly with your quote. The installation itself is normally done in a single visit: old door out, new door hung, balanced and tested the same day.",
    },
    {
      question: "Are custom doors built on a sectional or a tilt base?",
      answer:
        "Either, and the design decides. A sectional base suits most homes — it takes insulation, runs quietly and handles heavy cladding well. A tilt base gives one completely uninterrupted panel, which flush architectural fronts need. Both use standard tracks, springs and openers underneath, sized to the finished door's weight.",
    },
    {
      question: "Will a custom door survive coastal Perth?",
      answer:
        "Yes, with the right spec. For beachside suburbs we steer clients toward powder-coated aluminium battens and marine-grade hardware, which shrug off salt air, and we set a sensible service schedule so springs and fittings stay protected. Real timber works by the coast too — it just asks for more regular oiling.",
    },
  ],

  cta: {
    heading: "Have a Look in Mind?",
    subtitle:
      "Bring a photo, a sketch or just the street view — we'll bring samples, measure the opening and quote the exact door, with no call-out fee to quote.",
  },

  seo: {
    title: "Custom Garage Doors Perth | Cedar, Slat & Designer Doors",
    description:
      "Custom garage doors made for Perth homes — cedar battens, aluminium slats, timber-look and glass, supplied and installed from $5,000. Free design consult.",
  },
};
