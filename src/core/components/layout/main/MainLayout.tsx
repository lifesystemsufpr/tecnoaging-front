"use client";

import React from "react";

import Header from "@/core/components/layout/Header";
import SideBar from "@/core/components/layout/Sidebar";
import { useSidebar } from "@/core/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isMobile } = useSidebar();

  const layoutStyle = isMobile ? "w-full" : "ml-20 w-[calc(100%-80px)]";

  return (
    <div className="min-h-screen xl:flex flex-col">
      <Header />
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <SideBar />
        <div className={`${layoutStyle} transition-all duration-300`}>
          <main className="mx-auto w-full max-w-screen-2xl p-3 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
