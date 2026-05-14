/**
 * RootLayout component serves as the main layout for the application.
 * It configures global styling, theme, sidebar visibility, and session management.
 *
 * The session is generated conditionally: in development mode, it uses a mock session;
 * in production, it retrieves the session from the authentication endpoint using getServerSession.
 *
 * Comentário genérico.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Nested components that will be rendered inside the layout.
 * @returns {JSX.Element} The HTML structure of the application's root layout.
 */
import { Outfit } from "next/font/google";
import "./globals.css";

import Providers from "@/app/providers";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import MuiThemeProvider from "@/context/MuiThemeProvider";
import TanstackProvider from "@/core/providers/tanstack-provider";

import { SidebarProvider } from "@/core/contexts/SidebarContext";
import { ThemeProvider } from "@/core/theme/ThemeContext";

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <TanstackProvider>
          <Providers session={session}>
            <Toaster position="top-center" richColors />
            <MuiThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </MuiThemeProvider>
          </Providers>
        </TanstackProvider>
      </body>
    </html>
  );
}
