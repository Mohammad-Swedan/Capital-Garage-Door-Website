import type { ServicePage } from "@/types/service-page";

/**
 * /sectional-garage-doors-perth — sectional door supply & installation.
 *
 * Built to close an audit gap: live pages linked this URL before it existed
 * (it 404'd), and "sectional garage doors perth" is a high-intent buying query
 * the site had no dedicated page for. Prices mirror
 * components/sections/smart-calculator/pricing-data.ts; the live CMS page pins
 * the matching catalog rows.
 */
export const sectionalGarageDoorsPerth: ServicePage = {
  serviceName: "Sectional Garage Doors Perth",
  slug: "sectional-garage-doors-perth",
  pageType: "service",

  hero: {
    h1: "Sectional Garage Doors Perth",
    subtitle:
      "Insulated, quiet and street-smart — sectional garage doors supplied and installed across Perth, from classic flat panels to timber-look finishes.",
    badges: [
      { icon: "MapPin", label: "Local Perth Installers" },
      { icon: "Layers", label: "Insulated Panel Options" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
      { icon: "BadgeCheck", label: "Authorised Dealer" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/new-garage-doors-installed-perth.webp",
    imageAlt: "Row of new timber-look sectional garage doors installed by Capital Garage Doors in Perth",
    floatingCardLabel: "Free Measure & Quote",
  },

  directAnswer:
    "Capital Garage Doors supplies and installs sectional garage doors across Perth. A standard sectional door typically costs $3,000–$5,000 supplied and installed, including removal of your old door; oversize and custom doors range $5,000–$15,000. Sectional doors travel up and back along ceiling tracks in hinged panels, which makes them the quietest, best-insulated and most design-flexible option for most Perth homes — we measure your garage, help you choose panels and colours, and back the install with our lifetime workmanship warranty.",

  intro: {
    heading: "The Most Popular Garage Door Style in Perth — Done Right",
    paragraphs: [
      "Sectional garage doors open in hinged panels that travel up and back along ceiling tracks, sealing the full opening when closed. That construction is why they dominate new Perth homes: they run quietly, take insulation well, and come in the widest range of profiles and finishes — from clean flat panels to timber-look boards that lift the whole front of the house.",
      "As an authorised dealer for B&D, Steel-Line, Gliderol and Avanti, we supply genuine made-to-measure sectional doors, including foam-core insulated panels that keep a garage workshop, gym or store room noticeably cooler through a Perth summer. Every quote names the exact door, profile and colour so you can compare like for like.",
      "Installation covers removal and disposal of your old door — tilt, roller or sectional — new tracks and springs sized to the door's weight, and balance and safety testing through the full travel. Pair the door with a quiet belt-drive opener and it's smooth enough to live under a bedroom.",
    ],
  },

  problems: [
    { label: "Old tilt or roller door due for an upgrade", icon: "RefreshCw" },
    { label: "Garage too hot — needs insulated panels", icon: "Layers" },
    { label: "Street appeal for a renovation or sale", icon: "Home" },
    { label: "Noisy door under a bedroom or living area", icon: "Volume2" },
    { label: "Panels dented, rusted or delaminating", icon: "AlertTriangle" },
    { label: "New build needing a made-to-measure door", icon: "DoorOpen" },
  ],

  includedItems: [
    "On-site measure of the opening, headroom and side room",
    "Door supply in your choice of profile and colour",
    "Removal and disposal of the old door",
    "New tracks, springs and hardware sized to the door",
    "Optional insulated panel upgrade",
    "Optional belt-drive opener, fitted and programmed",
    "Balance and safety testing through full travel",
    "Lifetime workmanship warranty",
  ],

  processSteps: [
    {
      title: "Measure and quote",
      description: "We check your opening, headroom and side room, then price the exact door you want.",
      icon: "FileText",
    },
    {
      title: "Choose panels and colour",
      description: "Flat, ribbed or timber-look profiles; standard or insulated panels; any Colorbond-style shade.",
      icon: "Layers",
    },
    {
      title: "We order your door",
      description: "Sectional doors are made to measure — we confirm the lead time with your quote.",
      icon: "PackageCheck",
    },
    {
      title: "Installation day",
      description: "Old door out, new tracks and springs in, door hung, balanced and tested.",
      icon: "Wrench",
    },
    {
      title: "Handover & warranty",
      description: "We program your remotes, walk you through operation, and register the warranty.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Your exact quote depends on the door size, profile and insulation — confirmed upfront:",
    rows: [
      {
        label: "New sectional door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "Includes old-door removal and disposal",
      },
      {
        label: "Sectional door removal & reinstall",
        price: "$990–$1,300",
        note: "Re-using your existing door on a new opening",
      },
      {
        label: "New door — oversize / custom",
        price: "$5,000–$15,000",
        note: "Wide double doors, custom profiles, commercial",
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
      title: "Authorised dealer",
      description: "Genuine B&D, Steel-Line, Gliderol and Avanti doors, named brand-for-brand on your quote.",
      icon: "BadgeCheck",
    },
    {
      title: "Insulation that works",
      description: "Foam-core panel options that make a real difference in a Perth summer.",
      icon: "Layers",
    },
    {
      title: "Springs sized properly",
      description: "Tracks and springs matched to the door's actual weight, so it stays balanced for years.",
      icon: "Settings",
    },
    {
      title: "Quiet as standard",
      description: "Paired with a belt-drive opener, a sectional door is the quietest option there is.",
      icon: "Volume2",
    },
    {
      title: "Old door taken away",
      description: "Removal and disposal of your existing door is part of the job, not an extra.",
      icon: "PackageCheck",
    },
    {
      title: "Warranty-backed",
      description: "Manufacturer warranty on the door, lifetime workmanship warranty on the install.",
      icon: "ShieldCheck",
    },
  ],

  relatedServices: [
    {
      name: "Roller Door vs Sectional Door: Which Is Better?",
      href: "/roller-door-vs-sectional-door",
      description: "Weigh up both styles on cost, space, insulation and looks before you decide.",
      icon: "Scale",
    },
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description: "Our full installation service for sectional, roller and tilt doors.",
      icon: "DoorOpen",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Quiet belt-drive Capital motors with Wi-Fi control — the ideal sectional pairing.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, panels and tracks repaired if your current door just needs help.",
      icon: "Wrench",
    },
    {
      name: "Roller Door Installation Perth",
      href: "/roller-door-installation-perth",
      description: "Tight on headroom? A roller door might suit your garage better.",
      icon: "Move",
    },
    {
      name: "Custom Garage Doors Perth",
      href: "/custom-garage-doors-perth",
      description: "Cedar, slat and designer finishes built on a sectional base.",
      icon: "Palette",
    },
    {
      name: "Tilt Garage Doors Perth",
      href: "/tilt-garage-doors-perth",
      description: "One flush panel for architectural fronts and tight headroom.",
      icon: "DoorOpen",
    },
  ],

  serviceAreas: [
    "Joondalup",
    "Canning Vale",
    "Fremantle",
    "Scarborough",
    "Midland",
    "Rockingham",
    "Morley",
    "Baldivis",
    "Thornlie",
    "Clarkson",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Khaled K.",
      rating: 5,
      text: "Capital Garage Doors provided exceptional service from start to finish. Their team was professional, prompt and knowledgeable. The quality of work exceeded my expectations and the pricing was fair.",
      service: "Installation & Repairs",
    },
  ],

  faqs: [
    {
      question: "How much does a sectional garage door cost in Perth?",
      answer:
        "A standard sectional door is typically $3,000–$5,000 supplied and installed, including removal of your old door. Oversize doubles, custom profiles and commercial doors range $5,000–$15,000, and adding a quiet belt-drive opener is around $770–$990. We quote the exact door and colour upfront before anything is ordered.",
    },
    {
      question: "Are insulated sectional doors worth it in Perth?",
      answer:
        "If you use the garage as more than parking — a workshop, gym, laundry or store room — yes. Foam-core insulated panels noticeably reduce heat coming through the door in summer and also stiffen and quieten the door. If the garage is unconditioned parking space only, a standard panel is usually fine.",
    },
    {
      question: "How long does installation take?",
      answer:
        "The changeover itself is normally completed in a single visit: old door out, new tracks and springs in, door hung and tested. Because sectional doors are made to measure, there's a manufacturing lead time after ordering — we confirm the timeframe with your quote.",
    },
    {
      question: "Does my garage have enough headroom for a sectional door?",
      answer:
        "Sectional doors need clearance above the opening for the tracks and curl, which most Perth garages have. If your headroom is tight — a low bulkhead or unusually low ceiling — a roller door can be the safer fit. We measure both on the quote visit and tell you plainly which will work.",
    },
    {
      question: "Can you replace just a damaged panel later?",
      answer:
        "Yes — one advantage of a sectional door is that individual panels can be replaced if they're dented or damaged, usually $550–$1,100 depending on availability and colour matching. That's often far cheaper than replacing the whole door after a minor bump.",
    },
    {
      question: "Which opener suits a sectional door best?",
      answer:
        "A belt-drive opener is the ideal pairing — it's the quietest drive type, which matters when the garage sits under or beside living areas. Our Capital 1100N suits standard doors and the 1500N handles large, insulated or heavier timber-look doors; both include Wi-Fi app control.",
    },
  ],

  cta: {
    heading: "Thinking About a Sectional Door?",
    subtitle:
      "Tell us about your garage and the look you're after — we'll measure, recommend and quote the exact door, with no call-out fee to quote.",
  },

  seo: {
    title: "Sectional Garage Doors Perth | Capital Garage Doors",
    description:
      "Sectional garage doors supplied and installed across Perth — insulated panels, timber-look finishes and quiet belt-drive motors. Free measure and quote.",
  },
};
