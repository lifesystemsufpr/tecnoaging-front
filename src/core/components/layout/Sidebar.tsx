"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "lucide-react";
import { useMenuItems } from "@/core/hooks/useMenuItems";
import { useSidebar } from "@/core/contexts/SidebarContext";

export default function SideBar() {
  const session = useSession();
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const { filteredNavItems } = useMenuItems({
    profile: session?.data?.user?.role || "researcher",
  });

  // Helper para identificar se a sidebar está recolhida (modo ícone)
  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  const handleMenuItemClick = () => {
    if (isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => {
                handleMenuItemClick();
                handleSubmenuToggle(index, menuType);
              }}
              className={`menu-item group w-full flex items-center transition-all duration-200 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${isCollapsed ? "justify-center px-0" : "justify-start px-4"}`}
            >
              <span
                className={`flex items-center justify-center transition-colors ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
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
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180"
                        : ""
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
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  isCollapsed ? "justify-center px-0" : "justify-start px-4"
                }`}
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

          {/* Submenu só renderiza se NÃO estiver colapsado */}
          {nav.subItems && !isCollapsed && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={handleMenuItemClick}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{subItem.icon}</span>
                        <span className="text-sm">{subItem.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive, filteredNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed top-16 left-0 flex flex-col bg-blue-600 dark:bg-gray-900 text-white h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-50 border-r border-blue-700
      ${isExpanded || isHovered || isMobileOpen ? "w-72.5 px-5" : "w-16 px-2"}
      ${isMobileOpen ? "translate-x-0" : "max-lg:-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6 mt-10">
          {renderMenuItems(filteredNavItems, "main")}
        </nav>
      </div>
    </aside>
  );
}
