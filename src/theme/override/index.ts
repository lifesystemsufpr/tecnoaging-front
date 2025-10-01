import { Components, Theme } from "@mui/material/styles";
import { muiButtonOverrides } from "./button";
import { muiDataGridOverrides } from "./datagrid";

export const components = (theme: Theme): Components<Theme> => ({
  MuiButton: muiButtonOverrides(theme),
  MuiDataGrid: muiDataGridOverrides(theme),
});
