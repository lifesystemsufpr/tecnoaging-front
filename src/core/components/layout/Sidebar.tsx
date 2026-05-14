"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "lucide-react";
import { useMenuItems } from "@/core/hooks/useMenuItems";
import { useSidebar } from "@/core/contexts/SidebarContext";
import Link from "next/link";

export default function SideBar() {
  const session = useSession();
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
    openSubmenu,
    toggleSubmenu,
  } = useSidebar();
  const pathname = usePathname();

  const { filteredNavItems } = useMenuItems({
    profile: session?.data?.user?.role || "researcher",
  });

  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleMenuItemClick = () => {
    if (isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  useEffect(() => {
    const activeItem = filteredNavItems.find((nav) =>
      nav.subItems?.some((subItem) => subItem.path === pathname)
    );

    if (activeItem) {
      toggleSubmenu(activeItem.name);
    }
  }, [pathname, toggleSubmenu, filteredNavItems]);

  const renderMenuItems = (items: typeof filteredNavItems) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav) => {
        const isSubmenuOpen = openSubmenu === nav.name;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => toggleSubmenu(nav.name)}
                className={`menu-item group w-full flex items-center transition-all duration-200 ${
                  isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
                } ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}`}
              >
                <span
                  className={`flex items-center justify-center transition-colors ${
                    isSubmenuOpen
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="menu-item-text ml-3">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  onClick={handleMenuItemClick}
                  className={`menu-item group w-full flex items-center transition-all duration-200 ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}`}
                >
                  <span
                    className={`flex items-center justify-center transition-colors ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="menu-item-text ml-3">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* ANIMAÇÃO CLEAN COM CSS GRID */}
            {nav.subItems && !isCollapsed && (
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isSubmenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="mt-1 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          onClick={handleMenuItemClick}
                          className={`menu-dropdown-item block py-2 ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                            {(subItem as any).icon && (
                              //eslint-disable-next-line @typescript-eslint/no-explicit-any
                              <span>{(subItem as any).icon}</span>
                            )}
                            <span className="text-sm">{subItem.name}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-16 left-0 flex flex-col bg-blue-600 dark:bg-gray-900 text-white h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-50 border-r border-blue-700
      ${isExpanded || isHovered || isMobileOpen ? "w-72 px-5" : "w-16 px-2"}
      ${isMobileOpen ? "translate-x-0" : "max-lg:-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col overflow-y-auto no-scrollbar pb-6">
        <nav className="mb-6 mt-10">{renderMenuItems(filteredNavItems)}</nav>
      </div>
    </aside>
  );
}
