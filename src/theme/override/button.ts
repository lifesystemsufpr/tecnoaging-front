import { Components, Theme, alpha } from "@mui/material/styles";

export const muiButtonOverrides = (
  theme: Theme
): Components<Theme>["MuiButton"] => ({
  defaultProps: {
    disableElevation: true, // sombra custom, controlada abaixo
    // variant: 'contained', color: 'primary', // (opcional) tornar contained o padrão
  },
  styleOverrides: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition:
        "background-color .2s ease, box-shadow .2s ease, border-color .2s ease, color .2s ease",
      "&.Mui-disabled": {
        opacity: 0.5,
        cursor: "not-allowed",
        boxShadow: "none",
      },
      "&.Mui-focusVisible": {
        outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
        outlineOffset: 2,
      },
    },

    sizeSmall: {
      padding: "12px 16px",
      fontSize: "0.875rem",
      lineHeight: 1.25,
    },
    sizeMedium: {
      padding: "14px 20px",
      fontSize: "0.875rem",
      lineHeight: 1.25,
    },

    startIcon: { marginLeft: 0, marginRight: 0 },
    endIcon: { marginLeft: 0, marginRight: 0 },

    // === contained (primary) — azul
    containedPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.10)",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
        boxShadow:
          "0 2px 4px rgba(16,24,40,0.06), 0 2px 6px rgba(16,24,40,0.12)",
      },
      "&.Mui-disabled": {
        backgroundColor: "#93C5FD", // azul 300
        color: theme.palette.primary.contrastText,
      },
    },

    // === outlined — branco + borda cinza
    outlined: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.grey[700] ?? "#374151",
      borderColor: theme.palette.grey[300] ?? "#D1D5DB",
      "&:hover": {
        backgroundColor: theme.palette.grey[50] ?? "#F9FAFB",
        borderColor: theme.palette.grey[300] ?? "#D1D5DB",
      },
    },
  },
});
