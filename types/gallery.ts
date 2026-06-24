export type GalleryCategory =
  | "Repairs"
  | "Installations"
  | "Motors"
  | "Roller Doors"
  | "Commercial"
  | "Before & After";

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  title: string;
  service: string;
  suburb: string;
  category: GalleryCategory;
  description: string;
}
