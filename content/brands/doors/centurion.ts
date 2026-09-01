import type { BrandPage } from "@/types/brand";

/**
 * /centurion-garage-doors-perth — PAA set (DataForSEO, 2026-08-27) confirms real search confusion
 * with the unrelated Centurion Systems gate-automation brand, so this page states the
 * disambiguation plainly up front. Centurion Garage Doors is a WA manufacturer (Wangara, since
 * 1976) — this is one of the brands we service without a formal supply arrangement. Models are
 * the verified ranges from
 * docs/marketing/brand-research-2026-08/entities/centurion.md.
 */
export const centurionGarageDoorsPerth: BrandPage = {
  brand: "centurion",
  kind: "door",
  slug: "centurion-garage-doors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Centurion Garage Doors Perth | Repairs, Service & Install",
    description:
      "Centurion garage door repairs, genuine panel matching and new-door installs across Perth. WA-made since 1976, same-day service. Call for a fixed quote.",
  },
  hero: {
    h1: "Centurion Garage Doors in Perth — Repairs, Panels & New Door Installs",
    subtitle:
      "WA-made sectional and roller doors kept running by local technicians: panels matched, springs re-tensioned, and an honest call on repair versus a new door.",
    pills: [
      { icon: "Wrench", label: "Same-day Centurion repairs" },
      { icon: "ShieldCheck", label: "Genuine panel matching" },
      { icon: "Building2", label: "WA-made since 1976" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia — WA-founded" },
    { label: "Made in", value: "Wangara, WA factory since 1976" },
    { label: "Known for", value: "TimbaLook, Cosmopolitan Colorbond & Architectural sectional ranges" },
    { label: "Door types", value: "Sectional, roller & commercial" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Centurion garage doors — the WA-made sectional and roller doors built in Wangara since 1976, not the unrelated Centurion Systems gate-motor brand — are repaired, serviced and replaced across Perth by Capital Garage Doors. Damaged panels, worn rollers, broken springs and faulty seals are diagnosed and fixed on the day, most from stock on the van. A full Centurion service to keep the door balanced and running smoothly is {{price:service}}, and when a door is genuinely past repair we supply and fit a new one with the same trusted workmanship.",
  intro: {
    heading: "Centurion Garage Doors — Not to Be Confused With Centurion Systems",
    paragraphs: [
      "When Perth homeowners search for \"Centurion garage doors\" they sometimes land on Centurion Systems, a South African gate-automation brand that has nothing to do with garage doors. The Centurion we cover here is Centurion Garage Doors, a family-owned Australian manufacturer that has built sectional, roller and commercial doors from its Wangara factory since 1976. Fifty years of local manufacturing means genuine panels, rollers and hardware are usually in stock rather than shipped from overseas — a real advantage when a damaged Colorbond panel needs matching, not guessing.",
      "Centurion's TimbaLook, Cosmopolitan Colorbond and Architectural sectional ranges turn up right across Perth, from established suburbs with a decades-old Centurion door still doing its job to newer estates that specified the brand off the display board. The doors hold up well, but Perth's climate still takes a toll: UV bakes seals and weatherstrip brittle within a few summers, sandy driveways wear roller bearings faster than they should, and coastal air corrodes fixings on doors within a few kilometres of the beach. The faults we're called out for most are a stiff or noisy roll, a panel dented by a reversing car, and a spring that's lost its tension.",
      "We repair Centurion doors whenever the door itself is sound — a new spring set, a track re-alignment, replacement hardware or a matched panel usually brings a Centurion door back to full working order for a fraction of what a new door costs. When a door has genuinely reached the end of its life, whether that's rust through the base panel or a track bent one too many times, we say so and quote a straightforward replacement rather than pushing repairs onto a door that won't hold them.",
    ],
  },
  services: [
    {
      title: "Centurion door repairs",
      description:
        "Panels, rollers, tracks and springs diagnosed and fixed on the day, with the common Centurion parts carried on the van so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Centurion panel replacement",
      description:
        "Damaged or faded Colorbond and TimbaLook panels matched and replaced so the repaired section blends with the rest of the door, not a patchwork fix.",
      icon: "ShieldCheck",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Centurion door install",
      description:
        "A new Centurion sectional or roller door supplied and installed when repair no longer makes sense, sized and colour-matched to your home.",
      icon: "Cpu",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual door service",
      description:
        "Rollers, hinges, cables and the door's balance checked and adjusted so the opener isn't doing the springs' job and the door keeps running quietly.",
      icon: "CalendarCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "TimbaLook Premium Series", type: "Sectional door", note: "Timber-look finish, a popular upgrade pick on newer Perth builds." },
    { name: "Cosmopolitan Colorbond Sectional", type: "Sectional door", note: "The standard Colorbond steel sectional range fitted across most of Perth." },
    { name: "Sunshine Series", type: "Sectional door", note: "Translucent panel option that lets extra natural light into the garage." },
    { name: "Architectural Series", type: "Sectional door", note: "Aluminium composite panels for a cleaner, modern street-facing look." },
  ],
  faults: [
    { label: "Door won't open at all", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Won't close fully or reverses", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Stuck part-way up or down", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Broken spring or frayed cable", icon: "Cable", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Door has jumped its tracks", icon: "Unplug", problemSlug: "garage-door-off-track" },
    { label: "Grinding, banging or rattling", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Panels, Springs & Hardware — Or an Honest New-Door Quote",
    paragraphs: [
      "Because Centurion has manufactured in WA since 1976, matching a damaged panel, roller or hinge to an existing door is usually straightforward rather than a guessing game — we carry the common Colorbond and TimbaLook profiles and can order the rest quickly from the Wangara factory. Springs and cables are replaced with correctly rated components for the door's size and weight, not a generic universal kit, so the balance and lifespan match what the door was built for.",
      "A new door is the honest answer when the base panel has rusted through, the frame has been bent in a collision, or repeated repairs are starting to add up to more than a replacement would cost. In those cases we quote a straightforward Centurion replacement or point you to the full range of new doors we supply and install across Perth at /garage-doors-perth — whichever fits your home and budget, with no pressure to over-repair a door that's had its day.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Centurion repairs are priced from the same guide list we use on every Perth garage door: a broken spring is {{price:spring}}, a snapped cable is {{price:cable}}, and a damaged panel or section is quoted once we've seen it, typically from {{price:damaged}}. A full service is {{price:service}}, and a new standard Centurion sectional door installed is from {{price:new-standard}}. You get the number in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (spring, cable, roller) or a full panel replacement",
    "Door size and weight — double doors and insulated panels cost more to match",
    "Colour and panel-profile matching for Colorbond and TimbaLook finishes",
    "Whether tracks and hardware need straightening before the door will run true again",
  ],
  faqs: [
    {
      question: "Are Centurion garage doors any good?",
      answer:
        "Yes — Centurion is a long-standing Australian manufacturer, family-owned and building sectional, roller and commercial doors from its Wangara factory since 1976. In our experience servicing them across Perth, the doors are solidly built and hold up well to the local climate when panels, rollers and hardware are kept in good order. Like any door, they'll eventually need a service or a repair — that's normal wear, not a defect in the brand.",
    },
    {
      question: "What are the most common problems with Centurion garage doors?",
      answer:
        "The faults we see most on Centurion doors in Perth are worn rollers and hinges from sandy driveways, seals and weatherstrip gone brittle after a few Perth summers, springs that have lost tension, and the occasional dented panel from a reversing car. Coastal corrosion on fixings is common within a few kilometres of the beach. Nearly all of these are straightforward repairs rather than reasons to replace the door.",
    },
    {
      question: "How much does it cost to service a garage door in Perth?",
      answer:
        "A full service on a Centurion garage door in Perth is {{price:service}}, covering rollers, hinges, cables, tracks and a balance check so the opener isn't doing the springs' job. Regular servicing is the single biggest factor in how long a Centurion door and its opener last, and it's the first thing we check before diagnosing any other fault.",
    },
    {
      question: "What is the best garage door brand in Australia?",
      answer:
        "There's no single \"best\" brand — it depends on budget, door style and what's common in your area. Centurion is one of the more established Australian manufacturers, with 50 years building sectional and roller doors from its own WA factory, which counts for a lot when it comes to parts availability. We service every major brand in Perth and will always give you an honest opinion on the one on your garage.",
    },
    {
      question: "What does it cost to install a new Centurion garage door in Perth?",
      answer:
        "A new standard Centurion sectional door supplied and installed in Perth starts from {{price:new-standard}}, including the new door, hardware, removal of the old one and a workmanship warranty. The final figure depends on size, insulation and finish — a double door or an Architectural Series panel will cost more than a standard single Colorbond sectional. We quote the exact figure before any work starts.",
    },
    {
      question: "Is Centurion Garage Doors the same company as Centurion Systems gate motors?",
      answer:
        "No — they're unrelated businesses that happen to share a name. Centurion Garage Doors is the WA manufacturer in Wangara that's made sectional, roller and commercial doors since 1976, which is the brand this page covers. Centurion Systems is a separate South African gate-automation company that makes swing and sliding gate motors, not garage doors. If your remote or motor is a Centurion Systems product, it isn't one we stock parts for.",
    },
    {
      question: "Do you service Centurion doors across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Clarkson in the north to Rockingham, Baldivis and Mandurah in the south, with same-day slots on most days. Call with your suburb and a description of the fault and we'll give you an arrival window and a fixed price before we start.",
    },
  ],
  relatedBrands: ["steel-line", "b-and-d", "gliderol", "perth-windsor-doors"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "New garage door installation Perth", href: "/garage-door-installation-perth" },
    { label: "Garage door service cost guide", href: "/garage-door-service-cost-perth" },
  ],
  serviceAreas: ["Joondalup", "Clarkson", "Kingsley", "Duncraig", "Canning Vale", "Success", "Baldivis", "Mandurah"],
  cta: {
    heading: "Centurion Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
