import { LucideIcon } from "lucide-react";

export interface TestTypeConfig {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  color: string;
}
