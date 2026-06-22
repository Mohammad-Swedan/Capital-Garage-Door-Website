import {
  Wrench,
  DoorOpen,
  Settings,
  Cpu,
  Siren,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Maps the `icon` string stored on content entries to a Lucide component. */
export const iconMap: Record<string, LucideIcon> = {
  Wrench,
  DoorOpen,
  Settings,
  Cpu,
  Siren,
  ShieldCheck,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Wrench;
}
