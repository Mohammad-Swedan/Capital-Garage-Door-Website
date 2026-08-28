import type { BrandPage } from "@/types/brand";

/**
 * /liftmaster-garage-door-motors-perth — mandatory disambiguation page. Per
 * docs/marketing/brand-research-2026-08/entities/liftmaster.md, TWO things share the name in
 * Australia: (1) the LiftMaster Professional range of chain/belt-drive sectional openers this
 * page covers, and (2) Liftmaster Electronics Pty Ltd, the independent Australian company
 * (est. 1969) that imports/distributes that range AND separately designs its own Magic Button
 * controls/gate motors under its own name. The intro and one FAQ say this explicitly. Per
 * controller ruling: no ownership claim in copy (entities.ts has no `ownership` field for this
 * entity — the research file's "Chamberlain Group" link is inferred, not a direct-quote citation)
 * and the AU distributor's own facts (1969 founding, its own Magic Button manufacture) are never
 * attributed to "the brand" itself. Not a supply-network brand — no reseller-status wording. Models (LM60K,
 * LM60R, LM1000K, LM1000R) match entities.ts productLines; no smart-app claim (research found
 * none stated). FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/liftmaster-garage-door-motors-perth.md).
 */
export const liftmasterGarageDoorMotorsPerth: BrandPage = {
  brand: "liftmaster",
  kind: "motor",
  slug: "liftmaster-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "LiftMaster Garage Door Openers Perth | Repairs",
    description:
      "LiftMaster Professional garage door opener not working right? Perth-wide same-day repairs, remote coding and replacement for LM60 and LM1000 openers.",
  },
  hero: {
    h1: "LiftMaster Garage Door Motors in Perth — Repairs & Replacement",
    subtitle:
      "The LiftMaster Professional range of chain- and belt-drive sectional openers, kept running by independent Perth technicians — faults diagnosed on the day, no sales pitch attached.",
    pills: [
      { icon: "Wrench", label: "Same-day LiftMaster repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "Cpu", label: "Chain & belt-drive service" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "USA" },
    { label: "Known for", value: "LM60 & LM1000 Professional chain/belt-drive openers" },
    { label: "Door types", value: "Sectional" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "LiftMaster garage door motors are repaired, re-programmed and replaced across Perth by Capital Garage Doors — independent technicians, not an appointed LiftMaster agent. \"LiftMaster\" here means the LiftMaster Professional chain- and belt-drive sectional range, distributed in Australia by Liftmaster Electronics Pty Ltd. Most faults — a motor that won't respond, a remote that's stopped pairing, a travel limit that's drifted — are fixed in one same-day visit, and a full replacement is {{price:motor-replace}} supplied and installed when a unit's genuinely done.",
  intro: {
    heading: "LiftMaster in Perth: Which \"LiftMaster\" Do We Mean?",
    paragraphs: [
      "Two different things carry the LiftMaster name in Australia, and it's worth being clear about which one this page covers. The LiftMaster Professional range — chain-drive and belt-drive sectional openers such as the LM60 and LM1000 series — is imported and distributed locally by Liftmaster Electronics Pty Ltd, an independent Australian company established in 1969. That same distributor separately designs and builds its own Magic Button controls and gate motors under a different name entirely. This page is about the LiftMaster Professional openers themselves — the sectional-door units fitted to Perth homes — not the distributor's other product lines.",
      "The LM60 and LM1000 ranges cover chain-drive and belt-drive sectional door openers, built for straightforward, no-frills operation rather than app control — LiftMaster Professional doesn't currently ship with the connected smartphone app that Merlin or Chamberlain's own DIY range do. That simplicity generally holds up well, and the faults we see most often are mechanical rather than electronic: a chain that's stretched or jumped a sprocket, a remote that's stopped pairing, a travel limit that's drifted so the door stops short of the floor, or a motor labouring because the door's springs have lost tension and it's carrying weight it was never rated for.",
      "We're not an appointed LiftMaster agent, so every repair or replacement is judged on its own merits rather than a sales target. A repair covers the part that's actually failed — a sensor, a remote, a chain or a limit setting — and gets a healthy motor back to work in one visit. Where an LM-series unit has genuinely reached the end of its working life, we replace it with a new belt-drive Capital motor, WiFi app control included, fitted the same day with a workmanship warranty a decade-old chain-drive opener never came with.",
    ],
  },
  services: [
    {
      title: "LiftMaster opener repairs",
      description: "Chain, gear, remote and travel-limit faults on the LM60 and LM1000 ranges diagnosed on the day, with common parts carried on the van.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "LiftMaster remotes & programming",
      description: "Replacement remotes supplied and coded to your LM-series opener, with wall buttons or keypads paired in the same visit.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out LiftMaster",
      description: "When repair no longer stacks up, a new belt-drive Capital motor with WiFi app control, fitted the same day with a workmanship warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description: "Chain tension, travel limits and safety reverse checked, and the door balanced so the motor isn't doing the springs' job.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "LM60K", type: "Sectional door opener", tech: "Chain drive", note: "LiftMaster's entry chain-drive Professional opener for a single sectional door." },
    { name: "LM60R", type: "Sectional door opener", tech: "Belt drive", note: "The quieter belt-drive equivalent of the LM60K." },
    { name: "LM1000K", type: "Sectional door opener", tech: "Chain drive", note: "A higher-output chain-drive unit for heavier double sectional doors." },
    { name: "LM1000R", type: "Sectional door opener", tech: "Belt drive", note: "The belt-drive version of the LM1000, rated for heavier double doors." },
  ],
  faults: [
    { label: "Motor labours or won't respond", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Chain stretched or jumped a sprocket", icon: "AlertTriangle", problemSlug: "garage-door-wont-open" },
    { label: "Remote stopped pairing", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door stops part-way (travel limit drift)", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The fault is a sensor, remote, travel limit or a stretched chain rather than the motor's own drive.",
      "The opener still lifts the door smoothly once the springs are re-tensioned — the drive itself is healthy.",
      "You only need a remote coded, a wall button paired or the travel limits reset.",
      "A repair at {{price:motor-repair}} restores a chain- or belt-drive unit with years of life left.",
    ],
    replaceWhen: [
      "It's an older chain-drive LM60K or LM1000K and the gears or logic board have genuinely failed.",
      "The motor has been repaired before and a second major fault has appeared within a couple of years.",
      "You want WiFi app control or a quieter belt drive that the original unit doesn't offer.",
      "A new motor at {{price:motor-replace}} costs little more than the repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "LiftMaster work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis and the common parts, and a full replacement at {{price:motor-replace}} includes the new motor, rail, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, remote, chain, limit) or the drive board itself",
    "Chain-drive versus belt-drive — and whether the LM60 or heavier-duty LM1000 was fitted",
    "Extras like WiFi control, a battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "Is \"LiftMaster\" the same company as Chamberlain or Liftmaster Electronics in Australia?",
      answer:
        "Not exactly. LiftMaster Professional is the chain- and belt-drive sectional opener range this page covers — LM60 and LM1000 series units fitted to Perth homes. In Australia it's imported and distributed by Liftmaster Electronics Pty Ltd, an independent company (established 1969) that also separately designs its own Magic Button controls and gate motors under its own name. We service and repair the LiftMaster Professional openers themselves, independent of either company.",
    },
    {
      question: "What are common problems with LiftMaster garage door openers?",
      answer:
        "The faults we see most in Perth are a chain that's stretched or jumped its sprocket, a remote that's stopped pairing, safety sensors knocked out of alignment so the door reverses, and travel limits that drift so the door stops short of the floor. A motor that's straining or labouring rather than lifting smoothly usually points to an unbalanced door putting extra load on the drive.",
    },
    {
      question: "Does LiftMaster still make garage door openers?",
      answer:
        "Yes — the LiftMaster Professional range of chain- and belt-drive sectional openers is still current, and it's the range Australian distributors including Liftmaster Electronics continue to import. We repair, service and replace these units regardless of when yours was fitted, who supplied it, or which Perth suburb it's in.",
    },
    {
      question: "Can I buy a LiftMaster garage door opener and install it myself?",
      answer:
        "It's possible to source an LM-series unit through a supplier, but we'd check it's correctly rated for your door's weight before fitting it, since an undersized motor wears out fast. Most customers find it simpler to have us supply and install in one visit — the price then includes the rail, remotes, programming and a workmanship warranty a self-fit doesn't come with.",
    },
    {
      question: "Can you supply spare parts for an older LiftMaster opener?",
      answer:
        "In most cases, yes. We can generally source remotes, gears and common wear parts for the LM60 and LM1000 ranges even on older units, rather than leaving you to hunt online. Call with whatever's printed on the motor's head unit and we'll confirm what's available before booking a visit.",
    },
    {
      question: "How much does it cost to replace a LiftMaster garage door opener in Perth?",
      answer:
        "A like-for-like replacement with a new belt-drive motor is {{price:motor-replace}} supplied and installed, covering the motor and rail, remotes, safety sensors, programming and removal of the old unit. If your existing LM-series opener can be repaired instead, that's typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
    {
      question: "What is the life expectancy of a LiftMaster garage door opener?",
      answer:
        "Ten to fifteen years is typical for an LM-series opener in Perth if the door is serviced and kept balanced. A motor left to drag an unbalanced or unserviced door wears its chain or belt and gears far sooner, which is why every repair starts with checking the door itself, not just the motor.",
    },
  ],
  relatedBrands: ["merlin", "chamberlain", "b-and-d", "boss"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Duncraig", "Kingsley", "Padbury", "Stirling", "Osborne Park", "Malaga", "Canning Vale", "Willetton"],
  cta: {
    heading: "LiftMaster Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the LM-series label and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
