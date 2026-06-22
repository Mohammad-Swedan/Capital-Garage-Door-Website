export const siteConfig = {
  name: "Capital Garage Door",
  shortName: "Capital Garage Door",
  tagline: "Trusted Garage Door Repair & Installation",
  description:
    "Capital Garage Door provides professional garage door repair, installation, and maintenance services. Licensed, insured, and available for same-day service.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.capitalgaragedoor.com",
  ogImage: "/images/og/default.jpg",
  locale: "en_US",

  business: {
    legalName: "Capital Garage Door LLC",
    phone: "+61475333335",
    phoneDisplay: "0475 333 335",
    email: "info@capitalgaragedoor.com",
    address: {
      streetAddress: "123 Main St",
      addressLocality: "Your City",
      addressRegion: "ST",
      postalCode: "00000",
      addressCountry: "US",
    },
    geo: {
      latitude: 0,
      longitude: 0,
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
    google: "",
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
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
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
