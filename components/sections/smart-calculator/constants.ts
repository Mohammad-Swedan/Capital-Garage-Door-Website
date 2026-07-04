import {
  Wrench,
  Home,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Unplug,
  Cable,
  RadioTower,
  PanelTopOpen,
  DoorClosed,
  DoorOpen,
  Layers,
  Maximize,
  RotateCcw,
  Hammer,
  Settings,
  Lock,
  Wind,
  ScanEye,
  Building2,
  Truck,
  Wifi,
  CalendarCheck,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { NOT_SURE_ID, type ServiceType } from "./estimate-logic";
import { getScenariosByService } from "./pricing-data";

/**
 * Static option definitions for the calculator inputs. The service list is fixed; the per-service issue
 * lists are DERIVED from the single pricing source of truth (`pricing-data.ts`) so options and prices
 * never drift — each issue's `value` is the scenario `id` the estimate engine looks up.
 */

export interface ServiceOption {
  value: ServiceType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface ChoiceOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  { value: "repair", label: "Repair", description: "Something's broken or not working", icon: Wrench },
  { value: "installation", label: "New door", description: "Supply & install a new door", icon: Home },
  { value: "opener", label: "Motor / opener", description: "Automate or replace the opener", icon: Cpu },
  { value: "maintenance", label: "Service", description: "Tune-up & safety inspection", icon: ShieldCheck },
];

/** Lucide icon names (stored as strings in pricing-data) → components. */
const ICON_BY_NAME: Record<string, LucideIcon> = {
  Wrench, Home, Cpu, ShieldCheck, AlertTriangle, Unplug, Cable, RadioTower, PanelTopOpen,
  DoorClosed, DoorOpen, Layers, Maximize, RotateCcw, Hammer, Settings, Lock, Wind, ScanEye,
  Building2, Truck, Wifi, CalendarCheck,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_BY_NAME[name] ?? Wrench;
}

/** Build the issue chips for a service from the price list, plus a trailing "Not sure" fallback. */
function buildIssueOptions(service: ServiceType): ChoiceOption[] {
  const options: ChoiceOption[] = getScenariosByService(service).map((s) => ({
    value: s.id,
    label: s.label,
    icon: resolveIcon(s.icon),
  }));
  options.push({ value: NOT_SURE_ID, label: "Not sure", icon: HelpCircle });
  return options;
}

/** Specific issues per service — derived from `pricing-data.ts`. `value` is the scenario `id`. */
export const ISSUE_OPTIONS: Record<ServiceType, ChoiceOption[]> = {
  repair: buildIssueOptions("repair"),
  installation: buildIssueOptions("installation"),
  opener: buildIssueOptions("opener"),
  maintenance: buildIssueOptions("maintenance"),
};

export const DOOR_TYPE_OPTIONS: ChoiceOption[] = [
  { value: "roller", label: "Roller", icon: DoorClosed },
  { value: "sectional", label: "Sectional", icon: Layers },
  { value: "tilt", label: "Tilt", icon: DoorOpen },
  { value: "notsure", label: "Not sure" },
];

export const DOOR_SIZE_OPTIONS: ChoiceOption[] = [
  { value: "single", label: "Single", icon: DoorClosed },
  { value: "double", label: "Double", icon: DoorOpen },
  { value: "custom", label: "Custom / large", icon: Maximize },
];
