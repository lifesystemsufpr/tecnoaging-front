import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

interface Metadata {
  title: string;
}

export const metadata: Metadata = {
  title: "Login | Equilibrium",
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
        <div className="lg:w-1/2 w-full h-full flex items-center justify-center">
          {children}
        </div>
        <div className="lg:w-1/2 w-full h-full bg-brand-950 lg:grid items-center hidden">
          <div className="relative items-center justify-center  flex z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link href="/" className="block mb-4">
                <Image
                  width={331}
                  height={48}
                  src="/images/logo-white.png"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Avaliação funcional inteligente para prevenção de quedas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
