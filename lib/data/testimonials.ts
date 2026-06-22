import { testimonials } from "@/content/testimonials";
import type { Testimonial } from "@/types";

/**
 * Data-access layer for testimonials. Reads from local content now; swap
 * the implementation for an API/DB call later without changing call sites.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}
