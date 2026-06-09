"use client";

import Image from "next/image";
import Link from "next/link";

import { Menu, X } from "lucide-react";

import { Box, Button } from "../ui";
import { useSidebar } from "@/core/contexts/SidebarContext";
import UserDropdown from "@/core/components/shared/profile/UserDropdown";

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
    <header className="sticky top-0 z-50 flex h-19 w-full items-center bg-white shadow-sm dark:border-b dark:border-gray-900 dark:bg-[#2d4d7d]">
      <Box
        display="flex"
        justify="space-between"
        className="mx-auto w-full max-w-screen-2xl flex items-center"
      >
        <Box display="flex" align="center" gap="4">
          {isMobile && (
            <Button
              variant="ghost"
              className="text-black transition-colors hover:bg-gray-50"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
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
        </Box>

        <Box display="flex" align="center" className="text-white">
          <UserDropdown />
        </Box>
      </Box>
    </header>
  );
};

export default Header;
