import { SystemRoles } from "@/core/enums/index";
import { navItems } from "../components/layout/sidebar/NavItems";

interface UseMenuItemsProps {
  profile: string;
}

export function useMenuItems({ profile }: UseMenuItemsProps) {
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(SystemRoles[profile])
  );

  return { filteredNavItems };
}
