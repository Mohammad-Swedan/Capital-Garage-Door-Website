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
  Building2,
  AlertTriangle,
  MoveVertical,
  Power,
  Radio,
  Unplug,
  Wifi,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon resolver scoped to the page-template section components (Service+Suburb
 * and brand pages). Kept local (rather than extending the shared lib/icons map)
 * so these templates carry their own icon set and stay self-contained as the
 * icon library evolves elsewhere.
 *
 * Unknown names silently fall back to `Wrench`, so every icon a content file
 * references MUST be imported and listed here or it renders as a spanner.
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
  Building2,
  // Brand pages (content/brands/**): opener faults, smart control, commercial.
  AlertTriangle,
  MoveVertical,
  Power,
  Radio,
  Unplug,
  Wifi,
};

export function resolvePageIcon(name: string): LucideIcon {
  return localIconMap[name] ?? Wrench;
}
