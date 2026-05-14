import { navItems } from "@/components/sidebar/NavItems";
import { SystemRoles } from "../enums";

interface UseMenuItemsProps {
  profile: SystemRoles;
}

export function useMenuItems({ profile }: UseMenuItemsProps) {
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(SystemRoles[profile])
  );

  return { filteredNavItems };
}
