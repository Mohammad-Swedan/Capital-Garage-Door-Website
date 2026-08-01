import type { ServicePage } from "@/types/service-page";

/**
 * /garage-doors-perth — the parent product/buying hub for the whole door range.
 *
 * Why this page exists (GSC, 28 days to 2026-08-01): the "garage doors perth"
 * buy cluster pulls 1,641 impressions / 2 clicks across 68 queries at average
 * position 30–58 — "garage doors perth" (210 imp @ 52.5), "residential garage
 * doors perth" (101 @ 34.0), "garage door perth" (97 @ 41.8), "garage doors
 * perth prices" (81 @ 25.4), "designer garage doors perth" (38 @ 31.9) — and no
 * page targets it. The site had the four TYPE pages (roller / sectional / tilt /
 * custom) but no parent for the head term, so Google was left choosing between
 * the homepage, the thin /services listing and the legacy /services/garage-doors
 * URL. A live Perth SERP (DataForSEO, location_code 1000676) confirms the top 10
 * is entirely supply-and-install hub pages of exactly this shape.
 *
 * It is also the new 301 target for the legacy /services/garage-doors — the #4
 * URL site-wide by impressions (1,525) — which previously pointed at /services.
 *
 * Scope is BUYING intent only: which door style suits which garage, what a new
 * door costs, and how the measure-and-quote works. Repairs live on
 * /garage-door-repairs-perth and each style's detail lives on its type page
 * (linked, never duplicated). Prices mirror
 * components/sections/smart-calculator/pricing-data.ts; the live CMS page pins
 * the matching catalog rows so the figures can only come from the price list.
 */
