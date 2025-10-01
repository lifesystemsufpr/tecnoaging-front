import { PaletteOptions } from "@mui/material/styles";

export const paletteDark: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#60A5FA",
    dark: "#3B82F6",
    light: "#93C5FD",
    contrastText: "#0B1220",
  },
  background: { default: "#0B1220", paper: "#0F172A" }, // “clínico” em navy escuro
  text: { primary: "#E5E7EB", secondary: "#9CA3AF" },
  divider: "rgba(255,255,255,0.12)",
  grey: {
    50: "#111827",
    100: "#1F2937",
    200: "#374151",
    300: "#4B5563",
    700: "#9CA3AF",
  },
};
