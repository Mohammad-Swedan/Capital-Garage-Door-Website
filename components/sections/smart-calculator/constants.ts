import {
  Wrench,
  Home,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Unplug,
  Cable,
  Volume2,
  RadioTower,
  PanelTopOpen,
  DoorClosed,
  DoorOpen,
  Layers,
  Maximize,
  Zap,
  CalendarClock,
  CalendarCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { ServiceType } from "./estimate-logic";

/**
 * Static option definitions for the calculator inputs — extracted so the UI components stay lean and
 * the lists are easy to tune. `value`s feed `CalculatorFormData`; the estimate engine reads the issue
 * `label` text (keyword-matched), so wording can change freely without touching pricing logic.
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

/** Specific issues per service. Icons are optional; pure presentation. */
export const ISSUE_OPTIONS: Record<ServiceType, ChoiceOption[]> = {
  repair: [
    { value: "Door won't open", label: "Won't open", icon: PanelTopOpen },
    { value: "Door stuck halfway", label: "Stuck / off track", icon: AlertTriangle },
    { value: "Broken spring", label: "Broken spring", icon: Unplug },
    { value: "Broken cable", label: "Broken cable", icon: Cable },
    { value: "Motor not working", label: "Motor not working", icon: Cpu },
    { value: "Door is noisy", label: "Noisy door", icon: Volume2 },
    { value: "Remote not working", label: "Remote issue", icon: RadioTower },
    { value: "Not sure", label: "Not sure", icon: Wrench },
  ],
  installation: [
    { value: "New sectional door", label: "Sectional door", icon: Layers },
    { value: "New roller door", label: "Roller door", icon: DoorClosed },
    { value: "Insulated door", label: "Insulated door", icon: ShieldCheck },
    { value: "Need old door removed", label: "Remove old door", icon: Wrench },
    { value: "Not sure", label: "Help me choose", icon: Home },
  ],
  opener: [
    { value: "Replace existing motor", label: "Replace motor", icon: Cpu },
    { value: "New motor installation", label: "New automation", icon: Zap },
    { value: "Smart/WiFi opener", label: "Smart / WiFi", icon: RadioTower },
    { value: "Battery backup", label: "Battery backup", icon: ShieldCheck },
    { value: "Extra remotes", label: "Extra remotes", icon: RadioTower },
  ],
  maintenance: [
    { value: "One door service", label: "One door", icon: DoorClosed },
    { value: "Two doors service", label: "Two doors", icon: DoorOpen },
    { value: "Safety inspection", label: "Safety check", icon: ShieldCheck },
    { value: "Annual service", label: "Annual tune-up", icon: CalendarCheck },
  ],
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

export const URGENCY_OPTIONS: ChoiceOption[] = [
  { value: "today", label: "Today (emergency)", icon: Zap },
  { value: "24h", label: "Within 24 hours", icon: Timer },
  { value: "week", label: "This week", icon: CalendarClock },
  { value: "flexible", label: "I'm flexible", icon: CalendarCheck },
];
