import { siteConfig } from "@/config/site";
import type { BreadcrumbItem, FAQ, Service, ServiceArea } from "@/types";

/** Builds the site-wide LocalBusiness JSON-LD schema (NAP, hours, geo). */
export function localBusinessSchema() {
  const { business } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    legalName: business.legalName,
    url: siteConfig.url,
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange,
    image: new URL(siteConfig.ogImage, siteConfig.url).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: business.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.opens,
        closes: h.closes,
      })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      telephone: siteConfig.business.phone,
    },
    areaServed: siteConfig.business.address.addressRegion,
  };
}

export function serviceAreaSchema(area: ServiceArea) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `${siteConfig.name} - ${area.city}, ${area.stateAbbr}`,
    areaServed: {
      "@type": "City",
      name: area.city,
    },
    telephone: siteConfig.business.phone,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.url, siteConfig.url).toString(),
    })),
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
