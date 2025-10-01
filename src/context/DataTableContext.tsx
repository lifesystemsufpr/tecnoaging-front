"use client";

import {
  ColumnDef,
  RowData,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import React, { useContext, createContext } from "react";

export type SortDir = "asc" | "desc";

interface DataTableContextValue<TData extends RowData> {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  total: number;

  // Controle externo
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  sortBy?: string;
  sortDir?: SortDir;
  onSortChange?: (id?: string, dir?: SortDir) => void;

  onSearch?: (term: string) => void;

  // UI
  loading: boolean;
  maxVisiblePages: number;

  // Derivados
  totalPages: number;
  startCount: number;
  endCount: number;
}

export const DataTableContext =
  createContext<DataTableContextValue<any> | null>(null);

export function useDataTableCtx<TData extends RowData>() {
  const ctx = useContext(
    DataTableContext
  ) as DataTableContextValue<TData> | null;
  if (!ctx)
    throw new Error(
      "DataTable: useDataTableCtx deve ser usado dentro de <DataTable.Root>."
    );
  return ctx;
}
