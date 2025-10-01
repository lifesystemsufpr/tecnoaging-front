import "@mui/x-data-grid/themeAugmentation";
import { createTheme, PaletteMode } from "@mui/material";
import { shape } from "./shape";
import { typography } from "./typography";
import { components } from "./override";
import { paletteDark } from "./palette.dark";
import { paletteLight } from "./palette.light";

export function createAppTheme(mode: PaletteMode) {
  const palette = mode === "dark" ? paletteDark : paletteLight;

  // 1) tokens base
  let theme = createTheme({
    palette,
    shape,
    typography,
  });

  // 2) overrides que dependem do theme (Button, DataGrid, etc.)
  theme = createTheme(theme, {
    components: components(theme),
  });

  return theme;
}
