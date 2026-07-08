import type { ServicePage } from "@/types/service-page";

/**
 * /roller-door-installation-perth — new roller door supply & installation.
 *
 * Built to close an audit gap: several live pages linked this URL before it
 * existed (it 404'd), and "roller door installation perth" is a real
 * commercial query the site had no dedicated page for. Prices mirror
 * components/sections/smart-calculator/pricing-data.ts (the pricing source of
 * truth); the live CMS page pins the matching catalog rows.
 */
export const rollerDoorInstallationPerth: ServicePage = {
  serviceName: "Roller Door Installation Perth",
  slug: "roller-door-installation-perth",
  pageType: "service",

  hero: {
    h1: "Roller Door Installation Perth",
    subtitle:
      "New roller doors supplied and installed across Perth — homes, sheds, and commercial premises. Measured, fitted and tested by local technicians, with old-door removal included.",
    badges: [
      { icon: "MapPin", label: "Local Perth Installers" },
      { icon: "PackageCheck", label: "Supply & Install" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
      { icon: "Building2", label: "Residential & Commercial" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/industrial-roller-door-service-perth.webp",
    imageAlt: "Large industrial roller door installed and serviced inside a Perth warehouse",
    floatingCardLabel: "Free Measure & Quote",
  },

  directAnswer:
    "Capital Garage Door supplies and installs new roller doors across Perth for homes, garages, sheds and commercial premises. A standard residential roller door typically costs $3,000–$5,000 supplied and installed, including removal and disposal of the old door; larger commercial and custom doors range $5,000–$15,000. We measure your opening, recommend the right curtain and motor, and back every installation with our lifetime workmanship warranty.",

  intro: {
    heading: "New Roller Doors, Measured and Fitted Properly",
    paragraphs: [
      "Roller doors are the practical workhorse of Perth garages: the curtain rolls into a compact barrel above the opening, so they suit tight driveways, low-headroom garages, sheds and shopfronts where a sectional door's ceiling tracks won't fit. A well-installed roller door is smooth, secure and takes up almost no internal space.",
      "As an authorised dealer for the brands Perth relies on — B&D, Steel-Line, Gliderol and Avanti — we supply steel roller doors in a wide range of colours, sized to your exact opening. Every installation starts with a proper site measure, because a curtain that isn't square to its guides wears quickly and never runs quietly.",
      "Your installer removes and disposes of the old door, fits the new curtain, guides and axle, tensions and balances the door, and tests it through its full travel. Add a motor and your roller door opens from the remote or your phone; keep it manual and we'll set the spring tension so it lifts easily by hand.",
    ],
  },

  problems: [
    { label: "Curtain badly dented or rusted", icon: "AlertTriangle" },
    { label: "Old door beyond economical repair", icon: "Wrench" },
    { label: "Manual door you want motorised", icon: "Cpu" },
    { label: "Stiff, noisy or unbalanced curtain", icon: "Volume2" },
    { label: "Shed or warehouse security upgrade", icon: "ShieldCheck" },
    { label: "New build or renovation opening", icon: "DoorOpen" },
  ],

  includedItems: [
    "On-site measure of the opening and headroom",
    "Door supply in your choice of colour",
    "Removal and disposal of the old door",
    "Curtain, guides and axle installation",
    "Spring tensioning and balance setup",
    "Optional motor supply, fitting and programming",
    "Full operation and safety testing",
    "Lifetime workmanship warranty",
  ],

  processSteps: [
    {
      title: "Measure and quote",
      description: "We measure your opening and give you a clear supplied-and-installed price.",
      icon: "FileText",
    },
    {
      title: "Choose your door",
      description: "Pick the colour and finish, and decide whether you want the door motorised.",
      icon: "DoorOpen",
    },
    {
      title: "We order your door",
      description: "Doors are made to measure — we confirm the lead time with your quote.",
      icon: "PackageCheck",
    },
    {
      title: "Installation day",
      description: "Old door out, new door in — fitted, tensioned, and tested through its full travel.",
      icon: "Wrench",
    },
    {
      title: "Handover & warranty",
      description: "We walk you through operation and register your workmanship warranty.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Your exact quote depends on the opening size, colour and motor choice — confirmed upfront:",
    rows: [
      {
        label: "New roller door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "Includes old-door removal and disposal",
      },
      {
        label: "Roller door removal & reinstall",
        price: "$880–$1,500",
        note: "Re-using your existing door on a new opening",
      },
      {
        label: "New door — commercial / custom",
        price: "$5,000–$15,000",
        note: "Oversize openings, industrial curtains, shopfronts",
      },
      {
        label: "Motor / opener (supply & install)",
        price: "$770–$990",
        note: "Add remote and smartphone control to the new door",
      },
    ],
  },

  whyChoose: [
    {
      title: "Authorised dealer",
      description: "We install genuine B&D, Steel-Line, Gliderol and Avanti doors — no grey imports.",
      icon: "BadgeCheck",
    },
    {
      title: "Measured properly",
      description: "Every door is sized to your actual opening, so the curtain runs true in its guides.",
      icon: "FileText",
    },
    {
      title: "Old door taken away",
      description: "Removal and disposal of your existing door is part of the job, not an extra.",
      icon: "PackageCheck",
    },
    {
      title: "Motorised or manual",
      description: "We fit and program openers on the day, or balance the door for easy manual lifting.",
      icon: "Cpu",
    },
    {
      title: "Warranty-backed",
      description: "Manufacturer warranty on the door, lifetime workmanship warranty on the install.",
      icon: "ShieldCheck",
    },
    {
      title: "Homes and businesses",
      description: "From single-garage doors to industrial warehouse curtains across the Perth metro.",
      icon: "Building2",
    },
  ],

  relatedServices: [
    {
      name: "Roller Door vs Sectional Door: Which Is Better?",
      href: "/roller-door-vs-sectional-door",
      description: "Not sure a roller door is the right fit? Compare the two styles side by side.",
      icon: "Scale",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Repairs and servicing if your existing roller door still has life left in it.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Belt-drive Capital motors with Wi-Fi control, supplied and installed.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description: "Sectional, roller and tilt door installation for any Perth home.",
      icon: "DoorOpen",
    },
    {
      name: "Commercial & Industrial Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "Heavy-duty roller shutters and doors for warehouses, workshops and shopfronts.",
      icon: "Building2",
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
    "Ellenbrook",
    "Wanneroo",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Janelle S.",
      rating: 5,
      text: "Musab was extremely efficient, professional, organised and a nice bloke. Would highly recommend his service and installation of roller doors to anyone.",
      service: "Roller Door Installation",
    },
  ],

  faqs: [
    {
      question: "How much does a new roller door cost in Perth?",
      answer:
        "A standard residential roller door is typically $3,000–$5,000 supplied and installed, including removal of the old door. Commercial and custom doors range $5,000–$15,000 depending on the opening size and curtain specification. Adding a motor is around $770–$990 supplied and installed — we quote the full job upfront before anything is ordered.",
    },
    {
      question: "How long does roller door installation take?",
      answer:
        "The installation itself is normally completed in a single visit once your door arrives. Because roller doors are made to measure, there's a manufacturing lead time after you order — we confirm the expected timeframe with your quote so you know exactly when to plan for.",
    },
    {
      question: "Can my new roller door be motorised?",
      answer:
        "Yes. We can fit and program an opener on installation day, giving you remote and smartphone control, or supply the door manual with the spring tension balanced for easy hand lifting. A motor can also be added to a manual roller door later.",
    },
    {
      question: "Will a roller door fit a garage with low headroom?",
      answer:
        "Roller doors are usually the best option for tight spaces — the curtain rolls into a compact barrel above the opening instead of tracking back along the ceiling. We measure your headroom and side room on the quote visit to confirm the fit before you commit.",
    },
    {
      question: "Do you install commercial roller doors and shutters?",
      answer:
        "Yes — we install and service roller doors and shutters for warehouses, workshops, storage units and shopfronts across Perth, from a single door to every door on the site. Commercial curtains are specified for the opening size and daily cycle count.",
    },
    {
      question: "Which roller door brands do you install?",
      answer:
        "We're an authorised dealer for B&D, Steel-Line, Gliderol and Avanti, and we install and service all major Australian brands. Your quote will name the exact door and colour so you can compare like for like.",
    },
  ],

  cta: {
    heading: "Ready for a New Roller Door?",
    subtitle:
      "Tell us about your opening and we'll come back with a clear supplied-and-installed price — no call-out fee to quote.",
  },

  seo: {
    title: "Roller Door Installation Perth | Capital Garage Door",
    description:
      "New roller doors supplied and installed across Perth — homes, sheds and commercial premises. Old-door removal, motor options and upfront quotes from $3,000.",
  },
};
