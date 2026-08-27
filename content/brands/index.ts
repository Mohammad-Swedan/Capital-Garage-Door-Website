import type { BrandPage } from "@/types/brand";
import { merlinGarageDoorMotorsPerth } from "@/content/brands/motors/merlin";
import { chamberlainGarageDoorMotorsPerth } from "@/content/brands/motors/chamberlain";
import { bAndDGarageDoorMotorsPerth } from "@/content/brands/motors/b-and-d";
import { gliderolGarageDoorMotorsPerth } from "@/content/brands/motors/gliderol";
import { steelLineGarageDoorMotorsPerth } from "@/content/brands/motors/steel-line";
import { bossGarageDoorMotorsPerth } from "@/content/brands/motors/boss";
import { steelLineGarageDoorsPerth } from "@/content/brands/doors/steel-line";
import { bAndDGarageDoorsPerth } from "@/content/brands/doors/b-and-d";
import { gliderolGarageDoorsPerth } from "@/content/brands/doors/gliderol";
import { centurionGarageDoorsPerth } from "@/content/brands/doors/centurion";
import { danmarGarageDoorsPerth } from "@/content/brands/doors/danmar";
import { taureanGarageDoorsPerth } from "@/content/brands/doors/taurean";

/**
 * Registry of brand pages. Add a file under content/brands/motors or content/brands/doors and
 * push it here to ship a new brand page — no routing or component changes required.
 * Slugs must be unique across ALL flat page types (app/[slug] resolves brands first).
 */
export const brandPages: BrandPage[] = [
  merlinGarageDoorMotorsPerth,
  chamberlainGarageDoorMotorsPerth,
  bAndDGarageDoorMotorsPerth,
  gliderolGarageDoorMotorsPerth,
  steelLineGarageDoorMotorsPerth,
  bossGarageDoorMotorsPerth,
  steelLineGarageDoorsPerth,
  bAndDGarageDoorsPerth,
  gliderolGarageDoorsPerth,
  centurionGarageDoorsPerth,
  danmarGarageDoorsPerth,
  taureanGarageDoorsPerth,
];
