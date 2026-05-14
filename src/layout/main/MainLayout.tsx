"use client";

import React from "react";
import Backdrop from "../Backdrop";

import Header from "@/core/components/layout/Header";
import SideBar from "@/core/components/layout/Sidebar";
import { useSidebar } from "@/core/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <Backdrop />
      <SideBar />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <Header />
        <div className="p-2 mx-auto md:p-6">{children}</div>
      </div>
    </div>
  );
}
