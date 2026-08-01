import type { ServicePage } from "@/types/service-page";

/**
 * /tilt-garage-doors-perth — tilt (counterweight) doors, new and repaired.
 *
 * The softest of the four door-type SERPs (directory listings rank page 1) and
 * the site's last uncovered door style. Deliberately dual-intent: new
 * custom-clad tilt doors AND the arms/springs repair work older Perth tilt
 * doors constantly need — competitors cover one or the other, not both.
 * "Counterweight" is the synonym no Perth installer's title uses. Prices
 * mirror components/sections/smart-calculator/pricing-data.ts; the live CMS
 * page pins the matching catalog rows.
 */
export const tiltGarageDoorsPerth: ServicePage = {
  serviceName: "Tilt Garage Doors Perth",
  slug: "tilt-garage-doors-perth",
  pageType: "service",

  hero: {
    h1: "Tilt Garage Doors Perth",
    subtitle:
      "One clean panel, no tracks across the ceiling — tilt and counterweight doors supplied, installed and repaired across Perth, from flush architectural fronts to older doors that just need new arms.",
    badges: [
      { icon: "MapPin", label: "Local Perth Installers" },
      { icon: "Layers", label: "Custom Cladding Options" },
      { icon: "Wrench", label: "Arms & Spring Repairs" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/door-types/tilt-garage-door-perth-modern-home.webp",
    imageAlt: "Matte black one-piece tilt garage door on a modern rendered Perth home",
    floatingCardLabel: "Free Measure & Quote",
  },

  directAnswer:
    "Capital Garage Doors installs and repairs tilt garage doors across Perth. A new tilt door typically costs $3,000–$5,000 supplied and installed; custom-clad and oversize doors range $5,000–$15,000, and replacing the pivot arms and springs on an older tilt door is $1,200–$1,800. A tilt door is a single rigid panel that swings up on counterweighted pivot arms — the style to pick when you want one uninterrupted face for architectural cladding, or when your garage has almost no headroom for tracks.",

  intro: {
    heading: "One Panel, Endless Finishes — and Repairs for the Old Ones",
    paragraphs: [
      "A tilt door (also called a counterweight door) is a single rigid panel that pivots up and back on spring-balanced arms instead of bending through tracks. Because the face is one uninterrupted sheet, it's the door builders and architects reach for when the garage front should disappear into the façade — clad it in the same material as the wall and the door all but vanishes.",
      "We supply new tilt doors made to measure in Colorbond-style steel or ready for custom cladding — timber battens, composite panels or fibre-cement to match your build. The counterweight system is sized to the finished panel weight, which is the detail that separates a door that glides from one that slams: heavier custom cladding needs the arms and springs specified for it, not adjusted after the fact.",
      "Perth also has thousands of older tilt doors from the 70s, 80s and 90s still swinging on their original hardware. If yours has started drifting, sticking or dropping on one side, the frame is usually fine — worn pivot arms and tired springs are the culprits, and we replace them as a matched kit rather than condemning a door with decades of life left in it.",
    ],
  },

  problems: [
    { label: "Old tilt door drifting or dropping on one side", icon: "AlertTriangle" },
    { label: "Worn pivot arms, kicked-out springs", icon: "Wrench" },
    { label: "Architectural front needing one flush panel", icon: "Layers" },
    { label: "Almost no headroom for tracks or a drum", icon: "Ruler" },
    { label: "Carport conversion needing a secure door", icon: "Lock" },
    { label: "Heavy custom cladding to counterweight", icon: "Scale" },
  ],

  includedItems: [
    "On-site measure of the opening, headroom and side room",
    "New door supply — steel finish or clad-ready frame",
    "Counterweight arms and springs sized to the panel weight",
    "Removal and disposal of the old door",
    "Pivot arm and spring kit replacement on existing doors",
    "Optional opener rated for tilt-door weight, fitted and programmed",
    "Balance and safety testing through the full swing",
    "Lifetime workmanship warranty",
  ],

  processSteps: [
    {
      title: "Measure and quote",
      description: "We check the opening, headroom and side room, and price the door or repair kit exactly.",
      icon: "FileText",
    },
    {
      title: "Choose the finish",
      description: "Colorbond-style steel, or a clad-ready frame for timber, composite or fibre-cement.",
      icon: "Palette",
    },
    {
      title: "Built for the weight",
      description: "Arms and springs are specified to the finished panel weight, cladding included.",
      icon: "Scale",
    },
    {
      title: "Installation day",
      description: "Old door out, new panel hung and counterweighted, swing tested edge to edge.",
      icon: "Wrench",
    },
    {
      title: "Handover & warranty",
      description: "We program any opener, show you the manual release, and register the warranty.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Your exact quote depends on the panel size, finish and cladding weight — confirmed upfront:",
    rows: [
      {
        label: "New tilt door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "Includes old-door removal and disposal",
      },
      {
        label: "Tilt-door arms kit + springs",
        price: "$1,200–$1,800",
        note: "Matched replacement kit for older tilt doors",
      },
      {
        label: "New door — custom clad / oversize",
        price: "$5,000–$15,000",
        note: "Architectural cladding, wide or extra-tall panels",
      },
      {
        label: "Motor / opener (supply & install)",
        price: "$770–$990",
        note: "Rated for the panel weight, with remotes and app control",
      },
    ],
  },

  whyChoose: [
    {
      title: "Counterweighted properly",
      description: "Arms and springs sized to the real panel weight, so the door glides instead of slamming.",
      icon: "Scale",
    },
    {
      title: "Repairs, not just replacements",
      description: "Matched arm-and-spring kits keep a sound older door swinging for years more.",
      icon: "Wrench",
    },
    {
      title: "Clad it your way",
      description: "Timber battens, composite or fibre-cement — one flush panel that matches the façade.",
      icon: "Layers",
    },
    {
      title: "Fits where tracks don't",
      description: "No ceiling tracks and minimal headroom needed — ideal for carports and low garages.",
      icon: "Ruler",
    },
    {
      title: "Old door taken away",
      description: "Removal and disposal of your existing door is part of the job, not an extra.",
      icon: "Truck",
    },
    {
      title: "Warranty-backed",
      description: "Manufacturer warranty on the door, lifetime workmanship warranty on the install.",
      icon: "ShieldCheck",
    },
  ],

  relatedServices: [
    {
      name: "Garage Doors Perth",
      href: "/garage-doors-perth",
      description: "Compare all four door styles, prices and what's included before you choose.",
      icon: "Home",
    },
    {
      name: "Sectional vs Roller vs Tilt: Full Comparison",
      href: "/blog/sectional-vs-roller-vs-tilt-garage-doors",
      description: "All three door styles compared on cost, space, noise and looks.",
      icon: "Scale",
    },
    {
      name: "Custom Garage Doors Perth",
      href: "/custom-garage-doors-perth",
      description: "Cedar, slat and designer finishes — many are built on a tilt-door base.",
      icon: "Palette",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables and hardware repairs for every door type, tilt included.",
      icon: "Wrench",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "Want insulation and panel styles instead? Compare our sectional range.",
      icon: "Layers",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Openers with the grunt for a one-piece door, with Wi-Fi app control.",
      icon: "Cpu",
    },
  ],

  serviceAreas: [
    "Subiaco",
    "Victoria Park",
    "South Perth",
    "Bayswater",
    "Fremantle",
    "Applecross",
    "Kalamunda",
    "Midland",
    "Scarborough",
    "Willetton",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Trina S.",
      rating: 5,
      text: "So impressed with the support from the team after two garage doors went, with a home open looming. They inspected, ordered parts and completed repairs within 24 hours. Highly recommended.",
      service: "Door Repairs",
    },
  ],

  faqs: [
    {
      question: "What is a tilt garage door?",
      answer:
        "A tilt door — also called a counterweight door — is a single rigid panel that swings up and back on spring-balanced pivot arms, rather than bending through tracks like a sectional or coiling like a roller door. The one-piece face makes it the best canvas for architectural cladding, and the mechanism needs very little headroom.",
    },
    {
      question: "How much does a tilt garage door cost in Perth?",
      answer:
        "A new standard tilt door is typically $3,000–$5,000 supplied and installed, including removal of your old door. Custom-clad and oversize panels range $5,000–$15,000 depending on the material and size, and a replacement arms-and-springs kit for an existing tilt door is $1,200–$1,800. Every quote is itemised upfront.",
    },
    {
      question: "Can you repair my old tilt door instead of replacing it?",
      answer:
        "Usually, yes. If the panel and frame are sound, worn pivot arms and tired springs are what make an older tilt door drift, stick or drop on one side — and we replace them as a matched kit for $1,200–$1,800. If the panel itself is rusted through or twisted, we'll tell you straight and quote a new door instead.",
    },
    {
      question: "When is a tilt door the right choice?",
      answer:
        "When you want one uninterrupted panel for a flush architectural look, when your garage or carport has almost no headroom for tracks or a roller drum, or when you're matching a heritage home where tilt doors are original. If insulation or the quietest possible door matters more, a sectional is usually the better pick — we'll advise at the measure.",
    },
    {
      question: "Can a tilt door be clad to match my house?",
      answer:
        "Yes — that's the style's signature move. We supply clad-ready frames for timber battens, composite boards or fibre-cement so the door reads as part of the façade. The critical detail is weight: cladding adds real kilograms, so we specify the counterweight arms and springs for the finished panel, not the bare frame.",
    },
    {
      question: "Can tilt doors be motorised?",
      answer:
        "Yes. A one-piece panel is heavier than a sectional of the same size, so we fit openers rated for the door's actual weight — typically $770–$990 supplied, installed and programmed with remotes and smartphone control. A well-balanced tilt door can also stay manual; the counterweights do most of the lifting.",
    },
  ],

  cta: {
    heading: "New Tilt Door, or New Arms for the Old One?",
    subtitle:
      "Tell us what the door's doing — or the look you're after — and we'll measure, advise and quote the exact job, with no call-out fee to quote.",
  },

  seo: {
    title: "Tilt Garage Doors Perth | Custom & Counterweight Doors",
    description:
      "Tilt and counterweight garage doors in Perth — custom-clad new doors from $3,000, plus matched arm and spring kits for older doors. Free measure and quote.",
  },
};
