import type { BrandHub } from "@/types/brand";

export const BRAND_HUBS: Record<"door" | "motor", BrandHub> = {
  door: {
    kind: "door",
    slug: "garage-door-brands-perth",
    name: "Garage Door Brands Perth",
    shortName: "Door Brands",
    seo: {
      title: "Garage Door Brands Perth | Every Brand Serviced & Installed",
      description:
        "Every garage door brand in Perth — Steel-Line, B&D, Gliderol, Centurion, Danmar & more. Find your brand, see what we repair, service and install, and get a same-day quote.",
    },
    hero: {
      h1: "Garage Door Brands in Perth — Every Brand We Service, Repair & Install",
      subtitle:
        "Roller, sectional or tilt, new build or 1980s original: find the brand on your door and see exactly what our Perth technicians can do for it.",
    },
    intro: [
      "The \"brand\" on a garage door usually means whoever manufactured the curtain or panels — Steel-Line, B&D, Gliderol, Centurion, Danmar and dozens of others all make their own profiles, colours and hardware, and it's rarely the same company as whoever installed the door or supplied the opener bolted to the ceiling. Knowing which one you have matters because panels, springs, cables, tracks and remotes are rarely interchangeable between brands, and ordering the wrong part means a mismatched repair or a second call-out.",
      "That's exactly why we ask for the brand before quoting any repair — it tells us which panels and hardware to bring, and whether a match is a same-day job or needs ordering in. We service and repair every brand on this page, whoever installed your door or sold you the opener, and we'll give you a straightforward opinion on repair versus replacement either way. If you're not sure what's on your garage, find your brand below or send us a photo and we'll identify it.",
    ],
    faqs: [
      {
        question: "What is the best garage door brand in Australia?",
        answer:
          "There's no single best brand — it depends on your budget, door style and what's common in your area. Steel-Line, B&D and Gliderol are the three largest Australian manufacturers and all make solid residential ranges, while WA-made brands like Centurion and Danmar are strong local alternatives. We service every major brand and can give you an honest opinion on the specific door in your garage rather than a generic ranking.",
      },
      {
        question: "Gliderol or B&D — which is better?",
        answer:
          "Both are well-established Australian manufacturers with long track records, and in our experience neither is clearly better — they're comparable on build quality, and the right pick usually comes down to price, the colours and profiles available, and what your builder or installer already stocks. We repair and service both brands equally and don't have a financial reason to steer you toward one over the other.",
      },
      {
        question: "Are B&D garage doors good?",
        answer:
          "Yes — B&D is Australia's best-known garage door manufacturer for good reason, with a long-standing Roll-A-Door and Panelift range backed by a 10-year warranty. We see plenty of B&D doors across Perth and they generally hold up well, provided they're serviced and the springs are kept in balance. Like any brand, an unserviced B&D door will eventually need repair — that's normal wear, not a defect.",
      },
      {
        question: "What are the typical prices for a new garage door in Perth?",
        answer:
          "A new standard garage door supplied and installed in Perth is from {{price:new-standard}}, covering the door, hardware, removal of the old one and a workmanship warranty. Larger double doors, insulated panels and premium finishes like timber or aluminium cost more. The brand you choose changes the range and colour options available but has less effect on price than size and insulation — we quote the exact figure on-site.",
      },
      {
        question: "Do you service brands you don't sell?",
        answer:
          "Yes, for almost every brand. Capital Garage Doors is an authorised dealer for a handful of brands and supplies new doors and motors under those, but we repair, service and replace doors and openers from every major manufacturer regardless of who installed it or sold it to you. If a part needs to be genuine to the brand, we'll source it rather than fit an incorrect substitute.",
      },
      {
        question: "Can you match panels for an older door brand?",
        answer:
          "Usually, yes. Even on a door that's 15–20 years old, most manufacturers keep compatible profiles in production or hold older stock, and we carry a wide range of panels and hardware on our vans for the brands we see most often in Perth. If an exact match genuinely isn't available, we'll say so upfront and talk through the closest option rather than guessing and hoping it blends in.",
      },
      {
        question: "How do I find out what brand my garage door is?",
        answer:
          "Check the top rail or side track for a manufacturer's label or sticker, which most Australian brands fit somewhere on the door or the motor. If there's no visible label, a photo of the panel profile and the hardware is usually enough for us to identify it over the phone or from the quote form. Either way, we can confirm the brand on-site before any work starts.",
      },
    ],
  },
  motor: {
    kind: "motor",
    slug: "garage-door-motor-brands-perth",
    name: "Garage Door Motor Brands Perth",
    shortName: "Motor Brands",
    seo: {
      title: "Garage Door Motor & Opener Brands Perth | Repairs & Remotes",
      description:
        "Merlin, Chamberlain, B&D, Gliderol, ATA, Boss & every other garage door motor brand in Perth — repaired, re-programmed or replaced same-day. Find your opener brand here.",
    },
    hero: {
      h1: "Garage Door Motor & Opener Brands in Perth",
      subtitle:
        "Whatever is bolted to your garage ceiling, we repair it, code remotes for it, and replace it when it's done — every major opener brand, all of Perth.",
    },
    intro: [
      "The motor brand is almost always printed on a label on the head unit itself — the box mounted to the garage ceiling — and it's often a different company from whoever made the door it's lifting. Merlin, Chamberlain, B&D, Gliderol, ATA and Boss are the ones we see most across Perth, alongside a long tail of smaller and imported brands. Knowing which one you have matters because remotes, logic boards and drive gears are almost never interchangeable between brands, so the wrong part simply won't pair or fit.",
      "That's why every call-out starts with the brand and model on the head unit's label — it tells us which remotes to bring and whether the fault is a common, cheap fix or a sign the unit is nearing the end of its life. We repair and re-program every brand we see, and where a repair no longer makes sense we'll say so on the day rather than after a second visit, with a clear repair-or-replace recommendation and a fixed price before any work starts.",
    ],
    faqs: [
      {
        question: "What are the best brands of garage door openers in Australia?",
        answer:
          "Merlin, Chamberlain and B&D are the most common opener brands across Australian homes and all make reliable belt or chain-drive units with smartphone app control. There's no single \"best\" — the right choice depends on your door type, budget and whether you want app control or battery backup. We install and service every major brand and can recommend one based on your specific door rather than a generic list.",
      },
      {
        question: "How long does a garage door opener last?",
        answer:
          "Ten to fifteen years is typical for a well-maintained opener in Perth, provided the door itself is serviced and balanced — an opener forced to drag an unbalanced or worn door wears its gears and board far sooner than one lifting a properly tensioned door. Heat inside an uninsulated garage also shortens the life of the logic board on some brands. Regular servicing is the single biggest factor in how long a motor lasts.",
      },
      {
        question: "How much does it cost to replace a garage door motor in Perth?",
        answer:
          "A full replacement with a new motor is {{price:motor-replace}} supplied and installed, covering the motor, rail, two remotes, a wall control, safety sensors, programming and removal of the old unit. The exact figure depends on the brand, drive type and any extras like WiFi control or battery backup. If the existing motor can be repaired instead, we'll quote that option too and let you decide.",
      },
      {
        question: "How can I tell if my garage door motor is failing?",
        answer:
          "Common warning signs are the motor humming without lifting the door, a noticeably slower or jerkier travel than before, remotes that need several presses to work, and the unit reversing or stopping partway through its cycle. Any of these on their own can be a straightforward fix, but two or three appearing together usually points to a drive or board that's genuinely wearing out. We diagnose the exact cause on the day.",
      },
      {
        question: "Do you repair opener brands you don't sell?",
        answer:
          "Yes, for almost every brand. We install and are an authorised dealer for a handful of opener brands, but we repair, re-program and service openers from every major manufacturer, whoever supplied or installed the original unit. If a replacement part needs to be brand-specific, we source it rather than fit an incorrect substitute.",
      },
      {
        question: "Can I keep my existing remotes if the motor is replaced?",
        answer:
          "Usually not if you're changing brands — remotes are coded to their specific motor's radio frequency and rolling-code system, so a Merlin remote won't pair with a new Chamberlain unit, for example. If we're replacing like-for-like within the same brand and a compatible model, your existing remotes can sometimes be re-paired. New remotes are included in every replacement price either way, so it's rarely an added cost.",
      },
      {
        question: "Belt drive or chain drive — which is better for Perth?",
        answer:
          "Belt drive is quieter and generally the better pick for a garage under a bedroom or living area, which is common in newer Perth homes, and it needs less lubrication over its life. Chain drive is cheaper and still perfectly durable for a standalone or detached garage where noise isn't a concern. Both last a similar length of time when the door itself is properly serviced and balanced.",
      },
    ],
  },
};
