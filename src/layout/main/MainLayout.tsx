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
  const { isMobile } = useSidebar();

  const mobileStyle = isMobile ? "w-full" : "w-[calc(100%-104px)] ml-20";

  return (
    <div className="min-h-screen xl:flex flex-col">
      <Backdrop />
      <Header />
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <SideBar />
        <div className={`${mobileStyle} p-2 mx-auto md:p-6`}>{children}</div>
      </div>
    </div>
  );
}
