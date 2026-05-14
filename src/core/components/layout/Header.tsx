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
    if (!isMobile) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-gray-200 bg-white dark:border-gray-900 dark:bg-[#2d4d7d]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between sm:pl-15 xs:pl-0">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              className="rounded-lg p-2 text-black transition-colors hover:bg-white/10"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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

        <div className="flex items-center text-white">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
