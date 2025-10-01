// src/providers/MuiThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, PaletteMode } from "@mui/material";
import { createAppTheme } from "@/theme";

type ModeSetting = PaletteMode | "system";
const STORAGE_KEY = "app-color-scheme";

type Ctx = {
  modeSetting: ModeSetting;
  resolvedMode: PaletteMode;
  setModeSetting: (m: ModeSetting) => void;
  toggle: () => void;
};

const ThemeModeContext = createContext<Ctx | null>(null);

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modeSetting, setModeSetting] = useState<ModeSetting>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as ModeSetting) || "system";
  });

  // acompanha o modo do sistema
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedMode: PaletteMode =
    modeSetting === "system" ? (systemDark ? "light" : "light") : modeSetting;

  // persiste escolha e ajusta color-scheme do documento
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, modeSetting);
      document.documentElement.style.colorScheme = resolvedMode;
    }
  }, [modeSetting, resolvedMode]);

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  const ctx = useMemo<Ctx>(
    () => ({
      modeSetting,
      resolvedMode,
      setModeSetting,
      toggle: () => setModeSetting((m) => (m === "dark" ? "light" : "dark")),
    }),
    [modeSetting, resolvedMode]
  );

  return (
    <ThemeModeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx)
    throw new Error("useThemeMode deve ser usado dentro de <MuiThemeProvider>");
  return ctx;
}
