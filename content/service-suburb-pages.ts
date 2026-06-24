import type { ServiceSuburbPage } from "@/types";

/**
 * Service + Suburb landing pages (Page Type 2).
 *
 * Each entry powers a reusable "[Service] in [Suburb]" local-SEO page at a flat
 * URL (e.g. /garage-door-repairs-joondalup). Keep copy unique per suburb — vary
 * the intro, nearby suburbs, and problems so pages don't read as duplicates.
 *
 * CMS-ready: this array is the only thing a new suburb page needs. Swap this
 * module for a CMS/API fetch inside lib/data/service-suburb-pages.ts without
 * touching the template or components.
 *
 * NOTE: `localProof` entries are placeholders — wire them to real CRM job /
 * case-study data (service performed, suburb, before/after photos) once that
 * integration is available.
 */
export const serviceSuburbPages: ServiceSuburbPage[] = [
  {
    slug: "garage-door-repairs-joondalup",
    service: "Garage Door Repairs",
    suburb: "Joondalup",
    region: "Perth, WA",

    // Dedicated pages for these suburbs don't exist yet — link to the
    // service-areas index instead of a flat URL that would 404.
    nearbySuburbs: [
      { label: "Edgewater", href: "/service-areas" },
      { label: "Currambine", href: "/service-areas" },
      { label: "Heathridge", href: "/service-areas" },
      { label: "Connolly", href: "/service-areas" },
      { label: "Ocean Reef", href: "/service-areas" },
      { label: "Mullaloo", href: "/service-areas" },
      { label: "Wanneroo", href: "/service-areas" },
      { label: "Woodvale", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Fast, reliable garage door repair services for homes and businesses in Joondalup and nearby Perth suburbs.",
      trustBadges: [
        "Local Perth Team",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors provides garage door repairs in Joondalup, including motor issues, broken springs, damaged tracks, noisy doors, remote problems, and doors that won't open or close properly.",

    localIntro: [
      "From family homes near Lakeside Joondalup to businesses around the Joondalup CBD, a faulty garage door is more than an inconvenience — it affects your security, your daily routine, and the look of your property. Our local Perth technicians repair residential and commercial garage doors across Joondalup, with same-day and emergency options when you need to get moving fast.",
      "Whether it's a sudden breakdown — a door that won't open before the morning commute — or a slow-developing issue like grinding noise, jerky movement, or a remote that's stopped responding, we diagnose the real cause and fix it properly the first time. We regularly service the wider northern corridor too, including Edgewater, Currambine, Ocean Reef and Wanneroo.",
      "Not sure what's wrong? Upload a photo or short video of your garage door and we'll give you a clear idea of the likely fix and an honest estimate before we arrive — no guesswork, no surprise call-out fees.",
    ],

    availableServices: [
      {
        title: "Garage Door Repairs",
        description:
          "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
        icon: "Wrench",
      },
      {
        title: "Motor & Opener Replacement",
        description:
          "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
        icon: "Cpu",
      },
      {
        title: "Roller Door Repairs",
        description:
          "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
        icon: "Disc3",
      },
      {
        title: "Sectional Door Repairs",
        description:
          "Panel, hinge, roller and track repairs for sectional garage doors of all brands.",
        icon: "LayoutPanelTop",
      },
      {
        title: "Spring & Cable Repairs",
        description:
          "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
        icon: "Cable",
      },
      {
        title: "Emergency Repairs",
        description:
          "Door stuck open or shut? Priority response across Joondalup to secure your home or business fast.",
        icon: "Siren",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
      },
    ],

    problems: [
      {
        title: "Door won't open",
        description:
          "Often a broken spring, snapped cable, or motor fault — we find the cause and get you moving again.",
        icon: "DoorClosed",
      },
      {
        title: "Remote not working",
        description:
          "Flat batteries, lost programming, or a failing receiver — we test, re-pair, or replace as needed.",
        icon: "BatteryWarning",
      },
      {
        title: "Door stuck halfway",
        description:
          "Usually an obstruction, off-track roller, or safety-sensor issue stopping the door mid-travel.",
        icon: "TrafficCone",
      },
      {
        title: "Loud or noisy operation",
        description:
          "Grinding, banging or squealing points to worn rollers, loose hardware, or springs needing attention.",
        icon: "Volume2",
      },
      {
        title: "Broken cable or spring",
        description:
          "High-tension parts wear out — we replace them safely with correctly rated components.",
        icon: "Cable",
      },
      {
        title: "Door off track",
        description:
          "A door that's jumped its tracks is a safety risk — we realign and repair the rollers and tracks.",
        icon: "Scale",
      },
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Joondalup — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts.",
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — roller, sectional, tilt or custom",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Site access and how the door is installed",
        "Whether a repair will last, or a replacement is the smarter long-term option",
      ],
      note: "Send a photo of your door for a faster, more accurate estimate.",
    },

    whyChooseUs: [
      {
        title: "Local Perth specialists",
        description:
          "A Perth-based team that knows Joondalup and the northern suburbs — not a faceless call centre.",
        icon: "MapPin",
      },
      {
        title: "Fast response up north",
        description:
          "We're set up to reach Joondalup and surrounding suburbs quickly, with same-day options.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "After-service support",
        description:
          "Questions after we leave? We're a phone call away and happy to help.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Motor Replacement Perth", href: "/garage-door-repairs-perth" },
      { label: "Roller Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-repairs-perth" },
      { label: "Emergency Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],

    faqs: [
      {
        question: "Do you repair garage doors in Joondalup?",
        answer:
          "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Joondalup and the surrounding northern Perth suburbs, including same-day and emergency repairs.",
      },
      {
        question: "Can you repair garage door motors in Joondalup?",
        answer:
          "We do. We diagnose, repair and replace garage door motors and openers in Joondalup, and can recommend a suitable replacement unit if yours has reached the end of its life.",
      },
      {
        question: "Do you service nearby suburbs?",
        answer:
          "Yes — we regularly work across the northern corridor, including Edgewater, Currambine, Heathridge, Connolly, Ocean Reef, Mullaloo, Wanneroo and Woodvale.",
      },
      {
        question: "Can I upload a photo before booking?",
        answer:
          "Absolutely. Send a photo or short video of your garage door through our quote form and we'll give you a clearer idea of the likely repair and an estimate before we arrive.",
      },
      {
        question: "Do you offer emergency garage door repair?",
        answer:
          "Yes. If your door is stuck open or shut and your home or business isn't secure, we offer priority emergency repairs across Joondalup.",
      },
      {
        question: "How much does garage door repair cost in Joondalup?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote or send a photo for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Spring Replacement",
        suburb: "Joondalup",
        problem: "Door wouldn't lift after a torsion spring snapped overnight.",
        solution: "Replaced both springs with correctly rated units and rebalanced the door — same day.",
      },
      {
        serviceType: "Motor Replacement",
        suburb: "Edgewater",
        problem: "Ageing opener was straining, reversing randomly and running loudly.",
        solution: "Fitted a quiet, warranty-backed motor and re-tuned the travel limits.",
      },
      {
        serviceType: "Off-Track Repair",
        suburb: "Ocean Reef",
        problem: "Door jumped its tracks and jammed at an angle after a knock.",
        solution: "Realigned the tracks, replaced two damaged rollers and tested full travel.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Joondalup | Fast Local Repairs",
      description:
        "Fast, reliable garage door repairs in Joondalup, Perth. Broken springs, motors, tracks, remotes & noisy doors fixed by a local team. Emergency repairs & free quotes.",
    },
  },
];
