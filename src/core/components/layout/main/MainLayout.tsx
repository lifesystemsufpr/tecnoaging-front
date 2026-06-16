"use client";

import React from "react";

import Header from "@/core/components/layout/Header";
import SideBar from "@/core/components/layout/Sidebar";
import { useSidebar } from "@/core/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isMobile, isExpanded } = useSidebar();

  const layoutStyle = isMobile
    ? "w-full ml-0"
    : isExpanded
      ? "ml-72 w-[calc(100%-288px)]"
      : "ml-16 w-[calc(100%-64px)]";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex relative">
        <SideBar />
        <div
          className={`flex-1 min-w-0 ${layoutStyle} transition-[margin,width] duration-300 ease-out bg-slate-50`}
        >
          <main className="mx-auto w-full max-w-screen-2xl p-3 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
