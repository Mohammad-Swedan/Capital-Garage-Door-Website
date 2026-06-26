import type {
  ServicePageBadge,
  ServiceProblem,
  ServiceProcessStep,
  ServiceWhyChooseItem,
  ServiceCostRow,
} from "@/types/service-page";
import type { FAQ } from "@/types";

/**
 * Blank-row factories for the in-place repeaters ("+ Add" affordances). One set
 * per template type; ServicePage's are below. Kept as plain factories (not shared
 * object literals) so each "+ Add" yields a fresh object.
 */
export const serviceItemTemplates = {
  badge: (): ServicePageBadge => ({ icon: "ShieldCheck", label: "" }),
  problem: (): ServiceProblem => ({ label: "", icon: "AlertTriangle" }),
  includedItem: (): string => "",
  processStep: (): ServiceProcessStep => ({ title: "", description: "", icon: "Wrench" }),
  costRow: (): ServiceCostRow => ({ label: "", price: "", note: "" }),
  whyChoose: (): ServiceWhyChooseItem => ({ title: "", description: "", icon: "ShieldCheck" }),
  serviceArea: (): string => "",
  paragraph: (): string => "",
  faq: (): FAQ => ({ question: "", answer: "" }),
};
