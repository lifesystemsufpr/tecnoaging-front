import { navItems } from "@/components/sidebar/NavItems";
import { SystemRoles } from "@/types/enums/system-roles";

interface UseMenuItemsProps {
  profile: string;
}

export function useMenuItems({ profile }: UseMenuItemsProps) {
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(SystemRoles[profile])
  );

  return { filteredNavItems };
}
