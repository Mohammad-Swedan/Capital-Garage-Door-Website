/**
 * Media-library taxonomy — the frontend mirror of the backend `AssetCategory` enum
 * (CapitalGarageDoor.Cms.Domain/Catalog/Enums/AssetCategory.cs). `value` is the PascalCase
 * enum name sent over the wire; `label` is the human label shown in the UI.
 *
 * Deliberately broader than the public gallery categories (components/admin/gallery-categories.ts)
 * so every uploaded image — door types, job photos, blog art, logos, team — can be organised.
 */
export interface AssetCategoryOption {
  value: string;
  label: string;
}

export const ASSET_CATEGORIES: AssetCategoryOption[] = [
  { value: "Uncategorized", label: "Uncategorized" },
  { value: "RollerDoors", label: "Roller Doors" },
  { value: "SectionalDoors", label: "Sectional Doors" },
  { value: "CustomDesigner", label: "Custom / Designer" },
  { value: "Motors", label: "Motors & Openers" },
  { value: "Repairs", label: "Repairs" },
  { value: "Installations", label: "Installations" },
  { value: "Commercial", label: "Commercial" },
  { value: "BeforeAfter", label: "Before & After" },
  { value: "Branding", label: "Branding & Logos" },
  { value: "Team", label: "Team" },
  { value: "Blog", label: "Blog & Editorial" },
  { value: "Other", label: "Other" },
];

/** Filter list for the library/picker: "All" + every category. */
export const ASSET_CATEGORY_FILTERS: AssetCategoryOption[] = [
  { value: "", label: "All" },
  ...ASSET_CATEGORIES,
];

const LABELS: Record<string, string> = Object.fromEntries(
  ASSET_CATEGORIES.map((c) => [c.value, c.label]),
);

/** Human label for a category enum value, falling back to the raw value / "Uncategorized". */
export function assetCategoryLabel(value: string | null | undefined): string {
  if (!value) return "Uncategorized";
  return LABELS[value] ?? value;
}
