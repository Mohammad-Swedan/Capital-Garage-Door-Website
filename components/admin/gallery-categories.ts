/**
 * Gallery category options (the GalleryCategory enum values). Kept in a plain (non-"use client")
 * module so both the server-component grid and the client form can import the actual array — a
 * value imported from a "use client" module into a server component becomes a client reference.
 */
export const GALLERY_CATEGORIES: { value: string; label: string }[] = [
  { value: "Repairs", label: "Repairs" },
  { value: "Installations", label: "Installations" },
  { value: "Motors", label: "Motors" },
  { value: "RollerDoors", label: "Roller doors" },
  { value: "Commercial", label: "Commercial" },
  { value: "BeforeAfter", label: "Before & after" },
];
