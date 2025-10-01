import type { Components, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export const muiDataGridOverrides = (
  theme: Theme
): Components["MuiDataGrid"] => ({
  defaultProps: {
    density: "standard",
    // rowHeight: 44,
    // headerHeight: 48,
  },
  styleOverrides: {
    root: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.grey[200]}`,
      borderRadius: theme.shape.borderRadius,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      // @ts-ignore - algumas versões não tipam as CSS vars
      "--DataGrid-rowBorderColor": theme.palette.grey[200],
    },
    columnHeaders: {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      color: theme.palette.text.secondary,
    },
    columnHeader: {
      fontWeight: 600,
      "& .MuiDataGrid-columnSeparator": { display: "none" },
      "&:focus, &:focus-within": { outline: "none" },
    },
    columnHeaderTitle: {
      fontSize: "0.8125rem",
      lineHeight: 1.4,
      letterSpacing: 0.2,
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: alpha(theme.palette.primary.main, 0.015),
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
      },
      "&.Mui-selected": {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
      },
      "&.Mui-selected:hover": {
        backgroundColor: `${alpha(theme.palette.primary.main, 0.16)} !important`,
      },
    },
    cell: {
      borderColor: theme.palette.grey[200],
      padding: "10px 12px",
      "&:focus, &:focus-within": { outline: "none" },
    },
    toolbarContainer: {
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      padding: theme.spacing(1),
      gap: theme.spacing(1),
    },
    footerContainer: {
      backgroundColor: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.grey[200]}`,
    },
    virtualScroller: {
      backgroundColor: theme.palette.background.paper,
    },
  },
});
