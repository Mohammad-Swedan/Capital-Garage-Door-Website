import type { Article } from "@/types/article";

/**
 * /blog/how-to-open-a-garage-door-manually — help-hub post #3 (2026-08).
 *
 * Targets the manual-release cluster: "how do i/you manually open a garage
 * door" + "how to open garage door manually" — 4 variants at 260/mo each,
 * KD 8–28. High emergency intent → funnels to the emergency repairs page.
 */
export const howToOpenAGarageDoorManually: Article = {
  title: "How to Open a Garage Door Manually (Power Outage or Fault)",
  slug: "how-to-open-a-garage-door-manually",
  category: "Safety",
  excerpt:
    "Car stuck inside during a blackout? Every automatic garage door has a manual release. Where to find it, how to use it safely on sectional and roller doors — and the one situation where you should not pull that cord.",
  author: "Capital Garage Doors Team",
  authorTitle: "Licensed garage door technicians, Perth WA",
  authorBio:
    "Our technicians attend emergency garage door call-outs across Perth around the clock — including plenty of trapped cars that a manual release (used safely) would have freed.",
  publishedAt: "2026-08-05",
  updatedAt: "2026-08-05",
  featuredImage:
    "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/roller-door-repair-midland-perth.webp",
  featuredImageAlt: "Technician working on a garage door during an emergency repair call-out in Perth",
  shortAnswer:
    "Every automatic garage door has a manual release that disconnects the door from the motor. On a sectional door it's the red cord hanging from the opener's rail — pull it down (and slightly back toward the motor) and the door is free to lift by hand. On a roller door, pull the release lever or cord at the motor beside the drum. Lift with your legs, keep fingers out of the panel joints, and lower it fully before letting go. One critical exception: if the door has suddenly become extremely heavy or you heard a loud bang beforehand, a spring has likely broken — do not try to lift it; the door can weigh over 100 kg without its springs.",
  contentBlocks: [
    {
      type: "paragraph",
      text: "A blackout, a failed motor, a flat remote battery — and the car is on the wrong side of the door. Every automatic garage door is designed for exactly this moment: a manual release disconnects the door from the opener so you can move it by hand. Here's how to use it on each door type, how to do it safely, and the one situation where the right answer is to stop and call instead.",
    },
    { type: "heading", level: 2, text: "First: why the door is stuck matters", id: "why-it-matters" },
    {
      type: "paragraph",
      text: "The manual release is safe to use when the door itself is healthy and only the power or the motor has failed. But if the door stopped because a torsion spring snapped — the giveaway is a loud bang from the garage, or a door that suddenly feels enormously heavy — then the springs that carry the door's weight are gone. A double sectional door can weigh well over 100 kg unsprung. Releasing the opener on a broken-spring door and trying to lift it is how backs and fingers get wrecked.",
    },
    {
      type: "callout",
      variant: "safety",
      title: "Heard a bang? Door impossibly heavy?",
      body: "Leave it on the opener, don't pull the release, and call for an [emergency repair](/emergency-garage-door-repairs-perth). A broken spring turns the door into dead weight the release cord was never meant to hand you.",
    },
    { type: "heading", level: 2, text: "Sectional doors: the red cord", id: "sectional-doors" },
    {
      type: "list",
      ordered: true,
      items: [
        "Close the door first if it's partly open and safe to do so — releasing a door mid-travel lets it move freely under its own weight.",
        "Find the red cord hanging from the trolley on the opener's rail (the track running from the motor to the door).",
        "Pull it straight down — on most openers slightly down-and-back toward the motor. You'll feel the trolley disengage.",
        "Lift the door smoothly with both hands on the handle or a panel edge, legs doing the work. A healthy sprung door should feel light — 10–15 kg of effort.",
        "Prop nothing under it: if you must leave it open, slide the lock bar or clamp locking pliers on the track below the bottom roller.",
      ],
    },
    { type: "heading", level: 2, text: "Roller doors", id: "roller-doors" },
    {
      type: "paragraph",
      text: "Roller-door openers mount beside the drum above the opening. Look for a release lever, knob or cord on the motor unit itself and follow its marked direction — most swing or pull to a 'manual' position. The curtain is then free to lift by hand via the bottom rail. Roller doors carry their spring inside the drum, so a healthy one should also lift with modest effort; a curtain that fights you has a spring or guide problem, and forcing it will jam the curtain in the tracks.",
    },
    { type: "heading", level: 2, text: "Locked out with no power point? (opening from outside)", id: "from-outside" },
    {
      type: "paragraph",
      text: "From outside, options are limited by design — that's your security. If the garage has no other entry door, some openers can be fitted with an external key release that pulls the internal cord through a small lock barrel. If you're regularly at risk of this (detached garage, no side door, storm-prone suburb), ask us to fit one; it's a small job that turns a locked-out afternoon into a ten-second fix. What we don't recommend: the coat-hanger-through-the-seal trick popularised online — it's exactly what burglars use, and modern openers ship with release-cord shields to defeat it.",
    },
    { type: "heading", level: 2, text: "Re-engaging the opener afterwards", id: "re-engaging" },
    {
      type: "list",
      ordered: true,
      items: [
        "Close the door fully by hand.",
        "On most sectional openers, pull the cord toward the door (or flip the trolley lever back), then press the wall button — the trolley travels until it clicks back into the carriage.",
        "On roller doors, return the release lever to its drive position, then run a cycle.",
        "Watch one full open-close: if the door now stops short or reverses, the limits need re-setting — our [opener reset guide](/blog/how-to-reset-a-garage-door-opener-and-remote) covers it.",
      ],
    },
    {
      type: "paragraph",
      text: "If the reason you needed the manual release was the motor itself — it hums, clicks or does nothing — that's a repair rather than a reset: [opener repairs](/garage-door-opener-repair-perth) typically run $380–$490 in Perth, and we can usually attend same-day.",
    },
  ],
  expertTips: [
    {
      kind: "safety",
      title: "Test your release once a year",
      body: "Pull the release, lift the door a metre, lower it, re-engage. Two minutes, done with the car outside — and it tells you both that the release works and that the door is properly balanced (light to lift). A door that's heavy on this test has spring wear worth catching early.",
    },
    {
      kind: "technician",
      title: "Don't leave it disengaged",
      body: "A door left on manual release has no opener holding it — wind can lift roller curtains and a bumped sectional door can free-fall. Re-engage as soon as the emergency has passed, or lock the track.",
    },
  ],
  relatedServices: [
    {
      label: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Trapped car, broken spring, door stuck open — 24/7 response.",
      icon: "Siren",
    },
    {
      label: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, tracks and motors — same-day across Perth.",
      icon: "Wrench",
    },
    {
      label: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Motors that hum, click or do nothing, diagnosed and fixed.",
      icon: "Cpu",
    },
  ],
  relatedArticles: [
    {
      slug: "how-to-reset-a-garage-door-opener-and-remote",
      title: "How to Reset a Garage Door Opener & Remote",
    },
    {
      slug: "are-garage-door-springs-dangerous",
      title: "Are Garage Door Springs Dangerous?",
    },
  ],
  faqs: [
    {
      question: "How do you open a garage door manually from the inside?",
      answer:
        "Pull the red release cord hanging from the opener's rail (sectional doors) or move the release lever on the motor beside the drum (roller doors). The door is then disconnected from the motor and lifts by hand — a healthy door should feel light, because its springs carry the weight. Lower it fully before letting go.",
    },
    {
      question: "Can you open a garage door manually from the outside?",
      answer:
        "Only if an external key release has been fitted — a small lock barrel that pulls the internal release cord. Without one, an automatic door with no other entry to the garage can't be opened from outside without damage, which is deliberate security. If being locked out is a realistic risk for your garage, having a key release fitted is a small, worthwhile job.",
    },
    {
      question: "Why is my garage door so heavy to lift manually?",
      answer:
        "It shouldn't be — the springs are supposed to balance the door so it lifts with 10–15 kg of effort. A door that's suddenly very heavy almost certainly has a broken or badly worn spring, and you should stop lifting immediately: an unsprung double door can exceed 100 kg. Spring replacement is a same-day job for a technician with the right winding bars, and never a DIY one.",
    },
    {
      question: "Will the garage door still work after using the manual release?",
      answer:
        "Yes — the release just disconnects the trolley or drive. Re-engage it (pull the cord toward the door, or return the lever, then run the opener until it clicks in) and run one full cycle. If the door then stops short or reverses, the opener's travel limits need a minor re-set at the powerhead.",
    },
  ],
  seo: {
    title: "How to Open a Garage Door Manually | Safe Steps (Perth)",
    description:
      "Power outage or failed motor? Use the manual release safely on sectional & roller doors, re-engage the opener after — and the broken-spring case to avoid.",
  },
};
