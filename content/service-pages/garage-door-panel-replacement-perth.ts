import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-panel-replacement-perth — dented / damaged panel replacement.
 *
 * Built from the 2026-08 Semrush pull: "garage door panels" is 590/mo at KD 14
 * and "garage door panel replacement" 170/6 — edenroc wins both with a thin
 * parts page, and our only coverage was a legacy blog URL ranking ~37 for
 * "garage door panel replacement cost" (110/6). Prices mirror pricing-data.ts
 * ("Door damaged (panel / section)": $550–$1,100); the CMS page pins the
 * matching catalog rows.
 */
export const garageDoorPanelReplacementPerth: ServicePage = {
  serviceName: "Garage Door Panel Replacement Perth",
  slug: "garage-door-panel-replacement-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Panel Replacement Perth",
    subtitle:
      "Dented, buckled or rusted garage door panels replaced across Perth — colour-matched to your door, without paying for a whole new door.",
    badges: [
      { icon: "Layers", label: "Single Panels Replaced" },
      { icon: "Palette", label: "Colour & Profile Matching" },
      { icon: "CircleDollarSign", label: "Cheaper Than a New Door" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/buckled-garage-door-panel-replacement-perth.webp",
    imageAlt: "Buckled garage door panel being replaced on a sectional door in Perth",
    floatingCardLabel: "Free Photo Assessment",
  },

  directAnswer:
    "Capital Garage Doors replaces damaged garage door panels across Perth — typically $550–$1,100 per panel supplied and fitted, depending on the door's profile, colour and panel availability. Because sectional doors are built from individual hinged panels, one dented or buckled section can usually be swapped without replacing the door, as long as the profile is still made and the frame is straight. Send us a photo of the damage and the door and we'll tell you honestly whether a panel swap, a repair, or (rarely) a new door is the right answer.",

  intro: {
    heading: "One Bad Panel Doesn't Mean a New Door",
    paragraphs: [
      "The most common panel damage we see in Perth is the slow reverse into the door — a moment's lapse that leaves a car-bumper crease across the bottom section. The good news: a sectional garage door is a stack of independent panels, and in most cases the damaged one can be unbolted and replaced on its own, restoring the door's look and strength for a fraction of a full replacement.",
      "The critical question is availability. Panels must match the door's profile (the pressed pattern), gauge and colour, and manufacturers retire profiles over time. As authorised dealers for B&D, Steel-Line, Gliderol and Avanti we can order genuine panels while they're still made — which is also why it pays to fix a damaged panel sooner rather than years later, when the profile may be discontinued.",
      "We also straighten what doesn't need replacing. Minor dents that don't crease the steel can often be repaired, hinges and struts bent in the same knock are replaced on the spot, and we always check the tracks, rollers and opener force settings afterwards — a door that's been hit is often a door that's been knocked out of alignment too.",
    ],
  },

  problems: [
    { label: "Reversed into the door — bottom panel creased", icon: "Car" },
    { label: "Panel buckled by wind or a jammed opener", icon: "Wind" },
    { label: "Rust eating the bottom section", icon: "Droplets" },
    { label: "Dents from balls, bikes or trailers", icon: "AlertTriangle" },
    { label: "Panel delaminating or skin peeling", icon: "Layers" },
    { label: "Door creaks and binds after an impact", icon: "Volume2" },
  ],

  includedItems: [
    "Photo assessment before you book — honest repair-vs-replace advice",
    "Genuine panels matched to profile, gauge and colour",
    "Single or multiple panel replacement",
    "Hinges, struts and rollers replaced where the impact bent them",
    "Track alignment and opener force check after the swap",
    "Minor dent repairs where replacement isn't needed",
    "Rust treatment advice for coastal doors",
    "Full-door replacement quote if the door is beyond saving",
  ],

  processSteps: [
    {
      title: "Send photos",
      description: "The damage, the whole door and any brand sticker — enough to identify the profile.",
      icon: "Camera",
    },
    {
      title: "We source the panel",
      description: "Profile, gauge and colour confirmed with the manufacturer, with the lead time in your quote.",
      icon: "PackageCheck",
    },
    {
      title: "Swap the section",
      description: "Damaged panel unbolted, new panel fitted, hinges and struts renewed as needed.",
      icon: "Wrench",
    },
    {
      title: "Realign and test",
      description: "Tracks, rollers, balance and opener force checked so the repaired door runs true.",
      icon: "Settings",
    },
    {
      title: "Colour check",
      description: "New steel against weathered paint — we set expectations honestly before we order.",
      icon: "Palette",
    },
  ],

  // Mirrors pricing-data.ts — the live page pins the same catalog rows.
  costGuidance: {
    intro:
      "Typical Perth ranges from our own price list — the exact figure depends on the panel's size, profile and how many sections were hit:",
    rows: [
      {
        label: "Panel / section replacement",
        price: "$550–$1,100",
        note: "Per panel, supplied and fitted, colour-matched",
      },
      {
        label: "Hinges & rollers",
        price: "$30 each",
        note: "Plus one $140 attendance — often bent in the same impact",
      },
      {
        label: "Door off track / stuck",
        price: "$440–$770",
        note: "If the impact pushed the door out of its tracks",
      },
      {
        label: "New sectional door (supply & install)",
        price: "$3,000–$5,000",
        note: "When damage or a retired profile makes replacement smarter",
      },
    ],
  },

  whyChoose: [
    {
      title: "Honest repair-vs-replace",
      description: "If a panel swap saves the door, that's what we quote — a new door only when it's genuinely smarter.",
      icon: "Scale",
    },
    {
      title: "Genuine matched panels",
      description: "Authorised B&D, Steel-Line, Gliderol and Avanti dealer — profile and colour matched from the maker.",
      icon: "BadgeCheck",
    },
    {
      title: "Impact damage checked fully",
      description: "Hinges, struts, tracks and opener settings inspected — not just the visible dent.",
      icon: "Search",
    },
    {
      title: "Insurance-friendly",
      description: "Itemised quotes and photos suitable for insurance claims after vehicle or storm damage.",
      icon: "FileText",
    },
    {
      title: "Fast assessment",
      description: "Photo quotes within a business day — no waiting for a site visit to learn the ballpark.",
      icon: "Clock",
    },
    {
      title: "All of Perth",
      description: "Metro-wide, from Joondalup to Mandurah.",
      icon: "MapPin",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, tracks and motors — the full repair service.",
      icon: "Hammer",
    },
    {
      name: "Sectional Garage Doors Perth",
      href: "/sectional-garage-doors-perth",
      description: "If the door is beyond saving — new sectional doors, supplied and installed.",
      icon: "Layers",
    },
    {
      name: "Garage Door Repair Costs Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every common repair priced from our real price list.",
      icon: "CircleDollarSign",
    },
    {
      name: "Garage Doors Perth",
      href: "/garage-doors-perth",
      description: "Compare door styles and prices if you're weighing up a full replacement.",
      icon: "Home",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "Annual tune-ups that catch loose hinges and wear before they cost panels.",
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
    "Fremantle",
    "Cockburn Central",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google review (content/reviews.ts) — the CMS page pins the same review.
  reviews: [
    {
      name: "Marty P.",
      rating: 5,
      text: "Sam and crew responded very quickly on the same day to fix my broken garage door panel. The door works even better now. Highly recommend them — will be booking them for the regular service from now on.",
      service: "Panel Repairs",
    },
  ],

  faqs: [
    {
      question: "How much does garage door panel replacement cost in Perth?",
      answer:
        "A single panel is typically $550–$1,100 supplied and fitted. The range depends on the panel's width and profile, whether it's a plain or insulated section, and colour availability. Hinges and rollers bent in the same impact are $30 each on the same attendance. If several panels are damaged, we'll price the swap against a new door honestly — at three or more panels on an older door, replacement often wins.",
    },
    {
      question: "Can you replace just one panel of a sectional garage door?",
      answer:
        "Yes — that's the whole advantage of a sectional door. Each panel is an independent section joined by hinges, so a single damaged one can be unbolted and swapped, provided the profile is still manufactured and the door's frame and tracks are straight. We confirm both from your photos before ordering anything.",
    },
    {
      question: "Will a new panel match my door's colour?",
      answer:
        "The panel is ordered in your door's original colour, but paint weathers — on an older door in full sun, a brand-new section can read slightly brighter than its neighbours until it weathers in. We tell you upfront how noticeable it's likely to be on your door and colour; on most doors under ten years old the match is excellent.",
    },
    {
      question: "I backed into my garage door — what should I do first?",
      answer:
        "Stop using the door, including the opener — running a bent panel through the tracks bends hinges and can pull the door off its rollers, turning one damaged section into three. Unplug or lock off the opener, take photos of the damage and the full door, and send them through. If the car is trapped inside, tell us — freeing it without worsening the damage is something we do regularly.",
    },
    {
      question: "Is panel damage covered by insurance?",
      answer:
        "Vehicle impacts and storm damage often are, under home or car policies — that's between you and your insurer, but we help by providing an itemised quote and photos in the format assessors ask for. Plenty of our panel jobs are insurance claims, so the paperwork side is routine for us.",
    },
    {
      question: "The bottom of my door is rusting — panel or new door?",
      answer:
        "It depends how far it's travelled. Rust that's only attacked the bottom panel — common near the coast where salt spray sits on the lowest section — is a straightforward one-panel swap, ideally with a new bottom weather seal to slow the recurrence. Rust showing on multiple panels or around the ends of the door usually means the whole skin is going, and a new door is the honest recommendation.",
    },
  ],

  cta: {
    heading: "Dented Door? Start With a Photo",
    subtitle:
      "Send a photo of the damage and we'll tell you the same day whether it's a repair, a panel swap or time for a new door — with the price upfront.",
  },

  seo: {
    title: "Garage Door Panel Replacement Perth | Colour-Matched",
    description:
      "Dented or rusted garage door panels replaced across Perth — genuine colour-matched sections fitted, hinges checked. Free photo assessment & quote.",
  },
};
