export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  faqs?: FAQ[];
}

export interface ServiceArea {
  slug: string;
  city: string;
  state: string;
  stateAbbr: string;
  zipCodes?: string[];
  description: string;
  lat?: number;
  lng?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
  date: string;
  service?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}
