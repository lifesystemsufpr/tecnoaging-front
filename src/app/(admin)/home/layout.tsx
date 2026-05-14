import React from "react";
import MainLayout from "@/layout/main/MainLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function InstitutioinLayout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
