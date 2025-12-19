import { ColumnDef, Row } from "@tanstack/react-table";
import React from "react";

export interface ColumnConfig<TData> {
  accessorKey: keyof TData & string;
  title: string;
  enableSorting?: boolean;
  size?: string;
  cell?: ({ row }: { row: Row<TData> }) => React.ReactNode;
}

export function generateColumns<TData>(
  columnConfigs: ColumnConfig<TData>[]
): ColumnDef<TData>[] {
  return columnConfigs.map((config) => ({
    accessorKey: config.accessorKey,
    header: config.title,
    enableSorting: config.enableSorting ?? false,
    size: config.size ? parseInt(config.size.replace("px", ""), 10) : undefined,
    cell: config.cell,
  }));
}
