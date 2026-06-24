export interface Review {
  id: string;
  customerName: string;
  /** 1-5 */
  rating: number;
  text: string;
  suburb: string;
  service: string;
  /** e.g. "Google", "Facebook", "Website" */
  source: string;
  /** ISO date */
  date: string;
  /** Surfaced in the "Featured Reviews" section. */
  featured?: boolean;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  /** "View all reviews on Google" */
  googleProfileUrl: string;
  /** "Leave a Review" deep link */
  googleWriteReviewUrl: string;
}

export const REVIEW_SERVICE_OPTIONS = [
  "Repairs",
  "Installations",
  "Motor Replacement",
  "Emergency Repairs",
  "Servicing",
] as const;

export const REVIEW_SUBURB_OPTIONS = [
  "Joondalup",
  "Canning Vale",
  "Fremantle",
  "Scarborough",
  "Midland",
  "Rockingham",
] as const;
