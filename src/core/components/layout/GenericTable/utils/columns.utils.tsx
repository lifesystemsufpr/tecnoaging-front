import { ColumnConfig, KeyOf } from "../types/GenericTable.types";
import { ActionsCell } from "../components/ActionsCell";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";

export function humanizeKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

export function toGridColumns<T>(specs: ColumnConfig<T>[]): GridColDef<T>[] {
  return specs.map((c) => {
    const base: GridColDef<T> = {
      field: c.key as string,
      headerName: c.header ?? humanizeKey(c.key as string),
      width: c.width,
      flex: c.flex ?? (c.width ? undefined : 1),
    };

    if (c.render) {
      base.renderCell = c.render;
    }

    if (c.valueGetter) {
      base.valueGetter = (value, row) => {
        return c.valueGetter!(row as T);
      };
    }

    if (c.valueFormatter) {
      base.valueFormatter = (value, row) => {
        return c.valueFormatter!(value, row as T);
      };
    }

    return base;
  });
}

export function createActionsColumn<T>(opts: {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onTests?: (row: T) => void;
  onQuestionnaires?: (row: T) => void;
}): GridColDef<T> {
  return {
    field: "__actions__",
    headerName: "Ações",
    sortable: false,
    filterable: false,
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <ActionsCell row={params.row} {...opts} />,
  };
}

export const colsFromKeys = <T, K extends KeyOf<T>>(
  keys: readonly K[],
  defaults?: Pick<ColumnConfig<T>, "width" | "flex">
): ColumnConfig<T>[] => keys.map((k) => ({ key: k, ...defaults }));
