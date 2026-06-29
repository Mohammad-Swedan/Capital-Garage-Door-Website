export const siteConfig = {
  name: "Capital Garage Door",
  shortName: "Capital Garage Door",
  tagline: "Trusted Garage Door Repair & Installation",
  description:
    "Capital Garage Door provides professional garage door repair, installation, and maintenance services. Licensed, insured, and available for same-day service.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://capitalgaragedoors.com.au",
  ogImage: "/images/og/default.jpg",
  locale: "en_AU",

  business: {
    legalName: "Capital Garage Door LLC",
    phone: "+61475333335",
    phoneDisplay: "0475 333 335",
    email: "info@capitalgaragedoors.com.au",
    address: {
      streetAddress: "6 Carnegie Parade", // confirm exact street number/name matches the Google Business Profile
      addressLocality: "Southern River",
      addressRegion: "WA",
      postalCode: "6110",
      addressCountry: "AU",
    },
    geo: {
      // Exact pin from the Capital Garage Doors Google Business listing (Southern River, WA 6110).
      latitude: -32.1285079,
      longitude: 115.9323079,
    },
    priceRange: "$$",
    hours: [
      { day: "Monday", opens: "08:00", closes: "18:00" },
      { day: "Tuesday", opens: "08:00", closes: "18:00" },
      { day: "Wednesday", opens: "08:00", closes: "18:00" },
      { day: "Thursday", opens: "08:00", closes: "18:00" },
      { day: "Friday", opens: "08:00", closes: "18:00" },
      { day: "Saturday", opens: "09:00", closes: "15:00" },
      { day: "Sunday", opens: "", closes: "" },
    ],
  },

  social: {
    facebook: "",
    instagram: "",
    google: "https://g.page/r/CRXCwS1W-cvEEAE",
    yelp: "",
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Price Calculator", href: "/calculator" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footerNav: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "Warranty", href: "/warranty" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Garage Door Repairs", href: "/garage-door-repairs-perth" },
        { label: "Garage Door Installation", href: "/garage-door-installation-perth" },
        { label: "Opener Repair", href: "/garage-door-opener-repair-perth" },
        { label: "Spring Repair", href: "/garage-door-spring-repair-perth" },
        { label: "Emergency Repairs", href: "/emergency-garage-door-repairs-perth" },
        { label: "Maintenance", href: "/garage-door-maintenance-perth" },
        { label: "All Services", href: "/services" },
        { label: "Service Areas", href: "/service-areas" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
