import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-remote-replacement-perth — remotes, receivers & keypads.
 *
 * Built from the 2026-08 Semrush pull: "garage door remote replacement" is
 * 1,000/mo at KD 16, surrounded by a cheap cluster — garage door opener remote
 * 1,000/14, spare garage door opener 1,000/15, gdo remote 720/9, centurion
 * garage door remote 590/6, remote control for garage doors 590/16. The
 * how-to-program blog guides funnel here. Prices mirror pricing-data.ts
 * ("Remote (extra / replacement)": $95 each + $120 attend & program).
 */
export const garageDoorRemoteReplacementPerth: ServicePage = {
  serviceName: "Garage Door Remote Replacement Perth",
  slug: "garage-door-remote-replacement-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Remote Replacement Perth",
    subtitle:
      "Lost, broken or worn-out garage door remotes replaced and programmed across Perth — genuine remotes for Merlin, B&D, Centurion, ATA, Avanti, Gliderol and more.",
    badges: [
      { icon: "Radio", label: "All Major Brands" },
      { icon: "Zap", label: "Programmed On the Spot" },
      { icon: "ShieldCheck", label: "Genuine & Compatible Remotes" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-installation-perth.webp",
    imageAlt: "Technician programming a replacement garage door remote to a newly installed opener in Perth",
    floatingCardLabel: "Same-Visit Programming",
  },

  directAnswer:
    "Capital Garage Doors replaces and programs garage door remotes across Perth. Replacement remotes are $95 each plus a single $120 attendance to program them to your motor — one attendance covers as many remotes as you need. We carry genuine and quality compatible remotes for all the major Australian brands — Merlin, B&D, Centurion, ATA, Avanti, Gliderol and Steel-Line — plus wall keypads and receiver upgrades for older motors, and if the real problem turns out to be the opener rather than the remote, we can repair or replace that on the same visit.",

  intro: {
    heading: "Every Brand of Garage Door Remote, Sorted in One Visit",
    paragraphs: [
      "A garage door remote is a small thing until it stops working — then you're parking on the street and letting yourself in through the house. Whether the remote is lost, crushed, waterlogged or simply worn out, we supply the right replacement and program it to your motor on the spot, along with any spares you want for the rest of the household.",
      "Brand matching matters: a remote must speak your motor's rolling-code protocol, and the market is full of cheap generic remotes that pair unreliably or drop out after a few weeks. We carry genuine and proven-compatible remotes for the openers Perth homes actually have — Merlin, B&D (including TriTran), Centurion, ATA, Avanti, Gliderol and Steel-Line — so what we fit keeps working.",
      "Sometimes the remote isn't the problem. If a new remote won't hold its pairing, the receiver board or the motor's logic board may be failing — common on openers over ten years old. Because our technicians are opener specialists, not just remote couriers, the same visit can diagnose the motor, replace the receiver, or upgrade you to a new opener with Wi-Fi phone control if that's the smarter spend.",
    ],
  },

  problems: [
    { label: "Remote lost or stolen", icon: "Search" },
    { label: "Remote worn out or buttons failing", icon: "Radio" },
    { label: "New remote won't pair with the motor", icon: "XCircle" },
    { label: "Range dropped — only works up close", icon: "Wifi" },
    { label: "Need spares for family or tenants", icon: "Users" },
    { label: "Old motor with no remotes available", icon: "Cpu" },
  ],

  includedItems: [
    "Genuine and compatible remotes for all major brands",
    "Programming to your motor, on the spot",
    "One attendance covers any number of remotes",
    "Old remotes wiped from the motor's memory after loss or theft",
    "Wall-mount keypads supplied and coded",
    "Receiver upgrades for older motors",
    "Range and antenna checks",
    "Opener repair or replacement on the same visit if needed",
  ],

  processSteps: [
    {
      title: "Tell us your motor",
      description: "Brand and model (a photo of the powerhead is perfect) — we confirm the right remote before we come.",
      icon: "Camera",
    },
    {
      title: "We bring the remotes",
      description: "Genuine or proven-compatible units for your opener, plus spares if you want them.",
      icon: "PackageCheck",
    },
    {
      title: "Wipe and re-code",
      description: "Lost or stolen remotes are erased from the motor's memory so they can't open your door.",
      icon: "ShieldCheck",
    },
    {
      title: "Program and test",
      description: "Every remote paired and tested through full open-close cycles, including range.",
      icon: "Zap",
    },
    {
      title: "Fix the real fault if it's the motor",
      description: "Failing receiver or logic board? We quote the repair or upgrade on the spot.",
      icon: "Wrench",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list — remotes are priced per unit with one attendance fee regardless of how many we program:",
    rows: [
      {
        label: "Replacement remote",
        price: "$95 each",
        note: "Plus one $120 attendance to program — any number of remotes",
      },
      {
        label: "Motor / opener repair",
        price: "$380–$490",
        note: "If the receiver or logic board is the real fault",
      },
      {
        label: "Motor / opener replacement",
        price: "$770–$990",
        note: "New opener supplied, installed and programmed — remotes included",
      },
      {
        label: "Wi-Fi / smart control (supply & install)",
        price: "$280–$380",
        note: "Open and monitor the door from your phone",
      },
    ],
  },

  whyChoose: [
    {
      title: "Right remote, first time",
      description: "We match the rolling-code protocol to your exact motor — no generic remotes that unpair.",
      icon: "BadgeCheck",
    },
    {
      title: "Security handled",
      description: "Lost and stolen remotes are wiped from the motor so old codes can't open your door.",
      icon: "ShieldCheck",
    },
    {
      title: "One attendance fee",
      description: "Program one remote or five — the attendance is charged once.",
      icon: "CircleDollarSign",
    },
    {
      title: "Opener expertise on tap",
      description: "If the motor is the real fault, the same technician diagnoses and quotes it immediately.",
      icon: "Cpu",
    },
    {
      title: "All of Perth",
      description: "Metro-wide coverage, usually within a day or two for remote jobs.",
      icon: "MapPin",
    },
    {
      title: "Upgrade path",
      description: "Old motor with unobtainable remotes? We'll price a receiver upgrade against a new opener honestly.",
      icon: "TrendingUp",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Motors, receivers, sensors and logic boards diagnosed and repaired.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motors Perth",
      href: "/garage-door-motors-perth",
      description: "Our Capital 1100N & 1500N openers with Wi-Fi control, supplied and installed.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Remote Not Working?",
      href: "/problems/garage-door-remote-not-working",
      description: "Quick checks to run before booking a call-out.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, tracks and panels — the full repair service.",
      icon: "Hammer",
    },
    {
      name: "Garage Door Motor Replacement Cost",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new opener really costs in Perth, and when it beats repairing.",
      icon: "CircleDollarSign",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "Annual tune-ups that keep the whole door — not just the remote — reliable.",
      icon: "CalendarCheck",
    },
  ],

  serviceAreas: [
    "Joondalup",
    "Scarborough",
    "Morley",
    "Midland",
    "Canning Vale",
    "Thornlie",
    "Cockburn Central",
    "Rockingham",
    "Baldivis",
    "Mandurah",
  ],

  // Real Google review (content/reviews.ts) — the CMS page pins the same review.
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
      question: "How much does a replacement garage door remote cost in Perth?",
      answer:
        "Replacement remotes are $95 each, plus a single $120 attendance to program them to your motor — and that one attendance covers as many remotes as you need, so spares are only ever $95 more. If you'd rather try programming a remote yourself first, our guides cover the common brands, but note that some older motors need the receiver's learn button pressed at the powerhead, which is where most DIY attempts get stuck.",
    },
    {
      question: "Can you replace a remote for any brand of garage door motor?",
      answer:
        "Almost always. We carry genuine and proven-compatible remotes for the brands Perth homes actually use — Merlin, B&D (including TriTran security remotes), Centurion, ATA, Avanti, Gliderol and Steel-Line — and universal receiver kits for the rare motor whose original remotes are no longer made. Send us a photo of the motor's powerhead when you book and we'll confirm compatibility before we come.",
    },
    {
      question: "My remote was lost or stolen — can someone open my garage?",
      answer:
        "Until the motor's memory is cleared, yes — the missing remote still works. That's why the first thing we do on a lost-or-stolen job is wipe every stored code from the opener and re-program only the remotes in your hand. It takes minutes, and it's worth doing promptly: a garage remote in a stolen handbag with your driver's licence is an address and a way in.",
    },
    {
      question: "Why won't my new remote pair with my motor?",
      answer:
        "Three usual reasons. The remote's code protocol doesn't match your motor — common with cheap online generics. The motor's memory is full — older units store a limited number of remotes and need a memory clear first. Or the receiver itself is failing, which shows up as remotes that pair but drop out days later. We diagnose which it is on the spot and carry the parts for all three outcomes.",
    },
    {
      question: "My remote only works right next to the door — what's wrong?",
      answer:
        "Shrinking range usually isn't the remote's battery alone. LED garage lighting and other electronics can interfere with the receiver, the receiver's antenna wire may be coiled or damaged, or the receiver board is ageing. We check battery, antenna and interference in that order, and if the receiver is the fault we can replace it or fit an external receiver with much better range.",
    },
    {
      question: "Is it worth adding smart phone control instead of more remotes?",
      answer:
        "Often, yes. A Wi-Fi smart-control kit is $280–$380 supplied and installed, lets everyone in the house open the door from their phone, and shows you whether the door is open from anywhere — which ends the drove-off-and-can't-remember worry. It's especially good value for rentals and multi-driver households where handing out and recovering physical remotes is a hassle.",
    },
  ],

  cta: {
    heading: "Need a Remote That Just Works?",
    subtitle:
      "Tell us your motor's brand — or send a photo of the powerhead — and we'll bring the right remotes and program them on the spot.",
  },

  seo: {
    title: "Garage Door Remote Replacement Perth | All Brands",
    description:
      "Garage door remotes replaced & programmed across Perth — Merlin, B&D, Centurion, ATA, Avanti & more. Lost remotes wiped for security. Book a visit.",
  },
};
