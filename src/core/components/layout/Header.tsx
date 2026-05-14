"use client";

import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/header/UserDropdown";
import { Menu, X } from "lucide-react";

import { useSidebar } from "@/core/contexts/SidebarContext";

const Header = () => {
  const { isMobileOpen, isMobile, toggleSidebar, toggleMobileSidebar } =
    useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white dark:bg-[#2d4d7d] h-16 z-100 items-center border-b border-gray-200 dark:border-gray-900 py-10">
      <div className="flex items-center justify-between w-full px-4 lg:pl-24">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              className="text-black hover:bg-white/10 p-2 rounded-lg transition-colors"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}

          <Link href="/">
            <Image
              width={100}
              height={30}
              src="/images/logo-blue.png"
              alt="Logo IVCF-20"
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center">
          <div className="text-white">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
