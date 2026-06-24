import type { ServicePage } from "@/types/service-page";

export const garageDoorRepairsPerth: ServicePage = {
  serviceName: "Garage Door Repairs Perth",
  slug: "garage-door-repairs-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Repairs Perth",
    subtitle:
      "Fast, reliable garage door repairs across Perth — from broken springs to faulty motors. Local technicians, transparent quotes, and same-day service available.",
    badges: [
      { icon: "MapPin", label: "Local Perth Technicians" },
      { icon: "Siren", label: "Emergency Repairs Available" },
      { icon: "ShieldCheck", label: "Warranty Support" },
      { icon: "Building2", label: "Residential & Commercial" },
    ],
    image: "/images/services/garage-door-repair.webp",
    imageAlt: "Capital Garage Door technician repairing a residential garage door in Perth",
    floatingCardLabel: "Same-Day Service Available",
  },

  directAnswer:
    "Capital Garage Door provides professional garage door repairs across Perth, covering broken springs, faulty motors, remote issues, off-track doors, and doors that won't open or close. Most repairs are completed same-day, with a clear quote provided before any work begins.",

  intro: {
    heading: "Professional Garage Door Repairs Across Perth",
    paragraphs: [
      "A garage door that's stuck, noisy, or unresponsive is more than an inconvenience — it's a security and safety concern for your home or business. Capital Garage Door repairs all major garage door brands and opener systems for homeowners and businesses across the Perth metro area.",
      "Our technicians are equipped to diagnose and resolve the full range of garage door issues, from a simple remote fault to a broken torsion spring or a motor that's reached the end of its life. Every job starts with a proper inspection so the fix addresses the actual cause, not just the symptom.",
      "Whether your door won't open, won't close, has come off its track, or is making unusual noises, we'll get it assessed and repaired with minimal disruption — with workmanship backed by warranty support.",
    ],
  },

  problems: [
    { label: "Door won't open", icon: "AlertTriangle", slug: "garage-door-wont-open" },
    { label: "Door stuck halfway", icon: "PauseCircle", slug: "garage-door-stuck-halfway" },
    { label: "Remote not working", icon: "Radio", slug: "garage-door-remote-not-working" },
    { label: "Motor not responding", icon: "Cpu", slug: "garage-door-motor-not-responding" },
    { label: "Broken spring or cable", icon: "Cable", slug: "garage-door-spring-or-cable-broken" },
    { label: "Door off track", icon: "Move", slug: "garage-door-off-track" },
    { label: "Noisy garage door", icon: "Volume2", slug: "noisy-garage-door" },
    { label: "Door not closing properly", icon: "XCircle", slug: "garage-door-wont-close" },
  ],

  includedItems: [
    "Full inspection and fault diagnosis",
    "Track and roller condition checks",
    "Motor and remote system checks",
    "Spring and cable safety assessment",
    "Safety and balance testing",
    "Clear repair recommendation",
    "Upfront quote before any work begins",
    "Warranty support on completed repairs",
  ],

  processSteps: [
    {
      title: "Contact us or request a quote",
      description: "Call, request a quote online, or upload a photo of the issue — whichever is easiest.",
      icon: "PhoneCall",
    },
    {
      title: "Tell us what's happening",
      description: "Describe the issue or upload a photo/video so our technician arrives prepared with the right parts.",
      icon: "Camera",
    },
    {
      title: "On-site inspection",
      description: "We inspect the door, track, springs, cables, and opener to find the exact cause of the problem.",
      icon: "Search",
    },
    {
      title: "Repair or recommendation",
      description: "Most issues are repaired on the spot. If parts are needed, we'll give you a clear quote first.",
      icon: "Wrench",
    },
    {
      title: "After-service & warranty",
      description: "We test the door for safety and smooth operation, and back the repair with warranty support.",
      icon: "ShieldCheck",
    },
  ],

  costGuidance: {
    intro:
      "Every garage door and fault is different, so final pricing is confirmed after inspection. As a guide:",
    rows: [
      { label: "Minor adjustment", price: "From a low call-out rate", note: "Often resolved during the initial visit" },
      { label: "Remote or motor issue", price: "Varies by fault", note: "Depends on repair vs. replacement" },
      { label: "Track or roller repair", price: "Varies by damage", note: "Realignment vs. parts replacement" },
      { label: "Spring or cable repair", price: "Varies by door size", note: "Pricing depends on spring type and door weight" },
      { label: "Emergency repair", price: "Request a quote", note: "Same-day and after-hours response available" },
    ],
  },

  whyChoose: [
    { title: "Local Perth technicians", description: "Based locally and familiar with Perth homes and door styles.", icon: "MapPin" },
    { title: "Fast response", description: "Same-day service available across most of the Perth metro area.", icon: "Clock3" },
    { title: "Experienced team", description: "Trained technicians who work on all major garage door and opener brands.", icon: "Users" },
    { title: "Clear, upfront quotes", description: "You'll know the cost before any work begins — no surprises.", icon: "FileText" },
    { title: "Quality parts", description: "We use durable, brand-appropriate parts built to last.", icon: "PackageCheck" },
    { title: "Warranty support", description: "Completed repairs are backed by warranty support for peace of mind.", icon: "ShieldCheck" },
  ],

  relatedServices: [
    {
      name: "Garage Door Installation Perth",
      href: "/garage-door-installation-perth",
      description: "New garage door supply and installation for any home.",
      icon: "DoorOpen",
    },
    {
      name: "Garage Door Motor Replacement Perth",
      href: "/garage-door-motor-replacement-perth",
      description: "Opener and motor replacement, including smart Wi-Fi upgrades.",
      icon: "Cpu",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Repairs for residential and commercial roller doors.",
      icon: "Settings",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Urgent, after-hours response for doors stuck open or closed.",
      icon: "Siren",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-servicing-perth",
      description: "Preventive maintenance to catch issues before they become repairs.",
      icon: "ShieldCheck",
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
    "Subiaco",
    "Victoria Park",
  ],

  reviews: [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Our garage door wouldn't open one morning and they had a technician out the same day. Friendly, fast, and fixed it properly.",
      suburb: "Joondalup",
      service: "Garage Door Repair",
    },
    {
      name: "David T.",
      rating: 5,
      text: "Broken spring sorted quickly and safely. Quoted upfront with no surprises on the day.",
      suburb: "Canning Vale",
      service: "Spring Repair",
    },
    {
      name: "Priya R.",
      rating: 5,
      text: "Great communication from booking through to the repair. Door runs smoother than ever now.",
      suburb: "Scarborough",
      service: "Garage Door Repair",
    },
  ],

  faqs: [
    {
      question: "How quickly can you repair my garage door in Perth?",
      answer:
        "In most cases, we offer same-day garage door repairs across the Perth metro area. The exact arrival time depends on your suburb and the technician's current schedule, but urgent issues are prioritised.",
    },
    {
      question: "How much does a garage door repair cost?",
      answer:
        "Cost depends on the cause — a remote or sensor issue is typically far cheaper than a spring, cable, or motor replacement. We provide a clear quote before any work begins, after inspecting the door.",
    },
    {
      question: "Can you fix any brand of garage door or opener?",
      answer:
        "Yes, our technicians work on all major garage door and opener brands, including chain, belt, and direct-drive motor systems.",
    },
    {
      question: "Is it safe to try to fix a broken spring or cable myself?",
      answer:
        "No. Garage door springs and cables are under high tension and can cause serious injury if mishandled. These repairs should always be left to a trained technician.",
    },
    {
      question: "Do you offer emergency garage door repairs?",
      answer:
        "Yes, emergency repairs are available for doors stuck open or closed, which can pose a security or safety risk. Contact us and we'll prioritise getting a technician to you.",
    },
    {
      question: "Do you repair garage doors for businesses as well as homes?",
      answer:
        "Yes, we repair both residential and commercial garage and roller doors across Perth, including doors used for higher-frequency commercial access.",
    },
    {
      question: "Can I send a photo or video of the problem before booking?",
      answer:
        "Yes — uploading a photo or short video when you request a quote helps our technician diagnose the issue in advance and arrive with the right parts.",
    },
  ],

  cta: {
    heading: "Need Garage Door Repairs in Perth?",
    subtitle: "Get a fast response and a clear quote from your local Capital Garage Door team.",
  },

  seo: {
    title: "Garage Door Repairs Perth | Same-Day Service | Capital Garage Door",
    description:
      "Professional garage door repairs across Perth. Broken springs, faulty motors, off-track doors, and more — same-day service available. Get a free quote today.",
  },
};
