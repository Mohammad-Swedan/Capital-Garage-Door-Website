import {
  Wrench,
  DoorOpen,
  DoorClosed,
  Settings,
  Cpu,
  Siren,
  ShieldCheck,
  Cable,
  Disc3,
  LayoutPanelTop,
  Volume2,
  TrafficCone,
  BatteryWarning,
  Scale,
  MapPin,
  Zap,
  FileText,
  BadgeCheck,
  LifeBuoy,
  CalendarCheck,
  Bell,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon resolver scoped to the Service+Suburb page module. Kept local (rather
 * than extending the shared lib/icons map) so this template carries its own
 * icon set and stays self-contained as the icon library evolves elsewhere.
 */
const localIconMap: Record<string, LucideIcon> = {
  Wrench,
  DoorOpen,
  DoorClosed,
  Settings,
  Cpu,
  Siren,
  ShieldCheck,
  Cable,
  Disc3,
  LayoutPanelTop,
  Volume2,
  TrafficCone,
  BatteryWarning,
  Scale,
  MapPin,
  Zap,
  FileText,
  BadgeCheck,
  LifeBuoy,
  CalendarCheck,
  Bell,
};

export function resolvePageIcon(name: string): LucideIcon {
  return localIconMap[name] ?? Wrench;
}
