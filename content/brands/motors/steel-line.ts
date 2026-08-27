import type { BrandPage } from "@/types/brand";

/**
 * /steel-line-garage-door-motors-perth — Steel-Line calls itself "Australia's largest garage
 * door manufacturer" (45+ years) and runs its own Perth branch in Wangara; its F-linX platform
 * is the named smart-control layer across its opener range. Steel-Line IS a dealer brand here —
 * "authorised dealer" wording is used. Specific opener MODEL names beyond "F-linX" were not
 * confirmed in research (docs/marketing/brand-research-2026-08/entities/steel-line.md), so
 * `models` is omitted rather than invented. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/steel-line-garage-door-motors-perth.md).
 */
export const steelLineGarageDoorMotorsPerth: BrandPage = {
  brand: "steel-line",
  kind: "motor",
  slug: "steel-line-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Steel-Line Garage Door Motors Perth | Repairs & Remotes",
    description:
      "Steel-Line opener trouble? Same-day Perth repairs, F-linX remote coding and replacement, from an authorised Steel-Line dealer. Call for a fixed price quote.",
  },
  hero: {
    h1: "Steel-Line Garage Door Motors in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "Australia's largest door manufacturer's opener range, kept running by an authorised local dealer: faults diagnosed on the day and F-linX remotes coded on the spot.",
    pills: [
      { icon: "Wrench", label: "Same-day Steel-Line repairs" },
      { icon: "Wifi", label: "F-linX remotes coded" },
      { icon: "ShieldCheck", label: "Authorised Steel-Line dealer" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia — manufacturing 45+ years" },
    { label: "Known for", value: "Australia's largest garage door manufacturer" },
    { label: "Smart control", value: "F-linX wireless platform" },
    { label: "Door types", value: "Sectional, roller, tilt & commercial" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Steel-Line garage door motors are repaired, re-programmed and replaced across Perth by Capital Garage Door, an authorised Steel-Line dealer. Most faults — a motor that hums but won't lift, an F-linX remote that's stopped connecting, a door that reverses before it closes — are fixed in one same-day visit. When a Steel-Line opener has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, remotes and programming included.",
  intro: {
    heading: "Why Steel-Line Openers Are Everywhere in Perth",
    paragraphs: [
      "Steel-Line has manufactured garage doors and openers in Australia for more than 45 years, and it's the brand our technicians see most often on Perth garages — from established suburbs through to newer estate developments. Steel-Line's own automation, built around its F-linX wireless platform, ships as the matching opener on a large share of the sectional and roller doors it sells, which is one reason our vans carry more Steel-Line parts than almost any other brand.",
      "The company runs its own Perth branch out of Wangara with separate sales and service lines, but plenty of Steel-Line openers we're called out to were never installed by Steel-Line directly — they arrived with a project home or were fitted by a previous owner's builder. Whoever put it in, the faults we see are familiar: a remote that's stopped talking to the receiver, an F-linX unit that won't reconnect, or a door that opens fine but refuses to close because a safety sensor has drifted out of alignment.",
      "Most of these faults are a straightforward repair, and being an authorised Steel-Line dealer means we fit genuine-compatible parts rather than a generic substitute that may not suit the F-linX platform. Where an opener is old enough that parts are getting hard to source, we'll say so and quote a clean replacement instead of chasing the same fault twice — and if the door itself ever needs attention, our technicians handle Steel-Line doors too.",
    ],
  },
  services: [
    {
      title: "Steel-Line opener repairs",
      description: "F-linX, sensor and drive faults diagnosed on the day, with the parts these units use carried on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Steel-Line remotes & F-linX programming",
      description: "Genuine-compatible remotes supplied and coded to your opener, with wall buttons, keypads or the F-linX app reconnected in the same visit.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Steel-Line opener",
      description: "When repair no longer stacks up, a new Capital motor fitted the same day with WiFi app control and a fresh workmanship warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description: "Force and travel limits re-set, safety reverse tested, drive checked and the door balanced so the opener isn't doing the springs' job.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  faults: [
    { label: "Motor hums but won't lift the door", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote or F-linX app won't connect", icon: "Wifi", problemSlug: "garage-door-remote-not-working" },
    { label: "Door opens but won't close (sensor fault)", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way through its travel", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Noisy, grinding opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The opener is under about ten years old and the fault is a sensor, remote, gear or limit setting.",
      "The motor still lifts the door smoothly once the springs are re-tensioned — the drive itself is healthy.",
      "You only need remotes coded, a wall button paired or the F-linX app reconnected.",
      "A repair at {{price:motor-repair}} restores a unit with years of life left in the drive.",
    ],
    replaceWhen: [
      "It's an older unit with a failing board and Steel-Line parts for it are getting hard to source.",
      "The opener has been repaired before and a second major fault has appeared within a couple of years.",
      "You want WiFi app control, a battery backup or a quieter drive the old unit can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than the repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Steel-Line opener work is priced from the same guide list as every opener we touch: a repair covers diagnosis and the common parts, a replacement at {{price:motor-replace}} includes the new motor, remotes, F-linX programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the drive board itself",
    "Door type and weight — a heavy insulated sectional needs a higher-rated motor",
    "Extras like F-linX app control, a battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "Where can I buy a replacement remote for my Steel-Line garage door in Perth?",
      answer:
        "We supply genuine-compatible Steel-Line remotes and code them to your opener on the spot, which is usually simpler than sourcing one yourself and hoping it pairs. We can also wipe a lost remote from the unit's memory so it can no longer open your door, and pair wall buttons or the F-linX app in the same visit.",
    },
    {
      question: "Can I buy a Steel-Line garage door remote at Bunnings?",
      answer:
        "Bunnings' garage door range is limited and doesn't reliably stock Steel-Line-specific remotes, so most customers find it faster to have us supply and code a genuine-compatible remote directly. That way it's tested against your opener before we leave, rather than a trial-and-error purchase.",
    },
    {
      question: "Are Steel-Line garage door openers any good?",
      answer:
        "Steel-Line has manufactured doors and openers in Australia for more than 45 years and its F-linX-enabled range is generally reliable when the door is balanced and serviced. As with any opener, most of the faults we see trace back to maintenance — a motor left to drag an unbalanced door wears out faster than one serviced yearly.",
    },
    {
      question: "How much does it cost to replace a Steel-Line garage door opener in Perth?",
      answer:
        "A like-for-like replacement of a Steel-Line opener is {{price:motor-replace}} supplied and installed, covering the motor, remotes, safety sensors, F-linX programming and disposal of the old unit. If your existing motor can be repaired instead, that's typically {{price:motor-repair}} — we quote both before any work starts.",
    },
    {
      question: "What is F-linX and can you connect it to my phone?",
      answer:
        "F-linX is Steel-Line's wireless control platform for its openers, letting the door be operated beyond the usual handheld remote. If your F-linX unit has stopped connecting, that's almost always a repair — a re-pair, a reset or a receiver fault — rather than something needing a full replacement, and we sort it on the day.",
    },
    {
      question: "Are you an authorised Steel-Line dealer in Perth?",
      answer:
        "Yes — we supply, install, service and repair Steel-Line openers as an authorised dealer, which means genuine-compatible parts and F-linX-matched remotes rather than a generic substitute. That applies whether we installed the original opener or you're calling about a Steel-Line unit fitted by a previous owner's builder.",
    },
  ],
  relatedBrands: ["b-and-d", "gliderol", "merlin", "chamberlain"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Steel-Line garage doors Perth", href: "/steel-line-garage-doors-perth" },
  ],
  serviceAreas: ["Osborne Park", "Stirling", "Malaga", "Duncraig", "Kingsley", "Success", "Willetton", "Belmont"],
  cta: {
    heading: "Steel-Line Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the opener's head unit and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
