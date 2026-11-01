import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-off-track-repair-perth — doors that have jumped, bent or come out of their tracks.
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - Search Console (AU, 90 days): "garage door track replacement perth" 73 impressions @ 18.7
 *    landing on the HOME page, "garage door off track repair cost" 18 @ 7.5 on the hub; Keyword
 *    Planner "garage door track repair" 10/mo. The symptom page /problems/garage-door-off-track
 *    exists ("Crawled – currently not indexed" on 2026-11-01) but it is a diagnosis page, not a
 *    service page: this one is the booking page it hands over to, and they cross-link.
 *  - CRM: off-track and jammed doors are a steady job type (Gosnells roller door off track,
 *    Secret Harbour sectional off track, Padbury roller door tracks) — all photo-backed case
 *    studies for "Recent work".
 *
 * No literal price in the prose: the live CMS page pins "Door off track / stuck", "Cable
 * snapped or off the drum" and "Hinges & rollers / wheels"; the costGuidance rows below are the
 * CMS_SERVICE_PAGES=off fallback and mirror pricing-data.ts.
 */
export const garageDoorOffTrackRepairPerth: ServicePage = {
  serviceName: "Garage Door Off Track Repair Perth",
  slug: "garage-door-off-track-repair-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Off Track Repair Perth",
    subtitle:
      "Sectional doors that have jumped the track and roller doors that have come out of their guides put back, re-balanced and tested the same day, with bent tracks, rollers and brackets replaced on the spot.",
    badges: [
      { icon: "Move", label: "Back on Track Same-Day" },
      { icon: "AlertTriangle", label: "Don't Force the Door" },
      { icon: "ShieldCheck", label: "Tracks & Rollers Checked" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-cable-track-repair-perth.webp",
    imageAlt: "Sectional garage door in Perth with its track and hardware being repaired after the door came off its track",
    floatingCardLabel: "Fixed in One Visit",
  },

  directAnswer:
    "Capital Garage Doors puts garage doors back on track across Perth. A sectional door jumps its track when a roller breaks, a cable slackens or the door is hit by a car; a roller door comes out of its guides when the curtain is forced, a spring fails or the guides spread. We release the door safely, straighten or replace bent track sections, fit new rollers, hinges, brackets or cables as needed, re-seat the door and re-balance it, then check the opener's limits. Most off-track doors are back in service in a single same-day visit, with the price agreed first.",

  intro: {
    heading: "Why Doors Come Off Their Tracks, and Why Forcing Them Makes It Worse",
    paragraphs: [
      "A sectional door runs on rollers inside two vertical tracks and two horizontal tracks overhead. If one roller stem shears, a cable loses tension on one side, or a bumper nudges the bottom panel, the door twists and the rollers on one side pop out of the track. The door then hangs on the other side, often part-way up, and will not move in either direction. Roller doors fail differently: the curtain is held in two side guides, and a broken spring, a forced lift or guides that have spread lets the curtain walk out of one guide and jam.",
      "The one thing not to do is run the opener again or lever the door by hand. An off-track door is still under spring tension, and forcing it either tears the remaining rollers out, kinks the track so it has to be replaced rather than straightened, or drops the door. We release the tension first, lift the panels back into line, and only then refit the rollers, so the repair is a straightening and re-seating job rather than a new track and a new panel.",
      "Because the roller, cable or spring that caused it is still there, we replace that part on the same visit: a worn nylon roller is swapped for a new one, a frayed cable is replaced as a pair, a bent bracket is renewed, and a sagging horizontal track is re-hung. The door is then balanced by hand before the opener's force and travel limits are reset, which is what stops it jumping the track again next month. The real jobs in the recent work below show what that looks like on a Gosnells roller door, a Secret Harbour sectional door and a Padbury roller door with worn tracks.",
    ],
  },

  problems: [
    { label: "Sectional door hanging crooked, rollers out", icon: "Move" },
    { label: "Roller door curtain out of its guide", icon: "DoorOpen" },
    { label: "Door jammed part-way after a car bump", icon: "TrafficCone" },
    { label: "Bent or sagging track section", icon: "AlertTriangle" },
    { label: "Broken roller or sheared roller stem", icon: "Settings" },
    { label: "Opener strains or stops on an off-track door", icon: "Cpu" },
  ],

  includedItems: [
    "Door released from tension and lifted safely back into line",
    "Rollers re-seated; broken rollers and sheared stems replaced",
    "Bent track straightened or the damaged section replaced",
    "Roller door curtain re-fed into the guides, guides re-set",
    "Cables, drums, brackets and springs checked for the cause",
    "Door balanced by hand, then opener limits and force reset",
    "Same-day call-outs across Perth, after-hours for stuck doors",
    "A fixed quote agreed before any work starts",
  ],

  processSteps: [
    {
      title: "Stop using the door",
      description:
        "Leave the opener off and the door where it is; send us a photo so we bring the right rollers, track and brackets.",
      icon: "PauseCircle",
    },
    {
      title: "Release the tension",
      description:
        "A door hanging on one side is loaded unevenly. We take the spring load off before anyone touches the panels.",
      icon: "ShieldCheck",
    },
    {
      title: "Re-seat the door",
      description:
        "Panels are lifted back into line and the rollers refitted into straightened or replaced track.",
      icon: "Move",
    },
    {
      title: "Replace the cause",
      description:
        "The broken roller, slack cable, bent bracket or failed spring that let the door jump is replaced on the spot.",
      icon: "Wrench",
    },
    {
      title: "Balance and test",
      description:
        "The door is cycled by hand, then under power, with the opener's limits and safety reverse reset.",
      icon: "BadgeCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list. An off-track door is priced as one job to re-seat and balance it; the part that caused it is quoted on the spot once we see the door. As a guide:",
    rows: [
      {
        label: "Door off track / stuck (re-seat & balance)",
        price: "$440–$770",
        note: "Door released, re-seated, tracks straightened, balanced and tested",
      },
      {
        label: "Lift cables replaced (pair)",
        price: "$280–$550",
        note: "If a slack or snapped cable let the door jump",
      },
      {
        label: "Hinges & rollers / wheels",
        price: "$30 each + $140 call-out",
        note: "One call-out fee plus each roller or hinge replaced",
      },
    ],
  },

  whyChoose: [
    {
      title: "Safe release first",
      description: "An off-track door is under spring load; we take the tension off before re-seating it, so nothing drops.",
      icon: "ShieldCheck",
    },
    {
      title: "Straighten, don't replace",
      description: "Caught early, a bent track is straightened and the panels saved; that is why we ask you not to force it.",
      icon: "Wrench",
    },
    {
      title: "Cause fixed on the day",
      description: "The roller, cable, bracket or spring that let the door jump is on the van and replaced in the same visit.",
      icon: "Search",
    },
    {
      title: "Sectional and roller doors",
      description: "Rollers out of the track or a curtain out of its guides, we handle both every week across Perth.",
      icon: "DoorOpen",
    },
    {
      title: "Same-day, after-hours if stuck",
      description: "A door jammed open or with the car trapped is booked as a priority, with the after-hours cost stated up front.",
      icon: "Clock3",
    },
    {
      title: "Price agreed first",
      description: "The re-seat is a listed price; any part needed is quoted before we start.",
      icon: "FileText",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Off Track? Causes & Safe Checks",
      href: "/problems/garage-door-off-track",
      description: "How to tell what let the door jump, and what is safe to check yourself.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Cable Repair Perth",
      href: "/garage-door-cable-repair-perth",
      description: "A slack or snapped cable is the most common reason a sectional door comes off its track.",
      icon: "Cable",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Curtains out of their guides, springs, locks and motors on roller doors.",
      icon: "Settings",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every repair on our price list, off-track doors included.",
      icon: "FileText",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Door stuck open or the car trapped? After-hours call-outs across Perth.",
      icon: "Siren",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
  ],

  serviceAreas: [
    "Gosnells",
    "Padbury",
    "Rockingham",
    "Baldivis",
    "Joondalup",
    "Canning Vale",
    "Midland",
    "Cockburn Central",
    "Fremantle",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Marty P.",
      rating: 5,
      text:
        "Sam and crew responded very quickly on the same day to fix my broken garage door panel. The door works even better now. Highly recommend them — will be booking them for the regular service from now on.",
      service: "Same-Day Repair",
    },
    {
      name: "Duane S.",
      rating: 5,
      text:
        "Good efficient work. One of the springs on my garage door snapped in half. Service was fast and efficient — both springs were replaced within an hour. Highly recommend for garage door troubles.",
      service: "Spring Repair",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to fix a garage door that is off its track in Perth?",
      answer:
        "The off-track row in the guide-price table on this page is our listed price to release the door, re-seat it, straighten the track and balance and test it, with attendance included. Where it lands in that range depends on how far the door has twisted and whether a track section has to be replaced rather than straightened. The part that caused it, usually a roller, a cable or a spring, is quoted on the spot before it is fitted.",
    },
    {
      question: "Can I put my garage door back on track myself?",
      answer:
        "We advise against it on a sectional door. The springs are still loaded while the door hangs crooked, and lifting the panels to refit the rollers without releasing that tension is how fingers get caught and doors get dropped. It also tends to kink the track, turning a straightening job into a replacement. Leave the door where it is, keep the opener off, and have a technician release the tension and re-seat it; it is usually under an hour's work.",
    },
    {
      question: "Why did my garage door come off its track?",
      answer:
        "On a sectional door, almost always one of four things: a nylon roller has split or its stem has sheared, a lift cable has slackened or snapped on one side, the bottom panel was nudged by a car, or a horizontal track has sagged because its hanger worked loose. On a roller door, the curtain walks out of its guide when a spring breaks, the door is forced up by hand, or the guides have spread. We find which it was and fix it, because re-seating the door without fixing the cause means it jumps again.",
    },
    {
      question: "Do you replace bent garage door tracks?",
      answer:
        "Yes. A track that is dented or bowed can often be straightened in place; one that is kinked or torn at the fixings is replaced with a new section matched to the door's profile. We carry common vertical and horizontal track sections and the brackets and hangers that go with them, so a track replacement is normally done on the same visit as the re-seat. Roller door guides that have spread or rusted through are re-set or replaced the same way.",
    },
    {
      question: "My door came off track after I reversed into it. Can it be repaired?",
      answer:
        "Usually, yes, if the panels are not creased. A car bump typically pushes the bottom panel out of the track and bends the bottom bracket or a roller; we straighten the track, replace the bracket and rollers, and re-seat the door. If a panel is creased or the bottom rail is folded, that section is replaced rather than the whole door, which our panel replacement page covers. Either way, do not run the opener until the door has been checked.",
    },
    {
      question: "Is an off-track door an emergency?",
      answer:
        "If the door is stuck open and the house is exposed, or stuck down with a car trapped inside, yes, and we attend it as a priority. A door hanging crooked in the tracks is also unsafe to leave because the loaded side can let go. After-hours call-outs on nights, weekends and public holidays carry the surcharge in the guide-price table, and we confirm the total on the phone before we drive out.",
    },
  ],

  cta: {
    heading: "Door Hanging Crooked or Jammed in the Tracks?",
    subtitle:
      "Leave it where it is and send a photo. We will bring rollers, track and brackets for a same-day re-seat anywhere in Perth.",
  },

  seo: {
    title: "Garage Door Off Track Repair Perth | Same-Day Fix",
    description:
      "Garage door off its track or roller door out of its guides? Released, re-seated, tracks straightened and balanced the same day across Perth. Fixed quote first.",
  },
};