export const garageDoorsPerth: ServicePage = {
  serviceName: "Garage Doors Perth",
  slug: "garage-doors-perth",
  pageType: "service",

  hero: {
    h1: "Garage Doors Perth",
    subtitle:
      "New garage doors supplied and installed across Perth — roller, sectional, tilt and custom-made — measured to your opening and quoted upfront, with your old door removed.",
    badges: [
      { icon: "Home", label: "Residential & Commercial" },
      { icon: "Palette", label: "Full Colour Range" },
      { icon: "Ruler", label: "Free Measure & Quote" },
      { icon: "ShieldCheck", label: "Lifetime Workmanship Warranty" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/steel-line-garage-door-installation-baldivis-perth.webp",
    imageAlt:
      "New Steel-Line sectional garage door supplied and installed by Capital Garage Doors on a Baldivis home in Perth",
    floatingCardLabel: "Free Measure & Quote",
  },

  directAnswer:
    "A new garage door in Perth costs $3,000–$5,000 supplied and installed by Capital Garage Doors, including removal and disposal of your old door; oversize, commercial and fully custom doors range $5,000–$15,000, and adding an automatic opener is $770–$990. We supply all four styles — roller, sectional, tilt and custom-made — in the full Colorbond-style colour range, as an authorised dealer for B&D, Steel-Line, Centurion, Gliderol and Avanti. Every job starts with a free on-site measure, and the price we quote is the price you pay.",

  intro: {
    heading: "Choosing the Right Garage Door for Your Perth Home",
    paragraphs: [
      "A garage door is the largest moving part of your house and usually the biggest thing people see from the street, so it is worth getting right. The four styles we supply solve different problems: roller doors coil into a drum and suit tight headroom and short driveways, sectional doors lift on ceiling tracks and give you insulation and the widest choice of panel looks, tilt doors swing as one solid slab and suit heritage and character homes, and custom doors let you match timber, batten or architectural cladding to the rest of the build.",
      "Price follows size, style and finish rather than brand alone. A standard single or double door supplied and installed sits at $3,000–$5,000 with your old door removed and taken away, while oversize openings, commercial curtains and bespoke cladding run $5,000–$15,000. Automation is a separate line — $770–$990 for a motor supplied, fitted and programmed with your remotes — so you can see exactly what each part of the job costs instead of a single lump sum.",
      "We are an authorised dealer for the major Australian manufacturers, so your quote names the actual door, size, colour and motor rather than a vague inclusion. That matters when you are comparing quotes: two prices for \"a new double door\" can be thousands apart because one is a base curtain and the other an insulated sectional with a smart opener. We will tell you plainly which specification is worth paying for in your garage and which is not.",
      "Perth conditions shape the recommendation too. Coastal suburbs from Scarborough down to Rockingham chew through untreated hardware, so we spec galvanised and corrosion-resistant fittings near the water. West-facing garages take a beating from afternoon sun, where an insulated sectional keeps the space usable. And if your opening is out of square after a renovation, we would rather find that at the measure than on installation day.",
      "Once you have chosen, the process is straightforward: we measure the opening, headroom and side room, order the door to your exact width, then remove the old door and fit, tension and test the new one — usually in a single visit. Every installation carries our lifetime workmanship warranty on top of the manufacturer's warranty on the door itself.",
    ],
  },

  problems: [
    { label: "Old door dented, rusted or past repair", icon: "AlertTriangle" },
    { label: "Building or renovating and need a new door", icon: "Home" },
    { label: "Manual door you want automated", icon: "Cpu" },
    { label: "Door style that dates the front of the house", icon: "Palette" },
    { label: "Tight headroom limiting your options", icon: "Ruler" },
    { label: "Noisy, slow door disturbing the house", icon: "Volume2" },
    { label: "Coastal corrosion eating the hardware", icon: "ShieldCheck" },
    { label: "Warehouse or shopfront needing a commercial door", icon: "Warehouse" },
  ],

  includedItems: [
    "Free on-site measure of the opening, headroom and side room",
    "Written quote naming the exact door, size, colour and motor",
    "Removal and disposal of your old door",
    "Supply of the new door from an authorised dealer",
    "All new tracks, springs, guides and hardware",
    "Spring tensioning and full balance setup",
    "Optional motor supplied, fitted and programmed to your remotes",
    "Operation and safety testing before we leave",
    "Lifetime workmanship warranty plus the manufacturer's door warranty",
  ],

  processSteps: [
    {
      title: "Free measure",
      description:
        "We measure the opening, headroom and side room on site and check the frame is square before anything is ordered.",
      icon: "Ruler",
    },
    {
      title: "Choose style and colour",
      description:
        "Roller, sectional, tilt or custom, in the full Colorbond-style palette or a bespoke timber and batten finish.",
      icon: "Palette",
    },
    {
      title: "Upfront written quote",
      description:
        "One clear price naming the door, size, colour and any motor — no call-out fee to quote, no surprises later.",
      icon: "FileText",
    },
    {
      title: "Your door is made",
      description:
        "Doors are built to your exact width. We confirm the lead time with the quote and book the fit around you.",
      icon: "PackageCheck",
    },
    {
      title: "Installation day",
      description:
        "Old door out and taken away, new door fitted, tensioned and run through its full travel with you watching.",
      icon: "Wrench",
    },
    {
      title: "Handover and warranty",
      description:
        "We program the remotes, show you the manual release, and register your workmanship and manufacturer warranties.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins these same catalog rows,
  // so the figures can only ever come from the price list.
  costGuidance: {
    intro:
      "Typical Perth supplied-and-installed ranges from our own price list. Your exact figure depends on the opening size, style, colour and whether you automate — all confirmed in writing before anything is ordered:",
    rows: [
      {
        label: "New garage door — standard (supply & install)",
        price: "$3,000–$5,000",
        note: "Roller, sectional or tilt; includes old-door removal and disposal",
      },
      {
        label: "New door — commercial / custom",
        price: "$5,000–$15,000",
        note: "Oversize openings, bespoke cladding, warehouse and shopfront doors",
      },
      {
        label: "Motor / opener (supply & install)",
        price: "$770–$990",
        note: "Remotes programmed and smartphone app control set up on the day",
      },
      {
        label: "Roller door removal & reinstall",
        price: "$880–$1,500",
        note: "Re-using your existing door, e.g. after rendering or a re-clad",
      },
    ],
  },

  whyChoose: [
    {
      title: "Authorised dealer",
      description:
        "Genuine B&D, Steel-Line, Centurion, Gliderol and Avanti doors, named brand-for-brand on your quote.",
      icon: "BadgeCheck",
    },
    {
      title: "All four styles",
      description:
        "Roller, sectional, tilt and custom under one roof, so the advice isn't shaped by what we happen to stock.",
      icon: "Layers",
    },
    {
      title: "Free measure and quote",
      description:
        "No call-out fee to price a new door, and the written quote is the price you pay on the day.",
      icon: "FileText",
    },
    {
      title: "Old door taken away",
      description:
        "Removal and disposal of your existing door is part of the job, never an extra line at the end.",
      icon: "Truck",
    },
    {
      title: "Coast-ready specification",
      description:
        "Galvanised and corrosion-resistant hardware for beachside suburbs where salt air shortens a door's life.",
      icon: "ShieldCheck",
    },
    {
      title: "Same team services it after",
      description:
        "We install it and we maintain it, so there's one number to call if anything ever needs adjusting.",
      icon: "Wrench",
    },
  ],

  relatedServices: [
    {
      name: "Roller Doors Perth",
      href: "/roller-doors-perth",
      description: "Colorbond-style curtains that coil away — the pick for tight headroom and budgets.",
      icon: "DoorOpen",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "Insulated panel doors, the quietest option and the widest choice of looks.",
      icon: "Layers",
    },
    {
      name: "Tilt Garage Doors Perth",
      href: "/tilt-garage-doors-perth",
      description: "One-piece counterweight doors that suit character and heritage Perth homes.",
      icon: "Move",
    },
    {
      name: "Custom Garage Doors Perth",
      href: "/custom-garage-doors-perth",
      description: "Timber, batten and architectural doors made to match the rest of the build.",
      icon: "Palette",
    },
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description: "How the fit-out works, from measure and lead time through to installation day.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motors & Openers Perth",
      href: "/garage-door-motors-perth",
      description: "Capital 1100N and 1500N motors with Wi-Fi app control, fitted to any new door.",
      icon: "Cpu",
    },
    {
      name: "Commercial Garage Doors Perth",
      href: "/commercial-garage-doors-perth",
      description: "Warehouse, workshop and shopfront doors specified for high daily cycles.",
      icon: "Warehouse",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Not ready to replace? Springs, motors and off-track doors repaired same-day.",
      icon: "Wrench",
    },
    {
      name: "Roller Door vs Sectional Door: Which Is Better?",
      href: "/roller-door-vs-sectional-door",
      description: "Compare the two most popular styles on cost, space, insulation and noise.",
      icon: "Scale",
    },
  ],

  serviceAreas: [
    "Joondalup",
    "Wanneroo",
    "Scarborough",
    "Morley",
    "Midland",
    "Ellenbrook",
    "Cannington",
    "Canning Vale",
    "Thornlie",
    "Southern River",
    "Armadale",
    "Baldivis",
    "Rockingham",
    "Mandurah",
    "Fremantle",
  ],

  // Real Google review (see content/reviews.ts) — the live CMS page pins the
  // same review from the Reviews catalog.
  reviews: [
    {
      name: "Jacques D.",
      rating: 5,
      text: "Had an issue with the motor on an old SDO-1 unit. Called on a Monday, asked for Wednesday morning, and he came in early and gave me options. I chose to fully replace my system and rollers, and he removed the old system and rails too. Quick and easy — not even 45 minutes, with no issues.",
      service: "Motor Replacement",
    },
  ],

  faqs: [
    {
      question: "How much is a garage door in Perth?",
      answer:
        "A new garage door in Perth is typically $3,000–$5,000 supplied and installed, and that includes removing and disposing of your old door. Oversize openings, commercial curtains and fully custom doors range $5,000–$15,000. Adding an automatic opener is a separate $770–$990 supplied, fitted and programmed. The variables that move the price are the opening size, the style you choose, whether the door is insulated, and the finish — a base steel curtain and an insulated sectional in a custom colour sit at opposite ends of that range. We quote the exact door in writing before anything is ordered, and there is no call-out fee to come and measure.",
    },
    {
      question: "What is a good price for a garage door?",
      answer:
        "For a standard Perth single or double garage, anywhere in the $3,000–$5,000 supplied-and-installed band is a fair market price provided old-door removal is included and the quote names the actual door and motor. Be careful comparing headline numbers: a quote that looks $800 cheaper often excludes disposal of the old door, uses a lighter-gauge curtain, or leaves automation off entirely. Ask any installer to itemise the door, the hardware and the opener separately — that is the only way to compare like for like. Below about $3,000 for a supplied-and-installed double door, something is usually being left out.",
    },
    {
      question: "How much does it cost to replace a garage door in Australia?",
      answer:
        "Replacement cost varies by state, door style and opening size, so the useful number is a local one. Our Perth pricing is $3,000–$5,000 for a standard door supplied and installed with the old one removed and taken away, rising to $5,000–$15,000 for oversize, commercial and fully custom work, plus $770–$990 if you are adding an opener. Replacing is the right call when the door is corroded through, the panels are buckled, or the style dates the house — but if the door itself is sound and only the springs, cables or motor have failed, a repair costs a fraction of that and is the better call. We will tell you honestly which one your door actually needs.",
    },
    {
      question: "Which type of garage door is best for a Perth home?",
      answer:
        "It depends on the garage rather than the fashion. Choose a roller door if headroom is tight, the driveway is short, or you want the ceiling clear for storage — it is also the most affordable style. Choose a sectional if you want insulation, the quietest operation and the widest choice of panel designs, which is why it is the most common pick for newer Perth homes. Choose a tilt door for character and heritage houses where a one-piece door suits the facade, and choose custom when you want timber or batten cladding to match the build. We measure and give you a straight recommendation at the quote.",
    },
    {
      question: "How long does a new garage door take to install?",
      answer:
        "The installation itself is normally a single visit — removing the old door, fitting the new tracks and springs, tensioning the door and testing its full travel all happen the same day, and you can park in the garage that night. The waiting is in manufacturing, because doors are built to your exact opening width rather than pulled off a shelf. Lead time depends on the style, colour and whether the door is custom, so we confirm it in writing with your quote and book the installation date once the door is ready, instead of leaving you chasing us for it.",
    },
    {
      question: "Do you remove and dispose of the old garage door?",
      answer:
        "Yes — removal and disposal of your existing door is included in every supply-and-install price we quote, not added as an extra at the end. That covers the door itself plus the old tracks, springs and hardware, all taken away when we leave. If you are re-using your current door after rendering, re-cladding or building work, we also do removal and reinstallation as a separate job at $880–$1,500 for a roller door.",
    },
    {
      question: "What brands of garage doors do you supply in Perth?",
      answer:
        "We are an authorised dealer for the major Australian manufacturers — B&D, Steel-Line, Centurion, Gliderol and Avanti — and we supply our own Capital 1100N and 1500N motors alongside the mainstream opener brands. Being multi-brand matters when you are buying: we are not steering you to whichever door we are contracted to shift. Your quote names the exact make, model, size and colour, and every door carries its manufacturer's warranty on top of our lifetime workmanship warranty on the installation.",
    },
    {
      question: "Can I get a new garage door with smartphone control?",
      answer:
        "Yes. Any new door can be paired with an automatic opener at $770–$990 supplied, installed and programmed, and Wi-Fi smart control is $280–$380 on top — that lets you open, close and check the door's status from your phone anywhere, and get an alert if it has been left open. Spare or replacement remotes are $95 each plus $120 to attend and program. If you would rather start manual, we balance the spring so the door lifts easily by hand and the opener can be retrofitted whenever you are ready.",
    },
    {
      question: "Do you supply garage doors for commercial premises?",
      answer:
        "Yes — we supply and install commercial and industrial doors for warehouses, workshops, shopfronts and strata complexes across Perth, from high-cycle roller doors through to wide-span curtains. Commercial and custom doors range $5,000–$15,000 depending on the span and specification, and a commercial roller door service starts around $280–$380 per door. Commercial work is specified differently from residential — heavier gauge curtains, high-cycle springs and industrial motors — so we quote it on site after seeing the opening and the daily traffic it takes.",
    },
    {
      question: "Do you install garage doors across all Perth suburbs?",
      answer:
        "Yes. Our installers cover the whole metropolitan area, from Joondalup and Wanneroo in the north through the eastern suburbs around Midland and Ellenbrook, the southern corridor of Canning Vale, Southern River, Armadale and Baldivis, and down to Rockingham and Mandurah. Our workshop is in Southern River, so the southern and south-eastern suburbs generally get the earliest appointments. Tell us your suburb when you call and we will give you a realistic measure date rather than an optimistic one.",
    },
  ],

  cta: {
    heading: "Ready to Price Your New Garage Door?",
    subtitle:
      "Tell us your opening size and the style you're after — we'll measure on site and come back with one clear supplied-and-installed price. No call-out fee to quote.",
  },

  seo: {
    title: "Garage Doors Perth | New Doors Supplied & Installed",
    description:
      "New garage doors supplied and installed across Perth from $3,000 — roller, sectional, tilt and custom. Free measure, old door removed, upfront quote.",
  },
};
