import { Award, Clock3, ShieldCheck, Tag, type LucideIcon } from "lucide-react";

// Shared by the server section (card badges) and the client island (active-step
// numeral/icon). Every step uses the same brand navy — red is reserved for CTAs.
export const STEP_ICONS: LucideIcon[] = [ShieldCheck, Clock3, Tag, Award];
export const NAVY = "#1b3b8c";
export const TINT = "#e8effa";
